<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $storagePath = public_path('storage');
    if (file_exists($storagePath)) {
        if (is_link($storagePath)) {
            unlink($storagePath);
            echo "Removed existing symbolic link.<br>";
        } else {
            rename($storagePath, $storagePath . '_backup_' . time());
            echo "Renamed existing folder to backup.<br>";
        }
    }

    \Illuminate\Support\Facades\Artisan::call('storage:link');
    echo "Storage link created successfully!<br><pre>";
    echo \Illuminate\Support\Facades\Artisan::output();
    echo "</pre>";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
