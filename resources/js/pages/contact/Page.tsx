'use client';

import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { ArrowRight, CheckCircle, Clock, Mail, MapPin, Phone, Users } from 'lucide-react';
import { useState } from 'react';
import Footer from '../body/footer';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSubmitted(true);
        setIsSubmitting(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <MainLayout>
            <Head title="Contact Us - Transparency Co.">
                <meta
                    name="description"
                    content="Get in touch with Transparency Co. We're here to help with your questions about ethical business practices and our platform."
                />
            </Head>

            <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 dark:bg-transparent starting:opacity-0">
                <main className="z-0 flex w-full max-w-[1000px] flex-col lg:max-w-[2000px] lg:flex-col">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden rounded-[12px] border-b bg-[#ecf0f3] px-4 py-8 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] sm:px-6 sm:py-12 lg:px-8 lg:py-20 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="font-milk mb-3 text-xl font-bold tracking-tight text-gray-900 sm:mb-4 sm:text-2xl lg:text-4xl xl:text-5xl dark:text-white">
                                Contact Us
                            </h1>
                            <p className="mx-auto max-w-2xl text-xs text-gray-600 sm:text-sm lg:text-base xl:text-lg dark:text-gray-300">
                                Have questions about transparency in business? Want to feature your company? We'd love to hear from you.
                            </p>
                        </div>
                    </section>

                    {/* Main Contact Section - Side by Side Layout */}
                    <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-24">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid gap-6 sm:gap-8 lg:grid-cols-5 lg:gap-20">
                                {/* Contact Form - Takes up 3 columns */}
                                <div className="lg:col-span-3">
                                    <div className="overflow-hidden rounded-[12px] bg-[#ecf0f3] p-4 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] sm:p-6 lg:p-8 xl:p-12 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                        <div className="mb-4 sm:mb-6 lg:mb-8">
                                            <h2 className="font-milk mb-2 text-lg font-bold text-gray-900 sm:mb-3 sm:text-xl lg:text-2xl xl:text-3xl dark:text-white">
                                                Send us a message
                                            </h2>
                                            <p className="text-sm text-gray-600 sm:text-base lg:text-lg dark:text-gray-300">
                                                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                                            </p>
                                        </div>

                                        {isSubmitted ? (
                                            <div className="rounded-2xl bg-emerald-50 p-4 text-center sm:p-6 lg:p-8 dark:bg-emerald-950/20">
                                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 sm:mb-4 sm:h-12 sm:w-12 lg:h-16 lg:w-16 dark:bg-emerald-900/30">
                                                    <CheckCircle className="h-5 w-5 text-emerald-500 sm:h-6 sm:w-6 lg:h-8 lg:w-8 dark:text-emerald-400" />
                                                </div>
                                                <h3 className="font-milk mb-2 text-base font-semibold text-emerald-900 sm:text-lg lg:text-xl dark:text-emerald-100">
                                                    Message Sent!
                                                </h3>
                                                <p className="text-xs text-emerald-700 sm:text-sm lg:text-base dark:text-emerald-300">
                                                    Thank you for reaching out. We'll get back to you within 24 hours.
                                                </p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-4 uppercase sm:space-y-6">
                                                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                                    <div>
                                                        <label
                                                            htmlFor="name"
                                                            className="mb-2 block text-sm font-semibold text-gray-700 uppercase dark:text-gray-300"
                                                        >
                                                            Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="name"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full rounded-xl border-none bg-[#ecf0f3] px-3 py-3 text-gray-900 uppercase shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] sm:px-4 sm:py-4 dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"
                                                            placeholder="Your name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor="email"
                                                            className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                        >
                                                            Email
                                                        </label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full rounded-xl border-none bg-[#ecf0f3] px-3 py-3 text-gray-900 uppercase shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] sm:px-4 sm:py-4 dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"
                                                            placeholder="your@email.com"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="subject"
                                                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                    >
                                                        Subject
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="subject"
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full rounded-xl border-none bg-[#ecf0f3] px-3 py-3 text-gray-900 uppercase shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] sm:px-4 sm:py-4 dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"
                                                        placeholder="What's this about?"
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="message"
                                                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                    >
                                                        Message
                                                    </label>
                                                    <textarea
                                                        id="message"
                                                        name="message"
                                                        rows={5}
                                                        value={formData.message}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="sm:rows-6 w-full resize-none rounded-xl border-none bg-[#ecf0f3] px-3 py-3 text-gray-900 uppercase shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] sm:px-4 sm:py-4 dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"
                                                        placeholder="Tell us more about your inquiry..."
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="group flex w-full items-center justify-center overflow-hidden rounded-[12px] bg-[#ecf0f3] px-6 py-3 text-base font-semibold text-gray-900 uppercase shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] transition-all duration-200 hover:shadow-[12px_12px_12px_#d1d9e6,-12px_-12px_12px_#f9f9f9] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-4 sm:text-lg dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526] dark:hover:shadow-[12px_12px_24px_#0e0f10,-12px_-12px_24px_#222526]"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent sm:mr-3 sm:h-5 sm:w-5"></div>
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Send Message
                                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Info Sidebar - Takes up 2 columns */}
                                <div className="lg:col-span-2">
                                    <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-8">
                                        {/* Contact Methods */}
                                        <div className="overflow-hidden rounded-[12px] bg-[#ecf0f3] p-4 text-gray-800 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] sm:p-6 lg:p-8 dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                            <h3 className="font-milk mb-3 text-lg font-bold sm:mb-4 sm:text-xl lg:mb-6 lg:text-2xl">Get in touch</h3>
                                            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                                                <div className="flex items-center space-x-3 sm:space-x-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-none bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] sm:h-12 sm:w-12 dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]">
                                                        <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium sm:text-base">Email us</p>
                                                        <a
                                                            href="mailto:hello@transparencyco.com"
                                                            className="text-sm text-gray-700 hover:text-gray-900 sm:text-base"
                                                        >
                                                            hello@transparencyco.com
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3 sm:space-x-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-none bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] sm:h-12 sm:w-12 dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]">
                                                        <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium sm:text-base">Call us</p>
                                                        <a href="tel:+1-555-0123" className="text-sm text-gray-700 hover:text-gray-900 sm:text-base">
                                                            +1 (555) 012-3456
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3 sm:space-x-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-none bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] sm:h-12 sm:w-12 dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]">
                                                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium sm:text-base">Visit us</p>
                                                        <p className="text-sm text-gray-700 sm:text-base">
                                                            123 Transparency Street
                                                            <br />
                                                            Ethical District, ED 12345
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Business Hours */}
                                        <div className="overflow-hidden rounded-[12px] bg-[#ecf0f3] p-4 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] sm:p-5 lg:p-6 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                            <div className="mb-3 flex items-center space-x-3 sm:mb-4">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-none bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] sm:h-10 sm:w-10 dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]">
                                                    <Clock className="h-4 w-4 text-emerald-600 sm:h-5 sm:w-5 dark:text-emerald-400" />
                                                </div>
                                                <h4 className="font-milk text-sm font-semibold text-gray-900 sm:text-base lg:text-lg dark:text-white">
                                                    Business Hours
                                                </h4>
                                            </div>
                                            <div className="space-y-1.5 text-xs text-gray-600 sm:space-y-2 sm:text-sm dark:text-gray-300">
                                                <div className="flex flex-col justify-between sm:flex-row">
                                                    <span>Monday - Friday</span>
                                                    <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                                                </div>
                                                <div className="flex flex-col justify-between sm:flex-row">
                                                    <span>Saturday</span>
                                                    <span className="font-medium">10:00 AM - 2:00 PM EST</span>
                                                </div>
                                                <div className="flex flex-col justify-between sm:flex-row">
                                                    <span>Sunday</span>
                                                    <span className="font-medium">Closed</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Response Time */}
                                        <div className="overflow-hidden rounded-[12px] bg-[#ecf0f3] p-4 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] sm:p-5 lg:p-6 dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                                            <div className="mb-3 flex items-center space-x-3 sm:mb-4">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-none bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] sm:h-10 sm:w-10 dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]">
                                                    <Users className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5 dark:text-blue-400" />
                                                </div>
                                                <h4 className="font-milk text-sm font-semibold text-gray-900 sm:text-base lg:text-lg dark:text-white">
                                                    Response Time
                                                </h4>
                                            </div>
                                            <p className="text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-gray-300">
                                                We typically respond to all inquiries within 2-4 hours during business hours, and within 24 hours on
                                                weekends.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-24">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="font-milk mb-3 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl xl:text-4xl dark:text-white">
                                Ready to Connect?
                            </h2>
                            <p className="mb-6 text-sm text-gray-600 sm:mb-8 sm:text-base lg:text-lg dark:text-gray-300">
                                We're excited to hear from you and help build a more transparent future together.
                            </p>
                            <div className="flex flex-col justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                                <a
                                    href="mailto:hello@transparencyco.com"
                                    className="inline-flex items-center justify-center overflow-hidden rounded-[12px] bg-[#ecf0f3] px-4 py-3 text-sm font-semibold text-gray-900 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] transition-all duration-200 hover:shadow-[12px_12px_12px_#d1d9e6,-12px_-12px_12px_#f9f9f9] sm:px-6 sm:py-4 sm:text-base lg:px-8 lg:text-lg dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526] dark:hover:shadow-[12px_12px_24px_#0e0f10,-12px_-12px_24px_#222526]"
                                >
                                    <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    Email Us Directly
                                </a>
                                <a
                                    href="/"
                                    className="inline-flex items-center justify-center overflow-hidden rounded-[12px] bg-[#ecf0f3] px-4 py-3 text-sm font-semibold text-gray-900 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] transition-all duration-200 hover:shadow-[12px_12px_12px_#d1d9e6,-12px_-12px_12px_#f9f9f9] sm:px-6 sm:py-4 sm:text-base lg:px-8 lg:text-lg dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526] dark:hover:shadow-[12px_12px_24px_#0e0f10,-12px_-12px_24px_#222526]"
                                >
                                    Explore Platform
                                </a>
                            </div>
                        </div>
                    </section>

                    <Footer />
                </main>
            </div>
        </MainLayout>
    );
}
