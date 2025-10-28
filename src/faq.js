// Simple tokenization and Jaccard-like similarity for FAQ matching.
function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[\W_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function toSet(tokens) {
  return new Set(tokens);
}

function jaccard(aTokens, bTokens) {
  const a = toSet(aTokens);
  const b = toSet(bTokens);
  const inter = [...a].filter(x => b.has(x)).length;
  const uni = new Set([...a, ...b]).size;
  if (uni === 0) return 0;
  return inter / uni;
}

export function findBestAnswer(question, faqs) {
  const qTokens = tokenize(question);
  let best = { score: 0, answer: null, faq: null };
  
  for (const f of faqs) {
    // Combine question, answer, keywords, and category for matching
    const keywords = Array.isArray(f.keywords) ? f.keywords.join(' ') : '';
    const category = f.category || '';
    const text = `${f.question} ${f.answer} ${keywords} ${category}`;
    
    let score = jaccard(qTokens, tokenize(text));
    
    // Boost score if question keywords match exactly
    if (keywords) {
      const kwTokens = tokenize(keywords);
      const kwMatch = qTokens.some(qt => kwTokens.includes(qt));
      if (kwMatch) score += 0.15; // Keyword boost
    }
    
    if (score > best.score) {
      best = { score, answer: f.answer, faq: f };
    }
  }
  
  return best;
}
