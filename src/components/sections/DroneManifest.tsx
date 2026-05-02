'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const hotspots = [
  {
    x: '41%',
    y: '55%',
    title: '8K CMOS Sensor',
    description: '1/1.3-inch sensor with f/1.7 aperture for extreme low-light clarity.',
    icon: 'fa-camera',
    delay: 0
  },
  {
    x: '65%',
    y: '53%',
    title: 'Active Cooling Rotor',
    description: 'Aerodynamically optimized to keep the solid-state core at precise temperatures.',
    icon: 'fa-fan',
    delay: 0.1
  },
  {
    x: '50%',
    y: '74%',
    title: 'Solid-State Energy',
    description: 'Next-generation battery cell providing up to 45 minutes of extreme flight.',
    icon: 'fa-battery-full',
    delay: 0.2
  }
];

const TOTAL_FRAMES = 120;
const IMAGE_BASE_PATH = '/assets/drone-sequence/drone-frame-';
const IMAGE_EXT = '.png'; // Using .png since ffmpeg was unavailable

export default function DroneManifest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hotspotsContainerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hotspotsVisible, setHotspotsVisible] = useState(false);

  // Track scroll progress within the 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth the scroll progress for a more "professional" feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Map scroll progress (0-1) to image index (0-119)
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.6 && latest <= 0.9) {
      if (!hotspotsVisible) setHotspotsVisible(true);
    } else {
      if (hotspotsVisible) setHotspotsVisible(false);
    }
  });

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      console.log(`[DroneManifest] Starting preload of ${TOTAL_FRAMES} images...`);
      console.log(`[DroneManifest] Expected path example: ${IMAGE_BASE_PATH}001${IMAGE_EXT}`);

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        const frameNum = i.toString().padStart(3, '0');
        const path = `${IMAGE_BASE_PATH}${frameNum}${IMAGE_EXT}`;
        img.src = path;

        img.onload = () => {
          loadedCount++;
          if (loadedCount === TOTAL_FRAMES) {
            console.log('[DroneManifest] All images preloaded successfully.');
            setImages(loadedImages);
            setIsLoaded(true);
          }
        };

        img.onerror = () => {
          console.error(`[DroneManifest] Failed to load image at: ${path}`);
        };

        loadedImages.push(img);
      }
    };

    preloadImages();
  }, []);

  // Canvas drawing logic
  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const render = () => {
      const index = Math.floor(frameIndex.get());
      const image = images[index];

      if (image && context) {
        try {
          // Handle High-DPI displays
          const dpr = window.devicePixelRatio || 1;
          const width = window.innerWidth;
          const height = window.innerHeight;

          if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.scale(dpr, dpr);
          }

          context.clearRect(0, 0, width, height);

          // Object-fit: contain logic
          const canvasRatio = width / height;
          const imageRatio = image.width / image.height;
          let drawWidth, drawHeight;

          if (imageRatio > canvasRatio) {
            drawWidth = width;
            drawHeight = width / imageRatio;
          } else {
            drawHeight = height;
            drawWidth = height * imageRatio;
          }

          x = (width - drawWidth) / 2;
          y = (height - drawHeight) / 2;

          context.drawImage(image, x, y, drawWidth, drawHeight);

          // Update hotspot container bounds to perfectly match the drawn image
          if (hotspotsContainerRef.current) {
            hotspotsContainerRef.current.style.left = `${x}px`;
            hotspotsContainerRef.current.style.top = `${y}px`;
            hotspotsContainerRef.current.style.width = `${drawWidth}px`;
            hotspotsContainerRef.current.style.height = `${drawHeight}px`;
          }
        } catch (error) {
          console.error('[DroneManifest] Error drawing to canvas:', error);
        }
      }

      requestAnimationFrame(render);
    };

    const animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [images, frameIndex]);

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh] w-full bg-transparent"
      id="drone-reveal"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Aesthetic Background Color defined in Phase 1 */}
        {/* The background is already #F5F5F3 via globals.css */}

        <motion.canvas
          ref={canvasRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="z-0 pointer-events-none"
        />

        {/* Hotspots Overlay */}
        <div
          ref={hotspotsContainerRef}
          className="absolute z-20 pointer-events-none"
        >
          <AnimatePresence>
            {hotspotsVisible && hotspots.map((spot) => (
              <motion.div
                key={spot.title}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, delay: spot.delay }}
                className="absolute flex items-center justify-center pointer-events-auto group -translate-x-1/2 -translate-y-1/2 z-50"
                style={{ left: spot.x, top: spot.y, filter: 'drop-shadow(0 0 10px #D4F060)' }}
              >
                <div className="relative flex items-center justify-center cursor-crosshair">
                  <div className="w-3 h-3 rounded-full bg-[#D4F060] z-10"></div>
                  <div className="absolute w-10 h-10 rounded-full bg-[#D4F060] animate-ping opacity-90"></div>
                </div>

                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 p-4 rounded-xl backdrop-blur-md bg-black/60 border border-white/20 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[100]">
                  <i className={`fas ${spot.icon} text-[#D4F060] mb-2 text-xl`}></i>
                  <h4 className="text-white font-serif text-lg mb-1">{spot.title}</h4>
                  <p className="text-white/70 font-sans text-xs leading-relaxed">{spot.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Optional: Add some floating UI elements or text that sync with scroll */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center text-primary">
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.2], [0, 1, 0]) }}
            className="text-center"
          >
            <h2 className="text-5xl font-serif mb-4 uppercase tracking-widest">Engineering Excellence</h2>
            <p className="text-xl opacity-60">Precision. Evolution. Flight.</p>
          </motion.div>

          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0]) }}
            className="text-center"
          >
            <h2 className="text-5xl font-serif mb-4 uppercase tracking-widest">Modular Core</h2>
            <p className="text-xl opacity-60">Advanced carbon fiber composite structure.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
