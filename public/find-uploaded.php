<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Searching for Uploaded Files on Server</h2>";

$searchDir = realpath(__DIR__ . '/../');
echo "<b>Search Root Directory:</b> $searchDir <br><br>";

$targetName = 'nLa3PDOmfJaiIy9gCIQWUVXzRg1cznFO3Dr33oi0.jpg';
$found = [];

function searchFiles($dir, $target, &$found) {
    if (!is_dir($dir)) return;
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $path = $dir . '/' . $file;
        if (is_dir($path)) {
            // Skip vendor or node_modules to be fast
            if ($file === 'vendor' || $file === 'node_modules' || $file === '.git') continue;
            searchFiles($path, $target, $found);
        } else {
            if (strpos($file, 'nLa3P') !== false || $file === $target) {
                $found[] = $path;
            }
        }
    }
}

searchFiles($searchDir, $targetName, $found);

echo "<b>Search results:</b><br>";
if (count($found) > 0) {
    echo "Found " . count($found) . " matching files:<br><pre>";
    print_r($found);
    echo "</pre>";
} else {
    echo "No files matching '$targetName' found in the project folder.<br>";
}

// Let's also print any JPG files created in the last 1 hour in the storage directory
echo "<br><b>Checking for any JPG files created in the storage folder in the last hour...</b><br>";
$storageDir = realpath(__DIR__ . '/../storage');
$recentJpgs = [];

function findRecentJpgs($dir, &$recentJpgs) {
    if (!is_dir($dir)) return;
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $path = $dir . '/' . $file;
        if (is_dir($path)) {
            findRecentJpgs($path, $recentJpgs);
        } else {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'jpg' || pathinfo($file, PATHINFO_EXTENSION) === 'jpeg') {
                $mtime = filemtime($path);
                if (time() - $mtime < 3600) { // 1 hour
                    $recentJpgs[] = [
                        'path' => $path,
                        'created' => date('Y-m-d H:i:s', $mtime)
                    ];
                }
            }
        }
    }
}

if ($storageDir) {
    findRecentJpgs($storageDir, $recentJpgs);
}

if (count($recentJpgs) > 0) {
    echo "Found recent JPGs:<br><pre>";
    print_r($recentJpgs);
    echo "</pre>";
} else {
    echo "No recent JPGs found in storage.<br>";
}
