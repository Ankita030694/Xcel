"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MissionVisionSection } from '../components/MissionVisionSection';
import Image from 'next/image';


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      {/* About Us Hero Section (Image Banner) */}
      <section className="relative w-full h-auto flex flex-col items-center justify-center bg-white overflow-hidden pt-0 pb-0">
        <img 
          src="/banners/about-us-banner.webp" 
          alt="About Us Banner" 
          className="w-full h-auto block"
          style={{ aspectRatio: '1600/600' }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </section>

      {/* Our Story Section - New Layout */}
      <section id="our-story" className="scroll-mt-[90px] relative pt-12 lg:pt-14 pb-10 lg:pb-12 px-4 sm:px-6 lg:px-10 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-[100px] mb-2 relative z-10 px-4 lg:px-8 items-start">
            {/* Left Column: Vertical Stats */}
            <div className="w-full lg:w-[250px] shrink-0 flex flex-col gap-4 lg:gap-[35px] order-2 lg:order-1">
              {/* Tagline (Desktop) */}
              <div className="hidden lg:flex items-center gap-2 mb-2">
                <span className="text-[#32589c] font-bold text-[11px] md:text-[10px] lg:text-sm tracking-widest animate-pulse">{"//"}</span>
                <span className="text-[#32589c] font-bold text-[11px] md:text-[10px] lg:text-sm tracking-[0.2em] uppercase">OUR STORY</span>
              </div>

              <div className="grid grid-cols-2 gap-6 lg:grid-cols-1 lg:gap-[35px]">
                <div className="flex flex-col items-start text-left gap-1">
                  <h3 className="text-[36px] sm:text-[42px] font-bold text-[#0a2766] leading-none">
                    30,000+
                  </h3>
                  <div className="w-12 h-[2px] bg-[#32589c] opacity-30 my-1"></div>
                  <p className="text-[#32589c] text-[13px] sm:text-[14px] font-semibold leading-tight max-w-[180px]">
                    Machines Installed Across India
                  </p>
                </div>
                
                <div className="flex flex-col items-start text-left gap-1">
                  <h3 className="text-[36px] sm:text-[42px] font-bold text-[#0a2766] leading-none">
                    8,000+
                  </h3>
                  <div className="w-12 h-[2px] bg-[#32589c] opacity-30 my-1"></div>
                  <p className="text-[#32589c] text-[13px] sm:text-[14px] font-semibold leading-tight max-w-[180px]">
                    Happy Clients & Counting
                  </p>
                </div>
                
                <div className="flex flex-col items-start text-left gap-1">
                  <h3 className="text-[36px] sm:text-[42px] font-bold text-[#0a2766] leading-none">
                    32+
                  </h3>
                  <div className="w-12 h-[2px] bg-[#32589c] opacity-30 my-1"></div>
                  <p className="text-[#32589c] text-[13px] sm:text-[14px] font-semibold leading-tight max-w-[180px]">
                    Years of Manufacturing Excellence
                  </p>
                </div>
                
                <div className="flex flex-col items-start text-left gap-1">
                  <h3 className="text-[36px] sm:text-[42px] font-bold text-[#0a2766] leading-none">
                    100%
                  </h3>
                  <div className="w-12 h-[2px] bg-[#32589c] opacity-30 my-1"></div>
                  <p className="text-[#32589c] text-[13px] sm:text-[14px] font-semibold leading-tight max-w-[180px]">
                    Made in India
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content: Title & Text */}
            <div className="w-full lg:flex-1 flex flex-col gap-4 lg:gap-8 relative z-10 pt-0 lg:pt-16 order-1 lg:order-2">
              {/* Tagline (Mobile) */}
              <div className="flex lg:hidden items-center gap-2 -mb-2">
                <span className="text-[#32589c] font-bold text-[11px] md:text-[10px] lg:text-sm tracking-widest animate-pulse">{"//"}</span>
                <span className="text-[#32589c] font-bold text-[11px] md:text-[10px] lg:text-sm tracking-[0.2em] uppercase">OUR STORY</span>
              </div>
              <h2 className="text-[28px] sm:text-[32px] lg:text-[38px] xl:text-[42px] font-bold text-[#0a2766] leading-[1.15] tracking-tight">
                The People, Purpose and Engineering behind XCEL
              </h2>
              <div className="mt-2 md:mt-4 lg:mt-8 text-[#363636] font-normal text-sm sm:text-base lg:text-[17px] leading-[1.65] space-y-6 max-w-[850px]">
                <p>
                  Our journey began with a simple conviction that Indian businesses deserve world-class laundry equipment, designed and manufactured right here at home. Built under the Make in India initiative, XCEL operates from a 20,000 sq. ft. manufacturing facility where every machine is engineered to meet international quality and performance standards.
                </p>
                <p>
                  Rather than simply assembling components, we design, fabricate and manufacture complete commercial laundry solutions from the ground up. Today, our machines power hotels, NABH-accredited hospitals, garment manufacturers, commercial laundries and retail laundry businesses across India delivering reliable performance tailored to the unique demands of every industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section - Stacked Layout */}
      <section className="pt-10 lg:pt-16 px-4 sm:px-6 lg:px-10 bg-[#f8f9fa] border-t border-gray-100 pb-10 lg:pb-16">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Section Header */}
          <div id="leadership" className="scroll-mt-[130px] text-center mb-4 lg:mb-6 relative z-20 bg-[#f8f9fa] py-2 lg:py-4">
             <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a2766] tracking-tight mb-2 lg:mb-4">
                Two Generations. <br className="sm:hidden" />
                <span className="text-[#32589c] font-serif italic font-light">One Vision.</span>
             </h2>
          </div>

          {/* Content Area */}
          <div className="flex flex-col gap-12 sm:gap-16 lg:gap-16 relative">
             
             {/* Generation 1: Father */}
             <div className="relative z-0">
                <div className="group flex flex-col lg:flex-row items-center gap-8 lg:gap-12 bg-white p-6 lg:py-8 lg:px-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 border border-gray-50 transition-all duration-500 ease-out">
                   
                   {/* Image */}
                   <div className="w-full sm:w-[75%] md:w-[55%] lg:w-[45%] overflow-hidden rounded-2xl">
                      <div className="bg-[#e0e4eb] relative overflow-hidden rounded-2xl shadow-inner group-hover:scale-[1.02] transition-transform duration-700 ease-out">
                         <img src="/Deepak New .webp" alt="Deepak Chawla" loading="lazy" decoding="async" className="w-full h-auto block" />
                      </div>
                   </div>
                   
                   {/* Text */}
                   <div className="w-full lg:w-[55%]">
                      <h3 className="text-3xl font-serif text-[#0a2766] mb-2 flex items-center gap-4">
                         <span className="italic">Founders Note</span>
                         <span className="w-12 h-px bg-[#32589c] opacity-50"></span>
                      </h3>
                      
                      <div className="space-y-5 text-[15px] leading-[1.8] text-[#363636] font-light">
                          <p>When we started this journey, our vision was simple to build industrial washing machines that Indian businesses could trust. Seeing our machines perform reliably in hotels, hospitals and manufacturing facilities across the country is a reflection of the confidence our customers place in us every day.</p>
                          <p className="pl-4 border-l-2 border-[#32589c]">As technology evolves, we remain committed to innovation, quality and long-term value. Our focus continues to be on delivering durable, efficient and dependable solutions that help our customers operate with confidence and grow sustainably.</p>
                       </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                         <div>
                            <p className="text-2xl font-serif text-[#32589c] italic leading-none mb-1.5">Deepak Chawla</p>
                            <p className="text-[10.5px] font-bold tracking-widest text-[#0a2766] uppercase">Managing Director</p>
                         </div>
                      </div>
                   </div>

                </div>
             </div>

             {/* Generation 2: Son */}
             <div className="relative z-10">
                <div className="group flex flex-col lg:flex-row items-center gap-8 lg:gap-12 bg-white p-6 lg:py-8 lg:px-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-2 border border-gray-50 transition-all duration-500 ease-out">
                   
                   {/* Image */}
                   <div className="w-full sm:w-[75%] md:w-[55%] lg:w-[45%] overflow-hidden rounded-2xl">
                      <div className="bg-[#e0e4eb] relative overflow-hidden rounded-2xl shadow-inner group-hover:scale-[1.02] transition-transform duration-700 ease-out">
                         <img src="/Mehul New.webp" alt="Mehul Chawla" loading="lazy" decoding="async" className="w-full h-auto block" />
                      </div>
                   </div>
                   
                   {/* Text */}
                   <div className="w-full lg:w-[55%]">
                      <h3 className="text-3xl font-serif text-[#0a2766] mb-2 flex items-center gap-4">
                         <span className="italic">Rooted in Legacy</span>
                         <span className="w-12 h-px bg-[#32589c] opacity-50"></span>
                      </h3>
                      
                      <div className="space-y-5 text-[15px] leading-[1.8] text-[#363636] font-light">
                          <p>My father built this company with a simple belief that success comes from earning trust, not just selling machines. Growing up, I watched him build lasting relationships with customers and learned that our real product has always been reliability, service and commitment.</p>
                          <p className="pl-4 border-l-2 border-[#32589c]">As the second generation leading this journey forward, my focus is on preserving those values while embracing the future. With advancements in automation, energy efficiency and smart technologies, we continue to innovate so our clients can operate with confidence. This company was built on trust and my commitment is to keep strengthening that trust for generations to come.</p>
                       </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                         <div>
                            <p className="text-2xl font-serif text-[#32589c] italic leading-none mb-1.5">Mehul Chawla</p>
                            <p className="text-[10.5px] font-bold tracking-widest text-[#0a2766] uppercase">Executive Director</p>
                         </div>
                      </div>
                   </div>

                 </div>
             </div>

          </div>
        </div>
      </section>

      <DraggableTimeline />
      <div id="vision" className="scroll-mt-[124px]">
        <MissionVisionSection />
      </div>

      {/* Footer Section */}
      <Footer />
    </main>
  );
}

const timelineEvents = [
  { year: "1994", text: "Founded with a vision to redefine Laundry industry machinery through uncompromising quality and precision manufacturing.", position: "bottom" },
  { year: "1998", text: "Expansion into Garment Industry by being a trusted laundry and drying equipment manufacturer and supplier. Opened an office in Tiruppur, Tamil Nadu.", position: "top" },
  { year: "2002", text: "We expanded our manufacturing infrastructure by developing a 20,000 sq. ft. plant in Faridabad to support scaling operations.", position: "bottom" },
  { year: "2008", text: "Successfully completed 100 PERC dry cleaning machine installations across India, significantly expanding our national customer footprint.", position: "top" },
  { year: "2014", text: "Celebrating 20 years of excellence, we reached a milestone of 3,500 customers across India and successfully launched our international export operations for laundry machinery.", position: "bottom" },
  { year: "2019", text: "Pioneered the launch of India's first integrated 3-in-1 laundry solution, seamlessly combining washing, extraction, and drying within a single high-efficiency unit.", position: "top" },
  { year: "2025", text: "Celebrating three decades of excellence, we surpassed a milestone of 7,500 customers PAN India and reached over 700 PERC dry cleaning machine installations nationwide.", position: "bottom" }
];
// Duplicate for seamless looping
const duplicatedEvents = [...timelineEvents, ...timelineEvents, ...timelineEvents];

function DraggableTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchPaused, setIsTouchPaused] = useState(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if viewport is mobile or tablet/iPad (<= 1024px)
  const isMobileOrTablet = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 1024;
  };

  const triggerMobilePause = () => {
    if (!isMobileOrTablet()) return;
    setIsTouchPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      setIsTouchPaused(false);
      resumeTimerRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    let animationId: number;
    const scroll = () => {
      if (scrollRef.current && !isHovered && !isDragging && !isTouchPaused) {
        scrollRef.current.scrollLeft += 1;
        
        // Endless loop logic
        const totalWidth = scrollRef.current.scrollWidth;
        const segmentWidth = totalWidth / 3;
        
        if (scrollRef.current.scrollLeft >= segmentWidth * 2) {
          scrollRef.current.scrollLeft = segmentWidth;
        } else if (scrollRef.current.scrollLeft <= 0) {
          scrollRef.current.scrollLeft = segmentWidth;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered, isDragging, isTouchPaused]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  // Start in the middle segment
  useEffect(() => {
     if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3;
     }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobileOrTablet()) {
      triggerMobilePause();
    }
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (isMobileOrTablet()) {
      triggerMobilePause();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseEnter = () => {
    // Only pause on hover on desktop screens (> 1024px)
    if (!isMobileOrTablet()) {
      setIsHovered(true);
    }
  };

  const handleTouchStart = () => {
    if (isMobileOrTablet()) {
      setIsTouchPaused(true);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    }
  };

  const handleTouchMove = () => {
    if (isMobileOrTablet()) {
      setIsTouchPaused(true);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    }
  };

  const handleTouchEnd = () => {
    if (isMobileOrTablet()) {
      triggerMobilePause();
    }
  };

  const handleClick = () => {
    if (isMobileOrTablet()) {
      triggerMobilePause();
    }
  };

  return (
    <section className="pt-10 lg:pt-12 pb-12 bg-white border-t border-gray-100 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#32589c] tracking-tight mb-4 transition-transform duration-500 hover:scale-105">
              The Evolution of Laundry Excellence
            </h2>
            <div className="flex items-center justify-center gap-1.5 opacity-80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#32589c]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#32589c]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#32589c]"></span>
              <span className="w-16 h-[2px] rounded-full bg-[#32589c] ml-1"></span>
            </div>
          </div>
        </div>

        <div 
          className="w-full overflow-x-auto custom-scrollbar cursor-grab active:cursor-grabbing select-none pb-6"
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onClick={handleClick}
        >
          <div className="flex w-max relative py-12">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-[6px] bg-[#1e448a] transform -translate-y-1/2 shadow-[0_0_15px_rgba(30,68,138,0.3)] pointer-events-none"></div>
            
            {duplicatedEvents.map((event, index) => (
               <div key={index} className="w-[320px] lg:w-[400px] flex-shrink-0 group relative px-6 h-[400px] flex flex-col justify-center">
                  
                  {/* Dot */}
                  <div className="absolute top-1/2 left-6 w-[20px] h-[20px] bg-white border-[4px] border-[#32589c] rounded-full transform -translate-y-1/2 z-20 group-hover:scale-[1.6] group-hover:bg-[#32589c] transition-all duration-300 shadow-md"></div>
                  
                  {event.position === 'bottom' ? (
                    <>
                       {/* Top empty space to center the line */}
                       <div className="h-[150px] w-full relative flex items-end pb-4">
                          {/* Year Above */}
                          <span className="text-[40px] lg:text-[46px] font-black text-black tracking-tight group-hover:text-[#32589c] group-hover:-translate-y-2 transition-all duration-300">
                            {event.year}
                          </span>
                       </div>
                       {/* Line space */}
                       <div className="h-0 w-full relative">
                          <div className="absolute top-0 left-[8px] w-[1.5px] h-[100px] bg-[#cbd5e1] group-hover:bg-[#32589c] group-hover:h-[120px] z-10 transition-all duration-300"></div>
                       </div>
                       {/* Bottom text */}
                       <div className="h-[150px] w-full pt-[120px] pl-[20px]">
                          <p className="text-[13.5px] leading-[1.7] text-black font-medium group-hover:translate-y-2 group-hover:scale-105 origin-top-left transition-all duration-300 w-[260px]">
                            {event.text}
                          </p>
                       </div>
                    </>
                  ) : (
                    <>
                       {/* Top text */}
                       <div className="h-[150px] w-full relative flex items-start flex-col justify-end pb-[120px] pl-[20px]">
                          <p className="text-[13.5px] leading-[1.7] text-black font-medium group-hover:-translate-y-2 group-hover:scale-105 origin-bottom-left transition-all duration-300 w-[260px]">
                            {event.text}
                          </p>
                       </div>
                       {/* Line space */}
                       <div className="h-0 w-full relative">
                          <div className="absolute bottom-0 left-[8px] w-[1.5px] h-[100px] bg-[#cbd5e1] group-hover:bg-[#32589c] group-hover:h-[120px] z-10 transition-all duration-300"></div>
                       </div>
                       {/* Bottom Year */}
                       <div className="h-[150px] w-full pt-4">
                          <span className="text-[40px] lg:text-[46px] font-black text-black tracking-tight group-hover:text-[#32589c] group-hover:translate-y-2 transition-all duration-300">
                            {event.year}
                          </span>
                       </div>
                    </>
                  )}
               </div>
            ))}
          </div>
        </div>
    </section>
  );
}
