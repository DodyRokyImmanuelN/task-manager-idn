<?php

namespace App\Http\Controllers;

use App\Models\TaskDropdown;
use Illuminate\Http\Request;

class TaskDropdownController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
        'description' => 'nullable|string',
        'assignee_ids' => 'nullable|array',
        'assignee_ids.*' => 'exists:users,id',
    ]);

    $task = TaskDropdown::findOrFail($id);
    $task->description = $validated['description'] ?? $task->description;
    $task->save();

    if ($request->has('assignee_ids')) {
        $task->assignees()->sync($validated['assignee_ids']);
    }

    return response()->json([
        'message' => 'Task updated successfully.',
        'task' => $task->load('assignees'), 
    ]);
}


    public function assign(Request $request, $id)
    {
        $validated = $request->validate([
            'assignee_id' => 'required|exists:users,id',
        ]);

        $task = TaskDropdown::findOrFail($id);
        $task->assignee_id = $validated['assignee_id'];
        $task->save();

        $task->load('assignee');

        return response()->json([
            'message' => 'Assignee updated successfully.',
            'assignee' => $task->assignee,
        ]);
    }
}
