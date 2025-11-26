import { db } from './db.js';

console.log('🔧 Adding image_url column to questions table...\n');

try {
  // Check if column already exists
  const columns = db.prepare("PRAGMA table_info(questions)").all();
  const hasImageUrl = columns.some(col => col.name === 'image_url');
  
  if (hasImageUrl) {
    console.log('✅ image_url column already exists!');
  } else {
    // Add the column
    db.exec('ALTER TABLE questions ADD COLUMN image_url TEXT DEFAULT ""');
    console.log('✅ Successfully added image_url column to questions table!');
  }
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 Migration complete!');
