'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from 'framer-motion';
import { ColorSelectionPill, DroneColor } from '@/components/ui/ColorSelectionPill';

interface StatProps {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  delay: number;
  isDark?: boolean;
}

const CountUp = ({ label, value, suffix, icon, delay, isDark }: StatProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col items-center justify-center p-8 group cursor-default"
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-[#D4F060] group-hover:shadow-[0_0_20px_rgba(212,240,96,0.4)] ${isDark ? 'bg-white/5' : 'bg-[#0B1C10]/5'}`}>
        <i className={`fas ${icon} text-2xl transition-colors duration-500 group-hover:text-black ${isDark ? 'text-white' : 'text-[#0B1C10]'}`}></i>
      </div>
      <div className={`text-4xl md:text-5xl font-serif mb-2 transition-colors duration-700 ${isDark ? 'text-white' : 'text-[#0B1C10]'}`}>
        {count}{suffix}
      </div>
      <div className={`text-xs uppercase tracking-[0.2em] font-sans font-medium transition-colors duration-700 ${isDark ? 'text-white/40' : 'text-[#0B1C10]/40'}`}>
        {label}
      </div>
    </motion.div>
  );
};

const MagneticCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.1, y: y * 0.1 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const x = useSpring(position.x, { stiffness: 150, damping: 15 });
  const y = useSpring(position.y, { stiffness: 150, damping: 15 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default function TechnicalMasterpiece() {
  const containerRef = useRef(null);
  const [activeColor, setActiveColor] = useState<DroneColor>('forest');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const droneAssetMap = {
    body: {
      forest: '/assets/macro/body-forest.png',
      stealth: '/assets/macro/body-stealth.png',
      arctic: '/assets/macro/body-arctic.png',
    },
    gimbal: {
      forest: '/assets/macro/gimbal-forest.png',
      stealth: '/assets/macro/gimbal-stealth.png',
      arctic: '/assets/macro/gimbal-arctic.png',
    },
    motor: {
      forest: '/assets/macro/motor-forest.png',
      stealth: '/assets/macro/motor-stealth.png',
      arctic: '/assets/macro/motor-arctic.png',
    },
    propeller: {
      forest: '/assets/macro/prop-forest.png',
      stealth: '/assets/macro/prop-stealth.png',
      arctic: '/assets/macro/prop-arctic.png',
    },
    sensor: {
      forest: '/assets/macro/sensor-forest.png',
      stealth: '/assets/macro/sensor-stealth.png',
      arctic: '/assets/macro/sensor-arctic.png',
    },
  };

  const cards = [
    {
      id: "gimbal",
      title: "Gimbal Lens",
      span: "md:col-span-1",
      delay: 0.2
    },
    {
      id: "motor",
      title: "Motor Unit",
      span: "md:col-span-1",
      delay: 0.3
    },
    {
      id: "propeller",
      title: "Propeller Blade",
      span: "md:col-span-1",
      delay: 0.4
    },
    {
      id: "sensor",
      title: "Emerald Sensor",
      span: "md:col-span-1",
      delay: 0.5
    }
  ] as const;

  // Derive styles based on selected color
  const isDark = activeColor === 'stealth';
  const sectionBgColor = isDark ? '#111111' : activeColor === 'arctic' ? '#FAFAFA' : '#F5F5F3';
  const textColorClass = isDark ? 'text-white' : 'text-[#0B1C10]';
  const subtextColorClass = isDark ? 'text-white/40' : 'text-[#0B1C10]/40';
  const borderColorClass = isDark ? 'border-white/10' : 'border-[#0B1C10]/10';

  // The Aesthetic: Glassmorphism, subtle white-transparent background (#F5F5F3/90) and thin borders (border-[#0B1C10]/10)
  const cardBgClass = isDark ? 'bg-[#1A1A1A]/80' : 'bg-[#F5F5F3]/90';
  const hoverBgClass = isDark ? 'bg-white/5' : 'bg-[#0B1C10]/5';

  return (
    <section
      ref={containerRef}
      className="w-full py-32 px-6 md:px-24 relative z-20 scroll-mt-[50vh] transition-colors duration-1000"
      style={{ backgroundColor: sectionBgColor }}
    >
      <div className="max-w-[1400px] mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-24"
        >
          <span className={`${subtextColorClass} font-sans uppercase tracking-[0.3em] text-[10px] mb-4 block transition-colors duration-1000`}>
            Engineered Excellence
          </span>
          <h2 className={`text-5xl md:text-7xl font-serif ${textColorClass} leading-tight max-w-3xl transition-colors duration-1000`}>
            A Masterpiece of <br />
            <span className="italic">Aerial Engineering.</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 relative pb-24">
          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 relative group rounded-[24px] overflow-hidden min-h-[400px] md:min-h-[600px] border ${borderColorClass} ${cardBgClass} backdrop-blur-xl transition-colors duration-1000`}
          >
            <motion.div
              style={{ y: parallaxY }}
              className="absolute inset-0 scale-110"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={`hero-${activeColor}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  src={droneAssetMap.body[activeColor]}
                  alt="AeroBody Core"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                />
              </AnimatePresence>
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
              <h3 className="text-2xl font-serif text-white mb-2">AeroBody Core</h3>
              <p className="text-white/80 font-sans text-xs tracking-wider uppercase">Structural Integrity & Balance</p>
            </div>
          </motion.div>

          {/* Component Cards */}
          {cards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: card.delay }}
              className={`${card.span} flex`}
            >
              <MagneticCard className={`flex-1 rounded-[24px] border ${borderColorClass} ${cardBgClass} backdrop-blur-xl overflow-hidden group cursor-pointer transition-colors duration-1000`}>
                <div className="aspect-square relative overflow-hidden bg-black/5">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${card.id}-${activeColor}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      src={droneAssetMap[card.id][activeColor]}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                    />
                  </AnimatePresence>
                  <div className={`absolute inset-0 ${hoverBgClass} group-hover:bg-transparent transition-colors duration-500`} />
                </div>
                <div className="p-6 relative z-10">
                  <h4 className={`font-serif text-lg ${textColorClass} transition-colors duration-1000`}>{card.title}</h4>
                  <div className={`w-0 group-hover:w-full h-[1px] bg-current opacity-20 mt-2 transition-all duration-500 ${textColorClass}`} />
                </div>
              </MagneticCard>
            </motion.div>
          ))}

          {/* Color Selection Pill */}
          <div className="md:contents">
            <ColorSelectionPill
              selectedColor={activeColor}
              onSelect={setActiveColor}
            />
          </div>
        </div>

        {/* Live Performance Counters */}
        <div className={`border-t ${borderColorClass} pt-12 transition-colors duration-1000`}>
          <div className={`grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x ${borderColorClass} transition-colors duration-1000`}>
            <CountUp
              label="Flight Time"
              value={45}
              suffix=" MIN"
              icon="fa-wind"
              delay={0.2}
              isDark={isDark}
            />
            <CountUp
              label="Transmission"
              value={12}
              suffix=" KM"
              icon="fa-satellite-dish"
              delay={0.4}
              isDark={isDark}
            />
            <CountUp
              label="Recording"
              value={8}
              suffix="K 60FPS"
              icon="fa-video"
              delay={0.6}
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
