<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Models\Product;

/**
 * Clean URL Routes
 * SEO-friendly URLs for better user experience and search engine optimization
 */

// Product detail page with clean URL
// Example: /product/organic-baby-shampoo
Route::get('/product/{product:slug}', function (Product $product) {
    return Inertia::render('Products/Show', [
        'product' => $product->load('company'),
        'relatedProducts' => Product::where('category', $product->category)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get(),
    ]);
})->name('product.show');

// Category pages with clean URLs
// Example: /category/food-beverage
Route::get('/category/{category}', function ($category) {
    $categoryName = str_replace('-', ' ', $category);
    $products = Product::where('category', 'like', "%{$categoryName}%")
        ->with('company')
        ->paginate(12);
    
    return Inertia::render('Categories/Show', [
        'category' => $categoryName,
        'categorySlug' => $category,
        'products' => $products,
        'title' => ucwords($categoryName) . ' Products',
    ]);
})->name('category.show');

// Sub-category pages with clean URLs  
// Example: /category/food-beverage/organic-snacks
Route::get('/category/{category}/{subcategory}', function ($category, $subcategory) {
    $categoryName = str_replace('-', ' ', $category);
    $subcategoryName = str_replace('-', ' ', $subcategory);
    
    $products = Product::where('category', 'like', "%{$categoryName}%")
        ->where('sub_category', 'like', "%{$subcategoryName}%")
        ->with('company')
        ->paginate(12);
    
    return Inertia::render('Categories/SubCategory', [
        'category' => $categoryName,
        'subcategory' => $subcategoryName,
        'categorySlug' => $category,
        'subcategorySlug' => $subcategory,
        'products' => $products,
        'title' => ucwords($categoryName) . ' > ' . ucwords($subcategoryName),
    ]);
})->name('subcategory.show');

// Company pages with clean URLs
// Example: /company/organic-valley
Route::get('/company/{company:slug}', function (\App\Models\Company $company) {
    $products = $company->products()->with('company')->paginate(12);
    
    return Inertia::render('Companies/Show', [
        'company' => $company,
        'products' => $products,
    ]);
})->name('company.show');

// Search results with clean URLs
// Example: /search/organic-baby-food
Route::get('/search/{query?}', function ($query = null) {
    $searchQuery = $query ? str_replace('-', ' ', $query) : request('q', '');
    
    $products = collect();
    if ($searchQuery) {
        $products = Product::where('name', 'like', "%{$searchQuery}%")
            ->orWhere('description', 'like', "%{$searchQuery}%")
            ->orWhere('category', 'like', "%{$searchQuery}%")
            ->orWhere('sub_category', 'like', "%{$searchQuery}%")
            ->orWhereHas('company', function ($q) use ($searchQuery) {
                $q->where('name', 'like', "%{$searchQuery}%");
            })
            ->with('company')
            ->paginate(12);
    }
    
    return Inertia::render('Search/Results', [
        'query' => $searchQuery,
        'products' => $products,
        'title' => $searchQuery ? "Search results for: {$searchQuery}" : 'Search Products',
    ]);
})->name('search.results');

// Brand/Company listing with clean URLs
// Example: /brands
Route::get('/brands', function () {
    $companies = \App\Models\Company::withCount('products')
        ->orderBy('name')
        ->paginate(20);
    
    return Inertia::render('Brands/Index', [
        'companies' => $companies,
        'title' => 'All Brands',
    ]);
})->name('brands.index');

// Popular products with clean URL
// Example: /popular
Route::get('/popular', function () {
    $products = Product::withCount('productClicks')
        ->orderBy('product_clicks_count', 'desc')
        ->with('company')
        ->paginate(12);
    
    return Inertia::render('Products/Popular', [
        'products' => $products,
        'title' => 'Popular Products',
    ]);
})->name('products.popular');

// New products with clean URL
// Example: /new-arrivals
Route::get('/new-arrivals', function () {
    $products = Product::where('is_new', true)
        ->latest()
        ->with('company')
        ->paginate(12);
    
    return Inertia::render('Products/NewArrivals', [
        'products' => $products,
        'title' => 'New Arrivals',
    ]);
})->name('products.new');

// Price range filters with clean URLs
// Example: /under-25, /25-to-50, /over-100
Route::get('/under-{price}', function ($price) {
    $products = Product::where('price', '<=', $price)
        ->with('company')
        ->orderBy('price')
        ->paginate(12);
    
    return Inertia::render('Products/PriceRange', [
        'products' => $products,
        'priceRange' => "Under $" . $price,
        'title' => "Products Under $" . $price,
    ]);
})->name('products.under-price')->where('price', '[0-9]+');

Route::get('/{minPrice}-to-{maxPrice}', function ($minPrice, $maxPrice) {
    $products = Product::whereBetween('price', [$minPrice, $maxPrice])
        ->with('company')
        ->orderBy('price')
        ->paginate(12);
    
    return Inertia::render('Products/PriceRange', [
        'products' => $products,
        'priceRange' => "$" . $minPrice . " - $" . $maxPrice,
        'title' => "Products $" . $minPrice . " - $" . $maxPrice,
    ]);
})->name('products.price-range')->where(['minPrice' => '[0-9]+', 'maxPrice' => '[0-9]+']);

Route::get('/over-{price}', function ($price) {
    $products = Product::where('price', '>=', $price)
        ->with('company')
        ->orderBy('price')
        ->paginate(12);
    
    return Inertia::render('Products/PriceRange', [
        'products' => $products,
        'priceRange' => "Over $" . $price,
        'title' => "Products Over $" . $price,
    ]);
})->name('products.over-price')->where('price', '[0-9]+');
