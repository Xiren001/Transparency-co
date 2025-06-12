<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
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
}
