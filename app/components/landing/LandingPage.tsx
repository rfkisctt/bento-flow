import React from "react";

import { HeroTop, HeroBottom } from "./Hero";
import { GridBackground } from "./GridBackground";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { HorizontalLine } from "./HorizontalLine";
import { SectionHeader } from "./shared-ui";
import { FAQList } from "./SectionComponents";
import { GridShowcase } from "./grid-showcase";

export const LandingPage = () => {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen relative">
      <GridBackground />
      <Navbar />

      {/* Line below Navbar. Adjust 'mt-[88px]' to move up/down. */}
      <HorizontalLine className="mt-6" />

      <HeroTop />

      {/* Line Middle of Hero (Text vs Preview) */}
      <HorizontalLine className="mt-6 md:mt-14" />
      <HorizontalLine className="-mt-6 md:-mt-12" />

      <HeroBottom />

      {/* Line below Hero */}
      <HorizontalLine />

      <GridShowcase />
      <HorizontalLine />

      {/* FAQ Section Decomposed for Layout Control */}
      <section className="relative w-full z-10">
        <div className="max-w-[1000px] mx-auto px-4 py-6 md:py-10 flex justify-center">
          <SectionHeader
            variant="bg-[#1a1a1a] gap-x-2 flex border border-[#2a2a2a] px-3 py-1 rounded-[26px]"
            label="FAQ"
            title="Frequently Asked Questions"
            description="Get answers to your questions and discover how we can enhance your brand."
          />
        </div>

        {/* FAQ Middle Line. Add 'my-4', 'mt-10' etc to adjust spacing. */}
        <HorizontalLine />

        <div className="max-w-[1000px] mx-auto px-4 py-6 md:py-10">
          <FAQList />
        </div>
      </section>

      {/* Line below FAQ / above Footer */}
      <HorizontalLine />
      <HorizontalLine className="mt-10" />

      <Footer />
    </div>
  );
};
