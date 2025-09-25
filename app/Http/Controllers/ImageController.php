<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ImageController extends Controller
{
    public function serve($type, $filename)
    {
        // Clean the path by replacing backslashes with forward slashes
        $path = str_replace('\\', '/', $type . '/' . $filename);

        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        $fullPath = storage_path('app/public/' . $path);
        
        // Get file info for caching headers
        $lastModified = filemtime($fullPath);
        $etag = md5_file($fullPath);
        
        // Set cache headers for better performance
        $headers = [
            'Cache-Control' => 'public, max-age=31536000', // 1 year
            'Last-Modified' => gmdate('D, d M Y H:i:s', $lastModified) . ' GMT',
            'ETag' => '"' . $etag . '"',
        ];
        
        // Check if client has cached version
        $ifModifiedSince = request()->header('If-Modified-Since');
        $ifNoneMatch = request()->header('If-None-Match');
        
        if (($ifModifiedSince && strtotime($ifModifiedSince) >= $lastModified) ||
            ($ifNoneMatch && $ifNoneMatch === '"' . $etag . '"')) {
            return response('', 304, $headers);
        }

        return response()->file($fullPath, $headers);
    }
}
