<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('title');
            $table->longText('description');
            $table->foreignId('assigned_to')
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamp('planned_start_date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('planned_end_date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->string('priority')->default('low');
            $table->foreignId('project_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->integer('position')->default(0);
            $table->integer('total_comments')->default(0);
            $table->foreignId('created_by')
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('issues');
    }
};
