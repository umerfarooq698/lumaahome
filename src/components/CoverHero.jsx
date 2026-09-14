import React from 'react';

export default function CoverHero({ coverArticle, stackedArticles, onSelectArticle, onSelectAuthor }) {
  if (!coverArticle) return null;

  return (
    <section className="pb-10 border-b border-gray-200">
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Main Cover Feature (8 cols) - Stretches full height */}
        <div
          onClick={() => onSelectArticle(coverArticle)}
          className="lg:col-span-8 group cursor-pointer flex flex-col h-full"
        >
          <div className="relative overflow-hidden bg-gray-950 flex-1 min-h-[480px] sm:min-h-[540px] lg:min-h-full flex items-end shadow-sm">
            <img
              src={coverArticle.heroImage}
              alt={coverArticle.title}
              className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent"></div>
            
            <div className="relative z-10 p-6 sm:p-10 space-y-3.5 text-white w-full">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C8102E] bg-white px-3 py-1 inline-block shadow-sm">
                {coverArticle.categoryLabel}
              </span>
              
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight group-hover:text-gray-200 transition">
                {coverArticle.title}
              </h2>
              
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed font-light line-clamp-3">
                {coverArticle.excerpt}
              </p>
              
              <div className="text-[11px] text-gray-300 tracking-wider uppercase pt-3 border-t border-gray-700/80 flex items-center gap-4">
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
                <span>•</span>
                <span className="text-[#C8102E] font-bold">READ FULL STORY →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Stacked Features (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          {stackedArticles.slice(0, 2).map((article, idx, arr) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className={`group cursor-pointer flex flex-col justify-between flex-1 pb-6 ${
                idx < arr.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="space-y-2.5">
                <div className="aspect-[16/9] bg-gray-100 overflow-hidden mb-2.5">
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-[#C8102E] block">
                  {article.categoryLabel}
                </span>
                
                <h3 className="font-serif text-lg sm:text-xl font-bold text-black group-hover:text-[#C8102E] transition leading-snug">
                  {article.title}
                </h3>
                
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
              
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase pt-3 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectAuthor) onSelectAuthor(article.authorId || 'eleanor-vance');
                  }}
                  className="hover:text-black hover:underline transition"
                >
                  BY {article.author.toUpperCase()}
                </button>
                <span className="text-black group-hover:text-[#C8102E]">{article.readTime}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
