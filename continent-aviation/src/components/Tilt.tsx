"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/** A link card that tilts very slightly towards the pointer, for a sense of depth. */
export function TiltLink({ href, className = "", children, max = 3.5 }: { href: string; className?: string; children: ReactNode; max?: number }) {
  return (
    <Link
      href={href}
      className={`tilt ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        e.currentTarget.style.setProperty("--ry", `${(x * max * 2).toFixed(2)}deg`);
        e.currentTarget.style.setProperty("--rx", `${(-y * max * 2).toFixed(2)}deg`);
      }}
      onPointerLeave={(e) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); }}
    >
      {children}
    </Link>
  );
}
