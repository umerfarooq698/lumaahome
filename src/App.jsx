import React, { useState, useEffect, useCallback } from 'react';
import { ARTICLES, CATEGORIES } from './data/articles';
import { AUTHORS } from './data/authors';
import TopBar from './components/TopBar';
import Header from './components/Header';
import CoverHero from './components/CoverHero';
import EditorialGrid from './components/EditorialGrid';
import CategoryPage from './components/CategoryPage';
import AuthorPage from './components/AuthorPage';
import ArticlePage from './components/ArticlePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import LegalPage from './components/LegalPage';
import SubscribeModal from './components/SubscribeModal';
import AIGeneratorModal from './components/AIGeneratorModal';
import Footer from './components/Footer';
import { updatePageSeo, buildWebSiteJsonLd } from './utils/seo';

// Universal SEO Route Parser for Articles, Categories, Authors, Legal, About, and Contact Pages (Clean HTML5 Pathname Routing)
function parseCurrentRoute(articlesList) {
  let path = window.location.pathname.trim();
  let hash = window.location.hash.trim();

  // Normalize hash if present (backward compatibility)
  if (hash.startsWith('#/')) {
    hash = hash.slice(2);
  } else if (hash.startsWith('#')) {
    hash = hash.slice(1);
  }

  // Determine active route string (pathname takes priority over hash)
  let route = '';
  if (path && path !== '/' && path !== '/index.html') {
    route = path.startsWith('/') ? path.slice(1) : path;
  } else if (hash) {
    route = hash;
  }

  // Normalize trailing slash
  if (route.endsWith('/')) {
    route = route.slice(0, -1);
  }

  // If empty, return home
  if (!route) {
    return {
      view: 'home',
      article: null,
      authorId: null,
      category: 'all',
      rawSlug: ''
    };
  }

  // 1. Static Pages: 'about', 'about-us', 'contact', 'contact-us', 'privacy-policy', 'terms-of-service'
  if (route === 'about' || route === 'about-us') {
    return {
      view: 'about',
      article: null,
      authorId: null,
      category: 'all',
      rawSlug: 'about'
    };
  }

  if (route === 'contact' || route === 'contact-us') {
    return {
      view: 'contact',
      article: null,
      authorId: null,
      category: 'all',
      rawSlug: 'contact'
    };
  }

  if (route === 'privacy-policy' || route === 'privacy') {
    return {
      view: 'privacy-policy',
      article: null,
      authorId: null,
      category: 'all',
      rawSlug: 'privacy-policy'
    };
  }

  if (route === 'terms-of-service' || route === 'terms' || route === 'terms-and-conditions') {
    return {
      view: 'terms-of-service',
      article: null,
      authorId: null,
      category: 'all',
      rawSlug: 'terms-of-service'
    };
  }

  // 1. Author Profile Route: 'author/:authorId'
  if (route.startsWith('author/')) {
    const rawAuthor = decodeURIComponent(route.replace('author/', '')).trim().toLowerCase();
    const foundAuthor = AUTHORS.find((a) => a.id.toLowerCase() === rawAuthor || a.name.toLowerCase() === rawAuthor);

    return {
      view: 'author',
      article: null,
      authorId: foundAuthor ? foundAuthor.id : null,
      category: 'all',
      rawSlug: rawAuthor
    };
  }

  // 2. Category Archive Route: 'category/:catId'
  if (route.startsWith('category/')) {
    const rawCat = decodeURIComponent(route.replace('category/', '')).trim().toLowerCase();
    const foundCat = CATEGORIES.find((c) => c.id.toLowerCase() === rawCat || c.name.toLowerCase() === rawCat);

    return {
      view: 'category',
      article: null,
      authorId: null,
      category: foundCat ? foundCat.id : 'all',
      rawSlug: rawCat
    };
  }

  // 3. Article Route (Direct '/:slug' or legacy 'article/:slug')
  let rawSlug = decodeURIComponent(route).trim().toLowerCase();
  if (rawSlug.startsWith('article/')) {
    rawSlug = rawSlug.replace('article/', '').trim();
  }

  const foundArticle = articlesList.find((a) => {
    const slugMatch = a.slug && a.slug.toLowerCase() === rawSlug;
    const idMatch = a.id && a.id.toLowerCase() === rawSlug;
    return slugMatch || idMatch;
  });

  if (foundArticle) {
    return {
      view: 'article',
      article: foundArticle,
      authorId: null,
      category: foundArticle.category || 'all',
      rawSlug
    };
  }

  // 4. Default: Home Archive
  return {
    view: 'home',
    article: null,
    authorId: null,
    category: 'all',
    rawSlug: ''
  };
}

export default function App() {
  const [articlesList, setArticlesList] = useState(() => {
    try {
      const saved = localStorage.getItem('lumaa_gemini_articles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...ARTICLES];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return ARTICLES;
  });

  // Current Active Route State
  const [routeState, setRouteState] = useState(() => parseCurrentRoute(ARTICLES));
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('lumaa_saved_articles');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Handle Route Changes from Hash Events
  const syncRouteFromURL = useCallback(() => {
    const parsed = parseCurrentRoute(articlesList);
    setRouteState(parsed);
  }, [articlesList]);

  useEffect(() => {
    syncRouteFromURL();
    window.addEventListener('popstate', syncRouteFromURL);
    window.addEventListener('hashchange', syncRouteFromURL);
    return () => {
      window.removeEventListener('popstate', syncRouteFromURL);
      window.removeEventListener('hashchange', syncRouteFromURL);
    };
  }, [syncRouteFromURL]);

  useEffect(() => {
    if (routeState.view === 'home') {
      updatePageSeo({
        title: 'LUMAA HOME™ | A Luxury UK Home Decor and DIY Magazine',
        description: 'British interior luxury, period architectural restorations, and bespoke joinery guides curated for UK design enthusiasts by Lumaa Home™.',
        keywords: 'lumaa home, luxury home decor uk, uk interior design, bespoke diy guides, victorian renovations, british home styling, period joinery',
        canonicalPath: '/',
        ogType: 'website',
        jsonLd: buildWebSiteJsonLd()
      });
    }
  }, [routeState.view]);

  // Navigate to an Article with clean direct SEO slug (e.g. /slug-name)
  const handleSelectArticle = (article) => {
    if (!article) return;
    const seoSlug = article.slug || article.id;
    window.history.pushState(null, '', `/${seoSlug}`);
    setRouteState({
      view: 'article',
      article: article,
      authorId: null,
      category: article.category || 'all',
      rawSlug: seoSlug
    });
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to a Category
  const handleCategoryChange = (catId) => {
    setSearchQuery('');
    if (catId === 'all') {
      window.history.pushState(null, '', '/');
      setRouteState({
        view: 'home',
        article: null,
        authorId: null,
        category: 'all',
        rawSlug: ''
      });
    } else {
      window.history.pushState(null, '', `/category/${catId}`);
      setRouteState({
        view: 'category',
        article: null,
        authorId: null,
        category: catId,
        rawSlug: catId
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to an Author Profile
  const handleAuthorChange = (authorId) => {
    setSearchQuery('');
    window.history.pushState(null, '', `/author/${authorId}`);
    setRouteState({
      view: 'author',
      article: null,
      authorId: authorId,
      category: 'all',
      rawSlug: authorId
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to Dedicated Pages (About Us, Contact Us, Privacy Policy, Terms of Service)
  const handleNavigatePage = (pageName) => {
    setSearchQuery('');
    let slug = pageName;
    if (pageName === 'about' || pageName === 'about-us') slug = 'about';
    if (pageName === 'contact' || pageName === 'contact-us') slug = 'contact';
    if (pageName === 'privacy' || pageName === 'privacy-policy') slug = 'privacy-policy';
    if (pageName === 'terms' || pageName === 'terms-of-service') slug = 'terms-of-service';

    window.history.pushState(null, '', `/${slug}`);
    setRouteState({
      view: slug,
      article: null,
      authorId: null,
      category: 'all',
      rawSlug: slug
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save/Bookmark toggle
  const toggleSaveArticle = (articleId) => {
    setSavedIds((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  // Save Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumaa_saved_articles', JSON.stringify(savedIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedIds]);

  const handleArticleCreated = (newArticle) => {
    const formatted = {
      ...newArticle,
      isCover: true,
      categoryLabel: `LATEST STORY • ${(newArticle.categoryName || newArticle.category).toUpperCase()}`,
      slug: newArticle.slug || newArticle.id
    };
    setArticlesList((prev) => {
      const updated = [formatted, ...prev.map(a => ({ ...a, isCover: false }))];
      try {
        const customOnly = updated.filter(a => a.id.startsWith('ai-') || a.id.startsWith('article-'));
        localStorage.setItem('lumaa_gemini_articles', JSON.stringify(customOnly));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    handleSelectArticle(formatted);
  };

  // Filter articles for category pages and search
  const filteredCategoryArticles = articlesList.filter((article) => {
    if (routeState.category !== 'all') {
      if (article.category !== routeState.category) {
        return false;
      }
    }
    return true;
  });

  const searchedArticles = articlesList.filter((article) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchText = (article.title + ' ' + article.excerpt + ' ' + article.author + ' ' + (article.categoryName || article.category)).toLowerCase();
      return matchText.includes(q);
    }
    return true;
  });

  // Always dynamic: Newest article is #1 Cover Story, next 2 are Stacked Features
  const coverArticle = articlesList[0];
  const stackedArticles = articlesList.slice(1, 3);
  const homeGridArticles = articlesList.slice(1, 19);

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col justify-between">
      <div>
        {/* Top Meta Bar */}
        <TopBar onNavigatePage={handleNavigatePage} />

        {/* Resident.com Style Centered Header */}
        <Header
          activeCategory={routeState.view === 'category' ? routeState.category : 'all'}
          setActiveCategory={handleCategoryChange}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (q) {
              window.history.pushState(null, '', '/');
            }
          }}
          onOpenSubscribe={() => setIsSubscribeOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-12">

          {/* Search Results Overlay (If user is typing in search bar) */}
          {searchQuery.trim() !== '' ? (
            <EditorialGrid
              articles={searchedArticles}
              onSelectArticle={handleSelectArticle}
              onSelectAuthor={handleAuthorChange}
              sectionTitle={`SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"`}
            />
          ) : routeState.view === 'about' || routeState.view === 'about-us' ? (
            /* 1. DEDICATED ABOUT US VIEW */
            <AboutPage
              onBackToHome={() => handleCategoryChange('all')}
              onSelectAuthor={handleAuthorChange}
            />
          ) : routeState.view === 'contact' || routeState.view === 'contact-us' ? (
            /* 2. DEDICATED CONTACT US VIEW */
            <ContactPage
              onBackToHome={() => handleCategoryChange('all')}
              onNavigateAbout={() => handleNavigatePage('about')}
            />
          ) : routeState.view === 'privacy-policy' || routeState.view === 'terms-of-service' ? (
            /* 3. DEDICATED LEGAL AND COMPLIANCE VIEW */
            <LegalPage
              type={routeState.view}
              onBackToHome={() => handleCategoryChange('all')}
              onNavigateLegal={handleNavigatePage}
            />
          ) : routeState.view === 'article' && routeState.article ? (
            /* 4. DEDICATED FULL ARTICLE VIEW */
            <ArticlePage
              article={routeState.article}
              allArticles={articlesList}
              onSelectArticle={handleSelectArticle}
              onSelectAuthor={handleAuthorChange}
              onSelectCategory={handleCategoryChange}
              onBackToHome={() => handleCategoryChange('all')}
              isSaved={savedIds.includes(routeState.article.id)}
              onToggleSave={toggleSaveArticle}
            />
          ) : routeState.view === 'author' && routeState.authorId ? (
            /* 5. DEDICATED AUTHOR PROFILE VIEW */
            <AuthorPage
              authorId={routeState.authorId}
              articles={articlesList}
              onSelectArticle={handleSelectArticle}
              onSelectAuthor={handleAuthorChange}
              onBackToHome={() => handleCategoryChange('all')}
            />
          ) : routeState.view === 'category' && routeState.category !== 'all' ? (
            /* 6. DEDICATED CATEGORY ARCHIVE VIEW */
            <CategoryPage
              category={routeState.category}
              articles={filteredCategoryArticles}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleCategoryChange}
              onSelectAuthor={handleAuthorChange}
            />
          ) : (
            /* 7. HOMEPAGE VIEW */
            <>
              <CoverHero
                coverArticle={coverArticle}
                stackedArticles={stackedArticles}
                onSelectArticle={handleSelectArticle}
                onSelectAuthor={handleAuthorChange}
              />

              <EditorialGrid
                articles={homeGridArticles}
                onSelectArticle={handleSelectArticle}
                onSelectAuthor={handleAuthorChange}
                sectionTitle="LATEST EDITORIAL STORIES"
              />
            </>
          )}

        </main>
      </div>

      {/* Luxury Footer */}
      <Footer
        onSelectCategory={handleCategoryChange}
        onSelectAuthor={handleAuthorChange}
        onNavigateLegal={handleNavigatePage}
        onNavigatePage={handleNavigatePage}
      />

      {/* Subscribe Modal */}
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />

      {/* Gemini AI Editorial Studio Modal */}
      <AIGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onArticleCreated={handleArticleCreated}
      />
    </div>
  );
}
