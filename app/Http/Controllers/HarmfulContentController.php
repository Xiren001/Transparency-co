<?php

namespace App\Http\Controllers;

use App\Models\HarmfulContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;

class HarmfulContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('view harmful content');

        $harmfulContents = HarmfulContent::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/HarmfulContent/Index', [
            'harmfulContents' => $harmfulContents,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create harmful content');

        return Inertia::render('Admin/HarmfulContent/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create harmful content');

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content_json' => 'required',
            'content_html' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Handle content_json - it might come as a string from FormData
        $contentJson = $request->content_json;
        if (is_string($contentJson)) {
            $contentJson = json_decode($contentJson, true);
        }

        $data = [
            'title' => $request->title,
            'content_json' => $contentJson,
            'content_html' => $request->content_html,
            'category' => $request->category,
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads', $filename, 'public');
            $data['image_url'] = Storage::url($path);
        }

        $harmfulContent = HarmfulContent::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Harmful content created successfully',
            'data' => $harmfulContent,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $this->authorize('view harmful content');

        $harmfulContent = HarmfulContent::findOrFail($id);

        return Inertia::render('Admin/HarmfulContent/Show', [
            'harmfulContent' => $harmfulContent,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $this->authorize('edit harmful content');

        $harmfulContent = HarmfulContent::findOrFail($id);

        return Inertia::render('Admin/HarmfulContent/Edit', [
            'harmfulContent' => $harmfulContent,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $this->authorize('edit harmful content');

        $harmfulContent = HarmfulContent::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content_json' => 'required',
            'content_html' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Handle content_json - it might come as a string from FormData
        $contentJson = $request->content_json;
        if (is_string($contentJson)) {
            $contentJson = json_decode($contentJson, true);
        }

        // Add to version history before updating
        $harmfulContent->addVersion($contentJson, $request->content_html);

        $data = [
            'title' => $request->title,
            'content_json' => $contentJson,
            'content_html' => $request->content_html,
            'category' => $request->category,
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads', $filename, 'public');
            $data['image_url'] = Storage::url($path);
        }

        $harmfulContent->update($data);

        // Clean up unused images after update
        $this->cleanupUnusedImages($harmfulContent);

        return response()->json([
            'success' => true,
            'message' => 'Harmful content updated successfully',
            'data' => $harmfulContent,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->authorize('delete harmful content');

        $harmfulContent = HarmfulContent::findOrFail($id);

        // Clean up all images associated with this content before deletion
        $this->cleanupAllContentImages($harmfulContent);

        $harmfulContent->delete();

        return response()->json([
            'success' => true,
            'message' => 'Harmful content deleted successfully',
        ]);
    }

    /**
     * Upload image for the editor
     */
    public function uploadImage(Request $request)
    {
        $this->authorize('upload harmful content images');

        Log::info('Upload image request received', ['files' => $request->allFiles()]);

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            Log::error('Image upload validation failed', ['errors' => $validator->errors()]);
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $file = $request->file('image');

        // Generate a unique hash based on file content to prevent duplicates
        $fileHash = hash_file('sha256', $file->getRealPath());
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();

        // Check if an image with the same hash already exists
        $existingImagePath = $this->findExistingImageByHash($fileHash);

        if ($existingImagePath) {
            Log::info('Image already exists, reusing', ['path' => $existingImagePath, 'hash' => $fileHash]);

            // Generate direct access URL from storage directory for existing image
            $storageUrl = '/storage/app/public/' . $existingImagePath;

            return response()->json([
                'success' => true,
                'url' => $storageUrl,
                'filename' => basename($existingImagePath),
                'reused' => true,
            ]);
        }

        // Generate a more descriptive filename
        $filename = $this->generateUniqueFilename($originalName, $extension);

        // Store in public storage for easier access
        $path = $file->storeAs('images', $filename, 'public');

        // Store the hash for future reference (use images/ prefix for consistency)
        $this->storeImageHash('images/' . $filename, $fileHash);

        // Generate direct access URL from storage directory
        $storageUrl = '/storage/app/public/images/' . $filename;

        Log::info('Image uploaded successfully', ['path' => $path, 'url' => $storageUrl, 'hash' => $fileHash]);

        return response()->json([
            'success' => true,
            'url' => $storageUrl,
            'filename' => $filename,
            'reused' => false,
        ]);
    }

    /**
     * Find existing image by hash
     */
    private function findExistingImageByHash(string $hash): ?string
    {
        try {
            $hashFile = storage_path('app/image_hashes.json');

            if (!file_exists($hashFile)) {
                return null;
            }

            $content = file_get_contents($hashFile);
            if ($content === false) {
                Log::error('Failed to read image hash file');
                return null;
            }

            $hashes = json_decode($content, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Invalid JSON in image hash file', ['error' => json_last_error_msg()]);
                return null;
            }

            $path = $hashes[$hash] ?? null;

            // Verify the file still exists
            if ($path && Storage::disk('public')->exists($path)) {
                return $path;
            }

            // If file doesn't exist, remove the hash entry
            if ($path) {
                $this->removeHashEntry($hash);
                Log::warning('Hash entry found but file missing', ['hash' => $hash, 'path' => $path]);
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Error finding existing image by hash', [
                'hash' => $hash,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Remove a hash entry from the hash file
     */
    private function removeHashEntry(string $hash): void
    {
        try {
            $hashFile = storage_path('app/image_hashes.json');

            if (!file_exists($hashFile)) {
                return;
            }

            $content = file_get_contents($hashFile);
            if ($content === false) {
                return;
            }

            $hashes = json_decode($content, true) ?? [];
            unset($hashes[$hash]);

            file_put_contents($hashFile, json_encode($hashes, JSON_PRETTY_PRINT));
        } catch (\Exception $e) {
            Log::error('Error removing hash entry', [
                'hash' => $hash,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Store image hash for future reference
     */
    private function storeImageHash(string $path, string $hash): void
    {
        try {
            $hashFile = storage_path('app/image_hashes.json');

            $hashes = [];
            if (file_exists($hashFile)) {
                $content = file_get_contents($hashFile);
                if ($content !== false) {
                    $hashes = json_decode($content, true) ?? [];
                }
            }

            $hashes[$hash] = $path;

            // Ensure the directory exists
            $hashDir = dirname($hashFile);
            if (!is_dir($hashDir)) {
                mkdir($hashDir, 0755, true);
            }

            $result = file_put_contents($hashFile, json_encode($hashes, JSON_PRETTY_PRINT));

            if ($result === false) {
                Log::error('Failed to store image hash', ['hash' => $hash, 'path' => $path]);
            }
        } catch (\Exception $e) {
            Log::error('Error storing image hash', [
                'hash' => $hash,
                'path' => $path,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Generate unique filename
     */
    private function generateUniqueFilename(string $originalName, string $extension): string
    {
        $baseName = pathinfo($originalName, PATHINFO_FILENAME);
        $baseName = Str::slug($baseName);

        $filename = $baseName . '.' . $extension;
        $counter = 1;

        while (Storage::disk('public')->exists('uploads/' . $filename)) {
            $filename = $baseName . '_' . $counter . '.' . $extension;
            $counter++;
        }

        return $filename;
    }

    /**
     * Clean up unused images after content update
     */
    private function cleanupUnusedImages(HarmfulContent $harmfulContent): void
    {
        try {
            // Extract all image URLs from the current content
            $currentImages = $this->extractImageUrlsFromContent($harmfulContent->content_json, $harmfulContent->content_html);

            // Get all images from version history
            $allVersionImages = [];
            if ($harmfulContent->version_history) {
                foreach ($harmfulContent->version_history as $version) {
                    $versionImages = $this->extractImageUrlsFromContent($version['content_json'], $version['content_html']);
                    $allVersionImages = array_merge($allVersionImages, $versionImages);
                }
            }

            // Get all images from both uploads and images directories
            $uploadedImages = Storage::disk('public')->files('uploads');
            $localImages = Storage::disk('local')->files('images');

            // Find images that are no longer referenced
            $referencedImages = array_unique(array_merge($currentImages, $allVersionImages));
            $referencedPaths = array_map(function ($url) {
                // Convert URL back to storage path
                if (strpos($url, '/storage/images/') === 0) {
                    return str_replace('/storage/images/', 'images/', $url);
                }
                if (strpos($url, '/storage/uploads/') === 0) {
                    return str_replace('/storage/uploads/', 'uploads/', $url);
                }
                return str_replace('/storage/', '', $url);
            }, $referencedImages);

            // Check for unused images in uploads directory
            $unusedUploadImages = array_filter($uploadedImages, function ($path) use ($referencedPaths) {
                return !in_array($path, $referencedPaths);
            });

            // Check for unused images in images directory
            $unusedLocalImages = array_filter($localImages, function ($path) use ($referencedPaths) {
                return !in_array($path, $referencedPaths);
            });

            // Delete unused images from uploads directory
            foreach ($unusedUploadImages as $unusedImage) {
                Storage::disk('public')->delete($unusedImage);
                Log::info('Deleted unused image from uploads', ['path' => $unusedImage]);
            }

            // Delete unused images from images directory
            foreach ($unusedLocalImages as $unusedImage) {
                Storage::disk('local')->delete($unusedImage);
                Log::info('Deleted unused image from images', ['path' => $unusedImage]);
            }

            $totalUnused = count($unusedUploadImages) + count($unusedLocalImages);

            if ($totalUnused > 0) {
                Log::info('Cleaned up unused images', ['count' => $totalUnused]);
            }
        } catch (\Exception $e) {
            Log::error('Error cleaning up unused images', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Extract image URLs from content
     */
    private function extractImageUrlsFromContent($contentJson, $contentHtml): array
    {
        $images = [];

        // Extract from JSON content
        if (is_array($contentJson)) {
            $images = array_merge($images, $this->extractImagesFromJson($contentJson));
        }

        // Extract from HTML content
        if (is_string($contentHtml)) {
            $images = array_merge($images, $this->extractImagesFromHtml($contentHtml));
        }

        return array_unique($images);
    }

    /**
     * Extract images from JSON content
     */
    private function extractImagesFromJson($content): array
    {
        $images = [];

        if (is_array($content)) {
            foreach ($content as $item) {
                if (is_array($item)) {
                    if (isset($item['type']) && $item['type'] === 'image' && isset($item['attrs']['src'])) {
                        $images[] = $item['attrs']['src'];
                    }
                    $images = array_merge($images, $this->extractImagesFromJson($item));
                }
            }
        }

        return $images;
    }

    /**
     * Extract images from HTML content
     */
    private function extractImagesFromHtml($html): array
    {
        $images = [];

        if (preg_match_all('/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/i', $html, $matches)) {
            $images = $matches[1];
        }

        return $images;
    }

    /**
     * Clean up all images associated with a harmful content
     */
    private function cleanupAllContentImages(HarmfulContent $harmfulContent): void
    {
        try {
            // Extract all image URLs from the current content
            $currentImages = $this->extractImageUrlsFromContent($harmfulContent->content_json, $harmfulContent->content_html);

            // Get all images from version history
            $allVersionImages = [];
            if ($harmfulContent->version_history) {
                foreach ($harmfulContent->version_history as $version) {
                    $versionImages = $this->extractImageUrlsFromContent($version['content_json'], $version['content_html']);
                    $allVersionImages = array_merge($allVersionImages, $versionImages);
                }
            }

            // Combine all image URLs to be deleted
            $imagesToDelete = array_unique(array_merge($currentImages, $allVersionImages));

            // Convert URLs to storage paths
            $imagePathsToDelete = array_map(function ($url) {
                if (strpos($url, '/storage/images/') === 0) {
                    return str_replace('/storage/images/', 'images/', $url);
                }
                if (strpos($url, '/storage/uploads/') === 0) {
                    return str_replace('/storage/uploads/', 'uploads/', $url);
                }
                return str_replace('/storage/', '', $url);
            }, $imagesToDelete);

            // Delete images from both storage locations
            foreach ($imagePathsToDelete as $path) {
                if (strpos($path, 'images/') === 0) {
                    // Delete from local storage (images directory)
                    if (Storage::disk('local')->exists($path)) {
                        Storage::disk('local')->delete($path);
                        Log::info('Deleted image from local storage', ['path' => $path]);
                    }
                } else {
                    // Delete from public storage (uploads directory)
                    if (Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                        Log::info('Deleted image from public storage', ['path' => $path]);
                    }
                }
            }

            if (count($imagePathsToDelete) > 0) {
                Log::info('Cleaned up images from content history', ['count' => count($imagePathsToDelete)]);
            }
        } catch (\Exception $e) {
            Log::error('Error cleaning up images from content history', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Get harmful content for customer view
     */
    public function customerView()
    {
        $harmfulContents = HarmfulContent::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('certifications/harmful-ingredients-section', [
            'harmfulContents' => $harmfulContents,
        ]);
    }

    /**
     * Toggle active status
     */
    public function toggleStatus(HarmfulContent $harmfulContent)
    {
        $this->authorize('manage harmful content status');

        Log::info('Toggle status called', [
            'id' => $harmfulContent->id,
            'current_status' => $harmfulContent->is_active,
            'new_status' => !$harmfulContent->is_active
        ]);

        $harmfulContent->update([
            'is_active' => !$harmfulContent->is_active,
        ]);

        Log::info('Status updated', [
            'id' => $harmfulContent->id,
            'new_status' => $harmfulContent->fresh()->is_active
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => $harmfulContent->fresh(),
        ]);
    }



    /**
     * Get storage statistics for harmful content images
     */
    public function getStorageStats()
    {
        $this->authorize('view harmful content');

        try {
            // Get images from public storage only
            $uploadImages = Storage::disk('public')->files('uploads');
            $publicImages = Storage::disk('public')->files('images');
            $totalImages = array_merge($uploadImages, $publicImages);

            $totalSize = 0;
            $imageTypes = [];

            // Process upload images
            foreach ($uploadImages as $image) {
                $size = Storage::disk('public')->size($image);
                $totalSize += $size;

                $extension = pathinfo($image, PATHINFO_EXTENSION);
                $imageTypes[$extension] = ($imageTypes[$extension] ?? 0) + 1;
            }

            // Process public images
            foreach ($publicImages as $image) {
                $size = Storage::disk('public')->size($image);
                $totalSize += $size;

                $extension = pathinfo($image, PATHINFO_EXTENSION);
                $imageTypes[$extension] = ($imageTypes[$extension] ?? 0) + 1;
            }

            // Get referenced images count
            $referencedImages = $this->getAllReferencedImages();
            $referencedCount = count($referencedImages);

            // Calculate orphaned images
            $orphanedCount = count($totalImages) - $referencedCount;

            return response()->json([
                'success' => true,
                'stats' => [
                    'total_images' => count($totalImages),
                    'referenced_images' => $referencedCount,
                    'orphaned_images' => $orphanedCount,
                    'total_size' => $this->formatBytes($totalSize),
                    'total_size_bytes' => $totalSize,
                    'image_types' => $imageTypes,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting storage stats', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get storage statistics',
            ], 500);
        }
    }

    /**
     * Get all referenced images across all harmful content
     */
    private function getAllReferencedImages(): array
    {
        $referencedImages = [];

        $harmfulContents = HarmfulContent::all();

        foreach ($harmfulContents as $content) {
            // Current content images
            $currentImages = $this->extractImageUrlsFromContent($content->content_json, $content->content_html);
            $referencedImages = array_merge($referencedImages, $currentImages);

            // Version history images
            if ($content->version_history) {
                foreach ($content->version_history as $version) {
                    $versionImages = $this->extractImageUrlsFromContent($version['content_json'], $version['content_html']);
                    $referencedImages = array_merge($referencedImages, $versionImages);
                }
            }
        }

        // Convert URLs to storage paths
        $referencedPaths = array_map(function ($url) {
            // Handle new /admin/harmfulcontent/image/ format
            if (strpos($url, '/admin/harmfulcontent/image/') === 0) {
                return str_replace('/admin/harmfulcontent/image/', 'images/', $url);
            }
            // Handle old /storage/uploads/ format (for backward compatibility)
            if (strpos($url, '/storage/uploads/') === 0) {
                return str_replace('/storage/uploads/', 'uploads/', $url);
            }
            // Handle old /storage/images/ format (for backward compatibility)
            if (strpos($url, '/storage/images/') === 0) {
                return str_replace('/storage/images/', 'images/', $url);
            }
            return str_replace('/storage/', '', $url);
        }, array_unique($referencedImages));

        return $referencedPaths;
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes($bytes, $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
