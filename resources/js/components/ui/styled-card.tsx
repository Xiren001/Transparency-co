import * as React from "react";
import { cn } from "@/lib/utils";

interface StyledCardProps {
  className?: string;
  background?: 'peach' | 'lavender' | 'green' | 'pink' | 'custom';
  customBackground?: string;
  backgroundImage?: string;
  label?: string;
  title: string;
  body: string;
  linkText?: string;
  onLinkClick?: () => void;
  children?: React.ReactNode;
}

const backgroundStyles = {
  peach: "bg-gradient-to-r from-orange-100 to-orange-200",
  lavender: "bg-gradient-to-r from-purple-100 to-purple-200", 
  green: "bg-gradient-to-r from-green-100 to-green-200",
  pink: "bg-gradient-to-r from-pink-100 to-pink-200",
  custom: ""
};

const labelColors = {
  peach: "bg-orange-200 text-black",
  lavender: "bg-purple-200 text-black", 
  green: "bg-green-200 text-black",
  pink: "bg-pink-200 text-black",
  custom: "bg-gray-200 text-black"
};

// SVG Shapes for each background
const ShapeComponent = ({ background }: { background: string }) => {
  const shapes = {
    peach: (
      <svg
        className="absolute right-0 top-0 w-32 h-40 opacity-30 transform translate-x-8 -translate-y-4"
        viewBox="0 0 128 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M64 20 C80 20, 100 40, 100 80 C100 120, 80 140, 64 140 C48 140, 28 120, 28 80 C28 40, 48 20, 64 20 Z"
          fill="#fb923c"
        />
        <path
          d="M64 30 C76 30, 90 45, 90 80 C90 115, 76 130, 64 130 C52 130, 38 115, 38 80 C38 45, 52 30, 64 30 Z"
          fill="#fdba74"
        />
      </svg>
    ),
    lavender: (
      <svg
        className="absolute right-0 top-0 w-32 h-32 opacity-30 transform translate-x-8 -translate-y-4"
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="64" cy="64" r="60" fill="#c084fc" />
        <circle cx="64" cy="64" r="45" fill="#d8b4fe" />
      </svg>
    ),
    green: (
      <svg
        className="absolute right-0 top-0 w-24 h-32 opacity-30 transform translate-x-8 -translate-y-4"
        viewBox="0 0 96 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M48 20 L72 60 L60 80 L48 60 L36 80 L24 60 L48 20 Z"
          fill="#22c55e"
        />
        <path
          d="M48 40 L60 60 L48 80 L36 60 L48 40 Z"
          fill="#4ade80"
        />
      </svg>
    ),
    pink: (
      <svg
        className="absolute right-0 top-0 w-24 h-24 opacity-30 transform translate-x-8 -translate-y-4"
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M48 20 L76 48 L48 76 L20 48 L48 20 Z"
          fill="#ec4899"
        />
        <path
          d="M48 32 L64 48 L48 64 L32 48 L48 32 Z"
          fill="#f472b6"
        />
      </svg>
    ),
    custom: null
  };

  return shapes[background as keyof typeof shapes] || null;
};

export function StyledCard({
  className,
  background = 'peach',
  customBackground,
  backgroundImage,
  label,
  title,
  body,
  linkText = "Learn more →",
  onLinkClick,
  children
}: StyledCardProps) {
  const bgStyle = background === 'custom' && customBackground 
    ? customBackground 
    : backgroundStyles[background];
  
  const labelColor = labelColors[background];

  return (
    <div
      className={cn(
        "relative rounded-2xl p-6 shadow-sm transition-shadow hover:shadow-lg overflow-hidden",
        bgStyle,
        className
      )}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {/* Background Shape */}
      <ShapeComponent background={background} />
      
      {label && (
        <div className={cn(
          "inline-block px-3 py-1 rounded-md text-xs font-medium mb-3 relative z-10",
          labelColor
        )}>
          {label}
        </div>
      )}
      
      <h3 className="font-bold text-lg text-black mb-3 relative z-10">
        {title}
      </h3>
      
      <p className="text-black text-sm leading-relaxed mb-4 relative z-10">
        {body}
      </p>
      
      {onLinkClick && (
        <button
          onClick={onLinkClick}
          className="text-black underline text-sm hover:no-underline transition-all relative z-10"
        >
          {linkText}
        </button>
      )}
      
      {children}
    </div>
  );
}

export default StyledCard; 