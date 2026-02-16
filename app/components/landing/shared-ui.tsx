"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MaskedTextReveal } from "../ui/MaskedTextReveal";

export const Logo = () => {
  return (
    <Link
      href="/"
      aria-label="home"
      className="relative text-white text-xs items-center bg-transparent box-border caret-transparent flex float-left justify-center md:text-base"
    >
      <Image
        src="https://c.animaapp.com/ml0rjfn4Fmltkx/assets/69742c6f33cfc60ce0c4501e_logo_(1).png"
        alt="Eight black outlined stars arranged in a circle on a transparent background."
        width={65}
        height={65}
        className="text-white invert text-lg font-semibold box-border caret-transparent leading-[17px] object-cover transition-transform duration-300 hover:scale-110 hover:rotate-12"
      />
    </Link>
  );
};

export type SectionHeaderProps = {
  variant: string;
  label?: string;
  iconUrl?: string;
  title: string;
  description: string;
};

export const SectionHeader = (props: SectionHeaderProps) => {
  return (
    <div className="relative text-2xl items-center self-center box-border caret-transparent gap-x-3.5 flex flex-col justify-center gap-y-3.5 w-full md:text-base md:self-auto">
      <div
        className={`text-2xl items-center box-border caret-transparent flex justify-center md:text-base ${props.variant}`}
      >
        {props.iconUrl ? (
          <Image
            alt=""
            src={props.iconUrl}
            width={24}
            height={24}
            className="relative text-2xl items-center aspect-square box-border caret-transparent flex justify-center object-cover z-[1] md:text-base h-6 w-6"
          />
        ) : (
          <div className="relative text-sm font-light box-border caret-transparent z-[1]">
            {props.label}
          </div>
        )}
      </div>
      <div className="relative text-2xl items-center box-border caret-transparent gap-x-2 flex flex-col justify-center gap-y-2 md:text-base md:gap-x-1.5 md:gap-y-1.5">
        <MaskedTextReveal
          className="text-center text-2xl sm:text-3xl font-bold leading-tight max-w-[400px] w-full md:text-5xl md:leading-[1.1] md:max-w-[800px]"
          style={{ fontFamily: "'NaNJaune', sans-serif" }}
        >
          {props.title}
        </MaskedTextReveal>
        <MaskedTextReveal
          delay={0.2}
          className="text-center text-neutral-400 text-sm sm:text-base font-normal leading-relaxed max-w-[400px] w-full md:text-lg md:leading-relaxed md:max-w-[450px]"
        >
          {props.description}
        </MaskedTextReveal>
      </div>
    </div>
  );
};
