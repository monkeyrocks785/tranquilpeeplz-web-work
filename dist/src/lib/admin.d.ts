import type { Request } from "express";
/**
 * Minimal stateless admin gate — no user accounts. The site owner sets
 * ADMIN_PASSCODE in the environment; /admin asks for it once and remembers
 * a signed (HMAC) cookie for 30 days.
 */
export declare const ADMIN_COOKIE = "tp_admin";
export declare function adminPasscode(): string;
export declare function adminToken(): string;
export declare function isAdmin(req: Request): boolean;
//# sourceMappingURL=admin.d.ts.map