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
import NewsletterBanner from './components/NewsletterBanner';
import SubscribeModal from './components/SubscribeModal';
import AIGeneratorModal from './components/AIGeneratorModal';
import Footer from './components/Footer';

// Universal SEO Route Parser for Articles, Categories, and Authors
function parseCurrentRoute(articlesList) {
  let hash = window.location.hash.trim();
  
  // Normalize leading hash
  if (hash.startsWith('#/')) {
    hash = hash.slice(2);
  } else if (hash.startsWith('#')) {
    hash = hash.slice(1);
  }

  // Normalize trailing slash
  if (hash.endsWith('/')) {
    hash = hash.slice(0, -1);
  }

  // If empty, return home
  if (!hash) {
    return {
      view: 'home',
      article: null,
      authorId: null,
      category: 'all',
      rawSlug: ''
    };
  }

  // 1. Author Profile Route: 'author/:authorId'
  if (hash.startsWith('author/')) {
    const rawAuthor = decodeURIComponent(hash.replace('author/', '')).trim().toLowerCase();
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
  if (hash.startsWith('category/')) {
    const rawCat = decodeURIComponent(hash.replace('category/', '')).trim().toLowerCase();
    const foundCat = CATEGORIES.find((c) => c.id.toLowerCase() === rawCat || c.name.toLowerCase() === rawCat);

    return {
      view: 'category',
      article: null,
      authorId: null,
      category: foundCat ? foundCat.id : 'all',
      rawSlug: rawCat
    };
  }

  // 3. Article Route (Direct '#/:slug' or legacy 'article/:slug')
  let rawSlug = decodeURIComponent(hash).trim().toLowerCase();
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
      return saved ? JSON.parse(saved) : ['kensington-townhouse'];
    } catch (e) {
      return ['kensington-townhouse'];
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

  // Navigate to an Article with clean direct SEO slug (e.g. #/slug-name)
  const handleSelectArticle = (article) => {
    if (!article) return;
    const seoSlug = article.slug || article.id;
    window.history.pushState(null, '', `#/${seoSlug}`);
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
      window.history.pushState(null, '', '#/');
      setRouteState({
        view: 'home',
        article: null,
        authorId: null,
        category: 'all',
        rawSlug: ''
      });
    } else {
      window.history.pushState(null, '', `#/category/${catId}`);
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
    window.history.pushState(null, '', `#/author/${authorId}`);
    setRouteState({
      view: 'author',
      article: null,
      authorId: authorId,
      category: 'all',
      rawSlug: authorId
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
    setArticlesList((prev) => {
      const updated = [newArticle, ...prev];
      try {
        const customOnly = updated.filter(a => a.id.startsWith('ai-'));
        localStorage.setItem('lumaa_gemini_articles', JSON.stringify(customOnly));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    handleSelectArticle(newArticle);
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

  const coverArticle = articlesList.find((a) => a.isCover) || articlesList[0];
  const stackedArticles = articlesList.filter((a) => a.isStacked);
  const homeGridArticles = articlesList.filter((a) => !a.isCover);

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col justify-between">
      <div>
        {/* Top Meta Bar */}
        <TopBar />

        {/* Resident.com Style Centered Header */}
        <Header
          activeCategory={routeState.view === 'category' ? routeState.category : 'all'}
          setActiveCategory={handleCategoryChange}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (q) {
              window.history.pushState(null, '', '#/');
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
          ) : routeState.view === 'article' && routeState.article ? (
            /* 1. DEDICATED FULL ARTICLE VIEW */
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
            /* 2. DEDICATED AUTHOR PROFILE VIEW */
            <AuthorPage
              authorId={routeState.authorId}
              articles={articlesList}
              onSelectArticle={handleSelectArticle}
              onSelectAuthor={handleAuthorChange}
              onBackToHome={() => handleCategoryChange('all')}
            />
          ) : routeState.view === 'category' && routeState.category !== 'all' ? (
            /* 3. DEDICATED CATEGORY ARCHIVE VIEW */
            <CategoryPage
              category={routeState.category}
              articles={filteredCategoryArticles}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleCategoryChange}
              onSelectAuthor={handleAuthorChange}
            />
          ) : (
            /* 4. HOMEPAGE VIEW */
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

          {/* Luxury Newsletter VIP Section */}
          <NewsletterBanner />

        </main>
      </div>

      {/* Luxury Footer */}
      <Footer
        onSelectCategory={handleCategoryChange}
        onSelectAuthor={handleAuthorChange}
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
