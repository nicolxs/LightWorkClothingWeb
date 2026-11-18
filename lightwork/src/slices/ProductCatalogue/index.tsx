"use client";

import { FC, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

export type ProductCatalogueProps = SliceComponentProps<Content.ProductCatalogueSlice>;

// WhatsApp generator helper
function getWhatsAppUrl(productName: string, size: string, price: number) {
  const phoneNumber = "264811234567"; // Replace with your WhatsApp Business number
  const message = `Hi Lightwork Clothing! I would like to order:\n\n*Product:* ${productName}\n*Size:* ${size}\n*Price:* N$ ${price.toFixed(2)}\n\nPlease confirm availability!`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

const SIZES = ["S", "M", "L", "XL"];

const ProductCatalogue: FC<ProductCatalogueProps> = ({ slice }) => {
  const { title, subtitle, is_black_friday, items } = slice.primary;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-10 text-center">
        {is_black_friday && (
          <span className="mb-2 inline-block rounded bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            Black Friday Special Sale
          </span>
        )}
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title ? <PrismicRichText field={title} /> : "Catalogue"}
        </h2>
        {subtitle && (
          <div className="mt-2 text-lg text-gray-600">
            <PrismicRichText field={subtitle} />
          </div>
        )}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items?.map((item, index) => {
          const [selectedSize, setSelectedSize] = useState(SIZES[1]);
          const basePrice = item.price ?? 0;
          const activePrice = is_black_friday && item.sale_price != null ? item.sale_price : basePrice;
          const whatsAppUrl = getWhatsAppUrl(item.product_name || "Clothing Item", selectedSize, activePrice);

          return (
            <div 
              key={index} 
              className={`group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md ${
                is_black_friday ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
              }`}
            >
              {is_black_friday && (
                <span className="absolute left-3 top-3 z-10 rounded bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Sale
                </span>
              )}

              {/* Product Image */}
              <div className="aspect-square w-full overflow-hidden bg-gray-100">
                <PrismicNextImage
                  field={item.image}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content Body */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{item.product_name}</h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">N$ {activePrice.toFixed(2)}</span>
                    {is_black_friday && item.sale_price != null && (
                      <span className="text-sm text-gray-400 line-through">
                        N$ {basePrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Size Selector */}
                  <div className="mt-3">
                    <span className="block text-xs font-medium text-gray-500 mb-1">Size</span>
                    <div className="flex gap-1">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`rounded px-2.5 py-1 text-xs font-medium border transition-colors ${
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

                {/* WhatsApp Action Button */}
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
        })}
      </div>
    </section>
  );
};

export default ProductCatalogue;