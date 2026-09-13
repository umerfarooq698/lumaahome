import React from 'react';
import { X, Bookmark, Share2, Clock, Calendar, User } from 'lucide-react';

export default function ArticleModal({ article, onClose, isSaved, onToggleSave }) {
  if (!article) return null;

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
          
          {/* Category & Title */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
              {article.category} • {article.location.toUpperCase()}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-black text-black leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Meta Byline */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-t border-b border-gray-200 text-xs text-gray-500 font-medium uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <span className="font-bold text-black flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C8102E]" />
                BY {article.author}
              </span>
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

            {/* Bookmark & Share Buttons */}
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
              src={article.heroImage}
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

          {/* Article HTML Body */}
          <div
            className="prose max-w-none text-xs sm:text-sm text-gray-800 leading-relaxed space-y-4 font-sans [&>h3]:font-serif [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-black [&>h3]:mt-6 [&>blockquote]:border-l-2 [&>blockquote]:border-black [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Author Signature & Share Footer */}
          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-serif font-bold text-base text-black">{article.author}</div>
              <div className="text-xs text-gray-500">{article.role} • Lumaa Home Editorial Desk</div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleSave(article.id)}
                className="bg-black text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#C8102E] transition"
              >
                {isSaved ? 'SAVED IN BOOKMARKS' : 'BOOKMARK ARTICLE'}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-200 text-black px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-300 transition"
              >
                CLOSE
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
