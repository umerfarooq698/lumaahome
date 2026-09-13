import React from 'react';

export default function Logo({ size = "default", className = "" }) {
  if (size === "small") {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <div className="relative w-8 h-8 shrink-0">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="goldGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DFC38E" />
                <stop offset="50%" stopColor="#C5A880" />
                <stop offset="100%" stopColor="#9E7D4E" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#111111" />
            <circle cx="50" cy="50" r="43" stroke="url(#goldGradSmall)" strokeWidth="1.5" />
            {/* Minimalist Roof & Arch */}
            <path d="M28 58L50 36L72 58" stroke="url(#goldGradSmall)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M40 58V47C40 41.477 44.477 37 50 37C55.523 37 60 41.477 60 47V58" stroke="white" strokeWidth="1.5" />
            <circle cx="50" cy="46" r="2.5" fill="#C8102E" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-lg font-bold tracking-[0.18em] uppercase text-black leading-none">
            LUMAA HOME<span className="text-[10px] text-[#C8102E] font-normal align-top ml-0.5">™</span>
          </span>
          <span className="text-[8px] font-bold tracking-[0.25em] text-[#9E7D4E] uppercase mt-0.5">
            LONDON
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Attractive Luxury Emblem with Gold and Obsidian Finish */}
      <div className="relative mb-3 inline-block group cursor-pointer">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto transition-transform duration-500 group-hover:scale-105">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
          >
            <defs>
              {/* Luxury Champagne Gold Metallic Gradient */}
              <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F9E8C7" />
                <stop offset="30%" stopColor="#D4AF37" />
                <stop offset="70%" stopColor="#C5A880" />
                <stop offset="100%" stopColor="#917246" />
              </linearGradient>

              {/* Obsidian Deep Shadow Gradient */}
              <radialGradient id="obsidianGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1E1E1E" />
                <stop offset="85%" stopColor="#0D0D0D" />
                <stop offset="100%" stopColor="#050505" />
              </radialGradient>

              {/* Soft Light Halo Gradient (Lumaa = Luminescence/Light) */}
              <radialGradient id="lumaaLight" cx="50%" cy="40%" r="45%">
                <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#1E1E1E" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Dark Luxury Medallion Base */}
            <circle cx="100" cy="100" r="95" fill="url(#obsidianGlow)" />
            <circle cx="100" cy="100" r="95" fill="url(#lumaaLight)" />

            {/* Double Gold Guilloché Edge */}
            <circle cx="100" cy="100" r="92" stroke="url(#goldMetallic)" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="88" stroke="url(#goldMetallic)" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.8" />
            <circle cx="100" cy="100" r="83" stroke="url(#goldMetallic)" strokeWidth="0.5" opacity="0.5" />

            {/* Top Cardinal Diamond & Star in Crimson & Gold */}
            <polygon points="100,12 103,19 100,26 97,19" fill="#C8102E" />
            <circle cx="100" cy="19" r="1.5" fill="#F9E8C7" />
            <circle cx="19" cy="100" r="1.5" fill="#D4AF37" />
            <circle cx="181" cy="100" r="1.5" fill="#D4AF37" />
            <polygon points="100,174 103,181 100,188 97,181" fill="#C8102E" />

            {/* --- CENTRAL ICON: MODERN ARCHITECTURAL HOME + RADIANT LUMINESCENCE (LUMAA) --- */}
            
            {/* Elegant Modern Gable / House Silhouette */}
            <path
              d="M52 90L100 48L148 90"
              stroke="url(#goldMetallic)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Secondary Accent Roof Overhang */}
            <path
              d="M44 94L100 44L156 94"
              stroke="url(#goldMetallic)"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Neoclassical Living Archway (Home Interior Portal) */}
            <path
              d="M74 140V96C74 81.64 85.64 70 100 70C114.36 70 126 81.64 126 96V140"
              stroke="url(#goldMetallic)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M80 140V98C80 86.954 88.954 78 100 78C111.046 78 120 86.954 120 98V140"
              stroke="#FFFFFF"
              strokeWidth="0.75"
              strokeDasharray="2 3"
              opacity="0.7"
            />

            {/* Interior Pendant Chandelier / Radiant Warmth (The "Lumaa" Glow) */}
            {/* Hanging Cable */}
            <line x1="100" y1="70" x2="100" y2="88" stroke="url(#goldMetallic)" strokeWidth="1.5" />
            {/* Chandelier / Warm Lantern Light */}
            <circle cx="100" cy="94" r="5" fill="#C8102E" />
            <circle cx="100" cy="94" r="8" stroke="url(#goldMetallic)" strokeWidth="1.25" />
            {/* Radiating Light Beams */}
            <line x1="100" y1="82" x2="100" y2="84" stroke="#FFF2D6" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="90" y1="94" x2="88" y2="94" stroke="#FFF2D6" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="110" y1="94" x2="112" y2="94" stroke="#FFF2D6" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="93" y1="87" x2="91" y2="85" stroke="#FFF2D6" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="107" y1="87" x2="109" y2="85" stroke="#FFF2D6" strokeWidth="1.5" strokeLinecap="round" />

            {/* Architectural Hearth / Floor Steps */}
            <line x1="60" y1="140" x2="140" y2="140" stroke="url(#goldMetallic)" strokeWidth="3" strokeLinecap="round" />
            <line x1="52" y1="146" x2="148" y2="146" stroke="url(#goldMetallic)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

            {/* Subtle Laurel Leaves for British Heritage & Home Elegance */}
            {/* Left Laurel */}
            <path d="M46 126C42 118 42 108 47 100C48 107 48 115 52 120" stroke="url(#goldMetallic)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Right Laurel */}
            <path d="M154 126C158 118 158 108 153 100C152 107 152 115 148 120" stroke="url(#goldMetallic)" strokeWidth="1.2" strokeLinecap="round" fill="none" />

            {/* Heritage Micro Text */}
            <text
              x="100"
              y="166"
              fontFamily="'Lato', sans-serif"
              fontSize="8.5"
              fontWeight="900"
              letterSpacing="3"
              fill="url(#goldMetallic)"
              textAnchor="middle"
            >
              LONDON • EST. 2024
            </text>
          </svg>
        </div>
      </div>

      {/* Main Luxury Brand Typography */}
      <div className="space-y-1.5 max-w-2xl mx-auto">
        {/* Brand Name */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.08em] text-black uppercase transition-all duration-300 hover:tracking-[0.1em] leading-none">
          LUMAA HOME<span className="text-sm sm:text-lg align-top text-[#C8102E] font-normal ml-1">™</span>
        </h1>

        {/* Gold & Charcoal Decorative Divider Ribbon */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto pt-1">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C5A880] to-black"></div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#C8102E] rotate-45 shrink-0"></span>
            <span className="text-[10px] sm:text-[12px] font-bold tracking-[0.32em] text-[#111111] uppercase whitespace-nowrap">
              LUXURY INTERIORS • DECOR • DIY
            </span>
            <span className="w-1.5 h-1.5 bg-[#C8102E] rotate-45 shrink-0"></span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C5A880] to-black"></div>
        </div>

        {/* UK Heritage Subtitle */}
        <span className="text-[9px] sm:text-[11px] tracking-[0.26em] text-gray-500 uppercase block font-semibold">
          THE BRITISH MAGAZINE OF HOMES AND PERIOD DESIGN
        </span>
      </div>
    </div>
  );
}
