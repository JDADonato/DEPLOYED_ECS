<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingSummaryResource;
use App\Http\Resources\PublicMenuItemResource;
use App\Http\Resources\UserSummaryResource;

use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\MenuItem;
use App\Models\PricingOverride;
use App\Models\User;
use App\Notifications\BookingStatusNotification;
use App\Notifications\CustomerAccountLifecycleNotification;
use App\Notifications\StaffAccountAccessNotification;
use App\Notifications\StaffAccountLifecycleNotification;
use App\Rules\BalancedPassword;
use App\Services\AccountLifecycleService;
use App\Services\AdminReportService;
use App\Services\EmailDeliveryService;
use App\Services\EventPreparationService;
use App\Services\NotificationRecipientService;
use App\Services\OperationalBroadcastService;
use App\Support\ApiResponse;
use App\Support\AuditContext;
use App\Support\CatalogImage;
use App\Support\PasswordPolicy;
use App\Support\ResourceVersion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

/**
 * Ported from: server/controllers/adminController.js
 * Employee CRUD, pricing, discounts, and analytics.
 */
class AdminController extends Controller
{
    private const TEMPORARY_PASSWORD_TTL_HOURS = 24;

    /**
     * Show the Admin dashboard page.
     */
    public function index()
    {
        return Inertia::render('Admin/DashboardAdmin');
    }

    // ==========================================
    // 1. Employee Account Management (RBAC)
    // ==========================================

    public function getEmployees(Request $request)
    {
        $query = User::whereIn('role', ['Admin', 'Marketing', 'Accounting'])
            ->when($request->filled('role') && $request->query('role') !== 'all', fn ($q) => $q->where('role', $request->query('role')))
            ->when($request->filled('account_status') && $request->query('account_status') !== 'all', function ($q) use ($request) {
                if ($request->query('account_status') === 'active') {
                    $q->where(fn ($inner) => $inner->whereNull('account_status')->orWhere('account_status', 'active'));

                    return;
                }

                $q->where('account_status', $request->query('account_status'));
            })
            ->when($request->filled('must_change_password') && $request->query('must_change_password') !== 'all', function ($q) use ($request) {
                $request->boolean('must_change_password')
                    ? $q->whereRaw('must_change_password is true')
                    : $q->where(fn ($inner) => $inner->whereNull('must_change_password')->orWhereRaw('must_change_password is false'));
            })
            ->when($request->query('search'), function ($q, $search) {
                $term = '%'.mb_strtolower(trim((string) $search)).'%';
                $q->where(fn ($inner) => $inner
                    ->whereRaw('LOWER(full_name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(username) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(email) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(phone) LIKE ?', [$term]));
            })
            ->orderBy('created_at', 'desc');
        $versionMeta = ResourceVersion::fromQuery($query);
        if (ResourceVersion::matches($request, $versionMeta)) {
            return ResourceVersion::unchanged($versionMeta);
        }

        if ($request->boolean('paginated')) {
            $perPage = min(max((int) $request->query('per_page', 25), 1), 100);
            $employees = $query->paginate($perPage, ['id', 'full_name', 'username', 'email', 'phone', 'role', 'account_status', 'must_change_password', 'last_login_at', 'deactivated_at', 'created_at']);

            return ApiResponse::paginated($employees, UserSummaryResource::collection($employees->getCollection())->resolve(), [
                ...$versionMeta,
                'changed' => true,
            ]);
        }

        $employees = $query->get(['id', 'full_name', 'username', 'email', 'phone', 'role', 'account_status', 'must_change_password', 'last_login_at', 'deactivated_at', 'created_at']);

        return response()->json(UserSummaryResource::collection($employees)->resolve());
    }

    public function createEmployee(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'username' => 'required|string|unique:users,username',
            'email' => 'nullable|email|unique:users,email',
            'phone' => 'nullable|string',
            'role' => 'required|in:Admin,Marketing,Accounting',
        ]);

        $temporaryPassword = Str::password(14);

        $user = User::create([
            'full_name' => $request->full_name,
            'username' => $request->username,
            'password' => $temporaryPassword,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => $request->role,
            'account_status' => 'active',
            'must_change_password' => true,
            'temporary_password_expires_at' => now()->addHours(self::TEMPORARY_PASSWORD_TTL_HOURS),
            'temporary_password_secret' => $temporaryPassword,
            'password_changed_at' => now(),
            'password_policy_version' => PasswordPolicy::CURRENT_VERSION,
        ]);

        $emailDelivery = app(EmailDeliveryService::class)
            ->sendToNotifiable($user, new StaffAccountAccessNotification($temporaryPassword, 'created'), 'staff_account_created');

        $this->recordAccountAudit('Staff account created', $user, 'Succeeded', [
            'target_role' => $user->role,
            'email_delivery' => $emailDelivery['message'] ?? null,
        ]);

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'message' => 'Account created. Share the temporary password through a private channel.',
            'temporary_password' => $temporaryPassword,
            'temporary_password_expires_at' => $user->temporary_password_expires_at,
            'email_delivery' => $emailDelivery['message'],
            'email_delivery_status' => $emailDelivery,
        ], 201);
    }

    public function updateEmployee(Request $request, int $id)
    {
        $user = User::find($id);

        $request->validate([
            'full_name' => ['nullable', 'string', 'max:255'],
            'username' => ['nullable', 'string', Rule::unique('users', 'username')->ignore($id)],
            'email' => ['nullable', 'email', Rule::unique('users', 'email')->ignore($id)],
            'phone' => 'nullable|string',
            'password' => [
                'nullable',
                'string',
                new BalancedPassword($request->input('username', $user?->username), $request->input('email', $user?->email)),
            ],
            'role' => 'nullable|in:Marketing,Accounting',
        ]);

        if (! $user || in_array($user->role, ['Admin', 'Client'])) {
            return response()->json(['error' => 'Cannot modify this user'], 403);
        }

        $updates = [];
        if ($request->has('full_name')) {
            $updates['full_name'] = $request->full_name;
        }
        if ($request->has('username')) {
            $updates['username'] = $request->username;
        }
        if ($request->has('email')) {
            $updates['email'] = $request->email;
        }
        if ($request->has('phone')) {
            $updates['phone'] = $request->phone;
        }
        if ($request->has('role')) {
            $updates['role'] = $request->role;
        }
        if ($request->has('password') && $request->password) {
            $updates['password'] = Hash::make($request->password);
            $updates['must_change_password'] = true;
            $updates['temporary_password_expires_at'] = now()->addHours(self::TEMPORARY_PASSWORD_TTL_HOURS);
            $updates['temporary_password_secret'] = null;
            $updates['password_changed_at'] = now();
            $updates['password_policy_version'] = PasswordPolicy::CURRENT_VERSION;
        }

        if (empty($updates)) {
            return response()->json(['error' => 'No fields to update'], 400);
        }

        $originalRole = $user->role;
        $previousState = $user->toArray();
        $user->update($updates);

        $request->attributes->set('undo_data', [
            'action_type' => 'update_employee',
            'target_type' => User::class,
            'target_id' => $user->id,
            'details' => ['message' => 'Updated employee: ' . $user->username],
            'previous_state' => ['user' => array_diff_key($previousState, array_flip(['password', 'remember_token', 'temporary_password_secret']))],
            'new_state' => ['user' => array_diff_key($user->toArray(), array_flip(['password', 'remember_token', 'temporary_password_secret']))],
        ]);

        $emailDelivery = null;
        if (isset($updates['role']) && $updates['role'] !== $originalRole) {
            $emailDelivery = app(EmailDeliveryService::class)
                ->sendToNotifiable($user, new StaffAccountLifecycleNotification('role_changed', $user->role), 'staff_role_changed');
        }

        $this->recordAccountAudit('Staff account updated', $user, 'Succeeded', [
            'changed_fields' => array_values(array_diff(array_keys($updates), ['password', 'temporary_password_secret'])),
            'role_changed' => isset($updates['role']) && $updates['role'] !== $originalRole,
            'email_delivery' => $emailDelivery['status'] ?? null,
        ]);
        app(OperationalBroadcastService::class)
            ->adminChanged('accounts', 'user', $user->id, 'updated', 'Staff account updated.');

        return response()->json([
            'message' => 'Employee account updated successfully',
            'email_delivery' => $emailDelivery['message'] ?? null,
            'email_delivery_status' => $emailDelivery,
        ]);
    }

    public function deleteEmployee(int $id)
    {
        $user = User::find($id);

        if (! $user || in_array($user->role, ['Admin', 'Client'])) {
            return response()->json(['error' => 'Cannot delete this user'], 403);
        }

        $originalEmail = $user->email;
        $releaseSummary = app(AccountLifecycleService::class)->releaseStaffOwnership($user, Auth::id());

        $user->forceFill([
            'username' => $user->username ? sprintf('deactivated_%d_%s', $user->id, now()->format('YmdHis')) : null,
            'email' => $user->email ? sprintf('deactivated+%d+%s@eloquente.invalid', $user->id, now()->format('YmdHis')) : null,
            'account_status' => 'deactivated',
            'deactivated_at' => now(),
            'deactivated_by' => Auth::id(),
            'deactivation_reason' => 'Deactivated by administrator.',
            'temporary_password_expires_at' => null,
            'temporary_password_secret' => null,
        ])->save();

        $emailDelivery = app(EmailDeliveryService::class)
            ->sendToAddress($originalEmail, new StaffAccountLifecycleNotification('deactivated'), 'staff_deactivated');
        $this->recordAccountAudit('Staff account deactivated', $user, 'Succeeded', [
            'email_delivery' => $emailDelivery['message'] ?? null,
            'released_work' => $releaseSummary,
        ]);
        app(OperationalBroadcastService::class)
            ->adminChanged('accounts', 'user', $user->id, 'deactivated', 'Staff account deactivated.');

        request()->attributes->set('undo_data', [
            'action_type' => 'deactivate_employee',
            'target_type' => User::class,
            'target_id' => $user->id,
            'details' => ['message' => 'Deactivated employee account'],
            'previous_state' => ['user' => ['username' => $user->getOriginal('username'), 'email' => $originalEmail, 'account_status' => 'active']],
            'new_state' => ['user' => ['account_status' => 'deactivated']],
        ]);

        return response()->json([
            'message' => 'Employee account deactivated successfully',
            'email_delivery' => $emailDelivery['message'],
            'email_delivery_status' => $emailDelivery,
        ]);
    }

    public function resetEmployeePassword(int $id)
    {
        $user = User::find($id);

        if (! $user || $user->role === 'Client' || ((int) $user->id === (int) Auth::id())) {
            return response()->json(['error' => 'Cannot modify this user'], 403);
        }

        $temporaryPassword = Str::password(14);
        $user->forceFill([
            'password' => Hash::make($temporaryPassword),
            'must_change_password' => true,
            'temporary_password_expires_at' => now()->addHours(self::TEMPORARY_PASSWORD_TTL_HOURS),
            'temporary_password_secret' => $temporaryPassword,
            'password_changed_at' => now(),
            'password_policy_version' => PasswordPolicy::CURRENT_VERSION,
        ])->save();

        $emailDelivery = app(EmailDeliveryService::class)
            ->sendToNotifiable($user, new StaffAccountAccessNotification($temporaryPassword, 'reset'), 'staff_password_reset');
        $this->recordAccountAudit('Staff password reset', $user, 'Succeeded', [
            'email_delivery' => $emailDelivery['message'] ?? null,
        ]);

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'message' => 'Temporary password generated. Share it through a private channel.',
            'temporary_password' => $temporaryPassword,
            'temporary_password_expires_at' => $user->temporary_password_expires_at,
            'email_delivery' => $emailDelivery['message'],
            'email_delivery_status' => $emailDelivery,
        ]);
    }

    public function revealTemporaryPassword(int $id)
    {
        $user = User::whereIn('role', ['Admin', 'Marketing', 'Accounting'])->find($id);

        if (! $user || (int) $user->id === (int) Auth::id()) {
            return response()->json(['error' => 'Temporary password is not available for this account.'], 403);
        }

        if ($user->temporary_password_expires_at && now()->isAfter($user->temporary_password_expires_at)) {
            $user->forceFill([
                'temporary_password_secret' => null,
            ])->save();

            $this->recordAccountAudit('Temporary password viewed', $user, 'Denied', [
                'reason' => 'expired',
                'expires_at' => $user->temporary_password_expires_at,
            ]);

            return response()->json([
                'message' => 'Temporary password is no longer available. Reset temporary password to generate a new one.',
            ], 410);
        }

        if (! $user->requiresPasswordChange() || empty($user->temporary_password_secret)) {
            $this->recordAccountAudit('Temporary password viewed', $user, 'Denied', [
                'reason' => $user->requiresPasswordChange() ? 'missing_secret' : 'password_already_changed',
                'expires_at' => $user->temporary_password_expires_at,
            ]);

            return response()->json([
                'message' => 'Temporary password is no longer available. Reset temporary password to generate a new one.',
            ], 410);
        }

        $this->recordAccountAudit('Temporary password viewed', $user, 'Succeeded', [
            'expires_at' => $user->temporary_password_expires_at,
        ]);

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'temporary_password' => $user->temporary_password_secret,
            'temporary_password_expires_at' => $user->temporary_password_expires_at,
            'email_delivery' => 'This password is available until it expires or the account owner changes it.',
            'email_delivery_status' => [
                'status' => 'revealed',
                'message' => 'Temporary password was shown from secure temporary storage.',
            ],
        ]);
    }

    public function forceEmployeePasswordChange(int $id)
    {
        $user = User::find($id);

        if (! $user || $user->role === 'Client' || ((int) $user->id === (int) Auth::id())) {
            return response()->json(['error' => 'Cannot modify this user'], 403);
        }

        $user->forceFill([
            'must_change_password' => true,
            'temporary_password_expires_at' => null,
            'temporary_password_secret' => null,
        ])->save();

        $emailDelivery = app(EmailDeliveryService::class)
            ->sendToNotifiable($user, new StaffAccountLifecycleNotification('force_password_change'), 'staff_force_password_change');
        $this->recordAccountAudit('Required staff password change', $user, 'Succeeded', [
            'email_delivery' => $emailDelivery['message'] ?? null,
        ]);

        return response()->json([
            'message' => 'Staff will be asked to change password on next sign-in.',
            'email_delivery' => $emailDelivery['message'],
            'email_delivery_status' => $emailDelivery,
        ]);
    }

    public function reactivateEmployee(int $id)
    {
        $user = User::find($id);

        if (! $user || in_array($user->role, ['Admin', 'Client'])) {
            return response()->json(['error' => 'Cannot modify this user'], 403);
        }

        $user->forceFill([
            'account_status' => 'active',
            'deactivated_at' => null,
            'deactivated_by' => null,
            'deactivation_reason' => null,
        ])->save();

        $emailDelivery = app(EmailDeliveryService::class)
            ->sendToNotifiable($user, new StaffAccountLifecycleNotification('reactivated'), 'staff_reactivated');
        $this->recordAccountAudit('Staff account reactivated', $user, 'Succeeded', [
            'email_delivery' => $emailDelivery['message'] ?? null,
        ]);
        app(OperationalBroadcastService::class)
            ->adminChanged('accounts', 'user', $user->id, 'reactivated', 'Staff account reactivated.');

        return response()->json([
            'message' => 'Employee account reactivated successfully',
            'email_delivery' => $emailDelivery['message'],
            'email_delivery_status' => $emailDelivery,
        ]);
    }

    public function getCustomers(Request $request)
    {
        $status = (string) $request->query('status', 'active');

        $query = User::where('role', 'Client')
            ->select(['id', 'full_name', 'username', 'email', 'phone', 'role', 'account_status', 'last_login_at', 'deactivated_at', 'created_at'])
            ->withCount('bookings')
            ->withMax('bookings', 'event_date')
            ->when($status !== 'all', function ($q) use ($status) {
                if ($status === 'deactivated') {
                    $q->where('account_status', 'deactivated');

                    return;
                }

                $q->where(fn ($inner) => $inner
                    ->whereNull('account_status')
                    ->orWhere('account_status', 'active'));
            })
            ->when($request->query('search'), function ($q, $search) {
                $term = '%'.mb_strtolower(trim((string) $search)).'%';
                $q->where(fn ($inner) => $inner
                    ->whereRaw('LOWER(full_name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(username) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(email) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(phone) LIKE ?', [$term]));
            })
            ->when($request->filled('booking_activity') && $request->query('booking_activity') !== 'all', function ($q) use ($request) {
                match ($request->query('booking_activity')) {
                    'with_bookings' => $q->has('bookings'),
                    'without_bookings' => $q->doesntHave('bookings'),
                    default => null,
                };
            })
            ->orderBy('created_at', 'desc');
        $versionMeta = ResourceVersion::fromQuery($query);
        if (ResourceVersion::matches($request, $versionMeta)) {
            return ResourceVersion::unchanged($versionMeta);
        }

        if ($request->boolean('paginated')) {
            $perPage = min(max((int) $request->query('per_page', 25), 1), 100);

            return ApiResponse::paginated($query->paginate($perPage), null, [
                ...$versionMeta,
                'changed' => true,
            ]);
        }

        $customers = $query->get();

        return response()->json($customers);
    }

    public function updateCustomer(Request $request, int $id)
    {
        $user = User::find($id);

        $request->validate([
            'username' => ['nullable', 'string', Rule::unique('users', 'username')->ignore($id)],
            'email' => ['nullable', 'email', Rule::unique('users', 'email')->ignore($id)],
            'phone' => 'nullable|string',
            'password' => [
                'nullable',
                'string',
                new BalancedPassword($request->input('username', $user?->username), $request->input('email', $user?->email)),
            ],
        ]);

        if (! $user || $user->role !== 'Client') {
            return response()->json(['error' => 'Cannot modify this user'], 403);
        }

        $updates = [];
        if ($request->has('username')) {
            $updates['username'] = $request->username;
        }
        if ($request->has('email')) {
            $updates['email'] = $request->email;
        }
        if ($request->has('phone')) {
            $updates['phone'] = $request->phone;
        }
        if ($request->has('password') && $request->password) {
            $updates['password'] = Hash::make($request->password);
            $updates['password_changed_at'] = now();
            $updates['password_policy_version'] = PasswordPolicy::CURRENT_VERSION;
        }

        if (empty($updates)) {
            return response()->json(['error' => 'No fields to update'], 400);
        }

        $user->update($updates);

        $this->recordAccountAudit('Customer account updated', $user, 'Succeeded', [
            'changed_fields' => array_values(array_diff(array_keys($updates), ['password'])),
        ]);

        return response()->json(['message' => 'Customer account updated successfully']);
    }

    public function deleteCustomer(Request $request, int $id)
    {
        $user = User::find($id);

        if (! $user || $user->role !== 'Client') {
            return response()->json(['error' => 'Cannot delete this user'], 403);
        }

        $originalEmail = $user->email;
        $notifyCustomer = $request->boolean('notify_customer', true);

        $archivedConversations = app(AccountLifecycleService::class)
            ->archiveCustomerConversations($user, Auth::id());

        $user->forceFill([
            'account_status' => 'deactivated',
            'deactivated_at' => now(),
            'deactivated_by' => Auth::id(),
            'deactivation_reason' => 'Deactivated by administrator.',
        ])->save();

        $emailDelivery = app(EmailDeliveryService::class)
            ->sendToAddress($originalEmail, new CustomerAccountLifecycleNotification('deactivated'), 'customer_deactivated', $notifyCustomer);
        $this->recordAccountAudit('Customer account deactivated', $user, 'Succeeded', [
            'notification' => $emailDelivery['status'],
            'archived_conversations' => $archivedConversations,
        ]);
        app(OperationalBroadcastService::class)
            ->adminChanged('accounts', 'user', $user->id, 'deactivated', 'Customer account deactivated.');

        return response()->json([
            'message' => 'Customer account deactivated. Booking and payment records were preserved.',
            'email_delivery' => $emailDelivery['message'],
            'email_delivery_status' => $emailDelivery,
        ]);
    }

    public function reactivateCustomer(Request $request, int $id)
    {
        $user = User::find($id);

        if (! $user || $user->role !== 'Client') {
            return response()->json(['error' => 'Cannot modify this user'], 403);
        }

        $user->forceFill([
            'account_status' => 'active',
            'deactivated_at' => null,
            'deactivated_by' => null,
            'deactivation_reason' => null,
        ])->save();

        $emailDelivery = app(EmailDeliveryService::class)
            ->sendToAddress($user->email, new CustomerAccountLifecycleNotification('reactivated'), 'customer_reactivated', $request->boolean('notify_customer', true));
        $this->recordAccountAudit('Customer account reactivated', $user, 'Succeeded', [
            'notification' => $emailDelivery['status'],
        ]);
        app(OperationalBroadcastService::class)
            ->adminChanged('accounts', 'user', $user->id, 'reactivated', 'Customer account reactivated.');

        return response()->json([
            'message' => 'Customer account reactivated successfully',
            'email_delivery' => $emailDelivery['message'],
            'email_delivery_status' => $emailDelivery,
        ]);
    }

    public function deliveryDiagnostics(EmailDeliveryService $emailDelivery): JsonResponse
    {
        return response()->json($emailDelivery->diagnostics());
    }

    public function sendDiagnosticEmail(Request $request, EmailDeliveryService $emailDelivery): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $result = $emailDelivery->sendDiagnostic($data['email']);

        return response()->json([
            'message' => $result['message'],
            'email_delivery' => $result['message'],
            'email_delivery_status' => $result,
        ], $result['status'] === 'failed' || $result['status'] === 'mail_not_configured' ? 422 : 200);
    }

    private function recordAccountAudit(string $action, ?User $target, string $result, array $metadata = []): void
    {
        try {
            $actor = Auth::user();
            if (! $actor) {
                return;
            }

            AuditLog::create([
                'user_id' => $actor->id,
                'username' => $actor->username,
                'role' => $actor->role,
                'action' => $action,
                'method' => request()->method(),
                'path' => '/'.ltrim(request()->path(), '/'),
                'status_code' => 200,
                'ip_address' => request()->ip(),
                'user_agent' => Str::limit((string) request()->userAgent(), 500, ''),
                'metadata' => AuditContext::forAccount(request(), $target, $result, array_merge([
                    'explicit_account_audit' => true,
                    'target_user_id' => $target?->id,
                    'target_role' => $target?->role,
                ], $metadata)),
            ]);
        } catch (\Throwable $e) {
            Log::warning('Unable to record account audit log.', [
                'action' => $action,
                'target_user_id' => $target?->id,
                'message' => $e->getMessage(),
            ]);
        }
    }

    // ==========================================
    // 2. Admin Booking Management
    // ==========================================

    public function getBookings(Request $request)
    {
        $query = Booking::query()
            ->select([
                'id',
                'user_id',
                'booking_source',
                'created_by_staff_id',
                'event_date',
                'event_time',
                'pax',
                'budget',
                'package_id',
                'event_type',
                'event_name',
                'client_full_name',
                'client_email',
                'client_phone',
                'venue_address_line',
                'venue_street',
                'venue_city',
                'venue_province',
                'venue_zip_code',
                'total_cost',
                'status',
                'review_status',
                'assigned_to',
                'transfer_requested_to',
                'transfer_requested_by',
                'transfer_requested_at',
                'clarification_request',
                'clarification_response',
                'clarification_requested_at',
                'clarification_responded_at',
                'reviewed_at',
                'live_status',
                'selected_menu',
                'created_at',
            ])
            ->with([
                'user:id,full_name,username,email,phone,role',
                'assignee:id,full_name,username',
                'createdByStaff:id,full_name,username',
                'transferRequestedTo:id,full_name,username',
                'transferRequestedBy:id,full_name,username',
                'reviewTasks:id,booking_id,task_type,label,status,customer_visible,customer_response,completed_at',
                'preparationTasks:id,booking_id,department,label,status,due_at,completed_at',
                'payments:id,booking_id,amount,status,payment_type,due_date',
                'package:id,name,base_price_per_head,menu_structure',
            ])
            ->when(! $request->boolean('include_history'), fn ($q) => $q->whereNotIn('status', ['Cancelled', 'cancelled', 'Completed', 'completed']))
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('source'), function ($q, $source) {
                if ($source === 'customer') {
                    $q->where(fn ($inner) => $inner->whereNull('booking_source')->orWhere('booking_source', 'customer'));

                    return;
                }

                $q->where('booking_source', $source);
            })
            ->when($request->query('search'), function ($q, $search) {
                $term = '%'.mb_strtolower(trim((string) $search)).'%';
                $q->where(fn ($inner) => $inner
                    ->whereRaw('LOWER(client_full_name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(event_name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(client_email) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(client_phone) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(venue_city) LIKE ?', [$term])
                    ->orWhereHas('user', fn ($userQuery) => $userQuery
                        ->whereRaw('LOWER(full_name) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(username) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(phone) LIKE ?', [$term])));
            })
            ->orderBy('created_at', 'desc');

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

    public function updateBookingStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:Confirmed',
        ]);

        $booking = Booking::find($id);
        if (! $booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        if ($booking->status === $request->status) {
            return response()->json([
                'success' => true,
                'message' => 'Booking status already up to date',
                'booking' => $booking,
            ]);
        }

        if ($booking->status !== 'Pending') {
            return response()->json(['error' => 'Only pending bookings can be approved from this screen.'], 422);
        }

        $request->attributes->set('undo_data', [
            'action_type' => 'update_booking_status',
            'target_type' => Booking::class,
            'target_id' => $booking->id,
            'details' => ['message' => 'Updated status to ' . $request->status],
            'previous_state' => ['status' => $booking->status],
            'new_state' => ['status' => $request->status],
        ]);

        $booking->update([
            'status' => $request->status,
            'review_status' => 'Approved For Reservation',
            'reviewed_at' => now(),
        ]);
        EventPreparationService::ensureDefaultTasks($booking->fresh());
        Cache::put('admin.analytics.version', (int) Cache::get('admin.analytics.version', 1) + 1);
        $booking->refresh();

        try {
            $client = User::find($booking->user_id);
            app(NotificationRecipientService::class)
                ->sendToUser($client, new BookingStatusNotification($booking, $request->status), 'admin_booking_status_update');
        } catch (\Exception $e) {
            Log::error("Notification failed on admin booking approval: {$e->getMessage()}");
        }
        app(OperationalBroadcastService::class)
            ->bookingChanged($booking->fresh(), 'approved', 'Booking approved.');

        return response()->json([
            'success' => true,
            'message' => 'Booking approved successfully',
            'booking' => $booking,
        ]);
    }

    // ==========================================
    // 3. Global Pricing Control
    // ==========================================

    public function getPricingOverrides()
    {
        try {
            $isStaff = in_array(Auth::user()?->role, ['Admin', 'Marketing', 'Accounting'], true);

            $pricingMap = Cache::remember('pricing.overrides.map', now()->addMinutes(5), function () {
                $overrides = PricingOverride::all();
                $map = [];
                foreach ($overrides as $item) {
                    $map[$item->id] = $item->new_price;
                }

                return $map;
            });

            // Strip internal overrides for non-staff callers — only expose the price map
            if (! $isStaff) {
                return response()->json(['overrides' => $pricingMap]);
            }

            return response()->json(['overrides' => $pricingMap]);
        } catch (\Exception $e) {
            return response()->json(['overrides' => []]);
        }
    }

    public function updatePricingOverride(Request $request)
    {
        $request->validate([
            'id' => 'required|string',
            'item_type' => 'required|string',
            'item_id' => 'required|string',
            'new_price' => 'required|numeric',
        ]);

        PricingOverride::updateOrCreate(
            ['id' => $request->id],
            [
                'item_type' => $request->item_type,
                'item_id' => $request->item_id,
                'new_price' => $request->new_price,
            ]
        );
        Cache::forget('pricing.overrides.map');

        return response()->json(['message' => 'Pricing updated successfully']);
    }

    // ==========================================
    // 4. Custom On-The-Fly Discounts
    // ==========================================

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
        $currentTotal = (float) ($booking->total_cost ?? 0);
        $existingDiscountValue = (float) ($booking->discount_value ?? 0);
        $existingDiscountType = $booking->discount_type;

        if ($existingDiscountValue > 0 && $existingDiscountType === 'percentage' && $existingDiscountValue < 100) {
            $originalAmount = $currentTotal / (1 - ($existingDiscountValue / 100));
        } elseif ($existingDiscountValue > 0 && $existingDiscountType === 'fixed') {
            $originalAmount = $currentTotal + $existingDiscountValue;
        } else {
            $originalAmount = $currentTotal;
        }

        $discountValue = (float) $request->discount_value;
        $discountType = $request->discount_type;

        if ($discountType === 'percentage') {
            if ($discountValue >= 100) {
                return response()->json(['error' => 'Percentage discount must be less than 100%.'], 422);
            }
            $deduction = $originalAmount * ($discountValue / 100);
            $newTotalCost = $originalAmount - $deduction;
            $appliedDiscount = $deduction;
        } else {
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

        Cache::put('admin.analytics.version', (int) Cache::get('admin.analytics.version', 1) + 1);

        return response()->json([
            'message' => 'Discount applied successfully',
            'new_total_cost' => $newTotalCost,
            'original_amount' => round($originalAmount, 2),
            'discount_applied' => round($appliedDiscount, 2),
            'payments' => $booking->fresh(['payments'])->payments,
        ]);
    }

    // ==========================================
    // 5. Decision Support System (DSS): Analytics
    // ==========================================

    public function getAnalytics(Request $request, AdminReportService $reports)
    {
        $filters = $this->analyticsFilters($request);

        return response()->json($reports->analytics($filters));
    }

    public function getAnalyticsSummary(Request $request, AdminReportService $reports)
    {
        return response()->json($reports->analyticsSummary($this->analyticsFilters($request)));
    }

    public function getAnalyticsRevenue(Request $request, AdminReportService $reports)
    {
        return response()->json($reports->analyticsRevenue($this->analyticsFilters($request)));
    }

    public function getAnalyticsPipeline(Request $request, AdminReportService $reports)
    {
        return response()->json($reports->analyticsPipeline($this->analyticsFilters($request)));
    }

    public function getAnalyticsMenuPerformance(Request $request, AdminReportService $reports)
    {
        return response()->json($reports->analyticsMenuPerformance($this->analyticsFilters($request)));
    }

    public function getAnalyticsCustomerExperience(Request $request, AdminReportService $reports)
    {
        return response()->json($reports->analyticsCustomerExperience($this->analyticsFilters($request)));
    }

    public function getAnalyticsOperations(Request $request, AdminReportService $reports)
    {
        return response()->json($reports->analyticsOperations($this->analyticsFilters($request)));
    }

    public function getAnalyticsForecasts(Request $request, AdminReportService $reports)
    {
        return response()->json($reports->analyticsForecasts($this->analyticsFilters($request)));
    }

    public function getAnalyticsAdvanced(Request $request, AdminReportService $reports)
    {
        return response()->json($reports->analyticsAdvanced($this->analyticsFilters($request)));
    }

    public function exportAnalytics(Request $request, AdminReportService $reports)
    {
        $format = strtolower($request->query('format', 'csv'));
        $section = $request->query('section', 'all');
        $filters = $this->analyticsFilters($request);

        $exportData = $reports->analyticsExportSections($filters, $section);
        $sections = $exportData['sections'];
        $takeaways = $exportData['takeaways'];

        // Build a human-readable filter summary for the export header
        $filterParts = [];
        if (! empty($filters['date_from'])) {
            $filterParts[] = 'From: '.$filters['date_from'];
        }
        if (! empty($filters['date_to'])) {
            $filterParts[] = 'To: '.$filters['date_to'];
        }
        if (! empty($filters['event_type'])) {
            $filterParts[] = 'Event: '.$filters['event_type'];
        }
        if (! empty($filters['booking_status'])) {
            $filterParts[] = 'Status: '.$filters['booking_status'];
        }
        $filterSummary = ! empty($filterParts) ? implode(' · ', $filterParts) : 'All data (no filters applied)';

        if ($format === 'pdf') {
            $pdf = app(\App\Services\BrandedPdfService::class);
            $content = $pdf->analyticsReport($sections, $takeaways, $filterSummary);
            $filename = 'ECS_Analytics_'.now()->format('Y-m-d_His').'.pdf';

            return response($content, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            ]);
        }

        // CSV export
        $filename = 'ECS_Analytics_'.now()->format('Y-m-d_His').'.csv';

        return response()->streamDownload(function () use ($sections, $filterSummary) {
            $out = fopen('php://output', 'w');

            // Header row
            fputcsv($out, ['Eloquente Catering — Analytics Export']);
            fputcsv($out, ['Generated', now()->format('M j, Y g:i A')]);
            fputcsv($out, ['Filters', $filterSummary]);
            fputcsv($out, []);

            foreach ($sections as $section) {
                fputcsv($out, [strtoupper($section['title'])]);
                if (! empty($section['method'])) {
                    fputcsv($out, ['Method', $section['method']]);
                }

                // Insight summary
                $insight = $section['insight'] ?? null;
                if ($insight) {
                    fputcsv($out, ['Insight', $insight['headline'] ?? '']);
                    if (! empty($insight['what_is_happening'])) {
                        fputcsv($out, ['What is happening', $insight['what_is_happening']]);
                    }
                    if (! empty($insight['why_it_matters'])) {
                        fputcsv($out, ['Why it matters', $insight['why_it_matters']]);
                    }
                    if (! empty($insight['root_cause'])) {
                        fputcsv($out, ['Root cause', $insight['root_cause']]);
                    }
                    if (! empty($insight['what_to_do_next'])) {
                        fputcsv($out, ['What to do next', $insight['what_to_do_next']]);
                    }
                }

                // Column headers and data
                fputcsv($out, $section['columns']);
                foreach ($section['rows'] as $row) {
                    fputcsv($out, $row);
                }

                fputcsv($out, []);
            }

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function analyticsFilters(Request $request): array
    {
        return array_filter($request->only([
            'date_from',
            'date_to',
            'event_type',
            'package_id',
            'package_category',
            'booking_status',
            'payment_status',
            'city',
            'pax_min',
            'pax_max',
            'trend_months',
            'revenue_forecast_months',
            'revenue_forecast_period',
            'revenue_forecast_horizon',
            'revenue_sma_window',
            'pax_projection_period',
            'pax_projection_horizon',
            'pax_sma_window',
            'pax_projection_year',
            'pax_projection_quarter',
            'snapshot_window',
            'funnel_snapshot_window',
            'breakdown_payment_status',
            'pipeline_booking_status',
            'sales_package_category',
            'performance_package_category',
            'menu_performance_category',
        ]), fn ($value) => $value !== null && $value !== '');
    }

    public function getAudits(Request $request)
    {
        $perPage = min((int) $request->query('per_page', 25), 100);

        $query = AuditLog::query()
            ->when($request->query('role'), fn ($q, $role) => $q->where('role', $role))
            ->when($request->query('method'), fn ($q, $method) => $q->where('method', strtoupper($method)))
            ->when($request->query('search'), function ($q, $search) {
                $term = '%'.mb_strtolower(trim((string) $search)).'%';
                $q->where(function ($inner) use ($term) {
                    $inner->whereRaw('LOWER(username) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(action) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(path) LIKE ?', [$term]);
                });
            })
            ->orderByDesc('created_at');

        $audits = $query->paginate($perPage);
        $audits->getCollection()->transform(fn (AuditLog $audit) => AuditContext::normalize($audit));

        return response()->json($audits);
    }

    // ==========================================
    // 6. Custom Menu Items CRUD
    // ==========================================

    public function getMenuItems()
    {
        $isStaff = in_array(Auth::user()?->role, ['Admin', 'Marketing'], true);
        $includeInactive = $isStaff;
        $version = $this->catalogVersion();
        $cacheKey = 'catalog.menu_items.'.($includeInactive ? 'staff' : 'public').".v{$version}";

        $items = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($includeInactive) {
            $query = MenuItem::query();

            if (! $includeInactive) {
                $query->whereRaw('is_active is true');
            }

            return $query->orderBy('category')->orderBy('name')->get();
        });

        // Strip internal cost fields for non-staff callers
        if (! $isStaff) {
            return PublicMenuItemResource::collection($items);
        }

        return response()->json($items->map(fn (MenuItem $item) => CatalogImage::menuItemPayload($item)));
    }

    public function createMenuItem(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:starter,main,side,dessert,drink',
            'cost_per_head' => 'required|numeric|min:0',
            'price_adj' => 'nullable|numeric|min:0',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|max:5120',
            'description' => 'nullable|string',
            'is_best_seller' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $dishId = 'custom_'.strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $request->name)).'_'.time();

        $imageUrl = CatalogImage::normalize($request->image) ?? CatalogImage::DEFAULT_MENU_IMAGE;
        if ($request->hasFile('image_file')) {
            $imageUrl = CatalogImage::storeMenuImage($request);
        }

        $item = MenuItem::create([
            'dish_id' => $dishId,
            'name' => $request->name,
            'category' => $request->category,
            'cost_per_head' => $request->cost_per_head,
            'price_adj' => $request->price_adj ?? 0,
            'image' => $imageUrl,
            'description' => $request->description ?? '',
            'is_best_seller' => $request->is_best_seller ?? false,
            'is_active' => $request->input('is_active', true),
        ]);
        $this->bumpCatalogVersion();
        Cache::put('admin.analytics.version', (int) Cache::get('admin.analytics.version', 1) + 1);
        app(OperationalBroadcastService::class)
            ->adminChanged('catalog', 'menu_item', $item->id, 'created', 'Menu item created.');

        return response()->json(CatalogImage::menuItemPayload($item), 201);
    }

    public function updateMenuItem(Request $request, int $id)
    {
        $item = MenuItem::find($id);
        if (! $item) {
            return response()->json(['error' => 'Menu item not found'], 404);
        }

        $request->validate([
            'name' => 'nullable|string|max:255',
            'category' => 'nullable|in:starter,main,side,dessert,drink',
            'cost_per_head' => 'nullable|numeric|min:0',
            'price_adj' => 'nullable|numeric|min:0',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|max:5120',
            'description' => 'nullable|string',
            'is_best_seller' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $updates = $request->only([
            'name', 'category', 'cost_per_head', 'price_adj',
            'image', 'description', 'is_best_seller', 'is_active',
        ]);

        if ($request->hasFile('image_file')) {
            $updates['image'] = CatalogImage::storeMenuImage($request);
        } elseif (array_key_exists('image', $updates)) {
            $updates['image'] = CatalogImage::normalize($updates['image']);
        }

        $previousState = $item->toArray();
        $item->update($updates);

        $request->attributes->set('undo_data', [
            'action_type' => 'update_menu_item',
            'target_type' => MenuItem::class,
            'target_id' => $item->id,
            'details' => ['message' => 'Updated menu item: ' . $item->name],
            'previous_state' => ['menu_item' => $previousState],
            'new_state' => ['menu_item' => $item->toArray()],
        ]);
        $this->bumpCatalogVersion();
        Cache::put('admin.analytics.version', (int) Cache::get('admin.analytics.version', 1) + 1);
        app(OperationalBroadcastService::class)
            ->adminChanged('catalog', 'menu_item', $item->id, 'updated', 'Menu item updated.');

        return response()->json(CatalogImage::menuItemPayload($item));
    }

    public function deleteMenuItem(int $id)
    {
        $item = MenuItem::find($id);
        if (! $item) {
            return response()->json(['error' => 'Menu item not found'], 404);
        }

        if ($item->bookingItems()->exists()) {
            return response()->json(['error' => 'Cannot delete menu item because it is used in existing bookings. Please archive it instead.'], 400);
        }

        $menuItemData = $item->toArray();
        $item->delete();
        $this->bumpCatalogVersion();
        Cache::put('admin.analytics.version', (int) Cache::get('admin.analytics.version', 1) + 1);
        app(OperationalBroadcastService::class)
            ->adminChanged('catalog', 'menu_item', $id, 'deleted', 'Menu item permanently deleted.');

        request()->attributes->set('undo_data', [
            'action_type' => 'delete_menu_item',
            'target_type' => MenuItem::class,
            'target_id' => $id,
            'details' => ['message' => 'Deleted menu item: ' . $menuItemData['name']],
            'previous_state' => ['menu_item' => $menuItemData],
            'new_state' => null,
        ]);

        return response()->json(['message' => 'Menu item permanently deleted']);
    }

    public function archiveMenuItem(int $id)
    {
        $item = MenuItem::find($id);
        if (! $item) {
            return response()->json(['error' => 'Menu item not found'], 404);
        }

        $item->update(['is_active' => false]);
        $this->bumpCatalogVersion();
        Cache::put('admin.analytics.version', (int) Cache::get('admin.analytics.version', 1) + 1);
        app(OperationalBroadcastService::class)
            ->adminChanged('catalog', 'menu_item', $item->id, 'archived', 'Menu item archived.');

        return response()->json(['message' => 'Menu item archived successfully', 'item' => $item->fresh()]);
    }

    public function unarchiveMenuItem(int $id)
    {
        $item = MenuItem::find($id);
        if (! $item) {
            return response()->json(['error' => 'Menu item not found'], 404);
        }

        $item->update(['is_active' => true]);
        $this->bumpCatalogVersion();
        Cache::put('admin.analytics.version', (int) Cache::get('admin.analytics.version', 1) + 1);
        app(OperationalBroadcastService::class)
            ->adminChanged('catalog', 'menu_item', $item->id, 'unarchived', 'Menu item unarchived.');

        return response()->json(['message' => 'Menu item unarchived successfully', 'item' => $item->fresh()]);
    }

    private function catalogVersion(): int
    {
        return (int) Cache::get('catalog.version', 1);
    }

    private function bumpCatalogVersion(): void
    {
        Cache::put('catalog.version', $this->catalogVersion() + 1, now()->addDays(30));
        Cache::forget('menu_categories');
        Cache::forget('menu_bestsellers');
    }

    public function undoAudit(Request $request, int $id)
    {
        $audit = AuditLog::findOrFail($id);

        $request->validate([
            'password' => 'required|string',
        ]);

        if (!Hash::check($request->password, $request->user()->password)) {
            return response()->json(['error' => 'Incorrect password. Undo aborted.'], 403);
        }

        $undoData = $audit->metadata['undo_data'] ?? null;

        if (!$undoData) {
            return response()->json(['error' => 'This action cannot be undone.'], 400);
        }

        $actionType = $undoData['action_type'] ?? null;

        $allowedActionTypes = [
            'update_booking_status', 'delete_announcement', 'create_announcement', 'update_announcement',
            'update_menu_item', 'delete_menu_item', 'update_employee', 'deactivate_employee',
            'update_package', 'delete_package', 'update_business_settings'
        ];
        if (!in_array($actionType, $allowedActionTypes)) {
            return response()->json(['error' => 'This type of action cannot be undone.'], 400);
        }

        // Prevent double-undo
        $alreadyUndone = AuditLog::whereJsonContains('metadata->undo_data->original_log_id', $audit->id)
            ->exists();

        if ($alreadyUndone) {
            return response()->json(['error' => 'This action has already been undone.'], 400);
        }

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            if ($actionType === 'update_booking_status') {
                $booking = Booking::findOrFail($undoData['target_id']);
                
                $previousStatus = $undoData['previous_state']['status'] ?? 'Pending';
                $expectedCurrentStatus = $undoData['new_state']['status'] ?? null;

                if ($booking->status !== $expectedCurrentStatus) {
                    throw new \Exception('Cannot undo: Booking status has already changed since this action.');
                }
                
                if ($booking->event_date && \Carbon\Carbon::parse($booking->event_date)->isPast()) {
                    throw new \Exception('Cannot undo: The event date has already passed.');
                }

                $booking->status = $previousStatus;
                $booking->save();
                
                $request->attributes->set('undo_data', [
                    'action_type' => 'undo_booking_status',
                    'target_type' => Booking::class,
                    'target_id' => $booking->id,
                    'details' => ['message' => 'Reverted status to ' . $previousStatus],
                    'previous_state' => ['status' => $expectedCurrentStatus],
                    'new_state' => ['status' => $previousStatus],
                    'original_log_id' => $audit->id,
                ]);
            } elseif ($actionType === 'delete_announcement') {
                $announcementData = $undoData['previous_state']['announcement'] ?? null;
                
                if ($announcementData) {
                    $existingSlug = \App\Models\Announcement::where('slug', $announcementData['slug'])->first();
                    if ($existingSlug) {
                        throw new \Exception('Cannot undo: An announcement with this slug already exists.');
                    }

                    $announcement = \App\Models\Announcement::create($announcementData);
                    
                    $request->attributes->set('undo_data', [
                        'action_type' => 'undo_delete_announcement',
                        'target_type' => \App\Models\Announcement::class,
                        'target_id' => $announcement->id,
                        'details' => ['message' => 'Restored announcement ' . $announcement->title],
                        'original_log_id' => $audit->id,
                    ]);
                } else {
                    $announcement = \App\Models\Announcement::withTrashed()->find($undoData['target_id']);
                    if ($announcement) {
                        $existingSlug = \App\Models\Announcement::where('slug', $announcement->slug)->where('id', '!=', $announcement->id)->first();
                        if ($existingSlug) {
                            throw new \Exception('Cannot undo: An announcement with this slug already exists.');
                        }
                        $announcement->restore();
                        
                        $request->attributes->set('undo_data', [
                            'action_type' => 'undo_delete_announcement',
                            'target_type' => \App\Models\Announcement::class,
                            'target_id' => $announcement->id,
                            'details' => ['message' => 'Restored announcement ' . $announcement->title],
                            'original_log_id' => $audit->id,
                        ]);
                    } else {
                        throw new \Exception('Announcement data not found for restoration.');
                    }
                }
            } elseif ($actionType === 'create_announcement') {
                $announcement = \App\Models\Announcement::find($undoData['target_id']);
                if ($announcement) {
                    $announcement->forceDelete();
                    $request->attributes->set('undo_data', [
                        'action_type' => 'undo_create_announcement',
                        'target_type' => \App\Models\Announcement::class,
                        'target_id' => $undoData['target_id'],
                        'details' => ['message' => 'Deleted created announcement'],
                        'original_log_id' => $audit->id,
                    ]);
                }
            } elseif ($actionType === 'update_announcement') {
                $announcement = \App\Models\Announcement::findOrFail($undoData['target_id']);
                $announcement->update($undoData['previous_state']['announcement']);
                $request->attributes->set('undo_data', [
                    'action_type' => 'undo_update_announcement',
                    'target_type' => \App\Models\Announcement::class,
                    'target_id' => $announcement->id,
                    'details' => ['message' => 'Reverted announcement changes'],
                    'original_log_id' => $audit->id,
                ]);
            } elseif ($actionType === 'update_menu_item') {
                $item = \App\Models\MenuItem::findOrFail($undoData['target_id']);
                $item->update($undoData['previous_state']['menu_item']);
                $this->bumpCatalogVersion();
                $request->attributes->set('undo_data', [
                    'action_type' => 'undo_update_menu_item',
                    'target_type' => \App\Models\MenuItem::class,
                    'target_id' => $item->id,
                    'details' => ['message' => 'Reverted menu item changes'],
                    'original_log_id' => $audit->id,
                ]);
            } elseif ($actionType === 'delete_menu_item') {
                $menuItemData = $undoData['previous_state']['menu_item'];
                $existing = \App\Models\MenuItem::where('name', $menuItemData['name'])->first();
                if ($existing) throw new \Exception('A menu item with this name already exists.');
                $item = \App\Models\MenuItem::create($menuItemData);
                $this->bumpCatalogVersion();
                $request->attributes->set('undo_data', [
                    'action_type' => 'undo_delete_menu_item',
                    'target_type' => \App\Models\MenuItem::class,
                    'target_id' => $item->id,
                    'details' => ['message' => 'Restored menu item'],
                    'original_log_id' => $audit->id,
                ]);
            } elseif ($actionType === 'update_employee') {
                $user = User::findOrFail($undoData['target_id']);
                $user->update($undoData['previous_state']['user']);
                $request->attributes->set('undo_data', [
                    'action_type' => 'undo_update_employee',
                    'target_type' => User::class,
                    'target_id' => $user->id,
                    'details' => ['message' => 'Reverted employee changes'],
                    'original_log_id' => $audit->id,
                ]);
            } elseif ($actionType === 'deactivate_employee') {
                $user = User::findOrFail($undoData['target_id']);
                $user->forceFill($undoData['previous_state']['user'])->save();
                $request->attributes->set('undo_data', [
                    'action_type' => 'undo_deactivate_employee',
                    'target_type' => User::class,
                    'target_id' => $user->id,
                    'details' => ['message' => 'Restored employee account'],
                    'original_log_id' => $audit->id,
                ]);
            } elseif ($actionType === 'update_package') {
                $package = \App\Models\Package::findOrFail($undoData['target_id']);
                $package->update($undoData['previous_state']['package']);
                $this->bumpCatalogVersion();
                $request->attributes->set('undo_data', [
                    'action_type' => 'undo_update_package',
                    'target_type' => \App\Models\Package::class,
                    'target_id' => $package->id,
                    'details' => ['message' => 'Reverted package changes'],
                    'original_log_id' => $audit->id,
                ]);
            } elseif ($actionType === 'delete_package') {
                $packageData = $undoData['previous_state']['package'];
                $existing = \App\Models\Package::where('name', $packageData['name'])->first();
                if ($existing) throw new \Exception('A package with this name already exists.');
                $package = \App\Models\Package::create($packageData);
                $this->bumpCatalogVersion();
                $request->attributes->set('undo_data', [
                    'action_type' => 'undo_delete_package',
                    'target_type' => \App\Models\Package::class,
                    'target_id' => $package->id,
                    'details' => ['message' => 'Restored package'],
                    'original_log_id' => $audit->id,
                ]);
            } elseif ($actionType === 'update_business_settings') {
                $group = $undoData['target_id'];
                foreach ($undoData['previous_state']['settings'] as $key => $value) {
                    \App\Models\BusinessSetting::updateOrCreate(
                        ['key' => $key],
                        ['value' => is_array($value) ? $value : ['value' => $value], 'group' => $group]
                    );
                }
                $request->attributes->set('undo_data', [
                    'action_type' => 'undo_update_business_settings',
                    'target_type' => \App\Models\BusinessSetting::class,
                    'target_id' => $group,
                    'details' => ['message' => 'Reverted business settings'],
                    'original_log_id' => $audit->id,
                ]);
            }

            \Illuminate\Support\Facades\DB::commit();
            return response()->json(['message' => 'Action successfully undone.']);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            Log::error('Undo failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to undo action: ' . $e->getMessage()], 400);
        }
    }
}
