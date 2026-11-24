import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/firestore-server";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/"],
        disallow: [
          "/admin",
          "/adminloginn",
          "/api/",
          "/test-storage",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
