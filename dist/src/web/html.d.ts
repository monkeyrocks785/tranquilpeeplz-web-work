/** HTML-escape user/DB-provided strings before interpolation. */
export declare function esc(value: unknown): string;
export type PageOptions = {
    title: string;
    description?: string;
    path: string;
    body: string;
};
export declare function page(opts: PageOptions): string;
/** Reveal-on-scroll wrapper helper. */
export declare function rv(inner: string, opts?: {
    delay?: number;
    className?: string;
}): string;
export declare function sectionHeading(p: {
    eyebrow: string;
    title: string;
    intro?: string;
    align?: "left" | "center";
    dark?: boolean;
}): string;
export declare function marquee(items: string[]): string;
export declare function fieldError(errors: Record<string, string[] | undefined> | undefined, name: string): string;
export declare function formAlert(state?: {
    ok?: boolean;
    message?: string;
} | null): string;
//# sourceMappingURL=html.d.ts.map