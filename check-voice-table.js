import Database from 'better-sqlite3';

const db = new Database('sbo-faq.db');

console.log('📊 Checking voice_settings table schema...\n');

// Get table schema
const schema = db.prepare(`SELECT * FROM pragma_table_info('voice_settings')`).all();

console.log('Columns:');
schema.forEach(col => {
  console.log(`  - ${col.name} (${col.type}) ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
});

// Get data
console.log('\nCurrent data:');
const data = db.prepare('SELECT * FROM voice_settings').all();
console.log(data);

db.close();
