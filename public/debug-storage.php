<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<h2>Hostinger Storage Diagnostics</h2>";

$webRoot = __DIR__;
$storagePath = $webRoot . '/storage';

echo "<b>Web Root (__DIR__):</b> $webRoot <br>";
echo "<b>Storage Path:</b> $storagePath <br>";

if (file_exists($storagePath) || is_link($storagePath)) {
    echo "<b>Path status:</b> Exists<br>";
    if (is_link($storagePath)) {
        echo "<b>Type:</b> Symbolic Link<br>";
        $target = readlink($storagePath);
        echo "<b>Symlink Target:</b> $target <br>";
        echo "<b>Target Exists:</b> " . (file_exists($target) ? "Yes" : "No") . "<br>";
    } else if (is_dir($storagePath)) {
        echo "<b>Type:</b> Directory<br>";
    } else {
        echo "<b>Type:</b> File<br>";
    }
} else {
    echo "<b>Path status:</b> Does NOT exist<br>";
}

echo "<br><b>Laravel Storage Path (storage_path('app/public')):</b> " . storage_path('app/public') . "<br>";
echo "<b>Laravel Storage Directory Exists:</b> " . (file_exists(storage_path('app/public')) ? "Yes" : "No") . "<br>";

if (file_exists(storage_path('app/public'))) {
    echo "<b>Contents of storage_path('app/public'):</b><br><pre>";
    print_r(scandir(storage_path('app/public')));
    echo "</pre>";
    
    if (file_exists(storage_path('app/public/menu-images'))) {
        echo "<b>Contents of storage_path('app/public/menu-images'):</b><br><pre>";
        print_r(scandir(storage_path('app/public/menu-images')));
        echo "</pre>";
    }
}

echo "<br><b>Attempting to delete the link/directory at $storagePath if it exists...</b><br>";
if (file_exists($storagePath) || is_link($storagePath)) {
    if (is_link($storagePath)) {
        if (unlink($storagePath)) {
            echo "Successfully unlinked link.<br>";
        } else {
            echo "Failed to unlink. Trying rmdir...<br>";
            if (rmdir($storagePath)) {
                echo "Successfully rmdir-ed link.<br>";
            } else {
                echo "Failed to delete symlink.<br>";
            }
        }
    } else {
        echo "It is a physical folder. Trying to rename it...<br>";
        $backup = $storagePath . '_backup_' . time();
        if (rename($storagePath, $backup)) {
            echo "Successfully renamed folder to $backup<br>";
        } else {
            echo "Failed to rename folder.<br>";
        }
    }
} else {
    echo "No file/link exists at $storagePath to delete.<br>";
}
