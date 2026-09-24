import { profile } from "@/content/profile";
import { isStaticExport } from "@/lib/deployment";
import { MIN_FILL_TIME_MS, type ContactErrors, type ContactInput } from "@/lib/validation/contact";

export type SendResult = { ok: true } | { ok: false; error: string; fields?: ContactErrors };

/**
 * Keyless form-to-email relay used where there is no server (the static
 * GitHub Pages build) or when the server's email provider isn't configured.
 * FormSubmit requires a one-time activation from the recipient's inbox.
 */
const RELAY_URL = `https://formsubmit.co/ajax/${profile.email}`;

async function sendViaRelay(input: ContactInput): Promise<SendResult> {
  const response = await fetch(RELAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      message: input.message,
      _subject: `Portfolio message from ${input.name.slice(0, 60)}`,
      _replyto: input.email,
      _template: "table",
      _captcha: "false",
    }),
  });
  const data = (await response.json().catch(() => null)) as { success?: boolean | string; message?: string } | null;
  if (response.ok && (data?.success === true || data?.success === "true")) return { ok: true };
  if (data?.message && /activat/i.test(data.message)) {
    return { ok: false, error: "The contact form is still being activated. Until then, please email me directly:" };
  }
  return { ok: false, error: "Your message couldn't be delivered. Please try again or email me directly:" };
}

async function sendViaApi(input: ContactInput, meta: { website: string; startedAt: number }): Promise<SendResult> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, ...meta }),
  });
  const result = (await response.json().catch(() => null)) as
    | { ok: boolean; error?: string; code?: string; fields?: ContactErrors }
    | null;
  if (response.ok && result?.ok) return { ok: true };
  // No email provider on this deployment yet: use the relay instead of failing.
  if (response.status === 503 && result?.code === "not_configured") return sendViaRelay(input);
  return {
    ok: false,
    error: result?.error ?? "Something went wrong. Please try again or email me directly:",
    fields: result?.fields,
  };
}

/**
 * Sends a validated contact message. Likely bots (filled honeypot or an
 * implausibly fast submission) get a silent success and nothing is sent.
 */
export async function sendContactMessage(
  input: ContactInput,
  meta: { website: string; startedAt: number },
): Promise<SendResult> {
  if (meta.website.trim() || Date.now() - meta.startedAt < MIN_FILL_TIME_MS) return { ok: true };
  return isStaticExport ? sendViaRelay(input) : sendViaApi(input, meta);
}
