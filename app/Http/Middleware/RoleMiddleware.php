<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Gunakan Auth::user() instead of $request->user()
        $user = Auth::user();

        Log::info('=== ROLE MIDDLEWARE DEBUG ===', [
            'path' => $request->path(),
            'auth_check' => Auth::check(),
            'request_user' => $request->user() ? $request->user()->id : 'NULL',
            'auth_user' => $user ? $user->id : 'NULL',
            'user_role_via_auth' => $user ? $user->role : 'NULL',
            'user_role_via_request' => $request->user() ? $request->user()->role : 'NULL',
            'required_roles' => $roles,
        ]);

        if (!$user) {
            Log::error('User not authenticated via Auth::user()');
            abort(401, 'Unauthenticated');
        }

        // Debug: Cek apakah user object memiliki role property
        $userArray = $user->toArray();
        Log::info('User object data:', $userArray);

        if (!isset($user->role) || !$user->role) {
            Log::error('User role not defined', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'user_attributes' => $user->getAttributes(),
                'has_role_property' => property_exists($user, 'role'),
                'role_value' => $user->role ?? 'NOT_SET'
            ]);
            abort(403, 'User role not defined');
        }

        if (!in_array($user->role, $roles)) {
            Log::error('Role not allowed', [
                'user_role' => $user->role,
                'required_roles' => $roles
            ]);
            abort(403, "Forbidden: Role '{$user->role}' not allowed");
        }

        Log::info('Role check passed');
        return $next($request);
    }
}