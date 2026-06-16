<?php

namespace App\Console\Commands;

use App\Models\Payment;
use App\Models\PaymentEvent;
use App\Services\PaymentReminderService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendAutomatedPaymentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payments:send-automated-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send automated payment reminders for pending payments due in 3 days';

    /**
     * Execute the console command.
     */
    public function handle(PaymentReminderService $reminderService)
    {
        $targetDate = Carbon::now()->addDays(3)->toDateString();

        $this->info("Scanning for pending payments due on {$targetDate}...");

        $payments = Payment::active()
            ->where('status', 'Pending')
            ->whereDate('due_date', $targetDate)
            ->whereHas('booking', function ($query) {
                $query->whereNotIn('status', ['Pending', 'Cancelled']);
            })
            ->get();

        $this->info("Found {$payments->count()} eligible payments.");

        $sentCount = 0;

        foreach ($payments as $payment) {
            // Check if we already sent an automated reminder for this payment to prevent spam
            $alreadySent = PaymentEvent::where('payment_id', $payment->id)
                ->where('event_type', 'automated_payment_reminder_sent')
                ->exists();

            if ($alreadySent) {
                $this->line("Skipping Payment #{$payment->id} - automated reminder already sent.");
                continue;
            }

            $this->line("Sending reminder for Payment #{$payment->id}...");

            $result = $reminderService->sendReminder($payment->id, 'system');

            if ($result['success']) {
                PaymentEvent::create([
                    'payment_id' => $payment->id,
                    'booking_id' => $payment->booking_id,
                    'event_type' => 'automated_payment_reminder_sent',
                    'source' => 'system',
                    'created_by' => null, // Automated
                ]);

                $this->info("Successfully sent reminder for Payment #{$payment->id}.");
                $sentCount++;
            } else {
                $this->error("Failed to send reminder for Payment #{$payment->id}: " . ($result['error'] ?? 'Unknown error'));
                Log::warning("Automated payment reminder failed for Payment #{$payment->id}", $result);
            }
        }

        $this->info("Finished sending {$sentCount} automated payment reminders.");
    }
}
