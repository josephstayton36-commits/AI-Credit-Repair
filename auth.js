// auth.js (for member-login.html with #email #password #loginBtn #signupBtn #resetBtn)

function showError(msg) {
  const box = document.getElementById("errorBox");
  if (!box) return alert(msg);
  box.style.display = "block";
  box.textContent = msg;
}

function clearError() {
  const box = document.getElementById("errorBox");
  if (!box) return;
  box.style.display = "none";
  box.textContent = "";
}

async function waitForFirebaseReady(timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (window.firebase && firebase.apps && firebase.apps.length) return true;
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error("Firebase not initialized. Check firebase-config.js file path and config.");
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await waitForFirebaseReady();
    const auth = firebase.auth();

    const emailEl = document.getElementById("email");
    const passEl = document.getElementById("password");

    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const resetBtn = document.getElementById("resetBtn");

    if (!emailEl || !passEl || !loginBtn || !signupBtn || !resetBtn) {
      throw new Error("Login page elements not found. Check IDs in member-login.html.");
    }

    // LOGIN
    loginBtn.addEventListener("click", async () => {
      clearError();
      const email = emailEl.value.trim();
      const password = passEl.value;

      if (!email || !password) return showError("Enter email + password.");

      try {
        await auth.signInWithEmailAndPassword(email, password);
        window.location.href = "member-dashboard.html";
      } catch (err) {
        showError(err.message);
      }
    });

    // SIGN UP
    signupBtn.addEventListener("click", async () => {
      clearError();
      const email = emailEl.value.trim();
      const password = passEl.value;

      if (!email || !password) return showError("Enter email + password to create an account.");
      if (password.length < 6) return showError("Password must be at least 6 characters.");

      try {
        await auth.createUserWithEmailAndPassword(email, password);
        window.location.href = "member-dashboard.html";
      } catch (err) {
        showError(err.message);
      }
    });

    // RESET PASSWORD
    resetBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      clearError();

      const email = emailEl.value.trim();
      if (!email) return showError("Enter your email first, then click Reset it.");

      try {
        await auth.sendPasswordResetEmail(email);
        showError("✅ Reset email sent. Check your inbox/spam.");
      } catch (err) {
        showError(err.message);
      }
    });

  } catch (err) {
    showError("Auth init error: " + err.message);
  }
});
