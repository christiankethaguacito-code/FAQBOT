import { categoryOps, questionOps } from './db-new.js';

console.log('📝 Sample Data Importer');
console.log('='.repeat(60));

// Sample categories and questions
const sampleData = [
  {
    category: {
      name: 'SKSU Information',
      icon: '🎓',
      description: 'Learn about Sultan Kudarat State University',
      displayOrder: 1
    },
    questions: [
      {
        question: 'What is SKSU Vision?',
        answer: 'To be a premier university in Mindanao known for academic excellence, innovation, and social responsibility.',
        displayOrder: 1
      },
      {
        question: 'What is SKSU Mission?',
        answer: 'To provide quality and accessible education through relevant instruction, research, extension, and production programs.',
        displayOrder: 2
      },
      {
        question: 'What are the Core Values?',
        answer: 'Integrity, Excellence, Service, and Unity.',
        displayOrder: 3
      }
    ]
  },
  {
    category: {
      name: 'Enrollment',
      icon: '📝',
      description: 'Enrollment procedures and requirements',
      displayOrder: 2
    },
    questions: [
      {
        question: 'How do I enroll?',
        answer: 'You can enroll online through the SKSU portal or visit the Registrar\'s Office during enrollment period.',
        displayOrder: 1
      },
      {
        question: 'What are the requirements for enrollment?',
        answer: 'Requirements include: Form 138, Birth Certificate, Good Moral Certificate, and 2x2 ID pictures.',
        displayOrder: 2
      }
    ]
  },
  {
    category: {
      name: 'SBO Information',
      icon: '👥',
      description: 'About the Student Body Organization',
      displayOrder: 3
    },
    questions: [
      {
        question: 'Who are the SBO Officers?',
        answer: 'The current SBO officers are elected student leaders representing the student body.',
        displayOrder: 1
      },
      {
        question: 'Where is the SBO Office located?',
        answer: 'The SBO Office is located at the Student Center, Main Campus.',
        displayOrder: 2
      }
    ]
  }
];

// Import sample data
console.log('\n📦 Importing sample data...\n');

sampleData.forEach((data, index) => {
  try {
    // Add category
    const catResult = categoryOps.add(
      data.category.name,
      data.category.icon,
      data.category.description,
      data.category.displayOrder
    );
    
    const categoryId = catResult.lastInsertRowid;
    console.log(`✅ Added category: ${data.category.icon} ${data.category.name} (ID: ${categoryId})`);
    
    // Add questions for this category
    data.questions.forEach(q => {
      questionOps.add(categoryId, q.question, q.answer, q.displayOrder);
      console.log(`   ↳ Added question: ${q.question}`);
    });
    
    console.log('');
  } catch (error) {
    console.error(`❌ Error importing ${data.category.name}:`, error.message);
  }
});

console.log('='.repeat(60));
console.log('✅ Sample data import complete!');
console.log('\n📊 Summary:');
console.log(`   Categories: ${categoryOps.getAll().length}`);
console.log(`   Total Questions: ${sampleData.reduce((sum, d) => sum + d.questions.length, 0)}`);
console.log('\n🚀 Start server: node server-new.js');
console.log('🌐 Visit: http://localhost:3000\n');
