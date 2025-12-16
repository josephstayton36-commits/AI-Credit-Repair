/*******************************************************
 * AICreditRepair Member Auth Portal
 * -----------------------------------------------------
 * Handles login, signup, and password reset flows
 * for member-login.html
 *******************************************************/

console.log("🚀 auth.js loaded and waiting for Firebase…");

/* ------------------------------
   Helper: Show / Clear errors
-------------------------------*/
function showError(msg, type = "error") {
  let box = document.getElementById("errorBox");
  if (!box) {
    alert(msg);
    return;
  }
  box.style.display = "block";
  box.textContent = msg;
  box.className = type === "success" ? "msg success" : "msg error";
  box.style.opacity = "1";
}

function clearError() {
  const box = document.getElementById("errorBox");
  if (box) {
    box.style.opacity = "0";
    setTimeout(() => {
      box.style.display = "none";
      box.textContent = "";
      box.className = "";
    }, 200);
  }
}

/* ------------------------------
   Wait for Firebase to be ready
-------------------------------*/
async function waitForFirebaseReady(timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (window.firebase && firebase.apps && firebase.apps.length) return true;
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error("Firebase not initialized. Check firebase-config.js path or config.");
}

/* ------------------------------
   Helper: Button state animation
-------------------------------*/
function setLoading(btn, loading = true) {
  if (!btn) return;
  btn.disabled = loading;
  btn.style.opacity = loading ? 0.6 : 1;
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = "Loading…";
  } else if (btn.dataset.originalText) {
    btn.textContent = btn.dataset.originalText;
  }
}

/* ------------------------------
   DOM Ready: initialize listeners
-------------------------------*/
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

    /* ---------------------------------------
       LOGIN
    ---------------------------------------*/
    loginBtn.addEventListener("click", async () => {
      clearError();
      const email = emailEl.value.trim();
      const password = passEl.value;

      if (!email || !password) return showError("Please enter both email and password.");

      setLoading(loginBtn, true);

      try {
        await auth.signInWithEmailAndPassword(email, password);
        showError("✅ Login successful! Redirecting…", "success");
        setTimeout(() => (window.location.href = "member-dashboard.html"), 1000);
      } catch (err) {
        console.error("Login error:", err);
        showError(err.message);
      } finally {
        setLoading(loginBtn, false);
      }
    });

    /* ---------------------------------------
       SIGN UP
    ---------------------------------------*/
    signupBtn.addEventListener("click", async () => {
      clearError();
      const email = emailEl.value.trim();
      const password = passEl.value;

      if (!email || !password) return showError("Enter email and password to create an account.");
      if (password.length < 6) return showError("Password must be at least six characters.");

      setLoading(signupBtn, true);

      try {
        await auth.createUserWithEmailAndPassword(email, password);
        showError("✅ Account created! Redirecting…", "success");
        setTimeout(() => (window.location.href = "member-dashboard.html"), 1000);
      } catch (err) {
        console.error("Signup error:", err);
        showError(err.message);
      } finally {
        setLoading(signupBtn, false);
      }
    });

    /* ---------------------------------------
       RESET PASSWORD
    ---------------------------------------*/
    resetBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      clearError();

      const email = emailEl.value.trim();
      if (!email) return showError("Enter your email, then click Reset.");

      setLoading(resetBtn, true);

      try {
        await auth.sendPasswordResetEmail(email);
        showError("✅ Password reset email sent! Check your inbox.", "success");
      } catch (err) {
        console.error("Reset error:", err);
        showError(err.message);
      } finally {
        setLoading(resetBtn, false);
      }
    });

    /* ---------------------------------------
       AUTO-REDIRECT IF ALREADY LOGGED IN
    ---------------------------------------*/
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User already logged in, redirecting.");
        window.location.href = "member-dashboard.html";
      }
    });
  } catch (err) {
    console.error(err);
    showError("Auth init error: " + err.message);
  }
});
