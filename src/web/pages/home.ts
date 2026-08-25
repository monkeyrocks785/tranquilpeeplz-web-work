import { esc, rv, marquee, sectionHeading } from "../html";
import { icon, stamp } from "../icons";
import type { Job, Company, BlogPost } from "../../db/schema";
import { jobCard } from "./jobs";

const SERVICES = [
  {
    nr: "01",
    href: "/staffing",
    title: "Staffing",
    icon: "users-round",
    copy: "Contract, temporary and permanent staffing that flexes with your workload. Skilled people, vetted fast — so projects never lose momentum.",
    tags: ["Contract staffing", "Temp-to-hire", "Volume hiring"],
  },
  {
    nr: "02",
    href: "/hiring-recruitment-agency",
    title: "Hiring",
    icon: "search",
    copy: "Permanent recruitment that goes beyond filling a seat. We find people who fit your culture, share your ambition and stay for the story.",
    tags: ["Executive search", "Lateral hiring", "Leadership roles"],
  },
  {
    nr: "03",
    href: "/workforce-transformation",
    title: "Workforce Transformation",
    icon: "sparkles",
    copy: "Strategy, upskilling and leadership enablement that help your people grow with the business — not behind it.",
    tags: ["Talent strategy", "Upskilling", "Leadership coaching"],
  },
];

const STEPS = [
  {
    nr: "01",
    title: "Share your requirements",
    copy: "Tell us what great looks like for the role — contract, permanent, one hire or fifty. We listen first, then define the brief together.",
  },
  {
    nr: "02",
    title: "We find the right matches",
    copy: "Our recruiters and search tools surface candidates aligned on skills, experience and culture — not just keywords.",
  },
  {
    nr: "03",
    title: "Connect, interview & select",
    copy: "You meet only the best fits. We coordinate schedules, prep both sides and keep the loop tight.",
  },
  {
    nr: "04",
    title: "Begin the journey",
    copy: "Offer, onboarding, follow-through. We stay close after day one so the match turns into momentum.",
  },
];

const VALUES = [
  {
    icon: "handshake",
    title: "Trust at the Core",
    copy: "Transparent, reliable, and honest in every conversation. We deliver on every promise — every time.",
  },
  {
    icon: "users-round",
    title: "People-First Focus",
    copy: "Peeplz means people, not profiles. Every candidate is a person with ambitions; every client a partner.",
  },
  {
    icon: "badge-check",
    title: "Excellence Always",
    copy: "We treat every engagement as a benchmark — for quality, for speed, and for how hiring should feel.",
  },
  {
    icon: "zap",
    title: "Speed with Purpose",
    copy: "Fast, because the market is. But never frantic — every move is deliberate and built to last.",
  },
  {
    icon: "building-2",
    title: "Global Vision",
    copy: "Rooted in Bangalore, building toward a unified platform for hiring and staffing across the world.",
  },
  {
    icon: "sparkles",
    title: "Lasting Impact",
    copy: "Growth you can measure — in careers launched, teams strengthened and businesses that keep compounding.",
  },
];

const INDUSTRIES = [
  { icon: "code-2", name: "IT & Software" },
  { icon: "heart-pulse", name: "Healthcare" },
  { icon: "landmark", name: "Finance & Banking" },
  { icon: "factory", name: "Manufacturing" },
  { icon: "store", name: "E-commerce & Retail" },
  { icon: "graduation-cap", name: "Education" },
  { icon: "utensils-crossed", name: "Hospitality & Travel" },
  { icon: "megaphone", name: "Advertising & Media" },
];

const CHALLENGES = [
  "Weeks lost to slow, unstructured hiring cycles",
  "Shallow access to quality and niche-skill candidates",
  "HR teams buried in coordination instead of strategy",
  "Mis-hires that cost months of salary and momentum",
];

const SOLUTIONS = [
  "A streamlined pipeline that moves in days, not months",
  "A pre-vetted talent network across eight industries",
  "Structured shortlists — you interview only real fits",
  "People who match your values and stay to build",
];

const TESTIMONIALS = [
  {
    quote:
      "We'd been trying to close a senior engineering role for two months. Tranquil Peeplz sent three genuinely strong candidates in the first week.",
    name: "VP Engineering",
    org: "Fintech scale-up, Bangalore",
  },
  {
    quote:
      "What stood out was the honesty. They told us when our expectations were off, recalibrated the brief, and still delivered ahead of schedule.",
    name: "Head of HR",
    org: "Healthcare group",
  },
  {
    quote:
      "For our seasonal ramp they staffed forty people in three weeks — screened, scheduled, and onboarded. Our team barely lifted a finger.",
    name: "Operations Director",
    org: "E-commerce marketplace",
  },
];

export function homePage(p: {
  featured: { job: Job; company: Company }[];
  posts: BlogPost[];
  openJobs: number;
}): string {
  const openJobs = Math.max(p.openJobs, 12);

  const hero = `<section class="relative overflow-hidden">
    <div class="dot-grid pointer-events-none absolute inset-0 opacity-60"></div>
    <div class="pointer-events-none absolute -top-32 -right-40 h-[480px] w-[480px] rounded-full bg-sage/60 blur-3xl"></div>
    <div class="pointer-events-none absolute top-40 -left-40 h-[380px] w-[380px] rounded-full bg-gold/20 blur-3xl"></div>
    <div class="container-x relative grid items-center gap-14 pt-10 pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16 lg:pb-28">
      <div>
        ${rv(`<p class="eyebrow" style="display:inline-flex">Recruitment · Staffing · Workforce — Bangalore</p>`)}
        ${rv(
    `<h1 class="h-display mt-6 text-[13.5vw] leading-[0.98] sm:text-6xl md:text-7xl xl:text-[5.4rem]">
            Creating<br/>Possibilities<br/>
            <span class="squiggle italic-pop">Faster.
              <svg viewBox="0 0 220 22" preserveAspectRatio="none" aria-hidden="true"><path d="M3 15 C 40 4, 80 20, 110 12 S 175 3, 217 13" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>
            </span>
          </h1>`,
    { delay: 0.08 },
  )}
        ${rv(`<p class="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-soft">Tranquil Peeplz transforms how organisations connect and grow with people — through speed, precision and purpose. One partner for staffing, permanent hiring and everything in between.</p>`, { delay: 0.16 })}
        ${rv(
    `<div class="mt-9 flex flex-wrap items-center gap-4">
            <a href="/job-search" class="btn btn-accent">Find Jobs ${icon("arrow-up-right", "", 16)}</a>
            <a href="/for-employer" class="btn btn-outline">Hire Talent ${icon("arrow-right", "", 16)}</a>
          </div>`,
    { delay: 0.24 },
  )}
        ${rv(
    `<dl class="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/12 pt-7">
            ${[
      { v: 500, s: "+", l: "Professionals placed" },
      { v: 60, s: "+", l: "Partner companies" },
      { v: openJobs, s: "", l: "Open roles today" },
    ]
      .map(
        (x) => `<div>
                <dt class="sr-only">${x.l}</dt>
                <dd class="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl"><span data-count="${x.v}" data-suffix="${x.s}">0${x.s}</span></dd>
                <dd class="mt-1 text-[12px] font-medium tracking-wide text-ink/55 uppercase">${x.l}</dd>
              </div>`,
      )
      .join("")}
          </dl>`,
    { delay: 0.32 },
  )}
      </div>
      ${rv(
    `<div class="relative hidden lg:block">
          <div class="relative ml-auto w-full max-w-[430px]">
            <div class="img-frame aspect-[4/5] shadow-2xl shadow-ink/20">
              <img src="https://images.pexels.com/photos/3861563/pexels-photo-3861563.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=880" alt="Colleagues in an upbeat conversation at the office" class="object-cover" />
            </div>
            <div class="img-frame animate-float absolute -bottom-10 -left-16 w-52 aspect-[4/3] border-4 border-paper shadow-xl shadow-ink/20">
              <img src="https://images.pexels.com/photos/4226118/pexels-photo-4226118.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=560" alt="A candidate in a job interview" class="object-cover" />
            </div>
            <div class="animate-float-slow absolute -top-8 -right-6 rounded-3xl border border-ink/10 bg-cream px-5 py-4 shadow-lg shadow-ink/10">
              <p class="font-display text-2xl font-semibold text-pine">21 days</p>
              <p class="text-[11px] font-semibold tracking-[0.16em] text-ink/55 uppercase">Avg. time to hire</p>
            </div>
            ${stamp("absolute -right-10 bottom-16 text-ink/70")}
          </div>
        </div>`,
    { delay: 0.2 },
  )}
    </div>
  </section>
  ${marquee([
    "Staffing",
    "Permanent Hiring",
    "Workforce Transformation",
    "Bangalore",
    "IT",
    "Healthcare",
    "Finance",
    "Manufacturing",
    "E-commerce",
    "Education",
    "Hospitality",
    "Advertising",
  ])}`;

  const services = `<section class="container-x py-24">
    <div class="flex flex-wrap items-end justify-between gap-6">
      ${sectionHeading({
    eyebrow: "Our Services",
    title: `Three ways we move<br/>your team <span class="italic-pop">forward</span>`,
    intro: "Hiring and staffing solutions that keep pace with today's demands — and tomorrow's growth.",
  })}
      ${rv(`<a href="/for-employer" class="link-underline text-[13px] uppercase tracking-[0.14em] text-ink/70">For employers →</a>`, { delay: 0.1 })}
    </div>
    <div class="mt-14 grid gap-6 md:grid-cols-3">
      ${SERVICES.map(
    (s, i) => rv(
      `<a href="${s.href}" class="card-hover group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink/10 bg-cream p-8 hover:border-pine hover:bg-pine">
            <div class="flex items-start justify-between">
              <span class="font-display text-6xl font-semibold text-ink/10 transition-colors group-hover:text-cream/15">${s.nr}</span>
              ${icon(s.icon, "text-accent transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110", 30)}
            </div>
            <h3 class="font-display mt-8 text-[1.9rem] font-medium tracking-tight text-ink transition-colors group-hover:text-cream">${s.title}</h3>
            <p class="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-soft transition-colors group-hover:text-cream/75">${esc(s.copy)}</p>
            <div class="mt-6 flex flex-wrap gap-2">${s.tags.map((t) => `<span class="rounded-full border border-ink/12 px-3 py-1 text-[11px] font-medium text-ink/60 transition-colors group-hover:border-cream/25 group-hover:text-cream/70">${esc(t)}</span>`).join("")}</div>
            <span class="mt-7 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] text-accent uppercase">Explore service ${icon("arrow-up-right", "", 15)}</span>
          </a>`,
      { delay: 0.08 * i },
    ),
  ).join("")}
    </div>
  </section>`;

  const how = `<section class="relative overflow-hidden bg-ink py-24 text-cream">
    <div class="dot-grid-light pointer-events-none absolute inset-0 opacity-50"></div>
    <div class="container-x relative">
      ${sectionHeading({
    dark: true,
    align: "center",
    eyebrow: "How Tranquil Peeplz Works",
    title: `From brief to <span class="italic-pop">day one</span>,<br class="hidden md:block"/> in four moves`,
    intro: "A simple, bold idea: transform how organisations find, connect and grow with talent — faster, smarter, and with purpose.",
  })}
      <div class="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        ${STEPS.map(
    (st, i) => rv(
      `<div class="relative border-t border-cream/15 pt-7">
              <span class="absolute -top-px left-0 h-px w-14 bg-accent"></span>
              <span class="font-display text-lg font-semibold text-accent italic">${st.nr}</span>
              <h3 class="font-display mt-3 text-2xl font-medium tracking-tight">${esc(st.title)}</h3>
              <p class="mt-3 text-[14px] leading-relaxed text-cream/65">${esc(st.copy)}</p>
            </div>`,
      { delay: 0.09 * i },
    ),
  ).join("")}
      </div>
    </div>
  </section>`;

  const who = `<section class="container-x grid items-center gap-14 py-24 lg:grid-cols-2">
    ${rv(
    `<div class="relative">
        <div class="img-frame aspect-[4/3] shadow-2xl shadow-ink/15">
          <img src="https://images.pexels.com/photos/7993944/pexels-photo-7993944.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1100" alt="The Tranquil Peeplz team collaborating" class="object-cover" />
        </div>
        <div class="animate-float absolute -bottom-8 right-6 rounded-3xl bg-accent px-6 py-5 text-cream shadow-xl shadow-accent/30">
          <p class="font-display text-3xl font-semibold">8</p>
          <p class="text-[11px] font-semibold tracking-[0.16em] uppercase opacity-90">Industries served</p>
        </div>
      </div>`,
  )}
    <div>
      ${sectionHeading({
    eyebrow: "What makes us — who we are",
    title: `We exist to create<br/>possibilities, <span class="italic-pop">faster</span>`,
    intro: "When people and businesses move together with speed, trust and purpose, growth becomes unstoppable. What sets us apart isn't just how fast we deliver — it's how deeply we care about the outcome.",
  })}
      <div class="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
        ${VALUES.map(
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
  ).join("")}
      </div>
      ${rv(`<a href="/about-us" class="btn btn-primary mt-10">Learn more about us ${icon("arrow-up-right", "", 16)}</a>`, { delay: 0.2 })}
    </div>
  </section>`;

  const industries = `<section class="border-y border-ink/10 bg-cream py-24">
    <div class="container-x">
      ${sectionHeading({
    align: "center",
    eyebrow: "Industries we cater to",
    title: `Specialised recruitment,<br/>across <span class="italic-pop">every sector</span> that matters`,
  })}
      <div class="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
        ${INDUSTRIES.map(
    (ind, i) => rv(
      `<a href="/job-search?industry=${encodeURIComponent(ind.name)}" class="card-hover group flex h-full flex-col items-center gap-4 rounded-3xl border border-ink/10 bg-paper px-6 py-9 text-center hover:border-pine">
              <span class="grid h-14 w-14 place-items-center rounded-full bg-pine text-cream transition-all duration-500 group-hover:rotate-6 group-hover:bg-accent">${icon(ind.icon, "", 24)}</span>
              <span class="font-display text-lg font-medium tracking-tight text-ink">${esc(ind.name)}</span>
              <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-ink/45 uppercase transition-colors group-hover:text-accent">View roles ${icon("arrow-up-right", "", 12)}</span>
            </a>`,
      { delay: 0.05 * i },
    ),
  ).join("")}
      </div>
    </div>
  </section>`;

  const challenge = `<section class="container-x py-24">
    ${sectionHeading({
    align: "center",
    eyebrow: "Why Tranquil Peeplz",
    title: `Solve your hiring challenges<br/><span class="italic-pop">with us</span>`,
    intro: "Hiring delays and missed deadlines quietly tax every growing business. Here's the difference a specialist partner makes.",
  })}
    <div class="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2">
      ${rv(
    `<div class="h-full rounded-[1.75rem] border border-ink/10 bg-cream p-8 md:p-10">
          <span class="inline-flex items-center gap-2 rounded-full bg-ink/[0.06] px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-ink/60 uppercase">${icon("x-circle", "text-accent", 14)} Challenges without us</span>
          <ul class="mt-7 space-y-5">
            ${CHALLENGES.map((c) => `<li class="flex gap-3.5 text-[15px] leading-relaxed text-ink-soft">${icon("x-circle", "mt-0.5 shrink-0 text-accent/70", 19)}${esc(c)}</li>`).join("")}
          </ul>
        </div>`,
  )}
      ${rv(
    `<div class="relative h-full overflow-hidden rounded-[1.75rem] bg-pine p-8 text-cream md:p-10">
          <div class="dot-grid-light pointer-events-none absolute inset-0 opacity-40"></div>
          <span class="relative inline-flex items-center gap-2 rounded-full bg-cream/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase">${icon("circle-check", "text-cream", 14)} Solutions with us</span>
          <ul class="relative mt-7 space-y-5">
            ${SOLUTIONS.map((s) => `<li class="flex gap-3.5 text-[15px] leading-relaxed text-cream/85">${icon("circle-check", "mt-0.5 shrink-0 text-cream", 19)}${esc(s)}</li>`).join("")}
          </ul>
          <a href="/contact-us" class="relative btn btn-accent mt-9">Talk to our team ${icon("arrow-up-right", "", 15)}</a>
        </div>`,
    { delay: 0.12 },
  )}
    </div>
  </section>`;

  const jobs = `<section class="border-y border-ink/10 bg-cream py-24">
    <div class="container-x">
      <div class="flex flex-wrap items-end justify-between gap-6">
        ${sectionHeading({
    eyebrow: "Live opportunities",
    title: `Fresh roles, <span class="italic-pop">open now</span>`,
    intro: "A snapshot from our live board. Every role here is reviewed and approved by our team before it goes up.",
  })}
        ${rv(`<a href="/job-search" class="btn btn-outline">Browse all jobs ${icon("arrow-right", "", 16)}</a>`, { delay: 0.1 })}
      </div>
      <div class="mt-12 grid gap-5 md:grid-cols-2">
        ${p.featured.map((f, i) => rv(jobCard(f.job, f.company), { delay: 0.06 * i })).join("")}
      </div>
    </div>
  </section>`;

  const testimonials = `<section class="container-x py-24">
    ${sectionHeading({
    align: "center",
    eyebrow: "Partners speak",
    title: `Trusted by teams who<br/>hire with <span class="italic-pop">intent</span>`,
  })}
    <div class="mt-14 grid gap-6 md:grid-cols-3">
      ${TESTIMONIALS.map(
    (t, i) => rv(
      `<figure class="card-hover flex h-full flex-col rounded-[1.75rem] border border-ink/10 bg-cream p-8">
            <span class="font-display text-6xl leading-none text-accent">"</span>
            <blockquote class="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">${esc(t.quote)}</blockquote>
            <figcaption class="mt-7 border-t border-ink/10 pt-5">
              <p class="font-display text-lg font-medium text-ink">${esc(t.name)}</p>
              <p class="text-[12.5px] font-medium tracking-wide text-ink/50 uppercase">${esc(t.org)}</p>
            </figcaption>
          </figure>`,
      { delay: 0.08 * i },
    ),
  ).join("")}
    </div>
  </section>`;

  const blogTeaser = `<section class="container-x pb-24">
    <div class="rounded-[2rem] bg-sand/60 p-8 md:p-14">
      <div class="flex flex-wrap items-end justify-between gap-6">
        ${sectionHeading({
    eyebrow: "From the journal",
    title: `Ideas on hiring, <span class="italic-pop">done well</span>`,
  })}
        ${rv(`<a href="/blog" class="link-underline text-[13px] tracking-[0.14em] text-ink/70 uppercase">All articles →</a>`, { delay: 0.1 })}
      </div>
      <div class="mt-10 grid gap-6 md:grid-cols-3">
        ${p.posts
      .slice(0, 3)
      .map(
        (post, i) => rv(
          `<a href="/blog/${esc(post.slug)}" class="group block h-full">
                <article class="flex h-full flex-col">
                  <div class="img-frame aspect-[16/10]">
                    ${post.coverImage ? `<img src="${esc(post.coverImage)}" alt="${esc(post.title)}" class="object-cover" loading="lazy" />` : ""}
                  </div>
                  <p class="mt-5 text-[11px] font-semibold tracking-[0.18em] text-moss uppercase">${esc(post.category)} · ${post.readMinutes} min read</p>
                  <h3 class="font-display mt-2 text-xl leading-snug font-medium tracking-tight text-ink transition-colors group-hover:text-moss">${esc(post.title)}</h3>
                </article>
              </a>`,
          { delay: 0.07 * i },
        ),
      )
      .join("")}
      </div>
    </div>
  </section>`;

  const ctaSection = `<section class="container-x pb-24">
    ${rv(
    `<div class="relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-16 text-center text-cream md:py-24">
        <div class="dot-grid-light pointer-events-none absolute inset-0 opacity-50"></div>
        <div class="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"></div>
        <p class="eyebrow relative justify-center !text-gold" style="display:inline-flex">Ready to get started?</p>
        <h2 class="h-display relative mx-auto mt-5 max-w-3xl text-4xl md:text-6xl">Bridging ambition and <span class="italic-pop">opportunity</span></h2>
        <p class="relative mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-cream/70">We are the catalyst between businesses and people, precision and speed. Every requirement we take on becomes a promise.</p>
        <div class="relative mt-9 flex flex-wrap items-center justify-center gap-4">
          <a href="/post-a-job" class="btn btn-accent">Hire with us ${icon("arrow-up-right", "", 16)}</a>
          <a href="/job-search" class="btn btn-ghost-light">Find your next role</a>
        </div>
      </div>`,
  )}
  </section>`;

  return hero + services + how + who + industries + challenge + jobs + testimonials + blogTeaser + ctaSection;
}
