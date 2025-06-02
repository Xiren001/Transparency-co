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
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
});

Route::get('/productst', [ProductController::class, 'customerView'])->name('products.customer');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
