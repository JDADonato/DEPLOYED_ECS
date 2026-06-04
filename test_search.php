<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

dump(\App\Models\Booking::where('event_date', 'like', '%06-26%')->get(['id', 'event_date', 'package_id', 'pax', 'total_cost', 'labor_surcharge', 'transport_fee'])->toArray());
