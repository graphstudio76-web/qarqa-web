"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "خانه" },
  { href: "/diagnose", label: "تشخیص" },
  { href: "/packages", label: "بسته‌ها" },
  { href: "/flight", label: "مسیر پرواز" },
  { href: "/panel", label: "پنل" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-violet-500 to-emerald-600 text-lg shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            aria-hidden
          >
            🐦‍⬛
          </span>
          <div className="leading-tight">
            <div className="font-bold tracking-wide text-bone">قارقا</div>
            <div className="text-[10px] text-white/50">Qarqa</div>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm sm:gap-3">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-1.5 transition ${
                  active
                    ? "bg-white/10 text-bone"
                    : "text-white/60 hover:bg-white/5 hover:text-bone"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
