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
      <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-8 md:p-16 text-[#0B1C10]/60 font-sans tracking-[0.2em] text-xs font-semibold">
        {/* Top HUD */}
        <div className="flex justify-between items-start pt-8 pb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 aberration-text text-[#0B1C10] font-bold">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>REC</span>
            </div>
            <span>STB // ACTIVE</span>
          </div>
          <div className="text-right flex flex-col gap-2">
            <span className="aberration-text text-[#0B1C10] font-bold">ALT: 120M</span>
            <span>HDG: 045°</span>
          </div>
        </div>

        {/* Bottom HUD */}
        <div className="flex justify-between items-end pb-8 pt-4">
          <div>
            <span>F/2.8</span>
            <span className="mx-2">///</span>
            <span>ISO 100</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 h-[1px] bg-[#0B1C10]/20 relative hidden md:block">
              <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-4 h-[2px] bg-[#0B1C10]/60" />
            </div>
            <span className="aberration-text text-[#0B1C10] font-bold">SPD: 45KM/H</span>
          </div>
        </div>
      </div>

      {/* Static SVG Viewfinder Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 stroke-[#0B1C10]/60 opacity-60" fill="none">
        {/* Corner Brackets */}
        <path d="M 40 80 L 40 40 L 80 40" strokeWidth="2" />
        <path d="M calc(100% - 40px) 80 L calc(100% - 40px) 40 L calc(100% - 80px) 40" strokeWidth="2" />
        <path d="M 40 calc(100% - 80px) L 40 calc(100% - 40px) L 80 calc(100% - 40px)" strokeWidth="2" />
        <path d="M calc(100% - 40px) calc(100% - 80px) L calc(100% - 40px) calc(100% - 40px) L calc(100% - 80px) calc(100% - 40px)" strokeWidth="2" />

        {/* Center Crosshair System */}
        <circle cx="50%" cy="50%" r="120" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />

        {/* Horizontal & Vertical Crosshair Lines */}
        <path d="M calc(50% - 150px) 50% L calc(50% - 40px) 50%" strokeWidth="1" />
        <path d="M calc(50% + 40px) 50% L calc(50% + 150px) 50%" strokeWidth="1" />
        <path d="M 50% calc(50% - 40px) L 50% calc(50% - 150px)" strokeWidth="1" />
        <path d="M 50% calc(50% + 40px) L 50% calc(50% + 150px)" strokeWidth="1" />

        {/* Center Target Point */}
        <circle cx="50%" cy="50%" r="3" fill="#0B1C10" fillOpacity="0.8" stroke="none" />

        {/* Horizon Indicator Line */}
        <path d="M calc(50% - 300px) 50% L calc(50% - 200px) 50%" strokeWidth="1" opacity="0.3" strokeDasharray="2 4" />
        <path d="M calc(50% + 200px) 50% L calc(50% + 300px) 50%" strokeWidth="1" opacity="0.3" strokeDasharray="2 4" />
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
