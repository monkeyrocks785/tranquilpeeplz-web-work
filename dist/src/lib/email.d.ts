export type EmailKind = "job_thank_you" | "new_application_owner" | "job_approved" | "application_received" | "new_job_pending";
export declare const OWNER_EMAIL: string;
/**
 * Records the email in the outbox (email_logs) first — so nothing is ever
 * lost — then attempts SMTP delivery when configured. Never throws: email
 * must never break a form submission.
 */
export declare function sendEmail(opts: {
    kind: EmailKind;
    to: string;
    subject: string;
    body: string;
    csvAttachment?: {
        filename: string;
        content: string;
    };
}): Promise<{
    delivered: boolean;
}>;
export declare function csvEscape(value: string | null | undefined): string;
export declare function toCsv(headers: string[], rows: (string | null | undefined)[][]): string;
//# sourceMappingURL=email.d.ts.map