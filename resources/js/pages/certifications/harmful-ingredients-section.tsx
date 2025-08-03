import ContentRenderer from '@/components/editor/ContentRenderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StyledCard from '@/components/ui/styled-card';
import { categoryBackgrounds } from '@/constants/backgrounds';
import { Eye } from 'lucide-react';
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

    return (
        <>
            <div className="container mx-auto mb-6">
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-[#e0e0e5]">Harmful Ingredients & Practices</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stay informed about potentially harmful ingredients and practices in everyday products. Our research-backed content helps you make
                    informed decisions about your health and safety.
                </p>
            </div>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {harmfulContents.map((content, index) => {
                        // Use category-based background if available, otherwise fallback to rotating backgrounds
                        let background: 'peach' | 'lavender' | 'green' | 'pink' = 'peach';
                        let customBackground: string | undefined;
                        let label = 'IMPORTANT';

                        if (content.category && categoryBackgrounds[content.category as keyof typeof categoryBackgrounds]) {
                            const categoryBg = categoryBackgrounds[content.category as keyof typeof categoryBackgrounds];
                            background = categoryBg.background as 'peach' | 'lavender' | 'green' | 'pink';
                            customBackground = categoryBg.customBackground;
                            label = categoryBg.label;
                        } else {
                            const backgrounds: Array<'peach' | 'lavender' | 'green' | 'pink'> = ['peach', 'lavender', 'green', 'pink'];
                            background = backgrounds[index % backgrounds.length];
                        }

                        return (
                            <StyledCard
                                key={content.id}
                                background={background}
                                customBackground={customBackground}
                                backgroundImage={content.image_url}
                                label={label}
                                title={content.title}
                                body={`Updated: ${formatDate(content.updated_at)} • Version: ${content.version}`}
                                linkText="View Details →"
                                onLinkClick={() => handleView(content)}
                            >
                                <div className="mt-4 flex justify-end">
                                    <Button variant="outline" size="sm" onClick={() => handleView(content)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Content
                                    </Button>
                                </div>
                            </StyledCard>
                        );
                    })}

                    {harmfulContents.length === 0 && (
                        <div className="col-span-full">
                            <Card className="rounded-2xl bg-white shadow-sm dark:bg-[#18181c]">
                                <CardContent className="py-12 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">No harmful content available. Check back later for updates.</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{viewingContent?.title}</DialogTitle>
                    </DialogHeader>

                    {viewingContent && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant={viewingContent.is_active ? 'default' : 'secondary'}>
                                    {viewingContent.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                <span className="text-sm text-gray-500">Version {viewingContent.version}</span>
                                <span className="text-sm text-gray-500">Updated: {formatDate(viewingContent.updated_at)}</span>
                            </div>

                            <div className="rounded-lg border p-4">
                                <ContentRenderer content={viewingContent.content_json} />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
