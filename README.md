# 🎓 SKSU SBO FAQ Bot - Conversational Chat System

A modern, conversational chat interface for Sultan Kudarat State University Student Body Organization with full admin panel.

## ✨ Features

- **� Chat Interface** - WhatsApp/Messenger-style conversational UI
- **🤖 Smart Assistant** - Interactive bot that guides users through topics
- **📂 Category Navigation** - Organized by topics with emoji icons
- **🔍 Smart Search** - Find answers by typing naturally
- **🎨 Beautiful UI** - Modern, responsive design with smooth animations
- **⚡ Fast Responses** - Instant answers from SQLite database
- **� Admin Panel** - Full CRUD interface to manage categories and questions
- **📱 Mobile Friendly** - Works perfectly on all devices

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Server**:
   ```bash
   npm start
   ```

3. **Access the App**:
   - **Chat Interface**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin.html

## 🔐 Admin Panel

**URL:** http://localhost:3000/admin.html

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

### Admin Features:
- ✅ **Dashboard** - View statistics (categories, questions, last updated)
- ✅ **Category Management** - Add, edit, delete categories
- ✅ **Question Management** - Add, edit, delete questions
- ✅ **Search & Filter** - Filter questions by category
- ✅ **Live Preview** - See changes immediately on main site

**Full Admin Guide:** See [ADMIN-PANEL-GUIDE.md](ADMIN-PANEL-GUIDE.md)

## 📝 How to Add Your Own Data

### Method 1: Using the Admin Panel (Recommended)

1. Open http://localhost:3000/admin.html
2. Login with credentials
3. Use the Categories and Questions tabs to add content
4. Changes appear immediately on the main site

### Method 2: Using Import Script

1. Open `add-my-data.js`
2. Add your categories and questions in the `yourData` array
3. Run: `node add-my-data.js`

Example:
```javascript
const yourData = [
  {
    category: {
      name: 'Scholarships',
      icon: '💰',
      description: 'Financial aid and scholarships',
      displayOrder: 4
    },
    questions: [
      {
        question: 'What scholarships are available?',
        answer: 'SKSU offers various scholarships including academic excellence, sports, and need-based scholarships.',
        displayOrder: 1
      }
    ]
  }
];
```

### Method 2: Using API Endpoints

**Add Category:**
```bash
POST http://localhost:3000/api/admin/categories
{
  "name": "Category Name",
  "icon": "🎯",
  "description": "Category description",
  "displayOrder": 1
}
```

**Add Question:**
```bash
POST http://localhost:3000/api/admin/questions
{
  "categoryId": 1,
  "question": "Your question?",
  "answer": "Your answer here.",
  "displayOrder": 1
}
```

## 📊 Database Structure

### Categories Table
- `id` - Unique identifier
- `name` - Category name
- `icon` - Emoji icon
- `description` - Short description
- `display_order` - Order of appearance
- `created_at` - Timestamp

### Questions Table
- `id` - Unique identifier
- `category_id` - Foreign key to categories
- `question` - The question text
- `answer` - The answer text
- `display_order` - Order within category
- `created_at` - Timestamp

## 🗂️ File Structure

```
FAQbot/
├── server-new.js          # Clean server (USE THIS)
├── db-new.js              # Database operations
├── init-db.js             # Database initialization
├── add-my-data.js         # Data manager (EDIT THIS to add data)
├── import-sample-data.js  # Sample data importer
├── sbo-faq.db             # SQLite database
├── public/
│   └── index-new-clean.html   # Clean UI (USE THIS)
└── package.json
```

## 🎯 Current Sample Data

✅ **3 Categories:**
1. 🎓 SKSU Information (3 questions)
2. 📝 Enrollment (2 questions)
3. 👥 SBO Information (2 questions)

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id/questions` - Get questions for category
- `GET /api/questions/:id` - Get specific question
- `POST /api/search` - Search questions

### Admin Endpoints
- `POST /api/admin/categories` - Add category
- `POST /api/admin/questions` - Add question
- `PUT /api/admin/categories/:id` - Update category
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/categories/:id` - Delete category
- `DELETE /api/admin/questions/:id` - Delete question

## 🎨 Customization

### Change Colors
Edit `public/index-new-clean.html`:
- Gradient: `.gradient-bg` class
- Button colors: `.question-btn` class
- Background: `body` class

### Add More Categories
Use `add-my-data.js` as described above.

### Modify UI
Edit `public/index-new-clean.html` - well-commented and easy to understand.

## 🔊 Voice Feature (Coming Soon)

The UI has a placeholder for voice features. The button is visible but not yet functional.

## 📞 Support

For issues or questions:
1. Check the database: `sbo-faq.db`
2. Review server logs
3. Ensure all dependencies are installed

## 🎉 What's Different from Old Version?

✅ **Removed:**
- Complex AI features (Groq integration)
- Self-learning system
- Multiple databases
- Complicated scoring algorithms
- 50+ test files
- Unnecessary documentation files

✅ **Added:**
- Clean category-based navigation
- Simple, fast SQLite operations
- Easy-to-use data manager
- Beautiful, modern UI
- Clear, organized code structure

## 🚀 Next Steps

1. **Add your real data** using `add-my-data.js`
2. **Test the system** with students
3. **Implement voice features** when ready
4. **Deploy to production**

---

Made with ❤️ for SKSU SBO
