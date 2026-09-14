import React, { useState, useEffect } from 'react';
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
import ArticleModal from './components/ArticleModal';
import SubscribeModal from './components/SubscribeModal';
import AIGeneratorModal from './components/AIGeneratorModal';
import Footer from './components/Footer';

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

  // 1. Check if hash matches an article slug or id
  const [activeArticle, setActiveArticle] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/article/')) {
      const slug = hash.replace('#/article/', '').trim();
      return ARTICLES.find(a => a.slug === slug || a.id === slug) || null;
    }
    return null;
  });

  // 2. Check if hash matches an author profile
  const [activeAuthor, setActiveAuthor] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/author/')) {
      const authorId = hash.replace('#/author/', '').trim();
      const valid = AUTHORS.find(a => a.id === authorId);
      return valid ? valid.id : null;
    }
    return null;
  });

  // 3. Check if hash matches a category
  const [activeCategory, setActiveCategory] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/category/')) {
      const catId = hash.replace('#/category/', '').trim();
      const validCategory = CATEGORIES.find(c => c.id === catId);
      return validCategory ? validCategory.id : 'all';
    }
    return 'all';
  });

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

  // Navigation to an Article via clean SEO URL slug
  const handleSelectArticle = (article) => {
    if (!article) return;
    setActiveArticle(article);
    setActiveAuthor(null);
    setSearchQuery('');
    const seoSlug = article.slug || article.id;
    window.history.pushState(null, '', `#/article/${seoSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation to Category
  const handleCategoryChange = (catId) => {
    setActiveArticle(null);
    setActiveAuthor(null);
    setActiveCategory(catId);
    setSearchQuery('');
    if (catId === 'all') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `#/category/${catId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation to Author Profile
  const handleAuthorChange = (authorId) => {
    setActiveArticle(null);
    setActiveAuthor(authorId);
    setSearchQuery('');
    window.history.pushState(null, '', `#/author/${authorId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to browser back/forward and direct hash changes
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/article/')) {
        const slug = hash.replace('#/article/', '').trim();
        const found = articlesList.find(a => a.slug === slug || a.id === slug);
        setActiveArticle(found || null);
        setActiveAuthor(null);
      } else if (hash.startsWith('#/author/')) {
        const authorId = hash.replace('#/author/', '').trim();
        const valid = AUTHORS.find(a => a.id === authorId);
        setActiveAuthor(valid ? valid.id : null);
        setActiveArticle(null);
        setActiveCategory('all');
      } else if (hash.startsWith('#/category/')) {
        const catId = hash.replace('#/category/', '').trim();
        const validCategory = CATEGORIES.find(c => c.id === catId);
        setActiveCategory(validCategory ? validCategory.id : 'all');
        setActiveArticle(null);
        setActiveAuthor(null);
      } else {
        setActiveArticle(null);
        setActiveAuthor(null);
        setActiveCategory('all');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [articlesList]);

  // Save bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumaa_saved_articles', JSON.stringify(savedIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedIds]);

  const toggleSaveArticle = (articleId) => {
    setSavedIds((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

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

  // Filter articles for category and search
  const filteredArticles = articlesList.filter((article) => {
    if (activeCategory !== 'all') {
      if (article.category !== activeCategory) {
        return false;
      }
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchText = (article.title + ' ' + article.excerpt + ' ' + article.author + ' ' + (article.categoryName || article.category)).toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    return true;
  });

  const coverArticle = articlesList.find((a) => a.isCover) || articlesList[0];
  const stackedArticles = articlesList.filter((a) => a.isStacked);
  const gridArticles = filteredArticles.filter((a) => !a.isCover);

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col justify-between">
      <div>
        {/* Top Meta Bar */}
        <TopBar />

        {/* Resident.com Style Centered Header */}
        <Header
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (q) {
              setActiveArticle(null);
              setActiveAuthor(null);
            }
          }}
          onOpenSubscribe={() => setIsSubscribeOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-12">

          {/* 1. DEDICATED FULL ARTICLE PAGE VIEW (SEO URL SLUG) */}
          {activeArticle && searchQuery.trim() === '' ? (
            <ArticlePage
              article={activeArticle}
              allArticles={articlesList}
              onSelectArticle={handleSelectArticle}
              onSelectAuthor={handleAuthorChange}
              onSelectCategory={handleCategoryChange}
              onBackToHome={() => handleCategoryChange('all')}
              isSaved={savedIds.includes(activeArticle.id)}
              onToggleSave={toggleSaveArticle}
            />
          ) : activeAuthor && searchQuery.trim() === '' ? (
            /* 2. DEDICATED AUTHOR PROFILE VIEW */
            <AuthorPage
              authorId={activeAuthor}
              articles={articlesList}
              onSelectArticle={handleSelectArticle}
              onSelectAuthor={handleAuthorChange}
              onBackToHome={() => handleCategoryChange('all')}
            />
          ) : activeCategory !== 'all' && searchQuery.trim() === '' ? (
            /* 3. DEDICATED CATEGORY ARCHIVE VIEW */
            <CategoryPage
              category={activeCategory}
              articles={filteredArticles}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleCategoryChange}
              onSelectAuthor={handleAuthorChange}
            />
          ) : (
            /* 4. HOMEPAGE OR SEARCH RESULTS VIEW */
            <>
              {/* Homepage Cover Hero (shown on 'all' with no search) */}
              {activeCategory === 'all' && searchQuery.trim() === '' && (
                <CoverHero
                  coverArticle={coverArticle}
                  stackedArticles={stackedArticles}
                  onSelectArticle={handleSelectArticle}
                  onSelectAuthor={handleAuthorChange}
                />
              )}

              {/* Main Editorial Articles Grid */}
              <EditorialGrid
                articles={activeCategory === 'all' && searchQuery.trim() === '' ? gridArticles : filteredArticles}
                onSelectArticle={handleSelectArticle}
                onSelectAuthor={handleAuthorChange}
                sectionTitle={
                  searchQuery.trim() !== ''
                    ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"`
                    : "LATEST EDITORIAL STORIES"
                }
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
