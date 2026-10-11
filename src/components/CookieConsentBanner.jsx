import React, { useState, useEffect } from 'react';
import { ShieldCheck, SlidersHorizontal, X } from 'lucide-react';

const CONSENT_STORAGE_KEY = 'lumaa_uk_gdpr_cookie_consent_v1';

export default function CookieConsentBanner({ onNavigateLegal }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [advertisingEnabled, setAdvertisingEnabled] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!saved) {
        setIsVisible(true);
      } else {
        const parsed = JSON.parse(saved);
        setAnalyticsEnabled(Boolean(parsed.analytics));
        setAdvertisingEnabled(Boolean(parsed.advertising));
      }
    } catch (e) {
      setIsVisible(true);
    }

    const handleOpenSettings = () => {
      setShowManage(true);
      setIsVisible(true);
    };
    window.addEventListener('lumaa-open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('lumaa-open-cookie-settings', handleOpenSettings);
  }, []);

  const saveConsent = (consentData) => {
    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({
          ...consentData,
          timestamp: new Date().toISOString(),
          region: 'GB'
        })
      );
    } catch (e) {
      console.error(e);
    }
    setIsVisible(false);
    setShowManage(false);
  };

  const handleAcceptAll = () => {
    setAnalyticsEnabled(true);
    setAdvertisingEnabled(true);
    saveConsent({ essential: true, analytics: true, advertising: true, status: 'accepted_all' });
  };

  const handleRejectNonEssential = () => {
    setAnalyticsEnabled(false);
    setAdvertisingEnabled(false);
    saveConsent({ essential: true, analytics: false, advertising: false, status: 'essential_only' });
  };

  const handleSavePreferences = () => {
    saveConsent({
      essential: true,
      analytics: analyticsEnabled,
      advertising: advertisingEnabled,
      status: 'custom'
    });
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="UK GDPR Cookie Consent Banner"
      className="fixed bottom-0 inset-x-0 z-50 bg-white border-t-2 border-black shadow-2xl p-4 sm:p-6 animate-fadeIn"
    >
      <div className="max-w-7xl mx-auto">
        {!showManage ? (
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-4xl">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black">
                <ShieldCheck className="w-4 h-4 text-[#C8102E]" />
                <span>UK GDPR &amp; ICO Cookie Consent Notice</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                We use essential cookies to make our website work. With your consent, we and our partners also use non-essential cookies (including Google Analytics and Google AdSense / DoubleClick DART cookies) to measure readership and deliver relevant editorial advertisements in accordance with the UK General Data Protection Regulation (UK GDPR) and PECR. Read our{' '}
                <a
                  href="/privacy-policy"
                  onClick={(e) => {
                    if (onNavigateLegal) {
                      e.preventDefault();
                      onNavigateLegal('privacy-policy');
                    }
                  }}
                  className="text-[#C8102E] font-bold underline hover:text-black"
                >
                  Privacy &amp; Cookie Policy
                </a>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setShowManage(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-gray-300 hover:border-black text-black text-[11px] font-bold uppercase tracking-wider transition bg-white"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Manage Options</span>
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-4 py-2 border border-black bg-white hover:bg-gray-100 text-black text-[11px] font-bold uppercase tracking-wider transition"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2 bg-[#C8102E] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition"
              >
                Accept All Cookies
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black">
                <SlidersHorizontal className="w-4 h-4 text-[#C8102E]" />
                <span>Granular UK Cookie Preferences (ICO &amp; Google CMP Standard)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowManage(false)}
                className="text-gray-500 hover:text-black p-1"
                aria-label="Close preferences"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#FAF9F6] border border-gray-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-black uppercase">
                  <span>1. Strictly Necessary</span>
                  <span className="text-[10px] text-[#C8102E] uppercase">Always Active</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Required for core site security, saved reading lists, and storing your UK GDPR privacy consent choices.
                </p>
              </div>

              <label className="p-3 bg-[#FAF9F6] border border-gray-200 space-y-1 cursor-pointer block">
                <div className="flex items-center justify-between font-bold text-black uppercase">
                  <span>2. Performance &amp; Analytics</span>
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="accent-[#C8102E] w-4 h-4"
                  />
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Allows anonymous readership measurement so our London editorial team can improve technical guides.
                </p>
              </label>

              <label className="p-3 bg-[#FAF9F6] border border-gray-200 space-y-1 cursor-pointer block">
                <div className="flex items-center justify-between font-bold text-black uppercase">
                  <span>3. Advertising (AdSense / DART)</span>
                  <input
                    type="checkbox"
                    checked={advertisingEnabled}
                    onChange={(e) => setAdvertisingEnabled(e.target.checked)}
                    className="accent-[#C8102E] w-4 h-4"
                  />
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Permits Google AdSense and certified UK partners to serve relevant home and architecture advertisements.
                </p>
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-4 py-2 border border-gray-300 hover:border-black text-black text-[11px] font-bold uppercase tracking-wider transition"
              >
                Reject All Non-Essential
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-5 py-2 bg-black hover:bg-[#C8102E] text-white text-[11px] font-bold uppercase tracking-wider transition"
              >
                Save My Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
