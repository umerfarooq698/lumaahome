import React from 'react';

function ArchitecturalHouseIcon({ className = "w-full h-full" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-sm`}
    >
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
  );
}

export default function Logo({ size = "default", className = "", align = "center" }) {
  if (size === "small" || size === "footer") {
    return (
      <div className={`inline-flex items-center gap-3 ${align === "center" ? "justify-center" : "justify-start"} ${className}`}>
        {/* LH Architectural House Icon */}
        <div className="shrink-0 w-10 h-10 transition-transform duration-300 group-hover:scale-105">
          <ArchitecturalHouseIcon />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-serif text-lg sm:text-xl font-black tracking-[0.14em] uppercase text-black leading-none flex items-center">
            LUMAA HOME<span className="text-[10px] text-[#C8102E] font-normal align-top ml-0.5 -mt-1.5">™</span>
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1 h-1 bg-[#C8102E] rotate-45 shrink-0" />
            <span className="text-[8px] font-bold tracking-[0.18em] text-gray-900 uppercase whitespace-nowrap">
              Luxury British Interiors & DIY
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-3.5 sm:gap-5 md:gap-6 ${className}`}>
      {/* LH Architectural House Icon on the Left */}
      <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 transition-transform duration-500 group-hover:scale-105">
        <ArchitecturalHouseIcon />
      </div>

      {/* Main Luxury Brand Typography on the Right */}
      <div className="flex flex-col items-center justify-center text-center">
        {/* Brand Name */}
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.12em] sm:tracking-[0.16em] text-black uppercase transition-all duration-300 group-hover:tracking-[0.18em] leading-none text-center flex items-center justify-center">
          <span>LUMAA HOME</span>
          <span className="text-xs sm:text-base align-top text-[#C8102E] font-normal ml-0.5 sm:ml-1 -mt-2 sm:-mt-3">™</span>
        </h1>

        {/* Bespoke Editorial Tagline Perfectly Centered */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-1 sm:mt-1.5 w-full text-center">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#C8102E] rotate-45 shrink-0" />
          <span className="text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.22em] sm:tracking-[0.28em] text-gray-900 uppercase whitespace-nowrap text-center pl-[0.22em] sm:pl-[0.28em]">
            Luxury British Interiors and DIY
          </span>
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#C8102E] rotate-45 shrink-0" />
        </div>
      </div>
    </div>
  );
}
