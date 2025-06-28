<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class TaskLabelTask extends Model
{
    use HasFactory;

    protected $table = 'task_label_task';
    public $timestamps = false;

    protected $fillable = ['task_id', 'task_label_id'];

    public function tasks() {
        return $this->belongsTo(Task::class);
    }

    public function label() {
        return $this->belongsTo(TaskLabel::class, 'task_label_id');
    }
}
