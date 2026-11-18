"use client";

import { useState } from "react";
import { PrismicNextImage } from "@prismicio/next";
import { getWhatsAppCheckoutUrl } from "@/utils/whatsapp";

type ProductCardProps = {
  productName: string;
  price: number;
  salePrice?: number | null;
  image: any;
  sku?: string | null;
  isBlackFriday: boolean;
};

const SIZES = ["S", "M", "L", "XL", "2XL"];

export default function ProductCard({
  productName,
  price,
  salePrice,
  image,
  sku,
  isBlackFriday,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(SIZES[1]); // Default to "M"

  const activePrice = isBlackFriday && salePrice != null ? salePrice : price;
  const formattedPrice = `N$ ${activePrice.toFixed(2)}`;

  const whatsAppUrl = getWhatsAppCheckoutUrl({
    productName,
    size: selectedSize,
    price: formattedPrice,
    sku: sku || undefined,
  });

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md ${isBlackFriday ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}>
      {isBlackFriday && (
        <span className="absolute left-3 top-3 z-10 rounded bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          Sale
        </span>
      )}

      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <PrismicNextImage
          field={image}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{productName}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">{formattedPrice}</span>
            {isBlackFriday && salePrice != null && (
              <span className="text-sm text-gray-400 line-through">
                N$ {price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Size Selector */}
          <div className="mt-3">
            <span className="block text-xs font-medium text-gray-500 mb-1">Select Size</span>
            <div className="flex flex-wrap gap-1">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded px-2 py-1 text-xs font-medium border transition-colors ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-6 pt-3 border-t border-gray-100">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-500 transition-colors"
          >
            Order via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}