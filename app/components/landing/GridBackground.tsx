"use client";

import React from "react";

export const GridBackground = () => {
  return (
    <div className="absolute inset-x-0 -top-32 bottom-0 z-0 pointer-events-none overflow-hidden">
      {/* Pattern Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <pattern
            id="diagonal-stripe"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M-1,1 l2,-2
                 M0,10 l10,-10
                 M9,11 l2,-2"
              stroke="#2a2a2a"
              strokeWidth="1"
            />
          </pattern>
        </defs>
      </svg>

      {/* Main Grid Container - Aligned with Navbar max-width (1250px) */}
      <div className="relative w-full h-full max-w-[1250px] mx-auto border-x border-[#2a2a2a]">
        {/* === Vertical Columns with Stripes === */}
        {/* Left Striped Column - Change 'w-[60px]' to adjust width */}
        <div className="absolute left-0 w-[50px] h-full border-r border-[#2a2a2a] hidden md:block">
          <svg width="100%" height="100%">
            <rect
              width="100%"
              height="100%"
              fill="url(#diagonal-stripe)"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Right Striped Column - Change 'w-[60px]' to adjust width */}
        <div className="absolute right-0 w-[50px] h-full border-l border-[#2a2a2a] hidden md:block">
          <svg width="100%" height="100%">
            <rect
              width="100%"
              height="100%"
              fill="url(#diagonal-stripe)"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* === Horizontal Lines === */}
        {/* Horizontal lines are now handled structurally in the page components for better alignment */}

        {/* === Center Grid Lines === */}
        {/* Optional: Center lines for extra structure if needed, keeping it clean for now */}
      </div>
    </div>
  );
};
