<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\User;
use App\Notifications\PaymentReminderNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PaymentReminderService
{
    /**
     * Send a real payment reminder email + in-app notification to the client.
     */
    public function sendReminder(int $paymentId, string $source = 'accounting'): array
    {
        $payment = Payment::active()->with([
            'booking:id,user_id,client_email,client_full_name,client_phone',
        ])->find($paymentId);

        if (! $payment) {
            return ['success' => false, 'error' => 'Payment not found', 'status' => 404];
        }

        $booking = $payment->booking;

        if (! $booking) {
            return ['success' => false, 'error' => 'Booking not found for this payment', 'status' => 404];
        }

        // Ensure the payment has its booking eager-loaded for the notification
        $payment->setRelation('booking', $booking);

        $notified = false;

        // ── Path A: Booking has a registered user account ──
        if ($booking->user_id) {
            $client = User::find($booking->user_id);

            if ($client) {
                try {
                    $notified = app(NotificationRecipientService::class)
                        ->sendToUser($client, new PaymentReminderNotification($payment), 'payment_reminder');

                    if ($notified) {
                        PaymentEventService::record(
                            'payment_reminder_sent',
                            $source,
                            $payment,
                            ['channel' => 'notification'],
                            $payment->paymongo_payment_id ?: $payment->paymongo_checkout_session_id
                        );

                        Log::info('Payment reminder notification sent.', [
                            'payment_id' => $paymentId,
                            'user_id' => $client->id,
                            'email' => $client->email,
                            'source' => $source,
                        ]);
                    } else {
                        return [
                            'success' => false,
                            'error' => 'This client account is not reachable for operational notifications.',
                            'status' => 422
                        ];
                    }
                } catch (\Throwable $e) {
                    Log::error('PaymentReminderNotification failed.', [
                        'payment_id' => $paymentId,
                        'error' => $e->getMessage(),
                    ]);

                    return [
                        'success' => false,
                        'error' => 'Could not send reminder: '.$e->getMessage(),
                        'status' => 500
                    ];
                }
            }
        }

        // ── Path B: No linked user — fall back to raw mail using client_email ──
        if (! $notified) {
            $email = $booking->client_email;

            if (! $email || str_ends_with((string) $email, '@eloquente.invalid')) {
                return [
                    'success' => false,
                    'error' => 'No email address found for this client. Please update the booking with a valid email first.',
                    'status' => 422
                ];
            }

            try {
                $dueDate = Carbon::parse($payment->due_date)->format('F j, Y');
                $amount = number_format((float) $payment->amount, 2);
                $type = $payment->payment_type ?? 'Payment';
                $bookingRef = str_pad($booking->id, 5, '0', STR_PAD_LEFT);
                $clientName = $booking->client_full_name ?: 'Valued Client';

                Mail::send('emails.generic', [
                    'emailTitle' => 'Payment reminder',
                    'headline' => 'Your payment is coming up',
                    'preheader' => 'A friendly reminder for your Eloquente booking payment.',
                    'greeting' => "Hello {$clientName},",
                    'lines' => ['This is a friendly reminder about an upcoming payment for your booking.'],
                    'details' => [
                        'Payment type' => $type,
                        'Amount due' => 'PHP '.$amount,
                        'Due date' => $dueDate,
                        'Booking reference' => "#{$bookingRef}",
                    ],
                    'ctaLabel' => 'View payment',
                    'ctaUrl' => route('payment.page'),
                    'note' => 'Please settle your payment on or before the due date to keep your booking active.',
                ], function ($message) use ($email, $clientName, $bookingRef) {
                    $message->to($email, $clientName)
                        ->subject("Payment Reminder - Booking #{$bookingRef} | Eloquente Catering");
                });

                PaymentEventService::record(
                    'payment_reminder_sent',
                    $source,
                    $payment,
                    ['channel' => 'mail', 'recipient' => $email],
                    $payment->paymongo_payment_id ?: $payment->paymongo_checkout_session_id
                );

                Log::info('Payment reminder raw mail sent (no user account).', [
                    'payment_id' => $paymentId,
                    'email' => $email,
                    'source' => $source,
                ]);

                $notified = true;
            } catch (\Throwable $e) {
                Log::error('Payment reminder raw mail failed.', [
                    'payment_id' => $paymentId,
                    'email' => $booking->client_email,
                    'error' => $e->getMessage(),
                ]);

                return [
                    'success' => false,
                    'error' => 'Could not send reminder email: '.$e->getMessage(),
                    'status' => 500
                ];
            }
        }

        return [
            'success' => true,
            'message' => 'Payment reminder sent to the client successfully.',
            'status' => 200
        ];
    }
}
