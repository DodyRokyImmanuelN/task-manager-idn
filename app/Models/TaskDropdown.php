<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TaskList;
use App\Models\TaskChecklist;
use App\Models\TaskComments;
use App\Models\User;
class TaskDropdown extends Model
{
    protected $fillable = ['task_list_id', 'title','description','due_date',];

    public function TaskList()
    {
        return $this->belongsTo(TaskList::class);
    }
    public function checklists()
    { 
    return $this->hasMany(TaskChecklist::class, 'task_id');
    }
    public function comments()
{
    return $this->hasMany(TaskComments::class, 'task_id');
}
public function assignees()
{
    return $this->belongsToMany(User::class, 'assignee_task_dropdown');
}
}
