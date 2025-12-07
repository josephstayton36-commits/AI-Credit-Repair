// =========================
// BASIC UTILITIES
// =========================

// Smooth scroll for internal links
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href || href === "#") return;

  const target = document.querySelector(href);
  if (!target) return;

  e.preventDefault();
  window.scrollTo({
    top: target.offsetTop - 80,
    behavior: "smooth",
  });
});

// Set current year in footer
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year-span");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// =========================
// HERO CHAT (INLINE)
// =========================

(function setupHeroChat() {
  const chatWindow = document.getElementById("chat-window");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");

  if (!chatWindow || !chatForm || !chatInput) return;

  function appendMessage(text, sender = "bot") {
    const msg = document.createElement("div");
    msg.className = `chat-message ${sender}`;
    msg.innerHTML = `<p>${text}</p>`;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function simulateAIResponse(userText) {
    // NOTE:
    // This is a placeholder. In production, you will send
    // `userText` to your secure backend (Node, Python, etc.)
    // and call OpenAI or another LLM from there.
    const templates = [
      "Great question. First, pull all three of your reports. Look for anything that’s inaccurate, outdated, or incomplete. Those are your priority items for disputes.",
      "In general, on-time payments, lower utilization, and a clean mix of accounts move the needle most. Late payments and high balances keep scores stuck.",
      "If an account truly isn’t yours, you’ll want to dispute it with both the bureaus and the creditor, and request documentation that proves you’re responsible for the debt.",
      "Every situation is different, but I can outline which items are most harmful and where to start. Focus on errors and outdated negatives first.",
    ];

    const reply =
      templates[Math.floor(Math.random() * templates.length)] +
      " (This is general education only. For legal or tax questions, talk to a licensed professional.)";

    setTimeout(() => appendMessage(reply, "bot"), 600);
  }

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    chatInput.value = "";
    simulateAIResponse(text);
  });
})();

// =========================
// FLOATING CHAT WIDGET
// =========================

(function setupFloatingChat() {
  const toggleBtn = document.getElementById("floating-chat-toggle");
  const panel = document.getElementById("floating-chat-panel");
  const closeBtn = document.getElementById("close-floating-chat");
  const body = document.getElementById("floating-chat-body");
  const form = document.getElementById("floating-chat-form");
  const input = document.getElementById("floating-chat-input");

  if (!toggleBtn || !panel || !body || !form || !input) return;

  function openChat() {
    panel.classList.add("open");
  }

  function closeChat() {
    panel.classList.remove("open");
  }

  function appendMessage(text, sender = "bot") {
    const msg = document.createElement("div");
    msg.className = `chat-message ${sender}`;
    msg.innerHTML = `<p>${text}</p>`;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function simulateAIResponse(userText) {
    const templates = [
      "Thanks for sharing that. First question: are the items you’re worried about accurate, or do you believe they’re errors?",
      "Step one is always to get current reports from all three bureaus. Step two is to separate true errors from accurate but negative items.",
      "For late payments, I can suggest a goodwill or correction strategy. For collections, it might be more about validation and negotiation.",
      "I can help you map out what to dispute, what to negotiate, and what to rebuild over the next 3–6 months.",
    ];

    const reply =
      templates[Math.floor(Math.random() * templates.length)] +
      " I’m here to give you a high-level game plan, not legal or tax advice.";

    setTimeout(() => appendMessage(reply, "bot"), 700);
  }

  toggleBtn.addEventListener("click", openChat);
  if (closeBtn) closeBtn.addEventListener("click", closeChat);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";
    simulateAIResponse(text);
  });

  // Also hook hero buttons to open the floating chat
  const openChatBtn = document.getElementById("open-chat-btn");
  const openChatBtn2 = document.getElementById("open-chat-btn-2");

  if (openChatBtn) openChatBtn.addEventListener("click", openChat);
  if (openChatBtn2) openChatBtn2.addEventListener("click", openChat);
})();

// =========================
// SMART ANALYSIS FORM
// =========================

(function setupAnalysisForm() {
  const form = document.getElementById("analysis-form");
  const msg = document.getElementById("form-message");

  if (!form || !msg) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.className = "form-message";

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const termsChecked = document.getElementById("terms")?.checked;

    if (!termsChecked) {
      msg.textContent = "Please confirm you agree to the Terms and Privacy Policy before continuing.";
      msg.classList.add("error-text");
      return;
    }

    // Basic front-end validation (you can expand this)
    if (!data.name || !data.email || !data.scoreRange || !data.mainGoal) {
      msg.textContent = "Please fill in all required fields so AI can give you a better plan.";
      msg.classList.add("error-text");
      return;
    }

    // 🔒 IMPORTANT:
    // In production, this is where you'd send the data to YOUR backend.
    // Example (Node / Python server you control):
    //
    // const response = await fetch("https://your-secure-backend.com/api/analysis", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });
    //
    // The backend would:
    //  1. Store the lead (CRM, email, etc.)
    //  2. Call OpenAI or another model to generate a detailed plan
    //  3. Return a summary and/or send email to the user
    //
    // You NEVER put your OpenAI API key directly in this JS file.

    console.log("Form submitted (demo mode only):", data);

    msg.textContent =
      "Got it! In a live setup, your AI snapshot plan would generate here and be sent to your email. For now, your info stayed in your browser.";
    msg.classList.add("success-text");

    form.reset();
  });
})();
