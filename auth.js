// auth.js
const auth = firebase.auth();

// UI helper
function showMsg(text, type = "info") {
  const el = document.getElementById("authMsg");
  if (!el) return;
  el.style.display = "block";
  el.textContent = text;

  // lightweight styling without depending on your CSS
  if (type === "error") {
    el.style.background = "rgba(255, 80, 80, .15)";
    el.style.border = "1px solid rgba(255, 80, 80, .35)";
  } else if (type === "success") {
    el.style.background = "rgba(80, 255, 170, .12)";
    el.style.border = "1px solid rgba(80, 255, 170, .30)";
  } else {
    el.style.background = "rgba(150, 170, 220, .10)";
    el.style.border = "1px solid rgba(150, 170, 220, .18)";
  }
}

// SIGNUP
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    try {
      await auth.createUserWithEmailAndPassword(email, password);
      showMsg("✅ Account created! Sending you to the dashboard…", "success");
      setTimeout(() => (window.location.href = "member-dashboard.html"), 700);
    } catch (err) {
      console.error(err);
      showMsg(`❌ ${err.message}`, "error");
    }
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      showMsg("✅ Logged in! Sending you to the dashboard…", "success");
      setTimeout(() => (window.location.href = "member-dashboard.html"), 700);
    } catch (err) {
      console.error(err);
      showMsg(`❌ ${err.message}`, "error");
    }
  });
}

// RESET PASSWORD
const resetBtn = document.getElementById("resetBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", async () => {
    const email = (document.getElementById("loginEmail")?.value || "").trim();
    if (!email) return showMsg("Enter your email in the login box first, then click Forgot Password.", "error");

    try {
      await auth.sendPasswordResetEmail(email);
      showMsg("✅ Password reset email sent. Check your inbox/spam.", "success");
    } catch (err) {
      console.error(err);
      showMsg(`❌ ${err.message}`, "error");
    }
  });
}

// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await auth.signOut();
    showMsg("You’re logged out.", "info");
    logoutBtn.style.display = "none";
  });
}

// Show logout button if logged in
auth.onAuthStateChanged((user) => {
  if (logoutBtn) logoutBtn.style.display = user ? "inline-block" : "none";
});
