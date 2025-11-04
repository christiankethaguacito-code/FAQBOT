import { categoryOps, questionOps } from './db-new.js';

console.log('\n🎯 FAQ Data Manager');
console.log('='.repeat(60));
console.log('Use this template to add your categories and questions\n');

// ==================== ADD YOUR DATA HERE ====================

const yourData = [
  {
    category: {
      name: 'Academic Programs',        // Category name
      icon: '📚',                        // Emoji icon
      description: 'Programs offered',  // Short description
      displayOrder: 4                    // Order (1, 2, 3...)
    },
    questions: [
      {
        question: 'What programs does SKSU offer?',
        answer: 'SKSU offers various undergraduate and graduate programs in Education, Engineering, Business, Agriculture, and more.',
        displayOrder: 1
      },
      // Add more questions here...
    ]
  },
  // Add more categories here...
];

// ==================== IMPORT FUNCTION ====================

function importData(data) {
  console.log('📦 Importing your data...\n');
  
  let totalCategories = 0;
  let totalQuestions = 0;
  
  data.forEach((item) => {
    try {
      // Add category
      const catResult = categoryOps.add(
        item.category.name,
        item.category.icon,
        item.category.description,
        item.category.displayOrder
      );
      
      const categoryId = catResult.lastInsertRowid;
      totalCategories++;
      console.log(`✅ Category: ${item.category.icon} ${item.category.name} (ID: ${categoryId})`);
      
      // Add questions
      item.questions.forEach(q => {
        questionOps.add(categoryId, q.question, q.answer, q.displayOrder);
        totalQuestions++;
        console.log(`   ↳ ${q.question}`);
      });
      
      console.log('');
    } catch (error) {
      console.error(`❌ Error: ${error.message}\n`);
    }
  });
  
  console.log('='.repeat(60));
  console.log(`✅ Import complete!`);
  console.log(`   Categories added: ${totalCategories}`);
  console.log(`   Questions added: ${totalQuestions}\n`);
}

// ==================== RUN IMPORT ====================

if (yourData && yourData.length > 0) {
  importData(yourData);
} else {
  console.log('⚠️  No data to import. Add your categories and questions above.\n');
}

// ==================== USAGE EXAMPLES ====================

console.log('📖 USAGE GUIDE');
console.log('='.repeat(60));
console.log(`
1. EDIT THIS FILE (add-my-data.js)
   - Add your categories and questions in the 'yourData' array above
   - Use the template format shown

2. SAVE THE FILE

3. RUN THIS COMMAND:
   node add-my-data.js

4. YOUR DATA WILL BE ADDED TO THE DATABASE!

EXAMPLE FORMAT:
{
  category: {
    name: 'Your Category Name',
    icon: '🎯',  // Any emoji
    description: 'Brief description',
    displayOrder: 5  // Unique number
  },
  questions: [
    {
      question: 'Your question here?',
      answer: 'Your detailed answer here.',
      displayOrder: 1
    }
  ]
}

TIPS:
- Use unique display_order numbers for categories (1, 2, 3, 4...)
- Questions within a category can share the same display_order system
- Keep questions clear and concise
- Provide complete, helpful answers
- Use emojis for visual appeal

COMMON EMOJIS:
🎓 Education    📝 Enrollment    👥 People       📚 Books
💰 Money        📍 Location      ⭐ Important    🏆 Achievement
📞 Contact      ⏰ Time          🔒 Security     ✅ Success
`);
