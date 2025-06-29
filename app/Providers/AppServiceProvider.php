<?php

namespace App\Providers;


use Illuminate\Support\ServiceProvider;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Branches;
use App\Models\Task;

Inertia::share([
    'auth' => fn () => [
        'user' => Auth::user(),
    ],

    'branches' => fn () => Auth::check()
        ? (
            in_array(Auth::user()->role, ['admin', 'superadmin'])
                ? Branches::all(['id', 'name', 'color'])
                : Branches::whereIn('id', function ($query) {
                    $query->select('task_lists.branch_id')
                        ->from('task_dropdowns')
                        ->join('assignee_task_dropdown', 'task_dropdowns.id', '=', 'assignee_task_dropdown.task_dropdown_id')
                        ->join('task_lists', 'task_dropdowns.task_list_id', '=', 'task_lists.id')
                        ->where('assignee_task_dropdown.user_id', auth()->id());
                })->distinct()->get(['id', 'name', 'color'])
        )
        : [],
]);