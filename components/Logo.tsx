import React from 'react';

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", iconOnly = false }) => {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    {/* Three overlapping minimal bubbles */}
                    {/* Bubble 1 (Back Left) */}
                    <circle cx="8" cy="12" r="5" fill="#6f9089" fillOpacity="0.4" />
                    {/* Bubble 2 (Back Right) */}
                    <circle cx="16" cy="12" r="5" fill="#6f9089" fillOpacity="0.6" />
                    {/* Bubble 3 (Front Top) */}
                    <circle cx="12" cy="8" r="5" fill="#6f9089" />
                </svg>
            </div>
            {!iconOnly && (
                <span className="text-sm font-medium tracking-[0.2em] uppercase text-stone-600">
                    Arc
                </span>
            )}
        </div>
    );
};

export default Logo;
