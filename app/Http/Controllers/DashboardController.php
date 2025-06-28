<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Branches;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Jika superadmin bisa melihat semua branch
        if ($user->role === 'superadmin') {
            $branches = Branches::all();
        } else {
            $branches = Branches::where('id', $user->branch_id)->get();
        }

        return Inertia::render('Dashboard', [
            'user' => $user,
            'branches' => $branches,
        ]);
    }
}

