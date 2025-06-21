// Attach a submit event listener to the signup form
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user input values
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;
  const errorDiv = document.getElementById("signup-error");
  errorDiv.textContent = "";

  // Client-side validation
  if (password.length < 6) {
    errorDiv.textContent = "Password must be at least 6 characters.";
    return;
  }
  if (password !== confirm) {
    errorDiv.textContent = "Passwords do not match.";
    return;
  }

  try {
    // Call the signup API
    await window.api.signup(email, password);
    // Redirect to login page after successful signup
    window.location.href = "login.html";
  } catch (err) {
    errorDiv.textContent = "Signup failed. Email may already be in use.";
  }
});