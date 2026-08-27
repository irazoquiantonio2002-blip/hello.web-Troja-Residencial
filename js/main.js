const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const loader = $("#loader");
const navbar = $("#navbar");
const hamburger = $("#hamburger");
const mobileMenu = $("#mob-menu");
const year = $("#year");
const ticker = $("#ticker");
const waForm = $("#wa-form");
const canvas = $("#hero-canvas");

if (year) {
  year.textContent = new Date().getFullYear();
}

/* ------------------------------------------------------------------ */
/* Loader                                                              */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* Navbar + mobile menu                                                */
/* ------------------------------------------------------------------ */
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

$$("#mob-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger?.classList.remove("is-active");
    mobileMenu?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    hamburger?.setAttribute("aria-expanded", "false");
  });
});

/* ------------------------------------------------------------------ */
/* Ticker                                                              */
/* ------------------------------------------------------------------ */
if (ticker) {
  const items = [
    "Fraccionamiento cerrado",
    "Modelo Krakov · 112 m²",
    "Modelo Moldava · 168 m²",
    "Sur de Juárez",
    "Casas de 1 o 2 plantas",
    "Seguridad y comodidad"
  ];
  const row = items.map((item) => `<div class="ticker-item">${item}<span>·</span></div>`).join("");
  ticker.innerHTML = row + row;
}

/* ------------------------------------------------------------------ */
/* Hero title — letter split reveal                                    */
/* ------------------------------------------------------------------ */
const splitChars = (el) => {
  const text = el.textContent;
  el.setAttribute("aria-label", text);
  el.innerHTML = "";
  let visibleIndex = 0;
  text.split("").forEach((ch) => {
    const span = document.createElement("span");
    span.className = "char";
    span.setAttribute("aria-hidden", "true");
    span.textContent = ch === " " ? " " : ch;
    if (ch !== " ") {
      span.style.animationDelay = `${0.55 + visibleIndex * 0.04}s`;
      visibleIndex += 1;
    } else {
      span.style.animationDelay = "0s";
    }
    el.appendChild(span);
  });
};

$$("[data-split]").forEach(splitChars);

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                       */
/* ------------------------------------------------------------------ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

$$(".reveal").forEach((element) => revealObserver.observe(element));

/* ------------------------------------------------------------------ */
/* Stat counters                                                       */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* Modelo media tabs (fachada / plano)                                 */
/* ------------------------------------------------------------------ */
$$(".modelo-media").forEach((media) => {
  const frame = $(".media-frame", media);
  const tabs = $$(".media-tab", media);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tabBtn;

      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      $$("img", frame).forEach((img) => {
        img.classList.toggle("is-active", img.dataset.tab === target);
      });
    });
  });
});

/* ------------------------------------------------------------------ */
/* Gallery lightbox                                                    */
/* ------------------------------------------------------------------ */
const galleryItems = $$(".g-item");
const lightbox = $("#lightbox");
const lbImg = $("#lb-img");
const lbCaption = $("#lb-caption");
const lbClose = $("#lb-close");
const lbPrev = $("#lb-prev");
const lbNext = $("#lb-next");
let lbIndex = 0;

const openLightbox = (index) => {
  if (!galleryItems.length) return;
  lbIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[lbIndex];
  const img = $("img", item);
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCaption.textContent = item.dataset.caption || img.alt;
  lightbox.classList.add("is-open");
  document.body.classList.add("menu-open");
};

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

lbClose?.addEventListener("click", closeLightbox);
lbPrev?.addEventListener("click", () => openLightbox(lbIndex - 1));
lbNext?.addEventListener("click", () => openLightbox(lbIndex + 1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("is-open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") openLightbox(lbIndex - 1);
  if (event.key === "ArrowRight") openLightbox(lbIndex + 1);
});

/* ------------------------------------------------------------------ */
/* Contact form -> WhatsApp                                            */
/* ------------------------------------------------------------------ */
if (waForm) {
  waForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#f-name")?.value.trim();
    const model = $("#f-model")?.value;
    const agentNumber = $("#f-agent")?.value || "526561275928";
    const phone = $("#f-phone")?.value.trim();
    const message = $("#f-msg")?.value.trim();

    if (!name || !message) {
      waForm.reportValidity();
      return;
    }

    const lines = [
      "Hola, visité el sitio de Troja Residencial.",
      `Mi nombre es ${name}.`,
      `Me interesa el modelo: ${model}.`
    ];
    if (phone) lines.push(`Mi teléfono es ${phone}.`);
    lines.push(`Mensaje: ${message}`);

    const text = lines.join("\n");
    window.open(`https://wa.me/${agentNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
}

/* ------------------------------------------------------------------ */
/* Hero particles — soft gold dust                                     */
/* ------------------------------------------------------------------ */
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

    const count = Math.max(20, Math.floor(window.innerWidth / 46));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (Math.random() * 1.6 + 0.6) * window.devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.12 * window.devicePixelRatio,
      vy: (Math.random() - 0.6) * 0.1 * window.devicePixelRatio,
      a: Math.random() * 0.35 + 0.12
    }));
  };

  const draw = () => {
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      gradient.addColorStop(0, `rgba(212, 178, 125, ${p.a})`);
      gradient.addColorStop(1, "rgba(212, 178, 125, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
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
