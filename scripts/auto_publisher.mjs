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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
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
    /\bdiscover\b/gi, /\bbeacon\b/gi, /\bsymphony\b/gi
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
 * 3 Structural archetypes to guarantee distinct layout & cadence on every run
 */
const LAYOUT_ARCHETYPES = [
  {
    name: 'Material And Engineering Deep Dive',
    instructions: `Structure:
1. H2 on Material Specifications with 3 distinct paragraphs (30-40 words each) covering different core materials.
2. H2 on Structural Engineering and Load Tolerances with 2 paragraphs (30-40 words each).
3. H2 on Sizing and Spatial Clearances with 2 paragraphs (30-40 words each).
4. H2 on British Safety Standards and Regulations with 1 intro paragraph and 3 to 4 compliance bullets.
5. H2 on Long Term Care and Weather Protection with 2 paragraphs (30-40 words each).
6. H2 on Final Selection and Buying Advice with 2 narrative paragraphs (NO bullets at the end).`
  },
  {
    name: 'Zone Based Layout And Sequential Walkthrough',
    instructions: `Structure:
1. H2 on British Installation Zones with 1 intro paragraph and 3 distinct zone breakdown bullets.
2. H2 on Material Comparison with 2 paragraphs (30-40 words each).
3. H2 on Surrounding Materials and Garden Finishes with 3 distinct paragraphs (30-40 words each).
4. H2 on Step by Step Setup and Fitting Sequence with 1 intro paragraph and 4 sequential execution bullets.
5. H2 on Routine Care and Seasonal Protection with 2 paragraphs (30-40 words each).
6. H2 on Final Summary and Selection Advice with 1 comprehensive concluding paragraph (NO bullets at the end).`
  },
  {
    name: 'Spatial Planning And Practical Safety',
    instructions: `Structure:
1. H2 on Circulation Clearances and Spatial Planning with 1 intro paragraph and 3 exact metric clearance bullets.
2. H2 on Structural Design and Physical Balance with 2 paragraphs (30-40 words each).
3. H2 on Fuel Power and Thermal Management with 2 paragraphs (30-40 words each).
4. H2 on Environmental Protection and Surface Materials with 2 paragraphs (30-40 words each).
5. H2 on Safe Operational Protocols with 2 paragraphs (30-40 words each).
6. H2 on Buying Checklist and Final Layout Advice with 1 intro paragraph and 3 practical trade bullets.`
  }
];

/**
 * Generate full high-standard article using Gemini
 */
export async function generateArticle(topic, catInfo, usedUrls) {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const author = AUTHORS_POOL[Math.floor(Math.random() * AUTHORS_POOL.length)];
  const archetype = LAYOUT_ARCHETYPES[Math.floor(Math.random() * LAYOUT_ARCHETYPES.length)];

  console.log(`[AutoPublisher] Selected Layout Archetype: "${archetype.name}"`);

  const prompt = `You are a Senior British home and garden design specialist writing for LUMAA HOME™.
Write an authentic, highly practical, informative (E-E-A-T) article focused on the primary keyword: "${topic}".
Category: "${catInfo.categoryName}".

TARGET LAYOUT ARCHETYPE:
${archetype.instructions}

CRITICAL CONSTRAINTS:
1. ZERO HYPHENS (-) ANYWHERE in title, metaDescription, headings, body text, bullets, or FAQs! Spell out all numbers and compound words (e.g. "twenty four", "three hundred millimetres", "forty millimetres", "heat resistant", "weather resistant", "slip resistant", "free standing", "built in"). Do not use any hyphen character.
2. ZERO COLONS (:) in any headings or title!
3. ZERO AI BUZZWORDS: Absolutely do NOT use architectural (use natural words like practical, interior, home, space, design, garden), elevate, delve, tapestry, testament, revolutionize, nestled, seamlessly, paramount, crucial, furthermore, moreover, in conclusion, sanctuary, cocoon, visual poise, timeless allure, unlock, discover, beacon, symphony, bespoke.
4. TITLE LENGTH: Exactly 55 to 60 characters containing the keyword "${topic}" naturally.
5. KEYWORD IN HEADINGS: The keyword "${topic}" or its natural variation MUST be naturally integrated into major H2 headings.
6. SHORT BREATHABLE PARAGRAPHS: Every paragraph must be between 30 and 42 words.
7. CONCLUSION SECTION: The final H2 section must serve as a proper conclusion and buying advice section featuring "${topic}".
8. 3 SHORT FAQS: 3 concise FAQs with single sentence answers (no hyphens).
9. BRITISH SPELLING & METRIC SPECS: Use British English (colour, grey, timber, joinery) and exact metric units spelled out.

Return ONLY raw valid JSON:
{
  "title": "Exact 55 to 60 character title with keyword",
  "metaDescription": "One sentence meta description under 25 words without hyphens or buzzwords",
  "excerpt": "One sentence summary under 20 words without hyphens or buzzwords",
  "heroImageAlt": "Detailed descriptive alt text without hyphens",
  "unsplashSearchQueries": [
    "query 1",
    "query 2",
    "query 3"
  ],
  "content": [
    {
      "level": "h2",
      "heading": "Heading with keyword",
      "body": "Paragraph 1\\n\\nParagraph 2",
      "bullets": [] // optional bullets where required by the archetype
    }
  ],
  "faqs": [
    { "question": "Question without hyphens", "answer": "Answer without hyphens." }
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

  for (const sec of (articleData.content || [])) {
    const heading = sanitizeStrict(sec.heading);
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
        sectionObj.imageCaption = sanitizeStrict(`${topic} architectural detailing and surface materials`);
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
    execSync(`git add src/data/articles.js public/ dist/`, { cwd: ROOT_DIR, stdio: 'inherit' });
    execSync(`git commit -m "Auto-publish article: ${fullArticle.title}"`, { cwd: ROOT_DIR, stdio: 'inherit' });
    execSync(`git push origin main`, { cwd: ROOT_DIR, stdio: 'inherit' });
    console.log('✅ [Git] Successfully pushed new article to GitHub!');
  } catch (gErr) {
    console.warn('⚠️ Git push skipped or failed:', gErr.message);
  }
}

// Only execute directly when run as CLI script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAutoPublisher().catch(err => {
    console.error('❌ Fatal error in auto publisher:', err);
    process.exit(1);
  });
}
