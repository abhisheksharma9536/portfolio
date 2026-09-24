import "server-only";
import type { ContactInput } from "@/lib/validation/contact";
import { profile } from "@/content/profile";

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("RESEND_API_KEY is not set");
    this.name = "EmailNotConfiguredError";
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Delivers a contact-form message through the Resend HTTP API.
 * Env: RESEND_API_KEY (required), CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.
 */
export async function sendContactEmail(input: ContactInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new EmailNotConfiguredError();

  const to = process.env.CONTACT_TO_EMAIL || profile.email;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
  const subjectName = input.name.slice(0, 60);
  const receivedAt = new Date().toISOString();

  const text = [
    `New message from your portfolio contact form.`,
    ``,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Received: ${receivedAt}`,
    ``,
    input.message,
  ].join("\n");

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
  <p style="margin:0 0 16px;color:#555">New message from your portfolio contact form.</p>
  <table style="border-collapse:collapse;margin-bottom:16px">
    <tr><td style="padding:2px 12px 2px 0;color:#777">Name</td><td>${escapeHtml(input.name)}</td></tr>
    <tr><td style="padding:2px 12px 2px 0;color:#777">Email</td><td>${escapeHtml(input.email)}</td></tr>
    <tr><td style="padding:2px 12px 2px 0;color:#777">Received</td><td>${receivedAt}</td></tr>
  </table>
  <div style="white-space:pre-wrap;border-left:3px solid #4a3fdc;padding-left:12px">${escapeHtml(input.message)}</div>
</div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `Portfolio message from ${subjectName}`,
      text,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 300)}`);
  }
}
