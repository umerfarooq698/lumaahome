import React, { useState } from 'react';
import { Sparkles, X, Loader2, BookOpen, MessageSquareText } from 'lucide-react';
import { generateArticleWithGemini, askAIDesignConsultant } from '../services/gemini';
import { CATEGORIES } from '../data/articles';

export default function AIGeneratorModal({ isOpen, onClose, onArticleCreated }) {
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' | 'consult'
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('living-room');
  const [loading, setLoading] = useState(false);
  const [consultQuery, setConsultQuery] = useState('');
  const [consultAnswer, setConsultAnswer] = useState('');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const selectedCatObj = CATEGORIES.find(c => c.id === category);
      const catName = selectedCatObj ? selectedCatObj.name : 'Living Room';
      
      const newArticle = await generateArticleWithGemini({
        topic: topic.trim(),
        category: catName
      });
      
      // Match category id
      newArticle.category = category;
      newArticle.categoryName = catName;

      onArticleCreated(newArticle);
      setTopic('');
      onClose();
    } catch (err) {
      console.error(err);
      setError('Unable to generate article. Please check the API key configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleConsult = async (e) => {
    e.preventDefault();
    if (!consultQuery.trim()) return;
    setLoading(true);
    setError(null);
    setConsultAnswer('');

    try {
      const answer = await askAIDesignConsultant(consultQuery.trim());
      setConsultAnswer(answer);
    } catch (err) {
      console.error(err);
      setError('Unable to connect to AI Consultant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white max-w-2xl w-full border-2 border-black p-6 sm:p-8 relative shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black p-1 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.25em] text-[#C8102E] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GEMINI POWERED EDITORIAL STUDIO</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-black uppercase">
            Lumaa Home AI Studio
          </h2>
          <p className="text-xs text-gray-500">
            Generate bespoke British luxury decor stories and request expert architectural guidance powered by Gemini AI.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => { setActiveTab('generate'); setError(null); }}
            className={`flex-1 py-2.5 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'generate'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Write New Article</span>
          </button>
          <button
            onClick={() => { setActiveTab('consult'); setError(null); }}
            className={`flex-1 py-2.5 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'consult'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Ask Design Consultant</span>
          </button>
        </div>

        {/* Tab 1: Generate Article */}
        {activeTab === 'generate' && (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">
                Article Topic or Headline
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Georgian Kitchen Cabinetry and Brass Detailing"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">
                Magazine Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition uppercase text-xs font-bold"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-semibold">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full bg-black text-white py-3 text-xs uppercase font-bold tracking-[0.2em] hover:bg-[#C8102E] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>CURATING BESPOKE ARTICLE VIA GEMINI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>GENERATE AND PUBLISH ARTICLE</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 2: Design Consultant */}
        {activeTab === 'consult' && (
          <form onSubmit={handleConsult} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">
                Your Decor or Architectural Question
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Which Farrow and Ball heritage paint shades pair best with natural Cotswold limestone in a low-light north-facing drawing room?"
                value={consultQuery}
                onChange={(e) => setConsultQuery(e.target.value)}
                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 font-semibold">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !consultQuery.trim()}
              className="w-full bg-black text-white py-3 text-xs uppercase font-bold tracking-[0.2em] hover:bg-[#C8102E] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ANALYSING WITH GEMINI CONSULTANT...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>REQUEST EXPERT DESIGN ADVICE</span>
                </>
              )}
            </button>

            {consultAnswer && (
              <div className="bg-[#FDFBF7] border border-gray-200 p-4 space-y-2 mt-4 max-h-60 overflow-y-auto">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#C8102E] block">
                  LUMAA HOME CONSULTANT RECOMMENDATION
                </span>
                <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-line font-serif">
                  {consultAnswer}
                </p>
              </div>
            )}
          </form>
        )}

      </div>
    </div>
  );
}
