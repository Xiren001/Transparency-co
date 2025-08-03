import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, BookOpen, Folder, Home, LayoutGrid, Mail, Package, Users } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    // Check if user has admin role (admin, moderator, or content_manager)
    const hasAdminRole =
        user &&
        (user.roles?.some((role: any) => ['admin', 'moderator', 'content_manager'].includes(role.name)) ||
            user.roles?.some((role: any) => ['admin', 'moderator', 'content_manager'].includes(role)));

    // Check if user is admin (for user management access)
    const isAdmin = user && (user.roles?.some((role: any) => role.name === 'admin') || user.roles?.some((role: any) => role === 'admin'));

    // Check if user is admin or moderator (for newsletter access)
    const isAdminOrModerator =
        user &&
        (user.roles?.some((role: any) => ['admin', 'moderator'].includes(role.name)) ||
            user.roles?.some((role: any) => ['admin', 'moderator'].includes(role)));

    const mainNavItems: NavItem[] = [
        {
            title: 'Home',
            href: '/',
            icon: Home,
        },
    ];

    // Add admin menu items for users with admin roles
    if (hasAdminRole) {
        mainNavItems.push(
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Products',
                href: '/products',
                icon: Package,
            },
            {
                title: 'Companies',
                href: '/companies',
                icon: Folder,
            },
        );

        // Only show Users management for admin role
        if (isAdmin) {
            mainNavItems.push({
                title: 'Users',
                href: '/admin/users',
                icon: Users,
            });
        }

        // Only show Newsletter for admin and moderator roles
        if (isAdminOrModerator) {
            mainNavItems.push({
                title: 'Newsletter',
                href: '/admin/newsletter',
                icon: Mail,
            });
        }

        // Add Harmful Content management for admin roles
        mainNavItems.push({
            title: 'Harmful Content',
            href: '/admin/harmfulcontent',
            icon: AlertTriangle,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={hasAdminRole ? '/dashboard' : '/'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
