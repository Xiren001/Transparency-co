'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice: number | null;
    image: string;
    images: string[];
    rating: number;
    isHot: boolean;
}

const featuredProducts: Product[] = [
    {
        id: 1,
        name: 'Coming Soon',
        price: 0.0,
        originalPrice: null,
        image: '/placeholder.svg?height=300&width=300',
        images: ['/placeholder.svg?height=400&width=400'],
        rating: 0,
        isHot: false,
    },
];

export default function FeaturedSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<(typeof featuredProducts)[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const toggleFavorite = (productId: number) => {
        setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
    };

    const handleProductClick = (product: (typeof featuredProducts)[0]) => {
        setSelectedProduct(product);
        setSelectedImageIndex(0); // Reset to first image when opening modal
        setIsModalOpen(true);
    };

    const handleImageSelect = (index: number) => {
        setSelectedImageIndex(index);
    };

    const scrollLeft = () => {
        const itemsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const scrollRight = () => {
        const itemsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
        setCurrentIndex((prev) => Math.min(featuredProducts.length - itemsPerView, prev + 1));
    };

    const getItemsPerView = () => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
        }
        return 4;
    };

    const canScrollRight = currentIndex < featuredProducts.length - getItemsPerView();

    const canScrollLeft = currentIndex > 0;

    return (
        <section className="rounded-lg bg-white py-4 dark:bg-[#1a1a1f]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-light text-gray-900 md:text-3xl dark:text-[#e0e0e5]">Featured</h2>

                    {/* Navigation Controls */}
                    <div className="flex items-center space-x-2">
                        {/* Pagination Dots */}
                        <div className="flex space-x-1">
                            {Array.from({ length: Math.ceil(featuredProducts.length / 4) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index * 4)}
                                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                        Math.floor(currentIndex / 4) === index ? 'bg-gray-800 dark:bg-[#e0e0e5]' : 'bg-gray-300 dark:bg-[#6b6b75]'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Arrow Controls */}
                        <div className="flex space-x-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={scrollLeft}
                                disabled={!canScrollLeft}
                                className="h-6 w-6 dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                            >
                                <ChevronLeft className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={scrollRight}
                                disabled={!canScrollRight}
                                className="h-6 w-6 dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                            >
                                <ChevronRight className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Products Container */}
                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * (window.innerWidth < 640 ? 100 : window.innerWidth < 1024 ? 50 : 25)}%)`,
                        }}
                    >
                        {featuredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="w-full flex-shrink-0 cursor-pointer px-1 sm:w-full sm:px-2 md:w-1/2 lg:w-1/4"
                                onClick={() => handleProductClick(product)}
                            >
                                <div className="group rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:bg-[#23232a] dark:hover:shadow-[#2d2d35]/50">
                                    {/* Product Image */}
                                    <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100 dark:bg-[#2d2d35]">
                                        <img
                                            src={product.image || '/placeholder.svg'}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />

                                        {/* Hot Badge */}
                                        {product.isHot && (
                                            <Badge className="absolute top-1.5 left-1.5 bg-red-500 px-1 py-0 text-[10px] text-white hover:bg-red-600 sm:top-2 sm:left-2 sm:px-1.5 sm:py-0.5 sm:text-xs">
                                                HOT
                                            </Badge>
                                        )}

                                        {/* See More Button - Full Width - Hover Only */}
                                        <div className="absolute right-0 bottom-0 left-0 bg-black/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                                            <button className="w-full px-2 py-1.5 text-xs font-medium tracking-wider text-white transition-colors duration-200 hover:bg-black/90 sm:px-3 sm:py-2 sm:text-sm">
                                                SEE MORE
                                            </button>
                                        </div>

                                        {/* Favorite Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(product.id);
                                            }}
                                            className="absolute top-1.5 right-1.5 rounded-full bg-white p-1 shadow-sm transition-all duration-200 hover:shadow-md sm:top-2 sm:right-2 sm:p-1.5 dark:bg-[#23232a]"
                                        >
                                            <Heart
                                                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                                                    favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-[#6b6b75]'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-2 sm:p-3">
                                        {/* Rating */}
                                        <div className="mb-1 flex items-center">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <Star
                                                    key={index}
                                                    className={`h-3 w-3 ${
                                                        index < product.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300 dark:text-[#6b6b75]'
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Product Name */}
                                        <h3 className="mb-1 line-clamp-2 text-sm font-medium text-gray-900 dark:text-[#e0e0e5]">{product.name}</h3>

                                        {/* Price */}
                                        <div className="flex items-center space-x-1">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-[#e0e0e5]">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-xs text-gray-500 line-through dark:text-[#b8b8c0]">
                                                    ${product.originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Scroll Indicator */}
                <div className="mt-2 text-center text-xs text-gray-500 md:hidden dark:text-[#b8b8c0]">Swipe to see more products</div>
            </div>

            {/* Product Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-h-[90vh] w-full !max-w-7xl overflow-y-auto dark:bg-[#1a1a1f] dark:text-[#e0e0e5]">
                    {selectedProduct && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-light dark:text-[#e0e0e5]">{selectedProduct.name}</DialogTitle>
                                <DialogDescription className="dark:text-[#b8b8c0]">
                                    Premium quality product with excellent craftsmanship
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-6 grid gap-6 md:grid-cols-2">
                                {/* Product Image Gallery */}
                                <div className="space-y-4">
                                    {/* Main Image */}
                                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-[#23232a]">
                                        <img
                                            src={selectedProduct.images[selectedImageIndex] || '/placeholder.svg'}
                                            alt={`${selectedProduct.name} view ${selectedImageIndex + 1}`}
                                            className="h-full w-full object-cover transition-opacity duration-300"
                                        />
                                    </div>

                                    {/* Thumbnail Gallery */}
                                    <div className="flex space-x-2">
                                        {selectedProduct.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleImageSelect(index)}
                                                className={`h-16 w-16 rounded border-2 bg-gray-100 transition-all duration-200 dark:bg-[#23232a] ${
                                                    selectedImageIndex === index
                                                        ? 'border-primary ring-primary/20 ring-2'
                                                        : 'border-transparent hover:border-gray-300 dark:hover:border-[#3d3d45]'
                                                }`}
                                            >
                                                <img
                                                    src={image || '/placeholder.svg'}
                                                    alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                                                    className="h-full w-full rounded object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    {/* Image Counter */}
                                    <div className="text-center text-sm text-gray-500 dark:text-[#b8b8c0]">
                                        {selectedImageIndex + 1} of {selectedProduct.images.length}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="space-y-6">
                                    {/* Rating */}
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <Star
                                                    key={index}
                                                    className={`h-5 w-5 ${
                                                        index < selectedProduct.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300 dark:text-[#6b6b75]'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-[#b8b8c0]">(127 reviews)</span>
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-3xl font-semibold text-gray-900 dark:text-[#e0e0e5]">
                                                ${selectedProduct.price.toFixed(2)}
                                            </span>
                                            {selectedProduct.originalPrice && (
                                                <span className="text-xl text-gray-500 line-through dark:text-[#b8b8c0]">
                                                    ${selectedProduct.originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                            {selectedProduct.isHot && <Badge className="bg-red-500 text-white">HOT</Badge>}
                                        </div>
                                        {selectedProduct.originalPrice && (
                                            <p className="text-sm text-green-600 dark:text-green-400">
                                                Save ${(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)}(
                                                {Math.round(
                                                    ((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100,
                                                )}
                                                % off)
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-gray-900 dark:text-[#e0e0e5]">Description</h3>
                                        <p className="leading-relaxed text-gray-600 dark:text-[#b8b8c0]">--</p>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-gray-900 dark:text-[#e0e0e5]">Key Features</h3>
                                        <ul className="space-y-2 text-gray-600 dark:text-[#b8b8c0]">
                                            <li className="flex items-center space-x-2">
                                                <div className="bg-primary h-1.5 w-1.5 rounded-full"></div>
                                                <span>--</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <div className="bg-primary h-1.5 w-1.5 rounded-full"></div>
                                                <span>--</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <div className="bg-primary h-1.5 w-1.5 rounded-full"></div>
                                                <span>--</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Buy Now Button */}
                                    <div className="space-y-4">
                                        <a href="" target="_blank" rel="noopener noreferrer" className="block">
                                            <Button className="w-full py-3 text-lg font-medium dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]">
                                                Buy Now
                                            </Button>
                                        </a>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="space-y-2 border-t border-gray-200 pt-4 text-sm text-gray-600 dark:border-[#2d2d35] dark:text-[#b8b8c0]">
                                        <p>
                                            <span className="font-medium dark:text-[#e0e0e5]">SKU:</span> --
                                        </p>
                                        <p>
                                            <span className="font-medium dark:text-[#e0e0e5]">Category:</span> --
                                        </p>
                                        <p>
                                            <span className="font-medium dark:text-[#e0e0e5]">Shipping:</span> --
                                        </p>
                                        <p>
                                            <span className="font-medium dark:text-[#e0e0e5]">Return Policy:</span> --
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
}
