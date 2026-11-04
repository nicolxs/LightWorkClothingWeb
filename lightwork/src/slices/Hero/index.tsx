import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

/**
 * Loose prop shape — matches the hero slice model. When the user connects
 * Prismic and runs Slice Machine code generation, replace with the generated
 * `SliceComponentProps<Slices.HeroDefaultVariation>`.
 */
type HeroPrimary = {
  image?: { url?: string | null; alt?: string | null } | null;
  headline?: Parameters<typeof PrismicRichText>[0]["field"] | null;
  subline?: Parameters<typeof PrismicRichText>[0]["field"] | null;
  cta_label?: string | null;
  cta_link?: { url?: string | null; text?: string | null } | null;
};

export type HeroProps = SliceComponentProps<{
  id: string;
  slice_type: "hero";
  primary: HeroPrimary;
}>;

/**
 * Full-bleed hero. The hero image is the LCP element on mobile — high fetch
 * priority, nothing competing above the fold. Empty fields render nothing.
 */
export default function Hero({ slice }: HeroProps) {
  const { image, headline, subline, cta_label, cta_link } = slice.primary ?? {};

  return (
    <section className="relative w-full">
      {image?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${image.url}?auto=format&fit=crop&w=1600&q=80`}
          alt={image.alt ?? ""}
          fetchPriority="high"
          className="h-[70vh] max-h-[820px] w-full object-cover md:h-[85vh]"
        />
      ) : null}

      <div className="container-content gutter absolute inset-x-0 bottom-0 flex flex-col gap-4 pb-12 pt-24 text-bone md:pb-24">
        {/* Gradient scrim for contrast over image — pure CSS, no asset */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent"
        />
        <div className="relative flex flex-col gap-4">
          {headline ? (
            <PrismicRichText
              field={headline}
              components={{
                heading1: ({ children }) => (
                  <h1
                    className="font-display uppercase tracking-[-0.03em]"
                    style={{ fontSize: "var(--fs-hero)" }}
                  >
                    {children}
                  </h1>
                ),
                paragraph: ({ children }) => <p className="text-lg">{children}</p>,
              }}
            />
          ) : null}
          {subline ? (
            <PrismicRichText
              field={subline}
              components={{
                paragraph: ({ children }) => (
                  <p className="max-w-[46ch] text-base opacity-90">{children}</p>
                ),
              }}
            />
          ) : null}
          {cta_link ? (
            <PrismicNextLink
              field={cta_link as never}
              className="mt-4 inline-flex h-12 w-fit items-center justify-center rounded bg-bone px-8 text-sm font-semibold text-ink hover:bg-surface"
            >
              {cta_label || "Shop the drop"}
            </PrismicNextLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
