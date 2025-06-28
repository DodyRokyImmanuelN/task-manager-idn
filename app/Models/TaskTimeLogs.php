<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaskTimeLogs extends Model
{
    use HasFactory;

    protected $fillable = ['task_id', 'user_id', 'duration', 'started_at', 'ended_at'];

    public function task() {
        return $this->belongsTo(Tasks::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
