<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$items = \App\Models\MenuItem::all();
$count = 0;
foreach ($items as $item) {
    if (str_starts_with($item->image, 'http')) {
        $url = $item->image;
        $filename = basename(parse_url($url, PHP_URL_PATH));
        $path = __DIR__ . '/images/menu/' . $filename;
        if (!file_exists(__DIR__ . '/images/menu')) {
            mkdir(__DIR__ . '/images/menu', 0755, true);
        }
        if (!file_exists($path)) {
            try {
                $opts = [
                    "http" => [
                        "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n"
                    ]
                ];
                $context = stream_context_create($opts);
                $content = @file_get_contents($url, false, $context);
                if ($content) {
                    file_put_contents($path, $content);
                }
            } catch (\Exception $e) {}
        }
        $item->image = '/images/menu/' . $filename;
        $item->save();
        $count++;
    }
}
echo "Fixed $count images!";
