"use client";

import { useState } from "react";
import type { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

import { buildWhatsAppOrderUrl, formatPrice } from "@/utils/whatsapp";

const SIZES = ["S", "M", "L", "XL"] as const;
type Size = (typeof SIZES)[number];

type ProductItem = Content.ProductCatalogueSliceDefault;

interface ProductCardProps {
  item: ProductItem;
  isBlackFriday: boolean;
}

export default function ProductCard({ item, isBlackFriday }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  const name = item.product_name ?? "Untitled product";
  const price = item.price;
  const salePrice = item.sale_price;

  // A sale price only counts during Black Friday mode, and only if it is a real discount.
  const hasSale =
    isBlackFriday &&
    typeof salePrice === "number" &&
    typeof price === "number" &&
    salePrice < price;

  const finalPrice: number | null = hasSale ? salePrice : price;

  const orderUrl = selectedSize
    ? buildWhatsAppOrderUrl({
        name,
        size: selectedSize,
        price: finalPrice,
        originalPrice: hasSale ? price : null,
        sku: item.sku,
      })
    : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <PrismicNextImage
          field={item.image}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none"
          fallbackAlt=""
        />

        {isBlackFriday && (
          <span className="absolute left-2 top-2 rounded bg-black px-2 py-1 text-xs font-semibold text-white">
            Black Friday Sale
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div>
          <h3 className="text-sm font-medium text-neutral-900 sm:text-base">
            {name}
          </h3>

          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
            {finalPrice === null ? (
              <span className="text-neutral-500">Ask for price</span>
            ) : hasSale ? (
              <>
                <span className="font-semibold text-neutral-900">
                  <span className="sr-only">Sale price: </span>
                  {formatPrice(finalPrice)}
                </span>
                <s className="text-neutral-500">
                  <span className="sr-only">Original price: </span>
                  {formatPrice(price as number)}
                </s>
              </>
            ) : (
              <span className="font-semibold text-neutral-900">
                {formatPrice(finalPrice)}
              </span>
            )}
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label={`Select a size for ${name}`}
          className="grid grid-cols-4 gap-2"
        >
          {SIZES.map((size) => {
            const isSelected = size === selectedSize;

            return (
              <button
                key={size}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedSize(size)}
                className={`min-h-11 rounded border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        {orderUrl ? (
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-11 items-center justify-center rounded bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            Order via WhatsApp
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="mt-auto inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded bg-emerald-600/40 px-4 text-sm font-semibold text-white"
          >
            Select a size to order
          </button>
        )}
      </div>
    </article>
  );
}