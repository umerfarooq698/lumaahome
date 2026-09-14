import React, { useState, useEffect } from 'react';
import { ARTICLES, CATEGORIES } from './data/articles';
import { AUTHORS } from './data/authors';
import TopBar from './components/TopBar';
import Header from './components/Header';
import CoverHero from './components/CoverHero';
import EditorialGrid from './components/EditorialGrid';
import CategoryPage from './components/CategoryPage';
import AuthorPage from './components/AuthorPage';
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

  const [activeAuthor, setActiveAuthor] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/author/')) {
      const authorId = hash.replace('#/author/', '').trim();
      const valid = AUTHORS.find(a => a.id === authorId);
      return valid ? valid.id : null;
    }
    return null;
  });

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
  
  const [selectedArticle, setSelectedArticle] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/article/')) {
      const artId = hash.replace('#/article/', '').trim();
      return ARTICLES.find(a => a.id === artId || a.slug === artId) || null;
    }
    return null;
  });

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

  // Open Article with shareable URL hash
  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
    if (article) {
      window.history.pushState(null, '', `#/article/${article.id}`);
    }
  };

  // Close Article and restore background URL hash
  const handleCloseArticle = () => {
    setSelectedArticle(null);
    if (activeAuthor) {
      window.history.pushState(null, '', `#/author/${activeAuthor}`);
    } else if (activeCategory !== 'all') {
      window.history.pushState(null, '', `#/category/${activeCategory}`);
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  // Sync category changes
  const handleCategoryChange = (catId) => {
    setActiveAuthor(null);
    setSelectedArticle(null);
    setActiveCategory(catId);
    setSearchQuery('');
    if (catId === 'all') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `#/category/${catId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync author profile navigation
  const handleAuthorChange = (authorId) => {
    setActiveAuthor(authorId);
    setSelectedArticle(null);
    setSearchQuery('');
    window.history.pushState(null, '', `#/author/${authorId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to browser back/forward buttons and direct URL hash changes
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/article/')) {
        const artId = hash.replace('#/article/', '').trim();
        const found = articlesList.find(a => a.id === artId || a.slug === artId);
        if (found) setSelectedArticle(found);
      } else {
        setSelectedArticle(null);
        if (hash.startsWith('#/author/')) {
          const authorId = hash.replace('#/author/', '').trim();
          const valid = AUTHORS.find(a => a.id === authorId);
          setActiveAuthor(valid ? valid.id : null);
          setActiveCategory('all');
        } else if (hash.startsWith('#/category/')) {
          const catId = hash.replace('#/category/', '').trim();
          const validCategory = CATEGORIES.find(c => c.id === catId);
          setActiveCategory(validCategory ? validCategory.id : 'all');
          setActiveAuthor(null);
        } else {
          setActiveCategory('all');
          setActiveAuthor(null);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [articlesList]);

  // Save to localStorage
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

  // Filter articles
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
          setSearchQuery={setSearchQuery}
          onOpenSubscribe={() => setIsSubscribeOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-12">

          {/* 1. AUTHOR PROFILE VIEW */}
          {activeAuthor && searchQuery.trim() === '' ? (
            <AuthorPage
              authorId={activeAuthor}
              articles={articlesList}
              onSelectArticle={handleSelectArticle}
              onSelectAuthor={handleAuthorChange}
              onBackToHome={() => handleCategoryChange('all')}
            />
          ) : activeCategory !== 'all' && searchQuery.trim() === '' ? (
            /* 2. CATEGORY ARCHIVE VIEW */
            <CategoryPage
              category={activeCategory}
              articles={filteredArticles}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleCategoryChange}
              onSelectAuthor={handleAuthorChange}
            />
          ) : (
            /* 3. HOMEPAGE / SEARCH RESULTS VIEW */
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

      {/* Single Article Reader Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={handleCloseArticle}
          isSaved={savedIds.includes(selectedArticle.id)}
          onToggleSave={toggleSaveArticle}
          onSelectAuthor={handleAuthorChange}
        />
      )}

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
