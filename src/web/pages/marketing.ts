import { esc, rv, sectionHeading, fieldError, formAlert } from "../html";
import { icon, stamp } from "../icons";
import type { Job, Company } from "../../db/schema";
import { jobCard } from "./jobs";

function hero(p: {
  eyebrow: string;
  title: string; // pre-escaped HTML
  intro: string;
  image: string;
  imageAlt: string;
  stat: { value: string; label: string };
  cta: string;
  extraBullets?: string[];
}): string {
  return `<section class="container-x grid items-center gap-12 pt-10 pb-20 lg:grid-cols-2 lg:pt-16">
    <div>
      ${rv(`<p class="eyebrow" style="display:inline-flex">${esc(p.eyebrow)}</p>`)}
      ${rv(`<h1 class="h-display mt-6 text-5xl leading-[1.02] md:text-6xl">${p.title}</h1>`, { delay: 0.08 })}
      ${rv(`<p class="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-soft">${esc(p.intro)}</p>`, { delay: 0.16 })}
      ${rv(`<div class="mt-9 flex flex-wrap gap-4">${p.cta}</div>`, { delay: 0.24 })}
      ${p.extraBullets ? rv(`<ul class="mt-10 space-y-3">${p.extraBullets.map((b) => `<li class="flex items-center gap-3 text-[14.5px] font-medium text-ink-soft">${icon("circle-check", "shrink-0 text-moss", 18)}${esc(b)}</li>`).join("")}</ul>`, { delay: 0.3 }) : ""}
    </div>
    ${rv(
    `<div class="relative">
        <div class="img-frame aspect-[4/3] shadow-2xl shadow-ink/15">
          <img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" class="object-cover" />
        </div>
        <div class="animate-float absolute -bottom-8 -left-4 rounded-3xl bg-pine px-6 py-5 text-cream shadow-xl shadow-pine/30 md:-left-8">
          <p class="font-display text-3xl font-semibold">${esc(p.stat.value)}</p>
          <p class="text-[11px] font-semibold tracking-[0.16em] uppercase opacity-80">${esc(p.stat.label)}</p>
        </div>
      </div>`,
    { delay: 0.15 },
  )}
  </section>`;
}

function ctaBand(p: { title: string; copy: string; primary: string }): string {
  return `<section class="container-x pb-24">
  ${rv(
    `<div class="relative overflow-hidden rounded-[2.5rem] bg-pine px-8 py-16 text-center text-cream md:py-20">
      <div class="dot-grid-light pointer-events-none absolute inset-0 opacity-40"></div>
      <h2 class="h-display relative mx-auto max-w-2xl text-4xl md:text-5xl">${p.title} <span class="italic-pop">today</span></h2>
      <p class="relative mx-auto mt-5 max-w-lg text-[15.5px] text-cream/75">${esc(p.copy)}</p>
      <div class="relative mt-8 flex flex-wrap items-center justify-center gap-4">
        ${p.primary}
        <a href="/contact-us" class="btn btn-ghost-light">Contact our team</a>
      </div>
    </div>`,
  )}
</section>`;
}

// ---------------------------------------------------------------------------

export function aboutPage(): string {
  const ping = [
    { v: 500, s: "+", l: "Professionals placed" },
    { v: 60, s: "+", l: "Partner companies" },
    { v: 8, s: "", l: "Industries served" },
    { v: 21, s: "", l: "Avg. days to hire" },
  ]
    .map(
      (x, i) => rv(
        `<div class="text-center">
          <p class="font-display text-4xl font-semibold tracking-tight text-accent md:text-5xl"><span data-count="${x.v}" data-suffix="${x.s}">0${x.s}</span></p>
          <p class="mt-2 text-[12px] font-semibold tracking-[0.16em] text-ink/55 uppercase">${x.l}</p>
        </div>`,
        { delay: 0.06 * i },
      ),
    )
    .join("");

  const principles = [
    {
      title: "Speed with precision",
      copy: "Fast shortlists, zero shortcuts. Every candidate is screened, reference-ready and genuinely briefed.",
    },
    {
      title: "Trust with transparency",
      copy: "Honest timelines, honest feedback, honest advice — even when the honest answer is 'this role needs rethinking'.",
    },
    {
      title: "People before profiles",
      copy: "Behind every CV is a person making a life decision. We never forget which side of the table that matters to.",
    },
  ]
    .map(
      (x, i) => rv(
        `<div class="card-hover h-full rounded-[1.75rem] border border-ink/10 bg-cream p-8 text-center">
          <span class="inline-block font-display text-5xl font-semibold text-accent/80 mb-4">0${i + 1}</span>
          <h3 class="font-display mt-5 text-2xl font-medium tracking-tight">${x.title}</h3>
          <p class="mt-3 text-[14.5px] leading-relaxed text-ink-soft">${x.copy}</p>
        </div>`,
        { delay: 0.08 * i },
      ),
    )
    .join("");

  const values = [
    { icon: "handshake", title: "Trust at the Core", copy: "We build relationships on transparency, reliability, and integrity, delivering on every promise, every time." },
    { icon: "users-round", title: "People-First Focus", copy: "'PEEPLZ' reflects our commitment to valuing people, not just profiles. Every individual matters, and every connection is personal." },
    { icon: "badge-check", title: "Excellence Always", copy: "We push boundaries, set new standards, and treat every engagement as a reflection of our commitment to quality." },
    { icon: "zap", title: "Speed with Purpose", copy: "We act fast because the world does but every move we make is intentional, impactful, and designed to last." },
    { icon: "building-2", title: "Global Vision", copy: "Expanding horizons, creating a unified platform for hiring and staffing across the world." },
    { icon: "sparkles", title: "Creating Lasting Impact", copy: "Our work empowers growth that's measurable, meaningful, and built to shape a better future for all." },
  ]
    .map(
      (v, i) => rv(
        `<div class="flex gap-4">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-cream">${icon(v.icon, "", 20)}</span>
          <div>
            <h3 class="font-display text-lg font-medium tracking-tight">${esc(v.title)}</h3>
            <p class="mt-1 text-[13.5px] leading-relaxed text-ink-soft">${esc(v.copy)}</p>
          </div>
        </div>`,
        { delay: 0.05 * i },
      ),
    )
    .join("");

  const milestones = [
    { year: "2021", title: "The idea takes shape", copy: "A small team of recruiters in Koramangala asks a simple question: why does hiring take so long — and feel so impersonal?" },
    { year: "2022", title: "First hundred placements", copy: "Word travels. Startups and hospitals alike start calling us first when a role really matters." },
    { year: "2024", title: "Staffing at scale", copy: "We add contract and volume staffing, supporting seasonal ramps and project teams across Karnataka." },
    { year: "2026", title: "Workforce transformation", copy: "Beyond placements: consulting, upskilling and leadership enablement for partners building for the long term." },
  ]
    .map(
      (m, i) => rv(
        `<div class="relative border-t border-cream/15 pt-6">
          <span class="absolute -top-px left-0 h-px w-12 bg-gold"></span>
          <p class="font-display text-2xl font-semibold text-accent italic">${m.year}</p>
          <h3 class="font-display mt-2 text-xl font-medium">${m.title}</h3>
          <p class="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">${m.copy}</p>
        </div>`,
        { delay: 0.08 * i },
      ),
    )
    .join("");

  return `
    <!-- Banner Section -->
    <section class="relative overflow-hidden py-16 md:py-24 lg:py-32">
      <div class="absolute inset-0 z-0">
        <img src="https://images.pexels.com/photos/7495291/pexels-photo-7495291.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" alt="" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
      <div class="container-x relative z-10 text-center">
        ${rv(`<h1 class="h-display text-4xl md:text-5xl lg:text-6xl text-cream">
            Creating Possibilities<br/>
            <span class="italic-pop text-accent">Faster</span>
          </h1>`, { delay: 0.08 })}
        ${rv(`<p class="mt-5 max-w-2xl mx-auto text-[16px] leading-relaxed text-cream/80">We started Tranquil Peeplz in Bangalore with a simple belief: when people and businesses move together with speed, trust and purpose, growth becomes unstoppable. Today we partner with organisations across eight industries — staffing their teams, hiring their leaders, and transforming how their workforce works.</p>`, { delay: 0.16 })}
      </div>
    </section>

    <!-- Stats Section -->
    <section class="border-y border-ink/10 bg-cream py-14">
      <div class="container-x grid grid-cols-2 gap-10 md:grid-cols-4">${ping}</div>
    </section>

    <!-- How We Work -->
    <section class="container-x py-24">
      ${sectionHeading({ align: "center", eyebrow: "How we work", title: `Three principles,<br/>zero <span class="italic-pop">compromises</span>` })}
      <div class="mt-14 grid gap-6 md:grid-cols-3">${principles}</div>
    </section>

    <!-- What Makes Us -->
    <section class="container-x py-24">
      ${sectionHeading({ align: "center", eyebrow: "What makes us — who we are", title: `We exist to create<br/>possibilities, <span class="italic-pop">faster</span>`, intro: "When people and businesses move together with speed, trust and purpose, growth becomes unstoppable. What sets us apart isn't just how fast we deliver — it's how deeply we care about the outcome." })}
      <div class="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        ${values}
      </div>
    </section>

    <!-- Our Journey -->
    <section class="bg-cream py-24">
      <div class="container-x">
        ${sectionHeading({ align: "center", eyebrow: "Our journey", title: `A bold idea, <span class="italic-pop">growing fast</span>` })}
        <div class="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">${milestones}</div>
      </div>
    </section>

    <!-- Visit Us -->
    <section class="container-x py-24">
      <div class="grid items-center gap-10 rounded-[2rem] border border-ink/10 bg-cream p-8 md:p-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p class="eyebrow" style="display:inline-flex">Visit us</p>
          <h2 class="h-display mt-4 text-3xl md:text-4xl">Drop by Koramangala — <span class="italic-pop">the coffee's on us</span></h2>
          <p class="mt-4 text-[15px] leading-relaxed text-ink-soft">#12, MPD Complex, 3rd Floor, 5th Block, Koramangala, Bangalore – 560095 · +91 80 4979 3366 / 6633 · contact@tranquilpeeplz.com</p>
        </div>
        <div class="flex flex-wrap gap-4 lg:justify-end">
          <a href="/contact-us" class="btn btn-primary">Get in touch ${icon("arrow-up-right", "", 15)}</a>
        </div>
      </div>
    </section>
    ${stamp("hidden")}`;
}

export function forEmployerPage(): string {
  const models = [
    { icon: "users-round", title: "Contract & Temporary Staffing", copy: "Scale teams up or down with vetted professionals on our rolls or yours — perfect for projects, peaks and uncertain demand." },
    { icon: "search-check", title: "Permanent Hiring", copy: "Full-cycle recruitment for roles that matter: sourcing, screening, coordination and offer management, end to end." },
    { icon: "trending-up", title: "Workforce Transformation", copy: "People strategy for the long term — org design, upskilling paths and leadership enablement that outlast any single hire." },
  ]
    .map(
      (m, i) => rv(
        `<div class="card-hover h-full rounded-[1.75rem] border border-ink/10 bg-paper p-8">
          <span class="grid h-13 w-13 place-items-center rounded-2xl bg-sage text-pine">${icon(m.icon, "", 24)}</span>
          <h3 class="font-display mt-6 text-[1.55rem] leading-snug font-medium tracking-tight">${m.title}</h3>
          <p class="mt-3 text-[14.5px] leading-relaxed text-ink-soft">${m.copy}</p>
        </div>`,
        { delay: 0.08 * i },
      ),
    )
    .join("");

  const steps = [
    { nr: "01", title: "Brief & calibrate", copy: "A working session to define the role, the success profile and the realistic market picture." },
    { nr: "02", title: "Source & screen", copy: "We tap our network and fresh sourcing; you get a tight shortlist with notes that matter." },
    { nr: "03", title: "Interview & decide", copy: "We coordinate logistics, prep candidates, gather feedback fast and keep the loop moving." },
    { nr: "04", title: "Offer & beyond", copy: "Negotiation, notice-period engagement and onboarding support until the hire truly lands." },
  ]
    .map(
      (s, i) => rv(
        `<div class="card-hover flex gap-6 rounded-3xl border border-ink/10 bg-cream p-6 md:p-7">
          <span class="font-display text-3xl font-semibold text-accent">${s.nr}</span>
          <div>
            <h3 class="font-display text-xl font-medium tracking-tight">${s.title}</h3>
            <p class="mt-1.5 text-[14px] leading-relaxed text-ink-soft">${s.copy}</p>
          </div>
        </div>`,
        { delay: 0.07 * i },
      ),
    )
    .join("");

  return `${hero({
    eyebrow: "For Employers",
    title: `Hire right.<br/>Hire <span class="italic-pop">fast.</span> Keep them.`,
    intro:
      "Your team is your strategy. We help you build it — with staffing that flexes, permanent hiring that sticks, and a truly consultative partner in between. Share a requirement today; it goes live after a quick review.",
    image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1100",
    imageAlt: "Indian hiring managers in discussion",
    stat: { value: "5–7 days", label: "to first shortlist" },
    cta: `<a href="/post-a-job" class="btn btn-accent">Post a job ${icon("arrow-up-right", "", 16)}</a><a href="/job-search" class="btn btn-outline">See the live board</a>`,
    extraBullets: [
      "Shortlists in 5–7 working days for most roles",
      "Every candidate screened, referenced and briefed",
      "One dedicated recruiter who learns your culture",
      "Replacement assurance on permanent placements",
      "Transparent weekly pipeline reporting",
    ],
  })}
  <section class="border-y border-ink/10 bg-cream py-24">
    <div class="container-x">
      ${sectionHeading({ align: "center", eyebrow: "Engagement models", title: `Three ways to build<br/>your <span class="italic-pop">team with us</span>` })}
      <div class="mt-14 grid gap-6 md:grid-cols-3">${models}</div>
    </div>
  </section>
  <section class="container-x py-24">
    <div class="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        ${sectionHeading({ eyebrow: "The process", title: `A pipeline you can<br/>actually <span class="italic-pop">follow</span>`, intro: "No black boxes. You'll always know where every requirement stands — who's in the funnel, what's next, and what we need from you." })}
        ${rv(`<div class="img-frame mt-9 aspect-[16/10] hidden lg:block"><img src="https://images.pexels.com/photos/7495291/pexels-photo-7495291.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=640&w=1000" alt="Indian recruiters reviewing candidate profiles" class="object-cover" /></div>`, { delay: 0.15 })}
      </div>
      <div class="space-y-4">
        ${steps}
        ${rv(`<div class="flex flex-wrap items-center gap-5 rounded-3xl bg-ink p-7 text-cream">
          ${icon("shield-check", "shrink-0 text-gold", 30)}
          <p class="flex-1 text-[14.5px] leading-relaxed text-cream/80"><span class="font-semibold text-cream">Assurance built in.</span> If a permanent placement doesn't work out in the early months, we replace them — no new fee, no fine print.</p>
        </div>`, { delay: 0.3 })}
      </div>
    </div>
  </section>
  ${ctaBand({ title: "Have a role to fill", copy: "Post it on our board in three minutes, or send the brief and let us run the entire search for you.", primary: `<a href="/post-a-job" class="btn btn-accent">Post a job ${icon("arrow-up-right", "", 16)}</a>` })}`;
}

export function forJobSeekerPage(p: { featured: { job: Job; company: Company }[] }): string {
  const support = [
    { icon: "compass", title: "Career guidance", copy: "Honest advice on where your profile fits, what to learn next, and what the market is actually paying." },
    { icon: "file-text", title: "Résumé & interview prep", copy: "We sharpen your story before you ever meet the employer — so you walk in ready, not lucky." },
    { icon: "messages-square", title: "Feedback, always", copy: "No ghosting — from us or through us. You hear outcomes, reasons and next steps on every application." },
    { icon: "sparkles", title: "Beyond the offer", copy: "Negotiation support and a smooth first 90 days. Your start is our finish line, not our invoice date." },
  ]
    .map(
      (s, i) => rv(
        `<div class="card-hover h-full rounded-[1.75rem] border border-ink/10 bg-paper p-7">
          <span class="grid h-12 w-12 place-items-center rounded-2xl bg-sage text-pine">${icon(s.icon, "", 22)}</span>
          <h3 class="font-display mt-5 text-xl font-medium tracking-tight">${s.title}</h3>
          <p class="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">${s.copy}</p>
        </div>`,
        { delay: 0.07 * i },
      ),
    )
    .join("");

  const faqs = [
    { q: "Does it cost me anything?", a: "Never. Our fees are paid by employers. Browsing and applying through Tranquil Peeplz is completely free for candidates." },
    { q: "Do I need an account to apply?", a: "No. Pick a role, share your details in the apply form, and our recruiters take it from there. Nothing to sign up for." },
    { q: "Which industries do you place in?", a: "IT & software, healthcare, finance & banking, manufacturing, e-commerce & retail, education, hospitality and advertising & media — Bangalore-focused, with remote and hybrid options." },
    { q: "Will my current employer find out?", a: "No. Your details stay with our recruiters and go to an employer only after you apply and we speak with you first." },
  ]
    .map(
      (f, i) => rv(
        `<details class="group rounded-3xl border border-ink/10 bg-cream p-6 open:border-pine/40">
          <summary class="flex cursor-pointer items-center justify-between gap-4">
            <h3 class="font-display text-lg font-medium tracking-tight">${f.q}</h3>
            <span class="details-plus grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 text-lg">+</span>
          </summary>
          <p class="mt-3 text-[14.5px] leading-relaxed text-ink-soft">${f.a}</p>
        </details>`,
        { delay: 0.05 * i },
      ),
    )
    .join("");

  return `${hero({
    eyebrow: "For Job Seekers",
    title: `Your next role is<br/>already <span class="italic-pop">looking for you</span>`,
    intro:
      "Great careers aren't found in infinite scroll. Browse approved roles, share your details once, and our recruiters stay with you through every round — no accounts, no noise. We're here to open doors to your next possibility.",
    image: "https://images.pexels.com/photos/7720493/pexels-photo-7720493.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1100",
    imageAlt: "Indian professional planning their next career move",
    stat: { value: "Free", label: "for candidates, forever" },
    cta: `<a href="/job-search" class="btn btn-accent">Browse live roles ${icon("arrow-up-right", "", 16)}</a><a href="/contact-us" class="btn btn-outline">Talk to a recruiter</a>`,
    extraBullets: [
      "100% free for candidates, always",
      "No account needed — just apply",
      "Real feedback on every application",
    ],
  })}
  <section class="border-y border-ink/10 bg-cream py-24">
    <div class="container-x">
      ${sectionHeading({ align: "center", eyebrow: "In your corner", title: `More than a portal —<br/>a <span class="italic-pop">partner in your search</span>` })}
      <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">${support}</div>
    </div>
  </section>
  <section class="container-x py-24">
    <div class="flex flex-wrap items-end justify-between gap-6">
      ${sectionHeading({ eyebrow: "Open right now", title: `A taste of the <span class="italic-pop">live board</span>` })}
      ${rv(`<a href="/job-search" class="link-underline text-[13px] tracking-[0.14em] text-ink/70 uppercase">See all roles →</a>`, { delay: 0.1 })}
    </div>
    <div class="mt-12 grid gap-5 md:grid-cols-3">
      ${p.featured.map((f, i) => rv(jobCard(f.job, f.company), { delay: 0.06 * i })).join("")}
    </div>
  </section>
  <section class="container-x pb-24">
    <div class="mx-auto max-w-3xl">
      ${sectionHeading({ align: "center", eyebrow: "Good to know", title: `Questions, <span class="italic-pop">answered</span>` })}
      <div class="mt-12 space-y-4">${faqs}</div>
      ${rv(`<div class="mt-12 text-center"><a href="/job-search" class="btn btn-accent">Start applying ${icon("arrow-up-right", "", 16)}</a></div>`, { delay: 0.2 })}
    </div>
  </section>`;
}

// ---------------------------------------------------------------------------
// Services (one template, three configs)
// ---------------------------------------------------------------------------

export type ServicePageConfig = {
  path: string;
  metaTitle: string;
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  stat: { value: string; label: string };
  offerings: { icon: string; title: string; copy: string }[];
  bullets: string[];
  steps: { nr: string; title: string; copy: string }[];
  ctaTitle: string;
  ctaCopy: string;
};

export const SERVICE_PAGES: ServicePageConfig[] = [
  {
    path: "/staffing",
    metaTitle: "Staffing Services",
    eyebrow: "Services · Staffing",
    title: "Staffing that keeps your <span class=\"italic-pop\">momentum</span>",
    intro:
      "Short-term cover, seasonal ramps or long-haul projects — our staffing solutions deliver vetted, productive people on your schedule, so your business never waits on headcount.",
    image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1100",
    imageAlt: "Indian project team collaborating",
    stat: { value: "3 weeks", label: "Forty hires for one ramp" },
    offerings: [
      { icon: "calendar-clock", title: "Contract staffing", copy: "Specialists on demand for defined projects — screened, onboarded and managed without adding permanent headcount." },
      { icon: "layers", title: "Volume & seasonal staffing", copy: "Structured mass hiring for peak seasons and new-site launches, with assessments and scheduling handled end to end." },
      { icon: "refresh-ccw", title: "Temp-to-hire", copy: "Try before you commit. Convert top contractors to permanent roles with real work as the interview." },
    ],
    bullets: [
      "First profiles in 72 hours for most positions",
      "Payroll and compliance handled on flexible models",
      "Attendance, replacements and exits managed for you",
      "Volume hiring with assessment days and bulk onboarding",
      "A single accountable partner from brief to deployment",
    ],
    steps: [
      { nr: "01", title: "Demand mapping", copy: "We size the requirement — skills, shifts, duration, budget — and agree on SLAs before sourcing starts." },
      { nr: "02", title: "Rapid sourcing & vetting", copy: "Our bench plus fresh sourcing, with skill checks and document verification built in." },
      { nr: "03", title: "Deployment & onboarding", copy: "Coordinated joining, induction support and day-one readiness so people are productive immediately." },
      { nr: "04", title: "Ongoing management", copy: "We stay engaged: attendance, performance check-ins, backfills and smooth offboarding." },
    ],
    ctaTitle: "Scale your team",
    ctaCopy: "Tell us the numbers — roles, locations, start dates — and we'll come back with a staffing plan within one business day.",
  },
  {
    path: "/hiring-recruitment-agency",
    metaTitle: "Hiring & Permanent Recruitment",
    eyebrow: "Services · Hiring",
    title: "Hiring beyond <span class=\"italic-pop\">filling seats</span>",
    intro:
      "The strength of every organisation lies in its people. Our permanent recruitment blends human insight with smart tooling to find hires who define your culture, drive your vision and elevate your success.",
    image: "https://images.pexels.com/photos/7495291/pexels-photo-7495291.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1100",
    imageAlt: "Indian recruiter interviewing a candidate",
    stat: { value: "92%", label: "Placements past probation" },
    offerings: [
      { icon: "user-check", title: "Lateral & niche hiring", copy: "Specialist roles need specialist sourcing. We map the market, approach passive talent and bring you candidates who weren't looking." },
      { icon: "compass", title: "Executive search", copy: "Confidential, research-led search for leadership roles — with assessment depth that protects your most important decisions." },
      { icon: "gauge", title: "Recruitment process support", copy: "Embedded recruiters, interview design and offer-decision support that make your whole funnel faster and fairer." },
    ],
    bullets: [
      "Shortlists of 3–5 pre-assessed candidates, not CV avalanches",
      "Culture-fit screening grounded in your actual values",
      "Compensation benchmarking from live market data",
      "Offer-to-joining engagement that beats counteroffers",
      "Replacement assurance during the early months",
    ],
    steps: [
      { nr: "01", title: "Deep-dive brief", copy: "Beyond the JD: team dynamics, success metrics, deal-breakers and the honest pitch we can make to candidates." },
      { nr: "02", title: "Market mapping & outreach", copy: "Targeted search across our network and the wider market, including talent not actively applying anywhere." },
      { nr: "03", title: "Assess & shortlist", copy: "Structured screening against your scorecard; every profile arrives with interview notes, salary context and availability." },
      { nr: "04", title: "Close & land", copy: "We manage offers, notice periods and pre-joining engagement — then check in at 30, 60 and 90 days." },
    ],
    ctaTitle: "Make your next great hire",
    ctaCopy: "Send us the role and we'll share an honest market read plus a sourcing plan — before you spend a rupee.",
  },
  {
    path: "/workforce-transformation",
    metaTitle: "Workforce Transformation",
    eyebrow: "Services · Workforce Transformation",
    title: "Build teams that <span class=\"italic-pop\">outgrow the plan</span>",
    intro:
      "Through strategic consulting, talent development and coaching, we help organisations evolve their people strategy for the long term — so your teams don't just adapt to change, they thrive on it.",
    image: "https://images.pexels.com/photos/7495555/pexels-photo-7495555.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1100",
    imageAlt: "Indian leaders in a strategy workshop",
    stat: { value: "360°", label: "From org design to coaching" },
    offerings: [
      { icon: "route", title: "Talent strategy & org design", copy: "Workforce planning, role architecture and succession maps that line up your people plan with the business plan." },
      { icon: "graduation-cap", title: "Upskilling programmes", copy: "Practical learning journeys for high-demand skills — designed around your stack, your customers and your calendar." },
      { icon: "mountain", title: "Leadership enablement", copy: "Coaching and development for first-time managers and senior leaders facing bigger mandates." },
    ],
    bullets: [
      "A skills inventory that shows what you have vs. what you need",
      "Internal mobility paths that retain your best people",
      "Manager toolkits: feedback, delegation, difficult conversations",
      "Programmes measured on behaviour change, not attendance",
      "Quarterly reviews that keep the strategy honest",
    ],
    steps: [
      { nr: "01", title: "Diagnose", copy: "Structured discovery with leadership and teams — where the organisation is strong, stretched or quietly stuck." },
      { nr: "02", title: "Design", copy: "A pragmatic roadmap: structure, skills and leadership priorities sequenced against your business calendar." },
      { nr: "03", title: "Deliver", copy: "Programmes, coaching and pilots — run with your teams, in your context, using your real work." },
      { nr: "04", title: "Embed", copy: "Measurement, iteration and handover so the transformation survives long after we leave the room." },
    ],
    ctaTitle: "Transform your workforce",
    ctaCopy: "Book a discovery call — we'll map your biggest people-leverage points in one session, free of charge.",
  },
];

export function servicePage(c: ServicePageConfig): string {
  return `${hero({
    eyebrow: c.eyebrow,
    title: c.title,
    intro: c.intro,
    image: c.image,
    imageAlt: c.imageAlt,
    stat: c.stat,
    cta: `<a href="/post-a-job" class="btn btn-accent">Start a requirement ${icon("arrow-up-right", "", 16)}</a><a href="/contact-us" class="btn btn-outline">Talk to a consultant</a>`,
  })}
  <section class="border-y border-ink/10 bg-cream py-24">
    <div class="container-x">
      ${sectionHeading({ align: "center", eyebrow: "What we deliver", title: `Built for <span class="italic-pop">real outcomes</span>` })}
      <div class="mt-14 grid gap-6 md:grid-cols-3">
        ${c.offerings
      .map(
        (o, i) => rv(
          `<div class="card-hover h-full rounded-[1.75rem] border border-ink/10 bg-paper p-8">
                <span class="grid h-13 w-13 place-items-center rounded-2xl bg-sage text-pine">${icon(o.icon, "", 24)}</span>
                <h3 class="font-display mt-6 text-[1.5rem] leading-snug font-medium tracking-tight">${esc(o.title)}</h3>
                <p class="mt-3 text-[14.5px] leading-relaxed text-ink-soft">${esc(o.copy)}</p>
              </div>`,
          { delay: 0.08 * i },
        ),
      )
      .join("")}
      </div>
    </div>
  </section>
  <section class="container-x py-24">
    <div class="grid gap-14 lg:grid-cols-2">
      <div>
        ${sectionHeading({ eyebrow: "How it runs", title: `The engagement, <span class="italic-pop">step by step</span>` })}
        <div class="mt-10 space-y-4">
          ${c.steps
      .map(
        (s, i) => rv(
          `<div class="card-hover flex gap-6 rounded-3xl border border-ink/10 bg-cream p-6">
                  <span class="font-display text-3xl font-semibold text-accent">${s.nr}</span>
                  <div>
                    <h3 class="font-display text-xl font-medium tracking-tight">${esc(s.title)}</h3>
                    <p class="mt-1.5 text-[14px] leading-relaxed text-ink-soft">${esc(s.copy)}</p>
                  </div>
                </div>`,
          { delay: 0.07 * i },
        ),
      )
      .join("")}
        </div>
      </div>
      <div>
        ${sectionHeading({ eyebrow: "The difference", title: `What you can <span class="italic-pop">count on</span>` })}
        ${rv(`<ul class="mt-10 space-y-4">${c.bullets.map((b) => `<li class="flex items-start gap-3.5 rounded-2xl border border-ink/10 bg-cream px-5 py-4 text-[14.5px] font-medium text-ink-soft">${icon("circle-check", "mt-0.5 shrink-0 text-moss", 19)}${esc(b)}</li>`).join("")}</ul>`, { delay: 0.1 })}
      </div>
    </div>
  </section>
  ${ctaBand({ title: c.ctaTitle, copy: c.ctaCopy, primary: `<a href="/post-a-job" class="btn btn-accent">Post a job ${icon("arrow-up-right", "", 16)}</a>` })}`;
}

// ---------------------------------------------------------------------------

export function contactPage(p?: {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
}): string {
  const v = (n: string) => esc(p?.values?.[n] ?? "");
  let formInner: string;
  if (p?.success) {
    formInner = `<div class="rounded-xl border border-moss/25 bg-moss/10 p-8 text-center">
      <span class="mx-auto grid h-10 w-10 place-items-center rounded-full bg-accent text-cream">${icon("circle-check", "", 22)}</span>
      <h3 class="font-display mt-3 text-lg font-medium text-ink">Message received</h3>
      <p class="mt-1 text-[13px] text-ink-soft">${esc(p.message ?? "")}</p>
    </div>`;
  } else {
    const topicOpts = [
      ["general", "General Enquiry"],
      ["staffing", "Staffing Service"],
      ["jobseeker", "Jobseeker"],
    ]
      .map(([val, label]) => `<option value="${val}"${p?.values?.topic === val ? " selected" : ""}>${label}</option>`)
      .join("");
    formInner = `<form method="post" action="/contact-us" class="space-y-5">
      ${formAlert(p?.errors ? { ok: false, message: p.message ?? "Please fix the highlighted fields." } : null)}
      <input type="text" name="website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label class="field-label" for="c-name">Your name</label>
          <input id="c-name" name="name" class="field" placeholder="Asha Rao" value="${v("name")}" required />
          ${fieldError(p?.errors, "name")}
        </div>
        <div>
          <label class="field-label" for="c-email">Your email</label>
          <input id="c-email" name="email" type="email" class="field" placeholder="you@company.com" value="${v("email")}" required />
          ${fieldError(p?.errors, "email")}
        </div>
      </div>
      <div>
        <label class="field-label" for="c-phone">Phone Number</label>
        <input id="c-phone" name="phone" class="field" placeholder="+91 98XXX XXXXX" value="${v("phone")}" />
        ${fieldError(p?.errors, "phone")}
      </div>
      <div>
        <label class="field-label" for="c-topic">How can we help you?</label>
        <select id="c-topic" name="topic" class="field" required>${topicOpts}</select>
        ${fieldError(p?.errors, "topic")}
      </div>
      <div>
        <label class="field-label" for="c-message">Your message <span class="normal-case text-ink/40">(optional)</span></label>
        <textarea id="c-message" name="message" rows="5" class="field resize-none" placeholder="Tell us about your hiring challenge or career goals…">${v("message")}</textarea>
        ${fieldError(p?.errors, "message")}
      </div>
      <button type="submit" class="btn btn-accent w-full sm:w-auto">Submit ${icon("arrow-right", "", 16)}</button>
    </form>`;
  }

  return `
    <!-- Banner Section - With background image -->
    <section class="relative overflow-hidden py-16 md:py-20 lg:py-24">
      <div class="absolute inset-0 z-0">
        <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" alt="Modern office building entrance" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
      <div class="container-x relative z-10 text-center">
        ${rv(`<p class="eyebrow justify-center !text-gold" style="display:inline-flex">Contact Us</p>
        <h1 class="h-display mt-4 text-4xl md:text-5xl lg:text-6xl text-cream">
            Get In Touch
          </h1>`, { delay: 0.08 })}
        ${rv(`<p class="mt-5 max-w-2xl mx-auto text-[16px] leading-relaxed text-cream/70">We'd love to hear from you. Let's start a conversation.</p>`, { delay: 0.16 })}
      </div>
    </section>

    <!-- Contact Content -->
    <section class="container-x -mt-10 py-16 lg:py-24 relative z-10">
      <div class="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <!-- Contact Information -->
        <div class="space-y-8">
          ${rv(`<p class="eyebrow justify-start !text-gold" style="display:inline-flex">Contact Information</p>
          <h2 class="h-display mt-3 text-3xl md:text-4xl text-ink">Contact Information</h2>
          <p class="mt-4 text-[16px] leading-relaxed text-ink-soft">Have a question or want to discuss your recruitment needs? We're here to help.</p>`, { delay: 0.08 })}

          <div class="space-y-6">
            ${rv(`<div class="flex gap-4">
              <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-cream">${icon("map-pin", "", 20)}</span>
              <div>
                <h3 class="text-[11px] font-semibold tracking-[0.15em] text-ink/45 uppercase">Office Address</h3>
                <address class="mt-1.5 not-italic text-[15px] font-medium text-ink leading-relaxed">
                  #12, MPD Complex, 2nd Floor, 5th Block,<br>Koramangala, Bangalore – 560095
                </address>
              </div>
            </div>`, { delay: 0.12 })}

            ${rv(`<div class="flex gap-4">
              <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-cream">${icon("phone", "", 20)}</span>
              <div>
                <h3 class="text-[11px] font-semibold tracking-[0.15em] text-ink/45 uppercase">Phone</h3>
                <div class="mt-1.5 space-y-1 text-[15px] font-medium text-ink leading-relaxed">
                  <a href="tel:+918049793366" class="transition-colors hover:text-accent">Landline: 080 4979 3366 / 6633</a>
                  <a href="tel:+918951274950" class="transition-colors hover:text-accent">Mobile: 89512 74950</a>
                </div>
              </div>
            </div>`, { delay: 0.16 })}

            ${rv(`<div class="flex gap-4">
              <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-cream">${icon("mail", "", 20)}</span>
              <div>
                <h3 class="text-[11px] font-semibold tracking-[0.15em] text-ink/45 uppercase">Email</h3>
                <a href="mailto:contact@tranquilpeeplz.com" class="mt-1.5 block text-[15px] font-medium text-ink transition-colors hover:text-accent">contact@tranquilpeeplz.com</a>
              </div>
            </div>`, { delay: 0.2 })}
          </div>

          <!-- Walk-in Info -->
          ${rv(`<a href="https://maps.google.com/?q=Koramangala+5th+Block+Bangalore" class="card-hover group flex items-start gap-4 rounded-2xl border border-ink/10 bg-gradient-to-r from-ink to-ink/80 p-6 text-cream transition-all duration-300 hover:border-accent hover:shadow-xl hover:-translate-y-1">
            <div class="flex-1">
              <p class="font-display text-lg font-medium">Prefer to walk in?</p>
              <p class="mt-2 text-[14px] leading-relaxed text-cream/80">Our Koramangala office is two minutes from the 5th Block signal. Candidates welcome for profile registrations and consultations — an appointment helps us serve you faster.</p>
              <span class="inline-flex items-center gap-2 mt-3 text-[12px] font-semibold tracking-[0.1em] text-accent/80 group-hover:text-accent">Get directions ${icon("arrow-up-right", "", 14)}</span>
            </div>
          </a>`, { delay: 0.24 })}
        </div>

        <!-- Form Card -->
        ${rv(`<div class="rounded-2xl border border-ink/10 bg-cream p-6 md:p-8 shadow-xl shadow-ink/10">
          ${rv(`<h2 class="font-display text-2xl font-medium tracking-tight">Send Us a <span class="italic-pop">Message</span></h2>`, { delay: 0.1 })}
          <div class="mt-6">${formInner}</div>
        </div>`, { delay: 0.15 })}
      </div>
    </section>
  `;
}

export function privacyPage(): string {
  const sections = [
    { title: "What we collect", body: "When you apply for a role or submit a job opening, we collect the details you provide: name, contact information, résumé links, role requirements and company information. When you contact us through forms, we store your message and contact details so we can respond." },
    { title: "How we use it", body: "Candidate details are used solely to progress your application with the relevant employer, handled by our recruiting team. Employer details are used to present roles to suitable candidates. We also use contact details to respond to enquiries." },
    { title: "What we never do", body: "We do not sell personal data. We do not share applicant details with anyone beyond the employer handling the role and our internal team. We do not contact your current employer. We do not use your information for purposes unrelated to recruitment and staffing." },
    { title: "Storage & security", body: "Your data is stored on encrypted infrastructure with access limited to our consulting team. Application records are retained only as long as needed for recruitment purposes, and we delete personal data on request." },
    { title: "Your controls", body: "To correct, download or permanently delete your data, email contact@tranquilpeeplz.com and we will act on verifiable requests within 15 working days." },
    { title: "Changes & contact", body: "If this policy changes materially, we will post the update here before it takes effect. Questions about privacy can be sent to contact@tranquilpeeplz.com or to our office at #12, MPD Complex, 3rd Floor, 5th Block, Koramangala, Bangalore – 560095." },
  ];
  return `<div class="container-x max-w-3xl pt-10 pb-24 lg:pt-14">
    ${rv(`<p class="eyebrow" style="display:inline-flex">Legal</p>
    <h1 class="h-display mt-5 text-5xl leading-[1.02] md:text-6xl">Privacy <span class="italic-pop">Policy</span></h1>
    <p class="mt-5 text-[15px] text-ink-soft">Recruitment runs on trust. Here's exactly how we handle the information you share with Tranquil Peeplz — in plain language.</p>`)}
    <div class="mt-12 space-y-8">
      ${sections
      .map(
        (s, i) => rv(
          `<section class="rounded-3xl border border-ink/10 bg-cream p-7">
              <h2 class="font-display text-xl font-medium tracking-tight"><span class="mr-3 text-accent">0${i + 1}</span>${esc(s.title)}</h2>
              <p class="mt-3 text-[15px] leading-[1.8] text-ink-soft">${esc(s.body)}</p>
            </section>`,
          { delay: 0.04 * i },
        ),
      )
      .join("")}
    </div>
    <p class="mt-8 text-[13px] text-ink/50">Last updated: January 2026</p>
  </div>`;
}
