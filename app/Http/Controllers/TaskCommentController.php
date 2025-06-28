<?php
namespace App\Http\Controllers;

use App\Models\TaskComments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TaskCommentController extends Controller
{
    public function store(Request $request)
    {
         $request->validate([
        'task_id' => 'required|exists:task_dropdowns,id',
        'comment' => 'required|string|max:500',
    ]);

    $comment = TaskComments::create([
        'task_id' => $request->task_id,
        'user_id' => Auth::id(),
        'comment' => $request->comment,
    ]);

    // Include user info dalam response
    $comment->load('user');

    return response()->json($comment);
    }
}