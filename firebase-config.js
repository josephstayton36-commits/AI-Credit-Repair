// auth.js

function showMsg(text, type = "info") {
  const el = document.getElementById("authMsg");
  el.style.display = "block";
  el.textContent = text;

  el.style.background =
    type === "error" ? "#401515" :
    type === "success" ? "#154026" :
    "#1b244a";
}

async function waitForFirebase() {
  for (let i = 0; i < 40; i++) {
    if (window.firebase && firebase.apps.length) return;
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error("Firebase not initialized");
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    showMsg("⏳ Loading Firebase…");
    await waitForFirebase();

    const auth = firebase.auth();
    showMsg("✅ Firebase ready");

    // SIGNUP
    document.getElementById("signupForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await auth.createUserWithEmailAndPassword(
          signupEmail.value.trim(),
          signupPassword.value
        );
        showMsg("✅ Account created", "success");
      } catch (err) {
        showMsg(err.message, "error");
      }
    });

    // LOGIN
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await auth.signInWithEmailAndPassword(
          loginEmail.value.trim(),
          loginPassword.value
        );
        showMsg("✅ Logged in", "success");
      } catch (err) {
        showMsg(err.message, "error");
      }
    });

    // RESET
    document.getElementById("resetBtn").addEventListener("click", async () => {
      if (!loginEmail.value) return showMsg("Enter email first", "error");
      await auth.sendPasswordResetEmail(loginEmail.value.trim());
      showMsg("📧 Reset email sent", "success");
    });

  } catch (err) {
    showMsg("❌ " + err.message, "error");
  }
});
