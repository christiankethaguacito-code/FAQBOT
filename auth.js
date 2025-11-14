import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'sbo-faq.db');
const db = new Database(dbPath);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

// ==================== USER AUTHENTICATION ====================

export const authOps = {
  // Helper function to extract name from SKSU email
  extractNameFromEmail: (email) => {
    // Extract the part before @sksu.edu.ph
    const namePart = email.split('@')[0];
    
    // Split by common separators (dots, underscores, hyphens)
    const nameParts = namePart.split(/[._-]/);
    
    // Capitalize each part
    const capitalizedParts = nameParts.map(part => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
    
    // Join with spaces
    return capitalizedParts.join(' ');
  },

  // Register new user
  register: (userData) => {
    const { username, email, password, studentId, department, yearLevel } = userData;
    
    // Validate required fields
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    // Validate SKSU email domain
    if (!email.toLowerCase().endsWith('@sksu.edu.ph')) {
      throw new Error('Only SKSU email addresses (@sksu.edu.ph) are allowed');
    }

    // Extract full name from email
    const fullName = authOps.extractNameFromEmail(email);

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Insert user
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash, full_name, student_id, department, year_level)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(username, email.toLowerCase(), passwordHash, fullName, studentId || null, department || null, yearLevel || null);

    // Initialize user statistics
    const statsStmt = db.prepare('INSERT INTO user_statistics (user_id) VALUES (?)');
    statsStmt.run(result.lastInsertRowid);

    return result.lastInsertRowid;
  },

  // Login user
  login: (usernameOrEmail, password) => {
    // Find user by username or email
    const user = db.prepare(`
      SELECT id, username, email, password_hash, full_name, avatar_url, points, level, badges, preferences, is_active
      FROM users 
      WHERE (username = ? OR email = ?) AND is_active = 1
    `).get(usernameOrEmail, usernameOrEmail);

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isValidPassword = bcrypt.compareSync(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid username or password');
    }

    // Update last login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password hash from response
    delete user.password_hash;

    return { user, token };
  },

  // Verify JWT token
  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },

  // Get user by ID
  getUserById: (userId) => {
    const user = db.prepare(`
      SELECT id, username, email, full_name, avatar_url, student_id, department, 
             year_level, points, level, badges, preferences, created_at, last_login
      FROM users 
      WHERE id = ? AND is_active = 1
    `).get(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Parse JSON fields
    user.badges = JSON.parse(user.badges || '[]');
    user.preferences = JSON.parse(user.preferences || '{}');

    return user;
  },

  // Update user profile
  updateProfile: (userId, updates) => {
    const { fullName, studentId, department, yearLevel, avatarUrl, preferences } = updates;
    
    const stmt = db.prepare(`
      UPDATE users 
      SET full_name = COALESCE(?, full_name),
          student_id = COALESCE(?, student_id),
          department = COALESCE(?, department),
          year_level = COALESCE(?, year_level),
          avatar_url = COALESCE(?, avatar_url),
          preferences = COALESCE(?, preferences),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const preferencesJson = preferences ? JSON.stringify(preferences) : null;
    stmt.run(fullName, studentId, department, yearLevel, avatarUrl, preferencesJson, userId);

    return authOps.getUserById(userId);
  },

  // Change password
  changePassword: (userId, oldPassword, newPassword) => {
    // Get current password hash
    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isValidPassword = bcrypt.compareSync(oldPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = bcrypt.hashSync(newPassword, 10);

    // Update password
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(newPasswordHash, userId);

    return true;
  },

  // Delete account
  deleteAccount: (userId) => {
    db.prepare('UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(userId);
    return true;
  }
};

// ==================== USER STATISTICS ====================

export const userStatsOps = {
  // Get user statistics
  getStats: (userId) => {
    const stats = db.prepare(`
      SELECT * FROM user_statistics WHERE user_id = ?
    `).get(userId);

    if (!stats) {
      // Create stats if they don't exist
      db.prepare('INSERT INTO user_statistics (user_id) VALUES (?)').run(userId);
      return userStatsOps.getStats(userId);
    }

    stats.categories_explored = JSON.parse(stats.categories_explored || '[]');
    return stats;
  },

  // Update statistics
  updateStats: (userId, updates) => {
    const { 
      questionsAsked, aiChatsStarted, quizzesCompleted, 
      easterEggsFound, reactionsGiven, categoryExplored 
    } = updates;

    const currentStats = userStatsOps.getStats(userId);
    let categoriesExplored = currentStats.categories_explored;

    // Add new category if provided
    if (categoryExplored && !categoriesExplored.includes(categoryExplored)) {
      categoriesExplored.push(categoryExplored);
    }

    const stmt = db.prepare(`
      UPDATE user_statistics 
      SET questions_asked = questions_asked + COALESCE(?, 0),
          ai_chats_started = ai_chats_started + COALESCE(?, 0),
          quizzes_completed = quizzes_completed + COALESCE(?, 0),
          easter_eggs_found = easter_eggs_found + COALESCE(?, 0),
          reactions_given = reactions_given + COALESCE(?, 0),
          categories_explored = ?,
          last_activity_date = DATE('now'),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `);

    stmt.run(
      questionsAsked || 0,
      aiChatsStarted || 0,
      quizzesCompleted || 0,
      easterEggsFound || 0,
      reactionsGiven || 0,
      JSON.stringify(categoriesExplored),
      userId
    );

    return userStatsOps.getStats(userId);
  },

  // Update streak
  updateStreak: (userId) => {
    const stats = userStatsOps.getStats(userId);
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = stats.last_activity_date;

    let newStreak = stats.streak_days;

    if (lastActivity) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActivity === yesterdayStr) {
        // Continue streak
        newStreak += 1;
      } else if (lastActivity !== today) {
        // Streak broken
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    db.prepare(`
      UPDATE user_statistics 
      SET streak_days = ?, last_activity_date = DATE('now'), updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(newStreak, userId);

    return newStreak;
  }
};

// ==================== CONVERSATION HISTORY ====================

export const conversationOps = {
  // Save conversation message
  save: (userId, mode, message, response, isUserMessage = true) => {
    const stmt = db.prepare(`
      INSERT INTO conversation_history (user_id, mode, message, response, is_user_message)
      VALUES (?, ?, ?, ?, ?)
    `);

    return stmt.run(userId, mode, message, response || null, isUserMessage ? 1 : 0).lastInsertRowid;
  },

  // Get user conversation history
  getHistory: (userId, limit = 50, offset = 0) => {
    const stmt = db.prepare(`
      SELECT * FROM conversation_history 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);

    return stmt.all(userId, limit, offset);
  },

  // Get history by mode
  getHistoryByMode: (userId, mode, limit = 50) => {
    const stmt = db.prepare(`
      SELECT * FROM conversation_history 
      WHERE user_id = ? AND mode = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);

    return stmt.all(userId, mode, limit);
  },

  // Delete user history
  deleteHistory: (userId) => {
    db.prepare('DELETE FROM conversation_history WHERE user_id = ?').run(userId);
    return true;
  },

  // Search conversation history
  searchHistory: (userId, searchQuery) => {
    const stmt = db.prepare(`
      SELECT * FROM conversation_history 
      WHERE user_id = ? AND (message LIKE ? OR response LIKE ?)
      ORDER BY created_at DESC
      LIMIT 50
    `);

    const query = `%${searchQuery}%`;
    return stmt.all(userId, query, query);
  }
};

// ==================== BOOKMARKS ====================

export const bookmarkOps = {
  // Add bookmark
  add: (userId, questionId, notes = null) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO bookmarks (user_id, question_id, notes)
        VALUES (?, ?, ?)
      `);

      return stmt.run(userId, questionId, notes).lastInsertRowid;
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Question already bookmarked');
      }
      throw error;
    }
  },

  // Remove bookmark
  remove: (userId, questionId) => {
    const stmt = db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND question_id = ?');
    const result = stmt.run(userId, questionId);
    return result.changes > 0;
  },

  // Get all bookmarks for user
  getAll: (userId) => {
    const stmt = db.prepare(`
      SELECT b.*, q.question, q.answer, c.name as category_name, c.icon as category_icon
      FROM bookmarks b
      JOIN questions q ON b.question_id = q.id
      JOIN categories c ON q.category_id = c.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `);

    return stmt.all(userId);
  },

  // Check if question is bookmarked
  isBookmarked: (userId, questionId) => {
    const result = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND question_id = ?')
      .get(userId, questionId);
    return !!result;
  },

  // Update bookmark notes
  updateNotes: (userId, questionId, notes) => {
    const stmt = db.prepare(`
      UPDATE bookmarks 
      SET notes = ?
      WHERE user_id = ? AND question_id = ?
    `);

    stmt.run(notes, userId, questionId);
    return true;
  }
};

// ==================== QUIZ PROGRESS ====================

export const quizProgressOps = {
  // Save quiz result
  save: (userId, quizTopic, score, totalQuestions, timeTaken, completed = true) => {
    const stmt = db.prepare(`
      INSERT INTO quiz_progress (user_id, quiz_topic, score, total_questions, time_taken, completed)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(userId, quizTopic, score, totalQuestions, timeTaken, completed ? 1 : 0).lastInsertRowid;
  },

  // Get quiz history
  getHistory: (userId) => {
    const stmt = db.prepare(`
      SELECT * FROM quiz_progress 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `);

    return stmt.all(userId);
  },

  // Get quiz stats by topic
  getStatsByTopic: (userId, quizTopic) => {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as attempts,
        MAX(score) as best_score,
        AVG(score) as avg_score,
        MIN(time_taken) as fastest_time,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_count
      FROM quiz_progress 
      WHERE user_id = ? AND quiz_topic = ?
    `);

    return stmt.get(userId, quizTopic);
  },

  // Get overall quiz stats
  getOverallStats: (userId) => {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total_quizzes,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_quizzes,
        AVG(score) as avg_score,
        COUNT(DISTINCT quiz_topic) as topics_tried
      FROM quiz_progress 
      WHERE user_id = ?
    `);

    return stmt.get(userId);
  }
};

// ==================== ACHIEVEMENTS ====================

export const achievementOps = {
  // Unlock achievement
  unlock: (userId, achievementId, achievementName) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO user_achievements (user_id, achievement_id, achievement_name)
        VALUES (?, ?, ?)
      `);

      return stmt.run(userId, achievementId, achievementName).lastInsertRowid;
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return null; // Already unlocked
      }
      throw error;
    }
  },

  // Get user achievements
  getAll: (userId) => {
    const stmt = db.prepare(`
      SELECT * FROM user_achievements 
      WHERE user_id = ?
      ORDER BY unlocked_at DESC
    `);

    return stmt.all(userId);
  },

  // Check if achievement is unlocked
  isUnlocked: (userId, achievementId) => {
    const result = db.prepare('SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?')
      .get(userId, achievementId);
    return !!result;
  }
};

// ==================== POINTS & LEVELING ====================

export const gamificationOps = {
  // Add points
  addPoints: (userId, points) => {
    const stmt = db.prepare(`
      UPDATE users 
      SET points = points + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(points, userId);

    // Check for level up
    return gamificationOps.checkLevelUp(userId);
  },

  // Check and update level
  checkLevelUp: (userId) => {
    const user = db.prepare('SELECT points, level FROM users WHERE id = ?').get(userId);
    
    // Level calculation: Level = floor(sqrt(points / 100))
    const newLevel = Math.floor(Math.sqrt(user.points / 100)) + 1;

    if (newLevel > user.level) {
      db.prepare('UPDATE users SET level = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(newLevel, userId);
      return { leveledUp: true, newLevel, points: user.points };
    }

    return { leveledUp: false, level: user.level, points: user.points };
  },

  // Add badge
  addBadge: (userId, badgeId) => {
    const user = db.prepare('SELECT badges FROM users WHERE id = ?').get(userId);
    const badges = JSON.parse(user.badges || '[]');

    if (!badges.includes(badgeId)) {
      badges.push(badgeId);
      db.prepare('UPDATE users SET badges = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(JSON.stringify(badges), userId);
      return true;
    }

    return false;
  },

  // Get leaderboard
  getLeaderboard: (limit = 10) => {
    const stmt = db.prepare(`
      SELECT id, username, full_name, avatar_url, points, level, badges
      FROM users 
      WHERE is_active = 1
      ORDER BY points DESC, level DESC
      LIMIT ?
    `);

    const users = stmt.all(limit);
    users.forEach(user => {
      user.badges = JSON.parse(user.badges || '[]');
    });

    return users;
  }
};
