<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class HarmfulContent extends Model
{
    protected $fillable = [
        'title',
        'content_json',
        'content_html',
        'slug',
        'is_active',
        'version',
        'version_history',
        'category',
        'image_url',
    ];

    protected $casts = [
        'content_json' => 'array',
        'version_history' => 'array',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title);
            }
        });
    }

    public function addVersion($content, $html = null)
    {
        $history = $this->version_history ?? [];
        $history[] = [
            'version' => $this->version,
            'content_json' => $this->content_json,
            'content_html' => $this->content_html,
            'created_at' => now()->toISOString(),
        ];

        $this->update([
            'version_history' => $history,
            'version' => $this->version + 1,
            'content_json' => $content,
            'content_html' => $html,
        ]);
    }

    public function getLatestVersion()
    {
        return $this->version_history ? end($this->version_history) : null;
    }
}
