<?php

namespace App\Http\Controllers;

use App\Models\TaskChecklist;
use Illuminate\Http\Request;

class TaskChecklistController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'task_id' => 'required|exists:task_dropdowns,id',
        'item' => 'required|string|max:255',
    ]);

    $checklist = TaskChecklist::create([
        'task_id' => $request->task_id,
        'item' => $request->item,
        'is_done' => false,
    ]);

    return response()->json($checklist);
}

    public function toggle($id)
{
    $checklist = TaskChecklist::findOrFail($id); 
    $checklist->is_done = !$checklist->is_done;
    $checklist->save();

    return redirect()->back();
}

public function destroy($id)
{
    $checklist = TaskChecklist::findOrFail($id); 
    $checklist->delete();

    return response()->noContent();
}
public function update(Request $request, $id)
{
    $data = $request->validate([
        'is_done' => 'required|boolean',
    ]);

    $checklist = TaskChecklist::findOrFail($id);
    $checklist->is_done = $data['is_done'];
    $checklist->save();

    return response()->json($checklist);
}

}
