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
        Schema::create('practical_completion_certificates', function (Blueprint $table) {
            $table->id();
            $table->string("code");
            $table->foreignId("project_id")
                ->constrained()
                ->onUpdate("cascade")
                ->onDelete("cascade");
            $table->string('employer')->nullable();
            $table->string('contractor')->nullable();
            $table->string('brief')->nullable();
            $table->string('project_manager')->nullable();
            $table->timestamp('contract_dates')->nullable();
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
        Schema::dropIfExists('practical_completion_certificates');
    }
};
