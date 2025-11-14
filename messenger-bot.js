import express from 'express';
import { categoryOps, questionOps } from './db.js';
import { chatWithAI } from './groq-ai.js';

const router = express.Router();

// Facebook Messenger Configuration
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'sksu_faq_bot_verify_2024';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Webhook verification endpoint
router.get('/webhook', (req, res) => {
    console.log('📞 Webhook GET request received:', req.query);
    
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('✅ Webhook verified! Token matches.');
            res.status(200).send(challenge);
        } else {
            console.log('❌ Webhook verification failed. Token mismatch.');
            res.sendStatus(403);
        }
    } else {
        console.log('❌ Missing mode or token parameters');
        res.sendStatus(400);
    }
});

// Webhook to receive messages
router.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        // Iterate over each entry
        body.entry.forEach(async (entry) => {
            const webhookEvent = entry.messaging[0];
            const senderId = webhookEvent.sender.id;

            if (webhookEvent.message) {
                await handleMessage(senderId, webhookEvent.message);
            } else if (webhookEvent.postback) {
                await handlePostback(senderId, webhookEvent.postback);
            }
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Handle incoming messages
async function handleMessage(senderId, message) {
    const userMessage = message.text;

    if (!userMessage) return;

    console.log(`📨 Message from ${senderId}: ${userMessage}`);

    // Send typing indicator
    await sendTypingIndicator(senderId, true);

    try {
        // Check for creator/developer questions
        const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.includes('creator') || 
            lowerMessage.includes('developer') || 
            lowerMessage.includes('who made you') || 
            lowerMessage.includes('who created you') ||
            lowerMessage.includes('who built you') ||
            lowerMessage.includes('who developed you')) {
            await sendTextMessage(senderId, 
                "👨‍💻 I was created by Christian Keth Aguacito!\n\n" +
                "Christian Keth Aguacito is a developer who built me to help SKSU students get quick answers to their questions. 🚀"
            );
            await sendTypingIndicator(senderId, false);
            return;
        }
        
        // Search FAQ first
        const searchResults = questionOps.search(userMessage);

        if (searchResults.length > 0) {
            // Found FAQ answer
            const topResult = searchResults[0];
            const category = categoryOps.getById(topResult.category_id);
            
            const response = `${topResult.answer}\n\n📁 Category: ${category.name}`;
            await sendTextMessage(senderId, response);
            
            // Send quick replies for more questions
            await sendQuickReplies(senderId, "Need more help?", [
                { title: "Ask another question", payload: "ASK_MORE" },
                { title: "Browse categories", payload: "BROWSE_CATEGORIES" },
                { title: "Talk to AI", payload: "AI_MODE" }
            ]);
        } else {
            // No FAQ found, use AI
            const aiResponse = await chatWithAI(userMessage);
            await sendTextMessage(senderId, `🤖 AI Response:\n\n${aiResponse}`);
            
            await sendQuickReplies(senderId, "Was this helpful?", [
                { title: "👍 Yes", payload: "HELPFUL_YES" },
                { title: "👎 No", payload: "HELPFUL_NO" },
                { title: "Browse FAQs", payload: "BROWSE_CATEGORIES" }
            ]);
        }
    } catch (error) {
        console.error('Error handling message:', error);
        await sendTextMessage(senderId, "Sorry, I encountered an error. Please try again.");
    }

    await sendTypingIndicator(senderId, false);
}

// Handle postbacks (button clicks)
async function handlePostback(senderId, postback) {
    const payload = postback.payload;

    console.log(`🔘 Postback from ${senderId}: ${payload}`);

    switch (payload) {
        case 'GET_STARTED':
            await sendWelcomeMessage(senderId);
            break;
        case 'BROWSE_CATEGORIES':
            await sendCategories(senderId);
            break;
        case 'AI_MODE':
            await sendTextMessage(senderId, "🤖 AI Mode activated! Ask me anything about SKSU.");
            break;
        case 'ASK_MORE':
            await sendTextMessage(senderId, "What else would you like to know?");
            break;
        default:
            // Handle category selection (format: CAT_1, CAT_2, etc.)
            if (payload.startsWith('CAT_')) {
                const categoryId = parseInt(payload.replace('CAT_', ''));
                await sendCategoryQuestions(senderId, categoryId);
            }
    }
}

// Send welcome message
async function sendWelcomeMessage(senderId) {
    await sendTextMessage(senderId, 
        `👋 Welcome to SKSU SBO ISULAN FAQ Bot!\n\n` +
        `I can help you with:\n` +
        `✅ Student policies and procedures\n` +
        `✅ Academic information\n` +
        `✅ Campus services\n` +
        `✅ General questions about SKSU\n\n` +
        `How can I assist you today?`
    );

    await sendQuickReplies(senderId, "Choose an option:", [
        { title: "Browse Categories", payload: "BROWSE_CATEGORIES" },
        { title: "Ask AI", payload: "AI_MODE" }
    ]);
}

// Send categories list
async function sendCategories(senderId) {
    const categories = categoryOps.getAll();
    
    const elements = categories.map(cat => ({
        title: `${cat.icon} ${cat.name}`,
        subtitle: cat.description,
        buttons: [{
            type: "postback",
            title: "View Questions",
            payload: `CAT_${cat.id}`
        }]
    }));

    await sendGenericTemplate(senderId, elements);
}

// Send questions for a category
async function sendCategoryQuestions(senderId, categoryId) {
    const category = categoryOps.getById(categoryId);
    const questions = questionOps.getByCategoryId(categoryId);

    await sendTextMessage(senderId, 
        `${category.icon} ${category.name}\n\n` +
        `Found ${questions.length} questions in this category.`
    );

    // Send first 5 questions as quick replies
    const quickReplies = questions.slice(0, 5).map((q, index) => ({
        content_type: "text",
        title: `Q${index + 1}: ${q.question.substring(0, 17)}...`,
        payload: `Q_${q.id}`
    }));

    await sendQuickReplies(senderId, "Select a question:", quickReplies);
}

// Send text message
async function sendTextMessage(senderId, text) {
    const messageData = {
        recipient: { id: senderId },
        message: { text: text }
    };

    await callSendAPI(messageData);
}

// Send typing indicator
async function sendTypingIndicator(senderId, isTyping) {
    const messageData = {
        recipient: { id: senderId },
        sender_action: isTyping ? "typing_on" : "typing_off"
    };

    await callSendAPI(messageData);
}

// Send quick replies
async function sendQuickReplies(senderId, text, quickReplies) {
    const messageData = {
        recipient: { id: senderId },
        message: {
            text: text,
            quick_replies: quickReplies.map(qr => ({
                content_type: "text",
                title: qr.title,
                payload: qr.payload
            }))
        }
    };

    await callSendAPI(messageData);
}

// Send generic template (carousel)
async function sendGenericTemplate(senderId, elements) {
    const messageData = {
        recipient: { id: senderId },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: elements.slice(0, 10) // Max 10 elements
                }
            }
        }
    };

    await callSendAPI(messageData);
}

// Call Facebook Send API
async function callSendAPI(messageData) {
    if (!PAGE_ACCESS_TOKEN) {
        console.error('❌ PAGE_ACCESS_TOKEN not set!');
        return;
    }

    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Send API error:', error);
        }
    } catch (error) {
        console.error('❌ Failed to send message:', error);
    }
}

export default router;
