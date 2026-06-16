<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<h2>Database Menu Items Check</h2>";

try {
    $items = \App\Models\MenuItem::all();
    echo "Total menu items in database: " . count($items) . "<br><br>";
    
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>ID</th><th>Name</th><th>Image Path</th><th>File Exists on Disk?</th></tr>";
    
    foreach ($items as $item) {
        $exists = "N/A (Not storage path)";
        if (str_starts_with($item->image, '/storage/')) {
            $relativePath = str_replace('/storage/', '', $item->image);
            $diskPath = storage_path('app/public/' . $relativePath);
            $exists = file_exists($diskPath) ? "<font color='green'>Yes</font>" : "<font color='red'>No (404)</font>";
            $exists .= " (Path: $diskPath)";
        }
        echo "<tr>";
        echo "<td>{$item->id}</td>";
        echo "<td>{$item->name}</td>";
        echo "<td>{$item->image}</td>";
        echo "<td>{$exists}</td>";
        echo "</tr>";
    }
    echo "</table>";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
