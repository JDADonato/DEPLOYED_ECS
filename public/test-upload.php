<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<h2>Testing Storage Write Permissions</h2>";

try {
    $dir = storage_path('app/public/menu-images');
    echo "Target directory: $dir <br>";
    
    if (!file_exists($dir)) {
        echo "Directory does not exist. Attempting to create it...<br>";
        if (mkdir($dir, 0755, true)) {
            echo "Successfully created directory!<br>";
        } else {
            echo "Failed to create directory.<br>";
        }
    } else {
        echo "Directory already exists.<br>";
    }
    
    echo "Is directory writable? " . (is_writable($dir) ? "Yes" : "No") . "<br>";
    
    echo "Attempting to write test file using Storage disk...<br>";
    $result = \Illuminate\Support\Facades\Storage::disk('public')->put('menu-images/test_write.txt', 'Laravel Write Test ' . time());
    
    if ($result) {
        echo "Successfully wrote file to public disk!<br>";
        $path = storage_path('app/public/menu-images/test_write.txt');
        echo "File path: $path <br>";
        echo "File contents: " . file_get_contents($path) . "<br>";
        
        // Clean up
        unlink($path);
        echo "Successfully cleaned up test file.<br>";
    } else {
        echo "Storage disk put() returned false.<br>";
    }
} catch (\Exception $e) {
    echo "Exception occurred: " . $e->getMessage() . "<br>";
}
