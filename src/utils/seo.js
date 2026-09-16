/**
 * LUMAA HOME™ Advanced SEO & Structured Data (JSON-LD) Engine
 */

export const SITE_URL = 'https://www.lumaahome.co.uk';
export const SITE_NAME = 'LUMAA HOME™';
export const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1704040686413-2c607dbd2f06?auto=format&fit=crop&w=1600&q=85';
export const DEFAULT_DESCRIPTION = 'British interior luxury, period architectural restorations, and bespoke joinery guides curated for UK design enthusiasts by Lumaa Home™.';

export function cleanMetaDescription(str) {
  if (!str) return DEFAULT_DESCRIPTION;
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
  return cleaned || DEFAULT_DESCRIPTION;
}

function setMetaTag(key, value, isProperty = false) {
  if (!value) return;
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setCanonicalUrl(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setJsonLd(schemaOrArray) {
  let script = document.getElementById('lumaa-seo-schema');
  if (!script) {
    script = document.createElement('script');
    script.id = 'lumaa-seo-schema';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  if (!schemaOrArray) {
    script.textContent = '';
    return;
  }

  const payload = Array.isArray(schemaOrArray)
    ? {
        '@context': 'https://schema.org',
        '@graph': schemaOrArray
      }
    : {
        '@context': 'https://schema.org',
        ...schemaOrArray
      };

  script.textContent = JSON.stringify(payload);
}

/**
 * Universal SEO updater for dynamic route changes
 */
export function updatePageSeo({
  title,
  description,
  keywords,
  canonicalPath = '',
  ogType = 'website',
  image,
  author,
  publishedTime,
  modifiedTime,
  section,
  jsonLd
}) {
  const fullTitle = title ? (title.includes('LUMAA HOME') ? title : `${title} | ${SITE_NAME}`) : `${SITE_NAME} | A Luxury UK Home Decor and DIY Magazine`;
  const fullDesc = cleanMetaDescription(description);
  const fullImage = image || DEFAULT_OG_IMAGE;
  
  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`;

  // 1. Document Title
  document.title = fullTitle;

  // 2. Standard Meta Tags
  setMetaTag('description', fullDesc);
  if (keywords) setMetaTag('keywords', keywords);
  setMetaTag('author', author || 'LUMAA HOME Editorial Team');
  setMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  setMetaTag('googlebot', 'index, follow, max-snippet:-1, max-image-preview:large');
  
  // 3. Canonical Link
  setCanonicalUrl(canonicalUrl);

  // 4. OpenGraph Tags (Facebook / WhatsApp / LinkedIn / Pinterest)
  setMetaTag('og:site_name', SITE_NAME, true);
  setMetaTag('og:locale', 'en_GB', true);
  setMetaTag('og:type', ogType, true);
  setMetaTag('og:title', fullTitle, true);
  setMetaTag('og:description', fullDesc, true);
  setMetaTag('og:url', canonicalUrl, true);
  setMetaTag('og:image', fullImage, true);
  setMetaTag('og:image:alt', fullTitle, true);

  if (ogType === 'article') {
    if (publishedTime) setMetaTag('article:published_time', publishedTime, true);
    if (modifiedTime) setMetaTag('article:modified_time', modifiedTime, true);
    if (section) setMetaTag('article:section', section, true);
    if (author) setMetaTag('article:author', author, true);
  }

  // 5. Twitter Card Tags
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:site', '@LumaaHome');
  setMetaTag('twitter:title', fullTitle);
  setMetaTag('twitter:description', fullDesc);
  setMetaTag('twitter:image', fullImage);
  setMetaTag('twitter:image:alt', fullTitle);

  // 6. JSON-LD Structured Data Schema
  if (jsonLd) {
    setJsonLd(jsonLd);
  }
}

/**
 * Build WebSite & Organization Schema for Homepage
 */
export function buildWebSiteJsonLd() {
  return [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      'url': SITE_URL,
      'name': SITE_NAME,
      'description': DEFAULT_DESCRIPTION,
      'publisher': {
        '@id': `${SITE_URL}/#organization`
      },
      'inLanguage': 'en-GB',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${SITE_URL}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      'name': 'LUMAA HOME DIGITAL MEDIA GROUP',
      'url': SITE_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_URL}/favicon.svg`,
        'caption': SITE_NAME
      },
      'sameAs': [
        'https://instagram.com',
        'https://pinterest.com'
      ]
    }
  ];
}

/**
 * Build Article & FAQ & Breadcrumb Schemas for Article Pages
 */
export function buildArticleJsonLd(article, authorObj) {
  const slug = article.slug || article.id;
  const articleUrl = `${SITE_URL}/${slug}`;
  const authorName = authorObj?.name || article.author || 'Lumaa Home Editorial';
  const authorUrl = authorObj?.id ? `${SITE_URL}/author/${authorObj.id}` : SITE_URL;

  const schemas = [
    {
      '@type': 'NewsArticle',
      '@id': `${articleUrl}/#article`,
      'isPartOf': {
        '@id': `${SITE_URL}/#website`
      },
      'headline': article.title,
      'description': article.metaDescription || article.excerpt || article.title,
      'image': [
        article.heroImage || article.image || DEFAULT_OG_IMAGE
      ],
      'datePublished': article.date ? new Date(article.date).toISOString() : new Date().toISOString(),
      'dateModified': article.date ? new Date(article.date).toISOString() : new Date().toISOString(),
      'mainEntityOfPage': articleUrl,
      'author': {
        '@type': 'Person',
        'name': authorName,
        'url': authorUrl,
        'jobTitle': authorObj?.role || 'Senior Contributor'
      },
      'publisher': {
        '@type': 'Organization',
        'name': SITE_NAME,
        'url': SITE_URL,
        'logo': {
          '@type': 'ImageObject',
          'url': `${SITE_URL}/favicon.svg`
        }
      },
      'articleSection': article.categoryName || article.category || 'Architecture',
      'inLanguage': 'en-GB'
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${articleUrl}/#breadcrumb`,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': SITE_URL
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': (article.categoryName || article.category || 'Stories').toUpperCase(),
          'item': `${SITE_URL}/category/${article.category || 'interiors'}`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': article.title,
          'item': articleUrl
        }
      ]
    }
  ];

  // If article has FAQs, attach FAQPage schema for Google Rich Snippets
  if (Array.isArray(article.faqs) && article.faqs.length > 0) {
    schemas.push({
      '@type': 'FAQPage',
      '@id': `${articleUrl}/#faq`,
      'mainEntity': article.faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    });
  }

  return schemas;
}

/**
 * Build CollectionPage Schema for Category Archive
 */
export function buildCategoryJsonLd(categoryInfo, articles = []) {
  const catUrl = `${SITE_URL}/category/${categoryInfo.id}`;

  return [
    {
      '@type': 'CollectionPage',
      '@id': `${catUrl}/#collection`,
      'url': catUrl,
      'name': `${categoryInfo.name} Editorial Archive | ${SITE_NAME}`,
      'description': categoryInfo.description || `Curated British home guides for ${categoryInfo.name}.`,
      'inLanguage': 'en-GB',
      'hasPart': articles.slice(0, 10).map((a, idx) => ({
        '@type': 'Article',
        'position': idx + 1,
        'headline': a.title,
        'url': `${SITE_URL}/${a.slug || a.id}`
      }))
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${catUrl}/#breadcrumb`,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': SITE_URL
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': categoryInfo.name,
          'item': catUrl
        }
      ]
    }
  ];
}

/**
 * Build Author/Person Schema for Author Profile
 */
export function buildAuthorJsonLd(author, articles = []) {
  const authorUrl = `${SITE_URL}/author/${author.id}`;

  return [
    {
      '@type': 'ProfilePage',
      '@id': `${authorUrl}/#profile`,
      'url': authorUrl,
      'name': `${author.name} | Editorial Masthead`,
      'mainEntity': {
        '@type': 'Person',
        'name': author.name,
        'jobTitle': author.role,
        'description': author.shortDescription || author.bio,
        'image': author.avatar,
        'worksFor': {
          '@type': 'Organization',
          'name': 'LUMAA HOME DIGITAL MEDIA GROUP',
          'url': SITE_URL
        },
        'sameAs': [
          author.socials?.instagram,
          author.socials?.linkedin
        ].filter(Boolean)
      }
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${authorUrl}/#breadcrumb`,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': SITE_URL
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Masthead Editors',
          'item': `${SITE_URL}/about`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': author.name,
          'item': authorUrl
        }
      ]
    }
  ];
}
