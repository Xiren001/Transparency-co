'use client';

import MainLayout from '@/layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import { Award, CheckCircle, Globe, Heart, Shield, Target, TrendingUp, Users } from 'lucide-react';
import Footer from '../body/footer';

interface Stats {
    products_count: number;
    companies_count: number;
    users_count: number;
}

interface PageProps extends Record<string, unknown> {
    stats: Stats;
}

export default function About() {
    const { stats } = usePage<PageProps>().props;

    // Format numbers with K suffix for thousands
    const formatCount = (count: number): string => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K+`.replace('.0', '');
        }
        return count.toString();
    };

    return (
        <MainLayout>
            <Head title="About Us - Transparency Co.">
                <meta
                    name="description"
                    content="Learn about Transparency Co., our mission to promote ethical business practices, and how we help consumers make informed decisions."
                />
            </Head>

            {/* Global Loading Spinner Overlay and Head can be removed from here, now in MainLayout */}
            <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 starting:opacity-0">
                <main className="z-0 flex w-full max-w-[1000px] flex-col lg:max-w-[2000px] lg:flex-col">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden rounded-[12px] bg-[#ecf0f3] p-8 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] lg:p-12 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                        <div className="mx-auto max-w-4xl px-4 text-center">
                            <h1 className="font-milk mb-6 text-3xl font-bold tracking-tight text-gray-900 lg:text-5xl dark:text-white">
                                About Transparency Co.
                            </h1>
                            <p className="mx-auto max-w-2xl text-base text-gray-600 lg:text-lg dark:text-gray-300">
                                Empowering consumers with transparency, trust, and truth in every business interaction.
                            </p>
                        </div>
                    </section>

                    {/* The Face of Your Business */}
                    <section className="py-16 lg:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                                <div className="flex items-center">
                                    <div className="space-y-6">
                                        <div className="inline-flex items-center overflow-hidden rounded-[12px] bg-[#ecf0f3] px-3 py-1 text-sm font-medium text-gray-700 shadow-[5px_5px_5px_#d1d9e6,-5px_-5px_5px_#f9f9f9] dark:bg-[#181a1b] dark:text-gray-300 dark:shadow-[5px_5px_10px_#0e0f10,-5px_-5px_10px_#222526]">
                                            <Target className="mr-2 h-4 w-4" />
                                            Our Mission
                                        </div>
                                        <h2 className="font-milk text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl dark:text-white">
                                            The Face of Your Business
                                        </h2>
                                        <p className="text-base text-gray-600 dark:text-gray-300">
                                            We believe that every business should wear its values on its sleeve. Transparency Co. is the bridge
                                            between ethical businesses and conscious consumers, creating a marketplace where honesty isn't just a
                                            policy—it's the foundation of every transaction.
                                        </p>
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-400" />
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    We verify and showcase businesses that prioritize ethical practices, sustainability, and consumer
                                                    welfare.
                                                </p>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-400" />
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    Our platform serves as a trusted directory for consumers seeking authentic, responsible companies.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="aspect-square overflow-hidden rounded-[12px] bg-[#ecf0f3] p-4 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                        <img
                                            src="/images/website-image/gg.png"
                                            alt="Transparency Co. - Building Trust Through Transparency"
                                            className="h-full w-full rounded-[8px] object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How You Operate */}
                    <section className="py-16 lg:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-3xl text-center">
                                <h2 className="font-milk mb-8 text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl dark:text-white">
                                    How We Operate
                                </h2>
                                <p className="text-base text-gray-600 dark:text-gray-300">
                                    Our operation is built on three core pillars that ensure we deliver on our promise of transparency and trust.
                                </p>
                            </div>

                            <div className="mt-16 grid gap-8 md:grid-cols-3">
                                <div className="overflow-hidden rounded-[12px] bg-[#ecf0f3] p-6 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] lg:p-8 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-[12px] bg-[#ecf0f3] shadow-[5px_5px_5px_#d1d9e6,-5px_-5px_5px_#f9f9f9] dark:bg-[#181a1b] dark:shadow-[5px_5px_10px_#0e0f10,-5px_-5px_10px_#222526]">
                                        <Shield className="h-6 w-6 text-sky-500 dark:text-sky-400" />
                                    </div>
                                    <h3 className="font-milk mb-3 text-lg font-semibold text-gray-900 lg:text-xl dark:text-white">
                                        Verification & Validation
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        We thoroughly vet every business, product, and certification to ensure they meet our strict ethical standards
                                        before featuring them on our platform.
                                    </p>
                                </div>

                                <div className="overflow-hidden rounded-[12px] bg-[#ecf0f3] p-6 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] lg:p-8 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-[12px] bg-[#ecf0f3] shadow-[5px_5px_5px_#d1d9e6,-5px_-5px_5px_#f9f9f9] dark:bg-[#181a1b] dark:shadow-[5px_5px_10px_#0e0f10,-5px_-5px_10px_#222526]">
                                        <Globe className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="font-milk mb-3 text-lg font-semibold text-gray-900 lg:text-xl dark:text-white">
                                        Global Standards
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        We maintain consistent quality standards across all markets, ensuring that consumers worldwide can trust the
                                        information we provide.
                                    </p>
                                </div>

                                <div className="overflow-hidden rounded-[12px] bg-[#ecf0f3] p-6 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] lg:p-8 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-[12px] bg-[#ecf0f3] shadow-[5px_5px_5px_#d1d9e6,-5px_-5px_5px_#f9f9f9] dark:bg-[#181a1b] dark:shadow-[5px_5px_10px_#0e0f10,-5px_-5px_10px_#222526]">
                                        <TrendingUp className="h-6 w-6 text-violet-500 dark:text-violet-400" />
                                    </div>
                                    <h3 className="font-milk mb-3 text-lg font-semibold text-gray-900 lg:text-xl dark:text-white">
                                        Continuous Improvement
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        We constantly evolve our processes and standards to stay ahead of emerging ethical challenges and consumer
                                        needs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Who You Serve */}
                    <section className="py-16 lg:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                                <div className="relative order-2 lg:order-1">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-8">
                                            <div className="overflow-hidden rounded-[12px] bg-[#ecf0f3] p-4 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] lg:p-6 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                                <Users className="mb-3 h-6 w-6 text-sky-500 lg:h-8 lg:w-8 dark:text-sky-400" />
                                                <h4 className="font-milk text-base font-semibold text-gray-900 lg:text-lg dark:text-white">
                                                    Conscious Consumers
                                                </h4>
                                                <p className="text-xs text-gray-600 lg:text-sm dark:text-gray-300">
                                                    People who value ethical choices and want to support responsible businesses.
                                                </p>
                                            </div>
                                            <div className="overflow-hidden rounded-[12px] bg-[#ecf0f3] p-4 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] lg:p-6 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                                <Award className="mb-3 h-6 w-6 text-emerald-500 lg:h-8 lg:w-8 dark:text-emerald-400" />
                                                <h4 className="font-milk text-base font-semibold text-gray-900 lg:text-lg dark:text-white">
                                                    Ethical Businesses
                                                </h4>
                                                <p className="text-xs text-gray-600 lg:text-sm dark:text-gray-300">
                                                    Companies committed to transparency and sustainable practices.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-8 pt-8">
                                            <div className="overflow-hidden rounded-[12px] bg-[#ecf0f3] p-4 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] lg:p-6 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                                <Heart className="mb-3 h-6 w-6 text-pink-500 lg:h-8 lg:w-8 dark:text-pink-400" />
                                                <h4 className="font-milk text-base font-semibold text-gray-900 lg:text-lg dark:text-white">
                                                    Health-Conscious
                                                </h4>
                                                <p className="text-xs text-gray-600 lg:text-sm dark:text-gray-300">
                                                    Individuals prioritizing wellness and safe, quality products.
                                                </p>
                                            </div>
                                            <div className="overflow-hidden rounded-[12px] bg-[#ecf0f3] p-4 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] lg:p-6 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                                <Shield className="mb-3 h-6 w-6 text-amber-500 lg:h-8 lg:w-8 dark:text-amber-400" />
                                                <h4 className="font-milk text-base font-semibold text-gray-900 lg:text-lg dark:text-white">
                                                    Advocates
                                                </h4>
                                                <p className="text-xs text-gray-600 lg:text-sm dark:text-gray-300">
                                                    Activists and organizations promoting consumer rights and safety.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="order-1 flex items-center lg:order-2">
                                    <div className="space-y-6">
                                        <div className="inline-flex items-center overflow-hidden rounded-[12px] bg-[#ecf0f3] px-3 py-1 text-sm font-medium text-gray-700 shadow-[5px_5px_5px_#d1d9e6,-5px_-5px_5px_#f9f9f9] dark:bg-[#181a1b] dark:text-gray-300 dark:shadow-[5px_5px_10px_#0e0f10,-5px_-5px_10px_#222526]">
                                            <Users className="mr-2 h-4 w-4" />
                                            Our Community
                                        </div>
                                        <h2 className="font-milk text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl dark:text-white">
                                            Who We Serve
                                        </h2>
                                        <p className="text-base text-gray-600 dark:text-gray-300">
                                            Our platform serves a diverse community of individuals and organizations who share our commitment to
                                            transparency, ethics, and informed decision-making.
                                        </p>
                                        <p className="text-base text-gray-600 dark:text-gray-300">
                                            Whether you're a consumer looking for trustworthy products, a business wanting to showcase your ethical
                                            practices, or an advocate working to improve industry standards, we're here to support your journey.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Your Brand Story */}
                    <section className="bg-lavender-50 dark:bg-lavender-950/20 py-16 lg:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-4xl text-center">
                                <h2 className="font-milk mb-8 text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl dark:text-white">
                                    Our Brand Story
                                </h2>
                                <div className="prose prose-lg mx-auto text-gray-600 dark:text-gray-300">
                                    <p className="mb-6">
                                        Transparency Co. was born from a simple yet powerful observation: consumers deserve to know what they're
                                        buying, and businesses deserve to be recognized for their ethical choices.
                                    </p>
                                    <p className="mb-6">
                                        Founded in 2024, we started as a small team of consumer advocates, business professionals, and technology
                                        experts who believed that the marketplace could be both profitable and principled. We saw too many consumers
                                        making purchases based on incomplete information, and too many ethical businesses struggling to stand out in a
                                        crowded market.
                                    </p>
                                    <p className="mb-6">
                                        Today, we're proud to serve as the bridge between conscious consumers and responsible businesses. Our platform
                                        has grown from a simple directory to a comprehensive ecosystem that includes product verification, company
                                        profiles, educational content, and community engagement.
                                    </p>
                                    <p>
                                        Our story is still being written, and we invite you to be part of it. Together, we can build a marketplace
                                        where transparency isn't just a buzzword—it's the standard by which all business is conducted.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Persuasive Content */}
                    <section className="py-16 lg:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="overflow-hidden rounded-[12px] bg-[#ecf0f3] p-6 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] lg:p-12 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                <div className="mx-auto max-w-4xl text-center">
                                    <h2 className="font-milk mb-6 text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl dark:text-white">
                                        Join the Transparency Movement
                                    </h2>
                                    <p className="mb-8 text-base text-gray-600 lg:text-lg dark:text-gray-300">
                                        Every time you choose a transparent business, you're voting with your wallet for a better marketplace. Every
                                        time you share our platform, you're helping others make informed decisions.
                                    </p>

                                    <div className="grid gap-6 md:grid-cols-3">
                                        <div className="text-center">
                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-[12px] bg-[#ecf0f3] shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] lg:h-16 lg:w-16 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                                <span className="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">
                                                    {formatCount(stats.products_count)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 lg:text-sm dark:text-gray-300">Products Verified</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-[12px] bg-[#ecf0f3] shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] lg:h-16 lg:w-16 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                                <span className="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">
                                                    {formatCount(stats.companies_count)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 lg:text-sm dark:text-gray-300">Businesses Featured</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-[12px] bg-[#ecf0f3] shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] lg:h-16 lg:w-16 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                                <span className="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">
                                                    {formatCount(stats.users_count)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 lg:text-sm dark:text-gray-300">Consumers Served</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                                        <a
                                            href="/"
                                            className="inline-flex items-center justify-center overflow-hidden rounded-[12px] bg-gradient-to-r from-pink-400 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-[8px_8px_8px_#d1d9e6,-8px_-8px_8px_#f9f9f9] transition-all hover:from-pink-500 hover:to-pink-600 hover:shadow-[6px_6px_6px_#d1d9e6,-6px_-6px_6px_#f9f9f9] focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 focus:outline-none dark:shadow-[8px_8px_16px_#0e0f10,-8px_-8px_16px_#222526] dark:hover:shadow-[6px_6px_12px_#0e0f10,-6px_-6px_12px_#222526]"
                                        >
                                            Explore Products
                                        </a>
                                        <a
                                            href="/contact"
                                            className="inline-flex items-center justify-center overflow-hidden rounded-[12px] border border-[#ecf0f3] bg-transparent px-6 py-3 text-sm font-semibold text-gray-700 shadow-[5px_5px_5px_#d1d9e6,-5px_-5px_5px_#f9f9f9] transition-colors hover:bg-[#ecf0f3] hover:shadow-[3px_3px_3px_#d1d9e6,-3px_-3px_3px_#f9f9f9] focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none dark:border-[#181a1b] dark:bg-transparent dark:text-gray-300 dark:shadow-[5px_5px_10px_#0e0f10,-5px_-5px_10px_#222526] dark:hover:bg-[#181a1b] dark:hover:shadow-[3px_3px_6px_#0e0f10,-3px_-3px_6px_#222526]"
                                        >
                                            Get in Touch
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="py-16">
                        <div className="mx-auto max-w-4xl px-4 text-center">
                            <h2 className="font-milk mb-4 text-xl font-bold text-gray-900 lg:text-2xl dark:text-white">
                                Ready to Make Informed Choices?
                            </h2>
                            <p className="mb-8 text-base text-gray-600 lg:text-lg dark:text-gray-300">
                                Start exploring our verified products and companies today. Your journey toward transparency starts here.
                            </p>
                            <a
                                href="/"
                                className="inline-flex items-center justify-center overflow-hidden rounded-[12px] bg-[#ecf0f3] px-8 py-3 text-sm font-semibold text-gray-700 shadow-[5px_5px_5px_#d1d9e6,-5px_-5px_5px_#f9f9f9] transition-colors hover:shadow-[3px_3px_3px_#d1d9e6,-3px_-3px_3px_#f9f9f9] focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none lg:text-base dark:bg-[#181a1b] dark:text-gray-300 dark:shadow-[5px_5px_10px_#0e0f10,-5px_-5px_10px_#222526] dark:hover:shadow-[3px_3px_6px_#0e0f10,-3px_-3px_6px_#222526]"
                            >
                                Start Exploring
                            </a>
                        </div>
                    </section>

                    <Footer />
                </main>
            </div>
        </MainLayout>
    );
}
