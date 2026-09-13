import React, { useState, useEffect } from 'react';
import { ARTICLES } from './data/articles';
import TopBar from './components/TopBar';
import Header from './components/Header';
import CoverHero from './components/CoverHero';
import EditorialGrid from './components/EditorialGrid';
import NewsletterBanner from './components/NewsletterBanner';
import ArticleModal from './components/ArticleModal';
import SubscribeModal from './components/SubscribeModal';
import Footer from './components/Footer';

export default function App() {
  const [activeLocation, setActiveLocation] = useState('london');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('lumaa_saved_articles');
      return saved ? JSON.parse(saved) : ['kensington-townhouse', 'diy-wall-panelling-masterclass'];
    } catch (e) {
      return ['kensington-townhouse'];
    }
  });
  const [showSavedOnly, setShowSavedOnly] = useState(false);

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
    // If show saved only
    if (showSavedOnly && !savedIds.includes(article.id)) {
      return false;
    }

    // Category filter
    if (activeCategory !== 'all') {
      const catMatch =
        article.category.toLowerCase().replace(/ /g, '-') === activeCategory ||
        article.category.toLowerCase() === activeCategory.replace(/-/g, ' ');
      if (!catMatch) return false;
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchText = (article.title + ' ' + article.excerpt + ' ' + article.author + ' ' + article.category).toLowerCase();
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
        {/* Top Location & Meta Bar */}
        <TopBar
          activeLocation={activeLocation}
          setActiveLocation={(loc) => {
            setActiveLocation(loc);
            setShowSavedOnly(false);
          }}
          savedCount={savedIds.length}
          onOpenSaved={() => {
            setShowSavedOnly(!showSavedOnly);
            setActiveCategory('all');
          }}
        />

        {/* Resident.com Style Centered Header */}
        <Header
          activeCategory={activeCategory}
          setActiveCategory={(cat) => {
            setActiveCategory(cat);
            setShowSavedOnly(false);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSubscribe={() => setIsSubscribeOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-12">
          
          {/* Saved notification banner */}
          {showSavedOnly && (
            <div className="bg-gray-100 p-4 border-l-4 border-black flex items-center justify-between">
              <span className="font-serif font-bold text-sm uppercase tracking-wider">
                Viewing Bookmarked Stories ({filteredArticles.length})
              </span>
              <button
                onClick={() => setShowSavedOnly(false)}
                className="text-xs font-bold text-[#C8102E] uppercase hover:underline"
              >
                View All Stories ✕
              </button>
            </div>
          )}

          {/* Hero Section (shown when no search and on 'all' category) */}
          {!showSavedOnly && activeCategory === 'all' && searchQuery.trim() === '' && (
            <CoverHero
              coverArticle={coverArticle}
              stackedArticles={stackedArticles}
              onSelectArticle={(art) => setSelectedArticle(art)}
            />
          )}

          {/* Main Editorial Articles Grid */}
          <EditorialGrid
            articles={activeCategory === 'all' && searchQuery.trim() === '' && !showSavedOnly ? gridArticles : filteredArticles}
            onSelectArticle={(art) => setSelectedArticle(art)}
            sectionTitle={
              showSavedOnly
                ? "BOOKMARKED UK FEATURES"
                : activeCategory !== 'all'
                ? `CATEGORY: ${activeCategory.toUpperCase().replace(/-/g, ' ')}`
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
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setShowSavedOnly(false);
        }}
        onSelectLocation={(loc) => {
          setActiveLocation(loc);
          setShowSavedOnly(false);
        }}
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
