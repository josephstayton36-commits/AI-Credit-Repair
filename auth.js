// 🔥 Your Firebase config (from Firebase Console)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBK_o7S1Bcp5u4hKA3j-V_xodrD6PxtNCQ",
  authDomain: "ai-credit-repair-992c7.firebaseapp.com",
  projectId: "ai-credit-repair-992c7",
  storageBucket: "ai-credit-repair-992c7.firebasestorage.app",
  messagingSenderId: "411411517046",
  appId: "1:411411517046:web:fa2013a0f914aa06fc5957"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// LOGIN FUNCTION
function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html"; // redirect after login
    })
    .catch(error => {
      alert(error.message);
    });
}

// PROTECT HOME PAGE
auth.onAuthStateChanged(user => {
  if (!user && window.location.pathname.includes("index.html")) {
    window.location.href = "login.html";
  }
});
