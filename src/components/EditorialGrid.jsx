import React from 'react';

export default function EditorialGrid({ articles, onSelectArticle, sectionTitle = "LATEST EDITORIAL STORIES" }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">
        No articles found matching your query.
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-3">
        <h2 className="font-serif text-xl sm:text-2xl font-black uppercase tracking-wider text-black">
          {sectionTitle}
        </h2>
        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest hidden sm:inline">
          UK VOLUME N°12
        </span>
      </div>

      {/* 3-Column Luxury Card Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <article
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="space-y-4 group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Image */}
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden border border-gray-200 group-hover:border-black transition">
                <img
                  src={article.heroImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                />
              </div>

              {/* Tag & Title */}
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8102E] block">
                {article.categoryLabel || article.category}
              </span>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-black group-hover:text-[#C8102E] transition leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-3 text-[10px] font-bold text-gray-400 tracking-wider uppercase border-t border-gray-100 flex items-center justify-between">
              <span>BY {article.author.toUpperCase()}</span>
              <span className="text-black group-hover:text-[#C8102E] font-bold">
                READ ARTICLE →
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
