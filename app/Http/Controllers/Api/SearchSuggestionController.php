<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Company;
use Illuminate\Support\Facades\Log;
use App\Models\SearchAnalytics;

class SearchSuggestionController extends Controller
{
    public function suggest(Request $request)
    {
        $request->validate([
            'q' => 'required|string|max:100',
        ]);

        $query = trim($request->input('q', ''));
        if (!$query) {
            return response()->json([
                'products' => [],
                'companies' => [],
                'categories' => [],
            ]);
        }

        // --- Analytics logging (to file, can be changed to DB) ---
        Log::info('Search suggestion query', [
            'query' => $query,
            'ip' => $request->ip(),
            'user_id' => $request->user()?->id,
            'user_agent' => $request->userAgent(),
        ]);
        // --------------------------------------------------------

        try {
            $products = Product::where('name', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%")
                ->orWhere('category', 'like', "%{$query}%")
                ->orWhere('sub_category', 'like', "%{$query}%")
                ->orWhere('item', 'like', "%{$query}%")
                ->limit(5)
                ->get(['id', 'name', 'category']);

            $companies = Company::where('name', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%")
                ->limit(5)
                ->get(['id', 'name']);

            $categories = Product::where('category', 'like', "%{$query}%")
                ->distinct()
                ->limit(5)
                ->pluck('category');

            return response()->json([
                'products' => $products,
                'companies' => $companies,
                'categories' => $categories,
            ]);
        } catch (\Exception $e) {
            Log::error('Search suggestion error', [
                'error' => $e->getMessage(),
                'query' => $query,
            ]);
            return response()->json([
                'error' => 'Failed to fetch suggestions.'
            ], 500);
        }
    }

    // Analytics endpoint for logging suggestion clicks
    public static function logClick(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:product,company,category',
            'id' => 'required',
            'value' => 'required|string',
        ]);
        Log::info('Search suggestion click', [
            'type' => $request->input('type'),
            'id' => $request->input('id'),
            'value' => $request->input('value'),
            'ip' => $request->ip(),
            'user_id' => $request->user()?->id,
            'user_agent' => $request->userAgent(),
        ]);

        SearchAnalytics::create([
            'type' => 'click',
            'suggestion_type' => $request->input('type'),
            'suggestion_id' => $request->input('id'),
            'suggestion_value' => $request->input('value'),
            'user_id' => $request->user()?->id,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
        return response()->json(['status' => 'ok']);
    }

    // Analytics endpoint for logging real search queries
    public function logSearch(Request $request)
    {
        $request->validate([
            'query' => 'required|string|max:100',
        ]);

        SearchAnalytics::create([
            'type' => 'query',
            'query' => $request->input('query'),
            'user_id' => $request->user()?->id,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['status' => 'ok']);
    }
}
