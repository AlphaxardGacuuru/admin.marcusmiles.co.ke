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
        Schema::create('wage_sheets', function (Blueprint $table) {
            $table->id();
            $table->string("code")->unique();
            $table->foreignId("project_id")
                ->constrained()
                ->onUpdate("cascade")
                ->onDelete("cascade");
            $table->foreignId('created_by')
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('paid_by')
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('approved_by')
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamp('starts_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('ends_at')->default(DB::raw('CURRENT_TIMESTAMP'));
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
        Schema::dropIfExists('wage_sheets');
    }
};
