import React from 'react';

export default function TopBar({ onNavigatePage }) {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="border-b border-gray-200 py-1.5 px-3 sm:px-4 text-[10px] sm:text-[11px] font-semibold text-black bg-white">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* UK Edition Badge and Date */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-[10px] sm:text-[11px]">
          <span className="font-black text-[#C8102E] uppercase tracking-wider sm:tracking-widest text-[9px] sm:text-[10px] bg-red-50 border border-red-200 px-1.5 py-0.5 sm:border-0 sm:bg-transparent sm:p-0">
            UK EDITION
          </span>
          <span className="text-gray-300 hidden xs:inline">•</span>
          <span className="text-gray-600 font-medium whitespace-nowrap">{currentDate}</span>
        </div>

        {/* Navigation and Social Links */}
        <div className="flex items-center gap-2.5 sm:gap-4 text-[10px] sm:text-[11px] text-black font-semibold uppercase tracking-wider shrink-0">
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigatePage) onNavigatePage('about');
            }}
            className="hover:text-[#C8102E] transition"
          >
            About
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigatePage) onNavigatePage('contact');
            }}
            className="hover:text-[#C8102E] transition"
          >
            Contact
          </a>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#C8102E] transition hidden sm:inline">Instagram</a>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-[#C8102E] transition hidden sm:inline">Pinterest</a>
        </div>
      </div>
    </div>
  );
}
