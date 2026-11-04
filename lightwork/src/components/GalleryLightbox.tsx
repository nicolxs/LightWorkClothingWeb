"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string | null;
};

/**
 * Native <dialog> lightbox — no library.
 * Arrow-key navigation, Esc to close (native dialog), focus returns to the
 * triggering thumbnail. Simple focus trap on the close button + dialog itself.
 */
export default function GalleryLightbox({ items }: { items: GalleryItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const open = useCallback((i: number, trigger: HTMLElement) => {
    lastFocused.current = trigger;
    setIndex(i);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setIndex(null);
    // Return focus to the triggering thumbnail
    lastFocused.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length));
    },
    [items.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const current = index !== null ? items[index] : null;

  return (
    <>
      {/* Thumbnails grid is rendered by the page; this island exposes triggers via context-free render props pattern kept simple: we render the grid here too. */}
      <ul className="grid grid-cols-2 gap-4 md:auto-rows-fr md:grid-cols-3" style={{ gridAutoFlow: "dense" }}>
        {items.map((item, i) => (
          <li key={item.src + i} className={i % 5 === 0 ? "md:row-span-2" : ""}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              aria-label={`Open image ${i + 1} of ${items.length}${item.caption ? `: ${item.caption}` : ""}`}
              className={`block w-full overflow-hidden border border-line bg-surface ${
                i % 5 === 0 ? "aspect-[4/5] md:aspect-auto md:h-full" : "aspect-[4/5] md:aspect-square"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={close}
        aria-label="Gallery image viewer"
        className="m-auto h-[80vh] w-[90vw] max-w-content border border-line bg-surface p-0 backdrop:bg-ink/70"
      >
        {current ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <p className="micro text-ink-60">
                {index! + 1} / {items.length}
                {current.caption ? ` — ${current.caption}` : ""}
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Close image viewer"
                autoFocus
                className="grid h-[44px] w-[44px] place-items-center"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
            <div className="relative flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.src}
                alt={current.alt}
                className="absolute inset-0 h-full w-full object-contain"
              />
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="absolute left-0 top-0 grid h-full w-14 place-items-center text-ink hover:bg-bone/60"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="absolute right-0 top-0 grid h-full w-14 place-items-center text-ink hover:bg-bone/60"
              >
                ›
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
