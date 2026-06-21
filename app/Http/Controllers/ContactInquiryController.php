<?php

namespace App\Http\Controllers;

use App\Models\ContactInquiry;
use App\Models\ContactInquiryReply;
use App\Models\Notification;
use App\Models\User;
use App\Mail\GuestInquiryReplyMail;
use App\Services\OperationalBroadcastService;
use App\Support\ResourceVersion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class ContactInquiryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:40'],
            'event_date' => ['nullable', 'date'],
            'pax' => ['nullable', 'integer', 'min:1', 'max:10000'],
            'event_type' => ['nullable', 'string', 'max:120'],
            'concern_type' => ['nullable', Rule::in(['general', 'planning', 'availability', 'menu', 'pricing', 'tasting', 'active_booking'])],
            'subject' => ['required', 'string', 'max:160'],
            'message' => ['required', 'string', 'max:2000'],
            'website' => ['nullable', 'prohibited'],
        ]);
        unset($validated['website']);

        $duplicateUser = $this->findDuplicateUser($validated['email'] ?? null, $validated['phone'] ?? null);

        $inquiry = ContactInquiry::create([
            ...$validated,
            'concern_type' => $validated['concern_type'] ?? 'general',
            'status' => 'New',
            'source' => 'public_contact',
            'duplicate_user_id' => $duplicateUser?->id,
            'metadata' => [
                'ip' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 255),
            ],
        ]);
        app(OperationalBroadcastService::class)
            ->staffQueueChanged('contact_inquiries', 'contact_inquiry', $inquiry->id, 'created', 'New contact inquiry.');

        return response()->json([
            'message' => 'Your inquiry has been sent to our planning team.',
            'inquiry_id' => $inquiry->id,
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = min(max((int) $request->query('per_page', 15), 1), 50);
        $search = trim((string) $request->query('search', ''));
        $status = trim((string) $request->query('status', ''));
        $concernType = trim((string) $request->query('concern_type', ''));
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $query = ContactInquiry::query()
            ->with(['assignee:id,full_name,username', 'duplicateUser', 'replies', 'replies.user:id,full_name'])
            ->when($search !== '', function ($query) use ($search) {
                $term = '%'.mb_strtolower($search).'%';
                $query->where(function ($inner) use ($term) {
                    $inner->whereRaw('LOWER(full_name) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(phone) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(subject) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(message) LIKE ?', [$term]);
                });
            })
            ->when($status !== '', fn ($query) => $query->where('status', $status), fn ($query) => $query->whereNotIn('status', ['Archived', 'Spam']))
            ->when($concernType !== '', fn ($query) => $query->where('concern_type', $concernType))
            ->when($dateFrom, fn ($query) => $query->whereDate('event_date', '>=', $dateFrom))
            ->when($dateTo, fn ($query) => $query->whereDate('event_date', '<=', $dateTo))
            ->orderByDesc('created_at');

        $versionMeta = ResourceVersion::fromQuery($query);
        if (ResourceVersion::matches($request, $versionMeta)) {
            return ResourceVersion::unchanged($versionMeta);
        }

        $inquiries = $query->paginate($perPage);

        return response()->json([
            'data' => collect($inquiries->items())->map(fn (ContactInquiry $inquiry) => $this->formatInquiry($inquiry))->values(),
            'summary' => [
                'new' => ContactInquiry::where('status', 'New')->count(),
                'open' => ContactInquiry::whereIn('status', ['New', 'In Review', 'Follow Up', 'Contacted'])->count(),
                'resolved' => ContactInquiry::where('status', 'Resolved')->count(),
            ],
            'meta' => [
                'current_page' => $inquiries->currentPage(),
                'per_page' => $inquiries->perPage(),
                'total' => $inquiries->total(),
                'last_page' => $inquiries->lastPage(),
                ...$versionMeta,
                'changed' => true,
            ],
        ]);
    }

    public function customerIndex(Request $request): JsonResponse
    {
        $user = $request->user();

        $inquiries = ContactInquiry::query()
            ->with(['replies', 'replies.user:id,full_name'])
            ->where('duplicate_user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => $inquiries->map(fn (ContactInquiry $inquiry) => $this->formatInquiry($inquiry))->values(),
        ]);
    }

    public function update(Request $request, ContactInquiry $inquiry): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', Rule::in(['New', 'Contacted', 'In Review', 'Follow Up', 'Resolved', 'Closed', 'Archived', 'Spam'])],
            'assigned_to' => ['nullable', 'integer', Rule::exists('users', 'id')->where(fn ($query) => $query->whereIn('role', ['Marketing', 'Admin']))],
            'staff_notes' => ['nullable', 'string', 'max:3000'],
        ]);

        if (array_key_exists('status', $validated)) {
            $inquiry->status = $validated['status'];
            $inquiry->resolved_at = in_array($validated['status'], ['Resolved', 'Closed'], true) ? now() : null;
            $inquiry->archived_at = in_array($validated['status'], ['Archived', 'Spam'], true) ? now() : null;
        }

        if (array_key_exists('assigned_to', $validated)) {
            $inquiry->assigned_to = $validated['assigned_to'] ?: null;
        }

        if (array_key_exists('staff_notes', $validated)) {
            $inquiry->staff_notes = $validated['staff_notes'];
        }

        $inquiry->save();
        app(OperationalBroadcastService::class)
            ->staffQueueChanged('contact_inquiries', 'contact_inquiry', $inquiry->id, 'updated', 'Contact inquiry updated.');

        return response()->json([
            'message' => 'Inquiry updated.',
            'inquiry' => $this->formatInquiry($inquiry->fresh(['assignee:id,full_name,username', 'duplicateUser:id,full_name,username,email,phone,account_status', 'replies', 'replies.user:id,full_name'])),
        ]);
    }

    public function reply(Request $request, ContactInquiry $inquiry): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $reply = ContactInquiryReply::create([
            'contact_inquiry_id' => $inquiry->id,
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
        ]);

        Mail::to($inquiry->email)->send(new GuestInquiryReplyMail($inquiry, $reply, $request->user()->full_name));

        if ($inquiry->status === 'New') {
            $inquiry->status = 'Contacted';
            $inquiry->save();
        }

        if ($inquiry->duplicate_user_id) {
            Notification::create([
                'user_id' => $inquiry->duplicate_user_id,
                'title' => 'Reply to your inquiry',
                'message' => 'We have replied to your inquiry: "' . str($inquiry->subject)->limit(40) . '"',
                'action_url' => '/dashboard',
                'type' => 'customer_message',
            ]);
            // Attempt to broadcast if service exists or user is connected
            app(OperationalBroadcastService::class)->userSessionInvalidated($inquiry->duplicate_user_id); // small hack to force user state refresh, or we can just let notification handle it.
        }

        app(OperationalBroadcastService::class)
            ->staffQueueChanged('contact_inquiries', 'contact_inquiry', $inquiry->id, 'updated', 'Contact inquiry replied.');

        return response()->json([
            'message' => 'Reply sent successfully.',
            'inquiry' => $this->formatInquiry($inquiry->fresh(['assignee:id,full_name,username', 'duplicateUser:id,full_name,username,email,phone,account_status', 'replies', 'replies.user:id,full_name'])),
        ]);
    }

    private function findDuplicateUser(?string $email, ?string $phone): ?User
    {
        $email = filled($email) ? strtolower(trim($email)) : null;
        $phone = filled($phone) ? trim($phone) : null;

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

    private function formatInquiry(ContactInquiry $inquiry): array
    {
        $data = $inquiry->toArray();
        $duplicate = $inquiry->duplicateUser;

        $data['duplicate_user'] = $duplicate ? [
            'id' => $duplicate->id,
            'full_name' => $duplicate->full_name,
            'username' => $duplicate->username,
            'email' => $duplicate->hasPlaceholderEmail() ? null : $duplicate->email,
            'phone' => $duplicate->phone,
            'account_status' => $duplicate->account_status ?? 'active',
            'is_deactivated' => ! $duplicate->isActive(),
        ] : null;

        return $data;
    }
}
