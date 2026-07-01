import api from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

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
  let errorTimeout = null;

  function initEventListeners() {
    elements.newEntryBtn.addEventListener('click', showNewEntryForm);
    elements.logoutBtn.addEventListener('click', logout);
    elements.entryForm.addEventListener('submit', handleFormSubmit);
    elements.editBtn.addEventListener('click', loadEntryForEdit);
    elements.deleteBtn.addEventListener('click', confirmDeleteEntry);
    elements.backBtn.addEventListener('click', showEntriesList);
    elements.cancelBtn.addEventListener('click', showEntriesList);
  }

  async function init() {
    initEventListeners();
    await loadEntries();
  }

  async function loadEntries() {
    try {
      showLoadingState();
      const entries = await api.getEntries(token);
      if (!entries.length) {
        showNoEntriesState();
        return;
      }
      renderEntriesList(entries);
    } catch (err) {
      showError('Failed to load entries. Please refresh the page.');
    }
  }

  function showLoadingState() {
    elements.entryList.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Loading entries...</div>';
    hideDetailAndFormViews();
  }

  function showNoEntriesState() {
    elements.entryList.innerHTML = '<div class="no-entries"><p>No entries yet. Click "New Entry" to get started!</p></div>';
    hideDetailAndFormViews();
  }

  function renderEntriesList(entries) {
    elements.entryList.innerHTML = entries.map(entry => `
      <div class="entry-preview" data-id="${entry.id}">
        <h3>${entry.title}</h3>
        <small>${formatDate(entry.createdAt)}</small>
        <p>${entry.content.substring(0, 100)}${entry.content.length > 100 ? '...' : ''}</p>
      </div>
    `).join('');

    document.querySelectorAll('.entry-preview').forEach(entry => {
      entry.addEventListener('click', () => showEntryDetail(entry.dataset.id));
    });

    showEntriesList();
  }

  async function showEntryDetail(entryId) {
    try {
      showLoadingState();
      const entry = await api.getEntry(token, entryId);
      currentEntryId = entryId;
      elements.entryTitle.textContent = entry.title;
      elements.entryContent.textContent = entry.content;

      elements.entryDetail.classList.remove('hidden');
      elements.entryFormSection.classList.add('hidden');
      elements.entryList.classList.add('hidden');
    } catch (err) {
      showError('Failed to load entry. Please try again.');
      showEntriesList();
    }
  }

  function showNewEntryForm() {
    currentEntryId = null;
    elements.formTitle.value = '';
    elements.formContent.value = '';
    elements.entryFormSection.classList.remove('hidden');
    elements.entryDetail.classList.add('hidden');
    elements.entryList.classList.add('hidden');
  }

  async function loadEntryForEdit() {
    try {
      const entry = await api.getEntry(token, currentEntryId);
      elements.formTitle.value = entry.title;
      elements.formContent.value = entry.content;
      elements.entryFormSection.classList.remove('hidden');
      elements.entryDetail.classList.add('hidden');
    } catch (err) {
      showError('Failed to load entry for editing. Please try again.');
    }
  }

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
      if (currentEntryId) {
        await api.updateEntry(token, currentEntryId, title, content);
      } else {
        await api.createEntry(token, title, content);
      }
      await loadEntries();
    } catch (err) {
      showError('Failed to save entry. Please try again.');
    } finally {
      elements.saveBtn.disabled = false;
    }
  }

  async function confirmDeleteEntry() {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
      await api.deleteEntry(token, currentEntryId);
      await loadEntries();
    } catch (err) {
      showError('Failed to delete entry. Please try again.');
    }
  }

  function showEntriesList() {
    elements.entryList.classList.remove('hidden');
    elements.entryDetail.classList.add('hidden');
    elements.entryFormSection.classList.add('hidden');
  }

  function hideDetailAndFormViews() {
    elements.entryDetail.classList.add('hidden');
    elements.entryFormSection.classList.add('hidden');
    elements.entryList.classList.remove('hidden');
  }

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function showError(message) {
    if (errorTimeout) clearTimeout(errorTimeout);
    elements.errorDiv.textContent = message;
    errorTimeout = setTimeout(() => { elements.errorDiv.textContent = ''; }, 5000);
  }

  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }

  init();
});
