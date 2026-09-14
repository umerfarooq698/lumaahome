import React from 'react';
import { X, Bookmark, Clock, Calendar, User, ExternalLink, ArrowRight } from 'lucide-react';
import { getAuthorById } from '../data/authors';

export default function ArticleModal({ 
  article, 
  onClose, 
  isSaved, 
  onToggleSave,
  onSelectAuthor 
}) {
  if (!article) return null;

  const author = getAuthorById(article.authorId || article.author);

  const handleAuthorClick = () => {
    onClose();
    if (onSelectAuthor) {
      onSelectAuthor(author.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border-t-8 border-t-[#C8102E] my-auto">
        
        {/* Close Button Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-200 flex items-center justify-between z-20">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8102E]">
            LUMAA HOME™ EXCLUSIVE FEATURE
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-gray-100 px-3 py-1.5 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Modal Article Content */}
        <div className="p-6 sm:p-10 space-y-6">
          
          {/* Category and Title */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
              {article.categoryName || article.category} • {article.location ? article.location.toUpperCase() : 'UK EDITION'}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-black text-black leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Meta Byline with Clickable Author */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-t border-b border-gray-200 text-xs text-gray-500 font-medium uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAuthorClick}
                className="font-bold text-black hover:text-[#C8102E] transition flex items-center gap-1.5 underline decoration-gray-300 hover:decoration-[#C8102E]"
              >
                <User className="w-3.5 h-3.5 text-[#C8102E]" />
                BY {article.author}
              </button>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-black font-bold">
                <Clock className="w-3.5 h-3.5 text-[#C8102E]" />
                {article.readTime}
              </span>
            </div>

            {/* Bookmark Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleSave(article.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition ${
                  isSaved
                    ? 'bg-[#C8102E] text-white border-[#C8102E]'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? 'SAVED' : 'SAVE STORY'}</span>
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="aspect-[16/9] overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={article.heroImage || article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Key Takeaway Box */}
          {article.keyTakeaway && (
            <div className="bg-[#FDFBF7] p-5 border-l-4 border-[#C8102E] text-xs leading-relaxed text-black font-serif italic text-sm">
              <strong className="not-italic uppercase font-sans font-bold text-[10px] tracking-widest text-[#C8102E] block mb-1">
                Editorial Note
              </strong>
              "{article.keyTakeaway}"
            </div>
          )}

          {/* Article HTML Body or JSON sections */}
          {article.content && typeof article.content === 'string' ? (
            <div
              className="prose max-w-none text-xs sm:text-sm text-gray-800 leading-relaxed space-y-4 font-sans [&>h3]:font-serif [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-black [&>h3]:mt-6 [&>blockquote]:border-l-2 [&>blockquote]:border-black [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : Array.isArray(article.content) ? (
            <div className="space-y-6 text-xs sm:text-sm text-gray-800 leading-relaxed font-sans">
              {article.content.map((sec, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-black">{sec.heading}</h3>
                  <p className="font-light text-gray-700">{sec.body}</p>
                </div>
              ))}
            </div>
          ) : null}

          {/* Rich Author Signature Card */}
          <div className="pt-8 border-t border-gray-200 bg-[#FAFAF8] p-6 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-white">
                <img 
                  src={author.avatar} 
                  alt={author.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <button
                  onClick={handleAuthorClick}
                  className="font-serif font-bold text-base text-black hover:text-[#C8102E] transition flex items-center gap-1 text-left"
                >
                  <span>{author.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <div className="text-xs text-gray-500 font-medium">{author.role}</div>
                <div className="text-[10px] text-[#C8102E] uppercase font-bold tracking-wider mt-0.5">{author.location}</div>
              </div>
            </div>

            <button
              onClick={handleAuthorClick}
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C8102E] transition shrink-0"
            >
              <span>VIEW FULL PROFILE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
