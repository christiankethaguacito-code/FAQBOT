import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { faqOps, analyticsOps, chatOps } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Session middleware
app.use((req, res, next) => {
  req.sessionId = req.headers['x-session-id'] || crypto.randomUUID();
  res.setHeader('X-Session-ID', req.sessionId);
  next();
});

// Helper functions
function tokenize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function score(question, faq) {
  const qTokens = new Set(tokenize(question));
  const keywords = faq.keywords ? JSON.parse(faq.keywords) : [];
  const allText = `${faq.question} ${faq.answer} ${keywords.join(' ')} ${faq.category || ''}`;
  const fTokens = tokenize(allText);
  
  let matches = 0;
  for (const token of fTokens) {
    if (qTokens.has(token)) matches++;
  }
  
  const keywordBonus = keywords.some(kw => question.toLowerCase().includes(kw.toLowerCase())) ? 0.2 : 0;
  return (matches / (qTokens.size + fTokens.length - matches)) + keywordBonus;
}

// ========== PUBLIC API ==========

app.get('/api/faqs', (req, res) => {
  try {
    const faqs = faqOps.getAll().map(faq => ({
      ...faq,
      keywords: JSON.parse(faq.keywords || '[]')
    }));
    res.json(faqs);
  } catch (err) {
    console.error('Error /api/faqs:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ask', (req, res) => {
  try {
    const question = req.body?.question?.trim();
    if (!question) return res.status(400).json({ error: 'Question required' });
    
    const faqs = faqOps.getAll();
    let best = { score: 0, answer: null, faq: null };
    
    for (const faq of faqs) {
      const s = score(question, faq);
      if (s > best.score) {
        best = { score: s, answer: faq.answer, faq };
      }
    }
    
    const answer = best.answer || "I'm not sure about that. Please email us at sksustudentbodyorganizationisu@gmail.com or visit sboweb.vercel.app";
    
    // Log analytics & chat history
    analyticsOps.logQuery(question, best.faq?.id || null, best.score, req.sessionId);
    chatOps.saveMessage(req.sessionId, req.body?.userId || null, question, answer, best.score);
    
    res.json({
      answer,
      source: 'local',
      score: best.score,
      category: best.faq?.category,
      sessionId: req.sessionId
    });
  } catch (err) {
    console.error('Error /api/ask:', err);
    res.status(500).json({ error: err.message });
  }
});

// ========== ADMIN PANEL ==========

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.use('/admin', express.static('admin'));

// Admin - Get all FAQs
app.get('/api/admin/faqs', (req, res) => {
  try {
    const faqs = faqOps.getAll().map(faq => ({
      ...faq,
      keywords: JSON.parse(faq.keywords || '[]')
    }));
    res.json(faqs);
  } catch (err) {
    console.error('Error admin/faqs:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin - Create FAQ
app.post('/api/admin/faqs', (req, res) => {
  try {
    const { category, question, answer, keywords } = req.body;
    const result = faqOps.create(category, question, answer, keywords || []);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Error creating FAQ:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin - Update FAQ
app.put('/api/admin/faqs/:id', (req, res) => {
  try {
    const { category, question, answer, keywords } = req.body;
    faqOps.update(req.params.id, category, question, answer, keywords || []);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating FAQ:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin - Delete FAQ
app.delete('/api/admin/faqs/:id', (req, res) => {
  try {
    faqOps.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting FAQ:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin - Analytics
app.get('/api/admin/analytics', (req, res) => {
  try {
    res.json({
      stats: analyticsOps.getStats(),
      topQuestions: analyticsOps.getTopQuestions(20),
      faqUsage: analyticsOps.getFAQUsage()
    });
  } catch (err) {
    console.error('Error analytics:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin - Get unanswered questions
app.get('/api/admin/unanswered', (req, res) => {
  try {
    const unanswered = analyticsOps.getUnansweredQuestions(100);
    res.json(unanswered);
  } catch (err) {
    console.error('Error getting unanswered:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin - Delete unanswered question from analytics
app.delete('/api/admin/unanswered/:id', (req, res) => {
  try {
    analyticsOps.deleteUnanswered(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting unanswered:', err);
    res.status(500).json({ error: err.message });
  }
});

// ========== START SERVER ==========

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ SKSU SBO FAQ Bot is RUNNING!`);
  console.log(`${'='.repeat(50)}`);
  console.log(`📱 Student View:  http://localhost:${PORT}`);
  console.log(`🛠️  Admin Panel:   http://localhost:${PORT}/admin`);
  console.log(`📊 Database:      sbo-faq.db (${faqOps.getAll().length} FAQs loaded)`);
  console.log(`${'='.repeat(50)}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error(`   Run: Stop-Process -Name node -Force`);
    process.exit(1);
  }
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
  process.exit(1);
});
