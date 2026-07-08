<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$storagePath = public_path('storage');

echo "Checking path: $storagePath <br>";

try {
    // Check if the path exists or is a symlink (even if broken)
    if (file_exists($storagePath) || is_link($storagePath)) {
        echo "Found existing file, directory, or link at path.<br>";
        if (is_link($storagePath)) {
            // unlink works on Unix/Linux for symlinks
            if (@unlink($storagePath)) {
                echo "Successfully unlinked existing symbolic link.<br>";
            } else if (@rmdir($storagePath)) {
                echo "Successfully removed symlink using rmdir.<br>";
            } else {
                $backup = $storagePath . '_backup_' . time();
                rename($storagePath, $backup);
                echo "Could not delete link directly, renamed to: $backup<br>";
            }
        } else {
            $backup = $storagePath . '_backup_' . time();
            rename($storagePath, $backup);
            echo "Renamed existing folder/file to backup: $backup<br>";
        }
    } else {
        echo "No existing link or file found at target path.<br>";
    }

    echo "Running Artisan storage:link...<br>";
    \Illuminate\Support\Facades\Artisan::call('storage:link');
    echo "Storage link created successfully!<br><pre>";
    echo \Illuminate\Support\Facades\Artisan::output();
    echo "</pre>";
} catch (\Exception $e) {
    echo "Artisan storage:link failed: " . $e->getMessage() . "<br>";
    echo "Attempting to create symlink using native PHP symlink()...<br>";
    try {
        $target = storage_path('app/public');
        if (symlink($target, $storagePath)) {
            echo "Successfully created symbolic link using native symlink($target, $storagePath)!<br>";
        } else {
            echo "Native symlink() returned false.<br>";
        }
    } catch (\Exception $ex) {
        echo "Native symlink() failed: " . $ex->getMessage() . "<br>";
    }
}
