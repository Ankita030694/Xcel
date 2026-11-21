"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShieldCheck, Zap, Maximize, Play, Pause, Factory, Handshake } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Users, Award, MapPin } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Counter = ({ end, duration = 2500, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  return <span>{end.toLocaleString()}{suffix}</span>;
};

const StatsBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only auto-play on mobile/tablet (less than 1024px)
    if (window.innerWidth >= 1024) return;
    
    // Auto-play on mobile unless hovered/touched
    if (isHovered) return;
    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If at the end, scroll back to 0. Otherwise, scroll to the next slide (which is half the scrollable width since there are 2 slides)
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollTo({ left: scrollLeft + clientWidth, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const stats = [
    { end: 30000, suffix: "+", title: "Machines Installed" },
    { end: 8000, suffix: "+", title: "Happy Clients" },
    { end: 32, suffix: "+", title: "Years of Expertise" },
    { end: 20000, suffix: "+", title: "Sq. Ft. Facility" }
  ];

  return (
    <div className="w-full bg-[#3b5b95] py-2 sm:py-3 lg:py-4 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-2 sm:px-6 lg:px-8">
        
        {/* Desktop: Show all 4 in a row */}
        <div className="hidden lg:flex flex-row items-center justify-between gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-row items-center justify-center gap-3">
              <h3 className="text-[32px] font-bold text-white tracking-tight drop-shadow-sm">
                <Counter end={stat.end} suffix={stat.suffix} />
              </h3>
              <p className="text-[14px] font-medium text-white/90 leading-tight whitespace-nowrap">
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet: Auto-slider showing 2 at a time (Draggable & Swipeable) */}
        <div 
          className="relative w-full h-[50px] sm:h-[60px] flex lg:hidden justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
        >
          <div className="w-full relative">
            <div 
              ref={scrollRef}
              className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
            >
              {/* Slide 1 (Items 1 & 2) */}
              <div className="flex items-center justify-around w-full shrink-0 snap-center px-2">
                {stats.slice(0, 2).map((stat, idx) => (
                  <div key={idx} className="flex flex-row items-center justify-center gap-2 w-1/2">
                    <h3 className="text-[22px] sm:text-[28px] font-bold text-white tracking-tight drop-shadow-sm leading-none">
                      <Counter end={stat.end} suffix={stat.suffix} />
                    </h3>
                    <p className="text-[11px] sm:text-[13px] font-medium text-white/90 leading-tight">
                      {stat.title.replace(' ', '\n')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Slide 2 (Items 3 & 4) */}
              <div className="flex items-center justify-around w-full shrink-0 snap-center px-2">
                {stats.slice(2, 4).map((stat, idx) => (
                  <div key={idx} className="flex flex-row items-center justify-center gap-2 w-1/2">
                    <h3 className="text-[22px] sm:text-[28px] font-bold text-white tracking-tight drop-shadow-sm leading-none">
                      <Counter end={stat.end} suffix={stat.suffix} />
                    </h3>
                    <p className="text-[11px] sm:text-[13px] font-medium text-white/90 leading-tight">
                      {stat.title.replace(' ', '\n')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const HeroCarousel = () => {
  const images = [
    '/banners/hero-desktop-1.webp',
    '/banners/hero-desktop-2.webp',
    '/banners/hero-desktop-3.webp'
  ];
  const mobileImages = [
    '/banners/hero-mobile-1.webp',
    '/banners/hero-mobile-2.webp',
    '/banners/hero-mobile-3.webp'
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const mobileScrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        // Only scroll mobile container if it's actually visible
        if (mobileScrollRef.current && mobileScrollRef.current.clientWidth > 0) {
          const clientWidth = mobileScrollRef.current.clientWidth;
          mobileScrollRef.current.scrollTo({ left: nextIndex * clientWidth, behavior: 'smooth' });
        }
        return nextIndex;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const handleDotClick = (idx: number) => {
    setCurrentIndex(idx);
    if (mobileScrollRef.current && mobileScrollRef.current.clientWidth > 0) {
      const clientWidth = mobileScrollRef.current.clientWidth;
      mobileScrollRef.current.scrollTo({ left: idx * clientWidth, behavior: 'smooth' });
    }
  };

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const index = Math.round(target.scrollLeft / target.clientWidth);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleDragStart = (clientX: number) => {
    setDragStartX(clientX);
    setIsHovered(true);
  };

  const handleDragMove = (clientX: number) => {
    if (dragStartX === null) return;
    setDragOffset(clientX - dragStartX);
  };

  const handleDragEnd = () => {
    if (dragStartX !== null) {
      if (dragOffset > 50) {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (dragOffset < -50) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }
    setDragStartX(null);
    setDragOffset(0);
    setIsHovered(false);
  };

  return (
    <>
      {/* Mobile-Only Hero Carousel */}
      <main 
        className="w-full relative block md:hidden overflow-hidden bg-gray-100 aspect-[1080/1250]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
      >
        <div 
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {mobileImages.map((img, idx) => (
            <div key={idx} className="w-full h-full shrink-0 snap-center relative aspect-[1080/1250]">
              <img 
                src={img} 
                alt={`Mobile Hero Banner ${idx + 1}`} 
                className="w-full h-full object-cover" 
                loading={idx === 0 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "auto"}
                decoding="async"
              />
            </div>
          ))}
        </div>

      </main>

      {/* Desktop/Tablet Hero Carousel */}
      <main 
        className="w-full relative group bg-gray-100 hidden md:block select-none cursor-grab active:cursor-grabbing aspect-[1800/600]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (dragStartX !== null) handleDragEnd();
        }}
      >
        <div 
          className="w-full h-full overflow-hidden relative"
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
        >
          <div 
            className={`flex h-full ${dragStartX !== null ? '' : 'transition-transform duration-1000 ease-in-out'}`}
            style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` }}
          >
            {images.map((img, idx) => (
              <div key={idx} className="w-full h-full shrink-0 relative aspect-[1800/600]">
                <img 
                  src={img} 
                  alt={`Hero Banner ${idx + 1}`} 
                  className="w-full h-full object-cover pointer-events-none" 
                  draggable="false"
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : "auto"}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      


      {/* Navigation Arrows (visible on hover) */}
      <button 
        onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-md hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 12H5M12 19l-7-7 7-7" /></svg>
      </button>
      <button 
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-md hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M12 5l7 7-7 7" /></svg>
      </button>
    </main>
    </>
  );
};

const AboutUs = () => {
  return (
    <section className="bg-[#f3f5f8] w-full pt-12 pb-6 md:pt-14 md:pb-8 relative overflow-hidden">
      {/* Decorative background glowing orbs for slickness */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-b from-[#0a2766]/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-t from-[#32589c]/5 to-transparent blur-3xl" />
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="flex flex-col gap-6 md:gap-8 xl:gap-16">
          <div className="flex flex-col xl:flex-row gap-8 xl:gap-16 items-stretch xl:items-stretch">
            
            {/* Left Column - Image */}
          <div 
            tabIndex={0}
            className="w-full md:w-[75%] lg:w-[60%] xl:w-1/2 mx-auto xl:mx-0 shrink-0 relative group flex flex-col cursor-pointer outline-none"
            onTouchStart={() => {}}
          >
            {/* Fancy Glow Behind Image */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#32589c] to-[#3b5b95] rounded-[2rem] blur opacity-20 group-hover:opacity-40 group-focus:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative w-full aspect-square md:aspect-square xl:aspect-auto xl:h-auto xl:flex-1 rounded-[1.5rem] overflow-hidden shadow-2xl shadow-gray-400/50 transform transition duration-700 ease-out group-hover:-translate-y-2 group-focus:-translate-y-2">
              <img 
                src="/converted_1080x1080%201.webp" 
                alt="Precision Laser Cutting Manufacturing" 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transform transition duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a2766]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="w-full xl:w-1/2 flex flex-col pt-2 xl:pt-4">
            
            {/* Header Area */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#32589c] font-bold text-[13px] md:text-[12px] xl:text-base tracking-widest animate-pulse">{"//"}</span>
              <span className="text-[#363636] font-bold text-[13px] md:text-[12px] xl:text-base tracking-[0.2em] uppercase">About XCEL</span>
            </div>

            <h2 className="font-extrabold text-2xl md:text-xl xl:text-4xl leading-[1.15] mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500">
              Building India's Future in <span className="text-[#32589c]">Commercial Laundry</span> Manufacturing
            </h2>

            <div className="text-[#363636] font-normal text-sm md:text-[13px] xl:text-sm leading-relaxed space-y-3 mb-6">
              <p 
                tabIndex={0}
                className="border-l-4 md:border-l-0 xl:border-l-4 border-[#32589c] pl-5 md:pl-0 xl:pl-5 py-1 opacity-90 transition-all duration-300 hover:border-l-8 md:hover:border-l-0 xl:hover:border-l-8 focus:border-l-8 md:focus:border-l-0 xl:focus:border-l-8 outline-none cursor-pointer"
              >
                Some businesses are built on opportunity. Ours was built on the belief that India can create world-class commercial laundry equipment without relying on imports. From our early days only, we focused on precision engineering, uncompromising quality and deep industry understanding.
              </p>
              <p className="border-l-4 md:border-l-0 xl:border-l-4 border-transparent pl-5 md:pl-0 xl:pl-5 py-1 opacity-90">
                Every laundry machine at our factory is manufactured to meet the high-stakes demands of hotels, hospitals, garment units and commercial laundries where performance and reliability are critical.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="flex flex-col gap-6 xl:gap-4 mt-2 xl:mt-0">
              
              {/* Bullet 1 */}
              <div 
                tabIndex={0}
                className="group flex flex-row gap-3 sm:gap-4 md:gap-5 items-center p-4 sm:p-5 xl:p-5 rounded-3xl transition-all duration-300 cursor-pointer active:scale-[0.98] border bg-white shadow-xl shadow-gray-200 border-gray-100 hover:shadow-2xl hover:shadow-[#32589c]/10 outline-none"
                onTouchStart={() => {}}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center shrink-0 transform transition duration-500 ease-out shadow-sm scale-110 rotate-3 md:shadow-sm md:scale-100 md:rotate-0 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md rounded-full bg-transparent overflow-hidden">
                  <img src="/Icons%20About/BeforeAfter-About-Us-Layout-9-scaled-e1781799894517_2.webp" alt="Manufacturing" loading="lazy" decoding="async" className="w-full h-full object-contain" />
                </div>
                <p className="font-medium text-[13px] sm:text-sm md:text-[13px] xl:text-sm leading-relaxed mt-0 transition-colors duration-300 text-gray-900 group-hover:text-gray-900">
                  Proudly aligned with the Make in India vision, we grew, we strengthened our in-house manufacturing, R&D and a 20,000 sq ft facility to build complete laundry solutions under one roof. Our equipment is designed, manufactured and tested in India to meet international benchmarks.
                </p>
              </div>

              {/* Bullet 2 */}
              <div 
                tabIndex={0}
                className="group flex flex-row gap-3 sm:gap-4 md:gap-5 items-center p-4 sm:p-5 xl:p-5 rounded-3xl transition-all duration-300 cursor-pointer active:scale-[0.98] border bg-white shadow-xl shadow-gray-200 border-gray-100 hover:shadow-2xl hover:shadow-[#32589c]/10 outline-none"
                onTouchStart={() => {}}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center shrink-0 transform transition duration-500 ease-out shadow-sm scale-110 -rotate-3 md:shadow-sm md:scale-100 md:rotate-0 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-md rounded-full bg-transparent overflow-hidden">
                  <img src="/Icons%20About/BeforeAfter-About-Us-Layout-10-scaled-e1781799961570_2.webp" alt="Partnership" loading="lazy" decoding="async" className="w-full h-full object-contain" />
                </div>
                <p className="font-medium text-[13px] sm:text-sm md:text-[13px] xl:text-sm leading-relaxed mt-0 transition-colors duration-300 text-gray-900 group-hover:text-gray-900">
                  Beyond manufacturing, we remain committed to our customers through comprehensive installation support, readily available spare parts and a responsive PAN India service network. Our customers return not just for performance but for trust, reliability and long-term partnership.
                </p>
              </div>

            </div>
          </div>
        </div>


        
        </div>
      </div>
    </section>
  );
};

const whyChooseUsData = [
  {
    num: "01",
    title: "Transparent Pricing",
    desc: "Clear, upfront pricing with no hidden charges for complete customer confidence.",
    beforeIcon: "/New Icons/1.webp",
    afterIcon: "/New Icons/2.webp",
  },
  {
    num: "02",
    title: "Warranty & Protection",
    desc: "Dedicated warranty coverage backed by comprehensive technical support.",
    beforeIcon: "/New Icons/3.webp",
    afterIcon: "/New Icons/4.webp",
  },
  {
    num: "03",
    title: "Reliable Performance",
    desc: "Laundry Machines that are designed for heavy-duty cycles with consistent performance.",
    beforeIcon: "/New Icons/5.webp",
    afterIcon: "/New Icons/6.webp",
  },
  {
    num: "04",
    title: "Wide Range",
    desc: "Extensive range of washing, drying, ironing & dry-cleaning equipment under one roof.",
    beforeIcon: "/New Icons/7.webp",
    afterIcon: "/New Icons/8.webp",
  },
  {
    num: "05",
    title: "After Sales Service",
    desc: "Quick Pan-India support from installation to preventive maintenance.",
    beforeIcon: "/New Icons/9.webp",
    afterIcon: "/New Icons/10.webp",
  }
];

const WhyChooseUs = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Only auto-play on mobile/tablet screens (not XL desktop)
      if (window.innerWidth >= 1280 || isHoveredRef.current) return;
      
      const slider = sliderRef.current;
      if (!slider) return;

      const firstCard = slider.firstElementChild as HTMLElement;
      if (!firstCard) return;

      const computedStyle = window.getComputedStyle(slider);
      const gap = parseFloat(computedStyle.gap || computedStyle.columnGap || '16') || 16;
      const stride = firstCard.offsetWidth + gap;

      const { scrollLeft, scrollWidth, clientWidth } = slider;
      
      // If we reach the end of the scrollable area, loop back smoothly
      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Move by exact card stride so it aligns seamlessly without any snap fighting
        const nextTarget = Math.round((scrollLeft + stride) / stride) * stride;
        slider.scrollTo({ left: nextTarget, behavior: 'smooth' });
      }
    }, 2800);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="bg-[#f3f5f8] w-full pt-8 lg:pt-12 pb-8 lg:pb-12 relative border-t border-gray-100 flex items-center overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 xl:gap-8 items-center xl:items-stretch">
          
          {/* Left Title Area */}
          <div className="flex flex-col justify-center w-full xl:w-auto shrink-0 text-center xl:text-left pb-8 xl:pb-0">
            <div className="flex items-center justify-center xl:justify-start gap-2 mb-4">
              <span className="text-[#32589c] font-bold text-xs md:text-sm tracking-widest animate-pulse">{"//"}</span>
              <span className="text-[#363636] font-bold text-xs md:text-sm tracking-[0.2em] uppercase">Our USP's</span>
            </div>
            <h2 className="font-extrabold mt-[2px] text-xl md:text-2xl lg:text-3xl leading-[1.15] text-[#0a2766] tracking-tight whitespace-nowrap">
              Decades of Expertise.<br/><span className="text-[#0a2766]">Built on Trust.</span>
            </h2>
            <div className="hidden sm:block w-16 h-1 bg-[#4777c9] mt-6 mx-auto xl:mx-0"></div>
          </div>

          {/* Right Cards Area */}
          <div 
            ref={sliderRef}
            className="w-full xl:flex-1 flex flex-nowrap justify-start gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onMouseEnter={() => isHoveredRef.current = true}
            onMouseLeave={() => isHoveredRef.current = false}
            onTouchStart={() => isHoveredRef.current = true}
            onTouchEnd={() => {
              // Add a slight delay before resuming autoplay after a touch
              setTimeout(() => {
                isHoveredRef.current = false;
              }, 1500);
            }}
          >
            {whyChooseUsData.map((item, index) => {
              const isOdd = index % 2 === 0;
              const frontClasses = isOdd 
                ? "bg-white text-[#0a2766]" 
                : "bg-[#3b5b95] text-white";
              const backClasses = isOdd 
                ? "bg-[#3b5b95] text-white" 
                : "bg-white text-[#0a2766]";
              
              const frontIconColor = isOdd ? "text-[#1d438a]" : "text-white";
              const backIconColor = isOdd ? "text-white" : "text-[#1d438a]";
              const frontLineColor = isOdd ? "bg-[#0a2766]" : "bg-white";
              const backLineColor = isOdd ? "bg-white" : "bg-[#0a2766]";
              
              const frontBorder = isOdd ? "bg-[#3b5b95]" : "bg-white";
              const backBorder = isOdd ? "bg-white" : "bg-[#3b5b95]";
              
              const solidBaseBg = isOdd ? "bg-white" : "bg-[#3b5b95]";
              
              // Spinning border removed as requested

              return (
                <div 
                  key={index} 
                  tabIndex={0}
                  className="group shrink-0 snap-start w-[140px] sm:w-[170px] lg:w-[190px] xl:w-[185px] 2xl:w-[200px] h-[220px] lg:h-[250px] cursor-pointer outline-none" 
                  onTouchStart={() => {}}
                >
                  <div className="relative w-full h-full shadow-sm hover:shadow-xl rounded-sm overflow-hidden">
                    
                    {/* Front Border Layer (Static, disappears on hover) */}
                    <div className={`absolute inset-0 ${frontBorder} transition-opacity duration-300 ease-out opacity-100 lg:group-hover:opacity-0 group-focus:opacity-0`}></div>
                    
                    {/* Back Border Layer (Static, appears on hover to provide contrast for the light) */}
                    <div className={`absolute inset-0 ${backBorder} transition-opacity duration-300 ease-out opacity-0 lg:group-hover:opacity-100 group-focus:opacity-100`}></div>
                    
                    {/* Solid Base to prevent light bleed during cross-fade */}
                    <div className={`absolute inset-[2px] rounded-sm ${solidBaseBg}`}></div>
                    
                    {/* Front Face */}
                    <div className={`absolute inset-[2px] flex flex-col items-center justify-start pt-8 lg:pt-12 text-center p-3 rounded-sm transition-opacity duration-300 ease-out ${frontClasses} opacity-100 lg:group-hover:opacity-0 group-focus:opacity-0`}>
                      <div className={`mb-6 flex items-end justify-center h-[56px] lg:h-[70px] ${frontIconColor}`}>
                        <img 
                          src={item.beforeIcon} 
                          alt="" 
                          loading="lazy"
                          decoding="async"
                          className={`${item.title === "Wide Range" ? "max-h-[56px] lg:max-h-[70px]" : "max-h-[42px] lg:max-h-[50px]"} w-auto object-contain mx-auto`} 
                        />
                      </div>
                      <h3 className="font-bold text-[13px] lg:text-[15px] leading-snug px-0.5 lg:px-2 h-[36px] lg:h-[44px] flex items-start justify-center shrink-0">
                        {item.title}
                      </h3>
                      <div className={`w-6 h-0.5 mt-2 shrink-0 ${frontLineColor}`}></div>
                    </div>

                    {/* Back Face */}
                    <div className={`absolute inset-[2px] flex flex-col items-center justify-start pt-6 lg:pt-10 text-center p-3 sm:p-4 rounded-sm transition-opacity duration-300 ease-out ${backClasses} opacity-0 lg:group-hover:opacity-100 group-focus:opacity-100`}>
                      <div className={`mb-5 flex items-end justify-center h-[46px] lg:h-[56px] opacity-90 ${backIconColor}`}>
                        <img 
                          src={item.afterIcon} 
                          alt="" 
                          loading="lazy"
                          decoding="async"
                          className={`${item.title === "Wide Range" ? "max-h-[46px] lg:max-h-[56px]" : "max-h-[38px] lg:max-h-[46px]"} w-auto object-contain mx-auto`} 
                        />
                      </div>
                      <div className={`w-6 h-0.5 mb-4 shrink-0 ${backLineColor}`}></div>
                      <p className="text-[11px] lg:text-[13px] font-medium leading-relaxed px-0.5">
                        {item.desc}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

const ProductsHoverGallery = () => {
  const baseImages = [
    { 
      id: 0,
      src: "/banners/excellence-banner-1.webp", 
      alt: "Apparel Washing & High Speed Extract Equipment", 
      title: "APPAREL WASHING & HIGH SPEED EXTRACT",
      link: "/products?category=apparel-processing#apparel-processing",
      category: "apparel-processing"
    },
    { 
      id: 1,
      src: "/banners/excellence-banner-2.webp", 
      alt: "Flat-Work Ironer & Finishing Commercial Equipment", 
      title: "FLAT-WORK IRONER",
      link: "/products?category=flat-work#flat-work",
      category: "flat-work"
    },
    { 
      id: 2,
      src: "/banners/excellence-banner-3.webp", 
      alt: "Softener Washer Dryer Multi-Stage Equipment", 
      title: "SOFTENER WASHER DRYER",
      link: "/products?category=apparel-processing#apparel-processing",
      category: "apparel-processing"
    },
  ];

  const REPEAT_COUNT = 30; // 30 repetitions of the 3 banners = 90 cards
  const cards = React.useMemo(() => {
    const list = [];
    for (let r = 0; r < REPEAT_COUNT; r++) {
      for (let b = 0; b < baseImages.length; b++) {
        list.push({
          ...baseImages[b],
          key: `banner-${r}-${b}`
        });
      }
    }
    return list;
  }, []);

  // Start in the exact middle of the 90-card track on Banner 0 (Apparel Washing)
  const startIndex = Math.floor(REPEAT_COUNT / 2) * 3; // index 45
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);

  const dragStartX = useRef(0);
  const hasMoved = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const goToIndex = (newIndex: number) => {
    setDragOffset(0);
    setCurrentIndex(newIndex);
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    setDragOffset(0);
    hasMoved.current = false;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const delta = clientX - dragStartX.current;
    if (Math.abs(delta) > 5) {
      hasMoved.current = true;
    }
    setDragOffset(delta);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset < -50) {
      goToIndex(currentIndex + 1);
    } else if (dragOffset > 50) {
      goToIndex(currentIndex - 1);
    } else {
      setDragOffset(0);
    }
  };

  // Slider thumb handling
  const handleTrackClick = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetBanner = ratio < 0.33 ? 0 : ratio < 0.66 ? 1 : 2;
    const currentBanner = ((currentIndex % 3) + 3) % 3;
    let diff = targetBanner - currentBanner;
    if (diff === 2) diff = -1;
    if (diff === -2) diff = 1;
    goToIndex(currentIndex + diff);
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingThumb(true);
  };

  const handleThumbTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDraggingThumb(true);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX);
      } else if (isDraggingThumb && trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const targetBanner = ratio < 0.33 ? 0 : ratio < 0.66 ? 1 : 2;
        const currentBanner = ((currentIndex % 3) + 3) % 3;
        let diff = targetBanner - currentBanner;
        if (diff === 2) diff = -1;
        if (diff === -2) diff = 1;
        goToIndex(currentIndex + diff);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        if (isDragging) {
          handleDragMove(e.touches[0].clientX);
        } else if (isDraggingThumb && trackRef.current) {
          const rect = trackRef.current.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
          const targetBanner = ratio < 0.33 ? 0 : ratio < 0.66 ? 1 : 2;
          const currentBanner = ((currentIndex % 3) + 3) % 3;
          let diff = targetBanner - currentBanner;
          if (diff === 2) diff = -1;
          if (diff === -2) diff = 1;
          goToIndex(currentIndex + diff);
        }
      }
    };

    const onEnd = () => {
      if (isDragging) handleDragEnd();
      if (isDraggingThumb) setIsDraggingThumb(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, isDraggingThumb, dragOffset, currentIndex]);

  // Current active 0-indexed banner: 0, 1, or 2
  const activeBanner = ((currentIndex % 3) + 3) % 3;
  const thumbLeftPercent = (activeBanner / 2) * 65;

  return (
    <section id="engineering-excellence" className="bg-[#f8fafc] w-full pt-10 lg:pt-14 pb-10 lg:pb-16 overflow-hidden border-t border-gray-100 relative scroll-mt-20">
      {/* Section Title */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 lg:mb-10 flex flex-col items-center justify-center text-center gap-2 lg:gap-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#32589c] font-bold text-xs sm:text-[13px] lg:text-sm tracking-widest animate-pulse">{"//"}</span>
          <span className="text-[#363636] font-bold text-xs sm:text-[13px] lg:text-sm tracking-[0.2em] uppercase">ENGINEERING EXCELLENCE</span>
        </div>
        <h2 className="font-extrabold text-[22px] sm:text-[26px] lg:text-[32px] xl:text-[36px] leading-[1.15] text-[#0a2766] max-w-4xl tracking-tight">
          Complete Laundry Solutions <br className="hidden sm:block lg:hidden" /> Under One Roof
        </h2>
      </div>

      <div className="relative w-full max-w-[1750px] mx-auto overflow-hidden px-2 sm:px-4">
        {/* Soft Left and Right Gradient Edge Fades (as in screenshot) */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 lg:w-56 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/85 to-transparent z-30" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 lg:w-56 bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/85 to-transparent z-30" />

        {/* Carousel Center Stage Anchor */}
        <div 
          className="w-[84vw] sm:w-[70vw] md:w-[52vw] lg:w-[44vw] xl:w-[40vw] max-w-[620px] mx-auto relative select-none cursor-grab active:cursor-grabbing touch-pan-y py-4"
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onTouchStart={(e) => e.touches.length > 0 && handleDragStart(e.touches[0].clientX)}
        >
          {/* Continuous Infinite Sliding Track */}
          <div 
            className="flex flex-row items-center will-change-transform"
            style={{
              width: `${cards.length * 100}%`,
              transform: `translate3d(calc(${-currentIndex * (100 / cards.length)}% + ${dragOffset}px), 0, 0)`,
              transition: isDragging ? 'none' : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {cards.map((card, idx) => {
              const isCenter = idx === currentIndex;
              return (
                <div 
                  key={card.key}
                  onClick={() => {
                    if (hasMoved.current) return;
                    if (idx < currentIndex) goToIndex(currentIndex - 1);
                    else if (idx > currentIndex) goToIndex(currentIndex + 1);
                  }}
                  style={{ width: `${100 / cards.length}%` }}
                  className="shrink-0 px-2 sm:px-3 md:px-4"
                >
                  <div 
                    className={`w-full aspect-[1350/1080] rounded-2xl lg:rounded-3xl overflow-hidden bg-white border border-gray-100 transition-[transform,opacity,box-shadow] duration-500 ease-out cursor-pointer ${
                      isCenter
                        ? 'scale-100 opacity-100 shadow-[0_12px_44px_rgba(0,0,0,0.14)] z-20'
                        : 'scale-[0.80] sm:scale-[0.82] opacity-45 hover:opacity-75 shadow-md z-10'
                    }`}
                  >
                    <Link 
                      href={card.link}
                      onClick={(e) => {
                        if (!isCenter || hasMoved.current) {
                          e.preventDefault();
                          return;
                        }
                        try {
                          if (card.category) {
                            sessionStorage.setItem('xcel_active_category', card.category);
                          }
                        } catch (err) {}
                      }}
                      className="w-full h-full block group cursor-pointer"
                    >
                      <img 
                        src={card.src} 
                        alt={card.alt} 
                        draggable="false" 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover block pointer-events-none" 
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Slider Track with Draggable Dark Blue Thumb */}
        <div className="w-full max-w-xs sm:max-w-md mx-auto mt-6 px-4">
          <div className="w-full py-3 select-none flex items-center justify-center relative touch-none">
            {/* The Track */}
            <div 
              ref={trackRef}
              onClick={(e) => handleTrackClick(e.clientX)}
              className="w-full h-2 sm:h-2.5 bg-gray-200/90 hover:bg-gray-200 rounded-full relative cursor-pointer select-none"
            >
              {/* The Draggable Dark Blue Div Thumb */}
              <div 
                onMouseDown={handleThumbMouseDown}
                onTouchStart={handleThumbTouchStart}
                className={`absolute top-1/2 -translate-y-1/2 h-4 sm:h-5 bg-[#0a2766] hover:bg-[#123985] active:bg-[#071c49] rounded-full shadow-md select-none touch-none cursor-grab active:cursor-grabbing flex items-center justify-center ${
                  isDraggingThumb 
                    ? 'cursor-grabbing scale-y-110 shadow-lg ring-2 ring-[#0a2766]/30' 
                    : 'hover:scale-105 transition-[left,transform] duration-300 ease-out'
                }`}
                style={{ 
                  width: '35%',
                  left: `${thumbLeftPercent}%`
                }}
                title="Drag or click to switch banners"
              >
                {/* Visual tactile grip indicator */}
                <div className="flex items-center gap-1 opacity-70 pointer-events-none">
                  <span className="w-1 h-2 rounded-full bg-white/90" />
                  <span className="w-1 h-2 rounded-full bg-white/90" />
                  <span className="w-1 h-2 rounded-full bg-white/90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const projectsData = [
  {
    id: "industrial",
    title: "Industrial Developments",
    desc: "We develop efficient industrial spaces built for productivity, scalability, and long term operational success. Our projects prioritize functionality, strategic locations, and modern infrastructure to support growing businesses.",
    img: "/industrial.webp"
  },
  {
    id: "commercial",
    title: "Commercial Properties",
    desc: "Premium commercial spaces designed for modern businesses, featuring state-of-the-art facilities and prime locations to enhance your corporate presence.",
    img: "/commercial.webp"
  },
  {
    id: "residential",
    title: "Residential Communities",
    desc: "Thoughtfully designed residential communities that offer the perfect blend of comfort, luxury, and modern living amenities for families.",
    img: "/residential.webp"
  }
];

const ProjectsGallery = () => {
  const [activePane, setActivePane] = useState("industrial");

  return (
    <section className="bg-[#f3f5f8] w-full pt-6 lg:pt-10 pb-6 lg:pb-8 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col items-center justify-center text-center gap-2 lg:gap-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#32589c] font-bold text-xs sm:text-[13px] lg:text-sm tracking-widest animate-pulse">{"//"}</span>
          <span className="text-[#363636] font-bold text-xs sm:text-[13px] lg:text-sm tracking-[0.2em] uppercase">ENGINEERING EXCELLENCE</span>
        </div>
        <h2 className="font-extrabold text-[26px] sm:text-[30px] lg:text-[36px] xl:text-[40px] leading-[1.15] text-[#0a2766] max-w-4xl tracking-tight">
          Complete Laundry Solutions <br className="hidden sm:block lg:hidden" /> Under One Roof
        </h2>
      </div>

      {/* Desktop Horizontal Accordion Layout */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 h-[400px] xl:h-[500px] lg:flex gap-[20px] xl:gap-[33px] hidden">
        {projectsData.map((project) => {
          const isActive = activePane === project.id;
          return (
            <div
              key={project.id}
              onMouseEnter={() => setActivePane(project.id)}
              className={`relative h-full overflow-hidden cursor-pointer transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                isActive ? 'flex-[2] lg:flex-[1.8]' : 'flex-[1]'
              } will-change-[flex]`}
            >
              {/* Hardware Accelerated Background Image Wrapper */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] pointer-events-none will-change-transform">
                <Image 
                  src={project.img} 
                  alt={project.title} 
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 850px"
                  className="object-cover" 
                />
              </div>
              
              {/* Dark Overlay (darker when inactive) */}
              <div 
                className={`absolute inset-0 bg-black transition-opacity duration-700 pointer-events-none ${
                  isActive ? 'opacity-35' : 'opacity-50'
                }`} 
              />

              {/* Content */}
              <div className={`absolute bottom-0 left-0 w-full p-6 xl:p-10 flex flex-col justify-end transition-opacity duration-500 ${
                isActive ? 'opacity-100' : 'opacity-90'
              }`}>
                <h3 className="text-white font-medium text-2xl xl:text-[35px] leading-tight mb-4 tracking-wide font-sans">
                  {project.title}
                </h3>
                
                {/* Expandable Description */}
                <div 
                  className={`overflow-hidden transition-all duration-700 ease-in-out ${
                    isActive ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-white/95 font-normal text-lg xl:text-[25px] leading-[1.3] xl:leading-[30px] w-full xl:w-[631px]">
                    {project.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Slider Layout (Visible only on screens < lg) */}
      <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 sm:px-6 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {projectsData.map((project) => (
          <div key={project.id} className="relative h-[320px] sm:h-[400px] w-[85vw] sm:w-[400px] shrink-0 snap-center rounded-xl overflow-hidden shadow-sm group cursor-pointer" onTouchStart={() => {}}>
            <Image 
              src={project.img} 
              alt={project.title} 
              fill
              loading="lazy"
              sizes="(max-width: 640px) 85vw, 400px"
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end">
              <h3 className="text-white font-medium text-2xl sm:text-3xl leading-tight mb-3 tracking-wide">
                {project.title}
              </h3>
              <p className="text-white/90 text-[14px] sm:text-base leading-relaxed">
                {project.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CTABanner = () => {
  return (
    <section className="w-full bg-[#32589c] relative shadow-[0_0_40px_10px_#b1c6e9] py-4 lg:py-5 mt-4 z-10">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
          {/* Left Content */}
          <div className="flex flex-col gap-1 text-center lg:text-left text-white w-full lg:pl-6">
            <h2 className="font-bold text-[20px] sm:text-[24px] lg:text-[26px] xl:text-[30px] leading-[1.2] tracking-tight lg:whitespace-nowrap">
              Performance Without Compromise. Support Without Limits.
            </h2>
            <p className="font-normal text-[14px] sm:text-[15px] lg:text-[16px] xl:text-[18px] leading-snug text-white/90">
              End-to-End laundry solutions, from installation to after-sales support.
            </p>
          </div>

          {/* Right Button */}
          <div className="shrink-0 lg:pr-6">
            <button onClick={() => document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-b from-white to-gray-50 text-[#0a2766] font-bold text-[14px] lg:text-[15px] tracking-wider px-6 py-2.5 lg:px-8 lg:py-3.5 rounded-[12px] border border-gray-100 shadow-[0_5px_0_#cbd5e1,0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_#94a3b8,0_15px_25px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:shadow-[0_0px_0_#cbd5e1,0_0px_0_rgba(0,0,0,0.2)] active:translate-y-[5px] transition-all duration-200">
              REQUEST A QUOTE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const PartsToPower = () => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overImageRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !overImageRef.current || !handleRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    // Direct DOM manipulation for maximum performance (avoids full page re-renders on drag)
    overImageRef.current.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    handleRef.current.style.left = `calc(${pos}% - 1.5px)`;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  const features = [
    {
      title: "Premium Components",
      desc: "From bearings and valves to heating elements and stainless-steel 304 baskets, every component plays a critical role that modern laundries depend on.",
      icon: (
        <img src="/Icon home/premium-components.webp" alt="Premium Components" loading="lazy" decoding="async" className="w-[14px] h-[14px] lg:w-[24px] lg:h-[24px] xl:w-[28px] xl:h-[28px] object-contain" />
      )
    },
    {
      title: "Engineered as One System",
      desc: "With every carefully sourced component, the finished product becomes more than just a machine, it becomes a dependable partner.",
      icon: (
        <img src="/Icon home/engineered-as-one-system.webp" alt="Engineered as One System" loading="lazy" decoding="async" className="w-[14px] h-[14px] lg:w-[24px] lg:h-[24px] xl:w-[28px] xl:h-[28px] object-contain" />
      )
    },
    {
      title: "Precision Manufacturing",
      desc: "Through advanced manufacturing, we transform high-quality components into industrial laundry equipment built for continuous operation.",
      icon: (
        <img src="/Icon home/precision-manufacturing.webp" alt="Precision Manufacturing" loading="lazy" decoding="async" className="w-[14px] h-[14px] lg:w-[24px] lg:h-[24px] xl:w-[28px] xl:h-[28px] object-contain" />
      )
    },
    {
      title: "Rigorous Testing",
      desc: "Every machine undergoes rigorous testing to ensure dependable performance in demanding commercial and industrial laundries.",
      icon: (
        <img src="/Icon home/rigorous-testing.webp" alt="Rigorous Testing" loading="lazy" decoding="async" className="w-[14px] h-[14px] lg:w-[24px] lg:h-[24px] xl:w-[28px] xl:h-[28px] object-contain" />
      )
    }
  ];

  return (
    <section className="bg-[#f3f5f8] w-full py-10 lg:py-16 relative border-t border-gray-100 flex items-center overflow-hidden">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 items-stretch">
          
          {/* Left Area - Image Comparison Slider */}
          <div className="w-full md:w-[75%] lg:w-[60%] xl:w-1/2 mx-auto xl:mx-0 shrink-0 flex flex-col">
            <div 
              ref={containerRef}
              className="relative w-full h-[400px] md:h-auto md:aspect-square xl:aspect-auto xl:h-auto xl:flex-1 rounded-[20px] overflow-hidden select-none cursor-ew-resize group shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              onMouseDown={(e) => {
                setIsDragging(true);
                handleMove(e.clientX);
              }}
              onTouchStart={(e) => {
                setIsDragging(true);
                handleMove(e.touches[0].clientX);
              }}
            >
              {/* Under Image (Interior/Parts) */}
              <Image 
                src="/After.webp" 
                alt="Machine After"
                fill
                loading="lazy"
                sizes="(min-width: 1280px) 50vw, (min-width: 768px) 60vw, 100vw"
                className="object-cover pointer-events-none"
              />
              
              {/* Over Image (Exterior) */}
              <div 
                ref={overImageRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ clipPath: `inset(0 50% 0 0)` }}
              >
                <img 
                  src="/NEW 1.webp" 
                  alt="Machine Before"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Slider Line & Handle */}
              <div 
                ref={handleRef}
                className="absolute top-0 bottom-0 w-[3px] bg-white z-10"
                style={{ left: `calc(50% - 1.5px)` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#0a2766] border-[3px] border-white rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18 6-6-6-6"/><path d="m9 18-6-6 6-6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Area - Content & Grid */}
          <div className="flex flex-col w-full xl:w-1/2 lg:pt-2">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#111111] leading-[1.15] tracking-tight">
              Every Part. <span className="text-[#32589c]">One Purpose.</span>
            </h2>
            <div className="w-12 h-[4px] bg-[#32589c] mt-4 mb-3"></div>
            <p className="text-[#363636] text-[15px] lg:text-[16px] leading-relaxed max-w-2xl mb-8">
              Performance begins long before a machine reaches your facility. It begins with premium components, precision engineering and rigorous testing that power every XCEL machine.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-5 mb-8">
              {features.map((feature, idx) => (
                <div key={idx} tabIndex={0} className="group bg-white border border-gray-100 p-3 sm:p-4 lg:p-6 rounded-2xl shadow-[0_15px_40px_-10px_rgba(10,39,102,0.15)] hover:shadow-[0_25px_50px_-12px_rgba(10,39,102,0.25)] hover:border-[#32589c]/20 hover:-translate-y-2 transition-all duration-300 flex flex-col cursor-pointer outline-none" onTouchStart={() => {}}>
                  <div className="flex flex-row items-center gap-2 sm:gap-3 xl:gap-4 mb-2 sm:mb-3 xl:mb-4">
                    <div className="w-7 h-7 lg:w-10 lg:h-10 xl:w-12 xl:h-12 shrink-0 bg-[#3b5b95] rounded-full flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1d438a] group-hover:shadow-md">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-[#0a2766] text-[12px] sm:text-[14px] xl:text-[17px] leading-snug">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-[#363636] text-[11px] sm:text-[12px] xl:text-[14px] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Alert Banner */}
            <div tabIndex={0} className="bg-[#e9eff7] rounded-xl p-4 sm:p-5 flex items-center gap-4 mt-auto outline-none shadow-[0_15px_40px_-10px_rgba(10,39,102,0.15)] hover:shadow-[0_25px_50px_-12px_rgba(10,39,102,0.25)] hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-11 h-11 shrink-0 bg-[#3b5b95] rounded-full flex items-center justify-center text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div className="flex flex-col">
                <p className="text-[#0a2766] text-[14px] sm:text-[15px] leading-snug">
                  Great performance doesn't begin at the finish line.
                </p>
                <p className="text-[#3b5b95] text-[15px] sm:text-[16px] font-bold leading-snug">
                  It starts with every component inside.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};


const ProductCategories = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const [isDraggingCards, setIsDraggingCards] = React.useState(false);
  const [isDraggingThumb, setIsDraggingThumb] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const isDraggingCardsRef = React.useRef(false);
  const isDraggingThumbRef = React.useRef(false);

  const dragStartX = React.useRef(0);
  const dragStartScroll = React.useRef(0);
  const hasMoved = React.useRef(false);

  // Thumb dragging refs
  const thumbDragStartX = React.useRef(0);
  const thumbStartLeftPx = React.useRef(0);

  const categories = [
    { id: "washing", title: "WASHING", img: "/category/washing.webp" },
    { id: "drying", title: "DRYING", img: "/category/drying.webp" },
    { id: "apparel-processing", title: "APPAREL PROCESSING", img: "/category/apparel-washing.webp" },
    { id: "dry-cleaning", title: "DRY-CLEANING", img: "/category/dry-cleaning.webp" },
    { id: "flat-work", title: "FLAT-WORK", img: "/category/flat-work.webp" },
    { id: "steam-finishing", title: "STEAM-FINISHING", img: "/category/steam-finish.webp" },
    { id: "water-heater", title: "WATER HEATER", img: "/category/water-heater.webp" },
    { id: "fabric-checking", title: "FABRIC CHECKING", img: "/category/fabric-cleaning.webp" },
    { id: "other-equipment", title: "OTHER EQUIPMENT", img: "/category/other-equipment.webp" },
    { id: "complete-range", title: "COMPLETE RANGE", img: "/category/complete-range.webp" }
  ];

  // Helper to update scroll progress from carousel element
  const updateScrollProgress = (target: HTMLDivElement) => {
    const maxScroll = target.scrollWidth - target.clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((target.scrollLeft / maxScroll) * 100);
    } else {
      setScrollProgress(0);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const firstChild = target.children[0] as HTMLElement;
    if (firstChild) {
      const itemWidth = firstChild.offsetWidth;
      const index = Math.round(target.scrollLeft / itemWidth);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
    // Only sync from scroll event when not actively dragging the thumb
    if (!isDraggingThumbRef.current) {
      updateScrollProgress(target);
    }
  };

  // Start dragging thumb directly
  const handleThumbStart = (clientX: number) => {
    if (!trackRef.current || !scrollRef.current) return;
    isDraggingThumbRef.current = true;
    setIsDraggingThumb(true);
    thumbDragStartX.current = clientX;

    // Immediately disable scroll snap and smooth animation during drag
    scrollRef.current.style.scrollSnapType = 'none';
    scrollRef.current.style.scrollBehavior = 'auto';

    const trackWidth = trackRef.current.clientWidth;
    const thumbWidth = trackWidth * 0.3;
    const maxThumbLeft = trackWidth - thumbWidth;

    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    const currentRatio = maxScroll > 0 ? scrollRef.current.scrollLeft / maxScroll : 0;
    thumbStartLeftPx.current = currentRatio * maxThumbLeft;
  };

  // Track click: jump thumb to position and start dragging immediately
  const handleTrackStart = (clientX: number) => {
    if (!trackRef.current || !scrollRef.current) return;
    const bounds = trackRef.current.getBoundingClientRect();
    const trackWidth = bounds.width;
    const thumbWidth = trackWidth * 0.3;
    const maxThumbLeft = trackWidth - thumbWidth;

    const clickX = clientX - bounds.left;
    const targetLeft = Math.max(0, Math.min(maxThumbLeft, clickX - thumbWidth / 2));
    const ratio = maxThumbLeft > 0 ? targetLeft / maxThumbLeft : 0;

    // Disable snap and smooth scroll
    scrollRef.current.style.scrollSnapType = 'none';
    scrollRef.current.style.scrollBehavior = 'auto';

    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    scrollRef.current.scrollLeft = maxScroll * ratio;
    setScrollProgress(ratio * 100);

    // Immediately enter thumb dragging mode so dragging continues seamlessly
    isDraggingThumbRef.current = true;
    setIsDraggingThumb(true);
    thumbDragStartX.current = clientX;
    thumbStartLeftPx.current = targetLeft;
  };

  // Cards carousel mouse down -> start dragging cards
  const handleCardsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDraggingCardsRef.current = true;
    setIsDraggingCards(true);
    dragStartX.current = e.clientX;
    dragStartScroll.current = scrollRef.current.scrollLeft;
    hasMoved.current = false;
    scrollRef.current.style.scrollSnapType = 'none';
    scrollRef.current.style.scrollBehavior = 'auto';
  };

  // Dragging movement logic for both thumb and cards
  const handleMove = React.useCallback((clientX: number) => {
    if (isDraggingThumbRef.current && trackRef.current && scrollRef.current) {
      const trackWidth = trackRef.current.clientWidth;
      const thumbWidth = trackWidth * 0.3;
      const maxThumbLeft = trackWidth - thumbWidth;
      const delta = clientX - thumbDragStartX.current;
      const newLeftPx = Math.max(0, Math.min(maxThumbLeft, thumbStartLeftPx.current + delta));
      const ratio = maxThumbLeft > 0 ? newLeftPx / maxThumbLeft : 0;

      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = maxScroll * ratio;
      setScrollProgress(ratio * 100);
    } else if (isDraggingCardsRef.current && scrollRef.current) {
      const delta = clientX - dragStartX.current;
      if (Math.abs(delta) > 4) {
        hasMoved.current = true;
      }
      scrollRef.current.scrollLeft = dragStartScroll.current - delta;
      updateScrollProgress(scrollRef.current);
    }
  }, []);

  // Window listeners for smooth, uninterrupted mouse and touch dragging
  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingThumbRef.current || isDraggingCardsRef.current) {
        e.preventDefault();
        handleMove(e.clientX);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if ((isDraggingThumbRef.current || isDraggingCardsRef.current) && e.touches.length > 0) {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    };

    const onEnd = () => {
      let restored = false;
      if (isDraggingThumbRef.current) {
        isDraggingThumbRef.current = false;
        setIsDraggingThumb(false);
        restored = true;
      }
      if (isDraggingCardsRef.current) {
        isDraggingCardsRef.current = false;
        setIsDraggingCards(false);
        restored = true;
      }
      if (restored && scrollRef.current) {
        scrollRef.current.style.scrollSnapType = 'x mandatory';
        scrollRef.current.style.scrollBehavior = 'smooth';
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [handleMove]);

  // Initial scroll progress check
  React.useEffect(() => {
    if (scrollRef.current) {
      updateScrollProgress(scrollRef.current);
    }
  }, []);



  const handleCardClick = (e: React.MouseEvent) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className="w-full bg-white py-8 lg:py-12 border-b border-gray-100 relative z-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Cards Carousel */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleCardsMouseDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex flex-row flex-nowrap items-center w-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 pt-4 scroll-smooth select-none ${isDraggingCards ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 shrink-0 snap-center px-2 sm:px-3"
            >
              <Link
                href={`/products?category=${cat.id}#${cat.id}`}
                onClick={(e) => {
                  if (hasMoved.current) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  try {
                    sessionStorage.setItem('xcel_active_category', cat.id);
                  } catch (err) {}
                }}
                className="bg-gradient-to-b from-white to-[#eef2f9] border border-gray-200 rounded-[1rem] sm:rounded-[1.5rem] p-3 sm:p-5 flex flex-col aspect-square h-auto transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer block isolate"
              >
                {/* Title */}
                <h3 className="text-[#0a2766] font-extrabold text-[12px] min-[400px]:text-[13px] sm:text-[15px] lg:text-[16px] xl:text-[18px] tracking-tighter leading-snug mb-1 sm:mb-3 text-left shrink-0 whitespace-nowrap overflow-visible pt-1">
                  {cat.title}
                </h3>

                {/* Short accent line */}
                <div className="w-6 sm:w-10 h-[2px] bg-[#0a2766] rounded-full mb-2 sm:mb-4 shrink-0"></div>
                
                {/* Image */}
                <div className="flex-grow flex items-center justify-center mb-1 sm:mb-2 min-h-[100px] sm:min-h-[150px] relative w-full overflow-hidden mix-blend-multiply [transform:translateZ(0)]">
                  <Image 
                    src={cat.img} 
                    alt={cat.title} 
                    fill
                    loading="lazy"
                    draggable={false}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain scale-[1.20] pointer-events-none select-none" 
                  />
                </div>
                
                {/* View Details Link */}
                <div className="flex items-center gap-1 sm:gap-2 mt-auto shrink-0 pt-1 sm:pt-2">
                  <span className="text-[#0a2766] font-bold text-[10px] min-[400px]:text-xs sm:text-sm lg:text-base">View Details</span>
                  <svg className="w-6 h-3 sm:w-10 sm:h-4 text-[#0a2766] transition-transform duration-300 group-hover:translate-x-2" viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M0 12H30M22 4L30 12L22 20" />
                  </svg>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Progress Slider Track with Draggable Dark Blue Thumb */}
        <div className="w-full max-w-xs sm:max-w-md mx-auto mt-6 px-4">
          <div 
            className="w-full py-3 select-none flex items-center justify-center relative touch-none"
          >
            {/* The Track */}
            <div 
              ref={trackRef}
              onMouseDown={(e) => {
                e.preventDefault();
                handleTrackStart(e.clientX);
              }}
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  e.preventDefault();
                  handleTrackStart(e.touches[0].clientX);
                }
              }}
              className="w-full h-2 sm:h-2.5 bg-gray-200/90 hover:bg-gray-200 rounded-full relative cursor-pointer select-none"
            >
              {/* The Draggable Dark Blue Div Thumb */}
              <div 
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleThumbStart(e.clientX);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  if (e.touches.length > 0) {
                    e.preventDefault();
                    handleThumbStart(e.touches[0].clientX);
                  }
                }}
                className={`absolute top-1/2 -translate-y-1/2 h-4 sm:h-5 bg-[#0a2766] hover:bg-[#123985] active:bg-[#071c49] rounded-full shadow-md select-none touch-none cursor-grab active:cursor-grabbing flex items-center justify-center ${
                  isDraggingThumb 
                    ? 'cursor-grabbing scale-y-110 shadow-lg ring-2 ring-[#0a2766]/30' 
                    : 'transition-[left,transform] duration-150 ease-out hover:scale-105'
                }`}
                style={{ 
                  width: '30%',
                  left: `${(scrollProgress / 100) * 70}%` 
                }}
                title="Drag to scroll categories"
              >
                {/* Visual tactile grip indicator */}
                <div className="flex items-center gap-1 opacity-70 pointer-events-none">
                  <span className="w-1 h-2 rounded-full bg-white/90" />
                  <span className="w-1 h-2 rounded-full bg-white/90" />
                  <span className="w-1 h-2 rounded-full bg-white/90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  useEffect(() => {
    let prefetchTimer: NodeJS.Timeout | null = null;
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#engineering-excellence') {
        try {
          window.history.replaceState(null, '', window.location.pathname);
        } catch (e) {}
      }
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      }

      // Pre-cache products in the background so navigating to products page is instant
      try {
        if (!sessionStorage.getItem('xcel_all_products')) {
          prefetchTimer = setTimeout(async () => {
            try {
              const querySnapshot = await getDocs(collection(db, "products"));
              const fetchedProducts: any[] = [];
              querySnapshot.forEach((doc: any) => {
                fetchedProducts.push({ id: doc.id, ...doc.data() });
              });
              fetchedProducts.sort((a, b) => {
                const orderA = typeof a.order === 'number' ? a.order : 9999;
                const orderB = typeof b.order === 'number' ? b.order : 9999;
                if (orderA !== orderB) return orderA - orderB;
                const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                return timeB - timeA;
              });
              sessionStorage.setItem('xcel_all_products', JSON.stringify(fetchedProducts));
            } catch (err) {}
          }, 1200);
        }
      } catch (e) {}
    }

    return () => {
      if (prefetchTimer) clearTimeout(prefetchTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-clip">
      <Header />

      {/* Hero Section */}
      <HeroCarousel />

      {/* Stats Banner */}
      <StatsBanner />

      {/* Product Categories Layout */}
      <ProductCategories />

      {/* About Us Section */}
      <AboutUs />

      {/* Why Choose XCEL Section */}
      <WhyChooseUs />

      {/* Engineering Excellence Products Carousel */}
      <ProductsHoverGallery />

      {/* CTA Banner Section */}
      <CTABanner />

      {/* Parts to Power Slider Section */}
      <PartsToPower />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
