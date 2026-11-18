"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { menuExtra, nav } from "@/config/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      } else if (e.key === "Tab") {
        const items = [toggleRef.current!, ...focusables()];
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className={`mx-auto flex h-16 max-w-[80rem] items-center justify-between gap-6 rounded-full border px-5 transition-[background-color,border-color,box-shadow] duration-500 lg:h-[4.5rem] lg:px-7 ${scrolled || open ? "border-white/35 bg-[rgb(6_37_64/0.72)] shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_16px_40px_-18px_rgba(0,15,40,0.7)]" : "border-white/30 bg-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/0.4)]"} backdrop-blur-xl backdrop-saturate-150`}>
        <Link href="/" aria-label="Continent Aviation, home" className="relative z-10 shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined}
              className={`relative py-2 text-[0.8rem] font-medium uppercase tracking-[0.16em] transition-colors hover:text-gold ${isActive(l.href) ? "text-gold" : "text-ivory/85"} after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold after:transition-transform after:duration-300 ${isActive(l.href) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/request-a-charter" className="btn btn-gold !min-h-[2.5rem] !px-5 !py-2">Request a Charter</Link>
        </nav>

        <button ref={toggleRef} type="button" className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center text-ivory lg:hidden"
          aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
          {open ? <X size={26} strokeWidth={1.25} /> : <Menu size={26} strokeWidth={1.25} />}
        </button>
      </div>

    </header>
      <div id="mobile-menu" ref={panelRef} hidden={!open} className="fixed inset-x-0 bottom-0 top-[5.5rem] z-40 overflow-y-auto bg-midnight lg:hidden">
        <nav aria-label="Mobile" className="wrap flex min-h-full flex-col py-8">
          <ul>
            {[...nav, ...menuExtra].map((l) => (
              <li key={l.href} className="border-b border-gold/20">
                <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={`block py-5 font-serif text-3xl ${isActive(l.href) ? "text-gold" : "text-ivory"}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/request-a-charter" className="btn btn-gold mt-10 w-full">Request a Charter</Link>
          <p className="mt-auto pt-10 text-xs leading-relaxed text-grey">Charters are arranged through independent aviation operators.</p>
        </nav>
      </div>
    </>
  );
}
