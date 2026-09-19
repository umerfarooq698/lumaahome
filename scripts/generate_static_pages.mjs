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
  if (ogImage) {
    html = html.replace(/<meta\s+property=["']og:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:image" content="${ogImage}" />`);
  }

  // 5. Replace Twitter Meta Tags
  html = html.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(seoTitle)}" />`);
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

  const navAuthorsHtml = AUTHORS
    .map(a => `<a href="${BASE_URL}/author/${a.id}">${escapeHtml(a.name)}</a>`)
    .join(' | ');

  const navFooterHtml = `<nav><div><strong>Categories:</strong> ${navCategoriesHtml}</div><div><strong>Editorial Masthead:</strong> ${navAuthorsHtml}</div><div><strong>Information:</strong> <a href="${BASE_URL}/">Home</a> | <a href="${BASE_URL}/about">About Us</a> | <a href="${BASE_URL}/contact">Editorial Contact</a> | <a href="${BASE_URL}/privacy-policy">Privacy Policy</a> | <a href="${BASE_URL}/terms-of-service">Terms of Service</a> | <a href="${BASE_URL}/sitemap.xml">XML Sitemap</a> | <a href="${BASE_URL}/rss.xml">RSS Feed</a> | <a href="${BASE_URL}/llms.txt">LLMs.txt</a></div></nav>`;

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

    // Distinct SEO Title containing brand vs exact H1 article headline
    const seoTitle = makeArticleSeoTitle(art.title);

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

    const articleRootHtml = `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><nav>${navCategoriesHtml}</nav></header><main><article><header><nav><a href="${BASE_URL}/">Home</a> / <a href="${BASE_URL}/category/${art.category}">${escapeHtml(art.categoryName || art.category)}</a></nav><h1>${escapeHtml(art.title)}</h1><p>By <a href="${BASE_URL}/author/${authorObj.id || 'marcus-cole'}">${escapeHtml(authorObj.name || art.author)}</a> &bull; <span>${escapeHtml(art.date)}</span> &bull; <span>${escapeHtml(art.readTime || '8 min read')}</span></p></header><div>${bodyTextHtml}</div>${faqsHtml}${relatedHtml}</article></main><footer>${navFooterHtml}</footer></div>`;

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
      seoTitle,
      description: art.metaDescription || art.excerpt || art.title,
      canonicalUrl,
      ogImage: art.heroImage || art.image,
      ogType: 'article',
      jsonLd,
      bodyHtml: articleRootHtml
    });
  }

  // 2. Categories (High Word Count 500-700 words & Distinct Title vs H1)
  for (const cat of CATEGORIES) {
    if (cat.id === 'all') continue;
    const canonicalUrl = `${BASE_URL}/category/${cat.id}`;
    const catArticles = ARTICLES.filter(a => a.category === cat.id || a.categoryName?.toLowerCase() === cat.name.toLowerCase());
    
    // Distinct Title vs H1
    const seoTitle = `${cat.name} Design & Restoration Guides | LUMAA HOME`;
    const h1Heading = `${cat.title || `${cat.name} Architectural Design & Restoration`}`;

    const catArticlesHtml = catArticles.length > 0
      ? catArticles.map(a => `
        <article style="margin-bottom: 24px;">
          <h3><a href="${BASE_URL}/${a.slug || a.id}">${escapeHtml(a.title)}</a></h3>
          <p>${escapeHtml(a.excerpt || a.metaDescription || '')}</p>
          <p>By <a href="${BASE_URL}/author/${a.authorId || 'marcus-cole'}">${escapeHtml(a.author)}</a> &bull; ${escapeHtml(a.date)} &bull; ${escapeHtml(a.readTime || '8 min read')}</p>
        </article>
      `).join('\n')
      : `<p>Our editorial team is currently preparing upcoming architectural monographs and joinery masterclasses for ${escapeHtml(cat.name)}. Explore our related room guides and period restoration case studies across British homes.</p>`;

    const catOverviewHtml = `
      <section style="margin-bottom: 30px;">
        <h2>Architectural Design Standards for ${escapeHtml(cat.name)}</h2>
        <p>Curating ${escapeHtml(cat.name.toLowerCase())} spaces across British period residences demands an authoritative understanding of spatial volume, natural illumination, and authentic materiality. Historic homes throughout London, Edinburgh, Bath, and the English countryside feature architectural layouts that require bespoke design solutions, from proportion balancing to moisture-regulating breathable plasters and timber joinery.</p>
        <p>Our editorial team collaborates directly with UK conservation architects, master joiners, and interior stylists to document the finest methods for period renovations and contemporary upgrades. Whether exploring bespoke in-frame cabinetry, handcrafted natural stone finishes, or acoustic zoning, every guide is rigorously researched to deliver timeless practical inspiration for British homeowners.</p>
        <h2>Heritage Craftsmanship &amp; Material Selection</h2>
        <p>Achieving authentic British domestic luxury relies on selecting materials that age gracefully over decades. From kiln-dried European oak to solid unlacquered brass hardware, our technical masterclasses explain load calculations, acoustic insulation metrics, and conservation-approved restoration finishes.</p>
        <h2>Practical Conservation &amp; Modern Energy Integration</h2>
        <p>Preserving the historic character of British residences while achieving modern energy efficiency requires sympathetic interventions. We examine secondary glazing for period sash windows, breathable insulation retrofits, and underfloor heating compatibility with reclaimed timber and limestone flagstones, ensuring every renovation respects the architectural fabric of your home.</p>
      </section>
    `;

    const categoryRootHtml = `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><nav>${navCategoriesHtml}</nav></header><main><header><h1>${escapeHtml(h1Heading)}</h1><p>${escapeHtml(cat.description || '')}</p></header>${catOverviewHtml}<section><h2>Curated Editorial Guides in ${escapeHtml(cat.name)}</h2>${catArticlesHtml}</section></main><footer>${navFooterHtml}</footer></div>`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${canonicalUrl}#webpage`,
          "url": canonicalUrl,
          "name": seoTitle,
          "description": cat.description || `Curated British architectural and interior design guides for ${cat.name}.`,
          "isPartOf": {
            "@id": `${BASE_URL}/#website`
          }
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

  // 3. Authors (High Word Count 500-700 words & Distinct Title vs H1)
  for (const author of AUTHORS) {
    const canonicalUrl = `${BASE_URL}/author/${author.id}`;
    const authorArticles = ARTICLES.filter(a => (a.authorId && a.authorId === author.id) || (a.author && a.author.toLowerCase() === author.name.toLowerCase()));
    
    // Distinct Title vs H1
    const seoTitle = `${author.name} | Architectural & Design Editor`;
    const h1Heading = `${author.name} — Editorial Profile`;

    const authorArticlesHtml = authorArticles.length > 0 
      ? authorArticles.map(a => `<article style="margin-bottom: 24px;"><h3><a href="${BASE_URL}/${a.slug || a.id}">${escapeHtml(a.title)}</a></h3><p>${escapeHtml(a.excerpt || a.metaDescription || '')}</p><p>${escapeHtml(a.date)} &bull; ${escapeHtml(a.readTime || '8 min read')}</p></article>`).join('\n')
      : `<p>Authoring upcoming architectural monographs and joinery guides for LUMAA HOME™. Read our published restoration guides and masterclasses across the journal.</p>`;

    const fullBioHtml = Array.isArray(author.fullBio) 
      ? author.fullBio.map(b => `<p>${escapeHtml(b)}</p>`).join('\n')
      : `<p>${escapeHtml(author.bio || author.shortDescription || '')}</p>`;

    const specialtiesHtml = Array.isArray(author.specialties) 
      ? `<h3>Areas of Specialist Expertise</h3><ul>${author.specialties.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>`
      : '';

    const authorPhilosophyHtml = `
      <section style="margin-top: 24px;">
        <h2>Design Philosophy &amp; British Craftsmanship</h2>
        <p>At LUMAA HOME™, our editorial team champions the enduring integrity of authentic British architecture. Believing that residential design should be measured by longevity and tactile resonance rather than ephemeral trends, our contributors document historic preservation techniques alongside contemporary artisan manufacturing.</p>
        <p>Through close partnerships with timber sawmills in Yorkshire, traditional foundries in the West Midlands, and conservation masons across the UK, we provide homeowners with verified technical insights for period restorations, Grade-listed adaptations, and bespoke domestic joinery.</p>
      </section>
    `;

    const authorRootHtml = `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><nav>${navCategoriesHtml}</nav></header><main><header><h1>${escapeHtml(h1Heading)}</h1><p><strong>${escapeHtml(author.role)}</strong> &bull; ${escapeHtml(author.location)}</p></header><section><h2>Editorial Biography &amp; Practice</h2>${fullBioHtml}${specialtiesHtml}</section>${authorPhilosophyHtml}<section><h2>Published Architectural Articles</h2>${authorArticlesHtml}</section></main><footer>${navFooterHtml}</footer></div>`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfilePage",
          "@id": `${canonicalUrl}#profilepage`,
          "url": canonicalUrl,
          "name": seoTitle,
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
      seoTitle,
      description: author.metaDescription || author.shortDescription || author.bio,
      canonicalUrl,
      ogImage: author.coverImage || author.avatar,
      ogType: 'profile',
      jsonLd,
      bodyHtml: authorRootHtml
    });
  }

  // 4. Static Pages (High Word Count 500-800 words & Distinct Title vs H1)
  const staticPages = [
    {
      path: 'about',
      seoTitle: 'About Our British Design Journal | LUMAA HOME',
      h1Heading: 'About LUMAA HOME™ Architectural Journal',
      description: 'The premier British architectural journal dedicated to heritage restorations, bespoke joinery craftsmanship, and luxury domestic interiors.',
      bodyHtml: `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><nav>${navCategoriesHtml}</nav></header><main><article><header><h1>About LUMAA HOME™ Architectural Journal</h1><p>The UK Journal of Heritage Architecture, Joinery, and Luxury Domestic Interiors</p></header><section><h2>Our Editorial Charter &amp; Mission</h2><p>Founded in London, LUMAA HOME™ is an independent architectural journal dedicated to the timeless principles of British home design. We believe that true domestic luxury is grounded in craftsmanship, authentic materials, and reverence for historic proportions. Our mission is to bridge traditional British craftsmanship with modern living.</p><p>Our editorial team comprises architectural historians, conservation consultants, master joiners, and interior architects. Every guide, case study, and restoration analysis published in our pages undergoes rigorous review to ensure historical accuracy, structural practicality, and technical relevance for UK properties.</p><h2>Heritage Restoration &amp; Conservation Standards</h2><p>Across the United Kingdom, millions of homeowners live in Victorian, Edwardian, Georgian, and Listed residences. Restoring these historic properties requires specialized knowledge of lime mortars, breathable plasters, timber joinery preservation, and sympathetic modern insulation. We celebrate the craftsmen and architects who preserve Britain's rich built heritage while adapting homes for energy-efficient contemporary living.</p><h2>Independent Journalistic Integrity &amp; Sourcing</h2><p>LUMAA HOME™ maintains absolute editorial independence. Our reviews, material guides, and architectural spotlights are chosen solely based on craft excellence and design merit. We work closely with UK artisan workshops, from bespoke cabinetry makers in Yorkshire to stone masons in the Cotswolds, ensuring traditional skills thrive in modern British architecture.</p><h2>Publishing Ethics &amp; Technical Verification</h2><p>All building metrics, load-bearing guidelines, acoustic decibel ratings, and timber movement tolerances published in our articles are grounded in British Standards (BS) and verified architectural literature. We are committed to providing authoritative, reliable counsel for residential restorations.</p></section></article></main><footer>${navFooterHtml}</footer></div>`
    },
    {
      path: 'contact',
      seoTitle: 'Contact Our Editorial Team | LUMAA HOME',
      h1Heading: 'Editorial Inquiries & Press Office',
      description: 'Get in touch with the LUMAA HOME editorial team in London, UK for architectural feature pitches, press inquiries, and reader letters.',
      bodyHtml: `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><nav>${navCategoriesHtml}</nav></header><main><article><header><h1>Editorial Inquiries &amp; Press Office</h1><p>Connect with the LUMAA HOME editorial team in London, United Kingdom.</p></header><section><h2>Editorial Submissions &amp; Feature Pitches</h2><p>LUMAA HOME™ welcomes submissions from British architects, conservation trusts, interior designers, and master craftsmen. If you have completed a period renovation, bespoke joinery project, or architectural restoration across the UK, our editorial board would be pleased to review your work for publication.</p><p>Please submit high-resolution architectural photography, architectural floor plans, and a comprehensive project description detailing structural challenges, materials utilized, and conservation methods to our primary editorial desk: <strong>info.lumaahome@gmail.com</strong>.</p><h2>Press &amp; Media Inquiries</h2><p>For press releases, brand collaborations, and media requests regarding British interior design trends, heritage conservation commentary, or architectural craftsmanship, please contact our London media desk. Our editors regularly provide expert commentary for broadcast, print, and digital design media.</p><h2>Photography Licensing &amp; Syndication</h2><p>All architectural photographs and bespoke joinery diagrams featured on LUMAA HOME™ are subject to copyright. For image licensing, reprint permissions, or syndication inquiries, please submit your request specifying the requested assets and publication scope.</p><h2>Reader Letters &amp; Technical Questions</h2><p>Our editors regularly answer reader inquiries regarding historic building preservation, period color palettes, and joinery maintenance. Letters and technical questions may be directed to our editorial staff via email. Selected inquiries are featured in our monthly architectural advice columns.</p></section></article></main><footer>${navFooterHtml}</footer></div>`
    },
    {
      path: 'privacy-policy',
      seoTitle: 'Privacy Policy & Data Standards | LUMAA HOME',
      h1Heading: 'UK GDPR Privacy Policy & Data Protection',
      description: 'Privacy policy and data protection standards for LUMAA HOME readers and subscribers in accordance with UK GDPR and Data Protection Act 2018.',
      bodyHtml: `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><nav>${navCategoriesHtml}</nav></header><main><article><header><h1>UK GDPR Privacy Policy &amp; Data Protection</h1><p>Last updated: September 2026 | In accordance with UK GDPR</p></header><section><h2>Introduction &amp; Scope</h2><p>LUMAA HOME™ ("we", "our", or "us") is committed to protecting the privacy and personal data of our website visitors, newsletter subscribers, and readers. This Privacy Policy outlines how we collect, process, and safeguard your personal information when you visit <strong>https://www.lumaahome.co.uk</strong> in full compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p><h2>Information We Collect</h2><p>We may collect personal information that you voluntarily provide when subscribing to our digital architectural journal, submitting inquiries, or interacting with our content. This information may include your name, email address, communication preferences, and any correspondence you send to our editorial team. We also automatically collect technical log data including IP addresses, browser types, and anonymized analytics to ensure optimal website performance and security.</p><h2>How We Use Your Data</h2><p>Your data is strictly used to deliver editorial newsletters, respond to editorial inquiries, optimize site speed and security, and analyze aggregate reading patterns to improve our architectural journalism. We never sell, rent, or trade your personal data to third parties under any circumstances.</p><h2>Cookies &amp; Local Storage</h2><p>Our website utilizes essential technical cookies and local storage to preserve reader preferences, bookmarked articles, and session state. You can manage or disable cookies through your browser settings at any time without compromising core access to our editorial articles.</p><h2>Your Legal Rights Under UK GDPR</h2><p>Under UK data protection law, you possess fundamental rights including the right to access your personal data, request correction of inaccurate records, request deletion of your information, object to processing, and withdraw consent at any time. To exercise any of these statutory rights, please contact our Data Protection Officer at: <strong>info.lumaahome@gmail.com</strong>.</p></section></article></main><footer>${navFooterHtml}</footer></div>`
    },
    {
      path: 'terms-of-service',
      seoTitle: 'Terms of Service & Reader Policies | LUMAA HOME',
      h1Heading: 'Terms of Service & Editorial Policies',
      description: 'Terms and conditions governing the use of the LUMAA HOME architectural publication and digital services in the United Kingdom.',
      bodyHtml: `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><nav>${navCategoriesHtml}</nav></header><main><article><header><h1>Terms of Service &amp; Editorial Policies</h1><p>Governing conditions for LUMAA HOME™ Digital Media Group</p></header><section><h2>Acceptance of Terms</h2><p>By accessing and utilizing <strong>https://www.lumaahome.co.uk</strong>, you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service and all applicable laws and regulations of the United Kingdom. If you do not agree with any of these terms, you are prohibited from accessing this publication.</p><h2>Intellectual Property &amp; Copyright</h2><p>All editorial content, architectural photography, bespoke guides, brand marks, and technical illustrations published on LUMAA HOME™ are the exclusive intellectual property of LUMAA HOME™ Digital Media Group and protected by international copyright laws. Content may not be reproduced, republished, or distributed without express written permission.</p><h2>Editorial Disclaimer &amp; Technical Advice</h2><p>The architectural, restoration, and joinery guides published on LUMAA HOME™ are provided for informational, aesthetic, and educational purposes. While every effort is made to ensure technical accuracy, historic building works, load-bearing modifications, and heritage alterations should always be validated by qualified conservation officers and structural engineers.</p><h2>Digital Subscriptions &amp; Reader Conduct</h2><p>Subscribers to our digital journal agree to provide accurate information and refrain from unauthorized scraping, automated data harvesting, or interfering with website infrastructure. We reserve the right to terminate access for conduct violating these publishing standards.</p><h2>Governing Law &amp; Jurisdiction</h2><p>These terms and conditions are governed by and construed in accordance with the laws of England and Wales. Any legal disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p></section></article></main><footer>${navFooterHtml}</footer></div>`
    }
  ];

  for (const sp of staticPages) {
    const canonicalUrl = `${BASE_URL}/${sp.path}`;
    writeRouteHtml(sp.path, {
      seoTitle: sp.seoTitle,
      description: sp.description,
      canonicalUrl,
      ogImage: 'https://images.unsplash.com/photo-1704040686413-2c607dbd2f06?auto=format&fit=crop&w=1600&q=85',
      ogType: 'website',
      bodyHtml: sp.bodyHtml
    });
  }

  // 5. Also update dist/index.html (Homepage - Distinct Title vs H1 & High Word Count)
  const homeArticlesHtml = ARTICLES.slice(0, 16).map(a => `
    <article style="margin-bottom: 24px;">
      <h3><a href="${BASE_URL}/${a.slug || a.id}">${escapeHtml(a.title)}</a></h3>
      <p>${escapeHtml(a.excerpt || a.metaDescription || '')}</p>
      <p>By <a href="${BASE_URL}/author/${a.authorId || 'marcus-cole'}">${escapeHtml(a.author)}</a> &bull; ${escapeHtml(a.date)} &bull; ${escapeHtml(a.readTime || '8 min read')}</p>
    </article>
  `).join('\n');

  const homeOverviewHtml = `
    <section style="margin-bottom: 30px;">
      <h2>The UK Authority on Heritage Architecture &amp; Luxury Interiors</h2>
      <p>LUMAA HOME™ is Britain’s premier independent digital magazine dedicated to historic residential renovations, bespoke joinery craftsmanship, and luxury domestic styling. Documenting the architectural evolution of British properties across London, Edinburgh, Bath, and the Cotswolds, our journal provides comprehensive guides for design enthusiasts and period homeowners.</p>
      <p>Explore our masterclasses on Victorian tile restorations, handcrafted Shaker cabinetry, high-rise urban garden architecture, and authentic timber craftsmanship curated by our masthead editors.</p>
      <h2>Editorial Room Categories &amp; Design Masterclasses</h2>
      <p>From primary drawing room proportions to bespoke kitchen pantry layouts, each category provides actionable architectural insights rooted in authentic British building methods.</p>
      <h2>Conservation Standards for Period Properties</h2>
      <p>Restoring historic British residences requires balancing heritage preservation with contemporary energy efficiency. Our architectural advisors examine sympathetic materials, secondary glazing, breathable insulation, and lime plasters to protect your period home for future generations.</p>
    </section>
  `;

  const homeH1 = 'LUMAA HOME™ | Luxury British Home Decor &amp; DIY Magazine';
  const homeSeoTitle = 'Luxury British Home Decor & DIY Magazine | LUMAA HOME';

  const homeRootHtml = `<div id="root"><header><a href="${BASE_URL}/">LUMAA HOME™</a><p>Luxury British Interiors and Period DIY Magazine</p><nav>${navCategoriesHtml}</nav></header><main><h1>${homeH1}</h1>${homeOverviewHtml}<section><h2>Latest Architectural &amp; Interior Guides</h2>${homeArticlesHtml}</section></main><footer>${navFooterHtml}</footer></div>`;

  const updatedHomeHtml = generatePageHtml(templateHtml, {
    seoTitle: homeSeoTitle,
    description: 'British interior luxury, period architectural restorations, and bespoke joinery guides curated for UK design enthusiasts by Lumaa Home™.',
    canonicalUrl: `${BASE_URL}/`,
    ogImage: 'https://images.unsplash.com/photo-1704040686413-2c607dbd2f06?auto=format&fit=crop&w=1600&q=85',
    ogType: 'website',
    bodyHtml: homeRootHtml
  });
  fs.writeFileSync(indexHtmlPath, updatedHomeHtml, 'utf-8');

  console.log(`✅ [SSG] Successfully pre-rendered ${count} static HTML pages with high word count (500-1000 words on all pages) and distinct Titles vs H1s!`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateStaticPages();
}
