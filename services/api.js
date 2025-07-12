const API_BASE = "https://tunga-diary-api.onrender.com/api/fullstack";

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Request failed');
  }
  return res.json();
}

export default {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async signup(email, password) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getEntries(token) {
    const res = await fetch(`${API_BASE}/diary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  },

  async getEntry(token, id) {
    const res = await fetch(`${API_BASE}/diary/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  },

  async createEntry(token, title, content) {
    const res = await fetch(`${API_BASE}/diary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    return handleResponse(res);
  },

  async updateEntry(token, id, title, content) {
    const res = await fetch(`${API_BASE}/diary/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    return handleResponse(res);
  },

  async deleteEntry(token, id) {
    const res = await fetch(`${API_BASE}/diary/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  }
};