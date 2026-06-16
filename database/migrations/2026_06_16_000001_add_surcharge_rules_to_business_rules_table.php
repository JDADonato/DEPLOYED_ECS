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
        Schema::table('business_rules', function (Blueprint $table) {
            // Surcharge Rules
            $table->decimal('location_surcharge_rate', 5, 2)->default(0.20);
            $table->decimal('floor_surcharge_rate', 5, 2)->default(0.03);
            $table->decimal('december_surcharge_rate', 5, 2)->default(0.10);
            $table->decimal('transport_fee', 10, 2)->default(1500.00);
            $table->decimal('labor_surcharge', 10, 2)->default(2000.00);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_rules', function (Blueprint $table) {
            $table->dropColumn([
                'location_surcharge_rate',
                'floor_surcharge_rate',
                'december_surcharge_rate',
                'transport_fee',
                'labor_surcharge',
            ]);
        });
    }
};
