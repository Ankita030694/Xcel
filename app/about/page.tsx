import React from "react";
import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { SITE_URL } from "@/lib/firestore-server";

export const metadata: Metadata = {
  title: "About Us — 32+ Years of Laundry Engineering Excellence | XCEL Stiro",
  description:
    "Discover Xcel Stiro Private Limited's 32+ year Make-in-India manufacturing legacy across a 20,000 sq. ft. plant in Faridabad, powering 30,000+ industrial laundry installations across India.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Us — 32+ Years of Laundry Engineering Excellence | XCEL Stiro",
    description:
      "30,000+ machines installed across hotels, NABH hospitals, garment exporters, and commercial laundries nationwide.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <h1 className="sr-only">About XCEL Stiro Private Limited — Industrial Laundry Equipment Manufacturer</h1>
      <AboutClient />
    </>
  );
}
