import nodemailer from "nodemailer";
import { db } from "../db";
import { emailLogs } from "../db/schema";
import { eq } from "drizzle-orm";

export type EmailKind = "job_thank_you" | "new_application_owner";

const FROM =
  process.env.EMAIL_FROM ?? "Tranquil Peeplz <no-reply@tranquilpeeplz.com>";
export const OWNER_EMAIL =
  process.env.OWNER_EMAIL ?? "contact@tranquilpeeplz.com";

function getTransporter() {
  if (process.env.SMTP_URL) {
    return nodemailer.createTransport(process.env.SMTP_URL);
  }
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }
  return null;
}

/**
 * Records the email in the outbox (email_logs) first — so nothing is ever
 * lost — then attempts SMTP delivery when configured. Never throws: email
 * must never break a form submission.
 */
export async function sendEmail(opts: {
  kind: EmailKind;
  to: string;
  subject: string;
  body: string;
  csvAttachment?: { filename: string; content: string };
}): Promise<{ delivered: boolean }> {
  const [row] = await db
    .insert(emailLogs)
    .values({
      kind: opts.kind,
      toEmail: opts.to,
      subject: opts.subject,
      body: opts.body,
      csvPayload: opts.csvAttachment?.content ?? null,
      status: "queued",
    })
    .returning({ id: emailLogs.id });

  const transporter = getTransporter();
  if (!transporter) {
    console.log(
      `[email] SMTP not configured — logged to outbox (${opts.kind} → ${opts.to})`,
    );
    return { delivered: false };
  }

  try {
    await transporter.sendMail({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      text: opts.body,
      attachments: opts.csvAttachment
        ? [
            {
              filename: opts.csvAttachment.filename,
              content: opts.csvAttachment.content,
              contentType: "text/csv",
            },
          ]
        : undefined,
    });
    await db
      .update(emailLogs)
      .set({ status: "sent" })
      .where(eq(emailLogs.id, row.id));
    return { delivered: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] delivery failed:", message);
    await db
      .update(emailLogs)
      .set({ status: "failed", error: message })
      .where(eq(emailLogs.id, row.id));
    return { delivered: false };
  }
}

// ---------------------------------------------------------------------------
// CSV helpers
// ---------------------------------------------------------------------------

export function csvEscape(value: string | null | undefined): string {
  const v = value ?? "";
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function toCsv(headers: string[], rows: (string | null | undefined)[][]): string {
  const lines = [headers.map(csvEscape).join(",")];
  for (const r of rows) lines.push(r.map(csvEscape).join(","));
  return lines.join("\r\n");
}
