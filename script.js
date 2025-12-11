// =============== SITE CONFIG (from your JSON) ===============
const SITE_CONFIG = {
  brandName: "AI Credit Repair",
  tagline: "Smart Disputes. Real Results.",

  creditLaws: [
    {
      title: "FCRA §609",
      summary: "You can request all information a bureau has on you, including the source of each account.",
      power: "Use this to force bureaus to prove an account is valid or delete it."
    },
    {
      title: "FCRA §611",
      summary: "You have the right to dispute any inaccurate, incomplete, or unverifiable information.",
      power: "If they can’t verify it in 30 days, it must be corrected or deleted."
    },
    {
      title: "FDCPA",
      summary: "Debt collectors must follow strict rules when trying to collect.",
      power: "Great for attacking collections that use illegal tactics or bad notices."
    }
  ],

  aiResponses: [
    "Your credit is fixable. What matters is the moves you make from today forward.",
    "If it’s not verified, it doesn’t belong on your report. Let’s challenge it.",
    "AI Credit Repair uses the law + strategy. We don’t guess—we attack.",
    "Small, smart moves stack up. Your future score will not look like your past."
  ],

  scoreBoostTips: [
    "Keep credit card utilization under 10% for the best score impact.",
    "Pay before the statement date, not just the due date.",
    "Dispute any account that is inaccurate, incomplete, or unverifiable.",
    "Avoid closing old positive accounts—they help your age of credit."
  ]
};

// Run wiring once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  applyBranding();
  wireAskAi();
  wireCreditLawDecoder();
  wireScoreBoostTips();
  wireSnapshotForm();
  wireSnapshotAccess();
  setYearSpan();
});

// =============== BRAND NAME + TAGLINE ===============
function applyBranding() {
  const brandNameEl = document.getElementById("brandName");
  const taglineEl = document.getElementById("brandTagline");

  if (brandNameEl) brandNameEl.textContent = SITE_CONFIG.brandName;
  if (taglineEl) taglineEl.textContent = SITE_CONFIG.tagline;
}

// =============== ASK AI ABOUT CREDIT ===============
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
        "<p><strong>Tip:</strong> Ask something specific like “How do I deal with an old charge-off?”</p>";
      return;
    }

    const aiLine = randomFromArray(SITE_CONFIG.aiResponses);

    output.innerHTML = `
      <div class="ai-message">
        <p><strong>AI Credit Coach:</strong></p>
        <p>${escapeHtml(aiLine)}</p>
        <p>Here’s how to think about your question about "<em>${escapeHtml(
          question
        )}</em>":</p>
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

// =============== CREDIT LAW DECODER ===============
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

// =============== SCORE BOOST TIP OF THE DAY ===============
function wireScoreBoostTips() {
  const btn = document.getElementById("scoreTipBtn");
  const text = document.getElementById("scoreTipText");

  if (!btn || !text) return;

  btn.addEventListener("click", () => {
    const tip = randomFromArray(SITE_CONFIG.scoreBoostTips);
    text.textContent = tip;
  });
}

// =============== SNAPSHOT CONTACT FORM (on index page) ===============
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
  const unlockBtn = document.getElementById("unlockSnapshotBtn");
  const toggleBtn = document.getElementById("alreadyPaidToggle");
  const form = document.getElementById("accessForm");
  const codeInput = document.getElementById("accessCode");
  const error = document.getElementById("accessError");
  const box = document.getElementById("fullSnapshotBox");

  // Already paid? Show/hide access code form
  if (toggleBtn && form) {
    toggleBtn.addEventListener("click", () => {
      form.classList.toggle("hidden");
      if (error) error.textContent = "";
    });
  }

  // Fake access code unlock (front-end only)
  if (form && codeInput && error && box) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = codeInput.value.trim();

      // NOTE: Front-end demo only – in real life this should be validated on the server.
      if (code === "ELITE100") {
        box.classList.remove("blurred");
        const overlay = box.querySelector(".locked-overlay");
        if (overlay) overlay.remove();
        error.textContent = "";
      } else {
        error.textContent =
          "Invalid access code. Double-check your email or payment receipt.";
      }
    });
  }

  // Unlock button – placeholder for real checkout
  if (unlockBtn) {
    unlockBtn.addEventListener("click", () => {
      alert(
        "This is where you’ll link to your real checkout (Cash App, Stripe, etc.). For now, this is just a preview."
      );
    });
  }
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
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function randomFromArray(arr) {
  if (!arr || !arr.length) return "";
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}
