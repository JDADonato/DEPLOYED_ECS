<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$booking = \App\Models\Booking::find(3174);
echo "Booking 3174 Data:\n";
echo json_encode($booking->only(['id', 'total_cost', 'discount_value', 'discount_type']));
echo "\n";
