import { esc, rv } from "../html";
import { icon } from "../icons";
import { formatDate } from "../../lib/utils";
export function blogPage(posts) {
    const [first, ...rest] = posts;
    const featured = first
        ? rv(`<a href="/blog/${esc(first.slug)}" class="group mt-12 grid gap-8 rounded-[2rem] border border-ink/10 bg-cream p-6 md:grid-cols-2 md:p-8">
          <div class="img-frame aspect-[16/10]">
            ${first.coverImage ? `<img src="${esc(first.coverImage)}" alt="${esc(first.title)}" class="object-cover" />` : ""}
          </div>
          <div class="flex flex-col justify-center">
            <p class="text-[11px] font-semibold tracking-[0.2em] text-moss uppercase">${esc(first.category)} · ${first.readMinutes} min read · ${formatDate(first.publishedAt)}</p>
            <h2 class="font-display mt-3 text-3xl leading-tight font-medium tracking-tight transition-colors group-hover:text-moss md:text-4xl">${esc(first.title)}</h2>
            <p class="mt-4 text-[15px] leading-relaxed text-ink-soft">${esc(first.excerpt)}</p>
            <span class="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] text-accent uppercase">Read article ${icon("arrow-up-right", "", 15)}</span>
          </div>
        </a>`, { delay: 0.16 })
        : "";
    const grid = rest
        .map((post, i) => rv(`<a href="/blog/${esc(post.slug)}" class="group block h-full">
          <article class="flex h-full flex-col">
            <div class="img-frame aspect-[16/10]">
              ${post.coverImage ? `<img src="${esc(post.coverImage)}" alt="${esc(post.title)}" class="object-cover" loading="lazy" />` : ""}
            </div>
            <p class="mt-5 text-[11px] font-semibold tracking-[0.18em] text-moss uppercase">${esc(post.category)} · ${post.readMinutes} min · ${formatDate(post.publishedAt)}</p>
            <h2 class="font-display mt-2 text-[1.4rem] leading-snug font-medium tracking-tight transition-colors group-hover:text-moss">${esc(post.title)}</h2>
            <p class="mt-3 line-clamp-3 flex-1 text-[14px] leading-relaxed text-ink-soft">${esc(post.excerpt)}</p>
            <span class="mt-4 inline-flex items-center gap-2 text-[11.5px] font-semibold tracking-[0.16em] text-accent uppercase">Read ${icon("arrow-up-right", "", 13)}</span>
          </article>
        </a>`, { delay: 0.06 * i }))
        .join("");
    return `<div class="container-x pt-10 pb-24 lg:pt-14">
    ${rv(`<p class="eyebrow" style="display:inline-flex">The Journal</p>`)}
    ${rv(`<h1 class="h-display mt-5 max-w-3xl text-5xl leading-[1.02] md:text-6xl">Notes on hiring,<br/>careers & <span class="italic-pop">work that works</span></h1>`, { delay: 0.08 })}
    ${featured}
    <div class="mt-10 grid gap-8 md:grid-cols-3">${grid}</div>
  </div>`;
}
function renderContent(content) {
    return content
        .split(/\n\n+/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((text) => {
        if (text.startsWith("## ")) {
            return `<h2 class="font-display mt-10 text-2xl font-medium tracking-tight text-ink md:text-[1.7rem]">${esc(text.replace(/^##\s+/, ""))}</h2>`;
        }
        return `<p class="mt-5 text-[16px] leading-[1.85] text-ink-soft">${esc(text)}</p>`;
    })
        .join("\n");
}
export function blogPostPage(post, others) {
    const othersHtml = others.length
        ? `<section class="mt-16">
        <h2 class="font-display text-2xl font-medium tracking-tight">Keep <span class="italic-pop">reading</span></h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-2">
          ${others
            .map((o) => `<a href="/blog/${esc(o.slug)}" class="group rounded-3xl border border-ink/10 bg-cream p-6 card-hover">
                <p class="text-[11px] font-semibold tracking-[0.18em] text-moss uppercase">${esc(o.category)}</p>
                <h3 class="font-display mt-2 text-xl leading-snug font-medium tracking-tight transition-colors group-hover:text-moss">${esc(o.title)}</h3>
              </a>`)
            .join("")}
        </div>
      </section>`
        : "";
    return `<article class="container-x max-w-4xl pt-8 pb-24 lg:pt-12">
    ${rv(`<a href="/blog" class="inline-flex items-center gap-2 text-[13px] font-semibold text-ink/55 transition-colors hover:text-accent">${icon("arrow-left", "", 15)} All articles</a>`)}
    ${rv(`<p class="mt-8 text-[11px] font-semibold tracking-[0.2em] text-moss uppercase">${esc(post.category)} · ${formatDate(post.publishedAt)}</p>
    <h1 class="h-display mt-4 text-4xl leading-[1.06] md:text-6xl">${esc(post.title)}</h1>`, { delay: 0.06 })}
    ${rv(`<div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-medium text-ink/55">
      <span>By ${esc(post.authorName)}</span>
      <span class="inline-flex items-center gap-1.5">${icon("clock-3", "", 14)} ${post.readMinutes} min read</span>
    </div>`, { delay: 0.12 })}
    ${post.coverImage ? rv(`<div class="img-frame mt-10 aspect-[16/8] shadow-xl shadow-ink/10"><img src="${esc(post.coverImage)}" alt="${esc(post.title)}" class="object-cover" /></div>`, { delay: 0.18 }) : ""}
    ${rv(`<div class="mt-12">${renderContent(post.content)}</div>`, { delay: 0.22 })}
    ${rv(`<div class="mt-14 rounded-[1.75rem] bg-pine p-8 text-cream md:p-10">
      <h2 class="font-display text-2xl font-medium md:text-3xl">Hiring — or being hired? <span class="italic-pop">We can help.</span></h2>
      <p class="mt-3 max-w-xl text-[14.5px] text-cream/75">Tranquil Peeplz partners with companies and candidates across eight industries. One conversation is usually enough to know if we're the right fit.</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <a href="/post-a-job" class="btn btn-accent btn-sm">Post a job ${icon("arrow-up-right", "", 14)}</a>
        <a href="/job-search" class="btn btn-ghost-light btn-sm">Browse roles</a>
      </div>
    </div>`, { delay: 0.1 })}
    ${othersHtml}
  </article>`;
}
//# sourceMappingURL=blog.js.map