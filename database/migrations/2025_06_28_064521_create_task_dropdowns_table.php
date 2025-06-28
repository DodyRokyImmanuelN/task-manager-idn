<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('task_dropdowns', function (Blueprint $table) {
        $table->id();
        $table->foreignId('task_list_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_dropdowns');
    }
    public function update(Request $request, $id)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
    ]);

    $task = TaskDropdown::findOrFail($id);
    $task->update([
        'title' => $request->title,
        'description' => $request->description,
    ]);

    return response()->json($task);
}

};
