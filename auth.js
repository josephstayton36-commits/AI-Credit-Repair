let isLoginMode = true;

function toggleMode() {
  isLoginMode = !isLoginMode;

  document.getElementById("authTitle").innerText =
    isLoginMode ? "Member Login" : "Create Your Account";

  document.getElementById("loginBtn").style.display =
    isLoginMode ? "block" : "none";

  document.getElementById("signupBtn").style.display =
    isLoginMode ? "none" : "block";
}

// CREATE ACCOUNT
function signupUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(error => alert(error.message));
}

// LOGIN
function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(error => alert(error.message));
}
