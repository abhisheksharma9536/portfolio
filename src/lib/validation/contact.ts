/**
 * Contact-form validation shared by the browser (instant feedback) and the
 * API route (the real gate). Plain TypeScript keeps it out of heavier
 * dependencies and tiny in the client bundle.
 */

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 20, max: 5000 },
} as const;

/** Submissions faster than this after the form renders are almost always bots. */
export const MIN_FILL_TIME_MS = 2500;

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;

// Control characters except tab (\u0009) and newline (\u000A).
const CONTROL_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F]/g;

function clean(value: unknown, { multiline = false } = {}): string {
  if (typeof value !== "string") return "";
  let text = value.normalize("NFC").replace(/\r\n?/g, "\n").replace(CONTROL_CHARS, "");
  if (!multiline) text = text.replace(/\s+/g, " ");
  else text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

export function normalizeContact(raw: Partial<Record<ContactField, unknown>>): ContactInput {
  return {
    name: clean(raw.name),
    email: clean(raw.email).toLowerCase(),
    message: clean(raw.message, { multiline: true }),
  };
}

export function validateContactField(field: ContactField, value: string): string | undefined {
  switch (field) {
    case "name":
      if (value.length < CONTACT_LIMITS.name.min) return "Please enter your name.";
      if (value.length > CONTACT_LIMITS.name.max) return `Please keep your name under ${CONTACT_LIMITS.name.max} characters.`;
      return undefined;
    case "email":
      if (!value) return "Please enter your email address.";
      if (value.length > CONTACT_LIMITS.email.max || !EMAIL_PATTERN.test(value))
        return "Please enter a valid email address.";
      return undefined;
    case "message":
      if (value.length < CONTACT_LIMITS.message.min)
        return `Please write at least ${CONTACT_LIMITS.message.min} characters so I have some context.`;
      if (value.length > CONTACT_LIMITS.message.max)
        return `Please keep your message under ${CONTACT_LIMITS.message.max.toLocaleString("en-US")} characters.`;
      return undefined;
  }
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of ["name", "email", "message"] as const) {
    const error = validateContactField(field, input[field]);
    if (error) errors[field] = error;
  }
  return errors;
}
