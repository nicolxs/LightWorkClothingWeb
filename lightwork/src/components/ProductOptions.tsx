"use client";

import { useMemo, useState } from "react";
import { buildOrderLink, formatPrice } from "@/lib/whatsapp";

type ProductOptionsProps = {
  name: string;
  price: number;
  url: string;
  sizes: string[]; // e.g. ["S","M","L"] — empty if not set in Prismic
  colours: string[];
  soldOut?: boolean | null;
};

/**
 * Client island: size / colour / qty selector that rewrites the WhatsApp CTA
 * href live. Server renders a default href so the link works with JS disabled.
 * Size selection is REQUIRED before activation — via aria-disabled (never the
 * `disabled` attribute, which would break the href fallback).
 */
export default function ProductOptions({
  name,
  price,
  url,
  sizes,
  colours,
  soldOut,
}: ProductOptionsProps) {
  const [size, setSize] = useState<string | undefined>(undefined);
  const [colour, setColour] = useState<string | undefined>(colours[0]);
  const [qty, setQty] = useState(1);

  const sizeRequired = sizes.length > 0;
  const ready = !soldOut && (!sizeRequired || !!size);

  const href = useMemo(
    () => buildOrderLink({ name, price, size, colour, qty, url }),
    [name, price, size, colour, qty, url],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Colour swatches */}
      {colours.length > 0 ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="micro mb-2 text-ink-60">Colour</legend>
          <div className="flex flex-wrap gap-3">
            {colours.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColour(c)}
                aria-pressed={colour === c}
                className={`min-h-[44px] rounded border px-4 py-2 text-sm ${
                  colour === c
                    ? "border-ink bg-ink text-bone"
                    : "border-line bg-surface text-ink hover:border-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {/* Size chips */}
      {sizes.length > 0 ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="micro mb-2 text-ink-60">Size</legend>
          <div className="flex flex-wrap gap-3">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={`h-[44px] w-[44px] rounded border text-sm font-medium ${
                  size === s
                    ? "border-ink bg-ink text-bone"
                    : "border-line bg-surface text-ink hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {/* Quantity stepper */}
      <div className="flex items-center gap-0 self-start border border-line">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="grid h-[44px] w-[44px] place-items-center hover:bg-bone"
        >
          −
        </button>
        <span data-price className="tnum w-10 text-center text-sm" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          className="grid h-[44px] w-[44px] place-items-center hover:bg-bone"
        >
          +
        </button>
      </div>

      {/* WhatsApp CTA */}
      <div className="flex flex-col gap-2">
        <a
          id="product-order-cta"
          href={ready ? href : undefined}
          aria-disabled={!ready}
          target="_blank"
          rel="noopener noreferrer"
          data-ready={ready}
          className={`flex h-[52px] w-full items-center justify-center gap-3 rounded bg-ink text-bone md:h-12 ${
            ready ? "" : "pointer-events-none opacity-40"
          }`}
        >
          <WhatsAppGlyph />
          <span className="text-sm font-semibold">
            {soldOut ? "Sold out" : "Order on WhatsApp"}
          </span>
          <span className="tnum ml-auto pr-4 text-sm">{`N$ ${formatPrice(price * qty)}`}</span>
        </a>
        {sizeRequired && !size && !soldOut ? (
          <p className="text-xs text-ink-60">Select a size to continue.</p>
        ) : null}
      </div>
    </div>
  );
}

/** WhatsApp glyph — #25D366 fill ONLY, never used as a background. 18px. */
export function WhatsAppGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.83 14.11c-.24.68-1.42 1.32-1.95 1.36-.5.05-.5.4-3.15-.66-2.66-1.05-4.3-3.75-4.42-3.93-.13-.18-1.05-1.4-1.05-2.67 0-1.27.67-1.9.9-2.16.24-.26.52-.33.7-.33h.5c.16 0 .37-.02.57.44.24.57.79 1.98.86 2.12.07.14.12.31.02.5-.1.18-.15.3-.3.46l-.43.5c-.14.14-.29.3-.12.58.16.29.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.29.14.45.12.62-.07.16-.2.71-.83.9-1.11.19-.29.38-.24.64-.15.26.1 1.66.78 1.94.92.29.14.48.21.55.33.07.11.07.66-.17 1.33z" />
    </svg>
  );
}
