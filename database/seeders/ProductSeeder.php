<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Bamboo Storage Containers',
                'description' => 'Eco-friendly bamboo storage containers perfect for organizing your kitchen. Made from sustainable bamboo, these containers are durable, lightweight, and naturally antimicrobial.',
                'price' => 199.00,
                'original_price' => 249.00,
                'is_new' => true,
                'certificates' => ['PLASTIC FREE', 'BIODEGRADABLE'],
                'images' => ['product_image/placeholder.jpg'],
                'certificates_images' => ['certificate_image/placeholder.jpg'],
                'product_link' => 'https://example.com/bamboo-containers',
                'category' => 'storage',
                'product_details' => [
                    ['name' => 'SKU', 'value' => 'BSC001'],
                    ['name' => 'Material', 'value' => 'Bamboo'],
                    ['name' => 'Shipping', 'value' => 'Free shipping on orders over $50'],
                    ['name' => 'Return Policy', 'value' => '30-day return guarantee']
                ]
            ],
            [
                'name' => 'Wooden Coaster Collection',
                'description' => 'Handcrafted wooden coasters made from reclaimed wood. Each coaster is unique with its natural grain pattern, perfect for protecting your surfaces while adding a touch of nature to your home.',
                'price' => 59.99,
                'original_price' => 69.99,
                'is_new' => true,
                'certificates' => ['PLASTIC FREE', 'USDA ORGANIC'],
                'images' => ['product_image/placeholder.jpg'],
                'certificates_images' => ['certificate_image/placeholder.jpg'],
                'product_link' => 'https://example.com/wooden-coasters',
                'category' => 'dining',
                'product_details' => [
                    ['name' => 'SKU', 'value' => 'WC001'],
                    ['name' => 'Material', 'value' => 'Reclaimed Wood'],
                    ['name' => 'Shipping', 'value' => 'Free shipping on orders over $50'],
                    ['name' => 'Return Policy', 'value' => '30-day return guarantee']
                ]
            ],
            [
                'name' => 'Bamboo Kitchen Utensil Set',
                'description' => 'Complete set of bamboo kitchen utensils. Includes spatula, spoon, tongs, and more. Made from sustainable bamboo, these utensils are heat-resistant and perfect for everyday cooking.',
                'price' => 39.99,
                'original_price' => null,
                'is_new' => true,
                'certificates' => ['PLASTIC FREE', 'BIODEGRADABLE', 'FAIR TRADE'],
                'images' => ['product_image/placeholder.jpg'],
                'certificates_images' => ['certificate_image/placeholder.jpg'],
                'product_link' => 'https://example.com/bamboo-utensils',
                'category' => 'kitchen',
                'product_details' => [
                    ['name' => 'SKU', 'value' => 'BKU001'],
                    ['name' => 'Material', 'value' => 'Bamboo'],
                    ['name' => 'Shipping', 'value' => 'Free shipping on orders over $50'],
                    ['name' => 'Return Policy', 'value' => '30-day return guarantee']
                ]
            ],
            [
                'name' => 'Wooden Cutting Board Set',
                'description' => 'Set of 3 wooden cutting boards in different sizes. Made from sustainably sourced hardwood, these boards are perfect for all your food preparation needs.',
                'price' => 89.99,
                'original_price' => null,
                'is_new' => true,
                'certificates' => ['PLASTIC FREE', 'USDA ORGANIC'],
                'images' => ['product_image/placeholder.jpg'],
                'certificates_images' => ['certificate_image/placeholder.jpg'],
                'product_link' => 'https://example.com/cutting-boards',
                'category' => 'kitchen',
                'product_details' => [
                    ['name' => 'SKU', 'value' => 'WCB001'],
                    ['name' => 'Material', 'value' => 'Hardwood'],
                    ['name' => 'Shipping', 'value' => 'Free shipping on orders over $50'],
                    ['name' => 'Return Policy', 'value' => '30-day return guarantee']
                ]
            ],
            [
                'name' => 'Eco-Friendly Storage Boxes',
                'description' => 'Set of 4 eco-friendly storage boxes made from recycled materials. Perfect for organizing your home while reducing environmental impact.',
                'price' => 49.99,
                'original_price' => null,
                'is_new' => true,
                'certificates' => ['PLASTIC FREE', 'BIODEGRADABLE', 'COMPOSTABLE'],
                'images' => ['product_image/placeholder.jpg'],
                'certificates_images' => ['certificate_image/placeholder.jpg'],
                'product_link' => 'https://example.com/storage-boxes',
                'category' => 'storage',
                'product_details' => [
                    ['name' => 'SKU', 'value' => 'ESB001'],
                    ['name' => 'Material', 'value' => 'Recycled Materials'],
                    ['name' => 'Shipping', 'value' => 'Free shipping on orders over $50'],
                    ['name' => 'Return Policy', 'value' => '30-day return guarantee']
                ]
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
