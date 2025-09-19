import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    error?: string;
}

export default function Login({ status, canResetPassword, error }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    // Show error toast if there's an error from Google auth
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={submit}>
                {/* Social Media Buttons */}
                <div className="flex justify-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7fa] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] sm:h-12 sm:w-12 dark:bg-[#1f2122] dark:shadow-[4px_4px_8px_#0e0f10,-4px_-4px_8px_#2a2d2e] dark:hover:shadow-[2px_2px_4px_#0e0f10,-2px_-2px_4px_#2a2d2e] dark:active:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#2a2d2e]"
                    >
                        <span className="text-base font-bold text-gray-700 sm:text-lg dark:text-gray-300">f</span>
                    </button>
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7fa] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] sm:h-12 sm:w-12 dark:bg-[#1f2122] dark:shadow-[4px_4px_8px_#0e0f10,-4px_-4px_8px_#2a2d2e] dark:hover:shadow-[2px_2px_4px_#0e0f10,-2px_-2px_4px_#2a2d2e] dark:active:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#2a2d2e]"
                    >
                        <span className="text-xs font-bold text-gray-700 sm:text-sm dark:text-gray-300">in</span>
                    </button>
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7fa] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] sm:h-12 sm:w-12 dark:bg-[#1f2122] dark:shadow-[4px_4px_8px_#0e0f10,-4px_-4px_8px_#2a2d2e] dark:hover:shadow-[2px_2px_4px_#0e0f10,-2px_-2px_4px_#2a2d2e] dark:active:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#2a2d2e]"
                    >
                        <svg className="h-4 w-4 text-gray-700 sm:h-5 sm:w-5 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#ecf0f3] px-2 text-gray-500 dark:bg-[#181a1b] dark:text-gray-400">or use your email account</span>
                    </div>
                </div>

                <div className="grid gap-4 sm:gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="font-medium text-gray-900 dark:text-gray-100">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="rounded-[8px] border-0 bg-[#f5f7fa] text-gray-900 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] placeholder:text-gray-500 focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#ffffff] dark:bg-[#1f2122] dark:text-gray-100 dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#2a2d2e] dark:placeholder:text-gray-400 dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#2a2d2e]"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="font-medium text-gray-900 dark:text-gray-100">
                                Password
                            </Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="rounded-[8px] border-0 bg-[#f5f7fa] text-gray-900 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] placeholder:text-gray-500 focus:shadow-[inset_4px_4px_4px_#d1d9e6,inset_-4px_-4px_4px_#ffffff] dark:bg-[#1f2122] dark:text-gray-100 dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#2a2d2e] dark:placeholder:text-gray-400 dark:focus:shadow-[inset_4px_4px_6px_#0e0f10,inset_-4px_-4px_6px_#2a2d2e]"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                                className="rounded-[4px] border-0 bg-[#f5f7fa] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] dark:bg-[#1f2122] dark:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#2a2d2e]"
                            />
                            <Label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">
                                Remember me
                            </Label>
                        </div>
                        {canResetPassword && (
                            <TextLink
                                href={route('password.request')}
                                className="text-sm text-blue-600 hover:text-blue-800 sm:ml-auto dark:text-blue-400 dark:hover:text-blue-300"
                                tabIndex={5}
                            >
                                Forgot password?
                            </TextLink>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 h-11 w-full rounded-[8px] border-0 bg-[#ecf0f3] text-gray-900 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] disabled:opacity-50 disabled:shadow-none sm:mt-4 sm:h-12 dark:bg-[#181a1b] dark:text-gray-100 dark:shadow-[4px_4px_8px_#0e0f10,-4px_-4px_8px_#222526] dark:hover:shadow-[2px_2px_4px_#0e0f10,-2px_-2px_4px_#222526] dark:active:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#2a2d2e]"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#ecf0f3] px-2 text-gray-500 dark:bg-[#181a1b] dark:text-gray-400">Or continue with</span>
                    </div>
                </div>

                <Button
                    type="button"
                    className="h-11 w-full rounded-[8px] border-0 bg-[#f5f7fa] text-gray-900 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] sm:h-12 dark:bg-[#1f2122] dark:text-gray-100 dark:shadow-[4px_4px_8px_#0e0f10,-4px_-4px_8px_#2a2d2e] dark:hover:shadow-[2px_2px_4px_#0e0f10,-2px_-2px_4px_#2a2d2e] dark:active:shadow-[inset_2px_2px_4px_#0e0f10,inset_-2px_-2px_4px_#2a2d2e]"
                    onClick={() => (window.location.href = route('auth.google'))}
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    <span className="text-sm sm:text-base">Continue with Google</span>
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                    Don't have an account?{' '}
                    <TextLink
                        href={route('register')}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        tabIndex={5}
                    >
                        Sign up
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
