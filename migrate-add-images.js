import Database from 'better-sqlite3';

console.log('🔄 Running database migration: Add image support...');

// Don't import db.js, create our own connection to avoid initialization issues
const db = new Database('sbo-faq.db');

try {
  // Check if image_url column exists
  const hasImageColumn = db.prepare(`
    SELECT COUNT(*) as count FROM pragma_table_info('questions') WHERE name='image_url'
  `).get();

  if (hasImageColumn.count === 0) {
    // Add image_url column to questions table
    db.exec(`ALTER TABLE questions ADD COLUMN image_url TEXT DEFAULT ''`);
    console.log('✅ Added image_url column to questions table');
  } else {
    console.log('ℹ️  image_url column already exists');
  }

  // Create feedback table
  db.exec(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER,
      message_type TEXT NOT NULL,
      message_text TEXT NOT NULL,
      feedback_type TEXT NOT NULL,
      comment TEXT DEFAULT '',
      user_session TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL
    )
  `);
  console.log('✅ Created feedback table');

  // Create analytics table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      event_data TEXT DEFAULT '',
      question_id INTEGER,
      category_id INTEGER,
      search_term TEXT DEFAULT '',
      mode TEXT DEFAULT 'faq',
      user_session TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);
  console.log('✅ Created analytics table');

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
  console.log('✅ Created/verified voice_settings table');

  // Check if voice_settings has any rows
  try {
    const hasSettings = db.prepare('SELECT COUNT(*) as count FROM voice_settings').get();
    if (hasSettings.count === 0) {
      db.exec(`INSERT INTO voice_settings (id) VALUES (1)`);
      console.log('✅ Added default voice settings');
    } else {
      console.log('ℹ️  Voice settings already configured');
    }
  } catch (err) {
    console.log('ℹ️  Skipping voice settings check:', err.message);
  }

  // Create indexes
  try {
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at);
      CREATE INDEX IF NOT EXISTS idx_feedback_question ON feedback(question_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics(created_at);
      CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event_type);
    `);
    console.log('✅ Created indexes for better performance');
  } catch (err) {
    console.log('⚠️  Warning: Could not create some indexes:', err.message);
  }

  console.log('\n🎉 Migration completed successfully!');
  console.log('\n📊 New features enabled:');
  console.log('  1. ✅ Image support in FAQ responses');
  console.log('  2. ✅ User feedback system (helpful/not helpful)');
  console.log('  3. ✅ Analytics tracking (views, searches, clicks)');
  console.log('  4. ✅ Voice settings (if not already present)');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}

db.close();
