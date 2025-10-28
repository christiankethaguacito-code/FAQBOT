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
  badge.className = `badge badge-${source}`;
  
  const score = Math.round((data.score || data.localScore || 0) * 100);
  
  // Update confidence bar
  const confidenceText = document.getElementById('confidenceText');
  const confidenceFill = document.getElementById('confidenceFill');
  const categoryEl = document.getElementById('category');
  
  if (confidenceText) confidenceText.textContent = `${score}%`;
  if (confidenceFill) confidenceFill.style.width = `${score}%`;
  if (categoryEl && data.category) {
    categoryEl.innerHTML = `<span class="tag">${data.category}</span>`;
  } else if (categoryEl) {
    categoryEl.textContent = '';
  }
  
  // Show contact CTA if confidence is low
  const cta = $('#contactCta');
  if (score < 40) {
    cta.style.display = 'block';
  } else {
    cta.style.display = 'none';
  }
  
  $('#result').style.display = 'block';
  $('#result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function handleAsk() {
  const q = $('#question').value.trim();
  if (!q) return;
  
  $('#answerText').innerHTML = '<div class="loading"></div> Finding answer...';
  $('#badge').textContent = 'searching';
  $('#badge').className = 'badge badge-local';
  $('#result').style.display = 'block';
  
  try {
    const data = await ask(q);
    showAnswer(data);
  } catch (e) {
    $('#answerText').textContent = 'Error: ' + e.message;
    $('#meta').textContent = 'Please try again or contact us directly.';
    $('#contactCta').style.display = 'block';
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
  $('#result').style.display = 'none';
});

// Quick action buttons
$$('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const question = btn.dataset.question;
    $('#question').value = question;
    handleAsk();
  });
});
