<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('food_tastings', function (Blueprint $table) {
            if (! Schema::hasColumn('food_tastings', 'transfer_requested_to')) {
                $table->foreignId('transfer_requested_to')->nullable()->after('duplicate_user_id')->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('food_tastings', 'transfer_requested_by')) {
                $table->foreignId('transfer_requested_by')->nullable()->after('transfer_requested_to')->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('food_tastings', 'transfer_requested_at')) {
                $table->timestamp('transfer_requested_at')->nullable()->after('transfer_requested_by');
            }
        });
    }

    public function down(): void
    {
        Schema::table('food_tastings', function (Blueprint $table) {
            if (Schema::hasColumn('food_tastings', 'transfer_requested_to')) {
                $table->dropConstrainedForeignId('transfer_requested_to');
            }
            if (Schema::hasColumn('food_tastings', 'transfer_requested_by')) {
                $table->dropConstrainedForeignId('transfer_requested_by');
            }
            if (Schema::hasColumn('food_tastings', 'transfer_requested_at')) {
                $table->dropColumn('transfer_requested_at');
            }
        });
    }
};
