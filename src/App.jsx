import React, { useState, useEffect } from 'react';
import { ARTICLES, CATEGORIES } from './data/articles';
import TopBar from './components/TopBar';
import Header from './components/Header';
import CoverHero from './components/CoverHero';
import EditorialGrid from './components/EditorialGrid';
import NewsletterBanner from './components/NewsletterBanner';
import ArticleModal from './components/ArticleModal';
import SubscribeModal from './components/SubscribeModal';
import Footer from './components/Footer';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
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
    // Category filter
    if (activeCategory !== 'all') {
      if (article.category !== activeCategory) {
        return false;
      }
    }

    // Search query
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

  const currentCategoryObj = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col justify-between">
      <div>
        {/* Top Meta Bar (Clean date, UK edition & social links) */}
        <TopBar />

        {/* Resident.com Style Centered Header */}
        <Header
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSubscribe={() => setIsSubscribeOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-12">

          {/* Hero Section (shown when on 'all' category and no active search) */}
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
              activeCategory !== 'all'
                ? `CATEGORY: ${currentCategoryObj ? currentCategoryObj.name.toUpperCase() : activeCategory.toUpperCase()}`
                : searchQuery.trim() !== ''
                ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"`
                : "LATEST EDITORIAL STORIES"
            }
          />

          {/* Luxury Newsletter VIP Section */}
          <NewsletterBanner />

        </main>
      </div>

      {/* Luxury Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
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
