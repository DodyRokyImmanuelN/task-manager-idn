<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskLabel;
use Illuminate\Http\Request;

class TaskLabelController extends Controller
{
    public function assign(Request $request, $taskId)
    {
        $request->validate([
            'label_id' => 'required|exists:task_labels,id'
        ]);

        $task = Task::findOrFail($taskId);
        $task->labels()->attach($request->label_id);

        return response()->json(['message' => 'Label assigned to task.']);
    }

    public function remove(Request $request, $taskId)
    {
        $request->validate([
            'label_id' => 'required|exists:task_labels,id'
        ]);

        $task = Task::findOrFail($taskId);
        $task->labels()->detach($request->label_id);

        return response()->json(['message' => 'Label removed from task.']);
    }

    public function availableLabels()
    {
        return response()->json(TaskLabel::all());
    }
}
