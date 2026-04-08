'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

export default function ScrollIndicator() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      if (isVisible) setIsVisible(false);
    } else {
      if (!isVisible) setIsVisible(true);
    }
  });

  return (
    <motion.div 
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center p-1 shadow-[0_0_10px_rgba(255,255,255,0.1)] backdrop-blur-sm bg-black/10">
        <motion.div 
          className="w-1.5 h-1.5 bg-white rounded-full mt-1"
          animate={{ y: [0, 16, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </div>
      <span className="mt-4 text-[10px] tracking-widest text-[#0B1C10]/60 uppercase font-sans font-medium">
        Initialize Sequence
      </span>
    </motion.div>
  );
}
