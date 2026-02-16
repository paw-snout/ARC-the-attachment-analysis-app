"use client";

interface LikertScaleProps {
    value: number | undefined;
    onChange: (val: number) => void;
}

export default function LikertScale({ value, onChange }: LikertScaleProps) {
    return (
        <div className="w-full space-y-3 md:space-y-4">
            <div className="flex justify-between w-full text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-text-muted font-semibold">
                <span className="text-left">Strongly Disagree</span>
                <span className="text-right">Strongly Agree</span>
            </div>
            <div className="flex items-center justify-between gap-2 md:gap-6 lg:gap-8">
                {[1, 2, 3, 4, 5].map((level) => {
                    const isSelected = value === level;
                    return (
                        <button
                            key={level}
                            onClick={() => onChange(level)}
                            className="group flex flex-col items-center flex-1 outline-none"
                        >
                            <div
                                className={`w-full h-14 md:h-20 lg:h-24 rounded-xl md:rounded-2xl transition-all flex items-center justify-center ${isSelected
                                    ? "bg-orange-light/10 border-2 border-orange-light shadow-lg shadow-orange-light/10"
                                    : "bg-cream border border-beige hover:border-orange-light/50 shadow-sm hover:shadow-md"
                                    }`}
                            >
                                <div
                                    className={`rounded-full transition-colors ${isSelected
                                        ? "w-3 h-3 md:w-4 md:h-4 bg-orange-light"
                                        : "w-2.5 h-2.5 md:w-3 md:h-3 bg-beige group-hover:bg-orange-light/50"
                                        }`}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
