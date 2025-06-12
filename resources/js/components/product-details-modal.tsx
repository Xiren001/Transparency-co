import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

    useEffect(() => {
        setSelectedImageIndex(0);
    }, [product]);

    const handleImageSelect = (index: number) => {
        setSelectedImageIndex(index);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="font-milk max-h-[95vh] w-full overflow-y-auto px-4 py-10 tracking-tighter uppercase sm:w-[95vw] sm:max-w-7xl md:px-6 md:py-8 dark:bg-[#1a1a1f] dark:text-[#e0e0e5]">
                {product && (
                    <div className="flex w-full min-w-0 flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-12">
                        {/* Left Column: Product Image Gallery */}
                        <div className="flex flex-col items-center gap-4 lg:flex-row-reverse">
                            <div className="relative aspect-[4/3] h-full w-full max-w-[600px] overflow-hidden rounded bg-gray-100 lg:max-w-none dark:bg-[#23232a]">
                                <img
                                    src={
                                        product.images[selectedImageIndex]
                                            ? `/images/${product.images[selectedImageIndex].replace(/\\/g, '/')}`
                                            : '/placeholder.svg'
                                    }
                                    alt={`${product.name} view ${selectedImageIndex + 1}`}
                                    className="h-full w-full object-cover transition-opacity duration-300"
                                />
                            </div>
                            <div className="flex flex-row flex-wrap justify-center gap-2 lg:flex-col lg:justify-start">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleImageSelect(index)}
                                        className={`h-15 w-15 overflow-hidden border-2 bg-gray-100 transition-all duration-200 dark:bg-[#23232a] ${selectedImageIndex === index ? 'border-gray-900 dark:border-[#e0e0e5]' : 'border-transparent hover:border-gray-300 dark:hover:border-[#3d3d45]'}`}
                                    >
                                        <img
                                            src={image ? `/images/${image.replace(/\\/g, '/')}` : '/placeholder.svg'}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Product Details */}
                        <div className="w-full min-w-0 space-y-4 md:space-y-6">
                            {product.category && (
                                <p className="text-sm text-gray-500 dark:text-[#b8b8c0]">
                                    {product.category}
                                    {product.sub_category ? ` / ${product.sub_category}` : ''}
                                    {product.item ? ` / ${product.item}` : ''}
                                </p>
                            )}
                            <DialogHeader className="mb-2 sm:mb-4">
                                <DialogTitle className="text-lg font-light sm:text-2xl dark:text-[#e0e0e5]">{product.name}</DialogTitle>
                                <DialogDescription className="text-xs break-words sm:text-base dark:text-[#b8b8c0]">
                                    {product.description}
                                </DialogDescription>
                            </DialogHeader>

                            {/* Star Rating and Reviews */}
                            <div className="flex w-full min-w-0 items-center space-x-2">
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
                                <span className="text-xs text-gray-600 sm:text-sm dark:text-[#b8b8c0]">(127 reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center space-x-2">
                                <span className="text-3xl font-semibold text-gray-900 sm:text-4xl dark:text-[#e0e0e5]">
                                    ${Number(product.price).toFixed(2)}
                                </span>
                                {product.original_price && (
                                    <span className="text-lg text-gray-500 line-through sm:text-xl dark:text-[#b8b8c0]">
                                        ${Number(product.original_price).toFixed(2)}
                                    </span>
                                )}
                                {product.is_new && <Badge className="bg-green-500 text-white">NEW</Badge>}
                            </div>
                            {product.original_price && (
                                <p className="text-xs text-green-600 sm:text-sm dark:text-green-400">
                                    Save ${(Number(product.original_price) - Number(product.price)).toFixed(2)}(
                                    {Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)}%
                                    off)
                                </p>
                            )}

                            {/* Certificates */}
                            {product.certificates && product.certificates.length > 0 && (
                                <div className="w-full min-w-0 space-y-1.5 sm:space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-900 sm:text-lg dark:text-[#e0e0e5]">Certificates</h3>
                                    <div className="flex w-full min-w-0 flex-wrap gap-1.5 sm:gap-2">
                                        {product.certificates.map((cert) => (
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
                            )}

                            {/* Additional Details */}
                            {product.product_details && product.product_details.length > 0 && (
                                <div className="w-full min-w-0 space-y-1.5 sm:space-y-3">
                                    <h3 className="text-muted-foreground text-sm font-semibold sm:text-lg dark:text-[#e0e0e5]">Additional Details</h3>
                                    <div className="w-full min-w-0 space-y-0.5 sm:space-y-1">
                                        {product.product_details.map((detail, index) => (
                                            <div
                                                key={index}
                                                className="flex w-full min-w-0 flex-wrap justify-start gap-0.5 text-[10px] sm:gap-2 sm:text-sm"
                                            >
                                                <span className="text-muted-foreground">{detail.name}:</span>
                                                <span className="text-muted-foreground break-all">{detail.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Buy Now Button */}
                            {product.product_link && (
                                <Button
                                    onClick={() => {
                                        if (product.product_link) {
                                            window.open(product.product_link, '_blank');
                                        }
                                    }}
                                    className="font-milk w-full py-2.5 text-lg font-medium uppercase sm:py-3 dark:bg-[#e0e0e5] dark:text-[#1a1a1f] dark:hover:bg-[#cccccc]"
                                >
                                    Buy Now
                                </Button>
                            )}

                            {/* Shipping Info */}
                            <p className="text-center text-xs text-gray-500 dark:text-[#b8b8c0]">
                                Free Shipping + Free Returns.{' '}
                                <a href="#" className="underline hover:text-gray-700 dark:hover:text-[#e0e0e5]">
                                    See full policy.
                                </a>
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
