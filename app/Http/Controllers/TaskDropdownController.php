<?php

namespace App\Http\Controllers;

use App\Models\TaskDropdown;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskDropdownController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_list_id' => 'required|exists:task_lists,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assignee_ids' => 'nullable|array',
            'assignee_ids.*' => 'exists:users,id',
        ]);

        try {
            DB::beginTransaction();

            $task = TaskDropdown::create([
                'task_list_id' => $validated['task_list_id'],
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
            ]);

            if (!empty($validated['assignee_ids'])) {
                $task->assignees()->sync($validated['assignee_ids']);
            }

            DB::commit();

            return response()->json([
                'message' => 'Task created successfully.',
                'task' => $task->load('assignees'),
            ], 201); // HTTP 201 Created

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
            'title' => 'sometimes|string|max:255', // Ditambahkan field title
            'description' => 'nullable|string',
            'assignee_ids' => 'nullable|array',
            'assignee_ids.*' => 'exists:users,id',
        ]);

        $task = TaskDropdown::findOrFail($id);

        try {
            DB::beginTransaction();

            $task->update([
                'title' => $validated['title'] ?? $task->title,
                'description' => $validated['description'] ?? $task->description,
            ]);

            // Sync akan bekerja meskipun assignee_ids null atau array kosong
            $task->assignees()->sync($validated['assignee_ids'] ?? []);

            DB::commit();

            return response()->json([
                'message' => 'Task updated successfully.',
                'task' => $task->load('assignees'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function assign(Request $request, $id)
    {
        $validated = $request->validate([
            'assignee_id' => 'required|exists:users,id',
        ]);

        try {
            DB::beginTransaction();

            $task = TaskDropdown::findOrFail($id);
            $task->update(['assignee_id' => $validated['assignee_id']]);

            DB::commit();

            return response()->json([
                'message' => 'Assignee updated successfully.',
                'assignee' => $task->fresh()->assignee,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to assign task',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}