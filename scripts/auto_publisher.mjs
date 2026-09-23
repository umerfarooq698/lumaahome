import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-pro-latest'
];

const AUTHORS_POOL = [
  { name: 'Sarah Jenkins', id: 'sarah-jenkins', role: 'London Interior Stylist and Joinery Specialist' },
  { name: 'Eleanor Vance', id: 'eleanor-vance', role: 'Senior Architectural Historian and Heritage Curator' },
  { name: 'Marcus Cole', id: 'marcus-cole', role: 'Principal Architect and Timber Craft Specialist' },
  { name: 'Oliver Sinclair', id: 'oliver-sinclair', role: 'Master Joiner and Period Restoration Consultant' },
  { name: 'Clara Davenport', id: 'clara-davenport', role: 'Lead Interior Architect and Lighting Designer' }
];

function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/&/g, 'and').trim();
}

function cleanMetaDescription(str) {
  if (!str) return '';
  let cleaned = str
    .replace(/\bdiscover\s+how\b/gi, 'How')
    .replace(/\bdiscover\b/gi, '')
    .replace(/\bexplore\b/gi, '')
    .replace(/\bin-depth\b/gi, '')
    .replace(/\bindepth\b/gi, '')
    .replace(/\bcomprehensive\b/gi, '')
    .replace(/\blearn more\b/gi, '')
    .replace(/\bread more\b/gi, '')
    .replace(/\blearn how to\b/gi, 'Master how to')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return cleaned;
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
 * Fetch keywords from public Google Sheet
 */
async function fetchGoogleSheetKeywords() {
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
    const cleaned = parts[0] || '';
    if (!cleaned || cleaned.toLowerCase() === 'keywords' || cleaned.toLowerCase() === 'keyword') continue;
    keywords.push(cleaned);
  }
  console.log(`[Google Sheet] Found ${keywords.length} total keywords in sheet.`);
  return keywords;
}

/**
 * Check if a keyword is already covered by existing articles
 */
function isKeywordPublished(keyword, existingArticles) {
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
 * Category & Label mapping based on keyword
 */
function mapCategoryInfo(keyword) {
  const kw = keyword.toLowerCase();
  if (kw.includes('bath') || kw.includes('shower') || kw.includes('toilet') || kw.includes('wetroom')) {
    return {
      categoryId: 'bathroom',
      categoryName: 'Bathroom',
      categoryLabel: 'SANCTUARY ARCHITECTURE • SANITARYWARE SPECIFICATION'
    };
  }
  if (kw.includes('kitchen') || kw.includes('worktop') || kw.includes('sink') || kw.includes('cabinet') || kw.includes('bin')) {
    return {
      categoryId: 'kitchen',
      categoryName: 'Kitchen',
      categoryLabel: 'CULINARY ARCHITECTURE • BESPOKE CABINETRY'
    };
  }
  if (kw.includes('bedroom') || kw.includes('bed ') || kw.includes('mattress') || kw.includes('wardrobe')) {
    return {
      categoryId: 'bedroom',
      categoryName: 'Bedroom',
      categoryLabel: 'SANCTUARY SUITES • BESPOKE JOINERY SPECIFICATION'
    };
  }
  if (kw.includes('garden') || kw.includes('outdoor') || kw.includes('patio') || kw.includes('pergola')) {
    return {
      categoryId: 'garden',
      categoryName: 'Garden',
      categoryLabel: 'LANDSCAPE ARCHITECTURE • BRITISH OUTDOOR LIVING'
    };
  }
  if (kw.includes('living room') || kw.includes('rug') || kw.includes('sofa') || kw.includes('lamp') || kw.includes('light')) {
    return {
      categoryId: 'living-room',
      categoryName: 'Living Room',
      categoryLabel: 'ENTERTAINING SPACES • ARCHITECTURAL PROPORTIONS'
    };
  }
  if (kw.includes('diy') || kw.includes('paint') || kw.includes('tile')) {
    return {
      categoryId: 'diy',
      categoryName: 'DIY',
      categoryLabel: 'HERITAGE RESTORATION • CRAFTSMANSHIP MASTERCLASS'
    };
  }
  return {
    categoryId: 'interiors',
    categoryName: 'Interiors',
    categoryLabel: 'ARCHITECTURAL DESIGN • MATERIAL PURITY'
  };
}

const CATEGORY_FALLBACK_IMAGES = {
  kitchen: [
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', alt: 'Luxury British kitchen marble worktop and bespoke island architecture', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } },
    { url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85', alt: 'Classic British shaker kitchen with solid oak details and quartz surfaces', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } },
    { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85', alt: 'Contemporary luxury architectural kitchen cabinetry and stone worktop', credit: { name: 'Jason Leung', link: 'https://unsplash.com/@ninjason' } }
  ],
  bathroom: [
    { url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=85', alt: 'Stone composite freestanding bath tub in a luxury architectural bathroom', credit: { name: 'Curology', link: 'https://unsplash.com/@curology' } },
    { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85', alt: 'Minimalist luxury bathroom vanity and bespoke wall tile architecture', credit: { name: 'Christian Mackie', link: 'https://unsplash.com/@christianmackie' } },
    { url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1600&q=85', alt: 'Bespoke walk-in shower with natural stone tiles and brushed brass fittings', credit: { name: 'Sanibell BV', link: 'https://unsplash.com/@sanibell' } }
  ],
  bedroom: [
    { url: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1600&q=85', alt: 'Solid oak handcrafted furniture in a luxury British bedroom suite', credit: { name: 'Sidekix Media', link: 'https://unsplash.com/@sidekix' } },
    { url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1600&q=85', alt: 'Warm luxury master bedroom with bespoke upholstered headboard', credit: { name: 'Christopher Jolly', link: 'https://unsplash.com/@cjolly' } },
    { url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=85', alt: 'Architectural bedroom suite with minimal timber bedframe and neutral styling', credit: { name: 'Spacejoy', link: 'https://unsplash.com/@spacejoy' } }
  ],
  living: [
    { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85', alt: 'High-end British architectural living room with bespoke lounge seating', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } },
    { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85', alt: 'Luxury living room with feature fireplace and curated modular sofa', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } },
    { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85', alt: 'Bespoke timber panelled reception room with period architectural details', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } },
    { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85', alt: 'Period chimney breast and heritage British living room interior design', credit: { name: 'Spacejoy', link: 'https://unsplash.com/@spacejoy' } }
  ],
  interiors: [
    { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85', alt: 'Bespoke timber panelled reception room with period architectural details', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } },
    { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85', alt: 'Luxury British drawing room with feature fireplace and natural light', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } },
    { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85', alt: 'Minimalist British townhouse reception room with natural light', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } },
    { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85', alt: 'Tailored luxury seating in a classic British interior architecture scheme', credit: { name: 'Martin PÃ©chy', link: 'https://unsplash.com/@martinpechy' } }
  ],
  garden: [
    { url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=85', alt: 'Bespoke British conservatory and garden room architecture', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } },
    { url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85', alt: 'Luxury stone patio and architectural outdoor living space', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } }
  ],
  diy: [
    { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85', alt: 'Architectural joinery craftsmanship and bespoke timber interior finishing', credit: { name: 'Theme Photos', link: 'https://unsplash.com/@themephotos' } },
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', alt: 'Restoration woodwork and architectural timber detailing in a British home', credit: { name: 'R Architecture', link: 'https://unsplash.com/@rarchitecture_melbourne' } }
  ]
};

/**
 * Fetch unique high-definition Unsplash photo
 */
async function fetchUnsplashImage(searchQueries, categoryId, altText, usedUrls = new Set()) {
  const catKey = (categoryId || 'living').toLowerCase();
  const pool = CATEGORY_FALLBACK_IMAGES[catKey] || CATEGORY_FALLBACK_IMAGES.living;

  const queries = [...searchQueries, `luxury ${catKey} interior`, `british architectural ${catKey}`];
  
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
            alt: sanitize(altText || item.alt_description || `Luxury British ${catKey} architectural design`),
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

  // Use curated category-specific fallback if Unsplash API fails or exhausts
  for (const fallback of pool) {
    if (!usedUrls.has(fallback.url)) {
      usedUrls.add(fallback.url);
      return fallback;
    }
  }

  return pool[0];
}

/**
 * Generate full high-standard article using Gemini
 */
async function generateArticle(topic, catInfo, usedUrls) {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const author = AUTHORS_POOL[Math.floor(Math.random() * AUTHORS_POOL.length)];

  const prompt = `You are a Senior Editor and Feature Writer for LUMAA HOME™, crafting an authentic, immersive, reader-first editorial feature on the keyword: "${topic}" for the category: "${catInfo.categoryName}".

STRICT EDITORIAL AND WRITING STANDARDS:
1. SHORT, HIGH-READABILITY PARAGRAPHS (STRICT MANDATORY RULE): Every paragraph MUST be concise: exactly 2 to 3 clear, natural sentences (strictly 30 to 45 words per paragraph). NEVER write long, dense blocks of text. Use frequent paragraph breaks ('\\n\\n') between every 2-3 sentences to ensure top readability and easy mobile scanning.
2. DEEPLY INFORMATIONAL AND HELPFUL CONTENT (READER-FIRST VALUE): The content MUST be genuinely helpful, deeply informational, and immediately answer the reader's core questions. Provide practical, actionable advice that a British homeowner, tenant, or renovation enthusiast can use directly. Include exact dimensions in millimetres, realistic UK price ranges in GBP (£), trade-level specifications (e.g., C24 timber, mortise and tenon joinery, British building regulations, slip ratings R10/PTV 36+, breathable lime mortars, acoustic dampening decibels), common costly mistakes to avoid, and clear step-by-step guidance. Zero generic fluff, zero robotic filler.
3. HIERARCHICAL HEADING STRUCTURE: Use 'level': 'h2' and 'level': 'h3'.
4. NATURAL KEYWORD INTEGRATION IN H2 HEADINGS: Naturally weave the primary keyword (or its natural variations) into the H2 major headings.
5. NUMBERED LISTICLE CONDITIONAL RULE: ONLY use numbered headings if the keyword explicitly contains a number. If not, write organic, unnumbered editorial subheadings.
6. MINIMAL BULLET POINTS: 3 to 4 concise items in 'bullets' only where genuine technical checklist or dimension specs add value.
7. BODY WORD COUNT: Total article body word count across all sections MUST be strictly between 850 and 1200 words.
8. TITLE LENGTH: The title must be STRICTLY 55 to 60 characters in length with the keyword naturally placed. No ampersands.
9. BANNED CLICHES: Never use 'The Ultimate', 'Unleash', 'Unlock', 'Delve', 'Dive into', 'Revolutionize', 'Tapestry', 'Supercharge', 'AI', 'Game-changer', 'Seamless', 'Symphony', 'Elevate', 'Nestled', 'Furthermore', 'In conclusion', 'Testament', 'Crucial', 'Paramount', 'Beacon', 'Embark'.
10. NO AMPERSAND: NEVER use the '&' symbol anywhere (always use 'and').
11. UK BRITISH ENGLISH: Use British English (colour, grey, labour, mould, timber, joinery, hearth, plaster).
12. TOPIC-SPECIFIC FAQS: 3 to 4 concise FAQs. Question under 10-12 words, answer strictly 1 to 2 crisp, direct sentences.
14. META DESCRIPTION: STRICTLY 135 to 140 characters in length. NEVER use words like 'Discover', 'Explore', 'In-depth', 'Indepth', 'Comprehensive', 'Learn more', 'Learn', 'Read more', 'The Ultimate', 'Unleash', 'Unlock', 'Delve', 'Dive into', or 'AI'. State the subject and value directly without cliches.

Return ONLY valid JSON matching this exact structure:
{
  "title": "Exact 55 to 60 character title with keyword and no ampersands",
  "metaDescription": "Unique 135 to 140 character meta description without banned words or ampersands",
  "excerpt": "Concise 1-sentence architectural summary of the article without ampersands",
  "heroImageAlt": "Detailed descriptive SEO alt text explaining the scene without ampersands",
  "unsplashSearchQueries": [
    "precise 2-4 word query 1",
    "precise 2-4 word query 2",
    "precise 2-4 word query 3"
  ],
  "content": [
    {
      "level": "h2",
      "heading": "Architectural Heading With Keyword Variation",
      "body": "First paragraph of 55-70 words setting the scene with rich sensory and technical British design details.\\n\\nSecond paragraph of 55-70 words providing specific material insights, engineering tolerances, or practical homeowner context.\\n\\nThird paragraph of 50-65 words detailing long-term performance and maintenance."
    },
    {
      "level": "h3",
      "heading": "Focused Sub-Topic Analysis",
      "body": "First concise paragraph focusing on joinery, proportions, or installation details.\\n\\nSecond concise paragraph explaining longevity and maintenance.",
      "bullets": [
        "Concise technical checklist item or measurement rule",
        "Second practical decision factor without ampersands",
        "Third high-value specification rule"
      ]
    },
    {
      "level": "h2",
      "heading": "Material and Craftsmanship Focus",
      "body": "First paragraph highlighting authentic materials, load capacities, and bespoke finishes.\\n\\nSecond paragraph exploring architectural balance and environmental conditions.",
      "sectionImageQuery": "specific search query for interior details",
      "sectionImageAlt": "Descriptive alt text for detail photo without ampersands",
      "sectionImageCaption": "Subtle editorial caption for detail photo"
    },
    {
      "level": "h3",
      "heading": "Specific Engineering Nuance",
      "body": "Crisp paragraph on tactile timber, stone, or plumbing mechanics.\\n\\nFollow-up paragraph on long-term patina and care."
    },
    {
      "level": "h2",
      "heading": "Architectural Longevity and Care",
      "body": "First paragraph discussing heirloom durability and timeless UK styling.\\n\\nSecond closing paragraph offering actionable takeaway advice."
    }
  ],
  "faqs": [
    {
      "question": "What is the recommended installation clearance?",
      "answer": "Maintain a 500 to 600 millimetre perimeter circulation zone around primary pieces to ensure unhindered movement."
    },
    {
      "question": "How do you protect solid timber from environmental warping?",
      "answer": "Apply microporous hardwax oil finishes and maintain indoor relative humidity between 45 and 60 percent."
    },
    {
      "question": "Which joinery method offers the highest tensile stability?",
      "answer": "Through-mortise and tenon joinery wedged with contrasting hardwoods delivers unmatched structural rigidity over generations."
    }
  ],
  "tags": ["UK Interior", "Craftsmanship", "${topic}"]
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

  // --- Strict Verification & Adjustments ---
  // 1. Sanitize & Title length adjustment (55-60)
  articleData.title = sanitize(articleData.title);
  if (articleData.title.length < 55) {
    const padOptions = [
      ` for British Homes`,
      ` in Modern Interiors`,
      ` for UK Architecture`,
      ` and Spatial Design`
    ];
    for (const pad of padOptions) {
      if ((articleData.title + pad).length >= 55 && (articleData.title + pad).length <= 60) {
        articleData.title += pad;
        break;
      }
    }
  }
  if (articleData.title.length > 60) {
    articleData.title = articleData.title.substring(0, 60).trim();
  }

  // 2. Meta description adjustment (135-140)
  articleData.metaDescription = cleanMetaDescription(sanitize(articleData.metaDescription));
  if (articleData.metaDescription.length < 135) {
    if (!articleData.metaDescription.endsWith('.')) {
      articleData.metaDescription += '.';
    }
    while (articleData.metaDescription.length < 135) {
      articleData.metaDescription = articleData.metaDescription.replace(/\.$/, ' in UK homes.');
    }
  }
  if (articleData.metaDescription.length > 140) {
    articleData.metaDescription = articleData.metaDescription.substring(0, 137).trim() + '...';
    if (articleData.metaDescription.length > 140) {
      articleData.metaDescription = articleData.metaDescription.substring(0, 140);
    }
  }

  // 3. Fetch Hero Image
  console.log(`[Unsplash] Fetching hero image for queries:`, articleData.unsplashSearchQueries);
  const heroImage = await fetchUnsplashImage(
    articleData.unsplashSearchQueries || [topic],
    catInfo.categoryId,
    articleData.heroImageAlt || `Luxury British ${catInfo.categoryName} interior architecture`,
    usedUrls
  );

  // 4. Process Content Sections & Section Image
  const processedContent = [];
  for (const sec of (articleData.content || [])) {
    const sectionObj = {
      level: sec.level || 'h2',
      heading: sanitize(sec.heading),
      body: formatBreathableBody(sanitize(sec.body))
    };

    if (Array.isArray(sec.bullets) && sec.bullets.length > 0) {
      sectionObj.bullets = sec.bullets.map(sanitize);
    }

    if (sec.sectionImageQuery) {
      // Filter out raw texture/macro/sample keywords to guarantee a gorgeous room interior scene
      let cleanedSecQuery = String(sec.sectionImageQuery)
        .replace(/\b(texture|textures|macro|close up|closeup|background|pattern|swatch|sample|material|materials|surface|grain)\b/gi, '')
        .trim();
      if (!cleanedSecQuery || cleanedSecQuery.length < 5) {
        cleanedSecQuery = `luxury ${catInfo.categoryName} room interior design`;
      } else {
        cleanedSecQuery = `${cleanedSecQuery} luxury interior room`;
      }

      console.log(`[Unsplash] Fetching section image for query:`, cleanedSecQuery);
      const secImg = await fetchUnsplashImage(
        [cleanedSecQuery, `british luxury ${catInfo.categoryName} interior design`, `luxury ${catInfo.categoryName} room`],
        catInfo.categoryId,
        sec.sectionImageAlt || `Luxury British ${catInfo.categoryName} interior architecture`,
        usedUrls
      );
      if (secImg && secImg.url) {
        sectionObj.image = secImg.url;
        sectionObj.imageAlt = sanitize(secImg.alt);
        sectionObj.imageCaption = sanitize(sec.sectionImageCaption || `${catInfo.categoryName} craftsmanship details`);
        sectionObj.imageCredit = secImg.credit;
      }
    }

    processedContent.push(sectionObj);
  }

  // 5. Calculate words
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
    excerpt: sanitize(articleData.excerpt || `An architectural guide to ${topic} exploring materials, dimensions, and craftsmanship.`),
    metaDescription: articleData.metaDescription,
    heroImage: heroImage.url,
    image: heroImage.url,
    heroImageAlt: heroImage.alt,
    imageAlt: heroImage.alt,
    photographer: heroImage.credit.name,
    photographerUrl: heroImage.credit.link,
    content: processedContent,
    faqs: (articleData.faqs || []).map(f => ({
      question: sanitize(f.question),
      answer: sanitize(f.answer)
    })),
    tags: [
      topic,
      `Luxury ${catInfo.categoryName}`,
      'UK Interior',
      'Architectural Joinery',
      'Bespoke Craftsmanship'
    ]
  };

  return { fullArticle, totalBodyWords };
}

/**
 * Main execution function
 */
async function main() {
  console.log('=== LUMAA HOME AUTO PUBLISHER CRON ===');
  console.log(`Current Time: ${new Date().toISOString()}`);

  // 1. Fetch Google Sheet Keywords
  const sheetKeywords = await fetchGoogleSheetKeywords();

  // 2. Load existing articles
  const existingArticles = Array.isArray(ARTICLES) ? ARTICLES : [];
  console.log(`[Database] Loaded ${existingArticles.length} existing articles.`);

  // Collect all existing image URLs to prevent duplicate photos
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
    console.log('🎉 All keywords from Google Sheet have already been published! Nothing to do.');
    process.exit(0);
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

  // 5. Prepend new article to ARTICLES array in src/data/articles.js, resetting previous isFeatured to false
  const updatedExisting = existingArticles.map(a => ({ ...a, isFeatured: false }));
  const updatedArticles = [fullArticle, ...updatedExisting];
  const articlesFilePath = path.join(ROOT_DIR, 'src', 'data', 'articles.js');

  const formattedArticlesJs = `export const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};\n\nexport const ARTICLES = ${JSON.stringify(updatedArticles, null, 2)};\n`;

  fs.writeFileSync(articlesFilePath, formattedArticlesJs, 'utf-8');
  console.log(`✅ Successfully updated ${articlesFilePath} with new article: "${fullArticle.title}"!`);

  // 6. Regenerate sitemap.xml and rss.xml with new article URL
  try {
    generateSitemap();
    generateRSS();
  } catch (sErr) {
    console.warn('⚠️ Could not auto-generate sitemap or rss:', sErr.message);
  }
}

main().catch(err => {
  console.error('❌ Fatal error in auto publisher:', err);
  process.exit(1);
});
