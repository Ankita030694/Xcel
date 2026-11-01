"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Send, Download, Headset, Phone, Settings, ShieldCheck, Factory, HelpCircle, Home, ArrowLeft, ArrowRight } from 'lucide-react';

const CATEGORY_NAMES: Record<string, string> = {
  'washing': 'Washing',
  'drying': 'Drying',
  'apparel-processing': 'Apparel Processing',
  'dry-cleaning': 'Dry-Cleaning',
  'flat-work': 'Flat-Work',
  'steam-finishing': 'Steam-Finishing',
  'water-heater': 'Water Heater',
  'fabric-checking': 'Fabric Checking',
  'other-equipment': 'Other Equipment',
  'complete-range': 'Complete Range'
};

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

const FAQList = ({ faqs }: { faqs: { question: string; answer: string }[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return <p className="text-gray-500">No FAQs available for this product.</p>;

  return (
    <div className="flex flex-col gap-3 w-full">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ease-out ${
              isOpen 
                ? 'border-[#0a2766]/25 shadow-[0_4px_16px_rgba(10,39,102,0.06)] bg-[#fafcff]' 
                : 'border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-gray-200'
            }`}
          >
            <button 
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none cursor-pointer transition-colors duration-200"
              aria-expanded={isOpen}
            >
              <div className="flex items-start gap-3 sm:gap-4 w-full pr-3">
                <span className={`font-bold text-[15px] sm:text-[16px] shrink-0 transition-colors duration-200 ${
                  isOpen ? 'text-[#0a2766]' : 'text-[#0a2766]/80'
                }`}>
                  Q{index + 1}.
                </span>
                <span className={`font-bold text-[15px] sm:text-[16px] leading-snug transition-colors duration-200 ${
                  isOpen ? 'text-[#0a2766]' : 'text-gray-800'
                }`}>
                  {faq.question}
                </span>
              </div>
              <div className="shrink-0 text-[#0a2766] ml-2">
                <ChevronDown 
                  size={20} 
                  strokeWidth={2} 
                  className={`transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? 'rotate-180 text-[#0a2766]' : 'rotate-0 text-gray-400'
                  }`} 
                />
              </div>
            </button>
            <div className={`smooth-accordion-grid ${isOpen ? 'is-open' : ''}`}>
              <div className="smooth-accordion-inner">
                <div className="smooth-accordion-content px-4 sm:pl-[48px] sm:pr-[60px] pb-5 pt-1">
                  <p className="text-[#363636] text-[15px] sm:text-[16px] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const productCache = new Map<string, any>();

function getProductFromCache(id: string) {
  if (!id) return null;
  if (productCache.has(id)) {
    return productCache.get(id);
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(`xcel_prod_${id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        productCache.set(id, parsed);
        return parsed;
      }
      const allStored = sessionStorage.getItem('xcel_all_products');
      if (allStored) {
        const allList = JSON.parse(allStored);
        if (Array.isArray(allList)) {
          const found = allList.find((p: any) => p.id === id || p.slug === id || p.customUrl === id);
          if (found) {
            productCache.set(id, found);
            return found;
          }
        }
      }
    } catch (e) {}
  }
  return null;
}

function saveProductToCache(id: string, data: any) {
  if (!id || !data) return;
  productCache.set(id, data);
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(`xcel_prod_${id}`, JSON.stringify(data));
    } catch (e) {}
  }
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '';

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState<boolean>(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollDistance = Math.min(carouselRef.current.clientWidth * 0.8, 640);
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth'
      });
    }
  };
  
  const [activeSection, setActiveSection] = useState<string | null>('features');
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const mobileAccordionRef = useRef<HTMLDivElement>(null);
  const desktopTabsRef = useRef<HTMLDivElement>(null);
  const SECTION_IDS = ['features', 'why-us', 'industries', 'faqs'];

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const forceScrollToTop = () => {
    if (typeof window === 'undefined') return;
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
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {}
  };

  useEffect(() => {
    forceScrollToTop();
    const rId = requestAnimationFrame(forceScrollToTop);
    const t1 = setTimeout(forceScrollToTop, 50);
    const t2 = setTimeout(forceScrollToTop, 150);
    const t3 = setTimeout(forceScrollToTop, 350);

    setActiveImageIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
    const cached = getProductFromCache(id);
    if (cached) {
      setProduct(cached);
      setLoading(false);
    }

    const onPageShow = () => forceScrollToTop();
    window.addEventListener('pageshow', onPageShow);

    return () => {
      cancelAnimationFrame(rId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      if (id.startsWith('fallback-')) {
        const fallbackData = {
          id,
          name: 'Demo Product (Placeholder)',
          categoryId: 'washing',
          cardDescription: 'Built for heavy loads. Engineered for excellence.',
          detailDescription: 'Built for heavy loads. Engineered for excellence. This is a temporary placeholder until real products are added via the admin panel.',
          shortDescription: 'Built for heavy loads. Engineered for excellence. This is a temporary placeholder until real products are added via the admin panel.',
          imageUrl: '/prod.final/Washing 1.png',
          additionalImages: ['/prod.png/Washing Front 60 kg Left View 1.png'],
          features: [
            { title: 'High Capacity Performance', description: 'Engineered to handle massive industrial loads with extreme precision and durability.' },
            { title: 'Energy Efficient Design', description: 'Advanced internal mechanisms that save up to 40% on power consumption.' }
          ],
          highlights: [
            'Heavy-duty industrial grade stainless steel construction',
            'Engineered for maximum power and water efficiency'
          ],
          faqs: [
            { question: 'What is the standard warranty on this machine?', answer: 'We provide a 1-year comprehensive warranty on all parts and labor.' },
            { question: 'Can this machine be customized?', answer: 'Yes, our engineering team can tailor the specifications to meet your specific industrial needs.' }
          ]
        };
        setProduct(fallbackData);
        saveProductToCache(id, fallbackData);
        setLoading(false);
        return;
      }

      try {
        let productData: any = null;
        
        // 1. First attempt: direct document ID
        try {
          const docRef = doc(db, "products", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            productData = { id: docSnap.id, ...docSnap.data() };
          }
        } catch (e) {}

        // 2. Second attempt: query by slug or customUrl
        if (!productData) {
          const q1 = query(collection(db, "products"), where("slug", "==", id));
          let querySnap = await getDocs(q1);
          if (querySnap.empty) {
            const q2 = query(collection(db, "products"), where("customUrl", "==", id));
            querySnap = await getDocs(q2);
          }
          if (!querySnap.empty) {
            const matchedDoc = querySnap.docs[0];
            productData = { id: matchedDoc.id, ...matchedDoc.data() };
          }
        }

        if (productData) {
          setProduct(productData);
          saveProductToCache(id, productData);
          if (productData.id) saveProductToCache(productData.id, productData);
          if (productData.slug) saveProductToCache(productData.slug, productData);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product?.categoryId) return;

    let isMounted = true;
    setLoadingRelated(true);

    const loadRelated = async () => {
      try {
        let allProds: any[] = [];
        
        // 1. Check sessionStorage
        if (typeof window !== 'undefined') {
          try {
            const stored = sessionStorage.getItem('xcel_all_products');
            if (stored) {
              allProds = JSON.parse(stored);
            }
          } catch (e) {}
        }

        // 2. Fetch from Firestore if not in sessionStorage
        if (!allProds || allProds.length === 0) {
          try {
            const querySnapshot = await getDocs(collection(db, "products"));
            querySnapshot.forEach((d: any) => {
              allProds.push({ id: d.id, ...d.data() });
            });
            if (typeof window !== 'undefined' && allProds.length > 0) {
              try {
                sessionStorage.setItem('xcel_all_products', JSON.stringify(allProds));
              } catch (e) {}
            }
          } catch (e) {
            console.error("Error fetching products for related section:", e);
          }
        }

        const currentProdId = String(product.id || '');
        const currentProdSlug = String(product.slug || '');

        const isCurrent = (p: any) => {
          const pId = String(p.id || '');
          const pSlug = String(p.slug || '');
          if (pId && (pId === currentProdId || pId === currentProdSlug)) return true;
          if (pSlug && (pSlug === currentProdId || pSlug === currentProdSlug)) return true;
          if (product.name && p.name && product.name.trim().toLowerCase() === p.name.trim().toLowerCase()) {
            return true;
          }
          return false;
        };

        const targetCat = (product.categoryId || '').trim().toLowerCase();
        if (!targetCat) {
          if (isMounted) {
            setRelatedProducts([]);
          }
          return;
        }

        // 1. Get all products from database matching this category (case-insensitive & trimmed)
        let categoryProds = allProds.filter((p: any) => 
          (p.categoryId || '').trim().toLowerCase() === targetCat
        );

        // 2. If none found in Firestore/session, check FALLBACK_PRODUCTS for this category
        if (categoryProds.length === 0) {
          if (FALLBACK_PRODUCTS[product.categoryId]) {
            categoryProds = FALLBACK_PRODUCTS[product.categoryId];
          } else {
            const matchedKey = Object.keys(FALLBACK_PRODUCTS).find(k => k.toLowerCase() === targetCat);
            if (matchedKey && FALLBACK_PRODUCTS[matchedKey]) {
              categoryProds = FALLBACK_PRODUCTS[matchedKey];
            }
          }
        }

        // If this category only has a single product overall, remove related products section entirely
        if (categoryProds.length <= 1) {
          if (isMounted) {
            setRelatedProducts([]);
          }
          return;
        }

        // Filter out the current product being viewed to get other products in the same category
        const sameCategoryProducts = categoryProds.filter((p: any) => !isCurrent(p));

        // If no other products remain in this category, remove related products section entirely
        if (sameCategoryProducts.length === 0) {
          if (isMounted) {
            setRelatedProducts([]);
          }
          return;
        }

        // Only display products belonging strictly to this category (no random products from other categories)
        if (isMounted) {
          setRelatedProducts(sameCategoryProducts);
        }
      } catch (err) {
        console.error("Failed to load related products:", err);
      } finally {
        if (isMounted) {
          setLoadingRelated(false);
        }
      }
    };

    loadRelated();

    return () => {
      isMounted = false;
    };
  }, [product?.categoryId, product?.id, product?.slug]);

  useEffect(() => {
    updateScrollButtons();
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [relatedProducts]);

  useEffect(() => {
    if (!loading && product && typeof window !== 'undefined') {
      forceScrollToTop();
      const rId = requestAnimationFrame(forceScrollToTop);
      const t1 = setTimeout(forceScrollToTop, 50);
      const t2 = setTimeout(forceScrollToTop, 150);
      return () => {
        cancelAnimationFrame(rId);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [loading, product]);

  useEffect(() => {
    // Only scroll within the horizontal thumbnail container, never scrolling the window
    if (activeImageIndex === 0) return;
    const container = thumbnailContainerRef.current;
    if (container && container.children && container.children[activeImageIndex]) {
      const targetThumb = container.children[activeImageIndex] as HTMLElement;
      if (targetThumb) {
        container.scrollTo({
          left: targetThumb.offsetLeft - container.offsetLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeImageIndex]);

  const handleMobileAccordionClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const isOpening = mobileExpanded !== id;
    if (isOpening) {
      setMobileExpanded(id);

      if (mobileAccordionRef.current) {
        const container = mobileAccordionRef.current;
        const sectionIndex = SECTION_IDS.indexOf(id);
        const buttons = container.querySelectorAll<HTMLButtonElement>('button[data-accordion-btn]');
        
        let accumulatedTop = 0;
        for (let i = 0; i < sectionIndex; i++) {
          accumulatedTop += (buttons[i]?.offsetHeight || 72) + 1;
        }

        const containerTop = container.getBoundingClientRect().top + window.pageYOffset;
        const headerOffset = 135; // sticky header total height (ticker 34px + navbar 90px + spacing)
        const targetScrollTop = Math.max(0, containerTop + accumulatedTop - headerOffset);

        window.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });

        // Refine positioning once collapse transition settles
        setTimeout(() => {
          const btn = document.getElementById(`mobile-tab-${id}`);
          if (btn) {
            const currentTop = btn.getBoundingClientRect().top;
            if (Math.abs(currentTop - headerOffset) > 8) {
              window.scrollTo({
                top: Math.max(0, currentTop + window.pageYOffset - headerOffset),
                behavior: 'smooth'
              });
            }
          }
        }, 360);
      }
    } else {
      setMobileExpanded(null);
    }
  };

  const handleDesktopTabClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (desktopTabsRef.current) {
      const rect = desktopTabsRef.current.getBoundingClientRect();
      const headerOffset = 135;
      if (rect.top < headerOffset || rect.top > 250) {
        const targetY = rect.top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 lg:pt-8 pb-10 animate-pulse min-h-[85vh]">
          <div className="h-4 w-60 bg-gray-200 rounded-md mb-8"></div>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mb-12">
            <div className="w-full sm:w-[80%] md:w-[65%] lg:w-[45%] xl:w-[40%] aspect-square bg-gray-100 rounded-2xl sm:rounded-3xl lg:rounded-[32px]"></div>
            <div className="flex-1 flex flex-col space-y-4 pt-2">
              <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-3/4 bg-gray-200 rounded-lg"></div>
              <div className="h-28 w-full bg-gray-100 rounded-xl mt-4"></div>
              <div className="h-12 w-full sm:w-64 bg-gray-200 rounded-xl mt-8"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl text-[#0a2766] font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
          <a href="/products" className="text-[#32589c] hover:underline">Return to Products</a>
        </main>
        <Footer />
      </div>
    );
  }

  const productImages = [product.imageUrl, ...(product.additionalImages || [])].filter(Boolean);
  
  const scrollToThumbnail = (index: number) => {
    setActiveImageIndex(index);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const sections = [
    {
      id: 'features',
      title: 'Key Features',
      icon: Settings,
      subtext: 'Explore the features that make a difference',
      shortDesc: 'Explore powerful features and technical specifications',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          {product.features && product.features.length > 0 ? (
            product.features.map((feature: any, idx: number) => (
              <div key={idx} className="flex flex-col">
                <h4 className="text-[#0a2766] font-bold text-[16px] mb-1">{feature.title}</h4>
                <p className="text-[#363636] text-[16px] leading-relaxed">{feature.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No key features detailed for this product.</p>
          )}
        </div>
      )
    },
    {
      id: 'why-us',
      title: 'Why Choose Us',
      icon: ShieldCheck,
      subtext: 'Discover the advantages that set XCEL apart',
      shortDesc: 'Built with quality, engineered for performance',
      content: Array.isArray(product.whyChooseUs) && product.whyChooseUs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          {product.whyChooseUs.map((item: any, idx: number) => (
            <div key={idx} className="flex flex-col">
              <h4 className="text-[#0a2766] font-bold text-[16px] mb-1">{item.title}</h4>
              <p className="text-[#363636] text-[16px] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-2 text-[#363636] text-[16px] leading-relaxed whitespace-pre-wrap">
          {typeof product.whyChooseUs === 'string' ? product.whyChooseUs : 'Built with quality, engineered for performance. We prioritize durability and continuous innovation. All our machines are manufactured with rigorous quality control to meet the highest industry standards.'}
        </div>
      )
    },
    {
      id: 'industries',
      title: 'Industries Served',
      icon: Factory,
      subtext: 'Tailored laundry solutions for every industry we serve',
      shortDesc: 'Solutions trusted across diverse industries',
      content: Array.isArray(product.industriesServed) && product.industriesServed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          {product.industriesServed.map((item: any, idx: number) => (
            <div key={idx} className="flex flex-col">
              <h4 className="text-[#0a2766] font-bold text-[16px] mb-1">{item.title}</h4>
              <p className="text-[#363636] text-[16px] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-2 text-[#363636] text-[16px] leading-relaxed whitespace-pre-wrap">
          {typeof product.industriesServed === 'string' ? product.industriesServed : 'Our equipment is perfectly suited for commercial laundries, hospitals, hotels, garment processing units, and educational institutions, providing reliable performance in high-stakes environments.'}
        </div>
      )
    },
    {
      id: 'faqs',
      title: 'FAQs',
      icon: HelpCircle,
      subtext: 'Answers to your most common questions about this machine',
      shortDesc: 'Get answers to common questions',
      content: <FAQList faqs={product.faqs} />
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 lg:pt-8 pb-10 min-h-[80vh]">
        
        {/* Breadcrumbs Navigation */}
        <div className="w-full mb-4 sm:mb-6 lg:mb-8 relative z-10">
          <nav 
            aria-label="Breadcrumb"
            className="flex flex-row items-center gap-1.5 sm:gap-2.5 text-[12px] sm:text-[13px] md:text-[14px] text-[#363636] overflow-x-auto scrollbar-hide whitespace-nowrap py-1"
          >
            <Link href="/" className="hover:text-[#0a2766] transition-colors flex items-center gap-1.5 shrink-0" title="Home">
              <Home size={14} strokeWidth={1.75} className="text-[#3b5b95]" />
              <span className="font-medium">Home</span>
            </Link>
            <ChevronRight size={13} strokeWidth={1.5} className="text-gray-400 shrink-0" />
            <Link 
              href="/products"
              onClick={() => {
                try {
                  sessionStorage.removeItem('xcel_active_category');
                } catch (e) {}
              }}
              className="hover:text-[#0a2766] font-medium transition-colors shrink-0"
            >
              Products
            </Link>
            <ChevronRight size={13} strokeWidth={1.5} className="text-gray-400 shrink-0" />
            <Link 
              href={`/products?category=${product.categoryId}#${product.categoryId}`} 
              onClick={() => {
                try {
                  sessionStorage.setItem('xcel_active_category', product.categoryId);
                } catch (e) {}
              }}
              className="hover:text-[#0a2766] font-medium transition-colors shrink-0"
            >
              {CATEGORY_NAMES[product.categoryId] || product.categoryId}
            </Link>
            <ChevronRight size={13} strokeWidth={1.5} className="text-gray-400 shrink-0" />
            <span 
              className="text-[#0a2766] font-bold shrink-0 max-w-[200px] sm:max-w-[280px] md:max-w-[420px] lg:max-w-[500px] xl:max-w-none truncate"
              title={product.name}
            >
              {product.name}
            </span>
          </nav>
        </div>

        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mb-10 lg:mb-12">
          
          {/* Left: Image Gallery */}
          <div className="w-full sm:w-[80%] md:w-[65%] lg:w-[45%] xl:w-[40%] mx-auto lg:mx-0 flex flex-col shrink-0">
            {/* Main Image */}
            <div 
              className="relative w-full aspect-square rounded-2xl sm:rounded-3xl lg:rounded-[32px] flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 mb-6 overflow-hidden border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-colors duration-300"
              style={{ backgroundColor: (Array.isArray(product.imageBgColors) && product.imageBgColors[activeImageIndex]) || product.imageBgColor || '#f4f5f9' }}
            >
              <img 
                src={productImages[activeImageIndex] || '/placeholder.png'} 
                alt={product.name} 
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-contain select-none"
              />
            </div>
            
            {/* Thumbnails Row */}
            {productImages.length > 1 && (
              <div className="flex flex-row items-center justify-between w-full gap-2 sm:gap-3">
                <button 
                  type="button"
                  onClick={prevImage} 
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-500 hover:text-[#0a2766] hover:bg-gray-100 rounded-full transition-colors shrink-0 cursor-pointer"
                  aria-label="Previous thumbnail"
                >
                  <ArrowLeft size={20} strokeWidth={1.8} />
                </button>

                <div 
                  ref={thumbnailContainerRef}
                  className={`flex flex-row gap-[10px] overflow-x-auto scrollbar-hide py-1.5 flex-1 snap-x snap-mandatory scroll-smooth ${
                    productImages.length < 4 ? 'justify-center' : ''
                  }`}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {productImages.map((img, idx) => (
                    <button 
                      key={idx}
                      type="button"
                      onClick={() => scrollToThumbnail(idx)}
                      className={`relative aspect-square shrink-0 rounded-xl sm:rounded-2xl overflow-hidden transition-all snap-start border-2 cursor-pointer ${
                        activeImageIndex === idx 
                          ? 'border-[#0a2766] opacity-100 shadow-sm' 
                          : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-200'
                      }`}
                      style={{ 
                        width: 'calc((100% - 30px) / 4)',
                        backgroundColor: (Array.isArray(product.imageBgColors) && product.imageBgColors[idx]) || product.imageBgColor || '#f4f5f9'
                      }}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${idx + 1}`} 
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-contain p-2" 
                      />
                    </button>
                  ))}
                </div>

                <button 
                  type="button"
                  onClick={nextImage} 
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-500 hover:text-[#0a2766] hover:bg-gray-100 rounded-full transition-colors shrink-0 cursor-pointer"
                  aria-label="Next thumbnail"
                >
                  <ArrowRight size={20} strokeWidth={1.8} />
                </button>
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:flex-1 flex flex-col justify-start lg:pb-4 lg:pl-4">
            
            <div className="inline-block bg-[#eaf0ff] text-[#0a2766] text-[11px] sm:text-[12px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider w-fit mb-4">
              {CATEGORY_NAMES[product.categoryId] || product.categoryId}
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-medium text-[#0a2766] tracking-tight leading-tight mb-6">
              {product.name}
            </h1>
            
            <div className="text-[#363636] text-[15px] sm:text-[16px] leading-relaxed mb-6 space-y-3">
              {(product.detailDescription || product.shortDescription || '').split('\n').filter(Boolean).map((para: string, i: number) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#0a2766] font-semibold">$1</strong>') }} />
              ))}
            </div>

            {/* Highlighted Lines */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="space-y-2 mb-8">
                {product.highlights.map((highlight: string, idx: number) => (
                  <p key={idx} className="text-[#0a2766] font-bold text-[15px] sm:text-[16px] leading-relaxed">
                    {highlight}
                  </p>
                ))}
              </div>
            )}
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 lg:pt-0">
              <a 
                href="https://wa.me/919971025730?text=Hello%2C%20I%20found%20your%20reference%20through%20your%20website%20and%20am%20interested%20in%20purchasing%20Laundry%20Machines.%20Kindly%20connect%20me%20with%20your%20sales%20team%20to%20discuss%20my%20requirements." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 bg-[#0a2766] text-white py-3 sm:py-3.5 px-4 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 hover:bg-[#071b4a] hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <Send size={18} />
                Request a Quote
              </a>
              {product.brochureUrl ? (
                <a href={product.brochureUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white text-[#0a2766] border-2 border-[#0a2766] py-3 sm:py-3.5 px-4 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 hover:bg-[#f8f9fa] hover:-translate-y-1 hover:shadow-md transition-all">
                  <Download size={18} />
                  Download Brochure
                </a>
              ) : (
                <button disabled className="flex-1 bg-gray-50 text-gray-400 border-2 border-gray-200 py-3 sm:py-3.5 px-4 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 cursor-not-allowed" title="Brochure not uploaded yet">
                  <Download size={18} />
                  Brochure Unavailable
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features Accordion Section (Mobile) */}
        <div 
          ref={mobileAccordionRef}
          className="flex lg:hidden flex-col mb-12 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden divide-y divide-gray-100"
        >
          {sections.map(section => {
            const isSectionOpen = mobileExpanded === section.id;
            return (
              <div key={section.id} className="flex flex-col bg-white">
                <button 
                  data-accordion-btn="true"
                  id={`mobile-tab-${section.id}`}
                  onClick={(e) => handleMobileAccordionClick(e, section.id)} 
                  className="flex flex-row items-center justify-between p-4 sm:p-5 text-left w-full transition-colors bg-[#f4f7fb] cursor-pointer scroll-mt-20"
                  aria-expanded={isSectionOpen}
                >
                  <div className="flex flex-row items-center gap-4">
                    <div className="w-[2px] h-[40px] shrink-0 bg-[#0a2766]"></div>
                    <div className="flex flex-col gap-0.5 pr-2">
                      <span className="font-semibold text-[16px] sm:text-[17px] text-[#0a2766]">{section.title}</span>
                      <span className="text-[13px] leading-snug text-[#363636]">{section.subtext}</span>
                    </div>
                  </div>
                  <ChevronDown 
                    size={22} 
                    strokeWidth={1.5} 
                    className={`shrink-0 ml-2 text-[#0a2766] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isSectionOpen ? 'rotate-180' : 'rotate-0'
                    }`} 
                  />
                </button>
                <div className={`smooth-accordion-grid ${isSectionOpen ? 'is-open' : ''}`}>
                  <div className="smooth-accordion-inner">
                    <div className="smooth-accordion-content p-4 sm:p-5 pt-0 mt-0">
                      <div className="pt-4 border-t border-gray-100">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Tabs Section (Desktop) */}
        <div 
          ref={desktopTabsRef}
          className="hidden lg:flex mb-12 lg:mb-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex-col scroll-mt-36"
        >
            {/* Tabs Header */}
            <div className="flex flex-row w-full mb-0 relative z-20 [&>button:first-child]:rounded-tl-2xl [&>button:last-child]:rounded-tr-2xl">
              {sections.map((section, index) => {
                const isNextActive = index < sections.length - 1 && sections[index + 1].id === activeSection;
                const showSeparator = index < sections.length - 1 && activeSection !== section.id && !isNextActive;

                return (
                  <button
                    key={section.id}
                    onClick={() => handleDesktopTabClick(section.id)}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-4 sm:py-5 text-sm sm:text-base font-bold transition-all cursor-pointer ${
                      activeSection === section.id 
                        ? 'text-white bg-[#0a2766]' 
                        : 'text-[#0a2766] bg-white hover:bg-gray-50'
                    } ${
                      showSeparator 
                        ? 'after:content-[""] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[2px] after:h-[16px] after:bg-[#0a2766]' 
                        : ''
                    }`}
                  >
                  {section.title}
                  {activeSection === section.id && (
                    <>
                      <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0a2766] rotate-45"></div>
                    </>
                  )}
                </button>
                );
              })}
            </div>
             {/* Content Area */}
            <div className="relative w-full">
              {sections.map((section) => (
                <div 
                  key={section.id}
                  className={activeSection === section.id ? 'block animate-tab-fade-in' : 'hidden'}
                >
                  <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 pt-0 pr-6 sm:pr-10 lg:pr-12 pb-6 sm:pb-10 lg:pb-0 pl-0">
                    {/* Left: Subtext Box */}
                    <div className="w-full lg:w-[35%] flex flex-col items-start shrink-0 bg-[#f8f9fc] rounded-br-[24px] rounded-tr-[24px] lg:rounded-bl-2xl p-8 sm:p-10 relative overflow-hidden shadow-sm">
                      <h3 className="text-[#0a2766] font-semibold text-[16px] sm:text-[20px] lg:text-[22px] leading-[1.3] mb-5 relative z-10">
                        {section.subtext}
                      </h3>
                      <div className="w-16 h-[4px] bg-[#0a2766] rounded-full relative z-10 mb-5"></div>
                      
                      {/* Curvy Decorative Lines directly below heading & small horizontal line (Edge-to-edge, unclipped) */}
                      <div className="relative -mx-8 sm:-mx-10 w-[calc(100%+4rem)] sm:w-[calc(100%+5rem)] h-32 sm:h-40 opacity-[0.22] pointer-events-none mt-5 sm:mt-7 mb-2">
                        <svg viewBox="-50 40 1100 290" preserveAspectRatio="none" className="w-full h-full fill-none stroke-[#0a2766] stroke-[2.2px]">
                          <path d="M -80 240 C 250 240, 360 80, 600 85 C 780 90, 950 135, 1080 140" />
                          <path d="M -80 256 C 250 256, 360 96, 600 101 C 780 106, 950 151, 1080 156" />
                          <path d="M -80 272 C 250 272, 360 112, 600 117 C 780 122, 950 167, 1080 172" />
                          <path d="M -80 288 C 250 288, 360 128, 600 133 C 780 138, 950 183, 1080 188" />
                          <path d="M -80 304 C 250 304, 360 144, 600 149 C 780 154, 950 199, 1080 204" />
                        </svg>
                      </div>
                    </div>
                  
                  {/* Right: Actual Content */}
                  <div className="w-full lg:w-[65%] pt-6 sm:pt-8 lg:pt-12 lg:pb-12">
                    {section.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Category Products Carousel Section */}
        {relatedProducts.length > 0 && (
          <section className="mb-14 sm:mb-20">
            {/* Section Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-6 bg-[#3b5b95] rounded-full"></div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0a2766] tracking-tight">
                  Related Products
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  disabled={!canScrollLeft}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all ${
                    canScrollLeft
                      ? 'border-gray-200 text-[#0a2766] hover:bg-[#0a2766] hover:text-white hover:border-[#0a2766] shadow-sm cursor-pointer'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                  }`}
                  aria-label="Scroll related products left"
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                </button>

                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  disabled={!canScrollRight}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all ${
                    canScrollRight
                      ? 'border-gray-200 text-[#0a2766] hover:bg-[#0a2766] hover:text-white hover:border-[#0a2766] shadow-sm cursor-pointer'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                  }`}
                  aria-label="Scroll related products right"
                >
                  <ChevronRight size={18} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Horizontal Carousel */}
            <div 
              ref={carouselRef}
              onScroll={updateScrollButtons}
              className="flex flex-row gap-4 sm:gap-6 overflow-x-auto scrollbar-hide py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {relatedProducts.map((relProd) => {
                const prodUrl = `/product/${relProd.slug || relProd.id}`;
                const prodImg = relProd.imageUrl || (Array.isArray(relProd.additionalImages) && relProd.additionalImages[0]) || '/placeholder.png';
                const desc = relProd.subheading || relProd.cardDescription || relProd.shortDescription || '';

                return (
                  <Link
                    key={relProd.id}
                    href={prodUrl}
                    onClick={() => {
                      forceScrollToTop();
                      try {
                        sessionStorage.setItem(`xcel_prod_${relProd.id}`, JSON.stringify(relProd));
                        if (relProd.slug) {
                          sessionStorage.setItem(`xcel_prod_${relProd.slug}`, JSON.stringify(relProd));
                        }
                      } catch (e) {}
                    }}
                    onMouseEnter={() => {
                      try {
                        sessionStorage.setItem(`xcel_prod_${relProd.id}`, JSON.stringify(relProd));
                        if (relProd.slug) {
                          sessionStorage.setItem(`xcel_prod_${relProd.slug}`, JSON.stringify(relProd));
                        }
                      } catch (e) {}
                    }}
                    className="group flex flex-col w-[260px] xs:w-[280px] sm:w-[310px] md:w-[320px] shrink-0 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(10,39,102,0.1)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden snap-start cursor-pointer"
                  >
                    {/* Product Image */}
                    <div 
                      className="relative w-full h-[180px] sm:h-[200px] bg-[#f8f9fc] p-4 flex items-center justify-center overflow-hidden border-b border-gray-50"
                      style={{ backgroundColor: (Array.isArray(relProd.imageBgColors) && relProd.imageBgColors[0]) || relProd.imageBgColor || '#f8f9fc' }}
                    >
                      <img
                        src={prodImg}
                        alt={relProd.name}
                        className={`w-full h-full object-contain ${(Array.isArray(relProd.imageBgColors) && relProd.imageBgColors[0]) || relProd.imageBgColor ? 'mix-blend-normal' : 'mix-blend-multiply'} group-hover:scale-105 transition-transform duration-300`}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <h4 className="font-bold text-[#0a2766] text-[14px] sm:text-[15px] md:text-[16px] leading-snug line-clamp-1 group-hover:text-[#32589c] transition-colors mb-1.5">
                          {relProd.name}
                        </h4>
                        {desc && (
                          <p className="text-[#4b5563] text-[12px] sm:text-[13px] leading-relaxed line-clamp-2">
                            {desc}
                          </p>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-gray-100">
                        <span className="text-[12px] sm:text-[13px] font-bold text-[#0a2766] group-hover:text-[#32589c] transition-colors">
                          View Details
                        </span>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#0a2766]/20 bg-[#f8fafd] flex items-center justify-center text-[#0a2766] group-hover:bg-[#0a2766] group-hover:text-white group-hover:border-[#0a2766] transition-all">
                          <ArrowRight size={14} strokeWidth={2.2} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom CTA Banner */}
        <div className="bg-[#0a2766] rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl">
          <div className="flex flex-row items-start gap-4 sm:gap-6 w-full lg:w-auto text-left">
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-[#e8effa] rounded-full flex items-center justify-center text-[#0a2766]">
              <Headset size={28} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-[18px] sm:text-[20px] lg:text-[22px] mb-1">
                Need help choosing the right machine?
              </h3>
              <p className="text-blue-100 text-[14px] sm:text-[15px]">
                Our experts are here to help you find the perfect solution.
              </p>
            </div>
          </div>
          
          <div className="flex flex-row items-center justify-center gap-2 xs:gap-3 sm:gap-6 w-full lg:w-auto mt-4 sm:mt-2 lg:mt-0">
            <a href="tel:+919971025730" className="flex items-center gap-1.5 sm:gap-3 text-white font-bold text-[13px] xs:text-[14px] sm:text-[18px] hover:text-blue-200 transition-colors flex-1 sm:flex-none justify-center whitespace-nowrap">
              <Phone className="w-4 h-4 sm:w-6 sm:h-6" />
              +91 99710 25730
            </a>
            
            <div className="w-px h-6 sm:h-8 bg-white/20 shrink-0"></div>
            
            <a href="https://wa.me/919971025730?text=Hello%2C%20I%20found%20your%20reference%20through%20your%20website%20and%20am%20interested%20in%20purchasing%20Laundry%20Machines.%20Kindly%20connect%20me%20with%20your%20sales%20team%20to%20discuss%20my%20requirements." target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none bg-white text-[#0a2766] py-2.5 sm:py-3.5 px-2 xs:px-4 sm:px-8 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-1.5 sm:gap-3 hover:bg-gray-100 hover:shadow-lg transition-all text-[13px] xs:text-[14px] sm:text-[16px] whitespace-nowrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-[22px] sm:h-[22px]">
                <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
              </svg>
              Get In Touch
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
