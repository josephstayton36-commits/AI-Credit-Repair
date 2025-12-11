// Ensure everything wires up after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  wireAskAi();
  wireCreditLawDecoder();
  wireScoreBoostTips();
  wireSnapshotForm();
});

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

    output.innerHTML = `
      <div class="ai-message">
        <p><strong>AI Credit Coach:</strong></p>
        <p>Good question. Here’s how to think about it:</p>
        <ul>
          <li>1️⃣ Pull all 3 reports (Experian, Equifax, TransUnion) so you see the same item everywhere.</li>
          <li>2️⃣ Look for <strong>inaccuracies</strong>: wrong dates, balance, status, or creditor name related to "<em>${escapeHtml(
            question
          )}</em>".</li>
          <li>3️⃣ If anything is inaccurate, incomplete, or cannot be proven, it is a candidate for a <strong>dispute under the FCRA</strong>.</li>
          <li>4️⃣ Never ignore mail related to the account. Track responses and deadlines in writing.</li>
        </ul>
        <p>The best move is: upload your reports, tell us your goal, and we’ll apply the right laws to your exact situation.</p>
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

    const lower = text.toLowerCase();
    let explanation = "";

    if (lower.includes("1681i") || lower.includes("reinvestigation")) {
      explanation = `
        <p><strong>15 U.S.C. 1681i – Reinvestigation:</strong></p>
        <p>When you dispute an item with a credit bureau, this rule says they have to <strong>investigate</strong> your dispute, usually within about 30 days.</p>
        <p>If they can’t properly verify the information with real documentation, they’re supposed to <strong>correct or delete</strong> it.</p>
      `;
    } else if (lower.includes("fdcpa")) {
      explanation = `
        <p><strong>FDCPA – Fair Debt Collection Practices Act:</strong></p>
        <p>This law controls what <strong>debt collectors</strong> are allowed to do. They can’t harass you, lie to you, or threaten illegal actions.</p>
        <p>You also have the right to request <strong>validation</strong> of the debt so they must prove you actually owe it.</p>
      `;
    } else if (lower.includes("fcra")) {
      explanation = `
        <p><strong>FCRA – Fair Credit Reporting Act:</strong></p>
        <p>This law governs how credit bureaus collect and report information. It gives you rights to dispute inaccurate info, limit how long negative items report, and demand accuracy.</p>
      `;
    } else if (lower.includes("statute") || lower.includes("limitations")) {
      explanation = `
        <p><strong>Statute of Limitations:</strong></p>
        <p>This is the time limit a creditor or collector has to legally <strong>sue</strong> you on a debt. It is about lawsuits, not about how long the account can report on your credit.</p>
        <p>Different states have different time limits, and the clock usually starts from your last activity or payment.</p>
      `;
    } else if (lower.includes("method of verification")) {
      explanation = `
        <p><strong>Method of Verification:</strong></p>
        <p>After a dispute, you can ask the bureau how they verified the info. In reality, many times they just rely on automated systems, not detailed proof.</p>
        <p>Requesting the method of verification is a way to pressure them to show they actually checked your dispute properly.</p>
      `;
    } else {
      explanation = `
        <p><strong>Plain-English Translation:</strong></p>
        <p>I don’t recognize that exact phrase, but here’s the rule of thumb: if something on your report is <strong>inaccurate, incomplete, outdated, or can’t be proven</strong>, you have the right to dispute it.</p>
      `;
    }

    result.innerHTML = explanation;
  });
}

// =============== SCORE BOOST TIP OF THE DAY ===============
function wireScoreBoostTips() {
  const btn = document.getElementById("scoreTipBtn");
  const text = document.getElementById("scoreTipText");

  if (!btn || !text) return;

  const tips = [
    "Keep your total credit card usage under about 30% of your limits. Under 10% is ideal for score growth.",
    "Set up autopay for at least the minimum payment so you never miss a due date by accident.",
    "Don’t close your oldest credit card unless you absolutely have to. Age of credit history helps your score.",
    "If you’re rebuilding, a small secured credit card, used lightly and paid in full, can slowly build positive history.",
    "Avoid applying for a ton of new accounts at once. Too many hard inquiries in a short time can drop your score.",
    "Paying down revolving debt (credit cards/lines) usually moves your score more than paying off many installment loans.",
    "Make sure your personal info (name, address, SSN digits) is correct on all 3 bureaus. Bad data can cause problems.",
    "Don’t let unpaid small collections linger. Get a plan—pay for delete where possible or dispute if inaccurate."
  ];

  btn.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    text.textContent = tips[randomIndex];
  });
}

// =============== SNAPSHOT CONTACT FORM ===============
function wireSnapshotForm() {
  const form = document.getElementById("snapshotForm");
  const message = document.getElementById("snapshotMessage");

  if (!form || !message) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.fullName.value.trim() || "there";

    message.textContent =
      `Thanks, ${name}. Your Snapshot request is saved on our side (front-end). ` +
      `Be sure your credit reports are ready to upload with the secure link.`;

    // Simple UX: clear most fields so they know it went through
    form.reset();
  });
}

// =============== HELPER ===============
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
