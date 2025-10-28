# 🚀 Deploy SKSU FAQ Bot to Railway

## Quick Deploy Steps

### 1. Login to Railway
```bash
railway login
```
This will open your browser. Login with GitHub.

### 2. Create New Project
```bash
railway init
```
- Choose: "Empty Project"
- Enter project name: "sksu-faq-bot"

### 3. Deploy
```bash
railway up
```

### 4. Add a Domain
```bash
railway domain
```
This will generate a public URL like: `sksu-faq-bot.up.railway.app`

### 5. Get Your Deployment URL
```bash
railway status
```
Copy the deployment URL (e.g., `https://sksu-faq-bot-production.up.railway.app`)

---

## Update Android App with Deployment URL

After deploying, update `capacitor.config.json`:

```json
{
  "appId": "com.sksu.faqbot",
  "appName": "SKSU FAQ Bot",
  "webDir": "public",
  "server": {
    "url": "https://YOUR-RAILWAY-URL.up.railway.app",
    "cleartext": true
  }
}
```

Then sync to Android:
```bash
npm run android:sync
```

---

## Alternative: Deploy via GitHub (No CLI needed)

### 1. Push to GitHub
```bash
# Create new repo on GitHub first, then:
git remote add origin https://github.com/YOUR-USERNAME/sksu-faq-bot.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Railway Web
1. Go to https://railway.app
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your `sksu-faq-bot` repository
5. Railway will auto-detect and deploy!

### 3. Get Your URL
- Click on your project
- Go to "Settings" → "Domains"
- Click "Generate Domain"
- Copy the URL

---

## Environment Variables (Optional)

If you want to add environment variables:

```bash
railway variables set PORT=3000
```

Or add in Railway dashboard:
- Settings → Variables → New Variable

---

## View Logs

```bash
railway logs
```

Or view in Railway dashboard: Deployments → Latest Deployment → View Logs

---

## Update Deployment

After making changes:

```bash
git add .
git commit -m "Update FAQ bot"
git push
```

Railway will automatically redeploy!

---

## Test Your Deployment

Once deployed, test these URLs:

- **Student View**: `https://your-app.railway.app`
- **Admin Panel**: `https://your-app.railway.app/admin`
- **API Test**: `https://your-app.railway.app/api/faqs`

---

## Troubleshooting

### Database Issues
Railway persists SQLite database. If you need to reset:
```bash
railway run rm sbo-faq.db
```

### Port Issues
Railway automatically sets PORT. Your app already uses `process.env.PORT || 3000` ✅

### Build Fails
Check logs:
```bash
railway logs
```

Common fixes:
- Make sure `package.json` has correct `"start": "node app.js"`
- Ensure all dependencies are in `package.json`
- Check Node version: Railway uses Node 18+ ✅

---

## Current Status
✅ Git repository initialized
✅ All files committed
✅ Railway CLI installed
⏳ Ready to deploy!

## Next Step
Run this command:
```bash
railway login
```

Then follow the steps above! 🚀
