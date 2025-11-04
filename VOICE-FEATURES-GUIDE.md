# 🎤 Voice Features Guide

## Overview

Your SKSU SBO Chat Assistant now has **full voice capabilities**:
- **🎤 Speech-to-Text** - Speak your questions
- **🔊 Text-to-Speech** - Listen to responses

## 🎤 Voice Input (Speech-to-Text)

### How to Use

1. **Click the microphone button** (🎤) next to the input field
2. **Start speaking** when you see "🔴 Listening... Speak now!"
3. **Your speech is converted to text** automatically
4. **Click Send** or press Enter to submit

### Visual Indicators

- **Recording:** Red pulsing microphone button
- **Listening:** Text changes to "🔴 Listening... Speak now!"
- **Stopped:** Button returns to normal purple gradient

### Tips

- ✅ Speak clearly and at a normal pace
- ✅ Works in both FAQ and AI modes
- ✅ Click the mic again to stop recording
- ✅ Supports English language (en-US)

### Browser Support

- ✅ Chrome (Desktop & Mobile)
- ✅ Edge (Desktop)
- ✅ Safari (Desktop & iOS)
- ❌ Firefox (limited support)

## 🔊 Voice Output (Text-to-Speech)

### How to Use

1. **Wait for bot response** to appear
2. **Click the speaker button** (🔊) on any response
3. **Listen to the message** being read aloud
4. **Click again to stop** playback

### Visual Indicators

- **Playing:** Green pulsing speaker button with pause icon
- **Idle:** Gray speaker button with sound waves icon

### Features

- ✅ Natural voice synthesis
- ✅ Adjustable speed, pitch, volume
- ✅ Works on all bot responses (FAQ & AI)
- ✅ Auto-stops when clicking another message
- ✅ One message plays at a time

### Tips

- ✅ Click any speaker to stop current playback
- ✅ Voice settings use browser defaults
- ✅ Works offline (no API needed)

## 🎯 Use Cases

### For Students

**Hands-Free Usage:**
- Ask questions while taking notes
- Listen to policies while reading documents
- Multitask during study sessions

**Accessibility:**
- Visual impairment support
- Reading assistance
- Language learning aid

**Convenience:**
- Quick questions on mobile
- Voice while walking
- Easier than typing on small screens

### For Different Scenarios

1. **Quick FAQ Lookup:**
   - 🎤 "What is the SKSU vision?"
   - 🔊 Listen to the answer
   - Fast and hands-free!

2. **AI Conversation:**
   - 🎤 "Tell me about academic policies"
   - 🔊 Listen to detailed explanation
   - 🎤 "Can you explain more about..."
   - Natural back-and-forth!

3. **Policy Reading:**
   - Search for long policy text
   - 🔊 Listen while reading along
   - Better retention and understanding

## ⚙️ Technical Details

### Speech Recognition (STT)

**Technology:**
- Web Speech API
- Browser-native (no external API)
- Instant processing

**Configuration:**
```javascript
language: 'en-US'
continuous: false
interimResults: false
```

**Privacy:**
- Processes locally in browser (Chrome/Safari)
- Or uses secure browser API
- No data stored on server

### Speech Synthesis (TTS)

**Technology:**
- Web Speech API
- Browser-native voices
- No API costs

**Configuration:**
```javascript
language: 'en-US'
rate: 1.0 (normal speed)
pitch: 1.0 (normal pitch)
volume: 1.0 (maximum)
```

**Features:**
- Natural-sounding voices
- Multiple language support (can be configured)
- Offline capability

## 🎨 UI Elements

### Microphone Button

**Location:** Left of text input
**States:**
- Normal: Purple gradient
- Recording: Red pulsing
- Hover: Slight scale up

### Speaker Buttons

**Location:** Top-right of each bot message
**States:**
- Idle: Gray with sound waves
- Playing: Green with pause icon
- Hover: Purple background

### Status Messages

**Recording:**
```
🔴 Listening... Speak now!
```

**Normal:**
```
Press Enter to send • Click 🎤 for voice input
```

## 🔧 Customization Options

### Change Voice Speed

Edit in `index.html`:
```javascript
currentUtterance.rate = 1.2; // Faster (0.5 - 2.0)
```

### Change Voice Pitch

```javascript
currentUtterance.pitch = 1.1; // Higher (0 - 2)
```

### Change Language

```javascript
recognition.lang = 'en-PH'; // Filipino English
currentUtterance.lang = 'en-PH';
```

### Change Volume

```javascript
currentUtterance.volume = 0.8; // Quieter (0 - 1)
```

## 🚨 Troubleshooting

### Microphone Not Working

**Check:**
1. Browser permissions (allow microphone access)
2. Using supported browser (Chrome/Edge/Safari)
3. Microphone is connected and working
4. No other app is using microphone

**Solutions:**
- Click the lock icon in address bar → Allow microphone
- Reload the page and try again
- Try a different browser

### Speaker Not Working

**Check:**
1. Volume is not muted
2. Browser allows audio playback
3. Text contains valid content

**Solutions:**
- Unmute your device
- Check browser sound settings
- Try a different message

### Voice Recognition Inaccurate

**Tips:**
- Speak more slowly and clearly
- Reduce background noise
- Position microphone closer
- Use better quality microphone

### Accent Not Recognized

**Solutions:**
- Adjust speaking pace
- Use clearer pronunciation
- Consider changing language setting
- Type as fallback

## 📊 Feature Comparison

| Feature | FAQ Mode | AI Mode |
|---------|----------|---------|
| Voice Input | ✅ | ✅ |
| Voice Output | ✅ | ✅ |
| Speed | Instant | 1-3s |
| Context | No memory | Remembers |

## 🎯 Best Practices

### For Voice Input

1. **Pause before speaking** - Wait for "Listening" message
2. **Speak complete sentences** - Better recognition
3. **Avoid filler words** - "um", "uh", etc.
4. **Review text** - Check transcription before sending
5. **Edit if needed** - You can edit the text before sending

### For Voice Output

1. **Use headphones** - Better audio quality
2. **Adjust volume** - Comfortable listening level
3. **Read along** - Better comprehension
4. **Pause/resume** - Click speaker to control
5. **Stop when done** - Prevent overlap with next message

## 🔒 Privacy & Security

### Voice Input

- Processed by browser's speech API
- No recording saved on server
- Temporary processing only
- Secure connection (HTTPS recommended)

### Voice Output

- Text-to-speech runs locally
- No audio files created
- No external API calls
- Completely offline after page load

## 🚀 Future Enhancements

Potential upgrades:
- [ ] Multiple voice options
- [ ] Custom voice speed controls
- [ ] Language selection UI
- [ ] Voice commands (e.g., "Clear chat")
- [ ] Conversation recording/export
- [ ] Custom wake words

## 📱 Mobile Experience

### iOS (Safari)

- ✅ Voice input works
- ✅ Voice output works
- ✅ Natural iOS voices
- ✅ Siri-quality recognition

### Android (Chrome)

- ✅ Voice input works
- ✅ Voice output works  
- ✅ Google TTS voices
- ✅ Assistant-quality recognition

### Tips for Mobile

- Grant microphone permission when prompted
- Use quiet environment for better recognition
- Headphones recommended for privacy
- Speaker button easier to tap than text

## 🎉 Benefits

### Accessibility

- ✅ Vision-impaired friendly
- ✅ Dyslexia support
- ✅ Motor disability accommodation
- ✅ Language learning aid

### Convenience

- ✅ Hands-free operation
- ✅ Faster than typing
- ✅ Multitasking enabled
- ✅ Mobile-friendly

### Engagement

- ✅ More natural interaction
- ✅ Better retention
- ✅ Interactive experience
- ✅ Modern UX

---

**Status:** ✅ Active  
**Voice Input:** Web Speech API (STT)  
**Voice Output:** Web Speech API (TTS)  
**Supported Browsers:** Chrome, Edge, Safari  
**Cost:** Free (browser-native)  

## 🎊 Ready to Use!

Visit **http://localhost:3000** and try:

1. **Click the 🎤 microphone** → Speak your question
2. **Get a response** → Click 🔊 to hear it
3. **Enjoy hands-free interaction!**

Your FAQ bot is now fully voice-enabled! 🎤🔊
