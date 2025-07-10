<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Company;
use App\Models\ProductClick;
use App\Models\SearchAnalytics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // User Analytics
        $totalUsers = User::count();
        $newUsersThisMonth = User::where('created_at', '>=', Carbon::now()->startOfMonth())->count();
        $activeUsersMonthly = User::where('created_at', '>=', Carbon::now()->subMonth())->count();

        // User signups trend (last 7 days)
        $userSignupsData = User::selectRaw('DATE(created_at) as date, COUNT(*) as signups')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'signups' => $item->signups
                ];
            });

        // Product Analytics
        $totalProducts = Product::count();
        $newProductsThisMonth = Product::where('created_at', '>=', Carbon::now()->startOfMonth())->count();
        
        // Most viewed product (placeholder - you can add view tracking later)
        $mostViewedProduct = Product::inRandomOrder()->first();
        $topRatedProduct = Product::inRandomOrder()->first();

        // Top clicked products
        $topClickedProducts = Product::withCount('productClicks')
            ->orderBy('product_clicks_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'name' => $product->name,
                    'clicks' => $product->product_clicks_count
                ];
            });

        // Products by category
        $categoryData = Product::selectRaw('category, COUNT(*) as value')
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderBy('value', 'desc')
            ->limit(4)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->category ?: 'Uncategorized',
                    'value' => $item->value
                ];
            });

        // Company Analytics
        $totalCompanies = Company::count();
        $newCompaniesThisMonth = Company::where('created_at', '>=', Carbon::now()->startOfMonth())->count();

        // Top companies by product count
        $topCompaniesByProductCount = Company::withCount('products')
            ->orderBy('products_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($company) {
                return [
                    'name' => $company->name,
                    'products' => $company->products_count
                ];
            });

        // Company activity (companies with most recent products)
        $companyActivity = Company::withCount(['products' => function ($query) {
            $query->where('created_at', '>=', Carbon::now()->subMonth());
        }])
        ->orderBy('products_count', 'desc')
        ->limit(5)
        ->get()
        ->map(function ($company) {
            return [
                'name' => $company->name,
                'recent_products' => $company->products_count
            ];
        });

        // Search Analytics (last 30 days)
        $searchQueriesCount = SearchAnalytics::where('type', 'query')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->count();
        $searchClicksCount = SearchAnalytics::where('type', 'click')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->count();
        $topQueries = SearchAnalytics::where('type', 'query')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->select('query', DB::raw('COUNT(*) as count'))
            ->groupBy('query')
            ->orderByDesc('count')
            ->limit(5)
            ->get();
        $topClickedSuggestions = SearchAnalytics::where('type', 'click')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->select('suggestion_value', 'suggestion_type', DB::raw('COUNT(*) as count'))
            ->groupBy('suggestion_value', 'suggestion_type')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'analytics' => [
                'users' => [
                    'total' => $totalUsers,
                    'newThisMonth' => $newUsersThisMonth,
                    'activeMonthly' => $activeUsersMonthly,
                    'signupsTrend' => $userSignupsData
                ],
                'products' => [
                    'total' => $totalProducts,
                    'newThisMonth' => $newProductsThisMonth,
                    'mostViewed' => $mostViewedProduct ? $mostViewedProduct->name : 'No products yet',
                    'topRated' => $topRatedProduct ? $topRatedProduct->name : 'No products yet',
                    'byCategory' => $categoryData,
                    'topClicked' => $topClickedProducts
                ],
                'companies' => [
                    'total' => $totalCompanies,
                    'newThisMonth' => $newCompaniesThisMonth,
                    'topByProductCount' => $topCompaniesByProductCount,
                    'activity' => $companyActivity
                ],
                'search' => [
                    'totalQueries' => $searchQueriesCount,
                    'totalClicks' => $searchClicksCount,
                    'topQueries' => $topQueries,
                    'topClickedSuggestions' => $topClickedSuggestions,
                ],
            ]
        ]);
    }
}
