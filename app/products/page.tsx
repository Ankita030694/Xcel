"use client";
import React, { useEffect, useState, useRef, startTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Home, ChevronRight } from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const categories = [
  { id: 'washing', title: 'Washing', icon: '/New Icons/1.webp' },
  { id: 'drying', title: 'Drying', icon: '/New Icons/2.webp' },
  { id: 'apparel-processing', title: 'Apparel Processing', icon: '/New Icons/3.webp' },
  { id: 'dry-cleaning', title: 'Dry-Cleaning', icon: '/New Icons/4.webp' },
  { id: 'flat-work', title: 'Flat-Work', icon: '/New Icons/5.webp' },
  { id: 'steam-finishing', title: 'Steam-Finishing', icon: '/New Icons/6.webp' },
  { id: 'water-heater', title: 'Water Heater', icon: '/New Icons/7.webp' },
  { id: 'fabric-checking', title: 'Fabric Checking', icon: '/New Icons/8.webp' },
  { id: 'other-equipment', title: 'Other Equipment', icon: '/New Icons/9.webp' },
  { id: 'complete-range', title: 'Complete Range', icon: '/New Icons/10.webp' }
];

const FALLBACK_PRODUCTS: Record<string, any[]> = {
  'washing': [
    { id: 'fallback-1', name: 'Washer Extractors', imageUrl: '/prod.final/Washing 1.png', categoryId: 'washing', subheading: 'Built for heavy loads. Engineered for excellence.' },
    { id: 'fallback-2', name: 'Front Loading Washing Machines', imageUrl: '/prod.png/Washing Front 60 kg Left View 1.png', categoryId: 'washing', subheading: 'Built for heavy loads. Engineered for excellence.' }
  ],
  'drying': [
    { id: 'fallback-3', name: 'Drying Tumblers', imageUrl: '/prod.final/Drying 1.png', categoryId: 'drying', subheading: 'Built for heavy loads. Engineered for excellence.' }
  ],
  'apparel-processing': [
    { id: 'fallback-4', name: 'Apparel Washing Machines', imageUrl: '/prod.final/Apparel Washing 1.png', categoryId: 'apparel-processing', subheading: 'Built for heavy loads. Engineered for excellence.' }
  ],
  'dry-cleaning': [
    { id: 'fallback-5', name: 'Perc Dry Cleaning Machines', imageUrl: '/prod.final/Dry-Cleaning 1.png', categoryId: 'dry-cleaning', subheading: 'Built for heavy loads. Engineered for excellence.' }
  ],
  'flat-work': [
    { id: 'fallback-6', name: 'Flat Work Ironers', imageUrl: '/prod.final/Flat-Work 1.png', categoryId: 'flat-work', subheading: 'Built for heavy loads. Engineered for excellence.' }
  ],
  'steam-finishing': [
    { id: 'fallback-7', name: 'Steam Finishing Equipment', imageUrl: '/prod.final/Steam-Finishing 1.png', categoryId: 'steam-finishing', subheading: 'Built for heavy loads. Engineered for excellence.' }
  ],
  'water-heater': [
    { id: 'fallback-8', name: 'Industrial Water Heaters', imageUrl: '/prod.final/Water Heater 1.png', categoryId: 'water-heater', subheading: 'Built for heavy loads. Engineered for excellence.' }
  ],
  'fabric-checking': [
    { id: 'fallback-9', name: 'Fabric Checking Machines', imageUrl: '/prod.final/Fabric Checking 1.png', categoryId: 'fabric-checking', subheading: 'Built for heavy loads. Engineered for excellence.' }
  ],
  'other-equipment': [
    { id: 'fallback-10', name: 'Ancillary Equipment', imageUrl: '/prod.final/Other Equipment 1.png', categoryId: 'other-equipment', subheading: 'Built for heavy loads. Engineered for excellence.' }
  ],
  'complete-range': [
    { id: 'fallback-11', name: 'Complete Laundry Setup', imageUrl: '/prod.final/Complete Range 1.png', categoryId: 'complete-range', subheading: 'Built for heavy loads. Engineered for excellence.' }
  ]
};

export default function ProductsPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>('washing');
  const [lockedMinHeight, setLockedMinHeight] = useState<number | null>(null);
  const productsSectionRef = useRef<HTMLElement | null>(null);
  const unlockTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Category sequence for Complete Range (configurable by Admin)
  const [categoryOrder, setCategoryOrder] = useState<string[]>([
    'washing',
    'drying',
    'apparel-processing',
    'dry-cleaning',
    'flat-work',
    'steam-finishing',
    'water-heater',
    'fabric-checking',
    'other-equipment'
  ]);

  useEffect(() => {
    // Restore cached data post-hydration
    try {
      const stored = sessionStorage.getItem('xcel_all_products');
      if (stored) {
        setProducts(JSON.parse(stored));
      }
      const storedOrder = sessionStorage.getItem('xcel_category_order');
      if (storedOrder) {
        setCategoryOrder(JSON.parse(storedOrder));
      }
    } catch (e) {}

    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts: any[] = [];
        querySnapshot.forEach((doc: any) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by order ascending, then by creation date descending
        fetchedProducts.sort((a, b) => {
          const orderA = typeof a.order === 'number' ? a.order : 9999;
          const orderB = typeof b.order === 'number' ? b.order : 9999;
          if (orderA !== orderB) return orderA - orderB;
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        // Also fetch category display sequence for Complete Range
        try {
          const orderDoc = await getDoc(doc(db, "settings", "categoryOrder"));
          if (orderDoc.exists()) {
            const data = orderDoc.data();
            if (Array.isArray(data?.order) && data.order.length > 0) {
              setCategoryOrder(data.order);
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('xcel_category_order', JSON.stringify(data.order));
              }
            }
          }
        } catch (orderErr) {
          console.warn("Could not load category order from settings:", orderErr);
        }

        // Pre-cache products in sessionStorage for instant flicker-free navigation to product detail page
        try {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('xcel_all_products', JSON.stringify(fetchedProducts));
            Object.values(FALLBACK_PRODUCTS).flat().forEach((p) => {
              sessionStorage.setItem(`xcel_prod_${p.id}`, JSON.stringify(p));
            });
            fetchedProducts.forEach((p) => {
              sessionStorage.setItem(`xcel_prod_${p.id}`, JSON.stringify(p));
              if (p.slug) {
                sessionStorage.setItem(`xcel_prod_${p.slug}`, JSON.stringify(p));
              }
            });
          }
        } catch (e) {}
        
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToCategoryHeader = (behavior: ScrollBehavior = 'smooth') => {
    const element = document.getElementById('category-header') || document.getElementById('products-section');
    if (element) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      const headerOffset = isMobile ? 155 : 165;
      const rect = element.getBoundingClientRect();
      const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const elementY = rect.top + currentScrollY;
      const targetY = Math.max(0, Math.round(elementY - headerOffset));

      window.scrollTo({
        top: targetY,
        behavior
      });
    }
  };

  const scrollToProductsHeading = (behavior: ScrollBehavior = 'smooth') => {
    const element = document.getElementById('products-heading') || document.getElementById('products-section');
    if (element) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      const headerOffset = isMobile ? 130 : 140;
      const rect = element.getBoundingClientRect();
      const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const elementY = rect.top + currentScrollY;
      const targetY = Math.max(0, Math.round(elementY - headerOffset));

      window.scrollTo({
        top: targetY,
        behavior
      });
    }
  };

  const handleCategorySelect = (targetId: string, shouldScroll: boolean = true) => {
    if (targetId && categories.some(c => c.id === targetId)) {
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('xcel_active_category', targetId);
          const newUrl = `/products?category=${targetId}#${targetId}`;
          window.history.replaceState(window.history.state, '', newUrl);
        } catch (e) {}

        const currentScrollY = window.scrollY || window.pageYOffset || 0;
        // If user is scrolled down towards footer, lock section height temporarily
        // so switching categories does not collapse DOM height and clamp scroll position
        if (currentScrollY > 600 && productsSectionRef.current) {
          const currentHeight = productsSectionRef.current.offsetHeight;
          if (currentHeight > 0) {
            setLockedMinHeight(currentHeight);
            if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
            unlockTimerRef.current = setTimeout(() => {
              setLockedMinHeight(null);
            }, 900);
          }
        }
      }

      startTransition(() => {
        setActiveTab(targetId);
      });

      if (shouldScroll) {
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = setTimeout(() => {
          scrollToCategoryHeader('smooth');
        }, 10);
      }
    }
  };

  useEffect(() => {
    // 1. Ensure page starts at top so hero banner is visible first
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }

    const syncCategoryFromUrlOrStorage = () => {
      const hash = window.location.hash ? window.location.hash.substring(1) : '';
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category') || '';
      const targetId = hash || categoryParam;
      if (targetId && categories.some(c => c.id === targetId)) {
        setActiveTab(targetId);
        try {
          sessionStorage.setItem('xcel_active_category', targetId);
        } catch (e) {}
      } else {
        setActiveTab('washing');
        try {
          sessionStorage.removeItem('xcel_active_category');
        } catch (e) {}
      }
    };

    const handleCustomCategoryEvent = (e: any) => {
      if (e?.detail) {
        const categoryId = typeof e.detail === 'string' ? e.detail : e.detail.categoryId;
        const shouldScroll = typeof e.detail === 'object' && e.detail.shouldScroll !== undefined ? e.detail.shouldScroll : true;
        if (categoryId) {
          handleCategorySelect(categoryId, shouldScroll);
        }
      }
    };

    syncCategoryFromUrlOrStorage();

    // Auto-scroll on initial visit / navigation:
    let autoScrollTimer: NodeJS.Timeout | null = null;
    const shouldScrollToProducts = typeof window !== 'undefined' && sessionStorage.getItem('xcel_scroll_to_products') === 'true';
    if (shouldScrollToProducts) {
      setTimeout(() => {
        try {
          sessionStorage.removeItem('xcel_scroll_to_products');
        } catch (e) {}
      }, 1000);

      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      autoScrollTimer = setTimeout(() => {
        scrollToProductsHeading('smooth');
      }, 150);
    } else {
      // Auto-scroll to the category header and products ONLY when navigating with a specific category
      // (e.g. category card click, engineering excellence, or ?category= / #category)
      const hasSpecificCategory = typeof window !== 'undefined' && (
        Boolean(window.location.hash && window.location.hash.substring(1)) ||
        Boolean(new URLSearchParams(window.location.search).get('category'))
      );

      if (hasSpecificCategory) {
        autoScrollTimer = setTimeout(() => {
          if (typeof window !== 'undefined') {
            scrollToCategoryHeader('smooth');
          }
        }, 450);
      }
    }

    const handleScrollToProductsHeading = () => {
      setActiveTab('washing');
      try {
        sessionStorage.removeItem('xcel_active_category');
      } catch (e) {}
      if (autoScrollTimer) clearTimeout(autoScrollTimer);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        scrollToProductsHeading('smooth');
      }, 10);
    };

    const onPopOrHash = () => {
      syncCategoryFromUrlOrStorage();
      const hasSpecificCategory = typeof window !== 'undefined' && (
        Boolean(window.location.hash && window.location.hash.substring(1)) ||
        Boolean(new URLSearchParams(window.location.search).get('category'))
      );
      if (hasSpecificCategory) {
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = setTimeout(() => {
          scrollToCategoryHeader('smooth');
        }, 80);
      }
    };

    window.addEventListener('hashchange', onPopOrHash);
    window.addEventListener('popstate', onPopOrHash);
    window.addEventListener('select-product-category', handleCustomCategoryEvent);
    window.addEventListener('scroll-to-products-heading', handleScrollToProductsHeading);
    return () => {
      if (autoScrollTimer) clearTimeout(autoScrollTimer);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
      window.removeEventListener('hashchange', onPopOrHash);
      window.removeEventListener('popstate', onPopOrHash);
      window.removeEventListener('select-product-category', handleCustomCategoryEvent);
      window.removeEventListener('scroll-to-products-heading', handleScrollToProductsHeading);
    };
  }, []);

  useEffect(() => {
    const hash = typeof window !== 'undefined' && window.location.hash ? window.location.hash.substring(1) : '';
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const categoryParam = urlParams.get('category') || '';
    const targetId = hash || categoryParam;
    const isGenericProductsNav = typeof window !== 'undefined' && sessionStorage.getItem('xcel_scroll_to_products') === 'true';

    if (targetId && categories.some(c => c.id === targetId)) {
      setActiveTab(targetId);
      if (!isGenericProductsNav) {
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = setTimeout(() => {
          scrollToCategoryHeader('smooth');
        }, 100);
      }
    } else {
      setActiveTab('washing');
      try {
        sessionStorage.removeItem('xcel_active_category');
      } catch (e) {}
    }
  }, [pathname]);

  const isCompleteRange = activeTab === 'complete-range';
  const activeCategory = categories.find(c => c.id === activeTab) || categories[0];
  
  let activeCategoryProducts: any[] = [];
  if (isCompleteRange) {
    const catOrder = categoryOrder.length > 0 
      ? categoryOrder 
      : categories.map(c => c.id).filter(id => id !== 'complete-range');

    if (products.length > 0) {
      activeCategoryProducts = [...products].sort((a, b) => {
        const orderA = catOrder.indexOf(a.categoryId);
        const orderB = catOrder.indexOf(b.categoryId);
        const effectiveOrderA = orderA === -1 ? 999 : orderA;
        const effectiveOrderB = orderB === -1 ? 999 : orderB;
        if (effectiveOrderA !== effectiveOrderB) {
          return effectiveOrderA - effectiveOrderB;
        }
        const pOrderA = typeof a.order === 'number' ? a.order : 9999;
        const pOrderB = typeof b.order === 'number' ? b.order : 9999;
        if (pOrderA !== pOrderB) return pOrderA - pOrderB;
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
    } else {
      const fallbackEntries = Object.entries(FALLBACK_PRODUCTS).filter(([catId]) => catId !== 'complete-range');
      fallbackEntries.sort(([catA], [catB]) => {
        const idxA = catOrder.indexOf(catA);
        const idxB = catOrder.indexOf(catB);
        return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
      });
      activeCategoryProducts = fallbackEntries.flatMap(([_, list]) => list);
    }
  } else {
    activeCategoryProducts = products.filter(p => p.categoryId === activeCategory.id);
    if (activeCategoryProducts.length === 0) {
      activeCategoryProducts = FALLBACK_PRODUCTS[activeCategory.id] || [];
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      {/* Hero Banner Section */}
      <section className="w-full bg-[#f3f5f8]">
         <img 
           src="/banners/product-overview-banner.webp" 
           alt="Product Overview - From Washing To Finishing" 
           className="w-full h-auto block"
           style={{ aspectRatio: '1600/600' }}
           loading="eager"
           fetchPriority="high"
           decoding="async"
         />
      </section>

      {/* Products Content */}
      <section 
        id="products-section" 
        ref={productsSectionRef}
        style={{ minHeight: lockedMinHeight ? `${lockedMinHeight}px` : undefined }}
        className="flex-1 min-h-[75vh] max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 lg:pt-8 lg:pb-24 flex flex-col items-center scroll-mt-[100px]"
      >
        
        {/* Breadcrumb Navigation */}
        <div className="w-full flex flex-row items-center gap-2 sm:gap-3 text-[12px] sm:text-[13px] text-[#363636] mb-6 sm:mb-8 overflow-x-auto scrollbar-hide whitespace-nowrap self-start">
          <Link href="/" className="text-[#363636] hover:text-[#0a2766] transition-colors flex items-center shrink-0" title="Home">
            <Home size={13} className="sm:w-[14px] sm:h-[14px]" strokeWidth={1.5} />
          </Link>
          <ChevronRight size={13} strokeWidth={1.5} className="text-gray-400 shrink-0" />
          <Link href="/" className="hover:text-[#0a2766] transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight size={13} strokeWidth={1.5} className="text-gray-400 shrink-0" />
          <span className="text-[#0a2766] font-semibold shrink-0">
            Products
          </span>
        </div>

        {/* Header Texts */}
        <div id="products-heading" className="flex flex-col items-center text-center mb-10 w-full scroll-mt-[130px] lg:scroll-mt-[140px]">
          <h4 className="flex items-center justify-center gap-2 text-[#3b5b95] font-bold text-[11px] md:text-[10px] lg:text-sm tracking-[0.2em] uppercase mb-4">
            <span className="animate-pulse">{"//"}</span> OUR PRODUCT CATEGORIES
          </h4>
          <h2 className="text-[13px] sm:text-[21px] lg:text-[27px] font-bold text-[#0a2766] font-serif mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Complete Solutions for Every Laundry Need
          </h2>
          <div className="w-16 h-[2px] bg-[#3b5b95]"></div>
        </div>

        {/* Tab Navigation */}
        <div className="w-full mb-8 lg:mb-12">
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 lg:border-b lg:border-gray-200 px-0 sm:px-2 pb-4">
            {categories.map((cat, index) => {
              const isActive = activeTab === cat.id;
              return (
                <div key={cat.id} className="flex items-center">
                  <button
                    onClick={() => handleCategorySelect(cat.id, true)}
                    className={`px-3 sm:px-4 lg:px-5 xl:px-6 py-2 sm:py-2.5 lg:py-3 text-[12px] sm:text-[14px] lg:text-[15px] xl:text-[16px] font-bold uppercase tracking-normal lg:tracking-wider transition-all rounded-md ${
                      isActive 
                        ? 'text-white bg-[#0a2766]' 
                        : 'text-[#363636] hover:text-gray-800 border border-gray-200 shadow-sm'
                    }`}
                  >
                    {cat.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Header */}
        <div id="category-header" className="w-full flex justify-start items-center mb-6 scroll-mt-[155px] lg:scroll-mt-[165px]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 lg:h-6 bg-[#3b5b95]"></div>
            <h2 className="text-[#0a2766] font-bold text-[16px] lg:text-[22px] uppercase tracking-wide">
              {activeCategory.title}
            </h2>
          </div>
        </div>

        {/* Product Carousel (Mobile) / Grid (Desktop) */}
        {loading && activeCategoryProducts.length === 0 ? (
          <div className="w-full text-center py-12 text-gray-500">Loading products...</div>
        ) : activeCategoryProducts.length === 0 ? (
          <div className="w-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
            No products available in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 xl:gap-8 w-full pb-8">
            {activeCategoryProducts.map((product) => {
              const productUrl = `/product/${product.slug || product.id}`;
              return (
                <Link 
                  href={productUrl} 
                  scroll={true}
                  key={product.id} 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
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
                      } catch (err) {}
                    }
                    try {
                      sessionStorage.setItem(`xcel_prod_${product.id}`, JSON.stringify(product));
                      if (product.slug) {
                        sessionStorage.setItem(`xcel_prod_${product.slug}`, JSON.stringify(product));
                      }
                    } catch (e) {}
                  }}
                  onMouseEnter={() => {
                    try {
                      sessionStorage.setItem(`xcel_prod_${product.id}`, JSON.stringify(product));
                      if (product.slug) {
                        sessionStorage.setItem(`xcel_prod_${product.slug}`, JSON.stringify(product));
                      }
                    } catch (e) {}
                  }}
                  className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-row xl:flex-col group cursor-pointer h-[180px] sm:h-[195px] md:h-[215px] xl:h-full"
                >
                
                {/* Product Image */}
                <div className="w-[42%] sm:w-[44%] md:w-[45%] xl:w-full h-full xl:h-[260px] bg-[#f8f9fa] xl:bg-white p-3 sm:p-4 md:p-5 xl:p-6 relative flex items-center justify-center flex-shrink-0 xl:border-b xl:border-gray-50">
                  <img 
                    src={product.imageUrl || '/placeholder.png'} 
                    alt={product.name} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain mix-blend-multiply xl:mix-blend-normal" 
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-1 p-3.5 sm:p-4 md:p-5 xl:p-6 text-left justify-between">
                  <div>
                    {isCompleteRange && (
                      <span className="inline-block text-[10px] sm:text-[11px] font-bold text-[#0a2766] uppercase bg-[#eaf0ff] px-2 py-0.5 rounded-full w-fit mb-1.5 tracking-wider">
                        {categories.find(c => c.id === product.categoryId)?.title || product.categoryId}
                      </span>
                    )}
                    <h3 className="text-[12px] sm:text-[13px] md:text-[15px] font-extrabold text-[#0a2766] uppercase mb-1.5 leading-snug">
                      {product.name}
                    </h3>
                    {product.subheading && (
                      <p className="text-[11px] sm:text-[12px] md:text-[13px] text-[#4b5563] font-normal leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {product.subheading}
                      </p>
                    )}
                  </div>
                  
                  {/* Arrow Button */}
                  <div className="w-full flex justify-end mt-auto pt-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border border-[#3b5b95] flex items-center justify-center text-[#3b5b95] group-hover:bg-[#3b5b95] group-hover:text-white transition-colors">
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>

              </Link>
              );
            })}
          </div>
        )}

      </section>

      <Footer />
    </div>
  );
}
