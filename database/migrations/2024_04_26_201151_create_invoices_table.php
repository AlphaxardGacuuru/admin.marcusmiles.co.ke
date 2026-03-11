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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('project_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->date('issue_date');
            $table->date('due_date');
            $table->unsignedBigInteger('total')->default(0);
            $table->unsignedBigInteger('paid')->default(0);
            $table->unsignedBigInteger('balance')->default(0);
            $table->text('notes')->nullable();
            $table->text('terms')->nullable();
            $table->string('status')->default('not_paid');
            $table->foreignId('created_by')
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
