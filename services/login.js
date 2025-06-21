// Attach a submit event listener to the login form
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission

  // Get user input values
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("login-error");
  errorDiv.textContent = "";

  try {
    // Call the login API and store the token on success
    const data = await window.api.login(email, password);
    localStorage.setItem("token", data.token);
    window.location.href = "diary.html"; // Redirect to main app
  } catch (err) {
    // Show error if login fails
    errorDiv.textContent = "Invalid email or password.";
  }
});