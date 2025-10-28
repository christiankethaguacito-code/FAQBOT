# 📱 Build Android APK - Quick Guide

## Current Status
✅ Code deployed to Railway: https://faqbot-production.up.railway.app
✅ Android project configured and synced
✅ Android Studio opened

## Step-by-Step APK Build

### 1. Wait for Gradle Sync
- Android Studio is indexing your project
- Wait for "Gradle Build" to complete (bottom-right corner)
- This may take 2-5 minutes on first load

### 2. Build APK
Once Gradle sync is complete:

**Menu Bar:**
- Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**

**Or use shortcut:**
- Press `Ctrl + Shift + A`
- Type "Build APK"
- Press Enter

### 3. Wait for Build
- Progress bar appears at bottom
- Build takes 1-3 minutes
- Watch for "BUILD SUCCESSFUL" message

### 4. Locate Your APK
APK will be at:
```
C:\Users\USER\OneDrive\Desktop\FAQbot\android\app\build\outputs\apk\debug\app-debug.apk
```

**Or click the notification:**
- When build completes, you'll see a notification
- Click "locate" to open the folder

### 5. Install APK

**Option A: USB Debugging**
```bash
# Connect Android phone via USB
# Enable USB Debugging in Developer Options
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

**Option B: Share File**
- Copy `app-debug.apk` to your phone
- Open it on phone
- Allow "Install from unknown sources"
- Install the app

---

## App Features

### Student View (Default)
- 🎓 FAQ Bot interface
- 🔐 Admin button (bottom-right corner)
- Works offline after first load
- Connects to: https://faqbot-production.up.railway.app

### Admin Panel (Login Required)
- **Username:** `admin`
- **Password:** `sbo2024`
- 📊 Analytics dashboard
- 📝 Manage FAQs (Create, Edit, Delete)
- ❓ Unanswered questions tracking
- 🚪 Logout button

---

## Troubleshooting

### Gradle Sync Fails
1. Click **File** → **Sync Project with Gradle Files**
2. Wait and try again

### Build Fails
1. **Tools** → **SDK Manager**
2. Ensure these are installed:
   - Android SDK Platform 34
   - Android SDK Build-Tools 34.0.0
   - Android Emulator (optional)

### Can't Install APK
1. Enable "Unknown Sources" on phone:
   - Settings → Security → Unknown Sources → Enable
   - Or Settings → Apps → Special Access → Install Unknown Apps

---

## Production Build (Signed APK)

For Google Play Store or production:

1. **Generate Keystore:**
```bash
keytool -genkey -v -keystore sksu-release.keystore -alias sksu-faq-bot -keyalg RSA -keysize 2048 -validity 10000
```

2. **Build in Android Studio:**
- Build → Generate Signed Bundle / APK
- Choose APK
- Select keystore file
- Enter passwords
- Choose "release" variant
- Build!

---

## Current Configuration

**App Details:**
- App ID: `com.sksu.faqbot`
- App Name: SKSU FAQ Bot
- Server: https://faqbot-production.up.railway.app

**Admin Credentials:**
- Username: `admin`
- Password: `sbo2024`
- ⚠️ Change these in production!

---

## Next Steps After Building

1. ✅ Test APK on Android device
2. ✅ Verify student view works
3. ✅ Test admin login and panel
4. ✅ Check offline functionality
5. 🔄 Change admin password (if needed)
6. 📤 Share APK with users or upload to Play Store

---

**Questions?** The APK should work perfectly - it connects to your live Railway deployment! 🚀
