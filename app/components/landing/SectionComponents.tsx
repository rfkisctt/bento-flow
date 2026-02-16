"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import { MaskedTextReveal } from "../ui/MaskedTextReveal";

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
};

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
  index,
}: FAQItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        delay: index * 0.1,
        layout: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 },
      }}
      className="group rounded-2xl"
    >
      <motion.div
        layout="position"
        onClick={onClick}
        className={`
          relative overflow-hidden rounded-2xl border transition-colors duration-500 cursor-pointer
          ${
            isOpen
              ? "bg-[#4d0000]/20 border-[#990000]/30"
              : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
          }
        `}
      >
        {/* Question Row */}
        <motion.div
          layout="position"
          className="relative z-10 flex items-center gap-3 md:gap-4 p-3 md:p-5"
        >
          {/* Icon Circle */}
          <div
            className={`
            flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors duration-500
            ${isOpen ? "bg-[#990000] text-white" : "bg-white/10 text-white/70"} 
          `}
          >
            {isOpen ? <ChevronDown size={18} /> : <HelpCircle size={18} />}
          </div>

          {/* Question Text */}
          <div className="flex-grow">
            <MaskedTextReveal
              className={`text-base md:text-lg font-medium transition-colors duration-300 ${
                isOpen ? "text-white" : "text-white/80"
              }`}
              delay={index * 0.1}
            >
              <h3>{question}</h3>
            </MaskedTextReveal>
          </div>
        </motion.div>

        {/* Answer Section */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 250,
                    damping: 30,
                    mass: 0.8,
                  },
                  opacity: { duration: 0.2, delay: 0.1 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 300,
                    damping: 35,
                  },
                  opacity: { duration: 0.1 },
                },
              }}
            >
              <div className="px-3 md:px-5 pb-4 md:pb-6 pl-[3.5rem] md:pl-[4.5rem] relative">
                {/* Connecting Line */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "100%",
                    opacity: 1,
                    transition: { delay: 0.1, duration: 0.3 },
                  }}
                  className="absolute left-[2.2rem] top-0 w-0.5 bg-gradient-to-b from-[#990000]/50 to-transparent"
                />

                {/* Answer Bubble with Smooth Blur Entry */}
                <motion.div
                  initial={{ y: 10, opacity: 0, filter: "blur(8px)" }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: {
                      duration: 0.5,
                      ease: "easeOut",
                      delay: 0.1,
                    },
                  }}
                  className="p-4 rounded-xl bg-[#990000]/10 border border-[#990000]/10 text-neutral-200 leading-relaxed text-sm backdrop-blur-sm relative overflow-hidden"
                >
                  <span className="relative z-10">{answer}</span>

                  {/* Decorative ambient glow inside card */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#990000]/10 blur-xl rounded-full pointer-events-none" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export const FAQList = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the collision detection work?",
      answer:
        "Our builder uses a Liquid Physics system. When you move or resize a block, other blocks will intelligently shift to avoid overlapping, ensuring your layout remains clean and structured at all times.",
    },
    {
      question: "Which export formats are supported?",
      answer:
        "You can instantly export your designs to Tailwind CSS, Vanilla CSS, SCSS, or Bootstrap. The generated code is clean, production-ready, and fully responsive across all device sizes.",
    },
    {
      question: "Does it support keyboard shortcuts?",
      answer:
        "Yes! Power users can work faster with shortcuts: Ctrl+Z for Undo, Ctrl+Y for Redo, Ctrl+D to duplicate, and Arrow keys to move or resize (with Shift) selected blocks.",
    },
    {
      question: "Can I customize the grid dimensions and spacing?",
      answer:
        "Absolutely. You can adjust the number of columns and rows, as well as the gap size and border radius through the Settings panel to match your brand's unique style.",
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto text-left">
      <LayoutGroup>
        <div className="flex flex-col gap-4">
          {faqs.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={activeIndex === index}
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              index={index}
            />
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
};
