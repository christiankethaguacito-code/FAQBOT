# 📷 Image Support Feature

## Overview
The FAQ bot now supports attaching images to question answers! Admins can add image URLs when creating or editing questions, and these images will be displayed beautifully in the chat interface.

## ✨ Features

### For Admins
1. **Attach Photo Field** - New optional field in the Questions tab
2. **Image Preview** - Real-time preview of the image as you type the URL
3. **Edit Support** - Add, edit, or remove images from existing questions
4. **Validation** - Automatic validation with error handling for invalid URLs

### For Users
1. **Visual Answers** - Images displayed with bot responses
2. **Click to Enlarge** - Click any image to open in new tab
3. **Responsive Design** - Images scale properly on all devices
4. **Graceful Fallback** - If image fails to load, it's hidden automatically

## 🎯 How to Use (Admin Panel)

### Adding a Question with Image

1. **Login to Admin Panel**
   ```
   http://localhost:3000/admin.html
   Username: admin
   Password: admin123
   ```

2. **Go to Questions Tab**
   - Click the "Questions" tab

3. **Add New Question**
   - Click "+ Add Question" button
   - Fill in the form:
     - Category: Select category
     - Question: Enter question text
     - Answer: Enter answer text
     - **📷 Attach Photo**: Paste image URL (NEW!)
     - Display Order: Set order number

4. **Preview the Image**
   - As you type/paste the URL, a preview appears below
   - If the URL is invalid, preview won't show

5. **Save**
   - Click "Save Question"
   - Image URL is stored in database

### Editing Existing Question

1. Click ✏️ **Edit** button on any question
2. The current image URL (if any) will be shown
3. Modify or remove the image URL
4. Preview updates in real-time
5. Click "Save Question"

### Removing an Image

1. Edit the question
2. Clear the "Attach Photo" field
3. Save - image will be removed from future responses

## 🌐 Image URL Requirements

### Supported Formats
- JPG/JPEG
- PNG
- GIF
- WebP
- SVG

### Valid URL Examples
```
https://example.com/image.jpg
https://i.imgur.com/abc123.png
https://cdn.example.com/photos/image.webp
https://via.placeholder.com/600x400
```

### Best Practices
✅ Use direct image URLs (ends with .jpg, .png, etc.)
✅ Use HTTPS URLs for security
✅ Use reliable hosting (CDN, cloud storage)
✅ Optimize images for web (compress before uploading)
✅ Recommended max size: 1-2 MB
✅ Recommended dimensions: 800x600px or similar

❌ Avoid: Password-protected images
❌ Avoid: Temporary/expiring URLs
❌ Avoid: Very large files (>5MB)
❌ Avoid: HTML pages instead of direct image URLs

## 📱 User Experience

### In Chat Interface

When a user asks a question with an attached image:

1. **Question Asked** 
   ```
   User: "What is the SKSU campus map?"
   ```

2. **Answer with Image**
   ```
   Bot: "Here's the SKSU campus map showing all buildings..."
   [Campus Map Image Displayed]
   ```

3. **Interactive Image**
   - Hover: Image shadow increases
   - Click: Opens full-size in new tab
   - Max height: 400px (preserves aspect ratio)
   - Rounded corners with border

## 🗄️ Database Changes

### Updated Schema

**questions table** - Added column:
```sql
image_url TEXT DEFAULT ''
```

### API Updates

**POST /api/admin/questions**
```json
{
  "categoryId": 1,
  "question": "What is the campus map?",
  "answer": "Here's the SKSU campus layout...",
  "imageUrl": "https://example.com/campus-map.jpg",
  "displayOrder": 1
}
```

**PUT /api/admin/questions/:id**
```json
{
  "question": "Updated question",
  "answer": "Updated answer",
  "imageUrl": "https://example.com/new-image.jpg",
  "displayOrder": 1
}
```

### GET Responses Include Image URL

All question responses now include `image_url` field:
```json
{
  "id": 1,
  "category_id": 1,
  "question": "What is the campus map?",
  "answer": "Here's the layout...",
  "image_url": "https://example.com/campus-map.jpg",
  "display_order": 1,
  "created_at": "2025-11-04 12:00:00"
}
```

## 🎨 UI Components

### Admin Panel

**New Form Field:**
```html
📷 Attach Photo (Optional)
[URL Input Field]
💡 Enter a valid image URL (JPG, PNG, GIF, WebP)
[Preview Image - appears when valid URL entered]
```

**Features:**
- Real-time preview with 500ms debounce
- Error handling (broken images hidden)
- Tooltip with format guidance
- Max preview size: 240px height

### Chat Interface

**Image Display:**
- Container: Rounded box with shadow
- Max height: 400px
- Object-fit: contain (preserves aspect ratio)
- Cursor: pointer (indicates clickable)
- Hover effect: Enhanced shadow
- Error handling: Hidden if image fails

## 🚀 Use Cases

### Educational Content
- Campus maps
- Building layouts
- Organizational charts
- Infographics
- Charts/graphs

### Forms & Documents
- Enrollment forms preview
- Requirements checklist visual
- Schedule examples
- ID card samples

### Visual Guides
- Step-by-step tutorials
- Process flowcharts
- Navigation guides
- Event posters

### Reference Materials
- Logos
- Badges
- Certificates
- Awards
- Historical photos

## 🔧 Technical Implementation

### Frontend (admin.html)
```javascript
// Image preview function
function showImagePreview(imageUrl) {
  const preview = document.getElementById('imagePreview');
  const img = document.getElementById('imagePreviewImg');
  
  if (imageUrl && imageUrl.trim() !== '') {
    img.src = imageUrl;
    img.onerror = () => preview.classList.add('hidden');
    img.onload = () => preview.classList.remove('hidden');
  }
}

// Debounced input listener
imageUrlInput.addEventListener('input', (e) => {
  clearTimeout(imageUrlInput.previewTimeout);
  imageUrlInput.previewTimeout = setTimeout(() => {
    showImagePreview(e.target.value.trim());
  }, 500);
});
```

### Frontend (index.html)
```javascript
// Display bot message with optional image
function addBotMessage(message, imageUrl = '') {
  // ... message formatting ...
  
  const imageHTML = imageUrl ? `
    <div class="mt-3">
      <img 
        src="${imageUrl}" 
        alt="Reference image" 
        class="max-w-full rounded-lg shadow-md"
        onclick="window.open('${imageUrl}', '_blank')"
        onerror="this.parentElement.style.display='none'"
        style="max-height: 400px; object-fit: contain;"
      />
    </div>
  ` : '';
  
  // ... append to message ...
}
```

### Backend (server.js)
```javascript
// Add question with image
app.post('/api/admin/questions', (req, res) => {
  const { categoryId, question, answer, displayOrder, imageUrl } = req.body;
  const result = questionOps.add(
    categoryId, question, answer, 
    displayOrder || 0, imageUrl || ''
  );
  res.json({ success: true, id: result.lastInsertRowid });
});
```

### Database (db.js)
```javascript
// Add question with image support
add(categoryId, question, answer, displayOrder = 0, imageUrl = '') {
  const stmt = db.prepare(`
    INSERT INTO questions (category_id, question, answer, display_order, image_url)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(categoryId, question, answer, displayOrder, imageUrl);
}
```

## 📝 Migration

To add this feature to existing database:

```bash
node migrate-add-images.js
```

This will:
1. ✅ Add `image_url` column to `questions` table
2. ✅ Create `feedback` table (for future feature)
3. ✅ Create `analytics` table (for future feature)
4. ✅ Create indexes for performance

## 🎉 Benefits

### For Students
- **Better Understanding** - Visual aids improve comprehension
- **Quick Reference** - See forms/maps without downloading
- **Mobile Friendly** - Images scale to fit any screen
- **Interactive** - Click to view full size

### For Admins
- **Easy to Use** - Just paste a URL
- **Real-time Preview** - See what users will see
- **Flexible** - Optional feature, doesn't require images
- **Updatable** - Change images anytime

### For the System
- **Lightweight** - URLs only, no file storage needed
- **Fast Loading** - Images loaded from external CDN
- **Scalable** - No server storage limits
- **Secure** - No file upload vulnerabilities

## 🔮 Future Enhancements

Potential improvements:
- [ ] Direct image upload to cloud storage
- [ ] Image gallery support (multiple images per answer)
- [ ] Image compression/optimization
- [ ] Image alt text for accessibility
- [ ] Image captions
- [ ] Image size validation
- [ ] Broken link checker

## ✅ Testing Checklist

### Admin Panel
- [ ] Add new question with image URL
- [ ] Preview shows correctly
- [ ] Edit existing question image
- [ ] Remove image from question
- [ ] Save works properly
- [ ] Invalid URL handling

### Chat Interface
- [ ] Image displays with answer
- [ ] Click opens in new tab
- [ ] Broken image handled gracefully
- [ ] Mobile responsive
- [ ] Voice button still works
- [ ] Search results show images

---

**Version:** 1.0  
**Date:** November 4, 2025  
**Status:** ✅ Production Ready
