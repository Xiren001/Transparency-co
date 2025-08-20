import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function HeroSection() {
    return (
        <section className="relative min-h-[400px] w-full rounded-lg border border-gray-200 bg-gray-50 bg-white/80 shadow-sm sm:min-h-[450px] md:min-h-[500px] dark:border-[#23232a] dark:bg-[#282828]">
            {/* No background pattern or overlay for a clean, consistent look */}

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-12 text-center sm:py-16 md:py-20">
                {/* Main Heading */}
                <h1 className="font-milk mb-4 text-2xl font-light tracking-wide text-gray-800 sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl dark:text-white">
                    Find Your Perfect Product
                </h1>

                {/* Subheading */}
                <p className="font-milk mx-auto mb-8 max-w-xs text-sm font-light tracking-wide text-gray-700 sm:mb-10 sm:max-w-md sm:text-base md:mb-12 md:max-w-2xl md:text-lg lg:max-w-3xl lg:text-xl xl:text-2xl dark:text-gray-200">
                    Discover transparent, certified products that meet your standards
                </p>

                {/* Quick Search Suggestions */}
                <div className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8 sm:gap-3">
                    {['Organic', 'Vegan', 'Eco-friendly', 'BPA Free', 'Cruelty-free', 'New products', 'Under $50', 'Food & Beverage'].map((term) => (
                        <button
                            key={term}
                            onClick={() => {
                                // Navigate to home with search parameter
                                const params = new URLSearchParams();
                                params.set('search', term);
                                router.get(
                                    route('home'),
                                    { search: term },
                                    {
                                        onFinish: () => {
                                            setTimeout(() => {
                                                const catalog = document.getElementById('product-catalog-section');
                                                if (catalog) {
                                                    catalog.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }, 500);
                                        },
                                    },
                                );
                            }}
                            className="font-milk border-gray/20 cursor-pointer rounded-full border px-2 py-1 text-xs text-gray-600 uppercase transition-colors hover:bg-white/50 hover:text-gray-800 active:bg-white/70 sm:px-3 sm:py-1.5 sm:text-sm md:px-4 md:py-2 dark:border-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white dark:active:bg-gray-700/50"
                        >
                            {term}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
