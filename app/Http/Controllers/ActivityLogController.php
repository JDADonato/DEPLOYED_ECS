<?php

namespace App\Http\Controllers;

use App\Models\ActionLog;
use App\Models\Booking;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = ActionLog::with('user:id,username,role')
            ->orderBy('created_at', 'desc')
            ->paginate(50);
            
        return response()->json($logs);
    }

    public function undo(Request $request, $id)
    {
        $log = ActionLog::findOrFail($id);

        if ($log->action_type !== 'update_booking_status' && $log->action_type !== 'delete_announcement') {
            return response()->json(['error' => 'This action cannot be undone.'], 400);
        }

        // Prevent double-undo concurrency issue
        $alreadyUndone = ActionLog::where('action_type', 'like', 'undo_%')
            ->whereJsonContains('details->original_log_id', $log->id)
            ->exists();
            
        if ($alreadyUndone) {
            return response()->json(['error' => 'This action has already been undone.'], 400);
        }

        try {
            DB::beginTransaction();

            if ($log->action_type === 'update_booking_status') {
                $booking = Booking::findOrFail($log->target_id);
                // Revert to previous status
                $previousStatus = $log->previous_state['status'] ?? 'Pending';
                
                $booking->status = $previousStatus;
                $booking->save();
                
                ActionLog::create([
                    'user_id' => $request->user()->id,
                    'action_type' => 'undo_booking_status',
                    'target_type' => Booking::class,
                    'target_id' => $booking->id,
                    'details' => ['message' => 'Reverted status to ' . $previousStatus, 'original_log_id' => $log->id],
                    'previous_state' => ['status' => $log->new_state['status'] ?? 'Cancelled'],
                    'new_state' => ['status' => $previousStatus],
                ]);
            } elseif ($log->action_type === 'delete_announcement') {
                // Announcements that were deleted are likely soft-deleted if we are to undo them, 
                // OR we have to restore them from the $log->previous_state JSON payload.
                // Assuming we stored the full announcement in previous_state.
                
                $announcementData = $log->previous_state['announcement'] ?? null;
                if ($announcementData) {
                    $announcement = Announcement::create($announcementData);
                    
                    ActionLog::create([
                        'user_id' => $request->user()->id,
                        'action_type' => 'undo_delete_announcement',
                        'target_type' => Announcement::class,
                        'target_id' => $announcement->id,
                        'details' => ['message' => 'Restored announcement ' . $announcement->title, 'original_log_id' => $log->id],
                    ]);
                } else {
                    // Try to restore if it was soft deleted
                    $announcement = Announcement::withTrashed()->find($log->target_id);
                    if ($announcement) {
                        $announcement->restore();
                        
                        ActionLog::create([
                            'user_id' => $request->user()->id,
                            'action_type' => 'undo_delete_announcement',
                            'target_type' => Announcement::class,
                            'target_id' => $announcement->id,
                            'details' => ['message' => 'Restored announcement ' . $announcement->title, 'original_log_id' => $log->id],
                        ]);
                    } else {
                        return response()->json(['error' => 'Announcement data not found for restoration.'], 400);
                    }
                }
            }

            DB::commit();
            return response()->json(['message' => 'Action successfully undone.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Undo failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to undo action: ' . $e->getMessage()], 500);
        }
    }
}
