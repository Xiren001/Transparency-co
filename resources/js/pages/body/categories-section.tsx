'use client';

import { Baby, ChefHat, Heart, Home, PawPrint, Recycle, Shirt, Sparkles, Utensils } from 'lucide-react';

const categories = [
    {
        id: 'food-beverage',
        name: 'FOOD & BEVERAGE',
        icon: Utensils,
        href: '/categories/food-beverage',
    },
    {
        id: 'health-wellness',
        name: 'HEALTH & WELLNESS',
        icon: Heart,
        href: '/categories/health-wellness',
    },
    {
        id: 'personal-care',
        name: 'PERSONAL CARE',
        icon: Sparkles,
        href: '/categories/personal-care',
    },
    {
        id: 'home-cleaning',
        name: 'HOME CLEANING',
        icon: Home,
        href: '/categories/home-cleaning',
    },
    {
        id: 'kitchen-essentials',
        name: 'KITCHEN ESSENTIALS',
        icon: ChefHat,
        href: '/categories/kitchen-essentials',
    },
    {
        id: 'baby-kids',
        name: 'BABY & KIDS',
        icon: Baby,
        href: '/categories/baby-kids',
    },
    {
        id: 'clothing-textiles',
        name: 'CLOTHING & TEXTILES',
        icon: Shirt,
        href: '/categories/clothing-textiles',
    },
    {
        id: 'sustainable-living',
        name: 'SUSTAINABLE LIVING',
        icon: Recycle,
        href: '/categories/sustainable-living',
    },
    {
        id: 'pet-care',
        name: 'PET CARE',
        icon: PawPrint,
        href: '/categories/pet-care',
    },
];

export default function CategoriesSection() {
    const handleCategoryClick = (category: (typeof categories)[0]) => {
        console.log(`Clicked on ${category.name}`);
        // You can replace this with your routing logic
        window.location.href = category.href;
    };

    return (
        <section className="rounded-lg bg-gray-50 py-16 dark:bg-[#1a1a1f]">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <h2 className="mb-12 text-center text-3xl font-light tracking-wide text-gray-900 md:text-4xl dark:text-[#e0e0e5]">
                    Browse by Categories
                </h2>

                {/* Categories Grid */}
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
                    {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <div
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                className="group flex cursor-pointer flex-col items-center rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:bg-[#23232a] dark:hover:shadow-[#2d2d35]/50"
                            >
                                {/* Icon */}
                                <div className="group-hover:bg-primary/10 dark:group-hover:bg-primary/20 mb-3 rounded-full bg-gray-100 p-3 transition-colors duration-300 dark:bg-[#2d2d35]">
                                    <IconComponent className="group-hover:text-primary h-8 w-8 text-gray-700 transition-colors duration-300 dark:text-[#e0e0e5]" />
                                </div>

                                {/* Category Name */}
                                <span className="group-hover:text-primary text-center text-xs leading-tight font-medium text-gray-800 transition-colors duration-300 dark:text-[#e0e0e5]">
                                    {category.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
