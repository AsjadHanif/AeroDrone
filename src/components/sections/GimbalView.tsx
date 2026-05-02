'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function GimbalView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 30 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Translate by +/- 40px
  const translateX = useTransform(smoothX, [-1, 1], [40, -40]);
  const translateY = useTransform(smoothY, [-1, 1], [40, -40]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    // Normalize to -1 to 1
    const x = (e.clientX - left) / width * 2 - 1;
    const y = (e.clientY - top) / height * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#0B1C10]"
    >
      {/* Background Image Parallax */}
      <motion.div
        className="absolute -inset-[100px] pointer-events-none"
        style={{ x: translateX, y: translateY }}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/flight-landscape.jpeg)' }}
        />
      </motion.div>

      {/* Lens Effect - Vignette & Blur edges */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] backdrop-blur-[2px] [mask-image:radial-gradient(circle_at_center,transparent_30%,black_100%)] z-10" />

      {/* Edge Chromatic Aberration */}
      <div className="absolute inset-0 pointer-events-none z-10 [mask-image:radial-gradient(circle_at_center,transparent_40%,black_100%)]">
        <div className="absolute inset-0 border-[4px] border-red-500/10 mix-blend-screen -ml-1 scale-[1.01]" />
        <div className="absolute inset-0 border-[4px] border-cyan-500/10 mix-blend-screen ml-1 scale-[1.01]" />
      </div>

      {/* Text HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 md:p-16 text-[#0B1C10]/60 font-sans tracking-[0.2em] text-[10px] md:text-xs font-semibold">
        {/* Top HUD */}
        <div className="flex justify-between items-start pt-4 md:pt-8 pb-4">
          <div className="flex flex-col gap-1 md:gap-2">
            <div className="flex items-center gap-2 aberration-text text-[#0B1C10] font-bold">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>REC</span>
            </div>
            <span>STB {"//"} ACTIVE</span>
          </div>
          <div className="text-right flex flex-col gap-1 md:gap-2">
            <span className="aberration-text text-[#0B1C10] font-bold">ALT: 120M</span>
            <span>HDG: 045°</span>
          </div>
        </div>

        {/* Bottom HUD */}
        <div className="flex justify-between items-end pb-4 md:pb-8 pt-4">
          <div>
            <span>F/2.8</span>
            <span className="mx-1 md:mx-2">{"///"}</span>
            <span>ISO 100</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-12 md:w-24 h-[1px] bg-[#0B1C10]/20 relative hidden sm:block">
              <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-4 h-[2px] bg-[#0B1C10]/60" />
            </div>
            <span className="aberration-text text-[#0B1C10] font-bold">SPD: 45KM/H</span>
          </div>
        </div>
      </div>

      {/* Static SVG Viewfinder Overlay - Corners */}
      <svg className="absolute top-0 left-0 w-32 h-32 pointer-events-none z-20 stroke-[#0B1C10]/60 opacity-60" fill="none">
        <path d="M 20 40 L 20 20 L 40 20" className="md:hidden" strokeWidth="2" />
        <path d="M 40 80 L 40 40 L 80 40" className="hidden md:block" strokeWidth="2" />
      </svg>
      <svg className="absolute top-0 right-0 w-32 h-32 pointer-events-none z-20 stroke-[#0B1C10]/60 opacity-60" fill="none">
        <path d="M 108 40 L 108 20 L 88 20" className="md:hidden" strokeWidth="2" />
        <path d="M 88 80 L 88 40 L 48 40" className="hidden md:block" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none z-20 stroke-[#0B1C10]/60 opacity-60" fill="none">
        <path d="M 20 88 L 20 108 L 40 108" className="md:hidden" strokeWidth="2" />
        <path d="M 40 48 L 40 88 L 80 88" className="hidden md:block" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none z-20 stroke-[#0B1C10]/60 opacity-60" fill="none">
        <path d="M 108 88 L 108 108 L 88 108" className="md:hidden" strokeWidth="2" />
        <path d="M 88 48 L 88 88 L 48 88" className="hidden md:block" strokeWidth="2" />
      </svg>

      {/* Static SVG Viewfinder Overlay - Center */}
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 overflow-visible pointer-events-none z-20 stroke-[#0B1C10]/60 opacity-60" fill="none">
        {/* Center Crosshair System */}
        <circle cx="0" cy="0" r="80" className="md:hidden" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
        <circle cx="0" cy="0" r="120" className="hidden md:block" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />

        {/* Horizontal & Vertical Crosshair Lines */}
        <path d="M -100 0 L -20 0" className="md:hidden" strokeWidth="1" />
        <path d="M 20 0 L 100 0" className="md:hidden" strokeWidth="1" />
        <path d="M 0 -20 L 0 -100" className="md:hidden" strokeWidth="1" />
        <path d="M 0 20 L 0 100" className="md:hidden" strokeWidth="1" />

        <path d="M -150 0 L -40 0" className="hidden md:block" strokeWidth="1" />
        <path d="M 40 0 L 150 0" className="hidden md:block" strokeWidth="1" />
        <path d="M 0 -40 L 0 -150" className="hidden md:block" strokeWidth="1" />
        <path d="M 0 40 L 0 150" className="hidden md:block" strokeWidth="1" />

        {/* Center Target Point */}
        <circle cx="0" cy="0" r="3" fill="#0B1C10" fillOpacity="0.8" stroke="none" />

        {/* Horizon Indicator Line */}
        <path d="M -150 0 L -100 0" className="md:hidden" strokeWidth="1" opacity="0.3" strokeDasharray="2 4" />
        <path d="M 100 0 L 150 0" className="md:hidden" strokeWidth="1" opacity="0.3" strokeDasharray="2 4" />

        <path d="M -300 0 L -200 0" className="hidden md:block" strokeWidth="1" opacity="0.3" strokeDasharray="2 4" />
        <path d="M 200 0 L 300 0" className="hidden md:block" strokeWidth="1" opacity="0.3" strokeDasharray="2 4" />
      </svg>

      {/* Scope Styles */}
      <style jsx>{`
        .aberration-text {
          text-shadow: 1.5px 0px 0px rgba(255, 0, 0, 0.4), -1.5px 0px 0px rgba(0, 255, 255, 0.4);
        }
      `}</style>
    </section>
  );
}
