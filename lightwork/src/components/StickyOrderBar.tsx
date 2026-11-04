"use client";

import { useEffect, useState } from "react";
import { WhatsAppGlyph } from "./ProductOptions";
import { formatPrice } from "@/lib/whatsapp";

type StickyOrderBarProps = {
  price: number; // unit price (bar shows the same total logic as main CTA defaults to qty 1)
  href: string; // server-built default order link
  soldOut?: boolean | null;
};

/**
 * Mobile-only (<768px) sticky order bar. Appears once the main product CTA
 * (#product-order-cta) scrolls out of view — IntersectionObserver in a client
 * island. Respects iOS safe area.
 */
export default function StickyOrderBar({ price, href, soldOut }: StickyOrderBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cta = document.getElementById("product-order-cta");
    if (!cta || soldOut) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(cta);
    return () => io.disconnect();
  }, [soldOut]);

  if (soldOut || !visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      role="region"
      aria-label="Quick order"
    >
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <span data-price className="tnum text-sm font-semibold">
          N$ {formatPrice(price)}
        </span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[44px] items-center gap-2 rounded bg-ink px-5 text-sm font-semibold text-bone"
        >
          <WhatsAppGlyph />
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
