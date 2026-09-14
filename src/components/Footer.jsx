import React from 'react';
import { CATEGORIES } from '../data/articles';
import { AUTHORS } from '../data/authors';
import Logo from './Logo';

export default function Footer({ onSelectCategory, onSelectAuthor, onNavigateLegal }) {
  return (
    <footer className="mt-20 border-t-2 border-black bg-white py-14 text-xs text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Col 1: Brand and Masthead */}
        <div className="space-y-4">
          <Logo size="small" />
          <p className="text-[11px] leading-relaxed text-[#111111] font-normal">
            The premier independent luxury home decor, period restoration, and bespoke DIY editorial magazine.
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
                  className="text-black font-medium hover:text-[#C8102E] transition"
                >
                  {author.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2: Categories Part 1 */}
        <div className="space-y-3">
          <h4 className="font-bold text-black uppercase tracking-widest text-[11px] border-b-2 border-black pb-1.5">
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
                    className="text-[#111111] font-medium hover:text-[#C8102E] hover:underline transition uppercase"
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
          <h4 className="font-bold text-black uppercase tracking-widest text-[11px] border-b-2 border-black pb-1.5">
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
                    className="text-[#111111] font-medium hover:text-[#C8102E] hover:underline transition uppercase"
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Col 4: Corporate and Legal */}
        <div className="space-y-3">
          <h4 className="font-bold text-black uppercase tracking-widest text-[11px] border-b-2 border-black pb-1.5">
            LEGAL AND CONTACT
          </h4>
          <p className="text-[11px] text-[#111111] leading-relaxed font-normal">
            Editorial inquiries: <span className="text-black font-bold">info.lumaahome@gmail.com</span>
          </p>
          <p className="text-[11px] text-gray-800 font-medium">
            © {new Date().getFullYear()} LUMAA HOME™ DIGITAL MEDIA GROUP. ALL RIGHTS RESERVED.
          </p>
          <div className="pt-2 flex items-center gap-3 text-[10px] text-black uppercase tracking-wider font-bold">
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateLegal) {
                  onNavigateLegal('privacy-policy');
                }
              }}
              className="hover:text-[#C8102E] transition underline decoration-gray-400 hover:decoration-[#C8102E]"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="/terms-of-service"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateLegal) {
                  onNavigateLegal('terms-of-service');
                }
              }}
              className="hover:text-[#C8102E] transition underline decoration-gray-400 hover:decoration-[#C8102E]"
            >
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
