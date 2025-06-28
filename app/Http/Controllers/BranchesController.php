<?php

namespace App\Http\Controllers;

use App\Models\Branches;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BranchesController extends Controller
{
    public function index()
    {
        if (!in_array(Auth::user()->role, ['admin', 'superadmin'])) {
            abort(403, 'Unauthorized');
        }

        return response()->json(Branches::with('users')->get());
    }

    public function store(Request $request)
    {
        if (!in_array(Auth::user()->role, ['admin', 'superadmin'])) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Gunakan warna acak yang bagus jika tidak diberikan
        $color = $request->color ?? $this->generateNiceColor();

        $branch = Branches::create([
            'name' => $request->name,
            'color' => $color,
        ]);

        // Jika request AJAX dari Inertia (router.post / axios)
        if ($request->wantsJson()) {
            return response()->json($branch);
        }

        // Kalau dari form biasa (bukan AJAX)
        return redirect()->back()->with('success', 'Branch created.');
    }

    public function destroy($id)
    {
        if (!in_array(Auth::user()->role, ['admin', 'superadmin'])) {
            abort(403, 'Unauthorized');
        }

        $branch = Branches::findOrFail($id);
        $branch->delete();

        return response()->json(['message' => 'Branch deleted successfully.']);
    }

    /**
     * Menghasilkan warna-warna pastel/soft acak yang bagus
     */
    private function generateNiceColor()
    {
        $colors = [
            '#f87171', // red-400
            '#fb923c', // orange-400
            '#facc15', // yellow-400
            '#4ade80', // green-400
            '#34d399', // emerald-400
            '#60a5fa', // blue-400
            '#a78bfa', // violet-400
            '#f472b6', // pink-400
            '#fcd34d', // amber-300
            '#38bdf8', // sky-400
        ];

        return $colors[array_rand($colors)];
    }
}
