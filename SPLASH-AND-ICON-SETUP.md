# 🎨 Splash Screen & App Icon Setup Guide

## Overview
This guide will help you add a professional splash screen and app icon to your SKSU FAQ Bot Android app.

---

## 📱 App Icon Setup

### Required Icon Sizes
Create PNG images with these exact dimensions:

| Size | Location | Purpose |
|------|----------|---------|
| 48x48 | `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` | Medium density |
| 72x72 | `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` | High density |
| 96x96 | `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` | Extra high density |
| 144x144 | `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` | Extra extra high |
| 192x192 | `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` | Extra extra extra high |
| 512x512 | For Google Play Store | Play Store listing |

### Design Recommendations for Icon
- **Theme**: SKSU colors (purple gradient: #667eea to #764ba2)
- **Elements**: Consider including:
  - 🎓 Graduation cap
  - 💬 Chat bubble
  - SKSU initials
- **Style**: Modern, flat design with subtle gradient
- **Format**: PNG with transparent background OR solid background
- **Safe Zone**: Keep important elements within 80% of canvas

### How to Generate Icons
**Option 1: Use Online Tools**
1. Visit https://icon.kitchen/ or https://www.appicon.co/
2. Upload your 512x512 source image
3. Select "Android" platform
4. Download the generated zip file
5. Extract and copy to respective `mipmap-*` folders

**Option 2: Manual Creation**
1. Create a 512x512 PNG in Photoshop/Figma/Canva
2. Export to all required sizes
3. Place in `android/app/src/main/res/mipmap-*` folders
4. Replace existing `ic_launcher.png` files

---

## 🌟 Splash Screen Setup

### Method 1: Using Capacitor Splash Screen Plugin (Recommended)

#### Step 1: Install Plugin
```powershell
npm install @capacitor/splash-screen
npx cap sync android
```

#### Step 2: Create Splash Images
Create PNG images with these sizes:

| Density | Size | Location |
|---------|------|----------|
| mdpi | 320x480 | `android/app/src/main/res/drawable-mdpi/splash.png` |
| hdpi | 480x800 | `android/app/src/main/res/drawable-hdpi/splash.png` |
| xhdpi | 720x1280 | `android/app/src/main/res/drawable-xhdpi/splash.png` |
| xxhdpi | 1080x1920 | `android/app/src/main/res/drawable-xxhdpi/splash.png` |
| xxxhdpi | 1440x2560 | `android/app/src/main/res/drawable-xxxhdpi/splash.png` |

#### Step 3: Design Recommendations for Splash
- **Background**: Gradient matching app theme (#667eea to #764ba2)
- **Center Logo**: SKSU logo or "SKSU FAQ Bot" text
- **Elements**: 
  - University name
  - "Student Body Organization"
  - Simple icon/graphic
- **Layout**: Centered content with generous padding
- **Style**: Clean, professional, minimalist

#### Step 4: Configure Splash Screen
Add to `capacitor.config.json`:
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
      "androidSpinnerStyle": "large",
      "spinnerColor": "#ffffff"
    }
  }
}
```

#### Step 5: Create Splash Layout (Android Native)
Create `android/app/src/main/res/layout/splash_screen.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@drawable/splash_background">
    
    <ImageView
        android:layout_width="200dp"
        android:layout_height="200dp"
        android:layout_centerInParent="true"
        android:src="@drawable/splash_logo"
        android:scaleType="centerInside" />
        
</RelativeLayout>
```

Create `android/app/src/main/res/drawable/splash_background.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item>
        <shape android:shape="rectangle">
            <gradient
                android:angle="135"
                android:startColor="#667eea"
                android:endColor="#764ba2"
                android:type="linear" />
        </shape>
    </item>
</layer-list>
```

---

### Method 2: Simple Background Color (Quick Setup)

#### Step 1: Edit Android Styles
Open `android/app/src/main/res/values/styles.xml` and modify:
```xml
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="android:windowBackground">@drawable/splash_background</item>
    </style>
</resources>
```

---

## 🎨 Quick Design Template

### Splash Screen Design Specifications
```
Canvas: 1080x1920 (xxhdpi)
Background: Linear gradient 135°
  - Start: #667eea (top-left)
  - End: #764ba2 (bottom-right)

Centered Content:
  - Logo/Icon: 200x200dp (center)
  - Text: "SKSU FAQ Bot"
    Font: Bold, 28sp, White
  - Subtitle: "Student Body Organization"
    Font: Regular, 16sp, White 90% opacity
  - Footer: "Sultan Kudarat State University"
    Font: Light, 14sp, White 70% opacity
    Position: Bottom, 48dp margin
```

### App Icon Design Specifications
```
Canvas: 512x512
Background: Solid #667eea OR gradient
Border-radius: 20% (rounded square)

Icon Elements:
  - Graduation cap (🎓) or custom SKSU logo
  - Subtle chat bubble or question mark
  - "SKSU" text (optional)
  
Colors:
  - Primary: #667eea
  - Secondary: #764ba2
  - Accent: #ffffff
```

---

## 🛠️ Tools & Resources

### Design Tools
- **Canva**: https://www.canva.com/ (Free templates)
- **Figma**: https://www.figma.com/ (Professional design)
- **Photoshop**: Adobe Photoshop (Industry standard)
- **GIMP**: https://www.gimp.org/ (Free alternative)

### Icon Generators
- **Icon Kitchen**: https://icon.kitchen/
- **App Icon Generator**: https://www.appicon.co/
- **Ape Tools**: https://apetools.webprofusion.com/app/#/tools/imagegorilla

### Splash Screen Generators
- **Ape Tools Image Gorilla**: https://apetools.webprofusion.com/app/#/tools/imagegorilla
- **App Splash Screen Generator**: https://www.applauncher.co/splash-screen-generator

---

## 📋 Step-by-Step Workflow

### 1. Design Phase
1. Create 512x512 app icon in design tool
2. Create 1080x1920 splash screen in design tool
3. Export as PNG files

### 2. Generate Assets
1. Use icon generator for all app icon sizes
2. Use splash generator for all splash sizes (or resize manually)
3. Download all generated files

### 3. Add to Project
1. Copy app icons to `android/app/src/main/res/mipmap-*/ic_launcher.png`
2. Copy splash screens to `android/app/src/main/res/drawable-*/splash.png`
3. Create/update XML configuration files
4. Update `capacitor.config.json` with splash settings

### 4. Build and Test
```powershell
# Sync changes to Android project
npx cap sync android

# Open in Android Studio
npx cap open android

# In Android Studio:
# 1. Build → Clean Project
# 2. Build → Rebuild Project
# 3. Run on emulator or device
```

---

## ✅ Verification Checklist

- [ ] App icon appears correctly in launcher
- [ ] Icon looks good in all screen densities
- [ ] Splash screen displays on app launch
- [ ] Splash screen auto-hides after 2 seconds
- [ ] No white flash between splash and app
- [ ] Colors match app theme
- [ ] Text is readable on all devices
- [ ] Logo/graphics are centered properly

---

## 🚨 Common Issues & Solutions

### Issue: Icon looks pixelated
**Solution**: Ensure you created all required sizes. Don't let Android scale from one size.

### Issue: Splash screen doesn't show
**Solution**: 
1. Check if files are in correct folders
2. Verify XML configuration
3. Clean and rebuild project
4. Check `capacitor.config.json` settings

### Issue: White screen before splash
**Solution**: Add splash screen theme to `styles.xml` properly

### Issue: Splash shows too long/short
**Solution**: Adjust `launchShowDuration` in `capacitor.config.json`

---

## 📝 Notes

- **Don't commit large image files to git** - Consider using Git LFS or .gitignore
- **Test on multiple devices** - Different screen sizes and densities
- **Optimize PNGs** - Use tools like TinyPNG to reduce file size
- **Follow Material Design** - Google's icon and splash guidelines

---

## 🔄 After Adding Assets

When you're ready to commit:
```powershell
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Add app icon and splash screen assets"

# Push to GitHub
git push origin main

# Sync to Android project
npx cap sync android

# Build APK
npm run android:open
```

---

**Good luck with your design! 🎨✨**

For SKSU brand guidelines or official logos, contact your university's marketing/communications office.
