import type { HeaderProps } from "@/lib/types";

// Server Component — no 'use client' needed.
// Fixed at the top of the viewport with z-50 to stay above all section content.

export default function Header({ navItems }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-lg border-b border-black/5 shadow-sm">
      {/* Logo placeholder */}
      <div className="text-sm font-semibold tracking-widest uppercase text-neutral-900">
        Premium
      </div>

      <nav aria-label="Main navigation">
        <ul className="flex items-center gap-8 list-none m-0 p-0">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
