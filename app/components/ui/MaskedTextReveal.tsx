"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface MaskedTextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: string | number;
  shouldFade?: boolean;
  style?: React.CSSProperties;
}

export function MaskedTextReveal({
  children,
  className = "",
  delay = 0,
  duration = 1.6,
  yOffset = "100%",
  shouldFade = false,
  style = {},
}: MaskedTextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div
      ref={ref}
      style={{ overflow: "hidden", display: "block", ...style }}
      className="relative"
    >
      <motion.div
        variants={{
          hidden: { y: yOffset, opacity: shouldFade ? 0 : 1 },
          visible: {
            y: "0%",
            opacity: 1,
            transition: {
              duration: duration,
              ease: [0.22, 1, 0.36, 1],
              delay: delay,
            },
          },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    </div>
  );
}
