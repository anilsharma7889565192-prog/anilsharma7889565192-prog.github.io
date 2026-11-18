import Link from "next/link";
import type { ReactNode } from "react";
import { LiquidGlass } from "@/components/ui/liquid-glass-button";
import { cn } from "@/lib/utils";

/** A navigation link drawn as a liquid-glass pill. Use it over imagery, never on plain white. */
export function GlassLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("inline-block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent", className)}>
      <LiquidGlass
        radius={28}
        scale={36}
        aberration={8}
        bevelDepth={22}
        frost={0.4}
        tint={0.14}
        className="shadow-[0_12px_32px_rgb(0_0_0/0.28),inset_0_1px_0_rgb(255_255_255/0.5)] transition-transform duration-300 hover:-translate-y-0.5"
        contentClassName="flex h-14 items-center gap-3 px-8 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.4)] select-none"
      >
        {children}
      </LiquidGlass>
    </Link>
  );
}
