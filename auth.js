// auth.js

document.addEventListener("DOMContentLoaded", () => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const resetBtn = document.getElementById("resetBtn");
  const errorBox = document.getElementById("errorBox");

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
  }

  function clearError() {
    errorBox.style.display = "none";
  }

  loginBtn.onclick = async () => {
    clearError();
    if (!window.auth) return showError("Firebase not initialized.");

    try {
      await auth.signInWithEmailAndPassword(
        email.value.trim(),
        password.value
      );
      window.location.href = "dashboard.html";
    } catch (e) {
      showError(e.message);
    }
  };

  signupBtn.onclick = async () => {
    clearError();
    if (!window.auth) return showError("Firebase not initialized.");

    try {
      await auth.createUserWithEmailAndPassword(
        email.value.trim(),
        password.value
      );
      window.location.href = "dashboard.html";
    } catch (e) {
      showError(e.message);
    }
  };

  resetBtn.onclick = async (e) => {
    e.preventDefault();
    clearError();

    try {
      await auth.sendPasswordResetEmail(email.value.trim());
      showError("Password reset email sent.");
    } catch (e) {
      showError(e.message);
    }
  };
});
