import React, { useState } from 'react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-black text-white p-8 sm:p-12 text-center space-y-4 my-12">
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C8102E] block">
        EXCLUSIVE VIP ACCESS
      </span>
      
      <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
        The Resident LumaaHome Journal
      </h2>
      
      <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed font-light">
        Receive weekly UK interior architectural tours, period restoration masterclasses, and curated styling guides delivered directly to your inbox.
      </p>

      {subscribed ? (
        <div className="bg-[#C8102E] text-white p-4 max-w-md mx-auto text-xs font-bold uppercase tracking-widest">
          Thank you for joining the Lumaa Home™ UK Circle.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2">
          <input
            type="email"
            placeholder="ENTER YOUR EMAIL ADDRESS..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 text-xs text-black w-full focus:outline-none uppercase text-center font-bold tracking-wider"
          />
          <button
            type="submit"
            className="bg-[#C8102E] text-white text-xs font-bold px-8 py-3 uppercase tracking-widest hover:bg-white hover:text-black transition shrink-0"
          >
            JOIN
          </button>
        </form>
      )}
    </section>
  );
}
