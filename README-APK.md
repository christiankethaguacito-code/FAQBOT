# Building SKSU FAQ Bot APK

## Prerequisites
- Node.js installed ✅
- Android Studio installed (download from https://developer.android.com/studio)
- Java JDK 17+ installed

## Steps to Build APK

### 1. Deploy Your Server First
Before building the APK, you need to deploy your backend server online:

**Option A: Railway (Recommended)**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Option B: Render.com**
1. Push code to GitHub
2. Connect Render.com to your repo
3. Deploy as Web Service

**Option C: Vercel (Frontend only)**
- Note: Vercel doesn't support SQLite, use Railway for backend

### 2. Update Capacitor Config
Edit `capacitor.config.json` and update the server URL:
```json
{
  "appId": "com.sksu.faqbot",
  "appName": "SKSU FAQ Bot",
  "webDir": "public",
  "server": {
    "url": "https://your-deployed-server.railway.app",
    "cleartext": true
  }
}
```

### 3. Sync Changes
```bash
npx cap sync android
```

### 4. Open in Android Studio
```bash
npx cap open android
```

### 5. Build APK in Android Studio
1. In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Wait for build to complete
3. APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

### 6. Install on Android Device
```bash
# Connect Android device via USB with USB Debugging enabled
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## For Production (Signed APK)

### Generate Signing Key
```bash
cd android/app
keytool -genkey -v -keystore sksu-faq-bot.keystore -alias sksu-faq -keyalg RSA -keysize 2048 -validity 10000
```

### Configure in Android Studio
1. Build → Generate Signed Bundle / APK
2. Choose APK
3. Select your keystore file
4. Enter keystore password
5. Choose "release" build variant
6. Build!

## Quick Deploy & Build Script

Create `build-apk.bat`:
```batch
@echo off
echo Building SKSU FAQ Bot APK...
call npx cap sync android
call npx cap open android
echo.
echo Next: In Android Studio, click Build > Build APK
pause
```

## Current Status
✅ Capacitor installed
✅ Android platform added
✅ Web assets copied
⏳ Need to deploy backend server
⏳ Need Android Studio to build APK

## Notes
- The app will load your web-based FAQ bot in a native WebView
- Make sure your server is deployed and accessible online
- For local testing, use your computer's IP instead of localhost
- Icons can be customized in `android/app/src/main/res/`
