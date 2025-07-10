import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Helper function to get certificates for a category and subcategory
export function getCertificatesForCategory(certificatesByCategory: any, category: string | null, subCategory?: string | null) {
    if (!category) return [];

    const categoryCerts = certificatesByCategory[category];

    if (typeof categoryCerts === 'object' && categoryCerts !== null && !Array.isArray(categoryCerts)) {
        // Handle subcategory-specific certificates (like office-supplies)
        if (subCategory) {
            const subCategoryCerts = categoryCerts[subCategory];
            if (subCategoryCerts && Array.isArray(subCategoryCerts)) {
                return subCategoryCerts;
            }
        }
        return [];
    } else if (Array.isArray(categoryCerts)) {
        // Handle regular category certificates
        return categoryCerts;
    }

    return [];
}
