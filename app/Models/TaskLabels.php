<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaskLabels extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'color'];

    public function task() {
        return $this->belongsToMany(Task::class, 'task_label_task');
    }
}
