import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { faqOps, analyticsOps, chatOps } from './db.js';
import groqAI from './services/groq-ai.js';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// AI feature flags (can be toggled via environment variables)
const AI_ENABLED = process.env.AI_ENABLED !== 'false';
const AI_CONVERSATIONAL = process.env.AI_CONVERSATIONAL !== 'false';
const AI_ENHANCED_MATCHING = process.env.AI_ENHANCED_MATCHING !== 'false';

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

app.post('/api/ask', async (req, res) => {
  try {
    const question = req.body?.question?.trim();
    const userId = req.body?.userId || null;
    const useAI = req.body?.useAI !== false; // Client can disable AI per request
    
    if (!question) return res.status(400).json({ error: 'Question required' });
    
    const faqs = faqOps.getAll();
    let best = { score: 0, answer: null, faq: null };
    let aiMatch = null;
    let questionType = null;
    
    // Step 1: Classify the question (organization-related or general knowledge)
    if (AI_ENABLED && useAI) {
      try {
        questionType = await groqAI.classifyQuestion(question);
        console.log(`Question type: ${questionType.isOrganizationRelated ? 'Organization' : 'General Knowledge'} (${(questionType.confidence * 100).toFixed(0)}%)`);
      } catch (error) {
        console.error('Question classification failed:', error.message);
      }
    }
    
    // Try AI-enhanced matching first if enabled
    if (AI_ENABLED && AI_ENHANCED_MATCHING && useAI) {
      try {
        aiMatch = await groqAI.enhancedFAQMatch(question, faqs);
        if (aiMatch && aiMatch.confidence > best.score) {
          best = {
            score: aiMatch.confidence,
            answer: aiMatch.faq.answer,
            faq: aiMatch.faq,
            source: 'ai-enhanced',
            reasoning: aiMatch.reasoning
          };
        }
      } catch (aiError) {
        console.error('AI matching failed, falling back to local:', aiError.message);
      }
    }
    
    // Fallback to local matching if AI didn't find a good match
    if (best.score < 0.3) {
      for (const faq of faqs) {
        const s = score(question, faq);
        if (s > best.score) {
          best = { score: s, answer: faq.answer, faq };
        }
      }
    }
    
    let finalAnswer = null;
    let source = best.source || 'local';
    
    // Step 2: Decide how to answer based on question type and match quality
    if (best.faq && best.score >= 0.3) {
      // We have a good FAQ match - use conversational response
      finalAnswer = best.answer;
      
      if (AI_ENABLED && AI_CONVERSATIONAL && useAI) {
        try {
          const conversationalAnswer = await groqAI.generateConversationalResponse(
            question,
            faqs,
            best.answer,
            best.score
          );
          if (conversationalAnswer && conversationalAnswer !== best.answer) {
            finalAnswer = conversationalAnswer;
            source = 'ai-conversational';
          }
        } catch (aiError) {
          console.error('AI conversation failed, using original answer:', aiError.message);
        }
      }
    } else if (questionType && !questionType.isOrganizationRelated && AI_ENABLED && useAI) {
      // General knowledge question (math, English, etc.) - let AI answer directly
      try {
        finalAnswer = await groqAI.answerGeneralQuestion(question);
        source = 'ai-general-knowledge';
      } catch (aiError) {
        console.error('AI general answer failed:', aiError.message);
        finalAnswer = "I'm having trouble answering that right now. Please try again.";
        source = 'error';
      }
    } else {
      // Organization-related but no good FAQ match - suggest contacting SBO
      finalAnswer = "I'm not sure about that specific question regarding SKSU SBO. Please email us at sksustudentbodyorganizationisu@gmail.com or visit sboweb.vercel.app for more information.";
      source = 'fallback';
    }
    
    // Get related FAQs for smart suggestions (only for organization questions)
    let relatedFAQs = [];
    if (AI_ENABLED && useAI && (best.faq || (questionType && questionType.isOrganizationRelated))) {
      try {
        relatedFAQs = await groqAI.findRelatedFAQs(question, faqs.filter(f => f.id !== best.faq?.id));
      } catch (aiError) {
        console.error('AI related FAQs failed:', aiError.message);
      }
    }
    
    // Log analytics
    analyticsOps.logQuery(question, best.faq?.id || null, best.score, req.sessionId);
    
    // Save to chat history
    chatOps.saveMessage(req.sessionId, userId, question, finalAnswer, best.score);
    
    res.json({
      answer: finalAnswer,
      source,
      score: best.score,
      category: best.faq?.category,
      sessionId: req.sessionId,
      relatedFAQs: relatedFAQs.slice(0, 3).map(f => ({
        question: f.question,
        category: f.category
      })),
      aiEnabled: AI_ENABLED,
      reasoning: best.reasoning
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

// AI-powered admin endpoints
app.post('/api/admin/ai/generate-answer', async (req, res) => {
  try {
    if (!AI_ENABLED) {
      return res.status(503).json({ error: 'AI features are disabled' });
    }
    
    const { question, category } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question required' });
    }
    
    const answer = await groqAI.generateFAQAnswer(question, category);
    res.json({ answer, source: 'ai-generated' });
  } catch (err) {
    console.error('Error generating answer:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/ai/generate-keywords', async (req, res) => {
  try {
    if (!AI_ENABLED) {
      return res.status(503).json({ error: 'AI features are disabled' });
    }
    
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer required' });
    }
    
    const keywords = await groqAI.generateKeywords(question, answer);
    res.json({ keywords, source: 'ai-generated' });
  } catch (err) {
    console.error('Error generating keywords:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/ai/status', (req, res) => {
  res.json({
    enabled: AI_ENABLED,
    conversational: AI_CONVERSATIONAL,
    enhancedMatching: AI_ENHANCED_MATCHING,
    provider: 'Groq',
    model: 'llama-3.1-70b-versatile'
  });
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
