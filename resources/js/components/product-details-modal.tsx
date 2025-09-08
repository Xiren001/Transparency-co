import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Product } from '@/types';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProductDetailsModalProps {
    product: Product | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProductDetailsModal({ product, isOpen, onOpenChange }: ProductDetailsModalProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isContentVisible, setIsContentVisible] = useState(false);

    useEffect(() => {
        setSelectedImageIndex(0);
    }, [product]);

    // Handle content animation timing
    useEffect(() => {
        if (isOpen) {
            // Reset content visibility when modal opens
            setIsContentVisible(false);
            // Show content after a short delay for smooth entrance
            const timer = setTimeout(() => {
                setIsContentVisible(true);
            }, 150);
            return () => clearTimeout(timer);
        } else {
            // Hide content immediately when modal closes
            setIsContentVisible(false);
        }
    }, [isOpen]);

    const handleImageSelect = (index: number) => {
        setSelectedImageIndex(index);
    };

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

    // Defensive fallback for images
    const getProductImage = (images: any, idx: number) => {
        if (Array.isArray(images) && images.length > 0 && images[idx]) {
            return `/images/${String(images[idx]).replace(/\\/g, '/')}`;
        }
        return '/placeholder.svg';
    };

    // Defensive fallback for all images
    const getAllProductImages = (images: any) => (Array.isArray(images) ? images : []);

    // Defensive fallback for name/description
    const getProductName = (name: any) => (typeof name === 'string' && name.trim() ? name : 'Unnamed Product');
    const getProductDescription = (desc: any) => (typeof desc === 'string' && desc.trim() ? desc : 'No description available');

    // Defensive fallback for certificates
    const getCertificates = (certs: any) => (Array.isArray(certs) ? certs : []);

    // Defensive fallback for product details
    const getProductDetails = (details: any) => (Array.isArray(details) ? details : []);

    // Defensive fallback for price
    const getPrice = (price: any) => {
        console.log('Modal getPrice input:', price, typeof price);
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

    if (!product) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="font-milk max-h-[95vh] w-full overflow-hidden overflow-y-auto rounded-[12px] bg-[#ecf0f3] px-4 py-10 tracking-tighter uppercase shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] sm:w-[98vw] sm:max-w-[95vw] md:px-6 md:py-8 dark:bg-[#181a1b] dark:text-[#e0e0e5] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526] [&>button]:hidden">
                    <div className="text-center text-gray-500 dark:text-[#b8b8c0]">No product data available.</div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="font-milk animate-in fade-in-0 zoom-in-95 max-h-[95vh] w-full overflow-hidden overflow-y-auto rounded-[12px] border-none bg-[#ecf0f3] tracking-tighter uppercase shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] duration-300 sm:w-[93vw] sm:max-w-[90vw] dark:bg-[#181a1b] dark:text-[#e0e0e5] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526] [&>button]:hidden">
                <div
                    className={`flex w-full min-w-0 flex-col gap-4 transition-all duration-500 ease-out lg:grid lg:grid-cols-2 lg:gap-8 ${
                        isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                >
                    {/* Mobile: Category and Close Button Boxes - Above Image */}
                    <div
                        className={`flex gap-2 transition-all duration-500 ease-out lg:hidden ${
                            isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                        }`}
                        style={{ transitionDelay: isContentVisible ? '100ms' : '0ms' }}
                    >
                        {/* Category Box */}
                        {product!.category && (
                            <div className="flex-1 rounded-lg border-none bg-[#ecf0f3] p-2 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526]">
                                <p className="text-xs text-gray-500 dark:text-[#b8b8c0]">
                                    {product!.category}
                                    {product!.sub_category ? ` / ${product!.sub_category}` : ''}
                                    {product!.item ? ` / ${product!.item}` : ''}
                                </p>
                            </div>
                        )}

                        {/* Close Button Box */}
                        <div className="rounded-lg border-none bg-[#ecf0f3] p-2 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526]">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-[#2d2d35] dark:hover:text-[#e0e0e5]"
                                aria-label="Close modal"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Left Column: Product Image Gallery */}
                    <div
                        className={`flex flex-col items-center gap-4 transition-all duration-500 ease-out lg:flex-row-reverse ${
                            isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}
                        style={{ transitionDelay: isContentVisible ? '200ms' : '0ms' }}
                    >
                        <div className="relative aspect-square h-full max-h-[800px] w-full max-w-[500px] overflow-hidden rounded-[12px] border-none bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none lg:max-w-none dark:bg-[#181a1b] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526]">
                            <img
                                key={`main-image-${selectedImageIndex}`}
                                src={getProductImage(product!.images, selectedImageIndex)}
                                alt={`${getProductName(product!.name)} view ${selectedImageIndex + 1}`}
                                className={`h-full w-full object-cover transition-all duration-700 ease-out ${
                                    isContentVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                                }`}
                                style={{ transitionDelay: isContentVisible ? '250ms' : '0ms' }}
                            />
                        </div>
                        <div className="flex flex-row flex-wrap justify-center gap-2 lg:flex-col lg:justify-start">
                            {(getAllProductImages(product!.images) ?? []).map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleImageSelect(index)}
                                    className={`h-16 w-16 overflow-hidden rounded-[12px] border-none bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] transition-all duration-500 ease-out outline-none lg:h-25 lg:w-25 dark:bg-[#181a1b] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] ${
                                        selectedImageIndex === index
                                            ? 'shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526]'
                                            : ''
                                    } ${isContentVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'}`}
                                    style={{ transitionDelay: isContentVisible ? `${300 + index * 50}ms` : '0ms' }}
                                >
                                    <img
                                        src={image ? `/images/${image.replace(/\\/g, '/')}` : '/placeholder.svg'}
                                        alt={`${getProductName(product!.name)} thumbnail ${index + 1}`}
                                        className="h-full w-full object-cover transition-all duration-300 ease-out"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Product Details */}
                    <div
                        className={`w-full min-w-0 space-y-4 transition-all duration-500 ease-out md:space-y-4 ${
                            isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}
                        style={{ transitionDelay: isContentVisible ? '300ms' : '0ms' }}
                    >
                        {/* Desktop: Category and Close Button Boxes - In Right Column */}
                        <div
                            className={`hidden gap-4 transition-all duration-500 ease-out lg:flex ${
                                isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                            }`}
                            style={{ transitionDelay: isContentVisible ? '400ms' : '0ms' }}
                        >
                            {/* Category Box */}
                            {product!.category && (
                                <div className="flex-1 rounded-lg border-none bg-[#ecf0f3] p-4 text-center shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526]">
                                    <p className="text-sm text-gray-500 dark:text-[#b8b8c0]">
                                        {product!.category}
                                        {product!.sub_category ? ` / ${product!.sub_category}` : ''}
                                        {product!.item ? ` / ${product!.item}` : ''}
                                    </p>
                                </div>
                            )}

                            {/* Close Button Box */}
                            <div className="h-full rounded-lg border-none bg-[#ecf0f3] p-4 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] outline-none dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526]">
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-[#2d2d35] dark:hover:text-[#e0e0e5]"
                                    aria-label="Close modal"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Product Info Box */}
                        <div
                            className={`rounded-lg border-none bg-[#ecf0f3] p-4 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] transition-all duration-500 ease-out outline-none dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] ${
                                isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                            }`}
                            style={{ transitionDelay: isContentVisible ? '500ms' : '0ms' }}
                        >
                            <DialogHeader className="mb-2 sm:mb-4">
                                <DialogTitle className="text-lg font-light sm:text-2xl dark:text-[#e0e0e5]">
                                    {getProductName(product!.name)}
                                </DialogTitle>
                                <DialogDescription className="text-xs break-words sm:text-base dark:text-[#b8b8c0]">
                                    {getProductDescription(product!.description)}
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        {/* Rating Box */}
                        <div
                            className={`rounded-lg border-none bg-[#ecf0f3] p-4 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] transition-all duration-500 ease-out outline-none dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] ${
                                isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                            }`}
                            style={{ transitionDelay: isContentVisible ? '600ms' : '0ms' }}
                        >
                            <div className="flex w-full min-w-0 items-center justify-between">
                                <span className="text-xs text-gray-600 sm:text-sm dark:text-[#b8b8c0]">(127 reviews)</span>
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Star
                                            key={index}
                                            className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                                index < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-[#6b6b75]'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Price Box */}
                        <div
                            className={`rounded-lg border-none bg-[#ecf0f3] p-4 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] transition-all duration-500 ease-out outline-none dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] ${
                                isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                            }`}
                            style={{ transitionDelay: isContentVisible ? '700ms' : '0ms' }}
                        >
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl dark:text-[#e0e0e5]">
                                        ${getPrice(product!.price).toFixed(2)}
                                    </span>
                                    {(() => {
                                        const originalPrice = getOriginalPrice(product!.original_price);
                                        return originalPrice ? (
                                            <span className="text-sm text-gray-500 line-through sm:text-base md:text-lg lg:text-xl dark:text-[#b8b8c0]">
                                                ${originalPrice.toFixed(2)}
                                            </span>
                                        ) : null;
                                    })()}
                                    {product!.is_new && <Badge className="bg-green-500 text-[10px] text-white sm:text-xs">NEW</Badge>}
                                </div>
                                {(() => {
                                    const originalPrice = getOriginalPrice(product!.original_price);
                                    const currentPrice = getPrice(product!.price);
                                    return originalPrice ? (
                                        <p className="text-[10px] text-green-600 sm:text-xs md:text-sm lg:text-base dark:text-green-400">
                                            Save {(originalPrice - currentPrice).toFixed(2)}(
                                            {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% off)
                                        </p>
                                    ) : null;
                                })()}
                            </div>
                        </div>

                        {/* Certificates Box */}
                        {getCertificates(product!.certificates).length > 0 && (
                            <div
                                className={`rounded-lg border-none bg-[#ecf0f3] p-4 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] transition-all duration-500 ease-out outline-none dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] ${
                                    isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                                }`}
                                style={{ transitionDelay: isContentVisible ? '800ms' : '0ms' }}
                            >
                                <div className="w-full min-w-0 space-y-1.5 sm:space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-900 sm:text-lg dark:text-[#e0e0e5]">Certificates</h3>
                                    <div className="flex w-full min-w-0 flex-wrap gap-1.5 sm:gap-2">
                                        {getCertificates(product!.certificates).map((cert) => (
                                            <Badge
                                                key={cert}
                                                variant="outline"
                                                className="text-[10px] break-words sm:text-xs dark:border-[#2d2d35] dark:text-[#b8b8c0]"
                                            >
                                                {cert}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Additional Details Box */}
                        {getProductDetails(product!.product_details).length > 0 && (
                            <div
                                className={`rounded-lg border-none bg-[#ecf0f3] p-4 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#f9f9f9] transition-all duration-500 ease-out outline-none dark:bg-[#181a1b] dark:text-[#f3f4f6] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#222526] ${
                                    isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                                }`}
                                style={{ transitionDelay: isContentVisible ? '900ms' : '0ms' }}
                            >
                                <div className="w-full min-w-0 space-y-1.5 sm:space-y-3">
                                    <h3 className="text-muted-foreground text-sm font-semibold sm:text-lg dark:text-[#e0e0e5]">Additional Details</h3>
                                    <div className="w-full min-w-0 space-y-0.5 sm:space-y-1">
                                        {getProductDetails(product!.product_details).map((detail, index) => (
                                            <div key={index} className="flex w-full min-w-0 flex-wrap justify-between text-[10px] sm:text-sm">
                                                <span className="text-muted-foreground break-all">{detail.value}</span>
                                                <span className="text-muted-foreground">{detail.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Box */}
                        {product!.product_link && (
                            <button
                                onClick={() => {
                                    trackProductClick(product!.id);
                                    if (product!.product_link) {
                                        window.open(product!.product_link, '_blank');
                                    }
                                }}
                                className={`w-full overflow-hidden rounded-[12px] border-none bg-[#ecf0f3] p-4 text-left shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] transition-all duration-500 ease-out outline-none hover:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#f9f9f9] dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526] dark:hover:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#222526] ${
                                    isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                                }`}
                                style={{ transitionDelay: isContentVisible ? '1000ms' : '0ms' }}
                            >
                                <div className="font-milk text-center text-lg font-medium tracking-tighter uppercase dark:text-[#e0e0e5]">
                                    Buy Now
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
