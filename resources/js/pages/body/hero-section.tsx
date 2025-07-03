import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<{ products: any[]; companies: any[]; categories: string[] }>({
        products: [],
        companies: [],
        categories: [],
    });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    // On mount, set searchQuery from URL param if present
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const search = params.get('search') || '';
            setSearchQuery(search);
        }
    }, []);

    // Fetch suggestions as user types
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions({ products: [], companies: [], categories: [] });
            return;
        }
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            fetch(`/api/search-suggestions?q=${encodeURIComponent(searchQuery)}`)
                .then((res) => res.json())
                .then((data) => setSuggestions(data));
        }, 200);
    }, [searchQuery]);

    const handleSearch = (query?: string) => {
        const q = typeof query === 'string' ? query : searchQuery;
        if (!q.trim()) return;
        setIsSearching(true);
        const params: Record<string, string> = {};
        if (q) params.search = q;
        router.get(route('home'), params, {
            onFinish: () => setIsSearching(false),
        });
        setShowSuggestions(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <section className="relative min-h-[400px] w-full rounded-lg border border-gray-200 bg-gray-50 bg-white shadow-sm sm:min-h-[450px] md:min-h-[500px] dark:border-[#23232a] dark:bg-[#1a1a1f]">
            {/* No background pattern or overlay for a clean, consistent look */}

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-12 text-center sm:py-16 md:py-20">
                {/* Main Heading */}
                <h1 className="font-milk mb-4 text-2xl font-light tracking-wide text-gray-800 sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl dark:text-white">
                    Find Your Perfect Product
                </h1>

                {/* Subheading */}
                <p className="font-milk mx-auto mb-8 max-w-xs text-sm font-light tracking-wide text-gray-700 sm:mb-10 sm:max-w-md sm:text-base md:mb-12 md:max-w-2xl md:text-lg lg:max-w-3xl lg:text-xl xl:text-2xl dark:text-gray-200">
                    Discover transparent, certified products that meet your standards
                </p>

                {/* Search Section */}
                <div className="mx-auto max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl">
                    {/* Main Search Input */}
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-4 sm:h-5 sm:w-5 md:left-6 md:h-6 md:w-6" />
                        <Input
                            ref={inputRef}
                            placeholder="Search for anything (product, company, category, ... )"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onKeyPress={handleKeyPress}
                            onFocus={() => setShowSuggestions(true)}
                            className="font-milk [&::placeholder]:font-milk h-12 pr-10 pl-10 text-sm uppercase sm:h-14 sm:pr-12 sm:pl-12 sm:text-base md:h-16 md:pr-14 md:pl-16 md:text-lg dark:text-white"
                            autoComplete="off"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSuggestions({ products: [], companies: [], categories: [] });
                                    router.get(route('home'));
                                }}
                                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition sm:right-4 md:right-6"
                                tabIndex={-1}
                                aria-label="Clear search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        {isSearching && (
                            <div className="absolute top-1/2 right-10 -translate-y-1/2 sm:right-12 md:right-14">
                                <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent sm:h-5 sm:w-5"></div>
                            </div>
                        )}
                        {/* Suggestions Dropdown */}
                        {showSuggestions &&
                            (suggestions.products.length > 0 || suggestions.companies.length > 0 || suggestions.categories.length > 0) && (
                                <div className="absolute top-full right-0 left-0 z-20 mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-lg sm:max-h-80 md:max-h-96 dark:border-[#23232a] dark:bg-[#18181c]">
                                    {suggestions.products.length > 0 && (
                                        <div>
                                            <div className="font-milk px-3 py-1 text-xs font-semibold text-gray-500 uppercase sm:px-4 dark:text-gray-400">
                                                Products
                                            </div>
                                            {suggestions.products.map((p) => (
                                                <button
                                                    key={`product-${p.id}`}
                                                    className="font-milk block w-full px-3 py-2.5 text-left text-sm uppercase transition-colors hover:bg-gray-100 active:bg-gray-200 sm:px-4 sm:py-2 dark:text-white dark:hover:bg-[#23232a] dark:active:bg-[#2a2a32]"
                                                    onClick={() => handleSearch(p.name)}
                                                >
                                                    <span className="block truncate">{p.name}</span>
                                                    {p.category && <span className="block truncate text-xs text-gray-400">({p.category})</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {suggestions.companies.length > 0 && (
                                        <div>
                                            <div className="font-milk px-3 py-1 text-xs font-semibold text-gray-500 uppercase sm:px-4 dark:text-gray-400">
                                                Companies
                                            </div>
                                            {suggestions.companies.map((c) => (
                                                <button
                                                    key={`company-${c.id}`}
                                                    className="font-milk block w-full px-3 py-2.5 text-left text-sm uppercase transition-colors hover:bg-gray-100 active:bg-gray-200 sm:px-4 sm:py-2 dark:text-white dark:hover:bg-[#23232a] dark:active:bg-[#2a2a32]"
                                                    onClick={() => handleSearch(c.name)}
                                                >
                                                    <span className="block truncate">{c.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {suggestions.categories.length > 0 && (
                                        <div>
                                            <div className="font-milk px-3 py-1 text-xs font-semibold text-gray-500 uppercase sm:px-4 dark:text-gray-400">
                                                Categories
                                            </div>
                                            {suggestions.categories.map((cat, idx) => (
                                                <button
                                                    key={`cat-${idx}`}
                                                    className="font-milk block w-full px-3 py-2.5 text-left text-sm uppercase transition-colors hover:bg-gray-100 active:bg-gray-200 sm:px-4 sm:py-2 dark:text-white dark:hover:bg-[#23232a] dark:active:bg-[#2a2a32]"
                                                    onClick={() => handleSearch(cat)}
                                                >
                                                    <span className="block truncate">{cat}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>

                    {/* Quick Search Suggestions */}
                    <div className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8 sm:gap-3">
                        {['Organic', 'Vegan', 'Eco-friendly', 'BPA Free', 'Cruelty-free', 'New products', 'Under $50', 'Food & Beverage'].map(
                            (term) => (
                                <button
                                    key={term}
                                    onClick={() => {
                                        setSearchQuery(term);
                                        handleSearch(term);
                                    }}
                                    className="font-milk border-gray/20 rounded-full border px-2 py-1 text-xs text-gray-600 uppercase transition-colors hover:bg-white/50 hover:text-gray-800 active:bg-white/70 sm:px-3 sm:py-1.5 sm:text-sm md:px-4 md:py-2 dark:border-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white dark:active:bg-gray-700/50"
                                >
                                    {term}
                                </button>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
