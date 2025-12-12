let currentUserProfile = null;
return db.collection("users").doc(uid).set({
  email: email,
  role: "member",
  tier: "free",              // free | elite
  paid: false,               // later: true after payment
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});

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
function logoutUser() {
  auth.signOut()
    .then(() => window.location.href = "index.html") // back to login
    .catch(err => alert(err.message));
}
