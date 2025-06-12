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

        return response()->file(storage_path('app/public/' . $path));
    }
}
