"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides site chrome (footer etc.) on selected path prefixes, such as the admin area. */
export function HideOn({ paths, children }: { paths: string[]; children: ReactNode }) {
  const pathname = usePathname();
  if (paths.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;
  return <>{children}</>;
}
