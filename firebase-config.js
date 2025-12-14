// firebase-config.js
// Firebase configuration for AI Credit Repair
// NOTE: This file MUST load before any auth or app logic

(function () {
  if (!window.firebase) {
    console.error("Firebase SDK not loaded before firebase-config.js");
    return;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyBK_o7S1Bcp5u4hKA3j-V_xodrD6PxtNCQ",
    authDomain: "ai-credit-repair-992c7.firebaseapp.com",
    projectId: "ai-credit-repair-992c7",
    storageBucket: "ai-credit-repair-992c7.appspot.com",
    messagingSenderId: "411411517046",
    appId: "1:411411517046:web:fa2013a0f914aa06fc5957"
  };

  // Initialize Firebase only once
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("🔥 Firebase initialized");
  } else {
    console.log("ℹ️ Firebase already initialized");
  }
})();
