<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'booking_source',
        'created_by_staff_id',
        'event_date',
        'event_time',
        'pax',
        'budget',
        'package_id',
        'event_type',
        'event_name',
        'event_type_id',
        'client_full_name',
        'venue_address_line',
        'venue_street',
        'venue_city',
        'venue_province',
        'venue_zip_code',
        'venue_building_details',
        'client_email',
        'client_phone',
        'reservation_time',
        'serving_time',
        'event_timeline',
        'color_motif',
        'food_tasting_id',
        'total_cost',
        'status',
        'review_status',
        'assigned_to',
        'transfer_requested_to',
        'transfer_requested_by',
        'transfer_requested_at',
        'clarification_request',
        'clarification_response',
        'clarification_requested_at',
        'clarification_responded_at',
        'reviewed_at',
        'outsourced_services',
        'theme_uploads',
        'special_instructions',
        'selected_menu',
        'live_status',
        'post_event_status',
        'closed_at',
        'hidden_from_customer_history_at',
        'cancellation_reason',
        'cancellation_reason_details',
        'cancelled_at',
        'closed_by',
        'transport_fee',
        'labor_surcharge',
        'discount_value',
        'discount_type',
        'expires_at',
        'milestone_step',
        'manual_unlocks',
    ];

    /**
     * Attribute casting — JSON fields are auto-serialized/deserialized.
     */
    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'expires_at' => 'datetime',
            'clarification_requested_at' => 'datetime',
            'clarification_responded_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'transfer_requested_at' => 'datetime',
            'closed_at' => 'datetime',
            'hidden_from_customer_history_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'total_cost' => 'decimal:2',
            'transport_fee' => 'decimal:2',
            'labor_surcharge' => 'decimal:2',
            'discount_value' => 'decimal:2',
            'pax' => 'integer',
            'budget' => 'integer',
            'outsourced_services' => 'array',
            'selected_menu' => 'array',
            'manual_unlocks' => 'array',
        ];
    }

    // ─── Relationships ───

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function createdByStaff()
    {
        return $this->belongsTo(User::class, 'created_by_staff_id');
    }

    public function eventType()
    {
        return $this->belongsTo(EventType::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function bookingItems()
    {
        return $this->hasMany(BookingItem::class);
    }

    public function menuItems()
    {
        return $this->belongsToMany(MenuItem::class, 'booking_items', 'booking_id', 'menu_item_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function foodTasting()
    {
        return $this->belongsTo(FoodTasting::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function transferRequestedTo()
    {
        return $this->belongsTo(User::class, 'transfer_requested_to');
    }

    public function transferRequestedBy()
    {
        return $this->belongsTo(User::class, 'transfer_requested_by');
    }

    public function reviewTasks()
    {
        return $this->hasMany(BookingReviewTask::class);
    }

    public function paymentEvents()
    {
        return $this->hasMany(PaymentEvent::class);
    }

    public function refundCases()
    {
        return $this->hasMany(RefundCase::class);
    }

    public function preparationTasks()
    {
        return $this->hasMany(EventPreparationTask::class);
    }

    public function feedbackRequest()
    {
        return $this->hasOne(FeedbackRequest::class);
    }

    public function feedbackResponses()
    {
        return $this->hasMany(FeedbackResponse::class);
    }

    public function historyNotes()
    {
        return $this->hasMany(BookingHistoryNote::class);
    }

    public function closedBy()
    {
        return $this->belongsTo(User::class, 'closed_by');
    }

    // ─── Helpers ───

    public function getEventDisplayNameAttribute(): string
    {
        return $this->event_name
            ?: $this->event_type
            ?: "Booking #{$this->id}";
    }

    /**
     * Get decoded selected_menu as array.
     */
    public function getSelectedMenuArrayAttribute(): ?array
    {
        return is_array($this->selected_menu) ? $this->selected_menu : ($this->selected_menu ? json_decode($this->selected_menu, true) : null);
    }

    /**
     * Get decoded outsourced_services as array.
     */
    public function getOutsourcedServicesArrayAttribute(): ?array
    {
        return is_array($this->outsourced_services) ? $this->outsourced_services : ($this->outsourced_services ? json_decode($this->outsourced_services, true) : null);
    }

    protected static function booted()
    {
        static::updating(function ($booking) {
            // Only trigger for confirmed/reserved bookings, excluding status changes like completed/cancelled
            if (in_array($booking->getOriginal('status'), ['Reserved', 'reserved', 'Confirmed', 'confirmed'])) {
                // If the booking is being cancelled or completed, don't trigger accounting review
                if (in_array($booking->status, ['Cancelled', 'cancelled', 'Completed', 'completed'])) {
                    return;
                }

                if ($booking->isDirty('pax') || 
                    $booking->isDirty('total_cost') || 
                    $booking->isDirty('selected_menu') || 
                    $booking->isDirty('transport_fee') || 
                    $booking->isDirty('labor_surcharge') || 
                    $booking->isDirty('discount_value') || 
                    $booking->isDirty('package_id')) {
                    
                    $booking->requires_accounting_review = true;
                    $booking->last_modified_reason = 'Booking details affecting price were modified.';
                }
            }
        });
    }
}
