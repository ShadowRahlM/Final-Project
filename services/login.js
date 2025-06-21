// --- LOGIN LOGIC ---

// Attach a submit event listener to the login form (if it exists)
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get user input values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("login-error");
    errorDiv.textContent = "";

    // Basic client-side validation
    if (!email || !password) {
      errorDiv.textContent = "Please enter both email and password.";
      return;
    }

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
}

// Add this block of code to include the sign-up prompt
const signUpPrompt = document.createElement("p");
signUpPrompt.innerHTML = `Don't have an account? <a href="signup.html">Sign Up</a>`;
document.getElementById("login-form").appendChild(signUpPrompt);

// --- SIGNUP LOGIC ---

// Attach a submit event listener to the signup form (if it exists)
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get user input values
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;
    const errorDiv = document.getElementById("signup-error");
    errorDiv.textContent = "";

    // Client-side validation
    if (!email || !password || !confirm) {
      errorDiv.textContent = "All fields are required.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorDiv.textContent = "Please enter a valid email address.";
      return;
    }
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
}