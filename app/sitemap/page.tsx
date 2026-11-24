import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  Globe, 
  Compass, 
  Package, 
  BookOpen, 
  ShieldCheck, 
  Scale, 
  Building2, 
  PhoneCall, 
  Mail, 
  ArrowUpRight, 
  Layers, 
  FileCode2,
  ExternalLink,
  ChevronRight,
  CheckCircle2
} from "@/app/components/icons";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  getServerProducts,
  getServerBlogs,
  getCanonicalProductSlug,
  formatProductSeoName,
} from "@/lib/firestore-server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sitemap | Xcel Stiro Private Limited",
  description: "Complete visual sitemap and index of all pages, laundry equipment categories, technical articles, and legal documentation of Xcel Stiro.",
  alternates: {
    canonical: "https://www.xcelstiro.com/sitemap",
  },
  openGraph: {
    title: "Sitemap | Xcel Stiro Private Limited",
    description: "Complete visual sitemap and index of all pages, laundry equipment categories, technical articles, and legal documentation of Xcel Stiro.",
    url: "https://www.xcelstiro.com/sitemap",
    type: "website",
  },
};

const PRODUCT_CATEGORIES = [
  { name: "Washing Equipment", href: "/products#washing", desc: "Industrial washer extractors and commercial washing machines for laundries." },
  { name: "Drying Solutions", href: "/products#drying", desc: "High-performance drying tumbler and hydro extractor machines for laundries." },
  { name: "Apparel Processing", href: "/products#apparel-processing", desc: "Specialised garment processing machines for washing, softening and drying operations." },
  { name: "Dry-Cleaning Machinery", href: "/products#dry-cleaning", desc: "Advanced dry-cleaning machines with integrated distillation and solvent recovery modules." },
  { name: "Flat-Work Ironers", href: "/products#flat-work", desc: "High Speed flatwork ironers for professional flat linen ironing applications." },
  { name: "Steam-Finishing Systems", href: "/products#steam-finishing", desc: "Professional garment ironing equipment, including utility presses, form finishers and vacuum tables." },
  { name: "Industrial Water Heaters", href: "/products#water-heater", desc: "Continuous hot water heating systems for commercial washing, ironing machines and large-scale laundry operations." },
  { name: "Fabric Checking Machine", href: "/products#fabric-checking", desc: "Fabric inspection and measuring machines for quality control in garment and apparel manufacturing units." },
  { name: "Other Ancillary Equipment", href: "/products#other-equipment", desc: "Essential laundry support equipment, including stain removal machines, SS trolleys and thread sucking machine." },
  { name: "Complete Equipment Range", href: "/products#complete-range", desc: "Explore the complete XCEL portfolio of industrial and commercial laundry machines." },
];

export default async function SitemapPage() {
  const [products, blogs] = await Promise.all([
    getServerProducts(300),
    getServerBlogs(300),
  ]);
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172228] font-sans">
      <Header />

      {/* Top Breadcrumb Navigation */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-3">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-gray-500 hover:text-[#0a2766] transition-colors group shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-gray-500 group-hover:text-[#3b5b95]" />
            <span>BACK TO HOME</span>
          </Link>
          <div className="h-[1px] bg-gray-200 flex-1" />
        </div>
      </div>

      {/* Hero Header */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-8 sm:pb-12">
        <div className="bg-[#f8f9fa] border border-gray-200 rounded-[2rem] p-8 sm:p-12 lg:p-14 relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-[#3b5b95]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3b5b95]/10 border border-[#3b5b95]/20 text-[#3b5b95] text-xs font-bold tracking-wider uppercase mb-5">
              <Compass className="w-3.5 h-3.5" />
              <span>SITE DIRECTORY & INDEX</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0a2766] tracking-tight leading-[1.15] mb-6">
              Website Sitemap
            </h1>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 font-normal">
              Explore the complete structure of <strong className="text-[#0a2766] font-semibold">Xcel Stiro Private Limited</strong>. Find direct links to all equipment categories, technical journals, corporate pages, and regulatory policies.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500 pt-2 border-t border-gray-200/80">
              <span className="flex items-center gap-1.5 text-[#3b5b95] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Index
              </span>
              <span>•</span>
              <a 
                href="/sitemap.xml" 
                target="_blank" 
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1 text-[#0a2766] font-bold hover:underline"
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>View XML Sitemap (For Crawlers)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Directory */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          
          {/* Card 1: Core Navigation */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#3b5b95]/40 transition-colors">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#3b5b95]/10 flex items-center justify-center text-[#3b5b95]">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0a2766]">Core Website</h2>
                <p className="text-xs text-gray-500">Primary navigational hubs</p>
              </div>
            </div>

            <ul className="space-y-3">
              <li>
                <Link href="/" className="group flex items-center justify-between text-[14px] text-gray-700 hover:text-[#0a2766] font-medium py-1">
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#3b5b95] transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="group flex items-center justify-between text-[14px] text-gray-700 hover:text-[#0a2766] font-medium py-1">
                  <span>About Us</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#3b5b95] transition-all" />
                </Link>
                <ul className="pl-4 mt-2 space-y-1.5 border-l-2 border-gray-100 text-[12.5px] text-gray-500">
                  <li><Link href="/about#our-story" className="hover:text-[#3b5b95] transition-colors block py-0.5">• Our Story</Link></li>
                  <li><Link href="/about#leadership" className="hover:text-[#3b5b95] transition-colors block py-0.5">• Leadership</Link></li>
                  <li><Link href="/about#vision" className="hover:text-[#3b5b95] transition-colors block py-0.5">• Our Vision & Mission</Link></li>
                </ul>
              </li>
              <li>
                <Link href="/products" className="group flex items-center justify-between text-[14px] text-gray-700 hover:text-[#0a2766] font-medium py-1">
                  <span>Products Catalog</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#3b5b95] transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="group flex items-center justify-between text-[14px] text-gray-700 hover:text-[#0a2766] font-medium py-1">
                  <span>Industry Insights</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#3b5b95] transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="group flex items-center justify-between text-[14px] text-gray-700 hover:text-[#0a2766] font-medium py-1">
                  <span>Contact Us</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#3b5b95] transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Card 2: Legal & Transparency */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#3b5b95]/40 transition-colors">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#3b5b95]/10 flex items-center justify-center text-[#3b5b95]">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0a2766]">Legal & Compliance</h2>
                <p className="text-xs text-gray-500">Policies & company governance</p>
              </div>
            </div>

            <ul className="space-y-3.5">
              <li>
                <Link href="/privacy" className="group flex items-start justify-between text-[14px] text-gray-700 hover:text-[#0a2766] font-medium py-1">
                  <div>
                    <span className="block">Privacy Policy</span>
                    <span className="text-[12px] text-gray-500 font-normal">Data protection & user privacy rights</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#3b5b95] transition-all mt-1" />
                </Link>
              </li>
              <li>
                <Link href="/terms" className="group flex items-start justify-between text-[14px] text-gray-700 hover:text-[#0a2766] font-medium py-1">
                  <div>
                    <span className="block">Terms of Service</span>
                    <span className="text-[12px] text-gray-500 font-normal">Commercial terms, warranties & jurisdiction</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#3b5b95] transition-all mt-1" />
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="group flex items-start justify-between text-[14px] text-[#0a2766] font-bold py-1">
                  <div>
                    <span className="block">HTML Sitemap</span>
                    <span className="text-[12px] text-gray-500 font-normal">Human-friendly site directory</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#3b5b95] mt-1" />
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer nofollow" className="group flex items-start justify-between text-[14px] text-gray-700 hover:text-[#0a2766] font-medium py-1">
                  <div>
                    <span className="block flex items-center gap-1.5">
                      XML Sitemap 
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </span>
                    <span className="text-[12px] text-gray-500 font-normal">Crawler-formatted XML index</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#3b5b95] transition-all mt-1" />
                </a>
              </li>
            </ul>
          </div>

          {/* Card 3: Facilities & Regional Offices */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#3b5b95]/40 transition-colors">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#3b5b95]/10 flex items-center justify-center text-[#3b5b95]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0a2766]">Offices & Works</h2>
                <p className="text-xs text-gray-500">Corporate & manufacturing centers</p>
              </div>
            </div>

            <div className="space-y-4 text-[13px] text-gray-700">
              <div className="bg-[#f8f9fa] p-3.5 rounded-xl border border-gray-100">
                <span className="font-bold text-[#0a2766] block mb-1">Corporate Office & Plant:</span>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Xcel Stiro Private Limited, Plot No. 70, Sector 27C, Faridabad, Haryana 121003, India
                </p>
                <div className="mt-2 text-xs font-semibold text-[#3b5b95]">
                  Tel: +91 129-4155713 / 14
                </div>
              </div>

              <div className="bg-[#f8f9fa] p-3.5 rounded-xl border border-gray-100">
                <span className="font-bold text-[#0a2766] block mb-1">Regional Branch (South India):</span>
                <p className="text-gray-600 text-xs leading-relaxed">
                  12/26, PN Rd, Laxmi Nagar, New Extn, Tiruppur, Tamil Nadu 641602, India
                </p>
                <div className="mt-2 text-xs font-semibold text-[#3b5b95]">
                  Email: tirupur@xcelstiro.com
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Equipment Catalog (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-[#3b5b95]/40 transition-colors">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#3b5b95]/10 flex items-center justify-center text-[#3b5b95]">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0a2766]">Machinery & Equipment Directory</h2>
                <p className="text-xs text-gray-500">Direct categories on /products</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRODUCT_CATEGORIES.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.href}
                  className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-[#f8f9fa] transition-all group block"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13.5px] font-bold text-[#0a2766] group-hover:text-[#3b5b95] transition-colors">
                      {cat.name}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 group-hover:text-[#3b5b95] transition-all shrink-0" />
                  </div>
                  <p className="text-[12px] text-gray-500 leading-snug">
                    {cat.desc}
                  </p>
                </Link>
              ))}
            </div>

            {products.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#0a2766] uppercase tracking-wider mb-4">
                  All Equipment Models ({products.length})
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {products.map((prod) => {
                    const slug = getCanonicalProductSlug(prod);
                    if (!slug || slug.startsWith("fallback-")) return null;
                    return (
                      <li key={prod.id}>
                        <Link
                          href={`/product/${slug}`}
                          className="group flex items-center justify-between text-[13px] text-gray-700 hover:text-[#0a2766] font-medium py-1.5 px-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-[#f8f9fa] transition-all"
                        >
                          <span>{formatProductSeoName(prod.name)}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 group-hover:text-[#3b5b95] shrink-0" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Card 5: Technical Articles & Research Guides */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#3b5b95]/40 transition-colors">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#3b5b95]/10 flex items-center justify-center text-[#3b5b95]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0a2766]">Engineering Articles</h2>
                <p className="text-xs text-gray-500">Technical insights & buying guides</p>
              </div>
            </div>

            <ul className="space-y-3">
              {blogs.map((art) => (
                <li key={art.slug || art.id}>
                  <Link
                    href={`/blogs/${art.slug}`}
                    className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-[#f8f9fa] transition-all group block"
                  >
                    <div className="text-[11px] font-bold text-[#3b5b95] uppercase tracking-wider mb-1">
                      {art.category} • {art.readTime}
                    </div>
                    <h3 className="text-[13px] font-semibold text-gray-800 group-hover:text-[#0a2766] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
