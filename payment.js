// payment.js
// Submits a payment verification request to Firestore.
// Admin approves by setting users/{uid}.tier = "elite" and paid = true

(function initYear() {
  const y = document.getElementById("year-span");
  if (y) y.textContent = new Date().getFullYear();
})();

function makeCode() {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `AICR-${n}`;
}

let generatedCode = makeCode();

document.addEventListener("DOMContentLoaded", () => {
  const payCodeEl = document.getElementById("payCode");
  const noteEl = document.getElementById("noteCode");
  if (payCodeEl) payCodeEl.textContent = generatedCode;
  if (noteEl) noteEl.value = generatedCode;

  const form = document.getElementById("paymentForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const status = document.getElementById("statusMsg");
    const user = firebase.auth().currentUser;
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    const cashName = document.getElementById("cashName").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const dateSent = document.getElementById("dateSent").value;
    const noteCode = document.getElementById("noteCode").value.trim();
    const extra = document.getElementById("extra").value.trim();

    if (!cashName || !amount || !dateSent || !noteCode) {
      if (status) status.textContent = "Please fill in all required fields.";
      return;
    }

    try {
      if (status) status.textContent = "Submitting…";

      const db = firebase.firestore();
      await db.collection("paymentRequests").add({
        uid: user.uid,
        email: user.email || "",
        cashAppTag: "$Cory12151983",
        cashDisplayName: cashName,
        amount: amount,
        dateSent: dateSent,
        noteCode: noteCode,
        extra: extra,
        status: "pending", // pending | approved | rejected
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      if (status) status.textContent = "✅ Submitted! We’ll approve and unlock Elite ASAP.";
      e.target.reset();
      // regenerate a code for next time
      generatedCode = makeCode();
      const payCodeEl = document.getElementById("payCode");
      const noteEl = document.getElementById("noteCode");
      if (payCodeEl) payCodeEl.textContent = generatedCode;
      if (noteEl) noteEl.value = generatedCode;

    } catch (err) {
      console.error(err);
      if (status) status.textContent = "❌ Error: " + err.message;
    }
  });
});
