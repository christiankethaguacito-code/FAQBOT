import Database from 'better-sqlite3';

const db = new Database('sbo-faq.db');

console.log('📊 Checking database schema...');

// Check questions table
console.log('\n=== QUESTIONS TABLE ===');
try {
  const schema = db.prepare(`SELECT * FROM pragma_table_info('questions')`).all();
  
  console.log('Current columns:');
  schema.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
  });
  
} catch (err) {
  console.log('❌ Error:', err.message);
}

// Check voice_settings table
console.log('\n=== VOICE_SETTINGS TABLE ===');
try {
  const schema = db.prepare(`SELECT * FROM pragma_table_info('voice_settings')`).all();
  
  console.log('Current columns:');
  schema.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
  });
  
  // Try to select from the table
  try {
    const data = db.prepare('SELECT * FROM voice_settings LIMIT 1').get();
    console.log('\nCurrent data:');
    console.log(data);
  } catch (err) {
    console.log('\n⚠️ Error reading data:', err.message);
  }
  
} catch (err) {
  console.log('❌ Error:', err.message);
}

// Check feedback table
console.log('\n=== FEEDBACK TABLE ===');
try {
  const schema = db.prepare(`SELECT * FROM pragma_table_info('feedback')`).all();
  
  if (schema.length > 0) {
    console.log('Current columns:');
    schema.forEach(col => {
      console.log(`  - ${col.name} (${col.type})`);
    });
  } else {
    console.log('❌ Table does not exist yet');
  }
} catch (err) {
  console.log('❌ Error:', err.message);
}

// Check analytics table
console.log('\n=== ANALYTICS TABLE ===');
try {
  const schema = db.prepare(`SELECT * FROM pragma_table_info('analytics')`).all();
  
  if (schema.length > 0) {
    console.log('Current columns:');
    schema.forEach(col => {
      console.log(`  - ${col.name} (${col.type})`);
    });
  } else {
    console.log('❌ Table does not exist yet');
  }
} catch (err) {
  console.log('❌ Error:', err.message);
}

db.close();
