<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // User Management
            'view users',
            'create users',
            'edit users',
            'delete users',
            'assign roles',
            'assign permissions',

            // Product Management
            'view products',
            'create products',
            'edit products',
            'delete products',
            'manage product categories',

            // Company Management
            'view companies',
            'create companies',
            'edit companies',
            'delete companies',

            // Newsletter Management
            'view newsletter subscribers',
            'export newsletter data',
            'manage newsletter settings',

            // Analytics & Dashboard
            'view analytics',
            'view dashboard',
            'export data',

            // Content Management
            'moderate content',
            'approve content',
            'reject content',
            'publish content',

            // System Settings
            'manage system settings',
            'view logs',
            'manage backups',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Assign permissions to roles
        $adminRole = Role::where('name', 'admin')->first();
        $moderatorRole = Role::where('name', 'moderator')->first();
        $contentManagerRole = Role::where('name', 'content_manager')->first();
        $userRole = Role::where('name', 'user')->first();

        // Admin gets all permissions
        if ($adminRole) {
            $adminRole->givePermissionTo(Permission::all());
        }

        // Moderator permissions
        if ($moderatorRole) {
            $moderatorRole->givePermissionTo([
                'view users',
                'view products',
                'edit products',
                'view companies',
                'edit companies',
                'moderate content',
                'approve content',
                'reject content',
                'view analytics',
                'view dashboard',
            ]);
        }

        // Content Manager permissions
        if ($contentManagerRole) {
            $contentManagerRole->givePermissionTo([
                'view products',
                'create products',
                'edit products',
                'delete products',
                'manage product categories',
                'view companies',
                'create companies',
                'edit companies',
                'delete companies',
                'publish content',
                'view analytics',
                'view dashboard',
            ]);
        }

        // User permissions (basic)
        if ($userRole) {
            $userRole->givePermissionTo([
                'view products',
                'view companies',
            ]);
        }
    }
}
