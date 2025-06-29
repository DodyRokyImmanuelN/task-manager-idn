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
     $user = Auth::user();
    $branch = Branches::with([
        'taskLists.taskDropdowns.checklists',
        'taskLists.taskDropdowns.comments.user',
        'taskLists.taskDropdowns.label',
        'taskLists.taskDropdowns.assignees',
        

    ])->findOrFail($branchId);
    if ($user->role !== 'superadmin') {
        // Ambil semua task_dropdowns dalam branch ini
        $assigned = false;
        foreach ($branch->taskLists as $list) {
            foreach ($list->taskDropdowns as $task) {
                if ($task->assignees->contains('id', $user->id)) {
                    $assigned = true;
                    break 2; // keluar dari dua loop langsung
                }
            }
        }

        if (!$assigned) {
            return redirect()->route('dashboard')->with('error', 'Kamu tidak punya akses ke board ini.');
        }
    }


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
