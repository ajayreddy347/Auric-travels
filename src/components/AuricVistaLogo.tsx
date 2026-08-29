import React from 'react';

interface AuricVistaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  goldAccent?: boolean;
  subtitle?: string;
}

export const AuricVistaLogo: React.FC<AuricVistaLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-neutral-900 dark:text-white',
  goldAccent = true,
  subtitle,
}) => {
  // Dimension mappings
  const markSize = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-4xl sm:text-5xl',
  }[size];

  const subSize = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Precision AV Monogram Vector Icon */}
      <div className={`relative shrink-0 ${markSize} flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Gold foil gradient */}
            <linearGradient id="auricGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F3E5AB" />
              <stop offset="45%" stopColor="#C5A059" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#997A35" />
            </linearGradient>
            <linearGradient id="auricGoldLight" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E6C687" />
              <stop offset="100%" stopColor="#FFF2D4" />
            </linearGradient>
          </defs>

          {/* Background subtle soft badge */}
          <rect width="100" height="100" rx="20" className="fill-neutral-900 dark:fill-[#0A0A0A]" stroke="rgba(197,160,89,0.3)" strokeWidth="1.5" />

          {/* MONOGRAM ARTWORK */}
          <g transform="translate(10, 8) scale(0.8)">
            {/* Letter 'A' with swan/calligraphic loop on bottom-left */}
            <path
              d="M 28 62 C 22 62, 14 68, 14 77 C 14 86, 23 92, 33 92 C 43 92, 49 84, 49 75 C 49 64, 41 46, 36 28 L 33 16 L 31 16 C 30 16, 27 24, 25 30 L 22 38 C 21 40, 20 42, 19 44 C 18 47, 21 48, 23 48 C 25 48, 28 47, 29 46 Z"
              fill={goldAccent ? "url(#auricGoldGrad)" : "currentColor"}
              opacity="0.95"
            />

            {/* Loop interior cutout line for the elegant calligraphic teardrop */}
            <path
              d="M 28 66 C 36 66, 44 74, 44 80 C 44 86, 38 89, 32 89 C 23 89, 18 84, 18 78 C 18 71, 23 66, 28 66 Z"
              fill="#0A0A0A"
            />

            {/* Letter A Apex & Top Stem */}
            <path
              d="M 33 15 L 38 15 C 38.5 15, 39 15.5, 39 16 L 43 32 C 43.5 34, 44.5 35, 46 35 C 47.5 35, 48 34, 48 32 L 44 16 C 44 15.5, 44.5 15, 45 15 L 53 15 C 54 15, 54.5 15.5, 54.5 16.5 C 54.5 17.5, 53.5 18, 52 18 L 47 18 L 39 52 L 35 36 L 33 24 C 32.5 21, 31 18, 29 18 L 27 18 C 26 18, 25.5 17.5, 25.5 16.5 C 25.5 15.5, 26 15, 27 15 L 33 15 Z"
              fill={goldAccent ? "url(#auricGoldGrad)" : "currentColor"}
            />

            {/* Letter 'V' Serif Top-Left */}
            <path
              d="M 45 15 L 55 15 C 56 15, 56.5 15.8, 56.5 16.5 C 56.5 17.5, 55.5 18, 54 18 L 51 18 L 65 74 L 80 18 L 77 18 C 75.5 18, 74.5 17.5, 74.5 16.5 C 74.5 15.8, 75 15, 76 15 L 87 15 C 88 15, 88.5 15.8, 88.5 16.5 C 88.5 17.5, 87.5 18, 86 18 L 83 18 L 66 84 C 65.5 86, 64.5 87, 63.5 87 C 62.5 87, 61.5 86, 61 84 L 46 22 L 43 18 C 41.5 18, 40.5 17.5, 40.5 16.5 C 40.5 15.8, 41 15, 42 15 L 45 15 Z"
              fill={goldAccent ? "url(#auricGoldGrad)" : "currentColor"}
            />

            {/* Thick down-stroke of V with Roman contrast */}
            <path
              d="M 52 18 L 64 78 L 67 78 L 57 18 Z"
              fill={goldAccent ? "url(#auricGoldLight)" : "currentColor"}
            />

            {/* Interlacing Crossbar / Shading Accent */}
            <path
              d="M 33 54 C 36 54, 43 53.5, 49 53 L 49.5 56 C 44 56.5, 36 57, 32.5 57 Z"
              fill={goldAccent ? "url(#auricGoldLight)" : "currentColor"}
            />
          </g>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-serif tracking-tight font-bold ${textSize} ${textColor} leading-none transition-colors`}>
              Auric<span className={goldAccent ? "text-[#C5A059] font-normal italic ml-1" : `${textColor} ml-1`}>Travels</span>
            </span>
          </div>
          <span className={`uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400 font-mono ${subSize} mt-0.5 transition-colors`}>
            {subtitle || 'Luxury Travel & Sanctuaries'}
          </span>
        </div>
      )}
    </div>
  );
};
