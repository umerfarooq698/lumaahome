import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function SubscribeModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 shadow-2xl relative border-t-8 border-t-[#C8102E] text-center space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8102E] block">
          LUMAA HOME™ PRINT AND DIGITAL
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-black">
          Subscribe to the Journal
        </h2>

        <p className="text-xs text-gray-600 leading-relaxed font-light">
          Get insider access to British interior architecture, exclusive period home tours, and luxury DIY guides.
        </p>

        {submitted ? (
          <div className="p-4 bg-[#C8102E] text-white text-xs font-bold uppercase tracking-widest">
            Welcome to Lumaa Home™ UK.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL ADDRESS..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-base sm:text-xs border border-gray-300 focus:outline-none focus:border-black uppercase text-center font-bold tracking-wider"
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#C8102E] transition"
            >
              CONFIRM SUBSCRIPTION
            </button>
          </form>
        )}

        <div className="text-[10px] text-gray-400 uppercase tracking-wider pt-2">
          Weekly digest • Unsubscribe anytime
        </div>
      </div>
    </div>
  );
}
