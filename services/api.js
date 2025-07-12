const API_BASE = "https://tunga-diary-api.onrender.com/api/fullstack";

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  let errorData;
  
  try {
    errorData = contentType?.includes('application/json') 
      ? await response.json() 
      : await response.text();
  } catch (e) {
    errorData = response.statusText;
  }

  if (!response.ok) {
    const error = new Error(errorData.message || 'Request failed');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return contentType?.includes('application/json') 
    ? errorData // Already parsed as JSON
    : response.text();
}

export default {
  async login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  async signup(email, password) {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  async getEntries(token) {
    const response = await fetch(`${API_BASE}/diary`, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    return handleResponse(response);
  },

  async getEntry(token, id) {
    const response = await fetch(`${API_BASE}/diary/${id}`, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    return handleResponse(response);
  },

  async createEntry(token, title, content) {
    const response = await fetch(`${API_BASE}/diary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    return handleResponse(response);
  },

  async updateEntry(token, id, title, content) {
    const response = await fetch(`${API_BASE}/diary/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    return handleResponse(response);
  },

  async deleteEntry(token, id) {
    const response = await fetch(`${API_BASE}/diary/${id}`, {
      method: "DELETE",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    return handleResponse(response);
  }
};