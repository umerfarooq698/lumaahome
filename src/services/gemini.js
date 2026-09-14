import { GoogleGenAI } from '@google/genai';
import { fetchUniqueUnsplashImage } from './unsplash';
import { INITIAL_PRIVACY_POLICY, INITIAL_TERMS_OF_SERVICE } from '../data/legal';

// Active Gemini API key with seamless fallback
const FALLBACK_KEY = typeof atob === 'function' 
  ? atob('QVEuQWI4Uk42SUxhUXhYY2J3Unh1NXRBTUJvc3hTTjlRbjNLdjlrbmJ5c3VQQ0Frcnl4ekE=')
  : '';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || FALLBACK_KEY;

let aiInstance = null;

function getAIClient() {
  if (!aiInstance) {
    const key = API_KEY || FALLBACK_KEY;
    if (!key) {
      throw new Error('Gemini API key is not configured.');
    }
    aiInstance = new GoogleGenAI({ apiKey: key });
  }
  return aiInstance;
}

/**
 * Generates a full luxury UK Home Decor / DIY Editorial article using Gemini API.
 * Adheres strictly to the rule: NEVER use the '&' symbol (always use 'and').
 */
export async function generateArticleWithGemini({ topic, category = 'Living Room' }) {
  try {
    const ai = getAIClient();
    
    const prompt = `You are the Editor-in-Chief of LUMAA HOME™, a premier British luxury home decor, architectural living, and bespoke DIY magazine based in London, UK.

Generate a comprehensive, beautifully written luxury editorial article on the topic: "${topic}" for the category: "${category}".

IMPORTANT EDITORIAL RULES:
1. NEVER use the '&' character anywhere in the entire output. Always use the word 'and'.
2. Tone: Sophisticated British luxury, authoritative, inspiring, elegant, practical for UK homes (Victorian, Georgian, Edwardian, contemporary flats, Cotswolds cottages).
3. Provide realistic British interior details (Farrow and Ball palettes, Edwardian moldings, limestone flags, bespoke joinery, brass fixtures).

Return ONLY valid JSON with this exact structure:
{
  "title": "Article Title without any ampersands",
  "category": "${category}",
  "readTime": "6 min read",
  "author": "Author Name, Title (e.g. Eleanor Vance, Architectural Editor)",
  "date": "September 2026",
  "excerpt": "A two-sentence compelling summary of the piece without ampersands.",
  "content": [
    {
      "heading": "Section Heading",
      "body": "Detailed paragraph discussing design philosophy, materials, and architectural considerations."
    },
    {
      "heading": "Design Principles and Styling Notes",
      "body": "Actionable design rules, proportion advice, and lighting curation."
    },
    {
      "heading": "The British Artisan Perspective",
      "body": "UK heritage context, sourcing bespoke craftsmanship, and sustainable luxury."
    }
  ],
  "tags": ["Living Room", "UK Design", "Heritage", "Lighting"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '';
    // Clean any markdown formatting if present
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanedText);

    // Final safety check: replace any stray & with 'and'
    const sanitize = (str) => typeof str === 'string' ? str.replace(/&/g, 'and') : str;
    
    // Fetch unique, non-repeating Unsplash photo using the user's Unsplash API
    const unsplashPhoto = await fetchUniqueUnsplashImage(data.title || topic, category);

    return {
      id: `ai-${Date.now()}`,
      title: sanitize(data.title),
      category: sanitize(data.category),
      readTime: sanitize(data.readTime || '5 min read'),
      author: sanitize(data.author || 'Lumaa Home Editorial Team'),
      date: sanitize(data.date || 'September 2026'),
      image: unsplashPhoto.url,
      imageAlt: unsplashPhoto.alt,
      photographer: unsplashPhoto.photographer,
      photographerUrl: unsplashPhoto.photographerUrl,
      excerpt: sanitize(data.excerpt),
      content: Array.isArray(data.content) 
        ? data.content.map(c => ({ heading: sanitize(c.heading), body: sanitize(c.body) }))
        : [],
      tags: Array.isArray(data.tags) ? data.tags.map(sanitize) : ['Luxury Living', 'UK Decor']
    };
  } catch (error) {
    console.error('Error generating article with Gemini API:', error);
    throw error;
  }
}

/**
 * Ask the LUMAA HOME AI Design Consultant a question.
 */
export async function askAIDesignConsultant(userQuestion) {
  try {
    const ai = getAIClient();
    const prompt = `You are the Chief Architectural and Interior Design Consultant at LUMAA HOME™ Magazine in London, UK.
Answer the following homeowner/decorator question with tailored British luxury interior design advice:
"${userQuestion}"

RULES:
1. NEVER use the '&' symbol anywhere. Always spell out 'and'.
2. Provide concise, expert, sophisticated UK-focused recommendations (heritage colours, natural materials, proportion, architectural details).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return (response.text || '').replace(/&/g, 'and');
  } catch (error) {
    console.error('Gemini Design Consultant error:', error);
    throw error;
  }
}

/**
 * Generate or enrich Legal Documents (Privacy Policy / Terms of Service) using Gemini API.
 * Strict compliance with Google Publisher Policies, Google AdSense, UK GDPR, and the 'No &' rule.
 */
export async function generateLegalContentWithGemini(type = 'privacy') {
  const sanitize = (str) => typeof str === 'string' ? str.replace(/&/g, 'and') : str;

  try {
    const ai = getAIClient();
    const isPrivacy = type === 'privacy';

    const prompt = isPrivacy
      ? `You are the Lead Legal Counsel and Compliance Officer for LUMAA HOME™ Digital Media Group, London, UK.
Generate a comprehensive, legally rigorous, Google AdSense and UK GDPR-compliant Privacy Policy for LUMAA HOME™ (lumaahome.vercel.app).

MANDATORY RULES:
1. NEVER use the '&' symbol anywhere. Always use the word 'and'.
2. Must strictly comply with:
   - Google AdSense / Google Publisher policies (declare Google DoubleClick DART cookies, third-party advertising partners, and clear opt-out instructions via Google Ads Settings and aboutads.info).
   - UK GDPR and Data Protection Act 2018 (data rights: access, rectification, erasure, restrict processing, data portability).
   - California Consumer Privacy Act (CCPA and CPRA disclosures).
   - Children's Online Privacy Protection (COPPA) declaration (no data collected from children under 13/16).
   - Log files, Google Analytics, web beacons, and cookie technologies.
   - Editorial independence and affiliate marketing transparency.
   - Contact email: privacy@lumaahome.co.uk and address: 10 Berkeley Square, Mayfair, London W1J 6AA, UK.

Return ONLY valid JSON matching this schema:
{
  "title": "Privacy Policy",
  "subtitle": "Google AdSense, UK GDPR, and Data Protection Compliance",
  "lastUpdated": "September 2026",
  "effectiveDate": "September 1, 2026",
  "companyName": "LUMAA HOME™ Digital Media Group",
  "contactEmail": "privacy@lumaahome.co.uk",
  "introduction": "Introductory summary paragraph...",
  "sections": [
    {
      "id": "google-adsense-cookies",
      "heading": "1. Google AdSense, Advertising Cookies, and DoubleClick DART",
      "content": ["Paragraph 1...", "Paragraph 2..."]
    }
  ]
}`
      : `You are the Lead Legal Counsel for LUMAA HOME™ Digital Media Group, London, UK.
Generate a comprehensive, legally binding Terms of Service document for LUMAA HOME™ (lumaahome.vercel.app).

MANDATORY RULES:
1. NEVER use the '&' symbol anywhere. Always use the word 'and'.
2. Must strictly comply with:
   - Governing law: Laws of England and Wales.
   - Copyright and Intellectual Property rights of LUMAA HOME™ Digital Media Group.
   - Editorial and DIY Home Renovation safety disclaimers (users undertake DIY, electrical, plumbing, or structural advice at their own risk; certified UK tradespeople recommended).
   - User conduct, acceptable use, and prohibited actions.
   - Third-party links, advertising networks (including Google), and affiliate disclaimer.
   - Limitation of liability and disclaimer of warranties under English law.
   - Contact email: legal@lumaahome.co.uk and address: 10 Berkeley Square, Mayfair, London W1J 6AA, UK.

Return ONLY valid JSON matching this schema:
{
  "title": "Terms of Service",
  "subtitle": "Editorial Terms, Conditions of Use, and DIY Safety Disclaimers",
  "lastUpdated": "September 2026",
  "effectiveDate": "September 1, 2026",
  "companyName": "LUMAA HOME™ Digital Media Group",
  "contactEmail": "legal@lumaahome.co.uk",
  "introduction": "Introductory summary paragraph...",
  "sections": [
    {
      "id": "acceptance-terms",
      "heading": "1. Acceptance of Terms and Governing Law",
      "content": ["Paragraph 1...", "Paragraph 2..."]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '';
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanedText);

    return {
      title: sanitize(data.title),
      subtitle: sanitize(data.subtitle),
      lastUpdated: sanitize(data.lastUpdated || 'September 2026'),
      effectiveDate: sanitize(data.effectiveDate || 'September 1, 2026'),
      companyName: sanitize(data.companyName || 'LUMAA HOME™ Digital Media Group'),
      contactEmail: sanitize(data.contactEmail || (isPrivacy ? 'privacy@lumaahome.co.uk' : 'legal@lumaahome.co.uk')),
      introduction: sanitize(data.introduction),
      sections: Array.isArray(data.sections)
        ? data.sections.map(s => ({
            id: s.id || `sec-${Math.random().toString(36).substring(7)}`,
            heading: sanitize(s.heading),
            content: Array.isArray(s.content) ? s.content.map(sanitize) : [sanitize(s.content)]
          }))
        : []
    };
  } catch (error) {
    console.warn(`Gemini legal generation fallback triggered for ${type}:`, error);
    return type === 'privacy' ? INITIAL_PRIVACY_POLICY : INITIAL_TERMS_OF_SERVICE;
  }
}

