// src/utils/whatsapp.ts
export function getWhatsAppCheckoutUrl({
    productName,
    size,
    color,
    price,
    sku,
  }: {
    productName: string;
    size?: string;
    color?: string;
    price?: string;
    sku?: string;
  }) {
    // Replace with your business WhatsApp number (e.g., Namibia code +265 or +264 depending on your line)
    const phoneNumber = "081 495 3446"; 
  
    let message = `Hi Lightwork Clothing! I would like to order:\n\n*Product:* ${productName}`;
    if (size) message += `\n*Size:* ${size}`;
    if (color) message += `\n*Color:* ${color}`;
    if (price) message += `\n*Price:* ${price}`;
    if (sku) message += `\n*SKU:* ${sku}`;
    
    message += `\n\nPlease let me know about availability and delivery!`;
  
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  }