<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GuestInquiryReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $inquiry;
    public $reply;
    public $staffName;

    /**
     * Create a new message instance.
     */
    public function __construct($inquiry, $reply, $staffName)
    {
        $this->inquiry = $inquiry;
        $this->reply = $reply;
        $this->staffName = $staffName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Re: ' . $this->inquiry->subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.guest-inquiry-reply',
            with: [
                'inquiry' => $this->inquiry,
                'reply' => $this->reply,
                'staffName' => $this->staffName,
            ],
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
