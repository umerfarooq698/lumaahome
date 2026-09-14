import React from 'react';

export default function EditorialGrid({ 
  articles, 
  onSelectArticle, 
  onSelectAuthor,
  sectionTitle = "LATEST EDITORIAL STORIES" 
}) {
  if (!articles || articles.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 font-serif">
        No articles found.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="border-b-2 border-black pb-2 flex items-center justify-between">
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-black uppercase">
          {sectionTitle}
        </h2>
        <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
          {articles.length} ARTICLES
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <article
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="group cursor-pointer flex flex-col justify-between border-b border-gray-200 pb-6 transition"
          >
            <div className="space-y-3">
              {/* Photo Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={article.heroImage || article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                  loading="lazy"
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectAuthor) onSelectAuthor(article.authorId || 'eleanor-vance');
                }}
                className="hover:text-black hover:underline transition"
              >
                BY {article.author.toUpperCase()}
              </button>
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
