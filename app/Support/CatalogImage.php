<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class CatalogImage
{
    public const DEFAULT_MENU_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400';

    public static function storeMenuImage(Request $request, string $field = 'image_file'): string
    {
        $path = $request->file($field)?->store('menu-images', 'public');

        if (!$path || !Storage::disk('public')->exists($path)) {
            throw ValidationException::withMessages([
                $field => 'The image was uploaded but could not be saved. Please try again.',
            ]);
        }

        return $path;
    }

    public static function normalize(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        $path = trim($path);

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        if (str_starts_with($path, '/storage/')) {
            return ltrim(substr($path, strlen('/storage/')), '/');
        }

        if (str_starts_with($path, 'storage/')) {
            return ltrim(substr($path, strlen('storage/')), '/');
        }

        if (str_starts_with($path, '/')) {
            return $path;
        }

        return ltrim($path, '/');
    }

    public static function url(?string $path, ?string $fallback = self::DEFAULT_MENU_IMAGE): ?string
    {
        $path = self::normalize($path) ?? $fallback;

        if (blank($path)) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/')) {
            return $path;
        }

        return '/storage/'.ltrim($path, '/');
    }

    public static function menuItemPayload($item, bool $includeCosts = true): array
    {
        $payload = [
            'id' => $item->id,
            'dish_id' => $item->dish_id,
            'name' => $item->name,
            'category' => $item->category,
            'image' => self::url($item->image),
            'image_path' => $item->image,
            'image_url' => self::url($item->image),
            'description' => $item->description,
            'is_best_seller' => (bool) $item->is_best_seller,
            'is_active' => (bool) $item->is_active,
            'created_at' => optional($item->created_at)->toDateTimeString(),
            'updated_at' => optional($item->updated_at)->toDateTimeString(),
        ];

        if ($includeCosts) {
            $payload['cost_per_head'] = $item->cost_per_head;
            $payload['price_adj'] = $item->price_adj;
            $payload['total_price_per_head'] = $item->total_price_per_head;
        }

        return $payload;
    }
}
