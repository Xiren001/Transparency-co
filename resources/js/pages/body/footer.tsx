'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Instagram, Youtube } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSubscribed(true);
        setIsLoading(false);
        setEmail('');

        // Reset success message after 3 seconds
        setTimeout(() => setIsSubscribed(false), 3000);
    };

    const navigationLinks = [
        { name: 'CERTIFIED PRODUCTS', href: '/certified' },
        { name: 'HOME', href: '/' },
        { name: 'FEATURED', href: '/featured' },
        { name: 'PRODUCT', href: '/products' },
        { name: 'BLOG', href: '/blog' },
        { name: 'CONTACT US', href: '/contact' },
    ];

    const socialLinks = [
        { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/topshelf.america/' },
        {
            name: 'TikTok',
            icon: () => (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
            ),
            href: 'https://www.tiktok.com/@topshelf.america',
        },
        { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
    ];

    return (
        <footer className="w-full rounded-lg">
            {/* Newsletter Section */}
            <section className="relative bg-cover bg-center bg-no-repeat py-16" style={{ backgroundImage: "url('/images/footer-bg.jpg')" }}>
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 rounded-lg bg-white/80"></div>

                <div className="relative z-10 container mx-auto px-4">
                    <div className="mx-auto max-w-md text-center">
                        {/* Newsletter Heading */}
                        <h2 className="mb-3 text-2xl font-light text-gray-900 md:text-3xl">Join Our Newsletter</h2>

                        {/* Newsletter Subtext */}
                        <p className="mb-8 text-sm tracking-wider text-gray-600 uppercase">Subscribe for deals, new products and promotions</p>

                        {/* Newsletter Form */}
                        <form onSubmit={handleSubscribe} className="space-y-4">
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Input
                                    type="email"
                                    placeholder="E-MAIL ADDRESS"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 flex-1 border-gray-300 px-4 text-sm tracking-wider placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading || !email}
                                    className="h-12 bg-gray-900 px-8 text-sm font-medium tracking-wider text-white hover:bg-gray-800"
                                >
                                    {isLoading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                                </Button>
                            </div>

                            {/* Success Message */}
                            {isSubscribed && (
                                <p className="text-sm font-medium text-green-600">Thank you for subscribing! Check your email for confirmation.</p>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            {/* Main Footer */}
            <section className="rounded-lg bg-gray-900 py-12 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-between space-y-6 lg:flex-row lg:space-y-0">
                        {/* Company Name */}
                        <div className="flex items-center">
                            <h3 className="text-xl font-light tracking-wider">Transparency Co</h3>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-wrap items-center justify-center gap-6 lg:gap-8">
                            {navigationLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm tracking-wider text-gray-300 transition-colors duration-200 hover:text-white"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>

                        {/* Social Media Links */}
                        <div className="flex items-center space-x-4">
                            {socialLinks.map((social) => {
                                const IconComponent = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-400 transition-colors duration-200 hover:text-white"
                                        aria-label={social.name}
                                    >
                                        <IconComponent />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-8 border-t border-gray-800 pt-8">
                        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                            {/* Copyright */}
                            <p className="text-xs tracking-wider text-gray-400">
                                COPYRIGHT - {new Date().getFullYear()} TRANSPARENCY CO, ALL RIGHTS RESERVED
                            </p>
                            {/* Legal Links */}
                            <div className="flex items-center space-x-6">
                                <a
                                    href="/privacy-policy"
                                    className="text-xs tracking-wider text-gray-400 transition-colors duration-200 hover:text-white"
                                >
                                    PRIVACY POLICY
                                </a>
                                <a
                                    href="/terms-of-use"
                                    className="text-xs tracking-wider text-gray-400 transition-colors duration-200 hover:text-white"
                                >
                                    TERMS OF USE
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
}
