<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
{
    Route::middleware('role', RoleMiddleware::class);
        Inertia::share([
        'auth' => fn () => [
            'user' => auth()->user(),
        ],
        'branches' => fn () => auth()->check()
            ? \App\Models\Branches::all()
            : [],
    ]);
}
}
