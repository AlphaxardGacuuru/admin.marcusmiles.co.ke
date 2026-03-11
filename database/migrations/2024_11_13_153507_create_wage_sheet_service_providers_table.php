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
        Schema::create('wage_sheet_service_providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId("wage_sheet_id")
                ->constrained()
                ->onUpdate("cascade")
                ->onDelete("cascade");
            $table->jsonb("days");
            $table->foreignId('project_service_provider_id')
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('created_by')
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamps();

            // $table->unique(['wage_sheet_id', 'project_service_provider_id'], 'wage_sheet_project_provider_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('wage_sheet_service_providers');
    }
};
