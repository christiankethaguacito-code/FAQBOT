console.log('🔵 admin-new.js file is executing!');

let currentFaqs = [];

// Load analytics
async function loadAnalytics() {
  try {
    console.log('📊 Loading analytics...');
    const res = await fetch('/api/admin/analytics');
    console.log('Response status:', res.status);
    const data = await res.json();
    console.log('Analytics data received:', data);
    
    document.getElementById('total-queries').textContent = data.stats.total_queries || 0;
    document.getElementById('unique-users').textContent = data.stats.unique_users || 0;
    document.getElementById('avg-score').textContent = ((data.stats.avg_score || 0) * 100).toFixed(0) + '%';
    document.getElementById('low-conf').textContent = data.stats.low_confidence_queries || 0;
  
    const topQuestionsBody = document.querySelector('#top-questions-table tbody');
    topQuestionsBody.innerHTML = data.topQuestions.map(q => `
      <tr>
        <td>${q.question}</td>
        <td><strong>${q.count}</strong></td>
      </tr>
    `).join('');
    
    const faqUsageBody = document.querySelector('#faq-usage-table tbody');
    faqUsageBody.innerHTML = data.faqUsage.map(f => `
      <tr>
        <td><span class="tag">${f.category || 'General'}</span></td>
        <td>${f.question}</td>
        <td><strong>${f.times_matched}</strong></td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('❌ Error loading analytics:', error);
  }
}

// Load FAQs
async function loadFAQs() {
  try {
    console.log('📝 Loading FAQs...');
    const res = await fetch('/api/admin/faqs');
    console.log('FAQs response status:', res.status);
    currentFaqs = await res.json();
    console.log('FAQs loaded:', currentFaqs.length);
    
    const tbody = document.querySelector('#faqs-table tbody');
    tbody.innerHTML = currentFaqs.map(faq => `
      <tr>
        <td><span class="tag">${faq.category || 'General'}</span></td>
        <td>${faq.question}</td>
        <td>${faq.keywords.map(k => `<span class="tag">${k}</span>`).join(' ')}</td>
        <td>
          <button class="btn btn-primary btn-small" onclick="editFAQ(${faq.id})">Edit</button>
          <button class="btn btn-danger btn-small" onclick="deleteFAQ(${faq.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('❌ Error loading FAQs:', error);
  }
}

// Modal functions (make them global so HTML onclick can access them)
window.showAddModal = function() {
  document.getElementById('modal-title').textContent = 'Add New FAQ';
  document.getElementById('faq-form').reset();
  document.getElementById('faq-id').value = '';
  document.getElementById('faq-modal').classList.add('active');
}

window.editFAQ = function(id) {
  const faq = currentFaqs.find(f => f.id === id);
  if (!faq) return;
  
  document.getElementById('modal-title').textContent = 'Edit FAQ';
  document.getElementById('faq-id').value = faq.id;
  document.getElementById('category').value = faq.category;
  document.getElementById('question').value = faq.question;
  document.getElementById('answer').value = faq.answer;
  document.getElementById('keywords').value = faq.keywords.join(', ');
  document.getElementById('faq-modal').classList.add('active');
}

window.closeModal = function() {
  document.getElementById('faq-modal').classList.remove('active');
}

window.deleteFAQ = async function(id) {
  if (!confirm('Are you sure you want to delete this FAQ?')) return;
  
  await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
  loadFAQs();
  loadAnalytics();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Admin panel initializing...');

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('Tab clicked:', btn.dataset.tab);
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // Form submit
  document.getElementById('faq-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('faq-id').value;
    const data = {
      category: document.getElementById('category').value,
      question: document.getElementById('question').value,
      answer: document.getElementById('answer').value,
      keywords: document.getElementById('keywords').value.split(',').map(k => k.trim()).filter(Boolean)
    };
    
    if (id) {
      await fetch(`/api/admin/faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    
    closeModal();
    loadFAQs();
    loadAnalytics();
  });

  // Close modal on background click
  document.getElementById('faq-modal').addEventListener('click', (e) => {
    if (e.target.id === 'faq-modal') closeModal();
  });

  // Initial load
  console.log('📊 Loading initial data...');
  loadAnalytics();
  loadFAQs();

  // Auto-refresh analytics every 30 seconds
  setInterval(loadAnalytics, 30000);
  
  console.log('✅ Admin panel ready!');
});
