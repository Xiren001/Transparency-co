'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Baby, Droplets, Heart, Home, Leaf, Shirt, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
// Remove or comment out the Tabs import (since it does not exist)
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import separated components with correct paths
import MainLayout from '@/layouts/MainLayout';
import Footer from '../body/footer';
import HarmfulIngredientsSection from './harmful-ingredients-section';
import VideoSection from './video-section';

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

// Sample data for certifications
const certifications = [
    // Food & Beverage
    {
        id: 1,
        name: 'USDA Organic',
        fullName: 'USDA Organic Certification',
        category: 'food',
        logo: '/placeholder.svg', // Replace with actual logo path
        issuingOrg: 'U.S. Department of Agriculture',
        description:
            'USDA Organic means the product was produced without synthetic fertilizers, sewage sludge, irradiation, and genetic engineering.',
        standards: [
            '🌿 No synthetic pesticides or fertilizers',
            '🧬 No genetically modified organisms (GMOs)',
            '🚫 No irradiation or sewage sludge',
            '🌱 Emphasis on soil and water conservation',
            '📋 Annual on-site inspections',
            '🐄 Humane treatment of animals',
        ],
        verification: 'Certified by third-party organizations accredited by the USDA through annual inspections and compliance reviews.',
        whyItMatters:
            'Ensures that food is grown and processed according to strict environmental and animal welfare standards, supporting health, sustainability, and transparency.',
        brands: ['Organic Valley', "Amy's Kitchen", 'Stonyfield'],
        learnMore: 'https://www.usda.gov/topics/organic',
        verifiedDate: '2024-01-15',
    },
    {
        id: 1,
        name: 'NON-GMO',
        fullName: 'Non-GMO Project Verified',
        category: 'food',
        logo: '/placeholder.svg', // Replace with real path to logo
        issuingOrg: 'Non-GMO Project',
        description:
            'The Non-GMO Project Verified seal indicates a product has been produced in compliance with rigorous best practices for GMO avoidance, including ongoing testing of risk ingredients.',
        standards: [
            '🧬 Ongoing testing of major GMO risk ingredients',
            '📋 Traceability and segregation practices throughout supply chain',
            '🔍 Rigorous review process by independent technical administrators',
            '📅 Annual renewal and inspection',
        ],
        verification: 'Third-party technical administrators review documentation, conduct audits, and oversee annual renewal requirements.',
        whyItMatters:
            'Empowers consumers to make informed choices and supports a transparent, sustainable food system free from genetically engineered ingredients.',
        brands: ["Nature's Path", "Annie's Homegrown", 'Lundberg Family Farms'],
        learnMore: 'https://www.nongmoproject.org/product-verification/',
        verifiedDate: '2024-01-15',
    },
    {
        id: 3,
        name: 'Plastic Free',
        fullName: 'Plastic Free Certification',
        category: 'food',
        logo: '/placeholder.svg', // Replace with actual logo path
        issuingOrg: 'A Plastic Planet & Control Union',
        description:
            'Plastic Free Certification is a globally recognized standard for products and packaging that are free from conventional plastics derived from fossil fuels.',
        standards: [
            '🚫 No conventional plastic derived from fossil fuels',
            '♻️ Compostable or recyclable materials preferred',
            '🔬 Laboratory material analysis for plastic content',
            '🧾 Full supply chain transparency required',
        ],
        verification: 'Conducted by Control Union, including material testing, supplier documentation checks, and on-site audits.',
        whyItMatters: 'Supports the reduction of plastic pollution and promotes truly sustainable alternatives to single-use and microplastics.',
        brands: ['Teapigs', 'Notpla', 'Pukka Herbs'],
        learnMore: 'https://www.plasticfree.org/certification/',
        verifiedDate: '2024-01-15',
    },
    {
        id: 4,
        name: 'Heavy Metal Free',
        fullName: 'Heavy Metal Free Claim (as verified by MADE SAFE® or equivalent)',
        category: 'food',
        logo: '/placeholder.svg',
        issuingOrg: 'MADE SAFE® / Third-party laboratories',
        description:
            'Indicates that a product is free from toxic heavy metals like lead, cadmium, arsenic, and mercury which can accumulate in the body and pose long-term health risks.',
        standards: [
            '🔬 Ingredient-level testing for lead, arsenic, cadmium, mercury, and more',
            '📋 Must meet strict contamination thresholds',
            '❌ No use of synthetic colorants or additives known to contain heavy metals',
            '📦 Packaging evaluated for contamination risk',
        ],
        verification: 'Lab testing using methods like ICP-MS; verified by MADE SAFE or certified testing partners.',
        whyItMatters: 'Avoids long-term health hazards such as neurological damage, developmental disorders, and organ toxicity.',
        brands: ['Beautycounter', 'Annmarie Skin Care', 'Naturepedic'],
        learnMore: 'https://www.madetosafecosmetics.org/personal-care/metal-free/',
        verifiedDate: '2024-01-15',
    },
    {
        id: 5,
        name: 'Kosher',
        fullName: 'Kosher Certification (OU)',
        category: 'food',
        logo: '/placeholder.svg',
        issuingOrg: 'Orthodox Union (OU)',
        description:
            'Kosher certification ensures that food products comply with Jewish dietary laws, including ingredient sourcing, preparation, and processing methods.',
        standards: [
            '🔍 Ingredient and source material verification',
            '🍽️ Separation of meat and dairy',
            '📋 Kosher handling procedures and cleaning protocols',
            '👨‍⚖️ Supervision by a qualified rabbinic field representative',
        ],
        verification: 'Ongoing supervision, audits, and inspections by a Rabbinic Coordinator and field representatives.',
        whyItMatters:
            'Meets religious dietary standards, ensures transparency in food processing, and is increasingly seen as a marker of cleanliness and quality.',
        brands: ['Nestlé', 'Coca-Cola (select products)', 'Manischewitz'],
        learnMore: 'https://oukosher.org/companies/the-kosher-certification-process/',
        verifiedDate: '2024-01-15',
    },
    {
        id: 6,
        name: 'Halal',
        fullName: 'Halal Certification',
        category: 'food',
        logo: '/placeholder.svg',
        issuingOrg: 'Islamic Da’wah Council of the Philippines (IDCP) / Other global halal bodies',
        description:
            'Halal certification ensures that a product and its production comply with Islamic dietary laws and Shariah requirements, including sourcing, slaughter, preparation, and cleanliness.',
        standards: [
            '🐄 Animals must be slaughtered according to Islamic law',
            '🚫 No pork, alcohol, or other Haram ingredients',
            '🧼 Utmost cleanliness during preparation and packaging',
            '📋 Documentation and traceability required',
        ],
        verification: 'Site inspection, raw material approval, production line audits, and certification by a recognized halal authority.',
        whyItMatters: 'Gives assurance to Muslim consumers and ensures ethical and hygienic production practices.',
        brands: ['Nestlé (selected lines)', 'Sadia', 'Al Islami Foods'],
        learnMore: 'https://halalcertification.ph/halal-certification-process/',
        verifiedDate: '2024-01-15',
    },
    {
        id: 7,
        name: 'Vegan',
        fullName: 'Certified Vegan',
        category: 'food',
        logo: '/placeholder.svg',
        issuingOrg: 'Vegan Awareness Foundation (Vegan Action)',
        description:
            'Certified Vegan products contain no animal ingredients or by-products and have not been tested on animals, making them fully cruelty-free.',
        standards: [
            '🌱 No animal products or by-products',
            '🐰 No animal testing on finished products or ingredients',
            '❌ No cross-contamination during manufacturing',
            '📋 Supply chain verification for all ingredients',
        ],
        verification: 'Document review and manufacturer agreement with periodic compliance checks by Vegan Action.',
        whyItMatters: 'Supports ethical consumption, animal welfare, and aligns with plant-based lifestyle values.',
        brands: ['Follow Your Heart', "Miyoko's Creamery", 'Derma E'],
        learnMore: 'https://vegan.org/certification/',
        verifiedDate: '2024-01-15',
    },
    {
        id: 8,
        name: 'Gluten-Free',
        fullName: 'Gluten-Free Certification Organization (GFCO)',
        category: 'food',
        logo: '/placeholder.svg',
        issuingOrg: 'Gluten-Free Certification Organization (program of GIG)',
        description: 'GFCO certifies that foods contain 10 ppm or less of gluten—stricter than FDA’s 20 ppm threshold.',
        standards: [
            '✅ Finished product & all ingredients ≤ 10 ppm gluten',
            '❌ No barley-based ingredients allowed',
            '🧪 Rigorous ingredient testing & manufacturing line audits',
            '📋 Annual audits & ongoing sampling',
        ],
        verification: 'ISO‑accredited audits, regular testing, and annual plant inspections by GFCO/GIG :contentReference[oaicite:1]{index=1}',
        whyItMatters: 'Provides stronger protection for people with celiac or gluten sensitivities beyond standard FDA labeling.',
        brands: ['Enjoy Life Foods', "Bob's Red Mill Selects", 'Udi’s'],
        learnMore: 'https://gfco.org/',
        verifiedDate: '2024-04-06',
    },

    // Health & Wellness
    {},
    // Personal Care
    {},
    // Home Cleaning
    {},
    // Kitchen Essentials
    {},
    // Baby & Kids
    {},
    // Clothing
    {},
    // Pet Care
    {},
    // Home Textiles
    {},
    // Air Purifiers
    {},
    // Water Filters
    {},
    // Office Supplies
    {},
    // Beauty & Cosmetics
    {},
];

// Sample data for harmful ingredients/practices
const harmfulItems = [
    {
        id: 1,
        name: 'Parabens',
        category: 'personal',
        riskSummary: 'Potential hormone disruptors that may interfere with reproductive systems.',
        studyLink: 'https://example.com/paraben-study',
        alternatives: ['Natural preservatives', 'Phenoxyethanol', 'Benzyl alcohol'],
        severity: 'moderate',
    },
    {
        id: 2,
        name: 'Sulfates (SLS/SLES)',
        category: 'personal',
        riskSummary: 'Can cause skin irritation and strip natural oils from skin and hair.',
        studyLink: 'https://example.com/sulfate-study',
        alternatives: ['Coconut-based cleansers', 'Decyl glucoside', 'Coco-betaine'],
        severity: 'low',
    },
    {
        id: 3,
        name: 'High Fructose Corn Syrup',
        category: 'food',
        riskSummary: 'Linked to obesity, diabetes, and metabolic disorders when consumed regularly.',
        studyLink: 'https://example.com/hfcs-study',
        alternatives: ['Raw honey', 'Maple syrup', 'Stevia', 'Fresh fruits'],
        severity: 'high',
    },
    {
        id: 4,
        name: 'Formaldehyde',
        category: 'textiles',
        riskSummary: 'Known carcinogen that can cause skin irritation and respiratory issues.',
        studyLink: 'https://example.com/formaldehyde-study',
        alternatives: ['GOTS certified textiles', 'Organic cotton', 'Natural dyes'],
        severity: 'high',
    },
    {
        id: 5,
        name: 'Ammonia',
        category: 'cleaning',
        riskSummary: 'Can cause respiratory irritation and burns to skin and eyes.',
        studyLink: 'https://example.com/ammonia-study',
        alternatives: ['White vinegar', 'Baking soda', 'Castile soap', 'Lemon juice'],
        severity: 'moderate',
    },
    {
        id: 6,
        name: 'BPA (Bisphenol A)',
        category: 'baby',
        riskSummary: 'Hormone disruptor that can affect brain development and behavior in children.',
        studyLink: 'https://example.com/bpa-study',
        alternatives: ['Glass bottles', 'Stainless steel', 'BPA-free plastics', 'Silicone'],
        severity: 'high',
    },
    {
        id: 7,
        name: 'Phthalates',
        category: 'beauty',
        riskSummary: 'Endocrine disruptors linked to reproductive and developmental issues.',
        studyLink: 'https://example.com/phthalates-study',
        alternatives: ['Phthalate-free fragrances', 'Essential oils', 'Natural cosmetics'],
        severity: 'high',
    },
];

const categories = [
    { id: 'food', name: 'Food & Beverage', icon: Leaf, color: 'bg-green-100 text-green-700' },
    { id: 'health', name: 'Health & Wellness', icon: Heart, color: 'bg-pink-100 text-pink-700' },
    { id: 'personal', name: 'Personal Care', icon: Heart, color: 'bg-pink-100 text-pink-700' },
    { id: 'cleaning', name: 'Home Cleaning', icon: Home, color: 'bg-purple-100 text-purple-700' },
    { id: 'kitchen', name: 'Kitchen Essentials', icon: Home, color: 'bg-orange-100 text-orange-700' },
    { id: 'baby', name: 'Baby & Kids', icon: Baby, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'clothing', name: 'Clothing', icon: Shirt, color: 'bg-blue-100 text-blue-700' },
    { id: 'pet', name: 'Pet Care', icon: Heart, color: 'bg-gray-100 text-gray-700' },
    { id: 'textiles', name: 'Home Textiles', icon: Shirt, color: 'bg-blue-100 text-blue-700' },
    { id: 'air', name: 'Air Purifiers', icon: Droplets, color: 'bg-cyan-100 text-cyan-700' },
    { id: 'water', name: 'Water Filters', icon: Droplets, color: 'bg-cyan-100 text-cyan-700' },
    { id: 'office', name: 'Office Supplies', icon: Home, color: 'bg-gray-100 text-gray-700' },
    { id: 'beauty', name: 'Beauty & Cosmetics', icon: Sparkles, color: 'bg-indigo-100 text-indigo-700' },
];

export default function CertificationLearningPage() {
    const [activeTab, setActiveTab] = useState('certifications');
    const [selectedCert, setSelectedCert] = useState<(typeof certifications)[number] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [carouselStates, setCarouselStates] = useState<Record<string, number>>({});

    // Group certifications by category (typed)
    const groupedCertifications = useMemo(() => {
        const groups: Record<string, typeof certifications> = {};
        certifications.forEach((cert) => {
            if (!groups[cert.category]) groups[cert.category] = [];
            groups[cert.category].push(cert);
        });
        return groups;
    }, []);

    // Get all harmful items (no filtering needed)
    const harmfulItemsToShow = harmfulItems;

    const navigateCarousel = (categoryId: string, direction: 'prev' | 'next') => {
        const certs = groupedCertifications[categoryId];
        if (!certs) return;

        const currentIndex = carouselStates[categoryId] || 0;
        const totalItems = certs.length;

        let newIndex;
        if (direction === 'prev') {
            newIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
        } else {
            newIndex = currentIndex === totalItems - 1 ? 0 : currentIndex + 1;
        }

        setCarouselStates((prev) => ({
            ...prev,
            [categoryId]: newIndex,
        }));
    };

    const goToSlide = (categoryId: string, index: number) => {
        setCarouselStates((prev) => ({
            ...prev,
            [categoryId]: index,
        }));
    };

    const openModal = (cert: (typeof certifications)[number]) => {
        setSelectedCert(cert);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCert(null);
    };

    return (
        <MainLayout>
            {/* Hero Section - aligned with body/hero-section.tsx */}
            <section className="relative min-h-[200px] w-full rounded-lg border border-gray-200 bg-white shadow-sm sm:min-h-[250px] md:min-h-[300px] dark:border-[#2d2d35] dark:bg-[#1a1a1f]">
                <div className="relative z-10 container mx-auto items-center justify-center px-4 py-6 text-center sm:py-8 md:py-10 lg:py-12">
                    <h1 className="font-milk mb-4 text-lg font-light tracking-wide text-gray-900 sm:mb-6 sm:text-xl md:mb-8 md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl dark:text-[#e0e0e5]">
                        Learn About Certifications That Matter
                    </h1>

                    <p className="mx-auto mb-6 max-w-2xl text-sm text-gray-600 sm:mb-8 sm:text-base md:text-lg lg:text-xl dark:text-gray-400">
                        Discover trusted certifications that ensure product safety and quality, and learn about harmful ingredients to avoid in your
                        daily choices.
                    </p>

                    {/* Tab Navigation - aligned with body patterns */}
                    <div className="mx-auto mb-4 flex flex-col justify-center gap-2 sm:mb-6 sm:flex-row">
                        <button
                            className={`rounded-lg px-3 py-2 text-xs font-medium uppercase transition-colors sm:px-4 sm:text-sm ${
                                activeTab === 'certifications'
                                    ? 'bg-primary dark:bg-primary text-white shadow-sm dark:text-black'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]'
                            }`}
                            onClick={() => setActiveTab('certifications')}
                            disabled={activeTab === 'certifications'}
                        >
                            Trusted Certifications
                        </button>
                        <button
                            className={`rounded-lg px-3 py-2 text-xs font-medium uppercase transition-colors sm:px-4 sm:text-sm ${
                                activeTab === 'avoid'
                                    ? 'bg-primary dark:bg-primary text-white shadow-sm dark:text-black'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]'
                            }`}
                            onClick={() => setActiveTab('avoid')}
                            disabled={activeTab === 'avoid'}
                        >
                            What to Avoid
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content - aligned with body/featured-section.tsx */}
            <div className="w-full py-0">
                <div className="w-full">
                    {activeTab === 'certifications' && (
                        <div className="mt-2 space-y-4 sm:mt-4">
                            {categories.map((category) => {
                                const certs = groupedCertifications[category.id] as typeof certifications | undefined;
                                if (!certs || certs.length === 0) return null;
                                return (
                                    <div key={category.id} className="overflow-hidden rounded-lg bg-white py-3 sm:py-4 dark:bg-[#1a1a1f]">
                                        {/* Category Header - aligned with body/featured-section.tsx */}
                                        <div className="container mx-auto mb-4 flex items-center justify-between px-4 sm:mb-6 sm:px-6 md:px-0">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                {category.icon && <category.icon className="text-primary h-5 w-5 sm:h-6 sm:w-6" />}
                                                <h2 className="text-lg font-light text-gray-900 sm:text-xl md:text-2xl dark:text-[#e0e0e5]">
                                                    {category.name}
                                                </h2>
                                            </div>
                                            <button className="text-primary hover:text-primary/80 flex items-center gap-1 border-0 bg-transparent p-0 text-xs font-bold tracking-wider uppercase shadow-none transition-colors">
                                                See All <span className="text-base"></span>
                                            </button>
                                        </div>

                                        {/* Modern Dot-Navigated Carousel */}
                                        <div className="relative container mx-auto">
                                            {/* Navigation Arrows */}
                                            <button
                                                type="button"
                                                aria-label="Previous"
                                                className="group absolute top-1/2 left-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-xl sm:left-4 sm:h-10 sm:w-10 dark:bg-[#23232a]/90 dark:shadow-[#000]/20 dark:hover:bg-[#23232a] dark:hover:shadow-[#000]/30"
                                                onClick={() => navigateCarousel(category.id, 'prev')}
                                            >
                                                <svg
                                                    className="h-4 w-4 text-gray-600 transition-transform duration-200 group-hover:-translate-x-0.5 sm:h-5 sm:w-5 dark:text-[#e0e0e5]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            <button
                                                type="button"
                                                aria-label="Next"
                                                className="group absolute top-1/2 right-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-xl sm:right-4 sm:h-10 sm:w-10 dark:bg-[#23232a]/90 dark:shadow-[#000]/20 dark:hover:bg-[#23232a] dark:hover:shadow-[#000]/30"
                                                onClick={() => navigateCarousel(category.id, 'next')}
                                            >
                                                <svg
                                                    className="h-4 w-4 text-gray-600 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-5 sm:w-5 dark:text-[#e0e0e5]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>

                                            {/* Carousel Container */}
                                            <div className="flex items-center justify-center px-8 py-2 sm:px-16">
                                                <div className="flex items-center gap-2 transition-all duration-500 ease-in-out sm:gap-4">
                                                    {/* Previous Card */}
                                                    {(() => {
                                                        const currentIndex = carouselStates[category.id] || 0;
                                                        const prevIndex = currentIndex === 0 ? certs.length - 1 : currentIndex - 1;
                                                        const prevCert = certs[prevIndex];
                                                        return (
                                                            <div
                                                                className="group relative flex h-[280px] w-[280px] flex-shrink-0 scale-90 cursor-pointer flex-col rounded-xl border border-gray-200 bg-white px-4 py-8 opacity-60 shadow-sm transition-all duration-500 ease-in-out hover:shadow-md sm:h-[320px] sm:w-[320px] sm:p-6 md:w-[420px] dark:border-[#2d2d35] dark:bg-[#23232a] dark:hover:shadow-[#2d2d35]/50"
                                                                onClick={() => openModal(prevCert)}
                                                            >
                                                                {/* Info Icon */}
                                                                <div className="absolute top-3 right-3 z-10">
                                                                    <div className="group-hover:bg-primary dark:group-hover:bg-primary flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 transition-all duration-300 group-hover:text-white dark:bg-[#2d2d35] dark:text-gray-400 dark:group-hover:text-black">
                                                                        i
                                                                    </div>
                                                                    <div className="absolute top-0 right-8 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                                                        <div className="rounded-lg bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg dark:bg-white dark:text-gray-900">
                                                                            Learn more
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* Header with Logo and Basic Info */}
                                                                <div className="mb-3 flex items-start gap-3 sm:mb-4 sm:gap-4">
                                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 sm:h-16 sm:w-16 dark:border-[#2d2d35] dark:bg-[#2d2d35]">
                                                                        <img
                                                                            src={prevCert.logo || '/placeholder.svg'}
                                                                            alt={`${prevCert.name} logo`}
                                                                            className="h-8 w-8 object-contain sm:h-12 sm:w-12"
                                                                        />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <h3 className="mb-1 truncate text-sm font-bold text-gray-900 sm:text-lg dark:text-[#e0e0e5]">
                                                                            {prevCert.name}
                                                                        </h3>
                                                                        <p className="mb-2 truncate text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                                                                            Issued by: {prevCert.issuingOrg || 'Unknown Organization'}
                                                                        </p>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                                                                {category.name}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Brief Description */}
                                                                <div className="mb-3 flex-1 sm:mb-4">
                                                                    <p className="line-clamp-3 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                                                                        {prevCert.description}
                                                                    </p>
                                                                </div>

                                                                {/* Key Standards Preview */}
                                                                <div className="mb-3 sm:mb-4">
                                                                    <h4 className="mb-1 text-xs font-semibold text-gray-900 sm:mb-2 sm:text-sm dark:text-[#e0e0e5]">
                                                                        Key Standards
                                                                    </h4>
                                                                    <ul className="space-y-0.5 sm:space-y-1">
                                                                        {prevCert.standards?.slice(0, 2).map((standard, index) => (
                                                                            <li
                                                                                key={index}
                                                                                className="flex items-start gap-1 text-xs text-gray-600 sm:gap-2 dark:text-gray-400"
                                                                            >
                                                                                <span className="mt-0.5 text-green-500">•</span>
                                                                                <span className="line-clamp-1">
                                                                                    {standard.replace(/^[^\s]*\s/, '')}
                                                                                </span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* Current Card (Large) */}
                                                    {(() => {
                                                        const currentIndex = carouselStates[category.id] || 0;
                                                        const currentCert = certs[currentIndex];
                                                        return (
                                                            <div
                                                                className="group relative flex h-[280px] w-[280px] flex-shrink-0 scale-110 cursor-pointer flex-col rounded-xl border border-gray-200 bg-white px-4 py-8 shadow-lg transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-xl sm:h-[320px] sm:w-[320px] sm:p-6 md:w-[420px] dark:border-[#2d2d35] dark:bg-[#23232a] dark:hover:border-[#3d3d45] dark:hover:shadow-[#2d2d35]/50"
                                                                onClick={() => openModal(currentCert)}
                                                            >
                                                                {/* Info Icon */}
                                                                <div className="absolute top-3 right-3 z-10">
                                                                    <div className="group-hover:bg-primary dark:group-hover:bg-primary flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 transition-all duration-300 group-hover:text-white dark:bg-[#2d2d35] dark:text-gray-400 dark:group-hover:text-black">
                                                                        i
                                                                    </div>
                                                                    <div className="absolute top-0 right-8 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                                                        <div className="rounded-lg bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg dark:bg-white dark:text-gray-900">
                                                                            Learn more
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* Header with Logo and Basic Info */}
                                                                <div className="mb-3 flex items-start gap-3 sm:mb-4 sm:gap-4">
                                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md sm:h-16 sm:w-16 dark:border-[#2d2d35] dark:bg-[#2d2d35]">
                                                                        <img
                                                                            src={currentCert.logo || '/placeholder.svg'}
                                                                            alt={`${currentCert.name} logo`}
                                                                            className="h-8 w-8 object-contain sm:h-12 sm:w-12"
                                                                        />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <h3 className="group-hover:text-primary dark:group-hover:text-primary/80 mb-1 truncate text-sm font-bold text-gray-900 transition-colors sm:text-lg dark:text-[#e0e0e5]">
                                                                            {currentCert.name}
                                                                        </h3>
                                                                        <p className="mb-2 truncate text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                                                                            Issued by: {currentCert.issuingOrg || 'Unknown Organization'}
                                                                        </p>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 transition-colors group-hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:group-hover:bg-blue-800">
                                                                                {category.name}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Brief Description */}
                                                                <div className="mb-3 flex-1 sm:mb-4">
                                                                    <p className="line-clamp-3 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                                                                        {currentCert.description}
                                                                    </p>
                                                                </div>

                                                                {/* Key Standards Preview */}
                                                                <div className="mb-3 sm:mb-4">
                                                                    <h4 className="mb-1 text-xs font-semibold text-gray-900 sm:mb-2 sm:text-sm dark:text-[#e0e0e5]">
                                                                        Key Standards
                                                                    </h4>
                                                                    <ul className="space-y-0.5 sm:space-y-1">
                                                                        {currentCert.standards?.slice(0, 2).map((standard, index) => (
                                                                            <li
                                                                                key={index}
                                                                                className="flex items-start gap-1 text-xs text-gray-600 sm:gap-2 dark:text-gray-400"
                                                                            >
                                                                                <span className="mt-0.5 text-green-500">•</span>
                                                                                <span className="line-clamp-1">
                                                                                    {standard.replace(/^[^\s]*\s/, '')}
                                                                                </span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* Next Card */}
                                                    {(() => {
                                                        const currentIndex = carouselStates[category.id] || 0;
                                                        const nextIndex = currentIndex === certs.length - 1 ? 0 : currentIndex + 1;
                                                        const nextCert = certs[nextIndex];
                                                        return (
                                                            <div
                                                                className="group relative flex h-[280px] w-[280px] flex-shrink-0 scale-90 cursor-pointer flex-col rounded-xl border border-gray-200 bg-white px-4 py-8 opacity-60 shadow-sm transition-all duration-500 ease-in-out hover:shadow-md sm:h-[320px] sm:w-[320px] sm:p-6 md:w-[420px] dark:border-[#2d2d35] dark:bg-[#23232a] dark:hover:shadow-[#2d2d35]/50"
                                                                onClick={() => openModal(nextCert)}
                                                            >
                                                                {/* Info Icon */}
                                                                <div className="absolute top-3 right-3 z-10">
                                                                    <div className="group-hover:bg-primary dark:group-hover:bg-primary flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 transition-all duration-300 group-hover:text-white dark:bg-[#2d2d35] dark:text-gray-400 dark:group-hover:text-black">
                                                                        i
                                                                    </div>
                                                                    <div className="absolute top-0 right-8 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                                                        <div className="rounded-lg bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg dark:bg-white dark:text-gray-900">
                                                                            Learn more
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* Header with Logo and Basic Info */}
                                                                <div className="mb-3 flex items-start gap-3 sm:mb-4 sm:gap-4">
                                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 sm:h-16 sm:w-16 dark:border-[#2d2d35] dark:bg-[#2d2d35]">
                                                                        <img
                                                                            src={nextCert.logo || '/placeholder.svg'}
                                                                            alt={`${nextCert.name} logo`}
                                                                            className="h-8 w-8 object-contain sm:h-12 sm:w-12"
                                                                        />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <h3 className="mb-1 truncate text-sm font-bold text-gray-900 sm:text-lg dark:text-[#e0e0e5]">
                                                                            {nextCert.name}
                                                                        </h3>
                                                                        <p className="mb-2 truncate text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                                                                            Issued by: {nextCert.issuingOrg || 'Unknown Organization'}
                                                                        </p>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                                                                {category.name}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Brief Description */}
                                                                <div className="mb-3 flex-1 sm:mb-4">
                                                                    <p className="line-clamp-3 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                                                                        {nextCert.description}
                                                                    </p>
                                                                </div>

                                                                {/* Key Standards Preview */}
                                                                <div className="mb-3 sm:mb-4">
                                                                    <h4 className="mb-1 text-xs font-semibold text-gray-900 sm:mb-2 sm:text-sm dark:text-[#e0e0e5]">
                                                                        Key Standards
                                                                    </h4>
                                                                    <ul className="space-y-0.5 sm:space-y-1">
                                                                        {nextCert.standards?.slice(0, 2).map((standard, index) => (
                                                                            <li
                                                                                key={index}
                                                                                className="flex items-start gap-1 text-xs text-gray-600 sm:gap-2 dark:text-gray-400"
                                                                            >
                                                                                <span className="mt-0.5 text-green-500">•</span>
                                                                                <span className="line-clamp-1">
                                                                                    {standard.replace(/^[^\s]*\s/, '')}
                                                                                </span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>

                                            {/* Dot Navigation */}
                                            <div className="mt-4 flex justify-center gap-1.5 sm:mt-6 sm:gap-2">
                                                {certs.map((_, index) => {
                                                    const currentIndex = carouselStates[category.id] || 0;
                                                    const isActive = index === currentIndex;
                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => goToSlide(category.id, index)}
                                                            className={`h-1.5 w-6 rounded-full transition-all duration-500 ease-in-out sm:h-2 sm:w-8 ${
                                                                isActive
                                                                    ? 'bg-primary dark:bg-primary scale-110'
                                                                    : 'bg-gray-300 hover:scale-105 hover:bg-gray-400 dark:bg-[#3d3d45] dark:hover:bg-[#4d4d55]'
                                                            }`}
                                                            aria-label={`Go to slide ${index + 1}`}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'avoid' && (
                        <div className="mt-8">
                            <HarmfulIngredientsSection harmfulItems={harmfulItemsToShow} categories={categories} />
                        </div>
                    )}
                </div>

                {/* Educational Video Section - Always visible */}
                <VideoSection selectedCategory={''} />
            </div>

            {/* Modal for full certification details - aligned with product-details-modal */}
            {isModalOpen && selectedCert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4" onClick={closeModal}>
                    <div
                        className="font-milk max-h-[95vh] w-full overflow-y-auto rounded-lg bg-white px-3 py-6 tracking-tighter uppercase sm:w-[95vw] sm:max-w-5xl sm:px-4 md:px-8 md:py-10 dark:bg-[#1a1a1f] dark:text-[#e0e0e5]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="mb-4 flex items-start justify-between sm:mb-6">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 sm:h-16 sm:w-16 dark:border-[#2d2d35] dark:bg-[#2d2d35]">
                                    <img
                                        src={selectedCert.logo || '/placeholder.svg'}
                                        alt={`${selectedCert.name} logo`}
                                        className="h-8 w-8 object-contain sm:h-12 sm:w-12"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h2 className="mb-1 text-lg font-light text-gray-900 sm:mb-2 sm:text-xl md:text-2xl dark:text-[#e0e0e5]">
                                        {selectedCert.fullName || selectedCert.name}
                                    </h2>
                                    <p className="mb-1 text-xs text-gray-600 sm:mb-2 sm:text-sm dark:text-gray-400">
                                        Issued by: {selectedCert.issuingOrg || 'Unknown Organization'}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                        <Badge
                                            variant="outline"
                                            className="border-gray-200 px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 dark:border-[#2d2d35] dark:bg-[#1a1a1f] dark:text-[#b8b8c0]"
                                        >
                                            {categories.find((c) => c.id === selectedCert.category)?.name}
                                        </Badge>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Verified {selectedCert.verifiedDate || 'Recently'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 sm:h-8 sm:w-8 dark:bg-[#2d2d35] dark:text-gray-400 dark:hover:bg-[#3d3d45] dark:hover:text-[#e0e0e5]"
                            >
                                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="grid grid-cols-1 gap-6 sm:gap-8">
                            {/* Detailed Information */}
                            <div className="space-y-4 sm:space-y-6">
                                {/* Standards & Criteria */}
                                <div className="space-y-2 sm:space-y-3">
                                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg dark:text-[#e0e0e5]">Standards & Criteria</h3>
                                    <ul className="space-y-1.5 sm:space-y-2">
                                        {selectedCert.standards?.map((standard, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-2 text-xs text-gray-600 sm:gap-3 sm:text-sm dark:text-gray-400"
                                            >
                                                <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-green-500 sm:h-1.5 sm:w-1.5"></span>
                                                <span>{standard.replace(/^[^\s]*\s/, '')}</span>
                                            </li>
                                        )) || (
                                            <li className="text-xs text-gray-500 italic sm:text-sm dark:text-gray-400">
                                                Standards information not available
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {/* Why It Matters */}
                                <div className="space-y-2 sm:space-y-3">
                                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg dark:text-[#e0e0e5]">Why It Matters</h3>
                                    <p className="text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-gray-400">
                                        {selectedCert.whyItMatters || 'Impact information not available'}
                                    </p>
                                </div>

                                {/* Brands */}
                                <div className="space-y-2 sm:space-y-3">
                                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg dark:text-[#e0e0e5]">Brands That Use It</h3>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {selectedCert.brands?.map((brand, index) => (
                                            <Badge key={index} variant="outline" className="text-xs dark:border-[#2d2d35] dark:text-[#b8b8c0]">
                                                {brand}
                                            </Badge>
                                        )) || (
                                            <Badge variant="outline" className="text-xs dark:border-[#2d2d35] dark:text-[#b8b8c0]">
                                                Brand information not available
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* What It Means */}
                                <div className="space-y-2 sm:space-y-3">
                                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg dark:text-[#e0e0e5]">What It Means</h3>
                                    <p className="text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-gray-400">{selectedCert.description}</p>
                                </div>

                                {/* Learn More Button */}
                                {selectedCert.learnMore && (
                                    <Button
                                        asChild
                                        className="font-milk w-full py-2.5 text-sm font-medium uppercase sm:py-3 sm:text-base dark:bg-[#e0e0e5] dark:text-[#1a1a1f] dark:hover:bg-[#cccccc]"
                                    >
                                        <a href={selectedCert.learnMore} target="_blank" rel="noopener noreferrer">
                                            Learn More
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-6 border-t border-gray-200 pt-4 sm:mt-8 sm:pt-6 dark:border-[#2d2d35]">
                            <p className="text-center text-xs text-gray-500 dark:text-[#b8b8c0]">
                                This certification ensures product safety and quality standards.{' '}
                                <a href="#" className="underline hover:text-gray-700 dark:hover:text-[#e0e0e5]">
                                    Learn more about our verification process.
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <button
                onClick={scrollToTop}
                className="fixed right-4 bottom-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:bg-gray-100 sm:right-8 sm:bottom-8 sm:h-10 sm:w-10 dark:border dark:border-[#2d2d35] dark:bg-[#23232a] dark:hover:bg-[#2d2d35]"
                aria-label="Back to top"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5 dark:text-[#e0e0e5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
            <Footer />
        </MainLayout>
    );
}
