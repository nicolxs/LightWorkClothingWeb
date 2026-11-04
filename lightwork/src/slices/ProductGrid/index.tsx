import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";
import type { ImageFieldImage } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import ProductCard from "@/components/ProductCard";

/**
 * Loose prop shape matching the product_grid slice model. Replace with
 * generated types once Slice Machine codegen is run against the repo.
 */
type ResolvedProduct = {
  uid?: string | null;
  data: {
    name?: string | null;
    price?: number | null;
    images?: ImageFieldImage<"filled">[];
    sold_out?: boolean | null;
  };
};

type Props = SliceComponentProps<{
  id: string;
  slice_type: "product_grid";
  primary: {
    heading?: string | null;
    view_all_link?: unknown;
  };
  items: {
    product?: ResolvedProduct | null;
  }[];
}>;

/**
 * "New arrivals" style grid. Products come from Content Relationships resolved
 * server-side via client.getAllByIDs before rendering (see resolveProducts).
 */
export default function ProductGrid({ slice }: Props) {
  const products = (slice.items ?? [])
    .map((i) => i.product)
    .filter((p): p is ResolvedProduct => !!p && !!p.uid && !!p.data?.name);

  if (!products.length && !slice.primary?.heading) return null;

  return (
    <section className="container-content gutter section-pad">
      <div className="mb-12 flex items-baseline justify-between gap-8">
        {slice.primary?.heading ? (
          <h2 style={{ fontSize: "var(--fs-h2)" }} className="font-display uppercase tracking-[-0.03em]">
            {slice.primary.heading}
          </h2>
        ) : (
          <span />
        )}
        <Link href="/shop" className="micro whitespace-nowrap text-ink underline-offset-4 hover:underline">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard
            key={p.uid!}
            uid={p.uid!}
            name={p.data.name!}
            price={p.data.price ?? 0}
            image={p.data.images?.[0]}
            soldOut={p.data.sold_out}
          />
        ))}
      </div>
    </section>
  );
}
