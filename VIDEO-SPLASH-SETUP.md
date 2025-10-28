# 🎬 VIDEO SPLASH SCREEN - Setup Guide

## ✅ What's Configured

Your `FAQBOT.mp4` video will now play as the actual splash screen when launching your Android app!

---

## 📁 Files Created/Modified

### 1. **SplashActivity.java**
   - Location: `android/app/src/main/java/com/sksu/faqbot/SplashActivity.java`
   - Purpose: Native Android activity that plays your MP4 video
   - Features:
     - ✅ Plays `splash.mp4` from raw resources
     - ✅ Auto-launches MainActivity when video completes
     - ✅ Error handling (falls back to MainActivity if video fails)
     - ✅ Handles pause/resume correctly

### 2. **activity_splash.xml**
   - Location: `android/app/src/main/res/layout/activity_splash.xml`
   - Purpose: Layout for splash screen with VideoView
   - Features:
     - ✅ Full-screen VideoView
     - ✅ Purple background (#667eea) in case video loads slowly
     - ✅ Centered video player

### 3. **AndroidManifest.xml** (Updated)
   - Changes:
     - ✅ SplashActivity is now the LAUNCHER (opens first)
     - ✅ MainActivity launches after video completes
     - ✅ No action bar on splash screen

---

## 🎥 How It Works

### App Launch Flow:
```
User taps app icon
    ↓
SplashActivity opens
    ↓
FAQBOT.mp4 plays full-screen
    ↓
Video completes (or error occurs)
    ↓
MainActivity launches (your FAQ bot)
    ↓
App is ready!
```

### Video Configuration:
- **Source**: `android/app/src/main/res/raw/splash.mp4`
- **Duration**: Plays for the entire length of FAQBOT.mp4
- **Scaling**: Fills entire screen (maintains aspect ratio)
- **Audio**: Will play if video has audio
- **Auto-advance**: Automatically opens main app when done

---

## 🔧 Customization Options

### Change Video Scaling

Edit `activity_splash.xml`:
```xml
<!-- Option 1: Stretch to fill (may distort) -->
<VideoView
    android:layout_width="match_parent"
    android:layout_height="match_parent" />

<!-- Option 2: Center crop (fills screen, may crop edges) -->
<VideoView
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:scaleType="centerCrop" />

<!-- Option 3: Fit screen (may show black bars) -->
<VideoView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_centerInParent="true" />
```

### Add Skip Button

Edit `activity_splash.xml`:
```xml
<RelativeLayout ...>
    <VideoView ... />
    
    <Button
        android:id="@+id/skipButton"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:layout_alignParentEnd="true"
        android:layout_margin="16dp"
        android:text="Skip"
        android:textColor="#FFFFFF"
        android:background="@android:color/transparent" />
</RelativeLayout>
```

Then in `SplashActivity.java`, add after `videoView.start();`:
```java
Button skipButton = findViewById(R.id.skipButton);
skipButton.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        startMainActivity();
    }
});
```

### Mute Audio

Edit `SplashActivity.java`, add after setting video URI:
```java
videoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
    @Override
    public void onPrepared(MediaPlayer mp) {
        mp.setVolume(0f, 0f); // Mute audio
    }
});
```

### Loop Video (Wait for Tap)

Edit `SplashActivity.java`, replace completion listener:
```java
videoView.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
    @Override
    public void onCompletion(MediaPlayer mp) {
        videoView.start(); // Loop video
    }
});

// Add tap to continue
videoView.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        startMainActivity();
    }
});
```

---

## 📱 Build & Test

### 1. Sync Changes
```powershell
npx cap sync android
```

### 2. Open Android Studio
```powershell
npx cap open android
```

### 3. Build APK
In Android Studio:
- **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- Wait for Gradle sync and build

### 4. Install & Test
```powershell
# Install on connected device
adb install android\app\build\outputs\apk\debug\app-debug.apk

# Or copy APK to phone manually
```

### 5. Launch App
- Tap app icon in launcher
- Watch your FAQBOT.mp4 play full-screen
- App automatically opens when video ends

---

## 🎯 Video Requirements

### Optimal Video Specs:
- **Format**: MP4 (H.264 video, AAC audio)
- **Resolution**: 1080x1920 (portrait) or 1920x1080 (landscape)
- **Duration**: 2-5 seconds (recommended for splash)
- **File Size**: < 5MB (smaller = faster app startup)
- **Frame Rate**: 30fps or 60fps

### Convert Video (if needed):
```powershell
# Using ffmpeg (install from ffmpeg.org)
ffmpeg -i FAQBOT.mp4 -vcodec h264 -acodec aac -s 1080x1920 -r 30 splash_optimized.mp4
```

---

## ⚙️ Technical Details

### Why Custom Activity?
- ❌ Capacitor's `@capacitor/splash-screen` doesn't support video
- ❌ Standard Android splash (splash.xml) only supports static images
- ✅ Custom Activity with VideoView = Full MP4 support

### Activity Lifecycle:
1. **onCreate()**: Sets up VideoView, loads video
2. **onStart()**: Activity becomes visible
3. **Video plays**: User watches splash
4. **onCompletion()**: Launches MainActivity
5. **onPause()**: Pauses video if user switches away
6. **finish()**: Removes SplashActivity from back stack

### Resource Path:
- Video stored at: `android/app/src/main/res/raw/splash.mp4`
- Accessed via: `R.raw.splash` (Android resource ID)
- URI format: `android.resource://com.sksu.faqbot/[resource_id]`

---

## 🚨 Troubleshooting

### Video doesn't play:
```
1. Check file exists at: android/app/src/main/res/raw/splash.mp4
2. Verify file is valid MP4 (H.264/AAC)
3. Check Android Studio build logs for errors
4. Try shorter video (< 10 seconds)
```

### Black screen then app opens:
- Video may be loading - add progress indicator
- Or video codec not supported - convert to H.264

### App crashes on launch:
```powershell
# Check logcat
adb logcat | Select-String "SplashActivity"

# Common issues:
# - R.raw.splash not found (rebuild project)
# - activity_splash.xml not found (sync project)
```

### Can't find SplashActivity.java:
```
1. Ensure package name is correct: com.sksu.faqbot
2. Rebuild project: Build → Rebuild Project
3. Invalidate caches: File → Invalidate Caches / Restart
```

---

## 📊 Before vs After

### Before (Static Splash):
- ⚪ Purple gradient background
- ⚪ Static icon image
- ⚪ 3-second fixed duration

### After (Video Splash):
- ✅ Full FAQBOT.mp4 video plays
- ✅ Dynamic animated content
- ✅ Custom duration (video length)
- ✅ Professional branded experience

---

## 🎨 Design Tips

### Make Great Splash Videos:
1. **Start Strong**: Eye-catching first frame
2. **Keep Short**: 2-5 seconds ideal
3. **Brand Focused**: Logo, colors, tagline
4. **End Clean**: Smooth transition to app
5. **Test Audio**: Mute or use subtle sound

### Video Ideas:
- Animated logo reveal
- Brand colors morphing
- Text animation (app name)
- Motion graphics intro
- 3D logo spin

---

## ✅ What's Next?

Your video splash is ready! Now:

1. **Sync**: `npx cap sync android`
2. **Build**: Open Android Studio, build APK
3. **Test**: Install and watch your video play!

🎬 **Your FAQBOT.mp4 will now greet users every time they launch the app!**

---

**All files created and configured! Ready to build.** 🚀
