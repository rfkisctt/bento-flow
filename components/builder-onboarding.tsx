"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MousePointer,
  Info,
  Check,
  Eye,
  Code,
  RotateCcw,
  HelpCircle,
} from "lucide-react";
import {
  LIQUID_SPRING,
  RUBBER_BAND_SPRING,
  GOOEY_SPRING,
  MORPH_SPRING,
} from "./bento-constants";

interface BuilderOnboardingProps {
  onToggleSettings: (show: boolean) => void;
  onToggleHelp: (show: boolean) => void;
  onToggleExport: (show: boolean) => void;
}

export default function BuilderOnboarding({
  onToggleSettings,
  onToggleHelp,
  onToggleExport,
}: BuilderOnboardingProps) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const prevRect = useRef<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(
      "bentoflow-onboarding-completed",
    );
    if (!hasSeenOnboarding) {
      setIsVisible(true);
      setTimeout(
        () =>
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          }),
        100,
      );
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      prevRect.current = null;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getTargetId = (currentStep: number) => {
    if (currentStep === 1) return "builder-settings-panel";
    if (currentStep === 2) return "builder-help-btn";
    if (currentStep === 3) return "builder-help-modal";
    if (currentStep === 4) return "builder-canvas";
    if (currentStep === 5) return "builder-add-btn";
    if (currentStep === 6) return "builder-history-group";
    if (currentStep === 7) return "builder-preview-btn";
    if (currentStep === 8) return "builder-export-btn";
    if (currentStep === 9) return "builder-code-modal";
    return "";
  };

  const updateRect = () => {
    const id = getTargetId(step);
    if (!id) {
      if (targetRect) setTargetRect(null);
      return;
    }

    let element = document.getElementById(id);
    if (!element && step === 1)
      element = document.getElementById("builder-settings-btn");

    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (
          prevRect.current &&
          Math.abs(prevRect.current.top - rect.top) < 0.5 &&
          Math.abs(prevRect.current.left - rect.left) < 0.5 &&
          Math.abs(prevRect.current.width - rect.width) < 0.5 &&
          Math.abs(prevRect.current.height - rect.height) < 0.5
        ) {
          return;
        }

        prevRect.current = rect;
        setTargetRect(rect);
      }
    }
  };

  useEffect(() => {
    if (!isVisible) return;

    if (step === 1) onToggleSettings(true);
    else onToggleSettings(false);

    if (step === 3) onToggleHelp(true);
    else onToggleHelp(false);

    if (step === 9) onToggleExport(true);
    else onToggleExport(false);

    prevRect.current = null;

    let frameId: number;
    const loop = () => {
      updateRect();
      frameId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(frameId);
  }, [step, isVisible, onToggleSettings, onToggleHelp, onToggleExport]);

  const handleNext = () => {
    if (step < 9) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onToggleSettings(false);
    onToggleHelp(false);
    onToggleExport(false);
    localStorage.setItem("bentoflow-onboarding-completed", "true");
  };

  const getRoundedRectPath = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) => {
    return `M ${x + r} ${y} 
            L ${x + w - r} ${y} 
            A ${r} ${r} 0 0 1 ${x + w} ${y + r} 
            L ${x + w} ${y + h - r} 
            A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} 
            L ${x + r} ${y + h} 
            A ${r} ${r} 0 0 1 ${x} ${y + h - r} 
            L ${x} ${y + r} 
            A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;
  };

  const FOLLOW_SPRING = {
    type: "spring" as const,
    stiffness: 600,
    damping: 40,
    mass: 0.5,
  };

  const getSpring = (s: number) => {
    if (s === 1 || s === 3 || s === 9) return FOLLOW_SPRING;
    if (s === 4) return MORPH_SPRING;
    return RUBBER_BAND_SPRING;
  };

  let maskPath = "";
  let highlightRect = null;
  const transition = getSpring(step);

  if (isVisible && targetRect && windowSize.width > 0) {
    let padding = 6;
    let borderRadius = 12;

    if (step === 1) {
      padding = 0;
      borderRadius = 24;
    }
    if (step === 3 || step === 9) {
      padding = 0;
      borderRadius = 24;
    }
    if (step === 4) {
      padding = 0;
      borderRadius = 16;
    }

    let r = {
      top: targetRect.top - padding,
      left: targetRect.left - padding,
      right: targetRect.right + padding,
      bottom: targetRect.bottom + padding,
      width: targetRect.width + padding * 2,
      height: targetRect.height + padding * 2,
    };

    if (step === 1) {
      const SIDEBAR_W = 288;
      const RIGHT_GAP = 24;
      const TOP_OFFSET = 104;

      r.width = SIDEBAR_W + padding * 2;
      r.left = window.innerWidth - SIDEBAR_W - RIGHT_GAP - padding;
      r.top = TOP_OFFSET - padding;
    }

    if (step === 3 || step === 9) {
    }

    highlightRect = { ...r, borderRadius };

    if (r.top < 0) r.top = 0;
    if (r.left < 0) r.left = 0;

    const outer = `M 0 0 L 0 ${windowSize.height} L ${windowSize.width} ${windowSize.height} L ${windowSize.width} 0 Z`;
    const inner = getRoundedRectPath(
      r.left,
      r.top,
      r.width,
      r.height,
      borderRadius,
    );
    maskPath = `${outer} ${inner}`;
  } else if (isVisible) {
    maskPath = `M 0 0 L 0 ${windowSize.height} L ${windowSize.width} ${windowSize.height} L ${windowSize.width} 0 Z`;
  }

  if (!isVisible) return null;

  const getTooltipStyle = () => {
    if (!highlightRect || step === 0) return {};
    const rect = highlightRect;

    const PADDING = 24;
    const TOOLTIP_WIDTH = 280;
    const TOOLTIP_HEIGHT = 180;

    let top = rect.top + rect.height + PADDING;
    let left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;

    if (step === 4) {
      return {
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 160,
      };
    }

    if (step === 1) {
      top = rect.top + 20;
      left = rect.left - TOOLTIP_WIDTH - PADDING;
    }

    if (step === 3 || step === 9) {
      top = rect.top + rect.height + 20;
      if (top + TOOLTIP_HEIGHT > window.innerHeight) {
        top = rect.top - TOOLTIP_HEIGHT - 20;
      }
      left = window.innerWidth / 2 - 160;
    }

    if (left < PADDING) left = PADDING;
    if (left + TOOLTIP_WIDTH > window.innerWidth)
      left = window.innerWidth - TOOLTIP_WIDTH - PADDING;
    if (top + TOOLTIP_HEIGHT > window.innerHeight - PADDING) {
      top = rect.top - TOOLTIP_HEIGHT - PADDING;
    }
    if (top < PADDING) top = PADDING;

    return { top, left };
  };

  const tooltipStyle = getTooltipStyle();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120]">
        {/* SVG Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <motion.path
              d={maskPath}
              fill="rgba(0, 0, 0, 0.7)"
              fillRule="evenodd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, d: maskPath }}
              transition={{
                d: transition,
                opacity: { duration: 0.3 },
              }}
              className="pointer-events-auto"
            />
          </svg>
        </div>

        {/* Highlight Ring */}
        {highlightRect && (
          <motion.div
            layoutId="highlight-ring"
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: 1,
              scale: 1,
              top: highlightRect.top,
              left: highlightRect.left,
              width: highlightRect.width,
              height: highlightRect.height,
              borderRadius: highlightRect.borderRadius,
            }}
            transition={transition}
            className="absolute border-2 border-[#990000] shadow-[0_0_30px_rgba(153,0,0,0.2)] pointer-events-none"
          />
        )}

        {/* Content Card */}
        <div className="absolute inset-0 pointer-events-none">
          {step === 0 && (
            <div className="flex items-center justify-center h-full">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 24,
                  delay: 0.5,
                }}
                className="bg-[#1a1a1a] border border-[#333] p-6 md:p-8 rounded-3xl max-w-[90%] md:max-w-md w-full shadow-2xl relative pointer-events-auto text-center"
              >
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-[#990000]/10 rounded-full flex items-center justify-center mx-auto">
                    <Info size={28} className="text-[#990000]" />
                  </div>
                  <div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-xl md:text-2xl font-bold text-white mb-2"
                    >
                      Welcome to Bento Flow!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="text-[#888] leading-relaxed"
                    >
                      Let's quickly set up your workspace. We'll show you the
                      tools you need to build faster.
                    </motion.p>
                  </div>
                </div>
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: 1 }}
                  onClick={handleNext}
                  className="mt-8 bg-[#990000] text-white font-bold py-3 px-8 rounded-full hover:bg-[#cc0000] transition-colors"
                >
                  Start Tour
                </motion.button>
              </motion.div>
            </div>
          )}

          {step > 0 && highlightRect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                top: tooltipStyle.top,
                left: tooltipStyle.left,
              }}
              transition={transition}
              className="absolute bg-[#1a1a1a] border border-[#333] p-4 md:p-6 rounded-2xl w-[85vw] sm:w-72 md:w-80 shadow-2xl pointer-events-auto"
            >
              {step === 1 && (
                <>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <MousePointer size={18} className="text-[#990000]" />
                    Grid Settings
                  </h3>
                  <p className="text-[#888] text-sm mb-4">
                    Adjust gap and border radius.
                  </p>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle size={18} className="text-[#990000]" />
                    <h3 className="text-lg font-bold text-white">Shortcuts</h3>
                  </div>
                  <p className="text-[#888] text-sm mb-4">
                    Click here to see all keyboard shortcuts.
                  </p>
                </>
              )}

              {step === 3 && (
                <>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Keyboard Shortcuts
                  </h3>
                  <p className="text-[#888] text-sm mb-4">
                    See all keyboard shortcuts.
                  </p>
                </>
              )}

              {step === 4 && (
                <>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Bento Canvas
                  </h3>
                  <p className="text-[#888] text-sm mb-4">
                    Add blocks to the canvas and arrange them in a grid.
                  </p>
                </>
              )}

              {step === 5 && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Check size={18} className="text-[#990000]" />
                    <h3 className="text-lg font-bold text-white">Add Block</h3>
                  </div>
                  <p className="text-[#888] text-sm mb-4">
                    Add a new block to the canvas.
                  </p>
                </>
              )}

              {step === 6 && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCcw size={18} className="text-[#990000]" />
                    <h3 className="text-lg font-bold text-white">History</h3>
                  </div>
                  <p className="text-[#888] text-sm mb-4">
                    Undo or Redo your actions anytime.
                  </p>
                </>
              )}

              {step === 7 && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Eye size={18} className="text-[#990000]" />
                    <h3 className="text-lg font-bold text-white">Preview</h3>
                  </div>
                  <p className="text-[#888] text-sm mb-4">
                    See how your grid looks without lines.
                  </p>
                </>
              )}

              {step === 8 && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Code size={18} className="text-[#990000]" />
                    <h3 className="text-lg font-bold text-white">Export</h3>
                  </div>
                  <p className="text-[#888] text-sm mb-4">
                    Click to get the code.
                  </p>
                </>
              )}

              {step === 9 && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Code size={18} className="text-[#990000]" />
                    <h3 className="text-lg font-bold text-white">Get Code</h3>
                  </div>
                  <p className="text-[#888] text-sm mb-4">
                    Copy CSS, Tailwind, Bootstrap, or Scss snippets instantly.
                  </p>
                </>
              )}

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#333]">
                <span className="text-xs text-[#555]">Step {step} / 9</span>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-[#990000] text-white text-xs font-bold rounded-lg hover:bg-[#cc0000] transition-colors"
                >
                  {step === 9 ? "Finish" : "Next"}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Skip Button */}
        <button
          onClick={handleComplete}
          className="absolute top-6 right-6 text-[#666] hover:text-white transition-colors pointer-events-auto z-[130] bg-black/20 p-2 rounded-full backdrop-blur-sm"
        >
          <X size={20} />
        </button>
      </div>
    </AnimatePresence>
  );
}
