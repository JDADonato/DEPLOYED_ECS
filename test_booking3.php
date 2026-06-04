<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$booking = \App\Models\Booking::find(2857);
$selectedMenu = $booking->selected_menu_array;
$selectedMenu['starter'][] = 26;

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

$menuCost = $menuItemIds->reduce(function ($sum, $itemId) use ($menuItems, $pax) {
    if (!isset($menuItems[$itemId])) {
        return $sum;
    }
    $item = $menuItems[$itemId];
    $itemPrice = ((float) $item->cost_per_head + (float) ($item->price_adj ?? 0));
    dump("Item $itemId cost: $itemPrice * $pax = " . ($itemPrice * $pax));
    return $sum + ($itemPrice * $pax);
}, 0.0);

$finalCost = $menuCost + (float) ($booking->labor_surcharge ?? 0) + (float) ($booking->transport_fee ?? 0);
dump("Final without package base: " . $finalCost);
