<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$b = \App\Models\Booking::with('package')->find(2857);
dump($b->toArray()['package']);
