'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DroneManifest from '@/components/sections/DroneManifest';
import TechnicalMasterpiece from '@/components/sections/TechnicalMasterpiece';
import TechnicalBlueprint from '@/components/sections/TechnicalBlueprint';
import GimbalView from '@/components/sections/GimbalView';
import PerformanceDashboard from '@/components/sections/PerformanceDashboard';
import CinematicGallery from '@/components/sections/CinematicGallery';
import CommandCenterFooter from '@/components/sections/CommandCenterFooter';
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
      <section className="h-[50vh] md:h-screen w-full flex items-center justify-center bg-transparent z-10 px-6 md:px-24 relative">
        <div className="w-full max-w-5xl flex flex-col items-center text-center font-serif text-sm lg:flex pt-32">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-primary leading-tight">
            AERODRONE
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary/60 font-mono tracking-widest uppercase">
            Define New Horizons
          </p>
        </div>
        
        <ScrollIndicator />
      </section>

      {/* Drone Scroll Experience */}
      <DroneManifest />

      {/* Technical Deep Dive */}
      <TechnicalMasterpiece />

      {/* Technical Blueprint */}
      <TechnicalBlueprint />

      {/* Gimbal View Experience */}
      <GimbalView />

      {/* Performance Dashboard */}
      <PerformanceDashboard />

      {/* Cinematic Gallery */}
      <CinematicGallery />

      {/* Footer / End Section */}
      <CommandCenterFooter />
    </main>
  );
}
