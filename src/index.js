import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { findBestAnswer } from './faq.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let faqs = [];
async function loadFAQs() {
  const file = path.join(__dirname, '../faqs.json');
  faqs = JSON.parse(await fs.readFile(file, 'utf8'));
}

await loadFAQs();

app.get('/api/faqs', (req, res) => {
  res.json(faqs);
});

app.post('/api/ask', async (req, res) => {
  const question = (req.body?.question || '').trim();
  if (!question) return res.status(400).json({ error: 'question required' });

  const result = findBestAnswer(question, faqs);
  return res.json({ 
    answer: result.answer || "I'm not sure about that. Please contact us at info@studentorg.edu", 
    source: 'local', 
    score: result.score,
    category: result.faq?.category || 'general'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Student FAQ Bot running at http://localhost:${port}`));
