import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { GoogleGenAI } from '@google/genai';
import { ARTICLES, CATEGORIES } from '../src/data/articles.js';
import { generateSitemap, generateRSS } from './generate_sitemap.mjs';
import { formatBreathableBody } from './format_paragraphs.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1JgoirHS5zwFPlRiXuuXOzFDr_SHgeehBfEGKm_Ggvys/gviz/tq?tqx=out:csv';

// Auto-load .env if present
if (fs.existsSync(path.join(ROOT_DIR, '.env'))) {
  const envContent = fs.readFileSync(path.join(ROOT_DIR, '.env'), 'utf-8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [k, ...v] = trimmed.split('=');
    if (k && v.length > 0 && !process.env[k.trim()]) {
      process.env[k.trim()] = v.join('=').trim();
    }
  }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || Buffer.from('QVEuQWI4Uk42SUxhUXhYY2J3Unh1NXRhTUJvc3hTTjlRbjNLdjlrbmJ5c3VQQ0Frcnl4ekE=', 'base64').toString('utf-8');
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || process.env.VITE_UNSPLASH_ACCESS_KEY || Buffer.from('TVlBSVBpbXJuLUVwQUhQckROTDg2b2J3a2t1bGlTZ2o4ejBHOXJ5cjJ6TQ==', 'base64').toString('utf-8');

const GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite'
];

const AUTHORS_POOL = [
  { name: 'Sarah Jenkins', id: 'sarah-jenkins', role: 'London Interior Stylist and Joinery Specialist' },
  { name: 'Eleanor Vance', id: 'eleanor-vance', role: 'Senior Architectural Historian and Heritage Curator' },
  { name: 'Marcus Cole', id: 'marcus-cole', role: 'Principal Architect and Timber Craft Specialist' },
  { name: 'Oliver Sinclair', id: 'oliver-sinclair', role: 'Master Joiner and Period Restoration Consultant' },
  { name: 'Clara Davenport', id: 'clara-davenport', role: 'Lead Interior Architect and Lighting Designer' }
];

/**
 * Strict sanitization: ZERO hyphens, ZERO colons in headings, ZERO buzzwords
 */
export function sanitizeStrict(str) {
  if (typeof str !== 'string') return str;
  let s = str.replace(/&/g, 'and');
  // Strip colons
  s = s.replace(/:/g, ' ');
  // Replace hyphens with space
  s = s.replace(/-/g, ' ');
  // Strip banned buzzwords
  const banned = [
    /\bdelve\b/gi, /\belevate\b/gi, /\btapestry\b/gi, /\btestament\b/gi,
    /\brevolutionize\b/gi, /\brevolutionise\b/gi, /\bnestled\b/gi,
    /\bseamlessly\b/gi, /\bparamount\b/gi, /\bcrucial\b/gi,
    /\bfurthermore\b/gi, /\bmoreover\b/gi, /\bin conclusion\b/gi,
    /\bsanctuary\b/gi, /\bcocoon\b/gi, /\bvisual poise\b/gi,
    /\btimeless allure\b/gi, /\bbespoke\b/gi, /\bunlock\b/gi,
    /\bdiscover\b/gi, /\bbeacon\b/gi, /\bsymphony\b/gi,
    /\barchitectural\b/gi
  ];
  for (const b of banned) {
    s = s.replace(b, ' ');
  }
  // Collapse whitespace
  return s.replace(/\s+/g, ' ').trim();
}

function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Fetch keywords from public Google Sheet CSV
 */
export async function fetchGoogleSheetKeywords() {
  console.log(`[Google Sheet] Fetching keywords from CSV URL...`);
  const res = await fetch(GOOGLE_SHEET_CSV_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch Google Sheet: ${res.status} ${res.statusText}`);
  }
  const csv = await res.text();
  const lines = csv.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  const keywords = [];
  for (const line of lines) {
    const parts = line.split(/,|\t/).map(p => p.replace(/^"|"$/g, '').trim());
    // Strip zero-width spaces or hidden chars
    const cleaned = (parts[0] || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    if (!cleaned || cleaned.toLowerCase() === 'keywords' || cleaned.toLowerCase() === 'keyword') continue;
    keywords.push(cleaned);
  }
  console.log(`[Google Sheet] Found ${keywords.length} total keywords in sheet.`);
  return keywords;
}

/**
 * Check if a keyword is already covered by existing articles
 */
export function isKeywordPublished(keyword, existingArticles) {
  const normKw = keyword.toLowerCase().trim();
  const kwSlug = slugify(keyword);

  for (const article of existingArticles) {
    const titleLower = (article.title || '').toLowerCase();
    const slugLower = (article.slug || '').toLowerCase();
    const tagMatch = (article.tags || []).some(t => t.toLowerCase() === normKw);

    if (
      titleLower.includes(normKw) ||
      slugLower.includes(kwSlug) ||
      tagMatch
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Category & Label mapping based on keyword (ZERO hyphens, ZERO buzzwords)
 */
export function mapCategoryInfo(keyword) {
  const kw = keyword.toLowerCase();
  if (kw.includes('fire pit') || kw.includes('log burner') || kw.includes('garden') || kw.includes('outdoor') || kw.includes('patio') || kw.includes('pergola') || kw.includes('borders')) {
    return {
      categoryId: 'garden',
      categoryName: 'Garden',
      categoryLabel: 'GARDEN LIVING • OUTDOOR SPECIFICATION'
    };
  }
  if (kw.includes('bath') || kw.includes('shower') || kw.includes('toilet') || kw.includes('wetroom') || kw.includes('tub')) {
    return {
      categoryId: 'bathroom',
      categoryName: 'Bathroom',
      categoryLabel: 'BATHROOM DESIGN • SANITARY SPECIFICATION'
    };
  }
  if (kw.includes('kitchen') || kw.includes('worktop') || kw.includes('sink') || kw.includes('cabinet') || kw.includes('bin') || kw.includes('drawer')) {
    return {
      categoryId: 'kitchen',
      categoryName: 'Kitchen',
      categoryLabel: 'KITCHEN DESIGN • CABINET SPECIFICATION'
    };
  }
  if (kw.includes('bedroom') || kw.includes('bed ') || kw.includes('mattress') || kw.includes('wardrobe')) {
    return {
      categoryId: 'bedroom',
      categoryName: 'Bedroom',
      categoryLabel: 'BEDROOM INTERIORS • JOINERY SPECIFICATION'
    };
  }
  if (kw.includes('living room') || kw.includes('rug') || kw.includes('sofa') || kw.includes('lamp') || kw.includes('light')) {
    return {
      categoryId: 'living-room',
      categoryName: 'Living Room',
      categoryLabel: 'LIVING SPACES • INTERIOR PROPORTIONS'
    };
  }
  if (kw.includes('diy') || kw.includes('paint') || kw.includes('tile') || kw.includes('plastic') || kw.includes('art club')) {
    return {
      categoryId: 'diy',
      categoryName: 'DIY',
      categoryLabel: 'WORKSHOP SPACES • RESTORATION CRAFT'
    };
  }
  return {
    categoryId: 'interiors',
    categoryName: 'Interiors',
    categoryLabel: 'INTERIOR DESIGN • MATERIAL CRAFT'
  };
}

const CATEGORY_FALLBACK_IMAGES = {
  garden: [
    { url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85', alt: 'Stone patio and outdoor living space with fire pit in a British garden', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } },
    { url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=85', alt: 'British conservatory and landscaped garden living space', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } }
  ],
  kitchen: [
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', alt: 'British kitchen stone worktop and bespoke island architecture', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } },
    { url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85', alt: 'Classic British kitchen with solid oak details and quartz surfaces', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } }
  ],
  bathroom: [
    { url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=85', alt: 'Stone freestanding bath tub in a modern British bathroom', credit: { name: 'Curology', link: 'https://unsplash.com/@curology' } },
    { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85', alt: 'Minimalist bathroom vanity and tiled wall architecture', credit: { name: 'Christian Mackie', link: 'https://unsplash.com/@christianmackie' } }
  ],
  bedroom: [
    { url: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1600&q=85', alt: 'Solid oak furniture in a modern British bedroom suite', credit: { name: 'Sidekix Media', link: 'https://unsplash.com/@sidekix' } }
  ],
  living: [
    { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85', alt: 'British architectural living room with comfortable lounge seating', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } }
  ],
  interiors: [
    { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85', alt: 'British drawing room with feature fireplace and natural light', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } }
  ],
  diy: [
    { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85', alt: 'Joinery craftsmanship and timber finishing in a home workshop', credit: { name: 'Theme Photos', link: 'https://unsplash.com/@themephotos' } }
  ]
};

/**
 * Fetch unique high-definition Unsplash photo
 */
async function fetchUnsplashImage(searchQueries, categoryId, altText, usedUrls = new Set()) {
  const catKey = (categoryId || 'garden').toLowerCase();
  const pool = CATEGORY_FALLBACK_IMAGES[catKey] || CATEGORY_FALLBACK_IMAGES.garden;

  const queries = [...searchQueries, `modern ${catKey} design`, `british architectural ${catKey}`];
  
  for (const query of queries) {
    try {
      const cleanQuery = query.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cleanQuery)}&orientation=landscape&per_page=15&client_id=${UNSPLASH_KEY}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      if (!data.results || data.results.length === 0) continue;

      for (const item of data.results) {
        const imgUrl = item.urls?.regular || item.urls?.full;
        if (imgUrl && !usedUrls.has(imgUrl)) {
          usedUrls.add(imgUrl);
          return {
            url: imgUrl,
            alt: sanitizeStrict(altText || item.alt_description || `British ${catKey} design`),
            credit: {
              name: item.user?.name || 'Unsplash Photographer',
              link: item.user?.links?.html || 'https://unsplash.com'
            }
          };
        }
      }
    } catch (e) {
      console.warn(`[Unsplash] Query failed: ${query}`, e.message);
    }
  }

  for (const fallback of pool) {
    if (!usedUrls.has(fallback.url)) {
      usedUrls.add(fallback.url);
      return fallback;
    }
  }

  return pool[0];
}

/**
 * Generate full high-standard article using Gemini API
 * Strictly dynamic, reader-first headings with NO rigid templates or repetitive structures.
 */
export async function generateArticle(topic, catInfo, usedUrls) {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const author = AUTHORS_POOL[Math.floor(Math.random() * AUTHORS_POOL.length)];

  const relatedCandidates = ARTICLES
    .filter(a => (a.category === catInfo.categoryId || a.categoryName?.toLowerCase() === catInfo.categoryName?.toLowerCase()))
    .slice(0, 4)
    .map(a => `- "${a.title}" -> link: "/${a.slug}"`)
    .join('\n');

  const prompt = `You are a Senior British home, garden, and interior design specialist writing for LUMAA HOME™.
Write an authentic, highly practical, informative (E-E-A-T) article focused on the primary keyword: "${topic}".
Category: "${catInfo.categoryName}".

CORE EDITORIAL & READER-FIRST REQUIREMENTS:
1. NO DEFAULT OR REPETITIVE HEADING TEMPLATES:
   - Absolutely NEVER use generic headings like "Material Specifications", "Structural Engineering", "Sizing and Spatial Clearances", "British Safety Standards", "Long Term Care and Weather Protection", or "Understanding British Installation Zones".
   - Every single heading (both H2 and H3) must be 100% NEW, FRESH, and DIRECTLY related to "${topic}".
   - Headings must address real questions, practical problems, and decisions that a British reader faces when choosing, fitting, or using "${topic}".
2. DYNAMIC & NATURAL STRUCTURE:
   - Do NOT force a fixed template or identical structure across articles.
   - Let the article flow naturally based on what is most helpful for this specific item (e.g. practical selection criteria, proper clearances and fit, real-world durability, everyday usability, setup or installation guidance, maintenance and troubleshooting).
   - Use H2 sections with relevant H3 subheadings to keep the guide organized and easy to scan.
3. ARTICLE LENGTH & SECTION COUNT (MANDATORY):
   - TOTAL WORD COUNT: Strictly MINIMUM 800 TO 1000 WORDS! Never write under 800 words.
   - SECTION COUNT: Strictly MINIMUM 6 TO 10 COMPREHENSIVE SECTIONS (use a healthy structure of H2 and H3 sections to thoroughly explore the topic).
   - In each section, write 2 to 3 substantive, informative paragraphs.
   - Every single paragraph MUST be strictly between 30 and 42 words (breathable human cadence).
   - Never write a short or truncated article. The guide must thoroughly answer all practical questions about "${topic}" to deliver genuine value to British homeowners.
4. SEMANTIC KEYWORDS & LSI (LATENT SEMANTIC INDEXING) INTEGRATION:
   - Naturally integrate rich semantic keywords, topical entities, contextual synonyms, and LSI keyword variations related to "${topic}" throughout the entire article.
   - Include British home terminology, related materials, dimensions, installation fittings, clearances, durability factors, and practical homeowner queries.
   - Weave these LSI and semantic terms seamlessly into H2 and H3 headings, paragraph bodies, and FAQs to establish strong topical authority for Google search algorithms without keyword stuffing.
5. ZERO HYPHENS (-) ANYWHERE:
   - Zero hyphens in title, metaDescription, excerpt, headings, body text, bullets, or FAQs!
   - Spell out all compound terms (e.g. use "soft close", "heavy duty", "water resistant", "heat resistant", "wipe clean", "non slip", "free standing", "built in", "twenty four", "three hundred millimetres").
6. ZERO COLONS (:):
   - Never use colons in any headings, title, or FAQ questions.
7. ZERO AI BUZZWORDS & NO "DISCOVER":
   - Absolutely do NOT use: discover, elevate, delve, tapestry, testament, revolutionize, nestled, seamlessly, paramount, crucial, furthermore, moreover, sanctuary, cocoon, visual poise, timeless allure, unlock, beacon, symphony, bespoke, architectural.
8. SCANNABLE CHECKLIST:
   - Under exactly one relevant section where practical, include an array of 3 to 4 concise bullet points (without hyphens) to help the reader quickly reference key safety, clearance, or installation rules. All other sections should be clean narrative paragraphs.
9. 3 SHORT PRACTICAL FAQS:
   - Provide exactly 3 short FAQs answering real user questions about "${topic}", with clear one-sentence answers (zero hyphens, zero colons).
10. TITLE & METADATA:
   - Title: Exactly 50 to 60 characters naturally featuring "${topic}".
   - Meta Description: 145 to 160 characters, direct active tone, containing "${topic}", no hyphens, no "Discover".
   - Excerpt: 85 to 125 characters, informative, no hyphens, no "Discover".
11. NATURAL INTERNAL CONTEXTUAL LINK (MANDATORY):
   - In exactly ONE section AFTER the middle of the article (e.g. section 5, 6, 7, or 8), naturally embed exactly 1 contextual link to one of these related LUMAA HOME guides:
${relatedCandidates || '- Related Guide -> link: "/choosing-practical-drawers-in-the-kitchen-space"'}
   - Format as markdown link syntax: [2 to 4 word natural anchor](/slug).
   - NEVER use robotic phrases (avoid "just as you would", "as outlined in", "check out our guide on").
   - The anchor text must be short, conversational, and natural to a British homeowner (e.g. "an [outdoor fire pit](/...)", "a [timber storage box](/...)").
   - Place the sentence naturally — either at the start, middle, or last part of a paragraph.

Return ONLY raw valid JSON:
{
  "title": "Exact 50 to 60 character title with keyword",
  "metaDescription": "One sentence meta description 145-160 characters without hyphens or buzzwords",
  "excerpt": "One sentence summary 85-125 characters without hyphens or buzzwords",
  "heroImageAlt": "Detailed descriptive alt text without hyphens",
  "unsplashSearchQueries": [
    "query 1",
    "query 2",
    "query 3"
  ],
  "content": [
    // Array of 6 to 10 comprehensive sections (total 800 to 1000 words):
    {
      "level": "h2",
      "heading": "Fresh topic-specific heading about ${topic}",
      "body": "Paragraph 1 (30 to 42 words)\\n\\nParagraph 2 (30 to 42 words)",
      "bullets": [] // optional 3 to 4 bullets only in one section
    }
  ],
  "faqs": [
    { "question": "Question without hyphens or colons", "answer": "Clear one sentence answer without hyphens." }
  ]
}`;

  let articleData = null;
  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[Gemini] Attempting generation with model ${model} (attempt ${attempt}/3)...`);
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });
        const text = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
        articleData = JSON.parse(text);
        console.log(`[Gemini] Successfully generated article structure with ${model}!`);
        break;
      } catch (e) {
        console.warn(`[Gemini] Model ${model} attempt ${attempt} failed:`, e.message);
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, 2500 * attempt));
        }
      }
    }
    if (articleData) break;
  }

  if (!articleData) {
    throw new Error('All Gemini models failed during generation.');
  }

  // --- Strict Post-Processing Sanitization ---
  articleData.title = sanitizeStrict(articleData.title);
  if (articleData.title.length < 55) {
    const pads = [' for British Homes', ' in Modern UK Homes', ' for Garden Living', ' and Outdoor Spaces'];
    for (const pad of pads) {
      if ((articleData.title + pad).length >= 55 && (articleData.title + pad).length <= 60) {
        articleData.title += pad;
        break;
      }
    }
  }
  if (articleData.title.length > 60) {
    articleData.title = articleData.title.substring(0, 60).trim();
  }

  articleData.metaDescription = sanitizeStrict(articleData.metaDescription);
  articleData.excerpt = sanitizeStrict(articleData.excerpt || `Practical guide to ${topic} exploring materials dimensions and British standards.`);

  // Fetch Hero Image
  console.log(`[Unsplash] Fetching hero image for queries:`, articleData.unsplashSearchQueries);
  const heroImage = await fetchUnsplashImage(
    articleData.unsplashSearchQueries || [topic],
    catInfo.categoryId,
    articleData.heroImageAlt || `British ${catInfo.categoryName} design`,
    usedUrls
  );

  // Process Content Sections
  const processedContent = [];
  let inlineImageFetched = false;

  const genericHeadingsPattern = /material specification|structural engineering|weather protection|installation zone|spatial clearance|long term care/i;

  for (const sec of (articleData.content || [])) {
    let heading = sanitizeStrict(sec.heading);
    if (genericHeadingsPattern.test(heading)) {
      heading = heading.replace(genericHeadingsPattern, '').trim();
      if (!heading) heading = `Practical Guide to ${topic}`;
    }
    const bodyFormatted = formatBreathableBody(sanitizeStrict(sec.body));
    const sectionObj = {
      level: sec.level || 'h2',
      heading,
      body: bodyFormatted
    };

    if (Array.isArray(sec.bullets) && sec.bullets.length > 0) {
      sectionObj.bullets = sec.bullets.map(sanitizeStrict);
    }

    // Attach 1 inline image in the middle
    if (!inlineImageFetched && processedContent.length === 2) {
      inlineImageFetched = true;
      console.log(`[Unsplash] Fetching inline section image for: ${topic}`);
      const secImg = await fetchUnsplashImage(
        [topic, `modern ${catInfo.categoryName} design`, `british ${catInfo.categoryName}`],
        catInfo.categoryId,
        `Modern ${topic} installation in a British home`,
        usedUrls
      );
      if (secImg && secImg.url) {
        sectionObj.image = secImg.url;
        sectionObj.imageAlt = sanitizeStrict(secImg.alt);
        sectionObj.imageCaption = sanitizeStrict(`Practical detailing and surfaces for ${topic}`);
        sectionObj.imageCredit = secImg.credit;
      }
    }

    processedContent.push(sectionObj);
  }

  // Calculate words
  let totalBodyWords = 0;
  processedContent.forEach(sec => {
    totalBodyWords += countWords(sec.body);
    if (sec.bullets) sec.bullets.forEach(b => totalBodyWords += countWords(b));
  });

  const slug = slugify(articleData.title || topic);
  const now = new Date();
  const day = now.getDate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateStr = `${months[now.getMonth()]} ${day}, ${now.getFullYear()}`;

  const fullArticle = {
    id: `${slug}-guide`,
    title: articleData.title,
    slug: slug,
    category: catInfo.categoryId,
    categoryName: catInfo.categoryName,
    categoryLabel: catInfo.categoryLabel,
    author: author.name,
    authorId: author.id,
    role: author.role,
    date: dateStr,
    readTime: '8 min read',
    views: `${(Math.random() * 10 + 15).toFixed(1)}k`,
    isFeatured: true,
    excerpt: articleData.excerpt,
    metaDescription: articleData.metaDescription,
    heroImage: heroImage.url,
    image: heroImage.url,
    heroImageAlt: sanitizeStrict(heroImage.alt),
    imageAlt: sanitizeStrict(heroImage.alt),
    photographer: heroImage.credit.name,
    photographerUrl: heroImage.credit.link,
    content: processedContent,
    faqs: (articleData.faqs || []).map(f => ({
      question: sanitizeStrict(f.question),
      answer: sanitizeStrict(f.answer)
    })),
    tags: [
      topic,
      `${catInfo.categoryName} Design`,
      'UK Interior',
      'Home Renovation',
      'Practical Design'
    ]
  };

  return { fullArticle, totalBodyWords };
}

/**
 * Main execution function
 */
export async function runAutoPublisher() {
  console.log('=== LUMAA HOME AUTO PUBLISHER ===');
  console.log(`Execution Time: ${new Date().toISOString()}`);

  // 1. Fetch Google Sheet Keywords
  const sheetKeywords = await fetchGoogleSheetKeywords();

  // 2. Load existing articles
  const existingArticles = Array.isArray(ARTICLES) ? ARTICLES : [];
  console.log(`[Database] Loaded ${existingArticles.length} existing articles.`);

  const usedUrls = new Set();
  existingArticles.forEach(a => {
    if (a.heroImage) usedUrls.add(a.heroImage);
    if (a.image) usedUrls.add(a.image);
    if (Array.isArray(a.content)) {
      a.content.forEach(c => {
        if (c.image?.url) usedUrls.add(c.image.url);
      });
    }
  });

  // 3. Find next unpublished keyword
  let nextKeyword = null;
  for (const kw of sheetKeywords) {
    if (!isKeywordPublished(kw, existingArticles)) {
      nextKeyword = kw;
      break;
    }
  }

  if (!nextKeyword) {
    console.log('🎉 All keywords from Google Sheet have already been published!');
    return;
  }

  console.log(`🎯 Next target keyword to publish: "${nextKeyword}"`);
  const catInfo = mapCategoryInfo(nextKeyword);
  console.log(`🏷️ Mapped Category: "${catInfo.categoryName}" (${catInfo.categoryId})`);

  // 4. Generate the article
  const { fullArticle, totalBodyWords } = await generateArticle(nextKeyword, catInfo, usedUrls);

  console.log('\n--- ARTICLE AUDIT ---');
  console.log(`Title: "${fullArticle.title}" (${fullArticle.title.length} chars)`);
  console.log(`Meta: "${fullArticle.metaDescription}" (${fullArticle.metaDescription.length} chars)`);
  console.log(`Body Word Count: ${totalBodyWords} words`);
  console.log(`Hero Image: ${fullArticle.heroImage}`);
  console.log(`FAQs: ${fullArticle.faqs.length}`);
  console.log(`--------------------\n`);

  // 5. Prepend new article to ARTICLES array in src/data/articles.js
  const updatedExisting = existingArticles.map(a => ({ ...a, isFeatured: false }));
  const updatedArticles = [fullArticle, ...updatedExisting];
  const articlesFilePath = path.join(ROOT_DIR, 'src', 'data', 'articles.js');

  const formattedArticlesJs = `export const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};\n\nexport const ARTICLES = ${JSON.stringify(updatedArticles, null, 2)};\n`;

  fs.writeFileSync(articlesFilePath, formattedArticlesJs, 'utf-8');
  console.log(`✅ Successfully updated ${articlesFilePath} with new article: "${fullArticle.title}"!`);

  // 6. Build static pages, sitemaps, RSS
  try {
    console.log('[Build] Running npm run build...');
    execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
    console.log('✅ [Build] Successfully generated static pages and sitemaps!');
  } catch (bErr) {
    console.error('❌ Build failed:', bErr.message);
    throw bErr;
  }

  // 7. Git commit and push to origin main
  try {
    console.log('[Git] Committing and pushing to origin main...');
    try {
      execSync('git config user.name', { stdio: 'pipe' });
    } catch {
      execSync('git config user.name "github-actions[bot]"', { cwd: ROOT_DIR, stdio: 'inherit' });
      execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', { cwd: ROOT_DIR, stdio: 'inherit' });
    }
    execSync(`git add src/data/articles.js public/`, { cwd: ROOT_DIR, stdio: 'inherit' });
    execSync(`git commit -m "Auto-publish article: ${fullArticle.title} [skip ci]"`, { cwd: ROOT_DIR, stdio: 'inherit' });
    execSync(`git push origin main`, { cwd: ROOT_DIR, stdio: 'inherit' });
    console.log('✅ [Git] Successfully pushed new article to GitHub!');
  } catch (gErr) {
    console.warn('⚠️ Git push inside script skipped or handled by workflow:', gErr.message);
  }
}

// Only execute directly when run as CLI script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAutoPublisher().catch(err => {
    console.error('❌ Fatal error in auto publisher:', err);
    process.exit(1);
  });
}
