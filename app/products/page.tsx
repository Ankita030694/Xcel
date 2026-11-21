import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ProductsClient from "./ProductsClient";
import {
  SITE_URL,
  getServerProducts,
  getServerCategoryOrder,
  getCanonicalProductSlug,
  formatProductSeoName,
} from "@/lib/firestore-server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Industrial & Commercial Laundry Machines Catalog | XCEL Stiro",
  description:
    "Explore XCEL Stiro's complete range of industrial and commercial laundry equipment: washer extractors, drying tumblers, flatwork ironers, PERC dry-cleaning machines, steam finishing, and industrial water heaters.",
  alternates: {
    canonical: `${SITE_URL}/products`,
  },
  openGraph: {
    title: "Industrial & Commercial Laundry Machines Catalog | XCEL Stiro",
    description:
      "Complete Make-in-India commercial laundry equipment catalog from washing and hydro extraction to drying and flatwork ironing.",
    url: `${SITE_URL}/products`,
    type: "website",
  },
};

export default async function ProductsPage() {
  const [products, categoryOrder] = await Promise.all([
    getServerProducts(300),
    getServerCategoryOrder(),
  ]);

  return (
    <>
      <ProductsClient
        initialProducts={products}
        initialCategoryOrder={categoryOrder}
      />
      {products.length > 0 && (
        <nav aria-label="Complete Equipment Models Index" className="sr-only">
          <h2>All Industrial &amp; Commercial Laundry Machines</h2>
          <ul>
            {products.map((prod) => {
              const slug = getCanonicalProductSlug(prod);
              return (
                <li key={prod.id}>
                  <Link href={`/product/${slug}`}>
                    {formatProductSeoName(prod.name)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
}
