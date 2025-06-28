<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TaskComments;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_list_id', 'title', 'description', 'assignee_id', 'created_by',
        'due_date', 'time_tracked', 'is_dispatched', 'dispatched_from_branch_id', 'status'
    ];

    public function tasklist() {
        return $this->belongsTo(TaskList::class);
    }

    public function assignee() {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function creator() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function checklists() {
        return $this->hasMany(TaskChecklist::class);
    }

    public function comments() {
        return $this->hasMany(TaskComments::class);
    }

    public function labels() {
        return $this->belongsToMany(TaskLabel::class, 'task_label_task');
    }

    public function timeLogs() {
        return $this->hasMany(TaskTimeLog::class);
    }

    public function notifications() {
        return $this->hasMany(Notification::class);
    }

    public function dispatchedFromBranch() {
        return $this->belongsTo(Branches::class, 'dispatched_from_branch_id');
    }
}
