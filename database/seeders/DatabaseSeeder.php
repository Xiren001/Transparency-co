<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles first!
        $this->call([
            RolesSeeder::class,
            PermissionsSeeder::class,
        ]);

        // Now create the user
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
        ]);

        // Assign the admin role to the user
        $user->assignRole('admin');

        // Seed sample data
        $this->call([
            CompanySeeder::class,
            VideoSeeder::class,
        ]);
    }
}
