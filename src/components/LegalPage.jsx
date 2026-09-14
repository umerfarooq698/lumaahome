import React, { useState, useEffect } from 'react';
import { ChevronRight, ShieldCheck, Scale, Sparkles, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { INITIAL_PRIVACY_POLICY, INITIAL_TERMS_OF_SERVICE } from '../data/legal';
import { generateLegalContentWithGemini } from '../services/gemini';

export default function LegalPage({ type = 'privacy-policy', onBackToHome, onNavigateLegal }) {
  const isPrivacy = type === 'privacy-policy' || type === 'privacy';
  const initialData = isPrivacy ? INITIAL_PRIVACY_POLICY : INITIAL_TERMS_OF_SERVICE;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Synchronize when type prop changes
  useEffect(() => {
    setData(isPrivacy ? INITIAL_PRIVACY_POLICY : INITIAL_TERMS_OF_SERVICE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type, isPrivacy]);

  const handleRegenerateWithGemini = async () => {
    setLoading(true);
    try {
      const generated = await generateLegalContentWithGemini(isPrivacy ? 'privacy' : 'terms');
      if (generated && generated.sections && generated.sections.length > 0) {
        setData(generated);
      }
    } catch (err) {
      console.error('Failed to regenerate legal document with Gemini:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-16">
      
      {/* 1. BREADCRUMBS & NAVIGATION */}
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

        {/* Header Title & Badges */}
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
            
            <p className="font-serif italic text-gray-600 text-sm sm:text-base mt-2">
              {data.subtitle}
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-2 border border-black p-1 bg-white shrink-0">
            <button
              onClick={() => onNavigateLegal('privacy-policy')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${
                isPrivacy 
                  ? 'bg-black text-white' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigateLegal('terms-of-service')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${
                !isPrivacy 
                  ? 'bg-black text-white' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Terms of Service
            </button>
          </div>
        </div>

        {/* Metadata Meta Strip */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 pt-3 border-t border-gray-100 font-mono">
          <span>PUBLISHED BY: <strong className="text-black">LUMAA HOME™ DIGITAL MEDIA GROUP</strong></span>
          <span>•</span>
          <span>LAST UPDATED: <strong className="text-black">{data.lastUpdated.toUpperCase()}</strong></span>
          <span>•</span>
          <span>JURISDICTION: <strong className="text-black">ENGLAND AND WALES</strong></span>
        </div>
      </div>

      {/* 2. COMPLIANCE ASSURANCE BANNER */}
      <div className="bg-gray-50 border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black">
          {isPrivacy ? <ShieldCheck className="w-4 h-4 text-[#C8102E]" /> : <Scale className="w-4 h-4 text-[#C8102E]" />}
          <span>{isPrivacy ? 'Google AdSense and UK GDPR Assurance' : 'Editorial and DIY Safety Governance'}</span>
        </div>
        
        <p className="text-xs text-gray-600 leading-relaxed font-light">
          {data.introduction}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[10px] uppercase font-bold tracking-wider text-gray-700">
          <div className="flex items-center gap-2 bg-white p-2.5 border border-gray-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Google AdSense Compliant</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2.5 border border-gray-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>UK GDPR and Data Act 2018</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2.5 border border-gray-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>English Law Governed</span>
          </div>
        </div>
      </div>

      {/* 3. LEGAL SECTIONS BODY */}
      <div className="space-y-10 divide-y divide-gray-100">
        {data.sections.map((section, idx) => (
          <section
            key={section.id || idx}
            id={section.id || `sec-${idx}`}
            className="pt-8 space-y-4 scroll-mt-24"
          >
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black tracking-tight">
              {section.heading}
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
              {section.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 5. GEMINI AI COMPLIANCE REFRESH TOOL */}
      <div className="border-t-2 border-black pt-8 mt-12 bg-white p-6 border space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8102E]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-black">
                Gemini AI Compliance Engine
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Refresh and audit this legal policy with Google's latest AdSense and UK regulatory standards via Gemini 2.5.
            </p>
          </div>

          <button
            onClick={handleRegenerateWithGemini}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C8102E] transition disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'ANALYZING WITH GEMINI...' : 'REFRESH VIA GEMINI AI'}
          </button>
        </div>
      </div>

      {/* 6. LEGAL INQUIRY FOOTNOTE */}
      <div className="text-center text-xs text-gray-500 space-y-2 pt-4">
        <p>
          For formal legal notices or Data Subject Access Requests (DSAR), please email{' '}
          <a href={`mailto:${data.contactEmail}`} className="text-black font-semibold underline hover:text-[#C8102E]">
            {data.contactEmail}
          </a>.
        </p>
        <p className="text-[10px] text-gray-400 font-mono">
          LUMAA HOME™ DIGITAL MEDIA GROUP • REGISTERED IN ENGLAND AND WALES
        </p>
      </div>

    </div>
  );
}
