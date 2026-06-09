<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\FoodTasting;
use App\Models\Payment;
use App\Services\BookingManagementService;
use App\Services\PaymentCalculationService;
use App\Support\ResourceVersion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

/**
 * Ported from: server/controllers/clientDashboardController.js
 * Client dashboard — aggregates bookings, tastings, and payments for the logged-in user.
 */
class ClientDashboardController extends Controller
{
    /**
     * JSON API endpoint — returns dashboard data for the original ClientDashboard.jsx
     * which fetches via fetch('/api/dashboard/client').
     */
    public function apiData(Request $request, PaymentCalculationService $paymentService, BookingManagementService $bookingService)
    {
        $userId = Auth::id();

        $allBookings = Booking::where('user_id', $userId)
            ->select([
                'id',
                'user_id',
                'event_date',
                'event_time',
                'reservation_time',
                'serving_time',
                'pax',
                'budget',
                'package_id',
                'event_type',
                'event_name',
                'client_full_name',
                'client_email',
                'client_phone',
                'venue_address_line',
                'venue_building_details',
                'event_timeline',
                'color_motif',
                'theme_uploads',
                'special_instructions',
                'selected_menu',
                'transport_fee',
                'labor_surcharge',
                'total_cost',
                'status',
                'live_status',
                'review_status',
                'clarification_request',
                'clarification_response',
                'hidden_from_customer_history_at',
                'created_at',
                'updated_at',
            ])
            ->with([
                'payments' => fn ($query) => $query
                    ->select([
                        'id',
                        'booking_id',
                        'amount',
                        'payment_method',
                        'status',
                        'payment_type',
                        'due_date',
                        'verified_by',
                        'verified_at',
                        'paymongo_checkout_session_id',
                        'paymongo_payment_id',
                        'paymongo_reference_number',
                        'voided_at',
                        'void_reason',
                        'superseded_by_payment_id',
                        'updated_at',
                    ])
                    ->active(),
                'package:id,name,type,package_category,base_price_per_head,minimum_pax,description,menu_structure',
            ])
            ->orderBy('event_date', 'desc')
            ->get();

        $allBookings->each(fn ($booking) => $paymentService->syncPendingTranches($booking));
        $allBookings->load([
            'payments' => fn ($query) => $query
                ->select([
                    'id',
                    'booking_id',
                    'amount',
                    'payment_method',
                    'status',
                    'payment_type',
                    'due_date',
                    'verified_by',
                    'verified_at',
                    'paymongo_checkout_session_id',
                    'paymongo_payment_id',
                    'paymongo_reference_number',
                    'voided_at',
                    'void_reason',
                    'superseded_by_payment_id',
                    'updated_at',
                ])
                ->active(),
            'package:id,name,type,package_category,base_price_per_head,minimum_pax,description,menu_structure',
        ]);

        $bookingIdsForVersion = $allBookings->pluck('id');
        $bookingIdValuesForVersion = $bookingIdsForVersion->all();
        $paymentVersionCounter = collect($bookingIdValuesForVersion)
            ->sum(fn ($bookingId) => (int) Cache::get("customer.dashboard.payment_version.booking.{$bookingId}", 0));
        $visiblePaymentQuery = fn ($query) => $query
            ->whereNull('voided_at')
            ->orWhereIn('status', ['Paid', 'Verified', 'Refunded']);

        $paymentVersionSignature = Payment::query()
            ->where($visiblePaymentQuery)
            ->whereIn('booking_id', $bookingIdValuesForVersion)
            ->orderBy('id')
            ->get(['id', 'booking_id', 'amount', 'status', 'payment_type', 'due_date', 'updated_at'])
            ->map(fn (Payment $payment) => implode(':', [
                $payment->id,
                $payment->booking_id,
                (string) $payment->amount,
                $payment->status,
                $payment->payment_type,
                optional($payment->due_date)->toDateString(),
                optional($payment->updated_at)->format('Uu'),
            ]))
            ->implode('|');
        $latestUpdatedAt = collect([
            $allBookings->max('updated_at'),
            Payment::query()->where($visiblePaymentQuery)->whereIn('booking_id', $bookingIdValuesForVersion)->max('updated_at'),
            FoodTasting::where('user_id', $userId)->max('updated_at'),
        ])->filter()->max();
        $versionMeta = ResourceVersion::make(
            $allBookings->count()
                + Payment::query()->where($visiblePaymentQuery)->whereIn('booking_id', $bookingIdValuesForVersion)->count()
                + FoodTasting::where('user_id', $userId)->count(),
            $latestUpdatedAt,
            // Include today's date so time-based computed fields (canEditMenu, canEditSupplementary)
            // are always recalculated when the day changes, not cached stale.
            implode(':', [$bookingIdsForVersion->max(), $paymentVersionCounter, sha1($paymentVersionSignature), now()->toDateString()])
        );
        if (ResourceVersion::matches($request, $versionMeta)) {
            return ResourceVersion::unchanged($versionMeta);
        }

        $allBookings = $allBookings
            ->map(function ($booking) use ($paymentService, $bookingService) {
                $nextPayment = $booking->payments
                    ->whereIn('status', ['Pending', 'Failed', 'Rejected'])
                    ->sortBy(function ($payment) {
                        return match ($payment->payment_type) {
                            'Reservation' => 1,
                            'DownPayment' => 2,
                            'Final' => 3,
                            default => 4,
                        };
                    })
                    ->first();
                $tranches = collect($paymentService->calculateTranches($booking))->keyBy('name');

                $bookingArray = $booking->toArray();
                $bookingArray['nextPaymentDue'] = $nextPayment ? [
                    'id' => $nextPayment->id,
                    'payment_type' => $nextPayment->payment_type,
                    'amount' => $nextPayment->amount,
                    'due_date' => $nextPayment->due_date,
                    'status' => $nextPayment->status,
                    'description' => $tranches->get($nextPayment->payment_type)['description'] ?? 'Payment due.',
                ] : null;
                $bookingArray['canEditSupplementary'] = $bookingService->canEditSupplementary($booking);
                $bookingArray['canEditMenu'] = $bookingService->canEditMenu($booking);
                $bookingArray['cancellationImpact'] = $this->calculateCancellationImpactFromLoadedPayments($booking);

                return $bookingArray;
            });

        $historyStatuses = ['Cancelled', 'cancelled', 'Completed', 'completed'];
        $bookings = $allBookings
            ->reject(fn ($booking) => in_array($booking['status'] ?? null, $historyStatuses, true))
            ->values();
        $historyBookings = $allBookings
            ->filter(fn ($booking) => in_array($booking['status'] ?? null, $historyStatuses, true))
            ->reject(fn ($booking) => ! empty($booking['hidden_from_customer_history_at']))
            ->values();

        $tastings = FoodTasting::where('user_id', $userId)
            ->orderBy('preferred_date', 'desc')
            ->get([
                'id',
                'user_id',
                'guest_name',
                'guest_email',
                'guest_phone',
                'preferred_date',
                'preferred_time',
                'notes',
                'status',
                'confirmed_at',
                'completed_at',
                'updated_at',
            ]);

        $bookingIds = $allBookings->pluck('id');
        $payments = Payment::whereIn('booking_id', $bookingIds)
            ->where($visiblePaymentQuery)
            ->with('booking:id,event_date,event_name,event_type,client_full_name,total_cost')
            ->orderBy('booking_id')
            ->orderByRaw("CASE WHEN status IN ('Paid', 'Verified') THEN 0 ELSE 1 END")
            ->orderByRaw("CASE payment_type WHEN 'Reservation' THEN 1 WHEN 'DownPayment' THEN 2 WHEN 'Final' THEN 3 END")
            ->get([
                'id',
                'booking_id',
                'amount',
                'payment_method',
                'status',
                'payment_type',
                'due_date',
                'verified_by',
                'verified_at',
                'paymongo_checkout_session_id',
                'paymongo_payment_id',
                'paymongo_reference_number',
                'voided_at',
                'void_reason',
                'superseded_by_payment_id',
                'created_at',
                'updated_at',
            ])
            ->map(function ($p) {
                $data = $p->toArray();
                $data['event_date'] = $p->booking->event_date ?? null;
                $data['event_name'] = $p->booking->event_name ?? null;
                $data['event_type'] = $p->booking->event_type ?? null;
                $data['client_full_name'] = $p->booking->client_full_name ?? null;
                $data['total_cost'] = $p->booking->total_cost ?? null;

                return $data;
            });

        return response()->json([
            'bookings' => $bookings,
            'historyBookings' => $historyBookings,
            'tastings' => $tastings,
            'payments' => $payments,
            'meta' => [
                ...$versionMeta,
                'changed' => true,
            ],
        ]);
    }

    private function calculateCancellationImpactFromLoadedPayments(Booking $booking): array
    {
        $eventDate = Carbon::parse($booking->event_date)->startOfDay();
        $daysUntilEvent = now()->startOfDay()->diffInDays($eventDate, false);

        $totalPaid = (float) $booking->payments
            ->whereIn('status', ['Verified', 'Paid'])
            ->sum(fn (Payment $payment) => (float) $payment->amount);
        $totalCost = (float) $booking->total_cost;
        $reservationFee = $totalCost * 0.10;

        if ($daysUntilEvent <= 7) {
            $nonRefundableAmount = $totalPaid;
            $refundableAmount = 0;
        } elseif ($totalPaid > $reservationFee) {
            $nonRefundableAmount = $reservationFee;
            $refundableAmount = $totalPaid - $reservationFee;
        } else {
            $nonRefundableAmount = $totalPaid;
            $refundableAmount = 0;
        }

        return [
            'total_paid' => $totalPaid,
            'non_refundable_amount' => $nonRefundableAmount,
            'refundable_amount' => $refundableAmount,
            'message' => $refundableAmount > 0
                ? 'Warning: Because your event is more than 7 days away, the 10% Reservation Fee (PHP '.number_format($reservationFee, 2).') is forfeited. The remaining PHP '.number_format($refundableAmount, 2).' will be flagged for refund.'
                : ($daysUntilEvent <= 7
                    ? 'Warning: Because your event is within 7 days, all payments (PHP '.number_format($nonRefundableAmount, 2).') are strictly non-refundable.'
                    : 'Warning: Your 10% Reservation Fee is non-refundable. Your paid amount does not exceed this fee.'),
        ];
    }

    public function journeyTracker()
    {
        $userId = Auth::id();
        $historyStatuses = ['Cancelled', 'cancelled', 'Completed', 'completed'];

        $bookings = Booking::where('user_id', $userId)
            ->whereNotIn('status', $historyStatuses)
            ->orderBy('event_date')
            ->get([
                'id',
                'user_id',
                'event_date',
                'event_time',
                'event_name',
                'event_type',
                'client_full_name',
                'pax',
                'total_cost',
                'status',
                'live_status',
                'selected_menu',
                'venue_address_line',
                'event_timeline',
                'special_instructions',
                'color_motif',
                'clarification_request',
                'clarification_response',
                'created_at',
                'updated_at',
            ]);

        $bookingIds = $bookings->pluck('id');
        $payments = Payment::whereIn('booking_id', $bookingIds)
            ->active()
            ->orderBy('booking_id')
            ->orderByRaw("CASE payment_type WHEN 'Reservation' THEN 1 WHEN 'DownPayment' THEN 2 WHEN 'Final' THEN 3 END")
            ->orderBy('due_date')
            ->get([
                'id',
                'booking_id',
                'amount',
                'status',
                'payment_type',
                'due_date',
            ]);

        $paymentsByBooking = $payments->groupBy('booking_id');
        $bookings = $bookings->map(function ($booking) use ($paymentsByBooking) {
            $nextPaymentDue = $paymentsByBooking
                ->get($booking->id, collect())
                ->first(fn ($payment) => in_array($payment->status, ['Pending', 'Failed', 'Rejected'], true));

            $bookingArray = $booking->toArray();
            $bookingArray['nextPaymentDue'] = $nextPaymentDue ? [
                'id' => $nextPaymentDue->id,
                'payment_type' => $nextPaymentDue->payment_type,
                'amount' => $nextPaymentDue->amount,
                'due_date' => $nextPaymentDue->due_date,
                'status' => $nextPaymentDue->status,
            ] : null;

            return $bookingArray;
        })->values();

        return response()->json([
            'bookings' => $bookings,
            'payments' => $payments,
            'cached_at' => now()->toIso8601String(),
        ]);
    }
}
