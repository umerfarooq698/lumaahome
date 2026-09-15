import React from 'react';
import { CATEGORIES } from '../data/articles';
import { AUTHORS } from '../data/authors';
import Logo from './Logo';

export default function Footer({ onSelectCategory, onSelectAuthor, onNavigateLegal, onNavigatePage }) {
  const handleNav = (page) => {
    if (onNavigatePage) onNavigatePage(page);
    else if (onNavigateLegal) onNavigateLegal(page);
  };

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
                <a
                  key={author.id}
                  href={`/author/${author.id}`}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      if (onSelectAuthor) onSelectAuthor(author.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="text-black font-medium hover:text-[#C8102E] transition cursor-pointer"
                >
                  {author.name}
                </a>
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
                  <a
                    href={`/category/${cat.id}`}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        onSelectCategory(cat.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="text-[#111111] font-medium hover:text-[#C8102E] hover:underline transition uppercase inline-block cursor-pointer"
                  >
                    {cat.name}
                  </a>
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
                  <a
                    href={`/category/${cat.id}`}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        onSelectCategory(cat.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="text-[#111111] font-medium hover:text-[#C8102E] hover:underline transition uppercase inline-block cursor-pointer"
                  >
                    {cat.name}
                  </a>
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

          <div className="text-[11px] space-y-1">
            <p className="text-[#111111] font-normal">
              Editorial inquiries: <a href="mailto:info.lumaahome@gmail.com" className="text-black font-bold hover:text-[#C8102E] underline">info.lumaahome@gmail.com</a>
            </p>
            <p className="text-[10px] text-gray-700 font-medium">
              © {new Date().getFullYear()} LUMAA HOME™ DIGITAL MEDIA GROUP.
            </p>
          </div>

          <div className="pt-2 border-t border-gray-200 space-y-1 text-[10px] text-black uppercase tracking-wider font-bold">
            <div className="flex items-center gap-3">
              <a
                href="/privacy-policy"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('privacy-policy');
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
                  handleNav('terms-of-service');
                }}
                className="hover:text-[#C8102E] transition underline decoration-gray-400 hover:decoration-[#C8102E]"
              >
                Terms of Service
              </a>
            </div>

            <div className="flex items-center gap-3 pt-0.5">
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('about');
                }}
                className="hover:text-[#C8102E] transition underline decoration-gray-400 hover:decoration-[#C8102E]"
              >
                About Us
              </a>
              <span>•</span>
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('contact');
                }}
                className="hover:text-[#C8102E] transition underline decoration-gray-400 hover:decoration-[#C8102E]"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
