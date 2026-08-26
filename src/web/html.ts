import { icon, instagramIcon, linkedinIcon } from "./icons";

/** HTML-escape user/DB-provided strings before interpolation. */
export function esc(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const NAV = [
  { href: "/about-us", label: "About Us" },
  { href: "/for-employer", label: "Employers" },
  { href: "/for-job-seeker", label: "Job Seekers" },
  { href: "/job-search", label: "Jobs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact" },
];

function logo(light = false): string {
  const text = light ? "text-cream" : "text-ink";
  const sub = light ? "text-cream/60" : "text-ink/50";
  return `<a href="/" class="group inline-flex items-center gap-2.5">
  <img src="/logo-t.png" alt="Tranquil Peeplz Logo" class="h-10 w-auto" />
  <span class="leading-none ${text}">
    <span class="block font-display text-[19px] font-medium tracking-tight">Tranquil <span class="italic text-accent">Peeplz</span></span>
    <span class="mt-0.5 block text-[9.5px] font-semibold uppercase tracking-[0.3em] ${sub}">Creating Possibilities</span>
  </span>
</a>`;
}

function header(path: string): string {
  const isHome = path === "/";
  const links = NAV.map(
    (n) =>
      `<a href="${n.href}" class="link-underline text-[13px] font-medium tracking-wide ${path.startsWith(n.href) ? "text-accent" : (isHome ? "text-cream/90 hover:text-cream" : "text-ink/75 hover:text-ink")}">${n.label}</a>`,
  ).join("\n      ");
  const mobileLinks = [{ href: "/", label: "Home" }, ...NAV]
    .map(
      (n, i) => `<a href="${n.href}" class="group flex items-baseline gap-4 border-b border-${isHome ? 'cream/10' : 'ink/10'} py-4">
        <span class="font-display text-sm italic text-accent">0${i + 1}</span>
        <span class="font-display text-4xl font-medium tracking-tight transition-colors group-hover:text-accent">${n.label}</span>
      </a>`,
    )
    .join("\n      ");

  const headerClass = isHome
    ? "fixed inset-x-0 top-0 z-50 py-5 transition-all duration-500"
    : "fixed inset-x-0 top-0 z-50 py-5 transition-all duration-500 scrolled";

  return `<header id="site-header" class="${headerClass}">
    <div class="container-x flex items-center justify-between gap-6">
      ${logo(isHome)}
      <nav class="hidden items-center gap-7 lg:flex">
      ${links}
      </nav>
      <div class="hidden items-center gap-3 lg:flex">
        <a href="/job-search" class="btn btn-outline btn-sm">Browse Jobs</a>
        <a href="/post-a-job" class="btn btn-accent btn-sm">Post a Job ${icon("arrow-up-right", "", 15)}</a>
      </div>
      <button onclick="openMenu()" class="grid h-11 w-11 place-items-center rounded-full border border-${isHome ? 'cream/30' : 'ink/15'} text-${isHome ? 'cream' : 'ink'} lg:hidden" aria-label="Open menu">${icon("menu", "", 20)}</button>
    </div>
  </header>
  <div id="mobile-menu" class="fixed inset-0 z-[80] bg-ink text-cream lg:hidden">
    <div class="container-x flex items-center justify-between py-5">
      ${logo(true)}
      <button onclick="closeMenu()" class="grid h-11 w-11 place-items-center rounded-full border border-cream/25" aria-label="Close menu">${icon("x", "", 20)}</button>
    </div>
    <nav class="container-x mt-8 flex flex-col gap-1.5">
      ${mobileLinks}
    </nav>
    <div class="container-x mt-8 flex flex-wrap gap-3">
      <a href="/post-a-job" class="btn btn-accent">Post a job ${icon("arrow-up-right", "", 16)}</a>
      <a href="/job-search" class="btn btn-ghost-light">Browse jobs</a>
    </div>
  </div>
  ${(path === "/" || path === "/about-us") ? "" : `<div class="h-[76px]"></div>`}`;
}

function footer(): string {
  const quickLinks = [
    ["/about-us", "About Us"],
    ["/for-employer", "For Employers"],
    ["/for-job-seeker", "For Job Seekers"],
    ["/job-search", "Job Search"],
    ["/blog", "Blog"],
    ["/privacy-policy", "Privacy Policy"],
  ]
    .map(
      ([h, l]) =>
        `<li><a href="${h}" class="text-[15px] text-cream/75 transition-colors hover:text-accent">${l}</a></li>`,
    )
    .join("\n            ");
  const services = [
    ["/staffing", "Staffing"],
    ["/hiring-recruitment-agency", "Hiring"],
    ["/workforce-transformation", "Workforce Transformation"],
    ["/post-a-job", "Post a Job"],
  ]
    .map(
      ([h, l]) =>
        `<li><a href="${h}" class="text-[15px] text-cream/75 transition-colors hover:text-accent">${l}</a></li>`,
    )
    .join("\n            ");

  return `<footer class="relative overflow-hidden bg-ink text-cream">
    <div class="dot-grid-light pointer-events-none absolute inset-0 opacity-40"></div>
    <div class="container-x relative">
      <div class="flex flex-col gap-10 border-b border-cream/10 py-14 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-md">
          ${logo(true)}
          <p class="mt-5 text-[15px] leading-relaxed text-cream/65">A Bangalore-based recruitment consultancy helping companies hire with pace and precision — and helping people find work worth doing. Creating possibilities, faster.</p>
          <div class="mt-6 flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" class="grid h-10 w-10 place-items-center rounded-full border border-cream/20 text-cream/80 transition-colors hover:border-accent hover:bg-accent hover:text-cream">${instagramIcon(17)}</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" class="grid h-10 w-10 place-items-center rounded-full border border-cream/20 text-cream/80 transition-colors hover:border-accent hover:bg-accent hover:text-cream">${linkedinIcon(17)}</a>
            <a href="mailto:contact@tranquilpeeplz.com" aria-label="Email" class="grid h-10 w-10 place-items-center rounded-full border border-cream/20 text-cream/80 transition-colors hover:border-accent hover:bg-accent hover:text-cream">${icon("mail", "", 17)}</a>
          </div>
        </div>
        <p class="font-display text-[13vw] leading-[0.85] font-medium tracking-tight text-cream/[0.07] select-none lg:text-[7rem]">tranquil<br/>peeplz</p>
      </div>
      <div class="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 class="text-[11px] font-semibold tracking-[0.24em] text-cream/45 uppercase">Quick Links</h3>
          <ul class="mt-4 space-y-2.5">
            ${quickLinks}
          </ul>
        </div>
        <div>
          <h3 class="text-[11px] font-semibold tracking-[0.24em] text-cream/45 uppercase">Services</h3>
          <ul class="mt-4 space-y-2.5">
            ${services}
          </ul>
        </div>
        <div class="sm:col-span-2">
          <h3 class="text-[11px] font-semibold tracking-[0.24em] text-cream/45 uppercase">Contact Us</h3>
          <ul class="mt-4 space-y-3.5 text-[15px] text-cream/75">
            <li class="flex gap-3">${icon("map-pin", "mt-1 shrink-0 text-accent", 17)}<span>#12, MPD Complex, 3rd Floor, 5th Block,<br/>Koramangala, Bangalore – 560095</span></li>
            <li><a href="tel:+918049793366" class="flex gap-3 transition-colors hover:text-accent">${icon("phone", "mt-1 shrink-0 text-accent", 17)}+91 80 4979 3366 / 6633</a></li>
            <li><a href="mailto:contact@tranquilpeeplz.com" class="flex gap-3 transition-colors hover:text-accent">${icon("mail", "mt-1 shrink-0 text-accent", 17)}contact@tranquilpeeplz.com</a></li>
          </ul>
        </div>
      </div>
      <div class="flex flex-col items-start justify-between gap-4 border-t border-cream/10 py-6 text-[13px] text-cream/45 sm:flex-row sm:items-center">
        <p>© ${new Date().getFullYear()} Tranquil Peeplz. All rights reserved | Developed by - <a href = "https://linkedin.com/in/mayankgarg785">Mayank Garg</a></p>
        <a href="#top" class="inline-flex items-center gap-2 text-cream/60 transition-colors hover:text-accent" aria-label="Scroll to top">Back to top ${icon("arrow-up", "", 14)}</a>
      </div>
    </div>
  </footer>`;
}

const PAGE_SCRIPT = `(function(){
  var header = document.getElementById('site-header');
  var hero = document.getElementById('hero');

  function updateHeader() {
    if (!header || !hero) return;
    var heroRect = hero.getBoundingClientRect();
    var isHeroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
    header.classList.toggle('scrolled', !isHeroVisible);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader, { passive: true });

  window.openMenu = function(){ document.getElementById('mobile-menu').classList.add('open'); document.body.classList.add('menu-open'); };
  window.closeMenu = function(){ document.getElementById('mobile-menu').classList.remove('open'); document.body.classList.remove('menu-open'); };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('rv-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -70px 0px' });
    document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function(el){ el.classList.add('rv-in'); });
  }
  var counted = new WeakSet();
  function animateCount(el){
    if (counted.has(el)) return; counted.add(el);
    var to = parseInt(el.getAttribute('data-count') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / 1600, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * eased).toLocaleString('en-IN') + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ animateCount(e.target); cio.unobserve(e.target); } });
    });
    document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });
  } else {
    document.querySelectorAll('[data-count]').forEach(animateCount);
  }
})();`;

export type PageOptions = {
  title: string;
  description?: string;
  path: string;
  body: string;
};

export function page(opts: PageOptions): string {
  const desc =
    opts.description ??
    "Tranquil Peeplz is a Bangalore-based recruitment consultancy delivering staffing, permanent hiring and workforce transformation — creating possibilities faster.";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="icon" href="/logo.jpeg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/app.css" />
</head>
<body class="grain flex min-h-dvh flex-col" id="top">
${header(opts.path)}
<main class="flex-1">
${opts.body}
</main>
${footer()}
<script>${PAGE_SCRIPT}</script>
</body>
</html>`;
}

/** Reveal-on-scroll wrapper helper. */
export function rv(inner: string, opts: { delay?: number; className?: string } = {}): string {
  const d = opts.delay ? `transition-delay:${Math.round(opts.delay * 1000)}ms;` : "";
  return `<div class="rv ${opts.className ?? ""}" style="${d}">${inner}</div>`;
}

export function sectionHeading(p: {
  eyebrow: string;
  title: string; // pre-escaped HTML
  intro?: string;
  align?: "left" | "center";
  dark?: boolean;
}): string {
  const alignCls = p.align === "center" ? "mx-auto text-center" : "";
  const titleCls = p.dark ? "text-cream" : "text-ink";
  const introCls = p.dark ? "text-cream/70" : "text-ink-soft";
  const eyebrowCls = p.dark ? "eyebrow !text-gold" : "eyebrow";
  return rv(
    `<div class="max-w-2xl ${alignCls}">
      <span class="${eyebrowCls}" style="display:inline-flex">${esc(p.eyebrow)}</span>
      <h2 class="h-display mt-4 text-4xl md:text-5xl ${titleCls}">${p.title}</h2>
      ${p.intro ? `<p class="mt-5 text-[16.5px] leading-relaxed ${introCls}">${esc(p.intro)}</p>` : ""}
    </div>`,
  );
}

export function marquee(items: string[]): string {
  const row = [...items, ...items]
    .map(
      (i) =>
        `<span class="flex shrink-0 items-center gap-10 font-display text-2xl font-medium tracking-tight text-ink/60 italic">${esc(i)}<span class="inline-block h-2 w-2 rounded-full bg-accent/70"></span></span>`,
    )
    .join("");
  return `<div class="marquee relative overflow-hidden border-y border-ink/10 bg-cream py-5"><div class="marquee-track items-center gap-10 pr-10">${row}</div></div>`;
}

export function fieldError(errors: Record<string, string[] | undefined> | undefined, name: string): string {
  const err = errors?.[name]?.[0];
  return err ? `<p class="field-error">${esc(err)}</p>` : "";
}

export function formAlert(state?: { ok?: boolean; message?: string } | null): string {
  if (!state?.message) return "";
  const cls = state.ok
    ? "border-moss/30 bg-moss/10 text-pine"
    : "border-accent/40 bg-accent/10 text-accent-deep";
  const ic = state.ok ? "circle-check" : "triangle-alert";
  return `<div class="flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-[14px] font-medium ${cls}">${icon(ic, "mt-0.5 shrink-0", 18)}${esc(state.message)}</div>`;
}
