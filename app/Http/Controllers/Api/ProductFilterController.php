<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductFilterController extends Controller
{
    public function filter(Request $request): JsonResponse
    {
        $query = Product::query();

        // Handle certificate filters
        if ($request->has('certificates') && !empty($request->certificates)) {
            $certificates = $request->certificates;
            if (!in_array('ALL CERTIFICATE', $certificates)) {
                $query->where(function ($q) use ($certificates) {
                    foreach ($certificates as $certificate) {
                        $q->orWhereJsonContains('certificates', $certificate);
                    }
                });
            }
        }

        // Handle price range filter
        if ($request->has('price_range') && $request->price_range !== 'all') {
            $range = explode('-', $request->price_range);
            if (count($range) === 2) {
                $query->whereBetween('price', [$range[0], $range[1]]);
            } elseif ($request->price_range === '400+') {
                $query->where('price', '>=', 400);
            }
        }

        // Handle sorting
        if ($request->has('sort_by')) {
            switch ($request->sort_by) {
                case 'Price: Low to High':
                    $query->orderBy('price', 'asc');
                    break;
                case 'Price: High to Low':
                    $query->orderBy('price', 'desc');
                    break;
                case 'Newest':
                    $query->latest();
                    break;
                case 'Best Selling':
                    // You might want to add a sales_count column to your products table
                    // $query->orderBy('sales_count', 'desc');
                    break;
                case 'Customer Rating':
                    // You might want to add a rating column to your products table
                    // $query->orderBy('rating', 'desc');
                    break;
                default: // Featured
                    $query->latest();
                    break;
            }
        } else {
            $query->latest(); // Default sorting
        }

        $products = $query->paginate(12);

        return response()->json([
            'products' => $products,
            'filters' => [
                'certificates' => $request->certificates ?? [],
                'price_range' => $request->price_range ?? 'all',
                'sort_by' => $request->sort_by ?? 'Featured'
            ]
        ]);
    }
}
