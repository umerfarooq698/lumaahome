import React from 'react';

export default function Logo({ size = "default", className = "" }) {
  if (size === "small") {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {/* Luxury Monogram Arch Mark */}
        <svg
          className="w-7 h-7 text-black shrink-0"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Octagonal / Arch Border */}
          <rect x="3" y="3" width="54" height="54" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="7" y="7" width="46" height="46" rx="1" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
          {/* Neoclassical Arch */}
          <path d="M16 46V28C16 20.268 22.268 14 30 14C37.732 14 44 20.268 44 28V46" stroke="currentColor" strokeWidth="1.5" />
          {/* Center Monogram / Keystone Diamond */}
          <path d="M30 10L33 14L30 18L27 14L30 10Z" fill="#C8102E" />
          <path d="M25 40V27H29V32H35V27H39V40H35V35H29V40H25Z" fill="currentColor" />
        </svg>
        <span className="font-serif text-xl font-black tracking-wider uppercase text-black">
          LUMAA HOME<span className="text-xs text-[#C8102E] font-normal align-top">™</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Luxury Brand Crest / Emblem */}
      <div className="relative mb-2.5 inline-block group">
        <svg
          className="w-14 h-14 sm:w-16 sm:h-16 text-black transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Classical Frame */}
          <rect x="4" y="4" width="72" height="72" stroke="#111111" strokeWidth="1.5" />
          <rect x="8" y="8" width="64" height="64" stroke="#71717A" strokeWidth="0.75" />
          
          {/* Corner Ornaments */}
          <line x1="4" y1="14" x2="14" y2="4" stroke="#111111" strokeWidth="1" />
          <line x1="76" y1="14" x2="66" y2="4" stroke="#111111" strokeWidth="1" />
          <line x1="4" y1="66" x2="14" y2="76" stroke="#111111" strokeWidth="1" />
          <line x1="76" y1="66" x2="66" y2="76" stroke="#111111" strokeWidth="1" />

          {/* Architectural Archway */}
          <path
            d="M20 62V36C20 24.9543 28.9543 16 40 16C51.0457 16 60 24.9543 60 36V62"
            stroke="#111111"
            strokeWidth="1.75"
          />
          <path
            d="M25 62V37C25 28.7157 31.7157 22 40 22C48.2843 22 55 28.7157 55 37V62"
            stroke="#111111"
            strokeWidth="0.75"
          />

          {/* Pediment / Crown Keystone */}
          <polygon points="40,11 44,16 40,21 36,16" fill="#C8102E" />

          {/* LH Intertwined Architectural Monogram */}
          {/* 'L' */}
          <path
            d="M30 32V52H40V49H34V32H30Z"
            fill="#111111"
          />
          {/* 'H' */}
          <path
            d="M42 32V52H46V44H50V52H54V32H50V41H46V32H42Z"
            fill="#111111"
          />

          {/* Base Foundation Bar */}
          <line x1="16" y1="62" x2="64" y2="62" stroke="#111111" strokeWidth="2" />
        </svg>
      </div>

      {/* Main Brand Title */}
      <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-black uppercase transition leading-none">
        Lumaa Home<span className="text-xs sm:text-sm align-top text-[#C8102E] font-normal ml-0.5">™</span>
      </h1>

      {/* Subtitle / Tagline with British Luxury Aesthetics */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <span className="h-[1px] w-6 sm:w-10 bg-gray-400"></span>
        <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.25em] text-gray-600 uppercase">
          A Luxury Home Decor and DIY Magazine • UK Edition
        </span>
        <span className="h-[1px] w-6 sm:w-10 bg-gray-400"></span>
      </div>
    </div>
  );
}
