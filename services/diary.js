// Get the user's token from localStorage. Redirect to login if not found.
const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

// Cache DOM elements for later use
const entryList = document.getElementById("entry-list");
const entryDetail = document.getElementById("entry-detail");
const entryFormSection = document.getElementById("entry-form-section");
const diaryError = document.getElementById("diary-error");
const newEntryBtn = document.getElementById("new-entry-btn");
const logoutBtn = document.getElementById("logout-btn");

let currentEntryId = null;

// Load all diary entries and display them as previews
async function loadEntries() {
  entryList.innerHTML = "<p>Loading...</p>";
  entryDetail.style.display = "none";
  entryFormSection.style.display = "none";
  try {
    const entries = await window.api.getEntries(token);
    if (!entries.length) {
      entryList.innerHTML = "<p>No entries yet.</p>";
      return;
    }
    // Render each entry as a clickable preview
    entryList.innerHTML = entries
      .map(
        (e) =>
          `<div class="entry-preview" data-id="${e.id}">
            <h3>${e.title}</h3>
            <small>${new Date(e.date).toLocaleString()}</small>
          </div>`
      )
      .join("");
    // Add click listeners to each preview
    document.querySelectorAll(".entry-preview").forEach((el) =>
      el.addEventListener("click", () => showEntry(el.dataset.id))
    );
  } catch (err) {
    entryList.innerHTML = "<p>Failed to load entries.</p>";
  }
}

// Show the details of a single diary entry
async function showEntry(id) {
  try {
    const entry = await window.api.getEntry(token, id);
    currentEntryId = id;
    document.getElementById("entry-title").textContent = entry.title;
    document.getElementById("entry-content").textContent = entry.content;
    entryDetail.style.display = "";
    entryList.innerHTML = "";
    entryFormSection.style.display = "none";
  } catch {
    diaryError.textContent = "Failed to load entry.";
  }
}

// Show the form for creating a new entry
newEntryBtn.onclick = () => {
  currentEntryId = null;
  document.getElementById("form-title").value = "";
  document.getElementById("form-content").value = "";
  entryFormSection.style.display = "";
  entryDetail.style.display = "none";
  entryList.innerHTML = "";
};

// Handle form submission for creating or updating an entry
document.getElementById("entry-form").onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById("form-title").value;
  const content = document.getElementById("form-content").value;
  try {
    if (currentEntryId) {
      await window.api.updateEntry(token, currentEntryId, title, content);
    } else {
      await window.api.createEntry(token, title, content);
    }
    loadEntries();
  } catch {
    diaryError.textContent = "Failed to save entry.";
  }
};

// Edit the currently viewed entry
document.getElementById("edit-btn").onclick = async () => {
  const entry = await window.api.getEntry(token, currentEntryId);
  document.getElementById("form-title").value = entry.title;
  document.getElementById("form-content").value = entry.content;
  entryFormSection.style.display = "";
  entryDetail.style.display = "none";
  entryList.innerHTML = "";
};

// Delete the currently viewed entry
document.getElementById("delete-btn").onclick = async () => {
  if (confirm("Delete this entry?")) {
    try {
      await window.api.deleteEntry(token, currentEntryId);
      loadEntries();
    } catch {
      diaryError.textContent = "Failed to delete entry.";
    }
  }
};

// Return to the list of entries from detail or form view
document.getElementById("back-btn").onclick = loadEntries;
document.getElementById("cancel-btn").onclick = loadEntries;

// Logout: clear token and redirect to login
logoutBtn.onclick = () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
};

// Initial load of entries when the page loads
loadEntries();