# 🔐 User Accounts System - Implementation Guide

## ✅ What's Been Implemented

### **Database Tables Created:**
1. ✅ **users** - User accounts with authentication
2. ✅ **user_statistics** - Track user activity and progress
3. ✅ **conversation_history** - Save all chat conversations
4. ✅ **bookmarks** - Save favorite FAQs
5. ✅ **quiz_progress** - Track quiz results and scores
6. ✅ **user_achievements** - Track unlocked achievements
7. ✅ **user_sessions** - Manage login sessions

### **Backend Features:**
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Session management
- ✅ Rate limiting
- ✅ Complete API endpoints for all features
- ✅ Points & leveling system
- ✅ Achievements tracking
- ✅ Leaderboard system

### **Frontend Created:**
- ✅ Login/Signup page (`/public/login.html`)
- ⏳ Profile dashboard (needs creation)
- ⏳ Integration with main FAQ bot (needs update)

---

## 🚀 Quick Start

### 1. Initialize the User Database:
```bash
node init-users-db.js
```

### 2. Start the Server:
```bash
npm start
```

### 3. Access Pages:
- **Login/Signup**: http://localhost:3000/login.html
- **Main App**: http://localhost:3000/index.html

---

## 📡 API Endpoints Reference

### **Authentication**

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",        // optional
  "studentId": "2023-12345",     // optional
  "department": "CS",            // optional
  "yearLevel": "3rd Year"        // optional
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "john_doe",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN

Response:
{
  "success": true,
  "user": { ... },
  "stats": { ... }
}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "fullName": "John Updated Doe",
  "studentId": "2023-12345",
  "department": "Computer Science",
  "yearLevel": "4th Year",
  "avatarUrl": "https://...",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```

### **Conversation History**

#### Save Conversation
```http
POST /api/conversations
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "mode": "ai",
  "message": "What is SKSU's vision?",
  "response": "SKSU's vision is...",
  "isUserMessage": true
}
```

#### Get History
```http
GET /api/conversations?limit=50&offset=0
Authorization: Bearer YOUR_JWT_TOKEN

// or filter by mode
GET /api/conversations?mode=ai&limit=20
```

#### Search History
```http
GET /api/conversations/search?q=enrollment
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Delete History
```http
DELETE /api/conversations
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Bookmarks**

#### Add Bookmark
```http
POST /api/bookmarks
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "questionId": 5,
  "notes": "Important for next semester"
}
```

#### Get All Bookmarks
```http
GET /api/bookmarks
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Check if Bookmarked
```http
GET /api/bookmarks/check/5
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Remove Bookmark
```http
DELETE /api/bookmarks/5
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Quiz Progress**

#### Save Quiz Result
```http
POST /api/quiz/progress
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "quizTopic": "SKSU Information",
  "score": 8,
  "totalQuestions": 10,
  "timeTaken": 120,
  "completed": true
}

Response:
{
  "success": true,
  "pointsEarned": 40,
  "leveledUp": true,
  "newLevel": 3
}
```

#### Get Quiz History
```http
GET /api/quiz/history
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Stats by Topic
```http
GET /api/quiz/stats/SKSU%20Information
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Gamification**

#### Get Leaderboard
```http
GET /api/leaderboard?limit=10
// No auth required - public endpoint
```

#### Update User Stats
```http
POST /api/user/stats
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "questionsAsked": 1,
  "aiChatsStarted": 1,
  "quizzesCompleted": 1,
  "easterEggsFound": 1,
  "reactionsGiven": 1,
  "categoryExplored": "SKSU Information"
}
```

#### Unlock Achievement
```http
POST /api/achievements
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "achievementId": "first_quiz",
  "achievementName": "Quiz Master"
}
```

---

## 🎮 Points & Leveling System

### **How Points Are Earned:**
- ✅ Ask a question: **+2 points**
- ✅ Complete a quiz: **+10-50 points** (based on score)
- ✅ Bookmark a FAQ: **+5 points**
- ✅ Unlock achievement: **+25 points**
- ✅ Daily streak: **+10 points/day**

### **Level Calculation:**
```javascript
Level = floor(sqrt(total_points / 100)) + 1
```

**Examples:**
- 0-99 points → Level 1
- 100-399 points → Level 2
- 400-899 points → Level 3
- 900-1599 points → Level 4
- 1600+ points → Level 5+

---

## 🏆 Available Achievements

### **Badges:**
1. **First Steps** - Complete your first action
2. **Curious Mind** - Ask 10 questions
3. **Knowledge Seeker** - Ask 50 questions
4. **Quiz Master** - Complete 5 quizzes
5. **Perfect Score** - Get 100% on a quiz
6. **AI Enthusiast** - Have 20 AI conversations
7. **Super Learner** - Reach level 5
8. **Bookmark Collector** - Save 10 bookmarks
9. **Category Explorer** - Explore all categories
10. **Week Streak** - Maintain 7-day streak

---

## 🔧 Next Steps for Frontend Integration

### **1. Update `index.html` to Support Auth:**

Add this to the beginning of your JavaScript:

```javascript
// Auth state
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Check if user is logged in
async function checkAuth() {
    if (!authToken) return false;
    
    try {
        const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            userStats = data.stats;
            updateUIForLoggedInUser();
            return true;
        } else {
            // Token invalid
            logout();
            return false;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
}

function updateUIForLoggedInUser() {
    // Show user profile button
    document.getElementById('userProfile').style.display = 'flex';
    document.getElementById('loginBtn').style.display = 'none';
    
    // Update user info
    document.getElementById('username').textContent = currentUser.username;
    document.getElementById('userPoints').textContent = currentUser.points;
    document.getElementById('userLevel').textContent = currentUser.level;
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    currentUser = null;
    authToken = null;
    window.location.reload();
}

// Initialize auth on load
window.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    // ... rest of your initialization
});
```

### **2. Save Conversations:**

Modify your `addBotMessage` function:

```javascript
async function addBotMessage(text, questionId = '', isAI = false) {
    // ... existing code to display message ...
    
    // Save to history if logged in
    if (currentUser && authToken) {
        try {
            await fetch('/api/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    mode: isAI ? 'ai' : 'faq',
                    message: text,
                    response: null,
                    isUserMessage: false
                })
            });
        } catch (error) {
            console.error('Failed to save conversation:', error);
        }
    }
}
```

### **3. Add Bookmark Buttons:**

```javascript
function createBookmarkButton(questionId) {
    if (!currentUser) return '';
    
    return `
        <button class="bookmark-btn" onclick="toggleBookmark(${questionId})">
            <svg>...</svg> Bookmark
        </button>
    `;
}

async function toggleBookmark(questionId) {
    try {
        const response = await fetch(`/api/bookmarks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ questionId })
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification(data.message);
        }
    } catch (error) {
        console.error('Bookmark error:', error);
    }
}
```

### **4. Track Quiz Progress:**

```javascript
async function saveQuizResult(topic, score, total, time) {
    if (!currentUser) return;
    
    try {
        const response = await fetch('/api/quiz/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                quizTopic: topic,
                score: score,
                totalQuestions: total,
                timeTaken: time,
                completed: true
            })
        });
        
        const data = await response.json();
        if (data.success) {
            if (data.leveledUp) {
                showLevelUpNotification(data.newLevel);
            }
            showNotification(`+${data.pointsEarned} points!`);
        }
    } catch (error) {
        console.error('Save quiz error:', error);
    }
}
```

---

## 🎨 UI Components to Add

### **1. User Profile Button (in header):**
```html
<div id="userProfile" style="display: none;">
    <div class="user-info">
        <img id="userAvatar" src="/default-avatar.png" />
        <div>
            <div id="username">Username</div>
            <div class="user-level">
                Level <span id="userLevel">1</span> • 
                <span id="userPoints">0</span> pts
            </div>
        </div>
    </div>
    <button onclick="showProfileModal()">Profile</button>
    <button onclick="logout()">Logout</button>
</div>

<a id="loginBtn" href="login.html">Login / Sign Up</a>
```

### **2. Profile Modal:**
```html
<div class="profile-modal" id="profileModal">
    <div class="modal-content">
        <h2>Your Profile</h2>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">0</div>
                <div class="stat-label">Questions Asked</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">0</div>
                <div class="stat-label">Quizzes Completed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">0</div>
                <div class="stat-label">Day Streak</div>
            </div>
        </div>
        
        <div class="badges">
            <h3>Achievements</h3>
            <!-- Display badges here -->
        </div>
        
        <button onclick="showConversationHistory()">View History</button>
        <button onclick="showBookmarks()">My Bookmarks</button>
    </div>
</div>
```

---

## 📦 Environment Variables

Add to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-session-secret-key-change-this-too
NODE_ENV=development
```

---

## 🔒 Security Notes

1. ✅ Passwords are hashed with bcrypt (10 rounds)
2. ✅ JWT tokens expire after 7 days
3. ✅ Rate limiting prevents abuse
4. ✅ SQL injection prevention (prepared statements)
5. ✅ Session cookies are httpOnly
6. ⚠️ Remember to change JWT_SECRET in production!
7. ⚠️ Use HTTPS in production for secure cookies

---

## 🎯 Features Summary

### ✅ **Fully Implemented:**
- User registration & login
- JWT authentication
- Password management
- Conversation history saving
- Bookmark system
- Quiz progress tracking
- Points & leveling
- Achievements system
- Leaderboard
- User statistics
- Daily streaks

### ⏳ **Needs Frontend Integration:**
- Profile UI in main app
- History viewer
- Bookmarks UI
- Leaderboard display
- Achievement notifications
- Level-up animations

---

## 🚀 Testing the System

### Test User Creation:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Test Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"testuser","password":"password123"}'
```

---

## 📞 Support

If you encounter issues:
1. Check database was initialized: `node init-users-db.js`
2. Verify JWT_SECRET is set in `.env`
3. Check browser console for errors
4. Verify token is being sent in Authorization header

---

**Created by: Christian Keth Aguacito** 🚀
