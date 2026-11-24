import React from "react";
import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { SITE_URL } from "@/lib/firestore-server";

export const metadata: Metadata = {
  title: "XCEL Stiro | Industrial & Commercial Laundry Equipment Manufacturer in India",
  description:
    "Xcel Stiro Private Limited has manufactured high-performance industrial and commercial laundry equipment in India since 1994 — washer extractors, drying tumblers, flatwork ironers, and dry-cleaning machines backed by PAN-India support.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "XCEL Stiro | Industrial & Commercial Laundry Equipment Manufacturer in India",
    description:
      "High-performance Make-in-India industrial and commercial laundry machines since 1994, trusted across 30,000+ installations nationwide.",
    url: SITE_URL,
    siteName: "XCEL Stiro",
    type: "website",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Xcel Stiro Private Limited",
  url: SITE_URL,
  logo: `${SITE_URL}/xcel.svg`,
  foundingDate: "1994",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-99710-25730",
    contactType: "sales",
    email: "sales@xcelstiro.com",
    areaServed: "IN",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot No. 70, Sector 27C",
    addressLocality: "Faridabad",
    addressRegion: "Haryana",
    postalCode: "121003",
    addressCountry: "IN",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <h1 className="sr-only">
        XCEL Stiro — Industrial and Commercial Laundry Equipment Manufacturer in India Since 1994
      </h1>
      <HomeClient />
    </>
  );
}
