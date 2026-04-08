'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useScroll, useTransform, motion, useSpring } from 'framer-motion';

const TOTAL_FRAMES = 120;
const IMAGE_BASE_PATH = '/assets/drone-sequence/drone-frame-';
const IMAGE_EXT = '.png'; // Using .png since ffmpeg was unavailable

export default function DroneManifest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
          let drawWidth, drawHeight, x, y;

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
