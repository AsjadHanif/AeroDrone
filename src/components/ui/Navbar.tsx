"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const height = useTransform(scrollY, [0, 100], [100, 70]);
  const backdropFilter = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);
  const backgroundColor = useTransform(
    scrollY, 
    [0, 100], 
    ["rgba(245, 245, 243, 0)", "rgba(245, 245, 243, 0.8)"] // matches #F5F5F3
  );

  return (
    <>
      <motion.header
        style={{ height, backdropFilter, backgroundColor }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 border-b border-transparent transition-all duration-300"
      >
        <Link href="/" className="font-serif text-xl md:text-2xl font-bold tracking-wide">
          AeroDrone.
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#drone-reveal" className="text-sm font-medium hover:text-accent transition-colors">
            Manifest
          </Link>
          <Link href="#features" className="text-sm font-medium hover:text-accent transition-colors">
            Features
          </Link>
          <Link href="#tech" className="text-sm font-medium hover:text-accent transition-colors">
            Technology
          </Link>
          <button className="bg-primary text-background px-6 py-2 rounded-full text-sm font-medium hover:bg-accent hover:text-primary transition-colors duration-300">
            Pre-order
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-primary p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col gap-8"
          >
            <Link 
              href="#drone-reveal" 
              className="text-3xl font-serif"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Manifest
            </Link>
            <Link 
              href="#features" 
              className="text-3xl font-serif"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#tech" 
              className="text-3xl font-serif"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Technology
            </Link>
            <button className="bg-primary text-background px-8 py-4 rounded-full text-lg font-medium mt-4">
              Pre-order Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
