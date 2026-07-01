import api from './api.js';

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const errorDiv = document.getElementById('signup-error');
  errorDiv.textContent = '';

  if (password.length < 6) {
    errorDiv.textContent = 'Password must be at least 6 characters.';
    return;
  }
  if (password !== confirm) {
    errorDiv.textContent = 'Passwords do not match.';
    return;
  }

  try {
    await api.signup(email, password);
    window.location.href = 'login.html';
  } catch (err) {
    errorDiv.textContent = 'Signup failed. Email may already be in use.';
  }
});
