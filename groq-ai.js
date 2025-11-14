import Groq from 'groq-sdk';

// Lazy initialize Groq client
let groq = null;

function getGroqClient() {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_1;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is required');
    }
    groq = new Groq({ apiKey });
  }
  return groq;
}

// System context about SKSU
const SKSU_CONTEXT = `You are an AI assistant for Sultan Kudarat State University (SKSU) Student Body Organization.

SKSU Information:
- Vision: "A premier state university in Southeast Asia"
- Mission: Providing quality education, research, and community service
- Location: Tacurong City, Sultan Kudarat, Philippines
- Founded: 1983

You help students with:
- Academic policies and procedures
- Student services and welfare
- University rules and regulations
- Campus life and activities
- General inquiries about SKSU

Guidelines:
- Be helpful, friendly, and professional
- Provide accurate information about SKSU
- If you don't know something, admit it and suggest contacting the appropriate office
- Keep responses concise and clear
- Use a conversational but respectful tone`;

/**
 * Chat with AI using Groq
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages for context (optional)
 * @returns {Promise<string>} AI response
 */
async function chatWithAI(userMessage, conversationHistory = []) {
  try {
    // Build messages array
    const messages = [
      {
        role: 'system',
        content: SKSU_CONTEXT
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Call Groq API
    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      messages: messages,
      model: 'llama-3.1-70b-versatile', // Fast and capable model
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
      stream: false
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
  } catch (error) {
    console.error('❌ Groq AI Error:', error.message);
    
    if (error.status === 429) {
      return 'I apologize, but the AI service is currently experiencing high demand. Please try again in a moment or switch to FAQ mode for instant answers.';
    }
    
    if (error.status === 401) {
      return 'AI service configuration error. Please contact the administrator.';
    }
    
    throw error;
  }
}

/**
 * Get a streaming response from AI (for future implementation)
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<AsyncIterable>} Stream of AI response chunks
 */
async function streamChatWithAI(userMessage, conversationHistory = []) {
  const messages = [
    {
      role: 'system',
      content: SKSU_CONTEXT
    },
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage
    }
  ];

  const client = getGroqClient();
  const stream = await client.chat.completions.create({
    messages: messages,
    model: 'llama-3.1-70b-versatile',
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 0.9,
    stream: true
  });

  return stream;
}

export { chatWithAI, streamChatWithAI };
