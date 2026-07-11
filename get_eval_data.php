<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Services\AdminReportService;

try {
    $service = app(AdminReportService::class);
    
    // We call analyticsForecasts
    $payload = $service->analyticsForecasts([]);
    echo json_encode(['success' => true, 'data' => $payload], JSON_PRETTY_PRINT);

} catch (\Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
