<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateProductSlugs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:generate-slugs {--force : Force regenerate all slugs}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate slugs for existing products';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $force = $this->option('force');
        
        $query = Product::query();
        
        if (!$force) {
            $query->whereNull('slug')->orWhere('slug', '');
        }
        
        $products = $query->get();
        
        if ($products->isEmpty()) {
            $this->info('No products need slug generation.');
            return 0;
        }

        $this->info("Generating slugs for {$products->count()} products...");
        
        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        foreach ($products as $product) {
            $product->slug = Product::generateUniqueSlug($product->name, $product->id);
            $product->save();
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Successfully generated slugs for {$products->count()} products!");
        
        return 0;
    }
}