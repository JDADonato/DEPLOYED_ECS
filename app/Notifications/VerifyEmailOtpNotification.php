<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyEmailOtpNotification extends Notification
{
    public function __construct(
        private readonly string $otpCode,
        private readonly string $purpose = 'account verification',
        private readonly int $expiresInMinutes = 15,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Eloquente Verification Code')
            ->view('emails.verify_otp', [
                'otpCode' => $this->otpCode,
                'purpose' => $this->purpose,
                'expiresInMinutes' => $this->expiresInMinutes,
            ]);
    }
}
