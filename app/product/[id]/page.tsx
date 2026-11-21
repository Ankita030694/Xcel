import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import {
  SITE_URL,
  getServerProducts,
  getServerProductByParam,
  getCanonicalProductSlug,
  formatProductSeoName,
  buildCleanMetaDescription,
} from "@/lib/firestore-server";

export const revalidate = 300;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const products = await getServerProducts(300);
  return products
    .map((prod) => ({
      id: getCanonicalProductSlug(prod),
    }))
    .filter((entry) => Boolean(entry.id));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const resolved = await getServerProductByParam(id);

  if (!resolved) {
    return {
      title: "Product Not Found | XCEL Stiro",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { product, canonicalSlug } = resolved;
  const seoName = formatProductSeoName(product.name);
  const canonicalUrl = `${SITE_URL}/product/${canonicalSlug}`;
  const description = buildCleanMetaDescription(
    [product.subheading, product.detailDescription, product.shortDescription]
      .filter(Boolean)
      .join(" — "),
    `${seoName} manufactured in India by Xcel Stiro Private Limited for commercial laundries, hotels, hospitals, and garment factories.`
  );

  return {
    title: `${seoName} — Industrial Laundry Equipment | XCEL Stiro`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${seoName} | XCEL Stiro`,
      description,
      url: canonicalUrl,
      type: "website",
      images: product.imageUrl
        ? [
            {
              url: product.imageUrl,
              alt: seoName,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const resolved = await getServerProductByParam(id);

  if (!resolved) {
    notFound();
  }

  const { product, matchedById, canonicalSlug, allProducts } = resolved;

  // Consolidate legacy Firestore document ID URLs or non-canonical custom URLs via 308 Permanent Redirect
  if (matchedById && canonicalSlug && id !== canonicalSlug) {
    permanentRedirect(`/product/${canonicalSlug}`);
  }

  const targetCat = (product.categoryId || "").trim().toLowerCase();
  const relatedProducts = allProducts.filter((p) => {
    if (!targetCat || (p.categoryId || "").trim().toLowerCase() !== targetCat) {
      return false;
    }
    if (p.id === product.id) return false;
    if (p.slug && product.slug && p.slug === product.slug) return false;
    return true;
  });

  const seoName = formatProductSeoName(product.name);
  const canonicalUrl = `${SITE_URL}/product/${canonicalSlug}`;
  const cleanDescription = buildCleanMetaDescription(
    [product.subheading, product.detailDescription, product.shortDescription]
      .filter(Boolean)
      .join(" — "),
    `${seoName} manufactured in India by Xcel Stiro Private Limited.`,
    300
  );

  const productJsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: seoName,
    description: cleanDescription,
    image: [product.imageUrl, ...(product.additionalImages || [])].filter(Boolean),
    url: canonicalUrl,
    brand: {
      "@type": "Brand",
      name: "XCEL Stiro",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Xcel Stiro Private Limited",
      url: SITE_URL,
    },
  };

  const faqEntities = Array.isArray(product.faqs)
    ? product.faqs.filter((f) => f?.question && f?.answer)
    : [];

  const faqJsonLd =
    faqEntities.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqEntities.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ProductDetailClient
        initialId={canonicalSlug}
        initialProduct={product}
        initialRelated={relatedProducts}
      />
    </>
  );
}
