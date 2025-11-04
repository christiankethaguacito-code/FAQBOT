# Quick Deployment Script for Railway/Render
# Run this after setting up your repository

# 1. Initialize Git (if not already done)
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
    git add .
    git commit -m "Initial commit: SKSU SBO ISULAN FAQ Bot with luxury design"
}

# 2. Display deployment instructions
Write-Host "`n=== DEPLOYMENT OPTIONS ===" -ForegroundColor Green
Write-Host "`n🚀 OPTION 1: Railway.app (Recommended)" -ForegroundColor Cyan
Write-Host "1. Go to https://railway.app"
Write-Host "2. Sign in with GitHub"
Write-Host "3. Click 'New Project' → 'Deploy from GitHub repo'"
Write-Host "4. Select this repository"
Write-Host "5. Add environment variable: GROQ_API_KEY_1=your_key_here"
Write-Host "6. Deploy!"

Write-Host "`n🚀 OPTION 2: Render.com" -ForegroundColor Cyan
Write-Host "1. Go to https://render.com"
Write-Host "2. Create new 'Web Service'"
Write-Host "3. Connect GitHub repository"
Write-Host "4. Build Command: npm install"
Write-Host "5. Start Command: node server.js"
Write-Host "6. Add environment variable: GROQ_API_KEY_1=your_key_here"
Write-Host "7. Deploy!"

Write-Host "`n🚀 OPTION 3: Heroku" -ForegroundColor Cyan
Write-Host "Run these commands:"
Write-Host "  heroku login"
Write-Host "  heroku create sksu-sbo-isulan"
Write-Host "  heroku config:set GROQ_API_KEY_1=your_key_here"
Write-Host "  git push heroku main"

Write-Host "`n📝 Don't forget:" -ForegroundColor Yellow
Write-Host "- Get FREE Groq API key at: https://console.groq.com"
Write-Host "- Admin credentials: Edcel / Edcel123"
Write-Host "- Database is included (sbo-faq.db)"

Write-Host "`n✅ Your app is READY!" -ForegroundColor Green
