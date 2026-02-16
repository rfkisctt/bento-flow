"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Plus,
  Code,
  Copy,
  Check,
  Eye,
  LayoutGrid,
  Sliders,
  X,
  Settings,
  RotateCcw,
  RotateCw,
  HelpCircle,
  Trash2,
  ArrowRight,
  CornerDownRight,
  Keyboard,
  AlertCircle,
} from "lucide-react";
import {
  THEME,
  LIQUID_SPRING,
  RUBBER_BAND_SPRING,
  GOOEY_SPRING,
  MORPH_SPRING,
  GridItem,
  GridSettings,
  generateId,
  findValidPosition,
  checkOverlap,
  CELL_UNIT,
} from "./bento-constants";

import { ResizableBlock } from "./resizable-block";
import LiquidSlider from "../app/components/ui/LiquidSlider";
import BuilderOnboarding from "./builder-onboarding";

export default function BentoBuilder() {
  const [items, setItems] = useState<GridItem[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<GridSettings>({
    cellSize: 40,
    gap: 8,
    borderRadius: 16,
    columns: 25,
    rows: 14,
  });

  const [history, setHistory] = useState<GridItem[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [clipboard, setClipboard] = useState<GridItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setNotification(message);
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
      timeoutRef.current = null;
    }, 3000);
  };

  const saveToHistory = (newItems: GridItem[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newItems);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setItems(newItems);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setItems(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setItems(history[newIndex]);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedId) {
        e.preventDefault();
        const item = items.find((i) => i.id === selectedId);
        if (item) {
          const newItem = {
            ...item,
            id: generateId(),
            x: item.x + 1,
            y: item.y + 1,
          };

          const validPos = findValidPosition(
            newItem,
            items,
            settings.columns,
            settings.rows,
          );
          if (!validPos) {
            showToast("No space available to duplicate block!");
            return;
          }

          newItem.x = validPos.x;
          newItem.y = validPos.y;

          const newItems = [...items, newItem];
          saveToHistory(newItems);
          setSelectedId(newItem.id);
        }
        return;
      }

      if (e.key === "Tab" && items.length > 0) {
        e.preventDefault();
        if (!selectedId) {
          setSelectedId(items[0].id);
        } else {
          const currentIndex = items.findIndex((i) => i.id === selectedId);
          const nextIndex = (currentIndex + 1) % items.length;
          setSelectedId(items[nextIndex].id);
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "c" && selectedId) {
        e.preventDefault();
        const item = items.find((i) => i.id === selectedId);
        if (item) setClipboard(item);
        showToast("Block copied to clipboard");
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "v" && clipboard) {
        e.preventDefault();
        const newItem = {
          ...clipboard,
          id: generateId(),
          x: clipboard.x + 1,
          y: clipboard.y + 1,
        };

        const validPos = findValidPosition(
          newItem,
          items,
          settings.columns,
          settings.rows,
        );
        if (!validPos) {
          showToast("No space available to paste block!");
          return;
        }

        newItem.x = validPos.x;
        newItem.y = validPos.y;

        const newItems = [...items, newItem];
        saveToHistory(newItems);
        setSelectedId(newItem.id);
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        removeItem(selectedId);
        setSelectedId(null);
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (showHelp) setShowHelp(false);
        else if (showCode) setShowCode(false);
        else if (showSettings) setShowSettings(false);
        else setSelectedId(null);
        return;
      }

      if (
        selectedId &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
        const item = items.find((i) => i.id === selectedId);
        if (!item) return;

        let dx = 0;
        let dy = 0;
        if (e.key === "ArrowUp") dy = -1;
        if (e.key === "ArrowDown") dy = 1;
        if (e.key === "ArrowLeft") dx = -1;
        if (e.key === "ArrowRight") dx = 1;

        if (e.shiftKey) {
          updateItem(selectedId, {
            width: Math.max(1, item.width + dx),
            height: Math.max(1, item.height + dy),
          });
        } else {
          updateItem(selectedId, {
            x: Math.max(
              0,
              Math.min(settings.columns - item.width, item.x + dx),
            ),
            y: Math.max(0, Math.min(settings.rows - item.height, item.y + dy)),
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    historyIndex,
    history,
    selectedId,
    clipboard,
    items,
    settings,
    showHelp,
    showCode,
    showSettings,
  ]);

  const updateSetting = (key: keyof GridSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const addItem = () => {
    const newItem: GridItem = {
      id: generateId(),
      x: 0,
      y: 0,
      width: 2,
      height: 2,
      title: `Block ${items.length + 1}`,
    };

    const validPos = findValidPosition(
      newItem,
      items,
      settings.columns,
      settings.rows,
    );

    if (!validPos) {
      showToast("No space available for new block!");
      return;
    }

    newItem.x = validPos.x;
    newItem.y = validPos.y;

    const newItems = [...items, newItem];
    saveToHistory(newItems);
  };

  const removeItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    saveToHistory(newItems);
  };

  const updateItem = (id: string, updates: Partial<GridItem>) => {
    setItems((prevItems) => {
      const itemIndex = prevItems.findIndex((i) => i.id === id);
      if (itemIndex === -1) return prevItems;

      const updatedItem = { ...prevItems[itemIndex], ...updates };
      const otherItems = prevItems.filter((i) => i.id !== id);

      const hasCollision = otherItems.some((other) =>
        checkOverlap(updatedItem, other),
      );
      if (hasCollision) return prevItems;

      updatedItem.x = Math.max(
        0,
        Math.min(settings.columns - updatedItem.width, updatedItem.x),
      );
      updatedItem.y = Math.max(
        0,
        Math.min(settings.rows - updatedItem.height, updatedItem.y),
      );

      return prevItems.map((item) => (item.id === id ? updatedItem : item));
    });
  };

  const [exportFormat, setExportFormat] = useState<string>("css");

  const frameworkIcons: Record<string, React.ReactNode> = {
    css: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" />
      </svg>
    ),
    tailwind: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    ),
    bootstrap: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572zm.324 1.206H9.957v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.326-1.663zM24 11.39v1.218c-1.128.108-1.817.944-2.226 2.268-.407 1.319-.463 2.937-.42 4.186.045 1.3-.968 2.5-2.337 2.5H4.985c-1.37 0-2.383-1.2-2.337-2.5.043-1.249-.013-2.867-.42-4.186-.41-1.324-1.1-2.16-2.228-2.268V11.39c1.128-.108 1.819-.944 2.227-2.268.408-1.319.464-2.937.42-4.186-.045-1.3.968-2.5 2.338-2.5h14.032c1.37 0 2.382 1.2 2.337 2.5-.043 1.249.013 2.867.42 4.186.409 1.324 1.098 2.16 2.226 2.268zm-7.927 2.817c0-1.354-.953-2.333-2.368-2.488v-.057c1.04-.169 1.856-1.135 1.856-2.213 0-1.537-1.213-2.538-3.062-2.538h-4.16v10.172h4.181c2.218 0 3.553-1.086 3.553-2.876z" />
      </svg>
    ),
    scss: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zM9.615 15.998c.175.645.156 1.248-.024 1.792l-.065.18c-.024.061-.052.12-.078.176-.14.29-.326.56-.555.81-.698.759-1.672 1.047-2.09.805-.45-.262-.226-1.335.584-2.19.871-.918 2.12-1.509 2.12-1.509v-.003l.108-.061zm9.911-10.861c-.542-2.133-4.077-2.834-7.422-1.645-1.989.707-4.144 1.818-5.693 3.267C4.568 8.48 4.275 9.98 4.396 10.607c.427 2.211 3.457 3.657 4.703 4.73v.006c-.367.18-3.056 1.529-3.686 2.925-.675 1.47.105 2.521.615 2.655 1.575.436 3.195-.36 4.065-1.649.84-1.261.766-2.881.404-3.676.496-.13 1.077-.195 1.816-.104 2.1.24 2.51 1.515 2.43 2.055-.08.54-.525.846-.674.936-.15.09-.195.12-.18.18.015.09.075.075.18.06.145-.03.921-.371.96-1.215.045-1.075-.99-2.311-2.82-2.281-.755.015-1.23.105-1.56.225-.03-.045-.061-.075-.091-.105-1.35-1.455-3.855-2.475-3.75-4.41.03-.705.285-2.564 4.8-4.814 3.705-1.845 6.66-1.335 7.17-.21.735 1.605-1.575 4.59-5.415 5.025-1.47.165-2.235-.405-2.43-.615-.21-.225-.24-.24-.315-.195-.12.06-.045.255 0 .375.12.3.585.825 1.395 1.095.705.225 2.43.345 4.5-.435 2.325-.87 4.14-3.3 3.6-5.325z" />
      </svg>
    ),
  };

  const generateCode = (format: string) => {
    if (items.length === 0) {
      return { code: "", isEmpty: true };
    }

    let code = "";

    const maxRow = Math.max(...items.map((item) => item.y + item.height));
    const maxCol = Math.max(...items.map((item) => item.x + item.width));

    switch (format) {
      case "css":
        code = `/* BentoFlow CSS Grid */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background-color: #0a0a0a;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(${maxCol}, 1fr);
  grid-template-rows: repeat(${maxRow}, 1fr);
  aspect-ratio: ${maxCol} / ${maxRow};
  gap: ${settings.gap}px;
  width: 100%;
  max-width: 1200px;
}

${items
  .map(
    (item, i) =>
      `.item-${i + 1} {
  grid-column: ${item.x + 1} / span ${item.width};
  grid-row: ${item.y + 1} / span ${item.height};
}`,
  )
  .join("\n\n")}

.bento-card {
  background-color: #1e1e1e;
  border: 1px solid #2a2a2a;
  border-radius: ${settings.borderRadius}px;
  overflow: hidden;
}

<!-- HTML -->
<div class="bento-grid">
${items
  .map((_, i) => `  <div class="bento-card item-${i + 1}"></div>`)
  .join("\n")}
</div>`;
        break;

      case "tailwind":
        code = `<!-- TailwindCSS Grid -->
<div class="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
  <div class="grid grid-cols-${maxCol} w-full max-w-[1200px] gap-[${settings.gap}px]" style="grid-template-rows: repeat(${maxRow}, 1fr); aspect-ratio: ${maxCol} / ${maxRow};">
${items
  .map((item, i) => {
    return `    <div class="col-start-${item.x + 1} col-span-${item.width} row-start-${item.y + 1} row-span-${item.height} bg-neutral-900 border border-neutral-800 rounded-${
      settings.borderRadius >= 16
        ? "2xl"
        : settings.borderRadius >= 8
          ? "xl"
          : "lg"
    } overflow-hidden"></div>`;
  })
  .join("\n")}
  </div>
</div>`;
        break;

      case "bootstrap":
        code = `<!-- Bootstrap 5 + CSS Grid -->
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background-color: #212529;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(${maxCol}, 1fr);
    grid-template-rows: repeat(${maxRow}, 1fr);
    aspect-ratio: ${maxCol} / ${maxRow};
    gap: ${settings.gap}px;
    width: 100%;
    max-width: 1200px;
  }
${items
  .map(
    (item, i) =>
      `  .item-${i + 1} { grid-column: ${item.x + 1} / span ${item.width}; grid-row: ${item.y + 1} / span ${item.height}; }`,
  )
  .join("\n")}
</style>

<div class="bento-grid">
${items
  .map(
    (_, i) =>
      `  <div class="item-${i + 1} card bg-dark border-secondary rounded-${
        settings.borderRadius >= 16 ? "4" : "3"
      }"></div>`,
  )
  .join("\n")}
</div>`;
        break;

      case "scss":
        code = `// BentoFlow SCSS Grid
$grid-columns: ${maxCol};
$grid-rows: ${maxRow};
$grid-gap: ${settings.gap}px;
$card-radius: ${settings.borderRadius}px;
$card-bg: #1e1e1e;
$card-border: #2a2a2a;

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background-color: #0a0a0a;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat($grid-columns, 1fr);
  grid-template-rows: repeat($grid-rows, 1fr);
  aspect-ratio: $grid-columns / $grid-rows;
  gap: $grid-gap;
  width: 100%;
  max-width: 1200px;

${items
  .map(
    (item, i) => `  .item-${i + 1} {
    grid-column: ${item.x + 1} / span ${item.width};
    grid-row: ${item.y + 1} / span ${item.height};
  }`,
  )
  .join("\n\n")}
}

.bento-card {
  background-color: $card-bg;
  border: 1px solid $card-border;
  border-radius: $card-radius;
  overflow: hidden;
}
`;
        break;

      default:
        code = "";
    }

    return { code, isEmpty: false };
  };

  const handleCopy = () => {
    const { code } = generateCode(exportFormat);
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canvasWidth = settings.columns * CELL_UNIT;
  const canvasHeight = settings.rows * CELL_UNIT;

  return (
    <div
      className="min-h-screen w-full font-mono relative overflow-hidden"
      style={{ backgroundColor: THEME.black, color: THEME.textMain }}
    >
      <BuilderOnboarding
        onToggleSettings={setShowSettings}
        onToggleHelp={setShowHelp}
        onToggleExport={setShowCode}
      />
      {/* --- HEADER (Fixed with rounded corners and gooey effect) --- */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={GOOEY_SPRING}
        className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 h-12 md:h-14 w-[95%] md:w-full md:max-w-[1250px] bg-[#1a1a1a] rounded-full border border-[#2a2a2a]"
      >
        <div className="h-full px-3 md:px-5 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/">
              <motion.div
                transition={LIQUID_SPRING}
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer"
              >
                <Image
                  src="/bentoflow.png"
                  alt="BentoFlow Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </Link>
            <span className="font-bold tracking-tight text-sm md:text-base hidden sm:inline">
              BentoFlow
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              id="builder-history-group"
              className="flex items-center gap-1 bg-[#2a2a2a] rounded-xl p-0.5 md:p-1 mr-1 md:mr-2"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={undo}
                disabled={historyIndex <= 0}
                className={`p-1.5 rounded-lg transition-colors ${
                  historyIndex > 0
                    ? "hover:bg-[#333] text-white"
                    : "text-[#444] cursor-not-allowed"
                }`}
                title="Undo (Ctrl+Z)"
              >
                <RotateCcw size={16} />
              </motion.button>
              <div className="w-[1px] h-4 bg-[#444]" />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className={`p-1.5 rounded-lg transition-colors ${
                  historyIndex < history.length - 1
                    ? "hover:bg-[#333] text-white"
                    : "text-[#444] cursor-not-allowed"
                }`}
                title="Redo (Ctrl+Y)"
              >
                <RotateCw size={16} />
              </motion.button>
            </div>

            <motion.button
              id="builder-preview-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={RUBBER_BAND_SPRING}
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-xl text-sm font-medium transition-colors bg-[#2a2a2a] hover:bg-[#333] border border-[#333]"
              style={{ color: isPreview ? THEME.maroon : THEME.textMain }}
            >
              <Eye size={14} />
              <span className="hidden md:inline">
                {isPreview ? "Edit" : "Preview"}
              </span>
            </motion.button>

            <motion.button
              id="builder-export-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={RUBBER_BAND_SPRING}
              onClick={() => setShowCode(true)}
              className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition-colors text-sm font-medium border border-[#333]"
            >
              <Code size={14} />
              <span className="hidden md:inline">Export</span>
            </motion.button>

            <motion.button
              id="builder-help-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={RUBBER_BAND_SPRING}
              onClick={() => setShowHelp(true)}
              className="p-2 rounded-xl bg-[#2a2a2a] text-white hover:bg-[#333] transition-colors"
            >
              <Keyboard size={16} />
            </motion.button>

            <motion.button
              id="builder-settings-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={RUBBER_BAND_SPRING}
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl transition-colors ${
                showSettings
                  ? "bg-[#990000] text-white"
                  : "bg-[#2a2a2a] text-white hover:bg-[#333]"
              }`}
            >
              <Settings size={16} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* --- MAIN CANVAS --- */}
      <main className="pt-16 md:pt-20 pb-8 overflow-auto h-screen">
        <div
          className="flex items-start justify-center p-3 md:p-6"
          style={{ minWidth: canvasWidth + 48 }}
        >
          <div className="relative">
            <motion.div
              ref={canvasRef}
              layout
              transition={MORPH_SPRING}
              className="relative"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                backgroundImage: `
                  linear-gradient(to right, ${THEME.gridLine} 1px, transparent 1px),
                  linear-gradient(to bottom, ${THEME.gridLine} 1px, transparent 1px)
                `,
                backgroundSize: `${CELL_UNIT}px ${CELL_UNIT}px`,
                border: `1px solid ${THEME.gridLine}`,
                borderRadius: `${settings.borderRadius}px`,
                overflow: "hidden",
              }}
            >
              <LayoutGroup>
                <div
                  id="builder-canvas"
                  className="absolute inset-0 z-0 pointer-events-none"
                />
                <motion.div
                  className="absolute inset-0 z-0"
                  onClick={() => setSelectedId(null)}
                />
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <ResizableBlock
                      key={item.id}
                      item={item}
                      items={items}
                      theme={THEME}
                      settings={settings}
                      updateItem={updateItem}
                      removeItem={removeItem}
                      onInteractionEnd={() => saveToHistory(items)}
                      isPreview={isPreview}
                      isSelected={selectedId === item.id}
                      onSelect={() => setSelectedId(item.id)}
                    />
                  ))}
                </AnimatePresence>
              </LayoutGroup>

              {items.length === 0 && !isPreview && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={LIQUID_SPRING}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <p className="text-[#444] text-sm">Click + to add blocks</p>
                </motion.div>
              )}
            </motion.div>

            {!isPreview && (
              <motion.button
                id="builder-add-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={LIQUID_SPRING}
                onClick={addItem}
                className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center border border-dashed border-[#333] hover:border-[#990000] hover:bg-[#990000]/10 transition-colors"
                style={{ color: THEME.maroon }}
              >
                <Plus size={20} />
              </motion.button>
            )}
          </div>
        </div>
      </main>

      {/* --- NOTIFICATION TOAST --- */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 rounded-xl bg-[#2a2a2a] border border-[#333] shadow-xl flex items-center gap-3"
          >
            <AlertCircle size={18} className="text-[#990000]" />
            <span className="text-sm font-medium text-white">
              {notification}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SETTINGS SIDEBAR (Fixed Position - not in navbar flex) --- */}
      <AnimatePresence>
        {showSettings && (
          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={GOOEY_SPRING}
            id="builder-settings-panel"
            className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-6 md:top-26 w-full md:w-72 z-40 max-h-[60vh] md:max-h-none overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...LIQUID_SPRING, delay: 0.1 }}
              className="bg-[#1a1a1a]/95 md:bg-[#1a1a1a]/90 backdrop-blur-xl rounded-t-3xl md:rounded-3xl border border-[#2a2a2a] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#2a2a2a]/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={RUBBER_BAND_SPRING}
                    className="w-6 h-6 rounded-lg bg-[#990000]/10 flex items-center justify-center"
                  >
                    <Settings size={12} className="text-[#990000]" />
                  </motion.div>
                  <span className="text-sm font-semibold text-white">
                    Settings
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={RUBBER_BAND_SPRING}
                  onClick={() => setShowSettings(false)}
                  className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center hover:bg-[#444] transition-colors"
                >
                  <X size={12} className="text-neutral-400" />
                </motion.button>
              </div>

              {/* Settings Content - simplified to avoid scrollbar */}
              <div className="p-4">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...LIQUID_SPRING, delay: 0.15 }}
                  className="bg-[#0a0a0a]/50 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sliders size={12} className="text-neutral-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Style
                    </span>
                  </div>

                  <div className="space-y-1">
                    <LiquidSlider
                      label="Gap"
                      value={settings.gap}
                      min={0}
                      max={24}
                      unit="px"
                      onChange={(v) => updateSetting("gap", v)}
                    />

                    <LiquidSlider
                      label="Border Radius"
                      value={settings.borderRadius}
                      min={0}
                      max={32}
                      unit="px"
                      onChange={(v) => updateSetting("borderRadius", v)}
                    />
                  </div>
                </motion.div>

                {/* Collision Info */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...LIQUID_SPRING, delay: 0.2 }}
                  className="bg-[#990000]/5 rounded-2xl p-4 mt-3 border border-[#990000]/10"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-[#990000]"
                    />
                    <span className="text-xs text-[#990000]/80 font-medium">
                      Collision: Active
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-2">
                    Blocks will not overlap
                  </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...LIQUID_SPRING, delay: 0.25 }}
                  className="mt-3 p-3 rounded-xl bg-[#0a0a0a]/30"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Blocks</span>
                    <motion.span
                      key={items.length}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[#990000] font-bold"
                    >
                      {items.length}
                    </motion.span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-neutral-400">Canvas</span>
                    <span className="text-neutral-300 font-mono text-[10px]">
                      {settings.columns}×{settings.rows}
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* --- HELP MODAL --- */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={LIQUID_SPRING}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div id="builder-help-modal" className="w-full max-w-2xl relative">
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={LIQUID_SPRING}
                className="bg-[#111] border border-[#333] rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-[#222] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#990000]/10 flex items-center justify-center text-[#990000]">
                      <Keyboard size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Keyboard Shortcuts
                      </h3>
                      <p className="text-sm text-[#666]">Power user commands</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#333] text-[#888] hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div
                  className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-h-[60vh] overflow-y-auto"
                  data-lenis-prevent
                >
                  {[
                    {
                      icon: <RotateCcw size={16} />,
                      label: "Undo",
                      keys: ["Ctrl", "Z"],
                    },
                    {
                      icon: <RotateCw size={16} />,
                      label: "Redo",
                      keys: ["Ctrl", "Y"],
                    },
                    {
                      icon: <Copy size={16} />,
                      label: "Duplicate",
                      keys: ["Ctrl", "D"],
                    },
                    {
                      icon: <Copy size={16} />,
                      label: "Copy Block",
                      keys: ["Ctrl", "C"],
                    },
                    {
                      icon: <CornerDownRight size={16} />,
                      label: "Paste Block",
                      keys: ["Ctrl", "V"],
                    },
                    {
                      icon: <ArrowRight size={16} />,
                      label: "Next Block",
                      keys: ["Tab"],
                    },
                    {
                      icon: <ArrowRight size={16} />,
                      label: "Move Block",
                      keys: ["Arrows"],
                    },
                    {
                      icon: <ArrowRight size={16} />,
                      label: "Resize Block",
                      keys: ["Shift", "Arrows"],
                    },
                    {
                      icon: <Trash2 size={16} />,
                      label: "Delete Block",
                      keys: ["Del"],
                    },
                    {
                      icon: <X size={16} />,
                      label: "Deselect / Close",
                      keys: ["Esc"],
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1a]/50 border border-[#2a2a2a]"
                    >
                      <div className="flex items-center gap-3 text-[#ccc]">
                        {item.icon}
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.keys.map((key, k) => (
                          <span
                            key={k}
                            className="px-2 py-1 rounded-md bg-[#333] border border-[#444] text-[10px] font-bold text-[#888] min-w-[24px] text-center"
                          >
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CODE MODAL --- */}
      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={LIQUID_SPRING}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div id="builder-code-modal" className="w-full max-w-3xl relative">
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={LIQUID_SPRING}
                className="bg-[#111] border border-[#333] rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-[#222] flex items-center justify-between">
                  <h3 className="text-xl font-bold">Export Code</h3>
                  <button
                    onClick={() => setShowCode(false)}
                    className="hover:text-[#990000] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Framework Tabs */}
                <div className="px-6 py-4 flex gap-2 overflow-x-auto">
                  {[
                    { id: "css", label: "CSS" },
                    { id: "tailwind", label: "Tailwind" },
                    { id: "bootstrap", label: "Bootstrap" },
                    { id: "scss", label: "SCSS" },
                  ].map((fw) => (
                    <button
                      key={fw.id}
                      onClick={() => setExportFormat(fw.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        exportFormat === fw.id
                          ? "bg-[#990000] text-white"
                          : "bg-[#1a1a1a] text-[#888] hover:text-white hover:bg-[#222]"
                      }`}
                    >
                      {frameworkIcons[fw.id]}
                      {fw.label}
                    </button>
                  ))}
                </div>

                {/* Code Display */}
                <div
                  className="p-6 bg-[#0a0a0a] max-h-[50vh] overflow-y-auto"
                  data-lenis-prevent
                >
                  {generateCode(exportFormat).isEmpty ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] flex items-center justify-center mb-4">
                        <LayoutGrid size={32} className="text-[#444]" />
                      </div>
                      <p className="text-[#666] text-sm">
                        No grid items to export
                      </p>
                      <p className="text-[#444] text-xs mt-1">
                        Add blocks to your grid first
                      </p>
                    </div>
                  ) : (
                    <pre className="text-xs text-[#888] font-mono whitespace-pre-wrap break-all sm:break-normal overflow-x-auto">
                      {generateCode(exportFormat).code}
                    </pre>
                  )}
                </div>

                <div className="p-6 border-t border-[#222] bg-[#111] flex justify-between items-center">
                  <span className="text-xs text-[#666]">
                    {items.length} {items.length === 1 ? "block" : "blocks"}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={RUBBER_BAND_SPRING}
                    onClick={handleCopy}
                    disabled={items.length === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors ${
                      items.length === 0
                        ? "bg-[#333] text-[#666] cursor-not-allowed"
                        : "bg-[#990000] text-white"
                    }`}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? "Copied!" : "Copy"}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
