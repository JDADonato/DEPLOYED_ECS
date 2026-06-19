<?php

namespace App\Notifications;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DiscountAppliedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Booking $booking, public float $discountAmount, public float $newTotal) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $eventDate = Carbon::parse($this->booking->event_date)->format('F j, Y');
        $reference = str_pad($this->booking->id, 5, '0', STR_PAD_LEFT);
        
        $discountStr = 'PHP ' . number_format($this->discountAmount, 2);
        $totalStr = 'PHP ' . number_format($this->newTotal, 2);

        return (new MailMessage)
            ->subject('Discount Applied - Eloquente Catering')
            ->view('emails.generic', [
                'emailTitle' => 'Discount Applied',
                'headline' => 'A discount has been applied to your booking',
                'preheader' => 'We have updated your total cost.',
                'greeting' => "Hello {$notifiable->username},",
                'lines' => [
                    "A discount of {$discountStr} has been successfully applied to your booking.",
                    "Your pending payment amounts have been adjusted accordingly."
                ],
                'details' => [
                    'Booking reference' => "#{$reference}",
                    'Event date' => $eventDate,
                    'Discount amount' => $discountStr,
                    'New total amount' => $totalStr,
                ],
                'ctaLabel' => 'View booking',
                'ctaUrl' => route('dashboard.client'),
            ]);
    }

    public function toDatabase(object $notifiable): array
    {
        $discountStr = 'PHP ' . number_format($this->discountAmount, 2);
        return [
            'booking_id' => $this->booking->id,
            'type' => 'booking_discount',
            'message' => "A discount of {$discountStr} was applied to your booking #{$this->booking->id}.",
        ];
    }
}
