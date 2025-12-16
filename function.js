/*******************************************************
 * AICreditRepair Realtime Admin Functions
 * -----------------------------------------------------
 * Live admin verification + polished loading overlay.
 *******************************************************/

console.log("🔐 AICreditRepair admin functions active.");

// ============================
//  FIREBASE INITIALIZATION
// ============================
if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyBfmvzulrzePw4KY2CkQ1-3ydo_O4ImP5I",
    authDomain: "ai-credit-repair-3995f.firebaseapp.com",
    projectId: "ai-credit-repair-3995f",
    storageBucket: "ai-credit-repair-3995f.firebasestorage.app",
    messagingSenderId: "332853628974",
    appId: "1:332853628974:web:872612dab4ba965dc6cfbf"
  };
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
let adminSnapshotUnsub = null;

// ============================
//  HELPER FUNCTIONS
// ============================

// Hide all admin sections
function hideAdminUI() {
  const adminSections = document.querySelectorAll("[data-admin-section]");
  adminSections.forEach(section => (section.style.display = "none"));
}

// Show all admin sections
function showAdminUI() {
  const adminSections = document.querySelectorAll("[data-admin-section]");
  adminSections.forEach(section => (section.style.display = ""));
}

// Create loading overlay + spinner
function showAdminOverlay() {
  if (document.getElementById("admin-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "admin-overlay";
  overlay.innerHTML = `
    <div class="spinner"></div>
    <p>Verifying admin access...</p>
  `;
  document.body.appendChild(overlay);

  const style = document.createElement("style");
  style.textContent = `
    #admin-overlay {
      position: fixed;
      inset: 0;
      background: rgba(255,255,255,0.8);
      backdrop-filter: blur(3px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: Arial, sans-serif;
      color: #12214b;
      font-size: 18px;
      text-align: center;
    }
    #admin-overlay .spinner {
      width: 48px;
      height: 48px;
      border: 5px solid #ccd4e2;
      border-top-color: #12214b;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// Remove loading overlay
function removeAdminOverlay() {
  document.getElementById("admin-overlay")?.remove();
}

// ============================
//  AUTH STATE WATCHER
// ============================
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    console.log("🚫 No user signed in. Redirecting...");
    hideAdminUI();
    removeAdminOverlay();
    window.location.href = "login.html";
    return;
  }

  console.log("👤 Authenticated user:", user.email);
  showAdminOverlay();

  try {
    // Real-time admin snapshot
    if (adminSnapshotUnsub) adminSnapshotUnsub(); // clean previous listener

    adminSnapshotUnsub = db.collection("admins").doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists && doc.data().role === "admin") {
          console.log("✅ Live verified admin:", user.email);
          showAdminUI();
          removeAdminOverlay();
        } else {
          console.warn("❌ Admin privileges revoked or missing.");
          hideAdminUI();
          removeAdminOverlay();
          alert("Your admin privileges have been revoked.");
          auth.signOut();
          window.location.href = "home.html";
        }
      }, (err) => {
        console.error("Snapshot error:", err);
        hideAdminUI();
        removeAdminOverlay();
      });

  } catch (error) {
    console.error("Verification failed:", error);
    hideAdminUI();
    removeAdminOverlay();
    window.location.href = "home.html";
  }
});

// ============================
//  INITIAL SPINNER ON LOAD
// ============================
window.addEventListener("load", () => {
  hideAdminUI();
  showAdminOverlay();
});
