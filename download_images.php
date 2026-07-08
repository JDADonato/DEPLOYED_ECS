<?php
require __DIR__.'/vendor/autoload.php';
require __DIR__.'/bootstrap/app.php';
$kernel = app()->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$items = \App\Models\MenuItem::all();
$dir = public_path('images/menu');
if (!is_dir($dir)) mkdir($dir, 0755, true);

foreach ($items as $item) {
    if (str_starts_with($item->image, 'http')) {
        $url = $item->image;
        $filename = basename(parse_url($url, PHP_URL_PATH));
        $path = $dir . '/' . $filename;
        
        if (!file_exists($path)) {
            echo "Downloading $filename...\n";
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            $data = curl_exec($ch);
            if(curl_errno($ch)) {
                echo "Error: " . curl_error($ch) . "\n";
            } else {
                file_put_contents($path, $data);
            }
            curl_close($ch);
        }
        
        $item->image = '/images/menu/' . $filename;
        $item->save();
    }
}
echo "Done!\n";
