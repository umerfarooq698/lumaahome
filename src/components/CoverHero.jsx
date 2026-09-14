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
          {/* Crisp Image without dark gradient overlay */}
          <div className="relative overflow-hidden bg-gray-100 aspect-[16/10] sm:aspect-[16/9] border border-gray-200">
            <img
              src={coverArticle.heroImage}
              alt={coverArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
            />
          </div>

          {/* Clean Typography Below Image */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8102E] block">
              {coverArticle.categoryLabel}
            </span>
            
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-black group-hover:text-[#C8102E] transition leading-tight">
              {coverArticle.title}
            </h2>

            {coverArticle.excerpt && (
              <p className="text-sm sm:text-base text-[#222222] leading-relaxed font-normal line-clamp-2">
                {coverArticle.excerpt}
              </p>
            )}
            
            <div className="text-[10px] font-bold text-black tracking-wider uppercase pt-1 border-t border-gray-200 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectAuthor) onSelectAuthor(coverArticle.authorId || 'sarah-jenkins');
                }}
                className="hover:text-[#C8102E] hover:underline transition"
              >
                BY {coverArticle.author.toUpperCase()}
              </button>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{coverArticle.date}</span>
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
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden border border-gray-200">
                <img
                  src={article.heroImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8102E] block">
                {article.categoryLabel}
              </span>
              
              <h3 className="font-serif text-base sm:text-lg font-bold text-black group-hover:text-[#C8102E] transition leading-snug">
                {article.title}
              </h3>
              
              <div className="text-[10px] font-bold text-black tracking-wider uppercase pt-1 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectAuthor) onSelectAuthor(article.authorId || 'eleanor-vance');
                  }}
                  className="hover:text-[#C8102E] hover:underline transition"
                >
                  BY {article.author.toUpperCase()}
                </button>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{article.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
