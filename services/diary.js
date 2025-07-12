import api from '/services/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Verify token first
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/pages/login.html';
    return;
  }

  console.log('Token found, initializing diary...'); // Debug log

  // DOM Elements
  const elements = {
    entryList: document.getElementById('entry-list'),
    entryDetail: document.getElementById('entry-detail'),
    entryForm: document.getElementById('entry-form'),
    entryFormSection: document.getElementById('entry-form-section'),
    errorDiv: document.getElementById('diary-error'),
    newEntryBtn: document.getElementById('new-entry-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    formTitle: document.getElementById('form-title'),
    formContent: document.getElementById('form-content'),
    entryTitle: document.getElementById('entry-title'),
    entryContent: document.getElementById('entry-content'),
    editBtn: document.getElementById('edit-btn'),
    deleteBtn: document.getElementById('delete-btn'),
    backBtn: document.getElementById('back-btn'),
    cancelBtn: document.getElementById('cancel-btn'),
    saveBtn: document.getElementById('save-btn')
  };

  let currentEntryId = null;

  // Initialize event listeners
  function initEventListeners() {
    elements.newEntryBtn.addEventListener('click', showNewEntryForm);
    elements.logoutBtn.addEventListener('click', logout);
    elements.entryForm.addEventListener('submit', handleFormSubmit);
    elements.editBtn.addEventListener('click', loadEntryForEdit);
    elements.deleteBtn.addEventListener('click', confirmDeleteEntry);
    elements.backBtn.addEventListener('click', showEntriesList);
    elements.cancelBtn.addEventListener('click', showEntriesList);
  }

  // Main entry point
  async function init() {
    initEventListeners();
    await loadEntries();
  }

  // Load all entries
  async function loadEntries() {
    try {
      console.log('Loading entries...'); // Debug log
      showLoadingState();
      
      const entries = await api.getEntries(token);
      console.log('Entries loaded:', entries); // Debug log
      
      if (!entries.length) {
        showNoEntriesState();
        return;
      }
      
      renderEntriesList(entries);
    } catch (err) {
      console.error('Error loading entries:', err); // Debug log
      showError('Failed to load entries. Please refresh the page.');
    }
  }

  // Show loading state
  function showLoadingState() {
    elements.entryList.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Loading entries...</div>';
    hideDetailAndFormViews();
  }

  // Show no entries state
  function showNoEntriesState() {
    elements.entryList.innerHTML = '<div class="no-entries"><p>No entries yet. Click "New Entry" to get started!</p></div>';
    hideDetailAndFormViews();
  }

  // Render entries list
  function renderEntriesList(entries) {
    elements.entryList.innerHTML = entries.map(entry => `
      <div class="entry-preview" data-id="${entry.id}">
        <h3>${entry.title}</h3>
        <small>${formatDate(entry.createdAt)}</small>
        <p>${entry.content.substring(0, 100)}${entry.content.length > 100 ? '...' : ''}</p>
      </div>
    `).join('');
    
    // Add click handlers to each entry
    document.querySelectorAll('.entry-preview').forEach(entry => {
      entry.addEventListener('click', () => showEntryDetail(entry.dataset.id));
    });
    
    showEntriesList();
  }

  // Show entry detail view
  async function showEntryDetail(entryId) {
    try {
      console.log('Loading entry detail for:', entryId); // Debug log
      showLoadingState();
      
      const entry = await api.getEntry(token, entryId);
      console.log('Entry detail loaded:', entry); // Debug log
      
      currentEntryId = entryId;
      elements.entryTitle.textContent = entry.title;
      elements.entryContent.textContent = entry.content;
      
      elements.entryDetail.classList.remove('hidden');
      elements.entryFormSection.classList.add('hidden');
      elements.entryList.classList.add('hidden');
    } catch (err) {
      console.error('Error loading entry detail:', err); // Debug log
      showError('Failed to load entry. Please try again.');
      showEntriesList();
    }
  }

  // Show new entry form
  function showNewEntryForm() {
    currentEntryId = null;
    elements.formTitle.value = '';
    elements.formContent.value = '';
    
    elements.entryFormSection.classList.remove('hidden');
    elements.entryDetail.classList.add('hidden');
    elements.entryList.classList.add('hidden');
  }

  // Load entry for editing
  async function loadEntryForEdit() {
    try {
      console.log('Loading entry for edit:', currentEntryId); // Debug log
      const entry = await api.getEntry(token, currentEntryId);
      
      elements.formTitle.value = entry.title;
      elements.formContent.value = entry.content;
      
      elements.entryFormSection.classList.remove('hidden');
      elements.entryDetail.classList.add('hidden');
    } catch (err) {
      console.error('Error loading entry for edit:', err); // Debug log
      showError('Failed to load entry for editing. Please try again.');
    }
  }

  // Handle form submission
  async function handleFormSubmit(e) {
    e.preventDefault();
    elements.saveBtn.disabled = true;
    
    const title = elements.formTitle.value.trim();
    const content = elements.formContent.value.trim();
    
    if (!title || !content) {
      showError('Please fill in both title and content.');
      elements.saveBtn.disabled = false;
      return;
    }
    
    try {
      console.log('Saving entry...', { currentEntryId, title, content }); // Debug log
      
      if (currentEntryId) {
        await api.updateEntry(token, currentEntryId, title, content);
        console.log('Entry updated successfully'); // Debug log
      } else {
        await api.createEntry(token, title, content);
        console.log('Entry created successfully'); // Debug log
      }
      
      await loadEntries();
    } catch (err) {
      console.error('Error saving entry:', err); // Debug log
      showError(`Failed to save entry: ${err.message || 'Please try again.'}`);
    } finally {
      elements.saveBtn.disabled = false;
    }
  }

  // Confirm and delete entry
  async function confirmDeleteEntry() {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      console.log('Deleting entry:', currentEntryId); // Debug log
      await api.deleteEntry(token, currentEntryId);
      console.log('Entry deleted successfully'); // Debug log
      await loadEntries();
    } catch (err) {
      console.error('Error deleting entry:', err); // Debug log
      showError('Failed to delete entry. Please try again.');
    }
  }

  // Show entries list view
  function showEntriesList() {
    elements.entryList.classList.remove('hidden');
    elements.entryDetail.classList.add('hidden');
    elements.entryFormSection.classList.add('hidden');
  }

  // Hide detail and form views
  function hideDetailAndFormViews() {
    elements.entryDetail.classList.add('hidden');
    elements.entryFormSection.classList.add('hidden');
    elements.entryList.classList.remove('hidden');
  }

  // Format date
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Show error message
  function showError(message) {
    elements.errorDiv.textContent = message;
    setTimeout(() => elements.errorDiv.textContent = '', 5000);
  }

  // Logout
  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/pages/login.html';
  }

  // Initialize the app
  init();
});