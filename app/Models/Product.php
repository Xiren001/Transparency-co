<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'images',
        'description',
        'price',
        'original_price',
        'is_new',
        'certificates',
        'certificates_images',
        'product_link',
        'category',
        'product_details',
    ];

    protected $casts = [
        'images' => 'array',
        'certificates' => 'array',
        'certificates_images' => 'array',
        'is_new' => 'boolean',
        'product_details' => 'array',
    ];
}
