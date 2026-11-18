import type { MetadataRoute } from "next";
import { site } from "@/config/site";

import { guides } from "@/config/guides";
import { articles } from "@/config/insights";

const paths = ["", "/private-jets", "/helicopter-charters", "/charter-solutions", "/how-it-works", "/how-we-quote", "/example-quote", "/pricing-explained", "/operators", "/airports", ...guides.map((g) => `/airports/${g.slug}`), "/insights", ...articles.map((a) => `/insights/${a.slug}`), "/about", "/request-a-charter", "/partnerships", "/contact", "/privacy-policy", "/terms-and-conditions"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: p === "" ? "weekly" : "monthly", priority: p === "" ? 1 : p === "/request-a-charter" ? 0.9 : 0.7 }));
}
