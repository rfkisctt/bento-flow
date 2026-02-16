"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const THEME = {
  black: "#0a0a0a",
  maroon: "#990000",
  textMain: "#ffffff",
};

const LIQUID_SPRING = {
  type: "spring" as const,
  stiffness: 600,
  damping: 30,
};

const Navbar = () => {
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const springConfig = { stiffness: 100, damping: 20, restDelta: 0.001 };

  const smoothWidth = useSpring(
    useTransform(scrollY, [0, 100], [920, 1250]),
    springConfig,
  );

  return (
    <div className="sticky top-6 z-50 flex justify-center mt-6 px-4 md:px-0">
      <motion.header
        style={{
          width: isMobile ? "90%" : smoothWidth,
          maxWidth: "95%",
        }}
        className="h-14 bg-[#1a1a1a] rounded-full border border-[#2a2a2a] px-4 md:px-5 overflow-hidden"
      >
        <div className="h-full flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <motion.div
              transition={LIQUID_SPRING}
              className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center overflow-hidden"
            >
              <Image
                src="/bentoflow.png"
                alt="BentoFlow Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </motion.div>
            <span className="font-bold font-mono text-xs md:text-sm">
              BentoFlow
            </span>
          </div>
          <Link
            href="/builder"
            className="px-3 md:px-5 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold bg-[#990000]"
          >
            Dashboard
          </Link>
        </div>
      </motion.header>
    </div>
  );
};

export { Navbar };
