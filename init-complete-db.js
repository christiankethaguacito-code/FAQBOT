import Database from 'better-sqlite3';
import fs from 'fs';
import { join } from 'path';

// Use environment-based path (for Railway volume support)
const DB_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || process.env.DATA_DIR || './';
const DB_PATH = join(DB_DIR, 'sbo-faq.db');

console.log('📁 Database path:', DB_PATH);

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Create or open database
const db = new Database(DB_PATH);

console.log('📦 Initializing complete database structure...\n');

// 1. Categories table
console.log('1️⃣ Creating categories table...');
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 2. Questions table
console.log('2️⃣ Creating questions table...');
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  )
`);

// 3. Voice settings table
console.log('3️⃣ Creating voice_settings table...');
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

// Insert default voice settings if empty
const voiceCount = db.prepare('SELECT COUNT(*) as count FROM voice_settings').get();
if (voiceCount.count === 0) {
  db.prepare(`
    INSERT INTO voice_settings (voice_name, voice_lang, voice_rate, voice_pitch, voice_volume)
    VALUES ('', 'en-US', 1.0, 1.0, 1.0)
  `).run();
  console.log('   ✅ Default voice settings inserted');
}

// 4. Admin users table
console.log('4️⃣ Creating admin_users table...');
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  )
`);

// Insert default admin user if empty
const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
if (adminCount.count === 0) {
  const defaultPassword = process.env.ADMIN_PASSWORD || 'sksu2024';
  db.prepare(`
    INSERT INTO admin_users (username, password_hash)
    VALUES ('admin', ?)
  `).run(defaultPassword);
  console.log('   ✅ Default admin user created (username: admin)');
}

// 5. Feedback table
console.log('5️⃣ Creating feedback table...');
db.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER,
    message_type TEXT,
    message_text TEXT,
    feedback_type TEXT,
    comment TEXT,
    user_session TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL
  )
`);

// 6. Analytics table
console.log('6️⃣ Creating analytics table...');
db.exec(`
  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    question_id INTEGER,
    category_id INTEGER,
    search_query TEXT,
    user_session TEXT,
    response_time INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  )
`);

// Create indexes for better performance
console.log('7️⃣ Creating indexes...');
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category_id);
  CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);
  CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(display_order);
  CREATE INDEX IF NOT EXISTS idx_feedback_question ON feedback(question_id);
  CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at);
  CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event_type);
  CREATE INDEX IF NOT EXISTS idx_analytics_question ON analytics(question_id);
  CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics(created_at);
`);

// Summary
console.log('\n✅ Database structure complete!\n');
console.log('📊 Tables created:');
const tables = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' AND name NOT LIKE 'sqlite_%'
  ORDER BY name
`).all();
tables.forEach(t => console.log(`   - ${t.name}`));

console.log('\n📈 Row counts:');
console.log(`   - Categories: ${db.prepare('SELECT COUNT(*) as count FROM categories').get().count}`);
console.log(`   - Questions: ${db.prepare('SELECT COUNT(*) as count FROM questions').get().count}`);
console.log(`   - Voice Settings: ${db.prepare('SELECT COUNT(*) as count FROM voice_settings').get().count}`);
console.log(`   - Admin Users: ${db.prepare('SELECT COUNT(*) as count FROM admin_users').get().count}`);
console.log(`   - Feedback: ${db.prepare('SELECT COUNT(*) as count FROM feedback').get().count}`);
console.log(`   - Analytics: ${db.prepare('SELECT COUNT(*) as count FROM analytics').get().count}`);

db.close();
console.log('\n✅ Database ready for use!');
