'use client';

import { categories } from '@/constants/categories';
import { Baby, Bath, BedDouble, Briefcase, Droplets, Heart, Home, PawPrint, Shirt, Smartphone, Sparkles, Utensils } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Map of category IDs to their icons
const categoryIcons: { [key: string]: React.ElementType } = {
    'food-beverage': Utensils,
    'health-wellness': Heart,
    'personal-care': Bath,
    'home-cleaning': Droplets,
    'kitchen-essentials': Home,
    'baby-kids': Baby,
    clothing: Shirt,
    'pet-care': PawPrint,
    'home-textiles': BedDouble,
    'air-purifiers': Smartphone,
    'water-filters': Droplets,
    'office-supplies': Briefcase,
    'beauty-cosmetics': Sparkles,
};

interface SubCategoryCounts {
    [key: string]: number;
}

interface ItemCounts {
    [key: string]: number;
}

export default function CategoriesSection() {
    const [currentCategory, setCurrentCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [subCategoryCounts, setSubCategoryCounts] = useState<SubCategoryCounts>({});
    const [itemCounts, setItemCounts] = useState<ItemCounts>({});
    const [showSubcategories, setShowSubcategories] = useState(false);
    const [showItems, setShowItems] = useState(false);
    const [renderedSubCategories, setRenderedSubCategories] = useState<any[]>([]);
    const [renderedItems, setRenderedItems] = useState<string[]>([]);

    // Initialize category from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoryFromUrl = params.get('category');
        const subCategoryFromUrl = params.get('sub_category');
        const itemFromUrl = params.get('item');

        setCurrentCategory(categoryFromUrl);
        setSelectedSubCategory(subCategoryFromUrl);
        setSelectedItem(itemFromUrl);

        return () => {
            setCurrentCategory(null);
            setSelectedSubCategory(null);
            setSelectedItem(null);
        };
    }, []);

    // Fetch sub-category counts when category changes
    useEffect(() => {
        let isMounted = true;

        if (currentCategory) {
            const params = new URLSearchParams();
            params.append('category', currentCategory);

            fetch(`/api/products/filter?${params.toString()}`)
                .then((response) => response.json())
                .then((data) => {
                    if (isMounted) {
                        setSubCategoryCounts(data.sub_category_counts || {});
                    }
                })
                .catch((error) => {
                    console.error('Error fetching sub-category counts:', error);
                });
        } else {
            setSubCategoryCounts({});
        }

        return () => {
            isMounted = false;
        };
    }, [currentCategory]);

    // Fetch item counts when subcategory changes
    useEffect(() => {
        let isMounted = true;

        if (selectedSubCategory) {
            const params = new URLSearchParams();
            params.append('category', currentCategory || '');
            params.append('sub_category', selectedSubCategory);

            fetch(`/api/products/filter?${params.toString()}`)
                .then((response) => response.json())
                .then((data) => {
                    if (isMounted) {
                        setItemCounts(data.item_counts || {});
                    }
                })
                .catch((error) => {
                    console.error('Error fetching item counts:', error);
                });
        } else {
            setItemCounts({});
        }

        return () => {
            isMounted = false;
        };
    }, [selectedSubCategory, currentCategory]);

    const handleCategoryClick = useCallback(
        (category: string) => {
            const params = new URLSearchParams(window.location.search);

            if (currentCategory === category) {
                params.delete('category');
                params.delete('sub_category');
                params.delete('item');
                setCurrentCategory(null);
                setSelectedSubCategory(null);
                setSelectedItem(null);
            } else {
                params.set('category', category);
                params.delete('sub_category');
                params.delete('item');
                setCurrentCategory(category);
                setSelectedSubCategory(null);
                setSelectedItem(null);
            }

            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
            window.dispatchEvent(new Event('categoryChanged'));
        },
        [currentCategory],
    );

    const handleSubCategoryClick = useCallback(
        (subCategory: string) => {
            const params = new URLSearchParams(window.location.search);

            if (selectedSubCategory === subCategory) {
                params.delete('sub_category');
                params.delete('item');
                setSelectedSubCategory(null);
                setSelectedItem(null);
            } else {
                params.set('sub_category', subCategory);
                params.delete('item');
                setSelectedSubCategory(subCategory);
                setSelectedItem(null);
            }

            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
            window.dispatchEvent(new Event('categoryChanged'));
        },
        [selectedSubCategory],
    );

    const handleItemClick = useCallback(
        (item: string) => {
            const params = new URLSearchParams(window.location.search);

            if (selectedItem === item) {
                params.delete('item');
                setSelectedItem(null);
            } else {
                params.set('item', item);
                setSelectedItem(item);

                // Enhanced smooth scroll animation
                setTimeout(() => {
                    const productCatalogSection = document.querySelector('.product-catalog-section');
                    if (productCatalogSection) {
                        const targetPosition = productCatalogSection.getBoundingClientRect().top + window.pageYOffset;
                        const startPosition = window.pageYOffset;
                        const distance = targetPosition - startPosition;
                        const duration = 1000; // 1 second duration
                        let start: number | null = null;

                        function animation(currentTime: number) {
                            if (start === null) start = currentTime;
                            const timeElapsed = currentTime - start;
                            const progress = Math.min(timeElapsed / duration, 1);

                            // Easing function for smooth acceleration and deceleration
                            const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

                            window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

                            if (timeElapsed < duration) {
                                requestAnimationFrame(animation);
                            }
                        }

                        requestAnimationFrame(animation);
                    }
                }, 100);
            }

            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
            window.dispatchEvent(new Event('categoryChanged'));
        },
        [selectedItem],
    );

    // Get current category's sub-categories
    const currentCategoryData = currentCategory ? categories.find((cat) => cat.id === currentCategory) : null;
    const currentSubCategoryData =
        selectedSubCategory && currentCategoryData ? currentCategoryData.subCategories.find((sub) => sub.id === selectedSubCategory) : null;

    // Effect to control subcategory animation and content rendering
    useEffect(() => {
        if (currentCategory && currentCategoryData?.subCategories) {
            setRenderedSubCategories(currentCategoryData.subCategories);
            const timer = setTimeout(() => setShowSubcategories(true), 100);
            return () => clearTimeout(timer);
        } else {
            setShowSubcategories(false);
            const timer = setTimeout(() => setRenderedSubCategories([]), 700);
            return () => clearTimeout(timer);
        }
    }, [currentCategory, currentCategoryData]);

    // Effect to control items animation and content rendering
    useEffect(() => {
        if (selectedSubCategory && currentSubCategoryData?.items) {
            setRenderedItems(currentSubCategoryData.items);
            const timer = setTimeout(() => setShowItems(true), 100);
            return () => clearTimeout(timer);
        } else {
            setShowItems(false);
            const timer = setTimeout(() => setRenderedItems([]), 700);
            return () => clearTimeout(timer);
        }
    }, [selectedSubCategory, currentSubCategoryData]);

    // Function to format count display
    const formatCount = (count: number): string => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return count.toString();
    };

    return (
        <section className="rounded-lg bg-gray-50 bg-white pt-12 dark:bg-[#121212]">
            <div className="container mx-auto px-0">
                {/* Section Title */}
                <h2 className="mb-8 text-center text-xl font-light tracking-wide text-gray-900 sm:text-3xl md:text-4xl dark:text-[#e0e0e5]">
                    Browse by Categories
                </h2>

                {/* Categories Grid */}
                <div className="mx-auto max-w-7xl">
                    {/* Mobile Swipeable Categories */}
                    <div className="flex overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
                        <div className="flex gap-3 p-4">
                            {categories.map((category) => {
                                const IconComponent = categoryIcons[category.id];
                                const isSelected = currentCategory === category.id;
                                return (
                                    <div
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.id)}
                                        className={`group flex w-[90px] flex-shrink-0 cursor-pointer flex-col items-center rounded-lg bg-white p-2 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:bg-[#282828] dark:hover:shadow-[#2d2d35]/50 ${
                                            isSelected ? 'ring-primary ring-2' : ''
                                        }`}
                                    >
                                        {/* Icon */}
                                        <div
                                            className={`group-hover:bg-primary/10 dark:group-hover:bg-primary/20 mb-2 rounded-full p-2 transition-colors duration-300 ${
                                                isSelected ? 'bg-primary/10 dark:bg-primary/20' : 'bg-gray-100 dark:bg-[#121212]'
                                            }`}
                                        >
                                            <IconComponent
                                                className={`group-hover:text-primary h-6 w-6 transition-colors duration-300 ${
                                                    isSelected ? 'text-primary' : 'text-gray-700 dark:text-[#6298F0]'
                                                }`}
                                            />
                                        </div>

                                        {/* Category Name */}
                                        <span
                                            className={`group-hover:text-primary text-center text-[10px] leading-tight font-medium transition-colors duration-300 ${
                                                isSelected ? 'text-primary' : 'text-gray-800 dark:text-[#e0e0e5]'
                                            }`}
                                        >
                                            {category.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Desktop Categories Grid */}
                    <div className="hidden grid-cols-2 gap-6 sm:grid md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
                        {categories.map((category) => {
                            const IconComponent = categoryIcons[category.id];
                            const isSelected = currentCategory === category.id;
                            return (
                                <div
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className={`group flex cursor-pointer flex-col items-center rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:bg-[#282828] dark:hover:shadow-[#2d2d35]/50 ${
                                        isSelected ? 'ring-primary ring-2' : ''
                                    }`}
                                >
                                    {/* Icon */}
                                    <div
                                        className={`group-hover:bg-primary/10 dark:group-hover:bg-primary/20 mb-3 rounded-full p-3 transition-colors duration-300 ${
                                            isSelected ? 'bg-primary/10 dark:bg-primary/20' : 'bg-gray-100 dark:bg-[#121212]'
                                        }`}
                                    >
                                        <IconComponent
                                            className={`group-hover:text-primary h-8 w-8 transition-colors duration-300 ${
                                                isSelected ? 'text-primary' : 'text-gray-700 dark:text-[#6298F0]'
                                            }`}
                                        />
                                    </div>

                                    {/* Category Name */}
                                    <span
                                        className={`group-hover:text-primary text-center text-xs leading-tight font-medium transition-colors duration-300 ${
                                            isSelected ? 'text-primary' : 'text-gray-800 dark:text-[#e0e0e5]'
                                        }`}
                                    >
                                        {category.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sub Categories */}
                <div
                    className={`transition-all duration-700 ease-in-out ${showSubcategories ? 'mt-6 max-h-screen opacity-100 sm:mt-8' : 'mt-0 max-h-0 overflow-hidden opacity-0'}`}
                >
                    <div className={`transition-opacity duration-500 ease-in-out ${showSubcategories ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="mx-auto max-w-7xl">
                            <h3 className="mb-3 text-center text-base font-medium text-gray-900 sm:mb-4 sm:text-lg dark:text-[#e0e0e5]">
                                Filter by {currentCategoryData?.name}
                            </h3>
                            {/* Mobile Swipeable Subcategories */}
                            <div className="flex overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
                                <div className="flex gap-3 p-4">
                                    {renderedSubCategories.map((subCategory) => (
                                        <div
                                            key={subCategory.id}
                                            onClick={() => handleSubCategoryClick(subCategory.id)}
                                            className={`group relative flex w-[90px] flex-shrink-0 cursor-pointer flex-col items-center rounded-lg bg-white p-2 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:bg-[#282828] dark:hover:shadow-[#2d2d35]/50 ${
                                                selectedSubCategory === subCategory.id ? 'ring-primary ring-2' : ''
                                            }`}
                                        >
                                            {/* Counter Badge */}
                                            <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 dark:bg-[#2d2d35] dark:text-[#e0e0e5] dark:ring-[#3d3d45]">
                                                {subCategoryCounts[subCategory.id] || 0}
                                            </div>

                                            {/* Subcategory Name */}
                                            <span
                                                className={`group-hover:text-primary text-center text-[10px] leading-tight font-medium transition-colors duration-300 ${
                                                    selectedSubCategory === subCategory.id ? 'text-primary' : 'text-gray-800 dark:text-[#e0e0e5]'
                                                }`}
                                            >
                                                {subCategory.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop Subcategories */}
                            <div className="hidden grid-cols-2 gap-4 sm:grid md:grid-cols-3 lg:grid-cols-5">
                                {renderedSubCategories.map((subCategory) => (
                                    <div
                                        key={subCategory.id}
                                        onClick={() => handleSubCategoryClick(subCategory.id)}
                                        className={`group relative flex cursor-pointer flex-col items-center rounded-lg bg-white p-3 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:bg-[#282828] dark:hover:shadow-[#2d2d35]/50 ${
                                            selectedSubCategory === subCategory.id ? 'ring-primary ring-2' : ''
                                        }`}
                                    >
                                        {/* Counter Badge */}
                                        <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 dark:bg-[#2d2d35] dark:text-[#e0e0e5] dark:ring-[#3d3d45]">
                                            {subCategoryCounts[subCategory.id] || 0}
                                        </div>

                                        {/* Subcategory Name */}
                                        <span
                                            className={`group-hover:text-primary text-center text-xs leading-tight font-medium transition-colors duration-300 ${
                                                selectedSubCategory === subCategory.id ? 'text-primary' : 'text-gray-800 dark:text-[#e0e0e5]'
                                            }`}
                                        >
                                            {subCategory.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div
                    className={`transition-all duration-700 ease-in-out ${showItems ? 'mt-6 max-h-screen opacity-100 sm:mt-8' : 'mt-0 max-h-0 overflow-hidden opacity-0'}`}
                >
                    <div className={`transition-opacity duration-500 ease-in-out ${showItems ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="mx-auto max-w-7xl">
                            <h3 className="mb-3 text-center text-base font-medium text-gray-900 sm:mb-4 sm:text-lg dark:text-[#e0e0e5]">
                                {currentSubCategoryData?.name}
                            </h3>
                            {/* Mobile Swipeable Items */}
                            <div className="flex overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
                                <div className="flex gap-3 p-4">
                                    {renderedItems.map((item) => (
                                        <div
                                            key={item}
                                            onClick={() => handleItemClick(item)}
                                            className={`group relative flex w-[90px] flex-shrink-0 cursor-pointer flex-col items-center rounded-lg bg-white p-2 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:bg-[#282828] dark:hover:shadow-[#2d2d35]/50 ${
                                                selectedItem === item ? 'ring-primary ring-2' : ''
                                            }`}
                                        >
                                            {/* Counter Badge */}
                                            <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 dark:bg-[#2d2d35] dark:text-[#e0e0e5] dark:ring-[#3d3d45]">
                                                {formatCount(itemCounts[item] || 0)}
                                            </div>

                                            {/* Item Name */}
                                            <span
                                                className={`group-hover:text-primary text-center text-[10px] leading-tight font-medium transition-colors duration-300 ${
                                                    selectedItem === item ? 'text-primary' : 'text-gray-800 dark:text-[#e0e0e5]'
                                                }`}
                                            >
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop Items */}
                            <div className="hidden grid-cols-2 gap-4 sm:grid md:grid-cols-3 lg:grid-cols-5">
                                {renderedItems.map((item) => (
                                    <div
                                        key={item}
                                        onClick={() => handleItemClick(item)}
                                        className={`group relative flex cursor-pointer flex-col items-center rounded-lg bg-white p-3 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:bg-[#282828] dark:hover:shadow-[#2d2d35]/50 ${
                                            selectedItem === item ? 'ring-primary ring-2' : ''
                                        }`}
                                    >
                                        {/* Counter Badge */}
                                        <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 dark:bg-[#2d2d35] dark:text-[#e0e0e5] dark:ring-[#3d3d45]">
                                            {formatCount(itemCounts[item] || 0)}
                                        </div>

                                        {/* Item Name */}
                                        <span
                                            className={`group-hover:text-primary text-center text-xs leading-tight font-medium transition-colors duration-300 ${
                                                selectedItem === item ? 'text-primary' : 'text-gray-800 dark:text-[#e0e0e5]'
                                            }`}
                                        >
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
