"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Understated sticky enquiry bar for small screens. Hidden where it would be redundant. */
export function MobileCta() {
  const pathname = usePathname();
  if (pathname.startsWith("/request-a-charter")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/25 bg-midnight/95 px-4 py-3 backdrop-blur lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <Link href="/request-a-charter" className="btn btn-gold w-full !min-h-[2.75rem]">Request a Charter</Link>
    </div>
  );
}
