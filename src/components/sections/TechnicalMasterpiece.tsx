'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import Image from 'next/image';

interface StatProps {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  delay: number;
}

const CountUp = ({ label, value, suffix, icon, delay }: StatProps) => {
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
      <div className="w-16 h-16 rounded-full bg-[#0B1C10]/5 flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-[#D4F060] group-hover:shadow-[0_0_20px_rgba(212,240,96,0.4)]">
        <i className={`fas ${icon} text-2xl text-[#0B1C10] transition-colors duration-500 group-hover:text-black`}></i>
      </div>
      <div className="text-4xl md:text-5xl font-serif text-[#0B1C10] mb-2">
        {count}{suffix}
      </div>
      <div className="text-xs uppercase tracking-[0.2em] font-sans text-[#0B1C10]/40 font-medium">
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  type CardData = { title: string, image: string, span: string, delay: number, isExtracted?: boolean, objectPosition?: string };
  const cards: CardData[] = [
    {
      title: "Active Cooling Rotor",
      image: "/assets/macro_rotor.png",
      span: "md:col-span-1",
      delay: 0.2
    },
    {
      title: "8K Optic Lens",
      image: "/assets/macro_lens.png",
      span: "md:col-span-1",
      delay: 0.3
    },
    {
      title: "Solid-State Energy",
      image: "/assets/macro_battery.png",
      span: "md:col-span-1",
      delay: 0.4
    },
    {
      title: "Carbon Weave Chassis",
      image: "/assets/macro_carbon.png",
      span: "md:col-span-1",
      delay: 0.5
    }
  ];

  return (
    <section ref={containerRef} className="w-full py-32 px-6 md:px-24 bg-[#F5F5F3] relative z-20 scroll-mt-[50vh]">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-24"
        >
          <span className="text-[#0B1C10]/40 font-sans uppercase tracking-[0.3em] text-[10px] mb-4 block">Engineered Excellence</span>
          <h2 className="text-5xl md:text-7xl font-serif text-[#0B1C10] leading-tight max-w-3xl">
            A Masterpiece of <br />
            <span className="italic">Aerial Engineering.</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-2 md:row-span-2 relative group rounded-[24px] overflow-hidden min-h-[400px] md:min-h-full border border-[#0B1C10]/10 bg-[#F5F5F3] glass-card"
          >
            <motion.div 
              style={{ y: parallaxY }} 
              className="absolute inset-0 scale-110"
            >
              <Image 
                src="/assets/ezgif-frame-188.png" 
                alt="AeroDrone Hero" 
                fill 
                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
              />
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/20 to-transparent">
              <h3 className="text-2xl font-serif text-white mb-2">Integrated Core v2</h3>
              <p className="text-white/60 font-sans text-xs tracking-wider uppercase">Structural Integrity & Balance</p>
            </div>
          </motion.div>

          {/* Component Cards */}
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: card.delay }}
              className={`${card.span} flex`}
            >
              <MagneticCard className="flex-1 rounded-[24px] border border-[#0B1C10]/10 bg-[#F5F5F3]/50 backdrop-blur-md overflow-hidden group cursor-pointer">
                <div className="aspect-square relative overflow-hidden">
                  <Image 
                    src={card.image} 
                    alt={card.title} 
                    fill 
                    style={card.isExtracted ? { objectPosition: card.objectPosition } : {}}
                    className={`object-cover transition-transform duration-700 ${card.isExtracted ? "scale-[2.0] group-hover:scale-[2.2]" : "group-hover:scale-110"} grayscale-[0.2] group-hover:grayscale-0`}
                  />
                  <div className="absolute inset-0 bg-[#0B1C10]/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="p-6">
                  <h4 className="font-serif text-lg text-[#0B1C10]">{card.title}</h4>
                  <div className="w-0 group-hover:w-full h-[1px] bg-[#0B1C10]/20 mt-2 transition-all duration-500" />
                </div>
              </MagneticCard>
            </motion.div>
          ))}
        </div>

        {/* Live Performance Counters */}
        <div className="border-t border-[#0B1C10]/10 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#0B1C10]/10">
            <CountUp 
              label="Flight Time" 
              value={45} 
              suffix=" MIN" 
              icon="fa-wind" 
              delay={0.2} 
            />
            <CountUp 
              label="Transmission" 
              value={12} 
              suffix=" KM" 
              icon="fa-satellite-dish" 
              delay={0.4} 
            />
            <CountUp 
              label="Recording" 
              value={8} 
              suffix="K 60FPS" 
              icon="fa-video" 
              delay={0.6} 
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .glass-card {
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
    </section>
  );
}
