<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskList;
use App\Models\TaskComment;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        $taskLists = TaskList::with(['tasks.labels', 'tasks.assignee'])
            ->where('branch_id', $user->branch_id)
            ->orderBy('position')
            ->get();

        return Inertia::render('Tasks/Index', [
            'taskLists' => $taskLists,
            'branch' => $user->branch,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'task_list_id' => 'required|exists:task_lists,id',
            'title' => 'required|string|max:255',
        ]);

        $task = Task::create([
            'task_list_id' => $request->task_list_id,
            'title' => $request->title,
            'created_by' => Auth::id(),
            'status' => 'open',
        ]);

        return response()->json($task);
    }

    public function assign(Request $request, $id)
    {
        $request->validate([
            'assignee_id' => 'required|exists:users,id',
        ]);

        $task = Task::findOrFail($id);
        $task->assignee_id = $request->assignee_id;
        $task->save();

        Notification::create([
            'user_id' => $request->assignee_id,
            'task_id' => $task->id,
            'type' => 'assigned',
            'message' => 'You have been assigned a new task.',
        ]);

        return response()->json(['message' => 'Task assigned successfully.']);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $task->update($request->only([
            'title', 'description', 'due_date', 'status'
        ]));

        Notification::create([
            'user_id' => $task->assignee_id,
            'task_id' => $task->id,
            'type' => 'updated',
            'message' => 'Your task has been updated.',
        ]);

        return response()->json(['message' => 'Task updated successfully.']);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted.']);
    }

    public function myTasks()
    {
        $tasks = Task::with(['taskLists', 'labels'])
            ->where('assignee_id', Auth::id())
            ->get();

        return response()->json($tasks);
    }

    public function updateProgress(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $task->update(['status' => $request->status]);

        return response()->json(['message' => 'Task progress updated.']);
    }

    public function addComment(Request $request, $id)
    {
        $request->validate([
            'comment' => 'required|string',
        ]);

        $comment = TaskComment::create([
            'task_id' => $id,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
        ]);

        return response()->json($comment);
    }

    public function createByMonitor(Request $request)
    {
        $request->validate([
            'task_list_id' => 'required|exists:task_lists,id',
            'title' => 'required|string|max:255',
        ]);

        $task = Task::create([
            'task_list_id' => $request->task_list_id,
            'title' => $request->title,
            'created_by' => Auth::id(),
            'status' => 'open',
        ]);

        return response()->json($task);
    }
}
