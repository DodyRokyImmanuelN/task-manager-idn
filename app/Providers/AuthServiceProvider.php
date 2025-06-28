<?php

namespace App\Providers;
use App\Policies\ProjectPolicy;
use App\Models\Project;
use Inertia\Inertia;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Project::class => ProjectPolicy::class,
        
    ];

    public function boot(): void
    {
        //
    }
}
