# 🎨 App Icon & Splash Screen Setup Guide

## Your Assets
- ✅ `edcel.xml` - App icon (vector XML)
- ✅ `Edcel.jpg` - App icon (JPG format)
- ✅ `FAQBOT.mp4` - Splash screen video

---

## 🚨 Important Notes

### App Icon
- Android needs **PNG images**, not XML vectors (for launcher icons)
- Required sizes: 48px, 72px, 96px, 144px, 192px, 512px
- We'll use the `Edcel.jpg` as the source

### Splash Screen
- Android **cannot use MP4 videos** for splash screens
- We need to extract a **single frame** from the video as a PNG
- Or create a static splash image

---

## 📋 Quick Setup Steps

### Option 1: Using Online Tools (Easiest)

#### For App Icon:
1. **Go to:** https://icon.kitchen/
2. **Upload:** `Edcel.jpg`
3. **Configure:**
   - Platform: Android
   - Shape: Square or Rounded Square
   - Background: Transparent or #667eea (app theme color)
4. **Download** the generated icons
5. **Extract** the zip file
6. **Copy** all `ic_launcher.png` files to respective folders:
   ```
   android/app/src/main/res/mipmap-mdpi/ic_launcher.png
   android/app/src/main/res/mipmap-hdpi/ic_launcher.png
   android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
   android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
   android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
   ```

#### For Splash Screen:
1. **Extract a frame from FAQBOT.mp4:**
   - Option A: Use VLC Media Player (pause and take screenshot)
   - Option B: Use online tool: https://www.onlineconverter.com/video-to-jpg
   - Save as `splash.png`

2. **Resize splash image** to multiple densities:
   - Go to: https://apetools.webprofusion.com/app/#/tools/imagegorilla
   - Upload your splash.png
   - Select Android Splash Screen
   - Download generated files

3. **Copy** splash images to:
   ```
   android/app/src/main/res/drawable-mdpi/splash.png
   android/app/src/main/res/drawable-hdpi/splash.png
   android/app/src/main/res/drawable-xhdpi/splash.png
   android/app/src/main/res/drawable-xxhdpi/splash.png
   android/app/src/main/res/drawable-xxxhdpi/splash.png
   ```

---

## 🛠️ Manual Setup (Using PowerShell)

### Step 1: Extract Video Frame

```powershell
# Using FFmpeg (if installed)
ffmpeg -i FAQBOT.mp4 -ss 00:00:00 -vframes 1 splash_original.png

# Or just use the first frame
ffmpeg -i FAQBOT.mp4 -vframes 1 splash_original.png
```

If you don't have FFmpeg, use VLC:
1. Open FAQBOT.mp4 in VLC
2. Pause at desired frame
3. Video → Take Snapshot
4. Rename to `splash_original.png`

---

### Step 2: Check Android Icon Folders

```powershell
# List current icons
Get-ChildItem -Path "android\app\src\main\res\mipmap-*" -Filter "ic_launcher.png" | Select-Object FullName
```

---

## 📱 Required Icon Sizes

| Density | Folder | Size | Purpose |
|---------|--------|------|---------|
| mdpi | mipmap-mdpi | 48×48 | Low density |
| hdpi | mipmap-hdpi | 72×72 | Medium-high density |
| xhdpi | mipmap-xhdpi | 96×96 | Extra high density |
| xxhdpi | mipmap-xxhdpi | 144×144 | Extra-extra high |
| xxxhdpi | mipmap-xxxhdpi | 192×192 | Extra-extra-extra high |
| Play Store | - | 512×512 | Google Play listing |

---

## 📱 Required Splash Sizes

| Density | Folder | Size (Portrait) |
|---------|--------|-----------------|
| mdpi | drawable-mdpi | 320×480 |
| hdpi | drawable-hdpi | 480×800 |
| xhdpi | drawable-xhdpi | 720×1280 |
| xxhdpi | drawable-xxhdpi | 1080×1920 |
| xxxhdpi | drawable-xxxhdpi | 1440×2560 |

---

## 🎨 Design Recommendations

### App Icon (`Edcel.jpg`)
- **Current:** Appears to be a person/logo
- **Suggestion:** Add app theme colors (#667eea purple) as background
- **Shape:** Rounded square (standard Android adaptive icon)
- **Padding:** 10% safe area (important elements stay centered)

### Splash Screen (`FAQBOT.mp4`)
- **Extract:** Best frame showing logo/branding
- **Background:** Use app theme gradient (#667eea → #764ba2)
- **Center:** Logo or text
- **Duration:** 2 seconds (configured in capacitor.config.json)

---

## ⚡ Quick Commands (After Getting PNG Files)

### If you have icon PNGs ready:

```powershell
# Copy icon to all density folders
Copy-Item "path\to\icon-48.png" "android\app\src\main\res\mipmap-mdpi\ic_launcher.png"
Copy-Item "path\to\icon-72.png" "android\app\src\main\res\mipmap-hdpi\ic_launcher.png"
Copy-Item "path\to\icon-96.png" "android\app\src\main\res\mipmap-xhdpi\ic_launcher.png"
Copy-Item "path\to\icon-144.png" "android\app\src\main\res\mipmap-xxhdpi\ic_launcher.png"
Copy-Item "path\to\icon-192.png" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png"
```

### If you have splash PNGs ready:

```powershell
# Create drawable folders if they don't exist
New-Item -ItemType Directory -Force -Path "android\app\src\main\res\drawable-mdpi"
New-Item -ItemType Directory -Force -Path "android\app\src\main\res\drawable-hdpi"
New-Item -ItemType Directory -Force -Path "android\app\src\main\res\drawable-xhdpi"
New-Item -ItemType Directory -Force -Path "android\app\src\main\res\drawable-xxhdpi"
New-Item -ItemType Directory -Force -Path "android\app\src\main\res\drawable-xxxhdpi"

# Copy splash images
Copy-Item "path\to\splash-320x480.png" "android\app\src\main\res\drawable-mdpi\splash.png"
Copy-Item "path\to\splash-480x800.png" "android\app\src\main\res\drawable-hdpi\splash.png"
Copy-Item "path\to\splash-720x1280.png" "android\app\src\main\res\drawable-xhdpi\splash.png"
Copy-Item "path\to\splash-1080x1920.png" "android\app\src\main\res\drawable-xxhdpi\splash.png"
Copy-Item "path\to\splash-1440x2560.png" "android\app\src\main\res\drawable-xxxhdpi\splash.png"
```

---

## 🔧 Configure Capacitor Splash Screen

After adding splash images, update `capacitor.config.json`:

```json
{
  "appId": "com.sksu.faqbot",
  "appName": "SKSU FAQ Bot",
  "webDir": "public",
  "server": {
    "url": "https://web-production-ce87.up.railway.app",
    "cleartext": true,
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "launchAutoHide": true,
      "backgroundColor": "#667eea",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": false,
      "splashFullScreen": true,
      "splashImmersive": true
    }
  }
}
```

Then install the plugin:
```powershell
npm install @capacitor/splash-screen
npx cap sync android
```

---

## ✅ Verification Steps

### Check Icon Installation:
```powershell
# List all launcher icons
Get-ChildItem -Recurse -Path "android\app\src\main\res\mipmap-*" -Filter "ic_launcher.png"
```

### Check Splash Installation:
```powershell
# List all splash images
Get-ChildItem -Recurse -Path "android\app\src\main\res\drawable-*" -Filter "splash.png"
```

### Build and Test:
```powershell
npx cap sync android
npx cap open android

# In Android Studio:
# Build → Clean Project
# Build → Rebuild Project
# Run on emulator or device
```

---

## 🎯 What You Need to Do NOW

1. **For Icon:**
   - [ ] Upload `Edcel.jpg` to https://icon.kitchen/
   - [ ] Download generated Android icons
   - [ ] Extract zip file
   - [ ] Copy PNG files to `android/app/src/main/res/mipmap-*` folders
   - [ ] Replace existing `ic_launcher.png` files

2. **For Splash:**
   - [ ] Open `FAQBOT.mp4` in VLC or browser
   - [ ] Take screenshot of best frame (or pause and save)
   - [ ] Upload to https://apetools.webprofusion.com/app/#/tools/imagegorilla
   - [ ] Download generated splash images
   - [ ] Copy to `android/app/src/main/res/drawable-*` folders

3. **Sync and Build:**
   ```powershell
   npm install @capacitor/splash-screen
   npx cap sync android
   npx cap open android
   ```

---

## 🚨 Troubleshooting

### Icon doesn't show:
- Make sure files are named exactly `ic_launcher.png`
- Check file sizes match the required dimensions
- Clean and rebuild project in Android Studio

### Splash doesn't show:
- Install @capacitor/splash-screen plugin
- Make sure files are named exactly `splash.png`
- Check capacitor.config.json has SplashScreen configuration
- Verify backgroundColor matches your theme

### Video won't work:
- Android splash screens **cannot use videos**
- Must use static PNG images
- Extract a single frame from the MP4

---

## 📝 Alternative: Simple Setup

If online tools don't work, I can help you:

1. Convert `Edcel.jpg` to required sizes using Node.js/Sharp
2. Extract frame from `FAQBOT.mp4` using PowerShell commands
3. Resize images to all required densities

Just let me know which approach you prefer!

---

**Recommended:** Use online tools (icon.kitchen + VLC screenshot) - it's the fastest and easiest method! 🚀
