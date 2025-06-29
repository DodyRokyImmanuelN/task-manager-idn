<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('task_dropdowns', function (Blueprint $table) {
            $table->foreignId('label_id')->nullable()->constrained('labels')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('task_dropdowns', function (Blueprint $table) {
            $table->dropForeign(['label_id']);
            $table->dropColumn('label_id');
        });
    }
};
