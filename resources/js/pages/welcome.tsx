import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import { Link } from '@inertiajs/react';
import { LogOut, Menu, Search, User } from 'lucide-react';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import CategoriesSection from './body/categories-section';
import Footer from './body/footer';
import HeroSection from './body/hero-section';
import TrendingBrands from './body/trending-brands';
import ProductCatalog from './Products/product-catalog';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
];

export default function Welcome() {
    const { auth, products } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleNavigation = (href: string) => {
        // You can replace this with your routing solution (React Router, etc.)
        window.location.href = href;
    };

    const { csrf_token } = usePage().props;
    // added part

    return (
        <>
            <Head title="Home Page">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="font-milk flex min-h-0 flex-col items-center gap-y-4 bg-[#FDFDFC] px-4 tracking-tighter text-[#1b1b18] uppercase sm:px-8 lg:justify-center dark:bg-[#0a0a0a]">
                <header className="sticky top-0 z-50 w-full max-w-[1000px] border-b bg-white py-6 text-sm not-has-[nav]:hidden lg:max-w-[2000px] dark:bg-[#0a0a0a]">
                    <nav className="flex items-center justify-center gap-4">
                        <div className="flex flex-1 items-center justify-between">
                            {/* Logo */}
                            <a href="/" className="flex cursor-pointer items-center space-x-2">
                                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                                    <span className="text-primary-foreground text-lg font-bold">T</span>
                                </div>
                                <span className="font-schoolbell text-xl font-bold tracking-widest capitalize dark:text-white">Transparency Co.</span>
                            </a>

                            {/* Desktop Navigation */}
                            <div className="hidden items-center space-x-8 md:flex">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors dark:text-gray-200"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>

                            {/* Desktop Actions */}
                            <div className="hidden items-center space-x-4 md:flex">
                                {/* Search Icon */}
                                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                                    <Search className="h-5 w-5 dark:text-white" />
                                    <span className="sr-only">Search</span>
                                </Button>

                                {/* Profile Menu */}
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
                                    <DropdownMenuContent className="w-56 dark:border-[#2d2d35] dark:bg-[#23232a]" align="end" forceMount>
                                        {auth.user ? (
                                            <>
                                                {auth.isAdmin && (
                                                    <DropdownMenuItem asChild>
                                                        <a
                                                            href={route('dashboard')}
                                                            className="font-milk flex w-full items-center gap-2 text-sm uppercase dark:text-[#e0e0e5] dark:hover:bg-[#2d2d35]"
                                                        >
                                                            <User className="h-4 w-4" />
                                                            Dashboard
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

                            {/* Mobile Menu */}
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild className="md:hidden">
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-5 w-5 fill-current dark:text-white" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                    <div className="mt-6 mb-6 flex h-full flex-col justify-between space-y-4">
                                        {/* Mobile Navigation Links */}
                                        <div className="flex flex-col space-y-3">
                                            {navigation.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className="font-milk mb-3 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-400 text-gray-700 uppercase hover:bg-gray-100 dark:text-white"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>

                                        {/* Mobile Actions */}
                                        <div className="border-t pt-4">
                                            {auth.user ? (
                                                <div className="flex flex-col items-center space-y-3">
                                                    <div className="flex items-center space-x-3 p-2">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt={auth.user.name} />
                                                            <AvatarFallback>{auth.user.name ? auth.user.name[0].toUpperCase() : 'U'}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-milk text-sm font-medium uppercase">{auth.user.name}</p>
                                                            <p className="font-milk text-muted-foreground text-xs uppercase">{auth.user.email}</p>
                                                        </div>
                                                    </div>

                                                    {auth.isAdmin && (
                                                        <a
                                                            href={route('dashboard')}
                                                            className="font-milk flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 uppercase hover:bg-gray-100"
                                                        >
                                                            <User className="h-4 w-4" />
                                                            Dashboard
                                                        </a>
                                                    )}

                                                    <Link
                                                        href={route('logout')}
                                                        method="post"
                                                        as="button"
                                                        className="font-milk flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 uppercase hover:bg-gray-100"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Logout
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col space-y-3">
                                                    <a
                                                        href={route('login')}
                                                        className="font-milk flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 uppercase hover:bg-gray-100 dark:text-white"
                                                    >
                                                        <User className="h-4 w-4 fill-current dark:text-white" />
                                                        Log in
                                                    </a>
                                                    <a
                                                        href={route('register')}
                                                        className="font-milk flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 uppercase hover:bg-gray-100 dark:text-white"
                                                    >
                                                        <User className="h-4 w-4 fill-current dark:text-white" />
                                                        Sign up
                                                    </a>
                                                </div>
                                            )}

                                            {/* Search Button */}
                                            <button
                                                type="button"
                                                className="font-milk mt-3 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 uppercase hover:bg-gray-100 dark:text-gray-200"
                                                onClick={() => setIsSearchOpen(true)}
                                            >
                                                <Search className="h-4 w-4 fill-current dark:text-white" />
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        {/* Search Modal */}
                        <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                            <CommandInput placeholder="Search for pages, documentation, and more..." />
                            <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup heading="Popular">
                                    <CommandItem onSelect={() => setIsSearchOpen(false)}>
                                        <span>Getting Started Guide</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => setIsSearchOpen(false)}>
                                        <span>API Reference</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => setIsSearchOpen(false)}>
                                        <span>Contact Support</span>
                                    </CommandItem>
                                </CommandGroup>
                                <CommandGroup heading="Pages">
                                    <CommandItem onSelect={() => setIsSearchOpen(false)}>
                                        <span>About Our Company</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => setIsSearchOpen(false)}>
                                        <span>Service Plans</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => setIsSearchOpen(false)}>
                                        <span>Contact Us</span>
                                    </CommandItem>
                                </CommandGroup>
                                <CommandGroup heading="Documentation">
                                    <CommandItem onSelect={() => setIsSearchOpen(false)}>
                                        <span>Installation Guide</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => setIsSearchOpen(false)}>
                                        <span>Configuration</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => setIsSearchOpen(false)}>
                                        <span>Troubleshooting</span>
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </CommandDialog>
                    </nav>
                </header>
                <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 starting:opacity-0">
                    <main className="flex w-full max-w-[1000px] flex-col gap-4 lg:max-w-[2000px] lg:flex-col">
                        <HeroSection />
                        {/* <FeaturedSection /> */}
                        <CategoriesSection />
                        <div className="product-catalog-section">
                            <ProductCatalog
                                products={
                                    products ?? {
                                        data: [],
                                        links: [],
                                        current_page: 1,
                                        last_page: 1,
                                        from: null,
                                        to: null,
                                        total: 0,
                                        prev_page_url: null,
                                        next_page_url: null,
                                    }
                                }
                                filters={{
                                    certificates: [],
                                    price_range: '',
                                    sort_by: '',
                                }}
                            />
                        </div>
                        <TrendingBrands />
                        <Footer />
                        {/* <Laravel12Default /> */}
                    </main>
                </div>
                <div className="hidden h-4 lg:block"></div>
            </div>
        </>
    );
}
