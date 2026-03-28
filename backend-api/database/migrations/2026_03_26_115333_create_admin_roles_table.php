<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admin_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // 'superadmin', 'demo', 'editor', etc.
            $table->string('label');         // 'Super Admin', 'Demo Mode'
            $table->string('color')->default('primary'); // Bootstrap color: 'danger', 'info', etc.
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Seed with current hardcoded defaults
        DB::table('admin_roles')->insert([
            ['name' => 'superadmin', 'label' => 'Super Admin', 'color' => 'danger',  'description' => 'Full system access including user management', 'created_at' => now()],
            ['name' => 'admin',      'label' => 'Admin',       'color' => 'primary', 'description' => 'Full CMS access, cannot manage admin accounts', 'created_at' => now()],
            ['name' => 'demo',       'label' => 'Demo Mode',   'color' => 'warning', 'description' => 'Read-only access — cannot make changes', 'created_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_roles');
    }
};
