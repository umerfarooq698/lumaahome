import React, { useState, useEffect } from 'react';
import { ChevronRight, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';
import { INITIAL_PRIVACY_POLICY, INITIAL_TERMS_OF_SERVICE } from '../data/legal';

export default function LegalPage({ type = 'privacy-policy', onBackToHome, onNavigateLegal }) {
  const isPrivacy = type === 'privacy-policy' || type === 'privacy';
  const initialData = isPrivacy ? INITIAL_PRIVACY_POLICY : INITIAL_TERMS_OF_SERVICE;

  const [data, setData] = useState(initialData);

  // Synchronize when type prop changes
  useEffect(() => {
    setData(isPrivacy ? INITIAL_PRIVACY_POLICY : INITIAL_TERMS_OF_SERVICE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type, isPrivacy]);

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
            <span className="text-gray-400">LEGAL AND COMPLIANCE</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#C8102E] font-black">{data.title.toUpperCase()}</span>
          </div>

          <button
            onClick={onBackToHome}
            className="text-[10px] font-black uppercase tracking-wider text-black hover:text-[#C8102E] transition flex items-center gap-1"
          >
            ← BACK TO HOME
          </button>
        </div>

        {/* Header Title and Badges */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8102E] block">
                OFFICIAL LEGAL DOCUMENT
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                LONDON, UK
              </span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-black tracking-tight uppercase">
              {data.title}
            </h1>
            
            <p className="font-serif italic text-black text-sm sm:text-base mt-2 font-medium">
              {data.subtitle}
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-2 border-2 border-black p-1 bg-white shrink-0">
            <button
              onClick={() => onNavigateLegal('privacy-policy')}
              className={`px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${
                isPrivacy 
                  ? 'bg-black text-white' 
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigateLegal('terms-of-service')}
              className={`px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${
                !isPrivacy 
                  ? 'bg-black text-white' 
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              Terms of Service
            </button>
          </div>
        </div>

        {/* Metadata Meta Strip */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-800 pt-3 border-t border-gray-200 font-mono">
          <span>PUBLISHED BY: <strong className="text-black">LUMAA HOME™ DIGITAL MEDIA GROUP</strong></span>
          <span>•</span>
          <span>LAST UPDATED: <strong className="text-black">{data.lastUpdated.toUpperCase()}</strong></span>
          <span>•</span>
          <span>JURISDICTION: <strong className="text-black">ENGLAND AND WALES</strong></span>
        </div>
      </div>

      {/* 2. COMPLIANCE ASSURANCE BANNER */}
      <div className="bg-[#FBFBFA] border-2 border-gray-300 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black">
          {isPrivacy ? <ShieldCheck className="w-4 h-4 text-[#C8102E]" /> : <Scale className="w-4 h-4 text-[#C8102E]" />}
          <span>{isPrivacy ? 'Google AdSense and UK GDPR Assurance' : 'Editorial and DIY Safety Governance'}</span>
        </div>
        
        <p className="text-sm sm:text-base text-[#111111] leading-relaxed font-normal">
          {data.introduction}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] uppercase font-bold tracking-wider text-black">
          <div className="flex items-center gap-2 bg-white p-3 border border-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Google AdSense Compliant</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-3 border border-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>UK GDPR and Data Act 2018</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-3 border border-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>English Law Governed</span>
          </div>
        </div>
      </div>

      {/* 3. LEGAL SECTIONS BODY */}
      <div className="space-y-10 divide-y divide-gray-200">
        {data.sections.map((section, idx) => (
          <section
            key={section.id || idx}
            id={section.id || `sec-${idx}`}
            className="pt-8 space-y-4 scroll-mt-24"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-black tracking-tight">
              {section.heading}
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#111111] leading-relaxed font-normal">
              {section.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="whitespace-pre-line text-[#111111]">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 4. LEGAL INQUIRY FOOTNOTE */}
      <div className="text-center text-xs text-black space-y-2 pt-10 border-t-2 border-black">
        <p className="font-medium">
          For formal legal notices or Data Subject Access Requests (DSAR), please email{' '}
          <a href={`mailto:${data.contactEmail}`} className="text-black font-bold underline hover:text-[#C8102E]">
            {data.contactEmail}
          </a>.
        </p>
        <p className="text-[10px] text-gray-700 font-mono font-semibold">
          LUMAA HOME™ DIGITAL MEDIA GROUP • REGISTERED IN ENGLAND AND WALES
        </p>
      </div>

    </div>
  );
}
