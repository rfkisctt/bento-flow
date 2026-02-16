"use client";

import React from "react";
import { motion } from "framer-motion";
import { THEME, RUBBER_BAND_SPRING } from "./bento-constants";

interface CornerBracketProps {
  position: "nw" | "ne" | "sw" | "se";
  onMouseDown: (e: React.MouseEvent) => void;
}

export const CornerBracket = ({
  position,
  onMouseDown,
}: CornerBracketProps) => {
  const size = 14;
  const strokeWidth = 2.5;
  const offset = 8;

  const getStyles = () => {
    switch (position) {
      case "nw":
        return { top: offset, left: offset, cursor: "nw-resize" };
      case "ne":
        return { top: offset, right: offset, cursor: "ne-resize" };
      case "sw":
        return { bottom: offset, left: offset, cursor: "sw-resize" };
      case "se":
        return { bottom: offset, right: offset, cursor: "se-resize" };
    }
  };

  const getPath = () => {
    switch (position) {
      case "nw":
        return `M 0 ${size} L 0 0 L ${size} 0`;
      case "ne":
        return `M 0 0 L ${size} 0 L ${size} ${size}`;
      case "sw":
        return `M 0 0 L 0 ${size} L ${size} ${size}`;
      case "se":
        return `M 0 ${size} L ${size} ${size} L ${size} 0`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.4 }}
      transition={RUBBER_BAND_SPRING}
      className="absolute opacity-0 group-hover:opacity-100 z-50"
      style={{ ...getStyles(), width: size, height: size }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onMouseDown(e);
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        <motion.path
          d={getPath()}
          stroke={THEME.maroon}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </motion.div>
  );
};
