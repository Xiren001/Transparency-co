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

        // Apply filters
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('sub_category')) {
            $query->where('sub_category', $request->sub_category);
        }

        if ($request->has('item')) {
            $query->where('item', $request->item);
        }

        if ($request->has('certificates')) {
            $certificates = explode(',', $request->certificates);
            $query->where(function ($q) use ($certificates) {
                foreach ($certificates as $cert) {
                    $q->orWhereJsonContains('certificates', $cert);
                }
            });
        }

        if ($request->has('price_range') && $request->price_range !== 'all') {
            $range = explode('-', $request->price_range);
            if (count($range) === 2) {
                $query->whereBetween('price', [$range[0], $range[1]]);
            } elseif ($request->price_range === '100+') {
                $query->where('price', '>=', 100);
            }
        }

        // Apply sorting
        if ($request->has('sort_by')) {
            switch ($request->sort_by) {
                case 'Price: Low to High':
                    $query->orderBy('price', 'asc');
                    break;
                case 'Price: High to Low':
                    $query->orderBy('price', 'desc');
                    break;
                case 'Newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'Best Selling':
                    $query->orderBy('sales_count', 'desc');
                    break;
                case 'Customer Rating':
                    $query->orderBy('rating', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Get all products without pagination
        $products = $query->get();

        // Get sub-category counts if a category is selected
        $subCategoryCounts = [];
        $itemCounts = [];
        if ($request->has('category')) {
            $subCategoryCounts = Product::where('category', $request->category)
                ->selectRaw('sub_category, count(*) as count')
                ->groupBy('sub_category')
                ->pluck('count', 'sub_category')
                ->toArray();

            // Get item counts if a sub-category is selected
            if ($request->has('sub_category')) {
                $itemCounts = Product::where('category', $request->category)
                    ->where('sub_category', $request->sub_category)
                    ->selectRaw('item, count(*) as count')
                    ->groupBy('item')
                    ->pluck('count', 'item')
                    ->toArray();
            }
        }

        return response()->json([
            'products' => [
                'data' => $products,
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => $products->count(),
                'total' => $products->count(),
                'from' => 1,
                'to' => $products->count(),
            ],
            'filters' => [
                'certificates' => $request->certificates ? explode(',', $request->certificates) : [],
                'price_range' => $request->price_range ?? 'all',
                'sort_by' => $request->sort_by ?? 'Featured',
                'category' => $request->category,
                'sub_category' => $request->sub_category,
                'item' => $request->item
            ],
            'sub_category_counts' => $subCategoryCounts,
            'item_counts' => $itemCounts
        ]);
    }
}
