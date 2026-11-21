import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/firestore-server";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/adminloginn",
          "/api/",
          "/test-storage",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
