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
        Schema::create('designs', function (Blueprint $table) {
            $table->id();
            $table->string('project_id'); // String assuming UUIDs or string IDs from frontend mock
            $table->string('title');
            $table->string('style');
            $table->string('preview_image')->nullable();
            $table->text('explanation')->nullable();
            $table->decimal('estimated_cost', 10, 2)->default(0);
            
            // Scores (0-100)
            $table->integer('space_score')->default(0);
            $table->integer('lighting_score')->default(0);
            $table->integer('circulation_score')->default(0);
            $table->integer('budget_score')->default(0);
            
            // JSON fields for complex nested data structures
            $table->json('room_usage')->nullable();
            $table->json('colors')->nullable();
            $table->json('furniture_suggestions')->nullable();
            
            $table->boolean('is_saved')->default(false);
            $table->json('metadata')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('designs');
    }
};
