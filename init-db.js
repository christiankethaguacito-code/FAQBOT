import Database from 'better-sqlite3';
import fs from 'fs';

// Remove old database
if (fs.existsSync('sbo-faq.db')) {
  fs.unlinkSync('sbo-faq.db');
  console.log('🗑️ Removed old database');
}

// Create new database
const db = new Database('sbo-faq.db');

console.log('📦 Creating new category-based FAQ database...');

// Create categories table
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

// Create questions table
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  )
`);

// Create indexes for better performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category_id);
  CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);
  CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(display_order);
`);

console.log('✅ Database structure created!');
console.log('\n📊 Tables created:');
console.log('  1. categories - Store FAQ categories');
console.log('  2. questions - Store questions and answers for each category');
console.log('\n🎨 Ready to add your categories and questions!');

db.close();
