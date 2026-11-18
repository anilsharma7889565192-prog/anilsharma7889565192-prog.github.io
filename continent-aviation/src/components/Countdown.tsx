"use client";

import { useEffect, useState } from "react";

export function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 30_000); return () => clearInterval(t); }, []);
  if (now === null) return null;
  const ms = new Date(to).getTime() - now;
  if (ms <= 0) return <span className="text-[#f0a199]">This quote has just expired. Refresh the page.</span>;
  const h = Math.floor(ms / 3600_000), m = Math.floor((ms % 3600_000) / 60_000);
  return <span className="text-gold">Time left: {h} hour{h === 1 ? "" : "s"} {m} minute{m === 1 ? "" : "s"}</span>;
}
