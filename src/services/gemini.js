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

// Ordered Gemini models cascade: Starting from 3.8 down through available versions
const GEMINI_MODELS_CASCADE = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-pro-latest',
  'gemini-2.5-flash-lite'
];

/**
 * Executes a Gemini generateContent request with automatic fallback cascade.
 * Tries the latest model first (gemini-2.5-flash), and if it encounters errors or rate limits,
 * seamlessly falls back to the next model in the cascade (gemini-2.0-flash, gemini-1.5-flash, etc.).
 */
async function generateWithModelFallback(requestConfig) {
  const ai = getAIClient();
  let lastError = null;

  for (const modelName of GEMINI_MODELS_CASCADE) {
    try {
      const response = await ai.models.generateContent({
        ...requestConfig,
        model: modelName
      });
      return response;
    } catch (err) {
      console.warn(`[Gemini Cascade] Model ${modelName} failed, falling back to next available model:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models in fallback cascade failed.');
}

/**
 * Generates a full luxury UK Home Decor / DIY Editorial article using Gemini API.
 * Adheres strictly to the rule: NEVER use the '&' symbol (always use 'and').
 */
export async function generateArticleWithGemini({ topic, category = 'Living Room' }) {
  try {
    
    const prompt = `You are a Senior Editor and Feature Writer for LUMAA HOME™, crafting an authentic, immersive, reader-first editorial feature on the keyword: "${topic}" for the category: "${category}".

STRICT EDITORIAL AND WRITING STANDARDS:
1. NO NUMBERED LISTICLES OR FORMULAS: NEVER number your headings (do NOT write "1. Heading", "2. Heading", "3. Title", or "Step 1"). Do not follow a predictable 5-point or 7-point formula. Write fluid, organic British journalism like Architectural Digest or The World of Interiors.
2. NATURAL SEARCH INTENT: Address the search intent directly with deep, practical, and engaging insights. Begin with an evocative narrative opening that sets the architectural and lifestyle context.
3. UNNUMBERED EVOCATIVE HEADINGS: Craft custom, unnumbered section headings specifically tailored to the topic (e.g., "The Case for Bespoke Reupholstery", "Linen Against Velvet: A Material Discourse", "Navigating British Fire Safety Benchmarks").
4. DYNAMIC PARAGRAPH FLOW: Vary paragraph length naturally. Blend background context, detailed material analysis, step-by-step nuances, and styling advice rather than identical uniform blocks.
5. WORD COUNT: Total article body word count MUST be strictly between 850 and 1200 words.
6. TITLE LENGTH: The title must be STRICTLY 55 to 60 characters in length with the keyword naturally placed.
7. BANNED CLICHES: NEVER use AI clichés or overused buzzwords like "The Ultimate", "Unleash", "Unlock", "Delve", "Dive into", "Revolutionize", "Game-changer", "Tapestry", "Supercharge", or "AI". Never mention AI or content generation.
8. NO AMPERSAND: NEVER use the '&' symbol anywhere (always use the word 'and').
9. UK BRITISH ENGLISH: Use authentic British English throughout (colour, grey, labour, mould, timber, joinery, hearth, plaster).
10. TOPIC-SPECIFIC FAQS: Add 3 to 4 concise, practical FAQs at the end.
11. VISUAL CURATION: Provide 3 high-precision 2-4 word English visual queries for photography and a descriptive SEO ALT text without ampersands.

Return ONLY valid JSON matching this exact structure:
{
  "title": "Title with exactly 55 to 60 characters without ampersands",
  "category": "${category}",
  "readTime": "7 min read",
  "author": "Sarah Jenkins",
  "authorId": "sarah-jenkins",
  "role": "London Interior Stylist and Joinery Specialist",
  "date": "September 2026",
  "heroImageAlt": "Detailed descriptive SEO alt text explaining the room architecture, materials, and lighting without ampersands",
  "unsplashSearchQueries": [
    "precise 2-4 word query 1",
    "precise 2-4 word query 2",
    "precise 2-4 word query 3"
  ],
  "content": [
    {
      "heading": "Evocative Unnumbered Subheading",
      "body": "Rich, multi-faceted narrative exploring practical aspects and context without any numbers in the heading."
    },
    {
      "heading": "Material and Craftsmanship Focus",
      "body": "Detailed advice covering textures, specifications, and actionable guidance.",
      "sectionImageQuery": "specific search query for interior details",
      "sectionImageAlt": "Descriptive alt text for detail photo without ampersands",
      "sectionImageCaption": "Subtle editorial caption for detail photo"
    },
    {
      "heading": "Practical Execution and Technical Insight",
      "body": "Detailed expert insights, proportions, or installation steps."
    },
    {
      "heading": "Architectural Harmony and Longevity",
      "body": "Comprehensive styling, care, and investment considerations tailored uniquely to this subject."
    }
  ],
  "faqs": [
    {
      "question": "Topic-specific question 1?",
      "answer": "Concise, highly practical answer."
    },
    {
      "question": "Topic-specific question 2?",
      "answer": "Concise, highly practical answer."
    },
    {
      "question": "Topic-specific question 3?",
      "answer": "Concise, highly practical answer."
    }
  ],
  "tags": ["UK Interior", "Craftsmanship", "Home Design"]
}`;

    const response = await generateWithModelFallback({
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
    
    // Fetch unique, non-repeating Unsplash photo using Gemini's tailored search queries & Gemini's custom ALT text
    const searchQueries = Array.isArray(data.unsplashSearchQueries) && data.unsplashSearchQueries.length > 0
      ? data.unsplashSearchQueries.map(sanitize)
      : [sanitize(data.title) || topic, category];

    const heroImageAlt = sanitize(data.heroImageAlt) || `Luxury British ${category} interior architecture and bespoke joinery`;
    const unsplashPhoto = await fetchUniqueUnsplashImage(searchQueries, category, heroImageAlt);

    // Process content sections and optionally fetch unique inline section images
    const processedContent = [];
    if (Array.isArray(data.content)) {
      for (const c of data.content) {
        const sectionObj = {
          heading: sanitize(c.heading),
          body: sanitize(c.body)
        };

        if (c.sectionImageQuery && !sectionObj.image) {
          try {
            const secQuery = sanitize(c.sectionImageQuery);
            const secAlt = sanitize(c.sectionImageAlt) || `${category} interior craftsmanship details`;
            const secPhoto = await fetchUniqueUnsplashImage([secQuery, `${category} interior details`], category, secAlt);
            if (secPhoto && secPhoto.url) {
              sectionObj.image = secPhoto.url;
              sectionObj.imageAlt = secAlt;
              sectionObj.imageCaption = sanitize(c.sectionImageCaption) || secAlt;
            }
          } catch (e) {
            console.warn('Could not fetch section image:', e);
          }
        }

        processedContent.push(sectionObj);
      }
    }

    return {
      id: `ai-${Date.now()}`,
      title: sanitize(data.title),
      category: sanitize(data.category),
      readTime: sanitize(data.readTime || '5 min read'),
      author: sanitize(data.author || 'Lumaa Home Editorial Team'),
      date: sanitize(data.date || 'September 2026'),
      heroImage: unsplashPhoto.url,
      image: unsplashPhoto.url,
      heroImageAlt: heroImageAlt,
      imageAlt: heroImageAlt,
      photographer: unsplashPhoto.photographer,
      photographerUrl: unsplashPhoto.photographerUrl,
      excerpt: sanitize(data.excerpt),
      content: processedContent,
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
    const prompt = `You are the Chief Architectural and Interior Design Consultant at LUMAA HOME™ Magazine in London, UK.
Answer the following homeowner/decorator question with tailored British luxury interior design advice:
"${userQuestion}"

RULES:
1. NEVER use the '&' symbol anywhere. Always spell out 'and'.
2. Provide concise, expert, sophisticated UK-focused recommendations (heritage colours, natural materials, proportion, architectural details).`;

    const response = await generateWithModelFallback({
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
    - Contact email: info.lumaahome@gmail.com.

Return ONLY valid JSON matching this schema:
{
  "title": "Privacy Policy",
  "subtitle": "Google AdSense, UK GDPR, and Data Protection Compliance",
  "lastUpdated": "September 2026",
  "effectiveDate": "September 1, 2026",
  "companyName": "LUMAA HOME™ Digital Media Group",
  "contactEmail": "info.lumaahome@gmail.com",
  "introduction": "Introductory summary paragraph...",
  "sections": [
    {
      "id": "google-adsense-cookies",
      "heading": "1. Google AdSense, Advertising Cookies, and DoubleClick DART",
      "content": ["Paragraph 1...", "Paragraph 2..."]
    }
  ]
}`
      : `You are the Lead Legal Counsel for LUMAA HOME™ Digital Media Group.
Generate a comprehensive, legally binding Terms of Service document for LUMAA HOME™ (lumaahome.vercel.app).

MANDATORY RULES:
1. NEVER use the '&' symbol anywhere. Always use the word 'and'.
2. Must strictly comply with:
   - Governing law: Laws of England and Wales.
   - Copyright and Intellectual Property rights of LUMAA HOME™ Digital Media Group.
   - Editorial and DIY Home Renovation safety disclaimers (users undertake DIY, electrical, plumbing, or structural advice at their own risk; certified tradespeople recommended).
   - User conduct, acceptable use, and prohibited actions.
   - Third-party links, advertising networks (including Google), and affiliate disclaimer.
   - Limitation of liability and disclaimer of warranties under English law.
   - Contact email: info.lumaahome@gmail.com.

Return ONLY valid JSON matching this schema:
{
  "title": "Terms of Service",
  "subtitle": "Editorial Terms, Conditions of Use, and DIY Safety Disclaimers",
  "lastUpdated": "September 2026",
  "effectiveDate": "September 1, 2026",
  "companyName": "LUMAA HOME™ Digital Media Group",
  "contactEmail": "info.lumaahome@gmail.com",
  "introduction": "Introductory summary paragraph...",
  "sections": [
    {
      "id": "acceptance-terms",
      "heading": "1. Acceptance of Terms and Governing Law",
      "content": ["Paragraph 1...", "Paragraph 2..."]
    }
  ]
}`;

    const response = await generateWithModelFallback({
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
      contactEmail: sanitize(data.contactEmail || 'info.lumaahome@gmail.com'),
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

