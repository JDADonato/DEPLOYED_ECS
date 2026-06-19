<?php
$storagePath = __DIR__ . '/storage';

echo "Target path: $storagePath <br>";

if (file_exists($storagePath) || is_link($storagePath)) {
    echo "Found existing file, directory, or link at path.<br>";
    
    // Attempt to unlink (delete symlink)
    if (is_link($storagePath)) {
        if (@unlink($storagePath)) {
            echo "Successfully deleted symbolic link.<br>";
        } else if (@rmdir($storagePath)) {
            echo "Successfully removed symbolic link directory.<br>";
        } else {
            // Rename as a fallback
            $backup = $storagePath . '_backup_' . time();
            if (@rename($storagePath, $backup)) {
                echo "Could not delete link, renamed to backup: $backup<br>";
            } else {
                echo "Failed to rename or delete link. Please check folder permissions.<br>";
            }
        }
    } else {
        // If it's a folder, rename it out of the way
        $backup = $storagePath . '_backup_' . time();
        if (@rename($storagePath, $backup)) {
            echo "Renamed folder to backup: $backup<br>";
        } else {
            echo "Failed to rename folder. Please check folder permissions.<br>";
        }
    }
} else {
    echo "No link or directory found at path. Ready to use the Laravel route fallback!<br>";
}
echo "<br>Finished cleaning path.";
