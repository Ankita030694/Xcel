"use client";
import React, { useState } from 'react';
import { Phone, Mail, Clock, ExternalLink, CornerUpRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const indianStatesAndUTs = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    state: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        email: formData.email.trim(),
        state: formData.state,
        message: formData.message.trim(),
        interest: "General Enquiry",
        source: "Contact Page",
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
      });
    } catch (error) {
      console.error("Error submitting contact form: ", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <Header />

      {/* Contact Us Hero Section (Image Banner) */}
      <section className="relative w-full h-auto flex flex-col items-center justify-center bg-white overflow-hidden">
        <img 
          src="/banners/contact-us-banner.webp" 
          alt="Contact Us Banner" 
          className="w-full h-auto block"
          style={{ aspectRatio: '1800/600' }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </section>

      {/* Form & Map Section */}
      <section className="w-full py-10 lg:py-12 px-4 sm:px-8 lg:px-12 flex justify-center bg-white border-b border-gray-100">
        <div className="w-full max-w-[1300px] flex flex-col items-center">
          
          <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left: Form */}
            <div className="w-full lg:w-1/2 flex flex-col">
              
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#32589c] font-bold text-[11px] md:text-[10px] lg:text-sm tracking-widest animate-pulse">{"//"}</span>
                  <span className="text-[#363636] font-bold text-[11px] md:text-[10px] lg:text-sm tracking-[0.2em] uppercase">Get In Touch</span>
                </div>
                <h2 className="text-[36px] sm:text-[44px] font-black text-[#000] leading-[1.15] mb-4 tracking-tight">
                  Let's Start the<br/><span className="text-[#32589c]">Conversation</span>
                </h2>
                <div className="w-full h-px bg-gray-200 mb-6"></div>
                <p className="text-[#363636] text-[19px] leading-relaxed max-w-[90%]">
                  Whether you're planning a new laundry facility, upgrading your existing setup or looking for genuine spare parts, our team is here to help you find the right solution.
                </p>
              </div>

              <form className="flex flex-col" onSubmit={handleSubmit}>
                
                <div className="border border-gray-200 border-b-0 px-4 py-3.5">
                  <input 
                    type="text" 
                    placeholder="Name*" 
                    value={formData.name}
                    onChange={handleNameChange}
                    onKeyDown={handleNameKeyDown}
                    className="w-full bg-transparent text-[16px] sm:text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none" 
                    required 
                  />
                </div>
                
                <div className="border border-gray-200 border-b-0 px-4 py-3.5">
                  <input 
                    type="tel" 
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Contact No.*" 
                    value={formData.contact}
                    onChange={handleContactChange}
                    onKeyDown={handleContactKeyDown}
                    className="w-full bg-transparent text-[16px] sm:text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none" 
                    required 
                  />
                </div>

                <div className="border border-gray-200 border-b-0 px-4 py-3.5">
                  <input 
                    type="email" 
                    placeholder="Email Address*" 
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-transparent text-[16px] sm:text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none" 
                    required 
                  />
                </div>

                <div className="border border-gray-200 bg-blue-50 border-b-0 px-4 py-3.5 relative">
                  <select 
                    value={formData.state} 
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    className={`w-full bg-transparent text-[16px] sm:text-[14px] font-medium focus:outline-none appearance-none cursor-pointer ${formData.state === '' ? 'text-gray-400' : 'text-[#0a2766]'}`} 
                    required
                  >
                    <option value="" disabled className="text-gray-400">Select State/UT*</option>
                    {indianStatesAndUTs.map((state) => (
                      <option key={state} value={state} className="text-gray-800">
                        {state}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-[#0a2766]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                <div className="border border-gray-200 px-4 py-3.5">
                  <textarea 
                    placeholder="Message" 
                    rows={3} 
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-transparent text-[16px] sm:text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="self-start mt-8 bg-[#0a2766] hover:bg-[#001f54] text-white font-medium text-[12px] tracking-wider uppercase py-3.5 px-16 rounded transition-colors shadow-lg shadow-[#0a2766]/20 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                </button>
              </form>
            </div>

            {/* Right: Map */}
            <div className="w-full lg:w-1/2 flex flex-col min-h-[400px]">
              <div className="w-full h-full relative bg-gray-50 border border-gray-100 overflow-hidden">
                <iframe 
                  src="https://maps.google.com/maps?q=Xcel%20Stiro%20Private%20Limited&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, position: 'absolute', inset: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Xcel Corporate Office Map"
                ></iframe>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Office Locations Section */}
      <section className="w-full pt-16 lg:pt-20 pb-8 px-4 sm:px-8 lg:px-12 flex justify-center bg-[#f8f9fa] relative">
        <div className="w-full max-w-[1300px] flex flex-col">
          
          <div className="text-center mb-16 flex flex-col items-center">
            <h4 className="text-[#32589c] font-bold text-[14px] sm:text-[16px] tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-2">
              <span className="animate-pulse">//</span> OUR LOCATIONS
            </h4>
            <p className="text-[#363636] text-[16px] sm:text-[18px] leading-relaxed max-w-2xl">
              Our facilities and support network ensure quality products and reliable assistance, wherever you are.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            
            {/* Left: India Map Graphic */}
            <div className="w-full lg:w-[45%] flex items-start justify-center pt-4 overflow-visible">
              <div className="relative w-full max-w-[600px] transition-all duration-500 ease-in-out group cursor-default">
                <img src="/india-map.svg" alt="India Map" loading="lazy" decoding="async" className="w-full h-auto drop-shadow-sm opacity-80 group-hover:opacity-100 group-hover:drop-shadow-lg transition-all duration-500" />
                
                {/* Faridabad Pin (Haryana) */}
                <div className="absolute top-[32%] left-[34%] flex flex-col items-center -translate-x-1/2 -translate-y-full group cursor-pointer z-10">
                  <div className="bg-white border border-gray-100 text-[#0a2766] text-[11px] font-bold py-1.5 px-3 rounded-full mb-1 opacity-100 shadow-[0_4px_10px_rgba(0,0,0,0.1)] whitespace-nowrap">
                    Faridabad, Haryana
                  </div>
                  <svg className="w-8 h-8 text-[#32589c] drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </div>

                {/* Tiruppur Pin (Tamil Nadu) */}
                <div className="absolute top-[86%] left-[38%] flex flex-col items-center -translate-x-1/2 -translate-y-full group cursor-pointer z-10">
                  <div className="bg-white border border-gray-100 text-[#0a2766] text-[11px] font-bold py-1.5 px-3 rounded-full mb-1 opacity-100 shadow-[0_4px_10px_rgba(0,0,0,0.1)] whitespace-nowrap">
                    Tiruppur, Tamil Nadu
                  </div>
                  <svg className="w-8 h-8 text-[#32589c] drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </div>
              </div>
            </div>

            {/* Right: Location Cards (Stacked) */}
            <div className="w-full lg:w-[55%] flex flex-col gap-6">
              
              {/* Card 1: Corporate Office (Swapped to Faridabad Text) */}
              <div className="bg-white rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100 p-8 flex flex-col sm:flex-row gap-8">
                
                <div className="flex-1">
                  <h3 className="text-[#32589c] font-bold text-[18px] mb-4">Corporate Office and Manufacturing Plant</h3>
                  
                  <div className="flex flex-col gap-1 text-[15px] text-[#363636] leading-relaxed mb-6">
                    <p>Plot 70, Sector 27C,</p>
                    <p>Faridabad, Haryana 121003, India</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <a href="https://maps.google.com/?q=Xcel+Stiro+Private+Limited,+Faridabad" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white text-[#0a2766] font-semibold text-[13px] py-2 px-4 rounded-md border border-[#0a2766] hover:bg-gray-50 transition-colors">
                      <ExternalLink className="w-4 h-4 text-[#0a2766]" strokeWidth={2} />
                      View on Map
                    </a>
                    <a href="https://www.google.com/maps/dir//Xcel+Stiro+Private+Limited,+Plot+70,+Sector+27C,+Faridabad,+Haryana+121003" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white text-[#0a2766] font-semibold text-[13px] py-2 px-4 rounded-md border border-[#0a2766] hover:bg-gray-50 transition-colors">
                      <CornerUpRight className="w-4 h-4 text-[#0a2766]" strokeWidth={2} />
                      Get Directions
                    </a>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-[#32589c] shrink-0 mt-[3px]" />
                    <div className="flex flex-col gap-1 text-[15px] text-[#363636]">
                      <a href="tel:+911294155713" className="hover:text-[#0a2766] transition-colors">+91 129-4155713</a>
                      <a href="tel:+911294155714" className="hover:text-[#0a2766] transition-colors">+91 129-4155714</a>
                      <a href="tel:+919971025730" className="hover:text-[#0a2766] transition-colors">+91 9971025730</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-[#32589c] shrink-0 mt-[3px]" />
                    <div className="flex flex-col gap-1 text-[15px] text-[#363636]">
                      <a href="mailto:sales@xcelstiro.com" className="hover:text-[#0a2766] transition-colors">sales@xcelstiro.com</a>
                      <a href="mailto:servicing@xcelstiro.com" className="hover:text-[#0a2766] transition-colors">servicing@xcelstiro.com</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-[#32589c] shrink-0 mt-[3px]" />
                    <div className="flex flex-col gap-1 text-[15px] text-[#363636]">
                      <p>Mon – Sat: 8:30 AM – 5:30 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Card 2: Regional Office (Swapped to Tamil Nadu Text) */}
              <div className="bg-white rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100 p-8 flex flex-col sm:flex-row gap-8">
                
                <div className="flex-1">
                  <h3 className="text-[#32589c] font-bold text-[18px] mb-4">Regional Office</h3>
                  
                  <div className="flex flex-col gap-1 text-[15px] text-[#363636] leading-relaxed mb-6">
                    <p>Xcel Stiro Private Limited, 12/26,</p>
                    <p>PN Rd, Laxmi Nagar, New Extn,</p>
                    <p>Tiruppur, Tamil Nadu 641602, India</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <a href="https://maps.app.goo.gl/RUYUMMWdM2pL91an9" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white text-[#0a2766] font-semibold text-[13px] py-2 px-4 rounded-md border border-[#0a2766] hover:bg-gray-50 transition-colors">
                      <ExternalLink className="w-4 h-4 text-[#0a2766]" strokeWidth={2} />
                      View on Map
                    </a>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=Xcel+Stiro+Private+Limited,+12%2F26,+PN+Rd,+Laxmi+Nagar,+New+Extn,+Tiruppur,+Tamil+Nadu+641602,+India" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white text-[#0a2766] font-semibold text-[13px] py-2 px-4 rounded-md border border-[#0a2766] hover:bg-gray-50 transition-colors">
                      <CornerUpRight className="w-4 h-4 text-[#0a2766]" strokeWidth={2} />
                      Get Directions
                    </a>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-[#32589c] shrink-0 mt-[3px]" />
                    <div className="flex flex-col gap-1 text-[15px] text-[#363636]">
                      <a href="tel:+917428087070" className="hover:text-[#0a2766] transition-colors">+91 7428087070</a>
                      <a href="tel:+918438067251" className="hover:text-[#0a2766] transition-colors">+91 8438067251</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-[#32589c] shrink-0 mt-[3px]" />
                    <div className="flex flex-col gap-1 text-[15px] text-[#363636]">
                      <a href="mailto:tirupur@xcelstiro.com" className="hover:text-[#0a2766] transition-colors">tirupur@xcelstiro.com</a>
                      <a href="mailto:sales@xcelstiro.com" className="hover:text-[#0a2766] transition-colors">sales@xcelstiro.com</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-[#32589c] shrink-0 mt-[3px]" />
                    <div className="flex flex-col gap-1 text-[15px] text-[#363636]">
                      <p>Mon – Sat: 9:30 AM – 7:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
