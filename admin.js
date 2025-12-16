/*******************************************************
 * AICreditRepair Admin Dashboard Logic
 * -----------------------------------------------------
 * Handles admin access control, user verification,
 * and real-time dashboard data loading from Firestore.
 *******************************************************/

console.log("AICreditRepair Admin dashboard loaded.");

// =========================
//  FIREBASE INIT
// =========================
if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// =========================
//  AUTH STATE LISTENER
// =========================
auth.onAuthStateChanged(async (user) => {
  const emailDisplay = document.getElementById("userEmail");

  if (!user) {
    console.warn("No user detected. Redirecting to login...");
    window.location.href = "login.html";
    return;
  }

  // Display logged-in email
  if (emailDisplay) emailDisplay.textContent = user.email;

  try {
    const adminDoc = await db.collection("admins").doc(user.uid).get();
    const isAdmin = adminDoc.exists && adminDoc.data().role === "admin";

    if (!isAdmin) {
      alert("Access Denied: Admin privileges required.");
      window.location.href = "home.html";
      return;
    }

    console.log("Admin verified:", user.email);
    loadDashboard();

  } catch (err) {
    console.error("Error verifying admin:", err);
    alert("Unable to verify admin privileges.");
    window.location.href = "home.html";
  }
});

// =========================
//  LOGOUT FUNCTION
// =========================
function logoutUser() {
  auth.signOut()
    .then(() => {
      console.log("User signed out.");
      window.location.href = "login.html";
    })
    .catch(err => console.error("Logout error:", err));
}

// =========================
//  LOAD DASHBOARD DATA
// =========================
async function loadDashboard() {
  await Promise.all([
    loadUsers(),
    loadPayments(),
    loadUploads()
  ]);
}

// =========================
//  LOAD USERS
// =========================
async function loadUsers() {
  const container = document.getElementById("usersList");
  if (!container) return;
  container.textContent = "Loading users…";

  try {
    const snapshot = await db.collection("users")
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    if (snapshot.empty) {
      container.textContent = "No users found.";
      return;
    }

    container.innerHTML = snapshot.docs.map(doc => {
      const data = doc.data();
      const created = data.createdAt?.toDate?.().toLocaleDateString() || "—";
      return `
        <div class="user-item">
          <strong>${data.email || "Unknown"}</strong><br>
          Joined: ${created}<br>
          Role: ${data.role || "user"}
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error("Error loading users:", err);
    container.textContent = "Failed to load users.";
  }
}

// =========================
//  LOAD PAYMENTS
// =========================
async function loadPayments() {
  const container = document.getElementById("paymentsList");
  if (!container) return;
  container.textContent = "Loading payments…";

  try {
    const snapshot = await db.collection("payments")
      .orderBy("timestamp", "desc")
      .limit(10)
      .get();

    if (snapshot.empty) {
      container.textContent = "No payment requests found.";
      return;
    }

    container.innerHTML = snapshot.docs.map(doc => {
      const data = doc.data();
      const date = data.timestamp?.toDate?.().toLocaleString() || "—";
      return `
        <div class="payment-item">
          <strong>User:</strong> ${data.userEmail || "Unknown"}<br>
          <strong>Amount:</strong> $${data.amount?.toFixed?.(2) || "0.00"}<br>
          <strong>Status:</strong> ${data.status || "Pending"}<br>
          <small>Date: ${date}</small>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error("Error loading payments:", err);
    container.textContent = "Failed to load payments.";
  }
}

// =========================
//  LOAD UPLOADS
// =========================
async function loadUploads() {
  const container = document.getElementById("uploadsList");
  if (!container) return;
  container.textContent = "Loading uploads…";

  try {
    const snapshot = await db.collection("uploads")
      .orderBy("uploadedAt", "desc")
      .limit(10)
      .get();

    if (snapshot.empty) {
      container.textContent = "No file uploads found.";
      return;
    }

    container.innerHTML = snapshot.docs.map(doc => {
      const data = doc.data();
      const uploadedAt = data.uploadedAt?.toDate?.().toLocaleString() || "—";
      return `
        <div class="upload-item">
          <strong>${data.filename || "Unnamed File"}</strong><br>
          User: ${data.userEmail || "Unknown"}<br>
          Uploaded: ${uploadedAt}
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error("Error loading uploads:", err);
    container.textContent = "Failed to load uploads.";
  }
}
