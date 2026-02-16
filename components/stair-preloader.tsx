"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StairPreloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const columns = 8;
  const color = "#171717";
  const animation = {
    initial: {
      top: "0",
    },
    enter: {
      top: "100%",
    },
    exit: (i: number) => ({
      top: "-100%",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.05 * i,
      },
    }),
  };

  const stairAnimation = {
    initial: {
      height: "100%",
    },
    exit: (i: number) => ({
      height: "0%",
      transition: {
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1],
        delay: 0.1 * i,
      },
    }),
  };

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <>
          <motion.div className="fixed inset-0 z-[9999] flex pointer-events-none">
            {Array.from({ length: columns }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ height: "100%" }}
                exit={{ height: "0%" }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.08 * (columns - index - 1),
                }}
                className="relative flex-1 h-full"
                style={{
                  backgroundColor: color,
                  marginRight: -1,
                }}
                custom={index}
                variants={{
                  exit: (i) => ({
                    height: "0%",
                    transition: {
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.1 * i,
                    },
                  }),
                }}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
