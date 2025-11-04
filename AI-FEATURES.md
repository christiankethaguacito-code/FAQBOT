# AI Features Documentation

## Overview
The SKSU SBO Chat Assistant now supports **two modes**:
1. **FAQ Mode** - Quick answers from the database (managed via admin panel)
2. **AI Mode** - Conversational AI powered by Groq (Llama 3.1 70B)

## Toggle Between Modes

### How to Switch
- Click the toggle switch in the header between "FAQ" and "AI"
- The interface will update to reflect the current mode
- Conversation history is reset when switching modes

### Visual Indicators

**FAQ Mode:**
- Toggle switch on the left
- Header subtitle: "Always here to help"
- Shows category suggestions
- Quick, database-driven responses

**AI Mode:**
- Toggle switch on the right
- Header subtitle: "Powered by AI - Ask me anything!"
- Green "AI Mode" badge appears
- Robot emoji (🤖) for AI responses
- Conversational, context-aware responses

## FAQ Mode Features

### How It Works
- Searches the SQLite database for matching questions
- Returns exact answers managed by admins
- Shows related questions
- Displays category suggestions when no match found

### Best For
- ✅ Official policies and procedures
- ✅ Specific rules and regulations
- ✅ Structured information
- ✅ Quick, accurate responses
- ✅ Content controlled by admins

### Response Time
- **Instant** (<50ms) - Direct database queries

## AI Mode Features

### How It Works
- Powered by **Groq AI** with Llama 3.1 70B model
- Maintains conversation context (last 10 messages)
- Understands natural language
- Provides personalized responses

### System Context
The AI knows:
- SKSU Vision: "A premier state university in Southeast Asia"
- SKSU Mission: Quality education, research, and community service
- Location: Tacurong City, Sultan Kudarat, Philippines
- Founded: 1983
- Focus areas: Academic policies, student services, campus life

### Best For
- ✅ Open-ended questions
- ✅ Follow-up conversations
- ✅ Explanations and clarifications
- ✅ General inquiries
- ✅ Creative or complex questions

### Response Time
- **Fast** (1-3 seconds) - Groq API processing

### Conversation Memory
- Remembers last 5 exchanges (10 messages)
- Provides contextual follow-ups
- Reset when switching modes or clicking reset button

## Technical Details

### API Configuration

**Environment Variables:**
```env
GROQ_API_KEY=your_groq_api_key_here
AI_ENABLED=true
```

**Model Settings:**
- Model: `llama-3.1-70b-versatile`
- Temperature: 0.7 (balanced creativity)
- Max Tokens: 1024 (detailed responses)
- Top P: 0.9 (high quality)

### API Endpoint

**POST** `/api/ai/chat`

**Request:**
```json
{
  "message": "What is SKSU's vision?",
  "conversationHistory": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "response": "Sultan Kudarat State University's vision is...",
  "model": "llama-3.1-70b-versatile"
}
```

**Error Handling:**
- 429: Rate limit exceeded (returns user-friendly message)
- 401: API key invalid (admin notification)
- 500: General error (retry suggestion)

## Usage Guidelines

### When to Use FAQ Mode
1. Looking for official information
2. Need exact policy wording
3. Want instant responses
4. Browsing by categories

### When to Use AI Mode
1. Asking complex questions
2. Need explanations
3. Having a conversation
4. Exploring topics freely

## Best Practices

### For Students
- Start with FAQ mode for quick answers
- Switch to AI mode for discussions
- Use AI mode to understand policies better
- FAQ mode for specific procedures

### For Admins
- Keep FAQ database updated
- Monitor AI responses for accuracy
- Use AI mode to test student experience
- Admin panel controls FAQ content only

## Rate Limits & Costs

### Groq API
- **Free Tier**: 100,000 tokens/day
- **Approximate Usage**: ~50-100 tokens per message
- **Daily Capacity**: ~1,000-2,000 AI messages/day

### Fallback Strategy
If rate limit exceeded:
- System suggests switching to FAQ mode
- Error message: "AI service experiencing high demand"
- FAQ mode always available as backup

## Security

### API Key Protection
- Stored in `.env` file (not committed to Git)
- Server-side only (never exposed to client)
- Separate from admin credentials

### Content Safety
- System prompt guides appropriate responses
- AI instructed to:
  - Be professional and respectful
  - Admit when unsure
  - Suggest contacting appropriate offices
  - Stay focused on SKSU topics

## Future Enhancements

### Potential Features
- [ ] Streaming responses (real-time typing effect)
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Image understanding
- [ ] Export conversation history
- [ ] AI training on FAQ database

## Troubleshooting

### AI Not Responding
1. Check Groq API key in `.env`
2. Verify internet connection
3. Check API rate limits
4. Switch to FAQ mode as backup

### Slow Responses
- Normal: 1-3 seconds
- Slow: 5+ seconds (high API load)
- Solution: Try again or use FAQ mode

### Incorrect Information
- AI may occasionally provide inaccurate info
- Always verify critical information
- Use FAQ mode for official policies
- Report issues to admins

## Comparison Table

| Feature | FAQ Mode | AI Mode |
|---------|----------|---------|
| **Speed** | Instant (<50ms) | Fast (1-3s) |
| **Accuracy** | 100% (database) | ~95% (AI) |
| **Context** | No memory | Remembers chat |
| **Flexibility** | Exact matches | Natural language |
| **Content** | Admin-controlled | AI-generated |
| **Offline** | ❌ Requires DB | ❌ Requires API |
| **Cost** | Free | API quota |
| **Best For** | Official info | Conversations |

## Support

### For Students
- Use FAQ mode for most queries
- Try AI mode for complex questions
- Contact SBO office for urgent matters

### For Admins
- Manage FAQ content via admin panel
- Monitor AI usage in server logs
- Update `.env` for API configuration
- Report issues to tech team

---

**Last Updated:** November 4, 2025  
**Version:** 2.0 with AI Features  
**Powered by:** Groq AI (Llama 3.1 70B)
