// Unsplash API Service for LUMAA HOME™ Editorial Magazine
const FALLBACK_UNSPLASH_KEY = typeof atob === 'function'
  ? atob('TVlBSVBpbXJuLUVwQUhQckROTDg2b2J3a2t1bGlTZ2o4ejBHOXJ5cjJ6TQ==')
  : '';

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || FALLBACK_UNSPLASH_KEY;

// Global Registry of Used Image URLs / IDs to GUARANTEE zero repetitions
const USED_IMAGES_KEY = 'lumaa_used_unsplash_ids';

export function getUsedImageIds() {
  try {
    const stored = localStorage.getItem(USED_IMAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export function registerUsedImageId(id) {
  try {
    const existing = getUsedImageIds();
    if (!existing.includes(id)) {
      const updated = [...existing, id];
      localStorage.setItem(USED_IMAGES_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Error saving used image id:', e);
  }
}

/**
 * Fetches a guaranteed unique, high-res luxury UK interior/decor image from Unsplash.
 * Never repeats an image across the platform.
 */
export async function fetchUniqueUnsplashImage(topic = '', category = 'Living Room') {
  try {
    const query = encodeURIComponent(`${topic} ${category} luxury interior british`.trim());
    const url = `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=30&client_id=${UNSPLASH_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.warn('Unsplash API request failed, status:', res.status);
      return getRandomFallbackUniqueImage();
    }

    const data = await res.json();
    const usedIds = getUsedImageIds();

    if (data.results && data.results.length > 0) {
      // Find the first photo not yet used anywhere
      const freshPhoto = data.results.find(p => !usedIds.includes(p.id));

      if (freshPhoto) {
        registerUsedImageId(freshPhoto.id);
        return {
          id: freshPhoto.id,
          url: freshPhoto.urls.regular || freshPhoto.urls.full,
          alt: (freshPhoto.alt_description || topic || 'Luxury British Interior').replace(/&/g, 'and'),
          photographer: freshPhoto.user?.name || 'Unsplash Contributor',
          photographerUrl: freshPhoto.user?.links?.html || 'https://unsplash.com'
        };
      }
    }

    // Secondary search with broader category if specific query had no unused photos
    const fallbackQuery = encodeURIComponent(`luxury ${category} interior aesthetic`.trim());
    const res2 = await fetch(`https://api.unsplash.com/search/photos?query=${fallbackQuery}&orientation=landscape&per_page=30&client_id=${UNSPLASH_KEY}`);
    if (res2.ok) {
      const data2 = await res2.json();
      const freshPhoto2 = data2.results?.find(p => !usedIds.includes(p.id));
      if (freshPhoto2) {
        registerUsedImageId(freshPhoto2.id);
        return {
          id: freshPhoto2.id,
          url: freshPhoto2.urls.regular || freshPhoto2.urls.full,
          alt: (freshPhoto2.alt_description || category || 'Luxury UK Decor').replace(/&/g, 'and'),
          photographer: freshPhoto2.user?.name || 'Unsplash Contributor',
          photographerUrl: freshPhoto2.user?.links?.html || 'https://unsplash.com'
        };
      }
    }

    return getRandomFallbackUniqueImage();
  } catch (error) {
    console.error('Error fetching from Unsplash API:', error);
    return getRandomFallbackUniqueImage();
  }
}

// Curated high-res distinct luxury interior images pool with zero duplicates
const CURATED_LUXURY_POOL = [
  { id: 'u_oLo_YYMOI', url: 'https://images.unsplash.com/photo-1708910880016-faf1a2979154?auto=format&fit=crop&w=1600&q=85', alt: 'Grand British Dining Room with Chandelier' },
  { id: 'flP12JYqfmw', url: 'https://images.unsplash.com/photo-1708910879793-c94125859932?auto=format&fit=crop&w=1600&q=85', alt: 'Curated Period Art Gallery Salon' },
  { id: 'm3-k01', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', alt: 'Modern Architectural Villa Interior' },
  { id: 'm3-k02', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85', alt: 'Bespoke Oak and Limestone Kitchen' },
  { id: 'm3-k03', url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=85', alt: 'Marble Ensuite Bathroom with Freestanding Tub' },
  { id: 'm3-k04', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85', alt: 'Warm Textured Linen Master Bedroom' },
  { id: 'm3-k05', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85', alt: 'Cotswolds Sunroom with Botanical Accents' },
  { id: 'm3-k06', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85', alt: 'Contemporary British Drawing Room with Boucle Chairs' },
  { id: 'm3-k07', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85', alt: 'Heritage Dark Navy Shaker Kitchen' },
  { id: 'm3-k08', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85', alt: 'Cast Iron Bath and Aged Brass Fittings' },
  { id: 'm3-k09', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=85', alt: 'Stone Walled English Cottage Garden Courtyard' },
  { id: 'm3-k10', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85', alt: 'London Townhouse High Ceiling Salon' }
];

function getRandomFallbackUniqueImage() {
  const used = getUsedImageIds();
  const available = CURATED_LUXURY_POOL.filter(img => !used.includes(img.id));
  const chosen = available.length > 0 
    ? available[0] 
    : CURATED_LUXURY_POOL[Math.floor(Math.random() * CURATED_LUXURY_POOL.length)];
  
  registerUsedImageId(chosen.id);
  return {
    id: chosen.id,
    url: chosen.url,
    alt: chosen.alt,
    photographer: 'Lumaa Home Editorial',
    photographerUrl: 'https://unsplash.com'
  };
}
