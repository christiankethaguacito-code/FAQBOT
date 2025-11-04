# SKSU SBO FAQ Bot - Admin Panel Guide

## 🔐 Admin Panel Access

**URL:** `http://localhost:3000/admin.html`

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important:** Change these credentials in production by updating the `admin.html` file.

---

## 🎯 Features

### 📊 Dashboard Overview
- **Total Categories** - Shows number of FAQ categories
- **Total Questions** - Shows total questions across all categories  
- **Last Updated** - Displays current date

### 📚 Categories Management

#### View Categories
- See all categories with icon, name, description, and question count
- Sort by display order
- Click on category name to filter questions

#### Add Category
1. Click **"+ Add Category"** button
2. Fill in the form:
   - **Icon** - Emoji (e.g., 🎓📚📝💙⚖️📋)
   - **Category Name** - Descriptive name
   - **Description** - Brief summary
   - **Display Order** - Numeric order (1, 2, 3...)
3. Click **"Save Category"**

#### Edit Category
1. Click the ✏️ (edit) icon next to any category
2. Update the fields
3. Click **"Save Category"**

#### Delete Category
1. Click the 🗑️ (delete) icon
2. Confirm deletion
3. ⚠️ **Warning:** All questions in this category will also be deleted!

---

### ❓ Questions Management

#### View Questions
- See all questions with category, question text, answer preview
- Filter by category using dropdown
- Display order shown

#### Add Question
1. Click **"+ Add Question"** button
2. Fill in the form:
   - **Category** - Select from dropdown
   - **Question** - The question text
   - **Answer** - Complete answer (supports multi-line)
   - **Display Order** - Numeric order within category
3. Click **"Save Question"**

#### Edit Question
1. Click the ✏️ (edit) icon next to any question
2. Update the fields
3. Click **"Save Question"**

#### Delete Question
1. Click the 🗑️ (delete) icon
2. Confirm deletion

---

## 💡 Best Practices

### Category Organization
- **Use clear, descriptive names** - "Academic Policies - General" not "Policies"
- **Choose appropriate emojis** - Use relevant icons (🎓 for education, 📝 for forms)
- **Set logical display order** - Most important categories first
- **Keep descriptions concise** - One sentence summary

### Question Writing
- **Be specific** - "What is the late registration policy?" not "What about registration?"
- **Complete answers** - Provide full, quoted text from official sources
- **Consistent formatting** - Use line breaks for lists, preserve quotation marks
- **Proper ordering** - Arrange from general to specific

### Display Order Tips
```
Categories:
1. University Profile & Identity (most general)
2. Academic Policies - General
3. Academic Policies - Attendance & Exams
4. Graduation & Honors
5. Student Services & Welfare
6. Student Conduct & Discipline
7. Administrative Rules

Questions (within each category):
1. Most frequently asked
2. Most important/fundamental
3. Specific details
```

---

## 🔧 Technical Details

### API Endpoints Used

**Categories:**
- `GET /api/categories` - List all
- `POST /api/admin/categories` - Create
- `PUT /api/admin/categories/:id` - Update
- `DELETE /api/admin/categories/:id` - Delete

**Questions:**
- `GET /api/admin/questions` - List all with category info
- `GET /api/categories/:id/questions` - List by category
- `GET /api/questions/:id` - Get single question
- `POST /api/admin/questions` - Create
- `PUT /api/admin/questions/:id` - Update
- `DELETE /api/admin/questions/:id` - Delete

### Database Schema

**Categories Table:**
```sql
id INTEGER PRIMARY KEY
name TEXT NOT NULL
icon TEXT
description TEXT
display_order INTEGER
created_at DATETIME
```

**Questions Table:**
```sql
id INTEGER PRIMARY KEY
category_id INTEGER (FOREIGN KEY)
question TEXT NOT NULL
answer TEXT NOT NULL
display_order INTEGER
created_at DATETIME
```

---

## 🚀 Workflow Example

### Adding New SKSU Policy Category

1. **Login** to admin panel
2. **Navigate** to Categories tab
3. **Click** "+ Add Category"
4. **Fill in:**
   - Icon: 📋
   - Name: "Financial Assistance"
   - Description: "Scholarship and financial aid information"
   - Display Order: 8
5. **Save** category
6. **Switch** to Questions tab
7. **Click** "+ Add Question"
8. **Select** "Financial Assistance" category
9. **Add questions** about scholarships, grants, etc.

---

## 🔒 Security Notes

### Current Implementation
- **Simple authentication** - Username/password check in JavaScript
- **Session storage** - Logged in state stored in browser
- **No backend auth** - Suitable for local/internal use only

### For Production Deployment
⚠️ **This admin panel should NOT be exposed publicly without proper authentication!**

**Recommended security measures:**
1. Implement proper backend authentication (JWT, sessions)
2. Add role-based access control
3. Use environment variables for credentials
4. Enable HTTPS
5. Add rate limiting
6. Implement audit logging
7. Consider IP whitelisting

---

## 📱 Mobile Responsive
The admin panel is fully responsive and works on:
- 💻 Desktop computers
- 📱 Tablets
- 📲 Mobile phones

---

## 🎨 UI Features

- **Clean modern design** - Purple gradient theme
- **Smooth animations** - Modal fade-in effects
- **Intuitive icons** - SVG icons for all actions
- **Real-time updates** - Tables refresh after changes
- **Inline editing** - Quick access to edit functions
- **Confirmation dialogs** - Prevent accidental deletions

---

## 🐛 Troubleshooting

**Can't login?**
- Check default credentials: admin/admin123
- Clear browser cache/cookies
- Check browser console for errors

**Changes not showing?**
- Refresh the page
- Check if category dropdown is filtered
- Verify database is writable

**Questions not appearing?**
- Ensure category is selected
- Check display order values
- Verify category_id is valid

**Server errors?**
- Check terminal for error messages
- Ensure server.js is running
- Verify database file exists (sbo-faq.db)

---

## 📞 Support

For issues or questions about the admin panel:
1. Check this guide first
2. Review console logs (F12 in browser)
3. Check server terminal output
4. Verify database integrity

---

**Last Updated:** November 4, 2025
**Version:** 2.0.0
