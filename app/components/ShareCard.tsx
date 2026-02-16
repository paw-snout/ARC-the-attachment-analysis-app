"use client";

import React from "react";

interface ShareCardProps {
    attachmentStyle: string;
    dominant_tendency?: string;
    percentage?: number;
    userName?: string;
}

export default function ShareCard({
    attachmentStyle,
    dominant_tendency,
    percentage,
    userName = "My",
}: ShareCardProps) {

    // Emoji mapping for attachment styles
    const getEmoji = (style: string) => {
        const lower = style.toLowerCase();
        if (lower.includes("secure")) return "🌟";
        if (lower.includes("anxious")) return "💭";
        if (lower.includes("avoidant")) return "🌊";
        if (lower.includes("fearful")) return "🎭";
        return "💫";
    };

    return (
        <div
            id="share-card"
            className="w-[600px] h-[630px] bg-gradient-to-br from-[#FFF9E8] via-[#FFF5DC] to-[#FFE8CC] p-12 relative overflow-hidden"
            style={{ fontFamily: "Inter, sans-serif" }}
        >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FFB84D]/20 to-[#FF9966]/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#FFB84D]/20 to-[#FF9966]/20 rounded-full blur-3xl translate-y-24 -translate-x-24" />

            <div className="relative z-10 h-full flex flex-col justify-between">

                {/* Header */}
                <div className="text-center">
                    <div className="inline-block px-6 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-[#E8DCC4] mb-6">
                        <p className="text-sm font-medium text-[#5C4E3A]">ATTACHMENT STYLE ASSESSMENT</p>
                    </div>
                </div>

                {/* Main content - IMPROVED SPACING */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-10">

                    {/* Icon - BIGGER */}
                    <div className="w-36 h-36 bg-gradient-to-br from-[#FFB84D] to-[#FF9966] rounded-full flex items-center justify-center shadow-2xl">
                        <span className="text-7xl">{getEmoji(attachmentStyle)}</span>
                    </div>

                    {/* Style name */}
                    <div className="text-center space-y-3">
                        <h1
                            className="text-5xl font-bold text-[#2C2416] leading-tight px-4"
                            style={{ fontFamily: "Playfair Display, serif", letterSpacing: "0.02em" }}
                        >
                            {attachmentStyle}
                        </h1>
                        <p className="text-xl text-[#5C4E3A] font-medium">
                            {userName} Attachment Style
                        </p>
                    </div>

                    {/* Percentage badge - BETTER SPACING */}
                    {percentage && (
                        <div className="px-10 py-5 bg-white rounded-2xl shadow-lg border-2 border-[#FFB84D] min-w-[180px]">
                            <p className="text-4xl font-bold text-[#FF9966] mb-2 leading-none">{percentage}%</p>
                            <p className="text-sm text-[#5C4E3A] font-medium leading-tight text-center">{dominant_tendency || "Tendency"}</p>
                        </div>
                    )}

                    {/* Quote */}
                    <div className="max-w-md text-center px-4">
                        <p className="text-lg text-[#5C4E3A] italic leading-relaxed">
                            "Understanding your attachment style is the first step to healthier relationships"
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center space-y-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#E8DCC4] to-transparent" />
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-[#FFB84D] rounded-full animate-pulse" />
                        <p className="text-sm font-semibold text-[#2C2416] tracking-wide">
                            DISCOVER YOUR ATTACHMENT STYLE
                        </p>
                        <div className="w-2 h-2 bg-[#FF9966] rounded-full animate-pulse" />
                    </div>
                    <p className="text-xs text-[#8B7D6B]">
                        attachment-app.vercel.app
                    </p>
                </div>
            </div>
        </div>
    );
}
