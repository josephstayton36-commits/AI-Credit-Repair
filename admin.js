// admin.js
const db = firebase.firestore();

function btn(label, onclick, danger = false) {
  return `
    <button
      style="
        padding:6px 10px;
        border-radius:6px;
        border:none;
        cursor:pointer;
        font-weight:700;
        margin-right:6px;
        background:${danger ? "#ef4444" : "#22c55e"};
        color:#020617;"
      onclick="${onclick}">
      ${label}
    </button>
  `;
}

function card(title, rows) {
  return `
    <div style="
      border:1px solid rgba(255,255,255,.1);
      border-radius:12px;
      padding:14px;
      margin-bottom:14px;">
      <h3 style="margin-top:0">${title}</h3>
      ${rows}
    </div>
  `;
}

/* =========================
   PAYMENT REQUESTS
   ========================= */

function renderPayment(doc) {
  const p = doc.data();

  const actions =
    p.status === "pending"
      ? btn(
          "Approve",
          `approvePayment('${doc.id}','${p.uid}')`
        ) +
        btn(
          "Reject",
          `rejectPayment('${doc.id}')`,
          true
        )
      : `<strong>Status:</strong> ${p.status}`;

  return card(
    `Payment — ${p.email || "(no email)"}`,
    `
    <p><strong>Cash App:</strong> ${p.cashDisplayName}</p>
    <p><strong>Amount:</strong> $${p.amount}</p>
    <p><strong>Date Sent:</strong> ${p.dateSent}</p>
    <p><strong>Code:</strong> ${p.noteCode}</p>
    <p>${actions}</p>
    `
  );
}

db.collection("paymentRequests")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    const box = document.getElementById("paymentsList");
    if (!box) return;

    if (snapshot.empty) {
      box.innerHTML = "No payment requests.";
      return;
    }

    box.innerHTML = "";
    snapshot.forEach(doc => {
      box.innerHTML += renderPayment(doc);
    });
  });

/* =========================
   ACTIONS
   ========================= */

async function approvePayment(paymentId, userId) {
  if (!confirm("Approve this payment and upgrade to Elite?")) return;

  try {
    // 1) Upgrade user
    await db.collection("users").doc(userId).set(
      {
        tier: "elite",
        paid: true,
        upgradedAt: firebase.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    // 2) Mark payment approved
    await db.collection("paymentRequests").doc(paymentId).set(
      {
        status: "approved",
        reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    alert("✅ User upgraded to Elite.");
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
}

async function rejectPayment(paymentId) {
  if (!confirm("Reject this payment request?")) return;

  try {
    await db.collection("paymentRequests").doc(paymentId).set(
      {
        status: "rejected",
        reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    alert("❌ Payment rejected.");
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
}
