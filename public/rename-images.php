<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$map = [
    '%22Amai-Yuwaku%22_Special_Loin_Pork_Cutlet1.jpg' => 'Amai-Yuwaku_Special_Loin_Pork_Cutlet1.jpg',
    '500px-28_oz_cans_of_San_Marzano_tomatoes%2C_three_ways.jpg' => '500px-28_oz_cans_of_San_Marzano_tomatoes_three_ways.jpg',
    '500px-Croquetas_Caseras_%287068664101%29.jpg' => '500px-Croquetas_Caseras_7068664101.jpg',
    '500px-Cucumber_sandwiches_%288768307255%29.jpg' => '500px-Cucumber_sandwiches_8768307255.jpg',
    '500px-Jacques_Lameloise%2C_escab%C3%A8che_d%27%C3%A9crevisses_sur_gaspacho_d%27asperge_et_cresson.jpg' => '500px-Jacques_Lameloise_escabeche_d_ecrevisses_sur_gaspacho_d_asperge_et_cresson.jpg',
    '500px-Production_of_homemade_chips_%284%29.JPG' => '500px-Production_of_homemade_chips_4.JPG',
    '500px-Ringier_175_Jahre_Jubil%C3%A4um_%282499873203%29_%282%29.jpg' => '500px-Ringier_175_Jahre_Jubilaeum_2499873203_2.jpg',
];

try {
    // Also perform any on-disk rename on the server just in case
    $dir = public_path('images/menu/');
    foreach ($map as $old => $new) {
        if (file_exists($dir . $old) && !file_exists($dir . $new)) {
            rename($dir . $old, $dir . $new);
            echo "Renamed file on disk: $old -> $new<br>";
        }
    }

    $items = \App\Models\MenuItem::all();
    $count = 0;
    foreach ($items as $item) {
        $changed = false;
        foreach ($map as $oldName => $newName) {
            $oldUrl = '/images/menu/' . $oldName;
            $newUrl = '/images/menu/' . $newName;
            if ($item->image === $oldUrl) {
                $item->image = $newUrl;
                $changed = true;
            }
        }
        if ($changed) {
            $item->save();
            $count++;
            echo "Updated database record for: {$item->name} -> /images/menu/{$newName}<br>";
        }
    }
    
    // Clear catalog versions
    cache()->forget('catalog.version');
    
    echo "<br>Successfully updated $count database records to clean image filenames!";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
