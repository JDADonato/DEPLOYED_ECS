<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification as NotificationFacade;

class NotificationRecipientService
{
    public function reachableUsersForRoles(array $roles): Collection
    {
        return User::query()
            ->activeAccounts()
            ->whereIn('role', $roles)
            ->get();
    }

    public function sendToRoles(array $roles, Notification $notification, string $context = 'notification'): int
    {
        return $this->sendToUsers($this->reachableUsersForRoles($roles), $notification, $context);
    }

    public function sendToUsers(iterable $users, Notification $notification, string $context = 'notification'): int
    {
        $recipients = collect($users)
            ->filter(fn ($user) => $user instanceof User && $user->isActive())
            ->values();

        if ($recipients->isEmpty()) {
            return 0;
        }

        $sent = 0;

        try {
            $recipients->each(function (User $user) use ($notification, $context, &$sent) {
                $sent += $this->sendToUser($user, $notification, $context) ? 1 : 0;
            });

            return $sent;
        } catch (\Throwable $e) {
            Log::warning('Operational notification delivery failed.', [
                'context' => $context,
                'recipient_count' => $recipients->count(),
                'message' => $e->getMessage(),
            ]);

            return 0;
        }
    }

    public function sendToUser(?User $user, Notification $notification, string $context = 'notification'): bool
    {
        if (! $user || ! $user->isActive()) {
            return false;
        }

        $channels = $this->channelsFor($notification, $user);
        $databaseChannels = array_values(array_intersect($channels, ['database', 'broadcast']));
        $mailChannels = in_array('mail', $channels, true) && $user->isReachableForNotifications()
            ? ['mail']
            : [];
        $sentAny = false;

        if ($databaseChannels !== []) {
            try {
                NotificationFacade::sendNow($user, $notification, $databaseChannels);
                $this->broadcastDatabaseNotification($user);
                $sentAny = true;
            } catch (\Throwable $e) {
                Log::warning('Operational database notification delivery failed.', [
                    'context' => $context,
                    'user_id' => $user->id,
                    'message' => $e->getMessage(),
                ]);
            }
        }

        if ($mailChannels !== []) {
            try {
                NotificationFacade::sendNow($user, $notification, $mailChannels);
                $sentAny = true;
            } catch (\Throwable $e) {
                Log::warning('Operational mail notification delivery failed.', [
                    'context' => $context,
                    'user_id' => $user->id,
                    'message' => $e->getMessage(),
                ]);
            }
        }

        return $sentAny;
    }

    private function channelsFor(Notification $notification, User $user): array
    {
        if (! method_exists($notification, 'via')) {
            return ['database'];
        }

        return collect($notification->via($user))
            ->map(fn ($channel) => is_string($channel) ? $channel : (string) $channel)
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    private function broadcastDatabaseNotification(User $user): void
    {
        $channels = match ($user->role) {
            'Client' => ['client.'.$user->id],
            'Admin' => ['admin.dashboard'],
            'Marketing' => ['marketing.dashboard', 'staff.queue'],
            'Accounting' => ['accounting.dashboard'],
            default => [],
        };

        if ($channels === []) {
            return;
        }

        app(OperationalBroadcastService::class)
            ->changed('notifications', 'notification', null, 'created', null, $channels);
    }
}
