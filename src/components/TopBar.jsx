import React from 'react';
import { LOCATIONS } from '../data/articles';

export default function TopBar({ activeLocation, setActiveLocation, savedCount, onOpenSaved }) {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="border-b border-gray-200 py-2 px-4 text-[11px] font-semibold text-gray-600 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Locations selector */}
        <div className="flex items-center gap-3 uppercase tracking-widest text-[10px] text-gray-500 overflow-x-auto">
          <span className="font-black text-[#C8102E] shrink-0">LOCATIONS:</span>
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setActiveLocation(loc.id)}
              className={`transition hover:text-black shrink-0 ${
                activeLocation === loc.id ? 'font-black text-black underline underline-offset-4' : 'text-gray-500 font-medium'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        {/* Date, Social & Saved count */}
        <div className="flex items-center gap-6 text-[11px]">
          <span className="text-gray-400 hidden sm:inline">{currentDate}</span>
          
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 hover:bg-[#C8102E] hover:text-white transition text-[10px] font-bold tracking-wider uppercase text-gray-700"
          >
            <span>BOOKMARKS ({savedCount})</span>
          </button>

          <div className="hidden lg:flex items-center gap-3 text-gray-500 font-medium">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition">Instagram</a>
            <span>•</span>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-black transition">Pinterest</a>
            <span>•</span>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-black transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
}
