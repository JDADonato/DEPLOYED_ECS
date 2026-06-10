<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<h2>Menu Items with '/storage/' in Image Path</h2>";

try {
    $items = \App\Models\MenuItem::where('image', 'like', '%/storage/%')->get();
    echo "Found " . count($items) . " items.<br><br>";
    
    foreach ($items as $item) {
        $relativePath = str_replace('/storage/', '', $item->image);
        $diskPath = storage_path('app/public/' . $relativePath);
        $exists = file_exists($diskPath) ? "Yes" : "No (404)";
        
        echo "<b>ID:</b> {$item->id} <br>";
        echo "<b>Name:</b> {$item->name} <br>";
        echo "<b>Image:</b> {$item->image} <br>";
        echo "<b>Exists on Disk:</b> $exists (Path: $diskPath) <br>";
        echo "<hr>";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
