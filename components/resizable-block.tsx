"use client";

import React, {
  useState,
  useRef,
  forwardRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { motion, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { Trash2, GripVertical, ArrowRight } from "lucide-react";
import {
  THEME,
  LIQUID_SPRING,
  CELL_UNIT,
  GridItem,
  GridSettings,
} from "./bento-constants";
import { CornerBracket } from "./corner-bracket";

interface ResizableBlockProps {
  item: GridItem;
  items: GridItem[];
  theme: typeof THEME;
  settings: GridSettings;
  updateItem: (id: string, updates: Partial<GridItem>) => void;
  removeItem: (id: string) => void;
  onInteractionEnd?: () => void;
  isPreview: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export const ResizableBlock = forwardRef<HTMLDivElement, ResizableBlockProps>(
  (
    {
      item,
      items,
      theme,
      settings,
      updateItem,
      removeItem,
      onInteractionEnd,
      isPreview,
      isSelected,
      onSelect,
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeCorner, setResizeCorner] = useState<string | null>(null);
    const blockRef = useRef<HTMLDivElement>(null);
    const startPosRef = useRef({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      itemX: 0,
      itemY: 0,
    });

    const pixelX = item.x * CELL_UNIT + settings.gap / 2;
    const pixelY = item.y * CELL_UNIT + settings.gap / 2;
    const pixelWidth = item.width * CELL_UNIT - settings.gap;
    const pixelHeight = item.height * CELL_UNIT - settings.gap;

    const springConfig = { stiffness: 200, damping: 25, mass: 0.8 };
    const animatedX = useSpring(pixelX, springConfig);
    const animatedY = useSpring(pixelY, springConfig);
    const animatedWidth = useSpring(pixelWidth, springConfig);
    const animatedHeight = useSpring(pixelHeight, springConfig);

    useEffect(() => {
      animatedX.set(pixelX);
      animatedY.set(pixelY);
      animatedWidth.set(pixelWidth);
      animatedHeight.set(pixelHeight);
    }, [
      pixelX,
      pixelY,
      pixelWidth,
      pixelHeight,
      animatedX,
      animatedY,
      animatedWidth,
      animatedHeight,
    ]);

    useLayoutEffect(() => {
      if (blockRef.current && !isDragging && !isResizing) {
        gsap.fromTo(
          blockRef.current,
          { scale: 0.97 },
          { scale: 1, duration: 0.5, ease: "elastic.out(1.2, 0.4)" }
        );
      }
    }, [isDragging, isResizing]);

    const handleDragStart = (e: React.MouseEvent) => {
      if (isPreview || isResizing) return;
      e.preventDefault();
      setIsDragging(true);
      startPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: item.width,
        height: item.height,
        itemX: item.x,
        itemY: item.y,
      };
    };

    const handleResizeStart = (e: React.MouseEvent, corner: string) => {
      if (isPreview) return;
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setResizeCorner(corner);
      startPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: item.width,
        height: item.height,
        itemX: item.x,
        itemY: item.y,
      };
    };

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          const deltaX = e.clientX - startPosRef.current.x;
          const deltaY = e.clientY - startPosRef.current.y;
          const newX = Math.max(
            0,
            Math.min(
              settings.columns - item.width,
              startPosRef.current.itemX + Math.round(deltaX / CELL_UNIT)
            )
          );
          const newY = Math.max(
            0,
            Math.min(
              settings.rows - item.height,
              startPosRef.current.itemY + Math.round(deltaY / CELL_UNIT)
            )
          );
          updateItem(item.id, { x: newX, y: newY });
        }

        if (isResizing && resizeCorner) {
          const deltaX = e.clientX - startPosRef.current.x;
          const deltaY = e.clientY - startPosRef.current.y;
          let newWidth = startPosRef.current.width;
          let newHeight = startPosRef.current.height;
          let newX = startPosRef.current.itemX;
          let newY = startPosRef.current.itemY;

          if (resizeCorner.includes("e")) {
            newWidth = Math.max(
              1,
              Math.min(
                settings.columns - newX,
                startPosRef.current.width + Math.round(deltaX / CELL_UNIT)
              )
            );
          }
          if (resizeCorner.includes("w")) {
            const wd = Math.round(deltaX / CELL_UNIT);
            newWidth = Math.max(1, startPosRef.current.width - wd);
            newX = Math.max(
              0,
              Math.min(
                startPosRef.current.itemX + startPosRef.current.width - 1,
                startPosRef.current.itemX + wd
              )
            );
          }
          if (resizeCorner.includes("s")) {
            newHeight = Math.max(
              1,
              Math.min(
                settings.rows - newY,
                startPosRef.current.height + Math.round(deltaY / CELL_UNIT)
              )
            );
          }
          if (resizeCorner.includes("n")) {
            const hd = Math.round(deltaY / CELL_UNIT);
            newHeight = Math.max(1, startPosRef.current.height - hd);
            newY = Math.max(
              0,
              Math.min(
                startPosRef.current.itemY + startPosRef.current.height - 1,
                startPosRef.current.itemY + hd
              )
            );
          }
          updateItem(item.id, {
            width: newWidth,
            height: newHeight,
            x: newX,
            y: newY,
          });
        }
      };

      const handleMouseUp = () => {
        if (isDragging || isResizing) {
          onInteractionEnd?.();
        }
        setIsDragging(false);
        setIsResizing(false);
        setResizeCorner(null);
      };

      if (isDragging || isResizing) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, isResizing, resizeCorner, item, settings, updateItem]);

    const previewVariants = {
      hidden: { opacity: 0, y: 30, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: LIQUID_SPRING },
    };

    return (
      <motion.div
        ref={blockRef}
        variants={isPreview ? previewVariants : undefined}
        initial={isPreview ? "hidden" : { opacity: 0, scale: 0.9 }}
        animate={isPreview ? "visible" : { opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        whileTap={!isPreview ? { scale: 0.98 } : undefined}
        className={`absolute group border ${
          isDragging || isResizing ? "z-50" : "z-10"
        } ${isPreview ? "cursor-default" : "cursor-move"}`}
        style={{
          left: animatedX,
          top: animatedY,
          width: animatedWidth,
          height: animatedHeight,
          backgroundColor: theme.gray,
          borderColor:
            isDragging || isResizing || isSelected
              ? theme.maroon
              : theme.grayLight,
          borderRadius: settings.borderRadius,
          zIndex: isDragging || isResizing || isSelected ? 50 : 10,
        }}
        onMouseDown={handleDragStart}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {/* Content */}
        <div className="relative h-full w-full p-3 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-bold text-[#990000]/60 uppercase tracking-wider">
              {item.width}×{item.height}
            </span>
            {!isPreview && (
              <motion.button
                whileHover={{ scale: 1.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="text-[#444] hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={12} />
              </motion.button>
            )}
          </div>

          {!isPreview && (
            <div className="flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
              <GripVertical size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* Corner Handles */}
        {!isPreview && (
          <>
            <CornerBracket
              position="nw"
              onMouseDown={(e) => handleResizeStart(e, "nw")}
            />
            <CornerBracket
              position="ne"
              onMouseDown={(e) => handleResizeStart(e, "ne")}
            />
            <CornerBracket
              position="sw"
              onMouseDown={(e) => handleResizeStart(e, "sw")}
            />
            <CornerBracket
              position="se"
              onMouseDown={(e) => handleResizeStart(e, "se")}
            />
          </>
        )}
      </motion.div>
    );
  }
);

ResizableBlock.displayName = "ResizableBlock";
