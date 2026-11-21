import type { NextConfig } from "next";
import { BLOG_ARTICLES } from "./data/blogs";

const blogAliasRedirects = BLOG_ARTICLES.flatMap((article) =>
  (article.aliases || []).map((alias) => ({
    source: `/blogs/${alias}`,
    destination: `/blogs/${article.slug}`,
    permanent: true,
  }))
);

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/blogs",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/blogs/:slug",
        permanent: true,
      },
      {
        source: "/insights",
        destination: "/blogs",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/product/fallback-:id",
        destination: "/products",
        permanent: true,
      },
      ...blogAliasRedirects,
    ];
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/adminloginn",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/test-storage",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.pdf",
        headers: [
          {
            key: "Content-Type",
            value: "application/pdf",
          },
          {
            key: "Content-Disposition",
            value: "inline",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/brochure",
        destination: "/Xcel-Brochure.pdf",
      },
    ];
  },
};

export default nextConfig;
