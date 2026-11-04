import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";
import type { ImageFieldImage } from "@prismicio/client";
import { formatPrice } from "@/lib/whatsapp";

type ProductCardProps = {
  uid: string;
  name: string;
  price: number;
  /** First image of the product's repeatable `images` field. */
  image: ImageFieldImage<"filled"> | undefined;
  soldOut?: boolean | null;
};

/**
 * Core visual component — bordered card, fixed 4:5 portrait frame.
 * Hover scale is guarded by (hover:hover) and (pointer:fine) so touch
 * devices never get stuck at 1.05x. CSS-only, motion-reduce respected.
 * No quick-order button: ordering happens on the product page.
 */
export default function ProductCard({ uid, name, price, image, soldOut }: ProductCardProps) {
  return (
    <Link
      href={`/shop/${uid}`}
      className="group block border border-line bg-surface"
      aria-label={`${name} — N$ ${formatPrice(price)}${soldOut ? " (sold out)" : ""}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {image?.url ? (
          <PrismicNextImage
            // Cast: Prismic types are strict about filled vs empty image
            // variants; we've already narrowed with the `image?.url` check.
            field={image as ImageFieldImage}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw"
            // Let PrismicNextImage derive `alt` from the field itself.
            // Passing `alt={image.alt ?? ""}` fails typecheck because the
            // component's alt prop only accepts the literal "" (decorative).
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.6,.2,1)] [@media(hover:hover)and(pointer:fine)]:group-hover:scale-[1.05] motion-reduce:transition-none"
          />
        ) : null}
        {soldOut ? (
          <span className="micro absolute left-0 top-0 bg-ink px-3 py-2 text-bone">
            Sold out
          </span>
        ) : null}
      </div>
      <figcaption className="flex items-baseline justify-between gap-4 px-4 py-3">
        <span className="truncate text-sm font-medium">{name}</span>
        <span data-price className="tnum shrink-0 text-sm text-ink-60">
          N$ {formatPrice(price)}
        </span>
      </figcaption>
    </Link>
  );
}
