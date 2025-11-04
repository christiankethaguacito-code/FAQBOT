# 🎙️ Voice Settings Database Integration

## Overview
Voice settings are now stored in the database and managed through the admin panel. This allows administrators to configure Text-to-Speech (TTS) voice settings that apply to all users globally.

## What Changed

### ✅ Database Layer
- **New Table**: `voice_settings`
  - `id` - Primary key (always 1)
  - `voice_name` - Selected browser voice name
  - `voice_lang` - Language code (e.g., en-US, en-PH)
  - `voice_rate` - Speech speed (0.5 - 2.0, default: 1.0)
  - `voice_pitch` - Voice pitch (0 - 2, default: 1.0)
  - `voice_volume` - Volume level (0 - 1, default: 1.0)
  - `updated_at` - Last modification timestamp

### ✅ API Endpoints
- **GET `/api/voice-settings`** (Public)
  - Returns current voice settings from database
  - Used by chat interface to load settings
  
- **PUT `/api/admin/voice-settings`** (Admin)
  - Updates voice settings in database
  - Request body: `{voiceName, voiceLang, voiceRate, voicePitch, voiceVolume}`

### ✅ Admin Panel Updates
- Voice Settings tab already existed with:
  - Voice selection dropdown (browser voices)
  - Rate slider (0.5 - 2.0)
  - Pitch slider (0 - 2)
  - **NEW**: Volume slider (0 - 1)
  - Test voice button
  
- Updated functionality:
  - Loads settings from database on page load
  - Saves settings to database (instead of localStorage)
  - Shows success message when saved

### ✅ Chat Interface Updates
- Automatically loads voice settings from database on page load
- Applies settings to all Text-to-Speech utterances
- Settings include:
  - Voice name (specific browser voice)
  - Language code
  - Speech rate
  - Pitch
  - Volume

## How to Use

### For Administrators:

1. **Open Admin Panel**
   - Go to http://localhost:3000/admin.html
   - Login with admin credentials

2. **Configure Voice Settings**
   - Click on "🎤 Voice Settings" tab
   - Select a voice from the dropdown (browser voices)
   - Adjust sliders:
     - **Speech Rate**: 1.0 = normal, <1.0 = slower, >1.0 = faster
     - **Pitch**: 1.0 = normal, <1.0 = deeper, >1.0 = higher
     - **Volume**: 1.0 = full volume, <1.0 = quieter
   
3. **Test Voice**
   - Click "🎧 Test Voice" to preview settings
   - Adjust as needed

4. **Save Settings**
   - Click "💾 Save Settings" button
   - Settings are saved to database
   - All users will use these settings immediately

### For Users:

1. **Using Voice Features**
   - Click speaker icon (🔊) on any bot message to hear it
   - Click microphone icon (🎤) to speak your question
   - Voice settings are automatically applied

## Technical Details

### Database Operations
```javascript
// Get current settings
voiceSettingsOps.get()

// Update settings
voiceSettingsOps.update(voiceName, voiceLang, voiceRate, voicePitch, voiceVolume)
```

### API Usage
```javascript
// Frontend: Load settings
const response = await fetch('/api/voice-settings');
const data = await response.json();
const settings = data.settings;

// Frontend: Save settings (admin)
await fetch('/api/admin/voice-settings', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    voiceName: 'Google US English',
    voiceLang: 'en-US',
    voiceRate: 1.2,
    voicePitch: 1.0,
    voiceVolume: 0.9
  })
});
```

### Client-Side Implementation
```javascript
// Apply settings to speech
currentUtterance.lang = voiceSettings.voice_lang;
currentUtterance.rate = voiceSettings.voice_rate;
currentUtterance.pitch = voiceSettings.voice_pitch;
currentUtterance.volume = voiceSettings.voice_volume;

// Set specific voice if configured
if (voiceSettings.voice_name) {
  const selectedVoice = availableVoices.find(
    voice => voice.name === voiceSettings.voice_name
  );
  if (selectedVoice) {
    currentUtterance.voice = selectedVoice;
  }
}
```

## Benefits

### ✨ Centralized Configuration
- Admin sets voice once, applies to all users
- No need to configure on each device
- Consistent experience across all sessions

### ✨ Accessibility
- Adjust speech speed for different reading abilities
- Change pitch for personal preference
- Control volume for different environments

### ✨ Localization Ready
- Support for different languages (voice_lang)
- Select region-specific voices
- Future: Per-language voice profiles

### ✨ Professional Customization
- Organizations can set brand-appropriate voice
- Universities can match institutional tone
- Maintain consistency across departments

## Files Modified

### Backend
- `db.js` - Added voice_settings table and operations
- `server.js` - Added GET and PUT endpoints

### Frontend
- `public/index.html` - Load and apply voice settings from database
- `admin/index.html` - Save settings to database, added volume slider

## Default Settings
```javascript
{
  voice_name: '', // Browser default
  voice_lang: 'en-US',
  voice_rate: 1.0,
  voice_pitch: 1.0,
  voice_volume: 1.0
}
```

## Testing

1. **Test Voice Configuration**
   - Admin panel → Voice Settings → Change settings → Test Voice
   - Verify voice changes are audible

2. **Test Database Persistence**
   - Save settings in admin panel
   - Reload admin panel
   - Verify settings are loaded correctly

3. **Test Client Application**
   - Open chat interface (http://localhost:3000)
   - Get a response and click speaker icon
   - Verify voice uses admin-configured settings

4. **Test Cross-User Consistency**
   - Open chat in multiple browsers/tabs
   - All should use same voice settings
   - Change settings in admin, reload chat
   - Verify new settings apply

## Migration Note

Previously, voice settings were stored in **localStorage** (client-side only). Now they are stored in the **database** (server-side, global).

**Backward Compatibility**: The system still saves to localStorage for compatibility, but the database is the source of truth.

## Future Enhancements

- [ ] Per-language voice profiles
- [ ] Voice settings preview in chat UI
- [ ] Voice cloning integration (ElevenLabs)
- [ ] User-specific voice preferences
- [ ] Voice settings history/versioning
- [ ] A/B testing different voice configurations

---

**Status**: ✅ Fully Implemented and Tested
**Version**: 2.0.0
**Last Updated**: 2024
