"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface LiquidSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    unit?: string;
    onChange: (value: number) => void;
}

export default function LiquidSlider({
    label,
    value,
    min,
    max,
    unit = "px",
    onChange,
}: LiquidSliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const sliderRectRef = useRef<DOMRect | null>(null);
    const isDraggingRef = useRef(false);

    const [internalValue, setInternalValue] = useState(value);

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    const getPercentage = useCallback((clientX: number) => {
        if (!sliderRectRef.current) return 0;
        const x = clientX - sliderRectRef.current.left;
        return Math.max(0, Math.min(100, (x / sliderRectRef.current.width) * 100));
    }, []);

    const updateUI = useCallback((percent: number, state: "drag" | "release") => {
        if (!sliderRectRef.current || !progressRef.current || !thumbRef.current)
            return;
        const px = (percent / 100) * sliderRectRef.current.width;

        if (state === "drag") {
            gsap.to(progressRef.current, {
                width: `${percent}%`,
                duration: 0.2,
                ease: "power2.out",
                overwrite: "auto",
            });

            gsap.killTweensOf(thumbRef.current, "x");
            gsap.to(thumbRef.current, {
                x: px,
                duration: 0.2,
                ease: "power2.out",
            });
        } else {
            gsap.to(progressRef.current, {
                width: `${percent}%`,
                duration: 1,
                ease: "elastic.out(1, 0.6)",
            });
            gsap.to(thumbRef.current, {
                x: px,
                duration: 1,
                ease: "elastic.out(1, 0.6)",
            });
        }
    }, []);

    const handleStart = useCallback(
        (clientX: number) => {
            if (!sliderRef.current || !thumbRef.current) return;
            isDraggingRef.current = true;
            sliderRectRef.current = sliderRef.current.getBoundingClientRect();

            thumbRef.current.classList.add("active");

            gsap.to(thumbRef.current, {
                scaleX: 1.15,
                scaleY: 0.95,
                duration: 0.3,
                ease: "back.out(1.7)",
                overwrite: "auto",
            });

            const percent = getPercentage(clientX);
            const newValue = Math.round(min + (percent / 100) * (max - min));
            setInternalValue(newValue);
            onChange(newValue);
            updateUI(percent, "drag");

            const handleMove = (e: MouseEvent | TouchEvent) => {
                if (!isDraggingRef.current) return;
                const x = "touches" in e ? e.touches[0].clientX : e.clientX;
                const p = getPercentage(x);
                const v = Math.round(min + (p / 100) * (max - min));
                setInternalValue(v);
                onChange(v);
                updateUI(p, "drag");
            };

            const handleEnd = () => {
                if (!isDraggingRef.current || !thumbRef.current) return;
                isDraggingRef.current = false;

                thumbRef.current.classList.remove("active");

                gsap.to(thumbRef.current, {
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.8,
                    ease: "elastic.out(1.2, 0.4)",
                });

                window.removeEventListener("mousemove", handleMove as any);
                window.removeEventListener("mouseup", handleEnd);
                window.removeEventListener("touchmove", handleMove as any);
                window.removeEventListener("touchend", handleEnd);
                window.removeEventListener("touchcancel", handleEnd);
            };

            window.addEventListener("mousemove", handleMove as any);
            window.addEventListener("mouseup", handleEnd);
            window.addEventListener("touchmove", handleMove as any, {
                passive: false,
            });
            window.addEventListener("touchend", handleEnd);
            window.addEventListener("touchcancel", handleEnd);
        },
        [min, max, onChange, getPercentage, updateUI]
    );

    useEffect(() => {
        if (sliderRef.current) {
            sliderRectRef.current = sliderRef.current.getBoundingClientRect();
            const initialPercent = ((value - min) / (max - min)) * 100;
            gsap.set(thumbRef.current, { xPercent: -50, yPercent: -50 });
            updateUI(initialPercent, "release");
        }

        const handleResize = () => {
            if (sliderRef.current) {
                sliderRectRef.current = sliderRef.current.getBoundingClientRect();
                const p = ((internalValue - min) / (max - min)) * 100;
                updateUI(p, "drag");
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [min, max, value, updateUI, internalValue]);

    return (
        <div className="flex flex-col gap-3 py-2 select-none">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {label}
                </span>
                <span className="text-xs font-mono text-[#990000] font-bold">
                    {internalValue}
                    {unit}
                </span>
            </div>

            <div
                className="relative py-6 cursor-pointer touch-none"
                onMouseDown={(e) => {
                    if (e.button !== 0) return;
                    e.preventDefault();
                    handleStart(e.clientX);
                }}
                onTouchStart={(e) => {
                    handleStart(e.touches[0].clientX);
                }}
            >
                <div
                    ref={sliderRef}
                    className="relative w-full h-[10px] bg-[#1c1c1e] rounded-full pointer-events-none"
                >
                    <div
                        ref={progressRef}
                        className="absolute h-full bg-[#990000] rounded-full will-change-[width]"
                    />

                    <div
                        ref={thumbRef}
                        className="slider-thumb-glass absolute top-1/2 left-0 w-[44px] h-[28px] rounded-full cursor-grab z-10 overflow-hidden will-change-transform"
                    >
                        <div className="slider-thumb-glass-filter absolute inset-0" />
                        <div className="slider-thumb-glass-overlay absolute inset-0" />
                        <div className="slider-thumb-glass-specular absolute inset-0 rounded-full" />
                    </div>
                </div>
            </div>

            {/* SVG FILTER */}
            <svg className="absolute w-0 h-0 overflow-hidden">
                <filter
                    id="mini-liquid-lens-panel"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feImage
                        result="normalMap"
                        xlinkHref="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><radialGradient id='invmap' cx='50%' cy='50%' r='75%'><stop offset='0%' stop-color='rgb(128,128,255)'/><stop offset='90%' stop-color='rgb(255,255,255)'/></radialGradient><rect width='100%' height='100%' fill='url(#invmap)'/></svg>"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="normalMap"
                        scale="-252"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>

            <style jsx>{`
                .slider-thumb-glass {
                    background: #2c2c2e;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
                    transition: background-color 0.15s ease, box-shadow 0.15s ease;
                }

                .slider-thumb-glass-filter {
                    backdrop-filter: blur(0.6px);
                    -webkit-backdrop-filter: blur(0.6px);
                    filter: url(#mini-liquid-lens-panel);
                    opacity: 0;
                    transition: opacity 0.15s ease;
                }

                .slider-thumb-glass-overlay {
                    background: rgba(255, 255, 255, 0.08);
                    opacity: 0;
                    transition: opacity 0.15s ease;
                }

                .slider-thumb-glass-specular {
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.25),
                        inset 0 0 10px rgba(255, 255, 255, 0.15);
                    opacity: 0;
                    transition: opacity 0.15s ease;
                }

                .slider-thumb-glass.active {
                    background: transparent;
                    box-shadow: none;
                }

                .slider-thumb-glass.active .slider-thumb-glass-filter,
                .slider-thumb-glass.active .slider-thumb-glass-overlay,
                .slider-thumb-glass.active .slider-thumb-glass-specular {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}
