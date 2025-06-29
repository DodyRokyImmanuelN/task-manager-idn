<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\branches;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email', 
        'password',
        'role',
        'created_by',
        'branch_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Pastikan role selalu accessible
    public function getRoleAttribute($value)
    {
        return $value;
    }
    public function taskComments()
{
    return $this->hasMany(TaskComments::class);
}
public function assignedTasks()
{
    return $this->belongsToMany(TaskDropdown::class, 'assignee_task_dropdown', 'user_id', 'task_dropdown_id')->withTimestamps();
}
public function taskDropdowns()
{
    return $this->belongsToMany(TaskDropdown::class, 'assignee_task_dropdown');
}

public function branches()
{
    return $this->belongsToMany(Branches::class);
}
}