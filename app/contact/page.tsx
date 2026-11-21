import React from "react";
import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { SITE_URL } from "@/lib/firestore-server";

export const metadata: Metadata = {
  title: "Contact Us — Laundry Plant Consultation, Sales & Service | XCEL Stiro",
  description:
    "Get in touch with Xcel Stiro Private Limited in Faridabad & Tiruppur for industrial laundry machinery quotes, facility capacity planning, genuine spare parts, and PAN-India technical service.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact Us — Laundry Plant Consultation, Sales & Service | XCEL Stiro",
    description:
      "Speak with XCEL Stiro's sales and servicing engineers across India for commercial laundry equipment enquiries.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <h1 className="sr-only">Contact XCEL Stiro Private Limited — Sales and Nationwide Service</h1>
      <ContactClient />
    </>
  );
}
