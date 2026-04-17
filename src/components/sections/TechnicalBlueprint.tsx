'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type Category = 'propulsion' | 'imaging' | 'intelligence' | 'battery';

const categories = [
  { id: 'propulsion', label: 'Propulsion', title: '7500kv Brushless', desc: 'Quad-rotor heavy lift config' },
  { id: 'imaging', label: 'Imaging', title: '1/1.3" CMOS Sensor', desc: '8K HDR at 60fps / F2.8' },
  { id: 'intelligence', label: 'Intelligence', title: 'Neuro Core v2', desc: 'Machine vision and 360° avoidance' },
  { id: 'battery', label: 'Battery', title: 'Solid-State 8000mAh', desc: 'High density, active cooling' },
];

export default function TechnicalBlueprint() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // SVG drawing logic: draws from 0% to 100% as you scroll down
  // user requested linear mapping with no lag
  const pathLength = useTransform(scrollYProgress, [0, 0.75], [0, 1]);

  // Left menu opacity starts dimmed and comes into full opacity once pathLength hits 1
  const textOpacity = useTransform(scrollYProgress, [0, 0.75, 0.9], [0.3, 0.3, 1]);

  const wireframeStyle = (id: Category) => {
    const isActive = activeCategory === id;
    if (isActive) {
      return "highlight-flicker fill-none";
    }
    return activeCategory
      ? "stroke-white/20 fill-none transition-all duration-300"
      : "stroke-white/60 fill-none transition-all duration-500 delay-300";
  };

  return (
    <section
      ref={containerRef}
      className="w-full h-[400vh] bg-[#0B1C10] border-t border-white/5 relative z-20"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 md:px-24 overflow-hidden">
        <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">

          {/* Left Side: Categories */}
          <motion.div
            style={{ opacity: textOpacity }}
            className="flex flex-col gap-8 z-10 relative"
          >
            <div className="flex flex-col">
              <span className="text-[#D4F060] font-sans uppercase tracking-[0.3em] text-xs mb-4 block">
                Deconstructed
              </span>
              <h2 className="text-5xl md:text-7xl font-serif text-white mb-12 leading-tight">
                Technical <br /> <span className="italic opacity-70 border-b border-[#D4F060]/30 pb-2">Blueprint.</span>
              </h2>
            </div>

            <div className="flex flex-col gap-2 border-l border-white/5 pl-8 mt-4">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  onMouseEnter={() => setActiveCategory(cat.id as Category)}
                  onMouseLeave={() => setActiveCategory(null)}
                  className="group cursor-pointer py-6 relative"
                >
                  {/* Active Indicator Line */}
                  <div className={`absolute left-[-33px] top-1/2 -translate-y-1/2 w-[2px] bg-[#D4F060] transition-all duration-300 ${activeCategory === cat.id ? 'h-full' : 'h-0'}`} />

                  <div className="flex items-center gap-6">
                    <span className={`text-sm font-mono transition-colors duration-300 ${activeCategory === cat.id ? 'text-[#D4F060]' : 'text-white/30'}`}>
                      0{idx + 1}
                    </span>
                    <h3 className={`text-3xl font-serif transition-colors duration-300 ${activeCategory === cat.id ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                      {cat.label}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Wireframe */}
          <div className="relative w-full aspect-square max-w-[800px] mx-auto flex items-center justify-center">

            {/* Data block overlays (slides in from right when active) */}
            {categories.map((cat) => (
              <motion.div
                key={`data-${cat.id}`}
                initial={false}
                animate={{
                  opacity: activeCategory === cat.id ? 1 : 0,
                  x: activeCategory === cat.id ? 0 : 40,
                  scale: activeCategory === cat.id ? 1 : 0.95
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={`absolute pointer-events-none p-4 backdrop-blur-xl bg-[#0B1C10]/80 border border-[#D4F060]/40 rounded min-w-[220px] shadow-[0_0_30px_rgba(212,240,96,0.15)] z-30 ${cat.id === 'imaging' ? 'top-[0%] left-1/2 -translate-x-1/2' :
                    cat.id === 'propulsion' ? 'top-[10%] right-[0%]' :
                      cat.id === 'intelligence' ? 'top-[40%] left-[5%]' :
                        'bottom-[10%] left-1/2 -translate-x-1/2'
                  }`}
              >
                <div className="text-[#D4F060] font-mono text-[10px] mb-2 uppercase tracking-widest">{cat.label} // DATA</div>
                <div className="text-white font-serif text-xl mb-1">{cat.title}</div>
                <div className="text-white/50 text-xs font-sans tracking-wide uppercase">{cat.desc}</div>

                {/* Connector Line (visual flair) */}
                <div className={`absolute bg-[#D4F060]/60 ${cat.id === 'imaging' ? 'w-[1px] h-8 -bottom-8 left-1/2' :
                    cat.id === 'propulsion' ? 'w-8 h-[1px] top-1/2 -left-8' :
                      cat.id === 'intelligence' ? 'w-8 h-[1px] top-1/2 -right-8' :
                        'w-[1px] h-8 -top-8 left-1/2'
                  }`} />
                <div className={`absolute w-1.5 h-1.5 bg-[#D4F060] rounded-full ${cat.id === 'imaging' ? '-bottom-8 left-1/2 -translate-x-1/2' :
                    cat.id === 'propulsion' ? 'top-1/2 -translate-y-1/2 -left-8' :
                      cat.id === 'intelligence' ? 'top-1/2 -translate-y-1/2 -right-8' :
                        '-top-8 left-1/2 -translate-x-1/2'
                  }`} />
              </motion.div>
            ))}

            {/* SVG Container */}
            <motion.svg
              viewBox="0 0 800 800"
              className="w-full h-full drop-shadow-2xl scale-110"
            >
              {/* Battery Component - Background/Core Layer */}
              <g className={wireframeStyle('battery')}>
                <motion.path style={{ pathLength }} strokeWidth="2" d="M 360 360 L 440 360 L 440 500 L 360 500 Z" />
                <motion.path style={{ pathLength }} strokeWidth="1" d="M 380 360 L 380 500 M 400 360 L 400 500 M 420 360 L 420 500" strokeDasharray="4 4" />
                <motion.circle style={{ pathLength }} cx="400" cy="390" r="12" strokeWidth="1.5" />
                <motion.circle style={{ pathLength }} cx="400" cy="470" r="12" strokeWidth="1.5" />
              </g>

              {/* Intelligence Component - Main Body Shell */}
              <g className={wireframeStyle('intelligence')}>
                <motion.path style={{ pathLength }} strokeWidth="2.5" d="M 400 240 L 460 320 L 460 520 L 400 600 L 340 520 L 340 320 Z" />
                <motion.path style={{ pathLength }} strokeWidth="1" d="M 400 240 L 400 600" />
                <motion.path style={{ pathLength }} strokeWidth="1" d="M 340 320 L 460 320 M 340 420 L 460 420 M 340 520 L 460 520" />
                <motion.circle style={{ pathLength }} cx="400" cy="420" r="45" strokeWidth="1.5" strokeDasharray="4 6" />
                <motion.path style={{ pathLength }} strokeWidth="1.5" d="M 370 420 L 430 420 M 400 390 L 400 450" />
              </g>

              {/* Imaging Component - Gimbal & Camera */}
              <g className={wireframeStyle('imaging')}>
                <motion.path style={{ pathLength }} strokeWidth="2.5" d="M 375 240 L 375 180 L 425 180 L 425 240" />
                <motion.circle style={{ pathLength }} cx="400" cy="150" r="25" strokeWidth="2" />
                <motion.circle style={{ pathLength }} cx="400" cy="150" r="10" strokeWidth="1.5" fill="#D4F060" fillOpacity={activeCategory === 'imaging' ? 0.2 : 0} className="transition-all duration-300" />
                <motion.path style={{ pathLength }} strokeWidth="1.5" d="M 400 125 L 400 100 M 400 175 L 400 200 M 375 150 L 350 150 M 425 150 L 450 150" strokeDasharray="2 4" />
              </g>

              {/* Propulsion Component - Arms and Rotors */}
              <g className={wireframeStyle('propulsion')}>
                {/* Arms */}
                <motion.path style={{ pathLength }} strokeWidth="3" strokeLinecap="round" d="M 350 300 L 150 160" />
                <motion.path style={{ pathLength }} strokeWidth="3" strokeLinecap="round" d="M 450 300 L 650 160" />
                <motion.path style={{ pathLength }} strokeWidth="3" strokeLinecap="round" d="M 350 540 L 150 680" />
                <motion.path style={{ pathLength }} strokeWidth="3" strokeLinecap="round" d="M 450 540 L 650 680" />

                {/* Top Left Rotor */}
                <motion.circle style={{ pathLength }} cx="150" cy="160" r="90" strokeWidth="1.5" strokeDasharray="6 8" />
                <motion.circle style={{ pathLength }} cx="150" cy="160" r="12" strokeWidth="2.5" />
                <motion.path style={{ pathLength }} strokeWidth="2" d="M 60 160 L 240 160 M 150 70 L 150 250 M 86 96 L 214 224 M 86 224 L 214 96" />

                {/* Top Right Rotor */}
                <motion.circle style={{ pathLength }} cx="650" cy="160" r="90" strokeWidth="1.5" strokeDasharray="6 8" />
                <motion.circle style={{ pathLength }} cx="650" cy="160" r="12" strokeWidth="2.5" />
                <motion.path style={{ pathLength }} strokeWidth="2" d="M 560 160 L 740 160 M 650 70 L 650 250 M 586 96 L 714 224 M 586 224 L 714 96" />

                {/* Bottom Left Rotor */}
                <motion.circle style={{ pathLength }} cx="150" cy="680" r="90" strokeWidth="1.5" strokeDasharray="6 8" />
                <motion.circle style={{ pathLength }} cx="150" cy="680" r="12" strokeWidth="2.5" />
                <motion.path style={{ pathLength }} strokeWidth="2" d="M 60 680 L 240 680 M 150 590 L 150 770 M 86 616 L 214 744 M 86 744 L 214 616" />

                {/* Bottom Right Rotor */}
                <motion.circle style={{ pathLength }} cx="650" cy="680" r="90" strokeWidth="1.5" strokeDasharray="6 8" />
                <motion.circle style={{ pathLength }} cx="650" cy="680" r="12" strokeWidth="2.5" />
                <motion.path style={{ pathLength }} strokeWidth="2" d="M 560 680 L 740 680 M 650 590 L 650 770 M 586 616 L 714 744 M 586 744 L 714 616" />
              </g>
            </motion.svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes custom-flicker {
          0% { opacity: 0.8; stroke: #D4F060; filter: drop-shadow(0 0 5px #D4F060); }
          10% { opacity: 0.2; stroke: white; }
          20% { opacity: 1; stroke: #D4F060; }
          30% { opacity: 0.4; stroke: white; }
          40% { opacity: 0.9; stroke: #D4F060; }
          50% { opacity: 0.1; stroke: white; }
          60% { opacity: 1; stroke: #D4F060; }
          70% { opacity: 0.8; stroke: white; }
          80% { opacity: 0.3; stroke: #D4F060; }
          90% { opacity: 1; stroke: #D4F060; filter: drop-shadow(0 0 10px rgba(212, 240, 96, 0.7)); }
          100% { opacity: 1; stroke: #D4F060; filter: drop-shadow(0 0 8px rgba(212, 240, 96, 0.6)); stroke-width: 3.5px; }
        }

        .highlight-flicker {
          animation: custom-flicker 0.45s ease-in-out forwards;
        }
      `}</style>
    </section>
  );
}
