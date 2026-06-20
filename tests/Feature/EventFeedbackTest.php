<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\FeedbackRequest;
use App\Models\FeedbackResponse;
use App\Models\User;
use App\Services\BookingCompletionService;
use App\Services\EventPreparationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventFeedbackTest extends TestCase
{
    use RefreshDatabase;

    private function createCustomer(): User
    {
        return User::create([
            'full_name' => 'Test Customer',
            'username' => 'testcustomer_' . uniqid(),
            'email' => uniqid('cust_') . '@example.test',
            'phone' => '09170000000',
            'password' => bcrypt('password'),
            'role' => 'Client',
            'account_status' => 'active',
        ]);
    }

    private function createAdmin(): User
    {
        return User::create([
            'full_name' => 'Admin User',
            'username' => 'admin_' . uniqid(),
            'email' => uniqid('admin_') . '@example.test',
            'password' => bcrypt('password'),
            'role' => 'Admin',
        ]);
    }

    private function setupCompletedBookingWithFeedbackRequest(User $customer): FeedbackRequest
    {
        $booking = Booking::create([
            'user_id' => $customer->id,
            'event_date' => now()->subDay()->toDateString(),
            'event_time' => '18:00:00',
            'event_name' => 'Test Wedding',
            'status' => 'Confirmed',
            'review_status' => 'Approved For Reservation',
            'live_status' => 'Completed',
            'pax' => 100,
            'total_cost' => 5000,
        ]);

        EventPreparationService::ensureDefaultTasks($booking);
        $booking->preparationTasks()->update(['status' => 'Done']);
        $booking->payments()->create(['amount' => 5000, 'status' => 'Paid', 'payment_method' => 'Cash', 'payment_type' => 'Full']);

        $admin = $this->createAdmin();

        $result = app(BookingCompletionService::class)->complete($booking, $admin, true, 'Testing completion override');
        
        $this->assertTrue($result['completed']);
        $this->assertNotNull($result['feedback_request']);
        
        return $result['feedback_request'];
    }

    public function test_cust_cx_004_view_feedback_request_after_completed_event(): void
    {
        $customer = $this->createCustomer();
        $feedbackRequest = $this->setupCompletedBookingWithFeedbackRequest($customer);

        $response = $this->actingAs($customer)
            ->getJson('/api/customer/feedback-requests');

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.token', $feedbackRequest->token)
            ->assertJsonPath('0.status', 'Pending');
    }

    public function test_cust_cx_005_submit_positive_feedback(): void
    {
        $customer = $this->createCustomer();
        $feedbackRequest = $this->setupCompletedBookingWithFeedbackRequest($customer);

        $response = $this->actingAs($customer)
            ->postJson("/api/customer/feedback-requests/{$feedbackRequest->token}/responses", [
                'rating' => 5,
                'comments' => 'Amazing experience!',
                'testimonial_permission' => true,
            ]);

        $response->assertCreated()
            ->assertJsonPath('message', 'Thank you for your feedback.');

        $this->assertDatabaseHas('feedback_responses', [
            'feedback_request_id' => $feedbackRequest->id,
            'rating' => 5,
            'testimonial_permission' => 1,
            'testimonial_status' => 'Candidate',
            'review_status' => 'Open',
        ]);
        
        $this->assertDatabaseHas('feedback_requests', [
            'id' => $feedbackRequest->id,
            'status' => 'Completed',
        ]);
    }

    public function test_cust_cx_006_submit_low_rating_feedback(): void
    {
        $customer = $this->createCustomer();
        $feedbackRequest = $this->setupCompletedBookingWithFeedbackRequest($customer);

        $response = $this->actingAs($customer)
            ->postJson("/api/customer/feedback-requests/{$feedbackRequest->token}/responses", [
                'rating' => 2,
                'comments' => 'Food was cold.',
            ]);

        $response->assertCreated();

        $this->assertDatabaseHas('feedback_responses', [
            'feedback_request_id' => $feedbackRequest->id,
            'rating' => 2,
            'follow_up_required' => 1,
            'review_status' => 'Needs Follow Up',
        ]);
    }

    public function test_cust_cx_007_reuse_feedback_token(): void
    {
        $customer = $this->createCustomer();
        $feedbackRequest = $this->setupCompletedBookingWithFeedbackRequest($customer);

        // First submission
        $this->actingAs($customer)
            ->postJson("/api/customer/feedback-requests/{$feedbackRequest->token}/responses", [
                'rating' => 4,
            ])->assertCreated();

        // Second submission using the same token
        $response = $this->actingAs($customer)
            ->postJson("/api/customer/feedback-requests/{$feedbackRequest->token}/responses", [
                'rating' => 5,
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('error', 'Feedback was already submitted.');

        // Verify only one response exists
        $this->assertEquals(1, FeedbackResponse::where('feedback_request_id', $feedbackRequest->id)->count());
    }
}
