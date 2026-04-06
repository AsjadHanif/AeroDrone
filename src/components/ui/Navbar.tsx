"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { scrollY } = useScroll();
  
  const height = useTransform(scrollY, [0, 100], [100, 70]);
  const backdropFilter = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);
  const backgroundColor = useTransform(
    scrollY, 
    [0, 100], 
    ["rgba(245, 245, 243, 0)", "rgba(245, 245, 243, 0.8)"] // matches #F5F5F3
  );

  return (
    <motion.header
      style={{ height, backdropFilter, backgroundColor }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 border-b border-transparent transition-all duration-300"
    >
      <Link href="/" className="font-serif text-2xl font-bold tracking-wide">
        AeroDrone.
      </Link>
      
      <nav className="flex items-center gap-8">
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
    </motion.header>
  );
}
