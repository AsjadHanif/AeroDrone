'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DroneManifest from '@/components/sections/DroneManifest';
import TechnicalMasterpiece from '@/components/sections/TechnicalMasterpiece';
import GimbalView from '@/components/sections/GimbalView';
import Preloader from '@/components/ui/Preloader';
import ScrollIndicator from '@/components/ui/ScrollIndicator';

export default function Home() {
  const [isPreloading, setIsPreloading] = useState(true);

  return (
    <main className="flex flex-col items-center justify-between relative">
      <AnimatePresence>
        {isPreloading && <Preloader onComplete={() => setIsPreloading(false)} />}
      </AnimatePresence>

      {/* Hero Section Placeholder */}
      <section className="h-screen w-full flex items-center justify-center bg-transparent z-10 px-24 relative">
        <div className="w-full max-w-5xl flex flex-col items-center text-center font-serif text-sm lg:flex pt-32">
          <h1 className="text-6xl md:text-8xl font-serif text-primary leading-tight">
            AERODRONE
          </h1>
          <p className="mt-6 text-xl text-primary/60 font-mono tracking-widest uppercase">
            Define New Horizons
          </p>
        </div>
        
        <ScrollIndicator />
      </section>

      {/* Drone Scroll Experience */}
      <DroneManifest />

      {/* Technical Deep Dive */}
      <TechnicalMasterpiece />

      {/* Gimbal View Experience */}
      <GimbalView />

      {/* Footer / End Section */}
      <section className="h-screen w-full flex items-center justify-center bg-primary text-background z-20">
        <h2 className="text-4xl font-serif">READY FOR TAKEOFF.</h2>
      </section>
    </main>
  );
}
