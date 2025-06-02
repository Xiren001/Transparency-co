'use client';

import ProductDetailsModal from '@/components/product-details-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type Product } from '@/types';
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Grid2X2, Grid3X3, Heart, List, Star } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
        links: any;
    };
}

export default function CustomerView({ products }: Props) {
    const [selectedCertificates, setSelectedCertificates] = useState<string[]>(['ALL CERTIFICATE']);
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('Featured');
    const [gridView, setGridView] = useState('3-col');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const gridRef = useRef<any>(null);
    const productGridWrapperRef = useRef<HTMLDivElement>(null);

    // Debounced filter states
    const [debouncedCertificates, setDebouncedCertificates] = useState(selectedCertificates);
    const [debouncedPriceRange, setDebouncedPriceRange] = useState(selectedPriceRange);
    const [debouncedSortBy, setDebouncedSortBy] = useState(sortBy);

    // Effect to debounce filter changes
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedCertificates(selectedCertificates);
            setDebouncedPriceRange(selectedPriceRange);
            setDebouncedSortBy(sortBy);
        }, 300); // 300ms debounce delay

        return () => {
            // Cancel the timeout if filters change before the delay
            clearTimeout(handler);
        };
    }, [selectedCertificates, selectedPriceRange, sortBy]);

    // Reset scroll position and pagination when debounced filters change
    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.scrollTo({
                scrollLeft: 0,
                scrollTop: 0,
            });
        }
        setCurrentPage(1); // Reset to first page on filter/sort/view changes
    }, [debouncedCertificates, debouncedPriceRange, debouncedSortBy, gridView]);

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

    // Memoize filtered products
    const filteredProducts = useMemo(() => {
        return products.data.filter((product) => {
            // Certificate filter using debounced state
            if (debouncedCertificates.length > 0 && !debouncedCertificates.includes('ALL CERTIFICATE')) {
                const hasMatchingCert = debouncedCertificates.some((cert) => product.certificates?.includes(cert));
                if (!hasMatchingCert) return false;
            }

            // Price filter using debounced state
            if (debouncedPriceRange !== 'all') {
                const price = product.price;
                switch (debouncedPriceRange) {
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
    }, [products.data, debouncedCertificates, debouncedPriceRange]);

    // Memoize sorted products
    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            // Sorting using debounced state
            switch (debouncedSortBy) {
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
    }, [filteredProducts, debouncedSortBy]);

    // Calculate products for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagedProducts = sortedProducts.slice(startIndex, endIndex);

    const itemsPerRow = gridView === '2-col' ? 2 : gridView === '3-col' ? 3 : 1;
    const rowCount = Math.ceil(pagedProducts.length / itemsPerRow); // Row count for the current page
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage); // Total pages based on all filtered/sorted products
    const rowHeight = gridView === 'list' ? 180 : gridView === '2-col' ? 550 : 400; // Approximate row height for list and grid views

    // Memoize the Cell component rendering
    const Cell = useMemo(
        () =>
            ({ columnIndex, rowIndex, style }: any) => {
                const index = rowIndex * itemsPerRow + columnIndex;
                const product = pagedProducts[index]; // Get product from the paged list

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
        [itemsPerRow, pagedProducts, gridView, favorites, toggleFavorite, handleProductClick],
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
                            <h1 className="text-2xl font-light tracking-wider text-gray-900 dark:text-[#e0e0e5]">PLASTIC FREE</h1>

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
                                            itemData={pagedProducts} // Pass only the products for the current page
                                            key={currentPage} // Add key based on current page
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
                                        onClick={() => {
                                            setCurrentPage(currentPage - 1);
                                            productGridWrapperRef.current?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        disabled={currentPage === 1}
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
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="max-h-60 overflow-y-auto dark:border-[#2d2d35] dark:bg-[#23232a]">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <DropdownMenuItem
                                                    key={page}
                                                    onClick={() => {
                                                        setCurrentPage(page);
                                                        productGridWrapperRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                    className={
                                                        currentPage === page
                                                            ? 'font-milk bg-gray-100 font-medium uppercase dark:bg-[#2d2d35]'
                                                            : 'dark:text-[#e0e0e5]'
                                                    }
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
                                                onClick={() => {
                                                    setCurrentPage(1);
                                                    productGridWrapperRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="font-milk min-w-[40px] px-3 py-2 uppercase dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                            >
                                                1
                                            </Button>
                                            {currentPage > 4 && totalPages > 5 && (
                                                <span className="font-milk px-2 py-2 text-gray-600 uppercase dark:text-[#b8b8c0]">...</span>
                                            )}
                                        </>
                                    )}

                                    {/* Pages around current page */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter((page) => {
                                            // Show pages around the current page, ensuring at least 5 page numbers are visible if possible
                                            if (totalPages <= 5) return true;
                                            if (currentPage <= 3) return page <= 5;
                                            if (currentPage >= totalPages - 2) return page >= totalPages - 4;
                                            return page >= currentPage - 2 && page <= currentPage + 2;
                                        })
                                        .map((page) => (
                                            <Button
                                                key={page}
                                                variant={page === currentPage ? 'default' : 'outline'}
                                                onClick={() => {
                                                    setCurrentPage(page);
                                                    productGridWrapperRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="font-milk min-w-[40px] px-3 py-2 uppercase dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                            >
                                                {page}
                                            </Button>
                                        ))}

                                    {/* Last page */}
                                    {currentPage < totalPages - 2 && (
                                        <>
                                            {currentPage < totalPages - 3 && totalPages > 5 && (
                                                <span className="font-milk px-2 py-2 text-gray-600 uppercase dark:text-[#b8b8c0]">...</span>
                                            )}
                                            <Button
                                                variant={totalPages === currentPage ? 'default' : 'outline'}
                                                onClick={() => {
                                                    setCurrentPage(totalPages);
                                                    productGridWrapperRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="font-milk min-w-[40px] px-3 py-2 uppercase dark:border-[#2d2d35] dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                            >
                                                {totalPages}
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Right side - Next button */}
                                <div className="order-3 flex items-center space-x-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setCurrentPage(currentPage + 1);
                                            productGridWrapperRef.current?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        disabled={currentPage === totalPages}
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
                            Showing {sortedProducts.length > 0 ? startIndex + 1 : 0}-
                            {Math.min(startIndex + pagedProducts.length, sortedProducts.length)} of {sortedProducts.length} products
                        </div>
                    </div>
                </div>
            </div>

            <ProductDetailsModal product={selectedProduct} isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
    );
}
