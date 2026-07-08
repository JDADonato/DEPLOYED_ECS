<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Support\Collection;

class BookingJourneyService
{
    private const SETTLED_PAYMENT_STATUSES = ['Paid', 'Verified', 'paid', 'verified'];

    public function summarize(Booking $booking): array
    {
        $payments = $booking->relationLoaded('payments') ? $booking->payments : collect();
        $steps = collect($this->steps($booking, $payments));
        $actionable = $steps->reject(fn ($step) => $step['not_required'] ?? false);
        $completed = $actionable->filter(fn ($step) => $step['done']);
        $remaining = $actionable->reject(fn ($step) => $step['done'])->values();
        $nextStep = $remaining->first();

        return [
            'steps' => $steps->values()->all(),
            'completed' => $completed->count(),
            'remaining' => $remaining->count(),
            'total' => $actionable->count(),
            'percent' => $actionable->count() > 0 ? (int) round(($completed->count() / $actionable->count()) * 100) : 100,
            'next_action' => $this->nextAction($booking, $nextStep),
        ];
    }

    private function steps(Booking $booking, Collection $payments): array
    {
        $total = (float) ($booking->total_cost ?? $booking->budget ?? 0);
        $paid = $payments
            ->filter(fn ($payment) => in_array((string) $payment->status, self::SETTLED_PAYMENT_STATUSES, true))
            ->sum(fn ($payment) => (float) $payment->amount);

        $isApproved = in_array($booking->status, ['Confirmed', 'Completed'], true)
            || in_array($booking->review_status, ['Approved For Reservation', 'Completed'], true);
        $hasReservation = $payments->contains(fn ($payment) => $payment->payment_type === 'Reservation' && in_array((string) $payment->status, self::SETTLED_PAYMENT_STATUSES, true))
            || ($total > 0 && ($paid / $total) >= 0.1);
        $paymentsDone = $payments->isNotEmpty()
            && $payments->every(fn ($payment) => in_array((string) $payment->status, [...self::SETTLED_PAYMENT_STATUSES, 'Refunded'], true));
        $needsClarification = filled($booking->clarification_request) && blank($booking->clarification_response);
        $hasSelectedMenu = $this->hasSelectedMenu($booking->selected_menu);
        $eventDetailsDone = filled($booking->venue_address_line)
            && filled($booking->event_time)
            && (filled($booking->event_timeline) || filled($booking->special_instructions) || filled($booking->color_motif));
        $liveStarted = in_array($booking->live_status, ['On the Way', 'Preparing', 'Serving', 'Completed'], true)
            || $booking->status === 'Completed';

        return array_values(array_filter([
            $needsClarification ? [
                'key' => 'clarification',
                'label' => 'Staff request',
                'done' => false,
                'owner' => 'Customer',
                'action' => 'Remind customer to answer the requested details.',
                'tone' => 'danger',
            ] : null,
            [
                'key' => 'approval',
                'label' => 'Booking approval',
                'done' => $isApproved,
                'owner' => 'Marketing',
                'action' => 'Review and approve this booking if the date and details are workable.',
                'tone' => $isApproved ? 'good' : 'warn',
            ],
            [
                'key' => 'reservation',
                'label' => 'Reservation payment',
                'done' => $hasReservation,
                'owner' => 'Customer',
                'action' => $isApproved ? 'Remind customer to complete the reservation payment.' : 'This unlocks after approval.',
                'locked' => ! $isApproved,
                'tone' => $hasReservation ? 'good' : 'warn',
            ],
            [
                'key' => 'menu',
                'label' => 'Menu selection',
                'done' => $hasSelectedMenu,
                'owner' => 'Customer',
                'action' => 'Ask customer to complete or confirm menu selections.',
                'tone' => $hasSelectedMenu ? 'good' : 'warn',
            ],
            [
                'key' => 'event_details',
                'label' => 'Event details',
                'done' => $eventDetailsDone,
                'owner' => 'Customer',
                'action' => 'Ask customer to confirm venue, time, timeline, motif, or setup notes.',
                'tone' => $eventDetailsDone ? 'good' : 'warn',
            ],
            [
                'key' => 'balance',
                'label' => 'Payment balance',
                'done' => $paymentsDone,
                'owner' => 'Customer',
                'action' => 'Wait for or remind customer about the remaining payment balance.',
                'locked' => ! $isApproved,
                'tone' => $paymentsDone ? 'good' : 'warn',
            ],
            [
                'key' => 'live_status',
                'label' => 'Live service status',
                'done' => $liveStarted,
                'owner' => 'Marketing',
                'action' => $isApproved ? 'Update live event status as service progresses.' : 'Live status unlocks after approval.',
                'locked' => ! $isApproved,
                'tone' => $liveStarted ? 'good' : 'muted',
            ],
        ]));
    }

    private function nextAction(Booking $booking, ?array $step): array
    {
        if (! $step) {
            return [
                'key' => 'ready',
                'priority' => 'info',
                'label' => 'Customer file is caught up',
                'description' => 'No customer-facing steps need action right now.',
                'owner' => 'Marketing',
                'action' => 'Monitor messages, calendar, and event-day status.',
            ];
        }

        $priority = match ($step['key']) {
            'clarification' => 'urgent',
            'approval' => 'action',
            'reservation', 'balance' => 'followup',
            default => 'action',
        };

        return [
            'key' => $step['key'],
            'priority' => $priority,
            'label' => $step['label'],
            'description' => $step['action'],
            'owner' => $step['owner'],
            'action' => $step['action'],
        ];
    }

    private function hasSelectedMenu(mixed $selectedMenu): bool
    {
        if (blank($selectedMenu)) {
            return false;
        }

        if (is_string($selectedMenu)) {
            $decoded = json_decode($selectedMenu, true);
            $selectedMenu = json_last_error() === JSON_ERROR_NONE ? $decoded : $selectedMenu;
        }

        if (! is_array($selectedMenu)) {
            return filled($selectedMenu);
        }

        foreach ($selectedMenu as $items) {
            if (is_array($items) && count(array_filter($items)) > 0) {
                return true;
            }
            if (! is_array($items) && filled($items)) {
                return true;
            }
        }

        return false;
    }
}
