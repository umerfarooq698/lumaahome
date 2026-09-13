import React, { useState, useEffect } from 'react';
import { ARTICLES, CATEGORIES } from './data/articles';
import TopBar from './components/TopBar';
import Header from './components/Header';
import CoverHero from './components/CoverHero';
import EditorialGrid from './components/EditorialGrid';
import CategoryPage from './components/CategoryPage';
import NewsletterBanner from './components/NewsletterBanner';
import ArticleModal from './components/ArticleModal';
import SubscribeModal from './components/SubscribeModal';
import Footer from './components/Footer';

export default function App() {
  const [activeCategory, setActiveCategory] = useState(() => {
    // Check URL hash on load
    const hash = window.location.hash.replace('#/category/', '').replace('#/', '');
    const validCategory = CATEGORIES.find(c => c.id === hash);
    return validCategory ? validCategory.id : 'all';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('lumaa_saved_articles');
      return saved ? JSON.parse(saved) : ['kensington-townhouse'];
    } catch (e) {
      return ['kensington-townhouse'];
    }
  });

  // Sync category changes with URL hash and scroll to top
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setSearchQuery('');
    if (catId === 'all') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `#/category/${catId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#/category/', '').replace('#/', '');
      const validCategory = CATEGORIES.find(c => c.id === hash);
      setActiveCategory(validCategory ? validCategory.id : 'all');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Filter articles
  const filteredArticles = ARTICLES.filter((article) => {
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

  const coverArticle = ARTICLES.find((a) => a.isCover);
  const stackedArticles = ARTICLES.filter((a) => a.isStacked);
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

          {/* If a specific category is active and no active search query, render dedicated CategoryPage! */}
          {activeCategory !== 'all' && searchQuery.trim() === '' ? (
            <CategoryPage
              category={activeCategory}
              articles={filteredArticles}
              onSelectArticle={(art) => setSelectedArticle(art)}
              onSelectCategory={handleCategoryChange}
            />
          ) : (
            <>
              {/* Homepage Cover Hero (shown on 'all' with no search) */}
              {activeCategory === 'all' && searchQuery.trim() === '' && (
                <CoverHero
                  coverArticle={coverArticle}
                  stackedArticles={stackedArticles}
                  onSelectArticle={(art) => setSelectedArticle(art)}
                />
              )}

              {/* Main Editorial Articles Grid */}
              <EditorialGrid
                articles={activeCategory === 'all' && searchQuery.trim() === '' ? gridArticles : filteredArticles}
                onSelectArticle={(art) => setSelectedArticle(art)}
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
      />

      {/* Single Article Reader Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          isSaved={savedIds.includes(selectedArticle.id)}
          onToggleSave={toggleSaveArticle}
        />
      )}

      {/* Subscribe Modal */}
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />
    </div>
  );
}
