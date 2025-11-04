// Start script for Railway deployment
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import Database from 'better-sqlite3';

const execAsync = promisify(exec);

// Use Railway volume if available
const DB_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || process.env.DATA_DIR || './';
const DB_PATH = join(DB_DIR, 'sbo-faq.db');

async function checkAndInitDatabase() {
    console.log('🚀 Starting SKSU FAQ Bot...');
    console.log(`📁 Database directory: ${DB_DIR}`);
    console.log(`📄 Database path: ${DB_PATH}`);
    
    // Ensure directory exists
    if (!existsSync(DB_DIR)) {
        console.log('📁 Creating database directory...');
        mkdirSync(DB_DIR, { recursive: true });
    }
    
    let needsInit = false;
    
    // Check if database exists
    if (!existsSync(DB_PATH)) {
        console.log('📦 Database not found, will initialize...');
        needsInit = true;
    } else {
        // Check if database has data
        try {
            const db = new Database(DB_PATH);
            const count = db.prepare('SELECT COUNT(*) as count FROM categories').get();
            db.close();
            
            if (count.count === 0) {
                console.log('📦 Database empty, will initialize...');
                needsInit = true;
            } else {
                console.log(`✅ Database already exists with ${count.count} categories`);
            }
        } catch (error) {
            console.log('📦 Database corrupted or missing tables, will re-initialize...');
            console.error('Error:', error.message);
            needsInit = true;
        }
    }
    
    if (needsInit) {
        console.log('📥 Initializing database...');
        // Set environment variable for child processes
        process.env.DATA_DIR = DB_DIR;
        await execAsync('node init-complete-db.js');
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
