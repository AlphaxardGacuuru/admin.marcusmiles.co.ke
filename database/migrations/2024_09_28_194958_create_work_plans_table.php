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
        Schema::create('work_plans', function (Blueprint $table) {
            $table->id();
            $table->string("item_no")->nullable();
            $table->foreignId('project_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->string('name');
            $table->string('deposit')->nullable();
            $table->string('total_cost')->nullable();
            $table->timestamp('starts_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('ends_at')->default(DB::raw('CURRENT_TIMESTAMP'));
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
        Schema::dropIfExists('work_plans');
    }
};
