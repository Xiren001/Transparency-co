<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('sub_category', 'like', "%{$search}%")
                    ->orWhere('item', 'like', "%{$search}%")
                    ->orWhereHas('company', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Company filter
        if ($request->has('company')) {
            $query->whereHas('company', function ($q) use ($request) {
                $q->where('name', $request->company);
            });
        }

        // Category filter
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Sub-category filter
        if ($request->has('sub_category')) {
            $query->where('sub_category', $request->sub_category);
        }

        // Item filter
        if ($request->has('item')) {
            $query->where('item', $request->item);
        }

        // Price range filter
        if ($request->has('min_price') || $request->has('max_price')) {
            $minPrice = $request->input('min_price', 0);
            $maxPrice = $request->input('max_price', PHP_FLOAT_MAX);
            $query->whereBetween('price', [$minPrice, $maxPrice]);
        }

        // Certificates filter
        if ($request->has('certificates')) {
            $certificates = json_decode($request->certificates, true);
            if (is_array($certificates) && !empty($certificates)) {
                $query->where(function ($q) use ($certificates) {
                    foreach ($certificates as $cert) {
                        $q->orWhereJsonContains('certificates', $cert);
                    }
                });
            }
        }

        // Sort
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDirection);

        $products = $query->with('company')->paginate(10);
        $companies = Company::all();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'companies' => $companies,
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

    public function bulkStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'products' => 'required|array',
            'products.*.name' => 'required|string|max:255',
            'products.*.company_name' => 'required|string|max:255',
            'products.*.description' => 'nullable|string',
            'products.*.price' => 'required|numeric|min:0',
            'products.*.original_price' => 'nullable|numeric|min:0',
            'products.*.is_new' => 'boolean',
            'products.*.certificates' => 'array',
            'products.*.certificates.*' => 'string',
            'products.*.product_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'products.*.product_link' => 'nullable|url',
            'products.*.category' => 'required|string',
            'products.*.sub_category' => 'required|string',
            'products.*.product_details' => 'array',
            'products.*.product_details.*.name' => 'required|string',
            'products.*.product_details.*.value' => 'required|string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $createdProducts = [];
            foreach ($request->products as $productData) {
                $product = new Product();
                $product->fill($productData);

                // Handle product images
                if (isset($productData['product_images'])) {
                    $productImages = [];
                    foreach ($productData['product_images'] as $image) {
                        $path = $image->store('products', 'public');
                        $productImages[] = $path;
                    }
                    $product->images = $productImages;
                }

                $product->save();
                $createdProducts[] = $product;
            }

            return redirect()->route('products.index')->with('success', count($createdProducts) . ' products created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create products: ' . $e->getMessage())->withInput();
        }
    }

    public function bulkDestroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        try {
            $products = Product::whereIn('id', $request->product_ids)->get();

            foreach ($products as $product) {
                // Delete product images
                if ($product->images) {
                    foreach ($product->images as $image) {
                        Storage::disk('public')->delete($image);
                    }
                }

                $product->delete();
            }

            return redirect()->route('products.index')->with('success', count($products) . ' products deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete products: ' . $e->getMessage());
        }
    }

    public function customerView()
    {
        $products = Product::with('company')->latest()->paginate(12);
        return Inertia::render('Products/product-catalog', ['products' => $products]);
    }
}
