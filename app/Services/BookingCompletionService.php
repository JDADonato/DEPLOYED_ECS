<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\FeedbackRequest;
use App\Models\User;
use App\Notifications\BookingFeedbackRequestNotification;
use App\Notifications\StaffOperationalNotification;
use Illuminate\Support\Facades\DB;

class BookingCompletionService
{
    public function eligibility(Booking $booking): array
    {
        if ($booking->status === 'Confirmed') {
            EventPreparationService::ensureDefaultTasks($booking);
            $booking->unsetRelation('preparationTasks');
        }

        $booking->loadMissing([
            'user',
            'payments' => fn ($query) => $query->active(),
            'refundCases',
            'preparationTasks',
            'feedbackRequest',
        ]);

        $blockers = [];

        if ($booking->status !== 'Confirmed') {
            $blockers[] = [
                'key' => 'status',
                'label' => 'Booking must be confirmed before it can be completed.',
            ];
        }

        if (! $booking->event_date || $booking->event_date->isFuture()) {
            $blockers[] = [
                'key' => 'event_date',
                'label' => 'Event date must be today or in the past.',
            ];
        }

        if (($booking->live_status ?: 'Not Started') !== 'Completed') {
            $blockers[] = [
                'key' => 'live_status',
                'label' => 'Live event status must be marked completed first.',
            ];
        }

        if (! $booking->user_id || ! $booking->user) {
            $blockers[] = [
                'key' => 'customer_account',
                'label' => 'A linked customer account is required before feedback can be requested.',
            ];
        }

        $total = (float) ($booking->total_cost ?? $booking->budget ?? 0);
        $paid = (float) $booking->payments
            ->whereIn('status', ['Paid', 'Verified'])
            ->sum(fn ($payment) => (float) $payment->amount);
        $pendingPayments = $booking->payments
            ->whereNotIn('status', ['Paid', 'Verified', 'Refunded'])
            ->count();

        if ($pendingPayments > 0 || ($total > 0 && $paid < $total)) {
            $blockers[] = [
                'key' => 'payment',
                'label' => 'Payments must be fully paid or verified before completion.',
            ];
        }

        $openRefunds = $booking->refundCases
            ->filter(fn ($case) => ! in_array(strtolower((string) $case->status), ['completed', 'rejected', 'cancelled', 'refunded', 'manual refunded', 'forfeited', 'no refund due'], true))
            ->count();

        if ($openRefunds > 0) {
            $blockers[] = [
                'key' => 'refund',
                'label' => 'Open refund cases must be resolved before completion.',
            ];
        }

        $pendingTasks = $booking->preparationTasks
            ->whereNotIn('status', ['Done', 'Completed', 'done', 'completed'])
            ->count();

        if ($pendingTasks > 0) {
            $blockers[] = [
                'key' => 'preparation',
                'label' => 'All preparation tasks must be completed before closing event service.',
            ];
        }

        return [
            'eligible' => empty($blockers),
            'blockers' => $blockers,
            'summary' => [
                'paid_total' => $paid,
                'event_total' => $total,
                'pending_payments' => $pendingPayments,
                'open_refunds' => $openRefunds,
                'pending_preparation_tasks' => $pendingTasks,
            ],
        ];
    }

    public function complete(Booking $booking, User $actor, bool $override = false, ?string $overrideReason = null): array
    {
        if ($booking->status === 'Completed') {
            $feedbackRequest = EventPreparationService::ensureFeedbackRequest($booking->fresh());
            PostEventLifecycleService::refresh($booking->fresh());

            return [
                'completed' => true,
                'booking' => $booking->fresh(['user', 'assignee', 'reviewTasks', 'preparationTasks', 'historyNotes', 'payments']),
                'feedback_request' => $feedbackRequest,
                'eligible' => true,
                'blockers' => [],
                'summary' => $this->eligibilitySummary($booking->fresh()),
            ];
        }

        $eligibility = $this->eligibility($booking);

        if (! $eligibility['eligible'] && ! $override) {
            return [
                'completed' => false,
                'booking' => $booking,
                'feedback_request' => null,
                ...$eligibility,
            ];
        }

        if ($override && trim((string) $overrideReason) === '') {
            return [
                'completed' => false,
                'booking' => $booking,
                'feedback_request' => null,
                'eligible' => false,
                'blockers' => [[
                    'key' => 'override_reason',
                    'label' => 'Admin override reason is required.',
                ]],
                'summary' => $eligibility['summary'],
            ];
        }

        return DB::transaction(function () use ($booking, $actor, $override, $overrideReason, $eligibility) {
            $booking->forceFill([
                'status' => 'Completed',
                'review_status' => 'Completed',
                'live_status' => $booking->live_status ?: 'Completed',
                'assigned_to' => $booking->assigned_to ?: $actor->id,
                'reviewed_at' => $booking->reviewed_at ?: now(),
            ])->save();

            $feedbackRequest = EventPreparationService::ensureFeedbackRequest($booking->fresh());
            $postEventStatus = PostEventLifecycleService::refresh($booking->fresh());

            ConversionEventService::record($override ? 'event_completed_with_override' : 'event_completed', [
                'booking' => $booking->fresh(),
                'source' => $actor->role === 'Admin' ? 'admin_override' : 'marketing_workspace',
                'metadata' => [
                    'override' => $override,
                    'override_reason' => $overrideReason,
                    'blockers' => $eligibility['blockers'],
                    'post_event_status' => $postEventStatus,
                ],
            ]);

            if ($feedbackRequest && $booking->user) {
                app(NotificationRecipientService::class)
                    ->sendToUser($booking->user, new BookingFeedbackRequestNotification($booking->fresh(), $feedbackRequest), 'booking_feedback_requested');
            }

            app(NotificationRecipientService::class)
                ->sendToRoles(
                    ['Admin', 'Marketing'],
                    new StaffOperationalNotification(
                        'Event completed - feedback requested',
                        'Event completion recorded',
                        "Booking #{$booking->id} was completed and the customer feedback request is now active.",
                        url('/dashboard/marketing?tab=history')
                    ),
                    'event_completed_staff'
                );

            app(OperationalBroadcastService::class)
                ->bookingChanged($booking->fresh(), 'completed', 'Booking completed and feedback requested.');

            return [
                'completed' => true,
                'booking' => $booking->fresh(['user', 'assignee', 'reviewTasks', 'preparationTasks', 'historyNotes', 'payments']),
                'feedback_request' => $feedbackRequest,
                'eligible' => true,
                'blockers' => [],
                'summary' => $eligibility['summary'],
            ];
        });
    }

    private function eligibilitySummary(Booking $booking): array
    {
        $booking->loadMissing(['payments' => fn ($query) => $query->active(), 'refundCases', 'preparationTasks']);

        return [
            'paid_total' => (float) $booking->payments->whereIn('status', ['Paid', 'Verified'])->sum(fn ($payment) => (float) $payment->amount),
            'event_total' => (float) ($booking->total_cost ?? $booking->budget ?? 0),
            'pending_payments' => $booking->payments->whereNotIn('status', ['Paid', 'Verified', 'Refunded'])->count(),
            'open_refunds' => $booking->refundCases
                ->filter(fn ($case) => ! in_array(strtolower((string) $case->status), ['completed', 'rejected', 'cancelled', 'refunded', 'manual refunded', 'forfeited', 'no refund due'], true))
                ->count(),
            'pending_preparation_tasks' => $booking->preparationTasks
                ->whereNotIn('status', ['Done', 'Completed', 'done', 'completed'])
                ->count(),
        ];
    }
}
