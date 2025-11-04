# 🧪 Pre-Deployment Testing Checklist

**Test URL:** http://localhost:3000  
**Admin Panel:** http://localhost:3000/admin.html  
**Admin Login:** `admin` / `sksu2024`

---

## ✅ **Database Tests** (PASSED)

- [x] **Categories**: 7 categories loaded
- [x] **Questions**: 107 questions from SKSU Student Manual
- [x] **Voice Settings**: Default settings configured
- [x] **Admin Users**: Admin user created
- [x] **Feedback Table**: Created and indexed
- [x] **Analytics Table**: Created and indexed

---

## 🎯 **Feature Tests to Perform**

### 1. **Main FAQ Interface** (http://localhost:3000)

- [ ] **Categories Display**: All 7 categories show up
- [ ] **Category Expansion**: Click category → questions appear
- [ ] **Search Function**: Search for "vision" → finds questions
- [ ] **Voice Reading**: Click 🔊 icon → answer is read aloud
- [ ] **Voice Controls**: Adjust rate, pitch, volume → settings apply
- [ ] **AI Mode**: Toggle AI switch → AI mode activates
- [ ] **AI Chat**: Ask "What is SKSU's vision?" → AI responds
- [ ] **Responsive Design**: Resize window → layout adapts
- [ ] **PWA Install**: Click "Install App" → PWA installs

### 2. **Admin Panel** (http://localhost:3000/admin.html)

- [ ] **Login**: Enter `admin` / `sksu2024` → login successful
- [ ] **Dashboard**: View statistics (categories, questions, analytics)
- [ ] **Categories Tab**:
  - [ ] View all categories
  - [ ] Add new category → success
  - [ ] Edit category → changes saved
  - [ ] Delete category → removed
- [ ] **Questions Tab**:
  - [ ] View all questions
  - [ ] Filter by category
  - [ ] Add new question → success
  - [ ] Edit question → changes saved
  - [ ] Delete question → removed
- [ ] **Voice Settings Tab**:
  - [ ] Change voice → setting saved
  - [ ] Adjust rate → setting saved
  - [ ] Adjust pitch → setting saved
  - [ ] Adjust volume → setting saved
  - [ ] Test voice → plays with new settings
- [ ] **Feedback Tab**: View feedback data
- [ ] **Analytics Tab**: View analytics data
- [ ] **Logout**: Click logout → returns to login

### 3. **API Endpoints**

Test these in browser console or terminal:

```javascript
// Test get categories
fetch('/api/categories').then(r => r.json()).then(console.log)

// Test get questions
fetch('/api/questions/1').then(r => r.json()).then(console.log)

// Test search
fetch('/api/questions/search?q=vision').then(r => r.json()).then(console.log)

// Test AI chat (requires API key)
fetch('/api/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({message: 'What is SKSU?'})
}).then(r => r.json()).then(console.log)
```

### 4. **PWA Features**

- [ ] **Service Worker**: Registered and active
- [ ] **Offline Mode**: Disable network → app still loads
- [ ] **Caching**: Check DevTools → Application → Cache Storage
- [ ] **Manifest**: Check DevTools → Application → Manifest
- [ ] **Install Prompt**: "Add to Home Screen" appears

### 5. **Error Handling**

- [ ] **404 Page**: Visit /nonexistent → error page shows
- [ ] **Invalid Search**: Search for gibberish → "no results" message
- [ ] **Network Error**: Disable API → graceful error message
- [ ] **Invalid Login**: Wrong password → error message

---

## 🔧 **Known Issues (If Any)**

*Document any bugs found during testing here*

---

## 📋 **Pre-Deployment Checklist**

Before running `railway up`:

- [ ] All database tables created
- [ ] All 107 questions imported
- [ ] Admin login works
- [ ] Voice features work
- [ ] AI chat works (test locally with API key)
- [ ] Categories display correctly
- [ ] Search works
- [ ] PWA features functional
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] All environment variables set in Railway:
  - [ ] GROQ_API_KEY_1
  - [ ] GROQ_API_KEY_2
  - [ ] ADMIN_USERNAME
  - [ ] ADMIN_PASSWORD
  - [ ] NODE_ENV=production
  - [ ] DATA_DIR=/app/data
- [ ] Railway volume created at `/app/data`

---

## 🚀 **Ready to Deploy?**

Once all tests pass:

```powershell
# Commit any final changes
git add .
git commit -m "✅ Pre-deployment testing complete"
git push origin main

# Deploy to Railway
railway up
```

---

## 📊 **Test Results**

**Tested by:** _____________  
**Date:** November 4, 2025  
**Status:** 🟡 In Progress  

### Summary:
- **Database:** ✅ All tables created
- **Main Interface:** ⏳ Testing in progress
- **Admin Panel:** ⏳ Testing in progress
- **PWA Features:** ⏳ Testing in progress
- **API Endpoints:** ⏳ Testing in progress
