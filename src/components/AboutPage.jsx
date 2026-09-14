import React from 'react';
import { ChevronRight, Award, Compass, Sparkles, BookOpen, Hammer } from 'lucide-react';
import { AUTHORS } from '../data/authors';

export default function AboutPage({ onBackToHome, onSelectAuthor }) {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-16">
      
      {/* 1. BREADCRUMBS AND NAVIGATION */}
      <div className="space-y-4 border-b-2 border-black pb-6">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
          <div className="flex items-center gap-2">
            <button 
              onClick={onBackToHome} 
              className="hover:text-black transition"
            >
              HOME
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#C8102E] font-black">ABOUT US</span>
          </div>

          <button
            onClick={onBackToHome}
            className="text-[10px] font-black uppercase tracking-wider text-black hover:text-[#C8102E] transition flex items-center gap-1"
          >
            ← BACK TO HOME
          </button>
        </div>

        {/* Header Title */}
        <div className="pt-2">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8102E] block mb-2">
            THE EDITORIAL MASTHEAD
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-black tracking-tight uppercase">
            About LUMAA HOME™
          </h1>
          <p className="font-serif italic text-black text-base sm:text-lg mt-2 font-medium">
            The independent British journal dedicated to period architecture, bespoke joinery, and refined DIY living.
          </p>
        </div>
      </div>

      {/* 2. EDITORIAL MISSION STATEMENT */}
      <section className="bg-[#FBFBFA] border-2 border-gray-300 p-6 sm:p-10 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black">
          <Compass className="w-4 h-4 text-[#C8102E]" />
          <span>Our Editorial Philosophy</span>
        </div>

        <p className="text-base sm:text-lg text-[#111111] leading-relaxed font-normal">
          Founded with a passion for historic British architecture and artisan craftsmanship, LUMAA HOME™ serves homeowners, period property custodians, and passionate decorators seeking enduring interior beauty.
        </p>

        <p className="text-sm sm:text-base text-[#111111] leading-relaxed font-normal">
          We explore the delicate intersection between heritage restoration and contemporary utility. From Grade II listed Georgian townhouses in London to rustic limestone cottages in the Cotswolds, our writers document the materials, proportions, and techniques that make a home truly timeless.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C8102E] block">
              01 • HERITAGE
            </span>
            <h4 className="font-serif text-base font-bold text-black">
              Period Authenticity
            </h4>
            <p className="text-xs text-black leading-relaxed font-normal">
              Respecting original lime plasters, sash windows, and heritage timber framing.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C8102E] block">
              02 • CRAFTSMANSHIP
            </span>
            <h4 className="font-serif text-base font-bold text-black">
              Bespoke Joinery
            </h4>
            <p className="text-xs text-black leading-relaxed font-normal">
              Collaborating directly with British timber workshops, joiners, and stone masons.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C8102E] block">
              03 • MASTERY
            </span>
            <h4 className="font-serif text-base font-bold text-black">
              Actionable DIY
            </h4>
            <p className="text-xs text-black leading-relaxed font-normal">
              Step-by-step masterclasses empowering homeowners with practical skills.
            </p>
          </div>
        </div>
      </section>

      {/* 3. MASTHEAD EDITORS SECTION */}
      <section className="space-y-8 pt-4">
        <div className="border-b-2 border-black pb-2 flex items-center justify-between">
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
            Our Resident Editors
          </h2>
          <span className="text-[10px] font-black text-black tracking-widest uppercase">
            {AUTHORS.length} MASTHEAD EDITORS
          </span>
        </div>

        <div className="grid gap-8">
          {AUTHORS.map((author) => (
            <article
              key={author.id}
              onClick={() => onSelectAuthor(author.id)}
              className="group cursor-pointer bg-white border-2 border-gray-300 p-6 sm:p-8 hover:border-black transition flex flex-col sm:flex-row gap-6 items-start shadow-sm"
            >
              {/* Avatar Portrait */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-none overflow-hidden border-2 border-black shrink-0 bg-gray-100">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Bio Details */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C8102E] bg-red-50 border border-red-200 px-2 py-0.5">
                    EDITORIAL CONTRIBUTOR
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-[10px] font-bold text-black uppercase">
                    {author.location}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-black text-black group-hover:text-[#C8102E] transition">
                  {author.name}
                </h3>

                <p className="text-xs font-bold uppercase tracking-wider text-black">
                  {author.role}
                </p>

                <p className="text-sm text-[#111111] leading-relaxed font-normal pt-1">
                  {author.shortDescription || author.bio}
                </p>

                {/* Specialties */}
                {author.specialties && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {author.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 border border-gray-300 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 text-black"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C8102E] group-hover:underline inline-flex items-center gap-1">
                    VIEW ARTICLES BY {author.name.toUpperCase()} →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
