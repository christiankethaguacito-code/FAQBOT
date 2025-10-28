import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('sbo-faq.db');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    matched_faq_id INTEGER,
    score REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_session TEXT,
    FOREIGN KEY (matched_faq_id) REFERENCES faqs(id)
  );

  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    user_id TEXT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    score REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
  CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id);
  CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
`);

// Migrate existing FAQs from JSON if database is empty
const count = db.prepare('SELECT COUNT(*) as count FROM faqs').get();
if (count.count === 0) {
  console.log('📦 Importing FAQs from faqs.json...');
  const faqs = JSON.parse(fs.readFileSync('faqs.json', 'utf8'));
  const insert = db.prepare(`
    INSERT INTO faqs (category, question, answer, keywords)
    VALUES (?, ?, ?, ?)
  `);
  
  const insertMany = db.transaction((faqs) => {
    for (const faq of faqs) {
      insert.run(
        faq.category,
        faq.question,
        faq.answer,
        JSON.stringify(faq.keywords || [])
      );
    }
  });
  
  insertMany(faqs);
  console.log(`✅ Imported ${faqs.length} FAQs into database`);
}

// FAQ operations
export const faqOps = {
  getAll: () => db.prepare('SELECT * FROM faqs ORDER BY category, id').all(),
  
  getById: (id) => db.prepare('SELECT * FROM faqs WHERE id = ?').get(id),
  
  create: (category, question, answer, keywords) => {
    return db.prepare(`
      INSERT INTO faqs (category, question, answer, keywords)
      VALUES (?, ?, ?, ?)
    `).run(category, question, answer, JSON.stringify(keywords));
  },
  
  update: (id, category, question, answer, keywords) => {
    return db.prepare(`
      UPDATE faqs 
      SET category = ?, question = ?, answer = ?, keywords = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(category, question, answer, JSON.stringify(keywords), id);
  },
  
  delete: (id) => {
    // Delete related analytics records first to avoid foreign key constraint
    db.prepare('DELETE FROM analytics WHERE matched_faq_id = ?').run(id);
    // Now delete the FAQ
    return db.prepare('DELETE FROM faqs WHERE id = ?').run(id);
  }
};

// Analytics operations
export const analyticsOps = {
  logQuery: (question, matchedFaqId, score, sessionId) => {
    return db.prepare(`
      INSERT INTO analytics (question, matched_faq_id, score, user_session)
      VALUES (?, ?, ?, ?)
    `).run(question, matchedFaqId, score, sessionId);
  },
  
  getTopQuestions: (limit = 10) => {
    return db.prepare(`
      SELECT question, COUNT(*) as count
      FROM analytics
      WHERE timestamp > datetime('now', '-30 days')
      GROUP BY LOWER(question)
      ORDER BY count DESC
      LIMIT ?
    `).all(limit);
  },
  
  getStats: () => {
    return db.prepare(`
      SELECT 
        COUNT(*) as total_queries,
        COUNT(DISTINCT user_session) as unique_users,
        AVG(score) as avg_score,
        COUNT(CASE WHEN score < 0.3 THEN 1 END) as low_confidence_queries
      FROM analytics
      WHERE timestamp > datetime('now', '-30 days')
    `).get();
  },
  
  getFAQUsage: () => {
    return db.prepare(`
      SELECT 
        f.id,
        f.category,
        f.question,
        COUNT(a.id) as times_matched
      FROM faqs f
      LEFT JOIN analytics a ON f.id = a.matched_faq_id
      WHERE a.timestamp > datetime('now', '-30 days') OR a.timestamp IS NULL
      GROUP BY f.id
      ORDER BY times_matched DESC
    `).all();
  },

  getUnansweredQuestions: (limit = 50) => {
    return db.prepare(`
      SELECT 
        id,
        question,
        score,
        timestamp,
        user_session,
        COUNT(*) OVER (PARTITION BY LOWER(question)) as times_asked
      FROM analytics
      WHERE score < 0.3 AND timestamp > datetime('now', '-30 days')
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(limit);
  },
  
  deleteUnanswered: (id) => {
    return db.prepare('DELETE FROM analytics WHERE id = ?').run(id);
  }
};

// Chat history operations
export const chatOps = {
  saveMessage: (sessionId, userId, question, answer, score) => {
    return db.prepare(`
      INSERT INTO chat_history (session_id, user_id, question, answer, score)
      VALUES (?, ?, ?, ?, ?)
    `).run(sessionId, userId, question, answer, score);
  },
  
  getHistory: (sessionId, limit = 20) => {
    return db.prepare(`
      SELECT * FROM chat_history
      WHERE session_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(sessionId, limit);
  },
  
  getUserHistory: (userId, limit = 50) => {
    return db.prepare(`
      SELECT * FROM chat_history
      WHERE user_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(userId, limit);
  }
};

export default db;
