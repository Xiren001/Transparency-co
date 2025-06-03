<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use App\Models\Product;

Route::get('/', function (Request $request) {
    $products = Product::latest()->paginate(12);
    return Inertia::render('welcome', [
        'auth' => [
            'user' => $request->user(),
            'isAdmin' => $request->user() && $request->user()->hasRole('admin'),
        ],
        'products' => $products,
    ]);
})->name('home');


Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Product routes
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::post('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('pro                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ducts/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
});

Route::get('/productst', [ProductController::class, 'customerView'])->name('products.customer');
Route::get('/products/customer-view', [ProductController::class, 'customerView'])->name('products.customer-view');

Route::get('/api/products/filter', [App\Http\Controllers\Api\ProductFilterController::class, 'filter'])->name('api.products.filter');

Route::post('/newsletter/subscribe', [App\Http\Controllers\NewsletterSubscriberController::class, 'store'])->name('newsletter.subscribe');
Route::get('/newsletter/verify/{token}', [App\Http\Controllers\NewsletterSubscriberController::class, 'verify'])->name('newsletter.verify');
Route::get('/newsletter/unsubscribe/{token}', [App\Http\Controllers\NewsletterSubscriberController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

// Admin routes for newsletter management
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/newsletter', [App\Http\Controllers\NewsletterSubscriberController::class, 'index'])->name('newsletter.index');
    Route::get('/admin/newsletter/export', [App\Http\Controllers\NewsletterSubscriberController::class, 'export'])->name('newsletter.export');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
