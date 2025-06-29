<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    

    public function index(Request $request)
    {
        $search = $request->input('search');
        $query = User::query();

        if ($search) {
            $query->where(fn ($q) =>
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
            );
        }

        $users = $query->orderBy('created_at', 'desc')
                       ->paginate(10)
                       ->withQueryString();

        return Inertia::render('UserManagement/Index', [
            'users' => $users,
            'search' => $search,
        ]);
    }

    
       public function store(Request $request)
{
    $request->validate([
        'name'     => 'required|string|max:255',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
        'role'     => 'required|in:user,admin,superadmin',
    ]);

    User::create([
        'name'     => $request->name,
        'email'    => $request->email,
        'password' => Hash::make($request->password),
        'role'     => $request->role,
    ]);

    return back()->with('success', 'User created.');
}
    

    public function update(Request $request, $id)
{
    $request->validate([
        'name'  => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $id,
        'role'  => 'required|in:user,admin,superadmin',
    ]);

    $user = User::findOrFail($id);

    $user->update([
        'name'  => $request->name,
        'email' => $request->email,
        'role'  => $request->role,
    ]);

    return back()->with('success', 'User updated.');
}

    

    // UserManagementController.php
public function destroy(User $user) // atau destroy($user)
{
    try {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted.');
    } catch (\Exception $e) {
        return redirect()->route('users.index')->with('error', 'Failed to delete user');
    }
}
}
