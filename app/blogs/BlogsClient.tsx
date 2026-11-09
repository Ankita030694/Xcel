"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ArrowUpRight, HelpCircle, PhoneCall, ChevronRight } from "../components/icons";
import { BlogArticle, getActiveBlogCategories } from "@/data/blogs";
import { mergeWithDefaultBlogs } from "@/lib/blogs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// XCEL Industrial Laundry FAQ Section
const LaundryFAQ = () => {
  const faqs = [
    {
      q: "How do I calculate the required capacity for commercial laundry machines?",
      a: "Laundry capacity is calculated by multiplying occupied rooms or beds by the average daily linen requirement (typically 2.5–4.5 kg per room or bed). The total load is assessed against operational shift hours (typically 8 to 10 hours), machine loading ratio (approx. 65%) and wash cycle duration (45–50 minutes) to determine equipment requirements. XCEL provides complimentary laundry layouts planning and capacity planning audits.",
    },
    {
      q: "What equipment are required to set up a commercial laundry?",
      a: "A typical commercial laundry setup includes washer extractors, tumble dryers, hydro extractors and finishing equipment such as flat-work ironers or vacuum ironing tables. The exact combination depends on your laundry volume, garment types, processing requirements and available space. XCEL determines the right capacity and equipment configuration for your setup.",
    },
    {
      q: "How do I choose the right industrial laundry equipment for my business?",
      a: "Consider machine capacity, construction materials, energy and water consumption, heating options, automation, ease of maintenance and after-sales support. It is equally important to evaluate the machine's suitability for your specific application and expected operating requirements.",
    },
    {
      q: "Does XCEL provide nationwide installation, commissioning and servicing for industrial laundry machines?",
      a: "Yes. XCEL offers end-to-end technical assistance, from machine selection to installation and commissioning to operator training, maintenance and troubleshooting. Backed by a PAN India service network, authorised technicians and a massive spares parts inventory, we help customers maintain equipment performance and minimise operational disruptions throughout the machine's service life.",
    },
  ];

  return (
    <section className="w-full bg-[#f8f9fa] border-y border-gray-200 py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[#3b5b95] text-[12px] font-bold tracking-[0.16em] uppercase mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a2766] tracking-tight">
            From Equipment Selection to Laundry Setup
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col justify-start"
            >
              <h3 className="text-lg sm:text-xl font-bold text-[#0a2766] mb-3 leading-snug">
                {faq.q}
              </h3>
              <p className="text-[15px] leading-relaxed text-gray-600">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// XCEL Consultation CTA Section
const LaundryCTA = () => {
  return (
    <section className="w-full bg-gradient-to-r from-[#0a2766] via-[#1a3d82] to-[#3b5b95] text-white py-16 sm:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-blue-200 text-xs sm:text-sm font-bold tracking-widest uppercase mb-4">
            Laundry Planning and Project Consultation
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
            Planning a New Laundry Setup or Expanding an Existing One?
          </h2>
          <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed mb-10 max-w-2xl mx-auto">
            Speak with our expert team for technical recommendations on capacity planning, machinery selection, plant layout and competitive project quotations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-[#0a2766] hover:bg-blue-50 font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PhoneCall className="w-5 h-5 text-[#3b5b95]" />
              <span>Request Free Laundry Consultation</span>
            </Link>
            <Link
              href="/products"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  try {
                    sessionStorage.removeItem('xcel_active_category');
                  } catch (e) {}
                  sessionStorage.setItem('xcel_scroll_to_products', 'true');
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200"
            >
              <span>Explore Machine Catalog</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function BlogsClient({ initialArticles }: { initialArticles: BlogArticle[] }) {
  const [articles, setArticles] = useState<BlogArticle[]>(initialArticles);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const autoScrollTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const forceScrollToTop = () => {
    if (typeof window === "undefined") return;
    try {
      window.scrollTo(0, 0);
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
        document.documentElement.scrollLeft = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
        document.body.scrollLeft = 0;
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (e) {}
  };

  const scrollToBlogsContent = (behavior: ScrollBehavior = "smooth") => {
    if (typeof window === "undefined") return;
    const element = document.getElementById("blogs-content-section");
    if (element) {
      const isMobile = window.innerWidth < 1024;
      const headerOffset = isMobile ? 135 : 145;
      const rect = element.getBoundingClientRect();
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      const elementY = rect.top + currentScrollY;
      const targetY = Math.max(0, Math.round(elementY - headerOffset));

      try {
        window.scrollTo({
          top: targetY,
          behavior,
        });
      } catch (err) {
        window.scrollTo(0, targetY);
      }
    }
  };

  // Only categories that currently have at least one active blog are shown
  const availableCategories = React.useMemo(() => {
    return getActiveBlogCategories(articles);
  }, [articles]);

  useEffect(() => {
    if (typeof window !== "undefined" && availableCategories.length > 0) {
      try {
        sessionStorage.setItem("xcel_blog_categories", JSON.stringify(availableCategories));
      } catch (e) {}
      window.dispatchEvent(
        new CustomEvent("xcel-blog-categories-updated", { detail: availableCategories })
      );
    }
  }, [availableCategories]);

  const filteredArticles = React.useMemo(() => {
    const published = articles.filter((a) => a.status !== "draft");
    if (selectedCategory === "all") return published;
    return published.filter(
      (a) => a.category?.trim().toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [articles, selectedCategory]);

  useEffect(() => {
    if (selectedCategory !== "all") {
      const exists = availableCategories.some(
        (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
      );
      if (!exists) {
        setSelectedCategory("all");
      }
    }
  }, [availableCategories, selectedCategory]);

  useEffect(() => {
    forceScrollToTop();

    const checkAndTriggerAutoScroll = (delay = 200) => {
      const shouldAutoScroll = typeof window !== "undefined" && sessionStorage.getItem("xcel_scroll_to_blogs") === "true";
      if (shouldAutoScroll) {
        setTimeout(() => {
          try {
            sessionStorage.removeItem("xcel_scroll_to_blogs");
          } catch (e) {}
        }, 1000);

        if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
        autoScrollTimerRef.current = setTimeout(() => {
          scrollToBlogsContent("smooth");
        }, delay);
      }
    };

    const syncCategoryFromUrl = () => {
      if (typeof window === "undefined") return;
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get("category");
      if (catParam) {
        setSelectedCategory(catParam);
      }
      checkAndTriggerAutoScroll(100);
    };

    syncCategoryFromUrl();
    checkAndTriggerAutoScroll(200);

    const handleCustomCategoryEvent = (e: any) => {
      if (e?.detail) {
        const cat = typeof e.detail === "string" ? e.detail : e.detail.category;
        const scrollToTop = typeof e.detail === "object" && e.detail.scrollToTop !== undefined
          ? e.detail.scrollToTop
          : true;

        if (cat) {
          setSelectedCategory(cat);
          if (cat !== "all" && autoScrollTimerRef.current) {
            clearTimeout(autoScrollTimerRef.current);
          }
          if (scrollToTop) {
            forceScrollToTop();
          }
        }
      }
    };

    const handleDirectScrollToContent = () => {
      if (autoScrollTimerRef.current) {
        clearTimeout(autoScrollTimerRef.current);
      }
      autoScrollTimerRef.current = setTimeout(() => {
        scrollToBlogsContent("smooth");
      }, 30);
    };

    const handleTriggerAutoScroll = () => {
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
      autoScrollTimerRef.current = setTimeout(() => {
        scrollToBlogsContent("smooth");
      }, 30);
    };

    window.addEventListener("select-blog-category", handleCustomCategoryEvent);
    window.addEventListener("trigger-blogs-autoscroll", handleTriggerAutoScroll);
    window.addEventListener("scroll-to-blogs-content-direct", handleDirectScrollToContent);
    window.addEventListener("popstate", syncCategoryFromUrl);
    return () => {
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
      window.removeEventListener("select-blog-category", handleCustomCategoryEvent);
      window.removeEventListener("trigger-blogs-autoscroll", handleTriggerAutoScroll);
      window.removeEventListener("scroll-to-blogs-content-direct", handleDirectScrollToContent);
      window.removeEventListener("popstate", syncCategoryFromUrl);
    };
  }, []);

  useEffect(() => {
    // 1. Immediately hydrate from client session cache if available to prevent network delay jumps
    try {
      const cached = sessionStorage.getItem("xcel_cached_blogs");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArticles((prev) => {
            if (
              prev.length === parsed.length &&
              prev.every(
                (p, i) =>
                  p.slug === parsed[i].slug &&
                  p.imageSrc === parsed[i].imageSrc &&
                  p.title === parsed[i].title &&
                  p.date === parsed[i].date
              )
            ) {
              return prev;
            }
            return parsed;
          });
        }
      }
    } catch (e) {}

    const loadDynamicBlogs = async () => {
      try {
        const [snap, deletedSnap] = await Promise.all([
          getDocs(collection(db, "blogs")),
          getDocs(collection(db, "deleted_blogs")).catch(() => null),
        ]);

        const deletedSlugs = new Set<string>();
        if (deletedSnap && !deletedSnap.empty) {
          deletedSnap.forEach((d: any) => {
            const data = d.data();
            if (data.slug) deletedSlugs.add(data.slug.toLowerCase().trim());
            if (data.id) deletedSlugs.add(data.id.toLowerCase().trim());
            deletedSlugs.add(d.id.toLowerCase().trim());
          });
        }

        const dynamicList: any[] = [];
        if (!snap.empty) {
          snap.forEach((docSnap: any) => {
            dynamicList.push({ id: docSnap.id, ...docSnap.data() });
          });
        }

        // Merge dynamic Firestore articles with all default articles (excluding deleted ones)
        const merged = mergeWithDefaultBlogs(dynamicList, deletedSlugs);
        // Exclude drafts from the public blogs page
        const finalArticles = merged.filter((a) => a.status !== "draft");

        finalArticles.sort((a, b) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
          return tB - tA;
        });

        // Only update state if articles actually changed to prevent image flickering and redundant re-renders
        setArticles((prev) => {
          if (
            prev.length === finalArticles.length &&
            prev.every(
              (p, i) =>
                p.slug === finalArticles[i].slug &&
                p.imageSrc === finalArticles[i].imageSrc &&
                p.title === finalArticles[i].title &&
                p.date === finalArticles[i].date
            )
          ) {
            return prev;
          }
          return finalArticles;
        });

        try {
          sessionStorage.setItem("xcel_cached_blogs", JSON.stringify(finalArticles));
        } catch (e) {}

        // Notify Footer and other components with updated articles
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("xcel-blogs-updated", { detail: finalArticles })
          );
        }
      } catch (err) {
        console.error("Error fetching dynamic blogs from Firestore, retaining initial articles:", err);
      }
    };

    loadDynamicBlogs();
  }, [initialArticles]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172228] font-sans">
      <Header />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 lg:pt-16 pb-20">
        {/* =========================================================================
            CENTERED HERO HEADER: Pill, Heading, Subheading (XCEL Brand Theme)
            ========================================================================= */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-10">
          {/* Pill in Centre */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#3b5b95]/10 text-[#3b5b95] border border-[#3b5b95]/20 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] xs:text-[11px] sm:text-[12px] font-bold tracking-[0.04em] sm:tracking-[0.14em] uppercase mb-4 sm:mb-5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#3b5b95] animate-pulse shrink-0" />
            <span>XCEL Technical Journal & Industry Insights</span>
          </div>

          {/* Main Heading in Centre */}
          <h1 className="text-[1.5rem] sm:text-[2.25rem] lg:text-[2.8rem] font-bold leading-[1.15] tracking-tight text-[#0a2766] mb-4 sm:mb-5">
            Industrial & Commercial Laundry: Guidance, Technology & Expertise
          </h1>

          {/* Subheading in Centre */}
          <p className="text-[1.05rem] sm:text-[1.15rem] leading-[1.65] text-[#4b5563] font-normal max-w-2xl mx-auto">
            Discover <span className="font-bold text-[#0A2766]">practical resources, emerging trends and industry developments</span> that shape the <span className="font-bold text-[#0A2766]">future of laundry operations</span>, from India's trusted laundry machine manufacturer.
          </p>
        </div>

        {/* =========================================================================
            CATEGORY FILTER TABS & ARTICLES CONTAINER
            ========================================================================= */}
        <div id="blogs-content-section" className="w-full scroll-mt-[135px] lg:scroll-mt-[145px]">
        {availableCategories.length > 0 && (
          <div className="w-full mb-8 lg:mb-12">
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-0 sm:px-2 pb-4">
            {/* "ALL" Tab */}
            <div className="flex items-center">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 sm:px-4 lg:px-5 xl:px-6 py-2 sm:py-2.5 lg:py-3 text-[12px] sm:text-[14px] lg:text-[15px] xl:text-[16px] font-bold uppercase tracking-normal lg:tracking-wider transition-all rounded-md cursor-pointer ${
                  selectedCategory === "all"
                    ? "text-white bg-[#0a2766]"
                    : "text-[#363636] hover:text-gray-800 border border-gray-200 shadow-sm bg-white"
                }`}
              >
                ALL
              </button>
            </div>

            {/* Category Tabs */}
            {availableCategories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <div key={cat} className="flex items-center">
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 sm:px-4 lg:px-5 xl:px-6 py-2 sm:py-2.5 lg:py-3 text-[12px] sm:text-[14px] lg:text-[15px] xl:text-[16px] font-bold uppercase tracking-normal lg:tracking-wider transition-all rounded-md cursor-pointer ${
                      isActive
                        ? "text-white bg-[#0a2766]"
                        : "text-[#363636] hover:text-gray-800 border border-gray-200 shadow-sm bg-white"
                    }`}
                  >
                    {cat}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        )}
        {/* =========================================================================
            CARDS GRID: 3-column layout matching reference structure
            ========================================================================= */}
        {filteredArticles.length === 0 ? (
          <div className="w-full text-center py-16 px-4 bg-gray-50 rounded-2xl border border-gray-200 my-8">
            <p className="text-gray-600 text-base mb-4 font-medium">
              {articles.length === 0
                ? "No articles published yet."
                : "No articles found in this category."}
            </p>
            {articles.length > 0 && selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="px-5 py-2.5 bg-[#0a2766] text-white text-sm font-bold rounded-xl hover:bg-[#071b4a] transition-all cursor-pointer shadow-sm"
              >
                View All Articles
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredArticles.map((article, idx) => (
            <article
              key={article.slug}
              className="flex flex-col justify-between group cursor-pointer bg-white rounded-2xl p-4 sm:p-5 border border-gray-150 hover:border-[#3b5b95]/40 hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Image Banner (1:1 Square) */}
                <Link href={`/blogs/${article.slug}`} className="block">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 bg-gray-100 border border-gray-200/60 shadow-xs">
                    <img
                      src={article.imageSrc || "/blog1/Blog 1- 1080 x 1080.svg"}
                      alt={article.title}
                      loading={idx < 6 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out block"
                    />
                  </div>
                </Link>

                {/* Category & Read Time Row */}
                <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.14em] uppercase text-[#3b5b95] mb-3">
                  <span className="bg-[#3b5b95]/10 px-2.5 py-1 rounded-md">{article.category}</span>
                  <span className="text-gray-500 font-semibold">{article.readTime}</span>
                </div>

                {/* Article Title */}
                <h2 className="text-[1.25rem] sm:text-[1.38rem] font-bold leading-[1.3] text-[#0a2766] mb-3 group-hover:text-[#3b5b95] transition-colors">
                  <Link href={`/blogs/${article.slug}`} className="hover:underline">
                    {article.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-[14px] text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {article.lead}
                </p>
              </div>

              {/* Bottom Row: Date & Arrow Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <span className="text-[13px] text-gray-500 font-medium">
                  {article.date}
                </span>

                <Link
                  href={`/blogs/${article.slug}`}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-[#f8f9fa] flex items-center justify-center text-[#0a2766] group-hover:bg-[#3b5b95] group-hover:text-white group-hover:border-[#3b5b95] transition-all duration-200 shadow-xs"
                >
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        )}
        </div>
      </main>

      {/* FAQ Section */}
      <LaundryFAQ />

      {/* CTA Section */}
      <LaundryCTA />

      <Footer />
    </div>
  );
}
