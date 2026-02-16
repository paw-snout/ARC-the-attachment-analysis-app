"use client";

import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen bg-butter flex flex-col font-body selection:bg-orange-light/20 text-text overflow-hidden">
      {/* Header with Logo */}
      <header className="w-full px-8 py-6 flex justify-between items-center absolute top-0 left-0 z-50">
        <Logo className="opacity-80" />
        <div className="text-[10px] font-bold tracking-[0.2em] text-text-muted opacity-60 uppercase">v1.0</div>
      </header>

      {/* Hero Content - Perfectly Centered */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 relative z-10">
        {/* Giant Immersive Relationship Mesh Spiral - Covers Full Viewport */}
        <div className="fixed inset-0 -z-10 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="animate-spiral-rotate shrink-0">
            <svg
              viewBox="0 0 500 500"
              className="w-[130vmax] h-[130vmax] text-orange-light select-none opacity-40 shrink-0"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="spiral-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--light-orange)" />
                  <stop offset="100%" stopColor="var(--coral-orange)" />
                </linearGradient>
              </defs>

              {/* The Main Golden Path */}
              <path
                d="M 250 250 
                   A 50 50 0 0 1 300 250
                   A 100 100 0 0 1 250 150
                   A 150 150 0 0 1 100 250
                   A 200 200 0 0 1 250 450
                   A 250 250 0 0 1 500 250"
                fill="none"
                stroke="url(#spiral-gradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="opacity-50"
                style={{ filter: "drop-shadow(0 0 8px rgba(255, 184, 77, 0.3))" }}
              />

              {/* Mesh/Network - Connecting lines between pattern points */}
              <g className="opacity-30" stroke="var(--coral-orange)">
                <line x1="300" y1="250" x2="100" y2="250" strokeWidth="0.5" />
                <line x1="250" y1="150" x2="250" y2="450" strokeWidth="0.5" />
                <line x1="300" y1="250" x2="250" y2="150" strokeWidth="0.5" />
                <line x1="250" y1="150" x2="100" y2="250" strokeWidth="0.5" />
                <line x1="100" y1="250" x2="250" y2="450" strokeWidth="0.5" />
                <line x1="250" y1="450" x2="500" y2="250" strokeWidth="0.5" />
                <line x1="300" y1="250" x2="500" y2="250" strokeWidth="0.5" />
                {/* Secondary connections for mesh effect */}
                <line x1="275" y1="200" x2="175" y2="200" strokeWidth="0.3" strokeDasharray="2 2" />
                <line x1="175" y1="350" x2="375" y2="350" strokeWidth="0.3" strokeDasharray="2 2" />
              </g>

              {/* Relationship Nodes (Points on the pattern) */}
              <g filter="url(#glow)" fill="var(--light-orange)">
                <circle cx="250" cy="250" r="3" className="opacity-80" />
                <circle cx="300" cy="250" r="2.5" className="opacity-60" />
                <circle cx="250" cy="150" r="2.5" className="opacity-60" />
                <circle cx="100" cy="250" r="2.5" className="opacity-60" />
                <circle cx="250" cy="450" r="3" className="opacity-70" />
                <circle cx="500" cy="250" r="2.5" className="opacity-60" />

                {/* Mid-point nodes */}
                <circle cx="275" cy="200" r="1.5" className="opacity-50" />
                <circle cx="175" cy="200" r="1.5" className="opacity-50" />
                <circle cx="175" cy="350" r="1.5" className="opacity-50" />
                <circle cx="375" cy="350" r="1.5" className="opacity-50" />
              </g>
            </svg>
          </div>
        </div>

        {/* Text and CTA Group - Tightened Spacing */}
        <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-8 md:space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-family-heading font-medium tracking-tight text-text leading-[1.05]">
              The patterns that shape <br className="hidden md:block" /> your connections.
            </h1>
            <p className="text-base md:text-lg font-body text-text-secondary leading-relaxed max-w-xl mx-auto">
              A 25-question reflection that reveals your attachment style and relationship patterns.
              Everything runs privately in your browser.
            </p>
          </div>

          <button
            onClick={() => router.push("/assessment")}
            className="px-14 py-4.5 bg-orange-light text-text rounded-full text-base font-bold tracking-wide transition-all duration-500 hover:bg-orange-coral hover:px-18 active:scale-95 shadow-2xl shadow-orange-light/30 border border-border-medium/20"
          >
            Get Started
          </button>
        </div>
      </main>

      {/* Consolidated Fixed Footer Notice (Bottom-Right) */}
      <div className="fixed bottom-6 right-8 flex items-center gap-2 text-text-muted opacity-60 hover:opacity-100 transition-opacity cursor-default z-50">
        <span className="material-icons text-sm">lock</span>
        <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
          100% private, no signup & processed locally
        </span>
      </div>

      {/* Screen Texture Layer */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{ backgroundImage: "url('/texture.webp')" }}
      ></div>
    </div>
  );
}
