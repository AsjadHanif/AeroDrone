'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const TOTAL_FRAMES = 120;
const IMAGE_BASE_PATH = '/assets/drone-sequence/drone-frame-';
const IMAGE_EXT = '.png';

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // Disable scroll while preloader is active
    document.body.style.overflow = 'hidden';
    
    let loadedCount = 0;
    
    const incrementProgress = () => {
      loadedCount++;
      setProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
      
      if (loadedCount === TOTAL_FRAMES) {
        setTimeout(() => {
          setLoadingComplete(true);
        }, 500); // 500ms settle delay
      }
    };

    // Begin preload logic
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
        // We use window.Image to preemptively cache
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      img.src = `${IMAGE_BASE_PATH}${frameNum}${IMAGE_EXT}`;
      img.onload = incrementProgress;
      img.onerror = incrementProgress; // Proceed even if an image fails to load
    }

    return () => {
      document.body.style.overflow = 'auto'; // Re-enable later
    };
  }, []);

  // Shutter easing custom luxury quintic-bezier
  const shutterVariants = {
    initial: { y: 0 },
    exitTop: {
      y: '-100%',
      transition: { duration: 1.4, ease: [0.87, 0, 0.13, 1] as const }
    },
    exitBottom: {
      y: '100%',
      transition: { duration: 1.4, ease: [0.87, 0, 0.13, 1] as const }
    }
  };

  // We invoke the onComplete briefly after the exit starts so that the component can safely unmount 
  // when AnimatePresence handles it. 
  // Wait! With AnimatePresence, we don't unmount manually, the parent unmounts us when isPreloading=false!
  // Oh, wait! If I call onComplete(false) in `setLoadingComplete`, AnimatePresence triggers.
  useEffect(() => {
    if (loadingComplete) {
      onComplete(); // Tells parent to unmount this <Preloader /> which triggers exit animation
    }
  }, [loadingComplete, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center font-sans overflow-hidden pointer-events-none"
      exit="exit"
    >
      {/* Top Half Shutter Element */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1/2 bg-[#F5F5F3] origin-top flex items-end justify-center pointer-events-auto"
        variants={shutterVariants}
        initial="initial"
        exit="exitTop"
      />
      
      {/* Bottom Half Shutter Element */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#F5F5F3] origin-bottom flex items-start justify-center pointer-events-auto"
        variants={shutterVariants}
        initial="initial"
        exit="exitBottom"
      />

      {/* Content wrapper: fades out incredibly quickly when shutter starts to open */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full w-full pointer-events-auto"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <div className="text-6xl md:text-8xl tracking-tighter" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#0B1C10' }}>
          {progress.toString().padStart(3, '0')}%
        </div>
        
        <div 
          className="absolute bottom-12 uppercase text-[10px] tracking-[0.3em] font-medium animate-pulse"
          style={{ color: '#0B1C10' }}
        >
          SYNCING NEURAL GIMBAL...
        </div>
      </motion.div>
    </motion.div>
  );
}
