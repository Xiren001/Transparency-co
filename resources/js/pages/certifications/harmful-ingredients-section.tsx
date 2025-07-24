import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface HarmfulItem {
    id: number;
    name: string;
    category: string;
    riskSummary: string;
    studyLink: string;
    alternatives: string[];
    severity: string;
}

interface Category {
    id: string;
    name: string;
}

interface HarmfulIngredientsSectionProps {
    harmfulItems: HarmfulItem[];
    categories: Category[];
}

export default function HarmfulIngredientsSection({ harmfulItems, categories }: HarmfulIngredientsSectionProps) {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'moderate':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'text-red-500';
            case 'moderate':
                return 'text-yellow-500';
            case 'low':
                return 'text-orange-400';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <>
            <div className="container mx-auto mb-6">
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-[#e0e0e5]">What to Watch Out For</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Learn about potentially harmful ingredients and practices, backed by scientific research.
                </p>
            </div>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {harmfulItems.map((item) => (
                        <Card
                            key={item.id}
                            className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-[#2d2d35] dark:bg-[#23232a] dark:hover:shadow-[#2d2d35]/50"
                        >
                            <CardHeader className="pb-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <AlertTriangle
                                            className={`h-6 w-6 ${getSeverityIcon(item.severity)} mt-0.5 flex-shrink-0 transition-transform group-hover:scale-110`}
                                        />
                                        <div>
                                            <CardTitle className="text-xl transition-colors group-hover:text-red-600 dark:text-[#e0e0e5] dark:group-hover:text-red-400">
                                                {item.name}
                                            </CardTitle>
                                            <Badge
                                                variant="outline"
                                                className="mt-1 border-gray-200 px-2 py-1 text-xs dark:border-[#2d2d35] dark:bg-[#1a1a1f] dark:text-[#e0e0e5]"
                                            >
                                                {categories.find((c) => c.id === item.category)?.name}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Badge
                                        className={`${getSeverityColor(item.severity)} border px-2 py-1 text-xs font-medium dark:border-[#2d2d35]`}
                                    >
                                        {item.severity} risk
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="mb-2 text-sm font-semibold text-gray-800 dark:text-[#e0e0e5]">Risk Summary:</h4>
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.riskSummary}</p>
                                </div>

                                <div>
                                    <h4 className="mb-2 text-sm font-semibold text-gray-800 dark:text-[#e0e0e5]">Safer Alternatives:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {item.alternatives.map((alt, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                                            >
                                                {alt}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="group w-full rounded-md bg-white py-2 transition-colors hover:bg-blue-50 dark:border-[#2d2d35] dark:bg-[#1a1a1f] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                    asChild
                                >
                                    <a href={item.studyLink} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                        View Research
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    {harmfulItems.length === 0 && (
                        <div className="col-span-full py-12 text-center">
                            <p className="text-lg text-gray-500 dark:text-gray-400">No harmful ingredients found for your search criteria.</p>
                            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">Try adjusting your search or category filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
