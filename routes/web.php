<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\CompanyController;
use App\Models\Company;
use App\Http\Controllers\Api\SearchSuggestionController;

Route::get('/', function (Request $request) {
    $query = Product::query();

    // Enhanced Search - Search through everything related to products
    if ($request->has('search')) {
        $search = $request->input('search');
        $query->where(function ($q) use ($search) {
            // Product basic fields
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('category', 'like', "%{$search}%")
                ->orWhere('sub_category', 'like', "%{$search}%")
                ->orWhere('item', 'like', "%{$search}%")
                ->orWhere('product_link', 'like', "%{$search}%")

                // Search in product details (JSON field)
                ->orWhereRaw("JSON_SEARCH(LOWER(product_details), 'one', ?, null, '$[*].name')", ["%{$search}%"])
                ->orWhereRaw("JSON_SEARCH(LOWER(product_details), 'one', ?, null, '$[*].value')", ["%{$search}%"])

                // Search in certificates (JSON field)
                ->orWhereRaw("JSON_SEARCH(LOWER(certificates), 'one', ?, null, '$[*]')", ["%{$search}%"])

                // Search in company information
                ->orWhereHas('company', function ($companyQuery) use ($search) {
                    $companyQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('link', 'like', "%{$search}%");
                })

                // Search price as text (for price-related searches)
                ->orWhereRaw("CAST(price AS CHAR) LIKE ?", ["%{$search}%"])
                ->orWhereRaw("CAST(original_price AS CHAR) LIKE ?", ["%{$search}%"])

                // Search for "new" products
                ->orWhere(function ($newQuery) use ($search) {
                    if (stripos($search, 'new') !== false) {
                        $newQuery->where('is_new', true);
                    }
                });
        });
    }

    $products = $query->with('company')->latest()->paginate(12);

    return Inertia::render('welcome', [
        'auth' => [
            'user' => $request->user(),
            'isAdmin' => $request->user() && $request->user()->hasRole('admin'),
        ],
        'products' => $products,
    ]);
})->name('home');


Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Product routes
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::post('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Company routes
    Route::get('companies', [CompanyController::class, 'index'])->name('companies.index');
    Route::post('companies', [CompanyController::class, 'store'])->name('companies.store');
    Route::post('companies/{company}', [CompanyController::class, 'update'])->name('companies.update');
    Route::delete('companies/{company}', [CompanyController::class, 'destroy'])->name('companies.destroy');
});

Route::get('/productst', [ProductController::class, 'customerView'])->name('products.customer');
Route::get('/products/customer-view', [ProductController::class, 'customerView'])->name('products.customer-view');

Route::get('/api/products/filter', [App\Http\Controllers\Api\ProductFilterController::class, 'filter'])->name('api.products.filter');

// Product click tracking
Route::post('/api/products/{product}/click', [App\Http\Controllers\Api\ProductClickController::class, 'track'])->name('api.products.click');

Route::post('/newsletter/subscribe', [App\Http\Controllers\NewsletterSubscriberController::class, 'store'])->name('newsletter.subscribe');
Route::get('/newsletter/verify/{token}', [App\Http\Controllers\NewsletterSubscriberController::class, 'verify'])->name('newsletter.verify');
Route::get('/newsletter/unsubscribe/{token}', [App\Http\Controllers\NewsletterSubscriberController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

// Admin routes for newsletter management
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/newsletter', [App\Http\Controllers\NewsletterSubscriberController::class, 'index'])->name('newsletter.index');
    Route::get('/admin/newsletter/export', [App\Http\Controllers\NewsletterSubscriberController::class, 'export'])->name('newsletter.export');
});

Route::get('/images/{type}/{filename}', [ImageController::class, 'serve'])->name('images.serve');

// Instant search suggestions endpoint
Route::get('/api/search-suggestions', [SearchSuggestionController::class, 'suggest']);
Route::post('/api/search-suggestions/click', [SearchSuggestionController::class, 'logClick']);
Route::post('/api/search-analytics', [SearchSuggestionController::class, 'logSearch']);

Route::get('/api/products/top-clicked', [ProductController::class, 'topClicked']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
