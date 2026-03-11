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
        Schema::create('delivery_note_inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId("delivery_note_id")
                ->constrained()
                ->onUpdate("cascade")
                ->onDelete("cascade");
            $table->foreignId("inventory_id")
                ->constrained()
                ->onUpdate("cascade")
                ->onDelete("cascade");
            $table->foreignId('created_by')
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamps();

            $table->unique(["delivery_note_id", "inventory_id"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('delivery_note_inventories');
    }
};
