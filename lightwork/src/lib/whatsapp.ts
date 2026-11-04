/**
 * WhatsApp order deep-link builder.
 * Number provided by the brand owner: +264 81 495 3446 -> international, digits only.
 */
const WA_NUMBER = "264814953446";

export type OrderParams = {
  name: string;
  price: number; // unit price in NAD
  size?: string;
  colour?: string;
  qty: number;
  url: string; // absolute product page URL
};

/**
 * Builds a wa.me deep link with a pre-filled order message in exactly this shape:
 *
 *   Hi Lightwork! I'd like to order:
 *
 *   *<Product Name>*            <- WhatsApp bold
 *   Colour: <colour>            <- omitted if undefined
 *   Size: <size>                <- omitted if undefined
 *   Qty: <qty>
 *   Price: N$ <price * qty>     <- TOTAL, not unit price
 *   <absolute product URL>
 */
export function buildOrderLink(p: OrderParams): string {
  const lines: string[] = [
    "Hi Lightwork! I'd like to order:",
    "",
    `*${p.name}*`,
  ];

  if (p.colour) lines.push(`Colour: ${p.colour}`);
  if (p.size) lines.push(`Size: ${p.size}`);

  lines.push(`Qty: ${p.qty}`);
  lines.push(`Price: N$ ${formatPrice(p.price * p.qty)}`);
  lines.push(p.url);

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** NAD price formatting: no decimals for whole numbers, 2dp otherwise. Tabular-safe string. */
export function formatPrice(n: number): string {
  return Number.isInteger(n) ? n.toString() : n.toFixed(2);
}
