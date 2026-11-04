"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "lightwork-announcement-dismissed";

/**
 * Dismissible announcement bar. Text comes from Prismic `settings.announcement_text`.
 * Renders nothing when there is no text (per brief: empty fields render nothing).
 * Dismissal persists in localStorage per device.
 */
export default function AnnouncementBar({ text }: { text?: string | null }) {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid hydration flash

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (!text || dismissed) return null;

  return (
    <div className="bg-ink text-bone" role="region" aria-label="Announcement">
      <div className="container-content gutter flex min-h-[40px] items-center justify-between gap-4 py-2">
        <p className="micro">{text}</p>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => {
            try {
              window.localStorage.setItem(DISMISS_KEY, "1");
            } catch {
              /* private mode — dismiss for this page view only */
            }
            setDismissed(true);
          }}
          className="grid h-[44px] w-[44px] shrink-0 place-items-center text-bone/70 hover:text-bone"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
