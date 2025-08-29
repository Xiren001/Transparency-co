import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit, Eye, EyeOff, Instagram, Play, Plus, Search, Trash2, Video } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Videos',
        href: '/admin/videos',
    },
];

interface Video {
    id: number;
    instagram_url: string;
    video_id: string;
    thumbnail?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    videos: Video[];
}

export default function AdminVideosIndex({ videos }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<Video | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        instagram_url: '',
        video_id: '',
        thumbnail: '',
        is_active: true,
    });

    const filteredVideos = videos.filter(
        (video) =>
            video.instagram_url.toLowerCase().includes(searchTerm.toLowerCase()) || video.video_id.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const activeVideosCount = videos.filter((video) => video.is_active).length;
    const canActivateMore = activeVideosCount < 3;

    const handleCreate = () => {
        router.post('/admin/videos', formData, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setFormData({
                    instagram_url: '',
                    video_id: '',
                    thumbnail: '',
                    is_active: true,
                });
                // Video created successfully
            },
            onError: (errors) => {
                // Failed to create video
            },
        });
    };

    const handleEdit = () => {
        if (!editingVideo) return;

        router.post(`/admin/videos/${editingVideo.id}`, formData, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setEditingVideo(null);
                setFormData({
                    instagram_url: '',
                    video_id: '',
                    thumbnail: '',
                    is_active: true,
                });
                // Video updated successfully
            },
            onError: (errors) => {
                // Failed to update video
            },
        });
    };

    const handleDelete = (video: Video) => {
        if (confirm('Are you sure you want to delete this video?')) {
            router.delete(`/admin/videos/${video.id}`, {
                onSuccess: () => {
                    // Video deleted successfully
                },
                onError: (errors) => {
                    // Failed to delete video
                },
            });
        }
    };

    const handleToggleStatus = (video: Video) => {
        // Prevent activating if already at limit
        if (!video.is_active && !canActivateMore) {
            alert('Maximum of 3 active videos allowed. Please deactivate another video first.');
            return;
        }

        router.post(
            `/admin/videos/${video.id}/toggle-status`,
            {},
            {
                onSuccess: () => {
                    // Status toggled successfully
                },
                onError: (errors: any) => {
                    // Failed to toggle status
                },
            },
        );
    };

    const openEditModal = (video: Video) => {
        setEditingVideo(video);
        setFormData({
            instagram_url: video.instagram_url,
            video_id: video.video_id,
            thumbnail: video.thumbnail || '',
            is_active: video.is_active,
        });
        setIsEditModalOpen(true);
    };

    const extractVideoId = (url: string) => {
        const postId = url.split('/reel/')[1]?.split('/')[0] || url.split('/p/')[1]?.split('/')[0];
        return postId || '';
    };

    const handleInstagramUrlChange = (url: string) => {
        const videoId = extractVideoId(url);
        setFormData((prev) => ({
            ...prev,
            instagram_url: url,
            video_id: videoId,
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Video Management" />

            <div className="container mx-auto px-2 py-10">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Video Management</h1>
                        <p className="text-muted-foreground text-sm">Manage educational videos and Instagram content</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">Active videos: {activeVideosCount}/3</span>
                            {!canActivateMore && <span className="text-sm text-amber-600 dark:text-amber-400">• Maximum active videos reached</span>}
                        </div>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Video
                    </Button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input placeholder="Search videos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                    </div>
                </div>

                {/* Videos Table */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Videos ({filteredVideos.length})</h3>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Thumbnail</TableHead>
                                    <TableHead>Video ID</TableHead>
                                    <TableHead>Instagram URL</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVideos.map((video) => (
                                    <TableRow key={video.id}>
                                        <TableCell>
                                            {video.thumbnail ? (
                                                <div className="relative h-16 w-24 overflow-hidden rounded">
                                                    <img src={video.thumbnail} alt="Video thumbnail" className="h-full w-full object-cover" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                                                        <Play className="h-6 w-6 text-white" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex h-16 w-24 items-center justify-center rounded bg-gray-100 dark:bg-[#2d2d35]">
                                                    <Video className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Instagram className="h-4 w-4 text-blue-600" />
                                                <span className="font-mono text-sm">{video.video_id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={video.instagram_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="max-w-xs truncate text-sm text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                {video.instagram_url}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={video.is_active}
                                                    onCheckedChange={() => handleToggleStatus(video)}
                                                    disabled={!video.is_active && !canActivateMore}
                                                />
                                                {video.is_active ? (
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="h-4 w-4 text-green-600" />
                                                        <span className="text-sm text-green-600">Active</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-500">Inactive</span>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-muted-foreground text-sm">{new Date(video.created_at).toLocaleDateString()}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => openEditModal(video)}>
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(video)}
                                                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredVideos.length === 0 && (
                            <div className="py-12 text-center">
                                <Video className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No videos found</h3>
                                <p className="text-muted-foreground dark:text-[#b8b8c0]">
                                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first video.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Create Video Modal */}
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Video</DialogTitle>
                            <DialogDescription>Create a new educational video entry</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="instagram_url">Instagram URL *</Label>
                                <Input
                                    id="instagram_url"
                                    value={formData.instagram_url}
                                    onChange={(e) => handleInstagramUrlChange(e.target.value)}
                                    placeholder="https://www.instagram.com/p/..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                                <Input
                                    id="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    placeholder="Image URL for thumbnail"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                    disabled={!canActivateMore && formData.is_active}
                                />
                                <Label htmlFor="is_active">Active</Label>
                                {!canActivateMore && (
                                    <span className="text-sm text-amber-600 dark:text-amber-400">(Maximum 3 active videos reached)</span>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate}>Create Video</Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Video Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit Video</DialogTitle>
                            <DialogDescription>Update video information</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-instagram_url">Instagram URL *</Label>
                                <Input
                                    id="edit-instagram_url"
                                    value={formData.instagram_url}
                                    onChange={(e) => handleInstagramUrlChange(e.target.value)}
                                    placeholder="https://www.instagram.com/p/..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
                                <Input
                                    id="edit-thumbnail"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    placeholder="Image URL for thumbnail"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                    disabled={!canActivateMore && formData.is_active}
                                />
                                <Label htmlFor="edit-is_active">Active</Label>
                                {!canActivateMore && (
                                    <span className="text-sm text-amber-600 dark:text-amber-400">(Maximum 3 active videos reached)</span>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEdit}>Update Video</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
