"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Newsletter email capture — one field, one button.
 * idle -> submitting (spinner + disabled) -> success | error (role="alert").
 * Posts to /api/subscribe. Honeypot hidden field deters naive bots.
 */
export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [errorId] = useState(() => `nl-err-${Math.random().toString(36).slice(2, 8)}`);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: if filled, silently succeed without submitting.
    if ((data.get("website") as string)?.length) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(data.get("email") ?? "") }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("success");
        setMessage("You're in. Watch your inbox.");
        form.reset();
      } else {
        setStatus("error");
        setMessage(json.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm font-medium" role="status">
        You&apos;re in. Watch your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full max-w-md flex-col gap-2">
      <div className="flex gap-2">
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-describedby={status === "error" ? errorId : undefined}
          aria-invalid={status === "error"}
          disabled={status === "submitting"}
          className="h-12 min-w-0 flex-1 rounded border border-line bg-surface px-4 text-sm placeholder:text-ink-60"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex h-12 items-center justify-center gap-2 rounded bg-ink px-6 text-sm font-semibold text-bone"
        >
          {status === "submitting" ? (
            <>
              <span
                aria-hidden="true"
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-bone/30 border-t-bone"
              />
              Sending…
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>

      {/* Honeypot — hidden from users and screen readers */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {status === "error" ? (
        <p id={errorId} role="alert" className="text-sm text-error">
          {message}
        </p>
      ) : null}
    </form>
  );
}
