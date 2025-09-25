<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductSearchService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductFilterController extends Controller
{
    protected $searchService;

    public function __construct(ProductSearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    public function filter(Request $request): JsonResponse
    {
        // Get all filtered products using the search service
        $products = $this->searchService->getAllFilteredProducts($request);
        
        // Get category counts using the search service
        $categoryCounts = $this->searchService->getCategoryCounts($request);

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
            'sub_category_counts' => $categoryCounts['sub_categories'],
            'item_counts' => $categoryCounts['items']
        ]);
    }
}
