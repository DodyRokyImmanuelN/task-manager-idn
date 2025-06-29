<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\BranchesController;
use App\Http\Controllers\GuestRequestController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TaskCommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TaskDropdownController;
use App\Http\Controllers\TaskChecklistController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\UserManagementController;


// Redirect root ke login
Route::get('/', fn () => redirect()->route('login'));

// Quick users fetcher
 Route::get('/api/quick-users', fn () => \App\Models\User::select('id', 'name')->get());

// Dashboard - all verified user
Route::middleware(['auth', 'verified'])->get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::get('/branches/total', [DashboardController::class, 'totalBranches']);

// AUTHENTICATED ROUTES
Route::middleware(['auth'])->group(function () {
    
    // Universal (semua role)
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/branches/total', [BranchesController::class, 'getTotal']);
    Route::get('/projects/{id}/board', [TaskListController::class, 'boardView'])->name('projects.board');
    Route::get('/projects/{project}/tasks/{task}', fn ($project, $task) => redirect("/projects/{$project}/board?task={$task}"));

    // === USER ===
    Route::middleware('role:user')->group(function () {
        Route::get('/my-tasks', [TaskController::class, 'myTasks']);
        Route::post('/tasks/{id}/progress', [TaskController::class, 'updateProgress']);
        Route::post('/tasks/{id}/comment', [TaskController::class, 'addComment']);
    });

    // === MONITOR, ADMIN, SUPERADMIN ===
    Route::middleware('role:monitor,admin,superadmin')->group(function () {
        Route::post('/tasks/create-by-monitor', [TaskController::class, 'createByMonitor']);
    });

    // === ADMIN & SUPERADMIN ===
    Route::middleware('role:admin,superadmin')->group(function () {
        // Task List & Task
        Route::post('/task-lists', [TaskListController::class, 'store']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::post('/tasks/{id}/assign', [TaskController::class, 'assign']);
        Route::put('/tasks/{id}', [TaskController::class, 'update']);
        Route::delete('/task-lists/{id}', [TaskListController::class, 'destroy']);

        // Guest Request
        Route::get('/guest-requests', [GuestRequestController::class, 'index']);
        Route::post('/guest-requests/{id}/approve', [GuestRequestController::class, 'approve']);
        Route::post('/guest-requests/{id}/reject', [GuestRequestController::class, 'reject']);

        // Checklist & Comment
        Route::post('/task-checklists', [TaskChecklistController::class, 'store']);
        Route::put('/task-checklists/{id}/toggle', [TaskChecklistController::class, 'toggle']);
        Route::put('/task-checklists/{id}', [TaskChecklistController::class, 'update']);
        Route::delete('/task-checklists/{id}', [TaskChecklistController::class, 'destroy']);
        Route::post('/task-comments', [TaskCommentController::class, 'store'])->name('task-comments.store');
    });

    // === SUPERADMIN (full access) ===
    Route::middleware('role:superadmin')->group(function () {
        // Branch Management
        Route::get('/branches', [BranchesController::class, 'index']);
        Route::post('/branches', [BranchesController::class, 'store']);
        Route::delete('/branches/{id}', [BranchesController::class, 'destroy']);

        // Dropdown & Label Management
        Route::post('/task-dropdowns', [TaskDropdownController::class, 'store']);
        Route::put('/task-dropdowns/{id}', [TaskDropdownController::class, 'update']);
        Route::delete('/task-dropdowns/{id}', [TaskDropdownController::class, 'destroy']);
        Route::put('/task-dropdowns/{id}/assign', [TaskDropdownController::class, 'assign']);

        Route::get('/labels', [LabelController::class, 'index']);
        Route::post('/labels', [LabelController::class, 'store']);
        Route::post('/labels/attach', [LabelController::class, 'attach']);

        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
        Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserManagementController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
       });
});

require __DIR__.'/auth.php';



