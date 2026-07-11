<?php
require __DIR__.'/bootstrap/app.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$service = app(App\Services\AdminReportService::class);
$data = $service->analyticsForecasts([]);
print_r($data['revenueRegression']['evaluation']['testData']);
