export default function HeroSection() {
    return (
        <section className="-z-10 min-h-[100px] w-full rounded-lg border-b sm:min-h-[100px] md:min-h-[150px] lg:min-h-[150px] xl:min-h-[200px] 2xl:min-h-[200px] dark:bg-transparent">
            <style>{`
                @keyframes slowShake {
                    0%, 100% { transform: translateX(0) rotate(var(--rotation)); }
                    25% { transform: translateX(-2px) rotate(calc(var(--rotation) - 1deg)); }
                    50% { transform: translateX(2px) rotate(calc(var(--rotation) + 1deg)); }
                    75% { transform: translateX(-1px) rotate(calc(var(--rotation) - 0.5deg)); }
                }
                @keyframes gentleRock {
                    0%, 100% { transform: translateY(0) rotate(var(--rotation)); }
                    25% { transform: translateY(-1px) rotate(calc(var(--rotation) + 0.5deg)); }
                    50% { transform: translateY(1px) rotate(calc(var(--rotation) - 0.5deg)); }
                    75% { transform: translateY(-0.5px) rotate(calc(var(--rotation) + 0.25deg)); }
                }
                @keyframes subtleWobble {
                    0%, 100% { transform: translateX(0) translateY(0) rotate(var(--rotation)); }
                    25% { transform: translateX(1px) translateY(-1px) rotate(calc(var(--rotation) - 0.3deg)); }
                    50% { transform: translateX(-1px) translateY(1px) rotate(calc(var(--rotation) + 0.3deg)); }
                    75% { transform: translateX(0.5px) translateY(-0.5px) rotate(calc(var(--rotation) - 0.1deg)); }
                }
                .shake-slow {
                    animation: slowShake 3s ease-in-out infinite;
                }
                .shake-gentle {
                    animation: gentleRock 4s ease-in-out infinite;
                }
                .shake-subtle {
                    animation: subtleWobble 5s ease-in-out infinite;
                }
                @keyframes fadeInUp {
                    0% { 
                        opacity: 0; 
                        transform: translateY(30px) scale(0.9);
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes floatGently {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .span-animate-1 {
                    animation: fadeInUp 1s ease-out forwards, floatGently 3s ease-in-out 1s infinite;
                }
                .span-animate-2 {
                    animation: fadeInUp 1s ease-out 0.3s forwards, floatGently 3s ease-in-out 1.3s infinite;
                }
            `}</style>
            {/* Responsive Background Images */}

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-8 text-center sm:py-8 md:py-10 lg:py-12 xl:py-20 2xl:py-20 dark:bg-transparent">
                {/* Main Heading */}
                <h1 className="font-milk text-primary mb-4 text-4xl font-light tracking-[-0.10em] break-words sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl dark:text-white">
                    <span className="span-animate-1 relative z-0">Transparency</span> <span className="span-animate-2 relative z-30">Co.</span>
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                        {/* Extra extra small screens (xxs) */}
                        <img
                            src="/images/website-image/Chair Design - 773x1024.png"
                            alt="Chair Design - Modern Armchair"
                            className="xs:hidden show-below-sm shake-gentle z-10 h-auto max-h-[150px] w-auto max-w-[100px] translate-x-45 -rotate-12 object-contain"
                            style={{ '--rotation': '-12deg' } as React.CSSProperties}
                        />

                        {/* Extra small screens (xs) */}
                        <img
                            src="/images/website-image/Chair Design - 773x1024.png"
                            alt="Chair Design - Modern Armchair"
                            className="xs:block shake-gentle z-10 hidden h-auto max-h-[120px] w-auto max-w-[80px] translate-x-35 -rotate-12 object-contain sm:hidden"
                            style={{ '--rotation': '-12deg' } as React.CSSProperties}
                        />

                        {/* Small screens (sm and up) */}
                        <img
                            src="/images/website-image/Chair Design - 773x1024.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-gentle z-10 hidden h-auto max-h-[150px] w-auto max-w-[100px] translate-x-47 -rotate-12 object-contain sm:block md:hidden"
                            style={{ '--rotation': '-12deg' } as React.CSSProperties}
                        />

                        {/* Medium screens */}
                        <img
                            src="/images/website-image/Chair Design - 773x1024.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-gentle z-10 hidden h-auto max-h-[180px] w-auto max-w-[130px] translate-x-60 -rotate-12 object-contain md:block lg:hidden"
                            style={{ '--rotation': '-12deg' } as React.CSSProperties}
                        />

                        {/* large screens */}
                        <img
                            src="/images/website-image/Chair Design - 773x1024.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-gentle z-10 hidden h-auto max-h-[200px] w-auto max-w-[150px] translate-x-70 -rotate-12 object-contain lg:block xl:hidden"
                            style={{ '--rotation': '-12deg' } as React.CSSProperties}
                        />

                        {/* xl screens */}
                        <img
                            src="/images/website-image/Chair Design - 773x1024.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-gentle z-10 hidden h-auto max-h-[300px] w-auto max-w-[250px] translate-x-100 -rotate-12 object-contain xl:block 2xl:hidden"
                            style={{ '--rotation': '-12deg' } as React.CSSProperties}
                        />

                        {/* 2xl screens */}
                        <img
                            src="/images/website-image/Chair Design - 773x1024.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-gentle z-10 hidden h-auto max-h-[300px] w-auto max-w-[250px] translate-x-120 -rotate-12 object-contain 2xl:block"
                            style={{ '--rotation': '-12deg' } as React.CSSProperties}
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                        {/* Extra extra small screens (xxs) */}
                        <img
                            src="/images/website-image/shoes.png"
                            alt="Chair Design - Modern Armchair"
                            className="xs:hidden show-below-sm shake-slow z-10 h-auto max-h-[150px] w-auto max-w-[100px] -translate-x-40 translate-y-10 rotate-20 object-contain"
                            style={{ '--rotation': '20deg' } as React.CSSProperties}
                        />

                        {/* Extra small screens (xs) */}
                        <img
                            src="/images/website-image/shoes.png"
                            alt="Chair Design - Modern Armchair"
                            className="xs:block shake-slow z-10 hidden h-auto max-h-[120px] w-auto max-w-[80px] -translate-x-40 translate-y-10 rotate-20 object-contain sm:hidden"
                            style={{ '--rotation': '20deg' } as React.CSSProperties}
                        />

                        {/* Small screens (sm and up) */}
                        <img
                            src="/images/website-image/shoes.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-slow z-10 hidden h-auto max-h-[150px] w-auto max-w-[100px] -translate-x-60 translate-y-10 rotate-20 object-contain sm:block md:hidden"
                            style={{ '--rotation': '20deg' } as React.CSSProperties}
                        />

                        {/* Medium screens */}
                        <img
                            src="/images/website-image/shoes.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-slow z-10 hidden h-auto max-h-[180px] w-auto max-w-[130px] -translate-x-80 translate-y-15 rotate-20 object-contain md:block lg:hidden"
                            style={{ '--rotation': '20deg' } as React.CSSProperties}
                        />

                        {/* large screens */}
                        <img
                            src="/images/website-image/shoes.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-slow z-10 hidden h-auto max-h-[200px] w-auto max-w-[150px] -translate-x-100 translate-y-20 rotate-20 object-contain lg:block xl:hidden"
                            style={{ '--rotation': '20deg' } as React.CSSProperties}
                        />

                        {/* xl screens */}
                        <img
                            src="/images/website-image/shoes.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-slow z-10 hidden h-auto max-h-[300px] w-auto max-w-[250px] -translate-x-125 translate-y-25 rotate-20 object-contain xl:block 2xl:hidden"
                            style={{ '--rotation': '20deg' } as React.CSSProperties}
                        />

                        {/* 2xl screens */}
                        <img
                            src="/images/website-image/shoes.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-slow z-10 hidden h-auto max-h-[300px] w-auto max-w-[250px] -translate-x-150 translate-y-30 rotate-20 object-contain 2xl:block"
                            style={{ '--rotation': '20deg' } as React.CSSProperties}
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                        {/* Extra extra small screens (xxs) */}
                        <img
                            src="/images/website-image/towel.png"
                            alt="Chair Design - Modern Armchair"
                            className="xs:hidden show-below-sm shake-subtle -z-10 h-auto max-h-[140px] w-auto max-w-[90px] -translate-x-10 -translate-y-18 -rotate-20 object-contain"
                            style={{ '--rotation': '-20deg' } as React.CSSProperties}
                        />

                        {/* Extra small screens (xs) */}
                        <img
                            src="/images/website-image/towel.png"
                            alt="Chair Design - Modern Armchair"
                            className="xs:block shake-subtle -z-10 hidden h-auto max-h-[100px] w-auto max-w-[50px] -translate-x-23 -translate-y-8 -rotate-20 object-contain sm:hidden"
                            style={{ '--rotation': '-20deg' } as React.CSSProperties}
                        />

                        {/* Small screens (sm and up) */}
                        <img
                            src="/images/website-image/towel.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-subtle -z-10 hidden h-auto max-h-[120px] w-auto max-w-[70px] -translate-x-33 -translate-y-13 -rotate-20 object-contain sm:block md:hidden"
                            style={{ '--rotation': '-20deg' } as React.CSSProperties}
                        />

                        {/* Medium screens */}
                        <img
                            src="/images/website-image/towel.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-subtle -z-10 hidden h-auto max-h-[130px] w-auto max-w-[90px] -translate-x-43 -translate-y-15 -rotate-20 object-contain md:block lg:hidden"
                            style={{ '--rotation': '-20deg' } as React.CSSProperties}
                        />

                        {/* large screens */}
                        <img
                            src="/images/website-image/towel.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-subtle -z-10 hidden h-auto max-h-[150px] w-auto max-w-[100px] -translate-x-48 -translate-y-18 -rotate-20 object-contain lg:block xl:hidden"
                            style={{ '--rotation': '-20deg' } as React.CSSProperties}
                        />

                        {/* xl screens */}
                        <img
                            src="/images/website-image/towel.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-subtle -z-10 hidden h-auto max-h-[230px] w-auto max-w-[180px] -translate-x-65 -translate-y-25 -rotate-20 object-contain xl:block 2xl:hidden"
                            style={{ '--rotation': '-20deg' } as React.CSSProperties}
                        />

                        {/* 2xl screens */}
                        <img
                            src="/images/website-image/towel.png"
                            alt="Chair Design - Modern Armchair"
                            className="shake-subtle -z-10 hidden h-auto max-h-[250px] w-auto max-w-[200px] -translate-x-65 -translate-y-25 -rotate-20 object-contain 2xl:block"
                            style={{ '--rotation': '-20deg' } as React.CSSProperties}
                        />
                    </div>
                </h1>

                {/* Subtitle */}
                <p className="lg:text-md text-[8px] leading-tight break-words text-gray-600 sm:text-[10px] md:text-sm xl:text-lg 2xl:text-lg dark:text-gray-300">
                    The Healthy Version of Amazon US <br /> Demanding Transparency from Companies
                </p>
            </div>
        </section>
    );
}
