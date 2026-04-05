import type { FooterProps } from "@/lib/types";

// Server Component — no 'use client' needed.

export default function Footer({ copyrightText, links }: FooterProps) {
  return (
    <footer className="w-full border-t border-neutral-200 px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
      <p className="text-xs text-neutral-500">{copyrightText}</p>

      <nav aria-label="Footer navigation">
        <ul className="flex items-center gap-6 list-none m-0 p-0">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
