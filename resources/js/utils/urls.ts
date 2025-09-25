/**
 * URL Utilities for Clean URLs
 * Provides helper functions for generating SEO-friendly URLs
 */

export interface Product {
    id: number;
    name: string;
    slug?: string;
    category?: string;
    sub_category?: string;
    company?: {
        name: string;
        slug?: string;
    };
}

export interface Company {
    id: number;
    name: string;
    slug?: string;
}

export class UrlHelper {
    /**
     * Generate slug from text
     */
    static generateSlug(text: string): string {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    /**
     * Get clean product URL
     */
    static getProductUrl(product: Product): string {
        if (product.slug) {
            return `/product/${product.slug}`;
        }
        return `/product/${this.generateSlug(product.name)}`;
    }

    /**
     * Get clean company URL
     */
    static getCompanyUrl(company: Company): string {
        if (company.slug) {
            return `/company/${company.slug}`;
        }
        return `/company/${this.generateSlug(company.name)}`;
    }

    /**
     * Get clean category URL
     */
    static getCategoryUrl(category: string): string {
        return `/category/${this.generateSlug(category)}`;
    }

    /**
     * Get clean sub-category URL
     */
    static getSubCategoryUrl(category: string, subcategory: string): string {
        return `/category/${this.generateSlug(category)}/${this.generateSlug(subcategory)}`;
    }

    /**
     * Get search URL with clean format
     */
    static getSearchUrl(query: string): string {
        return `/search/${this.generateSlug(query)}`;
    }

    /**
     * Get price range URL
     */
    static getPriceRangeUrl(min?: number, max?: number): string {
        if (min && max) {
            return `/${min}-to-${max}`;
        } else if (min) {
            return `/over-${min}`;
        } else if (max) {
            return `/under-${max}`;
        }
        return '/';
    }

    /**
     * Get brands listing URL
     */
    static getBrandsUrl(): string {
        return '/brands';
    }

    /**
     * Get popular products URL
     */
    static getPopularUrl(): string {
        return '/popular';
    }

    /**
     * Get new arrivals URL
     */
    static getNewArrivalsUrl(): string {
        return '/new-arrivals';
    }
}

/**
 * Breadcrumb utilities
 */
export class BreadcrumbHelper {
    static generateBreadcrumbs(path: string): Array<{ name: string; url: string }> {
        const breadcrumbs = [{ name: 'Home', url: '/' }];
        const segments = path.split('/').filter((segment) => segment);

        let currentPath = '';
        for (const segment of segments) {
            currentPath += `/${segment}`;
            const name = this.formatSegmentName(segment);
            breadcrumbs.push({ name, url: currentPath });
        }

        return breadcrumbs;
    }

    private static formatSegmentName(segment: string): string {
        return segment
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}

/**
 * SEO utilities
 */
export class SEOHelper {
    /**
     * Generate meta title for product pages
     */
    static getProductTitle(product: Product): string {
        const companyName = product.company?.name || '';
        return `${product.name} - ${companyName} | Transparency Co`;
    }

    /**
     * Generate meta description for product pages
     */
    static getProductDescription(product: Product): string {
        const category = product.category || 'Product';
        const company = product.company?.name || 'Transparency Co';
        return `Shop ${product.name} from ${company}. High-quality ${category.toLowerCase()} with transparent ingredient information and certifications.`;
    }

    /**
     * Generate meta title for category pages
     */
    static getCategoryTitle(category: string): string {
        return `${category.charAt(0).toUpperCase() + category.slice(1)} Products | Transparency Co`;
    }

    /**
     * Generate meta description for category pages
     */
    static getCategoryDescription(category: string): string {
        return `Discover transparent ${category.toLowerCase()} products with detailed ingredient information and certifications. Shop with confidence at Transparency Co.`;
    }

    /**
     * Generate canonical URL
     */
    static getCanonicalUrl(path: string): string {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://transparencyco.com'; // Replace with your domain
        return `${baseUrl}${path}`;
    }
}

/**
 * Social sharing URLs
 */
export class SocialShareHelper {
    static getFacebookShareUrl(url: string, title: string): string {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&t=${encodedTitle}`;
    }

    static getTwitterShareUrl(url: string, title: string): string {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    }

    static getLinkedInShareUrl(url: string, title: string): string {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`;
    }

    static getPinterestShareUrl(url: string, title: string, imageUrl?: string): string {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        const encodedImage = imageUrl ? encodeURIComponent(imageUrl) : '';
        return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}&media=${encodedImage}`;
    }

    static getWhatsAppShareUrl(url: string, title: string): string {
        const encodedText = encodeURIComponent(`${title} ${url}`);
        return `https://api.whatsapp.com/send?text=${encodedText}`;
    }
}

// Export default for convenience
export default UrlHelper;
