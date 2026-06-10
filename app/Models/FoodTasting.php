<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodTasting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'guest_name',
        'guest_email',
        'guest_phone',
        'preferred_date',
        'preferred_time',
        'notes',
        'status',
        'confirmed_at',
        'completed_at',
        'archived_at',
        'outcome_notes',
        'handled_by',
        'duplicate_user_id',
        'transfer_requested_to',
        'transfer_requested_by',
        'transfer_requested_at',
    ];

    protected function casts(): array
    {
        return [
            'preferred_date' => 'date',
            'confirmed_at' => 'datetime',
            'completed_at' => 'datetime',
            'archived_at' => 'datetime',
            'transfer_requested_at' => 'datetime',
        ];
    }

    // ─── Relationships ───

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function duplicateUser()
    {
        return $this->belongsTo(User::class, 'duplicate_user_id');
    }

    public function handler()
    {
        return $this->belongsTo(User::class, 'handled_by');
    }

    public function transferRequestedTo()
    {
        return $this->belongsTo(User::class, 'transfer_requested_to');
    }

    public function transferRequestedBy()
    {
        return $this->belongsTo(User::class, 'transfer_requested_by');
    }
}
