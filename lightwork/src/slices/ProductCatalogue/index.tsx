import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

import ProductCard from "./productCard";

export type ProductCatalogueProps =
  SliceComponentProps<Content.ProductCatalogueSlice>;

/**
 * Server component: renders the section and passes plain data to the
 * client-side ProductCard, which owns the size-selection state.
 */
const ProductCatalogue = ({ slice }: ProductCatalogueProps) => {
  const isBlackFriday = slice.primary.is_black_friday;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8"
    >
      <header className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
        <PrismicRichText
          field={slice.primary.title}
          components={{
            heading1: ({ children }) => (
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                {children}
              </h2>
            ),
            heading2: ({ children }) => (
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                {children}
              </h2>
            ),
          }}
        />
        <PrismicRichText
          field={slice.primary.subtitle}
          components={{
            paragraph: ({ children }) => (
              <p className="mt-3 text-base text-neutral-600 sm:text-lg">
                {children}
              </p>
            ),
          }}
        />
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {slice.items.map((item, index) => (
          <ProductCard
            key={`${item.sku ?? item.product_name ?? "item"}-${index}`}
            item={item}
            isBlackFriday={isBlackFriday}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductCatalogue;