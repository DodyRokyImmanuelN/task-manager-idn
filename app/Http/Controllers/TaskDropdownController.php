<?php

namespace App\Http\Controllers;

use App\Models\TaskDropdown;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia; 

class TaskDropdownController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_list_id' => 'required|exists:task_lists,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'assignee_ids' => 'nullable|array',
            'assignee_ids.*' => 'exists:users,id',
            'label_id' => 'nullable|exists:labels,id',
            'repeat' => 'nullable|in:none,daily,weekly,monthly'
        ]);

        try {
            DB::beginTransaction();

            $task = TaskDropdown::create([
                'task_list_id' => $validated['task_list_id'],
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'due_date' => $validated['due_date'] ?? null,
                'label_id' => $validated['label_id'] ?? null,
                'repeat' => $validated['repeat'] ?? 'none',
            ]);

            if (!empty($validated['assignee_ids'])) {
                $task->assignees()->sync($validated['assignee_ids']);
            }

            DB::commit();

            return response()->json([
                'message' => 'Task created successfully.',
                'task' => $task->load(['assignees', 'label']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'assignee_ids' => 'nullable|array',
            'assignee_ids.*' => 'exists:users,id',
            'label_id' => 'nullable|exists:labels,id',
            'repeat' => 'nullable|in:none,daily,weekly,monthly'
        ]);
        

        $task = TaskDropdown::findOrFail($id);

        try {
            DB::beginTransaction();

            $task->update([
                'title' => $validated['title'] ?? $task->title,
                'description' => $validated['description'] ?? $task->description,
                'due_date' => array_key_exists('due_date', $validated) ? $validated['due_date'] : $task->due_date,
                'label_id' => $validated['label_id'] ?? $task->label_id,
                'repeat' => $validated['repeat'] ?? 'none',
            ]);

            if (isset($validated['assignee_ids'])) {
                $task->assignees()->sync($validated['assignee_ids']);
            }

            DB::commit();

            return response()->json([
                'message' => 'Task updated successfully.',
                'task' => $task->load(['assignees', 'label']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Optional: Manual assign single user (not recommended for multi-assignee setup)
     */
    public function assign(Request $request, $id)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        try {
            DB::beginTransaction();

            $task = TaskDropdown::findOrFail($id);
            $task->assignees()->attach($validated['user_id']); // ← gunakan attach jika ingin menambah

            DB::commit();

            return response()->json([
                'message' => 'User assigned successfully.',
                'task' => $task->load('assignees'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to assign user to task',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function destroy($id)
{
    $task = TaskDropdown::findOrFail($id);

    try {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully.']);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to delete task',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function show($projectId, $taskId)
{
    $user = Auth::user();

    if (!$user) {
        abort(403, 'Unauthorized');
    }

    $task = TaskDropdown::with(['assignees', 'label', 'checklists', 'comments', 'list'])
        ->where('id', $taskId)
        ->whereHas('list', function ($q) use ($projectId) {
            $q->where('branch_id', $projectId); // ← Fix here
        })
        ->firstOrFail();

    $branch = $task->list->branch;

    return Inertia::render('Board/Show', [
        'task' => $task,
        'list' => $task->list,
        'branch' => $branch,
    ]);
}


}
