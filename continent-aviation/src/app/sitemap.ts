import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const paths = ["", "/private-jets", "/helicopter-charters", "/charter-solutions", "/how-it-works", "/about", "/request-a-charter", "/partnerships", "/contact", "/privacy-policy", "/terms-and-conditions"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: p === "" ? "weekly" : "monthly", priority: p === "" ? 1 : p === "/request-a-charter" ? 0.9 : 0.7 }));
}
