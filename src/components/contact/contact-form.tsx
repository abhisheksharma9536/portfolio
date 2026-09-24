"use client";

import { useId, useState, type FormEvent } from "react";
import {
  CONTACT_LIMITS,
  normalizeContact,
  validateContact,
  validateContactField,
  type ContactErrors,
  type ContactField,
} from "@/lib/validation/contact";
import { profile } from "@/content/profile";
import { AlertCircle, ArrowRight, Check } from "@/components/ui/icons";
import { buttonClass, cn } from "@/components/ui/primitives";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

const fieldClass =
  "w-full rounded-xl border bg-bg px-4 py-3 text-[0.97rem] text-fg placeholder:text-faint transition-[border-color,box-shadow] outline-none focus:border-accent focus:shadow-[0_0_0_4px_var(--accent-soft)]";

export function ContactForm() {
  const id = useId();
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [messageLength, setMessageLength] = useState(0);

  const fieldId = (field: ContactField) => `${id}-${field}`;
  const errorId = (field: ContactField) => `${id}-${field}-error`;

  function onBlur(field: ContactField, raw: string) {
    const value = normalizeContact({ [field]: raw })[field];
    if (!value) return; // don't nag on empty fields until submit
    setErrors((prev) => ({ ...prev, [field]: validateContactField(field, value) }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.state === "submitting") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const input = normalizeContact({
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
    });

    const found = validateContact(input);
    setErrors(found);
    const firstInvalid = (["name", "email", "message"] as const).find((f) => found[f]);
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`#${CSS.escape(fieldId(firstInvalid))}`)?.focus();
      return;
    }

    setStatus({ state: "submitting" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website: data.get("website"), startedAt }),
      });
      const result = (await response.json().catch(() => null)) as
        | { ok: boolean; error?: string; fields?: ContactErrors }
        | null;
      if (response.ok && result?.ok) {
        setStatus({ state: "success" });
        form.reset();
        setMessageLength(0);
        return;
      }
      if (result?.fields) setErrors(result.fields);
      setStatus({
        state: "error",
        message: result?.error ?? "Something went wrong. Please try again.",
      });
    } catch {
      setStatus({
        state: "error",
        message: "Network error — please check your connection and try again.",
      });
    }
  }

  if (status.state === "success") {
    return (
      <div role="status" className="flex min-h-[26rem] flex-col items-start justify-center gap-4 p-2">
        <span className="grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
          <Check size={22} strokeWidth={2.2} />
        </span>
        <h3 className="text-2xl font-semibold tracking-tight">Message sent.</h3>
        <p className="max-w-sm text-muted">
          Thanks for reaching out — it&apos;s in my inbox and I&apos;ll reply to the
          email you provided.
        </p>
        <button
          type="button"
          className={buttonClass("secondary", "mt-2")}
          onClick={() => {
            setStartedAt(Date.now());
            setStatus({ state: "idle" });
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  const submitting = status.state === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby={`${id}-note`} className="grid gap-5">
      {(
        [
          { field: "name", label: "Name", type: "text", autoComplete: "name", placeholder: "Your name" },
          { field: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@company.com" },
        ] as const
      ).map(({ field, label, type, autoComplete, placeholder }) => (
        <div key={field} className="grid gap-2">
          <label htmlFor={fieldId(field)} className="text-sm font-medium">
            {label}
          </label>
          <input
            id={fieldId(field)}
            name={field}
            type={type}
            required
            autoComplete={autoComplete}
            placeholder={placeholder}
            maxLength={field === "name" ? CONTACT_LIMITS.name.max : CONTACT_LIMITS.email.max}
            aria-invalid={errors[field] ? true : undefined}
            aria-describedby={errors[field] ? errorId(field) : undefined}
            onBlur={(e) => onBlur(field, e.target.value)}
            onChange={() => errors[field] && setErrors((prev) => ({ ...prev, [field]: undefined }))}
            className={cn(fieldClass, errors[field] ? "border-danger" : "border-line-strong")}
          />
          {errors[field] ? (
            <p id={errorId(field)} className="text-sm text-danger">
              {errors[field]}
            </p>
          ) : null}
        </div>
      ))}

      <div className="grid gap-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor={fieldId("message")} className="text-sm font-medium">
            Message
          </label>
          <span className="font-mono text-xs text-faint" aria-hidden="true">
            {messageLength.toLocaleString("en-US")}/{CONTACT_LIMITS.message.max.toLocaleString("en-US")}
          </span>
        </div>
        <textarea
          id={fieldId("message")}
          name="message"
          required
          rows={6}
          maxLength={CONTACT_LIMITS.message.max}
          placeholder="What are you building, and how can I help?"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId("message") : undefined}
          onBlur={(e) => onBlur("message", e.target.value)}
          onChange={(e) => {
            setMessageLength(e.target.value.length);
            if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
          }}
          className={cn(fieldClass, "min-h-40 resize-y", errors.message ? "border-danger" : "border-line-strong")}
        />
        {errors.message ? (
          <p id={errorId("message")} className="text-sm text-danger">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status.state === "error" ? (
        <div role="alert" className="flex gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-danger" />
          <p>
            {status.message}{" "}
            <a href={`mailto:${profile.email}`} className="font-medium underline underline-offset-2">
              {profile.email}
            </a>
          </p>
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${id}-note`} className="text-xs text-faint">
          Your details are only used to reply to you.
        </p>
        <button type="submit" disabled={submitting} className={buttonClass("primary", "w-full sm:w-auto")}>
          {submitting ? (
            <>
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              />
              Sending…
            </>
          ) : (
            <>
              Send message
              <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {submitting ? "Sending your message" : ""}
      </p>
    </form>
  );
}
