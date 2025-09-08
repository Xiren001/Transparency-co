import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#ecf0f3] p-6 md:p-10 dark:bg-[#181a1b]">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-9 w-9 items-center justify-center">
                        <AppLogoIcon className="size-9 fill-current text-gray-900 dark:text-gray-100" />
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <div className="overflow-hidden rounded-[12px] border-0 bg-[#ecf0f3] shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                        <div className="px-10 pt-8 pb-0 text-center">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
                        </div>
                        <div className="px-10 py-8">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
