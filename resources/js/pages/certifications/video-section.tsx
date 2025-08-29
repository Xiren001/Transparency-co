import { Instagram, Play } from 'lucide-react';
import { useState } from 'react';

interface Video {
    id: number;
    instagram_url: string;
    video_id: string;
    thumbnail?: string;
    is_active: boolean;
}

interface VideoSectionProps {
    selectedCategory: string;
    videos?: Video[];
}

export default function VideoSection({ selectedCategory, videos = [] }: VideoSectionProps) {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter videos by active status only and limit to 3
    const filteredVideos = videos.filter((video) => video.is_active).slice(0, 3);

    const handleVideoClick = (video: Video) => {
        setSelectedVideo(video);
        setIsModalOpen(true);
    };

    const getDirectVideoEmbed = (instagramUrl: string) => {
        // Extract the post ID from Instagram URL
        const postId = instagramUrl.split('/reel/')[1]?.split('/')[0] || instagramUrl.split('/p/')[1]?.split('/')[0];

        if (postId) {
            // Use a minimal embed that shows just the video
            return `https://www.instagram.com/p/${postId}/embed/captioned/`;
        }
        return instagramUrl;
    };

    return (
        <>
            <div className="w-full py-0">
                <div className="w-full">
                    <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                        <div className="mb-4 sm:mb-6 lg:mb-8">
                            <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl dark:text-[#e0e0e5]">Learn More</h2>
                            <p className="text-sm text-gray-600 sm:text-base lg:text-lg dark:text-gray-400">
                                Watch our educational videos to deepen your understanding of certifications and safe products.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
                            {filteredVideos.map((video) => (
                                <div
                                    key={video.id}
                                    onClick={() => handleVideoClick(video)}
                                    className="group relative cursor-pointer touch-manipulation rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.98] dark:border-[#2d2d35] dark:bg-[#282828] dark:hover:shadow-[#2d2d35]/50"
                                >
                                    <div className="relative aspect-video overflow-hidden rounded-lg">
                                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                                            <div className="group-hover:bg-primary dark:group-hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/90 bg-white/90 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:text-white sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 dark:border-[#2d2d35]/90 dark:bg-[#1a1a1f]/90 dark:group-hover:text-black">
                                                <Play className="h-5 w-5 text-gray-700 transition-colors group-hover:text-white sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 dark:text-gray-300 dark:group-hover:text-black" />
                                            </div>
                                        </div>
                                        {/* Instagram icon overlay */}
                                        <div className="absolute top-2 right-2 z-30 sm:top-3 sm:right-3">
                                            <Instagram className="h-4 w-4 text-white drop-shadow-lg sm:h-5 sm:w-5" />
                                        </div>
                                        {/* Video thumbnail */}
                                        <img
                                            src={video.thumbnail || '/placeholder.svg'}
                                            alt="Video thumbnail"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                // Fallback to placeholder if thumbnail fails to load
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder.svg';
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredVideos.length === 0 && (
                            <div className="py-8 text-center sm:py-12 lg:py-16">
                                <p className="text-base text-gray-500 sm:text-lg lg:text-xl dark:text-gray-400">No videos available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div
                    className={`fixed inset-0 top-20 z-50 flex items-center justify-center p-4 ${isModalOpen ? 'opacity-100' : 'pointer-events-none opacity-0'} transition-opacity duration-300`}
                >
                    <div className="absolute inset-0 bg-black/90" onClick={() => setIsModalOpen(false)} />
                    <div className="relative z-10 max-h-[90vh] w-full max-w-[95vw] overflow-hidden rounded-lg bg-white p-4 sm:max-h-[85vh] sm:max-w-2xl sm:p-6 md:max-h-[80vh] md:max-w-2xl md:p-6 lg:max-h-[85vh] lg:max-w-lg lg:p-6 dark:bg-[#23232a]">
                        <div className="absolute top-2 right-2 z-20 sm:top-4 sm:right-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:bg-[#282828] dark:hover:bg-[#2d2d35] dark:hover:text-[#e0e0e5]"
                            >
                                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="w-full">
                            <div className="aspect-[9/16] w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-[#2d2d35]">
                                {selectedVideo.instagram_url ? (
                                    <iframe
                                        key={`${selectedVideo.id}-${isModalOpen}`}
                                        src={getDirectVideoEmbed(selectedVideo.instagram_url)}
                                        className="h-full w-full"
                                        frameBorder="0"
                                        allowFullScreen
                                        title="Instagram Video"
                                        style={{
                                            border: 'none',
                                            borderRadius: '8px',
                                            boxShadow: 'none',
                                            margin: '0',
                                            padding: '0',
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <p className="text-gray-500 dark:text-gray-400">Video not available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
