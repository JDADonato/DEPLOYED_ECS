<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Serializes menu items for public (unauthenticated) consumption.
 * Strips internal cost fields (cost_per_head, price_adj) that should
 * only be visible to authenticated staff/admin users.
 */
class PublicMenuItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'dish_id' => $this->dish_id,
            'name' => $this->name,
            'category' => $this->category,
            'image' => $this->image,
            'description' => $this->description,
            'is_best_seller' => (bool) $this->is_best_seller,
            'is_active' => (bool) $this->is_active,
        ];
    }
}
