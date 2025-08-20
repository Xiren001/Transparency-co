'use client';

import ProductDetailsModal from '@/components/product-details-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { categories } from '@/constants/categories';
import { getCertificatesForCategory } from '@/lib/utils';
import { type Product } from '@/types';
import axios, { CancelTokenSource } from 'axios';
import { ChevronDown, Filter, Grid2X2, Grid3X3, Heart, List, Star } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

const certificatesByCategory = {
    'food-beverage': ['USDA ORGANIC', 'NON-GMO', 'PLASTIC FREE', 'HEAVY METAL FREE', 'KOSHER', 'HALAL', 'VEGAN', 'GLUTEN-FREE'],
    'health-wellness': ['USDA ORGANIC', 'NON-GMO', 'PLASTIC FREE', 'HEAVY METAL FREE', 'VEGAN', 'GLUTEN-FREE'],
    'personal-care': ['FRAGRANCE FREE', 'PARABEN FREE', 'PHTHALATE FREE', 'SULFATE FREE', 'PLASTIC FREE', 'VEGAN', 'HYPOALLERGENIC'],
    'home-cleaning': ['GREEN SEAL CERTIFIED', 'EPA SAFER CHOICE', 'EWG VERIFIED', 'PLASTIC FREE'],
    'kitchen-essentials': ['PLASTIC FREE', 'PFAS FREE', 'MADE SAFE'],
    'baby-kids': ['MADE SAFE', 'GOTS ORGANIC', 'OEKO TEX STANDARD 100', 'GREENGUARD GOLD', 'FSC'],
    clothing: ['GOTS ORGANIC', 'OEKO-TEX STANDARD 100', 'BLUESIGN', 'FAIR TRADE'],
    'pet-care': ['USDA ORGANIC', 'OEKO-TEX STANDARD 100', 'GOTS ORGANIC', 'BPA FREE', 'PFAS FREE'],
    'home-textiles': ['GOTS ORGANIC', 'OEKO-TEX STANDARD 100', 'FAIR TRADE'],
    'air-purifiers': ['TRUE HEPA'],
    'water-filters': ['NSF 177 CERTIFIED'],
    'office-supplies': {
        writing: ['ASTM D-4236', 'FSC', 'CRADLE TO CRADLE CERTIFIED'],
        paper: ['FSC', 'OEKO TEX 100', 'CRADLE TO CRADLE', 'UL ECOLOGO®'],
    },
    'beauty-cosmetics': ['PFAS FREE', 'PHTHALATE FREE', 'PARABEN FREE', 'PLASTIC FREE', 'USDA ORGANIC', 'MADE SAFE', 'EWG CERTIFIED', 'VEGAN'],
};

const priceRanges = [
    { label: 'ALL PRICE', value: 'all' },
    { label: '$0 - $25', value: '0-25' },
    { label: '$25 - $50', value: '25-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100+', value: '100+' },
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

const DEBOUNCE_DELAY = 300; // 300ms delay

// Shimmer Card Component
const ShimmerCard = ({ gridView }: { gridView: string }) => (
    <div
        className={`group animate-pulse cursor-pointer rounded-lg bg-gray-200 shadow-sm transition-shadow duration-300 duration-2000 ease-in-out dark:bg-[#2d2d35]/50 ${gridView === 'list' ? 'flex flex-row' : ''}`}
    >
        <div
            className={`relative flex-shrink-0 overflow-hidden bg-gray-300 dark:bg-[#3d3d45] ${gridView === 'list' ? 'h-24 w-24 rounded-l-lg sm:h-40 sm:w-40' : 'aspect-[4/3] rounded-t-lg'}`}
        >
            {/* Shimmer for image */}
        </div>
        <div className={`flex flex-1 flex-col justify-between ${gridView === 'list' ? 'p-2 sm:p-4' : 'p-3'}`}>
            <div className="flex flex-col">
                <div className="mb-1 flex items-center">
                    {/* Shimmer for stars */}
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="mr-1 h-3 w-3 rounded-full bg-gray-300 dark:bg-[#3d3d45]"></div>
                    ))}
                </div>
                {/* Shimmer for title */}
                <div className="mb-1 h-4 w-3/4 rounded bg-gray-300 dark:bg-[#3d3d45]"></div>
                <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-[#3d3d45]"></div>
            </div>
            {/* Shimmer for price and button */}
            <div className="mt-2 flex items-center justify-between">
                <div className="h-4 w-1/4 rounded bg-gray-300 dark:bg-[#3d3d45]"></div>
                <div className="h-7 w-20 rounded bg-gray-300 dark:bg-[#3d3d45]"></div>
            </div>
        </div>
    </div>
);

// Defensive fallback for images
const getProductImage = (images: any) => {
    if (Array.isArray(images) && images.length > 0 && images[0]) {
        return `/images/${String(images[0]).replace(/\\/g, '/')}`;
    }
    return '/placeholder.svg';
};

// Defensive fallback for certificates
const getCertificates = (certs: any) => (Array.isArray(certs) ? certs : []);

// Defensive fallback for product details
const getProductDetails = (details: any) => (Array.isArray(details) ? details : []);

// Defensive fallback for price
const getPrice = (price: any) => {
    console.log('getPrice input:', price, typeof price);
    if (typeof price === 'number' && !isNaN(price)) {
        return price;
    }
    if (typeof price === 'string' && price.trim()) {
        const numPrice = parseFloat(price);
        if (!isNaN(numPrice)) {
            return numPrice;
        }
    }
    return 0;
};

// Defensive fallback for original price
const getOriginalPrice = (originalPrice: any) => {
    if (typeof originalPrice === 'number' && !isNaN(originalPrice)) {
        return originalPrice;
    }
    if (typeof originalPrice === 'string' && originalPrice.trim()) {
        const numPrice = parseFloat(originalPrice);
        if (!isNaN(numPrice)) {
            return numPrice;
        }
    }
    return null;
};

// Defensive fallback for company name
const getCompanyName = (company: any) => (company && typeof company.name === 'string' ? company.name : 'Unknown Company');

export default function CustomerView({ products: initialProducts, filters: initialFilters }: Props) {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;
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
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialFilters.category || null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const gridRef = useRef<any>(null);
    const productGridWrapperRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<{
        product_images?: File[];
        certificate_images?: File[];
    }>({});
    const [imagePreviews, setImagePreviews] = useState<{
        product_images?: string[];
        certificate_images?: string[];
    }>({});
    const cancelTokenRef = useRef<CancelTokenSource | null>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

    // Initialize all products
    useEffect(() => {
        setAllProducts(products.data);
        setDisplayedProducts(products.data.slice(0, productsPerPage));
    }, [products.data]);

    const handlePageChange = () => {
        const nextPage = currentPage + 1;
        const startIndex = 0;
        const endIndex = nextPage * productsPerPage;

        // Get the next batch of products
        const nextBatch = allProducts.slice(startIndex, endIndex);

        // Only update if we have more products to show
        if (nextBatch.length > displayedProducts.length) {
            setDisplayedProducts(nextBatch);
            setCurrentPage(nextPage);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const fetchFilteredProducts = useCallback(async (params: URLSearchParams, silent: boolean = false) => {
        try {
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel('New request started');
            }

            cancelTokenRef.current = axios.CancelToken.source();

            if (!silent) {
                setIsLoading(true);
            }

            // Remove pagination from params to get all products
            params.delete('page');
            params.set('per_page', '1000'); // Set a high number to get all products

            const response = await axios.get(route('api.products.filter'), {
                params,
                cancelToken: cancelTokenRef.current.token,
            });

            // Set all products
            setAllProducts(response.data.products.data);
            // Set initial displayed products
            setDisplayedProducts(response.data.products.data.slice(0, productsPerPage));
            setCurrentPage(1);

            // Update the products state with the full data
            setProducts({
                ...response.data.products,
                data: response.data.products.data,
            });
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching filtered products:', error);
            }
        } finally {
            if (!silent) {
                setIsLoading(false);
            }
        }
    }, []);

    const handleCategoryChange = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        const categoryFromUrl = params.get('category');
        const subCategoryFromUrl = params.get('sub_category');
        const itemFromUrl = params.get('item');

        // Only update state if values have changed
        if (categoryFromUrl !== selectedCategory) {
            setSelectedCategory(categoryFromUrl);
            setSelectedSubCategory(null);
            setSelectedItem(null);
        } else if (subCategoryFromUrl !== selectedSubCategory) {
            setSelectedSubCategory(subCategoryFromUrl);
            setSelectedItem(null);
        } else if (itemFromUrl !== selectedItem) {
            setSelectedItem(itemFromUrl);
        }

        // Clear any existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer for debouncing
        debounceTimerRef.current = setTimeout(() => {
            // Ensure isLoading is set to true when a fetch is triggered by category change
            setIsLoading(true);
            fetchFilteredProducts(params);
        }, DEBOUNCE_DELAY);
    }, [selectedCategory, selectedSubCategory, selectedItem, fetchFilteredProducts]);

    useEffect(() => {
        // Initial load with URL params
        handleCategoryChange();

        // Listen for category changes
        window.addEventListener('popstate', handleCategoryChange);
        window.addEventListener('categoryChanged', handleCategoryChange);

        return () => {
            window.removeEventListener('popstate', handleCategoryChange);
            window.removeEventListener('categoryChanged', handleCategoryChange);
        };
    }, [handleCategoryChange]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        // Only update URL if filters have changed
        if (selectedCertificates.length > 0) {
            params.set('certificates', selectedCertificates.join(','));
        } else {
            params.delete('certificates');
        }

        if (selectedPriceRange !== 'all') {
            params.set('price_range', selectedPriceRange);
        } else {
            params.delete('price_range');
        }

        if (sortBy !== 'Featured') {
            params.set('sort_by', sortBy);
        } else {
            params.delete('sort_by');
        }

        // Update URL without triggering a page reload
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);

        // Fetch filtered products
        fetchFilteredProducts(params);
    }, [selectedCertificates, selectedPriceRange, sortBy, fetchFilteredProducts]);

    useEffect(() => {
        if (!isLoading && displayedProducts.length === 0 && suggestedProducts.length === 0) {
            fetch('/api/products/top-clicked')
                .then((res) => res.json())
                .then((data) => setSuggestedProducts(data.slice(0, 3)))
                .catch(() => setSuggestedProducts([]));
        }
    }, [isLoading, displayedProducts, suggestedProducts.length]);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel('Component unmounted');
            }
        };
    }, []);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'product_images' | 'certificate_images') => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const maxFiles = type === 'product_images' ? 4 : 5;
            const maxSize = 2 * 1024 * 1024; // 2MB

            if (files.length > maxFiles) {
                toast.error(`Maximum ${maxFiles} ${type === 'product_images' ? 'product' : 'certificate'} images allowed`);
                return;
            }

            // Check file sizes and types
            const invalidFiles = files.filter((file) => {
                const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
                const isValidSize = file.size <= maxSize;
                return !isValidType || !isValidSize;
            });

            if (invalidFiles.length > 0) {
                toast.error('Invalid files detected. Please ensure all images are JPEG/PNG and under 2MB.');
                return;
            }

            // Create preview URLs for the selected files
            const previews = files.map((file) => URL.createObjectURL(file));

            setFormData((prev) => ({
                ...prev,
                [type]: files,
            }));

            setImagePreviews((prev) => ({
                ...prev,
                [type]: previews,
            }));
        }
    };

    const removeImage = (type: 'product_images' | 'certificate_images', index: number, existingImage?: string) => {
        setFormData((prev) => {
            const newFiles = [...(prev[type] || [])];
            newFiles.splice(index, 1);
            return { ...prev, [type]: newFiles };
        });

        setImagePreviews((prev) => {
            const newPreviews = [...(prev[type] || [])];
            if (newPreviews[index]?.startsWith('blob:')) {
                URL.revokeObjectURL(newPreviews[index]);
            }
            newPreviews.splice(index, 1);
            return { ...prev, [type]: newPreviews };
        });
    };

    const ImagePreview = ({
        images,
        type,
        existingImages = [],
    }: {
        images: string[];
        type: 'product_images' | 'certificate_images';
        existingImages?: string[];
    }) => {
        const placeholderImage =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';

        return (
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {images.map((image, index) => (
                    <div key={index} className="group relative aspect-square w-full overflow-hidden rounded-lg border">
                        <img
                            src={image}
                            alt={`${type} preview ${index + 1}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = placeholderImage;
                                if (image.startsWith('blob:')) {
                                    URL.revokeObjectURL(image);
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (image.startsWith('blob:')) {
                                    URL.revokeObjectURL(image);
                                }
                                removeImage(type, index);
                            }}
                            className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const ExistingImagePreview = ({ images, type }: { images: string[]; type: 'product_images' | 'certificate_images' }) => {
        const placeholderImage =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';

        return (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {images.map((image, index) => (
                    <div key={index} className="group relative aspect-square w-full overflow-hidden rounded-lg border">
                        <img
                            src={image ? `/images/${image.replace(/\\/g, '/')}` : placeholderImage}
                            alt={`${type} ${index + 1}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = placeholderImage;
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(type, index, image)}
                            className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const currentCategorySubCategories = selectedCategory ? categories.find((cat) => cat.id === selectedCategory)?.subCategories || [] : [];

    // Function to track product clicks
    const trackProductClick = async (productId: number) => {
        try {
            await fetch(`/api/products/${productId}/click`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
        } catch (error) {
            console.error('Failed to track product click:', error);
        }
    };

    return (
        <div className="h-auto rounded-lg bg-white/80 sm:min-h-screen dark:bg-transparent">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    <div className="w-full lg:hidden">
                        <Collapsible className="w-full">
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:border dark:border-[#2d2d35] dark:bg-[#282828]">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-gray-900 dark:text-[#e0e0e5]" />
                                    <span className="text-sm font-medium tracking-wider text-gray-900 dark:text-[#e0e0e5]">FILTERS</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-900 dark:text-[#e0e0e5]" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 rounded-lg bg-white p-4 shadow-sm dark:border dark:border-[#2d2d35] dark:bg-[#282828]">
                                <div className="mb-8">
                                    <h3 className="mb-4 text-sm font-medium tracking-wider text-gray-900 dark:text-[#e0e0e5]">CERTIFICATES</h3>
                                    <div className="space-y-3">
                                        {selectedCategory ? (
                                            (() => {
                                                const certificates = getCertificatesForCategory(
                                                    certificatesByCategory,
                                                    selectedCategory,
                                                    selectedSubCategory || undefined,
                                                );
                                                if (certificates.length > 0) {
                                                    return certificates.map((cert) => (
                                                        <div key={cert} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={cert}
                                                                checked={selectedCertificates.includes(cert)}
                                                                onCheckedChange={() => toggleCertificate(cert)}
                                                                className="dark:border-[#2d2d35]"
                                                            />
                                                            <label
                                                                htmlFor={cert}
                                                                className="cursor-pointer text-sm text-gray-700 hover:text-gray-900 dark:text-[#b8b8c0] dark:hover:text-[#e0e0e5]"
                                                            >
                                                                {cert}
                                                            </label>
                                                        </div>
                                                    ));
                                                }
                                                return (
                                                    <p className="text-sm text-gray-500 dark:text-[#b8b8c0]">
                                                        No certificates available for this category
                                                    </p>
                                                );
                                            })()
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-[#b8b8c0]">
                                                Select a category to view available certificates
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-4 text-sm font-medium tracking-wider text-gray-900 dark:text-[#e0e0e5]">PRICE</h3>
                                    <div className="space-y-3">
                                        {priceRanges.map((range) => (
                                            <div key={range.value} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={range.value}
                                                    checked={selectedPriceRange === range.value}
                                                    onCheckedChange={() => setSelectedPriceRange(range.value)}
                                                    className="dark:border-[#2d2d35]"
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
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    <div className="hidden w-64 flex-shrink-0 lg:block">
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:border dark:border-[#2d2d35] dark:bg-[#282828]">
                            <div className="mb-6 flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-900 dark:text-[#b1db9e]" />
                                <span className="text-sm font-medium tracking-wider text-gray-900 dark:text-[#b1db9e]">FILTER</span>
                            </div>

                            <div className="mb-8">
                                <h3 className="mb-4 text-sm font-medium tracking-wider text-gray-900 dark:text-[#e0e0e5]">CERTIFICATES</h3>
                                <div className="space-y-3">
                                    {selectedCategory ? (
                                        (() => {
                                            const certificates = getCertificatesForCategory(
                                                certificatesByCategory,
                                                selectedCategory,
                                                selectedSubCategory || undefined,
                                            );
                                            if (certificates.length > 0) {
                                                return certificates.map((cert) => (
                                                    <div key={cert} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`desktop-${cert}`}
                                                            checked={selectedCertificates.includes(cert)}
                                                            onCheckedChange={() => toggleCertificate(cert)}
                                                            className="dark:border-[#b1db9e]"
                                                        />
                                                        <label
                                                            htmlFor={`desktop-${cert}`}
                                                            className="cursor-pointer text-sm text-gray-700 hover:text-gray-900 dark:text-[#b8b8c0] dark:hover:text-[#e0e0e5]"
                                                        >
                                                            {cert}
                                                        </label>
                                                    </div>
                                                ));
                                            }
                                            return (
                                                <p className="text-sm text-gray-500 dark:text-[#b8b8c0]">
                                                    No certificates available for this category
                                                </p>
                                            );
                                        })()
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-[#b8b8c0]">Select a category to view available certificates</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-sm font-medium tracking-wider text-gray-900 dark:text-[#b1db9e]">PRICE</h3>
                                <div className="space-y-3">
                                    {priceRanges.map((range) => (
                                        <div key={range.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`desktop-${range.value}`}
                                                checked={selectedPriceRange === range.value}
                                                onCheckedChange={() => setSelectedPriceRange(range.value)}
                                                className="dark:border-[#b1db9e]"
                                            />
                                            <label
                                                htmlFor={`desktop-${range.value}`}
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

                    <div className="flex-1">
                        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <h1 className="text-2xl font-light tracking-wider text-gray-900 dark:text-[#e0e0e5]">
                                {selectedCategory ? categories.find((cat) => cat.id === selectedCategory)?.name : 'Certified Products'}
                                {selectedSubCategory && ` - ${selectedSubCategory}`}
                            </h1>

                            <div className="hidden w-full flex-col items-start gap-4 sm:flex sm:w-auto sm:flex-row sm:items-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="gap-2 dark:border-[#2d2d35] dark:bg-[#282828] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                        >
                                            <span className="text-sm tracking-wider">SORT BY</span>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="dark:border-[#2d2d35] dark:bg-[#282828]">
                                        {sortOptions.map((option) => (
                                            <DropdownMenuItem
                                                key={option}
                                                onClick={() => setSortBy(option)}
                                                className={sortBy === option ? 'bg-gray-100 dark:bg-[#2d2d35]' : 'dark:text-[#b1db9e]'}
                                            >
                                                {option}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div className="flex gap-1">
                                    <Button
                                        variant={gridView === '2-col' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setGridView('2-col')}
                                        className="h-8 w-8 dark:border-[#2d2d35] dark:bg-[#282828] dark:text-[#b1db9e] dark:hover:bg-[#2d2d35]"
                                    >
                                        <Grid2X2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={gridView === '3-col' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setGridView('3-col')}
                                        className="h-8 w-8 dark:border-[#2d2d35] dark:bg-[#282828] dark:text-[#b1db9e] dark:hover:bg-[#2d2d35]"
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={gridView === 'list' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setGridView('list')}
                                        className="h-8 w-8 dark:border-[#2d2d35] dark:bg-[#282828] dark:text-[#b1db9e] dark:hover:bg-[#2d2d35]"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8" ref={productGridWrapperRef}>
                            {/* No products after search/filter or at all */}
                            {!isLoading && displayedProducts.length === 0 && (
                                <>
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <span className="mb-2 text-2xl font-semibold text-gray-400 dark:text-gray-500">
                                            No products match your search
                                        </span>
                                        <span className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search or filters.</span>
                                    </div>
                                    {suggestedProducts.length > 0 && (
                                        <div className="mt-8">
                                            <h2 className="mb-4 text-center text-lg font-semibold text-gray-700 dark:text-gray-200">
                                                Suggested Products
                                            </h2>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {suggestedProducts.map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className="group cursor-pointer rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border dark:border-[#2d2d35] dark:bg-[#282828] dark:hover:shadow-[#2d2d35]/50"
                                                        onClick={() => handleProductClick(product)}
                                                    >
                                                        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100 dark:bg-[#2d2d35]">
                                                            <img
                                                                src={getProductImage(product.images)}
                                                                alt={product.name || 'Product image'}
                                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = '/placeholder.svg';
                                                                }}
                                                            />
                                                            {product.is_new && (
                                                                <Badge className="absolute top-2 left-2 overflow-hidden bg-green-500 text-xs text-white hover:bg-green-600">
                                                                    NEW
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="p-3">
                                                            <h3 className="mb-1 line-clamp-2 max-w-full min-w-0 overflow-hidden text-sm font-medium break-words text-ellipsis whitespace-normal text-gray-900 dark:text-[#e0e0e5]">
                                                                {product.name || 'Unnamed Product'}
                                                            </h3>
                                                            <p className="mb-1 text-xs text-blue-600 dark:text-[#b1db9e]">
                                                                {getCompanyName(product.company)}
                                                            </p>
                                                            <p className="mb-2 line-clamp-1 max-w-full overflow-hidden text-xs break-words text-ellipsis whitespace-normal text-gray-500 dark:text-[#b8b8c0]">
                                                                {product.description || 'No description available'}
                                                            </p>
                                                            <div className="mt-2 flex items-center justify-between">
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center space-x-1">
                                                                        <span className="text-base font-semibold text-gray-900 dark:text-[#e0e0e5]">
                                                                            ${getPrice(product.price).toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                {product.product_link && (
                                                                    <Button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            trackProductClick(product.id);
                                                                            if (product.product_link) {
                                                                                window.open(product.product_link, '_blank');
                                                                            }
                                                                        }}
                                                                        className="font-milk h-9 px-4 text-sm font-medium uppercase dark:bg-[#2d2d35] dark:text-[#e0e0e5] dark:hover:bg-[#3d3d45]"
                                                                    >
                                                                        Buy Now
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="flex overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
                                <div className="flex gap-4">
                                    {isLoading
                                        ? Array.from({ length: 5 }).map((_, index) => <ShimmerCard key={index} gridView="2-col" />)
                                        : displayedProducts.map((product) => (
                                              <div
                                                  key={product.id}
                                                  className="w-[280px] flex-shrink-0 cursor-pointer rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border dark:border-[#2d2d35] dark:bg-[#282828] dark:hover:shadow-[#2d2d35]/50"
                                                  onClick={() => handleProductClick(product)}
                                              >
                                                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100 dark:bg-[#2d2d35]">
                                                      <img
                                                          src={getProductImage(product.images)}
                                                          alt={product.name || 'Product image'}
                                                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                          onError={(e) => {
                                                              const target = e.target as HTMLImageElement;
                                                              target.src = '/placeholder.svg';
                                                          }}
                                                      />
                                                      {product.is_new && (
                                                          <Badge className="absolute top-2 left-2 overflow-hidden bg-green-500 text-xs text-white hover:bg-green-600">
                                                              NEW
                                                          </Badge>
                                                      )}
                                                      <button
                                                          onClick={(e) => {
                                                              e.stopPropagation();
                                                              toggleFavorite(product.id);
                                                          }}
                                                          className="absolute top-2 right-2 rounded-full bg-white p-1.5 shadow-sm transition-all duration-200 hover:shadow-md dark:border dark:border-[#2d2d35] dark:bg-[#282828]"
                                                      >
                                                          <Heart
                                                              className={`h-4 w-4 ${
                                                                  favorites.includes(product.id)
                                                                      ? 'fill-red-500 text-red-500'
                                                                      : 'text-gray-400 dark:text-[#6b6b75]'
                                                              }`}
                                                          />
                                                      </button>
                                                  </div>
                                                  <div className="p-3">
                                                      <div className="mb-1 hidden items-center sm:flex">
                                                          {Array.from({ length: 5 }).map((_, index) => (
                                                              <Star
                                                                  key={index}
                                                                  className={`h-2.5 w-2.5 ${
                                                                      index < 5
                                                                          ? 'fill-yellow-400 text-yellow-400'
                                                                          : 'text-gray-300 dark:text-[#6b6b75]'
                                                                  }`}
                                                              />
                                                          ))}
                                                      </div>
                                                      <h3 className="mb-1 line-clamp-2 max-w-full min-w-0 overflow-hidden text-sm font-medium break-words text-ellipsis whitespace-normal text-gray-900 dark:text-[#e0e0e5]">
                                                          {product.name || 'Unnamed Product'}
                                                      </h3>
                                                      <p className="mb-1 text-xs text-blue-600 dark:text-[#b1db9e]">
                                                          {getCompanyName(product.company)}
                                                      </p>
                                                      <p className="mb-2 line-clamp-1 max-w-full overflow-hidden text-xs break-words text-ellipsis whitespace-normal text-gray-500 dark:text-[#b8b8c0]">
                                                          {product.description || 'No description available'}
                                                      </p>
                                                      {getCertificates(product.certificates).length > 0 && (
                                                          <div className="mb-2 flex flex-wrap gap-1">
                                                              {getCertificates(product.certificates)
                                                                  .slice(0, 2)
                                                                  .map((cert) => (
                                                                      <Badge
                                                                          key={cert}
                                                                          variant="outline"
                                                                          className="text-[10px] break-words sm:text-xs dark:border-[#2d2d35] dark:text-[#b8b8c0]"
                                                                      >
                                                                          {cert}
                                                                      </Badge>
                                                                  ))}
                                                              {getCertificates(product.certificates).length > 2 && (
                                                                  <Badge
                                                                      variant="outline"
                                                                      className="text-[10px] break-words sm:text-xs dark:border-[#2d2d35] dark:text-[#b8b8c0]"
                                                                  >
                                                                      +{getCertificates(product.certificates).length - 2} more
                                                                  </Badge>
                                                              )}
                                                          </div>
                                                      )}
                                                      <div className="mt-2 flex items-center justify-between">
                                                          <div className="flex flex-col">
                                                              <div className="flex items-center space-x-1">
                                                                  <span className="text-base font-semibold text-gray-900 dark:text-[#e0e0e5]">
                                                                      ${getPrice(product.price).toFixed(2)}
                                                                  </span>
                                                              </div>
                                                          </div>
                                                          {product.product_link && (
                                                              <Button
                                                                  onClick={(e) => {
                                                                      e.stopPropagation();
                                                                      trackProductClick(product.id);
                                                                      if (product.product_link) {
                                                                          window.open(product.product_link, '_blank');
                                                                      }
                                                                  }}
                                                                  className="font-milk h-9 px-4 text-sm font-medium uppercase dark:bg-[#2d2d35] dark:text-[#e0e0e5] dark:hover:bg-[#3d3d45]"
                                                              >
                                                                  Buy Now
                                                              </Button>
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                          ))}
                                </div>
                            </div>

                            <div
                                className={`hidden sm:grid ${
                                    gridView === 'list'
                                        ? 'grid-cols-1'
                                        : gridView === '2-col'
                                          ? 'grid-cols-1 sm:grid-cols-2'
                                          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                } gap-4`}
                            >
                                {isLoading
                                    ? Array.from({ length: 9 }).map((_, index) => <ShimmerCard key={index} gridView={gridView} />)
                                    : displayedProducts.map((product, index) => (
                                          <div
                                              key={`${product.id}-${Math.floor(index / 9)}`}
                                              className={`group cursor-pointer rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border dark:border-[#2d2d35] dark:bg-[#282828] dark:hover:shadow-[#2d2d35]/50 ${
                                                  gridView === 'list' ? 'flex flex-row' : ''
                                              }`}
                                              style={{
                                                  animation: `fadeIn 0.5s ease-in-out ${Math.floor(index / 9) * 0.1}s`,
                                                  opacity: 0,
                                                  animationFillMode: 'forwards',
                                              }}
                                              onClick={() => handleProductClick(product)}
                                          >
                                              <div
                                                  className={`relative flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-[#2d2d35] ${
                                                      gridView === 'list' ? 'h-24 w-24 rounded-l-lg sm:h-40 sm:w-40' : 'aspect-[4/3] rounded-t-lg'
                                                  }`}
                                              >
                                                  <img
                                                      src={getProductImage(product.images)}
                                                      alt={product.name || 'Product image'}
                                                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                      onError={(e) => {
                                                          const target = e.target as HTMLImageElement;
                                                          target.src = '/placeholder.svg';
                                                      }}
                                                  />
                                                  {product.is_new && gridView !== 'list' && (
                                                      <Badge className="absolute top-2 left-2 overflow-hidden bg-green-500 text-xs text-white hover:bg-green-600">
                                                          NEW
                                                      </Badge>
                                                  )}
                                                  {gridView !== 'list' && (
                                                      <button
                                                          onClick={(e) => {
                                                              e.stopPropagation();
                                                              toggleFavorite(product.id);
                                                          }}
                                                          className="absolute top-2 right-2 rounded-full bg-white p-1.5 shadow-sm transition-all duration-200 hover:shadow-md dark:border dark:border-[#2d2d35] dark:bg-[#282828]"
                                                      >
                                                          <Heart
                                                              className={`h-4 w-4 ${
                                                                  favorites.includes(product.id)
                                                                      ? 'fill-red-500 text-red-500'
                                                                      : 'text-gray-400 dark:text-[#6b6b75]'
                                                              }`}
                                                          />
                                                      </button>
                                                  )}
                                              </div>
                                              <div
                                                  className={`flex flex-1 flex-col justify-between ${gridView === 'list' ? 'min-w-0 p-2 sm:p-4' : 'p-3'}`}
                                              >
                                                  <div className="flex min-w-0 flex-col">
                                                      <div className="mb-1 hidden items-center sm:flex">
                                                          {Array.from({ length: 5 }).map((_, index) => (
                                                              <Star
                                                                  key={index}
                                                                  className={`h-2.5 w-2.5 ${
                                                                      index < 5
                                                                          ? 'fill-yellow-400 text-yellow-400'
                                                                          : 'text-gray-300 dark:text-[#6b6b75]'
                                                                  }`}
                                                              />
                                                          ))}
                                                      </div>
                                                      <h3 className="mb-1 line-clamp-2 max-w-full min-w-0 overflow-hidden text-sm font-medium break-words text-ellipsis whitespace-normal text-gray-900 dark:text-[#e0e0e5]">
                                                          {product.name || 'Unnamed Product'}
                                                      </h3>
                                                      <p className="mb-1 text-xs text-blue-600 dark:text-[#b1db9e]">
                                                          {getCompanyName(product.company)}
                                                      </p>
                                                      <p className="mb-2 line-clamp-1 max-w-full overflow-hidden text-xs break-words text-ellipsis whitespace-normal text-gray-500 dark:text-[#b8b8c0]">
                                                          {product.description || 'No description available'}
                                                      </p>
                                                      {getCertificates(product.certificates).length > 0 && (
                                                          <div className="mb-2 flex flex-wrap gap-1">
                                                              {getCertificates(product.certificates)
                                                                  .slice(0, 2)
                                                                  .map((cert) => (
                                                                      <Badge
                                                                          key={cert}
                                                                          variant="outline"
                                                                          className="text-[10px] break-words sm:text-xs dark:border-[#2d2d35] dark:text-[#b8b8c0]"
                                                                      >
                                                                          {cert}
                                                                      </Badge>
                                                                  ))}
                                                              {getCertificates(product.certificates).length > 2 && (
                                                                  <Badge
                                                                      variant="outline"
                                                                      className="text-[10px] break-words sm:text-xs dark:border-[#2d2d35] dark:text-[#b8b8c0]"
                                                                  >
                                                                      +{getCertificates(product.certificates).length - 2} more
                                                                  </Badge>
                                                              )}
                                                          </div>
                                                      )}
                                                  </div>
                                                  <div className="mt-2 flex items-center justify-between">
                                                      <div className="flex flex-col">
                                                          <div className="flex items-center space-x-1">
                                                              <span className="text-base font-semibold text-gray-900 dark:text-[#e0e0e5]">
                                                                  ${getPrice(product.price).toFixed(2)}
                                                              </span>
                                                          </div>
                                                      </div>
                                                      {product.product_link && (
                                                          <Button
                                                              onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  trackProductClick(product.id);
                                                                  if (product.product_link) {
                                                                      window.open(product.product_link, '_blank');
                                                                  }
                                                              }}
                                                              className="font-milk h-9 px-4 text-sm font-medium uppercase dark:bg-[#2d2d35] dark:text-[#e0e0e5] dark:hover:bg-[#3d3d45]"
                                                          >
                                                              Buy Now
                                                          </Button>
                                                      )}
                                                  </div>
                                              </div>
                                          </div>
                                      ))}
                            </div>
                        </div>

                        {/* Back to Top Button */}
                        <button
                            onClick={scrollToTop}
                            className="fixed right-8 bottom-8 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:bg-gray-100 dark:border dark:border-[#2d2d35] dark:bg-[#282828] dark:hover:bg-[#2d2d35]"
                            aria-label="Back to top"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-600 dark:text-[#e0e0e5]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </button>

                        {/* Load More Button */}
                        {displayedProducts.length < allProducts.length && (
                            <div className="mt-8 flex justify-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handlePageChange}
                                    disabled={isLoading}
                                    className="font-milk w-full max-w-xs uppercase dark:border-[#2d2d35] dark:bg-[#282828] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-[#3d3d45] dark:border-t-[#e0e0e5]"></div>
                                            <span>Loading...</span>
                                        </div>
                                    ) : (
                                        `Load More (${allProducts.length - displayedProducts.length} remaining)`
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ProductDetailsModal product={selectedProduct} isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
    );
}
