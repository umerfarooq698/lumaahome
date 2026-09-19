import React, { useEffect } from 'react';
import { ChevronRight, Mail, Send, MessageSquare, BookOpen, ShieldCheck, Newspaper, HelpCircle } from 'lucide-react';
import { updatePageSeo, SITE_URL } from '../utils/seo';

export default function ContactPage({ onBackToHome, onNavigateAbout }) {
  useEffect(() => {
    updatePageSeo({
      title: 'Contact Us | Direct Editorial Desk',
      description: 'Reach LUMAA HOME editors, writers, and technical specialists directly via email for story pitches, press collaborations, and inquiries.',
      keywords: 'contact lumaa home, editorial submissions, press inquiries uk, period home story pitch',
      canonicalPath: '/contact',
      ogType: 'website',
      jsonLd: {
        '@type': 'ContactPage',
        '@id': `${SITE_URL}/contact/#contact`,
        'url': `${SITE_URL}/contact`,
        'name': 'Contact LUMAA HOME™ Editorial Desk',
        'description': 'Direct contact directory for editorial submissions, press, and reader inquiries.',
        'inLanguage': 'en-GB'
      }
    });
  }, []);
  const departments = [
    {
      title: "Editorial Submissions and Story Pitches",
      description: "Submit architectural townhouse restorations, period joinery projects, or unique interior design case studies for publication consideration.",
      email: "info.lumaahome@gmail.com",
      icon: Newspaper,
      tag: "EDITORIAL DESK"
    },
    {
      title: "Press, Media, and Brand Collaborations",
      description: "Press releases, brand partnership inquiries, designer features, and artisanal supplier collaborations.",
      email: "info.lumaahome@gmail.com",
      icon: MessageSquare,
      tag: "PRESS AND MEDIA"
    },
    {
      title: "Reader Letters and DIY Technical Questions",
      description: "Have questions regarding timber joinery details, heritage paint finishes, or restoration techniques featured in our guides?",
      email: "info.lumaahome@gmail.com",
      icon: HelpCircle,
      tag: "READER DESK"
    },
    {
      title: "Legal, Privacy, and Licensing Compliance",
      description: "Formal notices, copyright licensing permissions, and Data Protection inquiries under UK GDPR.",
      email: "info.lumaahome@gmail.com",
      icon: ShieldCheck,
      tag: "LEGAL AND COMPLIANCE"
    }
  ];

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
            <span className="text-[#C8102E] font-black">CONTACT US</span>
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
            DIRECT EDITORIAL DESK
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-black tracking-tight uppercase">
            Contact Us
          </h1>
          <p className="font-serif italic text-black text-base sm:text-lg mt-2 font-medium">
            Reach our editors, writers, and technical specialists directly via email.
          </p>
        </div>
      </div>

      {/* 2. PRIMARY CONTACT BANNER */}
      <section className="bg-[#FBFBFA] border-2 border-gray-300 p-6 sm:p-10 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black">
          <Mail className="w-4 h-4 text-[#C8102E]" />
          <span>Central Editorial Email</span>
        </div>

        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#111111] leading-relaxed font-normal">
            For all editorial pitches, architectural inquiries, reader feedback, and corporate correspondence, please contact our London editorial office directly:
          </p>
          
          <div className="pt-2">
            <a
              href="mailto:info.lumaahome@gmail.com"
              className="inline-block text-xl sm:text-3xl font-serif font-black text-[#C8102E] hover:underline"
            >
              info.lumaahome@gmail.com
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 text-xs text-black font-medium leading-relaxed">
          <p>
            <strong>Response Times:</strong> Our editorial desk reviews correspondence Monday through Friday. We endeavor to reply to all genuine design inquiries and submissions within 24 to 48 business hours.
          </p>
        </div>
      </section>

      {/* 3. DEPARTMENTAL DIRECTORY (NO FORMS - CLEAN EMAIL ROUTING) */}
      <section className="space-y-6">
        <div className="border-b-2 border-black pb-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
            Departmental Directory
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <div
                key={index}
                className="bg-white border-2 border-gray-300 p-6 space-y-4 hover:border-black transition shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C8102E] bg-red-50 border border-red-200 px-2 py-0.5">
                      {dept.tag}
                    </span>
                    <Icon className="w-4 h-4 text-black" />
                  </div>

                  <h3 className="font-serif text-lg font-black text-black leading-snug">
                    {dept.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#111111] leading-relaxed font-normal">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <a
                    href={`mailto:${dept.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black hover:text-[#C8102E] transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C8102E]" />
                    <span>{dept.email}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MEET THE MASTHEAD PROMO */}
      <section className="bg-gray-50 border border-gray-300 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif text-lg font-bold text-black">
            Want to learn more about our editors and contributors?
          </h4>
          <p className="text-xs text-black font-normal">
            Explore our architectural backgrounds, joinery specialities, and heritage preservation experience.
          </p>
        </div>

        {onNavigateAbout && (
          <button
            onClick={onNavigateAbout}
            className="bg-black text-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C8102E] transition shrink-0"
          >
            MEET THE EDITORS →
          </button>
        )}
      </section>

    </div>
  );
}
