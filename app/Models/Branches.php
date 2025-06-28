<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\TaskList;


class Branches extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'color', 'created_by'];

    public function creator() {
        return $this->belongsTo(User::class, 'created_by');
    }


    public function users() {
        return $this->hasMany(User::class);
    }
    public function taskLists()
    {
        return $this->hasMany(TaskList::class, 'branch_id');
    }
}
