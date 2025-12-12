/**************************************************************
 * auth.js (GitHub Pages + Firebase Compat)
 * - Auth: email/password login + signup + reset + logout
 * - Firestore: user profile create/load/update
 * - Gating: protected pages, elite-only UI + actions, admin page
 **************************************************************/

/* ========= 1) FIREBASE CONFIG (REPLACE WITH YOUR WEB APP CONFIG) ========= */
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",       // like: your-project.firebaseapp.com
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE", // like: your-project.appspot.com
  messagingSenderId: "PASTE_YOUR_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
};

/* ========= 2) INIT ========= */
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

/* ========= 3) GLOBAL PROFILE ========= */
let currentUserProfile = null;

/* ========= 4) PAGE PROTECTION SETTINGS ========= */
const PROTECTED_PAGES = ["home.html", "upload.html", "admin.html"];

/* ========= 5) HELPERS ========= */
function getPath() {
  return window.location.pathname || "";
}

function onProtectedPage(path) {
  return PROTECTED_PAGES.some(p => path.includes(p));
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* ========= 6) ELITE GATING ========= */
function isElite() {
  return currentUserProfile?.tier === "elite";
}

function requireElite(featureName = "This feature") {
  if (!isElite()) {
    alert(`${featureName} is for Elite members only. Upgrade to access.`);
    return false;
  }
  return true;
}

// Hide .elite-only by default in CSS (recommended), then show if elite:
function applyEliteGates(profile) {
  const show = profile?.tier === "elite";
  document.querySelectorAll(".elite-only").forEach(el => {
    el.style.display = show ? "block" : "none";
  });
}

/* ========= 7) ADMIN GATING ========= */
function isAdmin() {
  return currentUserProfile?.role === "admin";
}

/* ========= 8) AUTH ACTIONS (called from HTML buttons) ========= */
function loginUser() {
  const email = (document.getElementById("email")?.value || "").trim();
  const password = document.getElementById("password")?.value || "";

  if (!email || !password) return alert("Enter email + password.");

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(err => alert(err.message));
}

function signupUser() {
  const email = (document.getElementById("email")?.value || "").trim();
  const password = document.getElementById("password")?.value || "";

  if (!email || !password) return alert("Enter email + password.");
  if (password.length < 6) return alert("Password must be at least 6 characters.");

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => createOrUpdateProfileOnSignup(cred.user))
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(err => alert(err.message));
}

function resetPassword() {
  const email = (document.getElementById("email")?.value || "").trim();
  if (!email) return alert("Enter your email first, then click Reset.");

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Password reset email sent. Check your inbox/spam."))
    .catch(err => alert(err.message));
}

function logoutUser() {
  auth.signOut()
    .then(() => window.location.href = "index.html")
    .catch(err => alert(err.message));
}

/* ========= 9) PROFILE CREATE/LOAD ========= */
function createOrUpdateProfileOnSignup(user) {
  const uid = user.uid;
  const email = user.email || "";

  // Create a default profile at signup
  return db.collection("users").doc(uid).set({
    email: email,
    role: "member",      // member | admin
    tier: "free",        // free | elite
    paid: false,         // later: true after payment
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

function loadProfile(uid, fallbackEmail) {
  return db.collection("users").doc(uid).get()
    .then(doc => {
      if (doc.exists) return doc.data();

      // If missing (rare), create a basic one
      return db.collection("users").doc(uid).set({
        email: fallbackEmail || "",
        role: "member",
        tier: "free",
        paid: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true }).then(() => db.collection("users").doc(uid).get())
        .then(d => d.data());
    });
}

/* ========= 10) OPTIONAL PROFILE EDITOR ========= */
function loadProfileToForm(profile) {
  const nameEl = document.getElementById("profileName");
  const phoneEl = document.getElementById("profilePhone");
  const tierEl = document.getElementById("profileTier");

  if (nameEl) nameEl.value = profile.name || "";
  if (phoneEl) phoneEl.value = profile.phone || "";
  if (tierEl) tierEl.textContent = profile.tier || "free";
}

function saveProfile() {
  const user = auth.currentUser;
  if (!user) return (window.location.href = "index.html");

  const name = (document.getElementById("profileName")?.value || "").trim();
  const phone = (document.getElementById("profilePhone")?.value || "").trim();

  db.collection("users").doc(user.uid).set({
    name,
    phone,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true })
  .then(() => alert("✅ Profile saved"))
  .catch(err => alert(err.message));
}

/* ========= 11) MAIN AUTH LISTENER (runs on every page that loads auth.js) ========= */
auth.onAuthStateChanged(user => {
  const path = getPath();
  const protectedNow = onProtectedPage(path);

  // Not logged in
  if (!user) {
    currentUserProfile = null;
    // Hide elite UI if present
    document.querySelectorAll(".elite-only").forEach(el => (el.style.display = "none"));
    if (protectedNow) window.location.href = "index.html";
    return;
  }

  // Logged in: show email if element exists
  setText("userEmail", user.email || "");

  // Load profile from Firestore
  loadProfile(user.uid, user.email || "")
    .then(profile => {
      currentUserProfile = profile;

      // Apply Elite UI gating
      applyEliteGates(profile);

      // Fill profile editor fields if they exist on this page
      loadProfileToForm(profile);

      // Admin page lock
      if (path.includes("admin.html") && !isAdmin()) {
        alert("Not authorized.");
        window.location.href = "home.html";
        return;
      }
    })
    .catch(err => {
      console.error("Profile load error:", err);
      alert("Profile error: " + err.message);
    });
});

/* ========= 12) EXPOSE FUNCTIONS TO HTML onclick ========= */
window.loginUser = loginUser;
window.signupUser = signupUser;
window.resetPassword = resetPassword;
window.logoutUser = logoutUser;
window.saveProfile = saveProfile;
window.requireElite = requireElite; // Use inside feature functions if needed
