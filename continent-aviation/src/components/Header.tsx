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

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${scrolled || open ? "border-b border-gold/20 bg-midnight/92 backdrop-blur-md" : "border-b border-transparent bg-gradient-to-b from-midnight/70 to-transparent"}`}>
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
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
          <Link href="/request-a-charter" className="btn btn-gold !min-h-[2.6rem] !px-5 !py-2">Request a Charter</Link>
        </nav>

        <button ref={toggleRef} type="button" className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center text-ivory lg:hidden"
          aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
          {open ? <X size={26} strokeWidth={1.25} /> : <Menu size={26} strokeWidth={1.25} />}
        </button>
      </div>

    </header>
      <div id="mobile-menu" ref={panelRef} hidden={!open} className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-midnight lg:hidden">
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
