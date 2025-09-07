'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Baby, Heart, Home, Leaf, Shirt, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

// Import separated components with correct paths
import MainLayout from '@/layouts/MainLayout';
import Footer from '../body/footer';
import HarmfulIngredientsSection from './harmful-ingredients-section';
import VideoSection from './video-section';

interface Props {
    videos?: any[];
    harmfulContents?: any[];
}

export default function CertificationsPage({ videos = [], harmfulContents = [] }: Props) {
    // Unique certifications data without duplicates
    const certifications = [
        // Food & Beverage
        {
            id: 1,
            name: 'USDA Organic',
            fullName: 'USDA Organic Certification',
            category: 'food',
            logo: '/images/certificate-logo/USDA.png',
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
            id: 2,
            name: 'NON-GMO',
            fullName: 'Non-GMO Project Verified',
            category: 'food',
            logo: '/images/certificate-logo/NON.png',
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
            logo: '/images/certificate-logo/plastic.png',
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
            logo: '/images/certificate-logo/metal.png',
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
            logo: '/images/certificate-logo/kosher.png',
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
            logo: '/images/certificate-logo/halal.png',
            issuingOrg: "Islamic Da'wah Council of the Philippines (IDCP) / Other global halal bodies",
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
            logo: '/images/certificate-logo/vegan.png',
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
            logo: '/images/certificate-logo/gluten.svg',
            issuingOrg: 'Gluten-Free Certification Organization (program of GIG)',
            description: "GFCO certifies that foods contain 10 ppm or less of gluten—stricter than FDA's 20 ppm threshold.",
            standards: [
                '✅ Finished product & all ingredients ≤ 10 ppm gluten',
                '❌ No barley-based ingredients allowed',
                '🧪 Rigorous ingredient testing & manufacturing line audits',
                '📋 Annual audits & ongoing sampling',
            ],
            verification: 'ISO‑accredited audits, regular testing, and annual plant inspections by GFCO/GIG',
            whyItMatters: 'Provides stronger protection for people with celiac or gluten sensitivities beyond standard FDA labeling.',
            brands: ['Enjoy Life Foods', "Bob's Red Mill Selects", "Udi's"],
            learnMore: 'https://gfco.org/',
            verifiedDate: '2024-04-06',
        },
        // Personal Care
        {
            id: 15,
            name: 'Fragrance Free',
            fullName: 'Fragrance-Free (EPA Safer Choice)',
            category: 'personal',
            logo: '/images/certificate-logo/EPA.png',
            issuingOrg: 'U.S. EPA Safer Choice',
            description: 'No added fragrance or scent-masking chemicals, meeting stricter Safer Choice standards.',
            standards: [
                '❌ No added fragrance or masking ingredients',
                '📋 Full ingredient transparency',
                '✅ Must meet Safer Choice chemical safety benchmarks',
            ],
            verification: 'EPA reviews formulations and verifies compliance based on Safer Choice program data',
            whyItMatters: "Crucial for individuals with sensitivities or allergies; ensures there's no hidden fragrance.",
            brands: ['Seventh Generation Free & Clear', 'Ecover Fragrance‑Free'],
            learnMore: 'https://www.epa.gov/saferchoice',
            verifiedDate: '2024-01-15',
        },
        {
            id: 16,
            name: 'Paraben Free',
            fullName: 'Paraben‑Free Claim',
            category: 'personal',
            logo: '/images/certificate-logo/paraben.png',
            issuingOrg: 'Industry-standard/no single certifier',
            description: 'Indicates no parabens (common preservatives) are used in the product formulation.',
            standards: ['❌ No methyl-, ethyl-, propyl-, butyl-parabens', '✅ Free of substances with similar endocrine disruption concerns'],
            verification: 'Typically self-certified; lab testing can confirm absence',
            whyItMatters: 'Addresses consumer concerns about parabens acting as potential endocrine disruptors.',
            brands: ['Many clean-beauty brands: e.g., Juice Beauty, RMS'],
            learnMore: '',
            verifiedDate: '2023-11-01',
        },
        {
            id: 17,
            name: 'Phthalate Free',
            fullName: 'Phthalate‑Free Claim',
            category: 'personal',
            logo: '/images/certificate-logo/late.png',
            issuingOrg: 'Industry-standard/no formal certifier',
            description: 'No phthalate plasticizers (e.g., DBP, DEHP, DEP, and BzBP) included in formulation.',
            standards: ['❌ Excludes DBP, DEHP, DEP, BzBP', '✅ No hidden phthalates in fragrance or packaging'],
            verification: 'Self-declared, sometimes supported by GC-MS lab analysis.',
            whyItMatters: 'Phthalates are linked to reproductive and endocrine health concerns.',
            brands: ['Beautycounter, Honest Beauty'],
            learnMore: '',
            verifiedDate: '2023-11-01',
        },
        {
            id: 18,
            name: 'Sulfate Free',
            fullName: 'Sulfate‑Free Claim',
            category: 'personal',
            logo: '/images/certificate-logo/sulfate.png',
            issuingOrg: 'Industry-standard/no third-party certifier',
            description: 'Free from sulfate detergents (e.g., SLS, SLES) that are potentially irritating.',
            standards: ['❌ No SLS, SLES', '✅ Uses milder, biodegradable surfactants'],
            verification: 'Self-reported; lab testing confirms surfactant absence',
            whyItMatters: 'Better for sensitive skin, color-treated hair, and reduces environmental impact.',
            brands: ['Herbal Essences sulfate-free shampoos (EWG Verified)'],
            learnMore: '',
            verifiedDate: '2024-01-01',
        },
        // Home Cleaning
        {
            id: 22,
            name: 'Green Seal',
            fullName: 'Green Seal Certified',
            category: 'cleaning',
            logo: '/images/certificate-logo/green.png',
            issuingOrg: 'Green Seal, Inc.',
            description: 'Eco-label confirming products and services meet rigorous life-cycle criteria for health and sustainability.',
            standards: [
                '♻️ Lifecycle assessment: from raw materials to disposal',
                '🚫 Bans harmful chemicals & PFAS',
                '✅ Low VOC emissions',
                '📋 Performance-tested (e.g., ≥80 % soil removal in household cleaners GS‑8)',
                '🔍 On-site audits + documentation review',
            ],
            verification: 'Third-party data review, product testing, on-site audits; must comply with standards like GS‑8, GS‑34, GS‑37, etc.',
            whyItMatters:
                'Ensures cleaning products truly deliver safety, performance, and environmental responsibility—beyond greenwashed buzzwords.',
            brands: ['Clorox Green Works', 'Method', 'Seventh Generation'],
            learnMore: 'https://greenseal.org/',
            verifiedDate: '2024-01-15',
        },
        {
            id: 23,
            name: 'EPA Safer Choice',
            fullName: 'EPA Safer Choice Certification',
            category: 'cleaning',
            logo: '/images/certificate-logo/EPA.png',
            issuingOrg: 'U.S. Environmental Protection Agency',
            description: 'Label denoting each ingredient in a product has been reviewed and deemed safer for human health and the environment.',
            standards: [
                '🔬 Ingredient-by-ingredient toxicological review',
                '✅ Product performance standards (equal to conventional cleaners)',
                '📦 Packaging sustainability (e.g., no PFAS, encourages recycled content)',
                '🧩 Transparency in ingredients',
                '📋 Annual audits & surveillance',
            ],
            verification: 'EPA scientists review all intentionally added ingredients; annual audits and compliance with updated standards.',
            whyItMatters:
                'Helps consumers and institutions identify thoroughly vetted safer home-cleaning solutions without sacrificing effectiveness.',
            brands: ['ECOS', 'Seventh Generation', 'Method'],
            learnMore: 'https://www.epa.gov/saferchoice',
            verifiedDate: '2024-08-08',
        },
        // Kitchen Essentials
        {
            id: 26,
            name: 'PFAS Free',
            fullName: 'PFAS-Free Certification (NSF 537)',
            category: 'kitchen',
            logo: '/images/certificate-logo/nsf.png',
            issuingOrg: 'NSF International',
            description: 'Certification verifying that food-contact materials contain no intentionally added PFAS and meet strict fluorine limits.',
            standards: [
                '🔬 Total Organic Fluorine (TOF) < 50 ppm',
                '❌ No intentionally added PFAS chemicals',
                '📋 Ingredient disclosures and manufacturer attestations',
                '📅 Annual retesting and compliance audits',
            ],
            verification: 'Guided by NSF 537: includes TOF lab tests, formulation review, and factory documentation audits.',
            whyItMatters: 'Prevents long-term PFAS exposure from cookware, food containers, and prep tools.',
            brands: ['GreenPan', 'Caraway', 'Our Place'],
            learnMore: 'https://www.nsf.org/news/nsf-introduces-pfas-free-certification',
            verifiedDate: '2025-03-24',
        },
        {
            id: 27,
            name: 'MADE SAFE',
            fullName: 'MADE SAFE® Certification',
            category: 'kitchen',
            logo: '/images/certificate-logo/metal.png',
            issuingOrg: 'MADE SAFE® / Nontoxic Certified',
            description: 'Toxicant screening label for products and ingredients that are safe for humans and ecosystems.',
            standards: [
                '❌ Bans over 15,000 known or suspected toxic chemicals',
                '🚫 No carcinogens, neurotoxins, endocrine disruptors, heavy metals, or VOCs',
                '🔍 360° ecosystem + ingredient screening',
                '📋 Full material disclosure and third-party review',
            ],
            verification: 'Third-party evaluation by MADE SAFE using proprietary banned substance database and deep toxicology screening.',
            whyItMatters: 'Guarantees your kitchen products are truly free from toxins—safe for use by families and children.',
            brands: ['Annmarie Kitchenware', 'Blissed Kitchen Tools'],
            learnMore: 'https://madesafe.org/',
            verifiedDate: '2025-07-24',
        },
        // Baby & Kids
        {
            id: 28,
            name: 'GOTS Organic',
            fullName: 'Global Organic Textile Standard (GOTS)',
            category: 'baby',
            logo: '/images/certificate-logo/gots.png',
            issuingOrg: 'Global Organic Textile Standard',
            description:
                'World-leading standard for organic fiber textiles, addressing ecological and social criteria across the entire supply chain.',
            standards: [
                '🌱 ≥95% certified organic fibers',
                '✅ No toxic chemicals, GMOs, synthetic pesticides',
                '⚖️ Social criteria: fair labor & working conditions',
                '🔍 Traceability from farm to finished product',
            ],
            verification: 'Third-party certification with supply-chain audits, ingredient compliance, and documentation reviews.',
            whyItMatters: 'Safeguards infants from harmful residues while supporting environmental and labor ethical standards.',
            brands: ['Hanna Andersson', 'Colored Organics', 'Mori'],
            learnMore: 'https://global-standard.org/',
            verifiedDate: '2025-02-15',
        },
        {
            id: 29,
            name: 'OEKO‑TEX STANDARD 100',
            fullName: 'OEKO‑TEX® STANDARD 100',
            category: 'baby',
            logo: '/images/certificate-logo/oeko.png',
            issuingOrg: 'OEKO‑TEX® Association',
            description: "Textile safety certification ensuring baby & children's fabrics are free from harmful substances.",
            standards: [
                '🧪 Tested for 1,000+ harmful chemicals including heavy metals and pesticides',
                '👶 Product Class I for infants—strictest limits applied',
                '📋 Portfolio-wide chemical screening by independent institutes',
                '🔍 On-site facility visits every 3 years',
            ],
            verification: 'Lab testing + annual audit and facility inspection per STANDARD 100 criteria.',
            whyItMatters: 'Reassures parents that clothes, bedding, and toys are safe for sensitive baby skin.',
            brands: ['Gunamuna baby clothes', 'Crane Baby bedding', 'Various OEKO‑TEX labeled items'],
            learnMore: 'https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100',
            verifiedDate: '2025-04-01',
        },
        // Clothing
        {
            id: 30,
            name: 'bluesign',
            fullName: 'bluesign® Product & System Certification',
            category: 'clothing',
            logo: '/images/certificate-logo/blue.png',
            issuingOrg: 'bluesign Technologies AG',
            description:
                'Industry-leading system that ensures safe chemistry, resource-efficient manufacturing, and socially responsible practices across the textile supply chain.',
            standards: [
                '⚙️ Rigorous input screening (chemicals, dyes) per bluesign criteria',
                '🌱 Minimization of water, energy, waste, emissions',
                '📦 Transparency and traceability of materials',
                '🔍 Yearly system audits and continuous improvement',
            ],
            verification:
                'Independent verification of bluesign criteria at every supply chain step, factory audits, and traceable material approval.',
            whyItMatters: 'Tight control over textile chemistry and resource impacts—not just finished product claims.',
            brands: ['Patagonia (some lines)', 'Adrenna', 'Outdoor apparel brands'],
            learnMore: 'https://www.bluesign.com/',
            verifiedDate: '2025-07-01',
        },
        {
            id: 31,
            name: 'Fair Trade',
            fullName: 'Fair Trade Certified (Fairtrade International / Fair Trade USA)',
            category: 'clothing',
            logo: '/images/certificate-logo/fair.png',
            issuingOrg: 'Fairtrade International / Fair Trade USA',
            description:
                'Certification ensuring products are sourced and made under fair labor conditions, equitable pay, and sustainable farming practices.',
            standards: [
                '🤝 Fair prices and premiums for producers',
                '👷‍♀️ No forced or child labor; safe workplaces and freedom of association',
                '🏭 Democratic decision-making in cooperatives',
                '📋 Environmental stewardship and sustainable agricultural practices',
            ],
            verification: 'Inspections by FLOCERT or Fair Trade USA; audits cover farms, factories, wages and use of premiums.',
            whyItMatters: 'Supports worker rights, community development, and ethical sourcing in apparel supply chains.',
            brands: ['Oliberté (shoes)', 'Fair Trade cotton apparel brands', 'Handcrafted textiles'],
            learnMore: 'https://www.fairtradecertified.org/',
            verifiedDate: '2025-06-01',
        },
        // Beauty & Cosmetics
        {
            id: 32,
            name: 'EWG Verified',
            fullName: 'EWG Verified®',
            category: 'beauty',
            logo: '/images/certificate-logo/egw.png',
            issuingOrg: 'Environmental Working Group',
            description: "Seal for products that meet EWG's strictest health and transparency criteria.",
            standards: [
                "🚫 No ingredients from EWG's unacceptable/restricted lists",
                '📋 Full ingredient disclosure (including fragrance)',
                '✅ Must be "green" in Skin Deep® and follow good manufacturing practices',
            ],
            verification: 'Product dossiers audited by EWG scientists; random product testing to ensure compliance.',
            whyItMatters: 'Helps consumers avoid toxic chemicals in personal care products.',
            brands: ['Beautycounter', 'MyChelle Dermaceuticals'],
            learnMore: 'https://www.ewg.org/ewgverified/',
            verifiedDate: '2015-12-06',
        },
    ];

    const categories = [
        { id: 'food', name: 'Food & Beverage', icon: Leaf, color: 'bg-green-100 text-green-700' },
        { id: 'personal', name: 'Personal Care', icon: Heart, color: 'bg-pink-100 text-pink-700' },
        { id: 'cleaning', name: 'Home Cleaning', icon: Home, color: 'bg-purple-100 text-purple-700' },
        { id: 'kitchen', name: 'Kitchen Essentials', icon: Home, color: 'bg-orange-100 text-orange-700' },
        { id: 'baby', name: 'Baby & Kids', icon: Baby, color: 'bg-yellow-100 text-yellow-700' },
        { id: 'clothing', name: 'Clothing', icon: Shirt, color: 'bg-blue-100 text-blue-700' },
        { id: 'beauty', name: 'Beauty & Cosmetics', icon: Sparkles, color: 'bg-indigo-100 text-indigo-700' },
    ];

    const [activeTab, setActiveTab] = useState('certifications');
    const [selectedCert, setSelectedCert] = useState<(typeof certifications)[number] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Group certifications by category for reference
    const groupedCertifications = useMemo(() => {
        const groups: Record<string, typeof certifications> = {};
        certifications.forEach((cert) => {
            if (!groups[cert.category]) groups[cert.category] = [];
            groups[cert.category].push(cert);
        });
        return groups;
    }, []);

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
            {/* Hero Section */}
            <section className="min-h-[100px] w-full overflow-hidden rounded-[12px] bg-[#ecf0f3] shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] sm:min-h-[100px] md:min-h-[150px] lg:min-h-[150px] xl:min-h-[200px] 2xl:min-h-[200px] dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                <div className="relative z-10 container mx-auto px-4 py-8 text-center sm:py-8 md:py-10 lg:py-12 xl:py-20 2xl:py-20 dark:bg-transparent">
                    <h1 className="font-milk mb-4 text-lg font-light tracking-wide text-gray-900 sm:mb-6 sm:text-xl md:mb-8 md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl dark:text-[#e0e0e5]">
                        Learn About Certifications That Matter
                    </h1>

                    <p className="lg:text-md pb-8 text-[8px] leading-tight break-words text-gray-600 sm:text-[10px] md:text-sm xl:text-lg 2xl:text-lg dark:text-gray-300">
                        Discover trusted certifications that ensure product safety and quality, <br /> and learn about harmful ingredients to avoid in
                        your daily choices.
                    </p>

                    {/* Tab Navigation */}
                    <div className="mx-auto mb-4 flex flex-col justify-center gap-2 sm:mb-6 sm:flex-row">
                        <button
                            className={`overflow-hidden rounded-[12px] px-3 py-2 text-xs font-medium uppercase transition-colors sm:px-4 sm:text-sm ${
                                activeTab === 'certifications'
                                    ? 'bg-primary dark:bg-primary text-white shadow-sm dark:text-black'
                                    : 'bg-[#ecf0f3] text-gray-700 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] hover:shadow-[12px_12px_12px_#d1d9e6,-12px_-12px_12px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#e0e0e5] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526] dark:hover:shadow-[12px_12px_24px_#0e0f10,-12px_-12px_24px_#222526]'
                            }`}
                            onClick={() => setActiveTab('certifications')}
                            disabled={activeTab === 'certifications'}
                        >
                            Trusted Certifications
                        </button>
                        <button
                            className={`overflow-hidden rounded-[12px] px-3 py-2 text-xs font-medium uppercase transition-colors sm:px-4 sm:text-sm ${
                                activeTab === 'avoid'
                                    ? 'bg-primary dark:bg-primary text-white shadow-sm dark:text-black'
                                    : 'bg-[#ecf0f3] text-gray-700 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] hover:shadow-[12px_12px_12px_#d1d9e6,-12px_-12px_12px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#e0e0e5] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526] dark:hover:shadow-[12px_12px_24px_#0e0f10,-12px_-12px_24px_#222526]'
                            }`}
                            onClick={() => setActiveTab('avoid')}
                            disabled={activeTab === 'avoid'}
                        >
                            What to Avoid
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="w-full py-0">
                <div className="w-full">
                    {activeTab === 'certifications' && (
                        <div className="relative py-8">
                            {/* Section Header */}
                            <div className="container mx-auto mb-8 px-4 text-center">
                                <h2 className="mb-4 text-2xl font-light text-gray-900 md:text-3xl lg:text-4xl dark:text-[#6298F0]">
                                    All Certifications
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {certifications.length} certifications available across all categories
                                </p>
                            </div>

                            {/* Vertical Grid Container */}
                            <div className="container mx-auto px-4">
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                                    {certifications.map((cert) => {
                                        return (
                                            <div
                                                key={cert.id}
                                                className="group hover:border-primary dark:hover:border-primary relative flex cursor-pointer flex-col overflow-hidden rounded-[12px] bg-[#ecf0f3] p-4 shadow-[6px_6px_8px_#d1d9e6,-6px_-6px_8px_#f9f9f9] transition-all duration-300 ease-out hover:border-2 hover:shadow-[8px_8px_12px_#d1d9e6,-8px_-8px_12px_#f9f9f9] active:scale-[0.98] sm:p-6 dark:bg-[#181a1b] dark:shadow-[6px_6px_16px_#0e0f10,-6px_-6px_16px_#222526] dark:hover:shadow-[8px_8px_20px_#0e0f10,-8px_-8px_20px_#222526]"
                                                onClick={() => openModal(cert)}
                                            >
                                                {/* Info Icon - Hidden on mobile */}
                                                <div className="absolute top-2 right-2 z-10 hidden sm:block">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-none bg-[#ecf0f3] text-xs font-bold text-gray-600 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] transition-all duration-300 outline-none group-hover:overflow-hidden group-hover:rounded-[12px] group-hover:bg-[#ecf0f3] group-hover:text-white group-hover:shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:group-hover:bg-[#181a1b] dark:group-hover:text-black dark:group-hover:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]">
                                                        i
                                                    </div>
                                                </div>

                                                {/* Mobile Layout - Box Style */}
                                                <div className="flex h-40 flex-col items-center justify-between sm:hidden">
                                                    {/* Logo Container */}
                                                    <div
                                                        className="flex h-20 w-20 items-center justify-center rounded-xl border-none bg-[#ecf0f3] bg-contain bg-center bg-no-repeat shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_6px_#d1d9e6,inset_-4px_-4px_6px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_3px_3px_6px_#0e0f10,inset_-3px_-3px_6px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_8px_#0e0f10,inset_-4px_-4px_8px_#222526]"
                                                        style={{ backgroundImage: `url(${cert.logo || '/placeholder.svg'})` }}
                                                    />

                                                    {/* Content Container */}
                                                    <div className="flex flex-1 flex-col items-center justify-center text-center">
                                                        <h3 className="mb-1 line-clamp-2 text-center text-xs font-bold text-gray-900 dark:text-[#ffffff]">
                                                            {cert.name}
                                                        </h3>
                                                        <p className="line-clamp-2 text-center text-[10px] text-gray-600 dark:text-gray-300">
                                                            {cert.issuingOrg}
                                                        </p>
                                                    </div>

                                                    {/* Tap indicator */}
                                                    <div className="mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] dark:bg-[#181a1b] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526]">
                                                        <svg
                                                            className="h-3 w-3 text-gray-500 dark:text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Desktop Layout - Full Content */}
                                                <div className="hidden sm:block">
                                                    {/* Header with Logo */}
                                                    <div className="mb-4 flex items-start gap-4">
                                                        <div
                                                            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border-none bg-[#ecf0f3] bg-contain bg-center bg-no-repeat shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"
                                                            style={{ backgroundImage: `url(${cert.logo || '/placeholder.svg'})` }}
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="group-hover:text-primary dark:group-hover:text-primary/80 mb-2 font-bold text-gray-900 transition-colors dark:text-[#ffffff]">
                                                                {cert.name}
                                                            </h3>
                                                            <p className="mb-2 line-clamp-2 text-xs text-gray-600 dark:text-gray-200">
                                                                {cert.issuingOrg}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    <div className="mb-4 flex-1">
                                                        <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-200">{cert.description}</p>
                                                    </div>

                                                    {/* Key Standards Preview */}
                                                    <div className="mb-4">
                                                        <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-[#ffffff]">
                                                            Key Standards
                                                        </h4>
                                                        <ul className="space-y-1">
                                                            {cert.standards?.slice(0, 2).map((standard, standardIndex) => (
                                                                <li
                                                                    key={standardIndex}
                                                                    className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-200"
                                                                >
                                                                    <span className="mt-0.5 text-green-500">•</span>
                                                                    <span className="line-clamp-1">{standard.replace(/^[^\s]*\s/, '')}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'avoid' && (
                        <div className="mt-8">
                            <HarmfulIngredientsSection harmfulContents={harmfulContents || []} />
                        </div>
                    )}
                </div>

                {/* Educational Video Section - Always visible */}
                <VideoSection selectedCategory={''} videos={videos} />
            </div>

            {/* Modal for full certification details */}
            {isModalOpen &&
                selectedCert &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#ecf0f3] p-2 sm:p-4 dark:bg-[#181a1b]"
                        onClick={closeModal}
                        style={{ position: 'fixed', zIndex: 999999 }}
                    >
                        <div
                            className="font-milk max-h-[95vh] w-full overflow-hidden overflow-y-auto rounded-[12px] bg-[#ecf0f3] px-3 py-6 tracking-tighter uppercase shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] sm:w-[95vw] sm:max-w-5xl sm:px-4 md:px-8 md:py-10 dark:bg-[#181a1b] dark:text-[#e0e0e5] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]"
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
                                        <p className="mb-1 text-xs text-gray-600 sm:mb-2 sm:text-sm dark:text-[#6298F0]">
                                            Issued by: {selectedCert.issuingOrg || 'Unknown Organization'}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                            <span className="text-xs text-gray-500 dark:text-[#6298F0]">
                                                Verified {selectedCert.verifiedDate || 'Recently'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="flex h-6 w-6 items-center justify-center rounded-full border-none bg-[#ecf0f3] text-gray-400 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] transition-colors outline-none placeholder:text-[#a0a5a8] hover:bg-gray-200 hover:text-gray-600 focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] sm:h-8 sm:w-8 dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:hover:bg-[#3d2d35] dark:hover:text-[#e0e0e5] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"
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
                                                    className="flex items-start gap-2 text-xs text-gray-600 sm:gap-3 sm:text-sm dark:text-gray-200"
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
                                        <p className="text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-gray-200">
                                            {selectedCert.whyItMatters || 'Impact information not available'}
                                        </p>
                                    </div>

                                    {/* Brands */}
                                    <div className="space-y-2 sm:space-y-3">
                                        <h3 className="text-base font-semibold text-gray-900 sm:text-lg dark:text-[#e0e0e5]">Brands That Use It</h3>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {selectedCert.brands?.map((brand, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="border-none bg-[#ecf0f3] text-xs shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"
                                                >
                                                    {brand}
                                                </Badge>
                                            )) || (
                                                <Badge
                                                    variant="outline"
                                                    className="border-none bg-[#ecf0f3] text-xs shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none placeholder:text-[#a0a5a8] focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] dark:placeholder:text-[#6b7280] dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]"
                                                >
                                                    Brand information not available
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* What It Means */}
                                    <div className="space-y-2 sm:space-y-3">
                                        <h3 className="text-base font-semibold text-gray-900 sm:text-lg dark:text-[#e0e0e5]">What It Means</h3>
                                        <p className="text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-gray-200">
                                            {selectedCert.description}
                                        </p>
                                    </div>

                                    {/* Learn More Button */}
                                    {selectedCert.learnMore && (
                                        <Button
                                            asChild
                                            className="font-milk text-dark w-full overflow-hidden rounded-[12px] bg-[#ecf0f3] py-2.5 text-sm font-medium uppercase shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] hover:shadow-[12px_12px_12px_#d1d9e6,-12px_-12px_12px_#f9f9f9] sm:py-3 sm:text-base dark:bg-[#181a1b] dark:text-[#e0e0e5] dark:text-white dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526] dark:hover:bg-[#cccccc] dark:hover:shadow-[12px_12px_24px_#0e0f10,-12px_-12px_24px_#222526]"
                                        >
                                            <a href={selectedCert.learnMore} target="_blank" rel="noopener noreferrer ">
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
                    </div>,
                    document.body,
                )}

            <Footer />
        </MainLayout>
    );
}
