# 🤖 AI Features - SKSU FAQ Bot

## Groq AI Integration

This FAQ Bot now includes powerful AI features powered by **Groq** with **Llama 3.1 70B**!

### ✨ Features

#### 1. **Enhanced FAQ Matching** 🎯
- Uses AI to semantically understand questions
- Matches intent, not just keywords
- Better confidence scores
- Works even with differently worded questions

#### 2. **Conversational Responses** 💬
- Natural, friendly AI-generated answers
- Context-aware responses
- Acknowledges uncertainty for low-confidence matches
- More engaging than template responses

#### 3. **Smart Suggestions** 🔗
- Shows related FAQs that might help
- AI-powered relevance scoring
- Click to instantly ask related questions

#### 4. **Admin AI Tools** 🛠️
- **Auto-generate answers**: AI writes FAQ answers from questions
- **Auto-generate keywords**: AI extracts relevant keywords
- Saves time when creating new FAQs

---

## 🚀 Setup Instructions

### 1. Get Your Free Groq API Key

1. Visit: **https://console.groq.com/keys**
2. Sign up for free (no credit card required)
3. Create a new API key
4. Copy the key

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:

```env
GROQ_API_KEY=your-actual-groq-api-key-here

# AI Feature Flags
AI_ENABLED=true
AI_CONVERSATIONAL=true
AI_ENHANCED_MATCHING=true
```

### 3. Restart the Server

```bash
npm start
```

---

## 📊 How It Works

### Student Experience:

1. **Student asks**: "How can I reach you guys?"
2. **AI Enhanced Matching**: Finds the "Contact Us" FAQ (even though wording is different)
3. **Conversational Response**: "You can reach the SKSU Student Body Organization team by..."
4. **Smart Suggestions**: Shows related FAQs like "Office Hours" and "Email Address"

### Admin Experience:

1. **Admin types question**: "What are your office hours?"
2. **Click "AI Generate"**: AI writes a complete answer suggestion
3. **Click "AI Generate" (keywords)**: AI extracts keywords like "hours", "schedule", "open", "office"
4. **Edit & Save**: Tweak the AI-generated content and save

---

## 🎮 Feature Flags

You can toggle AI features on/off:

```env
# Disable all AI features
AI_ENABLED=false

# Keep AI matching but disable conversational responses
AI_CONVERSATIONAL=false

# Use only local matching
AI_ENHANCED_MATCHING=false
```

---

## 💰 Groq Pricing

### Free Tier (Generous!)
- **14,400 requests per day**
- **6,000 tokens per minute**
- Perfect for small to medium deployments
- No credit card required

### For Your FAQ Bot:
- Average question uses ~200 tokens
- ~70 questions per minute supported
- ~14,000 questions per day on free tier
- More than enough for most student organizations!

---

## 🔧 Technical Details

### API Endpoints

#### Student-Facing:
- `POST /api/ask` - Ask a question (AI-enhanced)
  - Returns: answer, confidence, source, relatedFAQs

#### Admin-Facing:
- `POST /api/admin/ai/generate-answer` - Generate FAQ answer
- `POST /api/admin/ai/generate-keywords` - Generate keywords
- `GET /api/admin/ai/status` - Check AI status

### Models Used:
- **llama-3.1-70b-versatile**: Main model for all AI features
- **Context window**: 128K tokens
- **Temperature**: 0.2-0.8 depending on task

### Fallback Behavior:
- If Groq is down → Falls back to local keyword matching
- If AI fails → Returns original FAQ answer
- No disruption to user experience

---

## 🎨 UI Indicators

### AI Badge
When AI enhances an answer, students see:
```
🤖 AI Enhanced
```

### Related Questions
Smart suggestions appear below answers:
```
💡 You might also want to know:
• How do I contact SBO?
• What are your office hours?
```

### Admin AI Buttons
Purple gradient buttons in the FAQ modal:
```
🤖 AI Generate (Answer)
🤖 AI Generate (Keywords)
```

---

## 📈 Performance

### Speed:
- Groq is **extremely fast** (sub-second responses)
- Faster than GPT-4, Claude, or Gemini
- No noticeable latency for students

### Quality:
- Llama 3.1 70B is state-of-the-art
- Comparable to GPT-4 for FAQ tasks
- Better than smaller models (Mistral 7B, etc.)

---

## 🐛 Troubleshooting

### AI Not Working?

1. **Check API Key**:
   ```bash
   # .env file should have valid key
   GROQ_API_KEY=gsk_...
   ```

2. **Check Logs**:
   ```bash
   # Server logs show AI status
   ✅ AI Features enabled (Groq - llama-3.1-70b-versatile)
   ```

3. **Test AI Status**:
   ```bash
   curl http://localhost:3000/api/admin/ai/status
   ```

4. **Rate Limits**:
   - Free tier: 14,400 requests/day
   - If exceeded, falls back to local matching

---

## 🔐 Security Notes

- **Never commit `.env` file** (already in `.gitignore`)
- API key stays server-side only
- Students never see the API key
- Railway will use environment variables (not `.env`)

---

## 🚀 Deployment to Railway

1. Go to Railway dashboard
2. Select your project
3. Go to **Variables** tab
4. Add: `GROQ_API_KEY` = your key
5. Add: `AI_ENABLED` = true
6. Redeploy automatically

---

## 📚 Learn More

- **Groq Docs**: https://console.groq.com/docs
- **Llama 3.1**: https://ai.meta.com/llama/
- **API Reference**: https://console.groq.com/docs/api-reference

---

## 🎯 Future Enhancements

Possible additions:
- **Multi-language support** (translate FAQs)
- **Sentiment analysis** (detect frustrated students)
- **Auto-categorization** (AI assigns categories)
- **FAQ suggestions** (AI suggests new FAQs from unanswered questions)
- **Voice input** (speech-to-text with AI)

---

Enjoy your AI-powered FAQ bot! 🚀✨
