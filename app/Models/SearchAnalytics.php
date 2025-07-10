<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SearchAnalytics extends Model
{
    use HasFactory;

    protected $table = 'search_analytics';

    protected $fillable = [
        'type',
        'query',
        'suggestion_type',
        'suggestion_id',
        'suggestion_value',
        'user_id',
        'ip',
        'user_agent',
    ];
}
