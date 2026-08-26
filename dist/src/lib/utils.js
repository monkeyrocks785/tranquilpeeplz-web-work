import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function formatSalary(min, max) {
    if (min == null && max == null)
        return "Competitive";
    if (min != null && max == null)
        return `₹${min}L+ / yr`;
    if (min == null && max != null)
        return `Up to ₹${max}L / yr`;
    if (min === max)
        return `₹${min}L / yr`;
    return `₹${min}–${max}L / yr`;
}
export function formatExperience(min, max) {
    if (min <= 0 && max <= 0)
        return "Fresher friendly";
    if (min === max)
        return `${min}+ yrs`;
    return `${min}–${max} yrs`;
}
export function timeAgo(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
    if (seconds < 3600)
        return "just now";
    const days = Math.floor(seconds / 86400);
    if (days <= 0)
        return "today";
    if (days === 1)
        return "yesterday";
    if (days < 7)
        return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks === 1)
        return "1 week ago";
    if (weeks < 5)
        return `${weeks} weeks ago`;
    const months = Math.floor(days / 30);
    if (months <= 1)
        return "1 month ago";
    return `${months} months ago`;
}
export function formatDate(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
export function slugify(input) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
}
export function titleCase(s) {
    return s
        .split(/[-\s]/)
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
        .join(" ");
}
//# sourceMappingURL=utils.js.map