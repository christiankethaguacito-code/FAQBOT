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
  const answerDiv = $('#answerText');
  answerDiv.textContent = '';
  
  // Typewriter effect for answer
  const answer = data.answer || 'No answer available.';
  let index = 0;
  const typeSpeed = 15;
  
  function typeWriter() {
    if (index < answer.length) {
      answerDiv.textContent += answer.charAt(index);
      index++;
      setTimeout(typeWriter, typeSpeed);
    }
  }
  
  // Start immediately for better UX, or use setTimeout for delay
  typeWriter();
  
  const source = data.source || data.provider || 'local';
  const badge = $('#badge');
  badge.textContent = source;
  
  // Enhanced Tailwind CSS badge classes with icons
  badge.className = 'inline-block px-4 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wide shadow-md ';
  if (source === 'local') {
    badge.className += 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border border-blue-400';
    badge.innerHTML = `<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path></svg> ${source}</span>`;
  } else if (source === 'gemini') {
    badge.className += 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border border-purple-400';
    badge.innerHTML = `<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> ${source}</span>`;
  } else if (source === 'openai') {
    badge.className += 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border border-green-400';
    badge.innerHTML = `<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> ${source}</span>`;
  }
  
  const score = Math.round((data.score || data.localScore || 0) * 100);
  
  // Update confidence bar with animation
  const confidenceText = document.getElementById('confidenceText');
  const confidenceFill = document.getElementById('confidenceFill');
  const categoryEl = document.getElementById('category');
  
  if (confidenceText && confidenceFill) {
    // Animate confidence number
    let currentScore = 0;
    const increment = score / 50; // 50 steps
    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= score) {
        currentScore = score;
        clearInterval(timer);
      }
      confidenceText.textContent = `${Math.round(currentScore)}%`;
    }, 20);
    
    // Animate progress bar
    setTimeout(() => {
      confidenceFill.style.width = `${score}%`;
    }, 100);
  }
  
  if (categoryEl && data.category) {
    categoryEl.innerHTML = `<span class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-primary rounded-full text-sm font-semibold shadow-sm border border-primary/20"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>${data.category}</span>`;
  } else if (categoryEl) {
    categoryEl.textContent = '';
  }
  
  // Show contact CTA if confidence is low
  const cta = $('#contactCta');
  if (score < 40) {
    cta.classList.remove('hidden');
    setTimeout(() => cta.classList.add('animate-scale-in'), 100);
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
  if (!q) {
    // Shake the textarea if empty
    const textarea = $('#question');
    textarea.classList.add('animate-shake', 'border-red-300');
    setTimeout(() => {
      textarea.classList.remove('animate-shake', 'border-red-300');
    }, 500);
    return;
  }
  
  // Disable button and show loading state
  const askBtn = $('#ask');
  const originalContent = askBtn.innerHTML;
  askBtn.disabled = true;
  askBtn.innerHTML = '<span class="relative z-10 flex items-center justify-center gap-2"><div class="loading"></div> Thinking...</span>';
  askBtn.classList.add('opacity-75', 'cursor-not-allowed');
  
  $('#answerText').innerHTML = '<div class="flex items-center gap-3"><div class="loading"></div><span class="text-gray-600">Finding the best answer for you...</span></div>';
  $('#badge').innerHTML = '<span class="flex items-center gap-2"><div class="loading"></div> searching</span>';
  $('#badge').className = 'inline-block px-4 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wide bg-gradient-to-r from-blue-500 to-indigo-600 text-white border border-blue-400 shadow-md';
  $('#result').classList.remove('hidden');
  
  try {
    const data = await ask(q);
    showAnswer(data);
  } catch (e) {
    $('#answerText').innerHTML = `
      <div class="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
        <span class="text-2xl flex-shrink-0">⚠️</span>
        <div class="flex-1">
          <strong class="block text-red-800 mb-1">Error:</strong>
          <p class="text-red-700">${e.message}</p>
        </div>
      </div>
    `;
    $('#meta').innerHTML = '<p class="text-gray-600">Please try again or contact us directly.</p>';
    $('#contactCta').classList.remove('hidden');
  } finally {
    // Re-enable button
    askBtn.disabled = false;
    askBtn.innerHTML = originalContent;
    askBtn.classList.remove('opacity-75', 'cursor-not-allowed');
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
  const textarea = $('#question');
  const result = $('#result');
  
  // Add fade out animation
  result.classList.add('opacity-0', 'scale-95', 'transition-all', 'duration-300');
  setTimeout(() => {
    result.classList.add('hidden');
    result.classList.remove('opacity-0', 'scale-95');
  }, 300);
  
  textarea.value = '';
  textarea.focus();
  
  // Subtle bounce animation on clear
  textarea.classList.add('animate-bounce-subtle');
  setTimeout(() => textarea.classList.remove('animate-bounce-subtle'), 600);
});

// Quick action buttons with ripple effect
$$('.quick-btn-gradient').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const question = btn.dataset.question;
    const textarea = $('#question');
    textarea.value = question;
    
    // Smooth focus with slight delay
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(question.length, question.length);
    }, 100);
    
    // Auto-submit after a brief moment
    setTimeout(handleAsk, 300);
  });
});
