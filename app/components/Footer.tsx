"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { BLOG_ARTICLES, getActiveBlogCategories } from '@/data/blogs';
import { mergeWithDefaultBlogs } from '@/lib/blogs';

export const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    state: '',
    message: '',
    interest: '',
    acceptedPolicy: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const indianStatesAndUTs = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
    "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
    "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow control and navigation keys
    if (
      e.key === 'Backspace' ||
      e.key === 'Tab' ||
      e.key === 'Enter' ||
      e.key === 'Escape' ||
      e.key === 'Delete' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }
    // Only characters (letters) and spaces
    if (!/^[a-zA-Z\s]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setFormData((prev) => ({ ...prev, name: value }));
  };

  const handleContactKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow control and navigation keys
    if (
      e.key === 'Backspace' ||
      e.key === 'Tab' ||
      e.key === 'Enter' ||
      e.key === 'Escape' ||
      e.key === 'Delete' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }
    // Only numbers
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, contact: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      alert("Name can contain only characters and spaces");
      return;
    }
    if (!formData.contact.trim()) {
      alert("Please enter your contact number");
      return;
    }
    if (formData.contact.length !== 10) {
      alert("Please enter exactly 10 digits for the phone number");
      return;
    }
    if (!formData.email.trim()) {
      alert("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      alert("Please enter a valid email address");
      return;
    }
    if (!formData.state) {
      alert("Please select your State/UT");
      return;
    }
    if (!formData.acceptedPolicy) {
      alert("Please accept the privacy policy");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        email: formData.email.trim(),
        state: formData.state,
        message: formData.message.trim(),
        interest: formData.interest || 'General Enquiry',
        source: 'Footer',
        acceptedPolicy: formData.acceptedPolicy,
      };

      // 1. Submit through internal API route (same-origin, 100% reliable on iOS Safari)
      let submitted = false;
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (response.ok && result.success) {
          submitted = true;
        }
      } catch (apiErr) {
        console.warn('API submission failed, falling back to direct Firestore:', apiErr);
      }

      // 2. Fallback to direct client Firestore SDK if API route was unreachable
      if (!submitted) {
        await addDoc(collection(db, "contactForms"), {
          ...payload,
          submittedAt: serverTimestamp(),
        });
      }

      alert("Form submitted successfully! We will get back to you shortly.");
      setFormData({
        name: '',
        contact: '',
        email: '',
        state: '',
        message: '',
        interest: '',
        acceptedPolicy: false
      });
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductCategoryClick = (categoryId: string, e: React.MouseEvent) => {
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

  const handleProductsHeadingClick = (e: React.MouseEvent) => {
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

  const [blogCategories, setBlogCategories] = useState<string[]>(() =>
    getActiveBlogCategories(BLOG_ARTICLES)
  );

  useEffect(() => {
    let isMounted = true;

    // Hydrate cached categories on client after initial mount to prevent SSR mismatch
    try {
      const stored = sessionStorage.getItem('xcel_blog_categories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlogCategories(parsed);
        }
      }
    } catch (e) {}

    // Listen for real-time blog category updates dispatched by BlogsClient
    const handleCategoriesUpdated = (e: any) => {
      if (Array.isArray(e?.detail)) {
        setBlogCategories(e.detail);
        try {
          sessionStorage.setItem('xcel_blog_categories', JSON.stringify(e.detail));
        } catch (err) {}
      }
    };
    window.addEventListener('xcel-blog-categories-updated', handleCategoriesUpdated);

    // Listen for real-time blog updates dispatched by BlogsClient
    const handleBlogsUpdated = (e: any) => {
      if (Array.isArray(e?.detail)) {
        const cats = getActiveBlogCategories(e.detail);
        setBlogCategories(cats);
        try {
          sessionStorage.setItem('xcel_blog_categories', JSON.stringify(cats));
        } catch (err) {}
      }
    };
    window.addEventListener('xcel-blogs-updated', handleBlogsUpdated);

    // Fetch from Firestore on mount so footer has live categories across all pages
    const fetchLiveCategories = async () => {
      try {
        const [snap, deletedSnap] = await Promise.all([
          getDocs(collection(db, "blogs")),
          getDocs(collection(db, "deleted_blogs")).catch(() => null),
        ]);
        if (!isMounted) return;

        const deletedSlugs = new Set<string>();
        if (deletedSnap && !deletedSnap.empty) {
          deletedSnap.forEach((d: any) => {
            const data = d.data();
            if (data.slug) deletedSlugs.add(data.slug.toLowerCase().trim());
            if (data.id) deletedSlugs.add(data.id.toLowerCase().trim());
            deletedSlugs.add(d.id.toLowerCase().trim());
          });
        }

        const dynamicArticles: any[] = [];
        if (!snap.empty) {
          snap.forEach((docSnap: any) => {
            dynamicArticles.push({ id: docSnap.id, ...docSnap.data() });
          });
        }

        // Merge dynamic Firestore articles with all default articles (excluding deleted ones)
        const merged = mergeWithDefaultBlogs(dynamicArticles, deletedSlugs);
        // Exclude drafts from footer category calculations
        const validArticles = merged.filter((a) => a.status !== "draft");
        const cats = getActiveBlogCategories(validArticles);
        setBlogCategories(cats);
        try {
          sessionStorage.setItem('xcel_blog_categories', JSON.stringify(cats));
        } catch (err) {}
      } catch {
        if (isMounted) {
          setBlogCategories(getActiveBlogCategories(BLOG_ARTICLES));
        }
      }
    };

    fetchLiveCategories();

    return () => {
      isMounted = false;
      window.removeEventListener('xcel-blogs-updated', handleBlogsUpdated);
      window.removeEventListener('xcel-blog-categories-updated', handleCategoriesUpdated);
    };
  }, []);

  const handleBlogCategoryClick = (categoryName: string, e: React.MouseEvent) => {
    if (typeof window === 'undefined') return;

    const cleanPath = (window.location.pathname || '').toLowerCase().replace(/\/$/, '');
    const isBlogsPage = cleanPath === '/blogs';
    if (isBlogsPage) {
      e.preventDefault();
      try {
        const newUrl = categoryName.toLowerCase() === 'all'
          ? '/blogs'
          : `/blogs?category=${encodeURIComponent(categoryName)}`;
        window.history.replaceState(window.history.state, '', newUrl);
      } catch (err) {}

      window.dispatchEvent(new CustomEvent('select-blog-category', { 
        detail: { category: categoryName, scrollToTop: false } 
      }));

      window.dispatchEvent(new CustomEvent('scroll-to-blogs-content-direct'));
    } else {
      try {
        sessionStorage.setItem('xcel_scroll_to_blogs', 'true');
      } catch (err) {}
    }
  };

  const handleBlogsHeadingClick = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return;

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
    } else {
      try {
        sessionStorage.setItem('xcel_scroll_to_blogs', 'true');
      } catch (err) {}
    }
  };

  return (
    <footer id="footer-contact" className="w-full bg-[#f3f5f8] pt-4 lg:pt-6 pb-0 px-4 sm:px-8 lg:px-12 flex justify-center font-sans scroll-mt-[140px] mt-auto">
      {/* Outer Wrapper for the white grid lines */}
      <div className="w-full max-w-[1500px] bg-white flex flex-col gap-[2px] shadow-sm overflow-hidden">
        
        {/* Top Split Area */}
        <div className="flex flex-col lg:flex-row gap-[2px] w-full">
          
          {/* Left Column - Contact Form */}
          <form onSubmit={handleSubmit} className="w-full lg:w-[35%] bg-[#d3dce8] p-6 lg:p-8 flex flex-col text-[#0a2766]">
            <h3 className="text-[24px] lg:text-[28px] font-bold mb-1">Get in Touch with us</h3>
            <p className="text-[#0a2766]/80 text-[14px] mb-5 leading-snug">
              An Xcel Professional will contact you at the earliest.
            </p>
            
            {/* Flush Inputs */}
            <div className="flex flex-col bg-white border-none w-full mb-4">
              <input 
                type="text" 
                placeholder="Name*" 
                value={formData.name} 
                onChange={handleNameChange} 
                onKeyDown={handleNameKeyDown}
                className="w-full bg-transparent border-b border-gray-200 px-4 py-2.5 text-[#0a2766] placeholder-[#8a9bb0] focus:outline-none focus:bg-gray-50 transition-colors text-[16px] sm:text-[13px]" 
                required
              />
              <input 
                type="tel" 
                inputMode="numeric"
                maxLength={10}
                placeholder="Contact No.*" 
                value={formData.contact} 
                onChange={handleContactChange} 
                onKeyDown={handleContactKeyDown}
                className="w-full bg-transparent border-b border-gray-200 px-4 py-2.5 text-[#0a2766] placeholder-[#8a9bb0] focus:outline-none focus:bg-gray-50 transition-colors text-[16px] sm:text-[13px]" 
                required
              />
              <input 
                type="email" 
                placeholder="Email Address*" 
                value={formData.email} 
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} 
                className="w-full bg-transparent border-b border-gray-200 px-4 py-2.5 text-[#0a2766] placeholder-[#8a9bb0] focus:outline-none focus:bg-gray-50 transition-colors text-[16px] sm:text-[13px]" 
                required
              />
              <div className="relative w-full">
                <select 
                  value={formData.state} 
                  onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))} 
                  className={`w-full bg-transparent border-b border-gray-200 px-4 py-2.5 focus:outline-none focus:bg-gray-50 transition-colors text-[16px] sm:text-[13px] appearance-none cursor-pointer ${formData.state === '' ? 'text-[#8a9bb0]' : 'text-[#0a2766]'}`}
                  required
                >
                  <option value="" disabled className="text-[#8a9bb0]">Select State/UT*</option>
                  {indianStatesAndUTs.map((state) => (
                    <option key={state} value={state} className="text-[#0a2766]">{state}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8a9bb0]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              <textarea 
                rows={2} 
                placeholder="Message" 
                value={formData.message} 
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))} 
                className="w-full bg-transparent px-4 py-2.5 text-[#0a2766] placeholder-[#8a9bb0] focus:outline-none focus:bg-gray-50 transition-colors resize-none text-[16px] sm:text-[13px]"
              ></textarea>
            </div>
            
            {/* Checkboxes */}
            <div className="mt-1 mb-6">
              <p className="text-[#0a2766] mb-2 text-[13px]">Area of Interest</p>
              <div className="flex flex-wrap gap-5 mb-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="interest" value="Sales" checked={formData.interest === 'Sales'} onChange={(e) => setFormData((prev) => ({ ...prev, interest: e.target.value }))} className="w-3.5 h-3.5 accent-[#002d73] cursor-pointer" />
                  <span className="text-[#0a2766] text-[13px] font-medium">Sales</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="interest" value="Services" checked={formData.interest === 'Services'} onChange={(e) => setFormData((prev) => ({ ...prev, interest: e.target.value }))} className="w-3.5 h-3.5 accent-[#002d73] cursor-pointer" />
                  <span className="text-[#0a2766] text-[13px] font-medium">Services</span>
                </label>
              </div>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.acceptedPolicy} onChange={(e) => setFormData((prev) => ({ ...prev, acceptedPolicy: e.target.checked }))} className="w-3.5 h-3.5 mt-0.5 accent-[#002d73] cursor-pointer shrink-0" required />
                <span className="text-[#0a2766] text-[13px] leading-tight">By checking this box I accept the <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-[#001f54]">Privacy Policy</a></span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-1/2 mx-auto bg-[#002d73] hover:bg-[#001f54] text-white font-medium text-[14px] py-2.5 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
            </button>
          </form>

          {/* Right Column - Info & Links (Grid of white gaps) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-[2px] bg-white">
            
            {/* Section 1: Corporate Office & About */}
            <div className="flex flex-col md:flex-row gap-[2px] h-auto">
              <div className="flex-1 bg-[#3b5e94] p-6 text-white">
                <h4 className="text-[16px] font-semibold mb-3">Our Corporate Office</h4>
                <p className="text-white/90 leading-relaxed text-[13px]">
                  Xcel Stiro Private Limited<br />
                  Plot No. 70, Sector 27C,<br />
                  Faridabad, Haryana 121003, India<br /><br />
                  sales@xcelstiro.com
                </p>
              </div>
              
              {/* Image spacer block */}
              <div className="hidden md:block w-[120px] relative overflow-hidden bg-[#3b5e94]/20">
                <Image 
                  src="/Footer Image - 120 x 210 px (1).svg" 
                  alt="Commercial Washing Machine" 
                  fill
                  loading="lazy"
                  sizes="120px"
                  className="object-cover" 
                />
              </div>
              
              <div className="flex-1 bg-[#3b5e94] p-6 text-white">
                <h4 className="text-[16px] font-semibold mb-3">About XCEL</h4>
                <p className="text-white/90 leading-relaxed text-[13px]">
                  XCEL has been manufacturing high-performance industrial and commercial laundry equipment since 1994, delivering complete range of machines, backed by a nationwide network of after sales service and support.
                </p>
              </div>
            </div>

            {/* Section 2: Social Icons */}
            <div className="w-full bg-[#3b5e94] py-3 flex justify-center items-center gap-6">
              {/* Facebook Icon */}
              <a 
                href="https://www.facebook.com/profile.php?id=100068674694991" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="text-white hover:text-white/70 transition-colors"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              {/* Instagram Icon */}
              <a 
                href="https://www.instagram.com/xcelstiro?obrf=ZzB3N2s3MHN2dm5m&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="text-white hover:text-white/70 transition-colors"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              {/* YouTube Icon */}
              <a 
                href="https://www.youtube.com/@XcelStiroPrivateLimited" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube"
                className="text-white hover:text-white/70 transition-colors"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              {/* WhatsApp Icon */}
              <a 
                href="https://wa.me/919971025730?text=Hello%2C%20I%20found%20your%20reference%20through%20your%20website%20and%20am%20interested%20in%20purchasing%20Laundry%20Machines.%20Kindly%20connect%20me%20with%20your%20sales%20team%20to%20discuss%20my%20requirements." 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp"
                className="text-white hover:text-white/70 transition-colors"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              </a>
              
            </div>

            {/* Section 3: Links Grid */}
            <div className="w-full bg-[#3b5e94] px-6 py-4 flex flex-col md:flex-row justify-between gap-8 md:gap-4 text-white">
              <div className="flex-1">
                <h5 className="font-semibold text-[14px] mb-3 md:mb-0">
                  <a href="/" className="hover:text-white/80 transition-colors">HOME</a>
                </h5>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-[14px] mb-3 md:mb-3">
                  <a href="/about" className="hover:text-white/80 transition-colors">ABOUT US</a>
                </h5>
                <ul className="flex flex-col gap-2 text-white/80 text-[11px]">
                  <li><a href="/about#our-story" className="hover:text-white transition-colors">OUR STORY</a></li>
                  <li><a href="/about#leadership" className="hover:text-white transition-colors">LEADERSHIP</a></li>
                  <li><a href="/about#vision" className="hover:text-white transition-colors">VISION</a></li>
                </ul>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-[14px] mb-3">
                  <a 
                    href="/products" 
                    onClick={handleProductsHeadingClick}
                    className="hover:text-white/80 transition-colors"
                  >
                    PRODUCTS
                  </a>
                </h5>
                <ul className="flex flex-col gap-2 text-white/80 text-[11px]">
                  <li><a href="/products?category=washing#washing" onClick={(e) => handleProductCategoryClick('washing', e)} className="hover:text-white transition-colors">WASHING</a></li>
                  <li><a href="/products?category=drying#drying" onClick={(e) => handleProductCategoryClick('drying', e)} className="hover:text-white transition-colors">DRYING</a></li>
                  <li><a href="/products?category=apparel-processing#apparel-processing" onClick={(e) => handleProductCategoryClick('apparel-processing', e)} className="hover:text-white transition-colors">APPAREL PROCESSING</a></li>
                  <li><a href="/products?category=dry-cleaning#dry-cleaning" onClick={(e) => handleProductCategoryClick('dry-cleaning', e)} className="hover:text-white transition-colors">DRY-CLEANING</a></li>
                  <li><a href="/products?category=flat-work#flat-work" onClick={(e) => handleProductCategoryClick('flat-work', e)} className="hover:text-white transition-colors">FLAT-WORK</a></li>
                  <li><a href="/products?category=steam-finishing#steam-finishing" onClick={(e) => handleProductCategoryClick('steam-finishing', e)} className="hover:text-white transition-colors">STEAM-FINISHING</a></li>
                  <li><a href="/products?category=water-heater#water-heater" onClick={(e) => handleProductCategoryClick('water-heater', e)} className="hover:text-white transition-colors">WATER HEATER</a></li>
                  <li><a href="/products?category=fabric-checking#fabric-checking" onClick={(e) => handleProductCategoryClick('fabric-checking', e)} className="hover:text-white transition-colors">FABRIC CHECKING</a></li>
                  <li><a href="/products?category=other-equipment#other-equipment" onClick={(e) => handleProductCategoryClick('other-equipment', e)} className="hover:text-white transition-colors">OTHER EQUIPMENT</a></li>
                  <li><a href="/products?category=complete-range#complete-range" onClick={(e) => handleProductCategoryClick('complete-range', e)} className="hover:text-white transition-colors">COMPLETE RANGE</a></li>
                </ul>
              </div>
              <div className="flex-[1.5]">
                <h5 className="font-semibold text-[14px] mb-3">
                  <a 
                    href="/blogs" 
                    onClick={handleBlogsHeadingClick}
                    className="hover:text-white/80 transition-colors"
                  >
                    INDUSTRY INSIGHTS
                  </a>
                </h5>
                <ul className="flex flex-col gap-2 text-white/80 text-[11px]">
                  <li>
                    <a 
                      href="/blogs" 
                      onClick={(e) => handleBlogCategoryClick('all', e)}
                      className="hover:text-white transition-colors block uppercase leading-snug"
                    >
                      ALL
                    </a>
                  </li>
                  {blogCategories
                    .filter((cat) => cat.toLowerCase() !== 'all')
                    .map((cat) => (
                      <li key={cat}>
                        <a 
                          href={`/blogs?category=${encodeURIComponent(cat)}`} 
                          onClick={(e) => handleBlogCategoryClick(cat, e)}
                          className="hover:text-white transition-colors block uppercase leading-snug"
                        >
                          {cat}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-[14px] mb-3">
                  <a href="/contact" className="hover:text-white/80 transition-colors">CONTACT US</a>
                </h5>
              </div>
            </div>

            {/* Section 4: Certifications & Badges */}
            <div className="w-full bg-[#002d73] py-6 sm:py-8 px-6 flex justify-center items-center gap-6 sm:gap-10 lg:gap-16 flex-wrap">
              <img src="/Logo/ISO_9001_2008_Certification_at_%E2%82%B9_5000_certificate_in_New_Delhi_ID_22229167830_indiamart%201.webp" alt="ISO Certification" loading="lazy" decoding="async" className="h-8 sm:h-12 w-auto object-contain grayscale invert contrast-125 mix-blend-screen opacity-90 hover:opacity-100 transition-all duration-300" />
              <img src="/Logo/How_to_get_a_CE_Certification_-_tradesnest%201.webp" alt="CE Certification" loading="lazy" decoding="async" className="h-8 sm:h-12 w-auto object-contain grayscale invert contrast-125 mix-blend-screen opacity-90 hover:opacity-100 transition-all duration-300" />
              <img src="/Logo/Make_in_India_Logo_PNG_Vector_(EPS)_Free_Download_seeklogo%201.webp" alt="Make in India" loading="lazy" decoding="async" className="h-12 sm:h-16 w-auto object-contain grayscale invert contrast-125 mix-blend-screen opacity-90 hover:opacity-100 transition-all duration-300" />
              <img src="/Logo/What_is_NSIC_Online_Finance_Facilitation_Centres_(FFCs)_luxefinalyzer%201..webp" alt="NSIC" loading="lazy" decoding="async" className="h-6 sm:h-8 w-auto object-contain grayscale invert contrast-125 mix-blend-screen opacity-90 hover:opacity-100 transition-all duration-300" />
              <img src="/Logo/Our_Certifications_acquafrasassi%201.webp" alt="Certifications" loading="lazy" decoding="async" className="h-8 sm:h-12 w-auto object-contain grayscale invert contrast-125 mix-blend-screen opacity-90 hover:opacity-100 transition-all duration-300" />
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full bg-[#002d73] px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row justify-between items-center gap-3 text-center lg:text-left border-t border-white/10">
          <div className="text-white font-semibold text-[11px] sm:text-[13px] lg:text-[14px] tracking-wide">
            XCEL STIRO PRIVATE LIMITED. ALL RIGHTS RESERVED
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-[11px] sm:text-[12px] font-semibold tracking-wide text-white">
            <a href="/privacy" className="hover:text-white/70 transition-colors">PRIVACY POLICY</a>
            <a href="/terms" className="hover:text-white/70 transition-colors">TERMS OF SERVICE</a>
            <a href="/sitemap" className="hover:text-white/70 transition-colors">SITEMAP</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
