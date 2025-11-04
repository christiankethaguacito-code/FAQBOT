# 🔄 API Key Failover System

## Overview

The system now supports **multiple Groq API keys** with automatic failover. When one key reaches its rate limit, the system automatically switches to the next available key.

## 📊 Capacity

With **2 API keys**:
- **200,000 tokens/day** total capacity
- **~2,000 AI conversations/day** (doubled capacity!)
- Seamless switching when limits are reached

## 🔧 Setup

### 1. Get Your Second API Key

1. Go to https://console.groq.com
2. Navigate to **API Keys** section
3. Click **"Create API Key"**
4. Copy the new key

### 2. Add to .env File

Open `.env` and add your second key:

```env
# Groq AI Configuration - Multiple keys for failover
GROQ_API_KEY_1=your_first_groq_api_key_here
GROQ_API_KEY_2=your_second_groq_api_key_here
```

**Replace** `your_new_second_api_key_here` with your actual second API key.

### 3. Restart Server

```bash
npm start
```

You should see:
```
🔑 Initialized 2 Groq API key(s) for failover
✅ FAQ Bot Server running at http://localhost:3000
```

## 🚀 How It Works

### Automatic Failover Flow

```
User sends AI request
       ↓
Check API Key #1
       ↓
   ┌─ Available? ──→ Use Key #1 ──→ Success ✅
   │
   └─ Rate Limited (429)
          ↓
    Mark Key #1 as limited
          ↓
    Switch to Key #2
          ↓
    Retry request automatically
          ↓
    Success with Key #2 ✅
```

### Key Features

1. **Automatic Detection**: System detects rate limit errors (429)
2. **Instant Switch**: Automatically switches to next available key
3. **Transparent Retry**: User doesn't notice the switch
4. **Smart Tracking**: Marks keys as limited for 24 hours
5. **Graceful Degradation**: Shows friendly message when all keys exhausted

## 📋 Status Messages

### Server Console

```bash
🔑 Initialized 2 Groq API key(s) for failover
⚠️ API key #1 marked as rate limited
🔄 Switched to API key #2
```

### User Messages

**When switching:**
- User sees: Normal AI response (seamless)
- Console logs: "🔄 API key switched to #2, retrying..."

**When all keys exhausted:**
- User sees: "⚠️ All AI API keys have reached their daily limit. Please use FAQ mode or try again in 24 hours."

## 🎯 Adding More Keys (Optional)

Want even more capacity? Add more keys!

### For 3 Keys (300k tokens/day):

```env
GROQ_API_KEY_1=first_key_here
GROQ_API_KEY_2=second_key_here
GROQ_API_KEY_3=third_key_here
```

### For 4 Keys (400k tokens/day):

```env
GROQ_API_KEY_1=first_key_here
GROQ_API_KEY_2=second_key_here
GROQ_API_KEY_3=third_key_here
GROQ_API_KEY_4=fourth_key_here
```

**Note:** Remember to get each key from a different Groq account for separate rate limits.

## 📊 Monitoring

### Check Current Status

The server logs show:
- Which key is currently active
- When a key gets rate limited
- When switching occurs

### Example Logs

```bash
✅ FAQ Bot Server running at http://localhost:3000
🔑 Initialized 2 Groq API key(s) for failover

# After some usage...
⚠️ API key #1 marked as rate limited
🔄 Switched to API key #2
✅ Response from API key #2

# Much later...
⚠️ API key #2 marked as rate limited
❌ All API keys have reached their rate limit
```

## 🔒 Security

### Best Practices

1. **Never commit .env to Git**
   - Already in `.gitignore`
   - Keep keys secret

2. **Use different Groq accounts**
   - Each account gets separate rate limits
   - Key #1 from Account A
   - Key #2 from Account B

3. **Rotate keys periodically**
   - Good security practice
   - Update .env with new keys
   - Restart server

## 🧪 Testing the Failover

### Simulate Rate Limit

1. Use Key #1 heavily until rate limited
2. System automatically switches to Key #2
3. Check server console for switch message
4. Continue using AI mode seamlessly

### Verify Multiple Keys

Check server startup message:
```bash
🔑 Initialized 2 Groq API key(s) for failover
```

If you see `1 Groq API key(s)`, check:
- Second key is in `.env`
- Second key is not the placeholder text
- `.env` file is saved
- Server is restarted

## 📈 Capacity Planning

### With 2 Keys

| Scenario | Daily Capacity |
|----------|----------------|
| Total Tokens | 200,000 |
| AI Conversations | ~2,000 |
| Heavy Users (10 msgs each) | 200 |
| Light Users (3 msgs each) | 600 |

### Real-World Usage

For **1,000 students/day**:
- 80% use FAQ mode (800) → No token usage
- 20% use AI mode (200) → ~20,000 tokens
- **Result**: 10% of capacity used! ✅

## ⚙️ Configuration

### Rate Limit Reset Time

Currently set to 24 hours. Located in `server.js`:

```javascript
keyRateLimitStatus[keyIndex].resetTime = Date.now() + (24 * 60 * 60 * 1000);
```

### Retry Logic

Client-side retry in `index.html`:

```javascript
let maxRetries = 2; // Allow one retry for key switching
```

## 🚨 Troubleshooting

### "Initialized 1 Groq API key(s)" (Expected 2)

**Check:**
1. `.env` has `GROQ_API_KEY_2=...`
2. Second key is not placeholder text
3. Server was restarted after editing `.env`

### "All API keys have reached their rate limit"

**Solutions:**
1. Wait 24 hours for reset
2. Add more API keys
3. Direct users to FAQ mode
4. Upgrade to Groq paid plan

### Keys not switching automatically

**Check server console for:**
- Rate limit detection (429 error)
- Switch message not appearing
- Check error logs

## 📞 Support

If failover isn't working:
1. Check server console logs
2. Verify all keys in `.env` are valid
3. Test each key individually at https://console.groq.com
4. Ensure different Groq accounts for each key

## 🎉 Benefits

✅ **2x Capacity** - Double your daily token limit  
✅ **Zero Downtime** - Automatic switching  
✅ **Transparent** - Users don't notice  
✅ **Scalable** - Add more keys anytime  
✅ **Smart** - Tracks usage per key  
✅ **Reliable** - Graceful degradation  

---

**Status:** ✅ Active  
**Current Setup:** Ready for 2 API keys  
**Capacity:** 200,000 tokens/day (~2,000 conversations)  
**Next Step:** Add your second API key to `.env` and restart!
