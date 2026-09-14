import React, { useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, User, Bookmark, Share2, Check, BookOpen, ChevronRight, MapPin } from 'lucide-react';
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
    <article className="max-w-4xl mx-auto space-y-10 animate-fadeIn pb-16">
      
      {/* 1. BREADCRUMBS AND BACK BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 text-xs font-semibold">
        <nav className="flex items-center gap-2 text-gray-500 uppercase tracking-widest text-[10px]">
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
          <span>/</span>
          <span className="text-[#C8102E] font-bold line-clamp-1 max-w-[200px] sm:max-w-xs">
            {article.title.toUpperCase()}
          </span>
        </nav>

        <button
          onClick={() => onSelectCategory(article.category)}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-[#C8102E] transition border border-gray-300 px-3.5 py-1.5 hover:border-black"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO {article.categoryName ? article.categoryName.toUpperCase() : 'STORIES'}</span>
        </button>
      </div>

      {/* 2. ARTICLE HEADER MASTHEAD */}
      <header className="space-y-6 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#FDFBF7] border border-gray-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#C8102E]">
          <span>{article.categoryLabel || article.categoryName || article.category}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-black leading-tight tracking-tight uppercase">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-[#111111] leading-relaxed font-normal">
          {article.excerpt}
        </p>

        {/* Author Byline Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4 border-t border-b border-gray-300 text-xs text-black font-semibold uppercase tracking-wider">
          {/* Author info */}
          <button
            onClick={() => onSelectAuthor(author.id)}
            className="inline-flex items-center gap-2.5 hover:text-[#C8102E] transition group text-left"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-400 group-hover:border-[#C8102E] transition shrink-0 bg-white">
              <img 
                src={author.avatar} 
                alt={author.name}
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-black group-hover:text-[#C8102E] leading-none">
                BY {author.name.toUpperCase()}
              </span>
              <span className="text-[9px] text-gray-700 font-medium lowercase tracking-normal">
                {author.role}
              </span>
            </div>
          </button>

          <span className="text-gray-400 hidden sm:inline">•</span>

          {/* Date */}
          <span className="flex items-center gap-1.5 text-black font-medium text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-gray-700" />
            {article.date}
          </span>

          <span className="text-gray-400 hidden sm:inline">•</span>

          {/* Read time */}
          <span className="flex items-center gap-1.5 text-black font-bold text-[11px]">
            <Clock className="w-3.5 h-3.5 text-[#C8102E]" />
            {article.readTime}
          </span>

          <span className="text-gray-400 hidden sm:inline">•</span>

          {/* Actions */}
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
              className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-gray-300 hover:border-black transition text-black bg-white"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">LINK COPIED</span>
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
      </header>

      {/* 3. HERO IMAGE */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
        <img
          src={article.heroImage || article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        {article.imageAlt && (
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1 text-[9px] uppercase tracking-wider font-semibold">
            {article.imageAlt}
          </div>
        )}
      </div>

      {/* 4. KEY TAKEAWAY CALLOUT */}
      {article.keyTakeaway && (
        <div className="bg-[#FDFBF7] p-6 border-l-4 border-[#C8102E] text-black font-serif italic text-base leading-relaxed shadow-sm">
          <strong className="not-italic uppercase font-sans font-black text-[10px] tracking-widest text-[#C8102E] block mb-1">
            LUMAA HOME™ EDITORIAL PRINCIPLE
          </strong>
          "{article.keyTakeaway}"
        </div>
      )}

      {/* 5. MAIN ARTICLE CONTENT BODY */}
      <div className="prose max-w-none text-[#111111] leading-relaxed space-y-6 font-sans text-base sm:text-lg [&>p]:leading-relaxed [&>p.lead]:text-xl [&>p.lead]:font-serif [&>p.lead]:leading-relaxed [&>p.lead]:text-black [&>h3]:font-serif [&>h3]:text-2xl sm:[&>h3]:text-3xl [&>h3]:font-black [&>h3]:text-black [&>h3]:pt-6 [&>h3]:border-t [&>h3]:border-gray-300 [&>blockquote]:border-l-4 [&>blockquote]:border-black [&>blockquote]:pl-6 [&>blockquote]:py-3 [&>blockquote]:italic [&>blockquote]:font-serif [&>blockquote]:text-xl sm:[&>blockquote]:text-2xl [&>blockquote]:text-black [&>blockquote]:my-8 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2">
        {article.content && typeof article.content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : Array.isArray(article.content) ? (
          article.content.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-black pt-6 border-t border-gray-300">
                {section.heading}
              </h3>
              <p className="font-normal text-[#111111] leading-relaxed text-base sm:text-lg">
                {section.body}
              </p>
            </div>
          ))
        ) : null}
      </div>

      {/* 6. AUTHOR SIGNATURE MASTHEAD CARD */}
      <section className="bg-[#FAFAF8] p-8 border-2 border-gray-300 space-y-4 my-10 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0 bg-white">
              <img 
                src={author.avatar} 
                alt={author.name}
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C8102E] block">
                ABOUT THE AUTHOR
              </span>
              <h3 className="font-serif text-xl font-black text-black">
                {author.name}
              </h3>
              <p className="text-xs text-black font-semibold">
                {author.role} • {author.location}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectAuthor(author.id)}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C8102E] transition shrink-0"
          >
            <span>VIEW FULL AUTHOR PROFILE</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-sm text-[#111111] font-normal leading-relaxed pt-3 border-t border-gray-200">
          {author.bio}
        </p>
      </section>

      {/* 7. RELATED EDITORIAL STORIES */}
      {relatedArticles.length > 0 && (
        <section className="space-y-6 pt-10 border-t-2 border-black">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold uppercase text-black flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C8102E]" />
              MORE IN {article.categoryName ? article.categoryName.toUpperCase() : 'THIS SECTION'}
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
                onClick={() => onSelectArticle(rel)}
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
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#C8102E] block">
                    {rel.categoryName || rel.category}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-black group-hover:text-[#C8102E] transition leading-snug line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between pt-1">
                  <span>BY {rel.author}</span>
                  <span className="text-black">{rel.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

    </article>
  );
}
