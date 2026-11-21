import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowLeft, 
  FileText, 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  CreditCard, 
  XCircle, 
  Truck, 
  RotateCcw, 
  ShieldAlert, 
  Gavel, 
  RefreshCw, 
  Mail, 
  ArrowUpRight 
} from "@/app/components/icons";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Xcel Stiro Private Limited",
  description: "Terms and conditions governing the use of Xcel Stiro Private Limited's website, products, and services.",
  alternates: {
    canonical: "https://www.xcelstiro.com/terms",
  },
  openGraph: {
    title: "Terms of Service | Xcel Stiro Private Limited",
    description: "Terms and conditions governing the use of Xcel Stiro Private Limited's website, products, and services.",
    url: "https://www.xcelstiro.com/terms",
    type: "website",
  },
};

const SECTIONS = [
  { id: "general-information", num: "01", title: "General Information" },
  { id: "eligibility", num: "02", title: "Eligibility" },
  { id: "product-information", num: "03", title: "Product Information" },
  { id: "pricing-and-payments", num: "04", title: "Pricing and Payments" },
  { id: "order-acceptance", num: "05", title: "Order Acceptance & Cancellation" },
  { id: "shipping-and-delivery", num: "06", title: "Shipping and Delivery" },
  { id: "returns-and-refunds", num: "07", title: "Returns and Refunds" },
  { id: "intellectual-property", num: "08", title: "Intellectual Property" },
  { id: "user-conduct", num: "09", title: "User Conduct" },
  { id: "limitation-of-liability", num: "10", title: "Limitation of Liability" },
  { id: "indemnification", num: "11", title: "Indemnification" },
  { id: "governing-law", num: "12", title: "Governing Law" },
  { id: "changes-to-terms", num: "13", title: "Changes to Terms" },
  { id: "contact-us", num: "14", title: "Contact Us" },
];

const SHORT_VERSION = [
  "Orders are confirmed strictly upon advance payment receipt as detailed in the Proforma Invoice.",
  "Orders once confirmed cannot be cancelled, and returns or refund requests are not agreed.",
  "All machinery specifications, media, and site content are the exclusive property of Xcel Stiro.",
  "Disputes are subject to the exclusive jurisdiction of the competent courts in Faridabad, Haryana, India."
];

export default function TermsOfServicePage() {
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
              <Scale className="w-3.5 h-3.5" />
              <span>LEGAL AGREEMENT & TERMS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0a2766] tracking-tight leading-[1.15] mb-6">
              Terms of Service
            </h1>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 font-normal">
              Welcome to <strong className="text-[#0a2766] font-semibold">Xcel Stiro Private Limited</strong>. By accessing or using our website, you agree to be bound by the terms and conditions outlined below. Please read them carefully before engaging with our services or making a purchase.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 pt-2 border-t border-gray-200/80">
              <span>Entity: <strong>Xcel Stiro Private Limited</strong></span>
              <span>•</span>
              <span>Jurisdiction: <strong>Faridabad, Haryana, India</strong></span>
              <span>•</span>
              <span>Status: <strong>Legally Binding</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Two Column Editorial Layout */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Sidebar (Sticky on Desktop) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-8 order-2 lg:order-1">
            
            {/* The Short Version Summary */}
            <div className="bg-[#f8f9fa] border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs">
              <h2 className="text-[13px] font-bold tracking-wider text-[#0a2766] uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3b5b95]" />
                The Short Version
              </h2>
              <ul className="space-y-3.5">
                {SHORT_VERSION.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[13.5px] leading-[1.6] text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#3b5b95] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Navigation / Table of Contents */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-[13px] font-bold tracking-wider text-[#0a2766] uppercase mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3b5b95]" />
                Table of Contents
              </h3>
              <nav className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center gap-2.5 text-[12.5px] text-gray-600 hover:text-[#0a2766] py-1 transition-colors group"
                  >
                    <span className="text-[11px] font-mono text-gray-400 group-hover:text-[#3b5b95]">
                      {sec.num}
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform truncate">
                      {sec.title}
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Help & Contact Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#3b5b95]/10 flex items-center justify-center text-[#3b5b95] mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0a2766] mb-2">
                Questions on Terms?
              </h3>
              <p className="text-[13.5px] leading-relaxed text-gray-600 mb-5">
                For commercial contracts, proforma clarifications, or legal queries, contact our corporate office.
              </p>
              <a
                href="mailto:sales@xcelstiro.com"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0a2766] text-white hover:bg-[#3b5b95] font-semibold text-xs tracking-wider uppercase py-3 px-5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <Mail className="w-4 h-4" />
                <span>sales@xcelstiro.com</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

          </aside>

          {/* RIGHT COLUMN: Full Policy Content */}
          <article className="lg:col-span-8 order-1 lg:order-2 space-y-12">
            
            {/* 1. General Information */}
            <section id="general-information" className="scroll-mt-32 space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">01</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">1. General Information</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
                <p>
                  This website is operated by <strong>Xcel Stiro Private Limited</strong>. The terms &ldquo;we,&rdquo; &ldquo;us,&rdquo; and &ldquo;our&rdquo; refer to Xcel Stiro Private Limited throughout the site.
                </p>
                <p>
                  By visiting our site or purchasing something from us, you agree to be bound by these Terms and Conditions, including any additional terms and policies referenced herein.
                </p>
              </div>
            </section>

            {/* 2. Eligibility */}
            <section id="eligibility" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">02</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">2. Eligibility</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
                <p>
                  You must be at least 18 years of age or have the consent of a parent or guardian to use our website.
                </p>
                <p>
                  By agreeing to these terms, you represent that the information provided during account creation or checkout is accurate and complete.
                </p>
              </div>
            </section>

            {/* 3. Product Information */}
            <section id="product-information" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">03</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">3. Product Information</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
                <p>
                  We strive to ensure that all product descriptions, images, and prices on our website are accurate. However, errors may occur.
                </p>
                <p>
                  Products displayed on the website are subject to availability. We reserve the right to discontinue any product at any time without notice.
                </p>
              </div>
            </section>

            {/* 4. Pricing and Payments */}
            <section id="pricing-and-payments" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">04</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">4. Pricing and Payments</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
                <p>
                  We reserve the right to change pricing at any time without prior notice.
                </p>
                <div className="bg-[#f8f9fa] border border-gray-200/80 rounded-xl p-5 flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-[#3b5b95] shrink-0 mt-0.5" />
                  <p>
                    Payment must be completed at the time of placing an order. Accepted payment methods include: <strong>NEFT, RTGS, UPI, Cheque (subject to realisation), Demand Draft</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Order Acceptance and Cancellation */}
            <section id="order-acceptance" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">05</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">5. Order Acceptance and Cancellation</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
                <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    An order is confirmed only after receiving the advance payment from the client.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-100 bg-rose-50/40">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-rose-950 font-medium">
                    Orders once confirmed cannot be cancelled and no refund request will be entertained.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Shipping and Delivery */}
            <section id="shipping-and-delivery" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">06</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">6. Shipping and Delivery</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
                <div className="bg-[#f8f9fa] border border-gray-200/80 rounded-xl p-5 flex items-start gap-3">
                  <Truck className="w-5 h-5 text-[#3b5b95] shrink-0 mt-0.5" />
                  <p>
                    Shipping timelines, charges and delivery terms are outlined in our <strong>Proforma Invoice</strong>.
                  </p>
                </div>
                <p>
                  We are not responsible for delays caused by unforeseen circumstances, including natural disasters or logistical issues.
                </p>
              </div>
            </section>

            {/* 7. Returns and Refunds */}
            <section id="returns-and-refunds" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">07</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">7. Returns and Refunds</h2>
              </div>
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-amber-950 font-semibold">
                  Return and Refund is not agreed.
                </p>
              </div>
            </section>

            {/* 8. Intellectual Property */}
            <section id="intellectual-property" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">08</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">8. Intellectual Property</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
                <p>
                  All content on this website, including text, graphics, logos, and images, is the exclusive property of <strong>Xcel Stiro Private Limited</strong> and is protected under applicable intellectual property laws.
                </p>
                <p>
                  You may not reproduce, duplicate, or exploit any portion of the content without prior written permission from Xcel Stiro Private Limited.
                </p>
              </div>
            </section>

            {/* 9. User Conduct */}
            <section id="user-conduct" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">09</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">9. User Conduct</h2>
              </div>
              <div className="space-y-2 text-gray-700 leading-relaxed text-[15px]">
                <p className="font-medium text-[#0a2766] mb-2">By using our website, you agree not to:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>Violate any applicable laws or regulations.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>Transmit viruses, malware, or other harmful code.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>Use the website for unauthorized commercial purposes.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>Engage in fraudulent activity or impersonate another person.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 10. Limitation of Liability */}
            <section id="limitation-of-liability" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">10</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">10. Limitation of Liability</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
                <p>
                  Xcel Stiro Private Limited is not responsible for any direct, indirect, or consequential damages arising from your use of the website, products, or services.
                </p>
                <p>
                  We do not guarantee that the website will be error-free, secure, or uninterrupted.
                </p>
              </div>
            </section>

            {/* 11. Indemnification */}
            <section id="indemnification" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">11</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">11. Indemnification</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-[15px]">
                You agree to indemnify, defend, and hold Xcel Stiro Private Limited harmless from any claims, liabilities, damages, or expenses arising out of your use of our website or breach of these Terms and Conditions.
              </p>
            </section>

            {/* 12. Governing Law */}
            <section id="governing-law" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">12</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">12. Governing Law</h2>
              </div>
              <div className="bg-[#f8f9fa] border border-gray-200/80 rounded-xl p-5 flex items-start gap-3 text-gray-700 leading-relaxed text-[15px]">
                <Gavel className="w-5 h-5 text-[#3b5b95] shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p>
                    These Terms and Conditions are governed by and construed in accordance with the laws of India.
                  </p>
                  <p className="font-semibold text-[#0a2766]">
                    Any disputes will be subject to the exclusive jurisdiction of courts in Faridabad, Haryana.
                  </p>
                </div>
              </div>
            </section>

            {/* 13. Changes to Terms */}
            <section id="changes-to-terms" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">13</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">13. Changes to Terms</h2>
              </div>
              <div className="bg-[#f8f9fa] border border-gray-200/80 rounded-xl p-5 flex items-start gap-3 text-gray-700 leading-relaxed text-[15px]">
                <RefreshCw className="w-5 h-5 text-[#3b5b95] shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p>
                    Xcel Stiro Private Limited reserves the right to update or modify these Terms and Conditions at any time without prior notice.
                  </p>
                  <p>
                    Changes will be effective immediately upon posting on the website. Your continued use of the website signifies your acceptance of the revised terms.
                  </p>
                </div>
              </div>
            </section>

            {/* 14. Contact Us */}
            <section id="contact-us" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">14</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">14. Contact Us</h2>
              </div>
              <div className="bg-[#0a2766] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-1">Questions Regarding These Terms?</h3>
                  <p className="text-white/80 text-sm">
                    If you have any questions regarding these Terms and Conditions, please contact us at:
                  </p>
                  <a
                    href="mailto:sales@xcelstiro.com"
                    className="inline-block mt-3 text-white font-bold text-base hover:text-blue-200 underline decoration-blue-300 underline-offset-4 transition-colors"
                  >
                    sales@xcelstiro.com
                  </a>
                </div>
                <Link
                  href="/contact"
                  className="bg-white text-[#0a2766] hover:bg-gray-100 font-semibold text-xs tracking-wider uppercase py-3 px-6 rounded-xl transition-colors shadow-sm shrink-0"
                >
                  Contact Page
                </Link>
              </div>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
