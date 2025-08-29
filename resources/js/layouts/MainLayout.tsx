import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import CatLoader from '@/components/CatLoader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Fuse from 'fuse.js';
import { Bell, Calendar, Home, LogOut, Mail, Menu, MessageSquare, Search, Settings, User } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
    { name: 'Learn', href: '/certifications' },
];

const navIconMap: Record<string, any> = {
    Home: Home,
    'My Profile': User,
    'My Vacancy': Calendar,
    Message: MessageSquare,
    Subscription: Mail,
    Notification: Bell,
    Setting: Settings,
};

// Add types for auth and page props

type AuthUser = {
    name?: string;
    email?: string;
    roles?: Array<{ name: string }> | string[];
    // add other user fields as needed
};

type PageProps = {
    auth: {
        user?: AuthUser | null;
        isAdmin?: boolean;
        // add other auth fields as needed
    };
    // add other global props as needed
};

type SuggestionItem = { type: string; value: string; id: string | number; category?: string };

// SuggestionDropdown component
function SuggestionDropdown({
    suggestions,
    loading,
    error,
    show,
    highlightedIndex: controlledHighlightedIndex,
    setHighlightedIndex: setControlledHighlightedIndex,
    onSelect,
    inputRef,
    searchQuery,
    suggestionLocked,
}: {
    suggestions: SuggestionItem[];
    loading: boolean;
    error: string | null;
    show: boolean;
    highlightedIndex: number | null;
    setHighlightedIndex: (idx: number | null) => void;
    onSelect: (item: SuggestionItem) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
    searchQuery: string;
    suggestionLocked: boolean;
}) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    // Use local state for keyboard navigation
    const [localHighlightedIndex, setLocalHighlightedIndex] = useState<number | null>(null);
    const highlightedIndex = controlledHighlightedIndex !== null ? controlledHighlightedIndex : localHighlightedIndex;
    const setHighlightedIndex = (idx: number | null) => {
        setLocalHighlightedIndex(idx);
        setControlledHighlightedIndex(idx);
    };
    // Keyboard navigation for dropdown
    useEffect(() => {
        if (!show || suggestions.length === 0) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement !== inputRef.current) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex(highlightedIndex === null || highlightedIndex === suggestions.length - 1 ? 0 : highlightedIndex + 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex(highlightedIndex === null || highlightedIndex === 0 ? suggestions.length - 1 : highlightedIndex - 1);
            } else if (e.key === 'Enter') {
                if (highlightedIndex !== null && suggestions[highlightedIndex]) {
                    onSelect(suggestions[highlightedIndex]);
                }
            } else if (e.key === 'Escape') {
                setHighlightedIndex(null);
                inputRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [show, suggestions, highlightedIndex, onSelect, inputRef]);

    // Close on outside click
    useEffect(() => {
        if (!show) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setHighlightedIndex(null);
                inputRef.current.blur();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [show, setHighlightedIndex, inputRef]);

    if (!show) return null;
    return (
        <div
            ref={dropdownRef}
            id="navbar-search-suggestions"
            className="absolute top-full right-0 left-0 z-20 mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-lg lg:max-h-60 xl:max-h-80 dark:border-[#282828] dark:bg-[#121212]"
            role="listbox"
            aria-label="Search suggestions"
        >
            {loading && (
                <div className="flex items-center justify-center py-3 lg:py-4">
                    <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent lg:h-5 lg:w-5"></div>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-200">Loading...</span>
                </div>
            )}
            {!loading && !error && suggestions.length === 0 && searchQuery.trim() && (
                <div className="py-3 text-center text-xs text-gray-500 lg:py-4 lg:text-sm dark:text-gray-200">No results found</div>
            )}
            {error && <div className="py-3 text-center text-xs text-red-500 lg:py-4 lg:text-sm dark:text-red-400">{error}</div>}
            {suggestions.length > 0 && (
                <>
                    {suggestions.map((item, idx) => (
                        <button
                            key={`${item.type}-${item.id}`}
                            id={`navbar-suggestion-${idx}`}
                            className={`font-milk block w-full px-2 py-2 text-left text-xs uppercase transition-colors hover:bg-gray-100 active:bg-gray-200 lg:px-3 lg:py-2.5 lg:text-sm dark:text-white dark:hover:bg-[#282828] dark:active:bg-[#282828] ${highlightedIndex === idx ? 'bg-gray-100 dark:bg-[#23232a]' : ''} ${suggestionLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            onMouseLeave={() => setHighlightedIndex(null)}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onSelect(item);
                            }}
                            role="option"
                            aria-selected={highlightedIndex === idx}
                            aria-label={item.value}
                            tabIndex={-1}
                            disabled={suggestionLocked}
                        >
                            <span className="block truncate">{highlightMatch(item.value, searchQuery)}</span>
                            {item.category && <span className="block truncate text-xs text-gray-400">({item.category})</span>}
                        </button>
                    ))}
                </>
            )}
        </div>
    );
}

function highlightMatch(text: string, query: string) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    return text.split(regex).map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className="rounded bg-yellow-200 px-0.5 dark:bg-yellow-700">
                {part}
            </mark>
        ) : (
            part
        ),
    );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<PageProps>().props;
    const [isOpen, setIsOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<{ products: any[]; companies: any[]; categories: string[] }>({
        products: [],
        companies: [],
        categories: [],
    });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
    const [suggestionLocked, setSuggestionLocked] = useState(false);
    const [searchInProgress, setSearchInProgress] = useState(false);

    // Check if user has admin role (admin, moderator, or content_manager)
    const hasAdminRole =
        auth.user &&
        (auth.user.roles?.some((role: any) => ['admin', 'moderator', 'content_manager'].includes(role.name)) ||
            auth.user.roles?.some((role: any) => ['admin', 'moderator', 'content_manager'].includes(role)));

    // Check if user is admin (for user management access)
    const isAdmin =
        auth.user && (auth.user.roles?.some((role: any) => role.name === 'admin') || auth.user.roles?.some((role: any) => role === 'admin'));

    React.useEffect(() => {
        if (document.readyState === 'complete') {
            setLoading(false);
            return;
        }
        const handleLoad = () => setLoading(false);
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
    }, []);

    // On mount, set searchQuery from URL param if present
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const search = params.get('search') || '';
            setSearchQuery(search);
        }
    }, []);

    // Fuzzy search function using Fuse.js
    function applyFuzzySearch(data: any, query: string) {
        if (!query.trim()) return data;

        const fuseOptions = {
            // Threshold: 0.0 = perfect match, 1.0 = very loose match
            threshold: 0.3,
            // Include score in results
            includeScore: true,
            // Keys to search in
            keys: ['name', 'description', 'category', 'sub_category', 'item'],
            // Ignore location
            ignoreLocation: true,
            // Use extended search (supports regex-like patterns)
            useExtendedSearch: true,
            // Minimum character length for matching
            minMatchCharLength: 2,
        };

        // Create Fuse instances for each data type
        const productFuse = new Fuse(data.products || [], fuseOptions);
        const companyFuse = new Fuse(data.companies || [], fuseOptions);

        // Search products with fuzzy matching
        const fuzzyProducts = productFuse
            .search(query)
            .slice(0, 5) // Limit to top 5 results
            .map((result) => result.item);

        // Search companies with fuzzy matching
        const fuzzyCompanies = companyFuse
            .search(query)
            .slice(0, 5) // Limit to top 5 results
            .map((result) => result.item);

        // For categories, use simple fuzzy matching
        const fuzzyCategories = (data.categories || [])
            .filter(
                (cat: string) =>
                    cat.toLowerCase().includes(query.toLowerCase()) ||
                    query
                        .toLowerCase()
                        .split('')
                        .every((char) => cat.toLowerCase().includes(char)),
            )
            .slice(0, 5);

        return {
            products: fuzzyProducts,
            companies: fuzzyCompanies,
            categories: fuzzyCategories,
        };
    }

    // Fetch suggestions as user types
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions({ products: [], companies: [], categories: [] });
            setSuggestionsLoading(false);
            setSuggestionsError(null);
            return;
        }
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        setSuggestionsLoading(true);
        setSuggestionsError(null);
        debounceTimeout.current = setTimeout(() => {
            fetch(`/api/search-suggestions?q=${encodeURIComponent(searchQuery)}`)
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch suggestions');
                    return res.json();
                })
                .then((data) => {
                    // Apply fuzzy search to the results for better matching
                    const fuzzyResults = applyFuzzySearch(data, searchQuery);
                    setSuggestions(fuzzyResults);
                })
                .catch(() => {
                    setSuggestions({ products: [], companies: [], categories: [] });
                    setSuggestionsError('Could not load suggestions. Please try again.');
                })
                .finally(() => setSuggestionsLoading(false));
        }, 200);
    }, [searchQuery]);

    // Log plain search analytics (not from suggestion)
    async function logSearchAnalytics(query: string) {
        try {
            await fetch('/api/search-analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ query }),
            });
        } catch (e) {
            // Silently fail, analytics only
        }
    }

    // Custom smooth scroll function
    function customSmoothScrollTo(element: HTMLElement, duration = 700) {
        const start = window.scrollY || window.pageYOffset;
        const end = element.getBoundingClientRect().top + start;
        const change = end - start;
        const startTime = performance.now();

        function easeInOutQuad(t: number) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        function animateScroll(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutQuad(progress);
            window.scrollTo(0, start + change * ease);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }

        requestAnimationFrame(animateScroll);
    }

    // fromSuggestion: true if triggered from a suggestion click, false/undefined for plain search
    const handleSearch = async (query?: string, fromSuggestion?: boolean) => {
        const q = typeof query === 'string' ? query : searchQuery;
        if (!q.trim()) return;
        if (!fromSuggestion) {
            await logSearchAnalytics(q);
        }
        setIsSearching(true);
        const params: Record<string, string> = {};
        if (q) params.search = q;
        router.get(route('home'), params, {
            onFinish: () => {
                setIsSearching(false);
                setTimeout(() => {
                    const catalog = document.getElementById('product-catalog-section');
                    if (catalog) {
                        setTimeout(() => {
                            customSmoothScrollTo(catalog, 700); // 700ms duration
                            setTimeout(() => setSearchInProgress(false), 700); // unlock after scroll
                        }, 500); // 1 second pause before scrolling
                    } else {
                        setSearchInProgress(false);
                    }
                }, 100);
            },
        });
        setShowSuggestions(false);
    };

    const allSuggestions: SuggestionItem[] = [
        ...suggestions.products.map((p) => ({ type: 'product', value: p.name, id: p.id, category: p.category })),
        ...suggestions.companies.map((c) => ({ type: 'company', value: c.name, id: c.id })),
        ...suggestions.categories.map((cat, idx) => ({ type: 'category', value: cat, id: idx })),
    ];

    // Suggestion select handler
    const handleSuggestionSelect = useCallback(
        (item: SuggestionItem) => {
            if (searchInProgress) return;
            setSearchInProgress(true);
            logSuggestionClick(item.type, item.id, item.value);
            handleSearch(item.value, true); // Trigger search immediately
            setShowSuggestions(false);
            setHighlightedIndex(null);
            inputRef.current?.blur();
        },
        [handleSearch, searchInProgress],
    );

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                setIsSearchFocused(false);
                // Also close quick search suggestions by clearing search query
                if (!searchQuery.trim()) {
                    setSearchQuery('');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchQuery]);

    async function logSuggestionClick(type: string, id: string | number, value: string) {
        try {
            await fetch('/api/search-suggestions/click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ type, id, value }),
            });
        } catch (e) {
            // Silently fail, analytics only
        }
    }

    return (
        <>
            {loading && <CatLoader />}
            <Head title="Home Page">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="font-milk flex min-h-0 flex-col items-center gap-y-4 bg-[#FDFDFC] px-4 py-6 tracking-tighter text-[#1b1b18] uppercase transition-all duration-500 ease-in-out sm:px-8 lg:justify-center lg:py-2 dark:bg-[#121212]">
                <header className="fixed top-0 z-50 w-full max-w-[1000px] border-b bg-white px-2 py-4 text-sm transition-all duration-500 ease-in-out not-has-[nav]:hidden lg:max-w-[2000px] lg:px-6 dark:bg-[#121212]">
                    <nav className="flex items-center justify-center gap-4">
                        <div className="flex flex-1 items-center justify-between">
                            {/* Logo */}
                            <a href="/" className="flex cursor-pointer items-center space-x-2 px-2">
                                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                                    <span className="text-primary-foreground text-lg font-bold">T</span>
                                </div>
                                {/* <span className="font-schoolbell text-xl font-bold tracking-widest capitalize dark:text-white">Transparency Co.</span> */}
                            </a>

                            {/* Desktop Navigation with Search Bar in Middle */}
                            <div className="hidden min-w-0 flex-1 items-center space-x-1 md:px-8 lg:flex lg:space-x-2 lg:px-2 lg:px-16 xl:space-x-4 xl:px-32">
                                {navigation.slice(0, 2).map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="font-milk text-foreground hover:bg-muted/90 m-0 rounded-lg py-2 text-base uppercase transition-all duration-300 ease-in-out lg:px-4 dark:text-[#e0e0e5] dark:hover:bg-white/10"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </a>
                                ))}

                                {/* Search Bar - Between About and Services */}
                                <div className="mx-2 min-w-0 flex-1 xl:mx-6 2xl:mx-10">
                                    <div className="relative w-full">
                                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 lg:h-4 lg:w-4" />
                                        <Input
                                            ref={inputRef}
                                            placeholder="Search Products..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setShowSuggestions(true);
                                                setHighlightedIndex(null);
                                            }}
                                            onFocus={() => {
                                                setIsSearchFocused(true);
                                                if (searchQuery.trim()) setShowSuggestions(true);
                                            }}
                                            onBlur={() => {
                                                setIsSearchFocused(false);
                                            }}
                                            onKeyDown={(e) => {
                                                if (searchInProgress) return;
                                                if (e.key === 'Enter') {
                                                    if (highlightedIndex !== null && showSuggestions && allSuggestions[highlightedIndex]) {
                                                        handleSuggestionSelect(allSuggestions[highlightedIndex]);
                                                    } else {
                                                        handleSearch(undefined, false);
                                                    }
                                                } else if (
                                                    (e.key === 'ArrowDown' || e.key === 'ArrowUp') &&
                                                    showSuggestions &&
                                                    allSuggestions.length > 0
                                                ) {
                                                    e.preventDefault();
                                                    setHighlightedIndex((prev) => {
                                                        if (e.key === 'ArrowDown') {
                                                            if (prev === null || prev === allSuggestions.length - 1) return 0;
                                                            return prev + 1;
                                                        } else {
                                                            if (prev === null || prev === 0) return allSuggestions.length - 1;
                                                            return prev - 1;
                                                        }
                                                    });
                                                } else if (e.key === 'Escape') {
                                                    setShowSuggestions(false);
                                                }
                                            }}
                                            className="font-milk [&::placeholder]:font-milk h-9 w-full !rounded-2xl bg-[#f0f0f0] pr-8 pl-8 text-xs text-[#1b1b18] uppercase transition-all duration-300 ease-in-out lg:h-12 lg:pr-10 lg:pl-14 lg:text-sm dark:bg-[#282828] dark:text-white"
                                            autoComplete="off"
                                            aria-label="Search for products, companies, or categories"
                                            aria-autocomplete="list"
                                            aria-controls="navbar-search-suggestions"
                                            aria-activedescendant={highlightedIndex !== null ? `navbar-suggestion-${highlightedIndex}` : undefined}
                                            disabled={searchInProgress}
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setSuggestions({ products: [], companies: [], categories: [] });
                                                    setShowSuggestions(false);
                                                    setHighlightedIndex(null);
                                                    // Just clear local state without navigation - we're already on home page
                                                    // This prevents any loading or navigation
                                                    setTimeout(() => {
                                                        inputRef.current?.focus();
                                                    }, 0);
                                                }}
                                                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition"
                                                tabIndex={0}
                                                aria-label="Clear search input"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 lg:h-4 lg:w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                        {isSearching && (
                                            <div className="absolute top-1/2 right-8 -translate-y-1/2 lg:right-10">
                                                <div className="border-muted-foreground h-3 w-3 animate-spin rounded-full border-2 border-t-transparent lg:h-4 lg:w-4"></div>
                                            </div>
                                        )}
                                        <SuggestionDropdown
                                            suggestions={allSuggestions}
                                            loading={suggestionsLoading}
                                            error={suggestionsError}
                                            show={showSuggestions && searchQuery.trim().length > 0}
                                            highlightedIndex={highlightedIndex}
                                            setHighlightedIndex={setHighlightedIndex}
                                            onSelect={handleSuggestionSelect}
                                            inputRef={inputRef}
                                            searchQuery={searchQuery}
                                            suggestionLocked={searchInProgress}
                                        />

                                        {/* Quick Search Suggestions */}
                                        {!searchQuery && !showSuggestions && isSearchFocused && (
                                            <div className="absolute top-full right-0 left-0 z-10 mt-2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg transition-all duration-300 ease-in-out dark:border-[#282828] dark:bg-[#121212]">
                                                <div className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                    Quick Search
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {[
                                                        'Organic',
                                                        'Vegan',
                                                        'Eco-friendly',
                                                        'BPA Free',
                                                        'Cruelty-free',
                                                        'New products',
                                                        'Under $50',
                                                        'Food & Beverage',
                                                    ].map((term) => (
                                                        <button
                                                            key={term}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                            }}
                                                            onClick={() => {
                                                                // Use Inertia router for smooth navigation with same scroll behavior as search suggestions
                                                                router.get(
                                                                    route('home'),
                                                                    { search: term },
                                                                    {
                                                                        onFinish: () => {
                                                                            setIsSearching(false);
                                                                            setTimeout(() => {
                                                                                const catalog = document.getElementById('product-catalog-section');
                                                                                if (catalog) {
                                                                                    setTimeout(() => {
                                                                                        customSmoothScrollTo(catalog, 700); // 700ms duration - same as search suggestions
                                                                                    }, 500); // 1 second pause before scrolling - same as search suggestions
                                                                                }
                                                                            }, 100);
                                                                        },
                                                                    },
                                                                );
                                                            }}
                                                            className="font-milk cursor-pointer rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-600 uppercase transition-colors hover:bg-[#121212] hover:text-gray-800 active:bg-gray-100 dark:border-[#282828] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:active:bg-gray-700"
                                                        >
                                                            {term}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {navigation.slice(2).map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="font-milk text-foreground hover:bg-muted/40 m-0 rounded-lg px-4 py-2 text-base uppercase transition-all duration-300 ease-in-out dark:text-[#e0e0e5] dark:hover:bg-white/10"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>

                            {/* Desktop Actions */}
                            <div className="hidden items-center space-x-4 lg:flex">
                                <AppearanceToggleDropdown />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                {auth.user ? (
                                                    <>
                                                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={auth.user.name} />
                                                        <AvatarFallback>{auth.user.name ? auth.user.name[0].toUpperCase() : 'U'}</AvatarFallback>
                                                    </>
                                                ) : (
                                                    <AvatarFallback>
                                                        <User className="h-4 w-4 dark:text-white" />
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56 transition-all duration-300 ease-in-out dark:border-[#2d2d35] dark:bg-[#23232a]"
                                        align="end"
                                        forceMount
                                    >
                                        {auth.user ? (
                                            <>
                                                {hasAdminRole ? (
                                                    <DropdownMenuItem asChild>
                                                        <a
                                                            href={route('dashboard')}
                                                            className="font-milk flex w-full items-center gap-2 text-sm uppercase dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                                        >
                                                            <User className="h-4 w-4" />
                                                            Dashboard
                                                        </a>
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem asChild>
                                                        <a
                                                            href={route('profile.edit')}
                                                            className="font-milk flex w-full items-center gap-2 text-sm uppercase dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                                        >
                                                            <User className="h-4 w-4" />
                                                            Profile
                                                        </a>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route('logout')}
                                                        method="post"
                                                        as="button"
                                                        className="font-milk flex w-full items-center gap-2 text-sm uppercase dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Logout
                                                    </Link>
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <a
                                                        href={route('login')}
                                                        className="font-milk flex w-full items-center gap-2 text-sm uppercase dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                                    >
                                                        <User className="h-4 w-4 fill-current dark:text-white" />
                                                        Log in
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <a
                                                        href={route('register')}
                                                        className="font-milk flex w-full items-center gap-2 text-sm uppercase dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                                    >
                                                        <User className="h-4 w-4 fill-current dark:text-white" />
                                                        Sign up
                                                    </a>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Mobile Search Bar - Outside Sidebar */}
                            <div className="mx-2 min-w-0 flex-1 lg:hidden">
                                <div className="relative w-full">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        placeholder="Search anything"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowSuggestions(true);
                                            setHighlightedIndex(null);
                                        }}
                                        onFocus={() => {
                                            setIsSearchFocused(true);
                                            if (searchQuery.trim()) setShowSuggestions(true);
                                        }}
                                        onBlur={() => {
                                            setIsSearchFocused(false);
                                        }}
                                        onKeyDown={(e) => {
                                            if (searchInProgress) return;
                                            if (e.key === 'Enter') {
                                                if (highlightedIndex !== null && showSuggestions && allSuggestions[highlightedIndex]) {
                                                    handleSuggestionSelect(allSuggestions[highlightedIndex]);
                                                } else {
                                                    handleSearch(undefined, false);
                                                }
                                            } else if (
                                                (e.key === 'ArrowDown' || e.key === 'ArrowUp') &&
                                                showSuggestions &&
                                                allSuggestions.length > 0
                                            ) {
                                                e.preventDefault();
                                                setHighlightedIndex((prev) => {
                                                    if (e.key === 'ArrowDown') {
                                                        if (prev === null || prev === allSuggestions.length - 1) return 0;
                                                        return prev + 1;
                                                    } else {
                                                        if (prev === null || prev === 0) return allSuggestions.length - 1;
                                                        return prev - 1;
                                                    }
                                                });
                                            } else if (e.key === 'Escape') {
                                                setShowSuggestions(false);
                                            }
                                        }}
                                        className="font-milk [&::placeholder]:font-milk h-11 w-full !rounded-2xl bg-[#f0f0f0] pr-8 pl-10 text-xs text-[#1b1b18] uppercase transition-all duration-300 ease-in-out dark:bg-[#282828] dark:text-white"
                                        autoComplete="off"
                                        aria-label="Search for products, companies, or categories"
                                        disabled={searchInProgress}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setSuggestions({ products: [], companies: [], categories: [] });
                                                setShowSuggestions(false);
                                                setHighlightedIndex(null);
                                                // Just clear local state without navigation - we're already on home page
                                                // This prevents any loading or navigation
                                                setTimeout(() => {
                                                    inputRef.current?.focus();
                                                }, 0);
                                            }}
                                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition"
                                            tabIndex={0}
                                            aria-label="Clear search input"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                    {isSearching && (
                                        <div className="absolute top-1/2 right-8 -translate-y-1/2">
                                            <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                                        </div>
                                    )}
                                    {showSuggestions && searchQuery.trim().length > 0 && (
                                        <div className="absolute top-full right-0 left-0 z-20 mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-lg transition-all duration-300 ease-in-out dark:border-[#282828] dark:bg-[#121212]">
                                            {suggestionsLoading && (
                                                <div className="flex items-center justify-center py-3">
                                                    <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-200">Loading...</span>
                                                </div>
                                            )}
                                            {!suggestionsLoading && !suggestionsError && allSuggestions.length === 0 && (
                                                <div className="py-3 text-center text-xs text-gray-500 dark:text-gray-200">No results found</div>
                                            )}
                                            {suggestionsError && (
                                                <div className="py-3 text-center text-xs text-red-500 dark:text-red-400">{suggestionsError}</div>
                                            )}
                                            {allSuggestions.length > 0 && (
                                                <>
                                                    {allSuggestions.map((item, idx) => (
                                                        <button
                                                            key={`${item.type}-${item.id}`}
                                                            className={`font-milk block w-full px-2 py-2 text-left text-xs uppercase transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-white dark:hover:bg-[#282828] dark:active:bg-[#282828] ${highlightedIndex === idx ? 'bg-gray-100 dark:bg-[#23232a]' : ''} ${suggestionLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                                            onMouseEnter={() => setHighlightedIndex(idx)}
                                                            onMouseLeave={() => setHighlightedIndex(null)}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                handleSuggestionSelect(item);
                                                            }}
                                                            role="option"
                                                            aria-selected={highlightedIndex === idx}
                                                            aria-label={item.value}
                                                            tabIndex={-1}
                                                            disabled={suggestionLocked}
                                                        >
                                                            <span className="block truncate">{highlightMatch(item.value, searchQuery)}</span>
                                                            {item.category && (
                                                                <span className="block truncate text-xs text-gray-400">({item.category})</span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Mobile Quick Search Suggestions */}
                                    {!searchQuery && !showSuggestions && isSearchFocused && (
                                        <div className="absolute top-full right-0 left-0 z-20 mt-2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg transition-all duration-300 ease-in-out dark:border-[#282828] dark:bg-[#121212]">
                                            <div className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Quick Search
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {[
                                                    'Organic',
                                                    'Vegan',
                                                    'Eco-friendly',
                                                    'BPA Free',
                                                    'Cruelty-free',
                                                    'New products',
                                                    'Under $50',
                                                    'Food & Beverage',
                                                ].map((term) => (
                                                    <button
                                                        key={term}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                        onClick={() => {
                                                            // Use Inertia router for smooth navigation with same scroll behavior as search suggestions
                                                            router.get(
                                                                route('home'),
                                                                { search: term },
                                                                {
                                                                    onFinish: () => {
                                                                        setIsSearching(false);
                                                                        setTimeout(() => {
                                                                            const catalog = document.getElementById('product-catalog-section');
                                                                            if (catalog) {
                                                                                setTimeout(() => {
                                                                                    customSmoothScrollTo(catalog, 700); // 700ms duration - same as search suggestions
                                                                                }, 500); // 1 second pause before scrolling - same as search suggestions
                                                                            }
                                                                        }, 100);
                                                                    },
                                                                },
                                                            );
                                                        }}
                                                        className="font-milk cursor-pointer rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-600 uppercase transition-colors hover:bg-gray-50 hover:text-gray-800 active:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:active:bg-gray-700"
                                                    >
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Menu */}
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild className="lg:hidden">
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-5 w-5 fill-current dark:text-white" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    hideDefaultClose={true}
                                    className="bg-background text-foreground flex h-full w-[270px] max-w-[90vw] flex-col rounded-r-2xl p-0 shadow-xl transition-all duration-500 ease-in-out dark:bg-[#1a1a1f] dark:text-[#e0e0e5]"
                                >
                                    {/* Top Bar: Dark Mode Toggle & Close Button */}
                                    <div className="flex items-center justify-between px-4 pt-4 pb-2 uppercase">
                                        <AppearanceToggleDropdown />
                                        <SheetTrigger asChild>
                                            <Button variant="ghost" size="icon" className="ml-auto">
                                                <span className="sr-only">Close menu</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </Button>
                                        </SheetTrigger>
                                    </div>

                                    {/* Profile Section */}
                                    <div className="border-border/20 flex flex-col items-center border-b px-4 py-4 uppercase dark:border-white/10">
                                        <Avatar className="mb-2 h-16 w-16 ring-4 ring-white/20">
                                            <AvatarImage src="/placeholder.svg?height=64&width=64" alt={auth.user?.name || 'User'} />
                                            <AvatarFallback>{auth.user?.name ? auth.user.name[0].toUpperCase() : 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-milk text-lg font-semibold">{auth.user?.name || 'Guest'}</div>
                                        <div className="text-dark text-xs dark:text-white/70">{auth.user?.email || ''}</div>
                                    </div>
                                    {/* Navigation Links & Actions */}
                                    <div className="flex flex-1 flex-col justify-between uppercase">
                                        <div className="flex flex-col space-y-3 px-4 py-6">
                                            {navigation.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className="font-milk text-foreground hover:bg-muted/40 rounded-lg px-3 py-2 text-base uppercase transition-all duration-300 ease-in-out dark:text-[#e0e0e5] dark:hover:bg-white/10"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>
                                        <div className="flex flex-col space-y-3 px-4 pb-6">
                                            {auth.user ? (
                                                <>
                                                    {hasAdminRole ? (
                                                        <a
                                                            href={route('dashboard')}
                                                            className="font-milk text-foreground hover:bg-muted/40 flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all duration-300 ease-in-out dark:text-[#e0e0e5] dark:hover:bg-white/10"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            Dashboard
                                                        </a>
                                                    ) : (
                                                        <a
                                                            href={route('profile.edit')}
                                                            className="font-milk text-foreground hover:bg-muted/40 flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all duration-300 ease-in-out dark:text-[#e0e0e5] dark:hover:bg-white/10"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            Profile
                                                        </a>
                                                    )}
                                                    <Link
                                                        href={route('logout')}
                                                        method="post"
                                                        as="button"
                                                        className="font-milk bg-muted/40 text-foreground hover:bg-muted/60 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base uppercase transition-all duration-300 ease-in-out dark:bg-white/10 dark:text-[#e0e0e5] dark:hover:bg-white/20"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <LogOut className="h-5 w-5" />
                                                        Log Out
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    <a
                                                        href={route('login')}
                                                        className="font-milk text-foreground hover:bg-muted/40 flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all duration-300 ease-in-out dark:text-[#e0e0e5] dark:hover:bg-white/10"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        Log in
                                                    </a>
                                                    <a
                                                        href={route('register')}
                                                        className="font-milk text-foreground hover:bg-muted/40 flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all duration-300 ease-in-out dark:text-[#e0e0e5] dark:hover:bg-white/10"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        Sign up
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </nav>
                </header>
                <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 starting:opacity-0">
                    <main className="z-0 flex w-full max-w-[1000px] flex-col pt-16 transition-all duration-500 ease-in-out md:pt-16 lg:max-w-[2000px] lg:flex-col lg:pt-22">
                        {children}
                    </main>
                </div>
                <div className="hidden h-4 lg:block"></div>
            </div>
        </>
    );
}
