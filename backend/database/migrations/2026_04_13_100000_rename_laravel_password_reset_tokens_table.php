<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Rename Laravel's default broker table so Module 1 can use `password_reset_tokens` with the new schema.
     */
    public function up(): void
    {
        if (Schema::hasTable('password_reset_tokens') && ! Schema::hasTable('laravel_password_reset_tokens')) {
            Schema::rename('password_reset_tokens', 'laravel_password_reset_tokens');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('laravel_password_reset_tokens') && ! Schema::hasTable('password_reset_tokens')) {
            Schema::rename('laravel_password_reset_tokens', 'password_reset_tokens');
        }
    }
};
