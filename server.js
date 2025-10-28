import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { faqOps, analyticsOps, chatOps } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.use('/admin', express.static('admin'));

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

// Middleware to handle session
app.use((req, res, next) => {
  if (!req.headers['x-session-id']) {
    req.sessionId = crypto.randomUUID();
    res.setHeader('X-Session-ID', req.sessionId);
  } else {
    req.sessionId = req.headers['x-session-id'];
  }
  next();
});

app.get('/api/faqs', (req, res) => {
  try {
    const faqs = faqOps.getAll().map(faq => ({
      ...faq,
      keywords: JSON.parse(faq.keywords || '[]')
    }));
    res.json(faqs);
  } catch (err) {
    console.error('Error in /api/faqs:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ask', (req, res) => {
  try {
    const question = req.body?.question?.trim();
    const userId = req.body?.userId || null;
    
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
    
    // Log analytics
    analyticsOps.logQuery(question, best.faq?.id || null, best.score, req.sessionId);
    
    // Save to chat history
    chatOps.saveMessage(req.sessionId, userId, question, answer, best.score);
    
    res.json({
      answer,
      source: 'local',
      score: best.score,
      category: best.faq?.category,
      sessionId: req.sessionId
    });
  } catch (err) {
    console.error('Error in /api/ask:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin API endpoints
app.get('/api/admin/faqs', (req, res) => {
  try {
    const faqs = faqOps.getAll().map(faq => ({
      ...faq,
      keywords: JSON.parse(faq.keywords || '[]')
    }));
    res.json(faqs);
  } catch (err) {
    console.error('Error in /api/admin/faqs:', err);
    res.status(500).json({ error: err.message });
  }
});

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

app.delete('/api/admin/faqs/:id', (req, res) => {
  try {
    faqOps.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting FAQ:', err);
    res.status(500).json({ error: err.message });
  }
});

// Analytics endpoints
app.get('/api/admin/analytics', (req, res) => {
  try {
    res.json({
      stats: analyticsOps.getStats(),
      topQuestions: analyticsOps.getTopQuestions(20),
      faqUsage: analyticsOps.getFAQUsage()
    });
  } catch (err) {
    console.error('Error in analytics:', err);
    res.status(500).json({ error: err.message });
  }
});

// Chat history endpoints
app.get('/api/chat/history/:sessionId', (req, res) => {
  try {
    const history = chatOps.getHistory(req.params.sessionId);
    res.json(history);
  } catch (err) {
    console.error('Error in chat history:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`✅ Student FAQ Bot running at http://localhost:${PORT}`);
  console.log(`📖 Open your browser and visit the URL above`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
