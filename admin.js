// admin.js (Approve/Reject Payment Requests + show Users + Uploads)
const db = firebase.firestore();

function btn(label, onclick, danger = false) {
  return `
    <button
      style="
        padding:6px 10px;
        border-radius:8px;
        border:1px solid rgba(255,255,255,.12);
        cursor:pointer;
        font-weight:800;
        margin-right:8px;
        background:${danger ? "rgba(239,68,68,.95)" : "rgba(34,197,94,.95)"};
        color:#020617;">
      ${label}
    </button>
  `.replace("<button", `<button onclick="${onclick}"`);
}

function card(title, bodyHtml) {
  return `
    <div style="border:1px solid rgba(255,255,255,.10); border-radius:14px; padding:14px; margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
        <div style="font-weight:900;">${title}</div>
      </div>
      <div style="margin-top:10px; opacity:.92;">
        ${bodyHtml}
      </div>
    </div>
  `;
}

function kv(k, v) {
  return `<div style="display:flex; justify-content:space-between; gap:14px; padding:8px 10px; border:1px solid rgba(255,255,255,.08); border-radius:10px; margin:8px 0;">
    <div style="opacity:.85;">${k}</div>
    <div style="font-weight:800; word-break:break-word; text-align:right;">${v}</div>
  </div>`;
}

/* =========================
   USERS (latest)
   ========================= */
db.collection("users").orderBy("createdAt", "desc").limit(50).onSnapshot(snap => {
  const box = document.getElementById("usersList");
  if (!box) return;

  if (snap.empty) {
    box.innerHTML = "No users yet.";
    return;
  }

  box.innerHTML = "";
  snap.forEach(doc => {
    const u = doc.data();
    box.innerHTML += card(
      u.email || "(no email)",
      kv("UID", doc.id) +
      kv("Role", u.role || "member") +
      kv("Tier", u.tier || "free") +
      kv("Paid", String(!!u.paid))
    );
  });
});

/* =========================
   UPLOADS (latest)
   ========================= */
db.collection("uploads").orderBy("createdAt", "desc").limit(50).onSnapshot(snap => {
  const box = document.getElementById("uploadsList");
  if (!box) return;

  if (snap.empty) {
    box.innerHTML = "No uploads yet.";
    return;
  }

  box.innerHTML = "";
  snap.forEach(doc => {
    const up = doc.data();
    const link = up.downloadURL
      ? `<a href="${up.downloadURL}" target="_blank" rel="noopener noreferrer">Open file</a>`
      : "(no link)";

    box.innerHTML += card(
      up.fileName || "(no filename)",
      kv("Owner Email", up.email || "(unknown)") +
      kv("Owner UID", up.uid || "(unknown)") +
      kv("Path", up.storagePath || "(none)") +
      kv("Link", link)
    );
  });
});

/* =========================
   PAYMENT REQUESTS (Approve / Reject)
   ========================= */
db.collection("paymentRequests").orderBy("createdAt", "desc").limit(100).onSnapshot(snap => {
  const box = document.getElementById("paymentsList");
  if (!box) return;

  if (snap.empty) {
    box.innerHTML = "No payment requests yet.";
    return;
  }

  box.innerHTML = "";
  snap.forEach(doc => {
    const p = doc.data();
    const status = p.status || "pending";

    let actionsHtml = `<strong>Status:</strong> ${status}`;
    if (status === "pending") {
      actionsHtml = `
        ${btn("Approve", `approvePayment('${doc.id}','${p.uid}')`)}
        ${btn("Reject", `rejectPayment('${doc.id}')`, true)}
      `;
    }

    box.innerHTML += card(
      `Payment — ${p.email || "(no email)"}`,
      kv("Cash App Tag", p.cashAppTag || "$Cory12151983") +
      kv("Cash Display Name", p.cashDisplayName || "(unknown)") +
      kv("Amount", p.amount != null ? `$${p.amount}` : "(unknown)") +
      kv("Date Sent", p.dateSent || "(unknown)") +
      kv("Code / Note", p.noteCode || "(none)") +
      kv("Extra", p.extra || "(none)") +
      `<div style="margin-top:10px;">${actionsHtml}</div>`
    );
  });
});

/* =========================
   ACTIONS
   ========================= */
async function approvePayment(paymentId, userId) {
  if (!confirm("Approve this payment and upgrade user to Elite?")) return;

  try {
    // Upgrade user
    await db.collection("users").doc(userId).set({
      tier: "elite",
      paid: true,
      upgradedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Mark payment approved
    await db.collection("paymentRequests").doc(paymentId).set({
      status: "approved",
      reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    alert("✅ Approved. User upgraded to Elite.");
  } catch (err) {
    console.error(err);
    alert("❌ Error approving: " + err.message);
  }
}

async function rejectPayment(paymentId) {
  if (!confirm("Reject this payment request?")) return;

  try {
    await db.collection("paymentRequests").doc(paymentId).set({
      status: "rejected",
      reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    alert("❌ Rejected.");
  } catch (err) {
    console.error(err);
    alert("❌ Error rejecting: " + err.message);
  }
}

/* expose to onclick */
window.approvePayment = approvePayment;
window.rejectPayment = rejectPayment;
