import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTICLES_FILE = path.join(ROOT_DIR, 'src', 'data', 'articles.js');

export function splitLongParagraph(paragraph, maxWords = 48) {
  const p = paragraph.trim();
  if (!p) return '';
  const words = p.split(/\s+/);
  if (words.length <= maxWords) return p;

  // Split into sentences using regex matching punctuation + space
  const sentences = p.match(/[^.!?]+[.!?]+(\s|$)/g) || [p];
  const newParagraphs = [];
  let currentP = [];
  let currentCount = 0;

  for (const sentence of sentences) {
    const sTrim = sentence.trim();
    if (!sTrim) continue;
    const sWords = sTrim.split(/\s+/).length;
    
    // Break after 2 sentences or when word limit exceeded
    if (currentP.length > 0 && (currentCount + sWords > maxWords || currentP.length >= 2)) {
      newParagraphs.push(currentP.join(' '));
      currentP = [sTrim];
      currentCount = sWords;
    } else {
      currentP.push(sTrim);
      currentCount += sWords;
    }
  }

  if (currentP.length > 0) {
    newParagraphs.push(currentP.join(' '));
  }

  return newParagraphs.join('\n\n');
}

export function formatBreathableBody(body) {
  if (typeof body === 'string') {
    const rawParas = body.split(/\n+/);
    return rawParas.map(p => splitLongParagraph(p)).filter(Boolean).join('\n\n');
  }
  if (Array.isArray(body)) {
    const out = [];
    for (const item of body) {
      const split = splitLongParagraph(item);
      for (const p of split.split(/\n+/)) {
        if (p.trim()) out.push(p.trim());
      }
    }
    return out;
  }
  return body;
}

export function formatAllArticles() {
  const rawContent = fs.readFileSync(ARTICLES_FILE, 'utf-8');
  
  // Extract CATEGORIES and ARTICLES
  const catMatch = rawContent.match(/export const CATEGORIES = (\[[\s\S]*?\]);/);
  const artMatch = rawContent.match(/export const ARTICLES = (\[[\s\S]*?\]);/);

  if (!catMatch || !artMatch) {
    console.error('Could not parse articles.js!');
    return;
  }

  const categories = JSON.parse(catMatch[1]);
  const articles = JSON.parse(artMatch[1]);

  let modifiedCount = 0;

  for (const art of articles) {
    if (Array.isArray(art.content)) {
      for (const sec of art.content) {
        if (sec.body) {
          const oldBody = sec.body;
          sec.body = formatBreathableBody(sec.body);
          if (JSON.stringify(oldBody) !== JSON.stringify(sec.body)) {
            modifiedCount++;
          }
        }
      }
    }
  }

  const newFileContent = `// LUMAA HOME™ Editorial Magazine Database
// Clean structured export for Articles and Categories

export const CATEGORIES = ${JSON.stringify(categories, null, 2)};

export const ARTICLES = ${JSON.stringify(articles, null, 2)};
`;

  fs.writeFileSync(ARTICLES_FILE, newFileContent, 'utf-8');
  console.log(`✅ [Format] Successfully formatted paragraphs across all ${articles.length} articles! (${modifiedCount} sections improved)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  formatAllArticles();
}
