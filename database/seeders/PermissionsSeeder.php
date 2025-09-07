<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Create comprehensive permissions based on all admin areas
        $permissions = [
            // Dashboard & Analytics
            'view dashboard',
            'view analytics',
            'view statistics',
            'export data',

            // User Management (Admin only)
            'view users',
            'create users',
            'edit users',
            'delete users',
            'assign roles',
            'assign permissions',
            'manage user accounts',

            // Product Management
            'view products',
            'create products',
            'edit products',
            'delete products',
            'manage product categories',
            'manage product details',
            'upload product images',
            'manage product pricing',

            // Company Management
            'view companies',
            'create companies',
            'edit companies',
            'delete companies',
            'manage company profiles',
            'upload company logos',
            'manage company certifications',

            // Video Management
            'view videos',
            'create videos',
            'edit videos',
            'delete videos',
            'upload videos',
            'manage video status',
            'toggle video status',

            // Newsletter Management (Admin/Moderator)
            'view newsletter subscribers',
            'export newsletter data',
            'manage newsletter settings',
            'send newsletter emails',
            'manage subscriber lists',

            // Harmful Content Management
            'view harmful content',
            'create harmful content',
            'edit harmful content',
            'delete harmful content',
            'manage harmful content status',
            'upload harmful content images',
            'toggle harmful content status',
            'moderate harmful content',

            // Content Management
            'moderate content',
            'approve content',
            'reject content',
            'publish content',
            'manage content categories',

            // System & Settings
            'manage system settings',
            'view system logs',
            'manage backups',
            'access admin panel',
            'manage permissions',
            'manage roles',

            // File Management
            'upload files',
            'manage file storage',
            'delete files',

            // Search & Analytics
            'view search analytics',
            'manage search settings',
            'export analytics data',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Assign permissions to roles
        $superAdminRole = Role::where('name', 'super_admin')->first();
        $adminRole = Role::where('name', 'admin')->first();
        $moderatorRole = Role::where('name', 'moderator')->first();
        $contentManagerRole = Role::where('name', 'content_manager')->first();
        $userRole = Role::where('name', 'user')->first();

        // Super Admin gets ALL permissions (highest level)
        if ($superAdminRole) {
            $superAdminRole->syncPermissions(Permission::all());
        }

        // Admin gets ALL permissions
        if ($adminRole) {
            $adminRole->syncPermissions(Permission::all());
        }

        // Moderator permissions (view only)
        if ($moderatorRole) {
            $moderatorRole->syncPermissions([
                // Dashboard & Analytics
                'view dashboard',
                'view analytics',
                'view statistics',

                // Products (view only)
                'view products',

                // Companies (view only)
                'view companies',

                // Videos (view only)
                'view videos',

                // Newsletter (view only)
                'view newsletter subscribers',

                // Harmful Content (view only)
                'view harmful content',

                // Search & Analytics
                'view search analytics',
            ]);
        }

        // Content Manager permissions (FULL ACCESS - same as admin)
        if ($contentManagerRole) {
            $contentManagerRole->syncPermissions(Permission::all());
        }

        // User permissions (no admin access)
        if ($userRole) {
            $userRole->syncPermissions([
                // No admin permissions - users can only access public pages
            ]);
        }
    }
}
