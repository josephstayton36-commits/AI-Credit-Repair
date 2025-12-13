// firebase-config.js

console.log("🔥 firebase-config.js loaded");

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "ai-credit-repair-992c7.firebaseapp.com",
  projectId: "ai-credit-repair-992c7",
  appId: "PASTE_YOUR_APP_ID"
};

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  window.auth = firebase.auth();
  console.log("✅ Firebase initialized");
} catch (e) {
  console.error("❌ Firebase init failed:", e);
}
