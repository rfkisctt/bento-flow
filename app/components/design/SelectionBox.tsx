"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SelectionBoxProps {
  children: React.ReactNode;
  active?: boolean;
  showFill?: boolean;
  variant?: "default" | "guide" | "minimal-corners" | "affinity";
}

export const SelectionBox = ({
  children,
  active = true,
  showFill = false,
  variant = "default",
}: SelectionBoxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  if (!active) return <>{children}</>;

  const handlePositions = [
    "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
    "top-0 right-0 translate-x-1/2 -translate-y-1/2",
    "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
    "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
  ];

  const DotAnchor = ({
    className = "",
    small = false,
    solid = false,
    delay = 0,
  }) => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: delay,
      }}
      className={`absolute ${
        small ? "w-1.5 h-1.5" : "w-2 h-2"
      } rounded-full z-30 
        ${solid ? "bg-[#2b86ff]" : "bg-white border-2 border-[#2b86ff]"}
        shadow-[0_0_0_1px_rgba(43,134,255,0.2)] ${className}`}
    />
  );

  return (
    <div ref={containerRef} className="relative group inline-block">
      {/* Target Element */}
      <div className="relative z-10">{children}</div>

      {/* Selection Graphics */}
      <div
        className={`absolute inset-0 pointer-events-none z-20 
          ${variant === "default" ? "border-[1.5px] border-[#2b86ff]" : ""} 
          ${showFill ? "bg-[#2b86ff]/10" : ""}
        `}
      >
        {variant === "default" &&
          handlePositions.map((pos, i) => (
            <DotAnchor key={i} className={pos} delay={1 + i * 0.1} />
          ))}

        {variant === "guide" && (
          <>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "calc(100% + 48px)" } : { width: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
              className="absolute top-0 left-[-24px] h-[1px] bg-[#2b86ff]/80"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "calc(100% + 48px)" } : { width: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
              className="absolute bottom-0 left-[-24px] h-[1px] bg-[#2b86ff]/80"
            />
            <motion.div
              initial={{ height: 0 }}
              animate={
                isInView ? { height: "calc(100% + 48px)" } : { height: 0 }
              }
              transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
              className="absolute top-[-24px] left-0 w-[1px] bg-[#2b86ff]/80"
            />
            <motion.div
              initial={{ height: 0 }}
              animate={
                isInView ? { height: "calc(100% + 48px)" } : { height: 0 }
              }
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
              className="absolute top-[-24px] right-0 w-[1px] bg-[#2b86ff]/80"
            />
            <DotAnchor
              solid
              className="top-0 left-0 -translate-x-1/2 -translate-y-1/2"
              delay={1.6}
            />
            <DotAnchor
              solid
              className="bottom-0 right-0 translate-x-1/2 translate-y-1/2"
              delay={1.7}
            />
          </>
        )}

        {variant === "affinity" && (
          <>
            {/* Bottom horizontal line: Center to Edges */}
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "calc(100% + 40px)" } : { width: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-[#2b86ff]"
            />

            {/* Left vertical line: Bottom to Top */}
            <motion.div
              initial={{ top: "calc(100% + 20px)", height: 0 }}
              animate={
                isInView
                  ? { top: "-5px", height: "calc(100% + 25px)" }
                  : { top: "calc(100% + 20px)", height: 0 }
              }
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
              className="absolute left-0 w-[1px] bg-[#2b86ff]"
            />

            {/* Right vertical line: Top to Bottom */}
            <motion.div
              initial={{ height: 0 }}
              animate={
                isInView ? { height: "calc(100% + 25px)" } : { height: 0 }
              }
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="absolute top-[-5px] right-0 w-[1px] bg-[#2b86ff]"
            />

            {/* Top-left dot: follows the left vertical line growth (Bottom to Top) */}
            <motion.div
              initial={{ top: "calc(100% + 20px)", opacity: 0, scale: 0 }}
              animate={
                isInView
                  ? { top: "-5px", opacity: 1, scale: 1 }
                  : { top: "calc(100% + 20px)", opacity: 0, scale: 0 }
              }
              transition={{
                top: { duration: 0.8, ease: "easeOut", delay: 0.5 },
                opacity: { duration: 0.2, delay: 0.5 },
                scale: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.5,
                },
              }}
              className="absolute left-0 w-2 h-2 rounded-full z-30 bg-[#2b86ff] shadow-[0_0_0_1px_rgba(43,134,255,0.2)] -translate-x-1/2 -translate-y-1/2"
            />

            {/* Bottom-right dot: follows the right vertical line growth (Top to Bottom) */}
            <motion.div
              initial={{ top: "-5px", opacity: 0, scale: 0 }}
              animate={
                isInView
                  ? { top: "calc(100% + 20px)", opacity: 1, scale: 1 }
                  : { top: "-5px", opacity: 0, scale: 0 }
              }
              transition={{
                top: { duration: 0.8, ease: "easeOut", delay: 0.6 },
                opacity: { duration: 0.2, delay: 0.6 },
                scale: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.6,
                },
              }}
              className="absolute right-0 w-2 h-2 rounded-full z-30 bg-[#2b86ff] shadow-[0_0_0_1px_rgba(43,134,255,0.2)] translate-x-1/2 -translate-y-1/2"
            />
          </>
        )}

        {variant === "minimal-corners" && (
          <>
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#2b86ff] -translate-x-1 -translate-y-1" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#2b86ff] translate-x-1 -translate-y-1" />
            <DotAnchor
              className="top-0 left-0 -translate-x-1 -translate-y-1"
              small
              delay={1}
            />
          </>
        )}
      </div>
    </div>
  );
};
