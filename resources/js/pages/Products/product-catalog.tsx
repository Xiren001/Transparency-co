'use client';

import ProductDetailsModal from '@/components/product-details-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type Product } from '@/types';
import axios from 'axios';
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Grid2X2, Grid3X3, Heart, List, Star } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid as Grid } from 'react-window';

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

interface Props {
    products: {
        data: Product[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters: {
        certificates: string[];
        price_range: string;
        sort_by: string;
        category?: string;
    };
}

export default function CustomerView({ products: initialProducts, filters: initialFilters }: Props) {
    const [products, setProducts] = useState(initialProducts);
    const [selectedCertificates, setSelectedCertificates] = useState<string[]>(initialFilters.certificates);
    const [selectedPriceRange, setSelectedPriceRange] = useState(initialFilters.price_range);
    const [sortBy, setSortBy] = useState(initialFilters.sort_by);
    const [gridView, setGridView] = useState('3-col');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const gridRef = useRef<any>(null);
    const productGridWrapperRef = useRef<HTMLDivElement>(null);

    const fetchFilteredProducts = useCallback(async (params: URLSearchParams) => {
        try {
            setIsLoading(true);
            const response = await axios.get(route('api.products.filter'), { params });
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching filtered products:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effect to handle filter changes
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (selectedCertificates.length > 0) {
            selectedCertificates.forEach((cert) => params.append('certificates[]', cert));
        }

        if (selectedPriceRange !== 'all') {
            params.append('price_range', selectedPriceRange);
        }

        if (sortBy !== 'Featured') {
            params.append('sort_by', sortBy);
        }

        fetchFilteredProducts(params);
    }, [selectedCertificates, selectedPriceRange, sortBy, fetchFilteredProducts]);

    // Effect to handle category changes
    useEffect(() => {
        const handleCategoryChange = () => {
            const params = new URLSearchParams(window.location.search);
            fetchFilteredProducts(params);
        };

        // Initial load with URL params
        handleCategoryChange();

        window.addEventListener('popstate', handleCategoryChange);
        window.addEventListener('categoryChanged', handleCategoryChange);

        return () => {
            window.removeEventListener('popstate', handleCategoryChange);
            window.removeEventListener('categoryChanged', handleCategoryChange);
        };
    }, [fetchFilteredProducts]);

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

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleImageSelect = (index: number) => {
        setSelectedImageIndex(index);
    };

    const handlePageChange = async (url: string) => {
        try {
            setIsLoading(true);
            const response = await axios.get(url);
            setProducts(response.data.products);
            productGridWrapperRef.current?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error fetching page:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const itemsPerRow = gridView === '2-col' ? 2 : gridView === '3-col' ? 3 : 1;
    const rowCount = Math.ceil(products.data.length / itemsPerRow);
    const totalPages = products.last_page;
    const rowHeight = gridView === 'list' ? 180 : gridView === '2-col' ? 550 : 400;

    // Update the Cell component to use products.data directly
    const Cell = useMemo(
        () =>
            ({ columnIndex, rowIndex, style }: any) => {
                const index = rowIndex * itemsPerRow + columnIndex;
                const product = products.data[index];

                if (!product) {
                    return null;
                }

                return (
                    <div
                        style={{
                            ...style,
                            padding: '8px', // Add 8px padding around each cell (half of gap-4)
                            boxSizing: 'border-box', // Ensure padding is included in the element's total width and height
                        }}
                    >
                        <div
                            key={product.id}
                            className={`group h-full cursor-pointer rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:bg-[#23232a] dark:hover:shadow-[#2d2d35]/50 ${gridView === 'list' ? 'flex' : ''}`}
                            onClick={() => handleProductClick(product)}
                        >
                            {/* Product Image */}
                            <div
                                className={`relative flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-[#2d2d35] ${gridView === 'list' ? 'h-16 w-24 rounded-l-lg sm:h-40 sm:w-40' : 'aspect-[4/3] rounded-t-lg'}`}
                            >
                                <img
                                    src={product.images[0] ? `/storage/${product.images[0]}` : '/placeholder.svg'}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* New Badge */}
                                {product.is_new && (
                                    <Badge
                                        className={`absolute overflow-hidden bg-green-500 text-white hover:bg-green-600 ${gridView === 'list' ? 'top-1 left-1 h-4 px-1 py-0 text-[10px]' : 'top-2 left-2 text-xs'}`}
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
                                    className={`absolute rounded-full bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:bg-[#23232a] ${gridView === 'list' ? 'top-1 right-1 p-1' : 'top-2 right-2 p-1.5'}`}
                                >
                                    <Heart
                                        className={`${gridView === 'list' ? 'h-3 w-3' : 'h-3.5 w-3.5'} ${
                                            favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-[#6b6b75]'
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
                                                    index < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-[#6b6b75]'
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Product Name */}
                                    <h3
                                        className={`mb-1.5 font-medium text-gray-900 dark:text-[#e0e0e5] ${gridView === 'list' ? 'line-clamp-1 text-xs sm:line-clamp-2 sm:text-base' : 'line-clamp-2 text-sm'}`}
                                    >
                                        {product.name}
                                    </h3>

                                    {/* Description for list view - Hidden on mobile */}
                                    {gridView === 'list' && (
                                        <p className="mb-3 line-clamp-2 hidden text-sm text-gray-600 sm:block dark:text-[#b8b8c0]">
                                            {product.description}
                                        </p>
                                    )}

                                    {/* Certificates for list view - Hidden on mobile */}
                                    {gridView === 'list' && product.certificates && (
                                        <div className="mb-3 hidden flex-wrap gap-1 sm:flex">
                                            {product.certificates.slice(0, 3).map((cert) => (
                                                <Badge key={cert} variant="outline" className="text-xs dark:border-[#2d2d35] dark:text-[#b8b8c0]">
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
                                            className={`font-semibold text-gray-900 dark:text-[#e0e0e5] ${gridView === 'list' ? 'text-sm sm:text-lg' : 'text-base'}`}
                                        >
                                            ${Number(product.price).toFixed(2)}
                                        </span>
                                        {product.original_price && (
                                            <span
                                                className={`text-gray-500 line-through dark:text-[#b8b8c0] ${gridView === 'list' ? 'text-xs' : 'text-xs'}`}
                                            >
                                                ${Number(product.original_price).toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Buy Now button for list view - Hidden on mobile */}
                                    {gridView === 'list' && product.product_link && (
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (product.product_link) {
                                                    window.open(product.product_link, '_blank');
                                                }
                                            }}
                                            size="sm"
                                            className="ml-3 hidden uppercase sm:block dark:bg-[#2d2d35] dark:text-[#e0e0e5] dark:hover:bg-[#3d3d45]"
                                        >
                                            Buy Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            },
        [itemsPerRow, products.data, gridView, favorites, toggleFavorite, handleProductClick],
    );

    return (
        <div className="min-h-screen rounded-lg bg-gray-50 dark:bg-[#1a1a1f]">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Sidebar Filters */}
                    <div className="w-full flex-shrink-0 lg:w-64">
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-[#23232a]">
                            {/* Filter Header */}
                            <div className="mb-6 flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-900 dark:text-[#e0e0e5]" />
                                <span className="text-sm font-medium tracking-wider text-gray-900 dark:text-[#e0e0e5]">FILTER</span>
                            </div>

                            {/* Certificates */}
                            <div className="mb-8">
                                <h3 className="mb-4 text-sm font-medium tracking-wider text-gray-900 dark:text-[#e0e0e5]">CERTIFICATES</h3>
                                <div className="space-y-3">
                                    {certificates.map((cert) => (
                                        <div key={cert} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={cert}
                                                checked={selectedCertificates.includes(cert)}
                                                onCheckedChange={() => toggleCertificate(cert)}
                                            />
                                            <label
                                                htmlFor={cert}
                                                className="cursor-pointer text-sm text-gray-700 hover:text-gray-900 dark:text-[#b8b8c0] dark:hover:text-[#e0e0e5]"
                                            >
                                                {cert}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <h3 className="mb-4 text-sm font-medium tracking-wider text-gray-900 dark:text-[#e0e0e5]">PRICE</h3>
                                <div className="space-y-3">
                                    {priceRanges.map((range) => (
                                        <div key={range.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={range.value}
                                                checked={selectedPriceRange === range.value}
                                                onCheckedChange={() => setSelectedPriceRange(range.value)}
                                            />
                                            <label
                                                htmlFor={range.value}
                                                className="cursor-pointer text-sm text-gray-700 hover:text-gray-900 dark:text-[#b8b8c0] dark:hover:text-[#e0e0e5]"
                                            >
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
                            <h1 className="text-2xl font-light tracking-wider text-gray-900 dark:text-[#e0e0e5]">
                                {initialFilters.category || 'Certified Products'}
                            </h1>

                            <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center">
                                {/* Sort By */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="gap-2 dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                        >
                                            <span className="text-sm tracking-wider">SORT BY</span>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="dark:border-[#2d2d35] dark:bg-[#23232a]">
                                        {sortOptions.map((option) => (
                                            <DropdownMenuItem
                                                key={option}
                                                onClick={() => setSortBy(option)}
                                                className={sortBy === option ? 'bg-gray-100 dark:bg-[#2d2d35]' : 'dark:text-[#e0e0e5]'}
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
                                        className="h-8 w-8 dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                    >
                                        <Grid2X2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={gridView === '3-col' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setGridView('3-col')}
                                        className="h-8 w-8 dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={gridView === 'list' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setGridView('list')}
                                        className="h-8 w-8 dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className={`mb-8`} ref={productGridWrapperRef}>
                            <AutoSizer disableHeight>
                                {({ width }) => {
                                    const columnCount = itemsPerRow;
                                    const columnWidth = width / columnCount;

                                    return (
                                        <Grid
                                            ref={gridRef}
                                            columnCount={columnCount}
                                            columnWidth={columnWidth}
                                            height={rowHeight * rowCount} // Grid height based on rows on the current page
                                            rowCount={rowCount}
                                            rowHeight={rowHeight}
                                            width={width}
                                            itemData={products.data} // Pass only the products for the current page
                                            key={products.current_page} // Add key based on current page
                                        >
                                            {Cell}
                                        </Grid>
                                    );
                                }}
                            </AutoSizer>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="font-milk mt-8 flex flex-col items-center justify-between gap-4 uppercase sm:flex-row">
                                {/* Left side - Previous button and page info */}
                                <div className="order-2 flex items-center space-x-4 sm:order-1">
                                    <Button
                                        variant="outline"
                                        onClick={() => products.prev_page_url && handlePageChange(products.prev_page_url)}
                                        disabled={!products.prev_page_url || isLoading}
                                        className="font-milk px-3 py-2 uppercase dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                    >
                                        <ChevronLeft className="mr-1 h-4 w-4" />
                                        Previous
                                    </Button>

                                    {/* Page selector dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="font-milk min-w-[120px] gap-2 uppercase dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                            >
                                                <span>
                                                    Page {products.current_page} of {products.last_page}
                                                </span>
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="max-h-60 overflow-y-auto dark:border-[#2d2d35] dark:bg-[#23232a]">
                                            {products.links
                                                .filter((link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                                                .map((link, index) => (
                                                    <DropdownMenuItem
                                                        key={index}
                                                        onClick={() => {
                                                            link.url && handlePageChange(link.url);
                                                        }}
                                                        className={
                                                            link.active
                                                                ? 'font-milk bg-gray-100 font-medium uppercase dark:bg-[#2d2d35]'
                                                                : 'dark:text-[#e0e0e5]'
                                                        }
                                                    >
                                                        {link.label}
                                                    </DropdownMenuItem>
                                                ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Center - Page numbers */}
                                <div className="order-1 flex space-x-1 sm:order-2">
                                    {products.links.map((link, index) =>
                                        link.url === null ? null : link.label === '&laquo; Previous' || link.label === 'Next &raquo;' ? null : ( // Don't render disabled links // Don't render prev/next here, they are separate buttons
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                onClick={() => {
                                                    link.url && handlePageChange(link.url);
                                                }}
                                                disabled={!link.url}
                                                className="font-milk min-w-[40px] px-3 py-2 uppercase dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                            >
                                                {link.label}
                                            </Button>
                                        ),
                                    )}
                                </div>

                                {/* Right side - Next button */}
                                <div className="order-3 flex items-center space-x-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => products.next_page_url && handlePageChange(products.next_page_url)}
                                        disabled={!products.next_page_url || isLoading}
                                        className="font-milk px-3 py-2 uppercase dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                    >
                                        Next
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Results Info */}
                        <div className="mt-4 text-center text-sm text-gray-600 dark:text-[#b8b8c0]">
                            Showing {products.from || 0}-{products.to || 0} of {products.total} products
                        </div>
                    </div>
                </div>
            </div>

            <ProductDetailsModal product={selectedProduct} isOpen={isModalOpen} onOpenChange={setIsModalOpen} />

            {/* Loading indicator using portal */}
            {isLoading &&
                createPortal(
                    <div className="font-milk fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 uppercase backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4 rounded-xl bg-white/90 p-6 shadow-2xl dark:bg-[#23232a]/90">
                            <div className="relative h-12 w-12">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-[#2d2d35]"></div>
                                <div className="absolute inset-0 animate-[spin_1s_linear_infinite] rounded-full border-4 border-t-blue-600 dark:border-t-blue-500"></div>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
}
