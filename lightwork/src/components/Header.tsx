"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MobileNav from "./MobileNav";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/our-story" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

/**
 * Sticky site header. 56px tall mobile / 72px desktop.
 * Hairline bottom border appears only after scroll (class on <html>).
 */
export default function Header({ logoSrc }: { logoSrc?: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      document.documentElement.classList.toggle("scrolled", window.scrollY > 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="site-header sticky top-0 z-40 border-b border-transparent bg-bone/95 backdrop-blur-sm">
        <div className="container-content gutter flex h-14 items-center justify-between md:h-[72px]">
          <Link
            href="/"
            className="font-display uppercase tracking-[-0.03em]"
            aria-label="Lightwork Clothing — home"
          >
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} alt="" height={28} className="h-7 w-auto" />
            ) : (
              <span className="text-lg md:text-xl">LIGHTWORK</span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:block" aria-label="Primary">
            <ul className="flex items-center gap-8">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="micro py-3 text-ink hover:text-ink-60"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile menu button — 44x44 tap target */}
          <button
            type="button"
            className="grid h-[44px] w-[44px] place-items-center md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
