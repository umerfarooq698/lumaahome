import React, { useState, useEffect } from 'react';
import { ARTICLES } from '../data/articles';
import { ArrowLeft, Rss, Copy, Check, ExternalLink, Calendar, User, Tag, BookOpen } from 'lucide-react';
import { updatePageSeo } from '../utils/seo';

export default function RSSPage({ onBackToHome, onSelectArticle, onNavigatePage }) {
  const [copied, setCopied] = useState(false);
  const rssFeedUrl = 'https://www.lumaahome.co.uk/rss.xml';

  useEffect(() => {
    updatePageSeo({
      title: 'Official RSS 2.0 Editorial Feed | LUMAA HOME™',
      description: 'Subscribe to the official LUMAA HOME™ RSS 2.0 feed for real-time syndication of luxury British interior design guides, period restoration case studies, and joinery articles.',
      keywords: 'lumaa home rss feed, xml syndication, interior design rss, period architecture newsfeed',
      canonicalPath: '/rss',
      ogType: 'website'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(rssFeedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in">
      {/* Top Breadcrumbs & Back Button */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black hover:text-[#C8102E] transition group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>BACK TO MAGAZINE</span>
        </button>

        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); onBackToHome(); }} 
            className="hover:text-black transition"
          >
            HOME
          </a>
          <span>/</span>
          <span className="text-[#C8102E]">RSS FEED</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#C8102E] bg-red-50 border border-red-100 px-3 py-1 mb-3">
          <Rss className="w-3.5 h-3.5" />
          <span>SYNDICATION & NEWSFEED</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-black uppercase mb-3">
          Lumaa Home™ RSS Feed
        </h1>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
          Instant syndication for British luxury interior design, heritage architecture restoration, and bespoke DIY woodworking guides.
        </p>
      </div>

      {/* Primary RSS Feed Card */}
      <div className="bg-black text-white p-6 sm:p-8 mb-12 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C8102E] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse"></span>
              OFFICIAL RSS 2.0 ENDPOINT
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold">
              Subscribe via Your Favorite Feed Reader
            </h2>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              Add our XML endpoint to Feedly, Apple News, Flipboard, Inoreader, or NetNewsWire to receive automated updates whenever new editorial articles are published.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-red-700 text-white px-5 py-3 text-xs font-bold uppercase tracking-widest transition shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>COPIED TO CLIPBOARD!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY RSS FEED URL</span>
                </>
              )}
            </button>

            <a
              href={rssFeedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-3 text-xs font-bold uppercase tracking-widest transition border border-zinc-700"
            >
              <ExternalLink className="w-4 h-4" />
              <span>VIEW RAW RSS.XML</span>
            </a>
          </div>
        </div>

        {/* URL Box */}
        <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 shrink-0">Feed URL:</span>
          <code className="bg-zinc-900 text-red-400 px-3 py-1.5 text-xs font-mono select-all overflow-x-auto block w-full border border-zinc-800">
            {rssFeedUrl}
          </code>
        </div>
      </div>

      {/* How to use RSS & Reader compatibility */}
      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        <div className="border border-gray-200 p-5 bg-gray-50/50">
          <h3 className="font-bold text-xs uppercase tracking-widest text-black mb-2 flex items-center gap-2">
            <span className="w-5 h-5 bg-black text-white text-[10px] font-mono flex items-center justify-center">1</span>
            Copy Endpoint
          </h3>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Copy the official feed URL: <br />
            <strong className="text-black font-mono text-[10px]">https://www.lumaahome.co.uk/rss.xml</strong>
          </p>
        </div>

        <div className="border border-gray-200 p-5 bg-gray-50/50">
          <h3 className="font-bold text-xs uppercase tracking-widest text-black mb-2 flex items-center gap-2">
            <span className="w-5 h-5 bg-black text-white text-[10px] font-mono flex items-center justify-center">2</span>
            Add to RSS Reader
          </h3>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Paste the URL into Feedly, Inoreader, NetNewsWire, Flipboard, or browser extensions.
          </p>
        </div>

        <div className="border border-gray-200 p-5 bg-gray-50/50">
          <h3 className="font-bold text-xs uppercase tracking-widest text-black mb-2 flex items-center gap-2">
            <span className="w-5 h-5 bg-black text-white text-[10px] font-mono flex items-center justify-center">3</span>
            Daily Editorial Sync
          </h3>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Receive automated notifications and full articles 3 times daily (09:00 AM, 03:00 PM, 09:00 PM).
          </p>
        </div>
      </div>

      {/* Live Feed Stream Preview */}
      <div>
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#C8102E]" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-black">
              Live Feed Stream ({ARTICLES.length} Stories)
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Auto-Updated Daily
          </span>
        </div>

        <div className="space-y-4">
          {ARTICLES.map((article) => (
            <article 
              key={article.id} 
              className="p-5 border border-gray-200 hover:border-black transition bg-white group flex flex-col md:flex-row md:items-start gap-4"
            >
              {article.heroImage && (
                <img 
                  src={article.heroImage} 
                  alt={article.title} 
                  className="w-full md:w-40 h-28 object-cover shrink-0 border border-gray-100"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                  <span className="text-[#C8102E] flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {article.categoryName || article.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    {article.date || 'Editorial'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-gray-400" />
                    {article.author}
                  </span>
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-black group-hover:text-[#C8102E] transition leading-snug">
                  <a
                    href={`/${article.slug || article.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onSelectArticle) onSelectArticle(article);
                    }}
                  >
                    {article.title}
                  </a>
                </h3>

                <p className="text-xs text-gray-600 font-normal leading-relaxed mt-1 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <a
                    href={`/${article.slug || article.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onSelectArticle) onSelectArticle(article);
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest text-black group-hover:text-[#C8102E] transition inline-flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <span>→</span>
                  </a>

                  <span className="text-[10px] font-mono text-gray-400">
                    GUID: https://www.lumaahome.co.uk/{article.slug || article.id}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
