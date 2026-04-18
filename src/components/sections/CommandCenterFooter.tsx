'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CommandCenterFooter() {
  const [timeLeft, setTimeLeft] = useState({ days: 30, hours: 0, minutes: 0, seconds: 0 });
  const [serial, setSerial] = useState("AD-2026-X99");

  useEffect(() => {
    // Set target date to 30 days from now
    const targetDate = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const generateSerial = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newSerial = 'AD-2026-';
    for (let i = 0; i < 3; i++) {
      newSerial += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSerial(newSerial);
  };

  return (
    <section className="relative w-full min-h-screen bg-[#0B1C10] flex flex-col items-center justify-center overflow-hidden z-20">
      
      {/* Scanline Animation */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20 z-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(212, 240, 96, 0.2) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none h-32 bg-gradient-to-b from-transparent via-[#D4F060]/10 to-transparent mix-blend-screen opacity-50"
        animate={{ y: ['-100vh', '100vh'] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      <div className="z-30 w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* Countdown Timer */}
        <div className="flex space-x-6 md:space-x-12 mb-16 text-[#D4F060] font-mono text-4xl md:text-7xl tracking-widest text-center">
          <div className="flex flex-col items-center w-20 md:w-32">
            <span>{timeLeft.days.toString().padStart(2, '0')}</span>
            <span className="text-[10px] md:text-xs mt-3 opacity-60 tracking-[0.2em]">DAYS</span>
          </div>
          <span className="opacity-50 animate-pulse">:</span>
          <div className="flex flex-col items-center w-20 md:w-32">
            <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-[10px] md:text-xs mt-3 opacity-60 tracking-[0.2em]">HOURS</span>
          </div>
          <span className="opacity-50 animate-pulse">:</span>
          <div className="flex flex-col items-center w-20 md:w-32">
            <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-[10px] md:text-xs mt-3 opacity-60 tracking-[0.2em]">MIN</span>
          </div>
          <span className="opacity-50 animate-pulse">:</span>
          <div className="flex flex-col items-center w-20 md:w-32">
            <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="text-[10px] md:text-xs mt-3 opacity-60 tracking-[0.2em]">SEC</span>
          </div>
        </div>

        {/* PRE-ORDER CTA */}
        <div className="relative group mt-8 w-full md:w-auto mx-auto flex justify-center">
          {/* Heavy glow wrapper behind button so it illuminates surrounding area on hover */}
          <div className="absolute inset-0 bg-[#D4F060] opacity-0 group-hover:opacity-40 blur-[120px] transition-opacity duration-700 pointer-events-none" />
          
          <motion.button
            className="relative w-full md:w-auto px-8 py-6 md:px-24 md:py-10 border border-[#D4F060]/30 bg-[#0B1C10] overflow-hidden rounded-none transition-all duration-500 hover:border-[#D4F060]"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute inset-0 bg-[#D4F060] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 text-4xl md:text-7xl font-sans font-black tracking-[0.3em] uppercase text-white whitespace-nowrap group-hover:text-[#0B1C10] transition-colors duration-500">
              PRE-ORDER
            </span>
          </motion.button>
        </div>

        {/* Social Links */}
        <div className="mt-32 flex flex-wrap justify-center gap-12 md:gap-24 font-mono text-sm tracking-[0.2em]">
          {['LINKEDIN', 'FACEBOOK', 'X'].map((social) => (
            <motion.a
              key={social}
              href="#"
              className="relative text-white/50 hover:text-[#D4F060] transition-colors duration-300 flex items-center pl-10"
              initial="initial"
              whileHover="hover"
            >
              <motion.div 
                className="absolute left-0 w-6 h-6 text-[#D4F060]"
                variants={{
                  initial: { opacity: 0, rotate: -45, scale: 0.5 },
                  hover: { opacity: 1, rotate: 90, scale: 1 }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <path d="M12 2L12 6" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 18L12 22" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 12L6 12" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M18 12L22 12" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </motion.div>
              <span>{social}</span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Footer Meta Data */}
      <div className="absolute bottom-8 left-8 flex items-center font-mono text-xs md:text-sm text-[#D4F060] tracking-[0.2em] z-30">
        <motion.span 
          animate={{ opacity: [1, 0.4, 1] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-2.5 h-2.5 rounded-full bg-[#D4F060] mr-3 shadow-[0_0_12px_#D4F060]" 
        />
        SYSTEM_STATUS: READY_FOR_TAKEOFF
      </div>

      <div 
        className="absolute bottom-8 right-8 font-mono text-xs md:text-sm text-[#D4F060]/50 tracking-[0.2em] z-30 cursor-crosshair hover:text-[#D4F060] transition-colors duration-300"
        onMouseEnter={generateSerial}
      >
        ID: {serial}
      </div>

    </section>
  );
}
