<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class VerifyEmailOTP extends Mailable
{
    public $otpCode;

    public string $purpose;

    public int $expiresInMinutes;

    public ?string $temporaryPassword;

    /**
     * Create a new message instance.
     */
    public function __construct($otpCode, string $purpose = 'account verification', int $expiresInMinutes = 10, ?string $temporaryPassword = null)
    {
        $this->otpCode = $otpCode;
        $this->purpose = $purpose;
        $this->expiresInMinutes = $expiresInMinutes;
        $this->temporaryPassword = $temporaryPassword;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Eloquente Verification Code',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.verify_otp',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
