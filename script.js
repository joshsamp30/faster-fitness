const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("[data-menu]");
const trialForm = document.querySelector("[data-trial-form]");
const contactForm = document.querySelector("[data-contact-form]");
const contactFirstName = document.querySelector("[data-contact-first]");
const contactEmailInput = document.querySelector("[data-contact-email-field]");
const contactSuccess = document.querySelector("[data-contact-success]");
const resultsToggle = document.querySelector("[data-results-toggle]");
const moreResults = document.querySelector("#more-results");
const mobileStickyCta = document.querySelector(".mobile-sticky-cta");
const stickySuppressionSections = Array.from(document.querySelectorAll("#results, #reviews, #training, #memberships, #trial, .footer"));
const localHowlLinks = document.querySelectorAll("[data-local-howl]");
const blogFilters = document.querySelectorAll("[data-blog-filter]");
const blogCards = document.querySelectorAll("[data-blog-card]");

function setMenuOpen(isOpen) {
  if (!menuToggle || !menu) return;

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  menu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  updateStickyCta();
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

menu?.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLAnchorElement) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
  }
});

function updateStickyCta() {
  if (!mobileStickyCta) return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const hasScrolledPastHero = window.scrollY > Math.min(560, window.innerHeight * 0.65);
  const isMenuOpen = document.body.classList.contains("nav-open");
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const isInProtectedSection = stickySuppressionSections.some((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top < viewportHeight - 72 && rect.bottom > viewportHeight * 0.18;
  });
  const shouldShow = isMobile && hasScrolledPastHero && !isMenuOpen && !isInProtectedSection;

  mobileStickyCta.classList.toggle("is-visible", shouldShow);
  mobileStickyCta.setAttribute("aria-hidden", String(!shouldShow));
}

window.addEventListener("scroll", updateStickyCta, { passive: true });
window.addEventListener("resize", updateStickyCta);
updateStickyCta();

resultsToggle?.addEventListener("click", () => {
  if (!moreResults) return;

  const isOpen = resultsToggle.getAttribute("aria-expanded") === "true";
  resultsToggle.setAttribute("aria-expanded", String(!isOpen));
  resultsToggle.textContent = isOpen ? "See More Results" : "Hide Extra Results";
  moreResults.hidden = isOpen;

  if (!isOpen) {
    moreResults.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  updateStickyCta();
});

trialForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(trialForm);
  const note = trialForm.querySelector("[data-form-note]");
  const leadEmail = trialForm.dataset.leadEmail;

  if (note) {
    note.textContent = "Thanks. Your email app should open with this 28 Day Challenge request ready to send.";
    note.classList.add("is-success");
  }

  if (leadEmail) {
    const subject = encodeURIComponent("Faster Fitness 28 Day Challenge Lead");
    const body = encodeURIComponent(
      [
        "New 28 Day Faster Results Challenge request:",
        "",
        `Name: ${data.get("name") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Phone: ${data.get("phone") || ""}`,
        "",
        "Source: Faster Fitness homepage"
      ].join("\n")
    );

    window.location.href = `mailto:${leadEmail}?subject=${subject}&body=${body}`;
  }

  trialForm.reset();
});

function markContactError(field) {
  if (!(field instanceof HTMLInputElement)) return;

  field.classList.add("is-error");
  field.setAttribute("aria-invalid", "true");
  field.focus();

  window.setTimeout(() => {
    field.classList.remove("is-error");
    field.removeAttribute("aria-invalid");
  }, 2000);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!(contactFirstName instanceof HTMLInputElement) || !(contactEmailInput instanceof HTMLInputElement)) return;

  const firstName = contactFirstName.value.trim();
  const email = contactEmailInput.value.trim();

  if (!firstName) {
    markContactError(contactFirstName);
    return;
  }

  if (!isValidEmail(email)) {
    markContactError(contactEmailInput);
    return;
  }

  const data = new FormData(contactForm);
  const leadEmail = contactForm.dataset.contactEmail;
  const card = contactForm.closest(".contact-form-card");

  contactForm.hidden = true;
  contactSuccess?.removeAttribute("hidden");
  card?.classList.add("is-sent");

  if (leadEmail) {
    const subject = encodeURIComponent("Faster Fitness Contact Inquiry");
    const body = encodeURIComponent(
      [
        "New Faster Fitness contact inquiry:",
        "",
        `First name: ${data.get("firstName") || ""}`,
        `Last name: ${data.get("lastName") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Phone: ${data.get("phone") || ""}`,
        `Program interest: ${data.get("program") || ""}`,
        "",
        `Message: ${data.get("message") || ""}`,
        "",
        "Source: Faster Fitness contact page"
      ].join("\n")
    );

    window.location.href = `mailto:${leadEmail}?subject=${subject}&body=${body}`;
  }
});

let lastHowlAt = 0;

function playLocalHowl(link) {
  const now = Date.now();
  if (now - lastHowlAt < 1200) return;
  lastHowlAt = now;

  link.classList.add("is-howling");
  window.setTimeout(() => link.classList.remove("is-howling"), 900);

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  try {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = audioContext.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(360, start);
    oscillator.frequency.exponentialRampToValueAtTime(620, start + 0.18);
    oscillator.frequency.exponentialRampToValueAtTime(300, start + 0.86);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.08, start + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.92);
    oscillator.addEventListener("ended", () => audioContext.close());
  } catch {
    // Some browsers block hover audio until a click; the visual howl still works.
  }
}

localHowlLinks.forEach((link) => {
  link.addEventListener("pointerenter", () => playLocalHowl(link));
  link.addEventListener("click", () => playLocalHowl(link));
});

blogFilters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const filter = filterButton.dataset.blogFilter || "all";

    blogFilters.forEach((button) => button.classList.toggle("is-active", button === filterButton));
    blogCards.forEach((card) => {
      const categories = (card.dataset.blogCategory || "").split(" ");
      card.hidden = filter !== "all" && !categories.includes(filter);
    });
  });
});
