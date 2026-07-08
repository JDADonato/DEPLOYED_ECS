<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<h2>Listing Files in public/menu-images</h2>";

$dir = storage_path('app/public/menu-images');
echo "<b>Directory Path:</b> $dir <br>";
echo "<b>Directory Exists:</b> " . (file_exists($dir) ? "Yes" : "No") . "<br>";

if (file_exists($dir)) {
    echo "<b>Is Writable:</b> " . (is_writable($dir) ? "Yes" : "No") . "<br>";
    $files = scandir($dir);
    echo "<b>Total items found:</b> " . count($files) . "<br><br>";
    echo "<pre>";
    print_r($files);
    echo "</pre>";
} else {
    echo "Directory does not exist.";
}
