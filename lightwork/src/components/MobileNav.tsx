"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/our-story" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

/**
 * Mobile navigation drawer. Client island (one of only five allowed).
 * Proper aria-expanded / aria-controls per accessibility brief.
 */
export default function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-bone md:hidden"
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
    >
      <nav className="flex flex-col gap-8 p-6 pt-[72px]">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="font-display text-3xl uppercase tracking-[-0.03em]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        className="absolute right-4 top-2 grid h-[44px] w-[44px] place-items-center"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  );
}

/** Hook used by Header to toggle the drawer — exported for reuse. */
export function useMenuState() {
  const [open, setOpen] = useState(false);
  return { open, setOpen, close: () => setOpen(false) };
}
