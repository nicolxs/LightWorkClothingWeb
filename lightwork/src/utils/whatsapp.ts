export interface WhatsAppOrderDetails {
    name: string;
    size: string;
    /** Price the customer will actually pay (sale price when a sale is active). */
    price: number | null;
    /** Original price. Pass it only when `price` is a discounted price. */
    originalPrice?: number | null;
    sku?: string | null;
  }
  
  const CURRENCY_SYMBOL = "N$";
  
  /** Formats a number as Namibian dollars, e.g. 1250 -> "N$1,250". */
  export function formatPrice(amount: number): string {
    const formatted = new Intl.NumberFormat("en-NA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  
    return `${CURRENCY_SYMBOL}${formatted}`;
  }
  
  /**
   * Reads the business number from NEXT_PUBLIC_WHATSAPP_NUMBER and keeps digits only.
   * wa.me expects international format with no "+", spaces or dashes (e.g. 264811234567).
   */
  function getBusinessNumber(override?: string): string {
    const raw = override ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
    return raw.replace(/\D/g, "");
  }
  
  export function buildOrderMessage(details: WhatsAppOrderDetails): string {
    const { name, size, price, originalPrice, sku } = details;
  
    const lines: string[] = [
      "Hi Lightwork Clothing, I'd like to order:",
      "",
      `Item: ${name}`,
      `Size: ${size}`,
    ];
  
    if (price !== null) {
      const isDiscounted =
        typeof originalPrice === "number" && originalPrice > price;
  
      lines.push(
        isDiscounted
          ? `Price: ${formatPrice(price)} (sale price, was ${formatPrice(originalPrice)})`
          : `Price: ${formatPrice(price)}`,
      );
    }
  
    if (sku) {
      lines.push(`SKU: ${sku}`);
    }
  
    lines.push("", "Is this available?");
  
    return lines.join("\n");
  }
  
  /** Returns a `https://wa.me/<number>?text=...` link with the order message pre-filled. */
  export function buildWhatsAppOrderUrl(
    details: WhatsAppOrderDetails,
    phoneNumber?: string,
  ): string {
    const number = getBusinessNumber(phoneNumber);
  
    if (!number && process.env.NODE_ENV !== "production") {
      console.warn(
        "NEXT_PUBLIC_WHATSAPP_NUMBER is not set. The WhatsApp link will not reach your business number.",
      );
    }
  
    const text = encodeURIComponent(buildOrderMessage(details));
  
    return `https://wa.me/${number}?text=${text}`;
  }