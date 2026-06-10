<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<h2>Simulating Storage Fallback Route</h2>";

$path = 'menu-images/QsaIcxFVm2azzwLP5BdvEbUs7dQasia3ntZ1YiK6.jpg';
echo "<b>Target Path:</b> $path <br>";

try {
    $disk = \Illuminate\Support\Facades\Storage::disk('public');
    
    echo "<b>Disk Driver:</b> " . get_class($disk) . "<br>";
    echo "<b>Resolved Path via path():</b> " . $disk->path($path) . "<br>";
    echo "<b>File exists via file_exists(Resolved Path):</b> " . (file_exists($disk->path($path)) ? "Yes" : "No") . "<br>";
    echo "<b>File exists via disk->exists():</b> " . ($disk->exists($path) ? "Yes" : "No") . "<br>";
    
    if ($disk->exists($path)) {
        echo "<b>MimeType:</b> " . $disk->mimeType($path) . "<br>";
        echo "<b>Size:</b> " . $disk->size($path) . " bytes<br>";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "<br>";
}
