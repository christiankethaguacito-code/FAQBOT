import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { categoryOps, questionOps, searchOps, voiceSettingsOps, feedbackOps, analyticsOps } from './db.js';
import { authOps, userStatsOps, conversationOps, bookmarkOps, quizProgressOps, achievementOps, gamificationOps } from './auth.js';
import { authenticateToken, optionalAuth, rateLimit } from './middleware.js';
import Groq from 'groq-sdk';
import messengerRouter from './messenger-bot.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Initialize Multiple Groq API clients for failover
const apiKeys = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2
].filter(key => key && key !== 'your_second_api_key_here'); // Filter out placeholder

const groqClients = apiKeys.map(key => new Groq({ apiKey: key }));

// Track current API key index and rate limit status
let currentKeyIndex = 0;
let keyRateLimitStatus = apiKeys.map(() => ({ limited: false, resetTime: null }));

console.log(`🔑 Initialized ${groqClients.length} Groq API key(s) for failover`);

// Function to get next available API client
function getAvailableGroqClient() {
  // Check if current key is available
  if (!keyRateLimitStatus[currentKeyIndex].limited) {
    return { client: groqClients[currentKeyIndex], keyIndex: currentKeyIndex };
  }
  
  // Find next available key
  for (let i = 0; i < groqClients.length; i++) {
    const nextIndex = (currentKeyIndex + i + 1) % groqClients.length;
    if (!keyRateLimitStatus[nextIndex].limited) {
      currentKeyIndex = nextIndex;
      console.log(`🔄 Switched to API key #${currentKeyIndex + 1}`);
      return { client: groqClients[nextIndex], keyIndex: nextIndex };
    }
  }
  
  return null; // All keys are rate limited
}

// Mark a key as rate limited
function markKeyAsLimited(keyIndex) {
  keyRateLimitStatus[keyIndex].limited = true;
  keyRateLimitStatus[keyIndex].resetTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  console.log(`⚠️ API key #${keyIndex + 1} marked as rate limited`);
}

const SKSU_CONTEXT = `You are an AI assistant for Sultan Kudarat State University (SKSU) Student Body Organization.

CREATOR INFORMATION:
- You were created by: Christian Keth Aguacito
- When asked about your creator, developer, or who made you, always mention: "I was created by Christian Keth Aguacito"

SKSU Information:
- Vision: "A premier state university in Southeast Asia"
- Mission: Providing quality education, research, and community service
- Location: Tacurong City, Sultan Kudarat, Philippines
- Founded: 1983

You help students with:
- Academic policies and procedures
- Student services and welfare
- University rules and regulations
- Campus life and activities
- General inquiries about SKSU

Guidelines:
- Be helpful, friendly, and professional
- Provide accurate information about SKSU
- When asked about your creator/developer, proudly mention Christian Keth Aguacito
- If you don't know something, admit it and suggest contacting the appropriate office
- Keep responses concise and clear
- Use a conversational but respectful tone`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

app.use(express.static('public'));

// Facebook Messenger webhook
console.log('📱 Registering messenger webhook routes...');
app.use('/webhook', messengerRouter);
console.log('✅ Messenger webhook routes registered');

// Test route
app.get('/webhook-test', (req, res) => {
  res.send('Webhook route is registered!');
});

// Admin panel route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// ==================== API ENDPOINTS ====================

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = categoryOps.getAll();
    res.json({ categories });
  } catch (err) {
    console.error('Error in /api/categories:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get questions for a specific category
app.get('/api/categories/:id/questions', (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = categoryOps.getById(categoryId);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const questions = questionOps.getByCategoryId(categoryId);
    res.json({ 
      category,
      questions 
    });
  } catch (err) {
    console.error('Error in /api/categories/:id/questions:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get related questions from the same category
app.get('/api/related-questions', (req, res) => {
  try {
    const categoryId = parseInt(req.query.category);
    const excludeId = parseInt(req.query.exclude);
    const limit = parseInt(req.query.limit) || 3;
    
    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID required' });
    }
    
    // Get all questions from the category
    const allQuestions = questionOps.getByCategoryId(categoryId);
    
    // Filter out the current question and limit results
    const relatedQuestions = allQuestions
      .filter(q => q.id !== excludeId)
      .slice(0, limit)
      .map(q => ({
        id: q.id,
        question: q.question,
        category_id: q.category_id
      }));
    
    res.json({ 
      success: true,
      questions: relatedQuestions 
    });
  } catch (err) {
    console.error('Error in /api/related-questions:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get specific question answer
app.get('/api/questions/:id', (req, res) => {
  try {
    const questionId = parseInt(req.params.id);
    const question = questionOps.getById(questionId);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
  } catch (err) {
    console.error('Error in /api/questions/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

// Search questions
app.post('/api/search', (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.json({ results: [] });
    }
    
    const results = searchOps.search(query.trim());
    res.json({ results });
  } catch (err) {
    console.error('Error in /api/search:', err);
    res.status(500).json({ error: err.message });
  }
});

// AI Chat endpoint with automatic failover
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get available API client
    const availableClient = getAvailableGroqClient();
    
    if (!availableClient) {
      return res.status(429).json({ 
        error: 'All AI API keys have reached their rate limit. Please try again later or use FAQ mode.',
        allKeysLimited: true
      });
    }

    const { client: groq, keyIndex } = availableClient;

    // Build messages array for Groq
    const messages = [
      {
        role: 'system',
        content: SKSU_CONTEXT
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call Groq API with current key
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.1-8b-instant', // Updated to current available model
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
      stream: false
    });

    const aiResponse = completion.choices[0]?.message?.content || 
      'I apologize, but I could not generate a response. Please try again.';

    res.json({ 
      success: true,
      response: aiResponse,
      model: 'llama-3.1-8b-instant',
      apiKeyUsed: keyIndex + 1 // Show which key was used (for debugging)
    });

  } catch (err) {
    console.error('❌ AI Chat Error:', err.message);
    
    if (err.status === 429) {
      // Mark current key as rate limited
      markKeyAsLimited(currentKeyIndex);
      
      // Try with next available key
      const nextClient = getAvailableGroqClient();
      
      if (nextClient) {
        return res.status(200).json({ 
          success: false,
          retry: true,
          message: 'Switching to backup API key. Please retry your request.',
          switchedToKey: nextClient.keyIndex + 1
        });
      } else {
        return res.status(429).json({ 
          error: 'All AI API keys have reached their rate limit. Please try again in 24 hours or use FAQ mode.',
          allKeysLimited: true
        });
      }
    }
    
    if (err.status === 401) {
      return res.status(401).json({ 
        error: 'AI service configuration error. Please contact the administrator.' 
      });
    }
    
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// ==================== AUTHENTICATION ENDPOINTS ====================

// Register new user
app.post('/api/auth/register', rateLimit(10, 15 * 60 * 1000), async (req, res) => {
  try {
    const userId = authOps.register(req.body);
    const loginResult = authOps.login(req.body.username, req.body.password);
    
    res.json({ 
      success: true, 
      message: 'Registration successful',
      user: loginResult.user,
      token: loginResult.token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Login user
app.post('/api/auth/login', rateLimit(20, 15 * 60 * 1000), async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const result = authOps.login(usernameOrEmail, password);
    
    res.json({ 
      success: true,
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = authOps.getUserById(req.user.id);
    const stats = userStatsOps.getStats(req.user.id);
    
    res.json({ 
      success: true,
      user,
      stats
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const user = authOps.updateProfile(req.user.id, req.body);
    
    res.json({ 
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Change password
app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    authOps.changePassword(req.user.id, oldPassword, newPassword);
    
    res.json({ 
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete account
app.delete('/api/auth/account', authenticateToken, (req, res) => {
  try {
    authOps.deleteAccount(req.user.id);
    
    res.json({ 
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER STATISTICS ENDPOINTS ====================

// Get user statistics
app.get('/api/user/stats', authenticateToken, (req, res) => {
  try {
    const stats = userStatsOps.getStats(req.user.id);
    
    res.json({ 
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user statistics
app.post('/api/user/stats', authenticateToken, (req, res) => {
  try {
    const stats = userStatsOps.updateStats(req.user.id, req.body);
    userStatsOps.updateStreak(req.user.id);
    
    res.json({ 
      success: true,
      stats
    });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== CONVERSATION HISTORY ENDPOINTS ====================

// Save conversation
app.post('/api/conversations', authenticateToken, (req, res) => {
  try {
    const { mode, message, response, isUserMessage } = req.body;
    const id = conversationOps.save(req.user.id, mode, message, response, isUserMessage);
    
    res.json({ 
      success: true,
      id
    });
  } catch (error) {
    console.error('Save conversation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get conversation history
app.get('/api/conversations', authenticateToken, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const mode = req.query.mode;
    
    let history;
    if (mode) {
      history = conversationOps.getHistoryByMode(req.user.id, mode, limit);
    } else {
      history = conversationOps.getHistory(req.user.id, limit, offset);
    }
    
    res.json({ 
      success: true,
      history
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search conversation history
app.get('/api/conversations/search', authenticateToken, (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const results = conversationOps.searchHistory(req.user.id, query);
    
    res.json({ 
      success: true,
      results
    });
  } catch (error) {
    console.error('Search history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete conversation history
app.delete('/api/conversations', authenticateToken, (req, res) => {
  try {
    conversationOps.deleteHistory(req.user.id);
    
    res.json({ 
      success: true,
      message: 'Conversation history deleted'
    });
  } catch (error) {
    console.error('Delete history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== BOOKMARKS ENDPOINTS ====================

// Add bookmark
app.post('/api/bookmarks', authenticateToken, (req, res) => {
  try {
    const { questionId, notes } = req.body;
    const id = bookmarkOps.add(req.user.id, questionId, notes);
    
    // Award points for bookmarking
    gamificationOps.addPoints(req.user.id, 5);
    
    res.json({ 
      success: true,
      id,
      message: 'Bookmark added (+5 points!)'
    });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Remove bookmark
app.delete('/api/bookmarks/:questionId', authenticateToken, (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const removed = bookmarkOps.remove(req.user.id, questionId);
    
    if (!removed) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json({ 
      success: true,
      message: 'Bookmark removed'
    });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all bookmarks
app.get('/api/bookmarks', authenticateToken, (req, res) => {
  try {
    const bookmarks = bookmarkOps.getAll(req.user.id);
    
    res.json({ 
      success: true,
      bookmarks
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check if question is bookmarked
app.get('/api/bookmarks/check/:questionId', authenticateToken, (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const isBookmarked = bookmarkOps.isBookmarked(req.user.id, questionId);
    
    res.json({ 
      success: true,
      isBookmarked
    });
  } catch (error) {
    console.error('Check bookmark error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update bookmark notes
app.put('/api/bookmarks/:questionId', authenticateToken, (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const { notes } = req.body;
    bookmarkOps.updateNotes(req.user.id, questionId, notes);
    
    res.json({ 
      success: true,
      message: 'Notes updated'
    });
  } catch (error) {
    console.error('Update notes error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== QUIZ PROGRESS ENDPOINTS ====================

// Save quiz result
app.post('/api/quiz/progress', authenticateToken, (req, res) => {
  try {
    const { quizTopic, score, totalQuestions, timeTaken, completed } = req.body;
    const id = quizProgressOps.save(req.user.id, quizTopic, score, totalQuestions, timeTaken, completed);
    
    // Award points based on score
    const pointsEarned = Math.floor((score / totalQuestions) * 50);
    const result = gamificationOps.addPoints(req.user.id, pointsEarned);
    
    // Update stats
    userStatsOps.updateStats(req.user.id, { quizzesCompleted: 1 });
    
    res.json({ 
      success: true,
      id,
      pointsEarned,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel || result.level
    });
  } catch (error) {
    console.error('Save quiz error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get quiz history
app.get('/api/quiz/history', authenticateToken, (req, res) => {
  try {
    const history = quizProgressOps.getHistory(req.user.id);
    
    res.json({ 
      success: true,
      history
    });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get quiz stats by topic
app.get('/api/quiz/stats/:topic', authenticateToken, (req, res) => {
  try {
    const stats = quizProgressOps.getStatsByTopic(req.user.id, req.params.topic);
    
    res.json({ 
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get overall quiz stats
app.get('/api/quiz/stats', authenticateToken, (req, res) => {
  try {
    const stats = quizProgressOps.getOverallStats(req.user.id);
    
    res.json({ 
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get overall quiz stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ACHIEVEMENTS ENDPOINTS ====================

// Get user achievements
app.get('/api/achievements', authenticateToken, (req, res) => {
  try {
    const achievements = achievementOps.getAll(req.user.id);
    
    res.json({ 
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Unlock achievement
app.post('/api/achievements', authenticateToken, (req, res) => {
  try {
    const { achievementId, achievementName } = req.body;
    const id = achievementOps.unlock(req.user.id, achievementId, achievementName);
    
    if (id) {
      // Award points for unlocking achievement
      gamificationOps.addPoints(req.user.id, 25);
      gamificationOps.addBadge(req.user.id, achievementId);
      
      res.json({ 
        success: true,
        id,
        message: 'Achievement unlocked! (+25 points)',
        newAchievement: true
      });
    } else {
      res.json({ 
        success: true,
        message: 'Achievement already unlocked',
        newAchievement: false
      });
    }
  } catch (error) {
    console.error('Unlock achievement error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== GAMIFICATION ENDPOINTS ====================

// Get leaderboard
app.get('/api/leaderboard', optionalAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = gamificationOps.getLeaderboard(limit);
    
    res.json({ 
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add points (manual - for testing or special events)
app.post('/api/gamification/points', authenticateToken, (req, res) => {
  try {
    const { points, reason } = req.body;
    const result = gamificationOps.addPoints(req.user.id, points);
    
    res.json({ 
      success: true,
      ...result,
      reason: reason || 'Points added'
    });
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMIN ENDPOINTS ====================

// Get all questions with category info (for admin)
app.get('/api/admin/questions', (req, res) => {
  try {
    const questions = questionOps.getAllWithCategory();
    res.json({ questions });
  } catch (err) {
    console.error('Error in /api/admin/questions:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add category
app.post('/api/admin/categories', (req, res) => {
  try {
    const { name, icon, description, displayOrder } = req.body;
    const result = categoryOps.add(name, icon || '', description || '', displayOrder || 0);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add question
app.post('/api/admin/questions', (req, res) => {
  try {
    const { categoryId, question, answer, displayOrder, imageUrl } = req.body;
    const result = questionOps.add(categoryId, question, answer, displayOrder || 0, imageUrl || '');
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Error adding question:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update category
app.put('/api/admin/categories/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, icon, description, displayOrder } = req.body;
    categoryOps.update(id, name, icon, description, displayOrder);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update question
app.put('/api/admin/questions/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { question, answer, displayOrder, imageUrl } = req.body;
    questionOps.update(id, question, answer, displayOrder, imageUrl || '');
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating question:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete category
app.delete('/api/admin/categories/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    categoryOps.delete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete question
app.delete('/api/admin/questions/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    questionOps.delete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== VOICE SETTINGS ENDPOINTS ====================

// Get voice settings
app.get('/api/voice-settings', (req, res) => {
  try {
    const settings = voiceSettingsOps.get();
    console.log('📥 GET /api/voice-settings - Returning:', settings);
    res.json({ settings });
  } catch (err) {
    console.error('❌ Error getting voice settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update voice settings (admin only)
app.put('/api/admin/voice-settings', (req, res) => {
  try {
    const { voiceName, voiceLang, voiceRate, voicePitch, voiceVolume } = req.body;
    console.log('💾 PUT /api/admin/voice-settings - Received:', req.body);
    
    voiceSettingsOps.update(
      voiceName || '',
      voiceLang || 'en-US',
      parseFloat(voiceRate) || 1.0,
      parseFloat(voicePitch) || 1.0,
      parseFloat(voiceVolume) || 1.0
    );
    
    // Verify the update
    const updatedSettings = voiceSettingsOps.get();
    console.log('✅ Voice settings updated:', updatedSettings);
    
    res.json({ success: true, settings: updatedSettings });
  } catch (err) {
    console.error('❌ Error updating voice settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== FEEDBACK ENDPOINTS ====================

// Submit feedback
app.post('/api/feedback', (req, res) => {
  try {
    const { questionId, messageType, messageText, feedbackType, comment, userSession } = req.body;
    
    if (!messageType || !messageText || !feedbackType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!['helpful', 'not_helpful'].includes(feedbackType)) {
      return res.status(400).json({ error: 'Invalid feedback type' });
    }
    
    const result = feedbackOps.add(
      questionId || null,
      messageType,
      messageText,
      feedbackType,
      comment || '',
      userSession || ''
    );
    
    console.log(`📊 Feedback received: ${feedbackType} for ${messageType} message`);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all feedback (admin only)
app.get('/api/admin/feedback', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const feedback = feedbackOps.getAll(limit);
    res.json({ feedback });
  } catch (err) {
    console.error('Error getting feedback:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get feedback statistics (admin only)
app.get('/api/admin/feedback/stats', (req, res) => {
  try {
    const stats = feedbackOps.getStats();
    res.json(stats);
  } catch (err) {
    console.error('Error getting feedback stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get feedback for specific question (admin only)
app.get('/api/admin/questions/:id/feedback', (req, res) => {
  try {
    const questionId = parseInt(req.params.id);
    const feedback = feedbackOps.getByQuestion(questionId);
    res.json({ feedback });
  } catch (err) {
    console.error('Error getting question feedback:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== ANALYTICS ENDPOINTS ====================

// Track analytics event
app.post('/api/analytics/track', (req, res) => {
  try {
    const { eventType, eventData, questionId, categoryId, searchTerm, mode, userSession } = req.body;
    
    if (!eventType) {
      return res.status(400).json({ error: 'Event type is required' });
    }
    
    const result = analyticsOps.track(
      eventType,
      eventData || {},
      questionId || null,
      categoryId || null,
      searchTerm || '',
      mode || 'faq',
      userSession || ''
    );
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Error tracking analytics:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get analytics dashboard (admin only)
app.get('/api/admin/analytics/dashboard', (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const dashboard = analyticsOps.getDashboard(days);
    res.json(dashboard);
  } catch (err) {
    console.error('Error getting analytics dashboard:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get failed searches (admin only)
app.get('/api/admin/analytics/failed-searches', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const failedSearches = analyticsOps.getFailedSearches(limit);
    res.json({ failedSearches });
  } catch (err) {
    console.error('Error getting failed searches:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== SERVER ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ FAQ Bot Server running at http://localhost:${PORT}`);
  console.log(`📖 Open your browser and visit the URL above`);
});
