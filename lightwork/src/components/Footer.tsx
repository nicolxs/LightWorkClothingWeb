import Link from "next/link";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/our-story" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

type FooterProps = {
  footerText?: string | null;
  instagramUrl?: string | null;
};

/**
 * Site footer. Empty Prismic fields render nothing (no invented copy).
 */
export default function Footer({ footerText, instagramUrl }: FooterProps) {
  return (
    <footer className="border-t border-line">
      <div className="container-content gutter flex flex-col gap-8 py-16 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4">
          <p className="font-display text-lg uppercase tracking-[-0.03em]">
            LIGHTWORK
          </p>
          {/* Renders nothing until settings.footer_text is filled in Prismic */}
          {footerText ? <p className="max-w-[40ch] text-sm text-ink-60">{footerText}</p> : null}
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="micro text-ink hover:text-ink-60">
                  {item.label}
                </Link>
              </li>
            ))}
            {instagramUrl ? (
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="micro text-ink hover:text-ink-60"
                >
                  Instagram
                </a>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
