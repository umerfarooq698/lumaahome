import React from 'react';
import { AUTHORS, getAuthorById } from '../data/authors';
import { ArrowLeft, MapPin, Mail, Globe, Award, BookOpen, Sparkles, ChevronRight, ExternalLink } from 'lucide-react';

export default function AuthorPage({ 
  authorId, 
  articles = [], 
  onSelectArticle, 
  onSelectAuthor, 
  onBackToHome 
}) {
  const author = getAuthorById(authorId);
  
  // Filter articles written by this author
  const authorArticles = articles.filter(
    (a) => (a.authorId === author.id) || (a.author && a.author.toLowerCase() === author.name.toLowerCase())
  );

  // Other editors to explore
  const otherAuthors = AUTHORS.filter((a) => a.id !== author.id);

  return (
    <div className="space-y-12 animate-fadeIn pb-12">
      
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
          <span className="text-gray-400">MASTHEAD EDITORS</span>
          <span>/</span>
          <span className="text-[#C8102E] font-bold">{author.name.toUpperCase()}</span>
        </nav>

        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-[#C8102E] transition border border-gray-300 px-3.5 py-1.5 hover:border-black"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO MAGAZINE</span>
        </button>
      </div>

      {/* 2. AUTHOR LUXURY HERO MASTHEAD */}
      <section className="relative bg-[#FAFAF8] border border-gray-200 overflow-hidden shadow-sm">
        {/* Top Decorative Cover Ribbon */}
        <div className="h-40 sm:h-52 w-full relative overflow-hidden bg-gray-900">
          <img 
            src={author.coverImage} 
            alt={author.name}
            className="w-full h-full object-cover opacity-60 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF8] via-transparent to-black/40"></div>
          
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-300 px-3 py-1 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-black">
            <Award className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>LUMAA HOME™ MASTHEAD</span>
          </div>
        </div>

        {/* Profile Content Details */}
        <div className="px-6 sm:px-12 pb-10 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Author Portrait Avatar */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-none border-4 border-white shadow-xl overflow-hidden bg-white">
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
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8102E] bg-red-50 border border-red-200 px-2.5 py-0.5">
                  EDITORIAL CONTRIBUTOR
                </span>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 tracking-wider uppercase">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  {author.location}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-black text-black tracking-tight uppercase">
                {author.name}
              </h1>

              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-700">
                {author.role}
              </p>

              {/* Social and Contact Links */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-semibold text-gray-600">
                <a 
                  href={`mailto:${author.socials.email}`} 
                  className="inline-flex items-center gap-1.5 hover:text-black hover:underline transition"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C8102E]" />
                  <span>{author.socials.email}</span>
                </a>
                <span>•</span>
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
            <div className="w-full md:w-56 bg-white p-5 border border-gray-200 space-y-3 shrink-0 text-center md:text-left">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block border-b border-gray-100 pb-1.5">
                EDITORIAL CONTRIBUTIONS
              </span>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="font-serif text-3xl font-black text-black">
                  {authorArticles.length}
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Published Stories
                </span>
              </div>
              <div className="text-[10px] text-gray-500 space-y-1">
                <div>Tenure: <span className="font-bold text-black">{author.publishedYear}</span></div>
                <div>Focus: <span className="font-bold text-black">{author.specialties[0]}</span></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. BIOGRAPHY, PHILOSOPHY AND SPECIALTIES */}
      <section className="grid lg:grid-cols-3 gap-10">
        
        {/* Left 2 Cols: Biography & Design Mantra */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pull Quote */}
          <div className="border-l-2 border-[#C8102E] pl-6 py-2 bg-[#FDFBF7]">
            <p className="font-serif text-lg sm:text-xl italic text-gray-800 leading-relaxed">
              "{author.quote}"
            </p>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 block mt-2">
              — {author.name} on British Interior Design
            </span>
          </div>

          {/* Full Bio Paragraphs */}
          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
            {author.fullBio.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

        </div>

        {/* Right 1 Col: Areas of Expertise */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-black border-b border-gray-200 pb-2 flex items-center justify-between">
              <span>AREAS OF SPECIALISATION</span>
              <BookOpen className="w-3.5 h-3.5 text-[#C8102E]" />
            </h3>

            <div className="flex flex-wrap gap-2">
              {author.specialties.map((spec, i) => (
                <span 
                  key={i}
                  className="bg-gray-100 hover:bg-gray-200 transition text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 text-gray-800 border border-gray-200"
                >
                  {spec}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-500 leading-relaxed">
              For direct commission inquiries, period architectural consulting, or editorial press requests, reach out via our London office.
            </div>
          </div>
        </div>

      </section>

      {/* 4. PUBLISHED ARTICLES BY THIS AUTHOR */}
      <section className="space-y-6 pt-6 border-t border-black">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-black uppercase">
              Articles by {author.name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Explore the curated portfolio of essays, masterclasses, and architectural reviews.
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
                onClick={() => onSelectArticle(art)}
                className="group cursor-pointer flex flex-col justify-between border-b border-gray-200 pb-6 transition"
              >
                <div className="space-y-3">
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

                  {/* Excerpt */}
                  <p className="text-xs text-gray-600 line-clamp-2 font-light leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-black group-hover:text-[#C8102E]">
                  <span>READ STORY</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 5. EXPLORE OTHER EDITORIAL TEAM MEMBERS */}
      <section className="bg-[#FDFBF7] p-8 border border-gray-200 space-y-6 text-center mt-12">
        <div className="space-y-1 max-w-xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C8102E] block">
            THE LUMAA HOME™ MASTHEAD
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-black uppercase">
            Meet Our Editorial Team
          </h3>
          <p className="text-xs text-gray-500">
            Our London and Edinburgh team of architectural historians, joinery specialists, and interior stylists.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
          {otherAuthors.map((other) => (
            <button
              key={other.id}
              onClick={() => {
                onSelectAuthor(other.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white p-4 border border-gray-200 hover:border-black transition text-center group flex flex-col items-center space-y-2.5 shadow-sm"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-[#C8102E] transition">
                <img 
                  src={other.avatar} 
                  alt={other.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition"
                />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-black group-hover:text-[#C8102E] transition">
                  {other.name}
                </h4>
                <p className="text-[9px] text-gray-500 uppercase font-semibold line-clamp-1 mt-0.5">
                  {other.role}
                </p>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-black">
                VIEW PROFILE →
              </span>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
