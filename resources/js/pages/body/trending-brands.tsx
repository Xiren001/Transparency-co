'use client';

import { useEffect, useRef } from 'react';

const brands = [
    {
        id: 1,
        name: 'logoipsum',
        logo: '/placeholder.svg?height=40&width=120&text=Brand+1',
    },
    {
        id: 2,
        name: 'logoipsum',
        logo: '/placeholder.svg?height=40&width=120&text=Brand+2',
    },
    {
        id: 3,
        name: 'logoipsum',
        logo: '/placeholder.svg?height=40&width=120&text=Brand+3',
    },
    {
        id: 4,
        name: 'logoipsum',
        logo: '/placeholder.svg?height=40&width=120&text=Brand+4',
    },
    {
        id: 5,
        name: 'logoipsum',
        logo: '/placeholder.svg?height=40&width=120&text=Brand+5',
    },
    {
        id: 6,
        name: 'logoipsum',
        logo: '/placeholder.svg?height=40&width=120&text=Brand+6',
    },
];

export default function TrendingBrands() {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationId: number;
        let scrollPosition = 0;
        const scrollSpeed = 1; // pixels per frame

        const animate = () => {
            scrollPosition += scrollSpeed;

            // Reset position when we've scrolled through half the content
            if (scrollPosition >= scrollContainer.scrollWidth / 2) {
                scrollPosition = 0;
            }

            scrollContainer.scrollLeft = scrollPosition;
            animationId = requestAnimationFrame(animate);
        };

        // Start animation
        animationId = requestAnimationFrame(animate);

        // Pause on hover
        const handleMouseEnter = () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };

        const handleMouseLeave = () => {
            animationId = requestAnimationFrame(animate);
        };

        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Create multiple copies for seamless infinite scroll
    const infiniteBrands = [...brands, ...brands, ...brands];

    return (
        <section className="rounded-lg border-gray-100 bg-white py-12 dark:border-[#2d2d35] dark:bg-transparent">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <h2 className="mb-8 text-center text-sm font-medium tracking-[0.2em] text-gray-600 uppercase dark:text-[#b8b8c0]">Trending Brands</h2>

                {/* Brands Container */}
                <div className="relative overflow-hidden">
                    {/* Gradient overlays for smooth edges */}
                    <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent dark:from-[#121212]"></div>
                    <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-20 bg-gradient-to-l from-white to-transparent dark:from-[#121212]"></div>

                    {/* Scrolling brands container */}
                    <div
                        ref={scrollRef}
                        className="flex items-center gap-16 overflow-hidden whitespace-nowrap"
                        style={{
                            scrollBehavior: 'auto',
                            width: '100%',
                        }}
                    >
                        {infiniteBrands.map((brand, index) => (
                            <div
                                key={`${brand.id}-${Math.floor(index / brands.length)}-${index % brands.length}`}
                                className="flex h-16 w-32 flex-shrink-0 cursor-pointer items-center justify-center opacity-60 transition-opacity duration-300 hover:opacity-100"
                            >
                                <img
                                    src={brand.logo || '/placeholder.svg'}
                                    alt={`${brand.name} logo`}
                                    className="max-h-full max-w-full object-contain grayscale filter transition-all duration-300 hover:grayscale-0 dark:brightness-200"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Optional subtitle */}
                <p className="mt-6 text-center text-xs tracking-wide text-gray-500 dark:text-[#b8b8c0]">Trusted by leading brands worldwide</p>
            </div>
        </section>
    );
}
