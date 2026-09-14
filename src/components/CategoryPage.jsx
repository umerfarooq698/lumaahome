import React from 'react';
import { CATEGORIES } from '../data/articles';
import { ChevronRight, Sparkles, BookOpen } from 'lucide-react';

export default function CategoryPage({ 
  category, 
  articles, 
  onSelectArticle, 
  onSelectCategory,
  onSelectAuthor 
}) {
  const categoryInfo = CATEGORIES.find(c => c.id === category) || {
    id: category,
    name: category.toUpperCase(),
    title: `${category.toUpperCase()} EDITORIAL ARCHIVE`,
    description: `Curated UK interior design, architectural restorations, and expert guides for ${category}.`,
    quote: 'Crafting comfortable, refined British spaces with authentic craftsmanship.'
  };

  const leadArticle = articles.length > 0 ? articles[0] : null;
  const remainingArticles = articles.slice(1);

  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* BREADCRUMB & BACK BUTTON */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onSelectCategory('all')} 
            className="hover:text-black transition"
          >
            HOME
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-400">CATEGORIES</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#C8102E] font-black">{categoryInfo.name}</span>
        </div>

        <button
          onClick={() => onSelectCategory('all')}
          className="text-[10px] font-black uppercase tracking-wider text-black hover:text-[#C8102E] transition flex items-center gap-1"
        >
          ← VIEW ALL CATEGORIES
        </button>
      </div>

      {/* CATEGORY EDITORIAL HERO BANNER */}
      <div className="relative bg-black text-white p-8 sm:p-14 overflow-hidden shadow-lg border-l-8 border-l-[#C8102E]">
        {categoryInfo.bannerImage && (
          <img
            src={categoryInfo.bannerImage}
            alt={categoryInfo.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-[0.2em]">
              UK CATEGORY ARCHIVE
            </span>
            <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">
              {articles.length} {articles.length === 1 ? 'FEATURE' : 'FEATURES'} PUBLISHED
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            {categoryInfo.title}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light max-w-2xl">
            {categoryInfo.description}
          </p>

          {categoryInfo.quote && (
            <div className="pt-2 text-xs font-serif italic text-gray-400 border-l-2 border-[#C8102E] pl-3">
              "{categoryInfo.quote}"
            </div>
          )}
        </div>
      </div>

      {/* LEAD FEATURED ARTICLE IN THIS CATEGORY */}
      {leadArticle && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <span className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
              CATEGORY LEAD STORY
            </span>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
              FEATURED ESSAY
            </span>
          </div>

          <div
            onClick={() => onSelectArticle(leadArticle)}
            className="grid lg:grid-cols-12 gap-8 items-center bg-[#FDFBF7] p-6 sm:p-8 border border-gray-200 group cursor-pointer hover:border-black transition"
          >
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={leadArticle.heroImage}
                alt={leadArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
              />
            </div>

            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8102E] block">
                {leadArticle.categoryLabel}
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl font-black text-black group-hover:text-[#C8102E] transition leading-tight">
                {leadArticle.title}
              </h2>

              <p className="text-xs text-gray-600 leading-relaxed font-light line-clamp-3">
                {leadArticle.excerpt}
              </p>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 uppercase tracking-wider font-bold">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectAuthor) onSelectAuthor(leadArticle.authorId || 'eleanor-vance');
                  }}
                  className="hover:text-black hover:underline transition"
                >
                  BY {leadArticle.author}
                </button>
                <span className="text-black group-hover:text-[#C8102E] flex items-center gap-1">
                  READ FEATURE →
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* REMAINING ARTICLES IN THIS CATEGORY */}
      {remainingArticles.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-black flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C8102E]" />
              MORE IN {categoryInfo.name}
            </h3>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              VOLUME N°12
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="space-y-3 group cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="aspect-[16/10] bg-gray-100 overflow-hidden border border-gray-200 group-hover:border-black transition">
                    <img
                      src={art.heroImage || art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8102E] block">
                    {art.categoryLabel || art.categoryName}
                  </span>

                  <h4 className="font-serif text-lg font-bold text-black group-hover:text-[#C8102E] transition leading-snug">
                    {art.title}
                  </h4>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 text-[10px] font-bold text-gray-400 tracking-wider uppercase border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectAuthor) onSelectAuthor(art.authorId || 'eleanor-vance');
                    }}
                    className="hover:text-black hover:underline transition"
                  >
                    BY {art.author.toUpperCase()}
                  </button>
                  <span className="text-black group-hover:text-[#C8102E]">
                    {art.readTime} • READ →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CATEGORY EXPLORER PILLS (QUICK NAVIGATE TO OTHER ROOMS) */}
      <section className="bg-[#FDFBF7] p-8 border border-gray-200 space-y-4 text-center my-8">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">
          EXPLORE OTHER ROOMS AND TOPICS
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.filter(c => c.id !== 'all' && c.id !== category).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-white hover:bg-black hover:text-white border border-gray-300 text-black text-xs font-bold uppercase tracking-wider transition shadow-sm"
            >
              {cat.name} →
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
