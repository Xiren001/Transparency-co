import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';
import { HTMLAttributes, useEffect, useState } from 'react';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const [isAnimating, setIsAnimating] = useState(false);

    // Handle system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (appearance === 'system') {
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 400);
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [appearance]);

    const handleToggle = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        const newAppearance = appearance === 'dark' ? 'light' : 'dark';
        updateAppearance(newAppearance);

        setTimeout(() => setIsAnimating(false), 400);
    };

    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className={className} {...props}>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                disabled={isAnimating}
                className="appearance-toggle relative h-9 w-9 overflow-hidden rounded-md transition-all duration-400 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 dark:focus:ring-blue-400"
                aria-label="Toggle theme"
            >
                {/* Background toggle with sliding animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className={`absolute inset-0 transition-all duration-400 ease-out ${
                            isDark
                                ? 'translate-x-0 bg-gradient-to-br from-gray-800 to-gray-900'
                                : '-translate-x-full bg-gradient-to-br from-yellow-400 to-orange-400'
                        }`}
                    />

                    {/* Icons with enhanced fade and rotation transitions */}
                    <div className="relative z-10 flex h-full w-full items-center justify-center">
                        <Sun
                            className={`h-5 w-5 transition-all duration-400 ease-out ${
                                isDark ? 'scale-75 rotate-90 text-gray-300 opacity-0' : 'scale-100 rotate-0 text-gray-800 opacity-100'
                            }`}
                        />
                        <Moon
                            className={`absolute h-5 w-5 transition-all duration-400 ease-out ${
                                isDark ? 'scale-100 rotate-0 text-white opacity-100' : 'scale-75 -rotate-90 text-gray-800 opacity-0'
                            }`}
                        />
                    </div>
                </div>

                {/* Ripple effect on click */}
                {isAnimating && <div className="absolute inset-0 animate-ping rounded-md bg-white/20" />}
            </Button>
        </div>
    );
}
