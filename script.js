/* ─── Projects Data ─── */
const projectsCompleted = [
  { emoji: "\u{1F3E2}", name: "Sarvadnya Infotech", url: "https://sarvadnya-infotech.vercel.app" },
  { emoji: "\u{1F511}", name: "Self-IAM", url: "https://selfiam.site" },
  { emoji: "\u{1F4BE}", name: "LocalDump", url: "https://localdump.vercel.app" },
  { emoji: "\u{1F4D6}", name: "SmartTutors", url: "https://smarttutors.co.in" },
  { emoji: "\u{1F310}", name: "DC Infoway (ISP)", url: "https://dcinfoway.in/" },
  { emoji: "\u{1F3E5}", name: "HomeCare24", url: "https://homecare24.co.in/" },
  { emoji: "\u{1F4E7}", name: "SelfIAM Mailer", url: "https://selfiam-mailer.vercel.app" },
];

function escapeHtml(v) {
  return String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function renderProjects(id, projects) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = projects.map(p => {
    const real = p.url && p.url !== "#";
    return `<a class="proj-btn" href="${escapeHtml(p.url)}"${real ? ' target="_blank" rel="noreferrer noopener"' : ' aria-disabled="true" style="opacity:0.65;cursor:not-allowed"'}><div class="proj-row"><div class="proj-emoji" aria-hidden="true">${escapeHtml(p.emoji)}</div><div class="proj-name">${escapeHtml(p.name)} ${real ? '↗' : 'Soon'}</div></div><span class="proj-hint"></span></a>`;
  }).join("");
}

/* ─── 1. Typing Animation (fast: 60ms type, 30ms delete, 1.5s pause) ─── */
function setupTyping() {
  const el = document.getElementById("typing-target");
  if (!el) return;
  const words = ["DevOps Engineer", "Web Developer", "Tech Consultant", "CI/CD Specialist"];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) { setTimeout(() => { deleting = true; tick(); }, 1500); return; }
      setTimeout(tick, 60);
    } else {
      el.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 30);
    }
  }
  tick();
}

/* ─── 2. Animated Metric Counters (fast: 400ms duration) ─── */
function setupCounters() {
  const nums = document.querySelectorAll(".metric-num");
  if (!nums.length) return;

  function animate(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = raw.replace(match[1], "");
    const duration = 400;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  nums.forEach(n => obs.observe(n));
}

/* ─── 3. Scroll-Reveal (instant trigger, 350ms transition) ─── */
function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
  els.forEach(el => obs.observe(el));
}

/* ─── 4. Clipboard Toast ─── */
function setupClipboard() {
  const toast = document.getElementById("toast");
  let hideTimer = null;

  function show(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  document.querySelectorAll(".copy-email").forEach(link => {
    link.addEventListener("click", (e) => {
      const email = link.dataset.email || "ankitmali50@gmail.com";
      e.preventDefault();
      navigator.clipboard.writeText(email).then(() => show("Email copied!")).catch(() => show("Copy failed"));
    });
  });
}

/* ─── 5. Magnetic Button Hover (instant, 3px max) ─── */
function setupMagnetic() {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  document.querySelectorAll(".btn, .btn-primary").forEach(btn => {
    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.15;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.15;
      btn.style.transform = `translate(${Math.max(-3, Math.min(3, dx))}px, ${Math.max(-3, Math.min(3, dy))}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "translate(0,0)";
    });
  });
}

/* ─── Tilt Effect ─── */
function setupTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  document.querySelectorAll("[data-tilt='true']").forEach(card => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const rx = (0.5 - (e.clientY - rect.top) / rect.height) * 6;
      card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

/* ─── Services Modal ─── */
function setupServicesModal() {
  const openBtn = document.getElementById("open-services");
  const modal = document.getElementById("services-modal");
  if (!openBtn || !modal) return;

  const overlay = modal.querySelector("[data-modal-overlay]");
  const closeBtn = modal.querySelector("[data-modal-close]");
  let lastFocus = null;

  const open = () => {
    lastFocus = document.activeElement;
    modal.classList.remove("hidden");
    modal.classList.add("grid", "place-items-center");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
    setTimeout(() => closeBtn instanceof HTMLElement && closeBtn.focus(), 0);
  };

  const close = () => {
    modal.classList.add("hidden");
    modal.classList.remove("grid", "place-items-center");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  };

  openBtn.addEventListener("click", (e) => { e.preventDefault(); open(); });
  if (overlay instanceof HTMLElement) overlay.addEventListener("click", close);
  if (closeBtn instanceof HTMLElement) closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.classList.contains("hidden")) close(); });
}

/* ─── Init ─── */
renderProjects("projects-completed", projectsCompleted);
setupTilt();
setupServicesModal();
setupTyping();
setupCounters();
setupReveal();
setupClipboard();
setupMagnetic();

document.addEventListener("click", (e) => {
  const t = e.target instanceof Element ? e.target.closest('[aria-disabled="true"]') : null;
  if (t) e.preventDefault();
});
