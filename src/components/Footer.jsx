import React from 'react';
import { CATEGORIES } from '../data/articles';
import { AUTHORS } from '../data/authors';
import Logo from './Logo';

export default function Footer({ onSelectCategory, onSelectAuthor }) {
  return (
    <footer className="mt-20 border-t-2 border-black bg-white py-14 text-xs text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Col 1: Brand & Masthead */}
        <div className="space-y-4">
          <Logo size="small" />
          <p className="text-[11px] leading-relaxed text-gray-500 font-light">
            The UK's premier independent luxury home decor, period restoration, and bespoke DIY editorial magazine. Printed and published digitally in London, UK.
          </p>
          
          <div className="pt-2">
            <span className="text-[10px] font-bold text-black uppercase tracking-widest block mb-2">
              MASTHEAD EDITORS
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
              {AUTHORS.map((author) => (
                <button
                  key={author.id}
                  onClick={() => {
                    if (onSelectAuthor) onSelectAuthor(author.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-gray-500 hover:text-[#C8102E] transition"
                >
                  {author.name}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pt-1">
            ISSN 2849-1029 • LONDON, UK
          </div>
        </div>

        {/* Col 2: Categories Part 1 */}
        <div className="space-y-3">
          <h4 className="font-bold text-black uppercase tracking-widest text-[11px] border-b border-gray-200 pb-1.5">
            ROOMS AND SPACES
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            {['living-room', 'bedroom', 'kitchen', 'bathroom', 'garden'].map((catId) => {
              const cat = CATEGORIES.find(c => c.id === catId);
              if (!cat) return null;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-black hover:underline transition uppercase"
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Col 3: Categories Part 2 */}
        <div className="space-y-3">
          <h4 className="font-bold text-black uppercase tracking-widest text-[11px] border-b border-gray-200 pb-1.5">
            EDITORIAL AND GUIDES
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            {['interiors', 'diy', 'buying-guides'].map((catId) => {
              const cat = CATEGORIES.find(c => c.id === catId);
              if (!cat) return null;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-black hover:underline transition uppercase"
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Col 4: Corporate & Legal */}
        <div className="space-y-3">
          <h4 className="font-bold text-black uppercase tracking-widest text-[11px] border-b border-gray-200 pb-1.5">
            LEGAL AND CONTACT
          </h4>
          <p className="text-[11px] text-gray-500 leading-relaxed font-light">
            Editorial inquiries: <span className="text-black font-semibold">editor@lumaahome.co.uk</span>
          </p>
          <p className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} LUMAA HOME™ DIGITAL MEDIA GROUP. ALL RIGHTS RESERVED.
          </p>
          <div className="pt-2 flex items-center gap-3 text-[10px] text-gray-400 uppercase tracking-wider">
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-black">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
