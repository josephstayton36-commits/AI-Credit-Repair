// auth.js

function showMsg(text, type = "info") {
  const el = document.getElementById("authMsg");
  if (!el) return alert(text);

  el.style.display = "block";
  el.textContent = text;

  el.style.background =
    type === "error" ? "rgba(255,80,80,.18)" :
    type === "success" ? "rgba(80,255,170,.14)" :
    "rgba(150,170,220,.12)";
  el.style.border =
    type === "error" ? "1px solid rgba(255,80,80,.35)" :
    type === "success" ? "1px solid rgba(80,255,170,.30)" :
    "1px solid rgba(150,170,220,.18)";
}

async function waitForFirebaseReady(timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (window.firebase && firebase.apps && firebase.apps.length) return true;
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error("Firebase not initialized. Check firebase-config.js values and that it is in the same folder.");
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    showMsg("⏳ Loading Firebase…");

    await waitForFirebaseReady();

    const auth = firebase.auth();
    showMsg("✅ Firebase ready. Create an account or log in.", "success");

    // SIGN UP
    document.getElementById("signupForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;

      try {
        await auth.createUserWithEmailAndPassword(email, password);
        showMsg("✅ Account created successfully!", "success");
        // Optional redirect:
        // window.location.href = "member-dashboard.html";
      } catch (err) {
        showMsg("❌ Signup failed: " + err.message, "error");
      }
    });

    // LOG IN
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      try {
        await auth.signInWithEmailAndPassword(email, password);
        showMsg("✅ Logged in successfully!", "success");
        // Optional redirect:
        // window.location.href = "member-dashboard.html";
      } catch (err) {
        showMsg("❌ Login failed: " + err.message, "error");
      }
    });

    // RESET PASSWORD
    document.getElementById("resetBtn").addEventListener("click", async () => {
      const email = document.getElementById("loginEmail").value.trim();
      if (!email) return showMsg("❌ Enter your email in the login box first.", "error");

      try {
        await auth.sendPasswordResetEmail(email);
        showMsg("✅ Reset email sent. Check your inbox/spam.", "success");
      } catch (err) {
        showMsg("❌ Reset failed: " + err.message, "error");
      }
    });

  } catch (err) {
    showMsg("❌ " + err.message, "error");
  }
});
