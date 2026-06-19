<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StaffOperationalNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly string $subject,
        private readonly string $headline,
        private readonly string $body,
        private readonly ?string $url = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject($this->subject)
            ->greeting($this->headline)
            ->line($this->body);

        if ($this->url) {
            $message->action('Open workspace', $this->url);
        }

        return $message->line('This notification follows your Eloquente staff notification settings.');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'staff_operational',
            'title' => $this->headline,
            'message' => $this->body,
            'category' => 'update',
            'priority' => 'info',
            'target_type' => 'staff_update',
            'action_url' => $this->url,
        ];
    }
}
