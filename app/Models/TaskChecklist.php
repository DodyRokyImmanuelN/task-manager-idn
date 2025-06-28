<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Task;
class TaskChecklist extends Model
{
    use HasFactory;

    protected $fillable = ['task_id', 'item', 'is_done'];

    public function tasks() {
        return $this->belongsTo(Task::class);
    }
    public function task()
{
    return $this->belongsTo(TaskDropdown::class, 'task_id');
}
}
