<?php

namespace App\Http\Controllers;

use App\Models\GuestRequest;
use App\Models\Task;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GuestRequestController extends Controller
{
    public function index()
    {
        return response()->json(GuestRequest::with('branch')->where('status', 'pending')->get());
    }

    public function approve($id)
    {
        $request = GuestRequest::findOrFail($id);
        $request->status = 'approved';
        $request->approved_by = Auth::id();
        $request->save();

        $task = Task::create([
            'task_list_id' => null,
            'title' => $request->task_title,
            'description' => $request->task_description,
            'created_by' => Auth::id(),
            'status' => 'open',
        ]);

        return response()->json(['message' => 'Request approved and task created.', 'task' => $task]);
    }

    public function reject($id)
    {
        $request = GuestRequest::findOrFail($id);
        $request->status = 'rejected';
        $request->approved_by = Auth::id();
        $request->save();

        return response()->json(['message' => 'Request rejected.']);
    }
}
