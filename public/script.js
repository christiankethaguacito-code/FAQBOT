const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

let sessionId = localStorage.getItem('sessionId');

async function ask(question) {
  const headers = { 'Content-Type': 'application/json' };
  if (sessionId) headers['X-Session-ID'] = sessionId;
  
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers,
    body: JSON.stringify({ question })
  });
  
  // Save session ID from response
  const newSessionId = res.headers.get('X-Session-ID');
  if (newSessionId) {
    sessionId = newSessionId;
    localStorage.setItem('sessionId', sessionId);
  }
  
  return res.json();
}

function showAnswer(data) {
  $('#answerText').textContent = data.answer || 'No answer available.';
  
  const source = data.source || data.provider || 'local';
  const badge = $('#badge');
  badge.textContent = source;
  
  // Tailwind CSS badge classes
  badge.className = 'inline-block px-4 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wide ';
  if (source === 'local') {
    badge.className += 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 border border-blue-300';
  } else if (source === 'gemini') {
    badge.className += 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 border border-purple-300';
  } else if (source === 'openai') {
    badge.className += 'bg-gradient-to-br from-green-100 to-green-200 text-green-700 border border-green-300';
  }
  
  const score = Math.round((data.score || data.localScore || 0) * 100);
  
  // Update confidence bar
  const confidenceText = document.getElementById('confidenceText');
  const confidenceFill = document.getElementById('confidenceFill');
  const categoryEl = document.getElementById('category');
  
  if (confidenceText) confidenceText.textContent = `${score}%`;
  if (confidenceFill) confidenceFill.style.width = `${score}%`;
  if (categoryEl && data.category) {
    categoryEl.innerHTML = `<span class="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">${data.category}</span>`;
  } else if (categoryEl) {
    categoryEl.textContent = '';
  }
  
  // Show contact CTA if confidence is low
  const cta = $('#contactCta');
  if (score < 40) {
    cta.classList.remove('hidden');
  } else {
    cta.classList.add('hidden');
  }
  
  // Show result with Tailwind classes
  const result = $('#result');
  result.classList.remove('hidden');
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function handleAsk() {
  const q = $('#question').value.trim();
  if (!q) return;
  
  $('#answerText').innerHTML = '<div class="loading"></div> Finding answer...';
  $('#badge').textContent = 'searching';
  $('#badge').className = 'inline-block px-4 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wide bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 border border-blue-300';
  $('#result').classList.remove('hidden');
  
  try {
    const data = await ask(q);
    showAnswer(data);
  } catch (e) {
    $('#answerText').textContent = 'Error: ' + e.message;
    $('#meta').textContent = 'Please try again or contact us directly.';
    $('#contactCta').classList.remove('hidden');
  }
}

document.getElementById('ask').addEventListener('click', handleAsk);

document.getElementById('question').addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleAsk();
  }
});

document.getElementById('clear').addEventListener('click', () => {
  $('#question').value = '';
  $('#result').classList.add('hidden');
});

// Quick action buttons
$$('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const question = btn.dataset.question;
    $('#question').value = question;
    handleAsk();
  });
});
