<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'description',
        'certification_images',
        'logo',
        'link',
    ];

    protected $casts = [
        'certification_images' => 'array',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
