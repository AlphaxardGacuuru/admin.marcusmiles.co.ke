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
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId("project_id")
                ->constrained()
                ->onUpdate("cascade")
                ->onDelete("cascade");
            $table->foreignId("good_id")
                ->constrained()
                ->onUpdate("cascade")
                ->onDelete("cascade");
            $table->jsonb('unit')->nullable();
            $table->integer('quantity')->nullable();
            $table->foreignId('supplier_id')
                ->nullable()
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
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
        Schema::dropIfExists('inventories');
    }
};
