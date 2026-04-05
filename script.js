/* =========================================================
   SELBY UNIQUE SCHOOL  —  script.js
   ========================================================= */

/* ─── 1. NAVBAR  scroll tint ─────────────────────────────── */
const navbar = document.getElementById("navbar");

function syncNavbar() {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 50);
}
window.addEventListener("scroll", syncNavbar, { passive: true });
syncNavbar();

/* ─── 2. HAMBURGER / mobile-nav ─────────────────────────── */
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

if (hamburger && mobileNav) {
  hamburger.addEventListener("click", () => {
    const opening = !mobileNav.classList.contains("open");
    mobileNav.classList.toggle("open", opening);
    hamburger.setAttribute("aria-expanded", String(opening));
    document.body.style.overflow = opening ? "hidden" : "";
  });

  /* close on any internal link click */
  mobileNav
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));

  /* close when tapping outside the drawer */
  document.addEventListener("click", (e) => {
    if (
      mobileNav.classList.contains("open") &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    )
      closeMenu();
  });

  /* close on Escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("open")) closeMenu();
  });
}

function closeMenu() {
  if (!mobileNav) return;
  mobileNav.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

/* ─── 3. ACTIVE NAV LINK ────────────────────────────────── */
(function markActive() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-nav a").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("#")[0];
    if (href === page || (page === "" && href === "index.html"))
      a.classList.add("active");
  });
})();

/* ─── 4. SCROLL-TO-TOP ──────────────────────────────────── */
const scrollBtn = document.getElementById("scrollTop");
if (scrollBtn) {
  window.addEventListener(
    "scroll",
    () => {
      scrollBtn.classList.toggle("visible", window.scrollY > 500);
    },
    { passive: true },
  );
  scrollBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

/* ─── 5. FAQ ACCORDION ──────────────────────────────────── */
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");
    document
      .querySelectorAll(".faq-item.open")
      .forEach((el) => el.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

/* ─── 6. INTERSECTION OBSERVER — fade-in ────────────────── */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".fade-in").forEach((el) => io.observe(el));
}

/* ─── 7. COUNTER ANIMATION ──────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-count"), 10);
  const suffix = el.getAttribute("data-suffix") || "";
  if (isNaN(target)) return;

  const duration = 1400;
  const startTime = performance.now();

  (function tick(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const ep = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(ep * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(startTime);
}

if ("IntersectionObserver" in window) {
  const statsEl = document.querySelector(".hero-stats");
  if (statsEl) {
    const co = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          document.querySelectorAll("[data-count]").forEach(animateCounter);
          co.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    co.observe(statsEl);
  }
}

/* ─── 8. FORM HANDLING ──────────────────────────────────── */
function setupForm(formId, successId) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    const action = form.getAttribute("action") || "";
    const isDemo = !action || action.includes("YOUR_FORM_ID");

    if (isDemo) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn?.textContent ?? "";

      if (btn) {
        btn.textContent = "Sending…";
        btn.disabled = true;
      }
      await new Promise((r) => setTimeout(r, 1100));
      if (btn) {
        btn.textContent = orig;
        btn.disabled = false;
      }

      if (success) {
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      form.reset();
    }
    /* If a real Formspree action is present, let the browser handle submission */
  });
}

setupForm("admissionForm", "admissionSuccess");
setupForm("contactForm", "contactSuccess");

/* ─── 9. GALLERY FILTER ─────────────────────────────────── */
window.filterGallery = function (category, btn) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.style.display =
      category === "all" || item.dataset.category === category ? "" : "none";
  });
};

/* ─── 10. GALLERY LIGHTBOX ──────────────────────────────── */
window.openLightbox = function (emoji, title, desc) {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  document.getElementById("lightboxEmoji").textContent = emoji;
  document.getElementById("lightboxCaption").textContent = title;
  document.getElementById("lightboxSub").textContent = desc;
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
};

window.closeLightbox = function (e) {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  const clickedOutside = !e || e.target === lb;
  const clickedClose = e?.currentTarget?.classList?.contains("lightbox-close");
  if (clickedOutside || clickedClose) {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }
};
