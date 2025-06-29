<?php

namespace App\Http\Controllers;

use App\Models\Label;
use Illuminate\Http\Request;

class LabelController extends Controller
{
    public function index()
    {
        return Label::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:labels,name',
            'color' => 'nullable|string|max:20',
        ]);

        $label = Label::create($validated);

        return response()->json($label, 201);
    }
    public function attach(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:100',
        'color' => 'required|string|max:20', // bisa '#ff0000'
    ]);

    // Cek apakah label dengan nama dan warna yang sama sudah ada
    $label = \App\Models\Label::firstOrCreate([
        'name' => $validated['name'],
        'color' => $validated['color'],
    ]);

    return response()->json(['label' => $label], 200);
}

}