<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

if (!Schema::hasTable('admin_roles')) {
    Schema::create('admin_roles', function (Blueprint $table) {
        $table->id();
        $table->string('name')->unique();
        $table->string('label');
        $table->string('color')->default('primary');
        $table->text('description')->nullable();
        $table->timestamps();
    });
    echo "Table 'admin_roles' created\n";
}

$roles = [
    ['name' => 'superadmin', 'label' => 'Super Admin', 'color' => 'danger',  'description' => 'Full access'],
    ['name' => 'admin',      'label' => 'Admin',       'color' => 'primary', 'description' => 'CMS access'],
    ['name' => 'demo',       'label' => 'Demo Mode',   'color' => 'warning', 'description' => 'Read-only'],
];

foreach ($roles as $role) {
    DB::table('admin_roles')->updateOrInsert(['name' => $role['name']], array_merge($role, ['created_at' => now(), 'updated_at' => now()]));
}
echo "Default roles seeded\n";
