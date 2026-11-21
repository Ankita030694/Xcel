import React from "react";
import type { Metadata } from "next";
import BlogsClient from "./BlogsClient";
import { SITE_URL, getServerBlogs } from "@/lib/firestore-server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Laundry Engineering & Industry Insights | XCEL Stiro",
  description:
    "Expert technical insights, energy-saving benchmarks, and equipment selection guides for industrial and commercial laundry facilities across India.",
  alternates: {
    canonical: `${SITE_URL}/blogs`,
  },
  openGraph: {
    title: "Laundry Engineering & Industry Insights | XCEL Stiro",
    description:
      "Expert technical insights, energy-saving benchmarks, and equipment selection guides for industrial and commercial laundry facilities across India.",
    url: `${SITE_URL}/blogs`,
    type: "website",
  },
};

export default async function BlogsPage() {
  const articles = await getServerBlogs(300);
  return <BlogsClient initialArticles={articles} />;
}
