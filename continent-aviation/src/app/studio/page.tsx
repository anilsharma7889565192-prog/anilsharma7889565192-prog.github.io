import { notFound } from "next/navigation";
import { StudioClient } from "./StudioClient";

/** Development-only render studio used by scripts/render-images.mjs to produce the site imagery. */
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default function Studio() {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_STUDIO !== "1") notFound();
  return <StudioClient />;
}
