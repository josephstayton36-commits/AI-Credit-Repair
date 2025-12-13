// ==============================
// AI CREDIT REPAIR — script.js
// Fixed: loadContentConfig placement + single DOMContentLoaded
// ==============================


// =============== SITE CONFIG ===============
const SITE_CONFIG = {
  brandName: "AI Credit Repair",
  tagline: "Smart Disputes. Real Results.",

  creditLaws: [
    {
      title: "FCRA §609",
      summary:
        "You can request all information a bureau has on you, including the source of each account.",
      power:
        "Use this to force bureaus to prove an account is valid or delete it.",
    },
    {
      title: "FCRA §611",
      summary:
        "You have the right to dispute any inaccurate, incomplete, or unverifiable information.",
      power:
        "If they can’t verify it in 30 days, it must be corrected or deleted.",
    },
    {
      title: "FDCPA",
      summary:
        "Debt collectors must follow strict rules when trying to collect.",
      power:
        "Great for attacking collections that use illegal tactics or bad notices.",
    },
  ],

  aiResponses: [
    "Your credit is fixable. What matters is the moves you make from today forward.",
    "If it’s not verified, it doesn’t belong on your report. Let’s challenge it.",
    "AI Credit Repair uses the law + strategy. We don’t guess—we attack.",
    "Small, smart moves stack up. Your future score will not look like your past.",
  ],

  scoreBoostTips: [
    "Keep credit card utilization under 10% for the best score impact.",
    "Pay before the statement date, not just the due date.",
    "Dispute any account that is inaccurate, incomplete, or unverifiable.",
    "Avoid closing old positive accounts—they help your age of credit.",
  ],
};


// =============== OPTIONAL CONTENT.JSON LOADER ===============
// This lets you override brandName/tagline/laws/tips/responses from content.json
async function loadContentConfig() {
  try {
    const res = await fetch("content.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load content.json");
    const data = await res.json();

    // Brand
    const bn = document.getElementById("brandName");
    const bt = document.getElementById("brandTagline");
    if (bn) bn.textContent = data.brandName || SITE_CONFIG.brandName;
    if (bt) bt.textContent = data.tagline || SITE_CONFIG.tagline;

    // Credit laws (optional render if container exists)
    const lawsBox = document.getElementById("creditLawsList");
    if (lawsBox && Array.isArray(data.creditLaws)) {
      lawsBox.innerHTML = data.creditLaws.map(law => `
        <div class="law-item">
          <h3>${law.title}</h3>
          <p class="muted">${law.summary}</p>
          <p><strong>Power Move:</strong> ${law.power}</p>
        </div>
      `).join("");
    }

    // Score tip button (override tips)
    const tipBtn = document.getElementById("scoreTipBtn");
    const tipText = document.getElementById("scoreTipText");
    if (tipBtn && tipText && Array.isArray(data.scoreBoostTips)) {
      tipBtn.addEventListener("click", () => {
        const tip = data.scoreBoostTips[Math.floor(Math.random() * data.scoreBoostTips.length)];
        tipText.textContent = tip;
      });
    }

    // Ask AI fallback (override responses)
    const askForm = document.getElementById("askAiForm");
    const askInput = document.getElementById("askAiInput");
    const askOut = document.getElementById("askAiResponse");
    if (askForm && askInput && askOut && Array.isArray(data.aiResponses)) {
      askForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const reply = data.aiResponses[Math.floor(Math.random() * data.aiResponses.length)];
        askOut.innerHTML = `<p>${reply}</p>`;
      });
    }

  } catch (err) {
    // If DevTools is blocked, this still won't show — but it prevents a hard crash.
    // You can temporarily uncomment next line to see errors as an alert:
    // alert("Content load error: " + err.message);
    console.error(err);
  }
}


// =============== GLOBAL ACCESS CODE (OPTION A) ===============
const ACCESS_CODE = "ELITE100"; // universal code you give after Cash App payment
const ACCESS_KEY = "aiCreditPaidAccess"; // stored in localStorage


// ✅ ONE AND ONLY ONE STARTUP BLOCK
document.addEventListener("DOMContentLoaded", () => {
  // optional: load content.json overrides (won't crash if missing)
  loadContentConfig();

  applyBranding();
  wireAskAi();
  wireCreditLawDecoder();
  wireScoreBoostTips();
  wireSnapshotForm();
  wireSnapshotAccess();
  wireUploadAccess();
  wirePricingChat();
  wireFloatingChat();
  setYearSpan();
  applyAccessLockState(); // apply lock/unlock after DOM is ready
});


// =============== BRAND NAME + TAGLINE ===============
function applyBranding() {
  const brandNameEl = document.getElementById("brandName");
  const taglineEl = document.getElementById("brandTagline");

  if (brandNameEl) brandNameEl.textContent = SITE_CONFIG.brandName;
  if (taglineEl) taglineEl.textContent = SITE_CONFIG.tagline;
}


// =============== ACCESS HELPERS ===============
function isAccessUnlocked() {
  return localStorage.getItem(ACCESS_KEY) === "true";
}

function unlockAccess() {
  localStorage.setItem(ACCESS_KEY, "true");
  applyAccessLockState();
}

// Runs on page load and whenever we unlock
function applyAccessLockState() {
  const unlocked = isAccessUnlocked();

  // Upload page lock/unlock
  const uploadLocked = document.getElementById("uploadLocked");
  const uploadUnlocked = document.getElementById("uploadUnlocked");
  if (uploadLocked && uploadUnlocked) {
    if (unlocked) {
      uploadLocked.classList.add("hidden");
      uploadUnlocked.classList.remove("hidden");
    } else {
      uploadLocked.classList.remove("hidden");
      uploadUnlocked.classList.add("hidden");
    }
  }

  // Snapshot page lock/unlock
  const fullSnapshotBox = document.getElementById("fullSnapshotBox");
  if (fullSnapshotBox) {
    if (unlocked) {
      fullSnapshotBox.classList.remove("blurred");
      const overlay = fullSnapshotBox.querySelector(".locked-overlay");
      if (overlay) overlay.remove();
    }
  }
}


// =============== ASK AI ABOUT CREDIT (index) ===============
function wireAskAi() {
  const form = document.getElementById("askAiForm");
  const input = document.getElementById("askAiInput");
  const output = document.getElementById("askAiResponse");

  if (!form || !input || !output) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const question = input.value.trim();
    if (!question) {
      output.innerHTML =
        '<p><strong>Tip:</strong> Ask something specific like “How do I deal with an old charge-off?”</p>';
      return;
    }

    const aiLine = randomFromArray(SITE_CONFIG.aiResponses);

    output.innerHTML = `
      <div class="ai-message">
        <p><strong>AI Credit Coach:</strong></p>
        <p>${escapeHtml(aiLine)}</p>
        <p>Here’s how to think about your question about "<em>${escapeHtml(question)}</em>":</p>
        <ul>
          <li>1️⃣ Pull all 3 reports (Experian, Equifax, TransUnion) so you see the same item everywhere.</li>
          <li>2️⃣ Look for <strong>inaccuracies</strong>: wrong dates, balance, status, or creditor name.</li>
          <li>3️⃣ If it’s inaccurate, incomplete, or can’t be verified with proof, it’s a candidate for attack under the FCRA/FDCPA.</li>
          <li>4️⃣ Track every dispute in writing and watch the 30-day investigation window.</li>
        </ul>
        <p>Upload your reports, tell us your goal, and we’ll apply the right laws and strategy to your exact situation.</p>
      </div>
    `;
  });
}


// =============== CREDIT LAW DECODER (index) ===============
function wireCreditLawDecoder() {
  const input = document.getElementById("creditLawInput");
  const btn = document.getElementById("creditLawBtn");
  const result = document.getElementById("creditLawResult");

  if (!input || !btn || !result) return;

  btn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) {
      result.innerHTML =
        "<p>Type the law, section, or phrase you’re confused about and we’ll translate it.</p>";
      return;
    }

    const law = findMatchingLaw(text);
    if (law) {
      result.innerHTML = `
        <p><strong>${escapeHtml(law.title)}</strong></p>
        <p>${escapeHtml(law.summary)}</p>
        <p><strong>How to use it:</strong> ${escapeHtml(law.power)}</p>
      `;
    } else {
      result.innerHTML = `
        <p><strong>Plain-English Translation:</strong></p>
        <p>If something on your report is <strong>inaccurate, incomplete, outdated, or can’t be proven</strong>, it’s not supposed to be there.</p>
        <p>We use the FCRA, FDCPA, and related laws to force bureaus and collectors to either prove it or remove it.</p>
      `;
    }
  });
}

function findMatchingLaw(query) {
  const lower = query.toLowerCase();

  for (const law of SITE_CONFIG.creditLaws) {
    const titleLower = law.title.toLowerCase();
    if (
      lower.includes(titleLower) ||
      lower.includes(titleLower.replace(/\s/g, "")) ||
      (lower.includes("609") && law.title.includes("609")) ||
      (lower.includes("611") && law.title.includes("611")) ||
      (lower.includes("fdcpa") && titleLower.includes("fdcpa")) ||
      (lower.includes("fcra") && titleLower.includes("fcra"))
    ) {
      return law;
    }
  }
  return null;
}


// =============== SCORE BOOST TIP (index) ===============
function wireScoreBoostTips() {
  const btn = document.getElementById("scoreTipBtn");
  const text = document.getElementById("scoreTipText");

  if (!btn || !text) return;

  btn.addEventListener("click", () => {
    const tip = randomFromArray(SITE_CONFIG.scoreBoostTips);
    text.textContent = tip;
  });
}


// =============== SNAPSHOT REQUEST FORM (index) ===============
function wireSnapshotForm() {
  const form = document.getElementById("snapshotForm");
  const message = document.getElementById("snapshotMessage");

  if (!form || !message) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.fullName?.value.trim() || "there";

    message.textContent =
      `Thanks, ${name}. Your Snapshot request is saved on our side (front-end). ` +
      `Be sure your credit reports are ready to upload with the secure link.`;

    form.reset();
  });
}


// =============== SNAPSHOT UNLOCK (snapshot.html) ===============
function wireSnapshotAccess() {
  const toggleBtn = document.getElementById("alreadyPaidToggle");
  const form = document.getElementById("accessForm");
  const codeInput = document.getElementById("accessCode");
  const error = document.getElementById("accessError");

  if (toggleBtn && form) {
    toggleBtn.addEventListener("click", () => {
      form.classList.toggle("hidden");
      if (error) error.textContent = "";
    });
  }

  if (form && codeInput && error) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = codeInput.value.trim();

      if (code === ACCESS_CODE) {
        unlockAccess(); // unlock globally (snapshot + upload)
        error.textContent = "";
      } else {
        error.textContent =
          "Invalid access code. Double-check your email or payment receipt.";
      }
    });
  }
}


// =============== UPLOAD UNLOCK (upload.html) ===============
function wireUploadAccess() {
  const form = document.getElementById("uploadAccessForm");
  const codeInput = document.getElementById("uploadAccessCode");
  const error = document.getElementById("uploadAccessError");

  if (!form || !codeInput || !error) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = codeInput.value.trim();

    if (code === ACCESS_CODE) {
      unlockAccess();
      error.textContent = "";
    } else {
      error.textContent =
        "Invalid access code. Check the code we sent you after payment.";
    }
  });
}


// =============== PRICING CHAT (optional, pricing.html) ===============
function wirePricingChat() {
  const form = document.getElementById("pricing-chat-form");
  const input = document.getElementById("pricing-chat-input");
  const windowEl = document.getElementById("pricing-chat-window");

  if (!form || !input || !windowEl) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendChatMessage(windowEl, "user", text);
    const reply = getPlanSuggestion(text);
    appendChatMessage(windowEl, "bot", reply);

    input.value = "";
    windowEl.scrollTop = windowEl.scrollHeight;
  });
}


// =============== FLOATING CHAT (optional, pricing.html) ===============
function wireFloatingChat() {
  const toggle = document.getElementById("floating-chat-toggle");
  const panel = document.getElementById("floating-chat-panel");
  const closeBtn = document.getElementById("close-floating-chat");
  const form = document.getElementById("floating-chat-form");
  const input = document.getElementById("floating-chat-input");
  const body = document.getElementById("floating-chat-body");

  if (!toggle || !panel || !form || !input || !body) return;

  toggle.addEventListener("click", () => {
    panel.classList.add("open");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      panel.classList.remove("open");
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendChatMessage(body, "user", text);
    const reply = getPlanSuggestion(text);
    appendChatMessage(body, "bot", reply);

    input.value = "";
    body.scrollTop = body.scrollHeight;
  });
}

function getPlanSuggestion(text) {
  const lower = text.toLowerCase();
  let suggestion = "";

  if (lower.includes("home") || lower.includes("house") || lower.includes("mortgage")) {
    suggestion =
      "For a home goal in the next 6–18 months, AI Core or AI Elite usually makes sense. Core gives you structure and letters. Elite adds tighter check-ins and scripts for tough calls.";
  } else if (lower.includes("car") || lower.includes("auto")) {
    suggestion =
      "If you’re mainly trying to get approved for a car, AI Starter or AI Core is usually enough. Focus on cleaning up a few key negatives and lowering utilization.";
  } else if (lower.includes("apartment") || lower.includes("rent") || lower.includes("lease")) {
    suggestion =
      "For apartment or rental approvals, AI Starter is a good entry point if you’re a DIY type. If you want more structure and letter help, AI Core is safer.";
  } else if (lower.includes("budget") || lower.includes("money") || lower.includes("broke")) {
    suggestion =
      "If money is tight, start with AI Starter and treat it like a gym membership for your credit. You can always upgrade to AI Core later once you see movement.";
  } else {
    suggestion =
      "Quick rule of thumb:\n" +
      "• AI Starter – best if you’re a DIY person and just need guidance.\n" +
      "• AI Core – best if you’re busy and want clearer structure and letters.\n" +
      "• AI Elite – best if you have big goals and tight timelines.";
  }

  return suggestion;
}


// =============== FOOTER YEAR ===============
function setYearSpan() {
  const span = document.getElementById("year-span");
  if (!span) return;
  const year = new Date().getFullYear();
  span.textContent = year;
}


// =============== HELPERS ===============
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function randomFromArray(arr) {
  if (!arr || !arr.length) return "";
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function appendChatMessage(container, role, text) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("chat-message");
  wrapper.classList.add(role === "user" ? "user" : "bot");

  const p = document.createElement("p");
  p.textContent = text;
  wrapper.appendChild(p);

  container.appendChild(wrapper);
}
