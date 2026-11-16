"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download, Send } from 'lucide-react';

const TOP_BAR_PHRASES = [
  "Complete Laundry Solutions For Every Industry.",
  "Pan-India Installation and Service Network.",
  "Trusted Manufacturer Of Laundry Equipment.",
  "Proudly Made in India Laundry Machines Since 1994."
];

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/') {
      return pathname === '/';
    }
    if (path === '/products') {
      return pathname.startsWith('/products') || pathname.startsWith('/product');
    }
    if (path === '/blogs' || path === '/insights') {
      return pathname.startsWith('/blogs') || pathname.startsWith('/insights');
    }
    return pathname.startsWith(path);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % TOP_BAR_PHRASES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleIndustryInsightsClick = (e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.setItem('xcel_scroll_to_blogs', 'true');
    } catch (err) {}

    const cleanPath = (window.location.pathname || '').toLowerCase().replace(/\/$/, '');
    const isBlogsPage = cleanPath === '/blogs';
    if (isBlogsPage) {
      e.preventDefault();
      try {
        window.history.replaceState(window.history.state, '', '/blogs');
      } catch (err) {}

      window.dispatchEvent(new CustomEvent('select-blog-category', { 
        detail: { category: 'all', scrollToTop: false } 
      }));

      window.dispatchEvent(new CustomEvent('scroll-to-blogs-content-direct'));
    }
  };

  const handleProductsClick = (e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem('xcel_active_category');
    } catch (err) {}
    sessionStorage.setItem('xcel_scroll_to_products', 'true');

    const isProductsPage = window.location.pathname === '/products' || window.location.pathname === '/products/';
    if (isProductsPage) {
      e.preventDefault();
      try {
        window.history.replaceState(window.history.state, '', '/products');
      } catch (err) {}
      window.dispatchEvent(new CustomEvent('scroll-to-products-heading'));
    }
  };

  const handleProductCategoryNav = (categoryId: string, e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.setItem('xcel_active_category', categoryId);
    } catch (err) {}

    const isProductsPage = window.location.pathname === '/products' || window.location.pathname === '/products/';
    if (isProductsPage) {
      e.preventDefault();
      try {
        const newUrl = `/products?category=${categoryId}#${categoryId}`;
        window.history.replaceState(window.history.state, '', newUrl);
      } catch (err) {}
      window.dispatchEvent(new CustomEvent('select-product-category', { 
        detail: { categoryId, shouldScroll: true } 
      }));
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm font-sans">
      {/* Top Bar Ticker */}
      <div className="bg-[#3b5b95] text-white py-2 text-[13px] font-medium tracking-wide overflow-hidden relative flex h-[34px] w-full">
        {TOP_BAR_PHRASES.map((phrase, idx) => (
          <div 
            key={idx} 
            className="absolute inset-0 flex items-center justify-center text-center px-4 transition-transform duration-700 ease-in-out w-full"
            style={{ 
              transform: `translateX(${(idx - phraseIndex) * 100}%)` 
            }}
          >
            {phrase}
          </div>
        ))}
      </div>
      
      {/* Main Navbar */}
      <div className="bg-[#f8f9fa] w-full border-b border-gray-100 relative z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-[90px]">
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center focus:outline-none">
              <img 
                src="/Xcel%20logo%20image%202.webp" 
                alt="XCEL Logo" 
                width={184}
                height={46}
                fetchPriority="high"
                decoding="async"
                className="h-[38px] md:h-[46px] w-auto object-contain" 
              />
            </Link>
            
            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center space-x-9 mt-1">
              <Link 
                href="/" 
                className={`text-[#3b5b95] font-semibold text-[14px] pb-1 border-b-[2.5px] transition-all ${
                  isActive('/') ? 'border-[#3b5b95]' : 'border-transparent hover:border-[#3b5b95]'
                }`}
              >
                HOME
              </Link>
              <Link 
                href="/about" 
                className={`text-[#3b5b95] font-semibold text-[14px] pb-1 border-b-[2.5px] transition-all ${
                  isActive('/about') ? 'border-[#3b5b95]' : 'border-transparent hover:border-[#3b5b95]'
                }`}
              >
                ABOUT US
              </Link>
              <div className="group flex flex-col justify-center h-[90px]">
                <Link 
                  href="/products" 
                  onClick={handleProductsClick}
                  className={`relative flex items-center cursor-pointer pb-1 border-b-[2.5px] transition-all ${
                    isActive('/products') ? 'border-[#3b5b95]' : 'border-transparent group-hover:border-[#3b5b95]'
                  }`}
                >
                  <span className="text-[#3b5b95] font-semibold text-[14px]">PRODUCTS</span>
                </Link>
                
                {/* Full-width Sub-nav Dropdown */}
                <div className="absolute top-[90px] left-0 w-full bg-[#3b5b95] hidden group-hover:flex items-center justify-center py-3.5 shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 border-t border-[#3b5b95]">
                  <div className="flex flex-row items-center justify-center gap-x-4 xl:gap-x-7 gap-y-2 text-white font-semibold text-[11px] xl:text-[12px] tracking-wider uppercase max-w-[1400px] px-4 w-full flex-wrap">
                    <Link href="/products?category=washing#washing" onClick={(e) => handleProductCategoryNav('washing', e)} className="hover:text-blue-300 transition-colors">WASHING</Link>
                    <Link href="/products?category=drying#drying" onClick={(e) => handleProductCategoryNav('drying', e)} className="hover:text-blue-300 transition-colors">DRYING</Link>
                    <Link href="/products?category=apparel-processing#apparel-processing" onClick={(e) => handleProductCategoryNav('apparel-processing', e)} className="hover:text-blue-300 transition-colors">APPAREL PROCESSING</Link>
                    <Link href="/products?category=dry-cleaning#dry-cleaning" onClick={(e) => handleProductCategoryNav('dry-cleaning', e)} className="hover:text-blue-300 transition-colors">DRY-CLEANING</Link>
                    <Link href="/products?category=flat-work#flat-work" onClick={(e) => handleProductCategoryNav('flat-work', e)} className="hover:text-blue-300 transition-colors">FLAT-WORK</Link>
                    <Link href="/products?category=steam-finishing#steam-finishing" onClick={(e) => handleProductCategoryNav('steam-finishing', e)} className="hover:text-blue-300 transition-colors">STEAM-FINISHING</Link>
                    <Link href="/products?category=water-heater#water-heater" onClick={(e) => handleProductCategoryNav('water-heater', e)} className="hover:text-blue-300 transition-colors">WATER HEATER</Link>
                    <Link href="/products?category=fabric-checking#fabric-checking" onClick={(e) => handleProductCategoryNav('fabric-checking', e)} className="hover:text-blue-300 transition-colors">FABRIC CHECKING</Link>
                    <Link href="/products?category=other-equipment#other-equipment" onClick={(e) => handleProductCategoryNav('other-equipment', e)} className="hover:text-blue-300 transition-colors">OTHER EQUIPMENT</Link>
                    <Link href="/products?category=complete-range#complete-range" onClick={(e) => handleProductCategoryNav('complete-range', e)} className="hover:text-blue-300 transition-colors">COMPLETE RANGE</Link>
                  </div>
                </div>
              </div>
              <Link 
                href="/blogs" 
                onClick={handleIndustryInsightsClick}
                className={`text-[#3b5b95] font-semibold text-[14px] pb-1 border-b-[2.5px] transition-all cursor-pointer ${
                  isActive('/blogs') ? 'border-[#3b5b95]' : 'border-transparent hover:border-[#3b5b95]'
                }`}
              >
                INDUSTRY INSIGHTS
              </Link>
              <Link 
                href="/contact" 
                className={`text-[#3b5b95] font-semibold text-[14px] pb-1 border-b-[2.5px] transition-all ${
                  isActive('/contact') ? 'border-[#3b5b95]' : 'border-transparent hover:border-[#3b5b95]'
                }`}
              >
                CONTACT US
              </Link>
            </nav>
            
            {/* Quote Button - Desktop */}
            <div className="hidden lg:flex items-center">
              <a 
                href="/Xcel-Brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-b from-white to-gray-50 text-[#0a2766] font-bold text-[14px] lg:text-[15px] tracking-wider px-5 py-2.5 lg:px-6 lg:py-2.5 rounded-[12px] border border-gray-100 shadow-[0_5px_0_#cbd5e1,0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_#94a3b8,0_15px_25px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:shadow-[0_0px_0_#cbd5e1,0_0px_0_rgba(0,0,0,0.2)] active:translate-y-[5px] transition-all duration-200 flex items-center justify-center cursor-pointer"
              >
                Download Brochure
                <Download className="w-4 h-4 ml-2" strokeWidth={2.5} />
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center relative z-[60]">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#3b5b95] hover:text-[#2f497a] focus:outline-none w-10 h-10 transition-colors flex flex-col items-center justify-center relative"
                aria-label="Toggle menu"
              >
                <div className={`absolute w-[34px] h-[2.5px] bg-current transition-all duration-700 ease-in-out rounded-full ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-[10px]'}`}></div>
                <span className={`absolute text-[11px] font-bold tracking-widest leading-none transition-all duration-700 ease-in-out ${isMobileMenuOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>MENU</span>
                <div className={`absolute w-[34px] h-[2.5px] bg-current transition-all duration-700 ease-in-out rounded-full ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-[10px]'}`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`absolute top-full left-0 w-full bg-white z-30 transition-all duration-700 ease-in-out overflow-hidden border-b border-gray-100 shadow-xl lg:hidden ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 border-transparent shadow-none'
        }`}
      >
        <nav className="flex flex-col items-center py-6 px-6 space-y-6 text-center">
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className={`text-[#3b5b95] font-semibold text-[15px] pb-1 border-b-[2.5px] transition-all ${
              isActive('/') ? 'border-[#3b5b95]' : 'border-transparent hover:text-[#2f497a]'
            }`}
          >
            HOME
          </Link>
          <Link 
            href="/about" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className={`text-[#3b5b95] font-semibold text-[15px] pb-1 border-b-[2.5px] transition-all ${
              isActive('/about') ? 'border-[#3b5b95]' : 'border-transparent hover:text-[#2f497a]'
            }`}
          >
            ABOUT US
          </Link>
          <Link 
            href="/products" 
            onClick={handleProductsClick}
            className={`flex flex-col items-center pb-1 border-b-[2.5px] transition-all ${
              isActive('/products') ? 'border-[#3b5b95]' : 'border-transparent'
            }`}
          >
            <div className="flex items-center justify-center cursor-pointer">
              <span className="text-[#3b5b95] font-semibold text-[15px]">PRODUCTS</span>
            </div>
          </Link>
          <Link 
            href="/blogs" 
            onClick={handleIndustryInsightsClick} 
            className={`text-[#3b5b95] font-semibold text-[15px] pb-1 border-b-[2.5px] transition-all cursor-pointer ${
              isActive('/blogs') ? 'border-[#3b5b95]' : 'border-transparent hover:text-[#2f497a]'
            }`}
          >
            INDUSTRY INSIGHTS
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className={`text-[#3b5b95] font-semibold text-[15px] pb-1 border-b-[2.5px] transition-all ${
              isActive('/contact') ? 'border-[#3b5b95]' : 'border-transparent hover:text-[#2f497a]'
            }`}
          >
            CONTACT US
          </Link>
          
          <div className="pt-6 mt-4 border-t border-gray-100 flex lg:hidden">
            <a 
              href="/Xcel-Brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-gradient-to-b from-white to-gray-50 text-[#0a2766] font-bold text-[14px] tracking-wider px-5 py-3 rounded-[12px] border border-gray-100 shadow-[0_5px_0_#cbd5e1,0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_#94a3b8,0_15px_25px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:shadow-[0_0px_0_#cbd5e1,0_0px_0_rgba(0,0,0,0.2)] active:translate-y-[5px] transition-all duration-200 flex items-center justify-center w-full cursor-pointer"
            >
              Download Brochure
              <Download className="w-4 h-4 ml-2" strokeWidth={2.5} />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};
