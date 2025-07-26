import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, Calendar, Home, LogOut, Mail, Menu, MessageSquare, Search, Settings, User } from 'lucide-react';
import React from 'react';

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

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<PageProps>().props;
    const [isOpen, setIsOpen] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

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

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 transition-opacity dark:bg-[#0a0a0a]/90">
                    <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
                </div>
            )}
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
                                        className="font-milk text-foreground hover:bg-muted/40 rounded-lg px-3 py-2 text-base uppercase transition dark:text-[#e0e0e5] dark:hover:bg-white/10"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            {/* Desktop Actions */}
                            <div className="hidden items-center space-x-4 md:flex">
                                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                                    <Search className="h-5 w-5 dark:text-white" />
                                    <span className="sr-only">Search</span>
                                </Button>
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
                                    <DropdownMenuContent className="w-56 dark:border-[#2d2d35] dark:bg-[#23232a]" align="end" forceMount>
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
                            {/* Mobile Menu */}
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild className="md:hidden">
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-5 w-5 fill-current dark:text-white" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    hideDefaultClose={true}
                                    className="bg-background text-foreground flex h-full w-[270px] max-w-[90vw] flex-col rounded-r-2xl p-0 shadow-xl dark:bg-[#1a1a1f] dark:text-[#e0e0e5]"
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
                                        <div className="text-xs text-white/70">{auth.user?.email || ''}</div>
                                    </div>
                                    {/* Navigation Links & Actions */}
                                    <div className="flex flex-1 flex-col justify-between uppercase">
                                        <div className="flex flex-col space-y-3 px-4 py-6">
                                            {navigation.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className="font-milk text-foreground hover:bg-muted/40 rounded-lg px-3 py-2 text-base uppercase transition dark:text-[#e0e0e5] dark:hover:bg-white/10"
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
                                                            className="font-milk text-foreground hover:bg-muted/40 flex items-center gap-3 rounded-lg px-3 py-2 text-base transition dark:text-[#e0e0e5] dark:hover:bg-white/10"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            Dashboard
                                                        </a>
                                                    ) : (
                                                        <a
                                                            href={route('profile.edit')}
                                                            className="font-milk text-foreground hover:bg-muted/40 flex items-center gap-3 rounded-lg px-3 py-2 text-base transition dark:text-[#e0e0e5] dark:hover:bg-white/10"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            Profile
                                                        </a>
                                                    )}
                                                    <Link
                                                        href={route('logout')}
                                                        method="post"
                                                        as="button"
                                                        className="font-milk bg-muted/40 text-foreground hover:bg-muted/60 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base uppercase dark:bg-white/10 dark:text-[#e0e0e5] dark:hover:bg-white/20"
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
                                                        className="font-milk text-foreground hover:bg-muted/40 flex items-center gap-3 rounded-lg px-3 py-2 text-base transition dark:text-[#e0e0e5] dark:hover:bg-white/10"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        Log in
                                                    </a>
                                                    <a
                                                        href={route('register')}
                                                        className="font-milk text-foreground hover:bg-muted/40 flex items-center gap-3 rounded-lg px-3 py-2 text-base transition dark:text-[#e0e0e5] dark:hover:bg-white/10"
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
                    <main className="flex w-full max-w-[1000px] flex-col gap-4 lg:max-w-[2000px] lg:flex-col">{children}</main>
                </div>
                <div className="hidden h-4 lg:block"></div>
            </div>
        </>
    );
}
