"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Star,
  ShieldCheck,
  PhoneCall,
  ChevronRight,
} from "@/app/components/icons";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { BlogArticle, BlogTable } from "@/data/blogs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BlogDetailClientProps {
  slug: string;
  initialArticle?: BlogArticle | null;
  initialRelated?: BlogArticle[];
}

export default function BlogDetailClient({
  slug,
  initialArticle,
  initialRelated = [],
}: BlogDetailClientProps) {
  const [article, setArticle] = useState<BlogArticle | null>(initialArticle || null);
  const [loading, setLoading] = useState<boolean>(!initialArticle);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>(initialRelated);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [slug]);

  useEffect(() => {
    const fetchArticleFromFirestore = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        const normalized = slug.toLowerCase().trim();

        // 1. Check slug
        const q = query(blogsRef, where("slug", "==", normalized));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const docData = { id: snap.docs[0].id, ...snap.docs[0].data() } as BlogArticle;
          setArticle(docData);
        } else {
          // 2. Check aliases
          const aliasQ = query(blogsRef, where("aliases", "array-contains", normalized));
          const aliasSnap = await getDocs(aliasQ);
          if (!aliasSnap.empty) {
            const docData = { id: aliasSnap.docs[0].id, ...aliasSnap.docs[0].data() } as BlogArticle;
            setArticle(docData);
          }
        }

        // 3. Fetch related articles
        const allSnap = await getDocs(blogsRef);
        const list: BlogArticle[] = [];
        if (!allSnap.empty) {
          allSnap.forEach((d: any) => {
            const data = { id: d.id, ...d.data() } as any;
            if (data.status !== "draft" && data.slug !== normalized) {
              list.push(data);
            }
          });
        }
        // Merge with initialRelated so related articles are always populated
        const existingSlugs = new Set(list.map((l) => l.slug?.toLowerCase().trim()));
        initialRelated.forEach((initRel) => {
          if (!existingSlugs.has(initRel.slug?.toLowerCase().trim()) && initRel.slug !== normalized) {
            list.push(initRel);
          }
        });
        if (list.length > 0) {
          setRelatedArticles(list.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching article from Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleFromFirestore();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#172228] font-sans">
        <Header />
        <div className="flex-1 max-w-[1400px] mx-auto px-4 py-32 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#0a2766] mb-4" />
          <p className="font-semibold text-lg text-[#0a2766]">Loading Article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172228] font-sans">
      <Header />

      {/* Back to Journal Link */}
      <div className="w-full max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-3">
        <div className="flex items-center gap-4">
          <Link
            href="/blogs"
            onClick={() => { try { sessionStorage.setItem("xcel_scroll_to_blogs", "true"); } catch (e) {} }}
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-gray-500 hover:text-[#0a2766] transition-colors group shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-gray-500 group-hover:text-[#3b5b95]" />
            <span>BACK TO THE JOURNAL</span>
          </Link>
          <div className="h-[1px] bg-gray-200 flex-1" />
        </div>
      </div>

      {/* Hero Banner: 1:1 on Mobile, 8:3 on Desktop */}
      <div className="w-full max-w-[1580px] mx-auto px-3 sm:px-6 lg:px-8 pb-4 sm:pb-6">
        <section className="relative w-full aspect-square sm:aspect-[8/3] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-gray-200 shadow-sm bg-gray-100">
          {/* Desktop Banner (8:3) */}
          <div className="hidden sm:block absolute inset-0">
            <Image
              src={article.bannerSrc || article.imageSrc || "/blog1/Blog 1- 1600 x 600.svg"}
              alt={article.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 1580px) 100vw, 1580px"
              className="object-cover object-center"
            />
          </div>

          {/* Mobile Banner (1:1) */}
          <div className="block sm:hidden absolute inset-0">
            <Image
              src={article.imageSrc || "/blog1/Blog 1- 1080 x 1080.svg"}
              alt={article.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover object-center"
            />
          </div>
        </section>
      </div>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-24 pt-6 sm:pt-8">
        {/* =========================================================================
            EDITORIAL TWO-COLUMN LAYOUT
            Left: "The Short Version" Box, Sticky Consultation CTA Card
            Right: Main Article Editorial Content
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start border-b border-gray-200 pb-20 mb-20">
          {/* ---------------------------------------------------------------------
              LEFT COLUMN: SIDEBAR (Sticky on Desktop)
              --------------------------------------------------------------------- */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-8 order-2 lg:order-1">
            {/* "The Short Version" Summary Box */}
            {article.shortVersion && article.shortVersion.length > 0 && (
              <div className="bg-[#f8f9fa] border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs">
                <h2 className="text-[14px] font-bold tracking-wider text-[#0a2766] uppercase mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3b5b95]" />
                  The short version
                </h2>
                <ul className="space-y-3.5">
                  {article.shortVersion.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-[14px] leading-[1.6] text-gray-700"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3b5b95] mt-2 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sticky Consultation CTA Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm">
              <div className="flex flex-wrap items-center gap-1.5 text-amber-500 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#0a2766] ml-1">5.0</span>
                <span className="text-xs text-gray-500">
                  (8,000+ Active Installations Across India)
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#0a2766] mb-2.5">
                Plan Your Laundry With XCEL
              </h3>

              <div className="text-[14px] leading-[1.65] text-gray-600 mb-5 space-y-2">
                <p>
                  Not sure which machines you need or what capacity is right for your laundry?
                </p>
                <p>
                  Tell us about your laundry requirements and our team will help you choose the right machines and plan your setup.
                </p>
              </div>

              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0a2766] text-white hover:bg-[#3b5b95] font-semibold text-sm py-3 px-5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Request Free Consultation</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </aside>

          {/* ---------------------------------------------------------------------
              RIGHT COLUMN: MAIN ARTICLE EDITORIAL CONTENT
              --------------------------------------------------------------------- */}
          <article className="lg:col-span-8 order-1 lg:order-2 space-y-10 sm:space-y-12">
            {/* Article Heading & Metadata */}
            <div className="border-b border-gray-200 pb-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#3b5b95]/10 text-[#3b5b95] text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-md border border-[#3b5b95]/20">
                  {article.category}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm font-medium text-gray-500">{article.date}</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm font-medium text-gray-500">{article.readTime}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.18] tracking-tight text-[#0a2766]">
                {article.title}
              </h1>

              {article.lead && (
                <p className="text-lg lg:text-[1.15rem] leading-[1.65] text-gray-600 font-normal">
                  {article.lead}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-2 text-sm text-gray-500">
                <span className="font-bold text-[#0a2766]">Published by {article.author}</span>
                {article.authorRole && (
                  <>
                    <span className="text-gray-400">—</span>
                    <span>{article.authorRole}</span>
                  </>
                )}
              </div>
            </div>

            {/* Sections / Rich Editorial Body */}
            {article.description ? (
              <div
                className="xcel-prose space-y-6"
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            ) : (
              article.sections &&
              article.sections.map((section, idx) => (
                <section key={idx} className="space-y-5">
                  {/* Section Subhead */}
                  {section.heading && (
                    <h2 className="text-2xl sm:text-[1.85rem] font-bold leading-[1.28] tracking-tight text-[#0a2766]">
                      {section.heading}
                    </h2>
                  )}

                  {/* Section Paragraphs */}
                  {section.paragraphs && (
                    <div className="space-y-4 text-[16.5px] sm:text-[17px] leading-[1.8] text-gray-700 font-normal">
                      {section.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  )}

                  {/* Section Bullets (if any) */}
                  {section.bullets && section.bullets.length > 0 && (
                    <div className="bg-[#f8f9fa] rounded-2xl p-6 sm:p-7 border border-gray-200/80 my-6 space-y-3.5">
                      {section.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#3b5b95] mt-2 shrink-0" />
                          <p className="text-[15.5px] leading-relaxed text-gray-800">
                            <strong className="text-[#0a2766]">{b.title}:</strong> {b.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Table (if any) */}
                  {section.table && (
                    <div className="my-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[#0a2766] text-white">
                              {section.table.headers.map((h, hIdx) => (
                                <th
                                  key={hIdx}
                                  className="py-3.5 px-4 sm:px-5 font-bold text-xs sm:text-sm tracking-wide uppercase text-white"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-150 text-[14px] sm:text-[15px] text-gray-700">
                            {section.table.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx % 2 === 0 ? "bg-white" : "bg-[#f8f9fa]"}
                              >
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`py-3.5 px-4 sm:px-5 ${
                                      cIdx === 0 ? "font-bold text-[#0a2766]" : ""
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {section.table.note && (
                        <div className="p-3.5 bg-gray-50 border-t border-gray-150 text-xs text-gray-500 italic">
                          {section.table.note}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Callout / Pull Quote */}
                  {section.calloutQuote && (
                    <blockquote className="my-7 p-6 sm:p-7 rounded-xl bg-[#3b5b95]/5 border-l-4 border-[#3b5b95] text-[#0a2766] text-[16.5px] sm:text-[17.5px] italic leading-[1.7] font-medium">
                      <p>&ldquo;{section.calloutQuote}&rdquo;</p>
                    </blockquote>
                  )}
                </section>
              ))
            )}

            {/* In-Article High-Conversion Consultation Box */}
            <div className="bg-gradient-to-r from-[#0a2766] to-[#1a3d82] text-white rounded-2xl p-7 sm:p-9 my-12 shadow-md">
              <span className="text-blue-200 text-xs font-bold tracking-widest uppercase block mb-2">
                {article.ctaTagline || "EXPERT FACILITY SIZING & CONSULTATION"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {article.ctaHeading || "Want a Free Project Assessment for Your Facility?"}
              </h3>
              <p className="text-blue-100 text-[15px] leading-relaxed mb-6 max-w-2xl">
                {article.ctaDescription || "Xcel Stiro offers no-obligation project assessments across India — we calculate your exact load volume, recommend the right machine, and show you the ROI calculation before you spend a rupee."}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-[#0a2766] hover:bg-blue-50 font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all duration-200 shadow-md group"
              >
                <span>Contact Us for Free Assessment</span>
                <ChevronRight className="w-5 h-5 text-[#3b5b95] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* "What to do next" Action Steps Card */}
            {article.actionSteps && article.actionSteps.length > 0 && (
              <div className="bg-[#f8f9fa] border border-gray-200 rounded-2xl p-7 sm:p-9 mt-12 shadow-xs">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0a2766] mb-5 flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-[#3b5b95]" />
                  <span>Next Recommended Steps</span>
                </h2>
                <div className="space-y-4">
                  {article.actionSteps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-3.5">
                      <CheckCircle2 className="w-5 h-5 text-[#3b5b95] shrink-0 mt-0.5" />
                      <p className="text-[15.5px] leading-relaxed text-gray-700 font-medium">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Disclaimer Box */}
            {article.disclaimer && (
              <div className="p-6 rounded-xl bg-gray-50 border border-gray-200/80 text-xs sm:text-[13px] leading-relaxed text-gray-500">
                <span className="font-bold text-gray-700">Notice: </span>
                {article.disclaimer}
              </div>
            )}
          </article>
        </div>

        {/* =========================================================================
            BOTTOM SECTION: MORE FROM THE JOURNAL / RELATED ARTICLES
            ========================================================================= */}
        {relatedArticles.length > 0 && (
          <section className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
              <div>
                <span className="text-[0.75rem] font-bold tracking-[0.16em] uppercase text-[#3b5b95] block mb-2">
                  Continue Reading
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a2766]">
                  More from XCEL Journal
                </h2>
              </div>

              <Link
                href="/blogs"
                onClick={() => { try { sessionStorage.setItem("xcel_scroll_to_blogs", "true"); } catch (e) {} }}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0a2766] hover:text-[#3b5b95] transition-colors group"
              >
                <span>View all articles</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {relatedArticles.map((rel) => (
                <article
                  key={rel.id || rel.slug}
                  className="flex flex-col justify-between group cursor-pointer bg-white rounded-2xl p-4 sm:p-5 border border-gray-150 hover:border-[#3b5b95]/40 hover:shadow-xl transition-all duration-300"
                >
                  <div>
                    <Link href={`/blogs/${rel.slug}`} className="block">
                      {/* Image Banner: 1:1 Square */}
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 bg-gray-100 border border-gray-200/60 shadow-xs">
                        <Image
                          src={rel.imageSrc || "/blog1/Blog 1- 1080 x 1080.svg"}
                          alt={rel.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>
                    </Link>

                    {/* Category & Read Time */}
                    <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.14em] uppercase text-[#3b5b95] mb-3">
                      <span className="bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">{rel.category}</span>
                      <span className="text-gray-500 font-semibold">{rel.readTime}</span>
                    </div>

                    {/* Article Title */}
                    <h3 className="text-[1.2rem] sm:text-[1.3rem] font-bold leading-[1.3] text-[#0a2766] mb-3 group-hover:text-[#3b5b95] transition-colors">
                      <Link href={`/blogs/${rel.slug}`}>{rel.title}</Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[14px] text-gray-600 leading-relaxed mb-6 line-clamp-3">
                      {rel.lead}
                    </p>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-[13px] text-gray-500 font-medium">{rel.date}</span>

                    <Link
                      href={`/blogs/${rel.slug}`}
                      className="w-10 h-10 rounded-full border border-gray-200 bg-[#f8f9fa] flex items-center justify-center text-[#0a2766] group-hover:bg-[#3b5b95] group-hover:text-white group-hover:border-[#3b5b95] transition-all duration-200 shadow-xs"
                    >
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
