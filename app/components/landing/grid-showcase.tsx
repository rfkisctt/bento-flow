"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import { MaskedTextReveal } from "../ui/MaskedTextReveal";

const showcaseItems = [
  {
    id: 1,
    title: "Portfolio Grid",
    color: "bg-indigo-500",
    layout: "grid-cols-3 grid-rows-2",
    items: [
      { span: "col-span-2 row-span-2", bg: "bg-[#2a2a2a]" },
      { span: "col-span-1 row-span-1", bg: "bg-[#333]" },
      { span: "col-span-1 row-span-1", bg: "bg-[#222]" },
    ],
  },
  {
    id: 2,
    title: "Analytics Dashboard",
    color: "bg-emerald-500",
    layout: "grid-cols-4 grid-rows-2",
    items: [
      { span: "col-span-1 row-span-2", bg: "bg-[#2a2a2a]" },
      { span: "col-span-3 row-span-1", bg: "bg-[#333]" },
      { span: "col-span-3 row-span-1", bg: "bg-[#222]" },
    ],
  },
  {
    id: 3,
    title: "Social Feed",
    color: "bg-blue-500",
    layout: "grid-cols-3 grid-rows-3",
    items: [
      { span: "col-span-1 row-span-1", bg: "bg-[#333]" },
      { span: "col-span-2 row-span-2", bg: "bg-[#2a2a2a]" },
      { span: "col-span-1 row-span-2", bg: "bg-[#222]" },
      { span: "col-span-2 row-span-1", bg: "bg-[#1a1a1a]" },
    ],
  },
  {
    id: 4,
    title: "E-commerce Hero",
    color: "bg-orange-500",
    layout: "grid-cols-2 grid-rows-2",
    items: [
      { span: "col-span-1 row-span-2", bg: "bg-[#2a2a2a]" },
      { span: "col-span-1 row-span-1", bg: "bg-[#333]" },
      { span: "col-span-1 row-span-1", bg: "bg-[#222]" },
    ],
  },
  {
    id: 5,
    title: "Gallery Wall",
    color: "bg-pink-500",
    layout: "grid-cols-4 grid-rows-2",
    items: [
      { span: "col-span-2 row-span-1", bg: "bg-[#2a2a2a]" },
      { span: "col-span-1 row-span-1", bg: "bg-[#333]" },
      { span: "col-span-1 row-span-1", bg: "bg-[#222]" },
      { span: "col-span-1 row-span-1", bg: "bg-[#1f1f1f]" },
      { span: "col-span-2 row-span-1", bg: "bg-[#292929]" },
      { span: "col-span-1 row-span-1", bg: "bg-[#333]" },
    ],
  },
];

const GridMiniature = ({ item }: { item: (typeof showcaseItems)[0] }) => {
  return (
    <div className="w-[240px] sm:w-[280px] md:w-[300px] h-[160px] sm:h-[180px] md:h-[200px] bg-[#121212] border border-white/5 rounded-xl p-2 sm:p-3 flex flex-col gap-2 hover:border-white/20 transition-all duration-300 group cursor-pointer relative overflow-hidden">
      {/* Hover Highlight */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Render Grid */}
      <div className={`grid gap-2 w-full h-full ${item.layout}`}>
        {item.items.map((gridItem, idx) => (
          <div
            key={idx}
            className={`${gridItem.span} ${gridItem.bg} rounded-md border border-white/5`}
          />
        ))}
      </div>

      {/* Label */}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        {item.title}
      </div>
    </div>
  );
};

export const GridShowcase = () => {
  return (
    <section
      id="showcase"
      className="relative w-full pt-7 pb-6 bg-[#0a0a0a] border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto px-4 mb-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <MaskedTextReveal
            className="text-3xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "'NaNJaune', sans-serif" }}
          >
            Bento Grid
          </MaskedTextReveal>
          <MaskedTextReveal
            delay={0.2}
            className="text-neutral-400 text-sm md:text-lg"
          >
            The most versatile grid system for your projects.
          </MaskedTextReveal>
        </div>
      </div>

      <div className="relative w-full">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        <Marquee gradient={false} speed={40} pauseOnHover className="py-4">
          <div className="flex gap-6 pr-6">
            {showcaseItems.map((item) => (
              <GridMiniature key={item.id} item={item} />
            ))}
            {/* Duplicate for seamless loop if items are few */}
            {showcaseItems.map((item) => (
              <GridMiniature key={`${item.id}-dup`} item={item} />
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
};
