# 🎉 SKSU SBO FAQ Bot - Complete System

## 🌐 Access URLs

| Interface | URL | Purpose |
|-----------|-----|---------|
| **Chat Bot** | http://localhost:3000 | Main conversational interface for students |
| **Admin Panel** | http://localhost:3000/admin.html | Manage categories and questions |

---

## 🔐 Admin Login

**Username:** `admin`  
**Password:** `admin123`

⚠️ Change these in `public/admin.html` for production use!

---

## ✨ What's Included

### 1. 💬 Chat Interface (`index.html`)
- **Conversational UI** - WhatsApp/Messenger-style chat
- **Welcome Screen** - Bot greets with category chips
- **Smart Navigation** - Category → Questions → Answer flow
- **Search Capability** - Type any question naturally
- **Typing Indicators** - Animated "bot is thinking" effect
- **Follow-up Options** - "Start Over" and "Browse Topics" buttons
- **Mobile Responsive** - Works on all screen sizes

### 2. 🔧 Admin Panel (`admin.html`)
- **Login Screen** - Secure access with credentials
- **Dashboard Stats** - Total categories, questions, last updated
- **Categories Tab**:
  - View all categories in table
  - Add new category with icon, name, description, order
  - Edit existing categories
  - Delete categories (with cascade delete of questions)
  - See question count per category
- **Questions Tab**:
  - View all questions with category badges
  - Filter by category
  - Add new questions
  - Edit existing questions
  - Delete questions
  - Answer preview in table

### 3. 💾 Database (`sbo-faq.db`)
- **107 Questions** across 7 categories
- **Categories**: University Profile, Academic Policies (2 parts), Graduation, Student Services, Conduct, Admin Rules
- **SQLite** - Simple, file-based, no setup needed

### 4. 🔌 API Server (`server.js`)
**Public Endpoints:**
- `GET /api/categories` - List all categories
- `GET /api/categories/:id/questions` - Questions for category
- `GET /api/questions/:id` - Single question
- `POST /api/search` - Search questions

**Admin Endpoints:**
- `GET /api/admin/questions` - All questions with category info
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `POST /api/admin/questions` - Create question
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question

---

## 📊 Current Data

### Categories (7):
1. 🎓 **University Profile & Identity** (10 questions)
   - Vision, Mission, Core Values, Seal, Logo, Mascot, Colors, PRIZE

2. 📚 **Academic Policies - General** (20 questions)
   - Academic year, classes, admission, enrollment, registration

3. 📝 **Academic Policies - Attendance & Exams** (13 questions)
   - Attendance rules, examinations, grading system

4. 🎓 **Graduation & Honors** (8 questions)
   - Requirements, Latin honors, thesis, internship

5. 💙 **Student Services & Welfare** (18 questions)
   - Guidance, health, library, scholarships, organizations

6. ⚖️ **Student Conduct & Discipline** (20 questions)
   - Code of conduct, rights, offenses, procedures

7. 📋 **Administrative Rules** (18 questions)
   - Transfer credentials, clearance, field trips, records

**Total: 107 Questions**

---

## 🚀 How to Use

### Starting the Server
```bash
npm start
# or
node server.js
```

### Accessing the Chat
1. Open browser to http://localhost:3000
2. Chat bot greets you
3. Click a category chip (e.g., "🎓 University Profile & Identity")
4. Bot shows list of questions
5. Click a question to see the answer
6. Or type your own question in the input box

### Managing Content (Admin)
1. Open http://localhost:3000/admin.html
2. Login with admin/admin123
3. **Categories Tab**:
   - Click "+ Add Category" to create new
   - Click ✏️ icon to edit
   - Click 🗑️ icon to delete
4. **Questions Tab**:
   - Select category filter (optional)
   - Click "+ Add Question" to create new
   - Click ✏️ icon to edit
   - Click 🗑️ icon to delete

---

## 📁 File Structure

```
FAQbot/
├── public/
│   ├── index.html          # Main chat interface
│   └── admin.html          # Admin panel
├── server.js               # Express server with API
├── db.js                   # Database operations
├── sbo-faq.db             # SQLite database
├── import-sksu-data.js    # Data import script
├── package.json           # Dependencies
├── README.md              # Main documentation
├── ADMIN-PANEL-GUIDE.md   # Admin guide
└── QUICK-REFERENCE.md     # This file
```

---

## 🎨 UI Features

### Chat Interface:
- Purple gradient header
- White/purple message bubbles
- Smooth animations
- Category chip buttons
- Question card buttons
- Typing indicator with animated dots
- Auto-scroll to latest message
- Reset chat button

### Admin Panel:
- Login screen with credentials
- Dashboard with stats cards
- Tabbed interface (Categories / Questions)
- Data tables with hover effects
- Modal forms for add/edit
- Inline action buttons (edit/delete)
- Responsive grid layout

---

## 🔄 Workflow Examples

### Student Using Chat:
1. Opens http://localhost:3000
2. Sees welcome: "Hi! 👋 I'm your SKSU SBO assistant"
3. Clicks "📚 Academic Policies - General"
4. Bot responds with list of questions
5. Clicks "What is the grading system?"
6. Bot shows complete grading table
7. Clicks "Start Over" or types another question

### Admin Adding Content:
1. Opens http://localhost:3000/admin.html
2. Logs in
3. Goes to Categories tab
4. Clicks "+ Add Category"
5. Fills: Icon=💰, Name="Financial Aid", Description="Scholarships and grants"
6. Saves category
7. Goes to Questions tab
8. Clicks "+ Add Question"
9. Selects "Financial Aid" category
10. Enters question and answer
11. Saves question
12. Opens main site to verify - appears immediately!

---

## 🔒 Security Notes

**Current Setup:**
- ✅ Simple username/password authentication
- ✅ Session-based login (browser storage)
- ⚠️ **NOT suitable for public internet**

**For Production:**
- Implement backend authentication (JWT/sessions)
- Add HTTPS
- Use environment variables for credentials
- Add rate limiting
- Implement audit logging
- Consider IP whitelisting

---

## 💡 Tips

### Best Practices:
1. **Categories** - Keep to 5-10 for easy navigation
2. **Questions** - Write clearly, use exact wording from manuals
3. **Answers** - Include full, accurate information with quotes
4. **Order** - Number logically (most important first)
5. **Icons** - Use relevant emojis consistently

### Common Emojis:
- 🎓 Education/University
- 📚 General Academics
- 📝 Enrollment/Forms
- 💙 Services/Welfare
- ⚖️ Rules/Discipline
- 📋 Administration
- 💰 Financial
- 🏆 Awards/Honors

---

## 🐛 Troubleshooting

**Server won't start?**
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000
# Kill process or use different port
```

**Admin panel not loading?**
- Verify server is running
- Check http://localhost:3000/admin.html (not /admin)
- Clear browser cache

**Can't login?**
- Username: `admin` (lowercase)
- Password: `admin123`
- Check browser console for errors

**Changes not appearing?**
- Hard refresh browser (Ctrl+F5)
- Check admin panel saved successfully
- Verify correct category selected

---

## 📞 Quick Commands

```bash
# Start server
npm start

# Import SKSU data (resets database)
node import-sksu-data.js

# Initialize empty database
node init-db.js

# Install dependencies
npm install
```

---

## ✅ Success Checklist

- [x] Server running at http://localhost:3000
- [x] Chat interface loads and shows categories
- [x] Admin panel accessible at /admin.html
- [x] Can login with admin/admin123
- [x] 7 categories with 107 questions loaded
- [x] Can add/edit/delete categories
- [x] Can add/edit/delete questions
- [x] Changes reflect immediately on main site
- [x] Search functionality works
- [x] Mobile responsive design

---

**System Ready! 🎉**

You now have a fully functional FAQ chat bot with admin panel for managing SKSU Student Manual content!
