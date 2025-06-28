<?php

// app/Policies/ProjectPolicy.php

namespace App\Policies;

use App\Models\User;
use App\Models\Project;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        // Semua user yang login bisa melihat daftar project-nya sendiri
        return in_array($user->role, ['superadmin', 'admin', 'monitor', 'user']);
    }

    public function view(User $user, Project $project): bool
    {
        // User hanya boleh melihat project sesuai branch-nya
        return $user->branch_id === $project->id;
    }

    public function create(User $user): bool
    {
        // Hanya superadmin yang boleh membuat project
        return $user->role === 'superadmin';
    }

    public function update(User $user, Project $project): bool
    {
        // Superadmin bisa update semua project
        return $user->role === 'superadmin';
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->role === 'superadmin';
    }
}

