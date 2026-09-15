import React, { useEffect } from 'react';
import { CATEGORIES } from '../data/articles';
import { ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { updatePageSeo, buildCategoryJsonLd } from '../utils/seo';

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updatePageSeo({
      title: `${categoryInfo.name} Editorial Archive`,
      description: categoryInfo.description,
      keywords: `${categoryInfo.name.toLowerCase()}, luxury british interiors, architectural restoration, ${categoryInfo.id} design uk`,
      canonicalPath: `/category/${categoryInfo.id}`,
      ogType: 'website',
      image: categoryInfo.bannerImage,
      section: categoryInfo.name,
      jsonLd: buildCategoryJsonLd(categoryInfo, articles)
    });
  }, [category, categoryInfo, articles]);

  const leadArticle = articles.length > 0 ? articles[0] : null;
  const remainingArticles = articles.slice(1);

  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* 1. BREADCRUMB & CLEAN CATEGORY TITLE */}
      <div className="space-y-3 border-b-2 border-black pb-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
          <div className="flex items-center gap-2">
            <a 
              href="/" 
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  onSelectCategory('all');
                }
              }}
              className="hover:text-black transition cursor-pointer"
            >
              HOME
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400">CATEGORIES</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#C8102E] font-black">{categoryInfo.name}</span>
          </div>

          <a
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                onSelectCategory('all');
              }
            }}
            className="text-[10px] font-black uppercase tracking-wider text-black hover:text-[#C8102E] transition flex items-center gap-1 cursor-pointer"
          >
            ← ALL STORIES
          </a>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8102E] block">
              EDITORIAL ARCHIVE
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-black uppercase tracking-tight">
              {categoryInfo.name}
            </h1>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {articles.length} {articles.length === 1 ? 'STORY' : 'STORIES'} IN SECTION
          </span>
        </div>
      </div>

      {/* ALL ARTICLES IN THIS CATEGORY */}
      <section className="space-y-6">
        {articles.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-serif">
            No articles found in this category.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <article
                key={art.id}
                className="space-y-3 flex flex-col justify-between border-b border-gray-200 pb-5"
              >
                <a
                  href={`/${art.slug}`}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      onSelectArticle(art);
                    }
                  }}
                  className="space-y-3 group cursor-pointer block"
                >
                  <div className="aspect-[16/10] bg-gray-100 overflow-hidden border border-gray-200 group-hover:border-black transition">
                    <img
                      src={art.heroImage || art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8102E] block">
                    {art.categoryLabel || art.categoryName || categoryInfo.name}
                  </span>

                  <h4 className="font-serif text-lg font-bold text-black group-hover:text-[#C8102E] transition leading-snug">
                    {art.title}
                  </h4>
                </a>

                <div className="pt-3 text-[10px] font-bold text-black tracking-wider uppercase border-t border-gray-200 flex items-center gap-2">
                  <a
                    href={`/author/${art.authorId || 'marcus-cole'}`}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        if (onSelectAuthor) onSelectAuthor(art.authorId || 'marcus-cole');
                      }
                    }}
                    className="hover:text-[#C8102E] hover:underline transition cursor-pointer"
                  >
                    BY {art.author.toUpperCase()}
                  </a>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-700">{art.date}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

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
