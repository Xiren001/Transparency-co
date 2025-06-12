<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = [
            [
                'name' => 'Tech Solutions Inc.',
                'description' => 'Leading provider of innovative technology solutions for businesses.',
                'link' => 'https://techsolutions.example.com',
            ],
            [
                'name' => 'Green Energy Corp',
                'description' => 'Sustainable energy solutions for a better tomorrow.',
                'link' => 'https://greenenergy.example.com',
            ],
            [
                'name' => 'Global Logistics Ltd',
                'description' => 'Worldwide logistics and supply chain management services.',
                'link' => 'https://globallogistics.example.com',
            ],
            [
                'name' => 'Digital Innovations',
                'description' => 'Pioneering digital transformation solutions.',
                'link' => 'https://digitalinnovations.example.com',
            ],
            [
                'name' => 'Smart Manufacturing Co',
                'description' => 'Advanced manufacturing solutions with Industry 4.0 integration.',
                'link' => 'https://smartmanufacturing.example.com',
            ],
        ];

        // Create 50 companies
        for ($i = 0; $i < 50; $i++) {
            $company = $companies[$i % count($companies)];
            $company['name'] = $company['name'] . ' ' . ($i + 1);

            Company::create([
                'name' => $company['name'],
                'description' => $company['description'],
                'certification_images' => [],
                'logo' => null,
                'link' => $company['link'],
            ]);
        }
    }
}
