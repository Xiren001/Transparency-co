<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'original_price',
        'is_new',
        'certificates',
        'product_link',
        'category',
        'sub_category',
        'item',
        'product_details',
        'images',
        'company_id',
    ];

    protected $casts = [
        'is_new' => 'boolean',
        'images' => 'array',
        'product_details' => 'array',
        'certificates' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function productClicks()
    {
        return $this->hasMany(ProductClick::class);
    }

    /**
     * Boot the model and set up event listeners
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug when creating a product
        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = static::generateUniqueSlug($product->name);
            }
        });

        // Update slug when name changes
        static::updating(function ($product) {
            if ($product->isDirty('name') && empty($product->slug)) {
                $product->slug = static::generateUniqueSlug($product->name);
            }
        });
    }

    /**
     * Generate a unique slug for the product
     */
    public static function generateUniqueSlug($name, $id = null)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->when($id, function ($query, $id) {
            return $query->where('id', '!=', $id);
        })->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Get the route key for the model
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Get the URL for the product
     */
    public function getUrlAttribute()
    {
        return route('product.show', $this->slug);
    }

    /**
     * Get SEO-friendly category slug
     */
    public function getCategorySlugAttribute()
    {
        return Str::slug($this->category);
    }

    /**
     * Get SEO-friendly sub-category slug
     */
    public function getSubCategorySlugAttribute()
    {
        return Str::slug($this->sub_category);
    }

    /**
     * Scope: Search products by term across all searchable fields
     */
    public function scopeSearch($query, string $searchTerm)
    {
        return $query->where(function ($q) use ($searchTerm) {
            // Product basic fields
            $q->where('name', 'like', "%{$searchTerm}%")
                ->orWhere('description', 'like', "%{$searchTerm}%")
                ->orWhere('category', 'like', "%{$searchTerm}%")
                ->orWhere('sub_category', 'like', "%{$searchTerm}%")
                ->orWhere('item', 'like', "%{$searchTerm}%")
                ->orWhere('product_link', 'like', "%{$searchTerm}%")

                // Search in product details (JSON field)
                ->orWhereRaw("JSON_SEARCH(LOWER(product_details), 'one', ?, null, '$[*].name')", ["%{$searchTerm}%"])
                ->orWhereRaw("JSON_SEARCH(LOWER(product_details), 'one', ?, null, '$[*].value')", ["%{$searchTerm}%"])

                // Search in certificates (JSON field)
                ->orWhereRaw("JSON_SEARCH(LOWER(certificates), 'one', ?, null, '$[*]')", ["%{$searchTerm}%"])

                // Search in company information
                ->orWhereHas('company', function ($companyQuery) use ($searchTerm) {
                    $companyQuery->where('name', 'like', "%{$searchTerm}%")
                        ->orWhere('description', 'like', "%{$searchTerm}%")
                        ->orWhere('link', 'like', "%{$searchTerm}%");
                })

                // Search price as text (for price-related searches)
                ->orWhereRaw("CAST(price AS CHAR) LIKE ?", ["%{$searchTerm}%"])
                ->orWhereRaw("CAST(original_price AS CHAR) LIKE ?", ["%{$searchTerm}%"])

                // Search for "new" products
                ->orWhere(function ($newQuery) use ($searchTerm) {
                    if (stripos($searchTerm, 'new') !== false) {
                        $newQuery->where('is_new', true);
                    }
                });
        });
    }

    /**
     * Scope: Filter by company name
     */
    public function scopeByCompany($query, string $companyName)
    {
        return $query->whereHas('company', function ($q) use ($companyName) {
            $q->where('name', $companyName);
        });
    }

    /**
     * Scope: Filter by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope: Filter by sub-category
     */
    public function scopeBySubCategory($query, string $subCategory)
    {
        return $query->where('sub_category', $subCategory);
    }

    /**
     * Scope: Filter by item
     */
    public function scopeByItem($query, string $item)
    {
        return $query->where('item', $item);
    }

    /**
     * Scope: Filter by certificates
     */
    public function scopeByCertificates($query, array $certificates)
    {
        return $query->where(function ($q) use ($certificates) {
            foreach ($certificates as $certificate) {
                $q->orWhereRaw("JSON_SEARCH(LOWER(certificates), 'one', ?)", [strtolower($certificate)]);
            }
        });
    }

    /**
     * Scope: Filter new products
     */
    public function scopeWhereNew($query)
    {
        return $query->where('is_new', true);
    }

    /**
     * Scope: Filter by price range
     */
    public function scopeByPriceRange($query, float $minPrice = null, float $maxPrice = null)
    {
        if ($minPrice !== null) {
            $query->where('price', '>=', $minPrice);
        }
        
        if ($maxPrice !== null) {
            $query->where('price', '<=', $maxPrice);
        }
        
        return $query;
    }
}
