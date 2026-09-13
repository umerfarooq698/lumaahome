import React from 'react';

export default function CoverHero({ coverArticle, stackedArticles, onSelectArticle }) {
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
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="relative z-10 p-6 sm:p-10 space-y-3 text-white">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C8102E] bg-white px-3 py-1 inline-block shadow-sm">
                {coverArticle.categoryLabel}
              </span>
              
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight group-hover:text-gray-200 transition">
                {coverArticle.title}
              </h2>
              
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed font-light line-clamp-2">
                {coverArticle.excerpt}
              </p>
              
              <div className="text-[11px] text-gray-300 tracking-wider uppercase pt-3 border-t border-gray-700/80 flex items-center gap-4">
                <span className="font-bold text-white">BY {coverArticle.author.toUpperCase()}</span>
                <span>•</span>
                <span>{coverArticle.date}</span>
                <span>•</span>
                <span className="text-[#C8102E] font-bold">READ FULL STORY →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Stacked Features (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {stackedArticles.map((article, idx) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className={`group cursor-pointer space-y-2.5 pb-6 ${
                idx === 0 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden mb-3">
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
              
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase pt-1 flex items-center justify-between">
                <span>BY {article.author.toUpperCase()}</span>
                <span className="text-black group-hover:text-[#C8102E]">{article.readTime}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
