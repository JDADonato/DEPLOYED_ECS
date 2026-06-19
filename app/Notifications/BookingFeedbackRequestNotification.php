<?php

namespace App\Notifications;

use App\Models\Booking;
use App\Models\FeedbackRequest;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingFeedbackRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Booking $booking, public FeedbackRequest $feedbackRequest) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $eventDate = $this->booking->event_date
            ? Carbon::parse($this->booking->event_date)->format('F j, Y')
            : 'your event date';

        return (new MailMessage)
            ->subject('Tell us how your Eloquente event went')
            ->view('emails.generic', [
                'emailTitle' => 'Feedback requested',
                'headline' => 'How did your event go?',
                'preheader' => 'Your feedback helps Eloquente improve future events.',
                'greeting' => "Hello {$notifiable->username},",
                'lines' => [
                    "Your event for {$eventDate} has been marked completed.",
                    'Please take a moment to rate your experience and share any comments from your dashboard.',
                ],
                'details' => [
                    'Booking reference' => '#'.str_pad((string) $this->booking->id, 5, '0', STR_PAD_LEFT),
                    'Event' => $this->booking->event_display_name,
                ],
                'ctaLabel' => 'Submit feedback',
                'ctaUrl' => route('dashboard.client').'?target=feedback-request-panel',
            ]);
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'type' => 'booking_feedback_requested',
            'category' => 'feedback',
            'priority' => 'high',
            'target_type' => 'booking',
            'target_id' => $this->booking->id,
            'action_url' => route('dashboard.client').'?target=feedback-request-panel',
            'message' => "Your event is complete. Please share feedback for booking #{$this->booking->id}.",
        ];
    }
}
