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
                <div className="container mx-auto px-0 py-8">
                    <div className="mb-6">
                        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-[#e0e0e5]">Learn More</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Watch our educational videos to deepen your understanding of certifications and safe products.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredVideos.map((video, index) => (
                            <div
                                key={index}
                                className="group relative cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-[#2d2d35] dark:bg-[#23232a] dark:hover:shadow-[#2d2d35]/50"
                            >
                                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                                        <div className="group-hover:bg-primary dark:group-hover:bg-primary flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/90 bg-white/90 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:text-white dark:border-[#2d2d35]/90 dark:bg-[#1a1a1f]/90 dark:group-hover:text-black">
                                            <Play className="h-8 w-8 text-gray-700 transition-colors group-hover:text-white dark:text-gray-300 dark:group-hover:text-black" />
                                        </div>
                                    </div>
                                    {/* Placeholder for video thumbnail */}
                                    <img
                                        src={`https://source.unsplash.com/400x225/?nature,water,organic,${index}`}
                                        alt="Video thumbnail"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="group-hover:text-primary dark:group-hover:text-primary mb-3 line-clamp-2 text-lg font-semibold transition-colors dark:text-[#e0e0e5]">
                                        {video.title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-[#1a1a1f] dark:text-gray-300">
                                            {video.category}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{video.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredVideos.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-lg text-gray-500 dark:text-gray-400">No videos available for the selected category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
