<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\HarmfulContent;
use Illuminate\Support\Facades\Log;

class CleanupOrphanedImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:cleanup {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up orphaned images that are no longer referenced by any content';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting orphaned image cleanup...');

        $isDryRun = $this->option('dry-run');

        if ($isDryRun) {
            $this->warn('DRY RUN MODE - No files will be deleted');
        }

        try {
            // Get all images from both uploads and images directories
            $uploadedImages = Storage::disk('public')->files('uploads');
            $localImages = Storage::disk('local')->files('images');
            $allImages = array_merge($uploadedImages, $localImages);

            if (empty($allImages)) {
                $this->info('No images found in uploads or images directories.');
                return 0;
            }

            $this->info("Found " . count($allImages) . " total images (" . count($uploadedImages) . " in uploads, " . count($localImages) . " in images).");

            // Get all referenced images from harmful content
            $referencedImages = $this->getReferencedImages();

            $this->info("Found " . count($referencedImages) . " referenced images.");

            // Find orphaned images from both directories
            $orphanedUploadImages = array_filter($uploadedImages, function ($path) use ($referencedImages) {
                return !in_array($path, $referencedImages);
            });

            $orphanedLocalImages = array_filter($localImages, function ($path) use ($referencedImages) {
                return !in_array($path, $referencedImages);
            });

            $allOrphanedImages = array_merge($orphanedUploadImages, $orphanedLocalImages);

            if (empty($allOrphanedImages)) {
                $this->info('No orphaned images found. All images are referenced.');
                return 0;
            }

            $this->warn("Found " . count($allOrphanedImages) . " orphaned images:");

            foreach ($orphanedUploadImages as $image) {
                $this->line("  - uploads/" . $image);
            }
            foreach ($orphanedLocalImages as $image) {
                $this->line("  - images/" . $image);
            }

            if (!$isDryRun) {
                if ($this->confirm('Do you want to delete these orphaned images?')) {
                    $deletedCount = 0;
                    $totalSize = 0;

                    // Delete orphaned upload images
                    foreach ($orphanedUploadImages as $image) {
                        if (Storage::disk('public')->exists($image)) {
                            $size = Storage::disk('public')->size($image);
                            $totalSize += $size;

                            Storage::disk('public')->delete($image);
                            $deletedCount++;

                            $this->line("Deleted: uploads/" . $image . " (" . $this->formatBytes($size) . ")");
                        }
                    }

                    // Delete orphaned local images
                    foreach ($orphanedLocalImages as $image) {
                        if (Storage::disk('local')->exists($image)) {
                            $size = Storage::disk('local')->size($image);
                            $totalSize += $size;

                            Storage::disk('local')->delete($image);
                            $deletedCount++;

                            $this->line("Deleted: images/" . $image . " (" . $this->formatBytes($size) . ")");
                        }
                    }

                    $this->info("Successfully deleted {$deletedCount} orphaned images.");
                    $this->info("Total space freed: " . $this->formatBytes($totalSize));

                    Log::info('Orphaned images cleanup completed', [
                        'deleted_count' => $deletedCount,
                        'space_freed' => $totalSize
                    ]);
                } else {
                    $this->info('Cleanup cancelled.');
                }
            } else {
                $this->info('Dry run completed. Use --dry-run=false to actually delete files.');
            }

            return 0;
        } catch (\Exception $e) {
            $this->error('Error during cleanup: ' . $e->getMessage());
            Log::error('Error during orphaned image cleanup', ['error' => $e->getMessage()]);
            return 1;
        }
    }

    /**
     * Get all referenced images from harmful content
     */
    private function getReferencedImages(): array
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
