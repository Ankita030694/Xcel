import type { MetadataRoute } from "next";
import {
  SITE_URL,
  getServerProducts,
  getCanonicalProductSlug,
  getServerBlogs,
} from "@/lib/firestore-server";

export const revalidate = 300;

function resolveValidDate(input?: string | null, fallback = new Date("2026-11-18T00:00:00.000Z")): Date {
  if (!input) return fallback;
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultDate = new Date("2026-11-18T00:00:00.000Z");

  // Core Canonical Static Routes ( strictly 200 OK indexable pages only )
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: defaultDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: defaultDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: defaultDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: defaultDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: defaultDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: defaultDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: defaultDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/sitemap`,
      lastModified: defaultDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const [products, blogs] = await Promise.all([
    getServerProducts(300),
    getServerBlogs(300),
  ]);

  // Dynamic Canonical Product Pages (/product/[slug])
  const seenProductUrls = new Set<string>();
  const productRoutes: MetadataRoute.Sitemap = [];
  for (const prod of products) {
    const slug = getCanonicalProductSlug(prod);
    if (!slug) continue;
    const url = `${SITE_URL}/product/${slug}`;
    if (seenProductUrls.has(url)) continue;
    seenProductUrls.add(url);

    productRoutes.push({
      url,
      lastModified: resolveValidDate(prod.updatedAt || prod.createdAt, defaultDate),
      changeFrequency: "monthly",
      priority: 0.85,
    });
  }

  // Dynamic Canonical Blog & Technical Journal Articles (/blogs/[slug] only)
  const seenBlogUrls = new Set<string>();
  const blogRoutes: MetadataRoute.Sitemap = [];
  for (const article of blogs) {
    if (!article.slug || article.status === "draft") continue;
    const url = `${SITE_URL}/blogs/${article.slug}`;
    if (seenBlogUrls.has(url)) continue;
    seenBlogUrls.add(url);

    blogRoutes.push({
      url,
      lastModified: resolveValidDate(
        typeof article.updatedAt === "string"
          ? article.updatedAt
          : typeof article.createdAt === "string"
          ? article.createdAt
          : null,
        defaultDate
      ),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
