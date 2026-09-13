import React from 'react';
import { CATEGORIES } from '../data/articles';
import { Search } from 'lucide-react';

export default function Header({ 
  activeCategory, 
  setActiveCategory, 
  searchQuery, 
  setSearchQuery, 
  onOpenSubscribe 
}) {
  return (
    <header className="py-6 border-b border-gray-900 bg-white">
      {/* Centered Brand Title */}
      <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
        <a href="/" className="inline-block group">
          <h1 className="font-serif text-4xl sm:text-6xl font-black tracking-tight text-black uppercase transition group-hover:opacity-90">
            Lumaa Home<span className="text-sm align-top text-[#C8102E] font-normal">™</span>
          </h1>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-gray-500 block uppercase mt-1">
            A Luxury Home Decor & DIY Magazine • UK Edition
          </span>
        </a>
      </div>

      {/* Bordered Horizontal Navigation Ribbon with New Categories */}
      <div className="mt-6 border-t border-b border-gray-900 py-2.5 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          
          {/* Categories Nav */}
          <nav className="flex items-center gap-5 sm:gap-7 overflow-x-auto text-[11px] sm:text-xs font-bold tracking-widest uppercase text-black py-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`transition shrink-0 pb-0.5 ${
                  activeCategory === cat.id
                    ? 'text-[#C8102E] border-b-2 border-[#C8102E]'
                    : 'text-black hover:text-[#C8102E]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>

          {/* Search & Subscribe */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative hidden xl:block">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-3 py-1 text-xs border border-gray-300 focus:outline-none focus:border-black w-28 lg:w-36 transition text-black"
              />
              <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-gray-400" />
            </div>

            <button
              onClick={onOpenSubscribe}
              className="bg-black text-white px-3.5 py-1.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C8102E] transition shadow-sm"
            >
              SUBSCRIBE
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
