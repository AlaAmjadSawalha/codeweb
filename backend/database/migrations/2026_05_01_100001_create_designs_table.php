<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('designs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->unsignedTinyInteger('overall_score')->default(0);
            $table->decimal('score_space',       5, 2)->default(0);
            $table->decimal('score_lighting',    5, 2)->default(0);
            $table->decimal('score_circulation', 5, 2)->default(0);
            $table->decimal('score_budget',      5, 2)->default(0);
            $table->decimal('score_functional',  5, 2)->default(0);
            $table->json('cost_estimate')->nullable();
            $table->boolean('is_saved')->default(false);
            $table->boolean('is_selected')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['project_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('designs');
    }
};
