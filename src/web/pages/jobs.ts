import { esc, rv, sectionHeading, fieldError, formAlert } from "../html.js";
import { icon } from "../icons.js";
import type { Company, Job } from "../../db/schema.js";
import {
  formatDate,
  formatExperience,
  formatSalary,
  timeAgo,
} from "../../lib/utils.js";

// ---------------------------------------------------------------------------
// Job card (shared with home/seeker pages)
// ---------------------------------------------------------------------------

export function jobCard(job: Job, company: Company): string {
  const featured = job.featured
    ? `<span class="rounded-full bg-gold/25 px-3 py-1 text-[11px] font-semibold tracking-wide text-ink uppercase">Featured</span>`
    : "";
  return `<a href="/jobs/${esc(job.slug)}" class="card-hover group relative block rounded-3xl border border-ink/10 bg-cream p-6 md:p-7">
  <div class="flex items-start justify-between gap-4">
    <div class="flex items-center gap-4">
      <span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-pine font-display text-lg font-semibold text-cream italic">${esc(company.name.slice(0, 1))}</span>
      <div>
        <h3 class="font-display text-xl leading-snug font-medium tracking-tight text-ink transition-colors group-hover:text-moss">${esc(job.title)}</h3>
        <p class="mt-0.5 text-[13.5px] font-medium text-ink/55">${esc(company.name)} · ${esc(job.industry)}</p>
      </div>
    </div>
    <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/15 text-ink transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-cream">${icon("arrow-up-right", "", 17)}</span>
  </div>
  <p class="mt-4 line-clamp-2 text-[14.5px] leading-relaxed text-ink-soft">${esc(job.summary)}</p>
  <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] font-medium text-ink/60">
    <span class="inline-flex items-center gap-1.5">${icon("map-pin", "text-accent", 14)}${esc(job.location)} · ${esc(job.workMode)}</span>
    <span class="inline-flex items-center gap-1.5">${icon("briefcase-business", "text-accent", 14)}${formatExperience(job.experienceMin, job.experienceMax)}</span>
    <span class="inline-flex items-center gap-1.5">${icon("wallet", "text-accent", 14)}${formatSalary(job.salaryMin, job.salaryMax)}</span>
  </div>
  <div class="mt-5 flex flex-wrap items-center gap-2">
    ${featured}
    <span class="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold tracking-wide text-cream uppercase">${esc(job.employmentType)}</span>
    ${job.skills
      .slice(0, 3)
      .map((s) => `<span class="rounded-full border border-ink/12 px-3 py-1 text-[11px] font-medium text-ink/65">${esc(s)}</span>`)
      .join("")}
    <span class="ml-auto text-[12px] text-ink/40">${timeAgo(job.createdAt)}</span>
  </div>
</a>`;
}

// ---------------------------------------------------------------------------
// Job search
// ---------------------------------------------------------------------------

export function jobSearchPage(p: {
  results: { job: Job; company: Company }[];
  locations: string[];
  industries: string[];
  filters: { q?: string; industry?: string; location?: string; type?: string; mode?: string };
}): string {
  const { filters } = p;
  const sel = (name: string, val: string) => (filters[name as keyof typeof filters] === val ? " selected" : "");
  const hasFilters = Boolean(filters.q || filters.industry || filters.location || filters.type || filters.mode);

  const options = (list: string[], name: string, label: string) =>
    `<select id="f-${name}" name="${name}" class="field" aria-label="${label}">
      <option value="">${label}</option>
      ${list.map((v) => `<option value="${esc(v)}"${sel(name, v)}>${esc(v)}</option>`).join("")}
    </select>`;

  const empty = `<div class="mt-10 rounded-[1.75rem] border border-dashed border-ink/20 bg-cream p-14 text-center">
    <span class="inline-block text-ink/30">${icon("sliders-horizontal", "", 28)}</span>
    <h2 class="font-display mt-4 text-2xl font-medium text-ink">No matches for this combination</h2>
    <p class="mx-auto mt-2 max-w-md text-[14.5px] text-ink-soft">Try widening a filter — or send us your CV and we'll call you when a fitting role opens.</p>
    <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
      <a href="/job-search" class="btn btn-outline btn-sm">Reset filters</a>
      <a href="/contact-us" class="btn btn-accent btn-sm">Contact our recruiters</a>
    </div>
  </div>`;

  let body = `<div class="container-x pt-10 pb-24 lg:pt-14">
    ${rv(`<p class="eyebrow" style="display:inline-flex">Job Search</p>`)}
    ${rv(`<h1 class="h-display mt-5 max-w-3xl text-5xl leading-[1.02] md:text-6xl">Find your <span class="italic-pop">perfect job</span></h1>`, { delay: 0.08 })}
    ${rv(`<p class="mt-5 max-w-xl text-[16px] text-ink-soft">Every role below is reviewed and approved by our team before it goes live. Apply in minutes — no account needed.</p>`, { delay: 0.14 })}
    ${rv(
    `<form method="get" action="/job-search" class="mt-10 rounded-[1.75rem] border border-ink/10 bg-cream p-5 md:p-6">
        <div class="flex flex-col gap-3 md:flex-row">
          <div class="relative flex-1">
            <span class="pointer-events-none absolute top-1/2 left-4.5 -translate-y-1/2 text-ink/40">${icon("search", "", 18)}</span>
            <input name="q" value="${esc(filters.q ?? "")}" placeholder="Title, company or skill — try “React” or “nurse”" class="field !pl-12" />
          </div>
          <button type="submit" class="btn btn-primary md:w-auto">${icon("search", "", 16)} Search</button>
        </div>
        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>${options(p.industries, "industry", "All industries")}</div>
          <div>${options(p.locations, "location", "All locations")}</div>
          <div>${options(["full-time", "contract", "part-time", "temporary"], "type", "Any type")}</div>
          <div>${options(["on-site", "hybrid", "remote"], "mode", "Any mode")}</div>
        </div>
      </form>`,
    { delay: 0.2 },
  )}
    <div class="mt-10 flex items-center justify-between gap-4">
      <p class="text-[14px] font-medium text-ink/60"><span class="font-display text-xl font-semibold text-ink">${p.results.length}</span> ${p.results.length === 1 ? "role" : "roles"} found</p>
      ${hasFilters ? `<a href="/job-search" class="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-accent hover:text-accent-deep">${icon("x", "", 14)} Clear filters</a>` : ""}
    </div>`;

  if (p.results.length > 0) {
    body += `<div class="mt-6 grid gap-5 md:grid-cols-2">${p.results
      .map((r, i) => rv(jobCard(r.job, r.company), { delay: Math.min(i * 0.04, 0.3) }))
      .join("")}</div>`;
  } else {
    body += empty;
  }
  return body + "</div>";
}

// ---------------------------------------------------------------------------
// Job detail + anonymous apply
// ---------------------------------------------------------------------------

export function applyForm(p: {
  jobId: string;
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
}): string {
  if (p.success) {
    return `<div class="text-center">
      <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-moss/15 text-moss">${icon("circle-check", "", 26)}</span>
      <h2 class="font-display mt-4 text-2xl font-medium text-ink">Application sent</h2>
      <p class="mt-2 text-[14px] text-ink-soft">${esc(p.message ?? "")}</p>
    </div>`;
  }
  const v = (n: string) => esc(p.values?.[n] ?? "");
  const e = p.errors;
  return `<form method="post" action="?apply=1" class="space-y-4">
    ${formAlert(p.errors ? { ok: false, message: p.message ?? "Please fix the highlighted fields." } : null)}
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="field-label" for="ap-name">Full name</label>
        <input id="ap-name" name="applicantName" class="field" placeholder="Asha Rao" value="${v("applicantName")}" autocomplete="name" />
        ${fieldError(e, "applicantName")}
      </div>
      <div>
        <label class="field-label" for="ap-email">Email</label>
        <input id="ap-email" name="applicantEmail" type="email" class="field" placeholder="you@example.com" value="${v("applicantEmail")}" autocomplete="email" />
        ${fieldError(e, "applicantEmail")}
      </div>
    </div>
    <div>
      <label class="field-label" for="ap-phone">Phone <span class="normal-case text-ink/40">(optional)</span></label>
      <input id="ap-phone" name="applicantPhone" class="field" placeholder="+91 98XXX XXXXX" value="${v("applicantPhone")}" autocomplete="tel" />
      ${fieldError(e, "applicantPhone")}
    </div>
    <div>
      <label class="field-label" for="ap-resume">Résumé link</label>
      <input id="ap-resume" name="resumeUrl" class="field" placeholder="https://drive.google.com/…" value="${v("resumeUrl")}" />
      <p class="mt-1.5 text-[12px] text-ink/50">A shareable link (Google Drive, Dropbox, LinkedIn, portfolio).</p>
      ${fieldError(e, "resumeUrl")}
    </div>
    <div>
      <label class="field-label" for="ap-note">Note to the recruiter <span class="normal-case text-ink/40">(optional)</span></label>
      <textarea id="ap-note" name="coverNote" rows="4" class="field resize-none" placeholder="Why this role? Two or three sentences is plenty.">${v("coverNote")}</textarea>
      ${fieldError(e, "coverNote")}
    </div>
    <button type="submit" class="btn btn-accent w-full">${icon("send", "", 15)} Apply now</button>
  </form>`;
}

export function jobDetailPage(p: {
  job: Job;
  company: Company;
  similar: { job: Job; company: Company }[];
  applied?: boolean;
  applyMessage?: string;
  applyErrors?: Record<string, string[] | undefined>;
  applyValues?: Record<string, string>;
}): string {
  const { job, company } = p;
  const meta = [
    { icon: "map-pin", label: "Location", value: job.location },
    { icon: "briefcase-business", label: "Experience", value: formatExperience(job.experienceMin, job.experienceMax) },
    { icon: "wallet", label: "Salary", value: formatSalary(job.salaryMin, job.salaryMax) },
    { icon: "users-round", label: "Openings", value: String(job.openings) },
  ]
    .map(
      (m) => `<div class="rounded-2xl border border-ink/10 bg-cream p-4">
        ${icon(m.icon, "text-accent", 17)}
        <p class="mt-2.5 text-[10.5px] font-semibold tracking-[0.16em] text-ink/45 uppercase">${m.label}</p>
        <p class="mt-0.5 text-[13.5px] font-semibold text-ink">${esc(m.value)}</p>
      </div>`,
    )
    .join("");

  const list = (items: string[], iconCls: string) =>
    `<ul class="mt-4 space-y-3">${items
      .map((r) => `<li class="flex gap-3 text-[15px] leading-relaxed text-ink-soft">${icon("circle-check", iconCls, 19)}${esc(r)}</li>`)
      .join("")}</ul>`;

  return `<div class="container-x pt-8 pb-24 lg:pt-12">
  ${rv(`<a href="/job-search" class="inline-flex items-center gap-2 text-[13px] font-semibold text-ink/55 transition-colors hover:text-accent">${icon("arrow-left", "", 15)} Back to all jobs</a>`)}
  <div class="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
    <div>
      ${rv(
    `<div class="flex flex-wrap items-center gap-2.5">
          <span class="rounded-full bg-accent px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-cream uppercase">${esc(job.employmentType)}</span>
          <span class="rounded-full border border-ink/12 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-ink/60 uppercase">${esc(job.workMode)}</span>
          ${job.featured ? `<span class="rounded-full bg-gold/25 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-ink uppercase">Featured</span>` : ""}
        </div>`,
  )}
      ${rv(`<h1 class="h-display mt-5 text-4xl leading-[1.05] md:text-5xl">${esc(job.title)}</h1>`, { delay: 0.06 })}
      ${rv(`<p class="mt-3 text-[16px] font-medium text-ink-soft">${esc(company.name)} · ${esc(job.industry)} · Posted ${formatDate(job.createdAt)}</p>`, { delay: 0.1 })}
      ${rv(`<div class="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">${meta}</div>`, { delay: 0.14 })}
      ${rv(`<p class="mt-9 rounded-3xl border border-ink/10 bg-cream p-6 text-[15.5px] leading-relaxed text-ink-soft">${esc(job.summary)}</p>`, { delay: 0.18 })}
      ${rv(`<h2 class="font-display mt-9 text-2xl font-medium tracking-tight">About the role</h2><p class="mt-3 text-[15px] leading-relaxed text-ink-soft">${esc(job.description)}</p>`, { delay: 0.2 })}
      ${job.responsibilities.length ? rv(`<h2 class="font-display mt-9 text-2xl font-medium tracking-tight">What you'll own</h2>${list(job.responsibilities, "mt-0.5 shrink-0 text-moss")}`) : ""}
      ${job.requirements.length ? rv(`<h2 class="font-display mt-9 text-2xl font-medium tracking-tight">What you'll bring</h2>${list(job.requirements, "mt-0.5 shrink-0 text-accent")}`) : ""}
      ${job.skills.length ? rv(
    `<h2 class="font-display mt-9 text-2xl font-medium tracking-tight">Key skills</h2>
        <div class="mt-4 flex flex-wrap gap-2.5">${job.skills
      .map((s) => `<a href="/job-search?q=${encodeURIComponent(s)}" class="rounded-full border border-ink/15 bg-cream px-4 py-2 text-[13px] font-medium text-ink/70 transition-colors hover:border-accent hover:text-accent">${esc(s)}</a>`)
      .join("")}</div>`,
  ) : ""}
      ${rv(
    `<div class="mt-11 rounded-3xl bg-ink p-7 text-cream md:p-8">
          <div class="flex items-start gap-5">
            <span class="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-cream/10 font-display text-xl font-semibold italic">${esc(company.name.slice(0, 1))}</span>
            <div>
              <h3 class="font-display text-xl font-medium">About ${esc(company.name)}</h3>
              <p class="mt-2 text-[14px] leading-relaxed text-cream/70">${esc(company.description ?? `${company.name} is hiring with Tranquil Peeplz.`)}</p>
              <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] font-medium text-cream/55">
                ${company.industry ? `<span class="inline-flex items-center gap-1.5">${icon("building-2", "text-gold", 14)}${esc(company.industry)}</span>` : ""}
                ${company.size ? `<span class="inline-flex items-center gap-1.5">${icon("users-round", "text-gold", 14)}${esc(company.size)} people</span>` : ""}
                ${company.website ? `<a href="${esc(company.website)}" target="_blank" rel="noreferrer" class="inline-flex items-center gap-1.5 transition-colors hover:text-gold">${icon("globe", "text-gold", 14)}Website</a>` : ""}
              </div>
            </div>
          </div>
        </div>`,
    { delay: 0.28 },
  )}
    </div>
    <aside class="lg:sticky lg:top-28 lg:self-start">
      ${rv(
    `<div class="rounded-[1.75rem] border border-ink/10 bg-cream p-6 shadow-xl shadow-ink/5 md:p-7">
          ${p.applied
      ? applyForm({ jobId: job.id, success: true, message: p.applyMessage })
      : `<h2 class="font-display text-2xl font-medium">Apply <span class="italic-pop">now</span></h2>
               <p class="mt-1.5 text-[13.5px] text-ink-soft">No account needed — your details go straight to the Tranquil Peeplz recruiters handling this role.</p>
               <div class="mt-5">${applyForm({ jobId: job.id, errors: p.applyErrors, values: p.applyValues })}</div>`}
        </div>`,
    { delay: 0.12 },
  )}
    </aside>
  </div>
  ${p.similar.length
      ? `<section class="mt-20">
          <h2 class="font-display text-3xl font-medium tracking-tight">Similar <span class="italic-pop">roles</span></h2>
          <div class="mt-8 grid gap-5 md:grid-cols-3">${p.similar.map((s) => jobCard(s.job, s.company)).join("")}</div>
        </section>`
      : ""
    }
</div>`;
}

// ---------------------------------------------------------------------------
// Post a job (employer form → admin approval)
// ---------------------------------------------------------------------------

export function postJobPage(p: {
  industries: string[];
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
}): string {
  const notes = [
    {
      icon: "badge-check",
      title: "Reviewed by humans",
      copy: "Every submission is checked by the Tranquil Peeplz team before it goes live — no spam, no clutter, only real roles.",
    },
    {
      icon: "clock-3",
      title: "Live within a day",
      copy: "Approved roles typically appear on the job board within one business day.",
    },
    {
      icon: "mail-check",
      title: "Instant confirmation",
      copy: "A thank-you email lands in your inbox the moment you submit, with your role details.",
    },
  ];

  const noteHtml = notes
    .map(
      (n, i) => rv(
        `<div class="flex gap-4">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sage text-pine">${icon(n.icon, "", 20)}</span>
          <div>
            <h2 class="font-display text-lg font-medium tracking-tight">${n.title}</h2>
            <p class="mt-1 text-[13.5px] leading-relaxed text-ink-soft">${n.copy}</p>
          </div>
        </div>`,
        { delay: 0.08 * i },
      ),
    )
    .join("");

  let formInner: string;
  if (p.success) {
    formInner = `<div class="rounded-3xl border border-moss/25 bg-moss/10 p-8 text-center">
      <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-pine text-cream">${icon("circle-check", "", 26)}</span>
      <h3 class="font-display mt-5 text-2xl font-medium text-ink">Role submitted for approval</h3>
      <p class="mx-auto mt-2 max-w-md text-[14.5px] text-ink-soft">${esc(p.message ?? "")}</p>
    </div>`;
  } else {
    const v = (n: string) => esc(p.values?.[n] ?? "");
    const e = p.errors;
    const industryOpts = [
      `<option value="" disabled${p.values?.industry ? "" : " selected"}>Select industry</option>`,
      ...p.industries.map(
        (i) => `<option value="${esc(i)}"${p.values?.industry === i ? " selected" : ""}>${esc(i)}</option>`,
      ),
      `<option value="Other"${p.values?.industry === "Other" ? " selected" : ""}>Other</option>`,
    ].join("");
    const modeOpts = ["on-site", "hybrid", "remote"]
      .map((m) => `<option value="${m}"${(p.values?.workMode ?? "hybrid") === m ? " selected" : ""}>${m}</option>`)
      .join("");
    const typeOpts = ["full-time", "contract", "part-time", "temporary"]
      .map((t) => `<option value="${t}"${(p.values?.employmentType ?? "full-time") === t ? " selected" : ""}>${t}</option>`)
      .join("");

    formInner = `<form method="post" action="/post-a-job" class="space-y-6">
    ${formAlert(p.success === false ? p : null)}
    <input type="text" name="website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />
    <div>
      <p class="mb-4 text-[11px] font-semibold tracking-[0.2em] text-moss uppercase">Your details</p>
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label class="field-label" for="pj-contact-name">Your name</label>
          <input id="pj-contact-name" name="contactName" class="field" placeholder="Priya Nair" value="${v("contactName")}" autocomplete="name" />
          ${fieldError(e, "contactName")}
        </div>
        <div>
          <label class="field-label" for="pj-contact-email">Work email <span class="normal-case text-ink/40">(confirmation sent here)</span></label>
          <input id="pj-contact-email" name="contactEmail" type="email" class="field" placeholder="priya@company.com" value="${v("contactEmail")}" autocomplete="email" />
          ${fieldError(e, "contactEmail")}
        </div>
        <div>
          <label class="field-label" for="pj-company">Company name</label>
          <input id="pj-company" name="companyName" class="field" placeholder="Acme Technologies" value="${v("companyName")}" />
          ${fieldError(e, "companyName")}
        </div>
        <div>
          <label class="field-label" for="pj-website">Company website <span class="normal-case text-ink/40">(optional)</span></label>
          <input id="pj-website" name="companyWebsite" class="field" placeholder="https://yourcompany.com" value="${v("companyWebsite")}" />
          ${fieldError(e, "companyWebsite")}
        </div>
      </div>
    </div>
    <div>
      <p class="mb-4 text-[11px] font-semibold tracking-[0.2em] text-moss uppercase">The role</p>
      <div class="grid gap-5 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label class="field-label" for="pj-title">Job title</label>
          <input id="pj-title" name="title" class="field" placeholder="e.g. Senior Frontend Engineer" value="${v("title")}" />
          ${fieldError(e, "title")}
        </div>
        <div>
          <label class="field-label" for="pj-industry">Industry</label>
          <select id="pj-industry" name="industry" class="field">${industryOpts}</select>
          ${fieldError(e, "industry")}
        </div>
        <div>
          <label class="field-label" for="pj-location">Location</label>
          <input id="pj-location" name="location" class="field" placeholder="Bangalore" value="${v("location")}" />
          ${fieldError(e, "location")}
        </div>
        <div>
          <label class="field-label" for="pj-mode">Work mode</label>
          <select id="pj-mode" name="workMode" class="field">${modeOpts}</select>
        </div>
        <div>
          <label class="field-label" for="pj-type">Employment type</label>
          <select id="pj-type" name="employmentType" class="field">${typeOpts}</select>
        </div>
        <div>
          <label class="field-label">Experience (yrs)</label>
          <div class="flex items-center gap-3">
            <input name="experienceMin" type="number" min="0" max="30" value="${v("experienceMin") || "2"}" class="field" aria-label="Minimum experience" />
            <span class="text-ink/40">to</span>
            <input name="experienceMax" type="number" min="0" max="40" value="${v("experienceMax") || "6"}" class="field" aria-label="Maximum experience" />
          </div>
          ${fieldError(e, "experienceMax")}
        </div>
        <div>
          <label class="field-label">Salary (₹ LPA, optional)</label>
          <div class="flex items-center gap-3">
            <input name="salaryMin" type="number" min="0" max="500" placeholder="12" value="${v("salaryMin")}" class="field" aria-label="Minimum salary in lakhs" />
            <span class="text-ink/40">to</span>
            <input name="salaryMax" type="number" min="0" max="500" placeholder="24" value="${v("salaryMax")}" class="field" aria-label="Maximum salary in lakhs" />
          </div>
          ${fieldError(e, "salaryMax")}
        </div>
        <div>
          <label class="field-label" for="pj-openings">Openings</label>
          <input id="pj-openings" name="openings" type="number" min="1" max="200" value="${v("openings") || "1"}" class="field" />
          ${fieldError(e, "openings")}
        </div>
        <div>
          <label class="field-label" for="pj-skills">Key skills <span class="normal-case text-ink/40">(comma separated)</span></label>
          <input id="pj-skills" name="skills" class="field" placeholder="React, TypeScript, GraphQL" value="${v("skills")}" />
          ${fieldError(e, "skills")}
        </div>
        <div class="sm:col-span-2">
          <label class="field-label" for="pj-summary">Short summary</label>
          <textarea id="pj-summary" name="summary" rows="2" class="field resize-none" placeholder="One or two sentences that sell the role — shown in search results.">${v("summary")}</textarea>
          ${fieldError(e, "summary")}
        </div>
        <div class="sm:col-span-2">
          <label class="field-label" for="pj-description">Full description</label>
          <textarea id="pj-description" name="description" rows="5" class="field resize-none" placeholder="What will this person own, build or lead? What does the team look like?">${v("description")}</textarea>
          ${fieldError(e, "description")}
        </div>
        <div>
          <label class="field-label" for="pj-resp">Responsibilities <span class="normal-case text-ink/40">(one per line)</span></label>
          <textarea id="pj-resp" name="responsibilities" rows="5" class="field resize-none" placeholder="Own the web app roadmap&#10;Mentor two junior engineers&#10;Ship weekly">${v("responsibilities")}</textarea>
        </div>
        <div>
          <label class="field-label" for="pj-req">Requirements <span class="normal-case text-ink/40">(one per line)</span></label>
          <textarea id="pj-req" name="requirements" rows="5" class="field resize-none" placeholder="4+ yrs with React&#10;Strong TypeScript&#10;Startup experience a plus">${v("requirements")}</textarea>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <button type="submit" class="btn btn-accent">Submit for approval ${icon("arrow-right", "", 16)}</button>
      <p class="text-[12.5px] text-ink/50">Roles go live after a quick review by the Tranquil Peeplz team.</p>
    </div>
  </form>`;
  }

  return `<div class="container-x pt-10 pb-24 lg:pt-14">
  <div class="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
    <div class="lg:sticky lg:top-28">
      ${rv(`<p class="eyebrow" style="display:inline-flex">For Employers</p>
      <h1 class="h-display mt-5 text-5xl leading-[1.02] md:text-6xl">Post a <span class="italic-pop">job</span></h1>
      <p class="mt-5 max-w-md text-[16.5px] leading-relaxed text-ink-soft">No accounts, no friction. Fill in the role details — our team reviews it, approves it, and it goes live on the board. You'll get a confirmation email the moment you submit.</p>`)}
      <div class="mt-10 space-y-6">${noteHtml}</div>
      ${rv(`<p class="mt-6 text-[13px] text-ink/50">Rather have us run the whole search? <a href="/contact-us" class="font-semibold text-accent hover:text-accent-deep">Talk to our recruiters</a></p>`, { delay: 0.35 })}
    </div>
    ${rv(`<div class="rounded-[2rem] border border-ink/10 bg-cream p-7 shadow-xl shadow-ink/5 md:p-9">${formInner}</div>`, { delay: 0.1 })}
  </div>
</div>`;
}
