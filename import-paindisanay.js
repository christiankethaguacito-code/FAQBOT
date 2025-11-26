import { categoryOps, questionOps } from './db.js';
import { readFileSync } from 'fs';

console.log('📚 Importing Paindisanay 2025 FAQ Data...\n');

// Read extra.json
const extraData = readFileSync('./extra.json', 'utf-8');

// Parse Q&A pairs from the plain text format
// Split by the separator lines
const blocks = extraData.split('________________________________________').filter(b => b.trim());
const qaArray = [];

for (const block of blocks) {
  const lines = block.trim().split('\n').filter(l => l.trim());
  
  if (lines.length >= 2) {
    // First line is the question (with number)
    const questionLine = lines[0].replace(/^\d+\.\s*/, '').trim();
    
    // Find "Answer:" and get everything after it
    const answerStartIndex = lines.findIndex(l => l.trim() === 'Answer:');
    if (answerStartIndex !== -1) {
      // Join all lines after "Answer:" as the answer
      const answerLines = lines.slice(answerStartIndex + 1).map(l => l.trim()).filter(l => l);
      const answerText = answerLines.join(' ');
      
      if (questionLine && answerText) {
        qaArray.push({
          question: questionLine,
          answer: answerText
        });
      }
    }
  }
}

console.log(`✅ Parsed ${qaArray.length} Q&A pairs\n`);

// Check if category already exists
const existingCategories = categoryOps.getAll();
let category = existingCategories.find(c => c.name === 'Paindisanay 2025');

if (category) {
  console.log(`📁 Category "Paindisanay 2025" already exists (ID: ${category.id})`);
  console.log(`🗑️  Deleting existing questions in this category...\n`);
  
  // Delete existing questions for this category
  const existingQuestions = questionOps.getByCategoryId(category.id);
  for (const q of existingQuestions) {
    questionOps.delete(q.id);
  }
  console.log(`✅ Deleted ${existingQuestions.length} existing questions\n`);
} else {
  console.log('📁 Adding "Paindisanay 2025" category...');
  const categoryResult = categoryOps.add(
    'Paindisanay 2025',
    '🏆',
    'SKSU Intramurals 2025 - Paindisanay Event Information',
    999 // Display order at the end
  );
  category = { id: categoryResult.lastInsertRowid };
  console.log(`✅ Category created with ID: ${category.id}\n`);
}

const categoryId = category.id;

// Add questions
console.log('💬 Adding questions...');
let count = 0;
for (const qa of qaArray) {
  if (qa.question && qa.answer) {
    questionOps.add(
      categoryId,
      qa.question,
      qa.answer,
      count
    );
    count++;
    console.log(`  ${count}. ${qa.question.substring(0, 50)}...`);
  }
}

console.log(`\n✅ Successfully imported ${count} questions!`);
console.log(`\n🎉 Paindisanay 2025 category is now live in the FAQ bot!`);
