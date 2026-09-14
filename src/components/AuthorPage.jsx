import React, { useEffect } from 'react';
import { AUTHORS, getAuthorById } from '../data/authors';
import { ArrowLeft, MapPin, Globe, Award, Sparkles, ChevronRight, ExternalLink } from 'lucide-react';

export default function AuthorPage({ 
  authorId, 
  articles = [], 
  onSelectArticle, 
  onSelectAuthor, 
  onBackToHome 
}) {
  const author = getAuthorById(authorId);
  
  // Dynamic SEO Meta Description (Injected into HTML head without rendering visibly in page body)
  useEffect(() => {
    if (author && author.metaDescription) {
      document.title = `${author.name} | Editorial Masthead | LUMAA HOME`;
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = author.metaDescription;
    }
  }, [author]);

  // Filter articles written by this author
  const authorArticles = articles.filter(
    (a) => (a.authorId === author.id) || (a.author && a.author.toLowerCase() === author.name.toLowerCase())
  );

  // Other 2 master editors to explore
  const otherAuthors = AUTHORS.filter((a) => a.id !== author.id);

  return (
    <div className="space-y-10 animate-fadeIn pb-12">
      
      {/* 1. BREADCRUMBS AND BACK BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 text-xs font-semibold">
        <nav className="flex items-center gap-2 text-gray-500 uppercase tracking-widest text-[10px]">
          <a 
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                onBackToHome();
              }
            }}
            className="hover:text-black transition cursor-pointer"
          >
            HOME
          </a>
          <span>/</span>
          <span className="text-gray-400">MASTHEAD EDITORS</span>
          <span>/</span>
          <span className="text-[#C8102E] font-bold">{author.name.toUpperCase()}</span>
        </nav>

        <a
          href="/"
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey) {
              e.preventDefault();
              onBackToHome();
            }
          }}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-[#C8102E] transition border border-gray-300 px-3.5 py-1.5 hover:border-black cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO MAGAZINE</span>
        </a>
      </div>

      {/* 2. COMPACT AUTHOR MASTHEAD */}
      <section className="relative bg-[#FAFAF8] border border-gray-200 overflow-hidden shadow-sm">
        {/* Top Decorative Cover Ribbon */}
        <div className="h-32 sm:h-40 w-full relative overflow-hidden bg-gray-900">
          <img 
            src={author.coverImage} 
            alt={author.name}
            className="w-full h-full object-cover opacity-60 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF8] via-transparent to-black/40"></div>
          
          <div className="absolute top-3 right-4 bg-white/90 backdrop-blur-sm border border-gray-300 px-3 py-1 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-black">
            <Award className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>LUMAA HOME™ MASTHEAD</span>
          </div>
        </div>

        {/* Profile Content Details */}
        <div className="px-6 sm:px-10 pb-8 relative -mt-14 sm:-mt-16">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* Author Portrait Avatar */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-none border-4 border-white shadow-xl overflow-hidden bg-white">
                <img 
                  src={author.avatar} 
                  alt={author.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-black text-white p-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
              </div>
            </div>

            {/* Author Title and Meta Information */}
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#C8102E] bg-red-50 border border-red-200 px-2 py-0.5">
                  EDITORIAL CONTRIBUTOR
                </span>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 tracking-wider uppercase">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  {author.location}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
                {author.name}
              </h1>

              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-black">
                {author.role}
              </p>

              {/* Short Summary */}
              {author.shortDescription && (
                <p className="text-sm sm:text-base text-[#111111] font-serif leading-relaxed max-w-2xl pt-0.5">
                  {author.shortDescription}
                </p>
              )}

              {/* Specialisation Tags */}
              {author.specialties && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1.5">
                  {author.specialties.map((spec, i) => (
                    <span 
                      key={i}
                      className="bg-white border border-gray-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 text-black shadow-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Links */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-bold text-black">
                <a 
                  href={author.socials.instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 hover:text-black transition"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
                <span>•</span>
                <a 
                  href={author.socials.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 hover:text-black transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Quick Stats Box */}
            <div className="w-full md:w-52 bg-white p-4 border border-gray-200 space-y-2 shrink-0 text-center md:text-left">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block border-b border-gray-100 pb-1">
                EDITORIAL CONTRIBUTIONS
              </span>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="font-serif text-3xl font-black text-black">
                  {authorArticles.length}
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Stories
                </span>
              </div>
              <div className="text-[10px] text-gray-500 space-y-0.5">
                <div>Tenure: <span className="font-bold text-black">{author.publishedYear}</span></div>
                <div>Status: <span className="font-bold text-black">Senior Masthead</span></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PUBLISHED ARTICLES BY THIS AUTHOR */}
      <section className="space-y-6 pt-4 border-t border-black">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-black uppercase">
              Articles by {author.name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Curated editorial stories, masterclasses, and architectural reviews.
            </p>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {authorArticles.length} STORIES IN ARCHIVE
          </span>
        </div>

        {authorArticles.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 p-12 text-center space-y-2">
            <p className="text-sm font-serif text-gray-600">No articles currently published in this section.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {authorArticles.map((art) => (
              <article
                key={art.id}
                className="flex flex-col justify-between border-b border-gray-200 pb-6 transition"
              >
                <a
                  href={`/${art.slug}`}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      onSelectArticle(art);
                    }
                  }}
                  className="space-y-3 group cursor-pointer block"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                      src={art.heroImage || art.image}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                      {art.categoryName || art.category}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span className="text-[#C8102E]">{art.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg font-bold text-black group-hover:text-[#C8102E] transition leading-snug line-clamp-2">
                    {art.title}
                  </h3>
                </a>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 4. OTHER EDITORIAL TEAM MEMBERS */}
      <section className="bg-[#FDFBF7] p-8 border border-gray-200 space-y-6 text-center mt-12">
        <div className="space-y-1 max-w-xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C8102E] block">
            THE LUMAA HOME™ MASTHEAD
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-black uppercase">
            Meet Our Other Masthead Editors
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 max-w-2xl mx-auto gap-6 pt-2">
          {otherAuthors.map((other) => (
            <a
              key={other.id}
              href={`/author/${other.id}`}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  onSelectAuthor(other.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="bg-white p-5 border border-gray-200 hover:border-black transition text-center group flex flex-col items-center space-y-3 shadow-sm cursor-pointer block"
            >
              <div className="w-20 h-20 rounded-none border-2 border-gray-200 group-hover:border-[#C8102E] transition overflow-hidden">
                <img 
                  src={other.avatar} 
                  alt={other.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
                />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-black group-hover:text-[#C8102E] transition">
                  {other.name}
                </h4>
                <p className="text-[10px] text-gray-500 uppercase font-semibold line-clamp-1 mt-0.5">
                  {other.role}
                </p>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-black group-hover:text-[#C8102E] underline">
                VIEW PROFILE →
              </span>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
