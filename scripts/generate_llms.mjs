import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ARTICLES, CATEGORIES } from '../src/data/articles.js';
import { AUTHORS } from '../src/data/authors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const BASE_URL = 'https://www.lumaahome.co.uk';

export function generateLLMsTxt() {
  const publicDir = path.join(ROOT_DIR, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Generate standard llms.txt
  const llmsContent = `# LUMAA HOME™

> The premier independent luxury home decor, period architectural restoration, and bespoke joinery editorial magazine for British design enthusiasts.

## Core Navigation
- [Home](${BASE_URL}/): The main editorial magazine homepage.
- [Sitemap](${BASE_URL}/sitemap.xml): Complete machine-readable XML sitemap.
- [RSS Feed](${BASE_URL}/rss.xml): Real-time XML syndication newsfeed.
- [About Us](${BASE_URL}/about): Editorial masthead, mission, and British architecture credentials.
- [Contact](${BASE_URL}/contact): Editorial inquiries and press contacts.

## Design Categories & Rooms
${CATEGORIES.filter(c => c.id !== 'all').map(c => `- [${c.name}](${BASE_URL}/category/${c.id}): ${c.description || `Curated British home guides for ${c.name}.`}`).join('\n')}

## Published Editorial Guides
${ARTICLES.map(a => `- [${a.title}](${BASE_URL}/${a.slug || a.id}): ${a.excerpt || a.metaDescription || a.title}`).join('\n')}

## Masthead Editors
${AUTHORS.map(au => `- [${au.name}](${BASE_URL}/author/${au.id}): ${au.role}. ${au.bio || au.shortDescription}`).join('\n')}

## Optional
- [Full Text Corpus](${BASE_URL}/llms-full.txt): Complete full-text markdown corpus of all published articles for deep LLM retrieval.
`;

  // 2. Generate full llms-full.txt
  const articlesFullText = ARTICLES.map(a => {
    let bodyText = '';
    if (Array.isArray(a.content)) {
      bodyText = a.content.map(sec => {
        let secBody = typeof sec.body === 'string' ? sec.body : Array.isArray(sec.body) ? sec.body.join('\n\n') : '';
        let bullets = Array.isArray(sec.bullets) ? '\n' + sec.bullets.map(b => `- ${b}`).join('\n') : '';
        return `### ${sec.heading}\n\n${secBody}${bullets}`;
      }).join('\n\n');
    } else if (typeof a.content === 'string') {
      bodyText = a.content.replace(/<[^>]+>/g, '');
    }

    let faqsText = '';
    if (Array.isArray(a.faqs) && a.faqs.length > 0) {
      faqsText = '\n\n### Frequently Asked Questions\n\n' + a.faqs.map(f => `**Q: ${f.question}**\n\nA: ${f.answer}`).join('\n\n');
    }

    return `---
Title: ${a.title}
URL: ${BASE_URL}/${a.slug || a.id}
Author: ${a.author}
Category: ${a.categoryName || a.category}
Date: ${a.date}
Excerpt: ${a.excerpt}

${bodyText}${faqsText}
---`;
  }).join('\n\n');

  const llmsFullContent = `# LUMAA HOME™ - Full Text Editorial Corpus

> Comprehensive text database of all architectural guides, period restoration articles, and joinery manuals published by LUMAA HOME™ (London, UK).

${articlesFullText}
`;

  fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsContent.trim() + '\n', 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), llmsFullContent.trim() + '\n', 'utf-8');
  console.log('✅ [LLMs.txt] Generated public/llms.txt and public/llms-full.txt successfully!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateLLMsTxt();
}
