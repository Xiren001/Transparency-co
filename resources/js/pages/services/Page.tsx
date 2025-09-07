'use client';

import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import Footer from '../body/footer';

export default function Services() {
    return (
        <MainLayout>
            <Head title="Our Services - Transparency Co.">
                <meta name="description" content="Services coming soon - comprehensive transparency solutions for businesses and consumers." />
            </Head>

            <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 starting:opacity-0">
                <main className="z-0 flex w-full max-w-[1000px] flex-col lg:max-w-[2000px] lg:flex-col">
                    {/* Hero Section */}
                    <section className="relative rounded border-b py-16 lg:py-20">
                        <div className="mx-auto max-w-4xl px-4 text-center">
                            <h1 className="font-milk mb-6 text-3xl font-bold tracking-tight text-gray-900 lg:text-5xl dark:text-white">
                                Our Services
                            </h1>
                            <p className="mx-auto max-w-2xl text-base text-gray-600 lg:text-lg dark:text-gray-300">
                                Coming soon - comprehensive transparency services for your business.
                            </p>
                        </div>
                    </section>

                    {/* Services Skeleton Section */}
                    <section className="py-16 lg:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-3xl text-center">
                                <h2 className="font-milk mb-8 text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl dark:text-white">
                                    Services Coming Soon
                                </h2>
                                <p className="text-base text-gray-600 dark:text-gray-300">
                                    We're working on developing comprehensive transparency services for businesses and consumers.
                                </p>
                            </div>

                            {/* Skeleton Cards */}
                            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div key={item} className="rounded-2xl bg-white p-6 shadow-lg lg:p-8 dark:bg-[#282828]">
                                        <div className="mb-4 h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="mb-3 h-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="mb-4 space-y-2">
                                            <div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                                            <div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                                            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                                            <div className="h-3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                                            <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Coming Soon CTA */}
                    <section className="mb-8 rounded bg-gradient-to-r from-pink-300 to-violet-300 py-16 lg:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-4xl text-center text-white">
                                <h2 className="font-milk mb-6 text-2xl font-bold tracking-tight lg:text-3xl">Stay Tuned for Our Services</h2>
                                <p className="mb-8 text-base text-pink-50 lg:text-lg">
                                    We're developing comprehensive transparency services to help businesses and consumers make informed decisions.
                                </p>
                                <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                                    <a
                                        href="/contact"
                                        className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-pink-600 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-300 focus:outline-none lg:text-base"
                                    >
                                        Get Notified When Available
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Footer />
                </main>
            </div>
        </MainLayout>
    );
}
