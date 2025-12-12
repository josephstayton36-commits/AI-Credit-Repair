// admin.js
// NOTE: auth.js already blocks non-admins from viewing admin.html.

const db = firebase.firestore();

function cardRow(title, value) {
  return `
    <div style="display:flex; justify-content:space-between; gap:12px; padding:10px 12px; border:1px solid rgba(255,255,255,0.08); border-radius:10px; margin-bottom:10px;">
      <div style="opacity:.85">${title}</div>
      <div style="font-weight:700; text-align:right; word-break:break-word;">${value}</div>
    </div>
  `;
}

function renderUser(doc) {
  const u = doc.data();
  return `
    <div style="padding:14px; border:1px solid rgba(255,255,255,0.08); border-radius:12px; margin-bottom:12px;">
      <div style="font-weight:800; margin-bottom:6px;">${u.email || "(no email)"}</div>
      ${cardRow("UID", doc.id)}
      ${cardRow("Role", u.role || "member")}
      ${cardRow("Tier", u.tier || "free")}
      ${cardRow("Paid", String(!!u.paid))}
    </div>
  `;
}

function renderUpload(doc) {
  const up = doc.data();
  const link = up.downloadURL
    ? `<a href="${up.downloadURL}" target="_blank" rel="noopener noreferrer">Open file</a>`
    : "(no link)";

  return `
    <div style="padding:14px; border:1px solid rgba(255,255,255,0.08); border-radius:12px; margin-bottom:12px;">
      <div style="font-weight:800; margin-bottom:6px;">${up.fileName || "(no filename)"}</div>
      ${cardRow("Owner Email", up.email || "(unknown)")}
      ${cardRow("Owner UID", up.uid || "(unknown)")}
      ${cardRow("Path", up.storagePath || "(none)")}
      ${cardRow("Link", link)}
    </div>
  `;
}

// Live updates
db.collection("users").orderBy("createdAt", "desc").limit(50).onSnapshot(snap => {
  const box = document.getElementById("usersList");
  if (!box) return;

  if (snap.empty) {
    box.innerHTML = "No users yet.";
    return;
  }

  box.innerHTML = "";
  snap.forEach(doc => (box.innerHTML += renderUser(doc)));
});

db.collection("uploads").orderBy("createdAt", "desc").limit(50).onSnapshot(snap => {
  const box = document.getElementById("uploadsList");
  if (!box) return;

  if (snap.empty) {
    box.innerHTML = "No uploads yet.";
    return;
  }

  box.innerHTML = "";
  snap.forEach(doc => (box.innerHTML += renderUpload(doc)));
});
