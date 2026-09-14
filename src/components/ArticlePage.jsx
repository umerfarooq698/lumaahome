import React, { useEffect } from 'react';
import { ArrowLeft, Bookmark, Share2, Check } from 'lucide-react';
import { getAuthorById } from '../data/authors';

export default function ArticlePage({ 
  article, 
  allArticles = [],
  onSelectArticle, 
  onSelectAuthor, 
  onSelectCategory,
  onBackToHome,
  isSaved,
  onToggleSave
}) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article?.id, article?.slug]);

  if (!article) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-black uppercase">Article Not Found</h2>
        <p className="text-xs text-gray-500">The story you are looking for may have been relocated.</p>
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#C8102E] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO HOME</span>
        </button>
      </div>
    );
  }

  const author = getAuthorById(article.authorId || article.author);

  // 5 latest articles for the left sidebar (excluding current article)
  const latestArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 5);

  // Related articles in the same category
  const relatedArticles = allArticles.filter(
    (a) => a.category === article.category && a.id !== article.id
  ).slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      {/* 1. TOP BREADCRUMB NAVIGATION */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 text-xs">
        <nav className="flex items-center gap-2 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
          <button 
            onClick={onBackToHome}
            className="hover:text-black transition"
          >
            HOME
          </button>
          <span>/</span>
          <button 
            onClick={() => onSelectCategory(article.category)}
            className="text-gray-500 hover:text-black transition"
          >
            {article.categoryName || article.category}
          </button>
        </nav>

        <button
          onClick={() => onSelectCategory(article.category)}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-black hover:text-[#C8102E] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO {article.categoryName ? article.categoryName.toUpperCase() : 'STORIES'}</span>
        </button>
      </div>

      {/* 2. TWO-COLUMN LAYOUT: LEFT SIDEBAR + RIGHT MAIN ARTICLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start pt-2">
        
        {/* LEFT SIDEBAR: LATEST EDITORIAL STORIES (5-6 ARTICLES) - STUCK / FIXED IN PLACE ON SCROLL */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar order-2 lg:order-1 border-t-2 lg:border-t-0 border-black pt-8 lg:pt-0 pr-0 lg:pr-2">
          <div className="border-b-2 border-black pb-2 flex items-center justify-between">
            <h3 className="font-serif text-base sm:text-lg font-bold uppercase tracking-tight text-black">
              Latest Stories
            </h3>
            <span className="text-[9px] font-black tracking-widest text-[#C8102E] uppercase">
              EDITORIAL
            </span>
          </div>

          <div className="divide-y divide-gray-200">
            {latestArticles.map((item) => (
              <article
                key={item.id}
                onClick={() => {
                  onSelectArticle(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3.5 first:pt-0 last:pb-0 group cursor-pointer flex gap-3.5 items-start transition"
              >
                {/* Thumbnail */}
                <div className="w-20 aspect-[4/3] bg-gray-100 overflow-hidden border border-gray-200 group-hover:border-black shrink-0 transition">
                  <img
                    src={item.heroImage || item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#C8102E] block">
                    {item.categoryName || item.category}
                  </span>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-black group-hover:text-[#C8102E] transition leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  <div className="text-[9px] text-gray-500 font-medium flex items-center gap-1.5 pt-0.5">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="text-black font-semibold">{item.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </aside>

        {/* RIGHT MAIN ARTICLE COLUMN */}
        <main className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          
          {/* Header & Meta */}
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8102E] block">
              {article.categoryName || article.category}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#111111] leading-[1.18] tracking-tight">
              {article.title}
            </h1>

            {/* Byline and Meta Info */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-t border-b border-gray-200 text-xs text-black">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectAuthor(author.id)}
                  className="flex items-center gap-2.5 hover:text-[#C8102E] transition text-left group"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 group-hover:border-[#C8102E] transition shrink-0 bg-white">
                    <img 
                      src={author.avatar} 
                      alt={author.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="font-bold text-[11px] uppercase tracking-wider text-black group-hover:text-[#C8102E]">
                    BY {author.name}
                  </span>
                </button>

                <span className="text-gray-300">•</span>
                <span className="text-gray-600 text-[11px]">{article.date}</span>

                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="text-gray-600 text-[11px] hidden sm:inline">{article.readTime}</span>
              </div>

              {/* Save and Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleSave(article.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border transition ${
                    isSaved
                      ? 'bg-[#C8102E] text-white border-[#C8102E]'
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
                >
                  <Bookmark className="w-3 h-3" />
                  <span>{isSaved ? 'SAVED' : 'SAVE'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-gray-300 hover:border-black transition text-black bg-white"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3 h-3" />
                      <span>SHARE</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <figure className="space-y-2">
            <div className="aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={article.heroImage || article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            {article.imageAlt && (
              <figcaption className="text-center font-serif italic text-xs text-gray-500 pt-1">
                {article.imageAlt}
              </figcaption>
            )}
          </figure>

          {/* Main Article Body */}
          <div className="text-[#1a1a1a] text-base sm:text-lg leading-[1.85] font-sans space-y-6 pt-2 [&>p]:leading-[1.85] [&>p]:text-[#1a1a1a] [&>p.lead]:text-xl [&>p.lead]:font-serif [&>p.lead]:leading-relaxed [&>p.lead]:text-[#111111] [&>h3]:font-serif [&>h3]:text-2xl sm:[&>h3]:text-[1.65rem] [&>h3]:font-medium [&>h3]:text-[#111111] [&>h3]:pt-8 [&>h3]:mb-3 [&>h3]:leading-snug [&>blockquote]:my-8 [&>blockquote]:py-4 [&>blockquote]:px-6 [&>blockquote]:border-l-2 [&>blockquote]:border-[#C8102E] [&>blockquote]:bg-[#FAF9F6] [&>blockquote]:font-serif [&>blockquote]:italic [&>blockquote]:text-xl sm:[&>blockquote]:text-2xl [&>blockquote]:text-[#111111] [&>blockquote]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2">
            {article.content && typeof article.content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : Array.isArray(article.content) ? (
              article.content.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  {section.heading && (
                    <h3 className="font-serif text-2xl sm:text-[1.65rem] font-medium text-[#111111] pt-8 mb-3 leading-snug">
                      {section.heading}
                    </h3>
                  )}
                  <p className="text-[#1a1a1a] leading-[1.85] text-base sm:text-lg font-normal">
                    {section.body}
                  </p>
                </div>
              ))
            ) : null}
          </div>

          {/* Editorial Separator */}
          <div className="text-center py-6 text-gray-400 font-serif text-lg tracking-[0.5em]">
            • • •
          </div>

          {/* Author Signature (Clean & Minimalist) */}
          <section className="border-t border-b border-gray-200 py-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300 shrink-0 bg-white">
                <img 
                  src={author.avatar} 
                  alt={author.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-base font-bold text-black">
                    {author.name}
                  </h3>
                  <button
                    onClick={() => onSelectAuthor(author.id)}
                    className="text-[10px] font-bold uppercase tracking-wider text-[#C8102E] hover:underline"
                  >
                    VIEW PROFILE →
                  </button>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {author.role} • {author.location}
                </p>
                <p className="text-xs text-[#222222] leading-relaxed pt-1">
                  {author.bio}
                </p>
              </div>
            </div>
          </section>
        </main>

      </div>

      {/* 3. BOTTOM RELATED STORIES */}
      {relatedArticles.length > 0 && (
        <section className="space-y-6 pt-12 border-t-2 border-black">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase text-black">
              More in {article.categoryName || article.category}
            </h3>
            <button
              onClick={() => onSelectCategory(article.category)}
              className="text-[10px] font-bold uppercase tracking-widest text-[#C8102E] hover:underline"
            >
              EXPLORE ALL →
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <article
                key={rel.id}
                onClick={() => {
                  onSelectArticle(rel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer space-y-3 flex flex-col justify-between border-b border-gray-200 pb-4"
              >
                <div className="space-y-2">
                  <div className="aspect-[16/10] bg-gray-100 overflow-hidden border border-gray-200 group-hover:border-black transition">
                    <img 
                      src={rel.heroImage || rel.image} 
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#C8102E] block">
                    {rel.categoryName || rel.category}
                  </span>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-black group-hover:text-[#C8102E] transition leading-snug line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <div className="text-[10px] font-medium text-gray-600 uppercase tracking-wider flex items-center justify-between pt-1">
                  <span>BY {rel.author}</span>
                  <span className="text-black font-bold">{rel.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
