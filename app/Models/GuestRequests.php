<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class GuestRequests extends Model
{
    use HasFactory;

    protected $fillable = [
        'requester_name', 'branch_id', 'task_title', 'task_description', 'status', 'approved_by'
    ];

    public function branch() {
        return $this->belongsTo(Branches::class);
    }

    public function approver() {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
