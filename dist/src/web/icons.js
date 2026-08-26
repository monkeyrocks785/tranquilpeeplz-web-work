import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
/**
 * Inline SVG icons from lucide-static (ISC licensed, attribution in vendor
 * files). Loaded once from disk, class-ified, cached in memory.
 */
const ICONS_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../node_modules/lucide-static/icons");
// Name fixes for renamed icons in the installed icon set.
const ALIASES = {
    building2: "building-2",
    code2: "code-2",
    clock3: "clock-3",
    trash2: "trash-2",
    checkcircle: "circle-check",
};
const cache = new Map();
export function icon(name, cls = "", size = 18) {
    const file = ALIASES[name] ?? name;
    let svg = cache.get(file);
    if (!svg) {
        try {
            svg = readFileSync(join(ICONS_DIR, `${file}.svg`), "utf8")
                .replace(/<!--[\s\S]*?-->\s*/g, "")
                .replace(/\n\s*/g, " ")
                .trim();
            cache.set(file, svg);
        }
        catch {
            return "";
        }
    }
    let out = svg;
    if (size !== 24) {
        out = out
            .replace('width="24"', `width="${size}"`)
            .replace('height="24"', `height="${size}"`);
    }
    if (cls) {
        out = out.replace(/class="[^"]*"/, `class="${cls}"`);
    }
    else {
        out = out.replace(/class="[^"]*"/, "");
    }
    return out;
}
/** Custom brand glyph (Instagram-style camera outline). */
export function instagramIcon(size = 17) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`;
}
/** Custom brand glyph (LinkedIn-style mark). */
export function linkedinIcon(size = 17) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`;
}
/** Rotating "tp" stamp used in hero/about sections. */
export function stamp(cls = "") {
    return `<div class="relative h-28 w-28 ${cls}">
  <svg viewBox="0 0 100 100" class="stamp-rotate h-full w-full">
    <defs><path id="stamp-circle-${Math.abs([...cls].reduce((a, c) => a + c.charCodeAt(0), 0))}" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/></defs>
    <text style="fill:currentColor;font-size:10.5px;font-weight:600;letter-spacing:0.24em;text-transform:uppercase">
      <textPath href="#stamp-circle">create possibilities faster · since 2021 ·</textPath>
    </text>
  </svg>
  <div class="absolute inset-0 grid place-items-center"><span class="font-display text-xl font-semibold italic">tp</span></div>
</div>`.replace("#stamp-circle", `#stamp-circle-${Math.abs([...cls].reduce((a, c) => a + c.charCodeAt(0), 0))}`);
}
//# sourceMappingURL=icons.js.map