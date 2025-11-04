// Start script for Railway deployment
import { existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import Database from 'better-sqlite3';

const execAsync = promisify(exec);

async function checkAndInitDatabase() {
    console.log('🚀 Starting SKSU FAQ Bot...');
    
    let needsInit = false;
    
    // Check if database exists
    if (!existsSync('sbo-faq.db')) {
        console.log('📦 Database not found, will initialize...');
        needsInit = true;
    } else {
        // Check if database has data
        try {
            const db = new Database('sbo-faq.db');
            const count = db.prepare('SELECT COUNT(*) as count FROM categories').get();
            db.close();
            
            if (count.count === 0) {
                console.log('📦 Database empty, will initialize...');
                needsInit = true;
            } else {
                console.log(`✅ Database already exists with ${count.count} categories`);
            }
        } catch (error) {
            console.log('📦 Database corrupted, will re-initialize...');
            needsInit = true;
        }
    }
    
    if (needsInit) {
        console.log('📥 Initializing database...');
        await execAsync('node init-db.js');
        console.log('📥 Importing SKSU data...');
        await execAsync('node import-sksu-data.js');
        console.log('✅ Database ready!');
    }
    
    // Start the server
    console.log('🌐 Starting server...');
    await import('./server.js');
}

checkAndInitDatabase().catch(error => {
    console.error('❌ Startup error:', error);
    process.exit(1);
});
