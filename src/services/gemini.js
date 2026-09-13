import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let aiInstance = null;

function getAIClient() {
  if (!aiInstance) {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY.');
    }
    aiInstance = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiInstance;
}

/**
 * Generates a full luxury UK Home Decor / DIY Editorial article using Gemini API.
 * Adheres strictly to the rule: NEVER use the '&' symbol (always use 'and').
 */
export async function generateArticleWithGemini({ topic, category = 'Living Room' }) {
  try {
    const ai = getAIClient();
    
    const prompt = `You are the Editor-in-Chief of LUMAA HOME™, a premier British luxury home decor, architectural living, and bespoke DIY magazine based in London, UK.

Generate a comprehensive, beautifully written luxury editorial article on the topic: "${topic}" for the category: "${category}".

IMPORTANT EDITORIAL RULES:
1. NEVER use the '&' character anywhere in the entire output. Always use the word 'and'.
2. Tone: Sophisticated British luxury, authoritative, inspiring, elegant, practical for UK homes (Victorian, Georgian, Edwardian, contemporary flats, Cotswolds cottages).
3. Provide realistic British interior details (Farrow and Ball palettes, Edwardian moldings, limestone flags, bespoke joinery, brass fixtures).

Return ONLY valid JSON with this exact structure:
{
  "title": "Article Title without any ampersands",
  "category": "${category}",
  "readTime": "6 min read",
  "author": "Author Name, Title (e.g. Eleanor Vance, Architectural Editor)",
  "date": "September 2026",
  "excerpt": "A two-sentence compelling summary of the piece without ampersands.",
  "content": [
    {
      "heading": "Section Heading",
      "body": "Detailed paragraph discussing design philosophy, materials, and architectural considerations."
    },
    {
      "heading": "Design Principles and Styling Notes",
      "body": "Actionable design rules, proportion advice, and lighting curation."
    },
    {
      "heading": "The British Artisan Perspective",
      "body": "UK heritage context, sourcing bespoke craftsmanship, and sustainable luxury."
    }
  ],
  "tags": ["Living Room", "UK Design", "Heritage", "Lighting"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '';
    // Clean any markdown formatting if present
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanedText);

    // Final safety check: replace any stray & with 'and'
    const sanitize = (str) => typeof str === 'string' ? str.replace(/&/g, 'and') : str;
    
    return {
      id: `ai-${Date.now()}`,
      title: sanitize(data.title),
      category: sanitize(data.category),
      readTime: sanitize(data.readTime || '5 min read'),
      author: sanitize(data.author || 'Lumaa Home Editorial Team'),
      date: sanitize(data.date || 'September 2026'),
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
      excerpt: sanitize(data.excerpt),
      content: Array.isArray(data.content) 
        ? data.content.map(c => ({ heading: sanitize(c.heading), body: sanitize(c.body) }))
        : [],
      tags: Array.isArray(data.tags) ? data.tags.map(sanitize) : ['Luxury Living', 'UK Decor']
    };
  } catch (error) {
    console.error('Error generating article with Gemini API:', error);
    throw error;
  }
}

/**
 * Ask the LUMAA HOME AI Design Consultant a question.
 */
export async function askAIDesignConsultant(userQuestion) {
  try {
    const ai = getAIClient();
    const prompt = `You are the Chief Architectural and Interior Design Consultant at LUMAA HOME™ Magazine in London, UK.
Answer the following homeowner/decorator question with tailored British luxury interior design advice:
"${userQuestion}"

RULES:
1. NEVER use the '&' symbol anywhere. Always spell out 'and'.
2. Provide concise, expert, sophisticated UK-focused recommendations (heritage colours, natural materials, proportion, architectural details).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return (response.text || '').replace(/&/g, 'and');
  } catch (error) {
    console.error('Gemini Design Consultant error:', error);
    throw error;
  }
}
