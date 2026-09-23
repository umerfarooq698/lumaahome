import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { ARTICLES, CATEGORIES } from '../src/data/articles.js';
import { AUTHORS, getAuthorById } from '../src/data/authors.js';
import { formatBreathableBody } from './format_paragraphs.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Load environment variables
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
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY missing!');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-pro-latest'
];

const BANNED_AI_WORDS = [
  'the ultimate', 'delve', 'dive into', 'unleash', 'unlock', 'tapestry',
  'revolutionize', 'elevate', 'nestled', 'furthermore', 'in conclusion',
  'testament', 'crucial', 'paramount', 'supercharge', 'game-changer',
  'seamless', 'symphony', 'plethora', 'beacon', 'realm', 'embark',
  'in today\'s world', 'it is important to note', 'beacon of'
];

function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/&/g, 'and').trim();
}

function containsBannedWords(str) {
  if (!str) return false;
  const lower = str.toLowerCase();
  return BANNED_AI_WORDS.some(bw => lower.includes(bw));
}

// 6 Distinct Editorial Patterns
const PATTERN_DEFINITIONS = {
  1: {
    name: 'The Trade Masterclass (Hands-On Technical Guide)',
    guidelines: `EDITORIAL PATTERN: THE TRADE MASTERCLASS (Hands-On Technical & Fitting Guide)
Tone: Practical, workshop-tested, site-proven trade guidance by a seasoned British artisan.
Structure Requirements:
- Section 1 (H2): Site Assessment and Preparation Requirements (Clearances, moisture checks, substrate readiness).
- Section 2 (H3): Critical Workshop Tolerances and Joint Specification (Exact millimetres, timber/fastener specs). Bullet points with 3-4 exact tolerance rules.
- Section 3 (H2): Step-by-Step Installation Methodology (Sequential trade process: first fix, mechanical alignment, second fix).
- Section 4 (H3): Common Trade Mistakes and Structural Traps (Unfiltered, real-world mistakes builders or DIYers make and how to prevent them).
- Section 5 (H2): Long-Term Structural Maintenance and Service Schedule (Annual checks, oiling/tightening intervals).`
  },
  2: {
    name: 'The Buyer’s Technical Specification & Material Matrix',
    guidelines: `EDITORIAL PATTERN: BUYER'S TECHNICAL SPECIFICATION & MATERIAL MATRIX
Tone: Discerning, objective, design-insider purchasing review with unfiltered advice on quality.
Structure Requirements:
- Section 1 (H2): Spatial Scale, Ergonomics and Circulation Clearances (Exact room dimensions in mm, clearance around the item).
- Section 2 (H3): Side-by-Side Material Comparison (Comparing top 2-3 material options with trade honesty: solid timber vs veneers, natural wool vs blends). Bullet points comparing durability and rub tests.
- Section 3 (H2): Structural Hallmarks of Authentic Craftsmanship (Frame joinery, hardware weight, weight ratings, finish quality).
- Section 4 (H3): When NOT to Buy: Practical Limitations (Honest advice on when this product or material is the wrong choice for certain UK homes).
- Section 5 (H2): Realistic UK Price Brackets and Heirloom Investment (Actual £ GBP cost breakdown: high street vs bespoke artisan).`
  },
  3: {
    name: 'Heritage Conservation & Restoration Blueprint',
    guidelines: `EDITORIAL PATTERN: HERITAGE CONSERVATION & RESTORATION BLUEPRINT
Tone: Authoritative architectural preservation by an experienced British heritage and conservation consultant.
Structure Requirements:
- Section 1 (H2): Historic Architectural Context and Building Fabric (Victorian/Georgian period features, original materials).
- Section 2 (H3): Moisture Management, Breathability and Part L Compliance (Lime plasters vs cement renders, damp prevention, building regulations). Bullet points on breathable material rules.
- Section 3 (H2): Sympathetic Contemporary Adaptations (Integrating modern services, wiring or plumbing without scarring original fabric).
- Section 4 (H3): Preserving Original Details: Cornices, Joinery and Mouldings (Repair over replacement, historic profile matching).
- Section 5 (H2): Long-Term Conservation Strategy and Heritage Care (Breathable finishes, lime wash cycles, protecting period equity).`
  },
  4: {
    name: 'Spatial Flow & Room Layout Architecture',
    guidelines: `EDITORIAL PATTERN: SPATIAL FLOW & ROOM LAYOUT ARCHITECTURE
Tone: Masterful spatial planning, circulation flow, and atmospheric volume balancing by an interior architect.
Structure Requirements:
- Section 1 (H2): Architectural Circulation Pathways and Sightlines (The 900mm primary walkway rule, door swings, natural focal lines).
- Section 2 (H3): Atmospheric Illumination Layering (2700 Kelvin warm white balance, circuit switching, avoiding overhead glare). Bullet points detailing lighting layers and lumen levels.
- Section 3 (H2): Zoning Functional Spaces Without Physical Partitions (Using rugs, joinery divides, and material transitions).
- Section 4 (H3): Acoustic Dampening and Environmental Comfort (Soft furnishings, acoustic underlays, managing hard surface echo).
- Section 5 (H2): Room Layout Execution and Proportion Rules (Actionable room blueprint checklist for British property proportions).`
  },
  5: {
    name: 'The Cost vs. Value Trade & Tenancy Audit',
    guidelines: `EDITORIAL PATTERN: THE COST VS. VALUE TRADE & TENANCY AUDIT
Tone: Pragmatic, financially acute property advisor assessing realistic UK market value and renovation ROI.
Structure Requirements:
- Section 1 (H2): Evaluating Real Floor Area and Architectural Usability (Measuring usable square metres, structural layout efficiency).
- Section 2 (H3): Energy Performance, Heating Systems and British Standards (EPC rating reality, radiator sizing, draftproofing). Bullet points with key inspection checkpoints.
- Section 3 (H2): Where to Spend vs Where to Economise (Heirloom investments that preserve value vs cosmetic items where budget options work).
- Section 4 (H3): Hidden Structural Red Flags and Due Diligence (Signs of subsidence, rising damp, aging wiring, tenancy or leasehold clauses).
- Section 5 (H2): Long-Term Financial Planning and Contingency Management (Budgeting 15% contingencies, maintenance reserves in the UK).`
  },
  6: {
    name: 'Materiality & Living Patina Profile',
    guidelines: `EDITORIAL PATTERN: MATERIALITY & LIVING PATINA PROFILE
Tone: Tactile, craft-focused material expert exploring how natural materials wear, age, and endure.
Structure Requirements:
- Section 1 (H2): Material Origins and Environmental Tolerances (Natural stone, unlacquered brass, solid timber characteristics).
- Section 2 (H3): The Aging Process: Developing Authentic Living Patina (How the surface changes over 5, 10, and 20 years of daily use). Bullet points with maintenance milestones.
- Section 3 (H2): Thermal Shock, Scratch Resistance and Household Chemistry (Resistance to acidic spills, hot pans, and daily wear).
- Section 4 (H3): Sourcing Authentic British and European Craft Materials (Finding verified suppliers, reclaimed materials, sustainable provenance).
- Section 5 (H2): Surface Restoration and Heritage Sealing Protocols (Re-oiling schedules, microcrystalline wax, chemical-free cleaning).`
  }
};

// Map each of the first 12 articles to its ideal pattern
const ARTICLE_PATTERN_MAP = [
  { index: 0, pattern: 4 }, // Inspiring Home Interior Design Ideas -> Spatial Flow
  { index: 1, pattern: 2 }, // Master Bedroom Chair -> Buyer's Spec Matrix
  { index: 2, pattern: 1 }, // Kitchen Bin Built In Cabinets -> Trade Masterclass Fitting
  { index: 3, pattern: 6 }, // Garden Storage Box Timber -> Materiality & Weather Patina
  { index: 4, pattern: 4 }, // Living Room Lights -> Spatial Flow & Lighting Architecture
  { index: 5, pattern: 1 }, // Kitchen Cabinets Joinery -> Trade Masterclass Joinery
  { index: 6, pattern: 5 }, // 3 Bedroom House For Rent -> Cost vs Value Trade Audit
  { index: 7, pattern: 1 }, // Stick On Bathroom Tiles -> Trade Masterclass DIY
  { index: 8, pattern: 2 }, // Floor Lamps Living Room -> Buyer's Spec Matrix
  { index: 9, pattern: 6 }, // Quality Kitchen Sink -> Materiality & Living Patina
  { index: 10, pattern: 3 }, // Green Bathroom Tiles -> Heritage Conservation
  { index: 11, pattern: 4 }  // DIY Art Club Space -> Spatial Flow & Workshop Planning
];

async function generateVariedArticle(article, patternNum) {
  const pattern = PATTERN_DEFINITIONS[patternNum];
  const authorObj = getAuthorById(article.authorId || article.author) || {
    name: article.author || 'Marcus Cole',
    role: 'Architectural Consultant'
  };

  const prompt = `You are ${authorObj.name}, ${authorObj.role} for LUMAA HOME™ magazine in the United Kingdom.
Write an authentic, deeply informative, reader-first article on the topic: "${article.title}".
Category: "${article.categoryName || article.category}".

${pattern.guidelines}

STRICT EDITORIAL AND E-E-A-T RULES:
1. FIRST-HAND E-E-A-T EXPERIENCE: Write with the authentic, first-hand expertise of ${authorObj.name}. Include natural field observations from real UK residential sites and workshops (e.g. "On our studio site visits in London...", "When specifying this for Victorian townhouse renovations...").
2. SHORT, HIGH-READABILITY PARAGRAPHS (STRICT MANDATORY): Every paragraph MUST be strictly 2 to 3 sentences long (30 to 45 words maximum). NEVER write long, dense paragraphs. Leave double newlines ('\\n\\n') between every 2-3 sentences.
3. WORD COUNT TARGET (850 TO 1150 WORDS): To achieve 850-1150 words with short paragraphs, each of the 5 sections MUST contain 3 to 5 separate short paragraphs separated by '\\n\\n'.
4. HIERARCHICAL HEADING STRUCTURE (H2 & H3 ONLY): Follow the pattern's exact H2 and H3 structure. Every H2 and H3 must be organic, professional, and directly related to the keyword.
5. STRICT BAN ON ALL AI ROBOTIC CLICHES: NEVER use any of these words in headings or body text:
   - "The Ultimate", "Delve", "Dive into", "Unleash", "Unlock", "Tapestry", "Revolutionize", "Elevate", "Nestled", "Furthermore", "In conclusion", "Testament to", "Crucial", "Paramount", "Supercharge", "Game-changer", "Seamless", "Symphony", "Beacon", "Embark", "AI".
6. REAL UK TECHNICAL DETAILS: Include exact measurements in millimetres (e.g. 600mm, 900mm, 18mm), realistic UK prices in GBP (£), British Standards (e.g. BS 5385, Part L, Part P), and named trade materials (e.g. C24 structural timber, hydraulic lime putty, unlacquered brass, unglazed porcelain).
7. NO AMPERSANDS: Never use the '&' symbol anywhere. Always spell out 'and'.
8. UK BRITISH ENGLISH: Use British spelling (colour, timber, labour, metre, centre, joinery, mould, grey).
9. TOPIC FAQS: Provide exactly 3 or 4 practical FAQs. Question under 12 words, answer strictly 2 concise sentences with direct technical facts.

Return ONLY valid JSON matching this exact structure:
{
  "content": [
    {
      "level": "h2",
      "heading": "Clear Organic Heading Without Banned Words",
      "body": "First paragraph of 30-45 words setting practical site conditions.\\n\\nSecond paragraph of 30-45 words providing exact measurements or trade insights.\\n\\nThird paragraph of 30-45 words detailing engineering specifications.\\n\\nFourth paragraph of 30-45 words explaining practical benefits."
    },
    {
      "level": "h3",
      "heading": "Specific Detailed Subheading",
      "body": "First concise paragraph focusing on specifications.\\n\\nSecond concise paragraph explaining material performance.\\n\\nThird concise paragraph on installation tolerances.",
      "bullets": [
        "First technical rule or dimension specification without ampersands",
        "Second practical checkpoint or material parameter",
        "Third high-value trade standard or rule"
      ]
    },
    {
      "level": "h2",
      "heading": "Process or Material Focus Heading",
      "body": "First paragraph explaining trade methods and tolerances.\\n\\nSecond paragraph detailing environmental and durability factors.\\n\\nThird paragraph exploring long term structural behavior.\\n\\nFourth paragraph providing actionable guidance."
    },
    {
      "level": "h3",
      "heading": "Common Pitfalls or Performance Nuances",
      "body": "First paragraph detailing trade mistakes to avoid.\\n\\nSecond paragraph explaining prevention and correction.\\n\\nThird paragraph detailing maintenance precautions."
    },
    {
      "level": "h2",
      "heading": "Longevity and Strategic Investment Heading",
      "body": "First paragraph discussing long term durability and patina.\\n\\nSecond paragraph analyzing realistic cost versus value over time.\\n\\nThird closing paragraph offering actionable takeaway advice."
    }
  ],
  "faqs": [
    {
      "question": "Concise direct question under 12 words?",
      "answer": "First direct sentence providing exact specification. Second sentence detailing long term performance advice."
    }
  ]
}`;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[Gemini] Model ${model} (attempt ${attempt}/3)...`);
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        });
        const text = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
        const rawJson = JSON.parse(text);
        if (rawJson && Array.isArray(rawJson.content) && rawJson.content.length >= 4) {
          console.log(`[Gemini] Successfully generated with ${model}!`);
          return rawJson;
        }
      } catch (e) {
        console.warn(`[Gemini] Model ${model} attempt ${attempt} failed:`, e.message);
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, 2000 * attempt));
        }
      }
    }
  }

  throw new Error(`Failed to generate valid content for article ${article.id}`);
}

async function main() {
  console.log('=== STARTING RE-GENERATION FOR ARTICLES 1 TO 12 WITH 6 E-E-A-T PATTERNS ===');

  const articlesFilePath = path.join(ROOT_DIR, 'src', 'data', 'articles.js');
  let currentArticles = [...ARTICLES];

  for (const item of ARTICLE_PATTERN_MAP) {
    const idx = item.index;
    const art = currentArticles[idx];
    const patternNum = item.pattern;

    console.log(`\n--------------------------------------------------`);
    console.log(`Processing Article ${idx + 1}/12: "${art.title}"`);
    console.log(`Pattern: #${patternNum} (${PATTERN_DEFINITIONS[patternNum].name})`);

    const result = await generateVariedArticle(art, patternNum);

    // Retain existing section image if present in the article
    let existingSectionImage = null;
    let existingSectionImageAlt = null;
    let existingSectionImageCaption = null;
    let existingSectionImageCredit = null;

    if (Array.isArray(art.content)) {
      const foundImgSec = art.content.find(s => s.image);
      if (foundImgSec) {
        existingSectionImage = foundImgSec.image;
        existingSectionImageAlt = foundImgSec.imageAlt;
        existingSectionImageCaption = foundImgSec.imageCaption;
        existingSectionImageCredit = foundImgSec.imageCredit;
      }
    }

    // Process sections with formatBreathableBody and inject section image at section 2 (H2)
    const newContent = result.content.map((sec, secIdx) => {
      const secObj = {
        level: sec.level || (secIdx % 2 === 0 ? 'h2' : 'h3'),
        heading: sanitize(sec.heading),
        body: formatBreathableBody(sanitize(sec.body))
      };

      if (Array.isArray(sec.bullets) && sec.bullets.length > 0) {
        secObj.bullets = sec.bullets.map(sanitize);
      }

      // Attach the verified section image to the 3rd section (H2)
      if (secIdx === 2 && existingSectionImage) {
        secObj.image = existingSectionImage;
        secObj.imageAlt = existingSectionImageAlt || sanitize(sec.heading);
        secObj.imageCaption = existingSectionImageCaption || `${art.categoryName || 'British'} architectural details.`;
        secObj.imageCredit = existingSectionImageCredit;
      }

      return secObj;
    });

    const newFaqs = (result.faqs || art.faqs || []).map(f => ({
      question: sanitize(f.question),
      answer: sanitize(f.answer)
    }));

    // Audit word count
    let totalWords = 0;
    newContent.forEach(sec => {
      if (typeof sec.body === 'string') {
        totalWords += sec.body.split(/\s+/).filter(Boolean).length;
      }
    });

    // Check for banned words in headings
    const headingBanned = newContent.some(s => containsBannedWords(s.heading));
    if (headingBanned) {
      console.warn(`⚠️ Warning: Banned AI word found in heading of article #${idx + 1}`);
    }

    console.log(`✅ Word count: ${totalWords} words | FAQs: ${newFaqs.length} | Banned words in headings: ${headingBanned ? 'YES' : 'NO'}`);

    currentArticles[idx] = {
      ...art,
      content: newContent,
      faqs: newFaqs
    };

    // Incremental save after each article
    const formattedArticlesJs = `export const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};\n\nexport const ARTICLES = ${JSON.stringify(currentArticles, null, 2)};\n`;
    fs.writeFileSync(articlesFilePath, formattedArticlesJs, 'utf-8');
    console.log(`💾 Saved progress for Article ${idx + 1}/12!`);

    // Brief pause to prevent rate limiting
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`\n🎉 All 12 articles successfully updated with diverse E-E-A-T patterns!`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
