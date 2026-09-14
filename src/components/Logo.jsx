import React from 'react';

export default function Logo({ size = "default", className = "" }) {
  if (size === "small") {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {/* Sculptural LH Minimalist Mark */}
        <div className="w-7 h-7 shrink-0 text-black">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Minimalist Architectural L-H Monogram */}
            <path d="M14 12V52H32" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
            <path d="M32 12V52" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
            <path d="M50 12V52" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
            <path d="M32 32H50" stroke="currentColor" strokeWidth="4" />
            <circle cx="23" cy="18" r="3" fill="#C8102E" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-lg font-black tracking-[0.15em] uppercase text-black leading-none">
            LUMAA HOME<span className="text-[10px] text-[#C8102E] font-normal align-top ml-0.5">™</span>
          </span>
          <span className="text-[8px] font-bold tracking-[0.2em] text-gray-400 uppercase mt-0.5">
            UK MAGAZINE
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Unique Bespoke Luxury Brand Mark (Sculptural Architectural LH Ribbon & Arch) */}
      <div className="relative mb-3 inline-block group cursor-pointer">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto transition-transform duration-500 group-hover:scale-105">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            {/* The Master Crest: An Interlocking Geometric Home & 'LH' Monogram Sculpture */}
            
            {/* Stylized Modernist Pitched Roofline (Golden Ratio Apex) */}
            <path
              d="M18 42L50 14L82 42"
              stroke="#111111"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Radiant Ruby Keystone Diamond at Apex */}
            <polygon points="50,6 54.5,12 50,18 45.5,12" fill="#C8102E" />
            <circle cx="50" cy="12" r="1.5" fill="#FFFFFF" />

            {/* Left Wing ('L' & Column of the House) */}
            <path
              d="M28 34V76H46"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Right Wing ('H' with Architectural Crossbeam) */}
            <path
              d="M54 34V76"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M72 34V76"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Connecting Crossbeam creating the 'H' and Interior Horizon */}
            <line
              x1="54"
              y1="54"
              x2="72"
              y2="54"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Central Luminous Sun / Warm Pendant Light (The 'Lumaa' Essence) */}
            <circle cx="50" cy="42" r="5" fill="#C8102E" />
            <circle cx="50" cy="42" r="9" stroke="#C8102E" strokeWidth="1" strokeDasharray="2 2" />

            {/* Foundation Plinth Line */}
            <line
              x1="20"
              y1="84"
              x2="80"
              y2="84"
              stroke="#111111"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="32"
              y1="89"
              x2="68"
              y2="89"
              stroke="#A1A1AA"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Main Luxury Brand Typography */}
      <div className="space-y-2 max-w-2xl mx-auto">
        {/* Brand Name */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.14em] sm:tracking-[0.18em] text-black uppercase transition-all duration-300 hover:tracking-[0.2em] leading-none pl-1">
          LUMAA HOME<span className="text-xs sm:text-base align-top text-[#C8102E] font-normal ml-1">™</span>
        </h1>

        {/* Bespoke Editorial Line with Red Diamond */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto pt-1">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-300 to-black"></div>
          <span className="w-1.5 h-1.5 bg-[#C8102E] rotate-45 shrink-0"></span>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.32em] text-gray-900 uppercase whitespace-nowrap">
            Luxury British Interiors and DIY
          </span>
          <span className="w-1.5 h-1.5 bg-[#C8102E] rotate-45 shrink-0"></span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gray-300 to-black"></div>
        </div>
      </div>
    </div>
  );
}
