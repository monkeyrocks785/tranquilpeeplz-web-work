import { esc, rv, fieldError, formAlert } from "../html";
import { icon } from "../icons";
import type { Application, Company, EmailLog, Job } from "../../db/schema";
import { formatDate, formatSalary, timeAgo } from "../../lib/utils";

export function adminLoginPage(p?: {
  message?: string;
  errors?: Record<string, string[] | undefined>;
}): string {
  return `<div class="container-x grid min-h-[60vh] place-items-center py-20">
    <div class="w-full max-w-md">
      ${rv(`<div class="text-center">
        <span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage text-pine">${icon("key-round", "", 26)}</span>
        <h1 class="h-display mt-6 text-4xl md:text-5xl">Site <span class="italic-pop">owner</span></h1>
        <p class="mt-3 text-[15px] text-ink-soft">Enter the admin passcode to review job posts and applications.</p>
      </div>`)}
      ${rv(`<div class="mt-8 rounded-[2rem] border border-ink/10 bg-cream p-7 shadow-xl shadow-ink/5">
        <form method="post" action="/admin/login" class="space-y-5">
          ${formAlert(p?.errors || p?.message ? { ok: false, message: p.message ?? "Incorrect passcode." } : null)}
          <div>
            <label class="field-label" for="ad-pass">Admin passcode</label>
            <input id="ad-pass" name="passcode" type="password" class="field" placeholder="••••••••••" autocomplete="off" />
            ${fieldError(p?.errors, "passcode")}
          </div>
          <button type="submit" class="btn btn-accent w-full">${icon("key-round", "", 15)} Open dashboard</button>
        </form>
      </div>`, { delay: 0.1 })}
    </div>
  </div>`;
}

function stat(iconName: string, value: number, label: string, tone: "default" | "accent" | "good" = "default"): string {
  const cls =
    tone === "accent"
      ? "border-accent/30 bg-accent/10"
      : tone === "good"
        ? "border-moss/25 bg-moss/10"
        : "border-ink/10 bg-cream";
  return `<div class="rounded-3xl border p-5 ${cls}">
    <span class="${tone === "accent" ? "text-accent" : "text-pine"}">${icon(iconName, "", 20)}</span>
    <p class="font-display mt-3 text-3xl font-semibold tracking-tight">${value}</p>
    <p class="text-[11px] font-semibold tracking-[0.14em] text-ink/50 uppercase">${label}</p>
  </div>`;
}

function pill(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-gold/25 text-ink",
    open: "bg-moss/15 text-pine",
    closed: "bg-ink/10 text-ink/60",
    sent: "bg-moss/15 text-pine",
    queued: "bg-gold/25 text-ink",
    failed: "bg-accent/15 text-accent-deep",
  };
  return `<span class="rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase ${map[status] ?? "bg-ink/10 text-ink/60"}">${esc(status)}</span>`;
}

type AdminJobRow = { job: Job; company: Company; applicationCount: number };
type AdminAppRow = { application: Application; job: Job; company: Company };

export function adminPage(p: {
  pending: AdminJobRow[];
  open: AdminJobRow[];
  closed: AdminJobRow[];
  applications: AdminAppRow[];
  emails: EmailLog[];
  stats: { pending: number; open: number; closed: number; applications: number; emails: number };
}): string {
  const pendingRows = p.pending.length
    ? p.pending
        .map(
          ({ job, company }) => `<div class="rounded-3xl border border-gold/50 bg-cream p-5 md:p-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <p class="font-display text-xl font-medium tracking-tight">${esc(job.title)}</p>
          <p class="mt-1 text-[13.5px] font-medium text-ink/55">${esc(company.name)} · ${esc(job.industry)} · ${esc(job.location)} · ${esc(job.employmentType)} · ${formatSalary(job.salaryMin, job.salaryMax)}</p>
          <p class="mt-1 text-[12.5px] text-ink/45">Recruiter: ${esc(job.contactName)} (${esc(job.contactEmail)}) · submitted ${timeAgo(job.createdAt)}</p>
          <p class="mt-3 line-clamp-2 max-w-3xl text-[14px] text-ink-soft">${esc(job.summary)}</p>
        </div>
        <div class="flex shrink-0 flex-wrap items-center gap-2.5">
          <form method="post" action="/admin/jobs/${job.id}/approve"><button type="submit" class="inline-flex items-center gap-1.5 rounded-full bg-pine px-4 py-2 text-[11.5px] font-semibold text-cream transition-colors hover:bg-moss">${icon("circle-check", "", 14)} Approve & publish</button></form>
          <form method="post" action="/admin/jobs/${job.id}/close"><button type="submit" class="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-[11.5px] font-semibold text-ink/60 transition-colors hover:border-accent hover:text-accent">${icon("circle-pause", "", 14)} Reject</button></form>
        </div>
      </div>
    </div>`,
        )
        .join("")
    : `<div class="mt-6 rounded-3xl border border-dashed border-ink/20 bg-cream p-10 text-center">
        <span class="inline-block text-moss/50">${icon("circle-check", "", 24)}</span>
        <p class="mt-3 text-[14.5px] text-ink-soft">Queue is clear — no roles waiting for review.</p>
      </div>`;

  const openRows = p.open
    .map(
      ({ job, company, applicationCount }) => `<div class="flex flex-wrap items-center gap-4 rounded-3xl border border-ink/10 bg-cream p-5">
      <div class="min-w-0 flex-1">
        <a href="/jobs/${esc(job.slug)}" class="font-display text-lg font-medium tracking-tight hover:text-moss">${esc(job.title)}</a>
        <p class="text-[13px] font-medium text-ink/55">${esc(company.name)} · ${esc(job.location)} · ${applicationCount} ${applicationCount === 1 ? "application" : "applications"}</p>
      </div>
      ${pill("open")}
      <form method="post" action="/admin/jobs/${job.id}/close"><button type="submit" class="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-[11.5px] font-semibold text-ink/60 transition-colors hover:border-accent hover:text-accent">${icon("circle-pause", "", 14)} Take down</button></form>
    </div>`,
    )
    .join("");

  const closedRows = p.closed.length
    ? `<section class="mt-14">
      <h2 class="font-display text-2xl font-medium tracking-tight text-ink/60">Closed / rejected</h2>
      <div class="mt-5 space-y-3">
        ${p.closed
          .slice(0, 8)
          .map(
            ({ job, company }) => `<div class="flex flex-wrap items-center gap-4 rounded-3xl border border-ink/10 bg-cream/60 p-5 text-ink/60">
              <div class="min-w-0 flex-1">
                <p class="font-display text-lg font-medium tracking-tight">${esc(job.title)}</p>
                <p class="text-[13px] font-medium text-ink/45">${esc(company.name)} · ${esc(job.location)}</p>
              </div>
              ${pill("closed")}
              <form method="post" action="/admin/jobs/${job.id}/reopen"><button type="submit" class="inline-flex items-center gap-1.5 rounded-full border border-moss/40 bg-moss/10 px-4 py-2 text-[11.5px] font-semibold text-pine transition-colors hover:bg-moss/20">${icon("circle-play", "", 14)} Re-open</button></form>
            </div>`,
          )
          .join("")}
      </div>
    </section>`
    : "";

  const applicationRows = p.applications.length
    ? `<div class="mt-6 overflow-x-auto rounded-3xl border border-ink/10 bg-cream">
        <table class="w-full min-w-[760px] text-left text-[13.5px]">
          <thead>
            <tr class="border-b border-ink/10 text-[11px] tracking-[0.14em] text-ink/45 uppercase">
              <th class="px-5 py-3.5 font-semibold">Applicant</th>
              <th class="px-5 py-3.5 font-semibold">Role</th>
              <th class="px-5 py-3.5 font-semibold">Contact</th>
              <th class="px-5 py-3.5 font-semibold">Résumé</th>
              <th class="px-5 py-3.5 font-semibold">Applied</th>
            </tr>
          </thead>
          <tbody>
            ${p.applications
              .map(
                ({ application, job, company }) => `<tr class="border-b border-ink/5 last:border-0">
                  <td class="px-5 py-3.5 font-semibold text-ink">${esc(application.applicantName)}</td>
                  <td class="px-5 py-3.5 text-ink-soft">${esc(job.title)}<span class="block text-[12px] text-ink/45">${esc(company.name)}</span></td>
                  <td class="px-5 py-3.5 text-ink-soft">${esc(application.applicantEmail)}${application.applicantPhone ? `<span class="block text-[12px] text-ink/45">${esc(application.applicantPhone)}</span>` : ""}</td>
                  <td class="px-5 py-3.5">${application.resumeUrl ? `<a href="${esc(application.resumeUrl)}" target="_blank" rel="noreferrer" class="inline-flex items-center gap-1 font-semibold text-accent hover:text-accent-deep">Open ${icon("arrow-up-right", "", 12)}</a>` : `<span class="text-ink/40">—</span>`}</td>
                  <td class="px-5 py-3.5 text-ink-soft">${timeAgo(application.createdAt)}</td>
                </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>`
    : `<div class="mt-6 rounded-3xl border border-dashed border-ink/20 bg-cream p-10 text-center">
        <span class="inline-block text-ink/30">${icon("inbox", "", 24)}</span>
        <p class="mt-3 text-[14.5px] text-ink-soft">No applications yet. They land here — and in your inbox as CSV — the moment a seeker applies.</p>
      </div>`;

  const emailRows = p.emails.length
    ? p.emails
        .map(
          (m) => `<div class="flex flex-wrap items-center gap-4 rounded-3xl border border-ink/10 bg-cream p-5">
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-ink">${esc(m.subject)}</p>
              <p class="text-[12.5px] text-ink/50">→ ${esc(m.toEmail)} · ${esc(m.kind.replace(/_/g, " "))} · ${formatDate(m.createdAt)}${m.csvPayload ? " · CSV attached" : ""}</p>
            </div>
            ${pill(m.status)}
          </div>`,
        )
        .join("")
    : `<p class="rounded-3xl border border-dashed border-ink/20 bg-cream p-8 text-center text-[14px] text-ink-soft">No emails logged yet.</p>`;

  return `<div class="container-x pt-10 pb-24 lg:pt-14">
    <div class="flex flex-wrap items-center justify-between gap-5">
      <div>
        <p class="eyebrow" style="display:inline-flex">Site Owner Dashboard</p>
        <h1 class="h-display mt-3 text-4xl md:text-5xl">Hiring <span class="italic-pop">control room</span></h1>
        <p class="mt-2 text-[15px] text-ink-soft">Approve incoming roles, watch the pipeline, and export applicants as CSV.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <a href="/api/applications.csv" class="btn btn-accent btn-sm" download>${icon("download", "", 14)} Export all applications (CSV)</a>
        <form method="post" action="/admin/logout"><button type="submit" class="btn btn-outline btn-sm">${icon("log-out", "", 14)} Sign out</button></form>
      </div>
    </div>

    <div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
      ${stat("clock-3", p.stats.pending, "Awaiting approval", p.stats.pending > 0 ? "accent" : "default")}
      ${stat("briefcase-business", p.stats.open, "Live on board", "good")}
      ${stat("x-circle", p.stats.closed, "Closed / rejected")}
      ${stat("users-round", p.stats.applications, "Applications")}
      ${stat("mail-check", p.stats.emails, "Emails logged")}
    </div>

    <section class="mt-14">
      <h2 class="font-display text-3xl font-medium tracking-tight">
        Awaiting <span class="italic-pop">approval</span>
        ${p.pending.length > 0 ? `<span class="ml-3 rounded-full bg-accent px-3 py-1 text-sm font-sans font-semibold text-cream align-middle">${p.pending.length}</span>` : ""}
      </h2>
      ${p.pending.length ? `<div class="mt-6 space-y-4">${pendingRows}</div>` : pendingRows}
    </section>

    <section class="mt-14">
      <h2 class="font-display text-3xl font-medium tracking-tight">Live on the <span class="italic-pop">board</span></h2>
      <div class="mt-6 space-y-3">${openRows}</div>
    </section>

    ${closedRows}

    <section class="mt-14">
      <div class="flex items-end justify-between gap-4">
        <h2 class="font-display text-3xl font-medium tracking-tight">Recent <span class="italic-pop">applications</span></h2>
        <a href="/api/applications.csv" class="inline-flex items-center gap-2 text-[12.5px] font-semibold text-accent hover:text-accent-deep" download>${icon("download", "", 14)} Download CSV</a>
      </div>
      ${applicationRows}
    </section>

    <section class="mt-14">
      <h2 class="font-display text-3xl font-medium tracking-tight">Email <span class="italic-pop">outbox</span></h2>
      <p class="mt-2 text-[13.5px] text-ink-soft">Every message the site sends is logged here. Status shows <em>queued</em> until SMTP is configured (<code>SMTP_URL</code> env var).</p>
      <div class="mt-6 space-y-3">${emailRows}</div>
    </section>
  </div>`;
}

export function notFoundPage(): string {
  return `<div class="container-x grid min-h-[60vh] place-items-center py-24 text-center">
    <div>
      <p class="font-display text-[9rem] leading-none font-semibold text-ink/10 italic select-none md:text-[14rem]">404</p>
      <h1 class="h-display -mt-10 text-4xl md:text-5xl">This page took a <span class="italic-pop">career break</span></h1>
      <p class="mx-auto mt-4 max-w-md text-[15.5px] text-ink-soft">The link may be old, or the role may have been filled. Let's get you somewhere useful.</p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a href="/" class="btn btn-primary">Back home ${icon("arrow-up-right", "", 15)}</a>
        <a href="/job-search" class="btn btn-outline">Browse jobs</a>
      </div>
    </div>
  </div>`;
}
