import React, { useState } from 'react';
import { CATEGORIES } from '../data/articles';
import { Search, X } from 'lucide-react';
import Logo from './Logo';

export default function Header({ 
  activeCategory, 
  setActiveCategory, 
  searchQuery, 
  setSearchQuery, 
  onOpenSubscribe 
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="pt-2.5 pb-2 sm:pt-4 sm:pb-2.5 border-b border-gray-900 bg-white">
      {/* Centered Brand Logo & Title */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
        <a 
          href="/" 
          onClick={(e) => {
            if (activeCategory !== 'all') {
              e.preventDefault();
              setActiveCategory('all');
              window.location.hash = '';
            }
          }}
          className="inline-block group cursor-pointer"
        >
          <Logo />
        </a>
      </div>

      {/* Bordered Horizontal Navigation Ribbon with Categories */}
      <div className="mt-2.5 sm:mt-3.5 border-t border-b border-gray-900 py-1.5 sm:py-2 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Categories Nav (Touch-friendly horizontal scroll) */}
          <nav className="flex items-center gap-3.5 sm:gap-6 md:gap-7 overflow-x-auto text-[10px] sm:text-xs font-bold tracking-widest uppercase text-black py-1 no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => {
              const href = cat.id === 'all' ? '/' : `/category/${cat.id}`;
              const isActive = activeCategory === cat.id;
              return (
                <a
                  key={cat.id}
                  href={href}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      setActiveCategory(cat.id);
                    }
                  }}
                  className={`transition shrink-0 pb-0.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#C8102E] border-b-2 border-[#C8102E]'
                      : 'text-black hover:text-[#C8102E]'
                  }`}
                >
                  {cat.name}
                </a>
              );
            })}
          </nav>

          {/* Search & Subscribe (Responsive across Mobile, Tablet, Desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Desktop / Large Tablet Search Bar */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-3 py-1 text-xs border border-gray-300 focus:outline-none focus:border-black w-24 sm:w-32 lg:w-40 transition text-black bg-white rounded-none"
              />
              <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-gray-400 pointer-events-none" />
            </div>

            {/* Mobile / Small Tablet Search Toggle Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-1.5 text-black hover:text-[#C8102E] transition focus:outline-none"
              aria-label="Toggle Search"
            >
              {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            {/* Subscribe Button */}
            <button
              onClick={onOpenSubscribe}
              className="bg-black text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider sm:tracking-widest hover:bg-[#C8102E] transition shadow-sm whitespace-nowrap"
            >
              SUBSCRIBE
            </button>
          </div>

        </div>

        {/* Expandable Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-3 pt-2 pb-1 bg-white border-t border-gray-100 animate-fadeIn">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search articles, decor, guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-8 pr-3 py-2 text-base sm:text-xs border border-gray-300 focus:outline-none focus:border-black text-black bg-gray-50"
              />
              <Search className="w-4 h-4 absolute left-2.5 text-gray-400 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-gray-400 hover:text-black text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
