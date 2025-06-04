<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->paginate(10);
        return Inertia::render('Products/Index', ['products' => $products]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        try {
            // Convert string 'true'/'false' to boolean
            if ($request->has('is_new')) {
                $request->merge(['is_new' => filter_var($request->is_new, FILTER_VALIDATE_BOOLEAN)]);
            }

            // Handle product_details JSON
            if ($request->has('product_details')) {
                $productDetails = json_decode($request->product_details, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $request->merge(['product_details' => $productDetails]);
                }
            }

            // Optimize validation rules
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'original_price' => 'nullable|numeric|min:0',
                'is_new' => 'boolean',
                'certificates' => 'nullable|array',
                'certificates.*' => 'string|in:ALL CERTIFICATE,PLASTIC FREE,USDA ORGANIC,NON-GMO,FRAGRANCE FREE,PALM OIL FREE,BIODEGRADABLE,FAIR TRADE,REUSABLE,COMPOSTABLE',
                'product_images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
                'certificate_images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
                'product_link' => 'nullable|url|max:255',
                'category' => 'nullable|string|max:255',
                'product_details' => 'nullable|array',
                'product_details.*.name' => 'required|string|max:255',
                'product_details.*.value' => 'required|string|max:255',
            ]);

            $data = $request->except(['product_images', 'certificate_images']);

            // Handle product images
            if ($request->hasFile('product_images')) {
                $productImages = [];
                foreach ($request->file('product_images') as $image) {
                    // Generate unique filename with timestamp
                    $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

                    // Store in public disk
                    $path = $image->storeAs('public/product_image', $filename);

                    // Get the public URL path
                    $publicPath = str_replace('public/', '', $path);
                    $productImages[] = $publicPath;
                }
                $data['images'] = $productImages;
            }

            // Handle certificate images
            if ($request->hasFile('certificate_images')) {
                $certificateImages = [];
                foreach ($request->file('certificate_images') as $image) {
                    // Generate unique filename with timestamp
                    $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

                    // Store in public disk
                    $path = $image->storeAs('public/certificate_image', $filename);

                    // Get the public URL path
                    $publicPath = str_replace('public/', '', $path);
                    $certificateImages[] = $publicPath;
                }
                $data['certificates_images'] = $certificateImages;
            }

            // Create product
            $product = Product::create($data);

            return redirect()->route('products.index')->with('success', 'Product created successfully.');
        } catch (ValidationException $e) {
            Log::error('Validation error creating product', [
                'errors' => $e->errors(),
                'input' => $request->all()
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Error creating product', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'Failed to create product: ' . $e->getMessage()]);
        }
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
        try {
            // Convert string 'true'/'false' to boolean
            if ($request->has('is_new')) {
                $request->merge(['is_new' => filter_var($request->is_new, FILTER_VALIDATE_BOOLEAN)]);
            }

            // Handle product_details JSON
            if ($request->has('product_details')) {
                $productDetails = json_decode($request->product_details, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $request->merge(['product_details' => $productDetails]);
                }
            }

            // Optimize validation rules
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'original_price' => 'nullable|numeric|min:0',
                'is_new' => 'boolean',
                'certificates' => 'nullable|array',
                'certificates.*' => 'string|in:ALL CERTIFICATE,PLASTIC FREE,USDA ORGANIC,NON-GMO,FRAGRANCE FREE,PALM OIL FREE,BIODEGRADABLE,FAIR TRADE,REUSABLE,COMPOSTABLE',
                'product_images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
                'certificate_images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
                'remove_product_images' => 'nullable|array',
                'remove_certificate_images' => 'nullable|array',
                'product_link' => 'nullable|url|max:255',
                'category' => 'nullable|string|max:255',
                'product_details' => 'nullable|array',
                'product_details.*.name' => 'required|string|max:255',
                'product_details.*.value' => 'required|string|max:255',
            ]);

            $data = $request->except([
                'product_images',
                'certificate_images',
                'remove_product_images',
                'remove_certificate_images'
            ]);

            // Handle image removal
            if ($request->has('remove_product_images')) {
                foreach ($request->remove_product_images as $image) {
                    Storage::disk('public')->delete('product_image/' . basename($image));
                }
                $currentImages = array_diff($product->images ?? [], $request->remove_product_images);
                $data['images'] = array_values($currentImages);
            }

            if ($request->has('remove_certificate_images')) {
                foreach ($request->remove_certificate_images as $image) {
                    Storage::disk('public')->delete('certificate_image/' . basename($image));
                }
                $currentCertificates = array_diff($product->certificates_images ?? [], $request->remove_certificate_images);
                $data['certificates_images'] = array_values($currentCertificates);
            }

            // Handle new product images
            if ($request->hasFile('product_images')) {
                $newImages = $data['images'] ?? $product->images ?? [];
                foreach ($request->file('product_images') as $image) {
                    // Generate unique filename with timestamp
                    $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

                    // Store in public disk
                    $path = $image->storeAs('public/product_image', $filename);

                    // Get the public URL path
                    $publicPath = str_replace('public/', '', $path);
                    $newImages[] = $publicPath;
                }
                $data['images'] = $newImages;
            }

            // Handle new certificate images
            if ($request->hasFile('certificate_images')) {
                $newCertificates = $data['certificates_images'] ?? $product->certificates_images ?? [];
                foreach ($request->file('certificate_images') as $image) {
                    // Generate unique filename with timestamp
                    $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

                    // Store in public disk
                    $path = $image->storeAs('public/certificate_image', $filename);

                    // Get the public URL path
                    $publicPath = str_replace('public/', '', $path);
                    $newCertificates[] = $publicPath;
                }
                $data['certificates_images'] = $newCertificates;
            }

            $product->update($data);

            return redirect()->route('products.index')->with('success', 'Product updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating product', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'Failed to update product: ' . $e->getMessage()]);
        }
    }

    public function destroy(Product $product)
    {
        try {
            // Delete associated images
            foreach ($product->images ?? [] as $image) {
                Storage::disk('public')->delete($image);
            }

            foreach ($product->certificates_images ?? [] as $image) {
                Storage::disk('public')->delete($image);
            }

            $product->delete();
            Log::info('Product deleted successfully', ['product_id' => $product->id]);

            return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting product', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to delete product: ' . $e->getMessage()]);
        }
    }

    public function customerView()
    {
        $products = Product::latest()->paginate(12);
        return Inertia::render('Products/product-catalog', ['products' => $products]);
    }
}
