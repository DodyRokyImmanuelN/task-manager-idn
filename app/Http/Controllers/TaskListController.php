<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\Branches;
use App\Models\TaskList;
use App\Models\TaskComments;
use App\Models\User;
use App\Models\Label;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskListController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'title' => 'required|string|max:255',
        ]);

        $maxPosition = TaskList::where('branch_id', $request->branch_id)->max('position') ?? 0;

        $list = TaskList::create([
            'branch_id' => $request->branch_id,
            'title' => $request->title,
            'position' => $maxPosition + 1,
        ]);

        return response()->json($list);
    }

    public function boardView($branchId)
{
    $branch = Branches::with([
        'taskLists.taskDropdowns.checklists',
        'taskLists.taskDropdowns.comments.user',
        'taskLists.taskDropdowns.label',
        'taskLists.taskDropdowns.assignees',
        

    ])->findOrFail($branchId);

    return Inertia::render('Board/Index', [
        'branch' => $branch,
    ]);
}
public function destroy($id)
{
    $list = TaskList::findOrFail($id);
    $list->delete();

    return response()->json(['message' => 'List deleted successfully.']);
}
}
