import React from 'react';

export default function CoverHero({ coverArticle, stackedArticles, onSelectArticle, onSelectAuthor }) {
  if (!coverArticle) return null;

  return (
    <section className="pb-10 border-b border-gray-200">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Cover Feature (8 cols) */}
        <div
          onClick={() => onSelectArticle(coverArticle)}
          className="lg:col-span-8 group cursor-pointer space-y-4"
        >
          <div className="relative overflow-hidden bg-gray-950 aspect-[16/10] sm:aspect-[16/9] flex items-end">
            <img
              src={coverArticle.heroImage}
              alt={coverArticle.title}
              className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="relative z-10 p-6 sm:p-8 space-y-3 text-white w-full">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C8102E] bg-white px-3 py-1 inline-block shadow-sm">
                {coverArticle.categoryLabel}
              </span>
              
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight group-hover:text-gray-200 transition">
                {coverArticle.title}
              </h2>
              
              <div className="text-[11px] text-gray-300 tracking-wider uppercase pt-2 border-t border-gray-700/80 flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectAuthor) onSelectAuthor(coverArticle.authorId || 'sarah-jenkins');
                  }}
                  className="font-bold text-white hover:text-[#C8102E] transition underline decoration-gray-500 hover:decoration-[#C8102E]"
                >
                  BY {coverArticle.author.toUpperCase()}
                </button>
                <span>•</span>
                <span>{coverArticle.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Stacked Features (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {stackedArticles.slice(0, 2).map((article, idx, arr) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className={`group cursor-pointer space-y-2 pb-5 ${
                idx < arr.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden mb-2">
                <img
                  src={article.heroImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-[#C8102E] block">
                {article.categoryLabel}
              </span>
              
              <h3 className="font-serif text-base sm:text-lg font-bold text-black group-hover:text-[#C8102E] transition leading-snug">
                {article.title}
              </h3>
              
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase pt-1 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectAuthor) onSelectAuthor(article.authorId || 'eleanor-vance');
                  }}
                  className="hover:text-black hover:underline transition"
                >
                  BY {article.author.toUpperCase()}
                </button>
                <span>•</span>
                <span>{article.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
