// firebase-config.js

console.log("🔥 firebase-config.js loaded");

const firebaseConfig = {
  apiKey: "AIzaSybk_o7S1Bcp5u4hKA3j-V_xodrD6PxtNCQ",
  authDomain: "ai-credit-repair-992c7.firebaseapp.com",
  projectId: "ai-credit-repair-992c7",
  appId: "1:4114115117046:web:fa2013a0f914aa06fc5957"
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
