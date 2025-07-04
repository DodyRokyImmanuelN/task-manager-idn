<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TaskList;
use App\Models\TaskChecklist;
use App\Models\TaskComments;
use App\Models\User;
use App\Models\TaskLabels;
use App\Models\Label;
class TaskDropdown extends Model
{
    protected $fillable = ['task_list_id', 'title','description','due_date',"label_id", 'assignee_id','repeat'];

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
public function label()
{
    return $this->belongsTo(Label::class);
}
public function project()
{
    return $this->belongsTo(Project::class, 'project_id'); // atau 'branch_id' jika Anda pakai itu
}

public function taskList()
{
    return $this->belongsTo(TaskList::class, 'task_list_id');
}
public function list()
{
    return $this->belongsTo(TaskList::class, 'task_list_id');
}


}
