import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BLOG_ARTICLES } from "@/data/blogs";
import { SITE_URL, getServerBlogBySlug } from "@/lib/firestore-server";
import BlogDetailClient from "./BlogDetailClient";

export const revalidate = 300;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await getServerBlogBySlug(slug);

  if (!resolved) {
    return {
      title: "Article Not Found | XCEL Stiro",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { article, canonicalSlug } = resolved;
  const canonicalUrl = `${SITE_URL}/blogs/${canonicalSlug}`;

  const keywordsList: string[] = [
    article.focusKeyword || article.category,
    ...(article.secondaryKeywords || []),
  ].filter((k): k is string => Boolean(k));

  const rawMetaTitle = (article.metaTitle || "")
    .replace(/\s*\|\s*XCEL(\s+STIRO)?$/i, "")
    .trim();
  const isTruncatedMetaTitle = /\b(in|for|of|to|on|at|by|with|and|or|&|-|—)$/i.test(rawMetaTitle);
  const rawTitle = (!rawMetaTitle || isTruncatedMetaTitle ? article.title || "" : rawMetaTitle)
    .replace(/\s*\|\s*XCEL(\s+STIRO)?$/i, "")
    .trim();

  return {
    title: `${rawTitle} | XCEL Stiro`,
    description: article.metaDescription || article.lead,
    keywords: keywordsList,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription || article.lead,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: article.bannerSrc || article.imageSrc,
          width: 1600,
          height: 600,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function BlogSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = await getServerBlogBySlug(slug);

  if (!resolved) {
    notFound();
  }

  if (resolved.isAlias || slug !== resolved.canonicalSlug) {
    permanentRedirect(`/blogs/${resolved.canonicalSlug}`);
  }

  return (
    <BlogDetailClient
      slug={resolved.canonicalSlug}
      initialArticle={resolved.article}
      initialRelated={resolved.relatedArticles}
    />
  );
}
