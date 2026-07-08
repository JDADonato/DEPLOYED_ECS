<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('action_logs');
    }

    public function down(): void
    {
        Schema::create('action_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action_type');
            $table->string('target_type')->nullable();
            $table->unsignedBigInteger('target_id')->nullable();
            $table->json('details')->nullable();
            $table->json('previous_state')->nullable();
            $table->json('new_state')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }
};
