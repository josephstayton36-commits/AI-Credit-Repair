// admin.js (Fintech UI + Users + Uploads + Payment Approve/Reject)
const db = firebase.firestore();

/* =========================================================
   UI helpers (no inline style, uses style.css classes)
========================================================= */

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function pill(text) {
  return `<span class="badge">${escapeHtml(text)}</span>`;
}

function kvRow(k, vHtml) {
  return `
    <div class="panel panel-pad" style="padding:10px 12px; margin:10px 0;">
      <div class="spread">
        <div class="small">${escapeHtml(k)}</div>
        <div style="font-weight:800; text-align:right; word-break:break-word;">${vHtml}</div>
      </div>
    </div>
  `;
}

function cardBlock(title, rightHtml, bodyHtml) {
  return `
    <section class="card card-pad" style="margin-bottom:14px;">
      <div class="spread">
        <h3 style="margin:0;">${escapeHtml(title)}</h3>
        <div class="row" style="gap:10px;">${rightHtml || ""}</div>
      </div>
      <div class="divider"></div>
      <div>${bodyHtml || ""}</div>
    </section>
  `;
}

function actionsRow(buttonsHtml) {
  return `<div class="row" style="margin-top:12px; gap:10px; flex-wrap:wrap;">${buttonsHtml}</div>`;
}

/* =========================================================
   USERS (latest)
   - Adds quick role/tier toggles (optional but powerful)
========================================================= */

db.collection("users").orderBy("createdAt", "desc").limit(50).onSnapshot((snap) => {
  const box = document.getElementById("usersList");
  if (!box) return;

  if (snap.empty) {
    box.innerHTML = `<div class="small">No users yet.</div>`;
    return;
  }

  let html = "";
  snap.forEach((doc) => {
    const u = doc.data() || {};
    const email = u.email || "(no email)";
    const role = u.role || "member";
    const tier = u.tier || "free";
    const paid = !!u.paid;

    const right = pill(`${role} • ${tier}`);

    const body =
      kvRow("UID", `<code>${escapeHtml(doc.id)}</code>`) +
      kvRow("Email", escapeHtml(email)) +
      kvRow("Role", escapeHtml(role)) +
      kvRow("Tier", escapeHtml(tier)) +
      kvRow("Paid", paid ? pill("true") : pill("false")) +
      actionsRow(`
        <button class="btn-primary" onclick="setUserTier('${doc.id}','elite')">Make Elite</button>
        <button class="btn btn-ghost" onclick="setUserTier('${doc.id}','free')">Make Free</button>
        <button class="btn-primary" onclick="setUserRole('${doc.id}','admin')">Make Admin</button>
        <button class="btn btn-ghost" onclick="setUserRole('${doc.id}','member')">Make Member</button>
      `);

    html += cardBlock(email, right, body);
  });

  box.innerHTML = html;
});

/* =========================================================
   UPLOADS (latest)
========================================================= */

db.collection("uploads").orderBy("createdAt", "desc").limit(50).onSnapshot((snap) => {
  const box = document.getElementById("uploadsList");
  if (!box) return;

  if (snap.empty) {
    box.innerHTML = `<div class="small">No uploads yet.</div>`;
    return;
  }

  let html = "";
  snap.forEach((doc) => {
    const up = doc.data() || {};
    const fileName = up.fileName || "(no filename)";
    const email = up.email || "(unknown)";
    const uid = up.uid || "(unknown)";
    const path = up.storagePath || "(none)";
    const link = up.downloadURL
      ? `<a class="btn btn-ghost" href="${escapeHtml(up.downloadURL)}" target="_blank" rel="noopener noreferrer">Open file</a>`
      : `<span class="small">(no link)</span>`;

    const right = pill("upload");

    const body =
      kvRow("Owner Email", escapeHtml(email)) +
      kvRow("Owner UID", `<code>${escapeHtml(uid)}</code>`) +
      kvRow("Path", `<code>${escapeHtml(path)}</code>`) +
      actionsRow(link);

    html += cardBlock(fileName, right, body);
  });

  box.innerHTML = html;
});

/* =========================================================
   PAYMENT REQUESTS (Approve / Reject)
========================================================= */

db.collection("paymentRequests").orderBy("createdAt", "desc").limit(100).onSnapshot((snap) => {
  const box = document.getElementById("paymentsList");
  if (!box) return;

  if (snap.empty) {
    box.innerHTML = `<div class="small">No payment requests yet.</div>`;
    return;
  }

  let html = "";
  snap.forEach((doc) => {
    const p = doc.data() || {};
    const email = p.email || "(no email)";
    const status = p.status || "pending";

    const right = pill(status);

    let actions = `<div class="small">Status: <strong>${escapeHtml(status)}</strong></div>`;
    if (status === "pending") {
      actions = actionsRow(`
        <button class="btn-primary" onclick="approvePayment('${doc.id}','${escapeHtml(p.uid || "")}','${escapeHtml(email)}')">Approve</button>
        <button class="btn-danger" onclick="rejectPayment('${doc.id}','${escapeHtml(email)}')">Reject</button>
      `);
    }

    const body =
      kvRow("Cash App Tag", escapeHtml(p.cashAppTag || "$Cory12151983")) +
      kvRow("Cash Display Name", escapeHtml(p.cashDisplayName || "(unknown)")) +
      kvRow("Amount", p.amount != null ? `$${escapeHtml(p.amount)}` : "(unknown)") +
      kvRow("Date Sent", escapeHtml(p.dateSent || "(unknown)")) +
      kvRow("Code / Note", escapeHtml(p.noteCode || "(none)")) +
      kvRow("Extra", escapeHtml(p.extra || "(none)")) +
      `<div style="margin-top:10px;">${actions}</div>`;

    html += cardBlock(`Payment — ${email}`, right, body);
  });

  box.innerHTML = html;
});

/* =========================================================
   ACTIONS
========================================================= */

async function approvePayment(paymentId, userId, email = "") {
  if (!userId) return alert("Missing userId on payment request.");
  if (!confirm(`Approve this payment and upgrade ${email || "user"} to Elite?`)) return;

  try {
    await db.collection("users").doc(userId).set(
      {
        tier: "elite",
        paid: true,
        upgradedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await db.collection("paymentRequests").doc(paymentId).set(
      {
        status: "approved",
        reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    alert("✅ Approved. User upgraded to Elite.");
  } catch (err) {
    console.error(err);
    alert("❌ Error approving: " + err.message);
  }
}

async function rejectPayment(paymentId, email = "") {
  if (!confirm(`Reject this payment request${email ? ` for ${email}` : ""}?`)) return;

  try {
    await db.collection("paymentRequests").doc(paymentId).set(
      {
        status: "rejected",
        reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    alert("❌ Rejected.");
  } catch (err) {
    console.error(err);
    alert("❌ Error rejecting: " + err.message);
  }
}

/* Optional: quick tier/role controls */
async function setUserTier(uid, tier) {
  if (!confirm(`Set user tier to "${tier}"?`)) return;
  try {
    await db.collection("users").doc(uid).set(
      {
        tier,
        paid: tier === "elite",
        tierUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    alert(`✅ Tier updated to ${tier}`);
  } catch (err) {
    console.error(err);
    alert("❌ Error updating tier: " + err.message);
  }
}

async function setUserRole(uid, role) {
  if (!confirm(`Set user role to "${role}"?`)) return;
  try {
    await db.collection("users").doc(uid).set(
      {
        role,
        roleUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    alert(`✅ Role updated to ${role}`);
  } catch (err) {
    console.error(err);
    alert("❌ Error updating role: " + err.message);
  }
}

/* expose to onclick */
window.approvePayment = approvePayment;
window.rejectPayment = rejectPayment;
window.setUserTier = setUserTier;
window.setUserRole = setUserRole;
