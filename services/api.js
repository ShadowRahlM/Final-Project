const API_BASE = "https://tunga-diary-api.onrender.com/api/fullstack";

async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

async function getEntries(token) {
  const res = await fetch(`${API_BASE}/diary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch entries");
  return res.json();
}

async function getEntry(token, id) {
  const res = await fetch(`${API_BASE}/diary/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch entry");
  return res.json();
}

async function createEntry(token, title, content) {
  const res = await fetch(`${API_BASE}/diary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error("Failed to create entry");
  return res.json();
}

async function updateEntry(token, id, title, content) {
  const res = await fetch(`${API_BASE}/diary/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error("Failed to update entry");
  return res.json();
}

async function deleteEntry(token, id) {
  const res = await fetch(`${API_BASE}/diary/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete entry");
  return res.json();
}

async function signup(email, password) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

// Export for use in login.js
window.api = {
  login,
  signup,
  getEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
};

