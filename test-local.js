import Database from 'better-sqlite3';

console.log('🧪 Testing Local Database...\n');

const db = new Database('sbo-faq.db');

// Test 1: Check categories
console.log('1️⃣ Testing Categories:');
try {
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
  console.log(`   ✅ Found ${categories.length} categories`);
  categories.forEach(cat => console.log(`      - ${cat.name}`));
} catch (err) {
  console.log('   ❌ Error:', err.message);
}

// Test 2: Check questions
console.log('\n2️⃣ Testing Questions:');
try {
  const questions = db.prepare('SELECT COUNT(*) as count FROM questions').get();
  console.log(`   ✅ Found ${questions.count} questions`);
  
  // Sample question
  const sample = db.prepare('SELECT * FROM questions LIMIT 1').get();
  console.log(`   Sample: "${sample.question.substring(0, 50)}..."`);
} catch (err) {
  console.log('   ❌ Error:', err.message);
}

// Test 3: Check voice_settings
console.log('\n3️⃣ Testing Voice Settings:');
try {
  const voice = db.prepare('SELECT * FROM voice_settings LIMIT 1').get();
  console.log(`   ✅ Voice: ${voice.voice_name}`);
  console.log(`   ✅ Rate: ${voice.rate}`);
  console.log(`   ✅ Pitch: ${voice.pitch}`);
  console.log(`   ✅ Volume: ${voice.volume}`);
} catch (err) {
  console.log('   ❌ Error:', err.message);
}

// Test 4: Check admin users
console.log('\n4️⃣ Testing Admin Users:');
try {
  const admin = db.prepare('SELECT username FROM admin_users LIMIT 1').get();
  console.log(`   ✅ Admin user exists: ${admin.username}`);
} catch (err) {
  console.log('   ❌ Error:', err.message);
}

// Test 5: Check tables exist
console.log('\n5️⃣ Checking All Tables:');
try {
  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all();
  console.log('   ✅ Tables:');
  tables.forEach(t => console.log(`      - ${t.name}`));
} catch (err) {
  console.log('   ❌ Error:', err.message);
}

db.close();
console.log('\n✅ Database test complete!');
