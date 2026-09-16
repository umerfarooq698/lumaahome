import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ARTICLES, CATEGORIES } from '../src/data/articles.js';
import { AUTHORS } from '../src/data/authors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const BASE_URL = 'https://www.lumaahome.co.uk';

export function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls = [];

  // 1. Homepage (Priority 1.0)
  urls.push({
    loc: BASE_URL + '/',
    lastmod: currentDate,
    changefreq: 'daily',
    priority: '1.0'
  });

  // 2. Categories (Priority 0.8)
  CATEGORIES.forEach(cat => {
    if (cat.id !== 'all') {
      urls.push({
        loc: `${BASE_URL}/category/${cat.id}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      });
    }
  });

  // 3. Articles (Priority 0.9)
  ARTICLES.forEach(art => {
    const slug = art.slug || art.id;
    let lastmod = currentDate;
    if (art.date) {
      try {
        const d = new Date(art.date);
        if (!isNaN(d.getTime())) {
          lastmod = d.toISOString().split('T')[0];
        }
      } catch (e) {}
    }
    urls.push({
      loc: `${BASE_URL}/${slug}`,
      lastmod: lastmod,
      changefreq: 'weekly',
      priority: '0.9'
    });
  });

  // 4. Authors (Priority 0.7)
  AUTHORS.forEach(author => {
    urls.push({
      loc: `${BASE_URL}/author/${author.id}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    });
  });

  // 5. Static & Feed Pages (Priority 0.6)
  const staticPages = ['about', 'contact', 'privacy-policy', 'terms-of-service', 'sitemap', 'rss'];
  staticPages.forEach(p => {
    urls.push({
      loc: `${BASE_URL}/${p}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: p === 'sitemap' || p === 'rss' ? '0.7' : '0.5'
    });
  });

  // Build XML string
  const xmlEntries = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlEntries}
</urlset>
`;

  const outputPath = path.join(ROOT_DIR, 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml.trim() + '\n', 'utf-8');
  console.log(`✅ [Sitemap] Successfully generated public/sitemap.xml with ${urls.length} URLs!`);
}

export function generateRSS() {
  const currentRFC822Date = new Date().toUTCString();

  const escapeXml = (str) => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const itemsXml = ARTICLES.map(art => {
    const slug = art.slug || art.id;
    const itemUrl = `${BASE_URL}/${slug}`;
    let pubDate = currentRFC822Date;
    if (art.date) {
      try {
        const d = new Date(art.date);
        if (!isNaN(d.getTime())) {
          pubDate = d.toUTCString();
        }
      } catch (e) {}
    }

    return `    <item>
      <title>${escapeXml(art.title)}</title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <description>${escapeXml(art.excerpt || art.metaDescription || art.title)}</description>
      <category>${escapeXml(art.categoryName || art.category || 'Interior Design')}</category>
      <dc:creator>${escapeXml(art.author || 'Lumaa Home Editorial Team')}</dc:creator>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>LUMAA HOME™ | A Luxury UK Home Decor and DIY Magazine</title>
    <link>${BASE_URL}/</link>
    <description>British interior luxury, period architectural restorations, and bespoke joinery guides curated for UK design enthusiasts by Lumaa Home™.</description>
    <language>en-GB</language>
    <lastBuildDate>${currentRFC822Date}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`;

  const outputPath = path.join(ROOT_DIR, 'public', 'rss.xml');
  fs.writeFileSync(outputPath, rssXml.trim() + '\n', 'utf-8');
  console.log(`✅ [RSS Feed] Successfully generated public/rss.xml with ${ARTICLES.length} items!`);
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemap();
  generateRSS();
}
