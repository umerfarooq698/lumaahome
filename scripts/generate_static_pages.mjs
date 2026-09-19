import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ARTICLES, CATEGORIES } from '../src/data/articles.js';
import { AUTHORS, getAuthorById } from '../src/data/authors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const BASE_URL = 'https://www.lumaahome.co.uk';

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function generatePageHtml(templateHtml, pageData) {
  const {
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType = 'website',
    jsonLd,
    bodyHtml
  } = pageData;

  let html = templateHtml;

  // 1. Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // 2. Replace Meta Description
  html = html.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${escapeHtml(description)}" />`);

  // 3. Replace Canonical Link
  html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

  // 4. Replace OpenGraph Meta Tags
  html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property=["']og:type["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:type" content="${ogType}" />`);
  if (ogImage) {
    html = html.replace(/<meta\s+property=["']og:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:image" content="${ogImage}" />`);
  }

  // 5. Replace Twitter Meta Tags
  html = html.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  if (ogImage) {
    html = html.replace(/<meta\s+name=["']twitter:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="twitter:image" content="${ogImage}" />`);
  }

  // 6. Replace Schema JSON-LD if provided
  if (jsonLd) {
    const jsonLdString = JSON.stringify(jsonLd, null, 2);
    html = html.replace(/<script\s+type=["']application\/ld\+json["']\s+id=["']lumaa-seo-schema["']>[\s\S]*?<\/script>/i, `<script type="application/ld+json" id="lumaa-seo-schema">\n${jsonLdString}\n    </script>`);
  }

  // 7. Inject Semantic Pre-rendered Body for Search Spiders (Replaced seamlessly upon React hydration)
  if (bodyHtml) {
    html = html.replace(/<div id=["']root["']>[\s\S]*?<\/div>/i, bodyHtml);
  }

  return html;
}

export function generateStaticPages() {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ dist/index.html not found! Run vite build first.');
    return;
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  let count = 0;

  // Shared Navigation HTML for Crawlers
  const navCategoriesHtml = CATEGORIES
    .filter(c => c.id !== 'all')
    .map(c => `<a href="${BASE_URL}/category/${c.id}">${escapeHtml(c.name)}</a>`)
    .join(' | ');

  const navFooterHtml = `<nav><a href="${BASE_URL}/">Home</a> | <a href="${BASE_URL}/about">About Us</a> | <a href="${BASE_URL}/contact">Editorial Contact</a> | <a href="${BASE_URL}/privacy-policy">Privacy Policy</a> | <a href="${BASE_URL}/terms-of-service">Terms of Service</a> | <a href="${BASE_URL}/sitemap.xml">XML Sitemap</a> | <a href="${BASE_URL}/rss.xml">RSS Feed</a></nav>`;

  function writeRouteHtml(routePath, pageData) {
    const targetDir = path.join(DIST_DIR, routePath);
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, 'index.html');
    const renderedHtml = generatePageHtml(templateHtml, pageData);
    fs.writeFileSync(targetFile, renderedHtml, 'utf-8');
    count++;
  }

  // 1. Articles
  for (const art of ARTICLES) {
    const slug = art.slug || art.id;
    const authorObj = getAuthorById(art.authorId || art.author);
    const canonicalUrl = `${BASE_URL}/${slug}`;

    // Build rich body text for crawler word count & internal links
    let bodyTextHtml = '';
    if (Array.isArray(art.content)) {
      bodyTextHtml = art.content.map(sec => {
        const headingTag = sec.level === 'h3' ? 'h3' : 'h2';
        const headingHtml = sec.heading ? `<${headingTag}>${escapeHtml(sec.heading)}</${headingTag}>` : '';
        const bodyContent = typeof sec.body === 'string' 
          ? `<p>${escapeHtml(sec.body)}</p>` 
          : Array.isArray(sec.body) 
            ? sec.body.map(p => `<p>${escapeHtml(p)}</p>`).join('') 
            : '';
        const bulletsHtml = Array.isArray(sec.bullets) && sec.bullets.length > 0 
          ? `<ul>${sec.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` 
          : '';
        return `${headingHtml}${bodyContent}${bulletsHtml}`;
      }).join('\n');
    } else if (typeof art.content === 'string') {
      bodyTextHtml = `<p>${escapeHtml(art.content.replace(/<[^>]+>/g, ' '))}</p>`;
    }

    let faqsHtml = '';
    if (Array.isArray(art.faqs) && art.faqs.length > 0) {
      faqsHtml = `<h2>Frequently Asked Questions</h2>` + art.faqs.map(f => `<h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p>`).join('\n');
    }

    // Contextual related internal links
    const relatedArticles = ARTICLES.filter(a => (a.category === art.category || a.categoryName === art.categoryName) && a.id !== art.id).slice(0, 5);
    const relatedHtml = relatedArticles.length > 0 
      ? `<section><h2>Related Architectural Guides</h2><ul>${relatedArticles.map(r => `<li><a href="${BASE_URL}/${r.slug || r.id}">${escapeHtml(r.title)}</a></li>`).join('')}</ul></section>` 
      : '';

    const articleRootHtml = `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><nav>${navCategoriesHtml}</nav></header><main><article><header><nav><a href="${BASE_URL}/">Home</a> / <a href="${BASE_URL}/category/${art.category}">${escapeHtml(art.categoryName || art.category)}</a></nav><h1>${escapeHtml(art.title)}</h1><p>By <a href="${BASE_URL}/author/${authorObj.id || 'marcus-cole'}">${escapeHtml(authorObj.name || art.author)}</a> &bull; <span>${escapeHtml(art.date)}</span></p></header><div>${bodyTextHtml}</div>${faqsHtml}${relatedHtml}</article></main><footer>${navFooterHtml}</footer></div>`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": `${canonicalUrl}#article`,
          "isPartOf": {
            "@id": `${BASE_URL}/#website`
          },
          "headline": art.title,
          "description": art.metaDescription || art.excerpt || art.title,
          "image": art.heroImage || art.image,
          "datePublished": art.date ? new Date(art.date).toISOString() : new Date().toISOString(),
          "dateModified": art.date ? new Date(art.date).toISOString() : new Date().toISOString(),
          "mainEntityOfPage": canonicalUrl,
          "author": {
            "@type": "Person",
            "name": authorObj?.name || art.author || 'Lumaa Home Editorial Team',
            "url": `${BASE_URL}/author/${authorObj?.id || 'marcus-cole'}`
          },
          "publisher": {
            "@id": `${BASE_URL}/#organization`
          },
          "articleSection": art.categoryName || art.category || 'Interior Design'
        }
      ]
    };

    writeRouteHtml(slug, {
      title: `${art.title} | LUMAA HOME™`,
      description: art.metaDescription || art.excerpt || art.title,
      canonicalUrl,
      ogImage: art.heroImage || art.image,
      ogType: 'article',
      jsonLd,
      bodyHtml: articleRootHtml
    });
  }

  // 2. Categories
  for (const cat of CATEGORIES) {
    if (cat.id === 'all') continue;
    const canonicalUrl = `${BASE_URL}/category/${cat.id}`;
    const catArticles = ARTICLES.filter(a => a.category === cat.id || a.categoryName?.toLowerCase() === cat.name.toLowerCase());
    const catArticlesHtml = catArticles.map(a => `<article><h2><a href="${BASE_URL}/${a.slug || a.id}">${escapeHtml(a.title)}</a></h2><p>${escapeHtml(a.excerpt || a.metaDescription || '')}</p><p>By <a href="${BASE_URL}/author/${a.authorId || 'marcus-cole'}">${escapeHtml(a.author)}</a> &bull; ${escapeHtml(a.date)}</p></article>`).join('\n');

    const categoryRootHtml = `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><nav>${navCategoriesHtml}</nav></header><main><header><h1>${escapeHtml(cat.title || cat.name)}</h1><p>${escapeHtml(cat.description || '')}</p></header><section><h2>Editorial Guides in ${escapeHtml(cat.name)}</h2>${catArticlesHtml}</section></main><footer>${navFooterHtml}</footer></div>`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${canonicalUrl}#webpage`,
          "url": canonicalUrl,
          "name": `${cat.title || cat.name} | LUMAA HOME™`,
          "description": cat.description || `Curated British architectural and interior design guides for ${cat.name}.`,
          "isPartOf": {
            "@id": `${BASE_URL}/#website`
          }
        }
      ]
    };

    writeRouteHtml(`category/${cat.id}`, {
      title: `${cat.title || cat.name} | LUMAA HOME™`,
      description: cat.description || `Curated British architectural and interior design guides for ${cat.name}.`,
      canonicalUrl,
      ogImage: cat.bannerImage,
      ogType: 'website',
      jsonLd,
      bodyHtml: categoryRootHtml
    });
  }

  // 3. Authors
  for (const author of AUTHORS) {
    const canonicalUrl = `${BASE_URL}/author/${author.id}`;
    const authorArticles = ARTICLES.filter(a => (a.authorId && a.authorId === author.id) || (a.author && a.author.toLowerCase() === author.name.toLowerCase()));
    const authorArticlesHtml = authorArticles.map(a => `<article><h2><a href="${BASE_URL}/${a.slug || a.id}">${escapeHtml(a.title)}</a></h2><p>${escapeHtml(a.excerpt || a.metaDescription || '')}</p></article>`).join('\n');

    const authorRootHtml = `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><nav>${navCategoriesHtml}</nav></header><main><header><h1>${escapeHtml(author.name)} - ${escapeHtml(author.role)}</h1><p>${escapeHtml(author.bio || author.shortDescription || '')}</p></header><section><h2>Published Architectural Articles</h2>${authorArticlesHtml}</section></main><footer>${navFooterHtml}</footer></div>`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfilePage",
          "@id": `${canonicalUrl}#profilepage`,
          "url": canonicalUrl,
          "name": `${author.name} | LUMAA HOME™`,
          "mainEntity": {
            "@type": "Person",
            "name": author.name,
            "jobTitle": author.role,
            "description": author.bio || author.shortDescription,
            "image": author.avatar
          }
        }
      ]
    };

    writeRouteHtml(`author/${author.id}`, {
      title: `${author.name} - ${author.role} | LUMAA HOME™`,
      description: author.metaDescription || author.shortDescription || author.bio,
      canonicalUrl,
      ogImage: author.coverImage || author.avatar,
      ogType: 'profile',
      jsonLd,
      bodyHtml: authorRootHtml
    });
  }

  // 4. Static Pages
  const staticPages = [
    {
      path: 'about',
      title: 'About Our Journal | LUMAA HOME™',
      description: 'The premier British architectural journal dedicated to heritage restorations, bespoke joinery craftsmanship, and luxury domestic interiors.'
    },
    {
      path: 'contact',
      title: 'Editorial Contact & Press Inquiries | LUMAA HOME™',
      description: 'Get in touch with the LUMAA HOME editorial team in London, UK for architectural feature pitches and press inquiries.'
    },
    {
      path: 'privacy-policy',
      title: 'Privacy Policy | LUMAA HOME™',
      description: 'Privacy policy and data protection standards for LUMAA HOME readers and subscribers in accordance with UK GDPR.'
    },
    {
      path: 'terms-of-service',
      title: 'Terms of Service | LUMAA HOME™',
      description: 'Terms and conditions governing the use of the LUMAA HOME architectural publication and digital services.'
    }
  ];

  for (const sp of staticPages) {
    const canonicalUrl = `${BASE_URL}/${sp.path}`;
    const staticRootHtml = `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><nav>${navCategoriesHtml}</nav></header><main><header><h1>${escapeHtml(sp.title)}</h1><p>${escapeHtml(sp.description)}</p></header></main><footer>${navFooterHtml}</footer></div>`;

    writeRouteHtml(sp.path, {
      title: sp.title,
      description: sp.description,
      canonicalUrl,
      ogImage: 'https://images.unsplash.com/photo-1704040686413-2c607dbd2f06?auto=format&fit=crop&w=1600&q=85',
      ogType: 'website',
      bodyHtml: staticRootHtml
    });
  }

  // 5. Also update dist/index.html (Homepage)
  const homeArticlesHtml = ARTICLES.slice(0, 16).map(a => `<article><h2><a href="${BASE_URL}/${a.slug || a.id}">${escapeHtml(a.title)}</a></h2><p>${escapeHtml(a.excerpt || a.metaDescription || '')}</p><p>By <a href="${BASE_URL}/author/${a.authorId || 'marcus-cole'}">${escapeHtml(a.author)}</a> &bull; ${escapeHtml(a.date)}</p></article>`).join('\n');
  const homeRootHtml = `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><p>Luxury British Interiors and DIY Magazine</p><nav>${navCategoriesHtml}</nav></header><main><h1>LUMAA HOME™ | Luxury British Interiors and Period DIY Magazine</h1><section><h2>Latest Editorial Guides</h2>${homeArticlesHtml}</section></main><footer>${navFooterHtml}</footer></div>`;

  const updatedHomeHtml = generatePageHtml(templateHtml, {
    title: 'LUMAA HOME™ | A Luxury UK Home Decor and DIY Magazine',
    description: 'British interior luxury, period architectural restorations, and bespoke joinery guides curated for UK design enthusiasts by Lumaa Home™.',
    canonicalUrl: `${BASE_URL}/`,
    ogImage: 'https://images.unsplash.com/photo-1704040686413-2c607dbd2f06?auto=format&fit=crop&w=1600&q=85',
    ogType: 'website',
    bodyHtml: homeRootHtml
  });
  fs.writeFileSync(indexHtmlPath, updatedHomeHtml, 'utf-8');

  console.log(`✅ [SSG] Successfully pre-rendered ${count} static HTML pages with unique self-canonical tags, H1s, body word count, and internal links!`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateStaticPages();
}
