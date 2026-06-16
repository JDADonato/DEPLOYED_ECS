<?php

namespace App\Http\Controllers;

use App\Exceptions\ExternalServiceException;
use App\Http\Resources\BookingSummaryResource;
use App\Http\Resources\PaymentResource;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\RefundCase;
use App\Models\User;
use App\Notifications\PaymentApprovedNotification;
use App\Notifications\PaymentReminderNotification;
use App\Services\PaymentReminderService;
use App\Services\BookingManagementService;
use App\Services\NotificationRecipientService;
use App\Services\OperationalBroadcastService;
use App\Services\PaymentEventService;
use App\Services\PaymentScheduleVoidService;
use App\Services\PayMongoService;
use App\Support\ApiResponse;
use App\Support\CustomerIdentity;
use App\Support\ResourceVersion;
use App\Support\SensitiveDataRedactor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

/**
 * Accounting dashboard controller
 * 8 methods for the Accounting dashboard.
 */
class AccountingController extends Controller
{
    /**
     * Show the Accounting dashboard page.
     */
    public function index()
    {
        return Inertia::render('DashboardAccounting');
    }

    /**
     * Get all bookings with their payment schedules.
     * Ported from: accountingController.getBookingsWithPayments()
     */
    public function getBookingsWithPayments(Request $request)
    {
        $query = Booking::query()
            ->select([
                'id',
                'user_id',
                'event_date',
                'pax',
                'budget',
                'total_cost',
                'status',
                'client_full_name',
                'client_email',
                'client_phone',
                'event_name',
                'event_type',
                'created_at',
            ])
            ->with(['user:id,full_name,username,email,phone,account_status', 'payments' => function ($q) use ($request) {
                $q->select([
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
                ])
                    ->whereNotNull('payment_type')
                    ->when(! $request->boolean('include_voided'), fn ($query) => $query->active())
                    ->orderByRaw("CASE payment_type WHEN 'Reservation' THEN 1 WHEN 'DownPayment' THEN 2 WHEN 'Final' THEN 3 ELSE 4 END")
                    ->orderBy('due_date')
                    ->orderBy('id');
            }])
            ->where('status', '!=', 'Cancelled')
            ->where('status', '!=', 'Pending'); // Do not show pending (unapproved) bookings

        if (! $request->boolean('include_completed') && $request->query('payment_status') !== 'complete') {
            $query->whereNotIn('status', ['Completed', 'completed']);
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $term = '%'.mb_strtolower($search).'%';
            $query->where(function ($inner) use ($search, $term) {
                $inner->whereRaw('LOWER(client_full_name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(client_email) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(client_phone) LIKE ?', [$term])
                    ->orWhereHas('user', fn ($userQuery) => $userQuery
                        ->whereRaw('LOWER(full_name) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(username) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(phone) LIKE ?', [$term]));
                if (ctype_digit($search)) {
                    $inner->orWhere('id', (int) $search);
                }
            });
        }

        if ($request->query('payment_status') === 'pending') {
            $query->whereHas('payments', fn ($paymentQuery) => $paymentQuery->active()->whereNotIn('status', ['Paid', 'Verified']));
        } elseif ($request->query('payment_status') === 'complete') {
            $query->whereHas('payments')
                ->whereDoesntHave('payments', fn ($paymentQuery) => $paymentQuery->active()->whereNotIn('status', ['Paid', 'Verified']));
        }

        match ($request->query('finance_segment')) {
            'needs_verification' => $query->whereHas('payments', fn ($paymentQuery) => $paymentQuery->active()->where('status', 'Pending')),
            'overdue' => $query->whereHas('payments', fn ($paymentQuery) => $paymentQuery
                ->active()
                ->where('status', 'Pending')
                ->whereNotNull('due_date')
                ->whereDate('due_date', '<', now()->toDateString())),
            'upcoming' => $query->whereHas('payments', fn ($paymentQuery) => $paymentQuery
                ->active()
                ->where('status', 'Pending')
                ->whereNotNull('due_date')
                ->whereBetween('due_date', [now()->toDateString(), now()->addDays(7)->toDateString()])),
            default => null,
        };

        match ($request->query('sort', 'eventDateSoonest')) {
            'eventDateLatest' => $query->orderBy('event_date', 'desc'),
            'bookingNewest' => $query->orderBy('created_at', 'desc'),
            'bookingOldest' => $query->orderBy('created_at', 'asc'),
            'clientAZ' => $query->orderBy('client_full_name', 'asc'),
            'clientZA' => $query->orderBy('client_full_name', 'desc'),
            default => $query->orderBy('event_date', 'asc'),
        };

        $versionMeta = ResourceVersion::fromQuery($query);
        if (ResourceVersion::matches($request, $versionMeta)) {
            return ResourceVersion::unchanged($versionMeta);
        }

        $perPage = min(max((int) $request->query('per_page', 25), 1), 100);
        $bookings = $query->paginate($perPage)->through(function ($b) {
            $paidAmount = (float) $b->payments
                ->whereIn('status', ['Paid', 'Verified'])
                ->sum(fn (Payment $payment) => (float) $payment->amount);
            $totalCost = (float) ($b->total_cost ?? $b->budget ?? 0);

            return array_merge($b->toArray(), [
                'totalCost' => $totalCost,
                'event_display_name' => $b->event_display_name,
                ...CustomerIdentity::forBooking($b),
                'username' => $b->user->username ?? null,
                'user_full_name' => $b->user->full_name ?? null,
                'user_email' => $b->user->email ?? null,
                'user_phone' => $b->user->phone ?? null,
                'paid_amount' => $paidAmount,
                'remaining_balance' => max($totalCost - $paidAmount, 0),
                'finance_state' => $b->payments->contains(fn (Payment $payment) => $payment->status === 'Pending' && $payment->due_date && $payment->due_date->isPast())
                    ? 'overdue'
                    : ($b->payments->contains(fn (Payment $payment) => $payment->status === 'Pending') ? 'needs_verification' : 'settled'),
            ]);
        });

        return ApiResponse::paginated($bookings, $bookings->getCollection()->values(), [
            ...$versionMeta,
            'changed' => true,
        ]);
    }

    public function applyDiscount(Request $request, int $id)
    {
        $request->validate([
            'discount_value' => 'required|numeric|min:0.01',
            'discount_type' => 'required|in:fixed,percentage',
        ]);

        $booking = Booking::with('payments')->find($id);
        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        // Calculate how much has already been paid (locked funds)
        $lockedStatuses = ['Paid', 'Verified'];
        $totalPaid = $booking->payments
            ->filter(fn ($payment) => in_array($payment->status, $lockedStatuses, true))
            ->sum(fn ($payment) => (float) $payment->amount);

        // Compute the original pre-discount total cost.
        // We need to reverse any existing discount to get back to the true original.
        $currentTotal = (float) ($booking->total_cost ?? 0);
        $existingDiscountValue = (float) ($booking->discount_value ?? 0);
        $existingDiscountType = $booking->discount_type;

        if ($existingDiscountValue > 0 && $existingDiscountType === 'percentage' && $existingDiscountValue < 100) {
            // Reverse percentage: if total = original * (1 - pct/100), then original = total / (1 - pct/100)
            $originalAmount = $currentTotal / (1 - ($existingDiscountValue / 100));
        } elseif ($existingDiscountValue > 0 && $existingDiscountType === 'fixed') {
            // Reverse fixed: original = total + fixed_discount
            $originalAmount = $currentTotal + $existingDiscountValue;
        } else {
            // No existing discount
            $originalAmount = $currentTotal;
        }

        $discountValue = (float) $request->discount_value;
        $discountType = $request->discount_type;

        // Apply the new discount on the original (pre-discount) amount
        if ($discountType === 'percentage') {
            if ($discountValue >= 100) {
                return response()->json(['error' => 'Percentage discount must be less than 100%.'], 422);
            }
            $deduction = $originalAmount * ($discountValue / 100);
            $newTotalCost = $originalAmount - $deduction;
            $appliedDiscount = $deduction;
        } else {
            // Fixed discount
            $newTotalCost = $originalAmount - $discountValue;
            $appliedDiscount = $discountValue;
        }

        $newTotalCost = round(max(0, $newTotalCost), 2);

        // Safety: don't allow discount to reduce total below already-paid amount
        if ($newTotalCost < $totalPaid) {
            return response()->json(['error' => 'Discount too large: the new total (₱' . number_format($newTotalCost, 2) . ') would be less than the amount already paid (₱' . number_format($totalPaid, 2) . ').'], 422);
        }

        $booking->update([
            'discount_value' => $discountValue,
            'discount_type' => $discountType,
            'total_cost' => $newTotalCost,
        ]);
        
        // Recalculate pending payments
        app(\App\Services\PaymentCalculationService::class)->syncPendingTranches($booking);

        // Notify customer (dispatch synchronously to avoid queue worker dependency)
        if ($appliedDiscount > 0) {
            defer(fn () => $booking->user->notifyNow(new \App\Notifications\DiscountAppliedNotification($booking, $appliedDiscount, $newTotalCost)));
        }

        return response()->json([
            'message' => 'Discount applied successfully',
            'new_total_cost' => $newTotalCost,
            'original_amount' => round($originalAmount, 2),
            'discount_applied' => round($appliedDiscount, 2),
            'payments' => $booking->fresh(['payments'])->payments,
        ]);
    }

    public function summary()
    {
        $approvedBookings = fn ($query) => $query->whereNotIn('status', ['Pending', 'Cancelled', 'Completed', 'completed']);

        $paymentQuery = Payment::query()
            ->active()
            ->whereHas('booking', $approvedBookings);

        $pending = (clone $paymentQuery)->where('status', 'Pending')->count();
        $overdue = (clone $paymentQuery)
            ->where('status', 'Pending')
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', now()->toDateString())
            ->count();
        $collected = (float) (clone $paymentQuery)
            ->whereIn('status', ['Paid', 'Verified'])
            ->sum('amount');
        $refunds = Booking::query()
            ->where('status', 'Cancelled')
            ->whereHas('payments', fn ($query) => $query->active()->whereIn('status', ['Verified', 'Paid']))
            ->count();
        $exceptions = (clone $paymentQuery)
            ->where(function ($query) {
                $query->where(fn ($inner) => $inner->whereNotNull('paymongo_checkout_session_id')->whereNotIn('status', ['Paid', 'Verified', 'Refunded']))
                    ->orWhere(fn ($inner) => $inner->whereNotNull('paymongo_payment_id')->whereNotIn('status', ['Paid', 'Verified', 'Refunded']))
                    ->orWhere(fn ($inner) => $inner->where('status', 'Pending')->whereNotNull('due_date')->whereDate('due_date', '<', now()->toDateString()));
            })
            ->count();

        return response()->json([
            'bookings' => Booking::query()->whereNotIn('status', ['Pending', 'Cancelled', 'Completed', 'completed'])->count(),
            'pending' => $pending,
            'needs_verification' => $pending,
            'overdue' => $overdue,
            'refunds' => $refunds,
            'exceptions' => $exceptions,
            'due_soon' => (clone $paymentQuery)
                ->where('status', 'Pending')
                ->whereNotNull('due_date')
                ->whereBetween('due_date', [now()->toDateString(), now()->addDays(7)->toDateString()])
                ->count(),
            'refund_manual_review' => RefundCase::query()->whereIn('status', ['Failed', 'Manual Review'])->count(),
            'collected' => $collected,
        ]);
    }

    /**
     * Get pending payments for verification queue.
     * Ported from: accountingController.getPendingPayments()
     */
    public function getPendingPayments(Request $request)
    {
        $query = Payment::query()
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
            ])
            ->with(['booking:id,event_date,client_full_name,client_email,client_phone,package_id,user_id', 'booking.user:id,full_name,username,email,phone,account_status'])
            ->active()
            ->where('status', 'Pending')
            ->whereHas('booking', function ($q) {
                $q->where('status', '!=', 'Pending'); // Only payments for approved/confirmed bookings
            })
            ->orderBy('due_date', 'asc');

        if ($request->boolean('paginated')) {
            $perPage = min(max((int) $request->query('per_page', 25), 1), 100);
            $payments = $query->paginate($perPage);
            $data = $payments->getCollection()
                ->map(fn ($p) => $this->paymentWithBookingContext($p))
                ->values();

            return ApiResponse::paginated($payments, $data);
        }

        $payments = $query->get()
            ->map(function ($p) {
                return $this->paymentWithBookingContext($p);
            });

        return response()->json($payments);
    }

    /**
     * Verify or reject a payment.
     * Ported from: accountingController.verifyPayment()
     */
    public function verifyPayment(Request $request, int $id)
    {
        $request->validate([
            'action' => 'required|in:Verify,Reject',
        ]);

        $newStatus = $request->action === 'Verify' ? 'Verified' : 'Rejected';
        $verifiedBy = Auth::user()->username ?? 'accounting';

        $payment = Payment::active()->find($id);

        if (! $payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }

        $payment->update([
            'status' => $newStatus,
            'verified_by' => $verifiedBy,
            'verified_at' => now(),
        ]);

        PaymentEventService::record(
            $newStatus === 'Verified' ? 'verified_by_accounting' : 'rejected_by_accounting',
            'accounting',
            $payment,
            [
                'action' => $request->action,
                'status' => $newStatus,
            ],
            $payment->paymongo_payment_id ?: $payment->paymongo_checkout_session_id
        );

        // ─── Send notification to the client ───
        app(OperationalBroadcastService::class)
            ->financeChanged($payment->booking, 'payment', $payment->id, strtolower($newStatus), "Payment {$newStatus}.");

        try {
            $booking = Booking::find($payment->booking_id);
            if ($booking && $newStatus === 'Verified') {
                $client = User::find($booking->user_id);
                if ($client) {
                    app(NotificationRecipientService::class)->sendToUser($client, new PaymentApprovedNotification(
                        $booking,
                        $payment->payment_type,
                        (float) $payment->amount
                    ), 'payment_approved');
                }
            }
        } catch (\Exception $e) {
            Log::error("Notification failed on payment verify: {$e->getMessage()}");
        }

        return response()->json(['success' => true, 'message' => "Payment {$newStatus}"]);
    }

    /**
     * Update payment term (amount, due_date).
     * Ported from: accountingController.updatePayment()
     */
    public function updatePayment(Request $request, int $id)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'due_date' => 'required|date',
        ]);

        $payment = Payment::active()->find($id);

        if (! $payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }

        if (in_array($payment->status, ['Verified', 'Paid', 'Refunded'], true)) {
            return response()->json(['error' => 'Verified, paid, or refunded payment terms cannot be modified.'], 422);
        }

        $payment->update([
            'amount' => $request->amount,
            'due_date' => $request->due_date,
        ]);

        app(OperationalBroadcastService::class)
            ->financeChanged($payment->booking, 'payment', $payment->id, 'updated', 'Payment term updated.');

        return response()->json(['success' => true, 'message' => 'Payment updated successfully']);
    }

    public function updateBookingPaymentTerms(Request $request, int $id)
    {
        $data = $request->validate([
            'terms' => 'required|array|min:1',
            'terms.*.id' => 'nullable|integer|exists:payments,id',
            'terms.*.payment_type' => 'required|string|max:255',
            'terms.*.percentage' => 'required|numeric|min:0.01|max:100',
            'terms.*.due_date' => 'required|date',
        ]);

        $booking = Booking::with(['payments' => fn ($query) => $query->active()])->find($id);
        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $totalPercentage = collect($data['terms'])->sum(fn ($term) => (float) $term['percentage']);
        if (round($totalPercentage, 2) !== 100.00) {
            return response()->json(['error' => 'Payment term percentages must total 100%.'], 422);
        }

        $totalCost = (float) ($booking->total_cost ?? $booking->budget ?? 0);
        if ($totalCost <= 0) {
            return response()->json(['error' => 'Booking total must be greater than zero before payment terms can be edited.'], 422);
        }

        $existingIds = $booking->payments->pluck('id')->all();
        $incomingIds = collect($data['terms'])->pluck('id')->filter()->map(fn ($id) => (int) $id)->all();

        foreach ($incomingIds as $paymentId) {
            if (! in_array($paymentId, $existingIds, true)) {
                return response()->json(['error' => 'One or more payment terms do not belong to this booking.'], 422);
            }
        }

        $lockedPaymentIds = $booking->payments
            ->whereIn('status', ['Verified', 'Paid', 'Refunded'])
            ->pluck('id')
            ->all();

        foreach ($lockedPaymentIds as $lockedPaymentId) {
            if (! in_array($lockedPaymentId, $incomingIds, true)) {
                return response()->json(['error' => 'Verified, paid, or refunded payment terms must remain in the schedule.'], 422);
            }
        }

        DB::transaction(function () use ($booking, $data, $totalCost, $incomingIds) {
            $voider = app(PaymentScheduleVoidService::class);
            $stalePayments = $booking->payments()->active();
            if (! empty($incomingIds)) {
                $stalePayments->whereNotIn('id', $incomingIds);
            }
            $stalePayments->whereNotIn('status', ['Verified', 'Paid', 'Refunded'])
                ->get()
                ->each(fn (Payment $payment) => $voider->void($payment, 'accounting_terms_removed', 'accounting', Auth::id()));

            $remaining = round($totalCost, 2);
            $lastIndex = count($data['terms']) - 1;

            foreach ($data['terms'] as $index => $term) {
                $existingPayment = ! empty($term['id'])
                    ? $booking->payments->firstWhere('id', (int) $term['id'])
                    : null;

                if ($existingPayment && in_array($existingPayment->status, ['Verified', 'Paid', 'Refunded'], true)) {
                    $remaining = round($remaining - (float) $existingPayment->amount, 2);

                    continue;
                }

                $amount = $index === $lastIndex
                    ? $remaining
                    : round($totalCost * ((float) $term['percentage'] / 100), 2);

                $payload = [
                    'amount' => $amount,
                    'payment_method' => 'Pending',
                    'status' => 'Pending',
                    'payment_type' => $term['payment_type'],
                    'due_date' => $term['due_date'],
                ];

                if (! empty($term['id'])) {
                    Payment::active()
                        ->where('id', $term['id'])
                        ->where('booking_id', $booking->id)
                        ->update($payload);
                } else {
                    $booking->payments()->create($payload);
                }

                $remaining = round($remaining - $amount, 2);
            }
        });

        $booking->load(['payments' => function ($q) {
            $q->active()
                ->orderByRaw("CASE payment_type WHEN 'Reservation' THEN 1 WHEN 'DownPayment' THEN 2 WHEN 'Final' THEN 3 ELSE 4 END")
                ->orderBy('due_date')
                ->orderBy('id');
        }]);

        foreach ($booking->payments as $payment) {
            PaymentEventService::record(
                'payment_terms_updated',
                'accounting',
                $payment,
                ['booking_id' => $booking->id],
                $payment->paymongo_payment_id ?: $payment->paymongo_checkout_session_id
            );
        }

        app(OperationalBroadcastService::class)
            ->financeChanged($booking->fresh(), 'booking_payment_terms', $booking->id, 'updated', 'Payment terms updated.');

        return response()->json([
            'success' => true,
            'message' => 'Payment terms updated successfully.',
            'booking' => $booking,
            'booking_summary' => new BookingSummaryResource($booking),
            'payments' => PaymentResource::collection($booking->payments),
        ]);
    }

    /**
     * Get transaction ledger (all payments with filters).
     * Ported from: accountingController.getLedger()
     */
    public function getLedger(Request $request)
    {
        $query = Payment::query()
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
                'created_at',
                'paymongo_checkout_session_id',
                'paymongo_payment_id',
                'paymongo_reference_number',
                'paymongo_event_id',
                'voided_at',
                'void_reason',
                'superseded_by_payment_id',
            ])
            ->with(['booking:id,event_date,client_full_name,client_email,client_phone,package_id,user_id', 'booking.user:id,full_name,username,email,phone,account_status'])
            ->when(! $request->boolean('include_voided'), fn ($query) => $query->active())
            ->whereHas('booking', function ($q) {
                $q->whereNotIn('status', ['Pending', 'Cancelled']); // Hide ledger entries for unapproved/cancelled bookings
            });

        if ($request->status && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        if ($request->startDate) {
            $query->where('created_at', '>=', $request->startDate);
        }

        if ($request->endDate) {
            $query->where('created_at', '<=', $request->endDate);
        }

        if ($request->filled('clientSearch')) {
            $search = trim((string) $request->query('clientSearch'));
            $term = '%'.mb_strtolower($search).'%';
            $query->whereHas('booking', function ($bookingQuery) use ($search, $term) {
                $bookingQuery->whereRaw('LOWER(client_full_name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(client_email) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(client_phone) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(event_name) LIKE ?', [$term])
                    ->orWhereHas('user', fn ($userQuery) => $userQuery
                        ->whereRaw('LOWER(full_name) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(username) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(phone) LIKE ?', [$term]));
                if (ctype_digit($search)) {
                    $bookingQuery->orWhere('id', (int) $search);
                }
            });
        }

        if ($request->filled('method') && $request->query('method') !== 'All') {
            $method = '%'.mb_strtolower(trim((string) $request->query('method'))).'%';
            $query->whereRaw('LOWER(payment_method) LIKE ?', [$method]);
        }

        if ($request->filled('payment_type') && $request->query('payment_type') !== 'All') {
            $query->where('payment_type', $request->query('payment_type'));
        }

        $query->orderBy('created_at', 'desc');

        if ($request->boolean('paginated')) {
            $perPage = min(max((int) $request->query('per_page', 25), 1), 100);
            $payments = $query->paginate($perPage);
            $data = $payments->getCollection()
                ->map(fn ($p) => $this->paymentWithBookingContext($p))
                ->values();

            return ApiResponse::paginated($payments, $data);
        }

        $payments = $query->get()
            ->map(fn ($p) => $this->paymentWithBookingContext($p));

        return response()->json($payments);
    }

    public function getReconciliation(Request $request)
    {
        $payments = Payment::query()
            ->select([
                'id',
                'booking_id',
                'amount',
                'payment_method',
                'status',
                'payment_type',
                'due_date',
                'paymongo_checkout_session_id',
                'paymongo_payment_id',
                'paymongo_reference_number',
                'voided_at',
                'created_at',
            ])
            ->with([
                'booking:id,user_id,event_date,client_full_name,client_email,client_phone,status,total_cost',
                'booking.user:id,full_name,username,email,phone,account_status',
                'events:id,payment_id,event_type',
            ])
            ->active()
            ->whereHas('booking', fn ($query) => $query->whereNotIn('status', ['Pending']))
            ->latest()
            ->limit(300)
            ->get()
            ->map(function (Payment $payment) {
                $hasCheckout = filled($payment->paymongo_checkout_session_id);
                $hasProviderPayment = filled($payment->paymongo_payment_id);
                $hasPaidWebhook = $payment->events->contains('event_type', 'webhook_paid');
                $hasMismatch = $payment->events->contains(fn ($event) => in_array($event->event_type, ['webhook_mismatch', 'webhook_unmatched'], true));
                $isPaidLocally = in_array($payment->status, ['Paid', 'Verified', 'Refunded'], true);
                $isOverdue = $payment->due_date && $payment->due_date->isPast() && $payment->status === 'Pending';

                $exceptions = [];
                if ($hasCheckout && ! $isPaidLocally) {
                    $exceptions[] = 'checkout_started_unpaid';
                }
                if ($hasProviderPayment && ! $isPaidLocally) {
                    $exceptions[] = 'provider_paid_not_local';
                }
                if ($isOverdue) {
                    $exceptions[] = 'pending_past_due';
                }
                if (str_contains(strtolower((string) $payment->payment_method), 'paymongo') && $isPaidLocally && ! $hasProviderPayment) {
                    $exceptions[] = 'missing_paymongo_payment_id_for_refund';
                }
                if ($hasMismatch) {
                    $exceptions[] = 'webhook_mismatch';
                }

                return [
                    'id' => $payment->id,
                    'booking_id' => $payment->booking_id,
                    'client_full_name' => $payment->booking?->client_full_name,
                    ...CustomerIdentity::forBooking($payment->booking),
                    'event_date' => $payment->booking?->event_date,
                    'amount' => $payment->amount,
                    'payment_type' => $payment->payment_type,
                    'status' => $payment->status,
                    'due_date' => $payment->due_date,
                    'paymongo_checkout_session_id' => $payment->paymongo_checkout_session_id,
                    'paymongo_payment_id' => $payment->paymongo_payment_id,
                    'paymongo_reference_number' => $payment->paymongo_reference_number,
                    'webhook_received' => $hasPaidWebhook,
                    'mismatch' => $hasMismatch,
                    'exceptions' => $exceptions,
                ];
            })
            ->filter(fn ($payment) => $request->query('exceptions_only') ? count($payment['exceptions']) > 0 : true)
            ->values();

        return response()->json($payments);
    }

    /**
     * Send a real payment reminder email + in-app notification to the client.
     * Ported from: accountingController.remindClient()
     */
    public function remindClient(int $paymentId, PaymentReminderService $reminderService)
    {
        $result = $reminderService->sendReminder($paymentId, 'accounting');

        if (! $result['success']) {
            return response()->json(['error' => $result['error']], $result['status']);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ]);
    }

    /**
     * Get refund queue (cancelled bookings with verified payments).
     * Ported from: accountingController.getRefundQueue()
     */
    public function getRefundQueue()
    {
        $items = Booking::query()
            ->select([
                'id',
                'user_id',
                'event_date',
                'client_full_name',
                'client_email',
                'client_phone',
                'total_cost',
                'status',
            ])
            ->with([
                'user:id,full_name,username,email,phone,account_status',
                'payments' => fn ($query) => $query
                    ->select(['id', 'booking_id', 'amount', 'status', 'payment_type', 'voided_at'])
                    ->active()
                    ->whereIn('status', ['Verified', 'Paid']),
                'refundCases:id,booking_id,payment_id,amount,non_refundable_amount,status,last_action,provider_refund_id,provider_refund_status,provider_synced_at,notes,updated_at',
            ])
            ->where('status', 'Cancelled')
            ->whereHas('payments', fn ($query) => $query->active()->whereIn('status', ['Verified', 'Paid']))
            ->get()
            ->map(function (Booking $booking) {
                $refundCases = $booking->refundCases;

                return [
                    'booking_id' => $booking->id,
                    'client_full_name' => $booking->client_full_name,
                    'client_email' => $booking->client_email,
                    ...CustomerIdentity::forBooking($booking),
                    'event_date' => $booking->event_date,
                    'total_cost' => $booking->total_cost,
                    'total_paid' => $booking->payments->sum(fn (Payment $payment) => (float) $payment->amount),
                    'refund_case_count' => $refundCases->count(),
                    'refund_status' => match (true) {
                        $refundCases->contains(fn (RefundCase $case) => in_array($case->status, ['Failed', 'Manual Review'], true)) => 'Manual Review',
                        $refundCases->contains(fn (RefundCase $case) => in_array($case->status, ['Processing', 'Approved', 'Requested'], true)) => 'Provider refund',
                        $refundCases->contains(fn (RefundCase $case) => in_array($case->status, ['Manual Refunded', 'Refunded'], true)) => 'Completed',
                        $refundCases->contains(fn (RefundCase $case) => in_array($case->status, ['Forfeited', 'No Refund Due'], true)) => 'Forfeited/no refund',
                        $refundCases->isNotEmpty() => 'Reviewed',
                        default => 'Needs Review',
                    },
                    'refund_cases' => $refundCases->map(fn (RefundCase $case) => [
                        'id' => $case->id,
                        'payment_id' => $case->payment_id,
                        'amount' => (float) $case->amount,
                        'non_refundable_amount' => (float) $case->non_refundable_amount,
                        'status' => $case->status,
                        'last_action' => $case->last_action,
                        'provider_refund_id' => $case->provider_refund_id,
                        'provider_refund_status' => $case->provider_refund_status,
                        'provider_synced_at' => $case->provider_synced_at?->toIso8601String(),
                        'notes' => $case->notes,
                        'updated_at' => $case->updated_at?->toIso8601String(),
                        'next_actions' => $this->refundCaseNextActions($case),
                    ])->values(),
                ];
            })
            ->values();

        return response()->json($items);
    }

    /**
     * Process refund for a booking.
     * Integrates with PayMongo API to refund actual payments.
     */
    public function processRefund(int $bookingId, PayMongoService $payMongo)
    {
        $verifiedBy = Auth::user()->username ?? 'accounting';
        $booking = Booking::with('payments')->find($bookingId);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found.'], 404);
        }

        $payments = Payment::where('booking_id', $bookingId)
            ->active()
            ->whereIn('status', ['Verified', 'Paid'])
            ->orderByRaw("CASE payment_type WHEN 'Reservation' THEN 1 WHEN 'DownPayment' THEN 2 WHEN 'Final' THEN 3 ELSE 4 END")
            ->orderBy('id')
            ->get();

        if ($payments->isEmpty()) {
            return response()->json(['error' => 'No verified or paid payments found for this booking to refund.'], 404);
        }

        $impact = (new BookingManagementService)->calculateCancellationImpact($booking);
        $remainingRefundable = round((float) ($impact['refundable_amount'] ?? 0), 2);
        $nonRefundableRemaining = round((float) ($impact['non_refundable_amount'] ?? 0), 2);
        $refundCount = 0;
        $forfeitedCount = 0;
        $errors = [];
        $safeMissingReferenceMessage = 'This payment cannot be refunded automatically because the original online payment reference is missing.';

        foreach ($payments as $payment) {
            $refundCase = null;
            try {
                $paidAmount = round((float) $payment->amount, 2);
                $forfeitedForPayment = min($paidAmount, $nonRefundableRemaining);
                $nonRefundableRemaining = round($nonRefundableRemaining - $forfeitedForPayment, 2);
                $refundAmount = min(round($paidAmount - $forfeitedForPayment, 2), $remainingRefundable);

                $refundCase = RefundCase::where('payment_id', $payment->id)
                    ->whereNotIn('status', ['Refunded', 'Manual Refunded', 'Forfeited', 'No Refund Due', 'Rejected', 'Cancelled'])
                    ->latest()
                    ->first();

                if ($refundCase && in_array($refundCase->status, ['Processing', 'Approved', 'Requested'], true)) {
                    $errors[] = 'A refund case is already in progress for one payment.';

                    continue;
                }

                $refundCase ??= new RefundCase([
                    'booking_id' => $booking->id,
                    'payment_id' => $payment->id,
                    'requested_by' => Auth::id(),
                ]);

                $refundCase->fill([
                    'booking_id' => $booking->id,
                    'payment_id' => $payment->id,
                    'amount' => max($refundAmount, 0),
                    'non_refundable_amount' => $forfeitedForPayment,
                    'reason' => 'cancelled_booking',
                    'status' => $refundAmount > 0 ? 'Approved' : 'Refunded',
                    'last_action' => 'retry_provider_refund',
                    'requested_by' => Auth::id(),
                    'approved_by' => Auth::id(),
                    'resolved_by' => $refundAmount > 0 ? null : Auth::id(),
                    'resolved_at' => $refundAmount > 0 ? null : now(),
                    'notes' => $refundAmount > 0 ? null : 'Paid amount was fully non-refundable under cancellation policy.',
                ])->save();

                PaymentEventService::record(
                    'refund_requested',
                    'accounting',
                    $payment,
                    [
                        'refund_case_id' => $refundCase->id,
                        'amount' => max($refundAmount, 0),
                        'non_refundable_amount' => $forfeitedForPayment,
                    ],
                    $payment->paymongo_payment_id ?: $payment->paymongo_checkout_session_id
                );

                if ($refundAmount <= 0) {
                    $payment->update([
                        'status' => 'Refunded',
                        'verified_by' => $verifiedBy,
                        'verified_at' => now(),
                        'payment_method' => trim(($payment->payment_method ?: 'Payment').' (Forfeited)'),
                    ]);
                    $forfeitedCount++;
                    PaymentEventService::record(
                        'refund_completed',
                        'accounting',
                        $payment,
                        [
                            'refund_case_id' => $refundCase->id,
                            'amount' => 0,
                            'non_refundable_amount' => $forfeitedForPayment,
                        ],
                        $payment->paymongo_payment_id ?: $payment->paymongo_checkout_session_id
                    );

                    continue;
                }

                // If it was paid via PayMongo and has a payment ID, issue a real refund
                if ($payment->paymongo_payment_id) {
                    try {
                        $refundCase->update(['status' => 'Processing', 'last_action' => 'retry_provider_refund']);
                        $providerResponse = $payMongo->createRefund(
                            paymentId: $payment->paymongo_payment_id,
                            amount: $refundAmount,
                            reason: 'requested_by_customer',
                            notes: "Refunded via Accounting Dashboard for Booking #{$bookingId}, Payment #{$payment->id}"
                        );
                        $refundCase->update([
                            'status' => 'Refunded',
                            'last_action' => 'provider_refund_completed',
                            'resolved_by' => Auth::id(),
                            'resolved_at' => now(),
                            'provider_refund_id' => data_get($providerResponse, 'id'),
                            'provider_refund_status' => data_get($providerResponse, 'status'),
                            'provider_synced_at' => now(),
                            'provider_response' => $providerResponse,
                        ]);
                    } catch (ExternalServiceException $apiException) {
                        Log::error('PayMongo refund failed.', [
                            'payment_id' => $payment->id,
                            'booking_id' => $bookingId,
                            'external' => $apiException->safePayload(),
                            'context' => $apiException->context,
                        ]);
                        $refundCase->update([
                            'status' => 'Failed',
                            'last_action' => 'provider_refund_failed',
                            'provider_refund_status' => 'failed',
                            'provider_synced_at' => now(),
                            'provider_response' => $apiException->safePayload(),
                            'notes' => 'Automatic provider refund failed. Review PayMongo logs before retrying.',
                        ]);
                        PaymentEventService::record(
                            'refund_failed',
                            'paymongo',
                            $payment,
                            [
                                'refund_case_id' => $refundCase->id,
                                'reason' => $apiException->providerCode ?: 'provider_error',
                                'reference' => $apiException->referenceCode(),
                            ],
                            $payment->paymongo_payment_id
                        );
                        $errors[] = 'Automatic refund failed for one payment. Reference: '.$apiException->referenceCode();

                        continue;
                    } catch (\Exception $apiException) {
                        Log::error("PayMongo API failed for payment #{$payment->id}: ".$apiException->getMessage(), [
                            'payment_id' => $payment->id,
                            'booking_id' => $bookingId,
                        ]);
                        $refundCase->update([
                            'status' => 'Failed',
                            'last_action' => 'provider_refund_failed',
                            'provider_refund_status' => 'failed',
                            'provider_synced_at' => now(),
                            'provider_response' => ['error' => SensitiveDataRedactor::redact($apiException->getMessage())],
                            'notes' => 'Automatic provider refund failed. Review PayMongo logs before retrying.',
                        ]);
                        PaymentEventService::record(
                            'refund_failed',
                            'paymongo',
                            $payment,
                            [
                                'refund_case_id' => $refundCase->id,
                                'reason' => 'provider_error',
                            ],
                            $payment->paymongo_payment_id
                        );
                        $errors[] = 'Automatic refund failed for one payment. Please review the refund case before retrying.';

                        continue; // Skip local update if the real refund failed
                    }
                } elseif (str_contains(strtolower((string) $payment->payment_method), 'paymongo')) {
                    Log::warning('PayMongo refund skipped because provider payment ID is missing.', [
                        'payment_id' => $payment->id,
                        'booking_id' => $bookingId,
                    ]);
                    $refundCase->update([
                        'status' => 'Failed',
                        'last_action' => 'missing_provider_payment_id',
                        'provider_refund_status' => 'missing_payment_id',
                        'provider_synced_at' => now(),
                        'notes' => $safeMissingReferenceMessage,
                    ]);
                    PaymentEventService::record(
                        'refund_failed',
                        'accounting',
                        $payment,
                        [
                            'refund_case_id' => $refundCase->id,
                            'reason' => 'missing_provider_payment_id',
                        ],
                        $payment->paymongo_checkout_session_id
                    );
                    $errors[] = $safeMissingReferenceMessage;

                    continue;
                }

                // Update the payment record
                $payment->update([
                    'status' => 'Refunded',
                    'verified_by' => $verifiedBy,
                    'verified_at' => now(),
                    'payment_method' => $forfeitedForPayment > 0
                        ? trim(($payment->payment_method ?: 'Payment').' (Partial refund: PHP '.number_format($refundAmount, 2).'; forfeited: PHP '.number_format($forfeitedForPayment, 2).')')
                        : $payment->payment_method,
                ]);

                $remainingRefundable = round($remainingRefundable - $refundAmount, 2);
                $refundCount++;
                PaymentEventService::record(
                    'refund_completed',
                    $payment->paymongo_payment_id ? 'paymongo' : 'accounting',
                    $payment,
                    [
                        'refund_case_id' => $refundCase->id,
                        'amount' => $refundAmount,
                        'non_refundable_amount' => $forfeitedForPayment,
                    ],
                    $payment->paymongo_payment_id ?: $payment->paymongo_checkout_session_id
                );
            } catch (\Exception $e) {
                Log::error("Failed to process refund for payment #{$payment->id}: ".$e->getMessage());
                $refundCase?->update([
                    'status' => 'Failed',
                    'last_action' => 'refund_case_error',
                    'notes' => 'Refund case could not be completed. Please review server logs.',
                    'provider_response' => ['error' => SensitiveDataRedactor::redact($e->getMessage())],
                ]);
                $errors[] = 'A refund case could not be completed. Please review it before retrying.';
            }
        }

        if (count($errors) > 0 && $refundCount === 0) {
            app(OperationalBroadcastService::class)
                ->financeChanged($booking->fresh(), 'refund_case', $booking->id, 'failed', 'Refund cases need review.');

            return response()->json([
                'error' => 'Failed to process refunds.',
                'details' => array_values(array_unique($errors)),
            ], 500);
        }

        $message = $refundCount > 0
            ? 'Refund processed successfully through PayMongo where provider payment IDs were available. Non-refundable reservation fees were forfeited.'
            : 'No refundable amount was available. Paid amounts were marked as forfeited.';
        if (count($errors) > 0) {
            $message .= ' However, some payments failed to refund.';
        }

        Log::info("[REFUND] Processed refund for booking #{$bookingId}. Updated records.", [
            'refunded_payments' => $refundCount,
            'forfeited_payments' => $forfeitedCount,
            'errors' => $errors,
        ]);

        app(OperationalBroadcastService::class)
            ->financeChanged($booking->fresh(), 'refund_case', $booking->id, count($errors) > 0 ? 'partially_failed' : 'processed', 'Refund cases updated.');

        return response()->json(['success' => true, 'message' => $message]);
    }

    public function refundAction(Request $request, int $bookingId, string $action, PayMongoService $payMongo)
    {
        $validated = $request->validate([
            'refund_case_id' => ['nullable', 'integer', 'exists:refund_cases,id'],
            'payment_id' => ['nullable', 'integer', 'exists:payments,id'],
            'notes' => ['nullable', 'string', 'max:3000'],
        ]);

        if (! in_array($action, ['retry_provider_refund', 'sync_provider_status', 'mark_manually_refunded', 'mark_forfeited', 'close_no_refund_due', 'reopen_manual_review'], true)) {
            return response()->json(['error' => 'Unsupported refund action.'], 422);
        }

        if (in_array($action, ['mark_manually_refunded', 'mark_forfeited', 'close_no_refund_due'], true) && blank($validated['notes'] ?? null)) {
            return response()->json(['error' => 'Notes are required for manual refund closure actions.'], 422);
        }

        $booking = Booking::findOrFail($bookingId);
        $case = isset($validated['refund_case_id'])
            ? RefundCase::where('booking_id', $booking->id)->findOrFail($validated['refund_case_id'])
            : RefundCase::where('booking_id', $booking->id)
                ->when($validated['payment_id'] ?? null, fn ($q, $paymentId) => $q->where('payment_id', $paymentId))
                ->latest()
                ->first();

        if (! $case && ! empty($validated['payment_id'])) {
            $payment = Payment::active()->where('booking_id', $booking->id)->findOrFail($validated['payment_id']);
            $case = RefundCase::create([
                'booking_id' => $booking->id,
                'payment_id' => $payment->id,
                'amount' => 0,
                'non_refundable_amount' => (float) $payment->amount,
                'reason' => 'manual_review',
                'status' => 'Manual Review',
                'last_action' => 'reopen_manual_review',
                'requested_by' => Auth::id(),
                'approved_by' => Auth::id(),
                'notes' => 'Manual refund case opened by staff.',
            ]);
        }

        if (! $case) {
            return response()->json(['error' => 'No refund case was found for this booking.'], 404);
        }

        $payment = $case->payment;
        $notes = trim((string) ($validated['notes'] ?? ''));
        $verifiedBy = Auth::user()->username ?? 'accounting';

        if ($action === 'retry_provider_refund') {
            return $this->retryProviderRefund($case, $payMongo);
        }

        if ($action === 'sync_provider_status') {
            return $this->syncProviderRefundStatus($case, $payMongo);
        }

        match ($action) {
            'mark_manually_refunded' => $case->update([
                'status' => 'Manual Refunded',
                'last_action' => $action,
                'resolved_by' => Auth::id(),
                'resolved_at' => now(),
                'notes' => $notes,
            ]),
            'mark_forfeited' => $case->update([
                'status' => 'Forfeited',
                'last_action' => $action,
                'resolved_by' => Auth::id(),
                'resolved_at' => now(),
                'amount' => 0,
                'notes' => $notes,
            ]),
            'close_no_refund_due' => $case->update([
                'status' => 'No Refund Due',
                'last_action' => $action,
                'resolved_by' => Auth::id(),
                'resolved_at' => now(),
                'amount' => 0,
                'notes' => $notes,
            ]),
            'reopen_manual_review' => $case->update([
                'status' => 'Manual Review',
                'last_action' => $action,
                'resolved_by' => null,
                'resolved_at' => null,
                'notes' => $notes ?: $case->notes,
            ]),
        };

        if ($payment && in_array($action, ['mark_manually_refunded', 'mark_forfeited', 'close_no_refund_due'], true)) {
            $payment->update([
                'status' => 'Refunded',
                'verified_by' => $verifiedBy,
                'verified_at' => now(),
            ]);

            PaymentEventService::record(
                $action,
                'accounting',
                $payment,
                ['refund_case_id' => $case->id, 'notes' => $notes],
                $payment->paymongo_payment_id ?: $payment->paymongo_checkout_session_id
            );
        }

        app(OperationalBroadcastService::class)
            ->financeChanged($booking->fresh(), 'refund_case', $case->id, $action, 'Refund case updated.');

        return response()->json([
            'success' => true,
            'message' => 'Refund case updated.',
            'refund_case' => $case->fresh(),
        ]);
    }

    private function retryProviderRefund(RefundCase $case, PayMongoService $payMongo)
    {
        $payment = $case->payment;

        if (! in_array($case->status, ['Failed', 'Manual Review'], true)) {
            return response()->json(['error' => 'Only failed or manual-review refund cases can be retried.'], 422);
        }

        if (! $payment || $payment->voided_at || ! in_array($payment->status, ['Paid', 'Verified'], true)) {
            return response()->json(['error' => 'This refund case is not linked to an active paid payment.'], 422);
        }

        $refundAmount = round((float) $case->amount, 2);
        if ($refundAmount <= 0) {
            return response()->json(['error' => 'This refund case has no provider-refundable amount.'], 422);
        }

        if (! $payment->paymongo_payment_id) {
            $case->update([
                'status' => 'Failed',
                'last_action' => 'missing_provider_payment_id',
                'provider_refund_status' => 'missing_payment_id',
                'provider_synced_at' => now(),
                'notes' => 'This payment cannot be refunded automatically because the original online payment reference is missing.',
            ]);

            PaymentEventService::record(
                'refund_failed',
                'accounting',
                $payment,
                ['refund_case_id' => $case->id, 'reason' => 'missing_provider_payment_id'],
                $payment->paymongo_checkout_session_id
            );

            app(OperationalBroadcastService::class)
                ->financeChanged($case->booking, 'refund_case', $case->id, 'missing_provider_payment_id', 'Refund case needs manual review.');

            return response()->json(['error' => $case->notes], 422);
        }

        PaymentEventService::record(
            'refund_retry_requested',
            'accounting',
            $payment,
            ['refund_case_id' => $case->id, 'amount' => $refundAmount],
            $payment->paymongo_payment_id
        );

        $case->update([
            'status' => 'Processing',
            'last_action' => 'retry_provider_refund',
            'provider_refund_status' => null,
            'provider_synced_at' => null,
            'provider_response' => null,
        ]);

        try {
            $providerResponse = $payMongo->createRefund(
                paymentId: $payment->paymongo_payment_id,
                amount: $refundAmount,
                reason: 'requested_by_customer',
                notes: "Refund retry via Accounting Dashboard for Booking #{$case->booking_id}, Payment #{$payment->id}"
            );

            $case->update([
                'status' => 'Refunded',
                'last_action' => 'provider_refund_completed',
                'resolved_by' => Auth::id(),
                'resolved_at' => now(),
                'provider_refund_id' => data_get($providerResponse, 'id'),
                'provider_refund_status' => data_get($providerResponse, 'status'),
                'provider_synced_at' => now(),
                'provider_response' => $providerResponse,
            ]);

            $payment->update([
                'status' => 'Refunded',
                'verified_by' => Auth::user()->username ?? 'accounting',
                'verified_at' => now(),
            ]);

            PaymentEventService::record(
                'refund_completed',
                'paymongo',
                $payment,
                ['refund_case_id' => $case->id, 'amount' => $refundAmount],
                $payment->paymongo_payment_id
            );

            app(OperationalBroadcastService::class)
                ->financeChanged($case->booking, 'refund_case', $case->id, 'retry_provider_refund_completed', 'Provider refund completed.');

            return response()->json([
                'success' => true,
                'message' => 'Provider refund retried successfully.',
                'refund_case' => $case->fresh(),
            ]);
        } catch (ExternalServiceException $e) {
            $case->update([
                'status' => 'Failed',
                'last_action' => 'provider_refund_failed',
                'provider_refund_status' => 'failed',
                'provider_synced_at' => now(),
                'provider_response' => $e->safePayload(),
                'notes' => 'Automatic provider refund failed. Review PayMongo logs before retrying.',
            ]);

            PaymentEventService::record(
                'refund_failed',
                'paymongo',
                $payment,
                [
                    'refund_case_id' => $case->id,
                    'reason' => $e->providerCode ?: 'provider_error',
                    'reference' => $e->referenceCode(),
                ],
                $payment->paymongo_payment_id
            );

            app(OperationalBroadcastService::class)
                ->financeChanged($case->booking, 'refund_case', $case->id, 'retry_provider_refund_failed', 'Provider refund failed.');

            return response()->json(['error' => 'Automatic provider refund failed. Please review the refund case before retrying.', 'reference' => $e->referenceCode()], 500);
        } catch (\Throwable $e) {
            $case->update([
                'status' => 'Failed',
                'last_action' => 'provider_refund_failed',
                'provider_refund_status' => 'failed',
                'provider_synced_at' => now(),
                'provider_response' => ['error' => SensitiveDataRedactor::redact($e->getMessage())],
                'notes' => 'Automatic provider refund failed. Review PayMongo logs before retrying.',
            ]);

            PaymentEventService::record(
                'refund_failed',
                'paymongo',
                $payment,
                ['refund_case_id' => $case->id, 'reason' => 'provider_error'],
                $payment->paymongo_payment_id
            );

            app(OperationalBroadcastService::class)
                ->financeChanged($case->booking, 'refund_case', $case->id, 'retry_provider_refund_failed', 'Provider refund failed.');

            return response()->json(['error' => 'Automatic provider refund failed. Please review the refund case before retrying.'], 500);
        }
    }

    private function syncProviderRefundStatus(RefundCase $case, PayMongoService $payMongo)
    {
        if (! $case->provider_refund_id) {
            return response()->json(['error' => 'This refund case does not have a PayMongo refund ID yet.'], 422);
        }

        try {
            $providerResponse = $payMongo->retrieveRefund($case->provider_refund_id);
            $providerStatus = data_get($providerResponse, 'status');

            $case->update([
                'provider_refund_status' => $providerStatus,
                'provider_synced_at' => now(),
                'provider_response' => $providerResponse,
                'last_action' => 'sync_provider_status',
            ]);

            if (in_array($providerStatus, ['succeeded', 'paid', 'refunded'], true) && $case->payment && in_array($case->payment->status, ['Paid', 'Verified'], true)) {
                $case->payment->update([
                    'status' => 'Refunded',
                    'verified_by' => Auth::user()->username ?? 'accounting',
                    'verified_at' => now(),
                ]);
            }

            app(OperationalBroadcastService::class)
                ->financeChanged($case->booking, 'refund_case', $case->id, 'sync_provider_status', 'Provider refund status synced.');

            return response()->json([
                'success' => true,
                'message' => 'Provider refund status synced.',
                'refund_case' => $case->fresh(),
            ]);
        } catch (ExternalServiceException $e) {
            $case->update([
                'provider_synced_at' => now(),
                'provider_response' => $e->safePayload(),
                'last_action' => 'sync_provider_status_failed',
            ]);

            return response()->json(['error' => 'Unable to sync PayMongo refund status.', 'reference' => $e->referenceCode()], 500);
        } catch (\Throwable $e) {
            $case->update([
                'provider_synced_at' => now(),
                'provider_response' => ['error' => SensitiveDataRedactor::redact($e->getMessage())],
                'last_action' => 'sync_provider_status_failed',
            ]);

            return response()->json(['error' => 'Unable to sync PayMongo refund status.'], 500);
        }
    }

    private function refundCaseNextActions(RefundCase $case): array
    {
        $actions = match ($case->status) {
            'Failed', 'Manual Review' => ['retry_provider_refund', 'mark_manually_refunded', 'mark_forfeited', 'close_no_refund_due'],
            'Requested', 'Approved', 'Processing' => ['mark_manually_refunded', 'reopen_manual_review'],
            'Refunded', 'Manual Refunded', 'Forfeited', 'No Refund Due' => ['reopen_manual_review'],
            default => ['reopen_manual_review'],
        };

        if ($case->provider_refund_id && ! in_array('sync_provider_status', $actions, true)) {
            array_unshift($actions, 'sync_provider_status');
        }

        return $actions;
    }

    private function paymentWithBookingContext(Payment $payment): array
    {
        $data = (new PaymentResource($payment))->resolve();
        $data['event_date'] = $payment->booking->event_date ?? null;
        $data['client_full_name'] = $payment->booking->client_full_name ?? null;
        $data['package_id'] = $payment->booking->package_id ?? null;
        $data['username'] = $payment->booking?->user?->username;
        $data['user_full_name'] = $payment->booking?->user?->full_name;
        $data['user_email'] = $payment->booking?->user?->email;
        $data['user_phone'] = $payment->booking?->user?->phone;
        $data = array_merge($data, CustomerIdentity::forBooking($payment->booking));
        $data['receipt_url'] = route('documents.receipt', $payment);
        $data['finance_state'] = $payment->status === 'Pending' && $payment->due_date && $payment->due_date->isPast()
            ? 'overdue'
            : (in_array($payment->status, ['Paid', 'Verified'], true) ? 'settled' : strtolower((string) $payment->status));

        return $data;
    }
}
