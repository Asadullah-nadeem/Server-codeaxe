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
        Schema::table('dms_api_keys', function (Blueprint $table) {
            $table->string('provider', 20)->default('s3')->after('api_scope');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dms_api_keys', function (Blueprint $table) {
            $table->dropColumn('provider');
        });
    }
};
