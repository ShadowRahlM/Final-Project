import api from '/services/api.js';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/pages/login.html';
    return;
  }

  // DOM Elements
  const entryList = document.getElementById('entry-list');
  const entryDetail = document.getElementById('entry-detail');
  const entryFormSection = document.getElementById('entry-form-section');
  const errorDiv = document.getElementById('diary-error');
  const newEntryBtn = document.getElementById('new-entry-btn');
  const logoutBtn = document.getElementById('logout-btn');
  
  let currentEntryId = null;

  // Event Listeners
  newEntryBtn.addEventListener('click', showNewEntryForm);
  logoutBtn.addEventListener('click', logout);
  
  // Initial load
  loadEntries();

  async function loadEntries() {
    try {
      entryList.innerHTML = '<div class="loading">Loading entries...</div>';
      const entries = await api.getEntries(token);
      
      if (!entries.length) {
        entryList.innerHTML = '<p class="no-entries">No entries yet. Create your first entry!</p>';
        return;
      }
      
      entryList.innerHTML = entries.map(entry => `
        <div class="entry-preview" data-id="${entry.id}">
          <h3>${entry.title}</h3>
          <small>${new Date(entry.createdAt).toLocaleDateString()}</small>
          <p>${entry.content.substring(0, 100)}...</p>
        </div>
      `).join('');
      
      document.querySelectorAll('.entry-preview').forEach(el => {
        el.addEventListener('click', () => showEntryDetail(el.dataset.id));
      });
      
    } catch (err) {
      showError('Failed to load entries. Please try again.');
      console.error('Load entries error:', err);
    }
  }

  async function showEntryDetail(id) {
    try {
      const entry = await api.getEntry(token, id);
      currentEntryId = id;
      
      document.getElementById('entry-title').textContent = entry.title;
      document.getElementById('entry-content').textContent = entry.content;
      
      entryDetail.classList.remove('hidden');
      entryFormSection.classList.add('hidden');
      entryList.classList.add('hidden');
      
    } catch (err) {
      showError('Failed to load entry. Please try again.');
      console.error('Show entry error:', err);
    }
  }

  function showNewEntryForm() {
    currentEntryId = null;
    document.getElementById('form-title').value = '';
    document.getElementById('form-content').value = '';
    
    entryFormSection.classList.remove('hidden');
    entryDetail.classList.add('hidden');
    entryList.classList.add('hidden');
  }

  document.getElementById('entry-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('form-title').value;
    const content = document.getElementById('form-content').value;
    
    try {
      if (currentEntryId) {
        await api.updateEntry(token, currentEntryId, title, content);
      } else {
        await api.createEntry(token, title, content);
      }
      loadEntries();
    } catch (err) {
      showError('Failed to save entry. Please try again.');
      console.error('Save entry error:', err);
    }
  });

  document.getElementById('edit-btn').addEventListener('click', async () => {
    try {
      const entry = await api.getEntry(token, currentEntryId);
      document.getElementById('form-title').value = entry.title;
      document.getElementById('form-content').value = entry.content;
      
      entryFormSection.classList.remove('hidden');
      entryDetail.classList.add('hidden');
    } catch (err) {
      showError('Failed to edit entry. Please try again.');
      console.error('Edit entry error:', err);
    }
  });

  document.getElementById('delete-btn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.deleteEntry(token, currentEntryId);
        loadEntries();
      } catch (err) {
        showError('Failed to delete entry. Please try again.');
        console.error('Delete entry error:', err);
      }
    }
  });

  document.getElementById('back-btn').addEventListener('click', loadEntries);
  document.getElementById('cancel-btn').addEventListener('click', loadEntries);

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/pages/login.html';
  }

  function showError(message) {
    errorDiv.textContent = message;
    setTimeout(() => errorDiv.textContent = '', 5000);
  }
});