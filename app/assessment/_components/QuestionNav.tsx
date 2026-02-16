"use client";

interface QuestionNavProps {
    onPrevious: () => void;
    isFirst: boolean;
    isLast: boolean;
}

export default function QuestionNav({
    onPrevious,
    isFirst,
    isLast,
}: QuestionNavProps) {
    return (
        <footer className="px-6 py-4 md:px-12 md:py-8 flex items-center justify-between w-full border-t border-beige">
            <button
                onClick={onPrevious}
                disabled={isFirst}
                className={`text-sm md:text-base font-medium flex items-center gap-2 group transition-colors ${isFirst
                    ? "text-beige cursor-not-allowed"
                    : "text-text-muted hover:text-text"
                    }`}
            >
                <span className="material-icons text-base group-hover:-translate-x-1 transition-transform">
                    arrow_back
                </span>
                Previous
            </button>

            <div className="h-1.5 w-1.5 rounded-full bg-beige" />

            <div className="w-[100px]" /> {/* Spacer to maintain layout balance */}
        </footer>
    );
}
