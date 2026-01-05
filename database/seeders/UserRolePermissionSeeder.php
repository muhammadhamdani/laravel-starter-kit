<?php

namespace Database\Seeders;

use App\Models\Core\Role;
use App\Models\Core\User;
use App\Models\Core\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\PermissionRegistrar;

class UserRolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        collect([
            ['name' => 'Administrators'],
            ['name' => 'Users'],
        ])->each(fn($role) => Role::create($role));

        collect([
            ['name' => 'view-permission'],
            ['name' => 'create-permission'],
            ['name' => 'update-permission'],
            ['name' => 'delete-permission'],
            ['name' => 'data-permission'],
            ['name' => 'view-role'],
            ['name' => 'create-role'],
            ['name' => 'update-role'],
            ['name' => 'delete-role'],
            ['name' => 'data-role'],
            ['name' => 'view-user'],
            ['name' => 'create-user'],
            ['name' => 'update-user'],
            ['name' => 'delete-user'],
            ['name' => 'verify-user'],
            ['name' => 'bulk-user'],
            ['name' => 'data-user'],
            ['name' => 'view-region'],
            ['name' => 'create-region'],
            ['name' => 'update-region'],
            ['name' => 'delete-region'],
            ['name' => 'data-region'],
            ['name' => 'view-settings-site'],
        ])->each(fn($permission) => Permission::create($permission)->assignRole('Administrators'));

        User::create([
            'name' => 'Administrator',
            'email' => 'muhammadhamdani017@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make(uniqid()),
        ])->assignRole('Administrators');
    }
}
