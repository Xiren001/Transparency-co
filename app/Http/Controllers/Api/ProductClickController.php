<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductClick;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductClickController extends Controller
{
    public function track(Request $request, $productId): JsonResponse
    {
        try {
            // Verify product exists
            $product = Product::findOrFail($productId);

            // Create click record
            ProductClick::create([
                'product_id' => $productId,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Click tracked successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to track click'
            ], 500);
        }
    }
}
