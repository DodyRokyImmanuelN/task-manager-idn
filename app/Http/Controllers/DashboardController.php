<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Branches;
use App\Models\TaskDropdown;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Ambil semua TaskDropdown yang user ini ditugaskan ke dalamnya
        $assignedTaskIds = $user->taskDropdowns()->pluck('task_dropdowns.id');

        // Ambil semua branch yang terkait task yang ditugaskan ke user
        if ($user->role === 'superadmin') {
            $branches = Branches::all(['id', 'name', 'color']);
        } else {
            $branches = Branches::whereIn('id', function ($query) use ($user) {
                $query->select('task_lists.branch_id')
                    ->from('task_dropdowns')
                    ->join('assignee_task_dropdown', 'task_dropdowns.id', '=', 'assignee_task_dropdown.task_dropdown_id')
                    ->join('task_lists', 'task_dropdowns.task_list_id', '=', 'task_lists.id')
                    ->where('assignee_task_dropdown.user_id', $user->id);
            })->distinct()->get(['id', 'name', 'color']);
        }

        // Hitung task yang masih open dan yang selesai
        $openTasks = TaskDropdown::whereIn('id', $assignedTaskIds)->count();
$completedTasks = 0;

        

        return Inertia::render('Dashboard', [
            'branches' => $branches,
            'openTasks' => $openTasks,
            
        ]);
    }
    public function totalBranches()
{
    $user = Auth::user();

    if ($user->role === 'superadmin') {
        $total = \App\Models\Branches::count();
    } else {
        // Ambil semua task_dropdown yang user ini diassign
        $taskDropdowns = $user->taskDropdowns()->with('taskList')->get();

        // Ambil semua branch_id dari task_list yang berelasi dengan task_dropdown tadi
        $branchIds = $taskDropdowns
            ->map(fn ($td) => $td->taskList->branch_id ?? null)
            ->filter()
            ->unique()
            ->values();

        $total = $branchIds->count();
    }

    return response()->json(['total' => $total]);
}
}
