<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDueDateToTaskDropdownsTable extends Migration
{
    public function up()
    {
        Schema::table('task_dropdowns', function (Blueprint $table) {
            $table->date('due_date')->nullable()->after('description');
        });
    }

    public function down()
    {
        Schema::table('task_dropdowns', function (Blueprint $table) {
            $table->dropColumn('due_date');
        });
    }
}