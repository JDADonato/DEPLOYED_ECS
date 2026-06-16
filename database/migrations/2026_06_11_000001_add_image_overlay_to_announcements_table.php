<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('announcements', 'image_overlay_enabled')) {
            Schema::table('announcements', function (Blueprint $table) {
                $table->boolean('image_overlay_enabled')->default(true)->after('image_fit');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('announcements', 'image_overlay_enabled')) {
            Schema::table('announcements', function (Blueprint $table) {
                $table->dropColumn('image_overlay_enabled');
            });
        }
    }
};
