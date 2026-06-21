<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingSummaryResource;
use App\Mail\BookingLiveStatusUpdate;
use App\Models\ActionLog;
use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\BookingHistoryNote;
use App\Models\BookingReviewTask;
use App\Models\ContactInquiry;
use App\Models\FoodTasting;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\BookingLiveStatusNotification;
use App\Notifications\BookingStatusNotification;
use App\Notifications\CustomerAssistedBookingInviteNotification;
use App\Notifications\NewBookingNotification;
use App\Services\BookingCompletionService;
use App\Services\BookingValidationService;
use App\Services\ConversionEventService;
use App\Services\EmailDeliveryService;
use App\Services\EventPreparationService;
use App\Services\FoodTastingScheduleService;
use App\Services\NotificationRecipientService;
use App\Services\OperationalBroadcastService;
use App\Services\PaymentCalculationService;
use App\Support\ApiResponse;
use App\Support\AuditContext;
use App\Support\ResourceVersion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

/**
 * Marketing dashboard - booking management and live status tracking.
 */
class MarketingController extends Controller
{
    /**
     * Show the Marketing dashboard page.
     */
    public function index()
    {
        return Inertia::render('DashboardMarketing', [
            // Phase 2: Inertia.js Payload Optimization
            // Lazy Evaluation: Only queries the database if the 'bookings' prop is explicitly requested via partial reloads.
            'bookings' => Inertia::lazy(function () {
                return Booking::with('user:id,full_name,username,role')
                    ->orderBy('event_date', 'asc')
                    ->get();
            }),
        ]);
    }

    /**
     * Get all bookings with user details.
     * Ported from: marketing bookings list
     */
    public function getAllBookings(Request $request)
    {
        $query = Booking::with(['user:id,full_name,username,email,phone,role', 'assignee:id,full_name,username', 'createdByStaff:id,full_name,username', 'transferRequestedTo:id,full_name,username', 'transferRequestedBy:id,full_name,username', 'reviewTasks', 'preparationTasks', 'historyNotes:id,booking_id,user_id,body,created_at', 'payments' => fn ($paymentQuery) => $paymentQuery->active()])
            ->when($request->boolean('active_only', true), fn ($q) => $q->whereNotIn('status', ['Completed', 'completed', 'Cancelled', 'cancelled']))
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('review_status'), fn ($q, $status) => $q->where('review_status', $status))
            ->when($request->query('date_from'), fn ($q, $date) => $q->whereDate('event_date', '>=', $date))
            ->when($request->query('date_to'), fn ($q, $date) => $q->whereDate('event_date', '<=', $date))
            ->when($request->query('search'), function ($q, $search) {
                $term = '%'.mb_strtolower(trim((string) $search)).'%';
                $q->where(fn ($inner) => $inner
                    ->whereRaw('LOWER(client_full_name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(client_email) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(client_phone) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(event_name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(venue_city) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(event_type) LIKE ?', [$term])
                    ->orWhereHas('user', fn ($userQuery) => $userQuery
                        ->whereRaw('LOWER(full_name) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(username) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(phone) LIKE ?', [$term])));
            });

        $user = $request->user();
        $ownership = $request->query('ownership');
        if ($ownership === 'unclaimed') {
            $query->whereNull('assigned_to');
        } elseif ($ownership === 'claimed') {
            $query->whereNotNull('assigned_to');
        } elseif ($ownership === 'mine' && $user) {
            $query->where('assigned_to', $user->id);
        }

        if ($request->query('scope') === 'mine' && $user && $user->role === 'Marketing') {
            $query->where('assigned_to', $user->id);
        }

        match ($request->query('sort', 'bookingNewest')) {
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

        if ($request->boolean('paginated')) {
            $perPage = min(max((int) $request->query('per_page', 25), 1), 100);
            $bookings = $query->paginate($perPage);

            return ApiResponse::paginated($bookings, BookingSummaryResource::collection($bookings->getCollection())->resolve(), [
                ...$versionMeta,
                'changed' => true,
            ]);
        }

        $bookings = BookingSummaryResource::collection($query->get())->resolve();

        return ResourceVersion::changed($bookings, $versionMeta);
    }

    public function searchCustomers(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $limit = min(max((int) $request->query('limit', 8), 1), 12);
        $page = max((int) $request->query('page', 1), 1);
        $includeDeactivated = $request->boolean('include_deactivated');

        if (mb_strlen($search) < 2) {
            return response()->json([
                'data' => [],
                'meta' => [
                    'total' => 0,
                    'limit' => $limit,
                    'page' => 1,
                    'last_page' => 1,
                    'has_more' => false,
                    'search' => $search,
                ],
            ]);
        }

        $normalizedSearch = mb_strtolower($search);
        $term = '%'.$normalizedSearch.'%';
        $startsWithTerm = $normalizedSearch.'%';

        $query = User::query()
            ->where('role', 'Client')
            ->when(! $includeDeactivated, fn ($query) => $query->activeAccounts())
            ->where(fn ($query) => $query
                ->whereRaw('LOWER(full_name) LIKE ?', [$term])
                ->orWhereRaw('LOWER(username) LIKE ?', [$term])
                ->orWhereRaw('LOWER(email) LIKE ?', [$term])
                ->orWhereRaw('LOWER(phone) LIKE ?', [$term]));

        $total = (clone $query)->count();
        $lastPage = max((int) ceil($total / $limit), 1);
        $page = min($page, $lastPage);

        $customers = $query
            ->orderByRaw('case when account_status = ? then 0 else 1 end', ['active'])
            ->orderByRaw(
                "case when LOWER(COALESCE(email, '')) = ? or LOWER(COALESCE(phone, '')) = ? or LOWER(COALESCE(username, '')) = ? then 0 else 1 end",
                [$normalizedSearch, $normalizedSearch, $normalizedSearch]
            )
            ->orderByRaw(
                "case when LOWER(COALESCE(full_name, '')) like ? or LOWER(COALESCE(username, '')) like ? then 0 else 1 end",
                [$startsWithTerm, $startsWithTerm]
            )
            ->orderBy('full_name')
            ->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get(['id', 'full_name', 'username', 'email', 'phone', 'account_status']);

        return response()->json([
            'data' => $customers->map(fn (User $customer) => [
                'id' => $customer->id,
                'full_name' => $customer->full_name,
                'username' => $customer->username,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'account_status' => $customer->account_status ?? 'active',
                'label' => $customer->full_name ?: $customer->username,
            ])->values(),
            'meta' => [
                'total' => $total,
                'limit' => $limit,
                'page' => $page,
                'last_page' => $lastPage,
                'from' => $total > 0 ? (($page - 1) * $limit) + 1 : 0,
                'to' => min($page * $limit, $total),
                'has_more' => $page < $lastPage,
                'search' => $search,
            ],
        ]);
    }

    public function createAssistedBooking(Request $request, EmailDeliveryService $emailDelivery)
    {
        $actor = Auth::user();

        if (! $actor || ! in_array($actor->role, ['Marketing', 'Admin'], true)) {
            return response()->json(['error' => 'Only Marketing or Admin can create assisted bookings.'], 403);
        }

        $data = $request->validate([
            'customer_mode' => ['required', 'in:existing,new'],
            'customer_id' => ['nullable', 'required_if:customer_mode,existing', 'exists:users,id'],
            'customer.full_name' => ['required_if:customer_mode,new', 'nullable', 'string', 'max:255'],
            'customer.email' => ['nullable', 'email', 'max:255'],
            'customer.phone' => ['nullable', 'string', 'max:40'],
            'customer.username' => ['nullable', 'string', 'max:80'],
            'send_invite' => ['nullable', 'boolean'],
            'event_date' => ['required', 'date'],
            'event_time' => ['required', 'string', 'max:30'],
            'event_type' => ['nullable', 'string', 'max:120'],
            'event_name' => ['required', 'string', 'max:255'],
            'pax' => ['required', 'integer', 'min:1'],
            'budget' => ['nullable', 'numeric', 'min:0'],
            'package_id' => ['nullable', 'string', 'max:120'],
            'selected_menu' => ['nullable', 'array'],
            'menu_items' => ['nullable', 'array'],
            'menu_items.*' => ['integer', 'exists:menu_items,id'],
            'total_cost' => ['nullable', 'numeric', 'min:0'],
            'client_full_name' => ['nullable', 'string', 'max:255'],
            'client_email' => ['nullable', 'email', 'max:255'],
            'client_phone' => ['nullable', 'string', 'max:40'],
            'venue_address_line' => ['nullable', 'string', 'max:255'],
            'venue_street' => ['nullable', 'string', 'max:255'],
            'venue_city' => ['nullable', 'string', 'max:120'],
            'venue_province' => ['nullable', 'string', 'max:120'],
            'venue_zip_code' => ['nullable', 'string', 'max:20'],
            'venue_building_details' => ['nullable', 'string', 'max:1000'],
            'special_instructions' => ['nullable', 'string', 'max:3000'],
            'transport_fee' => ['nullable', 'numeric', 'min:0'],
            'labor_surcharge' => ['nullable', 'numeric', 'min:0'],
            'upfront_payment' => ['nullable', 'array'],
            'upfront_payment.tranches' => ['required_with:upfront_payment', 'array'],
            'upfront_payment.tranches.*' => ['string', 'in:Reservation,DownPayment,Final'],
            'upfront_payment.method' => ['required_with:upfront_payment', 'string', 'max:50'],
            'upfront_payment.reference' => ['nullable', 'string', 'max:255'],
            'wants_tasting' => ['nullable', 'boolean'],
            'tasting.guest_name' => ['required_if:wants_tasting,true', 'nullable', 'string', 'max:255'],
            'tasting.guest_email' => ['required_if:wants_tasting,true', 'nullable', 'email', 'max:255'],
            'tasting.guest_phone' => ['nullable', 'string', 'max:40'],
            'tasting.preferred_date' => ['required_if:wants_tasting,true', 'nullable', 'date'],
            'tasting.preferred_time' => ['required_if:wants_tasting,true', 'nullable', 'string', 'max:30'],
            'tasting.notes' => ['nullable', 'string', 'max:2000'],
        ]);

        try {
            BookingValidationService::validateBookingConstraints([
                'event_date' => $data['event_date'],
                'pax' => $data['pax'],
            ]);

            if (! empty($data['menu_items']) && isset($data['total_cost'])) {
                $expectedTotal = BookingValidationService::calculateTotalCost($data['menu_items'], (int) $data['pax'])
                    + (float) ($data['transport_fee'] ?? 0)
                    + (float) ($data['labor_surcharge'] ?? 0);

                if (abs($expectedTotal - (float) $data['total_cost']) > max(1, $expectedTotal * 0.01)) {
                    return response()->json([
                        'error' => 'Price calculation mismatch. Please refresh pricing and try again.',
                        'recalculated_total' => $expectedTotal,
                    ], 422);
                }
            }

            if (! empty($data['wants_tasting'])) {
                FoodTastingScheduleService::validateCustomerSlot(
                    $data['tasting']['preferred_date'] ?? '',
                    $data['tasting']['preferred_time'] ?? ''
                );
            }
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $temporaryPassword = null;
        $createdNewCustomer = false;

        try {
            [$booking, $customer, $createdNewCustomer, $temporaryPassword] = DB::transaction(function () use ($data, $actor, &$temporaryPassword, &$createdNewCustomer) {
                $customer = $this->resolveAssistedCustomer($data, $temporaryPassword, $createdNewCustomer);

                $booking = Booking::create([
                    'user_id' => $customer->id,
                    'booking_source' => $actor->role === 'Admin' ? 'admin_assisted' : 'marketing_assisted',
                    'created_by_staff_id' => $actor->id,
                    'assigned_to' => $actor->role === 'Marketing' ? $actor->id : null,
                    'event_date' => $data['event_date'],
                    'event_time' => $data['event_time'],
                    'pax' => (int) $data['pax'],
                    'budget' => $data['budget'] ?? null,
                    'package_id' => $data['package_id'] ?? 'custom',
                    'event_type' => $data['event_type'] ?? null,
                    'event_name' => $data['event_name'],
                    'client_full_name' => $data['client_full_name'] ?? $customer->full_name ?? $customer->username,
                    'client_email' => $data['client_email'] ?? $customer->email,
                    'client_phone' => $data['client_phone'] ?? $customer->phone,
                    'venue_address_line' => $data['venue_address_line'] ?? null,
                    'venue_street' => $data['venue_street'] ?? null,
                    'venue_city' => $data['venue_city'] ?? null,
                    'venue_province' => $data['venue_province'] ?? null,
                    'venue_zip_code' => $data['venue_zip_code'] ?? null,
                    'venue_building_details' => $data['venue_building_details'] ?? null,
                    'special_instructions' => $data['special_instructions'] ?? null,
                    'transport_fee' => $data['transport_fee'] ?? 0,
                    'labor_surcharge' => $data['labor_surcharge'] ?? 0,
                    'total_cost' => $data['total_cost'] ?? $data['budget'] ?? 0,
                    'selected_menu' => $data['selected_menu'] ?? null,
                    'status' => (!empty($data['upfront_payment']) && !empty($data['upfront_payment']['tranches']) && ($data['upfront_payment']['method'] ?? '') === 'PayMongo') ? 'Pending' : 'Confirmed',
                    'review_status' => (!empty($data['upfront_payment']) && !empty($data['upfront_payment']['tranches']) && ($data['upfront_payment']['method'] ?? '') === 'PayMongo') ? 'Pending Payment' : 'Approved For Reservation',
                    'reviewed_at' => now(),
                    'expires_at' => now()->addHours(24),
                ]);

                if (! empty($data['wants_tasting'])) {
                    $tastingData = $data['tasting'] ?? [];
                    $duplicateUser = $this->findDuplicateUser($tastingData['guest_email'] ?? $customer->email, $tastingData['guest_phone'] ?? $customer->phone);

                    $tasting = FoodTasting::create([
                        'user_id' => $customer->id,
                        'guest_name' => $tastingData['guest_name'] ?? $booking->client_full_name,
                        'guest_email' => $tastingData['guest_email'] ?? $booking->client_email,
                        'guest_phone' => $tastingData['guest_phone'] ?? $booking->client_phone,
                        'preferred_date' => $tastingData['preferred_date'],
                        'preferred_time' => $tastingData['preferred_time'],
                        'notes' => $tastingData['notes'] ?? null,
                        'handled_by' => $actor->id,
                        'duplicate_user_id' => $duplicateUser?->id,
                    ]);

                    $booking->forceFill(['food_tasting_id' => $tasting->id])->save();
                }

                foreach ([
                    'Confirm date and capacity',
                    'Review package and menu fit',
                    'Check venue location and access',
                    'Confirm payment schedule',
                    'Check customer invite and account access',
                ] as $label) {
                    $booking->reviewTasks()->create([
                        'task_type' => 'review',
                        'label' => $label,
                        'status' => 'Pending',
                        'customer_visible' => false,
                    ]);
                }

                $cost = (float) ($booking->total_cost ?? 0);
                if ($cost > 0) {
                    $paymentService = new \App\Services\PaymentCalculationService;
                    foreach ($paymentService->calculateTranches($booking) as $tranche) {
                        Payment::create([
                            'booking_id' => $booking->id,
                            'amount' => round((float) $tranche['amount'], 2),
                            'payment_method' => 'Pending',
                            'status' => 'Pending',
                            'payment_type' => $tranche['name'],
                            'due_date' => \Carbon\Carbon::parse($tranche['due_date'])->toDateString(),
                        ]);
                    }
                }

                AuditLog::create([
                    'user_id' => $actor->id,
                    'username' => $actor->username,
                    'role' => $actor->role,
                    'action' => 'Booking created by staff for customer',
                    'method' => 'POST',
                    'path' => '/api/marketing/bookings/assisted',
                    'status_code' => 201,
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'metadata' => AuditContext::forRequest(request(), null, [
                        'booking_id' => $booking->id,
                        'customer_id' => $customer->id,
                        'customer_mode' => $data['customer_mode'],
                        'booking_source' => $booking->booking_source,
                        'changed_fields' => ['booking', 'payment_schedule'],
                    ]),
                ]);

                // Send invite later via emailDelivery

                $paymentCalc = app(\App\Services\PaymentCalculationService::class);
                $paymentCalc->syncPendingTranches($booking);

                if (!empty($data['upfront_payment']) && !empty($data['upfront_payment']['tranches']) && in_array($data['upfront_payment']['method'] ?? '', ['Cash', 'Card Terminal'])) {
                    $method = $data['upfront_payment']['method'];
                    $selectedTranches = $data['upfront_payment']['tranches'];

                    $booking->payments()
                        ->whereIn('payment_type', $selectedTranches)
                        ->update([
                            'payment_method' => $method,
                            'status' => 'Verified',
                            'verified_by' => $actor->username ?? 'staff',
                            'verified_at' => now(),
                            'paymongo_reference_number' => $data['upfront_payment']['reference'] ?? null,
                        ]);
                }

                $paymentCalc->updateBookingMilestone($booking);

                return [$booking, $customer, $createdNewCustomer, $temporaryPassword];
            });
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        ConversionEventService::record('assisted_booking_submitted', [
            'user' => $actor,
            'booking' => $booking,
            'source' => $actor->role === 'Admin' ? 'admin_assisted' : 'marketing_assisted',
            'step' => 'review',
            'metadata' => [
                'customer_mode' => $data['customer_mode'],
                'created_new_customer' => $createdNewCustomer,
                'send_invite' => $request->boolean('send_invite', true),
                'event_type' => $booking->event_type,
                'pax' => $booking->pax,
                'total_cost' => (float) ($booking->total_cost ?? 0),
            ],
        ]);

        $inviteDelivery = ['status' => 'skipped_by_admin', 'message' => 'Customer invite was not requested.'];
        if ($request->boolean('send_invite', true)) {
            $inviteDelivery = $emailDelivery->sendToNotifiable(
                $customer,
                new CustomerAssistedBookingInviteNotification($booking, $temporaryPassword),
                'assisted_booking_customer_invite'
            );
        }

        try {
            app(NotificationRecipientService::class)
                ->sendToRoles(['Admin', 'Marketing', 'Accounting'], new NewBookingNotification($booking), 'assisted_booking_created');
        } catch (\Throwable) {
            // Notifications should not undo the booking that was already created.
        }

        if ($booking->food_tasting_id) {
            app(OperationalBroadcastService::class)
                ->staffQueueChanged('food_tastings', 'food_tasting', $booking->food_tasting_id, 'created', 'New assisted food tasting request.');
        }

        $checkoutUrl = null;
        if (!empty($data['upfront_payment']) && !empty($data['upfront_payment']['tranches']) && ($data['upfront_payment']['method'] ?? '') === 'PayMongo') {
            try {
                $payMongo = app(\App\Services\PayMongoService::class);
                $selectedTranches = $data['upfront_payment']['tranches'];
                
                $payments = $booking->payments()->whereIn('payment_type', $selectedTranches)->get();
                if ($payments->isNotEmpty()) {
                    $amount = $payments->sum('amount');
                    $description = "Upfront Payment for " . ($booking->event_type ?: 'Event') . " Booking #{$booking->id}";
                    
                    $checkout = $payMongo->createCheckoutSession(
                        amount: round((float)$amount, 2),
                        description: $description,
                        successUrl: route('checkout.success', ['booking_id' => $booking->id, 'payment_id' => $payments->first()->id]),
                        cancelUrl: route('checkout.cancelled'),
                        metadata: [
                            'payment_ids' => $payments->pluck('id')->join(','),
                        ],
                        booking: $booking
                    );
                    
                    $checkoutUrl = $checkout['checkout_url'] ?? null;
                    
                    if ($checkoutUrl) {
                        foreach ($payments as $p) {
                            $p->forceFill([
                                'payment_method' => 'PayMongo Checkout',
                                'paymongo_checkout_session_id' => $checkout['id'] ?? null,
                            ])->save();
                        }
                    }
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to create PayMongo checkout for assisted booking: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Assisted booking created successfully.',
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'createdByStaff', 'reviewTasks', 'preparationTasks', 'payments'])),
            'customer' => [
                'id' => $customer->id,
                'full_name' => $customer->full_name,
                'username' => $customer->username,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'created' => $createdNewCustomer,
            ],
            'temporary_password' => $temporaryPassword,
            'temporary_password_expires_at' => $customer->temporary_password_expires_at,
            'invite_delivery' => $inviteDelivery,
            'invite_delivery_status' => $inviteDelivery,
            'paymongo_checkout_url' => $checkoutUrl,
        ], 201);
    }

    private function resolveAssistedCustomer(array $data, ?string &$temporaryPassword, bool &$createdNewCustomer): User
    {
        if ($data['customer_mode'] === 'existing') {
            $customer = User::where('role', 'Client')->find($data['customer_id']);

            if (! $customer) {
                throw ValidationException::withMessages([
                    'customer_id' => 'Choose an existing customer account.',
                ]);
            }

            if (! $customer->isActive()) {
                throw ValidationException::withMessages([
                    'customer_id' => 'Choose an active customer account.',
                ]);
            }

            return $customer;
        }

        $customerData = $data['customer'] ?? [];
        $email = filled($customerData['email'] ?? null) ? strtolower(trim($customerData['email'])) : null;
        $phone = filled($customerData['phone'] ?? null) ? trim($customerData['phone']) : null;

        $duplicate = null;
        if ($email) {
            $duplicate = User::where('role', 'Client')
                ->activeAccounts()
                ->where('email', $email)
                ->first();
        } elseif ($phone) {
            $duplicate = User::where('role', 'Client')
                ->activeAccounts()
                ->where('phone', $phone)
                ->first();
        }

        if ($duplicate) {
            $duplicateName = $duplicate->full_name ?: $duplicate->username;

            throw ValidationException::withMessages([
                'customer' => "A customer account already exists for {$duplicateName}. Select that customer instead.",
            ]);
        }

        $temporaryPassword = Str::password(12);
        $username = $this->uniqueClientUsername($customerData['username'] ?? null, $customerData['full_name'] ?? null, $email);
        $createdNewCustomer = true;
        $user = User::create([
            'full_name' => $customerData['full_name'] ?? $username,
            'username' => $username,
            'email' => $email,
            'phone' => $phone,
            'password' => $temporaryPassword,
            'role' => 'Client',
            'account_status' => 'active',
            'must_change_password' => true,
            'temporary_password_expires_at' => now()->addHours(24),
            'temporary_password_secret' => $temporaryPassword,
        ]);

        return $user;
    }

    private function uniqueClientUsername(?string $requested, ?string $name, ?string $email): string
    {
        $base = $requested
            ?: ($email ? Str::before($email, '@') : $name);
        $base = Str::of($base ?: 'client')
            ->ascii()
            ->lower()
            ->replaceMatches('/[^a-z0-9]+/', '_')
            ->trim('_')
            ->limit(32, '')
            ->value() ?: 'client';

        $candidate = $base;
        $counter = 1;

        while (User::where('username', $candidate)->exists()) {
            $candidate = $base.'_'.(++$counter);
        }

        return $candidate;
    }

    public function summary()
    {
        $reviewStatuses = ['Submitted', 'Under Review', 'Needs Customer Details', 'Clarification Received'];
        $pendingQuery = Booking::query()
            ->whereNotIn('status', ['Completed', 'completed', 'Cancelled', 'cancelled'])
            ->where(fn ($query) => $query->where('status', 'Pending')->orWhereIn('review_status', $reviewStatuses));
        $needsDetailsQuery = Booking::query()
            ->whereNotIn('status', ['Completed', 'completed', 'Cancelled', 'cancelled'])
            ->where(fn ($query) => $query->where('review_status', 'Needs Customer Details')->orWhereNotNull('clarification_request'));
        $upcomingQuery = Booking::query()
            ->whereNotNull('event_date')
            ->whereIn('status', ['Confirmed', 'Pending']);
        $thisMonthQuery = (clone $upcomingQuery)
            ->whereBetween('event_date', [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()]);
        $urgentQuery = (clone $pendingQuery)
            ->whereNotNull('event_date')
            ->whereBetween('event_date', [now()->toDateString(), now()->addDays(7)->toDateString()]);

        $leadsOpenQuery = ContactInquiry::query()
            ->whereIn('status', ['New', 'In Progress']);

        return response()->json([
            'pending' => (clone $pendingQuery)->count(),
            'needs_details' => (clone $needsDetailsQuery)->count(),
            'upcoming' => (clone $upcomingQuery)->count(),
            'this_month' => (clone $thisMonthQuery)->count(),
            'urgent' => (clone $urgentQuery)->count(),
            'pipeline' => (float) (clone $pendingQuery)->sum(DB::raw('COALESCE(total_cost, budget, 0)')),
            'leads_open' => (clone $leadsOpenQuery)->count(),
        ]);
    }

    /**
     * Update booking status.
     * Ported from: marketing booking status update
     */
    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Confirmed,Cancelled,Completed',
            'override' => 'sometimes|boolean',
            'override_reason' => 'nullable|string|max:1000',
        ]);

        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        if ($guard = $this->ensureCanMutateBooking($booking)) {
            return $guard;
        }

        if ($request->status === 'Completed') {
            return $this->completeBooking($request, $booking);
        }

        $reviewStatus = match ($request->status) {
            'Confirmed' => 'Approved For Reservation',
            'Cancelled' => 'Not Available',
            'Completed' => 'Completed',
            default => $booking->review_status ?: 'Submitted',
        };

        ActionLog::create([
            'user_id' => Auth::id(),
            'action_type' => 'update_booking_status',
            'target_type' => Booking::class,
            'target_id' => $booking->id,
            'details' => ['message' => 'Updated status to ' . $request->status],
            'previous_state' => ['status' => $booking->status],
            'new_state' => ['status' => $request->status],
        ]);

        $booking->update([
            'status' => $request->status,
            'review_status' => $reviewStatus,
            'assigned_to' => $booking->assigned_to ?: Auth::id(),
            'reviewed_at' => in_array($request->status, ['Confirmed', 'Cancelled', 'Completed'], true) ? now() : $booking->reviewed_at,
        ]);

        ConversionEventService::record(match ($request->status) {
            'Confirmed' => 'booking_confirmed',
            'Cancelled' => 'booking_rejected',
            'Completed' => 'event_completed',
            default => 'booking_status_updated',
        }, [
            'booking' => $booking,
            'source' => Auth::user()?->role === 'Admin' ? 'admin_override' : 'marketing_workspace',
            'metadata' => [
                'status' => $request->status,
                'review_status' => $reviewStatus,
            ],
        ]);

        if ($request->status === 'Confirmed') {
            EventPreparationService::ensureDefaultTasks($booking->fresh());
        }

        // ─── Send notification to the client ───
        try {
            $client = User::find($booking->user_id);
            if ($client && in_array($request->status, ['Confirmed', 'Cancelled', 'Completed'])) {
                app(NotificationRecipientService::class)
                    ->sendToUser($client, new BookingStatusNotification($booking, $request->status), 'booking_status_update');
            }
        } catch (\Exception $e) {
            Log::error("Notification failed on status update: {$e->getMessage()}");
        }
        app(OperationalBroadcastService::class)
            ->bookingChanged($booking->fresh(), 'status_updated', 'Booking status updated.');

        return response()->json([
            'success' => true,
            'message' => 'Booking status updated',
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
        ]);
    }

    public function assign(Request $request, int $id)
    {
        return $this->claim($request, $id);
    }

    public function claim(Request $request, int $id)
    {
        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        if (! in_array(Auth::user()->role, ['Marketing', 'Admin'], true)) {
            return response()->json(['error' => 'Only Marketing or Admin can claim bookings.'], 403);
        }

        $updated = Booking::where('id', $booking->id)
            ->whereNull('assigned_to')
            ->update([
                'assigned_to' => Auth::id(),
                'transfer_requested_to' => null,
                'transfer_requested_by' => null,
                'transfer_requested_at' => null,
                'review_status' => $booking->review_status === 'Submitted' ? 'Under Review' : ($booking->review_status ?: 'Under Review'),
            ]);

        if (! $updated) {
            $booking->refresh()->load('assignee:id,full_name,username');

            if ((int) $booking->assigned_to === (int) Auth::id()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Booking is already assigned to you.',
                    'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'transferRequestedTo', 'transferRequestedBy', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
                ]);
            }

            return response()->json([
                'error' => 'This booking was already claimed by '.($booking->assignee?->full_name ?: ($booking->assignee->username ?? 'another staff member')).'.',
                'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'transferRequestedTo', 'transferRequestedBy', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
            ], 409);
        }

        ConversionEventService::record('booking_claimed', [
            'booking_id' => $booking->id,
            'source' => Auth::user()?->role === 'Admin' ? 'admin_override' : 'marketing_workspace',
            'metadata' => [
                'claimed_by' => Auth::id(),
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking claimed.',
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'transferRequestedTo', 'transferRequestedBy', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
        ]);
    }

    public function transfer(Request $request, int $id)
    {
        $data = $request->validate([
            'new_staff_id' => 'required|exists:users,id',
        ]);

        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $user = Auth::user();
        if ($user->role !== 'Admin' && (int) $booking->assigned_to !== (int) $user->id) {
            return response()->json(['error' => 'Only the booking owner or an admin can transfer this booking.'], 403);
        }

        $newOwner = User::find($data['new_staff_id']);
        if ($newOwner->role !== 'Marketing') {
            return response()->json(['error' => 'Bookings can only be transferred to Marketing staff.'], 422);
        }

        if ((int) $booking->assigned_to === (int) $newOwner->id) {
            return response()->json(['error' => 'This staff member already owns the booking.'], 422);
        }

        $booking->update([
            'transfer_requested_to' => $newOwner->id,
            'transfer_requested_by' => $user->id,
            'transfer_requested_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transfer request sent. The new staff member must accept it before ownership changes.',
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'transferRequestedTo', 'transferRequestedBy', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
        ]);
    }

    public function requestTransfer(Request $request, int $id)
    {
        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $user = Auth::user();
        if ($user->role !== 'Marketing') {
            return response()->json(['error' => 'Only Marketing staff can request booking transfers.'], 403);
        }

        if (is_null($booking->assigned_to)) {
            return response()->json(['error' => 'This booking is unassigned. Claim it instead.'], 422);
        }

        if ((int) $booking->assigned_to === (int) $user->id) {
            return response()->json(['error' => 'This booking is already assigned to you.'], 422);
        }

        if ($booking->transfer_requested_to || $booking->transfer_requested_by) {
            return response()->json(['error' => 'A transfer request is already pending for this booking.'], 422);
        }

        $booking->update([
            'transfer_requested_to' => $booking->assigned_to,
            'transfer_requested_by' => $user->id,
            'transfer_requested_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transfer request sent to the current owner.',
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'transferRequestedTo', 'transferRequestedBy', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
        ]);
    }

    public function cancelTransfer(Request $request, int $id)
    {
        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $user = Auth::user();
        $canCancel = $user->role === 'Admin'
            || (int) $booking->transfer_requested_by === (int) $user->id
            || (int) $booking->assigned_to === (int) $user->id;

        if (! $canCancel) {
            return response()->json(['error' => 'Only the requester, owner, or admin can cancel this transfer request.'], 403);
        }

        $booking->update([
            'transfer_requested_to' => null,
            'transfer_requested_by' => null,
            'transfer_requested_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transfer request cancelled.',
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'transferRequestedTo', 'transferRequestedBy', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
        ]);
    }

    public function acceptTransfer(Request $request, int $id)
    {
        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $user = Auth::user();
        if ($user->role !== 'Marketing' || (int) $booking->transfer_requested_to !== (int) $user->id) {
            return response()->json(['error' => 'Only the requested Marketing staff member can accept this transfer.'], 403);
        }

        $newOwnerId = (int) $booking->assigned_to === (int) $booking->transfer_requested_to
            ? $booking->transfer_requested_by
            : $user->id;

        $booking->update([
            'assigned_to' => $newOwnerId,
            'transfer_requested_to' => null,
            'transfer_requested_by' => null,
            'transfer_requested_at' => null,
            'review_status' => $booking->review_status === 'Submitted' ? 'Under Review' : ($booking->review_status ?: 'Under Review'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking transfer accepted.',
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'transferRequestedTo', 'transferRequestedBy', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
        ]);
    }

    public function declineTransfer(Request $request, int $id)
    {
        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $user = Auth::user();
        $isRequestedStaff = $user->role === 'Marketing' && (int) $booking->transfer_requested_to === (int) $user->id;
        $isOwnerOrAdmin = $user->role === 'Admin' || (int) $booking->assigned_to === (int) $user->id;

        if (! $isRequestedStaff && ! $isOwnerOrAdmin) {
            return response()->json(['error' => 'Only the requested staff member, owner, or admin can decline this transfer.'], 403);
        }

        $booking->update([
            'transfer_requested_to' => null,
            'transfer_requested_by' => null,
            'transfer_requested_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking transfer declined.',
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'transferRequestedTo', 'transferRequestedBy', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
        ]);
    }

    public function release(Request $request, int $id)
    {
        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $user = Auth::user();
        if ($user->role !== 'Admin' && (int) $booking->assigned_to !== (int) $user->id) {
            return response()->json(['error' => 'Only the booking owner or an admin can release this booking.'], 403);
        }

        if (in_array($booking->status, ['Completed'], true) || in_array($booking->review_status, ['Completed'], true)) {
            return response()->json(['error' => 'Completed booking work cannot be released. Transfer it instead.'], 422);
        }

        $booking->update([
            'assigned_to' => null,
            'transfer_requested_to' => null,
            'transfer_requested_by' => null,
            'transfer_requested_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking returned to the unassigned queue.',
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'transferRequestedTo', 'transferRequestedBy', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
        ]);
    }

    public function updateReviewStatus(Request $request, int $id)
    {
        $data = $request->validate([
            'review_status' => 'required|in:Submitted,Under Review,Needs Customer Details,Clarification Received,Approved For Reservation,Not Available,Completed',
            'override' => 'sometimes|boolean',
            'override_reason' => 'nullable|string|max:1000',
        ]);

        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        if ($guard = $this->ensureCanMutateBooking($booking)) {
            return $guard;
        }

        if ($data['review_status'] === 'Completed') {
            return $this->completeBooking($request, $booking);
        }

        $booking->update([
            'review_status' => $data['review_status'],
            'assigned_to' => $booking->assigned_to ?: Auth::id(),
            'reviewed_at' => in_array($data['review_status'], ['Approved For Reservation', 'Not Available', 'Completed'], true) ? now() : $booking->reviewed_at,
        ]);

        if ($data['review_status'] === 'Approved For Reservation') {
            EventPreparationService::ensureDefaultTasks($booking->fresh());
        }

        return response()->json([
            'success' => true,
            'message' => 'Review status updated.',
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
        ]);
    }

    public function complete(Request $request, int $id)
    {
        $data = $request->validate([
            'override' => 'sometimes|boolean',
            'override_reason' => 'nullable|string|max:1000',
        ]);

        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        if ($guard = $this->ensureCanMutateBooking($booking)) {
            return $guard;
        }

        return $this->completeBooking($request, $booking, (bool) ($data['override'] ?? false), $data['override_reason'] ?? null);
    }

    private function completeBooking(Request $request, Booking $booking, ?bool $override = null, ?string $overrideReason = null)
    {
        $override = $override ?? $request->boolean('override');
        $overrideReason = $overrideReason ?? $request->input('override_reason');

        if ($override && Auth::user()?->role !== 'Admin') {
            return response()->json(['error' => 'Only admin users can override event completion blockers.'], 403);
        }

        $result = app(BookingCompletionService::class)
            ->complete($booking, Auth::user(), $override, $overrideReason);

        if (! $result['completed']) {
            return response()->json([
                'error' => 'This booking is not ready to complete.',
                'blockers' => $result['blockers'],
                'summary' => $result['summary'],
                'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'reviewTasks', 'preparationTasks', 'historyNotes', 'payments'])),
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Event completed and feedback request sent.',
            'booking' => new BookingSummaryResource($result['booking']),
            'post_event_status' => $result['booking']->post_event_status,
            'feedback_request_id' => $result['feedback_request']?->id,
        ]);
    }

    public function requestClarification(Request $request, int $id)
    {
        $data = $request->validate([
            'message' => 'required|string|min:5|max:3000',
        ]);

        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        if ($guard = $this->ensureCanMutateBooking($booking)) {
            return $guard;
        }

        $booking->update([
            'review_status' => 'Needs Customer Details',
            'assigned_to' => $booking->assigned_to ?: Auth::id(),
            'clarification_request' => $data['message'],
            'clarification_response' => null,
            'clarification_requested_at' => now(),
            'clarification_responded_at' => null,
        ]);

        BookingReviewTask::create([
            'booking_id' => $booking->id,
            'task_type' => 'clarification',
            'label' => $data['message'],
            'status' => 'Needs Customer',
            'assigned_to' => Auth::id(),
            'customer_visible' => true,
        ]);

        ConversionEventService::record('clarification_requested', [
            'booking' => $booking,
            'source' => Auth::user()?->role === 'Admin' ? 'admin_override' : 'marketing_workspace',
            'metadata' => [
                'message_length' => mb_strlen($data['message']),
            ],
        ]);

        try {
            app(NotificationRecipientService::class)
                ->sendToUser($booking->user, new BookingStatusNotification($booking, 'Needs Customer Details'), 'clarification_requested');
        } catch (\Throwable $e) {
            Log::warning('Clarification notification failed.', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Details requested from customer.',
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
        ]);
    }

    public function sendReminder(Request $request, int $id)
    {
        $booking = Booking::with(['user', 'payments' => fn ($paymentQuery) => $paymentQuery->active()])->find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        if ($guard = $this->ensureCanMutateBooking($booking)) {
            return $guard;
        }

        $data = $request->validate([
            'message' => ['nullable', 'string', 'max:1000'],
        ]);

        $email = $booking->client_email ?: $booking->user?->email;
        if (! $email) {
            return response()->json(['error' => 'No customer email is available for this booking.'], 422);
        }

        $journey = app(\App\Services\BookingJourneyService::class)->summarize($booking);
        $nextAction = $journey['next_action']['description'] ?? 'Please review the remaining details for your booking.';
        $customMessage = trim((string) ($data['message'] ?? ''));

        try {
            Mail::raw(
                ($customMessage ?: $nextAction)."\n\nBooking #{$booking->id}: ".($booking->event_name ?: $booking->event_type ?: 'Eloquente event')."\n\nYou can continue from your Eloquente dashboard or reply to the team for help.",
                fn ($message) => $message
                    ->to($email)
                    ->subject("Reminder for your Eloquente booking #{$booking->id}")
            );
        } catch (\Throwable $exception) {
            Log::warning('Booking reminder email failed.', [
                'booking_id' => $booking->id,
                'message' => $exception->getMessage(),
            ]);

            return response()->json(['error' => 'Could not send the reminder email right now.'], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Reminder email sent.',
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'reviewTasks', 'preparationTasks', 'historyNotes', 'payments'])),
        ]);
    }

    public function updateReviewTask(Request $request, int $bookingId, int $taskId)
    {
        $data = $request->validate([
            'status' => 'required|in:Pending,Done,Needs Customer,Customer Responded',
        ]);

        $booking = Booking::find($bookingId);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        if ($guard = $this->ensureCanMutateBooking($booking)) {
            return $guard;
        }

        $task = BookingReviewTask::where('booking_id', $bookingId)->find($taskId);

        if (! $task) {
            return response()->json(['error' => 'Review task not found'], 404);
        }

        $task->update([
            'status' => $data['status'],
            'completed_by' => $data['status'] === 'Done' ? Auth::id() : null,
            'completed_at' => $data['status'] === 'Done' ? now() : null,
        ]);

        $booking = Booking::with(['user', 'assignee', 'reviewTasks', 'preparationTasks', 'historyNotes'])->find($bookingId);

        return response()->json([
            'success' => true,
            'message' => 'Review checklist updated.',
            'booking' => new BookingSummaryResource($booking),
        ]);
    }

    /**
     * Update booking live status (real-time tracking).
     * Ported from: marketing booking live status update
     */
    public function updateLiveStatus(Request $request, int $id)
    {
        $validStatuses = ['Not Started', 'On the Way', 'Preparing', 'Serving', 'Completed'];

        $request->validate([
            'live_status' => 'required|in:'.implode(',', $validStatuses),
        ]);

        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        if ($guard = $this->ensureCanMutateBooking($booking)) {
            return $guard;
        }

        if ($booking->status !== 'Confirmed') {
            return response()->json([
                'error' => 'Live tracking unlocks after the booking is approved.',
                'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
            ], 422);
        }

        $previousLiveStatus = $booking->live_status ?: 'Not Started';
        $booking->update(['live_status' => $request->live_status]);
        $freshBooking = $booking->fresh(['user', 'assignee', 'reviewTasks', 'preparationTasks', 'historyNotes']);

        if ($previousLiveStatus !== $request->live_status) {
            $this->sendLiveStatusUpdates($freshBooking, $request->live_status);
        }

        app(OperationalBroadcastService::class)
            ->bookingChanged($freshBooking, 'live_status_updated', 'Live status updated.');

        return response()->json([
            'success' => true,
            'message' => 'Live status updated',
            'booking' => new BookingSummaryResource($freshBooking),
        ]);
    }

    /**
     * Get detailed booking info.
     * Ported from: marketing booking details
     */
    public function show(int $id)
    {
        $booking = Booking::with(['user:id,full_name,username,email,phone,role', 'assignee:id,full_name,username', 'transferRequestedTo:id,full_name,username', 'transferRequestedBy:id,full_name,username', 'reviewTasks', 'preparationTasks', 'historyNotes:id,booking_id,user_id,body,created_at'])->find($id);

        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $data = $booking->toArray();
        $data['username'] = $booking->user->username ?? null;
        $data['role'] = $booking->user->role ?? null;
        $summary = (new BookingSummaryResource($booking))->resolve();
        $data = array_merge($data, $summary);

        return response()->json($data);
    }

    private function ensureCanMutateBooking(Booking $booking)
    {
        $user = Auth::user();
        $booking->refresh();

        if (! $user || ! in_array($user->role, ['Marketing', 'Admin'], true)) {
            return response()->json(['error' => 'Only Marketing or Admin can update bookings.'], 403);
        }

        if ($user->role === 'Admin') {
            return null;
        }

        if ((int) $booking->assigned_to === (int) $user->id) {
            return null;
        }

        if (is_null($booking->assigned_to)) {
            return response()->json([
                'error' => 'Claim this booking before making changes.',
                'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
            ], 403);
        }

        $booking->loadMissing('assignee:id,full_name,username');
        $ownerName = $booking->assignee?->full_name ?: ($booking->assignee->username ?? 'another staff member');

        return response()->json([
            'error' => "This booking is owned by {$ownerName}. Ask the owner or an admin to transfer it before making changes.",
            'booking' => new BookingSummaryResource($booking->fresh(['user', 'assignee', 'reviewTasks', 'preparationTasks', 'historyNotes'])),
        ], 403);
    }

    private function sendLiveStatusUpdates(Booking $booking, string $liveStatus): void
    {
        if ($booking->user) {
            app(NotificationRecipientService::class)
                ->sendToUser($booking->user, new BookingLiveStatusNotification($booking, $liveStatus), 'booking_live_status_update');
        }

        $email = $booking->client_email ?: $booking->user?->email;

        if (! $email) {
            return;
        }

        try {
            Mail::to($email)->send(new BookingLiveStatusUpdate($booking, $liveStatus, Auth::user()));
        } catch (\Throwable $exception) {
            Log::warning('Live status email delivery failed.', [
                'booking_id' => $booking->id,
                'live_status' => $liveStatus,
                'message' => $exception->getMessage(),
            ]);
        }
    }

    private function findDuplicateUser(?string $email, ?string $phone): ?User
    {
        $email = filled($email) ? strtolower(trim($email)) : null;
        $phone = filled($phone) ? preg_replace('/\D+/', '', $phone) : null;

        if (! $email && ! $phone) {
            return null;
        }

        return User::query()
            ->where('role', 'Client')
            ->where(function ($query) use ($email, $phone) {
                if ($email) {
                    $query->orWhereRaw('LOWER(email) = ?', [$email]);
                }
                if ($phone) {
                    $query->orWhere('phone', $phone);
                }
            })
            ->orderByRaw("CASE WHEN account_status IS NULL OR account_status = 'active' THEN 0 ELSE 1 END")
            ->first();
    }
}
