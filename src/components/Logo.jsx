import React from 'react';

export default function Logo({ size = "default", className = "" }) {
  if (size === "small") {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {/* Refined Luxury Monogram Crest */}
        <div className="relative w-8 h-8 shrink-0">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-black"
          >
            {/* Outer Diamond & Circle */}
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
            <polygon points="50,16 84,50 50,84 16,50" stroke="currentColor" strokeWidth="1.25" fill="none" />
            
            {/* Architectural House / Arch silhouette */}
            <path d="M36 64V46L50 34L64 46V64H36Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M44 64V52C44 48.686 46.686 46 50 46C53.314 46 56 48.686 56 52V64" stroke="#C8102E" strokeWidth="2" fill="none" />
            <polygon points="50,22 53,26 50,30 47,26" fill="#C8102E" />
          </svg>
        </div>
        
        <div className="flex flex-col">
          <span className="font-serif text-lg font-black tracking-[0.12em] uppercase text-black leading-none">
            LUMAA HOME<span className="text-[10px] text-[#C8102E] font-normal align-top ml-0.5">™</span>
          </span>
          <span className="text-[8px] font-bold tracking-[0.2em] text-gray-500 uppercase mt-1">
            EST. LONDON • UK
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Prominent Luxury Brand Emblem (Bigger & High-End) */}
      <div className="relative mb-3.5 inline-block group">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 transition-transform duration-300 group-hover:scale-105 mx-auto">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            {/* Background subtle luxury tint */}
            <circle cx="100" cy="100" r="95" fill="#FAFAF8" />
            
            {/* Concentric Luxury Rings */}
            <circle cx="100" cy="100" r="94" stroke="#111111" strokeWidth="3" />
            <circle cx="100" cy="100" r="88" stroke="#111111" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="82" stroke="#71717A" strokeWidth="0.75" />

            {/* Cardinal Star Accents */}
            <polygon points="100,12 103,20 100,28 97,20" fill="#C8102E" />
            <polygon points="100,172 103,180 100,188 97,180" fill="#C8102E" />
            <polygon points="12,100 20,103 28,100 20,97" fill="#C8102E" />
            <polygon points="172,100 180,103 188,100 180,97" fill="#C8102E" />

            {/* British Classical Facade & Arch */}
            {/* Classical Pediment (Triangle Roof) */}
            <polygon points="100,38 152,66 48,66" stroke="#111111" strokeWidth="2.5" fill="#FFFFFF" />
            <line x1="42" y1="67" x2="158" y2="67" stroke="#111111" strokeWidth="3" />
            <line x1="46" y1="71" x2="154" y2="71" stroke="#111111" strokeWidth="1.5" />

            {/* Pediment Inner Crown Motif */}
            <polygon points="100,47 104,54 100,61 96,54" fill="#C8102E" />

            {/* Classical Columns (Left, Center-Left, Center-Right, Right) */}
            {/* Outer Columns */}
            <rect x="52" y="73" width="7" height="66" stroke="#111111" strokeWidth="1.5" fill="#FAFAF8" />
            <rect x="141" y="73" width="7" height="66" stroke="#111111" strokeWidth="1.5" fill="#FAFAF8" />

            {/* Inner Grand Neoclassical Arch */}
            <path
              d="M72 139V98C72 82.536 84.536 70 100 70C115.464 70 128 82.536 128 98V139"
              stroke="#111111"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M78 139V99C78 86.85 87.85 77 100 77C112.15 77 122 86.85 122 99V139"
              stroke="#71717A"
              strokeWidth="1"
              strokeDasharray="2 2"
              fill="none"
            />

            {/* Center Keystone Ornament */}
            <polygon points="100,68 105,74 100,80 95,74" fill="#C8102E" />

            {/* Intertwined Serif Monogram 'L' and 'H' inside the Arch */}
            <text
              x="87"
              y="126"
              fontFamily="Playfair Display, Georgia, serif"
              fontSize="34"
              fontWeight="900"
              fill="#111111"
              textAnchor="middle"
            >
              L
            </text>
            <text
              x="113"
              y="126"
              fontFamily="Playfair Display, Georgia, serif"
              fontSize="34"
              fontWeight="900"
              fill="#111111"
              textAnchor="middle"
            >
              H
            </text>

            {/* Sub-arch baseline & Steps */}
            <line x1="38" y1="140" x2="162" y2="140" stroke="#111111" strokeWidth="3" />
            <line x1="34" y1="144" x2="166" y2="144" stroke="#111111" strokeWidth="2" />
            <line x1="30" y1="148" x2="170" y2="148" stroke="#111111" strokeWidth="2.5" />

            {/* Foundation Banner text */}
            <text
              x="100"
              y="164"
              fontFamily="Lato, sans-serif"
              fontSize="9"
              fontWeight="900"
              letterSpacing="3"
              fill="#111111"
              textAnchor="middle"
            >
              LONDON • EST. 2024
            </text>
          </svg>
        </div>
      </div>

      {/* Grand Editorial Masthead Typography */}
      <div className="space-y-1 sm:space-y-2">
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-black uppercase transition-all duration-300 hover:tracking-normal leading-none">
          Lumaa Home<span className="text-base sm:text-xl align-top text-[#C8102E] font-normal ml-1">™</span>
        </h1>

        {/* Flanking Heritage Rules with Diamond Accents */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto pt-1">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-400 to-black"></div>
          <span className="w-1.5 h-1.5 bg-[#C8102E] rotate-45 shrink-0"></span>
          <span className="text-[10px] sm:text-[12px] font-bold tracking-[0.28em] text-gray-700 uppercase whitespace-nowrap">
            British Luxury Interiors and DIY Journal
          </span>
          <span className="w-1.5 h-1.5 bg-[#C8102E] rotate-45 shrink-0"></span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gray-400 to-black"></div>
        </div>

        <span className="text-[9px] sm:text-[10px] tracking-[0.22em] text-gray-500 uppercase block font-medium">
          Period Restorations • Bespoke Craft • Architectural Living
        </span>
      </div>
    </div>
  );
}
