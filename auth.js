// auth.js

function showMsg(text, type = "info") {
  const el = document.getElementById("authMsg");
  if (!el) return alert(text);

  el.style.display = "block";
  el.textContent = text;

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

document.addEventListener("DOMContentLoaded", () => {
  try {
    // 🔎 Self-checks (no DevTools needed)
    if (!window.firebase) throw new Error("Firebase SDK not loaded.");
    if (!firebase.apps || !firebase.apps.length) throw new Error("Firebase not initialized. Check firebase-config.js.");

    const auth = firebase.auth();

    // Hook forms
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const resetBtn = document.getElementById("resetBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!signupForm || !loginForm) throw new Error("Signup/Login forms not found. Check IDs in HTML.");

    showMsg("✅ Auth script loaded. Try creating an account.", "success");

    // SIGN UP
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;

      try {
        await auth.createUserWithEmailAndPassword(email, password);
        showMsg("✅ Account created! Redirecting…", "success");
        setTimeout(() => (window.location.href = "member-dashboard.html"), 700);
      } catch (err) {
        showMsg("❌ Signup failed: " + err.message, "error");
      }
    });

    // LOG IN
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      try {
        await auth.signInWithEmailAndPassword(email, password);
        showMsg("✅ Logged in! Redirecting…", "success");
        setTimeout(() => (window.location.href = "member-dashboard.html"), 700);
      } catch (err) {
        showMsg("❌ Login failed: " + err.message, "error");
      }
    });

    // RESET PASSWORD
    if (resetBtn) {
      resetBtn.addEventListener("click", async () => {
        const email = (document.getElementById("loginEmail")?.value || "").trim();
        if (!email) return showMsg("❌ Enter your email in the login box first.", "error");

        try {
          await auth.sendPasswordResetEmail(email);
          showMsg("✅ Password reset email sent. Check inbox/spam.", "success");
        } catch (err) {
          showMsg("❌ Reset failed: " + err.message, "error");
        }
      });
    }

    // LOGOUT VISIBILITY
    if (logoutBtn) {
      auth.onAuthStateChanged((user) => {
        logoutBtn.style.display = user ? "inline-block" : "none";
      });

      logoutBtn.addEventListener("click", async () => {
        await auth.signOut();
        showMsg("You’re logged out.", "info");
      });
    }

  } catch (err) {
    showMsg("❌ Auth script error: " + err.message, "error");
  }
});
