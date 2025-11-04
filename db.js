import Database from 'better-sqlite3';

const db = new Database('sbo-faq.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// ==================== CATEGORY OPERATIONS ====================

export const categoryOps = {
  // Get all categories (ordered by display_order)
  getAll() {
    return db.prepare(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM questions WHERE category_id = c.id) as question_count
      FROM categories c 
      ORDER BY c.display_order, c.name
    `).all();
  },

  // Get category by ID
  getById(id) {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  },

  // Add new category
  add(name, icon = '', description = '', displayOrder = 0) {
    const stmt = db.prepare(`
      INSERT INTO categories (name, icon, description, display_order)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(name, icon, description, displayOrder);
  },

  // Update category
  update(id, name, icon, description, displayOrder) {
    const stmt = db.prepare(`
      UPDATE categories 
      SET name = ?, icon = ?, description = ?, display_order = ?
      WHERE id = ?
    `);
    return stmt.run(name, icon, description, displayOrder, id);
  },

  // Delete category (will also delete associated questions due to CASCADE)
  delete(id) {
    return db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  }
};

// ==================== QUESTION OPERATIONS ====================

export const questionOps = {
  // Get all questions for a category
  getByCategoryId(categoryId) {
    return db.prepare(`
      SELECT * FROM questions 
      WHERE category_id = ? 
      ORDER BY display_order, id
    `).all(categoryId);
  },

  // Get question by ID
  getById(id) {
    return db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
  },

  // Add new question
  add(categoryId, question, answer, displayOrder = 0, imageUrl = '') {
    const stmt = db.prepare(`
      INSERT INTO questions (category_id, question, answer, display_order, image_url)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(categoryId, question, answer, displayOrder, imageUrl);
  },

  // Update question
  update(id, question, answer, displayOrder, imageUrl = '') {
    const stmt = db.prepare(`
      UPDATE questions 
      SET question = ?, answer = ?, display_order = ?, image_url = ?
      WHERE id = ?
    `);
    return stmt.run(question, answer, displayOrder, imageUrl, id);
  },

  // Delete question
  delete(id) {
    return db.prepare('DELETE FROM questions WHERE id = ?').run(id);
  },

  // Get all questions with category info
  getAllWithCategory() {
    return db.prepare(`
      SELECT q.*, c.name as category_name, c.icon as category_icon
      FROM questions q
      JOIN categories c ON q.category_id = c.id
      ORDER BY c.display_order, q.display_order
    `).all();
  }
};

// ==================== SEARCH OPERATIONS ====================

export const searchOps = {
  // Search questions across all categories
  search(searchTerm) {
    const term = `%${searchTerm}%`;
    return db.prepare(`
      SELECT q.*, c.name as category_name, c.icon as category_icon
      FROM questions q
      JOIN categories c ON q.category_id = c.id
      WHERE q.question LIKE ? OR q.answer LIKE ?
      ORDER BY 
        CASE 
          WHEN q.question LIKE ? THEN 1
          WHEN q.answer LIKE ? THEN 2
          ELSE 3
        END,
        c.display_order,
        q.display_order
      LIMIT 20
    `).all(term, term, term, term);
  }
};

// ==================== VOICE SETTINGS OPERATIONS ====================

// Create voice_settings table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS voice_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    voice_name TEXT DEFAULT '',
    voice_lang TEXT DEFAULT 'en-US',
    voice_rate REAL DEFAULT 1.0,
    voice_pitch REAL DEFAULT 1.0,
    voice_volume REAL DEFAULT 1.0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert default settings if table is empty
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM voice_settings').get();
if (settingsCount.count === 0) {
  db.prepare(`
    INSERT INTO voice_settings (voice_name, voice_lang, voice_rate, voice_pitch, voice_volume)
    VALUES ('', 'en-US', 1.0, 1.0, 1.0)
  `).run();
}

export const voiceSettingsOps = {
  // Get voice settings
  get() {
    return db.prepare('SELECT * FROM voice_settings WHERE id = 1').get();
  },

  // Update voice settings
  update(voiceName, voiceLang, voiceRate, voicePitch, voiceVolume) {
    const stmt = db.prepare(`
      UPDATE voice_settings 
      SET voice_name = ?, 
          voice_lang = ?, 
          voice_rate = ?, 
          voice_pitch = ?, 
          voice_volume = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `);
    return stmt.run(voiceName, voiceLang, voiceRate, voicePitch, voiceVolume);
  }
};

// ==================== IMAGE SUPPORT ====================
// Image support is added via migration script (migrate-add-images.js)
// Questions table now has image_url column

// ==================== FEEDBACK & ANALYTICS ====================
// Feedback and analytics tables are created via migration script
// Tables: feedback, analytics

export const feedbackOps = {
  // Add feedback
  add(questionId, messageType, messageText, feedbackType, comment = '', userSession = '') {
    const stmt = db.prepare(`
      INSERT INTO feedback (question_id, message_type, message_text, feedback_type, comment, user_session)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(questionId, messageType, messageText, feedbackType, comment, userSession);
  },

  // Get all feedback
  getAll(limit = 100) {
    return db.prepare(`
      SELECT f.*, q.question, q.answer, c.name as category_name
      FROM feedback f
      LEFT JOIN questions q ON f.question_id = q.id
      LEFT JOIN categories c ON q.category_id = c.id
      ORDER BY f.created_at DESC
      LIMIT ?
    `).all(limit);
  },

  // Get feedback statistics
  getStats() {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_feedback,
        SUM(CASE WHEN feedback_type = 'helpful' THEN 1 ELSE 0 END) as helpful_count,
        SUM(CASE WHEN feedback_type = 'not_helpful' THEN 1 ELSE 0 END) as not_helpful_count,
        SUM(CASE WHEN message_type = 'faq' THEN 1 ELSE 0 END) as faq_feedback,
        SUM(CASE WHEN message_type = 'ai' THEN 1 ELSE 0 END) as ai_feedback
      FROM feedback
    `).get();

    const topHelpful = db.prepare(`
      SELECT q.id, q.question, c.name as category_name,
             COUNT(*) as helpful_count
      FROM feedback f
      JOIN questions q ON f.question_id = q.id
      JOIN categories c ON q.category_id = c.id
      WHERE f.feedback_type = 'helpful'
      GROUP BY q.id
      ORDER BY helpful_count DESC
      LIMIT 10
    `).all();

    const topUnhelpful = db.prepare(`
      SELECT q.id, q.question, c.name as category_name,
             COUNT(*) as unhelpful_count
      FROM feedback f
      JOIN questions q ON f.question_id = q.id
      JOIN categories c ON q.category_id = c.id
      WHERE f.feedback_type = 'not_helpful'
      GROUP BY q.id
      ORDER BY unhelpful_count DESC
      LIMIT 10
    `).all();

    return { stats, topHelpful, topUnhelpful };
  },

  // Get feedback by question
  getByQuestion(questionId) {
    return db.prepare(`
      SELECT * FROM feedback
      WHERE question_id = ?
      ORDER BY created_at DESC
    `).all(questionId);
  }
};

export const analyticsOps = {
  // Track event
  track(eventType, eventData = {}, questionId = null, categoryId = null, searchTerm = '', mode = 'faq', userSession = '') {
    const stmt = db.prepare(`
      INSERT INTO analytics (event_type, event_data, question_id, category_id, search_term, mode, user_session)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(eventType, JSON.stringify(eventData), questionId, categoryId, searchTerm, mode, userSession);
  },

  // Get analytics dashboard data
  getDashboard(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString();

    // Overall stats
    const overallStats = db.prepare(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(DISTINCT user_session) as unique_users,
        SUM(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) as total_views,
        SUM(CASE WHEN event_type = 'search' THEN 1 ELSE 0 END) as total_searches,
        SUM(CASE WHEN event_type = 'ai_query' THEN 1 ELSE 0 END) as total_ai_queries,
        SUM(CASE WHEN mode = 'faq' THEN 1 ELSE 0 END) as faq_usage,
        SUM(CASE WHEN mode = 'ai' THEN 1 ELSE 0 END) as ai_usage
      FROM analytics
      WHERE created_at >= ?
    `).get(sinceStr);

    // Most viewed questions
    const topQuestions = db.prepare(`
      SELECT q.id, q.question, c.name as category_name, c.icon as category_icon,
             COUNT(*) as view_count
      FROM analytics a
      JOIN questions q ON a.question_id = q.id
      JOIN categories c ON q.category_id = c.id
      WHERE a.event_type = 'view' AND a.created_at >= ?
      GROUP BY q.id
      ORDER BY view_count DESC
      LIMIT 10
    `).all(sinceStr);

    // Popular search terms
    const topSearches = db.prepare(`
      SELECT search_term, COUNT(*) as search_count
      FROM analytics
      WHERE event_type = 'search' AND search_term != '' AND created_at >= ?
      GROUP BY search_term
      ORDER BY search_count DESC
      LIMIT 10
    `).all(sinceStr);

    // Popular categories
    const topCategories = db.prepare(`
      SELECT c.id, c.name, c.icon, COUNT(*) as click_count
      FROM analytics a
      JOIN categories c ON a.category_id = c.id
      WHERE a.event_type = 'category_click' AND a.created_at >= ?
      GROUP BY c.id
      ORDER BY click_count DESC
      LIMIT 10
    `).all(sinceStr);

    // Daily activity
    const dailyActivity = db.prepare(`
      SELECT DATE(created_at) as date, 
             COUNT(*) as event_count,
             COUNT(DISTINCT user_session) as unique_users
      FROM analytics
      WHERE created_at >= ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `).all(sinceStr);

    return {
      overallStats,
      topQuestions,
      topSearches,
      topCategories,
      dailyActivity
    };
  },

  // Get search terms with no results (needs improvement)
  getFailedSearches(limit = 20) {
    return db.prepare(`
      SELECT search_term, COUNT(*) as search_count
      FROM analytics
      WHERE event_type = 'search' AND event_data LIKE '%"results":0%'
      GROUP BY search_term
      ORDER BY search_count DESC
      LIMIT ?
    `).all(limit);
  }
};

// Export database instance for custom queries
export { db };

export default {
  categoryOps,
  questionOps,
  searchOps,
  voiceSettingsOps,
  db
};
