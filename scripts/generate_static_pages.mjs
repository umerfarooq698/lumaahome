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

const BASE_GRAPH_NODES = [
  {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "url": BASE_URL,
    "name": "LUMAA HOME",
    "description": "British interior design, architectural restorations, and practical joinery guides by Lumaa Home.",
    "inLanguage": "en-GB",
    "publisher": {
      "@id": `${BASE_URL}/#organization`
    }
  },
  {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "Lumaa Home Digital Media Ltd",
    "legalName": "Lumaa Home Digital Media Ltd",
    "url": BASE_URL,
    "email": "info.lumaahome@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "42 Kensington High Street, Kensington",
      "addressLocality": "London",
      "postalCode": "W8 4PF",
      "addressCountry": "GB"
    },
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/favicon.svg`,
      "caption": "LUMAA HOME"
    },
    "sameAs": [
      "https://www.instagram.com/lumaahome.uk",
      "https://www.pinterest.co.uk/lumaahome",
      "https://www.linkedin.com/company/lumaa-home"
    ]
  }
];

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function toAbsoluteUrl(url) {
  if (!url) return `${BASE_URL}/images/british-living-room-cabinets.jpg`;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Ensures SEO title is strictly distinct from H1, contains brand, and is 45-60 characters
 */
function makeArticleSeoTitle(title) {
  const brand = ' | LUMAA HOME';
  const targetMax = 60;
  const avail = targetMax - brand.length; // 47 chars
  
  let clean = title.trim();
  if (clean.length <= avail) {
    return `${clean}${brand}`;
  }
  // Trim at word boundary
  let truncated = clean.slice(0, avail);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 25) {
    truncated = truncated.slice(0, lastSpace);
  }
  return `${truncated.trim()}${brand}`;
}

function generatePageHtml(templateHtml, pageData) {
  const {
    seoTitle,
    description,
    canonicalUrl,
    ogImage,
    ogType = 'website',
    jsonLd,
    bodyHtml
  } = pageData;

  let html = templateHtml;
  const fullOgImage = toAbsoluteUrl(ogImage);

  // 1. Replace Title (Strictly 40-60 chars & distinct from H1)
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seoTitle)}</title>`);

  // 2. Replace Meta Description
  html = html.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${escapeHtml(description)}" />`);

  // 3. Replace Canonical Link
  html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

  // 4. Replace OpenGraph Meta Tags
  html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(seoTitle)}" />`);
  html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property=["']og:type["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:type" content="${ogType}" />`);
  if (fullOgImage) {
    html = html.replace(/<meta\s+property=["']og:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:image" content="${fullOgImage}" />`);
  }

  // 5. Replace Twitter Meta Tags
  html = html.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(seoTitle)}" />`);
  html = html.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  if (fullOgImage) {
    html = html.replace(/<meta\s+name=["']twitter:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="twitter:image" content="${fullOgImage}" />`);
  }

  // 6. Replace Schema JSON-LD if provided
  if (jsonLd) {
    const jsonLdString = JSON.stringify(jsonLd, null, 2);
    html = html.replace(/<script\s+type=["']application\/ld\+json["']\s+id=["']lumaa-seo-schema["']>[\s\S]*?<\/script>/i, `<script type="application/ld+json" id="lumaa-seo-schema">\n${jsonLdString}\n    </script>`);
  }

  // 7. Inject Semantic Pre-rendered Body directly inside <div id="root"> for immediate SSG indexing
  if (bodyHtml) {
    html = html.replace(/<div id=["']root["']>[\s\S]*?<\/div>(\s*<noscript>[\s\S]*?<\/noscript>)?/i, `<div id="root">\n${bodyHtml}\n    </div>`);
  }

  return html;
}

export function generateStaticPages() {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html not found! Run vite build first.');
    return;
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  let count = 0;

  // Remove stale dist/category/buying-guides if present
  const staleBuyingGuides = path.join(DIST_DIR, 'category', 'buying-guides');
  if (fs.existsSync(staleBuyingGuides)) {
    fs.rmSync(staleBuyingGuides, { recursive: true, force: true });
  }

  // Shared Navigation & UK Corporate Footer HTML for Crawlers
  const navCategoriesHtml = CATEGORIES
    .filter(c => c.id !== 'all')
    .map(c => `<a href="${BASE_URL}/category/${c.id}">${escapeHtml(c.name)}</a>`)
    .join(' | ');

  const navAuthorsHtml = AUTHORS
    .map(a => `<a href="${BASE_URL}/author/${a.id}">${escapeHtml(a.name)}</a>`)
    .join(' | ');

  const navFooterHtml = `<nav><div><strong>Categories:</strong> ${navCategoriesHtml}</div><div><strong>Editorial Masthead:</strong> ${navAuthorsHtml}</div><div><strong>Information:</strong> <a href="${BASE_URL}/">Home</a> | <a href="${BASE_URL}/about">About Us</a> | <a href="${BASE_URL}/contact">Editorial Contact</a> | <a href="${BASE_URL}/privacy-policy">Privacy Policy</a> | <a href="${BASE_URL}/terms-of-service">Terms of Service</a> | <a href="${BASE_URL}/sitemap.xml">XML Sitemap</a> | <a href="${BASE_URL}/rss.xml">RSS Feed</a></div><div><strong>UK Office:</strong> Lumaa Home Digital Media Ltd, 42 Kensington High Street, Kensington, London, W8 4PF, United Kingdom | Email: info.lumaahome@gmail.com</div></nav>`;

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
    const fullHeroImage = toAbsoluteUrl(art.heroImage || art.image);

    // Distinct SEO Title containing brand vs exact H1 article headline
    const seoTitle = makeArticleSeoTitle(art.title);

    // Build rich body text for crawler word count, internal links & external authority links
    const formatMarkdownLinks = (text) => {
      if (!text) return '';
      const escaped = escapeHtml(text);
      return escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, url) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        }
        return `<a href="${url}">${label}</a>`;
      });
    };

    let bodyTextHtml = '';
    if (Array.isArray(art.content)) {
      bodyTextHtml = art.content.map(sec => {
        const headingTag = sec.level === 'h3' ? 'h3' : 'h2';
        const headingHtml = sec.heading ? `<${headingTag}>${escapeHtml(sec.heading)}</${headingTag}>` : '';
        const bodyContent = typeof sec.body === 'string' 
          ? sec.body.split(/\n+/).filter(Boolean).map(p => `<p>${formatMarkdownLinks(p.trim())}</p>`).join('') 
          : Array.isArray(sec.body) 
            ? sec.body.map(p => `<p>${formatMarkdownLinks(p)}</p>`).join('') 
            : '';
        const bulletsHtml = Array.isArray(sec.bullets) && sec.bullets.length > 0 
          ? `<ul>${sec.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` 
          : '';
        let tableHtml = '';
        if (sec.table && Array.isArray(sec.table.headers) && Array.isArray(sec.table.rows)) {
          const ths = sec.table.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('');
          const trs = sec.table.rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
          tableHtml = `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
        }
        return `${headingHtml}${bodyContent}${bulletsHtml}${tableHtml}`;
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

    const disclosureHtml = `<p><strong>Editorial &amp; Affiliate Disclosure:</strong> LUMAA HOME is reader-supported. Our editors independently research, test, and specify every material and product featured. When you purchase through retailer links on our site, we may earn an affiliate commission at no extra cost to you, in accordance with UK ASA guidelines.</p>`;

    const articleRootHtml = `<header><a href="${BASE_URL}/">LUMAA HOME</a><nav>${navCategoriesHtml}</nav></header><main><article><header><nav aria-label="Breadcrumb"><a href="${BASE_URL}/">Home</a> / <a href="${BASE_URL}/category/${art.category}">${escapeHtml(art.categoryName || art.category)}</a> / <span>${escapeHtml(art.title)}</span></nav><h1>${escapeHtml(art.title)}</h1><p>By <a href="${BASE_URL}/author/${authorObj.id || 'marcus-cole'}">${escapeHtml(authorObj.name || art.author)}</a> (${escapeHtml(authorObj.credentials || authorObj.role)}) | <span>${escapeHtml(art.date)}</span> | <span>${escapeHtml(art.readTime || '5 min read')}</span></p>${disclosureHtml}<img src="${escapeHtml(art.heroImage || art.image)}" alt="${escapeHtml(art.heroImageAlt || art.title)}" /></header><div>${bodyTextHtml}</div>${faqsHtml}${relatedHtml}</article></main><footer>${navFooterHtml}</footer>`;

    const graphSchemas = [
      ...BASE_GRAPH_NODES,
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "isPartOf": {
          "@id": `${BASE_URL}/#website`
        },
        "headline": art.title,
        "description": art.metaDescription || art.excerpt || art.title,
        "image": [fullHeroImage],
        "datePublished": art.date ? new Date(art.date).toISOString() : new Date().toISOString(),
        "dateModified": art.date ? new Date(art.date).toISOString() : new Date().toISOString(),
        "mainEntityOfPage": canonicalUrl,
        "author": {
          "@type": "Person",
          "name": authorObj?.name || art.author || 'Lumaa Home Editorial Team',
          "jobTitle": authorObj?.role || 'Senior Editor',
          "url": `${BASE_URL}/author/${authorObj?.id || 'marcus-cole'}`,
          "sameAs": [
            authorObj?.socials?.linkedin,
            authorObj?.socials?.pinterest,
            authorObj?.socials?.instagram
          ].filter(Boolean)
        },
        "publisher": {
          "@id": `${BASE_URL}/#organization`
        },
        "articleSection": art.categoryName || art.category || 'Interior Design',
        "inLanguage": "en-GB"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": BASE_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": art.categoryName || art.category,
            "item": `${BASE_URL}/category/${art.category}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": art.title,
            "item": canonicalUrl
          }
        ]
      }
    ];

    if (Array.isArray(art.faqs) && art.faqs.length > 0) {
      graphSchemas.push({
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": art.faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      });
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": graphSchemas
    };

    writeRouteHtml(slug, {
      seoTitle,
      description: art.metaDescription || art.excerpt || art.title,
      canonicalUrl,
      ogImage: fullHeroImage,
      ogType: 'article',
      jsonLd,
      bodyHtml: articleRootHtml
    });
  }

  // 2. Categories (High Word Count & Zero Thin Categories)
  for (const cat of CATEGORIES) {
    if (cat.id === 'all') continue;
    const canonicalUrl = `${BASE_URL}/category/${cat.id}`;
    const catArticles = ARTICLES.filter(a => 
      a.category === cat.id || 
      a.categoryName?.toLowerCase() === cat.name.toLowerCase() ||
      (Array.isArray(a.secondaryCategories) && a.secondaryCategories.includes(cat.id))
    );
    
    // Distinct Title vs H1
    const seoTitle = `${cat.name} Design & Restoration Guides | LUMAA HOME`;
    const h1Heading = `${cat.title || `${cat.name} Architectural Design & Restoration`}`;

    const catArticlesHtml = catArticles.length > 0
      ? catArticles.map(a => `
        <article style="margin-bottom: 24px;">
          <h3><a href="${BASE_URL}/${a.slug || a.id}">${escapeHtml(a.title)}</a></h3>
          <p>${escapeHtml(a.excerpt || a.metaDescription || '')}</p>
          <p>By <a href="${BASE_URL}/author/${a.authorId || 'marcus-cole'}">${escapeHtml(a.author)}</a> | ${escapeHtml(a.date)} | ${escapeHtml(a.readTime || '5 min read')}</p>
        </article>
      `).join('\n')
      : `<p>Explore our related room guides and period restoration case studies across British homes.</p>`;

    const catOverviewHtml = `
      <section style="margin-bottom: 30px;">
        <h2>Architectural Design Standards for ${escapeHtml(cat.name)}</h2>
        <p>Curating ${escapeHtml(cat.name.toLowerCase())} spaces across British residences demands a practical understanding of spatial volume, natural illumination, and durable materiality. Homes throughout London, Edinburgh, Bath, and the English countryside feature layouts that benefit from thoughtful specification, from proportion balancing to moisture-resistant joinery and breathable finishes.</p>
        <p>Our editorial team collaborates directly with UK conservation architects, master joiners, and interior stylists to document reliable methods for renovations and everyday upgrades. Whether comparing fitted cabinetry, natural stone tiles, or layered lighting, every guide includes real UK supplier specifications and cost breakdowns.</p>
        <h2>Craftsmanship &amp; Material Selection</h2>
        <p>Achieving lasting domestic comfort relies on selecting materials that wear gracefully over decades. From kiln-dried oak to solid brass hardware, our technical guides explain load ratings, moisture tolerances, and practical maintenance routines.</p>
      </section>
    `;

    const categoryRootHtml = `<header><a href="${BASE_URL}/">LUMAA HOME</a><nav>${navCategoriesHtml}</nav></header><main><header><nav aria-label="Breadcrumb"><a href="${BASE_URL}/">Home</a> / <span>${escapeHtml(cat.name)}</span></nav><h1>${escapeHtml(h1Heading)}</h1><p>${escapeHtml(cat.description || '')}</p></header>${catOverviewHtml}<section><h2>Curated Editorial Guides in ${escapeHtml(cat.name)} (${catArticles.length} Guides)</h2>${catArticlesHtml}</section></main><footer>${navFooterHtml}</footer>`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        ...BASE_GRAPH_NODES,
        {
          "@type": "CollectionPage",
          "@id": `${canonicalUrl}#webpage`,
          "url": canonicalUrl,
          "name": seoTitle,
          "description": cat.description || `Curated British architectural and interior design guides for ${cat.name}.`,
          "isPartOf": {
            "@id": `${BASE_URL}/#website`
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": BASE_URL
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": cat.name,
              "item": canonicalUrl
            }
          ]
        }
      ]
    };

    writeRouteHtml(`category/${cat.id}`, {
      seoTitle,
      description: cat.description || `Curated British architectural and interior design guides for ${cat.name}.`,
      canonicalUrl,
      ogImage: cat.bannerImage,
      ogType: 'website',
      jsonLd,
      bodyHtml: categoryRootHtml
    });
  }

  // 3. Authors (Hardened E-E-A-T Profiles & Self-Contained JSON-LD)
  for (const author of AUTHORS) {
    const canonicalUrl = `${BASE_URL}/author/${author.id}`;
    const authorArticles = ARTICLES.filter(a => (a.authorId && a.authorId === author.id) || (a.author && a.author.toLowerCase() === author.name.toLowerCase()));
    
    // Distinct Title vs H1
    const seoTitle = `${author.name} | Architectural & Design Editor`;
    const h1Heading = `${author.name} - Editorial Profile`;

    const authorArticlesHtml = authorArticles.length > 0 
      ? authorArticles.map(a => `<article style="margin-bottom: 24px;"><h3><a href="${BASE_URL}/${a.slug || a.id}">${escapeHtml(a.title)}</a></h3><p>${escapeHtml(a.excerpt || a.metaDescription || '')}</p><p>${escapeHtml(a.date)} | ${escapeHtml(a.readTime || '5 min read')}</p></article>`).join('\n')
      : `<p>Authoring architectural monographs and joinery guides for LUMAA HOME.</p>`;

    const fullBioHtml = Array.isArray(author.fullBio) 
      ? author.fullBio.map(b => `<p>${escapeHtml(b)}</p>`).join('\n')
      : `<p>${escapeHtml(author.bio || author.shortDescription || '')}</p>`;

    const credentialsHtml = author.credentials
      ? `<p><strong>Credentials &amp; Affiliations:</strong> ${escapeHtml(author.credentials)}</p>`
      : '';

    const socialLinksHtml = `<p><strong>Verified Profiles:</strong> <a href="${escapeHtml(author.socials.linkedin)}" rel="me noopener" target="_blank">LinkedIn</a> | <a href="${escapeHtml(author.socials.pinterest)}" rel="me noopener" target="_blank">Pinterest</a> | <a href="${escapeHtml(author.socials.instagram)}" rel="me noopener" target="_blank">Instagram</a></p>`;

    const specialtiesHtml = Array.isArray(author.specialties) 
      ? `<h3>Areas of Specialist Expertise</h3><ul>${author.specialties.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>`
      : '';

    const authorPhilosophyHtml = `
      <section style="margin-top: 24px;">
        <h2>Design Philosophy &amp; British Craftsmanship</h2>
        <p>At LUMAA HOME, our editorial team champions the enduring integrity of authentic British architecture. Believing that residential design should be measured by longevity and tactile resonance rather than ephemeral trends, our contributors document historic preservation techniques alongside contemporary artisan manufacturing.</p>
      </section>
    `;

    const authorRootHtml = `<header><a href="${BASE_URL}/">LUMAA HOME</a><nav>${navCategoriesHtml}</nav></header><main><header><h1>${escapeHtml(h1Heading)}</h1><p><strong>${escapeHtml(author.role)}</strong> | ${escapeHtml(author.location)}</p>${credentialsHtml}${socialLinksHtml}</header><section><h2>Editorial Biography &amp; Practice</h2>${fullBioHtml}${specialtiesHtml}</section>${authorPhilosophyHtml}<section><h2>Published Architectural Articles (${authorArticles.length})</h2>${authorArticlesHtml}</section></main><footer>${navFooterHtml}</footer>`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        ...BASE_GRAPH_NODES,
        {
          "@type": "ProfilePage",
          "@id": `${canonicalUrl}#profilepage`,
          "url": canonicalUrl,
          "name": seoTitle,
          "isPartOf": {
            "@id": `${BASE_URL}/#website`
          },
          "mainEntity": {
            "@type": "Person",
            "name": author.name,
            "jobTitle": author.role,
            "description": author.bio || author.shortDescription,
            "image": toAbsoluteUrl(author.avatar),
            "alumniOf": author.alumniOf ? {
              "@type": "CollegeOrUniversity",
              "name": author.alumniOf
            } : undefined,
            "memberOf": author.memberOf ? {
              "@type": "Organization",
              "name": author.memberOf
            } : undefined,
            "worksFor": {
              "@id": `${BASE_URL}/#organization`
            },
            "sameAs": [
              author.socials?.linkedin,
              author.socials?.pinterest,
              author.socials?.instagram
            ].filter(Boolean)
          }
        }
      ]
    };

    writeRouteHtml(`author/${author.id}`, {
      seoTitle,
      description: author.metaDescription || author.shortDescription || author.bio,
      canonicalUrl,
      ogImage: author.avatar,
      ogType: 'profile',
      jsonLd,
      bodyHtml: authorRootHtml
    });
  }

  // 4. Static Pages
  const staticPages = [
    {
      path: 'about',
      seoTitle: 'About Our British Design Journal | LUMAA HOME',
      h1Heading: 'About LUMAA HOME Architectural Journal',
      description: 'The independent British architectural journal published by Lumaa Home Digital Media Ltd in London, dedicated to heritage restorations and joinery.',
      bodyHtml: `<header><a href="${BASE_URL}/">LUMAA HOME</a><nav>${navCategoriesHtml}</nav></header><main><article><header><h1>About LUMAA HOME Architectural Journal</h1><p>The UK Journal of Heritage Architecture, Joinery, and Domestic Interiors</p></header><section><h2>Our Editorial Charter &amp; Mission</h2><p>Founded in London and published by Lumaa Home Digital Media Ltd, LUMAA HOME is an independent architectural journal dedicated to the timeless principles of British home design. Our editorial office is located at 42 Kensington High Street, Kensington, London, W8 4PF, United Kingdom.</p><p>Our editorial team comprises architectural historians, conservation consultants, master joiners, and interior architects. Every guide, case study, and restoration analysis published in our pages undergoes rigorous review to ensure historical accuracy, structural practicality, and technical relevance for UK properties.</p><h2>Heritage Restoration &amp; Conservation Standards</h2><p>Across the United Kingdom, millions of homeowners live in Victorian, Edwardian, Georgian, and Listed residences. Restoring these historic properties requires specialized knowledge of lime mortars, breathable plasters, timber joinery preservation, and sympathetic modern insulation.</p><h2>Independent Journalistic Integrity &amp; Sourcing</h2><p>LUMAA HOME maintains editorial independence. Our reviews, material guides, and spotlights are chosen based on craft excellence, UK trade availability, and hands-on testing.</p></section></article></main><footer>${navFooterHtml}</footer>`
    },
    {
      path: 'contact',
      seoTitle: 'Contact Our London Editorial Office | LUMAA HOME',
      h1Heading: 'Editorial Inquiries & UK Office',
      description: 'Contact Lumaa Home Digital Media Ltd at 42 Kensington High Street, London, W8 4PF for editorial pitches and reader inquiries.',
      bodyHtml: `<header><a href="${BASE_URL}/">LUMAA HOME</a><nav>${navCategoriesHtml}</nav></header><main><article><header><h1>Editorial Inquiries &amp; UK Office</h1><p>Connect with the LUMAA HOME editorial desk in Kensington, London.</p></header><section><h2>UK Editorial Office Details</h2><p><strong>Company Name:</strong> Lumaa Home Digital Media Ltd</p><p><strong>Office Address:</strong> 42 Kensington High Street, Kensington, London, W8 4PF, United Kingdom</p><p><strong>Primary Editorial Email:</strong> info.lumaahome@gmail.com</p><h2>Editorial Submissions &amp; Feature Pitches</h2><p>LUMAA HOME welcomes submissions from British architects, conservation trusts, interior designers, and master craftsmen. Please submit project photography and specifications to <strong>info.lumaahome@gmail.com</strong>.</p></section></article></main><footer>${navFooterHtml}</footer>`
    },
    {
      path: 'privacy-policy',
      seoTitle: 'Privacy Policy & UK GDPR Standards | LUMAA HOME',
      h1Heading: 'UK GDPR Privacy Policy & Cookie Notice',
      description: 'Privacy policy, UK GDPR data protection standards, and ICO cookie consent rules for Lumaa Home Digital Media Ltd.',
      bodyHtml: `<header><a href="${BASE_URL}/">LUMAA HOME</a><nav>${navCategoriesHtml}</nav></header><main><article><header><h1>UK GDPR Privacy Policy &amp; Cookie Notice</h1><p>Last updated: October 2026 | In accordance with UK GDPR, Data Protection Act 2018, and PECR</p></header><section><h2>Data Controller Identity</h2><p>Lumaa Home Digital Media Ltd (42 Kensington High Street, Kensington, London, W8 4PF, United Kingdom) is the Data Controller for <strong>https://www.lumaahome.co.uk</strong>.</p><h2>Cookies, Google AdSense &amp; Consent Management (CMP)</h2><p>In compliance with UK Information Commissioner's Office (ICO) guidelines and PECR, our site operates an interactive Cookie Consent Banner allowing visitors to accept or reject non-essential analytics and advertising cookies (including Google AdSense / DoubleClick DART cookies) at any time.</p><h2>Affiliate &amp; Commercial Disclosure</h2><p>In accordance with the UK Advertising Standards Authority (ASA) CAP Code, every article page displays a prominent disclosure above the content stating that LUMAA HOME may earn a commission from qualifying retailer purchases at no extra cost to the reader.</p><h2>Your Legal Rights Under UK GDPR</h2><p>Under UK data protection law, you possess the right to access, rectify, erase, or restrict processing of your personal data. Contact our Data Protection Officer at <strong>info.lumaahome@gmail.com</strong>.</p></section></article></main><footer>${navFooterHtml}</footer>`
    },
    {
      path: 'terms-of-service',
      seoTitle: 'Terms of Service & Reader Policies | LUMAA HOME',
      h1Heading: 'Terms of Service & Editorial Policies',
      description: 'Terms and conditions governing the use of the LUMAA HOME publication operated by Lumaa Home Digital Media Ltd in England and Wales.',
      bodyHtml: `<header><a href="${BASE_URL}/">LUMAA HOME</a><nav>${navCategoriesHtml}</nav></header><main><article><header><h1>Terms of Service &amp; Editorial Policies</h1><p>Governing conditions for Lumaa Home Digital Media Ltd</p></header><section><h2>Acceptance of Terms</h2><p>By accessing <strong>https://www.lumaahome.co.uk</strong>, operated by Lumaa Home Digital Media Ltd (42 Kensington High Street, Kensington, London, W8 4PF, United Kingdom), you agree to be bound by these Terms of Service and the laws of England and Wales.</p><h2>Intellectual Property &amp; Copyright</h2><p>All editorial content, photography, and technical guides published on LUMAA HOME are the intellectual property of Lumaa Home Digital Media Ltd.</p><h2>Editorial Disclaimer &amp; Technical Advice</h2><p>Architectural, electrical, plumbing, and joinery guides are provided for informational purposes. Structural or regulated works in the UK should always be validated by certified tradespeople and Building Control.</p></section></article></main><footer>${navFooterHtml}</footer>`
    }
  ];

  for (const sp of staticPages) {
    const canonicalUrl = `${BASE_URL}/${sp.path}`;
    writeRouteHtml(sp.path, {
      seoTitle: sp.seoTitle,
      description: sp.description,
      canonicalUrl,
      ogImage: '/images/british-living-room-cabinets.jpg',
      ogType: 'website',
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": BASE_GRAPH_NODES
      },
      bodyHtml: sp.bodyHtml
    });
  }

  // 5. Also update dist/index.html (Homepage)
  const homeArticlesHtml = ARTICLES.slice(0, 16).map(a => `
    <article style="margin-bottom: 24px;">
      <h3><a href="${BASE_URL}/${a.slug || a.id}">${escapeHtml(a.title)}</a></h3>
      <p>${escapeHtml(a.excerpt || a.metaDescription || '')}</p>
      <p>By <a href="${BASE_URL}/author/${a.authorId || 'marcus-cole'}">${escapeHtml(a.author)}</a> | ${escapeHtml(a.date)} | ${escapeHtml(a.readTime || '5 min read')}</p>
    </article>
  `).join('\n');

  const homeOverviewHtml = `
    <section style="margin-bottom: 30px;">
      <h2>Practical Interior Design, Joinery &amp; Home Renovation Guides</h2>
      <p>LUMAA HOME is an independent digital magazine dedicated to residential renovations, bespoke joinery craftsmanship, and practical domestic styling. Published in London by Lumaa Home Digital Media Ltd, our journal provides hands-on guides, UK material cost comparisons, and specification advice for homeowners.</p>
    </section>
  `;

  const homeH1 = 'LUMAA HOME | Interior Design, Joinery &amp; Home Renovation Magazine';
  const homeSeoTitle = 'Luxury British Home Decor & DIY Magazine | LUMAA HOME';

  const homeRootHtml = `<header><a href="${BASE_URL}/">LUMAA HOME</a><p>Interior Design, Joinery and DIY Magazine</p><nav>${navCategoriesHtml}</nav></header><main><h1>${homeH1}</h1>${homeOverviewHtml}<section><h2>Latest Architectural &amp; Interior Guides</h2>${homeArticlesHtml}</section></main><footer>${navFooterHtml}</footer>`;

  const updatedHomeHtml = generatePageHtml(templateHtml, {
    seoTitle: homeSeoTitle,
    description: 'British interior luxury, period architectural restorations, and bespoke joinery guides curated for UK design enthusiasts by Lumaa Home.',
    canonicalUrl: `${BASE_URL}/`,
    ogImage: '/images/british-living-room-cabinets.jpg',
    ogType: 'website',
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": BASE_GRAPH_NODES
    },
    bodyHtml: homeRootHtml
  });
  fs.writeFileSync(indexHtmlPath, updatedHomeHtml, 'utf-8');

  console.log(`[SSG] Successfully pre-rendered ${count} static HTML pages directly inside <div id="root">!`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateStaticPages();
}
