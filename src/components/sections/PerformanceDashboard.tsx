'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const TerminalBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none flex flex-col justify-center gap-4 text-[#D4F060] font-mono text-sm leading-relaxed whitespace-nowrap z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: i % 2 === 0 ? "0%" : "-50%" }}
          animate={{ x: i % 2 === 0 ? "-50%" : "0%" }}
          transition={{ duration: 40 + i * 2, repeat: Infinity, ease: "linear" }}
          className="flex gap-8"
        >
          {Array(10).fill("[SYSTEM_CHECK: OK] [SIGNAL_STRENGTH: 98%] [GPS_LOCKED] [TELEMETRY_DATA_STREAM: ACTIVE] [ALTITUDE_HOLD: ENABLED] [GIMBAL_STABILIZATION: MAX]").join(" ")}
        </motion.div>
      ))}
    </div>
  );
};

const SpeedGauge = ({ inView }: { inView: boolean }) => {
  const [value, setValue] = useState(0);
  
  useEffect(() => {
    if (inView) {
      const controls = animate(0, 120, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (v) => setValue(Math.round(v)),
      });
      return controls.stop;
    } else {
      setValue(0);
    }
  }, [inView]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center justify-center relative w-64 h-64 z-10">
      <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(212,240,96,0.3)]" viewBox="0 0 160 160">
        {/* Background Circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="rgba(211, 240, 96, 0.12)"
          strokeWidth="6"
          fill="transparent"
        />
        {/* Progress Circle */}
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#d3f060e0"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: inView ? circumference - (value / 120) * circumference : circumference }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#D4F060]">
        <span className="text-5xl font-bold font-mono tracking-tighter">{value}</span>
        <span className="text-xs tracking-[0.3em] opacity-80 uppercase mt-1">km/h</span>
      </div>
      <div className="absolute -bottom-8 text-white tracking-[0.2em] text-sm text-center uppercase">Top Speed</div>
    </div>
  );
};

const RangeGauge = ({ inView }: { inView: boolean }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(0, 12, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (v) => setValue(Number(v.toFixed(1))),
      });
      return controls.stop;
    } else {
      setValue(0);
    }
  }, [inView]);

  return (
    <div className="flex flex-col items-center justify-center relative w-64 h-64 z-10">
      <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#D4F060]/30 animate-[spin_15s_linear_infinite]" />
      <div className="absolute inset-8 rounded-full border border-[#D4F060]/10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#D4F060] drop-shadow-[0_0_15px_rgba(212,240,96,0.3)]">
        <span className="text-6xl font-bold font-mono tracking-tighter">{value.toFixed(1)}</span>
        <span className="text-xs tracking-[0.3em] opacity-80 uppercase mt-2">km</span>
      </div>
      <div className="absolute -bottom-8 text-white tracking-[0.2em] text-sm text-center uppercase">Max Range</div>
    </div>
  );
};

const BatteryGauge = ({ inView }: { inView: boolean }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(0, 45, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (v) => setValue(Math.round(v)),
      });
      return controls.stop;
    } else {
      setValue(0);
    }
  }, [inView]);

  return (
    <div className="flex flex-col items-center justify-center relative w-64 h-64 z-10">
      <div className="relative w-24 h-36 border-[3px] border-[#D4F060]/30 rounded-xl p-1.5 flex flex-col justify-end overflow-visible drop-shadow-[0_0_15px_rgba(212,240,96,0.1)]">
        {/* Battery Top Terminal */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-[#D4F060]/30 rounded-t-sm" />
        {/* Charging Fill */}
        <motion.div
          className="w-full bg-[#D4F060] rounded-sm relative overflow-hidden"
          initial={{ height: "0%" }}
          animate={{ height: inView ? `${(value / 45) * 100}%` : "0%" }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        >
          {/* Subtle gradient inside battery fill */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>
        {/* Lightning Bolt Overlay */}
        {inView && value < 45 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg className="w-10 h-10 fill-current text-[#0B1C10]" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </motion.div>
        )}
      </div>
      
      <div className="absolute -bottom-8 flex items-baseline gap-2 text-[#D4F060] drop-shadow-[0_0_15px_rgba(212,240,96,0.3)]">
        <span className="text-3xl font-bold font-mono tracking-tighter">{value}</span>
        <span className="text-xs tracking-[0.2em] uppercase">min</span>
      </div>
      <div className="absolute -bottom-16 text-white tracking-[0.2em] text-sm text-center uppercase">Flight Time</div>
    </div>
  );
};

const PerformanceDashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px 0px" });

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#0B1C10] flex flex-col items-center justify-center py-24 overflow-hidden"
    >
      <TerminalBackground />
      
      <motion.div 
        className="z-10 text-center mb-16 md:mb-32"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-7xl font-serif text-white tracking-wide">
          PEAK <span className="text-[#D4F060] italic">PERFORMANCE</span>
        </h2>
        <p className="mt-4 md:mt-6 text-[#D4F060]/70 font-mono uppercase tracking-[0.3em] text-xs md:text-base px-6">
          Class-leading telemetry & endurance
        </p>
      </motion.div>

      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24 lg:gap-12 place-items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <SpeedGauge inView={inView} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <RangeGauge inView={inView} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <BatteryGauge inView={inView} />
        </motion.div>
      </div>

      {/* Decorative top/bottom gradient overlays to blend with other sections if needed */}
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default PerformanceDashboard;
