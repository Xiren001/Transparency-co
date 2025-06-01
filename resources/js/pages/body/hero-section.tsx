import { ChevronRight } from 'lucide-react';

export default function HeroSection() {
    return (
        <section
            className="relative min-h-[500px] w-full rounded-lg bg-cover bg-center bg-no-repeat"
            style={{ backgroundColor: '#FFDCDC', backgroundImage: "url('/images/hero-bg.png')" }}
        >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 rounded-lg bg-black/10 dark:bg-black/30"></div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-20 text-center">
                {/* Breadcrumb */}
                <nav className="text-muted-foreground mb-8 flex items-center justify-center text-sm">
                    <span className="hover:text-primary cursor-pointer transition-colors dark:text-[#b8b8c0]">HOME</span>
                    <ChevronRight className="mx-2 h-4 w-4" />
                    <span className="text-primary font-medium">FEATURED</span>
                </nav>

                {/* Main Heading */}
                <h1 className="mb-6 text-3xl font-light tracking-wide text-gray-900 md:text-5xl lg:text-6xl dark:text-[#e0e0e5]">Coming Soon</h1>

                {/* Subheading */}
                <p className="mx-auto max-w-2xl text-sm font-light tracking-wider text-gray-700 md:text-xl dark:text-[#b8b8c0]">
                    Let's Elevate the Standards You Always Expected.
                </p>
            </div>
        </section>
    );
}
