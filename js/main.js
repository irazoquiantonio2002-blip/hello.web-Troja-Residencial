const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const loader = $("#loader");
const navbar = $("#navbar");
const hamburger = $("#hamburger");
const mobileMenu = $("#mob-menu");
const year = $("#year");
const marquee = $("#marquee");
const waForm = $("#wa-form");
const canvas = $("#hero-canvas");

if (year) {
  year.textContent = new Date().getFullYear();
}

let loaderHidden = false;
const hideLoader = () => {
  if (loaderHidden) return;
  loaderHidden = true;
  window.setTimeout(() => loader?.classList.add("is-hidden"), 360);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
} else {
  hideLoader();
}
window.addEventListener("load", hideLoader, { once: true });
window.setTimeout(hideLoader, 1800);

const setNavState = () => {
  navbar?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setNavState();
window.addEventListener("scroll", setNavState, { passive: true });

hamburger?.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("is-active");
  mobileMenu?.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

$$('#mob-menu a').forEach((link) => {
  link.addEventListener("click", () => {
    hamburger?.classList.remove("is-active");
    mobileMenu?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    hamburger?.setAttribute("aria-expanded", "false");
  });
});

if (marquee) {
  const items = [
    "Arquitectura premium",
    "Amenidades de bienestar",
    "Espacios personalizados",
    "Gestión residencial",
    "Sostenibilidad habitable",
    "Comunidad exclusiva"
  ];
  const row = items.map((item) => `<div class="marquee-item">${item}<span>·</span></div>`).join("");
  marquee.innerHTML = row + row;
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

$$(".reveal").forEach((element) => revealObserver.observe(element));

const formatNumber = (value) => new Intl.NumberFormat("es-MX").format(value);
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const end = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${formatNumber(Math.round(end * eased))}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.45 });

$$(".stat-num").forEach((element) => statObserver.observe(element));

if (waForm) {
  waForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#f-name")?.value.trim();
    const interest = $("#f-interest")?.value;
    const message = $("#f-msg")?.value.trim();

    if (!name || !message) {
      waForm.reportValidity();
      return;
    }

    const text = [
      "Hola, visité el sitio de Troja Residencial.",
      `Mi nombre es ${name}.`,
      `Me interesa: ${interest}.`,
      `Mensaje: ${message}`
    ].join("\n");

    window.open(`https://wa.me/520000000000?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
}

if (canvas) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  let rafId = 0;

  const resize = () => {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const count = Math.max(28, Math.floor(window.innerWidth / 34));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (Math.random() * 1.9 + 0.7) * window.devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.18 * window.devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.18 * window.devicePixelRatio,
      a: Math.random() * 0.45 + 0.15
    }));
  };

  const draw = () => {
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 7);
      gradient.addColorStop(0, `rgba(228, 194, 123, ${p.a})`);
      gradient.addColorStop(1, "rgba(228, 194, 123, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 7, 0, Math.PI * 2);
      ctx.fill();
    });

    rafId = requestAnimationFrame(draw);
  };

  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!media.matches) {
    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
  }

  window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
}
