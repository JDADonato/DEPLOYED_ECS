<?php

namespace App\Http\Controllers;

use App\Models\FoodTasting;
use App\Models\User;
use App\Services\FoodTastingScheduleService;
use App\Services\OperationalBroadcastService;
use App\Support\ResourceVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Ported from: server/controllers/foodTastingController.js
 * Handles food tasting scheduling for both guests and authenticated users.
 */
class FoodTastingController extends Controller
{
    /**
     * Create a food tasting request.
     * Ported from: foodTastingController.createTasting()
     * Supports both guest (unauthenticated) and logged-in users.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'guest_name' => 'required|string',
            'guest_email' => 'required|email',
            'guest_phone' => 'nullable|string',
            'preferred_date' => 'required|date',
            'preferred_time' => 'required|string',
            'notes' => 'nullable|string',
            'website' => 'nullable|prohibited',
        ]);

        FoodTastingScheduleService::validateCustomerSlot($data['preferred_date'], $data['preferred_time']);

        $userId = Auth::check() ? Auth::id() : null;
        $duplicateUser = $this->findDuplicateUser($data['guest_email'], $data['guest_phone'] ?? null);

        $tasting = FoodTasting::create([
            'user_id' => $userId,
            'guest_name' => $data['guest_name'],
            'guest_email' => $data['guest_email'],
            'guest_phone' => $data['guest_phone'] ?? null,
            'preferred_date' => $data['preferred_date'],
            'preferred_time' => $data['preferred_time'],
            'notes' => $data['notes'] ?? null,
            'duplicate_user_id' => $duplicateUser?->id,
        ]);
        app(OperationalBroadcastService::class)
            ->staffQueueChanged('food_tastings', 'food_tasting', $tasting->id, 'created', 'New food tasting request.');

        return response()->json([
            'success' => true,
            'message' => 'Food tasting scheduled successfully!',
            'tastingId' => $tasting->id,
        ], 201);
    }

    /**
     * Get tastings for the authenticated user.
     * Ported from: foodTastingController.getMyTastings()
     */
    public function index()
    {
        $tastings = FoodTasting::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tastings);
    }

    public function availability(Request $request)
    {
        $data = $request->validate([
            'year' => ['required', 'integer', 'min:2024', 'max:2100'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
        ]);

        return response()->json([
            'capacity' => FoodTastingScheduleService::DAILY_CAPACITY,
            'capacity_statuses' => FoodTastingScheduleService::CAPACITY_STATUSES,
            'full_dates' => FoodTastingScheduleService::fullDatesForMonth((int) $data['year'], (int) $data['month']),
        ]);
    }

    public function update(Request $request, $id)
    {
        $tasting = FoodTasting::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $data = $request->validate([
            'guest_name' => 'required|string',
            'guest_email' => 'required|email',
            'guest_phone' => 'nullable|string',
            'preferred_date' => 'required|date',
            'preferred_time' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        FoodTastingScheduleService::validateCustomerSlot($data['preferred_date'], $data['preferred_time'], $tasting->id);

        $tasting->update($data);
        app(OperationalBroadcastService::class)
            ->staffQueueChanged('food_tastings', 'food_tasting', $tasting->id, 'updated', 'Food tasting request updated.');

        return response()->json(['message' => 'Food tasting updated.']);
    }

    public function destroy($id)
    {
        return $this->cancel($id);
    }

    public function cancel($id)
    {
        $tasting = FoodTasting::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $tasting->update(['status' => 'Cancelled']);
        app(OperationalBroadcastService::class)
            ->staffQueueChanged('food_tastings', 'food_tasting', $tasting->id, 'cancelled', 'Food tasting request cancelled.');

        return response()->json(['message' => 'Food tasting cancelled.']);
    }

    public function staffIndex(Request $request)
    {
        $query = FoodTasting::query()
            ->with(['user:id,full_name,username,email,phone,account_status', 'duplicateUser:id,full_name,username,email,phone,account_status', 'handler:id,full_name,username', 'transferRequestedTo:id,full_name,username', 'transferRequestedBy:id,full_name,username'])
            ->latest('preferred_date')
            ->latest('created_at');

        if ($request->filled('status') && $request->query('status') !== 'All') {
            $query->where('status', $request->query('status'));
        } else {
            $query->whereNotIn('status', ['Archived', 'Spam']);
        }

        if ($request->filled('from')) {
            $query->whereDate('preferred_date', '>=', $request->query('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('preferred_date', '<=', $request->query('to'));
        }

        $user = $request->user();
        if ($request->query('ownership') === 'unclaimed') {
            $query->whereNull('handled_by');
        } elseif ($request->query('ownership') === 'claimed') {
            $query->whereNotNull('handled_by');
        } elseif ($request->query('ownership') === 'mine' && $user) {
            $query->where('handled_by', $user->id);
        }

        $versionMeta = ResourceVersion::fromQuery($query);
        if (ResourceVersion::matches($request, $versionMeta)) {
            return ResourceVersion::unchanged($versionMeta);
        }

        $format = fn (FoodTasting $tasting) => $this->formatStaffTasting($tasting);

        if ($request->boolean('paginated') || $request->has('page') || $request->has('per_page')) {
            $perPage = min(max((int) $request->query('per_page', 25), 1), 75);
            $paginator = $query->paginate($perPage);

            return response()->json([
                'data' => collect($paginator->items())->map($format)->values(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'last_page' => $paginator->lastPage(),
                    ...$versionMeta,
                    'changed' => true,
                ],
            ]);
        }

        return response()->json($query->limit(200)->get()->map($format));
    }

    public function staffUpdate(Request $request, FoodTasting $tasting)
    {
        $data = $request->validate([
            'status' => ['required', 'in:Pending,Contacted,Approved,Confirmed,Completed,Cancelled,Rescheduled,Archived,Spam'],
            'preferred_date' => ['nullable', 'date'],
            'preferred_time' => ['nullable', 'string', 'max:120'],
            'outcome_notes' => ['nullable', 'string', 'max:2000'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $status = $data['status'];
        $tasting->fill([
            'status' => $status,
            'preferred_date' => $data['preferred_date'] ?? $tasting->preferred_date,
            'preferred_time' => $data['preferred_time'] ?? $tasting->preferred_time,
            'notes' => array_key_exists('notes', $data) ? $data['notes'] : $tasting->notes,
            'outcome_notes' => array_key_exists('outcome_notes', $data) ? $data['outcome_notes'] : $tasting->outcome_notes,
            'handled_by' => Auth::id(),
        ]);

        if (in_array($status, ['Approved', 'Confirmed'], true) && ! $tasting->confirmed_at) {
            $tasting->confirmed_at = now();
        }

        if ($status === 'Completed' && ! $tasting->completed_at) {
            $tasting->completed_at = now();
        }

        if (in_array($status, ['Archived', 'Spam'], true) && ! $tasting->archived_at) {
            $tasting->archived_at = now();
        } elseif (! in_array($status, ['Archived', 'Spam'], true)) {
            $tasting->archived_at = null;
        }

        $previousStatus = $tasting->getOriginal('status');
        $tasting->save();
        $tasting->load(['user', 'handler', 'transferRequestedTo', 'transferRequestedBy', 'duplicateUser']);

        if ($previousStatus !== $status && in_array($status, ['Confirmed', 'Rescheduled', 'Cancelled', 'Completed'], true)) {
            $this->sendTastingStatusEmail($tasting, $status);
        }

        app(OperationalBroadcastService::class)
            ->staffQueueChanged('food_tastings', 'food_tasting', $tasting->id, 'updated', 'Food tasting status changed.');

        return response()->json([
            'message' => 'Food tasting updated.',
            'tasting' => $this->formatStaffTasting($tasting->fresh(['user', 'handler', 'transferRequestedTo', 'transferRequestedBy', 'duplicateUser'])),
        ]);
    }

    public function staffClaim(FoodTasting $tasting)
    {
        if ($tasting->handled_by && (int) $tasting->handled_by !== (int) Auth::id()) {
            return response()->json(['error' => 'This tasting is already owned by another staff member.'], 409);
        }

        $tasting->update([
            'handled_by' => Auth::id(),
            'transfer_requested_to' => null,
            'transfer_requested_by' => null,
            'transfer_requested_at' => null,
        ]);

        app(OperationalBroadcastService::class)
            ->staffQueueChanged('food_tastings', 'food_tasting', $tasting->id, 'claimed', 'Food tasting claimed.');

        return response()->json([
            'message' => 'Food tasting claimed.',
            'tasting' => $this->formatStaffTasting($tasting->fresh(['user', 'handler', 'transferRequestedTo', 'transferRequestedBy', 'duplicateUser'])),
        ]);
    }

    public function staffRelease(FoodTasting $tasting)
    {
        if (Auth::user()?->role !== 'Admin' && (int) $tasting->handled_by !== (int) Auth::id()) {
            return response()->json(['error' => 'Only the owner or admin can release this tasting.'], 403);
        }

        $tasting->update([
            'handled_by' => null,
            'transfer_requested_to' => null,
            'transfer_requested_by' => null,
            'transfer_requested_at' => null,
        ]);

        app(OperationalBroadcastService::class)
            ->staffQueueChanged('food_tastings', 'food_tasting', $tasting->id, 'released', 'Food tasting released.');

        return response()->json([
            'message' => 'Food tasting released.',
            'tasting' => $this->formatStaffTasting($tasting->fresh(['user', 'handler', 'transferRequestedTo', 'transferRequestedBy', 'duplicateUser'])),
        ]);
    }

    public function staffRequestTransfer(FoodTasting $tasting)
    {
        if (Auth::user()?->role !== 'Marketing') {
            return response()->json(['error' => 'Only Marketing staff can request tasting transfers.'], 403);
        }
        if (! $tasting->handled_by) {
            return response()->json(['error' => 'This tasting is unassigned. Claim it instead.'], 422);
        }
        if ((int) $tasting->handled_by === (int) Auth::id()) {
            return response()->json(['error' => 'This tasting is already assigned to you.'], 422);
        }
        if ($tasting->transfer_requested_to || $tasting->transfer_requested_by) {
            return response()->json(['error' => 'A transfer request is already pending.'], 422);
        }

        $tasting->update([
            'transfer_requested_to' => $tasting->handled_by,
            'transfer_requested_by' => Auth::id(),
            'transfer_requested_at' => now(),
        ]);

        return response()->json([
            'message' => 'Transfer request sent to the current owner.',
            'tasting' => $this->formatStaffTasting($tasting->fresh(['user', 'handler', 'transferRequestedTo', 'transferRequestedBy', 'duplicateUser'])),
        ]);
    }

    public function staffAcceptTransfer(FoodTasting $tasting)
    {
        if (Auth::user()?->role !== 'Marketing' || (int) $tasting->transfer_requested_to !== (int) Auth::id()) {
            return response()->json(['error' => 'Only the requested staff member can accept this transfer.'], 403);
        }

        $newOwnerId = (int) $tasting->handled_by === (int) $tasting->transfer_requested_to
            ? $tasting->transfer_requested_by
            : Auth::id();

        $tasting->update([
            'handled_by' => $newOwnerId,
            'transfer_requested_to' => null,
            'transfer_requested_by' => null,
            'transfer_requested_at' => null,
        ]);

        return response()->json([
            'message' => 'Food tasting transfer accepted.',
            'tasting' => $this->formatStaffTasting($tasting->fresh(['user', 'handler', 'transferRequestedTo', 'transferRequestedBy', 'duplicateUser'])),
        ]);
    }

    public function staffDeclineTransfer(FoodTasting $tasting)
    {
        $canDecline = Auth::user()?->role === 'Admin'
            || (int) $tasting->transfer_requested_to === (int) Auth::id()
            || (int) $tasting->handled_by === (int) Auth::id();

        if (! $canDecline) {
            return response()->json(['error' => 'Only the owner, requested staff member, or admin can decline this transfer.'], 403);
        }

        $tasting->update([
            'transfer_requested_to' => null,
            'transfer_requested_by' => null,
            'transfer_requested_at' => null,
        ]);

        return response()->json([
            'message' => 'Food tasting transfer declined.',
            'tasting' => $this->formatStaffTasting($tasting->fresh(['user', 'handler', 'transferRequestedTo', 'transferRequestedBy', 'duplicateUser'])),
        ]);
    }

    public function staffCancelTransfer(FoodTasting $tasting)
    {
        $canCancel = Auth::user()?->role === 'Admin'
            || (int) $tasting->transfer_requested_by === (int) Auth::id()
            || (int) $tasting->handled_by === (int) Auth::id();

        if (! $canCancel) {
            return response()->json(['error' => 'Only the requester, owner, or admin can cancel this transfer.'], 403);
        }

        $tasting->update([
            'transfer_requested_to' => null,
            'transfer_requested_by' => null,
            'transfer_requested_at' => null,
        ]);

        return response()->json([
            'message' => 'Food tasting transfer cancelled.',
            'tasting' => $this->formatStaffTasting($tasting->fresh(['user', 'handler', 'transferRequestedTo', 'transferRequestedBy', 'duplicateUser'])),
        ]);
    }

    private function formatStaffTasting(FoodTasting $tasting): array
    {
        return [
            'id' => $tasting->id,
            'client_name' => $tasting->guest_name ?: $tasting->user?->full_name ?: $tasting->user?->username,
            'client_email' => $tasting->guest_email ?: $tasting->user?->email,
            'client_phone' => $tasting->guest_phone ?: $tasting->user?->phone,
            'preferred_date' => $tasting->preferred_date?->toDateString(),
            'preferred_time' => $tasting->preferred_time,
            'status' => $tasting->status,
            'notes' => $tasting->notes,
            'outcome_notes' => $tasting->outcome_notes,
            'confirmed_at' => $tasting->confirmed_at,
            'completed_at' => $tasting->completed_at,
            'handled_by' => $tasting->handled_by,
            'owner_id' => $tasting->handled_by,
            'owner_name' => $tasting->handler?->full_name ?: ($tasting->handler?->username),
            'ownership_label' => $this->ownershipLabel($tasting),
            'can_claim' => is_null($tasting->handled_by),
            'can_edit' => Auth::user()?->role === 'Admin' || (int) $tasting->handled_by === (int) Auth::id(),
            'can_request_transfer' => Auth::user()?->role === 'Marketing' && ! is_null($tasting->handled_by) && (int) $tasting->handled_by !== (int) Auth::id() && is_null($tasting->transfer_requested_to),
            'can_accept_transfer' => Auth::user()?->role === 'Marketing' && (int) $tasting->transfer_requested_to === (int) Auth::id(),
            'transfer_requested_to' => $tasting->transfer_requested_to,
            'transfer_requested_to_name' => $tasting->transferRequestedTo?->full_name ?: ($tasting->transferRequestedTo?->username),
            'transfer_requested_by' => $tasting->transfer_requested_by,
            'transfer_requested_by_name' => $tasting->transferRequestedBy?->full_name ?: ($tasting->transferRequestedBy?->username),
            'transfer_requested_at' => $tasting->transfer_requested_at,
            'archived_at' => $tasting->archived_at,
            'duplicate_customer' => $tasting->duplicateUser ? [
                'id' => $tasting->duplicateUser->id,
                'name' => $tasting->duplicateUser->full_name ?: $tasting->duplicateUser->username,
                'email' => $this->safeDuplicateEmail($tasting->duplicateUser),
                'account_status' => $tasting->duplicateUser->account_status ?? 'active',
                'is_deactivated' => ! $tasting->duplicateUser->isActive(),
            ] : null,
        ];
    }

    private function ownershipLabel(FoodTasting $tasting): string
    {
        if (is_null($tasting->handled_by)) {
            return 'Unclaimed';
        }

        if ((int) $tasting->handled_by === (int) Auth::id()) {
            return 'Assigned to me';
        }

        return 'Owned by '.($tasting->handler?->full_name ?: $tasting->handler?->username ?: 'another staff member');
    }

    private function sendTastingStatusEmail(FoodTasting $tasting, string $status): void
    {
        $email = $tasting->guest_email ?: $tasting->user?->email;
        if (! $email) {
            return;
        }

        try {
            $date = $tasting->preferred_date ? $tasting->preferred_date->format('M d, Y') : 'your preferred date';
            $time = $tasting->preferred_time ?: 'your preferred time';
            Mail::raw(
                "Your Eloquente food tasting is now {$status}.\n\nSchedule: {$date} at {$time}\n\nYou can view updates from your dashboard or reply to the Eloquente team for questions.",
                fn ($message) => $message
                    ->to($email)
                    ->subject("Your Eloquente food tasting is {$status}")
            );
        } catch (\Throwable $exception) {
            Log::warning('Food tasting status email failed.', [
                'tasting_id' => $tasting->id,
                'status' => $status,
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

    private function safeDuplicateEmail(User $user): ?string
    {
        return $user->hasPlaceholderEmail() ? null : $user->email;
    }
}
