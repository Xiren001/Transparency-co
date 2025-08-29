import ContentRenderer from '@/components/editor/ContentRenderer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';

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

interface HarmfulIngredientsSectionProps {
    harmfulContents: HarmfulContent[];
}

export default function HarmfulIngredientsSection({ harmfulContents }: HarmfulIngredientsSectionProps) {
    const [viewingContent, setViewingContent] = useState<HarmfulContent | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleView = (content: HarmfulContent) => {
        setViewingContent(content);
        setIsViewModalOpen(true);
    };

    const extractFirstImageFromContent = (content: HarmfulContent): string | null => {
        // Try to find image in content_html first
        let firstImageSrc = null;
        if (content.content_html) {
            const imgMatch = content.content_html.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
            firstImageSrc = imgMatch ? imgMatch[1] : null;
        }

        // If no image in HTML, try to find in JSON content
        if (!firstImageSrc && content.content_json && content.content_json.content) {
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

            firstImageSrc = findImageInJson(content.content_json.content);
        }

        return firstImageSrc;
    };

    const extractTextContent = (content: HarmfulContent): string => {
        if (content.content_html) {
            // Remove images but preserve other HTML formatting for preview
            const contentWithoutImages = content.content_html.replace(/<img[^>]*>/gi, '');
            // Strip HTML tags for text-only preview
            return contentWithoutImages.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
        }
        return 'Click to view content...';
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

    return (
        <>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {harmfulContents.map((content) => {
                        const firstImage = extractFirstImageFromContent(content);
                        const textContent = extractTextContent(content);

                        return (
                            <div
                                key={content.id}
                                className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl dark:bg-[#282828]"
                                onClick={() => handleView(content)}
                            >
                                {/* Card Content */}
                                <div className="flex">
                                    {/* Left - Image */}
                                    <div className="flex h-48 w-1/3 items-center justify-center bg-gray-200 dark:bg-[#282828]">
                                        {firstImage ? (
                                            <img src={firstImage} alt="Content image" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <div className="mb-2 text-2xl">📷</div>
                                                <div className="text-xs">No Image</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right - Text Content */}
                                    <div className="w-2/3 p-4">
                                        <div className="mb-2">
                                            {content.category && (
                                                <Badge variant="outline" className="mb-2 text-xs">
                                                    {content.category.replace(/-/g, ' ')}
                                                </Badge>
                                            )}
                                        </div>

                                        <h2 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">{content.title}</h2>

                                        <div className="h-20 overflow-hidden text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                            {content.content_html ? (
                                                <div
                                                    className="prose prose-sm dark:prose-invert prose-headings:my-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-1 max-w-none break-words"
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 4,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: content.content_html.replace(/<img[^>]*>/gi, ''),
                                                    }}
                                                />
                                            ) : (
                                                <div className="text-gray-400 italic">Click to view content...</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Section - Metadata */}
                                <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-1 dark:border-[#2d2d35] dark:bg-[#282828]">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <div className="font-semibold text-gray-700 dark:text-[#6298F0]">
                                            {new Date(content.created_at).getDate().toString().padStart(2, '0')}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase dark:text-[#6298F0]">
                                            {new Date(content.created_at).toLocaleDateString('en-US', { month: 'long' })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs dark:text-[#6298F0]">Click to read more</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {harmfulContents.length === 0 && (
                        <div className="col-span-full">
                            <Card className="rounded-2xl bg-white shadow-sm dark:bg-[#282828]">
                                <CardContent className="py-12 text-center">
                                    <p className="text-gray-500 dark:text-[#b8b8c0]">No harmful content available. Check back later for updates.</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="font-milk max-h-[90vh] max-w-4xl overflow-y-auto border-gray-200 bg-white uppercase dark:border-[#2d2d35] dark:bg-[#282828]">
                    {viewingContent && (
                        <div className="font-milk space-y-6 text-gray-900 dark:text-gray-100">
                            {/* Blog Card Display */}
                            <div
                                className="preview-card overflow-hidden rounded-lg bg-white shadow-lg dark:bg-[#282828]"
                                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                            >
                                {/* Card Content */}
                                <div className="flex">
                                    {/* Left - Image */}
                                    <div className="flex h-64 w-1/3 items-center justify-center bg-gray-200 dark:bg-[#2d2d35]">
                                        {(() => {
                                            const firstImageSrc = extractFirstImageFromContent(viewingContent);
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
                                    <div className="w-2/3 min-w-0 p-6">
                                        <div className="mb-3">
                                            {viewingContent.category && (
                                                <Badge
                                                    variant="outline"
                                                    className="mb-2 border-gray-300 text-xs text-gray-700 dark:border-[#6298F0] dark:text-[#6298F0]"
                                                >
                                                    {viewingContent.category.replace(/-/g, ' ')}
                                                </Badge>
                                            )}
                                        </div>

                                        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{viewingContent.title}</h2>

                                        <div className="max-h-[80vh] min-h-fit overflow-y-auto text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                            {viewingContent.content_html ? (
                                                <div
                                                    className="prose prose-sm dark:prose-invert prose-headings:my-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-1 max-w-none break-words"
                                                    dangerouslySetInnerHTML={{
                                                        __html: viewingContent.content_html.replace(/<img[^>]*>/gi, ''),
                                                    }}
                                                />
                                            ) : (
                                                <div className="prose prose-sm dark:prose-invert prose-headings:my-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-1 max-w-none break-words">
                                                    <ContentRenderer content={removeImagesFromContent(viewingContent.content_json)} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Section - Metadata */}
                                <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4 dark:border-[#2d2d35] dark:bg-[#282828]">
                                    <div className="text-sm text-gray-600 dark:text-[#6298F0]">
                                        <div className="font-semibold text-gray-700 dark:text-[#6298F0]">
                                            {new Date(viewingContent.created_at).getDate().toString().padStart(2, '0')}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase dark:text-[#6298F0]">
                                            {new Date(viewingContent.created_at).toLocaleDateString('en-US', { month: 'long' })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs dark:text-[#6298F0]">View more</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
