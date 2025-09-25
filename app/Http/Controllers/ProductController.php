<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Company;
use App\Models\ProductClick;
use App\Services\ProductSearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected $searchService;

    public function __construct(ProductSearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    public function index(Request $request)
    {
        // Use the search service to get filtered products
        $products = $this->searchService->getFilteredProducts($request, 10);
        $companies = Company::all();

        // Get current user with roles and permissions
        $currentUser = Auth::user();
        $currentUser->load(['roles', 'permissions']);

        return Inertia::render('Products/Index', [
            'products' => $products,
            'companies' => $companies,
            'auth' => [
                'user' => $currentUser,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    /**
     * Convert various boolean-like values to actual boolean
     */
    private function convertToBoolean($value)
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_string($value)) {
            $value = strtolower($value);
            if ($value === 'true' || $value === '1' || $value === 'on' || $value === 'yes') {
                return true;
            }
            if ($value === 'false' || $value === '0' || $value === 'off' || $value === 'no') {
                return false;
            }
        }

        if (is_numeric($value)) {
            return (bool) $value;
        }

        return false;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'is_new' => 'required|boolean',
            'certificates' => 'nullable|array',
            'certificates.*' => 'string',
            'product_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'product_link' => 'nullable|url',
            'category' => 'nullable|string|max:255',
            'sub_category' => 'nullable|string|max:255',
            'item' => 'nullable|string|max:255',
            'product_details' => 'nullable|array',
            'product_details.*.name' => 'required|string',
            'product_details.*.value' => 'required|string',
            'company_id' => 'required|exists:companies,id',
        ]);

        $product = new Product();
        $product->name = $validated['name'];
        $product->description = $validated['description'];
        $product->price = $validated['price'];
        $product->original_price = $validated['original_price'];
        $product->is_new = $validated['is_new'];
        $product->certificates = $validated['certificates'] ?? [];
        $product->product_link = $validated['product_link'];
        $product->category = $validated['category'];
        $product->sub_category = $validated['sub_category'];
        $product->item = $validated['item'];
        $product->product_details = $validated['product_details'] ?? [];
        $product->company_id = $validated['company_id'];

        // Handle product images
        if ($request->hasFile('product_images')) {
            $images = [];
            foreach ($request->file('product_images') as $image) {
                $path = $image->store('products', 'public');
                $images[] = $path;
            }
            $product->images = $images;
        }

        $product->save();

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        return Inertia::render('Products/Show', ['product' => $product]);
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', ['product' => $product]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'is_new' => 'required|boolean',
            'certificates' => 'nullable|array',
            'certificates.*' => 'string',
            'product_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'product_link' => 'nullable|url',
            'category' => 'nullable|string|max:255',
            'sub_category' => 'nullable|string|max:255',
            'item' => 'nullable|string|max:255',
            'product_details' => 'nullable|array',
            'product_details.*.name' => 'required|string',
            'product_details.*.value' => 'required|string',
            'company_id' => 'required|exists:companies,id',
            'remove_product_images' => 'nullable|array',
        ]);

        $product->name = $validated['name'];
        $product->description = $validated['description'];
        $product->price = $validated['price'];
        $product->original_price = $validated['original_price'];
        $product->is_new = $validated['is_new'];
        $product->certificates = $validated['certificates'] ?? [];
        $product->product_link = $validated['product_link'];
        $product->category = $validated['category'];
        $product->sub_category = $validated['sub_category'];
        $product->item = $validated['item'];
        $product->product_details = $validated['product_details'] ?? [];
        $product->company_id = $validated['company_id'];

        // Handle product images
        if ($request->hasFile('product_images')) {
            $images = $product->images ?? [];
            foreach ($request->file('product_images') as $image) {
                $path = $image->store('products', 'public');
                $images[] = $path;
            }
            $product->images = $images;
        }

        // Remove product images
        if ($request->has('remove_product_images')) {
            $images = $product->images ?? [];
            foreach ($request->input('remove_product_images') as $image) {
                if (($key = array_search($image, $images)) !== false) {
                    Storage::disk('public')->delete($image);
                    unset($images[$key]);
                }
            }
            $product->images = array_values($images);
        }

        $product->save();

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        try {
            // Delete product images
            if ($product->images) {
                foreach ($product->images as $image) {
                    Storage::disk('public')->delete($image);
                }
            }

            $product->delete();

            return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete product: ' . $e->getMessage());
        }
    }

    public function customerView()
    {
        $products = Product::with('company')->latest()->paginate(12);
        // Get top clicked products (3-6)
        $topClickedProducts = Product::withCount('productClicks')
            ->orderBy('product_clicks_count', 'desc')
            ->limit(6)
            ->get();
        return Inertia::render('Products/product-catalog', [
            'products' => $products,
            'suggestedProducts' => $topClickedProducts,
        ]);
    }

    public function topClicked()
    {
        $topClickedProducts = Product::with('company')
            ->withCount('productClicks')
            ->orderBy('product_clicks_count', 'desc')
            ->limit(6)
            ->get();
        return response()->json($topClickedProducts);
    }
}
