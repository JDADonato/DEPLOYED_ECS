<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$booking = \App\Models\Booking::find(2857);
$package = \App\Models\Package::find($booking->package_id);

dump([
    'pax' => $booking->pax,
    'total_cost' => $booking->total_cost,
    'package_id' => $booking->package_id,
    'package_base_price' => $package ? $package->base_price_per_head : null,
    'labor_surcharge' => $booking->labor_surcharge,
    'transport_fee' => $booking->transport_fee
]);
