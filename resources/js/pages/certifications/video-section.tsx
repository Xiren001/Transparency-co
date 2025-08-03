import { Play } from 'lucide-react';

const videos = [
    { title: 'Understanding Organic Certifications', duration: '5:30', category: 'Food' },
    { title: 'Clean Beauty: What to Look For', duration: '7:15', category: 'Skincare' },
    { title: 'Sustainable Textiles Explained', duration: '6:45', category: 'Textiles' },
    { title: 'Safe Home Cleaning Products', duration: '4:20', category: 'Cleaning' },
    { title: 'Baby Product Safety Guide', duration: '8:10', category: 'Baby & Kids' },
    { title: 'Water Filter Certifications', duration: '6:00', category: 'Water' },
];

interface VideoSectionProps {
    selectedCategory: string;
}

export default function VideoSection({ selectedCategory }: VideoSectionProps) {
    const filteredVideos = videos.filter((video) => selectedCategory === 'all' || video.category.toLowerCase().includes(selectedCategory));

    return (
        <div className="w-full py-0">
            <div className="w-full">
                <div className="container mx-auto px-0 py-4 sm:py-6 lg:py-8">
                    <div className="mb-4 sm:mb-6">
                        <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl dark:text-[#e0e0e5]">Learn More</h2>
                        <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
                            Watch our educational videos to deepen your understanding of certifications and safe products.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                        {filteredVideos.map((video, index) => (
                            <div
                                key={index}
                                className="group relative cursor-pointer touch-manipulation rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.98] dark:border-[#2d2d35] dark:bg-[#23232a] dark:hover:shadow-[#2d2d35]/50"
                            >
                                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                                        <div className="group-hover:bg-primary dark:group-hover:bg-primary flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/90 bg-white/90 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:text-white sm:h-16 sm:w-16 dark:border-[#2d2d35]/90 dark:bg-[#1a1a1f]/90 dark:group-hover:text-black">
                                            <Play className="h-6 w-6 text-gray-700 transition-colors group-hover:text-white sm:h-8 sm:w-8 dark:text-gray-300 dark:group-hover:text-black" />
                                        </div>
                                    </div>
                                    {/* Placeholder for video thumbnail */}
                                    <img
                                        src={'placeholder.svg'}
                                        alt="Video thumbnail"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4 sm:p-6">
                                    <h3 className="group-hover:text-primary dark:group-hover:text-primary mb-3 line-clamp-2 text-base leading-tight font-semibold transition-colors sm:text-lg dark:text-[#e0e0e5]">
                                        {video.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium whitespace-nowrap text-gray-700 dark:bg-[#1a1a1f] dark:text-gray-300">
                                            {video.category}
                                        </span>
                                        <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">{video.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredVideos.length === 0 && (
                        <div className="py-8 text-center sm:py-12">
                            <p className="text-base text-gray-500 sm:text-lg dark:text-gray-400">No videos available for the selected category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
