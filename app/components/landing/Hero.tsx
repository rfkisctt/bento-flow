"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Lock,
  Share,
  Plus,
  Copy,
  Shield,
  PanelLeft,
  Layout,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { MaskedTextReveal } from "../ui/MaskedTextReveal";
import { SelectionBox } from "../design/SelectionBox";

const styles = `
  /* 1. CONTAINER ANIMATION: Tengah -> Tahan (Icon) -> Naik + Expand */
  @keyframes containerSequence {
    0% {
      opacity: 0;
      transform: translateY(30vh) scale(0.95);
      height: 52px;
      box-shadow: 0 0 0 rgba(0,0,0,0);
    }
    10% {
      opacity: 1;
      transform: translateY(30vh) scale(1);
      height: 52px;
      box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.1);
    }
    25% {
      transform: translateY(30vh) scale(1); 
      height: 52px;
    }
    100% {
      transform: translateY(0) scale(1); 
      height: var(--safari-height, 630px); 
      box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.25);
    }
  }

  /* 2. ICON ANIMATION: Pop In Cepat */
  @keyframes iconPop {
    0% { opacity: 0; transform: scale(0.5) translateY(5px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* 3. URL ANIMATION */
  @keyframes urlFadeIn {
    from { opacity: 0; filter: blur(4px); }
    to { opacity: 1; filter: blur(0); }
  }

  /* 4. CONTENT ANIMATION: Lebih Responsif */
  @keyframes contentUnifiedReveal {
    0% { 
      opacity: 0;
      transform: scale(0.99) translateY(20px); 
    }
    30% {
      opacity: 1;
    }
    100% { 
      opacity: 1; 
      transform: scale(1) translateY(0);
    }
  }

  /* UTILITY CLASSES */
  .animate-sequence {
    animation: containerSequence 4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  }

  .animate-icon {
    opacity: 0;
    animation: iconPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  
  .animate-url {
    opacity: 0;
    animation: urlFadeIn 0.5s ease-out forwards;
  }
  
  .animate-content-reveal {
    opacity: 0; 
    animation: contentUnifiedReveal 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.9s forwards;
  }

  /* HIDE SCROLLBAR CLASS */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Responsive Safari Height */
  :root {
    --safari-height: 350px;
  }
  @media (min-width: 640px) {
    :root {
      --safari-height: 450px;
    }
  }
  @media (min-width: 768px) {
    :root {
      --safari-height: 630px;
    }
  }
`;

const SafariMockup = ({
  children,
  url = "magicui.design",
  className = "",
}: {
  children: React.ReactNode;
  url?: string;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <>
      <style>{styles}</style>
      <div
        ref={containerRef}
        className={`relative w-full flex justify-center p-2 sm:p-4 md:p-8 ${className} h-[350px] sm:h-[450px] md:h-[630px]`}
      >
        {/* CONTAINER UTAMA */}
        <div
          className={`
            relative w-full max-w-5xl bg-[#1C1C1E] rounded-2xl 
            border border-white/10 ring-1 ring-black/5 overflow-hidden origin-top
            ${isInView ? "animate-sequence" : "opacity-0"}
          `}
        >
          {/* === HEADER BAR === */}
          <div className="absolute top-0 left-0 right-0 h-[40px] sm:h-[46px] md:h-[52px] flex items-center px-2 sm:px-3 md:px-4 py-2 md:py-3 bg-[#282828] border-b border-neutral-700/50 z-20">
            {/* 1. Traffic Lights (Delay 0.3s) */}
            <div
              className={`flex items-center gap-2 mr-4 ${
                isInView ? "animate-icon" : ""
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/10 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/10 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/10 shadow-sm" />
            </div>

            {/* 2. Sidebar & Nav (Delay 0.4s) */}
            <div className="hidden sm:flex items-center gap-2 mr-4 text-neutral-400">
              <div
                className={isInView ? "animate-icon" : ""}
                style={{ animationDelay: "0.4s" }}
              >
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <PanelLeft size={16} strokeWidth={1.5} />
                </button>
              </div>
              <div
                className={`flex items-center gap-1 ml-2 ${
                  isInView ? "animate-icon" : ""
                }`}
                style={{ animationDelay: "0.5s" }}
              >
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <ChevronLeft size={16} strokeWidth={2} />
                </button>
                <button className="p-1 hover:bg-white/10 rounded transition-colors opacity-40 cursor-default">
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* 3. Shield (Delay 0.6s) */}
            <div
              className={`mr-2 text-neutral-400 ${
                isInView ? "animate-icon" : ""
              }`}
              style={{ animationDelay: "0.6s" }}
            >
              <Shield size={14} className="fill-current opacity-60" />
            </div>

            {/* 4. Address Bar (Teks URL Muncul Paling Awal 0.2s) */}
            <div className="flex-1 flex items-center justify-center max-w-2xl mx-auto px-2">
              <div className="w-full flex items-center justify-center relative h-8 bg-[#3A3A3C] rounded-lg text-xs sm:text-sm text-neutral-300 font-normal shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] cursor-default">
                {/* TEKS URL */}
                <div
                  className={`flex items-center gap-1.5 opacity-80 ${
                    isInView ? "animate-url" : ""
                  }`}
                  style={{ animationDelay: "0.2s" }}
                >
                  <Lock
                    size={10}
                    className="text-neutral-400 fill-neutral-400/20"
                    strokeWidth={2.5}
                  />
                  <span className="text-neutral-200">{url}</span>
                </div>

                {/* Reload Icon (Delay 0.7s) */}
                <div
                  className={`absolute right-2.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer ${
                    isInView ? "animate-icon" : ""
                  }`}
                  style={{ animationDelay: "0.7s" }}
                >
                  <RotateCw size={12} />
                </div>
              </div>
            </div>

            <div className="w-6 mr-2"></div>

            {/* 5. Right Controls (Rapat: 0.8s, 0.85s, 0.9s) */}
            <div className="hidden sm:flex items-center gap-3 ml-2 text-neutral-400">
              {/* Share */}
              <div
                className={isInView ? "animate-icon" : ""}
                style={{ animationDelay: "0.8s" }}
              >
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <Share size={15} strokeWidth={2} />
                </button>
              </div>
              {/* PLUS Icon (0.85s) */}
              <div
                className={isInView ? "animate-icon" : ""}
                style={{ animationDelay: "0.85s" }}
              >
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <Plus size={16} strokeWidth={2} />
                </button>
              </div>
              {/* COPY/TABS Icon (0.9s) - Ini tanda mulai naik */}
              <div
                className={isInView ? "animate-icon" : ""}
                style={{ animationDelay: "0.9s" }}
              >
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <Copy size={15} strokeWidth={2} className="rotate-90" />
                </button>
              </div>
            </div>
          </div>

          {/* === BODY WRAPPER === */}
          <div className="w-full h-full pt-[42px] sm:pt-[48px] md:pt-[60px] px-1 sm:px-2 pb-1 sm:pb-2 bg-[#121212] flex flex-col">
            {/* KONTEN WEBSITE */}
            <div
              className={`
                    relative flex-1 w-full h-full overflow-hidden 
                    bg-black 
                    rounded-xl 
                    border border-white/5 shadow-sm
                    ${isInView ? "animate-content-reveal" : "opacity-0"}
                `}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DemoPage = () => {
  return (
    <div className="font-sans text-neutral-100 h-full overflow-y-auto hide-scrollbar">
      <div className="relative w-full h-full flex flex-col">
        <div className="absolute inset-0 z-0 bg-[#000]">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
            alt="Background"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
        </div>

        <div className="relative z-10 p-4 sm:p-8 md:p-16 flex flex-col justify-end h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tighter drop-shadow-2xl">
            Safari
            <br />
            No Delay
          </h1>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium">
              Fluid Reveal
            </div>
          </div>
          <p className="text-neutral-300 max-w-md text-xs sm:text-sm leading-relaxed">
            We tweaked the timing: Content starts revealing slightly before the
            lift-off completes, eliminating any perceived lag.
          </p>
        </div>
      </div>
    </div>
  );
};

const HeroHeading = () => {
  return (
    <div className="relative items-center gap-y-2 flex flex-col justify-center text-center">
      <span className="text-neutral-500 text-xs md:text-sm font-medium">
        <MaskedTextReveal delay={0.4}>Programmer's Toolbox</MaskedTextReveal>
      </span>

      <h1
        className="text-[28px] sm:text-[48px] md:text-[84px] font-bold leading-[1.0] max-w-[1000px] tracking-tighter text-white select-none"
        style={{ fontFamily: "'NaNJaune', sans-serif" }}
      >
        <MaskedTextReveal
          delay={0.2}
          style={{ fontFamily: "'NaNJaune', sans-serif" }}
        >
          <span>Build Stunning</span>
        </MaskedTextReveal>
        <div className="flex flex-col md:flex-row items-center justify-center gap-x-4">
          <SelectionBox showFill variant="affinity">
            <MaskedTextReveal
              delay={0.4}
              style={{ fontFamily: "'NaNJaune', sans-serif" }}
            >
              <span className="px-4">Bento Grids</span>
            </MaskedTextReveal>
          </SelectionBox>
          <MaskedTextReveal
            delay={0.4}
            style={{ fontFamily: "'NaNJaune', sans-serif" }}
          >
            <span>Faster</span>
          </MaskedTextReveal>
        </div>
      </h1>

      <div className="relative flex-col items-center -my-10 sm:-my-16 md:-my-22">
        {/* Guide Lines Restored */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
          <div className="absolute top-[43%] left-[-20%] right-[-20%] h-[1px] bg-[#2a2a2a]" />
          <div className="absolute top-[65.8%] left-[-20%] right-[-20%] h-[1px] bg-[#2a2a2a]" />
        </div>

        <div className="my-20 sm:my-32 md:my-42 relative z-10">
          <MaskedTextReveal
            delay={0.7}
            duration={1}
            yOffset={200}
            shouldFade={false}
          >
            <img
              src="/Hero.png"
              alt="BentoFlow"
              className="w-full max-w-[1150px] h-auto select-none"
            />
          </MaskedTextReveal>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none z-0">
          <div className="w-[120%] h-[120%] bg-blue-500/10 blur-[100px] rounded-full" />
        </div>
      </div>
    </div>
  );
};

const MotionLink = motion.create(Link);

export const HeroTop = () => {
  return (
    <main className="relative items-center justify-center w-full z-0 px-4 py-6 md:py-10">
      {/* Top Navigation Mockup */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 flex justify-between items-center text-neutral-500 text-xs sm:text-sm font-medium z-10">
        <span className="hover:text-white transition-colors cursor-pointer">
          <MaskedTextReveal delay={0.4}>BentoGrids</MaskedTextReveal>
        </span>
        <span className="hover:text-white transition-colors cursor-pointer">
          <MaskedTextReveal delay={0.4}>BentoFlow</MaskedTextReveal>
        </span>
      </div>

      <div className="max-w-7xl mx-auto">
        <HeroHeading />
      </div>
    </main>
  );
};

export const HeroBottom = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(containerRef, { amount: 0.3 });
  const videoSrc = "/vid_landing.mp4";

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible]);

  return (
    <main
      ref={containerRef}
      className="relative text-xs items-center box-border caret-transparent justify-center w-full z-0 my-2 p-0 md:text-base md:mt-0 md:mb-10 md:p-3 pt-0 overflow-hidden"
    >
      <div className="relative text-xs items-center box-border caret-transparent flex flex-col justify-center text-center w-full mx-auto p-2 md:text-base">
        <div className="relative text-xs items-center self-center bg-transparent box-border caret-transparent gap-x-5 flex flex-col justify-center max-w-[1000px] gap-y-4 w-full p-2.5 rounded-[20px] md:text-base md:gap-x-8 md:gap-y-8 md:p-2 md:rounded-[40px]">
          <div className="w-full mt-6 relative">
            <SafariMockup url="Bento-Flow.vercel.app">
              <div
                className="relative w-full h-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
                onContextMenu={(e) => e.preventDefault()}
              >
                {videoSrc && (
                  <video
                    ref={videoRef}
                    loop
                    muted
                    playsInline
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
            </SafariMockup>
          </div>
        </div>
      </div>
    </main>
  );
};

export const Hero = () => {
  return (
    <>
      <HeroTop />
      <HeroBottom />
    </>
  );
};
