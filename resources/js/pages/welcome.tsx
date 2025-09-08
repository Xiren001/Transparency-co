import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

import * as React from 'react';

import MainLayout from '@/layouts/MainLayout';
import CategoriesSection from './body/categories-section';
import Footer from './body/footer';
import HeroSection from './body/hero-section';
import TrendingBrands from './body/trending-brands';
import ProductCatalog from './Products/product-catalog';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
    { name: 'Learn', href: '/certifications' },
];

export default function Welcome() {
    const { auth, products } = usePage<SharedData>().props;
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // If already loaded (e.g. from bfcache or very fast), hide spinner immediately
        if (document.readyState === 'complete') {
            setLoading(false);
            return;
        }
        const handleLoad = () => setLoading(false);
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
    }, []);

    const { csrf_token } = usePage().props;
    // added part

    return (
        <MainLayout>
            {/* Global Loading Spinner Overlay and Head can be removed from here, now in MainLayout */}
            <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 starting:opacity-0">
                {/* Background Decorative Circles */}
                <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                    {/* Massive Circle - Top Right (half in middle, half outside) */}
                    <div className="absolute top-16 right-1/4 h-64 w-64 rounded-full border-none bg-[#ecf0f3] opacity-20 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"></div>

                    {/* Large Circle - Center Left (half in middle, half outside) */}
                    <div className="absolute top-1/2 left-1/4 h-48 w-48 rounded-full border-none bg-[#ecf0f3] opacity-25 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"></div>

                    {/* Extra Large Circle - Bottom Right (half in middle, half outside) */}
                    <div className="absolute right-1/4 bottom-16 h-56 w-56 rounded-full border-none bg-[#ecf0f3] opacity-30 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"></div>

                    {/* Huge Circle - Top Left (half in middle, half outside) */}
                    <div className="absolute top-20 left-1/4 h-80 w-80 rounded-full border-none bg-[#ecf0f3] opacity-15 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"></div>

                    {/* Large Circle - Center Right (half in middle, half outside) */}
                    <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full border-none bg-[#ecf0f3] opacity-35 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"></div>

                    {/* Medium Circle - Bottom Left (half in middle, half outside) */}
                    <div className="absolute bottom-20 left-1/4 h-32 w-32 rounded-full border-none bg-[#ecf0f3] opacity-40 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"></div>

                    {/* Additional Circle - Top Center (half in middle, half outside) */}
                    <div className="absolute top-10 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full border-none bg-[#ecf0f3] opacity-20 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"></div>

                    {/* Additional Circle - Bottom Center (half in middle, half outside) */}
                    <div className="absolute bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full border-none bg-[#ecf0f3] opacity-25 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"></div>

                    {/* Additional Circle - Left Center (half in middle, half outside) */}
                    <div className="absolute top-1/4 left-1/4 h-36 w-36 rounded-full border-none bg-[#ecf0f3] opacity-30 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"></div>

                    {/* Additional Circle - Right Center (half in middle, half outside) */}
                    <div className="absolute top-2/3 right-1/4 h-28 w-28 rounded-full border-none bg-[#ecf0f3] opacity-35 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"></div>
                </div>

                <main className="z-0 flex w-full max-w-[1000px] flex-col lg:max-w-[2000px] lg:flex-col">
                    <HeroSection />

                    {/* <FeaturedSection /> */}

                    <CategoriesSection />
                    <div className="product-catalog-section" id="product-catalog-section">
                        <ProductCatalog
                            products={
                                products ?? {
                                    data: [],
                                    links: [],
                                    current_page: 1,
                                    last_page: 1,
                                    from: null,
                                    to: null,
                                    total: 0,
                                    prev_page_url: null,
                                    next_page_url: null,
                                }
                            }
                            filters={{
                                certificates: [],
                                price_range: '',
                                sort_by: '',
                            }}
                        />
                    </div>
                    <TrendingBrands />
                    <Footer />
                    {/* <Laravel12Default /> */}
                </main>
            </div>
        </MainLayout>
    );
}
