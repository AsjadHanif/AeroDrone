'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Wireframe } from '@react-three/drei';
import * as THREE from 'three';

type Category = 'propulsion' | 'imaging' | 'intelligence' | 'battery';

const categories = [
  { id: 'propulsion', label: 'Propulsion', title: '7500kv Brushless', desc: 'Quad-rotor heavy lift config' },
  { id: 'imaging', label: 'Imaging', title: '1/1.3" CMOS Sensor', desc: '8K HDR at 60fps / F2.8' },
  { id: 'intelligence', label: 'Intelligence', title: 'Neuro Core v2', desc: 'Machine vision and 360° avoidance' },
  { id: 'battery', label: 'Battery', title: 'Solid-State 8000mAh', desc: 'High density, active cooling' },
];

interface DroneModelProps {
  scrollSpring: any;
  activeCategory: Category | null;
}

const DroneModel = ({ scrollSpring, activeCategory }: DroneModelProps) => {
  const group = useRef<THREE.Group>(null);
  const propRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Spin propellers continuously
    propRefs.current.forEach((prop) => {
      if (prop) prop.rotation.y += delta * 25; // Fast spin
    });

    // Handle Hover Targeting
    if (activeCategory === 'propulsion') {
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -Math.PI / 8, 4, delta);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, Math.PI / 4, 4, delta);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, -0.4, 4, delta);
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, 0, 4, delta);
    } else if (activeCategory === 'imaging') {
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, Math.PI / 6, 4, delta);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, 0, 4, delta);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, 0.4, 4, delta);
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, 0.8, 4, delta);
    } else if (activeCategory === 'intelligence') {
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -Math.PI / 6, 4, delta);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, Math.PI, 4, delta);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, 0, 4, delta);
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, 0, 4, delta);
    } else if (activeCategory === 'battery') {
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, Math.PI / 6, 4, delta);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -Math.PI / 4, 4, delta);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, 0, 4, delta);
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, 0, 4, delta);
    } else {
      // Default: Scroll-Linked Rotation
      const targetY = scrollSpring.get() * Math.PI * 2;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, Math.PI / 8, 4, delta);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, 0, 4, delta);
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, 0, 4, delta);
    }
  });

  const getColor = (cat: Category) => activeCategory === cat ? '#D4F060' : '#F5F5F3';
  const getThickness = (cat: Category) => activeCategory === cat ? 0.04 : 0.02;

  return (
    <group ref={group}>
      {/* Chassis - Battery & Intelligence */}
      <mesh>
        <boxGeometry args={[1.5, 0.4, 3]} />
        <meshBasicMaterial color="#0B1C10" transparent opacity={0.6} />
        <Wireframe 
          stroke={activeCategory === 'intelligence' || activeCategory === 'battery' ? '#D4F060' : '#F5F5F3'} 
          thickness={activeCategory === 'intelligence' || activeCategory === 'battery' ? 0.04 : 0.02} 
        />
      </mesh>

      {/* Internal Battery Core */}
      <mesh position={[0, 0, -0.6]}>
         <boxGeometry args={[1, 0.3, 1]} />
         <meshBasicMaterial color="#0B1C10" transparent opacity={0.8} />
         <Wireframe stroke={getColor('battery')} thickness={getThickness('battery')} />
      </mesh>

      {/* Internal Intelligence Core */}
      <mesh position={[0, 0, 0.6]}>
         <boxGeometry args={[0.8, 0.2, 0.8]} />
         <meshBasicMaterial color="#0B1C10" transparent opacity={0.8} />
         <Wireframe stroke={getColor('intelligence')} thickness={getThickness('intelligence')} />
      </mesh>
      
      {/* Camera - Imaging */}
      <mesh position={[0, -0.25, 1.6]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#0B1C10" transparent opacity={0.8} />
        <Wireframe stroke={getColor('imaging')} thickness={getThickness('imaging')} />
      </mesh>

      {/* Propellers - Propulsion */}
      {[
        [-1.4, 0.2, 1.4],
        [1.4, 0.2, 1.4],
        [-1.4, 0.2, -1.4],
        [1.4, 0.2, -1.4]
      ].map((pos, i) => (
        <group key={`prop-group-${i}`} position={pos as [number, number, number]}>
          {/* Arm */}
          <mesh 
            position={[pos[0] < 0 ? 0.7 : -0.7, -0.15, pos[2] < 0 ? 0.7 : -0.7]} 
            rotation={[0, pos[0] * pos[2] > 0 ? -Math.PI/4 : Math.PI/4, 0]}
          >
            <boxGeometry args={[1.4, 0.1, 0.2]} />
            <meshBasicMaterial color="#0B1C10" transparent opacity={0.8} />
            <Wireframe stroke={getColor('propulsion')} thickness={getThickness('propulsion')} />
          </mesh>
          
          {/* Motor / Base */}
          <mesh>
            <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
            <meshBasicMaterial color="#0B1C10" transparent opacity={0.8} />
            <Wireframe stroke={getColor('propulsion')} thickness={getThickness('propulsion')} />
          </mesh>

          {/* Propeller Blade */}
          <mesh ref={(el) => { if (el) propRefs.current[i] = el; }} position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 0.02, 16]} />
            <meshBasicMaterial color="#0B1C10" transparent opacity={0.8} />
            <Wireframe stroke={getColor('propulsion')} thickness={getThickness('propulsion')} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default function TechnicalBlueprint() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  
  // Prevent SSR hydration mismatch and 'window undefined' errors
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scrollSpring = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 15,
    restDelta: 0.001
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.3, 1, 1, 0.3]);

  return (
    <section
      ref={containerRef}
      className="w-full h-[300vh] bg-[#0B1C10] border-t border-white/5 relative z-20"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 md:px-24 overflow-hidden">
        
        {/* Background Radial Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[800px] bg-[#D4F060]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 pointer-events-none">
          
          {/* Left Side: Categories */}
          <motion.div
            style={{ opacity: textOpacity }}
            className="flex flex-col gap-8 pointer-events-auto"
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

          {/* Right Side: Drone 3D Canvas */}
          <div className="relative w-full aspect-square max-w-[800px] mx-auto flex items-center justify-center pointer-events-auto">
            {isMounted && (
              <Canvas shadows={false} camera={{ position: [0, 2, 6], fov: 45 }}>
                <ambientLight intensity={1} />
                <DroneModel scrollSpring={scrollSpring} activeCategory={activeCategory} />
              </Canvas>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
