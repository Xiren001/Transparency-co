# Transparency-co

## Direct Storage Image Management System

This system stores images directly in the storage folder and serves them through custom routes, eliminating the need for storage links while maintaining efficient storage management.

### How It Works

1. **Direct Storage**: Images are stored directly in `storage/app/images/` using Laravel's local disk
2. **Custom Routes**: Images are served through `/admin/harmfulcontent/image/{filename}` route
3. **No Storage Links**: Eliminates the need for `php artisan storage:link`
4. **Hash-based Deduplication**: Prevents duplicate uploads using SHA-256 hashing
5. **Automatic Cleanup**: Removes unused images when content is updated or deleted

### Features

#### Backend

- **Direct Storage**: Images stored in `storage/app/images/` directory
- **Custom Image Serving**: `HarmfulContentController@serveImage` method serves images with proper MIME types
- **Hash Management**: SHA-256 hashing prevents duplicate uploads
- **Automatic Cleanup**: Unused images are automatically removed
- **Storage Statistics**: API endpoint provides storage usage information

#### Frontend

- **Direct URLs**: Images use `/admin/harmfulcontent/image/{filename}` format
- **Upload Feedback**: Users are notified when images are reused vs. newly uploaded
- **Progress Tracking**: Upload progress bar for better user experience

### File Structure

```
storage/
├── app/
│   ├── images/           # New images stored here
│   ├── uploads/          # Legacy images (for backward compatibility)
│   └── image_hashes.json # Hash-to-path mapping
```

### Routes

- `POST /admin/harmfulcontent/upload-image` - Upload new image
- `GET /admin/harmfulcontent/image/{filename}` - Serve image directly from storage
- `GET /admin/harmfulcontent/storage-stats` - Get storage statistics

### Commands

```bash
# Clean up orphaned images (dry run)
php artisan images:cleanup --dry-run

# Clean up orphaned images (actual deletion)
php artisan images:cleanup
```

### Configuration

The system automatically handles:

- Image deduplication using SHA-256 hashing
- MIME type detection based on file extensions
- Proper caching headers for images
- Backward compatibility with existing image URLs

### Benefits

1. **No Storage Links**: Eliminates the need for symbolic links
2. **Direct Access**: Images are served directly from storage
3. **Efficient Storage**: Prevents duplicate uploads
4. **Automatic Cleanup**: Maintains clean storage automatically
5. **Secure Access**: Images are served through authenticated routes

### Usage Examples

#### Uploading an Image

```javascript
// Frontend automatically handles uploads
const response = await axios.post('/admin/harmfulcontent/upload-image', formData);
// Returns: { success: true, url: '/admin/harmfulcontent/image/filename.jpg' }
```

#### Serving an Image

```html
<!-- Images are automatically served through the custom route -->
<img src="/admin/harmfulcontent/image/filename.jpg" alt="Description" />
```

#### Getting Storage Stats

```javascript
const response = await axios.get('/admin/harmfulcontent/storage-stats');
// Returns storage statistics including total images, size, and orphaned count
```

### Monitoring

- Check storage statistics via the API endpoint
- Monitor orphaned images using the cleanup command
- Review logs for upload and cleanup activities

### Troubleshooting

1. **Images not displaying**: Ensure the image serving route is accessible
2. **Upload failures**: Check file permissions on `storage/app/images/` directory
3. **Storage bloat**: Run `php artisan images:cleanup` to remove orphaned images

### Future Enhancements

- Image compression and optimization
- CDN integration for better performance
- Advanced image metadata management
- Bulk image operations
