<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Task;
use App\Models\TaskDropdown;
use App\Models\Branches;

class TaskList extends Model
{
    use HasFactory;

    protected $fillable = ['branch_id', 'title', 'position'];

    public function branch()
    {
        return $this->belongsTo(Branches::class);
    }   

    public function tasks()
    {
        return $this->hasMany(Task::class, 'task_list_id');
    }

    public function taskDropdowns()
    {
        return $this->hasMany(TaskDropdown::class);
    }
    public function project()
{
    return $this->belongsTo(Project::class);
}
}
