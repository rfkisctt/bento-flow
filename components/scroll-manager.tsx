"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function ScrollManager() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.history.scrollRestoration) {
        window.history.scrollRestoration = "manual";
      }

      window.scrollTo(0, 0);

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.ctrlKey &&
          (e.key === "+" ||
            e.key === "-" ||
            e.key === "=" ||
            e.key === "_" ||
            e.key === "0")
        ) {
          e.preventDefault();
        }
      };

      const handleGestureStart = (e: any) => {
        e.preventDefault();
      };

      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("gesturestart", handleGestureStart);

      return () => {
        lenis.destroy();
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("gesturestart", handleGestureStart);
      };
    }
  }, []);

  return null;
}
