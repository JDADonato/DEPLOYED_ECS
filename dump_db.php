<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$booking = \App\Models\Booking::find(3174);
file_put_contents(__DIR__.'/db_dump.txt', json_encode($booking->only(['id','total_cost','discount_value','budget','pax','status'])));
