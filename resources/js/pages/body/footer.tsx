'use client';

import type React from 'react';

import { Facebook, Instagram, Twitter } from 'lucide-react';
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
    ];

    return (
        <footer className="relative rounded-lg bg-white py-16 dark:bg-[#1a1a1f]">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 rounded-lg bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/footer-bg.png')" }}>
                <div className="absolute inset-0 rounded-lg bg-black/20 dark:bg-black/40"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4">
                {/* Newsletter Section */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="mb-4 text-3xl font-light tracking-wide text-gray-900 md:text-4xl dark:text-[#e0e0e5]">Join Our Newsletter</h2>
                    <p className="mb-8 text-sm text-gray-600 dark:text-[#b8b8c0]">
                        Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                    </p>

                    {/* Email Input */}
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="font-milk focus:border-primary focus:ring-primary flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm uppercase focus:ring-1 focus:outline-none dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:placeholder-[#6b6b75]"
                        />
                        <button className="font-milk rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white uppercase transition-colors duration-200 hover:bg-gray-800 dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {/* Company Info */}
                    <div>
                        <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-[#e0e0e5]">Company</h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-[#b8b8c0]">
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-[#e0e0e5]">Customer Service</h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-[#b8b8c0]">
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Shipping Info
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Returns & Exchanges
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-[#e0e0e5]">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-[#b8b8c0]">
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Cookie Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-[#e0e0e5]">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-primary text-gray-600 transition-colors dark:text-[#b8b8c0]">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary text-gray-600 transition-colors dark:text-[#b8b8c0]">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary text-gray-600 transition-colors dark:text-[#b8b8c0]">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-16 border-t border-gray-200 pt-8 text-center text-sm text-gray-600 dark:border-[#2d2d35] dark:text-[#b8b8c0]">
                    <p className="text-l tracking-wider text-black">COPYRIGHT - {new Date().getFullYear()} TRANSPARENCY CO, ALL RIGHTS RESERVED</p>
                </div>
            </div>
        </footer>
    );
}
