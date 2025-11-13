# Facebook Messenger Bot Setup Guide

## Overview
This guide will help you integrate your FAQ bot with Facebook Messenger, allowing users to interact with your bot directly through Facebook Messenger.

## Prerequisites
- A Facebook Page (create one if you don't have it)
- A Facebook Developer Account
- Your FAQ bot deployed on Railway (https://edcel.up.railway.app)

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Select **Business** as the app type
4. Fill in the details:
   - **App Name**: SKSU FAQ Bot (or your preferred name)
   - **App Contact Email**: Your email
   - **Business Account**: Select your business or skip
5. Click **Create App**

## Step 2: Add Messenger Product

1. In your app dashboard, find **Messenger** in the products list
2. Click **Set Up** on Messenger
3. Scroll down to **Access Tokens**
4. Under **Add or Remove Pages**, click **Add Page**
5. Select your Facebook Page and continue
6. Grant the required permissions
7. **Copy the Page Access Token** - you'll need this!

## Step 3: Configure Railway Environment Variables

1. Go to your Railway project: https://railway.app/project/9ad9e85b-8c9f-44a3-943d-76de96f05f7e
2. Click on your service
3. Go to **Variables** tab
4. Add these new variables:

```
PAGE_ACCESS_TOKEN=<paste your Page Access Token here>
VERIFY_TOKEN=<create a random string, e.g., sksu_faq_bot_verify_2024>
```

**Important**: The VERIFY_TOKEN can be any string you want - just make sure to remember it for the next step!

## Step 4: Set Up Webhook

1. In your Facebook App dashboard, go to **Messenger** → **Settings**
2. Scroll to **Webhooks** section
3. Click **Add Callback URL**
4. Enter:
   - **Callback URL**: `https://edcel.up.railway.app/webhook`
   - **Verify Token**: (use the exact same VERIFY_TOKEN you set in Railway)
5. Click **Verify and Save**

If verification succeeds, continue to the next step. If it fails:
- Check that your Railway service has redeployed with the new environment variables
- Verify the VERIFY_TOKEN matches exactly
- Check Railway logs for errors

## Step 5: Subscribe to Webhook Events

1. Still in the **Webhooks** section
2. Click **Add Subscriptions**
3. Select these events:
   - ✅ `messages`
   - ✅ `messaging_postbacks`
4. Click **Save**

## Step 6: Subscribe Page to Your App

1. In **Webhooks** section, under **Page Subscriptions**
2. Click **Add Page Subscription**
3. Select your Facebook Page
4. Click **Subscribe**

## Step 7: Test Your Bot

1. Go to your Facebook Page
2. Click **Send Message** button
3. Type "hello" or ask a question about SKSU
4. Your bot should respond!

### Test Commands to Try:
- "hello" - Get welcome message with quick replies
- "show categories" - See all FAQ categories
- "questions in [category name]" - View questions in a category
- Ask any question - Bot will search FAQ or use AI

## Features

### Quick Replies
The bot provides quick reply buttons for common actions:
- 📚 View Categories
- 🤖 AI Mode
- ℹ️ Help

### Button Templates
When showing categories or questions, the bot provides clickable buttons for easy navigation.

### AI Mode
If no matching FAQ is found, the bot uses Groq AI (LLaMA 3.1) to provide intelligent responses.

## Troubleshooting

### Bot doesn't respond
1. Check Railway logs: `railway logs`
2. Verify environment variables are set correctly
3. Check that PAGE_ACCESS_TOKEN is valid
4. Ensure webhook subscription is active

### Webhook verification fails
1. Confirm VERIFY_TOKEN matches exactly (case-sensitive)
2. Check Railway deployment is complete
3. Try redeploying: `git push origin main`

### Messages arrive but no response
1. Check Railway logs for errors
2. Verify database is accessible on Railway volume
3. Test API endpoints manually: `https://edcel.up.railway.app/api/categories`

## Webhook URL Structure

Your bot responds to these webhook events:

### GET /webhook (Verification)
Facebook calls this to verify your webhook URL with the VERIFY_TOKEN.

### POST /webhook (Message Handling)
Receives incoming messages and sends responses:
- Text messages
- Postback events (from button clicks)
- Quick reply responses

## Message Types

The bot can send:
1. **Text Messages**: Simple text responses
2. **Quick Replies**: Buttons for quick actions
3. **Button Templates**: Structured messages with buttons

## Database Integration

The messenger bot uses your existing FAQ database:
- Searches categories and questions
- Tracks conversation context
- Uses same AI integration as web interface

## Security

- All communication is over HTTPS
- PAGE_ACCESS_TOKEN is stored securely in Railway environment variables
- Webhook verification ensures only Facebook can send messages

## Rate Limits

Facebook Messenger has rate limits:
- Standard messaging: Unlimited for user-initiated conversations
- Page-initiated messages: Require message tags or active conversation
- The bot uses the same Groq AI failover system as the web interface

## Additional Resources

- [Facebook Messenger Platform Documentation](https://developers.facebook.com/docs/messenger-platform)
- [Webhook Reference](https://developers.facebook.com/docs/messenger-platform/webhooks)
- [Send API Reference](https://developers.facebook.com/docs/messenger-platform/reference/send-api)

## Support

If you encounter issues:
1. Check Railway logs for detailed error messages
2. Verify all environment variables are set
3. Test webhook URL manually: Visit `https://edcel.up.railway.app/webhook?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test`
4. Review Facebook App settings and permissions

---

**Your FAQ bot is now accessible via Facebook Messenger! 🚀**
