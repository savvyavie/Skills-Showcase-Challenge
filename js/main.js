const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
html.setAttribute("data-theme", savedTheme);
themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("portfolio-theme", next);
  themeIcon.textContent = next === "dark" ? "☀️" : "🌙";
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const active = document.querySelector(
          `.nav-link[href="#${e.target.id}"]`,
        );
        if (active) active.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" },
);

sections.forEach((s) => sectionObserver.observe(s));

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".mobile-link").forEach((l) => {
  l.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", false);
  });
});

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove("open");
  }
});

const form = document.getElementById("contactForm");
const toast = document.getElementById("successToast");
const submitBtn = document.getElementById("submitBtn");

function showError(field, msg) {
  const input = document.getElementById(field);
  const err = document.getElementById(field + "Error");
  if (input) input.classList.add("error");
  if (err) err.textContent = msg;
}

function clearErrors() {
  ["name", "email", "message"].forEach((f) => {
    const input = document.getElementById(f);
    const err = document.getElementById(f + "Error");
    if (input) input.classList.remove("error");
    if (err) err.textContent = "";
  });
}

function validateEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function showToast() {
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 4000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  let valid = true;

  if (!name) {
    showError("name", "Please enter your name.");
    valid = false;
  }

  if (!email) {
    showError("email", "Please enter your email address.");
    valid = false;
  } else if (!validateEmail(email)) {
    showError("email", "Please enter a valid email address.");
    valid = false;
  }

  if (!message) {
    showError("message", "Please write a message.");
    valid = false;
  }

  if (!valid) return;

  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");
  btnText.classList.add("hidden");
  btnLoading.classList.remove("hidden");
  submitBtn.disabled = true;

  await new Promise((r) => setTimeout(r, 1200));

  form.reset();
  btnText.classList.remove("hidden");
  btnLoading.classList.add("hidden");
  submitBtn.disabled = false;

  showToast();
});

["name", "email", "message"].forEach((f) => {
  const input = document.getElementById(f);
  if (input) {
    input.addEventListener("input", () => {
      input.classList.remove("error");
      const err = document.getElementById(f + "Error");
      if (err) err.textContent = "";
    });
  }
});
