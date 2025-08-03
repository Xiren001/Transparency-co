import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

import { Bell, Calendar, Home, Mail, MessageSquare, Settings, User } from 'lucide-react';
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

const navIconMap: Record<string, any> = {
    Home: Home,
    'My Profile': User,
    'My Vacancy': Calendar,
    Message: MessageSquare,
    Subscription: Mail,
    Notification: Bell,
    Setting: Settings,
};

export default function Welcome() {
    const { auth, products } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
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

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleNavigation = (href: string) => {
        // You can replace this with your routing solution (React Router, etc.)
        window.location.href = href;
    };

    const { csrf_token } = usePage().props;
    // added part

    return (
        <MainLayout>
            {/* Global Loading Spinner Overlay and Head can be removed from here, now in MainLayout */}
            <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 starting:opacity-0">
                <main className="flex w-full max-w-[1000px] flex-col gap-4 lg:max-w-[2000px] lg:flex-col">
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
