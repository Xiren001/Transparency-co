'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Grid2X2, Grid3X3, Heart, List, Star } from 'lucide-react';
import React, { useState } from 'react';

const certificates = [
    'ALL CERTIFICATE',
    'PLASTIC FREE',
    'USDA ORGANIC',
    'NON-GMO',
    'FRAGRANCE FREE',
    'PALM OIL FREE',
    'BIODEGRADABLE',
    'FAIR TRADE',
    'REUSABLE',
    'COMPOSTABLE',
];

const priceRanges = [
    { label: 'ALL PRICE', value: 'all' },
    { label: '$0.00 - $9.99', value: '0-9.99' },
    { label: '$100.00 - $199.99', value: '100-199.99' },
    { label: '$200.00 - $299.99', value: '200-299.99' },
    { label: '$300.00 - $399.99', value: '300-399.99' },
    { label: '$400.00+', value: '400+' },
];

const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Selling', 'Customer Rating'];

const allProducts = [
    {
        id: 1,
        name: 'Bamboo Storage Containers',
        price: 199.0,
        originalPrice: 249.0,
        image: '/placeholder.svg?height=300&width=300',
        images: [
            '/placeholder.svg?height=400&width=400',
            '/placeholder.svg?height=400&width=400&text=Side+View',
            '/placeholder.svg?height=400&width=400&text=Top+View',
            '/placeholder.svg?height=400&width=400&text=Detail+View',
        ],
        rating: 5,
        isNew: true,
        category: 'storage',
        certificates: ['PLASTIC FREE', 'BIODEGRADABLE'],
    },
    {
        id: 2,
        name: 'Wooden Coaster Collection',
        price: 599.0,
        originalPrice: 699.0,
        image: '/placeholder.svg?height=300&width=300',
        images: [
            '/placeholder.svg?height=400&width=400',
            '/placeholder.svg?height=400&width=400&text=Stack+View',
            '/placeholder.svg?height=400&width=400&text=Pattern+Detail',
            '/placeholder.svg?height=400&width=400&text=Set+Layout',
        ],
        rating: 5,
        isNew: true,
        category: 'dining',
        certificates: ['PLASTIC FREE', 'USDA ORGANIC'],
    },
    {
        id: 3,
        name: 'Bamboo Kitchen Utensil Set',
        price: 19.0,
        originalPrice: null,
        image: '/placeholder.svg?height=300&width=300',
        images: [
            '/placeholder.svg?height=400&width=400',
            '/placeholder.svg?height=400&width=400&text=Utensils+Spread',
            '/placeholder.svg?height=400&width=400&text=Handle+Detail',
            '/placeholder.svg?height=400&width=400&text=In+Use',
        ],
        rating: 5,
        isNew: true,
        category: 'kitchen',
        certificates: ['PLASTIC FREE', 'BIODEGRADABLE', 'FAIR TRADE'],
    },
    {
        id: 4,
        name: 'Wooden Cutting Board Set',
        price: 89.99,
        originalPrice: null,
        image: '/placeholder.svg?height=300&width=300',
        images: [
            '/placeholder.svg?height=400&width=400',
            '/placeholder.svg?height=400&width=400&text=Set+View',
            '/placeholder.svg?height=400&width=400&text=Individual+Board',
            '/placeholder.svg?height=400&width=400&text=Wood+Grain',
        ],
        rating: 5,
        isNew: true,
        category: 'kitchen',
        certificates: ['PLASTIC FREE', 'USDA ORGANIC'],
    },
    {
        id: 5,
        name: 'Eco-Friendly Storage Boxes',
        price: 19.99,
        originalPrice: null,
        image: '/placeholder.svg?height=300&width=300',
        images: [
            '/placeholder.svg?height=400&width=400',
            '/placeholder.svg?height=400&width=400&text=Stacked+View',
            '/placeholder.svg?height=400&width=400&text=Open+Box',
            '/placeholder.svg?height=400&width=400&text=Material+Detail',
        ],
        rating: 5,
        isNew: true,
        category: 'storage',
        certificates: ['PLASTIC FREE', 'BIODEGRADABLE', 'COMPOSTABLE'],
    },
    {
        id: 6,
        name: 'Sustainable Kitchen Tools',
        price: 39.0,
        originalPrice: null,
        image: '/placeholder.svg?height=300&width=300',
        images: [
            '/placeholder.svg?height=400&width=400',
            '/placeholder.svg?height=400&width=400&text=Tool+Collection',
            '/placeholder.svg?height=400&width=400&text=Material+Close-up',
            '/placeholder.svg?height=400&width=400&text=Kitchen+Setup',
        ],
        rating: 5,
        isNew: true,
        category: 'kitchen',
        certificates: ['PLASTIC FREE', 'FAIR TRADE'],
    },
    {
        id: 7,
        name: 'Natural Fiber Coasters',
        price: 3.99,
        originalPrice: null,
        image: '/placeholder.svg?height=300&width=300',
        images: [
            '/placeholder.svg?height=400&width=400',
            '/placeholder.svg?height=400&width=400&text=Texture+Detail',
            '/placeholder.svg?height=400&width=400&text=Color+Variants',
            '/placeholder.svg?height=400&width=400&text=In+Use',
        ],
        rating: 5,
        isNew: true,
        category: 'dining',
        certificates: ['PLASTIC FREE', 'BIODEGRADABLE', 'COMPOSTABLE'],
    },
    {
        id: 8,
        name: 'Bamboo Cutting Board',
        price: 39.99,
        originalPrice: null,
        image: '/placeholder.svg?height=300&width=300',
        images: [
            '/placeholder.svg?height=400&width=400',
            '/placeholder.svg?height=400&width=400&text=Grain+Pattern',
            '/placeholder.svg?height=400&width=400&text=Edge+Detail',
            '/placeholder.svg?height=400&width=400&text=Size+Comparison',
        ],
        rating: 5,
        isNew: true,
        category: 'kitchen',
        certificates: ['PLASTIC FREE', 'USDA ORGANIC', 'FAIR TRADE'],
    },
    {
        id: 9,
        name: 'Wooden Coaster Set',
        price: 3.99,
        originalPrice: null,
        image: '/placeholder.svg?height=300&width=300',
        images: [
            '/placeholder.svg?height=400&width=400',
            '/placeholder.svg?height=400&width=400&text=Set+of+4',
            '/placeholder.svg?height=400&width=400&text=Wood+Finish',
            '/placeholder.svg?height=400&width=400&text=Stacked',
        ],
        rating: 5,
        isNew: true,
        category: 'dining',
        certificates: ['PLASTIC FREE', 'BIODEGRADABLE'],
    },
];

export default function ProductCatalog() {
    const [selectedCertificates, setSelectedCertificates] = useState<string[]>(['PLASTIC FREE']);
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('Featured');
    const [gridView, setGridView] = useState('3-col');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<(typeof allProducts)[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    const toggleCertificate = (cert: string) => {
        if (cert === 'ALL CERTIFICATE') {
            setSelectedCertificates(cert === selectedCertificates[0] ? [] : [cert]);
        } else {
            setSelectedCertificates((prev) =>
                prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev.filter((c) => c !== 'ALL CERTIFICATE'), cert],
            );
        }
    };

    const toggleFavorite = (productId: number) => {
        setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
    };

    const handleProductClick = (product: (typeof allProducts)[0]) => {
        setSelectedProduct(product);
        setSelectedImageIndex(0);
        setIsModalOpen(true);
    };

    const handleImageSelect = (index: number) => {
        setSelectedImageIndex(index);
    };

    const filteredProducts = allProducts.filter((product) => {
        // Certificate filter
        if (selectedCertificates.length > 0 && !selectedCertificates.includes('ALL CERTIFICATE')) {
            const hasMatchingCert = selectedCertificates.some((cert) => product.certificates.includes(cert));
            if (!hasMatchingCert) return false;
        }

        // Price filter
        if (selectedPriceRange !== 'all') {
            const price = product.price;
            switch (selectedPriceRange) {
                case '0-9.99':
                    if (price >= 10) return false;
                    break;
                case '100-199.99':
                    if (price < 100 || price >= 200) return false;
                    break;
                case '200-299.99':
                    if (price < 200 || price >= 300) return false;
                    break;
                case '300-399.99':
                    if (price < 300 || price >= 400) return false;
                    break;
                case '400+':
                    if (price < 400) return false;
                    break;
            }
        }

        return true;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'Price: Low to High':
                return a.price - b.price;
            case 'Price: High to Low':
                return b.price - a.price;
            case 'Newest':
                return b.id - a.id;
            default:
                return 0;
        }
    });

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedProducts = sortedProducts.slice(startIndex, endIndex);

    const getGridClass = () => {
        switch (gridView) {
            case '2-col':
                return 'grid-cols-2 sm:grid-cols-2'; // 2 columns on mobile and up
            case 'list':
                return 'grid-cols-1';
            default: // 3-col
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'; // 1 on mobile, 2 on sm, 3 on lg
        }
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPrevious = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [selectedCertificates, selectedPriceRange, sortBy]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Sidebar Filters */}
                    <div className="w-full flex-shrink-0 lg:w-64">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            {/* Filter Header */}
                            <div className="mb-6 flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <span className="text-sm font-medium tracking-wider">FILTER</span>
                            </div>

                            {/* Certificates */}
                            <div className="mb-8">
                                <h3 className="mb-4 text-sm font-medium tracking-wider">CERTIFICATES</h3>
                                <div className="space-y-3">
                                    {certificates.map((cert) => (
                                        <div key={cert} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={cert}
                                                checked={selectedCertificates.includes(cert)}
                                                onCheckedChange={() => toggleCertificate(cert)}
                                            />
                                            <label htmlFor={cert} className="cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                                                {cert}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <h3 className="mb-4 text-sm font-medium tracking-wider">PRICE</h3>
                                <div className="space-y-3">
                                    {priceRanges.map((range) => (
                                        <div key={range.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={range.value}
                                                checked={selectedPriceRange === range.value}
                                                onCheckedChange={() => setSelectedPriceRange(range.value)}
                                            />
                                            <label htmlFor={range.value} className="cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                                                {range.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <h1 className="text-2xl font-light tracking-wider">PLASTIC FREE</h1>

                            <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center">
                                {/* Sort By */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="gap-2">
                                            <span className="text-sm tracking-wider">SORT BY</span>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {sortOptions.map((option) => (
                                            <DropdownMenuItem
                                                key={option}
                                                onClick={() => setSortBy(option)}
                                                className={sortBy === option ? 'bg-gray-100' : ''}
                                            >
                                                {option}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Grid View Options */}
                                <div className="flex gap-1">
                                    <Button
                                        variant={gridView === '2-col' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setGridView('2-col')}
                                        className="h-8 w-8"
                                    >
                                        <Grid2X2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={gridView === '3-col' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setGridView('3-col')}
                                        className="h-8 w-8"
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={gridView === 'list' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setGridView('list')}
                                        className="h-8 w-8"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className={`grid ${getGridClass()} mb-8 gap-4`}>
                            {displayedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className={`group cursor-pointer rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-md ${
                                        gridView === 'list' ? 'flex' : ''
                                    }`}
                                    onClick={() => handleProductClick(product)}
                                >
                                    {/* Product Image */}
                                    <div
                                        className={`relative flex-shrink-0 overflow-hidden bg-gray-100 ${
                                            gridView === 'list' ? 'h-16 w-24 rounded-l-lg sm:h-40 sm:w-40' : 'aspect-[4/3] rounded-t-lg'
                                        }`}
                                    >
                                        <img
                                            src={product.image || '/placeholder.svg'}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />

                                        {/* New Badge */}
                                        {product.isNew && (
                                            <Badge
                                                className={`absolute overflow-hidden bg-green-500 text-white hover:bg-green-600 ${
                                                    gridView === 'list' ? 'top-1 left-1 h-4 px-1 py-0 text-[10px]' : 'top-2 left-2 text-xs'
                                                }`}
                                            >
                                                NEW
                                            </Badge>
                                        )}

                                        {/* See More Button - Hover Only - Hide in mobile list view */}
                                        {gridView !== 'list' && (
                                            <div className="absolute right-0 bottom-0 left-0 bg-black/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                                                <button className="w-full px-3 py-2 text-xs font-medium tracking-wider text-white transition-colors duration-200 hover:bg-black/90">
                                                    SEE MORE
                                                </button>
                                            </div>
                                        )}

                                        {/* Favorite Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(product.id);
                                            }}
                                            className={`absolute rounded-full bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
                                                gridView === 'list' ? 'top-1 right-1 p-1' : 'top-2 right-2 p-1.5'
                                            }`}
                                        >
                                            <Heart
                                                className={`${gridView === 'list' ? 'h-3 w-3' : 'h-3.5 w-3.5'} ${
                                                    favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className={`${gridView === 'list' ? 'flex flex-1 flex-col justify-between p-2' : 'p-3'}`}>
                                        <div>
                                            {/* Rating */}
                                            <div className="mb-1.5 flex items-center">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <Star
                                                        key={index}
                                                        className={`${gridView === 'list' ? 'h-2.5 w-2.5' : 'h-3 w-3'} ${
                                                            index < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>

                                            {/* Product Name */}
                                            <h3
                                                className={`mb-1.5 font-medium text-gray-900 ${
                                                    gridView === 'list' ? 'line-clamp-1 text-xs sm:line-clamp-2 sm:text-base' : 'line-clamp-2 text-sm'
                                                }`}
                                            >
                                                {product.name}
                                            </h3>

                                            {/* Description for list view - Hidden on mobile */}
                                            {gridView === 'list' && (
                                                <p className="mb-3 line-clamp-2 hidden text-sm text-gray-600 sm:block">
                                                    Premium quality {product.name.toLowerCase()} made from sustainable, eco-friendly materials.
                                                    Perfect for modern homes with elegant design.
                                                </p>
                                            )}

                                            {/* Certificates for list view - Hidden on mobile */}
                                            {gridView === 'list' && (
                                                <div className="mb-3 hidden flex-wrap gap-1 sm:flex">
                                                    {product.certificates.slice(0, 3).map((cert) => (
                                                        <Badge key={cert} variant="outline" className="text-xs">
                                                            {cert}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {/* Price */}
                                            <div className="flex items-center space-x-1.5">
                                                <span
                                                    className={`font-semibold text-gray-900 ${
                                                        gridView === 'list' ? 'text-sm sm:text-lg' : 'text-base'
                                                    }`}
                                                >
                                                    ${product.price.toFixed(2)}
                                                </span>
                                                {product.originalPrice && (
                                                    <span className={`text-gray-500 line-through ${gridView === 'list' ? 'text-xs' : 'text-xs'}`}>
                                                        ${product.originalPrice.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Buy Now button for list view - Hidden on mobile */}
                                            {gridView === 'list' && (
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Handle buy now action
                                                    }}
                                                    size="sm"
                                                    className="ml-3 hidden uppercase sm:block"
                                                >
                                                    Buy Now
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                {/* Left side - Previous button and page info */}
                                <div className="order-2 flex items-center space-x-4 sm:order-1">
                                    <Button variant="outline" onClick={goToPrevious} disabled={currentPage === 1} className="px-3 py-2">
                                        <ChevronLeft className="mr-1 h-4 w-4" />
                                        Previous
                                    </Button>

                                    {/* Page selector dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="min-w-[120px] gap-2">
                                                <span>Page {currentPage}</span>
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="max-h-60 overflow-y-auto">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <DropdownMenuItem
                                                    key={page}
                                                    onClick={() => goToPage(page)}
                                                    className={currentPage === page ? 'bg-gray-100 font-medium' : ''}
                                                >
                                                    Page {page}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Center - Page numbers */}
                                <div className="order-1 flex space-x-1 sm:order-2">
                                    {/* First page */}
                                    {currentPage > 3 && (
                                        <>
                                            <Button
                                                variant={1 === currentPage ? 'default' : 'outline'}
                                                onClick={() => goToPage(1)}
                                                className="min-w-[40px] px-3 py-2"
                                            >
                                                1
                                            </Button>
                                            {currentPage > 4 && <span className="px-2 py-2">...</span>}
                                        </>
                                    )}

                                    {/* Pages around current page */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter((page) => {
                                            return page >= currentPage - 2 && page <= currentPage + 2;
                                        })
                                        .map((page) => (
                                            <Button
                                                key={page}
                                                variant={page === currentPage ? 'default' : 'outline'}
                                                onClick={() => goToPage(page)}
                                                className="min-w-[40px] px-3 py-2"
                                            >
                                                {page}
                                            </Button>
                                        ))}

                                    {/* Last page */}
                                    {currentPage < totalPages - 2 && (
                                        <>
                                            {currentPage < totalPages - 3 && <span className="px-2 py-2">...</span>}
                                            <Button
                                                variant={totalPages === currentPage ? 'default' : 'outline'}
                                                onClick={() => goToPage(totalPages)}
                                                className="min-w-[40px] px-3 py-2"
                                            >
                                                {totalPages}
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Right side - Next button */}
                                <div className="order-3 flex items-center space-x-4">
                                    <Button variant="outline" onClick={goToNext} disabled={currentPage === totalPages} className="px-3 py-2">
                                        Next
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Results Info */}
                        <div className="mt-4 text-center text-sm text-gray-600">
                            Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} products
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="font-milk max-h-[90vh] w-full !max-w-7xl overflow-y-auto tracking-tighter uppercase">
                    {selectedProduct && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-light">{selectedProduct.name}</DialogTitle>
                                <DialogDescription>Premium quality product with excellent craftsmanship</DialogDescription>
                            </DialogHeader>

                            <div className="mt-6 grid gap-6 md:grid-cols-2">
                                {/* Product Image Gallery */}
                                <div className="space-y-4">
                                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                                        <img
                                            src={selectedProduct.images[selectedImageIndex] || '/placeholder.svg'}
                                            alt={`${selectedProduct.name} view ${selectedImageIndex + 1}`}
                                            className="h-full w-full object-cover transition-opacity duration-300"
                                        />
                                    </div>

                                    <div className="flex space-x-2">
                                        {selectedProduct.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleImageSelect(index)}
                                                className={`h-16 w-16 rounded border-2 bg-gray-100 transition-all duration-200 ${
                                                    selectedImageIndex === index
                                                        ? 'border-primary ring-primary/20 ring-2'
                                                        : 'border-transparent hover:border-gray-300'
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

                                    <div className="text-center text-sm text-gray-500">
                                        {selectedImageIndex + 1} of {selectedProduct.images.length}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <Star
                                                    key={index}
                                                    className={`h-5 w-5 ${
                                                        index < selectedProduct.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">(127 reviews)</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-3xl font-semibold text-gray-900">${selectedProduct.price.toFixed(2)}</span>
                                            {selectedProduct.originalPrice && (
                                                <span className="text-xl text-gray-500 line-through">
                                                    ${selectedProduct.originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                            {selectedProduct.isNew && <Badge className="bg-green-500 text-white">NEW</Badge>}
                                        </div>
                                        {selectedProduct.originalPrice && (
                                            <p className="text-sm text-green-600">
                                                Save ${(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)}(
                                                {Math.round(
                                                    ((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100,
                                                )}
                                                % off)
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-gray-900">Description</h3>
                                        <p className="leading-relaxed text-gray-600">
                                            Premium quality {selectedProduct.name.toLowerCase()} made from sustainable, eco-friendly materials.
                                            Perfect for modern homes with elegant design and superior craftsmanship.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-gray-900">Certificates</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.certificates.map((cert) => (
                                                <Badge key={cert} variant="outline" className="text-xs">
                                                    {cert}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <a href="" target="_blank" rel="noopener noreferrer" className="block">
                                            <Button className="w-full py-3 text-lg font-medium uppercase">Buy Now</Button>
                                        </a>
                                    </div>

                                    <div className="space-y-2 border-t pt-4 text-sm text-gray-600">
                                        <p>
                                            <span className="font-medium">SKU:</span> {selectedProduct.id.toString().padStart(6, '0')}
                                        </p>
                                        <p>
                                            <span className="font-medium">Category:</span> Kitchen & Home
                                        </p>
                                        <p>
                                            <span className="font-medium">Shipping:</span> Free shipping on orders over $50
                                        </p>
                                        <p>
                                            <span className="font-medium">Return Policy:</span> 30-day return guarantee
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
