import React, { useEffect, useRef, useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallbackSrc?: string;
    lazy?: boolean;
    showPlaceholder?: boolean;
    placeholderClassName?: string;
    onImageLoad?: () => void;
    onImageError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    fallbackSrc = '/placeholder.svg',
    lazy = true,
    showPlaceholder = true,
    placeholderClassName = '',
    onImageLoad,
    onImageError,
    className = '',
    style,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(!lazy);
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!lazy || isInView) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observerRef.current?.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before the image comes into view
                threshold: 0.1,
            },
        );

        if (imgRef.current) {
            observerRef.current.observe(imgRef.current);
        }

        return () => {
            observerRef.current?.disconnect();
        };
    }, [lazy, isInView]);

    const handleLoad = () => {
        setIsLoaded(true);
        onImageLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onImageError?.();
        if (imgRef.current && fallbackSrc) {
            imgRef.current.src = fallbackSrc;
        }
    };

    // Shimmer placeholder component
    const ShimmerPlaceholder = () => (
        <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${placeholderClassName || className}`} style={style}>
            <div className="flex h-full w-full items-center justify-center">
                <svg className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </div>
    );

    return (
        <div className="relative">
            {/* Show placeholder while loading */}
            {showPlaceholder && !isLoaded && !hasError && <ShimmerPlaceholder />}

            {/* Actual image */}
            {isInView && (
                <img
                    ref={imgRef}
                    src={hasError ? fallbackSrc : src}
                    alt={alt}
                    className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    style={style}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={lazy ? 'lazy' : 'eager'}
                    {...props}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
