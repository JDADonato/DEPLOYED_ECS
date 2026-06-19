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
            $table->decimal('service_charge_rate', 5, 2)->default(0.10);
            $table->decimal('contingency_surcharge_rate', 5, 2)->default(0.10);
            $table->decimal('vat_rate', 5, 2)->default(0.12);
            $table->decimal('extra_service_hours_fee', 10, 2)->default(5000.00);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_rules', function (Blueprint $table) {
            $table->dropColumn([
                'service_charge_rate',
                'contingency_surcharge_rate',
                'vat_rate',
                'extra_service_hours_fee',
            ]);
        });
    }
};
