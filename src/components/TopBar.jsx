import React from 'react';

export default function TopBar({ onNavigatePage }) {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="border-b border-gray-200 py-2 px-4 text-[11px] font-semibold text-black bg-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* UK Edition Badge and Date */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="font-black text-[#C8102E] uppercase tracking-widest text-[10px]">
            UK EDITION
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-700 font-medium">{currentDate}</span>
        </div>

        {/* Navigation and Social Links */}
        <div className="flex items-center gap-4 text-[11px] text-black font-semibold uppercase tracking-wider">
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigatePage) onNavigatePage('about');
            }}
            className="hover:text-[#C8102E] transition"
          >
            About Us
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
          <span className="text-gray-300">•</span>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#C8102E] transition">Instagram</a>
          <span className="text-gray-300">•</span>
          <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-[#C8102E] transition">Pinterest</a>
        </div>
      </div>
    </div>
  );
}
