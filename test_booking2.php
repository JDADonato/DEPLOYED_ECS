<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$booking = \App\Models\Booking::find(2857);
$selectedMenu = $booking->selected_menu_array;
$selectedMenu['starter'][] = 26; // Assuming 26 is Crispy Tofu Bites or some other starter

$menuItemIds = collect($selectedMenu)
    ->flatMap(fn ($items) => is_array($items) ? $items : [])
    ->map(function ($item) {
        if (is_array($item)) return $item['id'] ?? null;
        return $item;
    })
    ->filter()
    ->map(fn ($id) => (int) $id)
    ->values();

$menuItems = \App\Models\MenuItem::whereIn('id', $menuItemIds)->get()->keyBy('id');
$pax = (int)$booking->pax;

$package = \App\Models\Package::find($booking->package_id);
$baseCost = (float) ($package->base_price_per_head * $pax);
$extraCost = 0.0;
$allowances = $package->menu_structure ?: [];

foreach ($selectedMenu as $category => $items) {
    if (!is_array($items)) continue;

    $allowance = (int) ($allowances[$category] ?? 0);
    if (count($items) > $allowance) {
        $extraItems = array_slice($items, $allowance);
        foreach ($extraItems as $extraItem) {
            $itemId = is_array($extraItem) ? ($extraItem['id'] ?? null) : $extraItem;
            if ($itemId && isset($menuItems[$itemId])) {
                $item = $menuItems[$itemId];
                $itemPrice = (float) $item->cost_per_head + (float) ($item->price_adj ?? 0);
                dump("Extra item $itemId cost: $itemPrice * $pax = " . ($itemPrice * $pax));
                $extraCost += $itemPrice * $pax;
            }
        }
    }
}

$menuCost = $baseCost + $extraCost;
$finalCost = $menuCost + (float) ($booking->labor_surcharge ?? 0) + (float) ($booking->transport_fee ?? 0);

dump([
    'base_cost' => $baseCost,
    'extra_cost' => $extraCost,
    'menu_cost' => $menuCost,
    'labor' => (float)$booking->labor_surcharge,
    'transport' => (float)$booking->transport_fee,
    'final_cost' => $finalCost
]);
