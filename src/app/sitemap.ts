import type { MetadataRoute } from "next";
import { getAllProfessionSlugs } from "@/config/professions";
import { getSiteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  // Note: /login and /account are intentionally excluded (noindex auth pages).
  const staticPages = ["", "/pricing", "/privacy", "/terms"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const professionPages = getAllProfessionSlugs().map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...professionPages];
}
