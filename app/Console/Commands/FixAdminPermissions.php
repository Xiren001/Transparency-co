<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class FixAdminPermissions extends Command
{
    protected $signature = 'admin:fix-permissions';
    protected $description = 'Check and fix admin user permissions';

    public function handle()
    {
        $this->info('Checking admin user permissions...');

        // Find admin user
        $admin = User::whereHas('roles', function ($q) {
            $q->where('name', 'admin');
        })->first();

        if (!$admin) {
            $this->error('No admin user found!');
            return 1;
        }

        $this->info("Admin user found: {$admin->name}");
        $this->info("Email: {$admin->email}");

        // Check roles
        $roles = $admin->roles->pluck('name')->toArray();
        $this->info("Current roles: " . implode(', ', $roles));

        // Check permissions
        $permissions = $admin->permissions->pluck('name')->toArray();
        $this->info("Current permissions: " . implode(', ', $permissions));

        // Get all available permissions
        $allPermissions = Permission::all()->pluck('name')->toArray();
        $this->info("Total available permissions: " . count($allPermissions));

        // Check if admin has all permissions
        $missingPermissions = array_diff($allPermissions, $permissions);

        if (empty($missingPermissions)) {
            $this->info('✅ Admin user has all permissions!');
        } else {
            $this->warn('❌ Admin user is missing some permissions:');
            foreach ($missingPermissions as $permission) {
                $this->line("  - {$permission}");
            }

            if ($this->confirm('Do you want to assign all permissions to the admin user?')) {
                $admin->givePermissionTo($allPermissions);
                $this->info('✅ All permissions assigned to admin user!');
            }
        }

        // Also ensure admin role has all permissions
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $rolePermissions = $adminRole->permissions->pluck('name')->toArray();
            $missingRolePermissions = array_diff($allPermissions, $rolePermissions);

            if (!empty($missingRolePermissions)) {
                $this->warn('❌ Admin role is missing some permissions:');
                foreach ($missingRolePermissions as $permission) {
                    $this->line("  - {$permission}");
                }

                if ($this->confirm('Do you want to assign all permissions to the admin role?')) {
                    $adminRole->givePermissionTo($allPermissions);
                    $this->info('✅ All permissions assigned to admin role!');
                }
            } else {
                $this->info('✅ Admin role has all permissions!');
            }
        }

        return 0;
    }
}
