document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("login-error");
  errorDiv.textContent = "";

  try {
    const data = await window.api.login(email, password);
    localStorage.setItem("token", data.token);
    window.location.href = "diary.html";
  } catch (err) {
    errorDiv.textContent = "Invalid email or password.";
  }
});