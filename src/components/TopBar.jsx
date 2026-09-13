import React from 'react';

export default function TopBar({ onOpenAIGenerator }) {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="border-b border-gray-200 py-2 px-4 text-[11px] font-semibold text-gray-600 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* UK Edition Badge & Date */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="font-black text-[#C8102E] uppercase tracking-widest text-[10px]">
            UK EDITION
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 font-medium">{currentDate}</span>
        </div>

        {/* Social Links and AI Studio */}
        <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium">
          <button
            onClick={onOpenAIGenerator}
            className="flex items-center gap-1 text-[#C8102E] font-bold hover:underline transition uppercase text-[10px] tracking-wider"
          >
            <span>✨ AI STUDIO</span>
          </button>
          <span>•</span>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition">Instagram</a>
          <span>•</span>
          <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-black transition">Pinterest</a>
        </div>
      </div>
    </div>
  );
}
