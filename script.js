/* ============================================
   SELBY UNIQUE SCHOOL — GLOBAL JAVASCRIPT
   ============================================ */

/* ---------- Navbar scroll effect ---------- */
const navbar = document.querySelector(".navbar");
function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}
window.addEventListener("scroll", handleNavScroll);
handleNavScroll(); // run on load

/* ---------- Mobile hamburger ---------- */
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  // Close nav when a link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
}

/* ---------- Scroll-to-top button ---------- */
const scrollTopBtn = document.getElementById("scrollTop");
if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- FAQ accordion ---------- */
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");
    // close all
    document
      .querySelectorAll(".faq-item.open")
      .forEach((el) => el.classList.remove("open"));
    // open clicked if it was closed
    if (!isOpen) item.classList.add("open");
  });
});

/* ---------- Active nav link ---------- */
(function setActiveLink() {
  const links = document.querySelectorAll(".nav-links a");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
})();

/* ---------- Simple form handler (Formspree fallback feedback) ---------- */
function setupForm(formId, successId) {
  const form = document.getElementById(formId);
  const successBox = document.getElementById(successId);
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : "";

    // If form uses Formspree action, let browser handle it normally
    // For demo / offline: show success message
    const action = form.getAttribute("action");
    if (!action || action.includes("YOUR_FORM_ID")) {
      e.preventDefault();
      if (submitBtn) {
        submitBtn.textContent = "Sending…";
        submitBtn.disabled = true;
      }
      await new Promise((r) => setTimeout(r, 1200));
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
      if (successBox) {
        successBox.classList.add("show");
        successBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      form.reset();
    }
    // If a real Formspree ID is set, the form submits normally (browser redirect)
  });
}

setupForm("admissionForm", "admissionSuccess");
setupForm("contactForm", "contactSuccess");

/* ---------- Counter animation ---------- */
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + (el.getAttribute("data-suffix") || "");
    }, 25);
  });
}

// Run counter when hero stats are visible
const heroStats = document.querySelector(".hero-stats");
if (heroStats) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    },
    { threshold: 0.3 },
  );
  observer.observe(heroStats);
}

/* ---------- Smooth entrance animations ---------- */
const fadeEls = document.querySelectorAll(
  ".card, .feature-card, .level-card, .contact-card, .mv-card, .value-card, .staff-card, .req-item",
);
if ("IntersectionObserver" in window) {
  const fadeObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
          fadeObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  fadeEls.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    fadeObs.observe(el);
  });
}
