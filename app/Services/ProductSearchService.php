<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ProductSearchService
{
    /**
     * Apply search filters to a product query
     */
    public function applySearchFilters(Builder $query, Request $request): Builder
    {
        // Apply search term
        if ($request->has('search') && !empty($request->input('search'))) {
            $query->search($request->input('search'));
        }

        // Apply category filters
        $this->applyCategoryFilters($query, $request);

        // Apply other filters
        $this->applyOtherFilters($query, $request);

        // Apply price range filter
        $this->applyPriceFilter($query, $request);

        // Apply certificate filters
        $this->applyCertificateFilter($query, $request);

        // Apply sorting
        $this->applySorting($query, $request);

        return $query;
    }

    /**
     * Apply category-related filters
     */
    protected function applyCategoryFilters(Builder $query, Request $request): void
    {
        if ($request->has('company') && !empty($request->input('company'))) {
            $query->byCompany($request->input('company'));
        }

        if ($request->has('category') && !empty($request->input('category'))) {
            $query->byCategory($request->input('category'));
        }

        if ($request->has('sub_category') && !empty($request->input('sub_category'))) {
            $query->bySubCategory($request->input('sub_category'));
        }

        if ($request->has('item') && !empty($request->input('item'))) {
            $query->byItem($request->input('item'));
        }
    }

    /**
     * Apply other filters
     */
    protected function applyOtherFilters(Builder $query, Request $request): void
    {
        if ($request->has('is_new') && $request->boolean('is_new')) {
            $query->whereNew();
        }
    }

    /**
     * Apply price range filter
     */
    protected function applyPriceFilter(Builder $query, Request $request): void
    {
        if ($request->has('min_price') && is_numeric($request->input('min_price'))) {
            $query->where('price', '>=', $request->input('min_price'));
        }

        if ($request->has('max_price') && is_numeric($request->input('max_price'))) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        // Handle price range format like "25-50"
        if ($request->has('price_range') && $request->input('price_range') !== 'all') {
            $priceRange = $request->input('price_range');
            if (str_contains($priceRange, '-')) {
                [$min, $max] = explode('-', $priceRange);
                if (is_numeric($min)) {
                    $query->where('price', '>=', (float) $min);
                }
                if (is_numeric($max)) {
                    $query->where('price', '<=', (float) $max);
                }
            } elseif (str_ends_with($priceRange, '+')) {
                $min = (float) str_replace('+', '', $priceRange);
                $query->where('price', '>=', $min);
            }
        }
    }

    /**
     * Apply certificate filters
     */
    protected function applyCertificateFilter(Builder $query, Request $request): void
    {
        if ($request->has('certificates')) {
            $certificates = $request->input('certificates');
            
            // Handle JSON string or array
            if (is_string($certificates)) {
                $certificates = json_decode($certificates, true) ?? [];
            }
            
            if (is_array($certificates) && !empty($certificates)) {
                $query->byCertificates($certificates);
            }
        }
    }

    /**
     * Apply sorting to the query
     */
    protected function applySorting(Builder $query, Request $request): void
    {
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        switch ($sortBy) {
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
            case 'Featured':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }
    }

    /**
     * Get filtered products with pagination
     */
    public function getFilteredProducts(Request $request, int $perPage = 12)
    {
        $query = Product::query()->with('company');
        $this->applySearchFilters($query, $request);
        
        return $query->paginate($perPage);
    }

    /**
     * Get all filtered products without pagination
     */
    public function getAllFilteredProducts(Request $request)
    {
        $query = Product::query()->with('company');
        $this->applySearchFilters($query, $request);
        
        return $query->get();
    }

    /**
     * Get category counts for filtering
     */
    public function getCategoryCounts(Request $request): array
    {
        $subCategoryCounts = [];
        $itemCounts = [];

        if ($request->has('category') && !empty($request->input('category'))) {
            $subCategoryCounts = Product::where('category', $request->input('category'))
                ->selectRaw('sub_category, count(*) as count')
                ->groupBy('sub_category')
                ->pluck('count', 'sub_category')
                ->toArray();

            if ($request->has('sub_category') && !empty($request->input('sub_category'))) {
                $itemCounts = Product::where('category', $request->input('category'))
                    ->where('sub_category', $request->input('sub_category'))
                    ->selectRaw('item, count(*) as count')
                    ->groupBy('item')
                    ->pluck('count', 'item')
                    ->toArray();
            }
        }

        return [
            'sub_categories' => $subCategoryCounts,
            'items' => $itemCounts,
        ];
    }
}
