const fallbackUrl = "https://github.com/Orthodox2000/";

const projectsCompleted = [
  { emoji: "\u{1F310}", name: "DC Infoway (ISP)", url: "https://dcinfoway.in/" },
  { emoji: "\u{1F3AE}", name: "XO Game (Next.js)", url: "https://xo-with-nextjs.vercel.app/" },
  { emoji: "\u{1FA7A}", name: "MediCare (Web)", url: "https://medi-care-roan.vercel.app/" },
  { emoji: "\u{1F468}\u200D\u{1F393}", name: "SmartTutor (GitHub)", url: "https://github.com/orthodox2000/Smart-tutor" },
  { emoji: "\u{1F3E5}", name: "HomeCare24", url: "https://homecare24.co.in/" },
  { emoji: "\u{1F4E6}", name: "DataFetcher", url: "https://datafetcher-six.vercel.app/" },
  { emoji: "\u{1F37D}", name: "KitchenSpurs (Assessment)", url: "https://kitchen-spurs-frontend.vercel.app/" },
  { emoji: "\u{1F4FA}", name: "All-in-One Media Hub", url: fallbackUrl },
  { emoji: "\u{1F4C5}", name: "University Notice Board", url: fallbackUrl },
  { emoji: "\u{1F4C8}", name: "Stock Market Predictor", url: fallbackUrl },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderProjects(containerId, projects) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = projects
    .map((project) => {
      const url = project.url || "#";
      const isRealLink = url !== "#";
      const rel = isRealLink ? ' rel="noreferrer noopener"' : "";
      const target = isRealLink ? ' target="_blank"' : "";
      const ariaDisabled = isRealLink ? "" : ' aria-disabled="true"';
      const disabledStyle = isRealLink ? "" : "opacity:0.65; cursor:not-allowed;";
      const hint = isRealLink ? "\u2197" : "Soon";

      return `
        <a class="proj-btn" href="${escapeHtml(url)}"${target}${rel}${ariaDisabled} style="${disabledStyle}">
          <div class="proj-row">
            <div class="proj-emoji" aria-hidden="true">${escapeHtml(project.emoji)}</div>
            <div class="proj-name">${escapeHtml(project.name)}</div>
          </div>
          <span class="proj-hint">${hint}</span>
        </a>
      `.trim();
    })
    .join("");
}

function setupTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const cards = document.querySelectorAll("[data-tilt='true']");
  for (const card of cards) {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const ry = (px - 0.5) * 6;
      const rx = (0.5 - py) * 6;
      card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  }
}

function setupServicesModal() {
  const openButton = document.getElementById("open-services");
  const modal = document.getElementById("services-modal");
  if (!openButton || !modal) return;

  const overlay = modal.querySelector("[data-modal-overlay]");
  const closeButton = modal.querySelector("[data-modal-close]");
  let lastActiveElement = null;

  const isOpen = () => !modal.classList.contains("hidden");

  const open = () => {
    lastActiveElement = document.activeElement;
    modal.classList.remove("hidden");
    modal.classList.add("grid", "place-items-center");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");

    window.setTimeout(() => {
      if (closeButton instanceof HTMLElement) closeButton.focus();
    }, 0);
  };

  const close = () => {
    modal.classList.add("hidden");
    modal.classList.remove("grid", "place-items-center");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");

    if (lastActiveElement instanceof HTMLElement) lastActiveElement.focus();
  };

  openButton.addEventListener("click", (event) => {
    event.preventDefault();
    open();
  });

  if (overlay instanceof HTMLElement) overlay.addEventListener("click", close);
  if (closeButton instanceof HTMLElement) closeButton.addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!isOpen()) return;
    close();
  });
}

renderProjects("projects-completed", projectsCompleted);
setupTilt();
setupServicesModal();

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target.closest('[aria-disabled="true"]') : null;
  if (!target) return;
  event.preventDefault();
});
