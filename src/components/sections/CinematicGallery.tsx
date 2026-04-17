'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Scanlines = () => (
  <div className="absolute inset-0 pointer-events-none z-20 opacity-30 mix-blend-overlay">
    <div 
      className="w-full h-full" 
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.4) 50%)', 
        backgroundSize: '100% 4px' 
      }} 
    />
  </div>
);

const Tile = ({ className, children, isFeature = false }: { className?: string, children?: React.ReactNode, isFeature?: boolean }) => {
  return (
    <motion.div
      className={`relative bg-[#08120A] border border-white/5 group z-0 hover:z-10 transition-all duration-500 overflow-hidden rounded-none ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      {/* Border Glow Overlay */}
      <div className="absolute inset-0 border border-transparent group-hover:border-[#D4F060] group-hover:shadow-[0_0_20px_rgba(212,240,96,0.3)] transition-all duration-500 z-30 pointer-events-none" />
      
      {isFeature && (
        <div className="absolute top-4 left-4 z-40 bg-[#0B1C10]/90 border border-[#D4F060] text-[#D4F060] font-mono text-[10px] sm:text-xs px-2 py-1 uppercase tracking-widest backdrop-blur-md flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4F060] animate-pulse" />
          8K // HDR
        </div>
      )}
      
      {/* Data Overlay mimicking camera feed UI */}
      <div className="absolute bottom-4 left-4 z-40 text-[#D4F060]/60 font-mono text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        REC <span className="text-white ml-2">00:00:00:00</span>
      </div>
      
      {/* Crosshairs */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-[#D4F060] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[#D4F060] rounded-full" />
        <div className="absolute top-1/2 left-[40%] w-[10%] border-t border-[#D4F060]/50" />
        <div className="absolute top-1/2 right-[40%] w-[10%] border-t border-[#D4F060]/50" />
        <div className="absolute left-1/2 top-[40%] h-[10%] border-l border-[#D4F060]/50" />
        <div className="absolute left-1/2 bottom-[40%] h-[10%] border-l border-[#D4F060]/50" />
      </div>

      {/* Fallback Text in case video doesn't load */}
      <div className="absolute inset-0 flex items-center justify-center text-[#D4F060]/20 font-mono text-sm tracking-[0.2em] z-0 pointer-events-none">
        [ AWAITING FEED ]
      </div>

      {children}
      <Scanlines />
    </motion.div>
  );
};

export default function CinematicGallery() {
  return (
    <section className="w-full min-h-screen bg-[#0B1C10] py-24 flex flex-col items-center justify-center relative z-20 px-6">
      
      <div className="w-full max-w-7xl mx-auto mb-16 flex flex-col items-start border-l-2 border-[#D4F060] pl-6">
        <h2 className="text-4xl md:text-6xl font-serif text-white tracking-wider uppercase">
          Live <span className="text-[#D4F060] italic">Telemetry</span>
        </h2>
        <p className="mt-4 text-[#D4F060]/70 font-mono uppercase tracking-[0.2em] text-sm">
          Unfiltered sensor feeds // Direct from Neuro Core v2
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[1000px] md:h-[600px]">
        
        {/* Feature Tile - 2x2 */}
        <Tile className="md:col-span-2 md:row-span-2" isFeature>
          <video 
            src="/assets/videos/drone-feed-1.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-700"
          />
        </Tile>

        {/* Small 1 */}
        <Tile className="md:col-span-1 md:row-span-1">
          <video 
            src="/assets/videos/drone-feed-2.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-10 opacity-50 group-hover:opacity-100 transition-all duration-700 filter grayscale group-hover:grayscale-0"
          />
        </Tile>

        {/* Small 2 */}
        <Tile className="md:col-span-1 md:row-span-1">
          <video 
            src="/assets/videos/drone-feed-3.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-10 opacity-50 group-hover:opacity-100 transition-all duration-700 filter grayscale group-hover:grayscale-0"
          />
        </Tile>

        {/* Small 3 */}
        <Tile className="md:col-span-2 md:row-span-1">
          <video 
            src="/assets/videos/drone-feed-4.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-10 opacity-50 group-hover:opacity-100 transition-all duration-700 filter grayscale group-hover:grayscale-0"
          />
        </Tile>
        
      </div>
    </section>
  );
}
