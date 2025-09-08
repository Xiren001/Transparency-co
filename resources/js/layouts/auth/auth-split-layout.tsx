import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
    const isLoginPage = currentUrl.includes('/login');
    const isRegisterPage = currentUrl.includes('/register');

    return (
        <div className="relative flex h-dvh items-center justify-center bg-[#ecf0f3] px-8 sm:px-0 dark:bg-[#181a1b]">
            <div className="flex w-full max-w-6xl items-center justify-center">
                {/* Right side - Form section */}
                <div className="flex w-full flex-1 flex-col items-center justify-center p-8 lg:max-w-md">
                    {/* Logo above the card */}
                    <Link href={route('home')} className="mb-8 flex items-center justify-center">
                        <AppLogoIcon className="h-12 w-12 fill-current text-gray-900 dark:text-gray-100" />
                    </Link>

                    {/* Form card */}
                    <div className="w-full space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
                        </div>

                        <div className="overflow-hidden rounded-[12px] border-0 bg-[#ecf0f3] p-8 shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
