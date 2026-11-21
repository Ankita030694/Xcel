import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  FileText,
  Eye,
  Share2,
  UserCheck,
  ExternalLink,
  RefreshCw,
  Mail,
  Building2,
  PhoneCall,
  ArrowUpRight,
  CheckCircle2
} from "@/app/components/icons";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Xcel Stiro Private Limited",
  description: "Learn how Xcel Stiro Private Limited collects, uses, and protects your personal information.",
  alternates: {
    canonical: "https://www.xcelstiro.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Xcel Stiro Private Limited",
    description: "Learn how Xcel Stiro Private Limited collects, uses, and protects your personal information.",
    url: "https://www.xcelstiro.com/privacy",
    type: "website",
  },
};

const SECTIONS = [
  { id: "info-we-collect", num: "01", title: "Information We Collect" },
  { id: "how-we-use-info", num: "02", title: "How We Use Your Information" },
  { id: "sharing-of-info", num: "03", title: "Sharing of Information" },
  { id: "security-of-info", num: "04", title: "Security of Your Information" },
  { id: "rights-and-choices", num: "05", title: "Your Rights and Choices" },
  { id: "third-party-links", num: "06", title: "Third-Party Links" },
  { id: "changes-to-policy", num: "07", title: "Changes to This Privacy Policy" },
  { id: "contact-us", num: "08", title: "Contact Us" },
];

const SHORT_VERSION = [
  "We collect standard personal and usage data to fulfill industrial machinery orders and provide support.",
  "Your data is used strictly for service delivery, customer communication, and compliance.",
  "We never sell your data to third parties; sharing is limited to essential service partners.",
  "You maintain full rights to access, update, or request deletion of your data at any time."
];

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>LEGAL & DATA PRIVACY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0a2766] tracking-tight leading-[1.15] mb-6">
              Privacy Policy
            </h1>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 font-normal">
              At <strong className="text-[#0a2766] font-semibold">Xcel Stiro Private Limited</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard the information you provide to us. By visiting our website or using our services, you agree to the terms outlined in this policy.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 pt-2 border-t border-gray-200/80">
              <span>Organization: <strong>Xcel Stiro Private Limited</strong></span>
              <span>•</span>
              <span>Effective Date: <strong>Current & Active</strong></span>
              <span>•</span>
              <span>Applies To: <strong>Website & Services</strong></span>
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
              <nav className="space-y-2">
                {SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center gap-2.5 text-[13px] text-gray-600 hover:text-[#0a2766] py-1 transition-colors group"
                  >
                    <span className="text-[11px] font-mono text-gray-400 group-hover:text-[#3b5b95]">
                      {sec.num}
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform">
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
                Privacy Queries?
              </h3>
              <p className="text-[13.5px] leading-relaxed text-gray-600 mb-5">
                Have questions or need to request data access or deletion? Reach out directly to our compliance desk.
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

            {/* 1. Information We Collect */}
            <section id="info-we-collect" className="scroll-mt-32 space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">01</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">1. Information We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-[15px]">
                <div className="bg-[#f8f9fa] border border-gray-200/70 rounded-xl p-5 space-y-2">
                  <h3 className="font-bold text-[#0a2766] text-[15px] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#3b5b95]" />
                    Personal Information:
                  </h3>
                  <p className="text-gray-700">
                    We may collect personal information such as your name, email address, mailing address, phone number, payment information, and any other details you provide when registering your interaction on our site.
                  </p>
                </div>
                <div className="bg-[#f8f9fa] border border-gray-200/70 rounded-xl p-5 space-y-2">
                  <h3 className="font-bold text-[#0a2766] text-[15px] flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#3b5b95]" />
                    Usage Data:
                  </h3>
                  <p className="text-gray-700">
                    We collect information on how our site is accessed and used, which may include information like your IP address, browser type, pages visited, and time spent on those pages.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. How We Use Your Information */}
            <section id="how-we-use-info" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">02</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">2. How We Use Your Information</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
                <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#3b5b95] mt-2 shrink-0" />
                  <div>
                    <strong className="text-[#0a2766]">Improvement of Services:</strong> To analyze usage, improve our website, and enhance our services.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#3b5b95] mt-2 shrink-0" />
                  <div>
                    <strong className="text-[#0a2766]">Marketing and Promotions:</strong> To inform you about new products, services, promotions, and updates that may be of interest. You can opt out of these communications at any time.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#3b5b95] mt-2 shrink-0" />
                  <div>
                    <strong className="text-[#0a2766]">Legal Compliance:</strong> To comply with legal obligations, resolve disputes, and enforce our agreements.
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Sharing of Information */}
            <section id="sharing-of-info" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">03</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">3. Sharing of Information</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
                <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                  <Share2 className="w-4 h-4 text-[#3b5b95] shrink-0 mt-1" />
                  <div>
                    <strong className="text-[#0a2766]">Third-Party Service Providers:</strong> We may share your information with trusted third-party service providers who assist us with services such as payment processing, shipping, analytics, and advertising.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                  <Building2 className="w-4 h-4 text-[#3b5b95] shrink-0 mt-1" />
                  <div>
                    <strong className="text-[#0a2766]">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owners.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-[#3b5b95] shrink-0 mt-1" />
                  <div>
                    <strong className="text-[#0a2766]">Legal Requirements:</strong> We may disclose your information if required to do so by law or to respond to valid legal processes.
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Security of Your Information */}
            <section id="security-of-info" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">04</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">4. Security of Your Information</h2>
              </div>
              <div className="bg-[#f8f9fa] border border-gray-200/80 rounded-xl p-5 text-gray-700 leading-relaxed text-[15px] flex items-start gap-3.5">
                <Lock className="w-5 h-5 text-[#3b5b95] shrink-0 mt-0.5" />
                <p>
                  We implement a variety of security measures to maintain the safety of your personal information. While we strive to protect your data, no method of transmission over the internet is 100% secure.
                </p>
              </div>
            </section>

            {/* 5. Your Rights and Choices */}
            <section id="rights-and-choices" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">05</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">5. Your Rights and Choices</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                  <h3 className="font-bold text-[#0a2766] text-sm mb-1.5">Access and Correction</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    You have the right to request access to your personal information and to correct inaccuracies.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                  <h3 className="font-bold text-[#0a2766] text-sm mb-1.5">Data Deletion</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    You may request that we delete your personal information, subject to legal obligations.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                  <h3 className="font-bold text-[#0a2766] text-sm mb-1.5">Opt-Out</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    You can opt out of marketing communications by following the unsubscribe link in our emails or by contacting us directly.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Third-Party Links */}
            <section id="third-party-links" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">06</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">6. Third-Party Links</h2>
              </div>
              <div className="bg-[#f8f9fa] border border-gray-200/80 rounded-xl p-5 text-gray-700 leading-relaxed text-[15px] flex items-start gap-3.5">
                <ExternalLink className="w-5 h-5 text-[#3b5b95] shrink-0 mt-0.5" />
                <p>
                  Our site may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review their privacy policies.
                </p>
              </div>
            </section>

            {/* 7. Changes to This Privacy Policy */}
            <section id="changes-to-policy" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">07</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">7. Changes to This Privacy Policy</h2>
              </div>
              <div className="bg-[#f8f9fa] border border-gray-200/80 rounded-xl p-5 text-gray-700 leading-relaxed text-[15px] flex items-start gap-3.5">
                <RefreshCw className="w-5 h-5 text-[#3b5b95] shrink-0 mt-0.5" />
                <p>
                  We may update this policy periodically. Any changes will be posted on this page with the updated revision date. Your continued use of our site after any changes indicates acceptance of the updated policy.
                </p>
              </div>
            </section>

            {/* 8. Contact Us */}
            <section id="contact-us" className="scroll-mt-32 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#3b5b95] bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">08</span>
                <h2 className="text-2xl font-bold text-[#0a2766]">8. Contact Us</h2>
              </div>
              <div className="bg-[#0a2766] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-1">Have Questions About This Policy?</h3>
                  <p className="text-white/80 text-sm">
                    If you have any questions about this Privacy Policy, please contact us at:
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
