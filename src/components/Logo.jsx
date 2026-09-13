import React from 'react';

export default function Logo({ size = "default", className = "" }) {
  if (size === "small") {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {/* Clean Free-Standing Minimalist Icon */}
        <div className="relative w-7 h-7 shrink-0">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-black"
          >
            {/* Architectural Gable Roof */}
            <path d="M4 22L20 6L36 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Interior Archway */}
            <path d="M14 36V22C14 18.686 16.686 16 20 16C23.314 16 26 18.686 26 22V36" stroke="currentColor" strokeWidth="1.75" />
            {/* Radiant Lamp Spark */}
            <polygon points="20,10 22,13 20,16 18,13" fill="#C8102E" />
          </svg>
        </div>
        
        <div className="flex flex-col">
          <span className="font-serif text-lg font-black tracking-[0.15em] uppercase text-black leading-none">
            LUMAA HOME<span className="text-[10px] text-[#C8102E] font-normal align-top ml-0.5">™</span>
          </span>
          <span className="text-[8px] font-bold tracking-[0.25em] text-gray-400 uppercase mt-0.5">
            UK MAGAZINE
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Free-Standing Grand Luxury Architectural Brand Mark (No Circle, Pure Elegance) */}
      <div className="relative mb-2.5 inline-block group cursor-pointer">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto transition-transform duration-500 group-hover:scale-105">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Top Crown Keystone Finial */}
            <polygon points="60,4 64,11 60,18 56,11" fill="#C8102E" />
            <circle cx="60" cy="11" r="1.5" fill="#FFFFFF" />

            {/* Primary Grand Gable Roofline */}
            <path
              d="M12 52L60 12L108 52"
              stroke="#111111"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Secondary Floating Eaves Line */}
            <path
              d="M24 54L60 24L96 54"
              stroke="#71717A"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="3 2"
            />

            {/* Architectural Classical Archway (Grand Living Entrance) */}
            <path
              d="M38 108V58C38 45.85 47.85 36 60 36C72.15 36 82 45.85 82 58V108"
              stroke="#111111"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M44 108V60C44 51.163 51.163 44 60 44C68.837 44 76 51.163 76 60V108"
              stroke="#A1A1AA"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Radiant Pendant Chandelier / Luminescence ("Lumaa" Glow) */}
            <line x1="60" y1="36" x2="60" y2="54" stroke="#111111" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="4.5" fill="#C8102E" />
            <circle cx="60" cy="60" r="8" stroke="#111111" strokeWidth="1" strokeDasharray="2 2" />
            
            {/* Light Rays */}
            <line x1="48" y1="60" x2="45" y2="60" stroke="#C8102E" strokeWidth="1.25" strokeLinecap="round" />
            <line x1="72" y1="60" x2="75" y2="60" stroke="#C8102E" strokeWidth="1.25" strokeLinecap="round" />
            <line x1="51" y1="51" x2="49" y2="49" stroke="#C8102E" strokeWidth="1.25" strokeLinecap="round" />
            <line x1="69" y1="51" x2="71" y2="49" stroke="#C8102E" strokeWidth="1.25" strokeLinecap="round" />

            {/* Twin Classical Fluted Column Accents */}
            <line x1="26" y1="58" x2="26" y2="108" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
            <line x1="94" y1="58" x2="94" y2="108" stroke="#111111" strokeWidth="2" strokeLinecap="round" />

            {/* Plinth Base / Foundation Steps */}
            <line x1="16" y1="108" x2="104" y2="108" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
            <line x1="10" y1="114" x2="110" y2="114" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Main Brand Title & Typography */}
      <div className="space-y-1.5 max-w-2xl mx-auto">
        {/* Brand Name with Refined Serif Tracking */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.06em] text-black uppercase transition-all duration-300 hover:tracking-[0.08em] leading-none">
          Lumaa Home<span className="text-sm sm:text-lg align-top text-[#C8102E] font-normal ml-1">™</span>
        </h1>

        {/* Elegant Clean Editorial Hairline Divider with Crimson Diamond */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto pt-1">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-400 to-black"></div>
          <span className="w-1.5 h-1.5 bg-[#C8102E] rotate-45 shrink-0"></span>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-gray-800 uppercase whitespace-nowrap">
            Luxury Interiors and DIY Magazine
          </span>
          <span className="w-1.5 h-1.5 bg-[#C8102E] rotate-45 shrink-0"></span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gray-400 to-black"></div>
        </div>

        {/* Clean UK Edition Tagline */}
        <span className="text-[9px] sm:text-[10px] tracking-[0.22em] text-gray-500 uppercase block font-medium">
          Period Living • Bespoke Architecture • UK Edition
        </span>
      </div>
    </div>
  );
}
