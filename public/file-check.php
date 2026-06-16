<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

clearstatcache();

echo "<h2>File Existence Verification (Stat Cache Cleared)</h2>";

$files = [
    'menu-images/QsaIcxFVm2azzwLP5BdvEbUs7dQasia3ntZ1YiK6.jpg',
    'menu-images/2Jzx0kVIJNvLcaXU7HcN74wfZcDj5JGR9DL0Zdqb.jpg',
    'menu-images/Gv9MKyhaeKiSH5AK0kvTFN5zAT5RHO70DDFOnG0b.jpg'
];

foreach ($files as $file) {
    $fullPath = storage_path('app/public/' . $file);
    echo "<b>File:</b> $file <br>";
    echo "<b>Full Path:</b> $fullPath <br>";
    echo "<b>Exists via file_exists():</b> " . (file_exists($fullPath) ? "<font color='green'>Yes</font>" : "<font color='red'>No</font>") . "<br>";
    echo "<b>Exists via Storage::exists():</b> " . (\Illuminate\Support\Facades\Storage::disk('public')->exists($file) ? "<font color='green'>Yes</font>" : "<font color='red'>No</font>") . "<br>";
    echo "<hr>";
}
