/**
 * Cookie Management Utilities
 * Provides type-safe cookie operations for the frontend
 */

export interface CookieOptions {
    expires?: number; // Days until expiration
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

export class CookieManager {
    /**
     * Set a cookie
     * @param name Cookie name
     * @param value Cookie value
     * @param options Cookie options
     */
    static setCookie(name: string, value: string, options: CookieOptions = {}): void {
        const { expires = 365, path = '/', domain, secure = false, sameSite = 'lax' } = options;

        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (expires > 0) {
            const date = new Date();
            date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
            cookieString += `; expires=${date.toUTCString()}`;
        }

        cookieString += `; path=${path}`;

        if (domain) {
            cookieString += `; domain=${domain}`;
        }

        if (secure) {
            cookieString += `; secure`;
        }

        cookieString += `; samesite=${sameSite}`;

        document.cookie = cookieString;
    }

    /**
     * Get a cookie value
     * @param name Cookie name
     * @returns Cookie value or null if not found
     */
    static getCookie(name: string): string | null {
        if (typeof document === 'undefined') return null;

        const nameEQ = encodeURIComponent(name) + '=';
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length));
            }
        }

        return null;
    }

    /**
     * Check if a cookie exists
     * @param name Cookie name
     * @returns True if cookie exists
     */
    static hasCookie(name: string): boolean {
        return this.getCookie(name) !== null;
    }

    /**
     * Delete a cookie
     * @param name Cookie name
     * @param path Cookie path (should match the path used when setting)
     * @param domain Cookie domain (should match the domain used when setting)
     */
    static deleteCookie(name: string, path: string = '/', domain?: string): void {
        let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;

        if (domain) {
            cookieString += `; domain=${domain}`;
        }

        document.cookie = cookieString;
    }

    /**
     * Get all cookies as an object
     * @returns Object with cookie names as keys and values as values
     */
    static getAllCookies(): Record<string, string> {
        if (typeof document === 'undefined') return {};

        const cookies: Record<string, string> = {};
        const cookieArray = document.cookie.split(';');

        for (let cookie of cookieArray) {
            cookie = cookie.trim();
            if (cookie) {
                const [name, value] = cookie.split('=');
                if (name && value) {
                    cookies[decodeURIComponent(name)] = decodeURIComponent(value);
                }
            }
        }

        return cookies;
    }

    /**
     * Set a JSON object as a cookie
     * @param name Cookie name
     * @param obj Object to store
     * @param options Cookie options
     */
    static setJsonCookie(name: string, obj: any, options: CookieOptions = {}): void {
        try {
            const jsonString = JSON.stringify(obj);
            this.setCookie(name, jsonString, options);
        } catch (error) {
            console.error('Failed to set JSON cookie:', error);
        }
    }

    /**
     * Get a JSON object from a cookie
     * @param name Cookie name
     * @returns Parsed object or null if not found or invalid JSON
     */
    static getJsonCookie<T = any>(name: string): T | null {
        try {
            const value = this.getCookie(name);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Failed to parse JSON cookie:', error);
            return null;
        }
    }
}

/**
 * Specific cookie helpers for common use cases
 */
export class AppCookies {
    // First visit tracking
    static markAsVisited(): void {
        CookieManager.setCookie('hasVisitedBefore', 'true', { expires: 365 });
    }

    static isFirstVisit(): boolean {
        return !CookieManager.hasCookie('hasVisitedBefore');
    }

    // User preferences
    static setUserPreference(key: string, value: string): void {
        const prefs = this.getUserPreferences();
        prefs[key] = value;
        CookieManager.setJsonCookie('userPreferences', prefs, { expires: 365 });
    }

    static getUserPreference(key: string): string | null {
        const prefs = this.getUserPreferences();
        return prefs[key] || null;
    }

    static getUserPreferences(): Record<string, string> {
        return CookieManager.getJsonCookie('userPreferences') || {};
    }

    // Theme preference
    static setTheme(theme: 'light' | 'dark' | 'system'): void {
        CookieManager.setCookie('theme', theme, { expires: 365 });
    }

    static getTheme(): 'light' | 'dark' | 'system' | null {
        return CookieManager.getCookie('theme') as 'light' | 'dark' | 'system' | null;
    }

    // Language preference
    static setLanguage(language: string): void {
        CookieManager.setCookie('language', language, { expires: 365 });
    }

    static getLanguage(): string | null {
        return CookieManager.getCookie('language');
    }

    // Shopping cart (for e-commerce)
    static setCartItems(items: any[]): void {
        CookieManager.setJsonCookie('cartItems', items, { expires: 30 });
    }

    static getCartItems(): any[] {
        return CookieManager.getJsonCookie('cartItems') || [];
    }

    static clearCart(): void {
        CookieManager.deleteCookie('cartItems');
    }

    // Recently viewed products
    static addRecentlyViewed(productId: number): void {
        const recent = this.getRecentlyViewed();
        const filtered = recent.filter((id) => id !== productId);
        filtered.unshift(productId);

        // Keep only last 10 items
        const limited = filtered.slice(0, 10);
        CookieManager.setJsonCookie('recentlyViewed', limited, { expires: 30 });
    }

    static getRecentlyViewed(): number[] {
        return CookieManager.getJsonCookie('recentlyViewed') || [];
    }

    // Analytics consent
    static setAnalyticsConsent(consent: boolean): void {
        CookieManager.setCookie('analyticsConsent', consent.toString(), { expires: 365 });
    }

    static hasAnalyticsConsent(): boolean | null {
        const consent = CookieManager.getCookie('analyticsConsent');
        return consent ? consent === 'true' : null;
    }
}

// Export default for convenience
export default CookieManager;
