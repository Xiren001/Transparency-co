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
        // Reset selected image index when a new product is selected
        setSelectedImageIndex(0);
    }, [product]);

    const handleImageSelect = (index: number) => {
        setSelectedImageIndex(index);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="font-milk max-h-[90vh] w-full !max-w-7xl overflow-y-auto tracking-tighter uppercase dark:bg-[#1a1a1f] dark:text-[#e0e0e5]">
                {product && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-light dark:text-[#e0e0e5]">{product.name}</DialogTitle>
                            <DialogDescription className="dark:text-[#b8b8c0]">
                                Premium quality product with excellent craftsmanship
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                            {/* Product Image Gallery */}
                            <div className="space-y-4">
                                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-[#23232a]">
                                    <img
                                        src={
                                            product.images[selectedImageIndex] ? `/storage/${product.images[selectedImageIndex]}` : '/placeholder.svg'
                                        }
                                        alt={`${product.name} view ${selectedImageIndex + 1}`}
                                        className="h-full w-full object-cover transition-opacity duration-300"
                                    />
                                </div>

                                <div className="flex space-x-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleImageSelect(index)}
                                            className={`h-16 w-16 rounded border-2 bg-gray-100 transition-all duration-200 dark:bg-[#23232a] ${
                                                selectedImageIndex === index
                                                    ? 'border-primary ring-primary/20 dark:border-primary dark:ring-primary/20 ring-2'
                                                    : 'border-transparent hover:border-gray-300 dark:hover:border-[#3d3d45]'
                                            }`}
                                        >
                                            <img
                                                src={image ? `/storage/${image}` : '/placeholder.svg'}
                                                alt={`${product.name} thumbnail ${index + 1}`}
                                                className="h-full w-full rounded object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="text-center text-sm text-gray-500 dark:text-[#b8b8c0]">
                                    {selectedImageIndex + 1} of {product.images.length}
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
                                                    index < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-[#6b6b75]'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-[#b8b8c0]">(127 reviews)</span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-3xl font-semibold text-gray-900 dark:text-[#e0e0e5]">
                                            ${Number(product.price).toFixed(2)}
                                        </span>
                                        {product.original_price && (
                                            <span className="text-xl text-gray-500 line-through dark:text-[#b8b8c0]">
                                                ${Number(product.original_price).toFixed(2)}
                                            </span>
                                        )}
                                        {product.is_new && <Badge className="bg-green-500 text-white">NEW</Badge>}
                                    </div>
                                    {product.original_price && (
                                        <p className="text-sm text-green-600 dark:text-green-400">
                                            Save ${(Number(product.original_price) - Number(product.price)).toFixed(2)}(
                                            {Math.round(
                                                ((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100,
                                            )}
                                            % off)
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900 dark:text-[#e0e0e5]">Description</h3>
                                    <p className="leading-relaxed text-gray-600 dark:text-[#b8b8c0]">{product.description}</p>
                                </div>

                                {product.certificates && product.certificates.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-gray-900 dark:text-[#e0e0e5]">Certificates</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.certificates.map((cert) => (
                                                <Badge key={cert} variant="outline" className="text-xs dark:border-[#2d2d35] dark:text-[#b8b8c0]">
                                                    {cert}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product.product_link && (
                                    <div className="space-y-4">
                                        <a href={product.product_link} target="_blank" rel="noopener noreferrer" className="block">
                                            <Button className="w-full py-3 text-lg font-medium uppercase dark:bg-[#23232a] dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]">
                                                Buy Now
                                            </Button>
                                        </a>
                                    </div>
                                )}

                                {product.product_details && product.product_details.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-muted-foreground font-semibold dark:text-[#e0e0e5]">Additional Details</h3>
                                        <div className="space-y-1">
                                            {product.product_details.map((detail, index) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{detail.name}:</span>
                                                    <span className="text-muted-foreground">{detail.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
