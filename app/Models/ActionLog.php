<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActionLog extends Model
{
    use HasFactory;

    protected $guarded = [];

    const UPDATED_AT = null; // Logs are immutable

    protected $casts = [
        'details' => 'array',
        'previous_state' => 'array',
        'new_state' => 'array',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
