import Groq from 'groq-sdk';

// Model to use (Llama 3.3 70B is very powerful and fast)
const MODEL = 'llama-3.3-70b-versatile';

// Initialize Groq client lazily (after env vars are loaded)
// Get your free API key from: https://console.groq.com/keys
let groq = null;

function getGroqClient() {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || 'your-groq-api-key-here'
    });
  }
  return groq;
}

/**
 * Determine if a question is about the organization or general knowledge
 * @param {string} question - User's question
 * @returns {Promise<Object>} { isOrganizationRelated: boolean, confidence: number }
 */
export async function classifyQuestion(question) {
  try {
    const systemPrompt = `You are a question classifier for SKSU Student Body Organization.
Classify if the question is about the organization/student services OR general knowledge (math, science, English, etc.).

Return ONLY a JSON object:
{
  "isOrganizationRelated": true/false,
  "confidence": 0-100,
  "reasoning": "brief explanation"
}

Examples:
- "How do I contact SBO?" → isOrganizationRelated: true
- "What are your office hours?" → isOrganizationRelated: true
- "What is 2+2?" → isOrganizationRelated: false
- "Define photosynthesis" → isOrganizationRelated: false
- "Help me with my homework" → isOrganizationRelated: false`;

    const completion = await getGroqClient().chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Classify this question: "${question}"` }
      ],
      model: MODEL,
      temperature: 0.1,
      max_tokens: 100,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    const result = JSON.parse(responseText.match(/\{[^}]+\}/)?.[0] || '{}');
    
    return {
      isOrganizationRelated: result.isOrganizationRelated !== false,
      confidence: (result.confidence || 50) / 100,
      reasoning: result.reasoning || ''
    };
  } catch (error) {
    console.error('Question classification error:', error);
    // Default to organization-related to be safe
    return { isOrganizationRelated: true, confidence: 0.5, reasoning: 'Classification failed' };
  }
}

/**
 * Generate a direct answer for general knowledge questions
 * @param {string} question - User's question
 * @returns {Promise<string>} AI-generated answer
 */
export async function answerGeneralQuestion(question) {
  try {
    const systemPrompt = `You are a helpful, knowledgeable assistant for students.
Answer questions about math, science, English, history, and other academic subjects.

Guidelines:
- Be precise and accurate
- Keep answers concise but complete (2-4 sentences)
- Use clear, student-friendly language
- If it's a homework problem, guide rather than just give the answer
- For math, show the solution steps briefly`;

    const completion = await getGroqClient().chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      model: MODEL,
      temperature: 0.3,
      max_tokens: 250,
    });

    return completion.choices[0]?.message?.content || "I'm not sure how to answer that.";
  } catch (error) {
    console.error('General question answer error:', error);
    return "I'm having trouble answering that right now. Please try again.";
  }
}

/**
 * Generate a conversational response using AI
 * @param {string} question - User's question
 * @param {Array} faqs - Available FAQs for context
 * @param {string} matchedAnswer - Best matched FAQ answer
 * @param {number} confidence - Match confidence score
 * @returns {Promise<string>} AI-generated response
 */
export async function generateConversationalResponse(question, faqs, matchedAnswer, confidence) {
  try {
    const faqContext = faqs.slice(0, 5).map(f => 
      `Q: ${f.question}\nA: ${f.answer}`
    ).join('\n\n');

    const systemPrompt = `You are a helpful SKSU Student Body Organization assistant. 
You have access to the following FAQs:

${faqContext}

When answering questions:
- Be friendly, helpful, and conversational
- Use the FAQ information as a base
- Add natural language and context
- If the match confidence is low, acknowledge uncertainty
- Keep responses concise but complete
- Use emojis sparingly for friendliness`;

    const userPrompt = confidence >= 0.5 
      ? `A student asked: "${question}"\n\nBest match answer: ${matchedAnswer}\n\nProvide a conversational, helpful response based on this information.`
      : `A student asked: "${question}"\n\nI found this possibly related answer: ${matchedAnswer}\n\nBut the match confidence is only ${(confidence * 100).toFixed(0)}%. Please provide a helpful response that either:\n1. Confirms this answer if it seems relevant, or\n2. Politely says you're not sure and suggests contacting SBO directly.`;

    const completion = await getGroqClient().chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || matchedAnswer;
  } catch (error) {
    console.error('Groq AI error:', error);
    // Fallback to original answer if AI fails
    return matchedAnswer;
  }
}

/**
 * Generate FAQ answer suggestion for admin
 * @param {string} question - FAQ question
 * @param {string} category - FAQ category
 * @returns {Promise<string>} AI-generated answer
 */
export async function generateFAQAnswer(question, category = 'General') {
  try {
    const systemPrompt = `You are an expert at writing FAQ answers for SKSU Student Body Organization.
Write clear, helpful, and professional answers.
Keep answers concise (2-4 sentences) but complete.
Use a friendly, approachable tone.
Include specific details when relevant (hours, contacts, procedures).`;

    const userPrompt = `Category: ${category}
Question: ${question}

Write a comprehensive FAQ answer for this question.`;

    const completion = await getGroqClient().chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: MODEL,
      temperature: 0.8,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq AI error:', error);
    return '';
  }
}

/**
 * Find semantically similar FAQs using AI
 * @param {string} question - User's question
 * @param {Array} faqs - All available FAQs
 * @returns {Promise<Array>} Related FAQs with relevance scores
 */
export async function findRelatedFAQs(question, faqs) {
  try {
    const faqList = faqs.map((f, i) => 
      `${i + 1}. ${f.question} (Category: ${f.category})`
    ).join('\n');

    const systemPrompt = `You are an FAQ matching expert. Given a user question, identify the most relevant FAQs from the list.
Return ONLY a JSON array of FAQ numbers in order of relevance (most relevant first).
Example: [3, 7, 1]
If no FAQs are relevant, return an empty array: []`;

    const userPrompt = `User question: "${question}"

Available FAQs:
${faqList}

Return the numbers of the top 3 most relevant FAQs as a JSON array.`;

    const completion = await getGroqClient().chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: MODEL,
      temperature: 0.3,
      max_tokens: 50,
    });

    const responseText = completion.choices[0]?.message?.content || '[]';
    const matches = JSON.parse(responseText.match(/\[[\d,\s]*\]/)?.[0] || '[]');
    
    return matches
      .filter(num => num > 0 && num <= faqs.length)
      .map(num => faqs[num - 1])
      .filter(Boolean)
      .slice(0, 3);
  } catch (error) {
    console.error('Groq AI error:', error);
    return [];
  }
}

/**
 * Enhanced semantic FAQ matching using AI
 * @param {string} question - User's question
 * @param {Array} faqs - All available FAQs
 * @returns {Promise<Object>} Best match with AI-enhanced score
 */
export async function enhancedFAQMatch(question, faqs) {
  try {
    const faqList = faqs.map((f, i) => 
      `${i + 1}. Q: ${f.question}\n   A: ${f.answer.substring(0, 100)}...`
    ).join('\n\n');

    const systemPrompt = `You are an FAQ matching expert. Analyze the user's question and find the best matching FAQ.
Return a JSON object with:
{
  "faqNumber": <number of best match, or 0 if no good match>,
  "confidence": <0-100 score>,
  "reasoning": <brief explanation>
}`;

    const userPrompt = `User question: "${question}"

Available FAQs:
${faqList}

Find the best matching FAQ.`;

    const completion = await getGroqClient().chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: MODEL,
      temperature: 0.2,
      max_tokens: 150,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    const result = JSON.parse(responseText.match(/\{[^}]+\}/)?.[0] || '{}');
    
    if (result.faqNumber > 0 && result.faqNumber <= faqs.length) {
      return {
        faq: faqs[result.faqNumber - 1],
        confidence: (result.confidence || 0) / 100,
        reasoning: result.reasoning || '',
        source: 'ai-enhanced'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Groq AI error:', error);
    return null;
  }
}

/**
 * Generate keywords for a new FAQ
 * @param {string} question - FAQ question
 * @param {string} answer - FAQ answer
 * @returns {Promise<Array>} AI-generated keywords
 */
export async function generateKeywords(question, answer) {
  try {
    const systemPrompt = `Extract 5-8 relevant keywords from the FAQ question and answer.
Return ONLY a JSON array of keywords.
Example: ["contact", "email", "phone", "reach", "support"]`;

    const userPrompt = `Question: ${question}
Answer: ${answer}

Extract keywords:`;

    const completion = await getGroqClient().chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: MODEL,
      temperature: 0.5,
      max_tokens: 100,
    });

    const responseText = completion.choices[0]?.message?.content || '[]';
    const keywords = JSON.parse(responseText.match(/\[[\s\S]*\]/)?.[0] || '[]');
    
    return keywords.filter(k => typeof k === 'string' && k.length > 0);
  } catch (error) {
    console.error('Groq AI error:', error);
    return [];
  }
}

export default {
  generateConversationalResponse,
  generateFAQAnswer,
  findRelatedFAQs,
  enhancedFAQMatch,
  generateKeywords,
  classifyQuestion,
  answerGeneralQuestion
};
