import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/ask', (req, res) => {
  console.log('Request received:', req.body);
  res.json({ answer: 'Test response', source: 'test' });
});

app.listen(3000, () => {
  console.log('Test server running on http://localhost:3000');
});
