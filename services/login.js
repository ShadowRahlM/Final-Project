import api from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorDiv = document.getElementById('login-error');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.textContent = '';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      errorDiv.textContent = 'Please enter both email and password.';
      return;
    }

    try {
      const { token } = await api.login(email, password);
      localStorage.setItem('token', token);
      window.location.href = 'diary.html';
    } catch (err) {
      errorDiv.textContent = err.message || 'Login failed. Please try again.';
    }
  });
});
