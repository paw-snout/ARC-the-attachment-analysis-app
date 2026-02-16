"use client";

import React, { useEffect, useState } from "react";

interface CircularProgressProps {
    percentage: number;
    color: string;
    delay?: number;
}

export default function CircularProgress({ percentage, color, delay = 0 }: CircularProgressProps) {
    const [offset, setOffset] = useState(351.858); // Initial full offset (0% progress)
    const radius = 56;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const timer = setTimeout(() => {
            const newOffset = circumference - (percentage / 100) * circumference;
            setOffset(newOffset);
        }, delay);

        return () => clearTimeout(timer);
    }, [percentage, circumference, delay]);

    return (
        <svg className="w-full h-full" viewBox="0 0 128 128">
            {/* Track Ring */}
            <circle
                cx="64"
                cy="64"
                r={radius}
                fill="transparent"
                stroke="#E8DCC4"
                strokeWidth="8"
            />
            {/* Progress Ring */}
            <circle
                cx="64"
                cy="64"
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 64 64)"
                className="transition-all duration-1000 ease-out"
            />
        </svg>
    );
}
