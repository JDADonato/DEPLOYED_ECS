<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$booking = App\Models\Booking::latest()->first();
echo "Booking ID: {$booking->id}\n";
echo "Date: {$booking->event_date}\n";
echo "Payments:\n";
foreach ($booking->payments as $p) {
    echo " - ID: {$p->id}, Type: {$p->payment_type}, Status: {$p->status}\n";
}
