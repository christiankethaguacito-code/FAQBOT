# 🚂 Railway Deployment Guide

## 🎉 Your Code is Now on GitHub!

Your Railway project is already set up at:
**https://railway.com/project/9ad9e85b-8c9f-44a3-943d-76de96f05f7e**

---

## ✅ What Just Happened

1. ✅ All code changes committed
2. ✅ Pushed to GitHub (main branch)
3. ✅ Railway will automatically detect the push and redeploy

---

## 🔧 Configure Railway Environment Variables

Railway should now be building your app. You need to add your Groq API key:

### Step 1: Go to Variables Tab
1. Open your Railway project: https://railway.com/project/9ad9e85b-8c9f-44a3-943d-76de96f05f7e/service/2ad8260f-8f3b-4147-a056-611566c410e8
2. Click on **"Variables"** tab

### Step 2: Add Environment Variables

Click **"New Variable"** and add:

```
Variable Name: GROQ_API_KEY_1
Value: your_groq_api_key_here
```

**Get FREE Groq API Key:**
1. Go to https://console.groq.com
2. Sign up/Login
3. Go to API Keys section
4. Create new API key
5. Copy and paste into Railway

### Step 3 (Optional): Add Backup API Key

For failover support, add a second key:

```
Variable Name: GROQ_API_KEY_2
Value: your_second_groq_api_key_here
```

---

## 🚀 Deployment Status

After adding the environment variable:

1. Railway will automatically redeploy
2. Wait 1-2 minutes for build to complete
3. Your app will be live!

### Check Deployment:
- **Build Logs:** Check the "Deployments" tab
- **Your URL:** Railway will provide a URL like `https://your-app.railway.app`

---

## 🎨 What's Deployed

### User Interface (`/`)
- ✨ Luxury animated gradient background
- 💎 Premium glass morphism chat interface
- 🎭 3D message animations
- 🤖 AI-powered Q&A with Groq
- 📱 Fully responsive design
- 🎨 "SKSU SBO ISULAN" branding

### Admin Panel (`/admin`)
- 🔐 Login: `Edcel` / `Edcel123`
- ➕ Add/Edit/Delete FAQs
- 📊 Analytics dashboard
- 🎯 Category management
- 🎨 Modern purple gradient theme

---

## 🔍 Testing Your Deployment

Once deployed, test these:

1. **Homepage:** `https://your-app.railway.app`
2. **Admin Panel:** `https://your-app.railway.app/admin`
3. **API Health:** `https://your-app.railway.app/api/categories`

### Test AI Mode:
1. Open the homepage
2. Toggle "AI Mode" switch
3. Ask a question about SKSU
4. Should get AI-powered response

---

## 📊 Monitor Your App

### Railway Dashboard Features:
- **Metrics:** CPU, Memory, Network usage
- **Logs:** Real-time application logs
- **Deployments:** History of all deployments
- **Settings:** Domain, environment variables

---

## 🔧 Troubleshooting

### Issue: Build Failed
**Check:**
- Build logs in Railway dashboard
- Ensure all dependencies are in `package.json`

### Issue: App Crashes
**Check:**
- Runtime logs in Railway dashboard
- Verify `GROQ_API_KEY_1` is set correctly
- Check if database (`sbo-faq.db`) is included

### Issue: AI Mode Not Working
**Solution:**
- Verify `GROQ_API_KEY_1` is set in Variables tab
- Check if API key is valid at console.groq.com
- View logs for error messages

### Issue: Database Empty
**Solution:**
- The database `sbo-faq.db` is included in the repo
- If needed, Railway can run initialization: Add build command `node init-db.js`

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain:
1. Go to **Settings** tab in Railway
2. Click **"Generate Domain"** for free `.railway.app` domain
3. Or click **"Custom Domain"** to add your own

---

## 📱 Important URLs

### Your Railway Project:
- **Dashboard:** https://railway.com/project/9ad9e85b-8c9f-44a3-943d-76de96f05f7e
- **Service:** https://railway.com/project/9ad9e85b-8c9f-44a3-943d-76de96f05f7e/service/2ad8260f-8f3b-4147-a056-611566c410e8

### GitHub Repository:
- **Repo:** https://github.com/christiankethaguacito-code/FAQBOT

### Groq Console:
- **API Keys:** https://console.groq.com/keys

---

## 🎯 Next Steps

1. ✅ **Add GROQ_API_KEY_1** in Railway Variables tab
2. ⏳ **Wait for deployment** (1-2 minutes)
3. 🌐 **Get your URL** from Railway dashboard
4. 🧪 **Test the app** (homepage + admin panel)
5. 📢 **Share with users!**

---

## 💡 Pro Tips

### Performance:
- Railway auto-scales based on traffic
- Database is included (no external DB needed)
- Static files served efficiently

### Updates:
- Any `git push` to main branch triggers redeployment
- Railway keeps deployment history
- Easy rollback to previous versions

### Monitoring:
- Check Railway Metrics for performance
- View Logs for debugging
- Set up alerts for errors

---

## 🎉 You're All Set!

Your luxury FAQ bot is now deployed on Railway! 🚀

**Database:** ✅ Included (sbo-faq.db with 107 FAQs)  
**Admin:** ✅ Configured (Edcel/Edcel123)  
**Design:** ✅ Premium luxury theme  
**AI:** ⏳ Ready (just add GROQ_API_KEY_1)

**Railway will handle everything else!** 🌟
