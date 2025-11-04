#!/bin/bash

# Start script for Railway deployment
echo "🚀 Starting SKSU FAQ Bot..."

# Check if database exists and has data
if [ ! -f "sbo-faq.db" ] || [ $(sqlite3 sbo-faq.db "SELECT COUNT(*) FROM categories;" 2>/dev/null || echo "0") -eq 0 ]; then
    echo "📦 Initializing database..."
    node init-db.js
    echo "📥 Importing SKSU data..."
    node import-sksu-data.js
    echo "✅ Database ready!"
else
    echo "✅ Database already exists with data"
fi

# Start the server
echo "🌐 Starting server..."
node server.js
