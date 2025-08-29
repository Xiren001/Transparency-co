import ContentRenderer from '@/components/editor/ContentRenderer';
import TipTapEditor from '@/components/editor/TipTapEditor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { categories } from '@/constants/categories';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

interface HarmfulContent {
    id: number;
    title: string;
    content_json: any;
    content_html?: string;
    slug: string;
    is_active: boolean;
    version: number;
    created_at: string;
    updated_at: string;
    category?: string;
    image_url?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Harmful Content',
        href: '/admin/harmfulcontent',
    },
];

interface HarmfulContentIndexProps {
    harmfulContents: HarmfulContent[];
}

export default function HarmfulContentIndex({ harmfulContents }: HarmfulContentIndexProps) {
    const [contents, setContents] = useState<HarmfulContent[]>(harmfulContents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingContent, setEditingContent] = useState<HarmfulContent | null>(null);
    const [viewingContent, setViewingContent] = useState<HarmfulContent | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content_json: null,
        content_html: '',
        category: '',
        image: null as File | null,
        imagePreview: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'pending' | null>(null);
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCreate = () => {
        setEditingContent(null);
        setFormData({
            title: '',
            content_json: null,
            content_html: '',
            category: '',
            image: null,
            imagePreview: '',
        });
        setIsModalOpen(true);
    };

    const handleEdit = (content: HarmfulContent) => {
        setEditingContent(content);
        setFormData({
            title: content.title,
            content_json: content.content_json,
            content_html: content.content_html || '',
            category: content.category || '',
            image: null,
            imagePreview: '',
        });
        setIsModalOpen(true);
    };

    const handleView = (content: HarmfulContent) => {
        setViewingContent(content);
        setIsViewModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (!formData.content_json) {
            toast.error('Content is required');
            return;
        }

        setIsLoading(true);
        try {
            const url = editingContent ? `/admin/harmfulcontent/${editingContent.id}` : '/admin/harmfulcontent';

            const method = editingContent ? 'post' : 'post';

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content_json', JSON.stringify(formData.content_json));
            formDataToSend.append('content_html', formData.content_html);
            formDataToSend.append('category', formData.category);

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await axios[method](url, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success(editingContent ? 'Content updated successfully' : 'Content created successfully');

                if (editingContent) {
                    setContents((prev) =>
                        prev.map((content) => (content.id === editingContent.id ? { ...content, ...response.data.data } : content)),
                    );
                } else {
                    setContents((prev) => [response.data.data, ...prev]);
                }

                setIsModalOpen(false);
                setFormData({
                    title: '',
                    content_json: null,
                    content_html: '',
                    category: '',
                    image: null,
                    imagePreview: '',
                });
            }
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(error.response?.data?.message || 'Failed to save content');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this content?')) return;

        try {
            const response = await axios.delete(`/admin/harmfulcontent/${id}`);

            if (response.data.success) {
                toast.success('Content deleted successfully');
                setContents((prev) => prev.filter((content) => content.id !== id));
            }
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error('Failed to delete content');
        }
    };

    const handleToggleStatus = async (id: number) => {
        try {
            const response = await axios.post(`/admin/harmfulcontent/${id}/toggle-status`);

            if (response.data.success) {
                toast.success('Status updated successfully');
                setContents((prev) => prev.map((content) => (content.id === id ? { ...content, is_active: !content.is_active } : content)));
            }
        } catch (error: any) {
            console.error('Toggle error:', error);
            toast.error('Failed to update status');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const removeImagesFromContent = (content: any): any => {
        if (!content || !content.content) return content;

        const removeImagesFromNodes = (nodes: any[]): any[] => {
            return nodes.filter((node) => {
                if (node.type === 'image') {
                    return false; // Remove image nodes
                }
                if (node.content && Array.isArray(node.content)) {
                    node.content = removeImagesFromNodes(node.content);
                }
                return true;
            });
        };

        return {
            ...content,
            content: removeImagesFromNodes(content.content),
        };
    };

    const autoSave = useCallback(async () => {
        if (!formData.title.trim() || !formData.content_json) {
            console.log('Auto-save skipped: missing title or content');
            return;
        }

        console.log('Starting auto-save...', {
            isEdit: !!editingContent,
            id: editingContent?.id,
            title: formData.title,
        });

        setAutoSaveStatus('saving');
        try {
            const url = editingContent ? `/admin/harmfulcontent/${editingContent.id}` : '/admin/harmfulcontent';
            const method = editingContent ? 'post' : 'post';

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content_json', JSON.stringify(formData.content_json));
            formDataToSend.append('content_html', formData.content_html);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('auto_save', 'true');

            // Don't include image in auto-save unless it's new
            if (formData.image && !editingContent) {
                formDataToSend.append('image', formData.image);
            }

            console.log('Sending auto-save request to:', url);

            const response = await axios[method](url, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Auto-save response:', response.data);

            if (response.data.success) {
                setLastSaved(new Date());
                setAutoSaveStatus('saved');

                // Update the editing content if it's an edit
                if (editingContent && response.data.data) {
                    setEditingContent(response.data.data);
                    setContents((prev) =>
                        prev.map((content) => (content.id === editingContent.id ? { ...content, ...response.data.data } : content)),
                    );
                } else if (!editingContent && response.data.data) {
                    // If it's a new content, update editing content with the returned data
                    console.log('New content created, updating state:', response.data.data);
                    setEditingContent(response.data.data);
                    setContents((prev) => {
                        const existing = prev.find((c) => c.id === response.data.data.id);
                        if (existing) {
                            return prev.map((content) => (content.id === response.data.data.id ? { ...content, ...response.data.data } : content));
                        } else {
                            return [response.data.data, ...prev];
                        }
                    });
                }

                // Clear the saved status after 3 seconds
                setTimeout(() => setAutoSaveStatus(null), 3000);
            } else {
                console.error('Auto-save failed:', response.data);
                setAutoSaveStatus(null);
            }
        } catch (error: any) {
            console.error('Auto-save error:', error);
            console.error('Error response:', error.response?.data);
            setAutoSaveStatus(null);
            // Don't show error toast for auto-save failures to avoid spam
        }
    }, [formData, editingContent]);

    const triggerAutoSave = useCallback(() => {
        setAutoSaveStatus('pending');

        // Clear existing timeout
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        // Set new timeout for auto-save (2 seconds after user stops typing)
        autoSaveTimeoutRef.current = setTimeout(() => {
            autoSave();
        }, 2000);
    }, [autoSave]);

    // Handle content changes for auto-save
    const handleContentChange = useCallback(
        (content: any, html?: string) => {
            setFormData((prev) => ({
                ...prev,
                content_json: content,
                content_html: html || prev.content_html,
            }));
            triggerAutoSave();
        },
        [triggerAutoSave],
    );

    // Handle manual save from editor
    const handleEditorSave = useCallback(
        ({ json, html }: { json: any; html: string }) => {
            setFormData((prev) => ({
                ...prev,
                content_json: json,
                content_html: html,
            }));
            triggerAutoSave();
        },
        [triggerAutoSave],
    );

    const handleTitleChange = useCallback(
        (value: string) => {
            setFormData((prev) => ({ ...prev, title: value }));
            if (value.trim()) {
                triggerAutoSave();
            }
        },
        [triggerAutoSave],
    );

    // Clean up timeout on unmount or modal close
    useEffect(() => {
        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, []);

    // Reset auto-save state when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            setAutoSaveStatus(null);
            setLastSaved(null);
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        }
    }, [isModalOpen]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Harmful Content Management" />
            <div className="container mx-auto px-2 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Harmful Content Management</h1>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Content
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-muted/50">
                                    <TableHead className="w-[300px]">Title</TableHead>
                                    <TableHead className="w-[120px]">Status</TableHead>
                                    <TableHead className="w-[150px]">Category</TableHead>
                                    <TableHead className="w-[120px]">Version</TableHead>
                                    <TableHead className="w-[150px]">Created</TableHead>
                                    <TableHead className="w-[200px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contents.map((content) => (
                                    <TableRow key={content.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">{content.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={content.is_active ? 'default' : 'secondary'}>
                                                {content.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {content.category ? (
                                                <Badge variant="outline" className="capitalize">
                                                    {content.category.replace(/-/g, ' ')}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{content.version}</TableCell>
                                        <TableCell>{formatDate(content.created_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleView(content)} className="h-8 px-3">
                                                    View
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(content)} className="h-8 px-3">
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleToggleStatus(content.id)}
                                                    className="h-8 px-3"
                                                >
                                                    {content.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(content.id)} className="h-8 px-3">
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {contents.length === 0 && (
                    <div className="bg-card rounded-lg border p-12 text-center">
                        <p className="text-muted-foreground">No harmful content found. Create your first content item.</p>
                    </div>
                )}

                {/* Create/Edit Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-[95vw] overflow-hidden rounded-lg p-0">
                        <DialogHeader className="border-b px-6 py-4">
                            <div className="flex items-center gap-6">
                                <DialogTitle>{editingContent ? 'Edit Harmful Content' : 'Create New Harmful Content'}</DialogTitle>
                                <div className="flex items-center gap-2 text-sm">
                                    {autoSaveStatus === 'saving' && (
                                        <span className="text-blue-600">
                                            <span className="mr-1">💾</span>
                                            Saving...
                                        </span>
                                    )}
                                    {autoSaveStatus === 'saved' && (
                                        <span className="text-green-600">
                                            <span className="mr-1">✅</span>
                                            Auto-saved
                                        </span>
                                    )}
                                    {autoSaveStatus === 'pending' && (
                                        <span className="text-yellow-600">
                                            <span className="mr-1">⏳</span>
                                            Pending...
                                        </span>
                                    )}
                                    {lastSaved && <span className="text-gray-500">Last saved: {lastSaved.toLocaleTimeString()}</span>}
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="flex h-[calc(90vh-120px)]">
                            {/* Left Side - Editor */}
                            <div className="w-1/2 overflow-y-auto border-r p-8">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Title Input */}
                                        <div>
                                            <Label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#b8b8c0]">
                                                Title
                                            </Label>
                                            <Input
                                                id="title"
                                                value={formData.title}
                                                onChange={(e) => handleTitleChange(e.target.value)}
                                                placeholder="Enter content title"
                                                className="text-lg font-semibold"
                                            />
                                        </div>

                                        {/* Category and Image Controls */}

                                        <div>
                                            <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#b8b8c0]">Category</Label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                                                className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-2 focus:ring-1 focus:outline-none dark:border-[#2d2d35] dark:bg-[#2d2d35] dark:text-white"
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Content Editor */}
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#b8b8c0]">Content</Label>
                                        <TipTapEditor content={formData.content_json} onChange={handleContentChange} onSave={handleEditorSave} />
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Live Preview */}
                            <div className="w-1/2 overflow-y-auto bg-gray-50 p-8 dark:bg-[#23232a]">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-[#b8b8c0]">Card Preview</h3>

                                    {/* Blog Card Preview */}
                                    <div className="preview-card overflow-hidden rounded-lg bg-white shadow-lg">
                                        {/* Card Content */}
                                        <div className="flex">
                                            {/* Left - Image */}
                                            <div className="flex w-1/3 items-center justify-center bg-gray-200">
                                                {(() => {
                                                    // Extract first image from editor content
                                                    const contentHtml = formData.content_html || editingContent?.content_html || '';
                                                    const contentJson = formData.content_json || editingContent?.content_json || {};

                                                    // Try to find image in content_html first
                                                    let firstImageSrc = null;
                                                    if (contentHtml) {
                                                        const imgMatch = contentHtml.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
                                                        firstImageSrc = imgMatch ? imgMatch[1] : null;
                                                    }

                                                    // If no image in HTML, try to find in JSON content
                                                    if (!firstImageSrc && contentJson && contentJson.content) {
                                                        const findImageInJson = (nodes: any[]): string | null => {
                                                            for (const node of nodes) {
                                                                if (node.type === 'image' && node.attrs && node.attrs.src) {
                                                                    return node.attrs.src;
                                                                }
                                                                if (node.content && Array.isArray(node.content)) {
                                                                    const found = findImageInJson(node.content);
                                                                    if (found) return found;
                                                                }
                                                            }
                                                            return null;
                                                        };

                                                        firstImageSrc = findImageInJson(contentJson.content);
                                                    }

                                                    if (firstImageSrc) {
                                                        return <img src={firstImageSrc} alt="Content image" className="h-full w-full object-cover" />;
                                                    } else {
                                                        return (
                                                            <div className="text-center text-gray-400">
                                                                <div className="mb-2 text-2xl">📷</div>
                                                                <div className="text-xs">No Image</div>
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </div>

                                            {/* Right - Text Content */}
                                            <div className="w-2/3 p-4">
                                                <div className="mb-2">
                                                    {formData.category && (
                                                        <Badge variant="outline" className="mb-2 text-xs">
                                                            {formData.category.replace(/-/g, ' ')}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <h2 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900">
                                                    {formData.title || 'Your Title Here'}
                                                </h2>

                                                <div className="h-25 overflow-hidden text-sm leading-relaxed text-gray-600">
                                                    {formData.content_html ? (
                                                        <div
                                                            className="prose prose-sm prose-headings:my-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-1 max-w-none break-words"
                                                            style={{
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 4,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}
                                                            dangerouslySetInnerHTML={{
                                                                __html: formData.content_html.replace(/<img[^>]*>/gi, ''),
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="text-gray-400 italic">Your content will appear here...</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Section - Metadata */}
                                        <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-3">
                                            <div className="text-sm text-gray-500">
                                                <div className="font-semibold">
                                                    {editingContent
                                                        ? new Date(editingContent.created_at).getDate().toString().padStart(2, '0')
                                                        : new Date().getDate().toString().padStart(2, '0')}
                                                </div>
                                                <div className="text-xs uppercase">
                                                    {editingContent
                                                        ? new Date(editingContent.created_at).toLocaleDateString('en-US', { month: 'long' })
                                                        : new Date().toLocaleDateString('en-US', { month: 'long' })}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs">See more</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Full Content Preview */}
                                <div className="border-t border-gray-200 pt-8 dark:border-[#2d2d35]">
                                    <h3 className="mb-6 text-lg font-semibold text-gray-700 dark:text-[#b8b8c0]">Full Content Preview</h3>

                                    {/* Full Blog Card Preview */}
                                    <div className="preview-card overflow-hidden rounded-lg bg-white shadow-lg">
                                        {/* Card Content */}
                                        <div className="flex">
                                            {/* Left - Image */}
                                            <div className="flex h-64 w-1/3 items-center justify-center bg-gray-200">
                                                {(() => {
                                                    // Extract first image from editor content
                                                    const contentHtml = formData.content_html || editingContent?.content_html || '';
                                                    const contentJson = formData.content_json || editingContent?.content_json || {};

                                                    // Try to find image in content_html first
                                                    let firstImageSrc = null;
                                                    if (contentHtml) {
                                                        const imgMatch = contentHtml.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
                                                        firstImageSrc = imgMatch ? imgMatch[1] : null;
                                                    }

                                                    // If no image in HTML, try to find in JSON content
                                                    if (!firstImageSrc && contentJson && contentJson.content) {
                                                        const findImageInJson = (nodes: any[]): string | null => {
                                                            for (const node of nodes) {
                                                                if (node.type === 'image' && node.attrs && node.attrs.src) {
                                                                    return node.attrs.src;
                                                                }
                                                                if (node.content && Array.isArray(node.content)) {
                                                                    const found = findImageInJson(node.content);
                                                                    if (found) return found;
                                                                }
                                                            }
                                                            return null;
                                                        };

                                                        firstImageSrc = findImageInJson(contentJson.content);
                                                    }

                                                    if (firstImageSrc) {
                                                        return <img src={firstImageSrc} alt="Content image" className="h-full w-full object-cover" />;
                                                    } else {
                                                        return (
                                                            <div className="text-center text-gray-400">
                                                                <div className="mb-2 text-2xl">📷</div>
                                                                <div className="text-xs">No Image</div>
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </div>

                                            {/* Right - Full Text Content */}
                                            <div className="w-2/3 p-6">
                                                <div className="mb-3">
                                                    {formData.category && (
                                                        <Badge variant="outline" className="mb-2 text-xs">
                                                            {formData.category.replace(/-/g, ' ')}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <h2 className="mb-4 text-2xl font-bold text-gray-900">{formData.title || 'Your Title Here'}</h2>

                                                <div className="max-h-[80vh] min-h-fit overflow-y-auto text-sm leading-relaxed text-gray-600">
                                                    {formData.content_html ? (
                                                        <div
                                                            className="prose prose-sm prose-headings:my-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-1 max-w-none break-words"
                                                            dangerouslySetInnerHTML={{
                                                                __html: formData.content_html.replace(/<img[^>]*>/gi, ''),
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="text-gray-400 italic">Your content will appear here...</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Section - Metadata */}
                                        <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4">
                                            <div className="text-sm text-gray-500">
                                                <div className="font-semibold">
                                                    {editingContent
                                                        ? new Date(editingContent.created_at).getDate().toString().padStart(2, '0')
                                                        : new Date().getDate().toString().padStart(2, '0')}
                                                </div>
                                                <div className="text-xs uppercase">
                                                    {editingContent
                                                        ? new Date(editingContent.created_at).toLocaleDateString('en-US', { month: 'long' })
                                                        : new Date().toLocaleDateString('en-US', { month: 'long' })}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs">View Research</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end gap-2 border-t bg-gray-50 px-6 py-4 dark:bg-[#23232a]">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isLoading}>
                                {isLoading ? 'Saving...' : editingContent ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* View Modal */}
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Content Preview</DialogTitle>
                        </DialogHeader>

                        {viewingContent && (
                            <div className="space-y-6">
                                {/* Blog Card Display */}
                                <div className="preview-card overflow-hidden rounded-lg bg-white shadow-lg">
                                    {/* Card Content */}
                                    <div className="flex">
                                        {/* Left - Image */}
                                        <div className="flex h-48 w-1/3 items-center justify-center bg-gray-200">
                                            {(() => {
                                                // Extract first image from editor content
                                                const contentHtml = viewingContent.content_html || '';
                                                const contentJson = viewingContent.content_json || {};

                                                // Try to find image in content_html first
                                                let firstImageSrc = null;
                                                if (contentHtml) {
                                                    const imgMatch = contentHtml.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
                                                    firstImageSrc = imgMatch ? imgMatch[1] : null;
                                                }

                                                // If no image in HTML, try to find in JSON content
                                                if (!firstImageSrc && contentJson && contentJson.content) {
                                                    const findImageInJson = (nodes: any[]): string | null => {
                                                        for (const node of nodes) {
                                                            if (node.type === 'image' && node.attrs && node.attrs.src) {
                                                                return node.attrs.src;
                                                            }
                                                            if (node.content && Array.isArray(node.content)) {
                                                                const found = findImageInJson(node.content);
                                                                if (found) return found;
                                                            }
                                                        }
                                                        return null;
                                                    };

                                                    firstImageSrc = findImageInJson(contentJson.content);
                                                }

                                                if (firstImageSrc) {
                                                    return <img src={firstImageSrc} alt="Content image" className="h-full w-full object-cover" />;
                                                } else {
                                                    return (
                                                        <div className="text-center text-gray-400">
                                                            <div className="mb-2 text-2xl">📷</div>
                                                            <div className="text-xs">No Image</div>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>

                                        {/* Right - Text Content */}
                                        <div className="w-2/3 p-4">
                                            <div className="mb-2">
                                                {viewingContent.category && (
                                                    <Badge variant="outline" className="mb-2 text-xs">
                                                        {viewingContent.category.replace(/-/g, ' ')}
                                                    </Badge>
                                                )}
                                                <Badge variant={viewingContent.is_active ? 'default' : 'secondary'} className="ml-2 text-xs">
                                                    {viewingContent.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>

                                            <h2 className="mb-2 text-lg font-bold text-gray-900">{viewingContent.title}</h2>

                                            <div className="h-20 overflow-hidden text-sm leading-relaxed text-gray-600">
                                                {viewingContent.content_html ? (
                                                    <div
                                                        className="prose prose-sm prose-headings:my-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-1 max-w-none break-words"
                                                        style={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 4,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: viewingContent.content_html.replace(/<img[^>]*>/gi, ''),
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="text-gray-400 italic">No content available...</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Section - Metadata */}
                                    <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-3">
                                        <div className="text-sm text-gray-500">
                                            <div className="font-semibold">
                                                {new Date(viewingContent.created_at).getDate().toString().padStart(2, '0')}
                                            </div>
                                            <div className="text-xs uppercase">
                                                {new Date(viewingContent.created_at).toLocaleDateString('en-US', { month: 'long' })}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <div className="h-4 w-4">👁️</div>
                                                <span className="text-xs">1.2k</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="h-4 w-4">❤️</div>
                                                <span className="text-xs">45</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="h-4 w-4">💬</div>
                                                <span className="text-xs">12</span>
                                            </div>
                                            <div className="h-4 w-4">📤</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Full Content Section */}
                                <div className="rounded-lg border bg-gray-50 p-4">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-700">Full Content</h3>
                                    <div className="rounded-lg border bg-white p-4">
                                        {viewingContent.content_html ? (
                                            <div
                                                className="prose prose-sm dark:prose-invert prose-headings:my-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-1 max-h-[80vh] min-h-fit max-w-none overflow-y-auto break-words"
                                                dangerouslySetInnerHTML={{
                                                    __html: viewingContent.content_html.replace(/<img[^>]*>/gi, ''),
                                                }}
                                            />
                                        ) : (
                                            <div className="prose prose-sm dark:prose-invert prose-headings:my-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-1 max-h-[80vh] min-h-fit max-w-none overflow-y-auto break-words">
                                                <ContentRenderer content={removeImagesFromContent(viewingContent.content_json)} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="grid grid-cols-2 gap-4 rounded-lg border bg-gray-50 p-4">
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Version:</span>
                                        <span className="ml-2 text-sm text-gray-900">{viewingContent.version}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Created:</span>
                                        <span className="ml-2 text-sm text-gray-900">{formatDate(viewingContent.created_at)}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Category:</span>
                                        <span className="ml-2 text-sm text-gray-900">{viewingContent.category || 'None'}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Status:</span>
                                        <span className="ml-2 text-sm text-gray-900">{viewingContent.is_active ? 'Active' : 'Inactive'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
