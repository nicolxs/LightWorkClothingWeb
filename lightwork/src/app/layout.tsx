import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

// Display / wordmark face
const archivo = Archivo({
  subsets: ["latin"], // Latin subset only
  weight: ["700"],
  display: "swap",
  variable: "--font-archivo",
  preload: true,
});

// Body / UI face
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Lightwork Clothing Namibia",
    template: "%s | Lightwork Clothing Namibia",
  },
  description:
    "Namibian streetwear. Catalogue and brand site — order via WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body className="font-body text-ink antialiased">{children}</body>
    </html>
  );
}
