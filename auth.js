// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBK_07S1Bcp5u4hKA3i-V_xodrD6PxtNCQ",
  authDomain: "ai-credit-repair-992c7.firebaseapp.com",
  projectId: "ai-credit-repair-992c7",
  storageBucket: "ai-credit-repair-992c7.firebasestorage.app",
  messagingSenderId: "411411517046",
  appId: "1:411411517046:web:fa2013a0f914aa06fc5957"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 🔐 LOGIN
function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(error => alert(error.message));
}

// ➕ CREATE ACCOUNT
function signupUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(error => alert(error.message));
}

// 🔒 PROTECT HOME PAGE
auth.onAuthStateChanged(user => {
  if (!user && window.location.pathname.includes("index.html")) {
    window.location.href = "login.html";
  }
});
