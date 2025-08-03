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
        logo: '/images/certificate-logo/USDA.png', // Replace with actual logo path
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
        logo: '/images/certificate-logo/NON.png', // Replace with real path to logo
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
        logo: '/images/certificate-logo/plastic.png', // Replace with actual logo path
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
    {
        id: 9,
        name: 'USDA Organic',
        fullName: 'USDA Organic Certification',
        category: 'health',
        logo: '/images/certificate-logo/USDA.png', // Replace with actual logo path
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
        id: 10,
        name: 'NON-GMO',
        fullName: 'Non-GMO Project Verified',
        category: 'health',
        logo: '/images/certificate-logo/NON.png', // Replace with real path to logo
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
        id: 11,
        name: 'Plastic Free',
        fullName: 'Plastic Free Certification',
        category: 'health',
        logo: '/images/certificate-logo/plastic.png', // Replace with actual logo path
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
        id: 12,
        name: 'Heavy Metal Free',
        fullName: 'Heavy Metal Free Claim (as verified by MADE SAFE® or equivalent)',
        category: 'health',
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
        id: 13,
        name: 'Vegan',
        fullName: 'Certified Vegan',
        category: 'health',
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
        id: 14,
        name: 'Gluten-Free',
        fullName: 'Gluten-Free Certification Organization (GFCO)',
        category: 'health',
        logo: '/images/certificate-logo/gluten.svg',
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
        verification: 'EPA reviews formulations and verifies compliance based on Safer Choice program data :contentReference[oaicite:1]{index=1}',
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
        verification: 'Typically self-certified; lab testing can confirm absence :contentReference[oaicite:2]{index=2}',
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
        verification: 'Self-reported; lab testing confirms surfactant absence :contentReference[oaicite:3]{index=3}',
        whyItMatters: 'Better for sensitive skin, color-treated hair, and reduces environmental impact.',
        brands: ['Herbal Essences sulfate-free shampoos (EWG Verified) :contentReference[oaicite:4]{index=4}'],
        learnMore: '',
        verifiedDate: '2024-01-01',
    },
    {
        id: 19,
        name: 'Plastic Free',
        fullName: 'Plastic Free Certification',
        category: 'personal',
        logo: '/images/certificate-logo/plastic.png',
        issuingOrg: 'A Plastic Planet & Control Union',
        description: 'Packaging and product components free from conventional fossil‑fuel plastics.',
        standards: ['🚫 No fossil-fuel-derived plastic', '🔬 Lab material verification', '♻️ Compostable or recyclable materials only'],
        verification: 'Control Union lab testing and audits :contentReference[oaicite:5]{index=5}',
        whyItMatters: 'Reduces plastic pollution and microplastics in personal-care products.',
        brands: ['Lush solid shampoo bars, Alima Pure'],
        learnMore: 'https://www.plasticfree.org/certification/',
        verifiedDate: '2024-01-15',
    },
    {
        id: 20,
        name: 'Vegan',
        fullName: 'Certified Vegan',
        category: 'personal',
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
        id: 21,
        name: 'Hypoallergenic',
        fullName: 'Hypoallergenic Claim',
        category: 'personal',
        logo: '/images/certificate-logo/hype.png',
        issuingOrg: 'Unregulated marketing claim',
        description: 'Implies fewer allergens, but has no regulated meaning or standard.',
        standards: ['🔍 Formulated to exclude common irritants', '🧪 May undergo patch testing', '❗ No legal requirements or benchmarks'],
        verification: 'Self-declared; some brands perform patch tests :contentReference[oaicite:6]{index=6}',
        whyItMatters: "Marketing term—may indicate gentler formulations but doesn't guarantee safety for allergic individuals.",
        brands: ['Cetaphil, Vanicream, La Roche-Posay'],
        learnMore: '',
        verifiedDate: '2024-06-01',
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
            '📋 Performance-tested (e.g., ≥80 % soil removal in household cleaners GS‑8)',
            '🔍 On-site audits + documentation review',
        ],
        verification:
            'Third-party data review, product testing, on-site audits; must comply with standards like GS‑8, GS‑34, GS‑37, etc. :contentReference[oaicite:1]{index=1}',
        whyItMatters:
            'Ensures cleaning products truly deliver safety, performance, and environmental responsibility—beyond greenwashed buzzwords. :contentReference[oaicite:2]{index=2}',
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
        verification:
            'EPA scientists review all intentionally added ingredients; annual audits and compliance with updated standards. :contentReference[oaicite:1]{index=1}',
        whyItMatters: 'Helps consumers and institutions identify thoroughly vetted safer home-cleaning solutions without sacrificing effectiveness.',
        brands: ['ECOS', 'Seventh Generation', 'Method'],
        learnMore: 'https://www.epa.gov/saferchoice',
        verifiedDate: '2024-08-08',
    },
    {
        id: 24,
        name: 'EWG Verified',
        fullName: 'EWG Verified®',
        category: 'cleaning',
        logo: '/images/certificate-logo/egw.png',
        issuingOrg: 'Environmental Working Group',
        description: 'Seal for products free of EWG’s chemicals of concern, with full ingredient disclosure and lifecycle evaluation.',
        standards: [
            "🚫 No ingredients on EWG's unacceptable/restricted lists",
            '📋 Full transparency in ingredients list',
            '✅ Safe across product lifecycle',
        ],
        verification: 'EWG scientists audit ingredients, labels, and manufacturing practices. :contentReference[oaicite:2]{index=2}',
        whyItMatters: 'Provides stronger consumer trust via transparent vetting against toxic chemical usage.',
        brands: ['Seventh Generation Free & Clear', 'Burt’s Bees'],
        learnMore: 'https://www.ewg.org/ewgverified/',
        verifiedDate: '2025-07-01',
    },
    {
        id: 25,
        name: 'Plastic Free',
        fullName: 'Plastic Free Certification',
        category: 'cleaning',
        logo: '/images/certificate-logo/plastic.png',
        issuingOrg: 'A Plastic Planet & Control Union',
        description: 'Seal ensuring no conventional plastic derived from fossil fuels is used in product or packaging.',
        standards: [
            '🚫 No fossil-fuel based plastics',
            '♻️ Use of compostable or recyclable alternatives',
            '🔬 Material lab testing for plastic detection',
            '📋 Supply chain transparency',
        ],
        verification: 'Lab material analysis and supply chain audits by Control Union. :contentReference[oaicite:3]{index=3}',
        whyItMatters: 'Reduces plastic waste and microplastic pollution from home-cleaning products.',
        brands: ['Blueland', 'Lush cleaning bars'],
        learnMore: 'https://www.plasticfree.org/certification/',
        verifiedDate: '2024-01-15',
    },
    // Kitchen Essentials
    {
        id: 26,
        name: 'Plastic Free',
        fullName: 'Plastic Free Certification',
        category: 'kitchen',
        logo: '/images/certificate-logo/plastic.png',
        issuingOrg: 'A Plastic Planet & Control Union',
        description: 'Seal ensuring no conventional plastic derived from fossil fuels is used in product or packaging.',
        standards: [
            '🚫 No fossil-fuel based plastics',
            '♻️ Use of compostable or recyclable alternatives',
            '🔬 Material lab testing for plastic detection',
            '📋 Supply chain transparency',
        ],
        verification: 'Lab material analysis and supply chain audits by Control Union. :contentReference[oaicite:1]{index=1}',
        whyItMatters: 'Reduces plastic waste and microplastic pollution from kitchen products.',
        brands: ['Blueland dishes & tablets', 'Notpla food wrappers'],
        learnMore: 'https://www.plasticfree.org/certification/',
        verifiedDate: '2024-01-15',
    },
    {
        id: 27,
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
        verification:
            'Guided by NSF 537: includes TOF lab tests, formulation review, and factory documentation audits. :contentReference[oaicite:2]{index=2}',
        whyItMatters: 'Prevents long-term PFAS exposure from cookware, food containers, and prep tools.',
        brands: ['GreenPan', 'Caraway', 'Our Place'],
        learnMore: 'https://www.nsf.org/news/nsf-introduces-pfas-free-certification',
        verifiedDate: '2025-03-24',
    },
    {
        id: 28,
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
        verification:
            'Third-party evaluation by MADE SAFE using proprietary banned substance database and deep toxicology screening. :contentReference[oaicite:3]{index=3}',
        whyItMatters: 'Guarantees your kitchen products are truly free from toxins—safe for use by families and children.',
        brands: ['Annmarie Kitchenware', 'Blissed Kitchen Tools'],
        learnMore: 'https://madesafe.org/',
        verifiedDate: '2025-07-24',
    },
    // Baby & Kids
    {
        id: 29,
        name: 'MADE SAFE',
        fullName: 'MADE SAFE® Certification',
        category: 'baby',
        logo: '/images/certificate-logo/metal.png',
        issuingOrg: 'MADE SAFE® / Nontoxic Certified',
        description:
            'Toxicant-screening certification ensuring products and materials are safe for human health and ecosystems, including baby & child items.',
        standards: [
            '❌ Bans over 15,000 known or suspected toxic chemicals',
            '🚫 No carcinogens, heavy metals, endocrine disruptors, VOCs, etc.',
            '🔍 Lifecycle screening of ingredients & packaging',
            '📋 Full material transparency and third-party review',
        ],
        verification:
            'Independent evaluation using a proprietary banned-substances database, with certification covering both product and lifecycle. :contentReference[oaicite:1]{index=1}',
        whyItMatters:
            'Ensures baby items—from cribs to skincare—are genuinely non-toxic, offering peace of mind for parents. :contentReference[oaicite:2]{index=2}',
        brands: ['Naturepedic', 'EllaOla Baby Massage Oil', 'Lullaby Earth'],
        learnMore: 'https://madesafe.org/collections/baby-child',
        verifiedDate: '2025-07-24',
    },
    {
        id: 30,
        name: 'GOTS Organic',
        fullName: 'Global Organic Textile Standard (GOTS)',
        category: 'baby',
        logo: '/images/certificate-logo/gots.png',
        issuingOrg: 'Global Organic Textile Standard',
        description: 'World-leading standard for organic fiber textiles, addressing ecological and social criteria across the entire supply chain.',
        standards: [
            '🌱 ≥95% certified organic fibers',
            '✅ No toxic chemicals, GMOs, synthetic pesticides',
            '⚖️ Social criteria: fair labor & working conditions',
            '🔍 Traceability from farm to finished product',
        ],
        verification:
            'Third-party certification with supply-chain audits, ingredient compliance, and documentation reviews. :contentReference[oaicite:3]{index=3}',
        whyItMatters:
            'Safeguards infants from harmful residues while supporting environmental and labor ethical standards. :contentReference[oaicite:4]{index=4}',
        brands: ['Hanna Andersson', 'Colored Organics', 'Mori'],
        learnMore: 'https://global-standard.org/',
        verifiedDate: '2025-02-15',
    },
    {
        id: 31,
        name: 'OEKO‑TEX STANDARD 100',
        fullName: 'OEKO‑TEX® STANDARD 100',
        category: 'baby',
        logo: '/images/certificate-logo/oeko.png',
        issuingOrg: 'OEKO‑TEX® Association',
        description: 'Textile safety certification ensuring baby & children’s fabrics are free from harmful substances.',
        standards: [
            '🧪 Tested for 1,000+ harmful chemicals including heavy metals and pesticides',
            '👶 Product Class I for infants—strictest limits applied',
            '📋 Portfolio-wide chemical screening by independent institutes',
            '🔍 On-site facility visits every 3 years',
        ],
        verification: 'Lab testing + annual audit and facility inspection per STANDARD 100 criteria. :contentReference[oaicite:5]{index=5}',
        whyItMatters: 'Reassures parents that clothes, bedding, and toys are safe for sensitive baby skin. :contentReference[oaicite:6]{index=6}',
        brands: ['Gunamuna baby clothes', 'Crane Baby bedding', 'Various OEKO‑TEX labeled items'],
        learnMore: 'https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100',
        verifiedDate: '2025-04-01',
    },
    {
        id: 32,
        name: 'GREENGUARD GOLD',
        fullName: 'UL GREENGUARD Gold Certification',
        category: 'baby',
        logo: '/images/certificate-logo/guard.png',
        issuingOrg: 'UL Environment',
        description:
            'Indoor air quality certification ensuring products meet strict chemical emissions limits, suitable for sensitive individuals including infants.',
        standards: [
            '🏠 Low VOC emissions tested over time',
            '✅ Safe for use in environments like schools & healthcare',
            '📋 Meets stringent VOC thresholds beyond standard GREENGUARD',
            '🧪 Chemical emissions testing in controlled chambers',
        ],
        verification:
            'Independent lab emissions testing and ongoing facility audits, with label use controlled via UL SPOT database. :contentReference[oaicite:7]{index=7}',
        whyItMatters:
            'Protects nurseries from off-gassing furniture and bedding, aiding infant respiratory health. :contentReference[oaicite:8]{index=8}',
        brands: ['DaVinci Baby cribs', 'Delta Children cribs', 'Lullaby Earth products'],
        learnMore: 'https://www.ul.com/resources/ul-greenguard-product-certification',
        verifiedDate: '2025-06-01',
    },
    {
        id: 33,
        name: 'FSC',
        fullName: 'Forest Stewardship Council Certification',
        category: 'baby',
        logo: '/images/certificate-logo/forest.png',
        issuingOrg: 'Forest Stewardship Council (FSC)',
        description:
            'Certification guaranteeing wood materials come from responsibly managed forests that respect environment, social, and economic standards.',
        standards: [
            '🌳 Chains-of-custody verified from forest to product',
            '✅ Protects biodiversity, prohibits illegal logging',
            '🛠️ Tracks fair labor and indigenous rights compliance',
            '📋 Annual audits and re-certification required',
        ],
        verification: 'Independent third-party audits of forest sources, processing, and tracking systems. :contentReference[oaicite:9]{index=9}',
        whyItMatters:
            'Ensures baby furniture & toys are sourced sustainably, supporting responsible forestry and reducing environmental impact. :contentReference[oaicite:10]{index=10}',
        brands: ['Naturepedic crib frames', 'DaVinci Baby furniture', 'HoneyBug baby walker'],
        learnMore: 'https://fsc.org/',
        verifiedDate: '2025-05-15',
    },
    // Clothing
    {
        id: 30,
        name: 'GOTS Organic',
        fullName: 'Global Organic Textile Standard (GOTS)',
        category: 'clothing',
        logo: '/images/certificate-logo/gots.png',
        issuingOrg: 'Global Organic Textile Standard (GOTS)',
        description:
            'World‑leading certification for organic textiles and apparel, covering environmental and social criteria across the entire supply chain.',
        standards: [
            '🌱 ≥95% certified organic fibers (70% minimum for "made with organic")',
            '🚫 No synthetic pesticides, GMOs, toxic auxiliaries or harmful dyes',
            '⚖️ Social criteria: fair labor, safe working conditions per ILO',
            '🔍 Chain‑of‑custody traceability from fiber to finished product',
        ],
        verification:
            'Third‑party certification bodies audit facilities, test inputs, review supply‑chain data and social compliance. :contentReference[oaicite:1]{index=1}',
        whyItMatters:
            'Avoids chemical residues, ensures fair labor, and supports sustainable farming and processing. :contentReference[oaicite:2]{index=2}',
        brands: ['Loomstate', 'Outland Denim', 'Colored Organics'],
        learnMore: 'https://www.global-standard.org/',
        verifiedDate: '2025-02-15',
    },
    {
        id: 31,
        name: 'OEKO‑TEX Standard 100',
        fullName: 'OEKO‑TEX® Standard 100',
        category: 'clothing',
        logo: '/images/certificate-logo/oeko.png',
        issuingOrg: 'OEKO‑TEX Association',
        description: 'Textile safety certification that tests every component (thread, button, fabric) for 1,000+ harmful substances.',
        standards: [
            '🧪 Tested against over 1,000 harmful chemicals including heavy metals, pesticides, carcinogens',
            '👶 Product-class I certified for infants and sensitive skin items',
            '📋 Updated testing limits annually per global regulations (e.g. REACH, CPSIA)',
        ],
        verification:
            'Independent lab testing of finished goods and components, plus annual limits review and audit. :contentReference[oaicite:3]{index=3}',
        whyItMatters: 'Provides strong assurance that textiles in contact with skin are safe—even for babies. :contentReference[oaicite:4]{index=4}',
        brands: ['Gunamuna baby clothes', 'Crane Baby bedding', 'Many mass-market brands'],
        learnMore: 'https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100',
        verifiedDate: '2025-04-01',
    },
    {
        id: 32,
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
            'Independent verification of bluesign criteria at every supply chain step, factory audits, and traceable material approval. :contentReference[oaicite:5]{index=5}',
        whyItMatters: 'Tight control over textile chemistry and resource impacts—not just finished product claims.',
        brands: ['Patagonia (some lines)', 'Adrenna', 'Outdoor apparel brands'],
        learnMore: 'https://www.bluesign.com/',
        verifiedDate: '2025-07-01',
    },
    {
        id: 33,
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
        verification:
            'Inspections by FLOCERT or Fair Trade USA; audits cover farms, factories, wages and use of premiums. :contentReference[oaicite:6]{index=6}',
        whyItMatters: 'Supports worker rights, community development, and ethical sourcing in apparel supply chains.',
        brands: ['Oliberté (shoes)', 'Fair Trade cotton apparel brands', 'Handcrafted textiles'],
        learnMore: 'https://www.fairtradecertified.org/',
        verifiedDate: '2025-06-01',
    },
    // Pet Care
    {
        id: 34,
        name: 'USDA Organic',
        fullName: 'USDA Organic Certification',
        category: 'pet',
        logo: '/images/certificate-logo/usda.png',
        issuingOrg: 'U.S. Department of Agriculture',
        description:
            'Indicates pet food and treats are made without synthetic fertilizers, GMOs, artificial preservatives, and meet organic production standards.',
        standards: [
            '🌿 No synthetic pesticides, fertilizers, or GMOs',
            '📋 Annual on-site inspections',
            '🐄 Organic animal feed and humane treatment',
            '🧼 Clean handling and processing methods',
        ],
        verification: 'Third-party audits via USDA-accredited certifiers verify compliance. :contentReference[oaicite:1]{index=1}',
        whyItMatters: 'Ensures cleaner, more natural ingredients in pet food, reducing exposure to agricultural chemicals.',
        brands: ['Castor & Pollux', 'Newman’s Own Organics Pet Food', 'Tender & True'],
        learnMore: 'https://www.usda.gov/topics/organic',
        verifiedDate: '2024-01-15',
    },
    {
        id: 35,
        name: 'OEKO‑TEX Standard 100',
        fullName: 'OEKO‑TEX® Standard 100',
        category: 'pet',
        logo: '/images/certificate-logo/oeko.png',
        issuingOrg: 'OEKO‑TEX Association',
        description: 'Certifies pet beds, apparel, and textiles are free from harmful substances based on rigorous chemical testing.',
        standards: [
            '🧪 Tested for 1,000+ chemicals including heavy metals and formaldehyde',
            '👶 Product Class I criteria applied for items with close animal contact',
            '📋 Independent lab testing and annual facility audits',
        ],
        verification:
            'Certified through lab tests on finished products and components plus yearly facility review. :contentReference[oaicite:2]{index=2}',
        whyItMatters: 'Reduces exposure to toxic chemicals for pets, especially for those with skin sensitivities.',
        brands: ['Kurgo dog beds', 'Barkbox blankets', 'Various OEKO‑TEX labeled pet items'],
        learnMore: 'https://www.oeko-tex.com/',
        verifiedDate: '2025-04-01',
    },
    {
        id: 36,
        name: 'GOTS Organic',
        fullName: 'Global Organic Textile Standard (GOTS)',
        category: 'pet',
        logo: '/images/certificate-logo/gots.png',
        issuingOrg: 'Global Organic Textile Standard (GOTS)',
        description: 'Ensures pet textile products are made from certified organic fibers and produced under ethical, sustainable practices.',
        standards: [
            '🌱 ≥95% certified organic fibers',
            '🚫 No toxic dyes, GMOs, or synthetic chemicals',
            '⚖️ Social criteria: fair labor and safe conditions',
            '🔍 Chain‑of‑custody tracking from fiber to finished item',
        ],
        verification: 'Third‑party audits of supply chains, fiber sources, and production facilities. :contentReference[oaicite:3]{index=3}',
        whyItMatters: 'Protects pets from chemical exposure and supports ethical and sustainable textile production.',
        brands: ['Coyuchi pet blankets', 'Avocado organic dog tees', 'Bella Bean baby & pet items'],
        learnMore: 'https://www.global-standard.org/',
        verifiedDate: '2025-02-15',
    },
    {
        id: 37,
        name: 'BPA Free',
        fullName: 'BPA‑Free Claim',
        category: 'pet',
        logo: '/images/certificate-logo/bpa.png',
        issuingOrg: 'No formal certifier (lab verification recommended)',
        description: 'Indicates that products such as bowls, water bottles, or toys are free from bisphenol A.',
        standards: ['❌ No BPA (typically confirmed via lab testing or material choice)', '🔍 Often uses plastic codes 1, 2, 4, 5 (PET, HDPE, PP)'],
        verification:
            'Consumers should check for third-party lab testing or confirm with manufacturers, as the term is unregulated. :contentReference[oaicite:4]{index=4}',
        whyItMatters: 'Reduces endocrine-disrupting chemical exposure in pets—especially from food and water containers.',
        brands: ['KONG Classic toys (BPA-free plastic)', 'PetSafe stainless bowls', 'Whisker City feeders'],
        learnMore: '',
        verifiedDate: '2024-11-01',
    },
    {
        id: 38,
        name: 'PFAS Free',
        fullName: 'PFAS‑Free Certification (Intertek)',
        category: 'pet',
        logo: '/images/certificate-logo/pfas.png',
        issuingOrg: 'Intertek PFAS-Free Program',
        description:
            'Certification indicating textiles, plastics, and packaging contain no intentionally added PFAS and meet strict PFAS content limits.',
        standards: [
            '🔬 Total Organic Fluorine (TOF) below detectable limit (~<20 ppm)',
            '❌ No intentional PFAS',
            '📋 Material audits plus manufacturer affidavits',
            '📅 Retesting and audits for ongoing compliance',
        ],
        verification: 'Intertek uses ISO‑accredited TOF testing and supply-chain audits to certify products. :contentReference[oaicite:5]{index=5}',
        whyItMatters:
            'Eliminates persistent “forever chemicals” in pet products that may accumulate indoors and harm pet health. :contentReference[oaicite:6]{index=6}',
        brands: ['Green Paper biodegradable pet waste bags', 'Earthwise compostable bowls', 'Selected pet bed lines'],
        learnMore: 'https://www.intertek.com/sustainability/certification/pfas-free/',
        verifiedDate: '2025-06-15',
    },
    // Home Textiles
    {
        id: 30,
        name: 'GOTS Organic',
        fullName: 'Global Organic Textile Standard (GOTS)',
        category: 'textiles',
        logo: '/images/certificate-logo/gots.png',
        issuingOrg: 'Global Organic Textile Standard (GOTS)',
        description:
            'World‑leading certification for organic textiles and apparel, covering environmental and social criteria across the entire supply chain.',
        standards: [
            '🌱 ≥70–95% certified organic fibers depending on label (“made with” vs “organic”)',
            '🚫 No toxic chemicals, GMOs, or synthetic pesticides',
            '⚖️ Social criteria: fair labor, safe working conditions per ILO',
            '🔍 Chain‑of‑custody traceability from fiber to finished product',
        ],
        verification:
            'Third‑party certification bodies audit supply chains, inspect facilities, and verify chemical compliance. :contentReference[oaicite:0search1]{index=1}',
        whyItMatters:
            'Ensures textiles are non-toxic, ethically made, and environmentally responsible from fiber to final product. :contentReference[oaicite:0search0]{index=2}',
        brands: ['Loomstate', 'Outland Denim', 'Colored Organics'],
        learnMore: 'https://www.global-standard.org/',
        verifiedDate: '2025-02-15',
    },
    {
        id: 31,
        name: 'OEKO‑TEX Standard 100',
        fullName: 'OEKO‑TEX® Standard 100',
        category: 'textiles',
        logo: '/images/certificate-logo/oeko.png',
        issuingOrg: 'OEKO‑TEX Association',
        description:
            'Textile safety certification testing finished textiles and all components for harmful substances (heavy metals, pesticides, formaldehyde, etc.).',
        standards: [
            '🧪 Tested for 1,000+ harmful substances with strict limit values',
            '👶 Different product classes—Class I applies to baby/kids items',
            '📋 Every thread, button, and accessory tested',
        ],
        verification: 'Independent lab testing and facility audits per STANDARD 100 protocol. :contentReference[oaicite:0search2]{index=3}',
        whyItMatters:
            'Provides assurance that textiles in contact with skin are free from toxic substances. :contentReference[oaicite:0news10]{index=4}',
        brands: ['Parachute bedding', 'Crane Baby towels', 'Various OEKO‑TEX products'],
        learnMore: 'https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100',
        verifiedDate: '2025-04-01',
    },
    {
        id: 32,
        name: 'Fair Trade',
        fullName: 'Fair Trade Certified (Fairtrade International / Fair Trade USA)',
        category: 'textiles',
        logo: '/images/certificate-logo/fair.png',
        issuingOrg: 'Fairtrade International / Fair Trade USA',
        description:
            'Guarantees apparel and home textiles are produced under fair labor conditions, with equitable pay and sustainable farming practices.',
        standards: [
            '🤝 Fair prices and premiums for producers',
            '👷‍♀️ No forced or child labor, safe workplaces, freedom of association',
            '📋 Environmental sustainability in farming and production',
            '🏭 Democratic decision-making and community investment',
        ],
        verification:
            'On-site audits by FLOCERT or Fair Trade USA monitor farms, factories, and cooperative practices. :contentReference[oaicite:0search3]{index=5}',
        whyItMatters: 'Promotes social justice, worker rights, and ethical sourcing in textile supply chains.',
        brands: ['Oliberté (shoes)', 'Handcrafted home textiles', 'Fair Trade cotton bedding'],
        learnMore: 'https://www.fairtradecertified.org/',
        verifiedDate: '2025-06-01',
    },
    // Air Purifiers
    {
        id: 39,
        name: 'TRUE HEPA',
        fullName: 'True HEPA Filter',
        category: 'air',
        logo: '/images/certificate-logo/hepa.png',
        issuingOrg: 'U.S. Department of Energy / UL',
        description: 'Indicates filter has been independently tested to meet or exceed DOE HEPA standard—99.97% removal of 0.3 µm particles.',
        standards: [
            '🧭 ≥99.97% efficiency for 0.3 µm particles',
            '🔬 Tested per DOE and ISO & IEST protocols',
            '✅ Independently verified by UL or DOE lab',
            '🚫 Not to be confused with “HEPA‑type/like/style” labels',
        ],
        verification:
            'Independent lab certification (DOE filter test, UL mark) confirms true HEPA performance. :contentReference[oaicite:1]{index=1}',
        whyItMatters:
            'Ensures high-quality air purification—blocks fine particles like pollen, smoke, pet dander, and even bacteria. :contentReference[oaicite:2]{index=2}',
        brands: ['Honeywell True HEPA units', 'Levoit Core 300', 'Medify H13 series'],
        learnMore: 'https://en.wikipedia.org/wiki/HEPA',
        verifiedDate: '2025-07-24',
    },
    // Water Filters
    {
        id: 40,
        name: 'NSF 177 Certified',
        fullName: 'NSF/ANSI 177 Shower & Faucet Filter Certification',
        category: 'water',
        logo: '/images/certificate-logo/nsf.png',
        issuingOrg: 'NSF International / IAPMO R&T',
        description:
            'Certification for point-of-use filters (e.g., showerheads, faucet units) guaranteeing reduction of free chlorine and structural performance.',
        standards: [
            '🚿 Reduces free available chlorine (FAC)',
            '📋 Ensures material safety, flow rate, structural integrity',
            '🔁 Uses independent lab testing (NSF/ANSI 177 protocol)',
        ],
        verification:
            'Verified by NSF or IAPMO R&T through lab tests and certification to NSF/ANSI 177 standards. :contentReference[oaicite:3]{index=3}',
        whyItMatters: 'Improves skin/hair health by reducing chlorine and ensuring filter reliability. :contentReference[oaicite:4]{index=4}',
        brands: ['Aquasana AQ‑4100 shower filter', 'Canopy Handheld Filtered Showerhead', 'Weddell Duo Shower Filter'],
        learnMore: 'https://info.nsf.org/Certified/dwtu/',
        verifiedDate: '2025-06-15',
    },
    // Office Supplies
    {
        id: 41,
        name: 'ASTM D‑4236',
        fullName: 'ASTM D‑4236 Labeling (LHAMA)',
        category: 'office',
        logo: '/images/certificate-logo/astm.png',
        issuingOrg: 'ASTM International / CPSC',
        description:
            'Standard practice requiring chronic health hazard labeling on art & craft materials to inform consumers of potential long-term risks.',
        standards: [
            '📋 Toxicologist-reviewed formulation every 5 years',
            '⚠️ Must include “Conforms to ASTM D‑4236” on label',
            '🧴 Specifies precautionary labeling content (e.g., “WARNING”, hazard statements)',
        ],
        verification:
            'Manufacturers must have toxicologist certs on file with CPSC; labels audited under LHAMA/Federal Hazardous Substances Act. :contentReference[oaicite:1]{index=1}',
        whyItMatters:
            'Helps users and parents recognize chronic health risks in office/art materials, encouraging safe use practices. :contentReference[oaicite:2]{index=2}',
        brands: ['Crayola crayons & markers', 'Faber-Castell art supplies', 'Prang watercolor sets'],
        learnMore: 'https://www.cpsc.gov/Business--Manufacturing/Labeling-Art-Materials',
        verifiedDate: '2025-01-01',
    },
    {
        id: 42,
        name: 'FSC',
        fullName: 'Forest Stewardship Council (FSC)',
        category: 'office',
        logo: '/images/certificate-logo/forest.png',
        issuingOrg: 'Forest Stewardship Council',
        description: 'Guarantees paper & wood products used in office supplies come from responsibly managed forests.',
        standards: [
            '🌲 Chain-of-custody tracking from forest to product',
            '🌍 Protects biodiversity and prohibits illegal logging',
            '👷‍♂️ Respects workers’ rights and indigenous communities',
            '📋 Requires annual audits and recertification',
        ],
        verification:
            'Independent third-party audits ensure forest management and traceability – FSC logo appears only on certified items. :contentReference[oaicite:3]{index=3}',
        whyItMatters: 'Promotes responsible forestry and reduces environmental footprint of office paper and wood products.',
        brands: ['FSC-certified printer paper', 'Sustainable notebooks', 'Eco binders'],
        learnMore: 'https://fsc.org/',
        verifiedDate: '2025-05-15',
    },
    {
        id: 43,
        name: 'Cradle to Cradle Certified',
        fullName: 'Cradle to Cradle Certified®',
        category: 'office',
        logo: '/images/certificate-logo/cradle.png',
        issuingOrg: 'Cradle to Cradle Products Innovation Institute',
        description: 'Multi-attribute certification evaluating material health, circularity, energy, water stewardship, and social fairness.',
        standards: [
            '🔄 Material health assessment and ban on harmful substances',
            '♻️ Product circularity and recyclability requirements',
            '🌞 Renewable energy & carbon footprint criteria',
            '💧 Water stewardship and social fairness metrics',
        ],
        verification:
            'Products audited and certified at one of four levels (Bronze–Platinum) by accredited bodies. :contentReference[oaicite:4]{index=4}',
        whyItMatters:
            'Encourages fully circular, safe, eco-friendly office supplies—and sets benchmark for sustainable manufacturing. :contentReference[oaicite:5]{index=5}',
        brands: ['Fellowes paper jams', 'Steelcase chairs', 'IPG Cradle to Cradle paper products'],
        learnMore: 'https://c2ccertified.org/',
        verifiedDate: '2025-07-01',
    },
    {
        id: 44,
        name: 'UL ECOLOGO®',
        fullName: 'UL ECOLOGO® Certification',
        category: 'office',
        logo: '/images/certificate-logo/ul.png',
        issuingOrg: 'UL Environment (Global Ecolabelling Network)',
        description: 'Multi-attribute ecolabel certifying reduced environmental and health impacts for office paper & supplies.',
        standards: [
            '⚙️ Life-cycle based criteria: raw materials to disposal',
            '🚫 Restricts toxic chemicals',
            '♻️ Encourages recycled content & sustainability',
            '📋 Requires third-party testing and annual audits',
        ],
        verification: 'ISO Type I ecolabel with UL-reviewed audits and scientific criteria. :contentReference[oaicite:6]{index=6}',
        whyItMatters: 'Helps buyers choose office supplies with verified environmental performance and reduced toxicity.',
        brands: ['Ecolabel printer paper', 'Sustainable envelopes', 'Green office folders'],
        learnMore: 'https://www.ul.com/services/ecologo-certification',
        verifiedDate: '2024-01-15',
    },
    // Beauty & Cosmetics
    {
        id: 45,
        name: 'PFAS Free',
        fullName: 'PFAS-Free Certification (Intertek)',
        category: 'beauty',
        logo: '/images/certificate-logo/pfas.png',
        issuingOrg: 'Intertek',
        description: 'Independently validated to contain no intentionally added PFAS, with ultra-low detection limits.',
        standards: [
            '🔬 Total Organic Fluorine (TOF) under detectable limit (~<20 ppm)',
            '❌ No intentionally added PFAS',
            '📋 Material data audits + manufacturer attestations',
            '📅 Ongoing retesting & production audits',
        ],
        verification:
            'Intertek uses ISO‑accredited TOF lab testing and supply-chain documentation review to certify PFAS absence. :contentReference[oaicite:1]{index=0}',
        whyItMatters:
            'Eliminates “forever chemicals” linked to hormone disruption and cancer—especially important in leave-on cosmetics. :contentReference[oaicite:2]{index=0}',
        brands: ['Credo Clean Beauty brands', 'Annmarie Skin Care', 'California Baby'],
        learnMore: 'https://www.intertek.com/sustainability/certification/pfas-free/',
        verifiedDate: '2025-06-01',
    },
    {
        id: 46,
        name: 'Phthalate Free',
        fullName: 'Phthalate‑Free Claim',
        category: 'beauty',
        logo: '/images/certificate-logo/late.png',
        issuingOrg: 'Industry-standard / self-declared',
        description: 'Products are formulated without common phthalate plasticizers (e.g., DBP, DEHP, DEP, BzBP).',
        standards: ['❌ No DBP, DEHP, DEP, BzBP', '✅ No hidden phthalates in fragrance'],
        verification: 'Typically self-declared; may include GC-MS lab testing upon request.',
        whyItMatters: 'Reduces exposure to endocrine-disrupting chemicals linked to reproductive issues. :contentReference[oaicite:3]{index=0}',
        brands: ['Beautycounter', 'Honest Beauty'],
        learnMore: '',
        verifiedDate: '2024-11-01',
    },
    {
        id: 47,
        name: 'Paraben Free',
        fullName: 'Paraben‑Free Claim',
        category: 'beauty',
        logo: '/images/certificate-logo/paraben.png',
        issuingOrg: 'Industry-standard / self-declared',
        description: 'Formulated without parabens (methyl-, ethyl-, propyl-, butyl-), addressing consumer concern over potential hormone disruption.',
        standards: ['❌ No methyl-, ethyl-, propyl-, butyl-parabens', '✅ Free of related endocrine-disrupting preservatives'],
        verification: 'Self-declared; some brands support with lab analyses. :contentReference[oaicite:3]{index=0}',
        whyItMatters: 'Mitigates consumer exposure to possible endocrine disruptors. :contentReference[oaicite:21]{index=0}',
        brands: ['RMS Beauty', 'Juice Beauty'],
        learnMore: '',
        verifiedDate: '2024-11-01',
    },
    {
        id: 48,
        name: 'Plastic Free',
        fullName: 'Plastic Free Certification',
        category: 'beauty',
        logo: '/images/certificate-logo/plastic.png',
        issuingOrg: 'A Plastic Planet & Control Union',
        description: 'Guarantees no conventional fossil-fuel plastics in packaging or product components.',
        standards: [
            '🚫 No fossil-fuel plastic',
            '🔬 Material lab testing',
            '♻️ Compostable or recyclable alternatives used',
            '📋 Supply-chain transparency audited',
        ],
        verification: 'Certified via material analysis and Control Union audits. :contentReference[oaicite:4]{index=0}',
        whyItMatters: 'Drastically reduces microplastic pollution from cosmetic packaging. :contentReference[oaicite:4]{index=0}',
        brands: ['Lush shampoo bars', 'Alima Pure'],
        learnMore: 'https://www.plasticfree.org/certification/',
        verifiedDate: '2024-01-15',
    },
    {
        id: 49,
        name: 'USDA Organic',
        fullName: 'USDA Organic Certification',
        category: 'beauty',
        logo: '/images/certificate-logo/usda.png',
        issuingOrg: 'U.S. Department of Agriculture',
        description: 'Certifies personal care ingredients/products made with organic farming practices under USDA standards.',
        standards: [
            '🌱 ≥95% organic ingredients ("100% organic" label)',
            '🚫 No synthetic fertilizers, GMOs, or irradiation',
            '📋 Strict production & handling protocols',
        ],
        verification: 'Annual USDA-accredited third‑party audits ensure compliance. :contentReference[oaicite:26]{index=0}',
        whyItMatters: 'Ensures reduced chemical exposure and transparency in ingredient sourcing. :contentReference[oaicite:26]{index=0}',
        brands: ['Aubrey Organics', 'Dr. Bronner’s soap'],
        learnMore: 'https://www.usda.gov/topics/organic',
        verifiedDate: '2024-01-15',
    },
    {
        id: 50,
        name: 'MADE SAFE',
        fullName: 'MADE SAFE® Certification',
        category: 'beauty',
        logo: '/images/certificate-logo/metal.png',
        issuingOrg: 'MADE SAFE® / Nontoxic Certified',
        description: 'Label for products and ingredients screened free of 15,000+ known or suspected toxicants.',
        standards: [
            '❌ Excludes heavy metals, endocrine disruptors, carcinogens, VOCs',
            '🔍 Ingredient + ecosystem health analysis',
            '📋 Transparent ingredient disclosure',
        ],
        verification: 'Independent screening by MADE SAFE team, using proprietary banned-substance database. :contentReference[oaicite:5]{index=0}',
        whyItMatters: 'Assures families that products are genuinely non-toxic across lifecycle. :contentReference[oaicite:5]{index=0}',
        brands: ['Beautycounter', 'Derma E'],
        learnMore: 'https://madesafe.org/',
        verifiedDate: '2025-07-24',
    },
    {
        id: 51,
        name: 'EWG Verified',
        fullName: 'EWG Verified®',
        category: 'beauty',
        logo: '/images/certificate-logo/egw.png',
        issuingOrg: 'Environmental Working Group',
        description: 'Seal for products that meet EWG’s strictest health and transparency criteria.',
        standards: [
            '🚫 No ingredients from EWG’s unacceptable/restricted lists',
            '📋 Full ingredient disclosure (including fragrance)',
            '✅ Must be "green" in Skin Deep® and follow good manufacturing practices',
        ],
        verification:
            'Product dossiers audited by EWG scientists; random product testing to ensure compliance. :contentReference[oaicite:6]{index=0}',
        whyItMatters: 'Helps consumers avoid toxic chemicals in personal care products. :contentReference[oaicite:21]{index=0}',
        brands: ['Beautycounter', 'MyChelle Dermaceuticals'],
        learnMore: 'https://www.ewg.org/ewgverified/',
        verifiedDate: '2015-12-06',
    },
    {
        id: 52,
        name: 'Vegan',
        fullName: 'Certified Vegan',
        category: 'beauty',
        logo: '/images/certificate-logo/vegan.png',
        issuingOrg: 'Vegan Action / Vegan Awareness Foundation',
        description: 'Certifies no animal ingredients or testing; cruelty‑free and vegan.',
        standards: [
            '❌ No animal ingredients or by‑products',
            '🐰 No animal testing (finished product or ingredients)',
            '📋 Supply‑chain verification for vegan status',
        ],
        verification: 'Audit of ingredient/lab testing records by Vegan Action; requires annual re‑certification.',
        whyItMatters: 'Supports ethical, cruelty‑free beauty and plant‑based lifestyles.',
        brands: ['Derma E', 'Pacifica'],
        learnMore: 'https://vegan.org/certification/',
        verifiedDate: '2024-01-15',
    },
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

interface CertificationLearningPageProps {
    harmfulContents?: any[];
}

export default function CertificationLearningPage({ harmfulContents = [] }: CertificationLearningPageProps) {
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
                                                                    <div
                                                                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-contain bg-center bg-no-repeat sm:h-16 sm:w-16 dark:border-[#2d2d35] dark:bg-[#2d2d35]"
                                                                        style={{ backgroundImage: `url(${prevCert.logo || '/placeholder.svg'})` }}
                                                                    />
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
                                                                    <div
                                                                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-contain bg-center bg-no-repeat sm:h-16 sm:w-16 dark:border-[#2d2d35] dark:bg-[#2d2d35]"
                                                                        style={{ backgroundImage: `url(${currentCert.logo || '/placeholder.svg'})` }}
                                                                    />

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
                                                                    <div
                                                                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-contain bg-center bg-no-repeat sm:h-16 sm:w-16 dark:border-[#2d2d35] dark:bg-[#2d2d35]"
                                                                        style={{ backgroundImage: `url(${nextCert.logo || '/placeholder.svg'})` }}
                                                                    />

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
                            <HarmfulIngredientsSection harmfulContents={harmfulContents || []} />
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
