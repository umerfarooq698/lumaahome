import React, { useEffect } from 'react';
import { ARTICLES, CATEGORIES } from '../data/articles';
import { AUTHORS } from '../data/authors';
import { ArrowLeft, ExternalLink, Rss, FileText, Compass, Users, Scale, Clock, Calendar } from 'lucide-react';
import { updatePageSeo } from '../utils/seo';

export default function SitemapPage({ 
  onBackToHome, 
  onSelectCategory, 
  onSelectArticle, 
  onSelectAuthor, 
  onNavigatePage 
}) {
  useEffect(() => {
    updatePageSeo({
      title: 'HTML Editorial Sitemap | LUMAA HOME™',
      description: 'Directory and index of all luxury British interior guides, period restoration articles, room categories, and editorial masthead profiles.',
      keywords: 'lumaa home sitemap, site index, uk interior design directory, period home renovation articles, masthead editors',
      canonicalPath: '/sitemap',
      ogType: 'website'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalArticles = ARTICLES.length;
  const activeCategories = CATEGORIES.filter(c => c.id !== 'all');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in">
      {/* Top Breadcrumbs & Back Button */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black hover:text-[#C8102E] transition group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>BACK TO MAGAZINE</span>
        </button>

        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); onBackToHome(); }} 
            className="hover:text-black transition"
          >
            HOME
          </a>
          <span>/</span>
          <span className="text-[#C8102E]">SITEMAP</span>
        </div>
      </div>

      {/* Main Masthead Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C8102E] bg-red-50 border border-red-100 px-3 py-1 inline-block mb-3">
          DIRECTORY & ARCHITECTURE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-black uppercase mb-3">
          Editorial Sitemap
        </h1>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
          Complete structural directory of all published architectural guides, rooms, masthead editors, and technical resources on LUMAA HOME™.
        </p>
      </div>

      {/* Quick Crawler & Syndication Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <a
          href="https://www.lumaahome.co.uk/sitemap.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 hover:border-black transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-bold text-xs group-hover:bg-[#C8102E] transition">
              XML
            </div>
            <div>
              <div className="text-xs font-bold text-black uppercase tracking-wider">
                XML SITEMAP FEED
              </div>
              <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                https://www.lumaahome.co.uk/sitemap.xml
              </div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-black transition" />
        </a>

        <a
          href="/rss"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigatePage) onNavigatePage('rss');
          }}
          className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 hover:border-black transition group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C8102E] text-white flex items-center justify-center font-bold text-xs">
              <Rss className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-black uppercase tracking-wider">
                RSS 2.0 NEWSFEED
              </div>
              <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                https://www.lumaahome.co.uk/rss.xml
              </div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-black transition" />
        </a>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 divide-x divide-gray-200 border-y border-black py-4 mb-12 text-center">
        <div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-black">{totalArticles}</div>
          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-0.5">Published Guides</div>
        </div>
        <div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-black">{activeCategories.length}</div>
          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-0.5">Categories</div>
        </div>
        <div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-black">{AUTHORS.length}</div>
          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-0.5">Masthead Editors</div>
        </div>
      </div>

      <div className="space-y-12">
        {/* SECTION 1: Categories & Rooms */}
        <section>
          <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-6">
            <Compass className="w-4 h-4 text-[#C8102E]" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-black">
              Rooms & Design Categories
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {activeCategories.map((cat) => {
              const catArticles = ARTICLES.filter(a => a.category === cat.id);
              return (
                <a
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSelectCategory) onSelectCategory(cat.id);
                  }}
                  className="block p-4 border border-gray-200 hover:border-black hover:shadow-sm transition bg-white group cursor-pointer"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-black group-hover:text-[#C8102E] transition">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                    {cat.description}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#C8102E] mt-3 flex items-center gap-1">
                    <span>{catArticles.length} {catArticles.length === 1 ? 'Article' : 'Articles'}</span>
                    <span>→</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: All Published Articles (Grouped by Category) */}
        <section>
          <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-6">
            <FileText className="w-4 h-4 text-[#C8102E]" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-black">
              All Editorial Articles ({totalArticles})
            </h2>
          </div>

          <div className="space-y-8">
            {activeCategories.map((cat) => {
              const catArticles = ARTICLES.filter(a => a.category === cat.id);
              if (catArticles.length === 0) return null;

              return (
                <div key={cat.id} className="bg-gray-50/70 border border-gray-200 p-5">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                    <h3 className="font-serif text-base font-bold text-black uppercase tracking-wide">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {catArticles.length} {catArticles.length === 1 ? 'Guide' : 'Guides'}
                    </span>
                  </div>

                  <ul className="divide-y divide-gray-200">
                    {catArticles.map((article) => (
                      <li key={article.id} className="py-3 first:pt-0 last:pb-0">
                        <a
                          href={`/${article.slug || article.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (onSelectArticle) onSelectArticle(article);
                          }}
                          className="group block cursor-pointer"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <h4 className="text-xs sm:text-sm font-bold text-black group-hover:text-[#C8102E] transition leading-snug">
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500 shrink-0 font-medium">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                {article.date || 'Editorial'}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {article.readTime || '6 min read'}
                              </span>
                            </div>
                          </div>
                          {article.excerpt && (
                            <p className="text-[11px] text-gray-600 font-normal mt-1 line-clamp-1">
                              {article.excerpt}
                            </p>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: Masthead Editors & Contributors */}
        <section>
          <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-6">
            <Users className="w-4 h-4 text-[#C8102E]" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-black">
              Masthead Editors & Profiles
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {AUTHORS.map((author) => (
              <a
                key={author.id}
                href={`/author/${author.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectAuthor) onSelectAuthor(author.id);
                }}
                className="p-4 border border-gray-200 hover:border-black transition bg-white flex items-center gap-3 group cursor-pointer"
              >
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <div className="text-xs font-bold text-black uppercase tracking-wider group-hover:text-[#C8102E] transition">
                    {author.name}
                  </div>
                  <div className="text-[10px] text-gray-500 line-clamp-1">
                    {author.role}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* SECTION 4: Legal & Informational Pages */}
        <section>
          <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-6">
            <Scale className="w-4 h-4 text-[#C8102E]" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-black">
              Institutional & Compliance Pages
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigatePage) onNavigatePage('about');
              }}
              className="p-3 border border-gray-200 hover:border-black transition bg-white font-bold uppercase tracking-wider text-black hover:text-[#C8102E] block cursor-pointer"
            >
              About Lumaa Home
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigatePage) onNavigatePage('contact');
              }}
              className="p-3 border border-gray-200 hover:border-black transition bg-white font-bold uppercase tracking-wider text-black hover:text-[#C8102E] block cursor-pointer"
            >
              Contact Editorial
            </a>
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigatePage) onNavigatePage('privacy-policy');
              }}
              className="p-3 border border-gray-200 hover:border-black transition bg-white font-bold uppercase tracking-wider text-black hover:text-[#C8102E] block cursor-pointer"
            >
              Privacy Policy (UK GDPR)
            </a>
            <a
              href="/terms-of-service"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigatePage) onNavigatePage('terms-of-service');
              }}
              className="p-3 border border-gray-200 hover:border-black transition bg-white font-bold uppercase tracking-wider text-black hover:text-[#C8102E] block cursor-pointer"
            >
              Terms of Service
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
