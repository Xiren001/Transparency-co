<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HarmfulContentController;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\CompanyController;
use App\Models\Company;
use App\Http\Controllers\Api\SearchSuggestionController;
use App\Models\Video;

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

    // Get active videos for the certifications page (limit to 3)
    $videos = Video::active()->take(3)->get();

    return Inertia::render('welcome', [
        'auth' => [
            'user' => $request->user(),
            'isAdmin' => $request->user() && $request->user()->hasRole('admin'),
        ],
        'products' => $products,
        'videos' => $videos,
    ]);
})->name('home');

// Certifications page with videos
Route::get('/certifications', function () {
    $videos = Video::active()->take(3)->get();

    return Inertia::render('certifications/Page', [
        'videos' => $videos,
    ]);
})->name('certifications');

Route::middleware(['auth', 'verified', 'admin.role'])->group(function () {
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

    // Video routes
    Route::prefix('admin/videos')->name('admin.videos.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\VideoController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\Admin\VideoController::class, 'store'])->name('store');
        Route::post('/{video}', [\App\Http\Controllers\Admin\VideoController::class, 'update'])->name('update');
        Route::delete('/{video}', [\App\Http\Controllers\Admin\VideoController::class, 'destroy'])->name('destroy');
        Route::post('/{video}/toggle-status', [\App\Http\Controllers\Admin\VideoController::class, 'toggleStatus'])->name('toggle-status');
    });

    // Harmful content routes
    Route::prefix('admin/harmfulcontent')->name('admin.harmfulcontent.')->middleware(['harmful.content'])->group(function () {
        Route::get('/', [HarmfulContentController::class, 'index'])->middleware(['harmful.content:view harmful content'])->name('index');
        Route::post('/', [HarmfulContentController::class, 'store'])->middleware(['harmful.content:create harmful content'])->name('store');
        Route::post('/upload-image', [HarmfulContentController::class, 'uploadImage'])->middleware(['harmful.content:upload harmful content images'])->name('upload-image');
        Route::get('/storage-stats', [HarmfulContentController::class, 'getStorageStats'])->middleware(['harmful.content:view harmful content'])->name('storage-stats');
        Route::post('/{harmfulContent}', [HarmfulContentController::class, 'update'])->middleware(['harmful.content:edit harmful content'])->name('update');
        Route::delete('/{harmfulContent}', [HarmfulContentController::class, 'destroy'])->middleware(['harmful.content:delete harmful content'])->name('destroy');
        Route::post('/{harmfulContent}/toggle-status', [HarmfulContentController::class, 'toggleStatus'])->middleware(['harmful.content:manage harmful content status'])->name('toggle-status')->where('harmfulContent', '[0-9]+');
    });

    // Direct access to harmful content images from storage
    Route::get('/storage/app/public/images/{filename}', function ($filename) {
        $path = storage_path('app/public/images/' . $filename);

        if (!file_exists($path)) {
            abort(404, 'Image not found');
        }

        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
        ];
        $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';

        return response()->file($path, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=31536000', // Cache for 1 year
        ]);
    })->where('filename', '.*')->name('harmful.images.direct');

    // User management routes (admin only)
    Route::middleware(['role:admin'])->group(function () {
        Route::get('admin/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users.index');
        Route::post('admin/users/{user}/assign-role', [App\Http\Controllers\Admin\UserController::class, 'assignRole'])->name('admin.users.assign-role');
        Route::post('admin/users/{user}/assign-permissions', [App\Http\Controllers\Admin\UserController::class, 'assignPermissions'])->name('admin.users.assign-permissions');
    });
});

Route::get('/productst', [ProductController::class, 'customerView'])->name('products.customer');
Route::get('/products/customer-view', [ProductController::class, 'customerView'])->name('products.customer-view');

Route::get('/api/products/filter', [App\Http\Controllers\Api\ProductFilterController::class, 'filter'])->name('api.products.filter');

// Product click tracking
Route::post('/api/products/{product}/click', [App\Http\Controllers\Api\ProductClickController::class, 'track'])->name('api.products.click');

Route::post('/newsletter/subscribe', [App\Http\Controllers\NewsletterSubscriberController::class, 'store'])->name('newsletter.subscribe');
Route::get('/newsletter/verify/{token}', [App\Http\Controllers\NewsletterSubscriberController::class, 'verify'])->name('newsletter.verify');
Route::get('/newsletter/unsubscribe/{token}', [App\Http\Controllers\NewsletterSubscriberController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

// Admin routes for newsletter management (admin and moderator only)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['role.or:admin,moderator'])->group(function () {
        Route::get('/admin/newsletter', [App\Http\Controllers\NewsletterSubscriberController::class, 'index'])->name('newsletter.index');
        Route::get('/admin/newsletter/export', [App\Http\Controllers\NewsletterSubscriberController::class, 'export'])->name('newsletter.export');
    });
});

Route::get('/images/{type}/{filename}', [ImageController::class, 'serve'])->name('images.serve');

// Instant search suggestions endpoint
Route::get('/api/search-suggestions', [SearchSuggestionController::class, 'suggest']);
Route::post('/api/search-suggestions/click', [SearchSuggestionController::class, 'logClick']);
Route::post('/api/search-analytics', [SearchSuggestionController::class, 'logSearch']);

Route::get('/api/products/top-clicked', [ProductController::class, 'topClicked']);

// Customer view for harmful content
Route::get('/harmful-ingredients', [HarmfulContentController::class, 'customerView'])->name('harmful-ingredients');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
