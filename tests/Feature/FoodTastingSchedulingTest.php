<?php

namespace Tests\Feature;

use App\Models\FoodTasting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FoodTastingSchedulingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow(Carbon::parse('2026-06-01 09:00:00'));
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    public function test_valid_customer_tasting_succeeds(): void
    {
        $this->postJson('/api/food-tasting', $this->payload())
            ->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('food_tastings', [
            'guest_email' => 'guest@example.test',
            'preferred_date' => '2026-06-05',
            'preferred_time' => '11:00',
            'status' => 'Pending',
        ]);
    }

    public function test_customer_tasting_rejects_under_three_day_lead_time(): void
    {
        $this->postJson('/api/food-tasting', $this->payload(['preferred_date' => '2026-06-03']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('preferred_date');
    }

    public function test_customer_tasting_rejects_monday_to_thursday(): void
    {
        $this->postJson('/api/food-tasting', $this->payload(['preferred_date' => '2026-06-04']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('preferred_date');
    }

    public function test_customer_tasting_rejects_time_outside_tasting_window(): void
    {
        $this->postJson('/api/food-tasting', $this->payload(['preferred_time' => '15:30']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('preferred_time');
    }

    public function test_seventh_capacity_counting_tasting_on_same_day_is_rejected(): void
    {
        foreach (['Pending', 'Contacted', 'Approved', 'Confirmed', 'Rescheduled', 'Pending'] as $index => $status) {
            FoodTasting::create([
                'guest_name' => "Guest {$index}",
                'guest_email' => "guest{$index}@example.test",
                'preferred_date' => '2026-06-05',
                'preferred_time' => '11:00',
                'status' => $status,
            ]);
        }

        $this->postJson('/api/food-tasting', $this->payload())
            ->assertUnprocessable()
            ->assertJsonValidationErrors('preferred_date');
    }

    public function test_closed_tastings_do_not_count_toward_daily_capacity(): void
    {
        foreach (['Completed', 'Cancelled', 'Archived', 'Spam', 'Completed', 'Cancelled'] as $index => $status) {
            FoodTasting::create([
                'guest_name' => "Closed {$index}",
                'guest_email' => "closed{$index}@example.test",
                'preferred_date' => '2026-06-05',
                'preferred_time' => '11:00',
                'status' => $status,
            ]);
        }

        $this->postJson('/api/food-tasting', $this->payload())
            ->assertCreated();
    }

    public function test_availability_endpoint_returns_full_dates_only_for_capacity_statuses(): void
    {
        foreach (['Pending', 'Contacted', 'Approved', 'Confirmed', 'Rescheduled', 'Pending'] as $index => $status) {
            FoodTasting::create([
                'guest_name' => "Guest {$index}",
                'guest_email' => "capacity{$index}@example.test",
                'preferred_date' => '2026-06-05',
                'preferred_time' => '11:00',
                'status' => $status,
            ]);
        }

        FoodTasting::create([
            'guest_name' => 'Closed Guest',
            'guest_email' => 'closed@example.test',
            'preferred_date' => '2026-06-06',
            'preferred_time' => '11:00',
            'status' => 'Completed',
        ]);

        $this->getJson('/api/food-tasting/availability?year=2026&month=6')
            ->assertOk()
            ->assertJsonPath('full_dates.0', '2026-06-05');
    }

    public function test_staff_update_can_save_operational_exception(): void
    {
        $marketing = $this->user('Marketing');
        $tasting = FoodTasting::create([
            'guest_name' => 'Guest',
            'guest_email' => 'guest@example.test',
            'preferred_date' => '2026-06-05',
            'preferred_time' => '11:00',
            'status' => 'Pending',
            'handled_by' => $marketing->id,
        ]);

        $this->actingAs($marketing)
            ->patchJson("/api/marketing/food-tastings/{$tasting->id}", [
                'status' => 'Rescheduled',
                'preferred_date' => '2026-06-02',
                'preferred_time' => '09:00',
                'notes' => 'Customer requested exception.',
                'outcome_notes' => 'Approved by staff.',
            ])
            ->assertOk();

        $this->assertDatabaseHas('food_tastings', [
            'id' => $tasting->id,
            'preferred_date' => '2026-06-02',
            'preferred_time' => '09:00',
            'status' => 'Rescheduled',
        ]);
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'guest_name' => 'Guest Tester',
            'guest_email' => 'guest@example.test',
            'guest_phone' => '09170000000',
            'preferred_date' => '2026-06-05',
            'preferred_time' => '11:00',
            'notes' => 'No allergies.',
        ], $overrides);
    }

    private function user(string $role): User
    {
        return User::create([
            'full_name' => "{$role} Tester",
            'username' => strtolower($role).'_'.uniqid(),
            'email' => uniqid(strtolower($role).'_').'@example.test',
            'password' => 'password',
            'phone' => '09170000000',
            'role' => $role,
            'account_status' => 'active',
            'email_verified_at' => now(),
        ]);
    }
}
