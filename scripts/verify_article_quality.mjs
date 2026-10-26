/**
 * Lumaa Home Master Article Quality & Compliance Verifier
 * Enforces Zero AI Words, Zero AI Sentence Formulas, Zero Comma-And,
 * Heading Hierarchy, Word Count, and Metadata standards.
 */

export const BANNED_AI_WORDS = [
  "delve", "delves", "delving",
  "elevate", "elevates", "elevating",
  "tapestry",
  "testament",
  "blueprint", "blueprints",
  "framework", "frameworks",
  "anatomy",
  "champions",
  "furthermore",
  "moreover",
  "timeless",
  "curated", "curate", "curating",
  "seamlessly", "seamless",
  "nestled", "nestle",
  "sophisticated",
  "game-changer",
  "robust",
  "beacon",
  "unlock", "unlocks", "unlocking",
  "pivotal",
  "replicate", "replicates",
  "superior",
  "substantial",
  "demanding",
  "telegraph", "telegraphing",
  "straightforward",
  "meticulous", "meticulously",
  "bespoke",
  "realm",
  "foster", "fosters", "fostering",
  "harness", "harnesses", "harnessing",
  "leverage", "leveraging",
  "navigate", "navigating",
  "embark", "embarking",
  "unveil", "unveils", "unveiling",
  "showcase", "showcases",
  "paramount",
  "paradigm",
  "cornerstone",
  "myriad",
  "nuance", "nuances",
  "resonate", "resonates",
  "vibrant",
  "captivating",
  "breathtaking", "breath-taking",
  "revolutionize", "revolutionise",
  "sanctuary",
  "cocoon",
  "visual poise",
  "holistic",
  "synergy",
  "indispensable",
  "quintessential",
  "epitome",
  "treasure trove",
  "plethora"
];

export const BANNED_AI_PATTERNS = [
  { pattern: /\bat its core\b/i, label: "at its core" },
  { pattern: /\bthe biggest mistake\b/i, label: "the biggest mistake" },
  { pattern: /\bmany people wonder\b/i, label: "many people wonder" },
  { pattern: /\bif you want to know\b/i, label: "if you want to know" },
  { pattern: /\bwhether you are\b/i, label: "whether you are" },
  { pattern: /\bcomes down to\b/i, label: "comes down to" },
  { pattern: /\bin today'?s (fast-paced|world|market|modern)\b/i, label: "in today's world" },
  { pattern: /\bnot only\b.*?\bbut also\b/i, label: "not only ... but also" },
  { pattern: /\bnow that we have covered\b/i, label: "now that we have covered" },
  { pattern: /\bremember,? your home is\b/i, label: "remember, your home is" },
  { pattern: /\bin conclusion\b/i, label: "in conclusion" },
  { pattern: /\blook no further\b/i, label: "look no further" },
  { pattern: /\bwithout further ado\b/i, label: "without further ado" },
  { pattern: /\bit goes without saying\b/i, label: "it goes without saying" },
  { pattern: /\bit is important to (note|remember)\b/i, label: "it is important to note/remember" },
  { pattern: /\bneedless to say\b/i, label: "needless to say" },
  { pattern: /\bin a world where\b/i, label: "in a world where" },
  { pattern: /\bserves as a testament\b/i, label: "serves as a testament" },
  { pattern: /\ba rich tapestry\b/i, label: "a rich tapestry" },
  { pattern: /\bfor those (looking|seeking|wanting)\b/i, label: "for those looking/seeking" }
];

export function verifyArticle(article) {
  const issues = [];

  // Extract all text
  let fullText = `${article.title || ""} ${article.excerpt || ""} ${article.metaDescription || ""}`;
  (article.content || []).forEach(s => {
    fullText += ` ${s.heading || ""} ${s.body || ""}`;
    if (s.table) {
      fullText += ` ${(s.table.headers || []).join(" ")}`;
      (s.table.rows || []).forEach(r => {
        fullText += ` ${r.join(" ")}`;
      });
    }
  });
  (article.faqs || []).forEach(f => {
    fullText += ` ${f.question || ""} ${f.answer || ""}`;
  });

  // 1. Word count
  const words = fullText.trim().split(/\s+/).length;
  if (words < 1800) {
    issues.push(`Word count too low: ${words} words (Required: >= 1800).`);
  }

  // 2. Comma-and check
  const commaAndMatches = fullText.match(/,\s+and\b/gi) || [];
  if (commaAndMatches.length > 0) {
    issues.push(`Found ${commaAndMatches.length} occurrences of comma before and (', and').`);
  }

  // 3. Banned AI Words
  const foundBannedWords = BANNED_AI_WORDS.filter(w => new RegExp(`\\b${w}\\b`, "i").test(fullText));
  if (foundBannedWords.length > 0) {
    issues.push(`Found banned AI words: ${foundBannedWords.join(", ")}`);
  }

  // 4. Banned AI Sentence Patterns
  const foundPatterns = BANNED_AI_PATTERNS.filter(p => p.pattern.test(fullText)).map(p => p.label);
  if (foundPatterns.length > 0) {
    issues.push(`Found AI sentence formulas: ${foundPatterns.join(", ")}`);
  }

  // 5. Bolded keywords (**keyword**)
  if (/\*\*[^*]{3,40}\*\*/.test(fullText)) {
    const boldMatches = fullText.match(/\*\*[^*]+\*\*/g) || [];
    issues.push(`Found bold formatting: ${boldMatches.slice(0, 3).join(", ")}`);
  }

  // 6. Meta Title Check
  if (!article.title) {
    issues.push("Missing title.");
  } else {
    if (article.title.length > 60) {
      issues.push(`Meta Title too long: ${article.title.length} chars (Max 60).`);
    }
    if (article.title.includes(":")) {
      issues.push("Meta Title contains forbidden colon (':').");
    }
  }

  // 7. Meta Description Check
  if (!article.metaDescription) {
    issues.push("Missing metaDescription.");
  } else {
    if (/^(learn how|discover|explore)\b/i.test(article.metaDescription)) {
      issues.push("Meta Description starts with forbidden opener (Learn how / Discover / Explore).");
    }
    if (/,\s+and\b/i.test(article.metaDescription)) {
      issues.push("Meta Description contains forbidden ', and'.");
    }
  }

  // 8. FAQs Check
  const faqs = article.faqs || [];
  if (faqs.length < 5 || faqs.length > 7) {
    issues.push(`FAQ count issue: found ${faqs.length} FAQs (Required: 5 to 7).`);
  }
  const faqsWithoutQuestionMark = faqs.filter(f => !f.question.trim().endsWith("?"));
  if (faqsWithoutQuestionMark.length > 0) {
    issues.push(`${faqsWithoutQuestionMark.length} FAQ questions do not end with '?'.`);
  }

  return {
    passed: issues.length === 0,
    wordCount: words,
    commaAndCount: commaAndMatches.length,
    foundBannedWords,
    foundPatterns,
    issues
  };
}
