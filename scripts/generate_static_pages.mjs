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
    jsonLd
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
      jsonLd
    });
  }

  // 2. Categories
  for (const cat of CATEGORIES) {
    if (cat.id === 'all') continue;
    const canonicalUrl = `${BASE_URL}/category/${cat.id}`;

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
      jsonLd
    });
  }

  // 3. Authors
  for (const author of AUTHORS) {
    const canonicalUrl = `${BASE_URL}/author/${author.id}`;

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
      jsonLd
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
    writeRouteHtml(sp.path, {
      title: sp.title,
      description: sp.description,
      canonicalUrl,
      ogImage: 'https://images.unsplash.com/photo-1704040686413-2c607dbd2f06?auto=format&fit=crop&w=1600&q=85',
      ogType: 'website'
    });
  }

  console.log(`✅ [SSG] Successfully pre-rendered ${count} static HTML pages with unique self-canonical tags!`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateStaticPages();
}
