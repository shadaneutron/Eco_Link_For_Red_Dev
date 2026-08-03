import React, { useState } from 'react';
import { Leaf, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { HeroFactoryGraphic } from './factory/HeroFactoryGraphic';

interface HeroSectionProps {
  onStartOnboarding: () => void;
  onViewDocs: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartOnboarding, onViewDocs }) => {
  return (
    <section className="grid lg:grid-cols-2 gap-10 xl:gap-14 items-center py-8 lg:py-12 max-w-[1440px] mx-auto px-6 lg:px-10">
      {/* Left Text & CTA */}
      <div className="flex flex-col items-start gap-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#8CF3F3] text-[#007070] px-4 py-1.5 rounded-full font-mono text-sm font-medium shadow-2xs">
          <Leaf className="w-4 h-4 fill-[#007070]" />
          <span>Empowering Circular Economy</span>
        </div>

        {/* Heading */}
        <h1 className="font-headline font-bold text-4xl sm:text-5xl lg:text-[48px] leading-[1.15] text-[#000A1F] tracking-tight">
          Welcome to EcoLink
        </h1>

        {/* Description */}
        <p className="font-body text-lg text-[#44474F] max-w-xl leading-relaxed">
          The advanced platform transforming industrial waste into valuable resources through a secure circular economy ecosystem. Streamline compliance and maximize ESG performance with one intelligent system.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
          <button
            onClick={onStartOnboarding}
            className="bg-[#000A1F] text-white px-7 py-4 rounded-xl font-mono text-base font-medium hover:bg-[#00204A] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md group cursor-pointer"
          >
            <span>Start Onboarding</span>
            <ArrowRight className="w-5 h-5 text-[#8CF3F3] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onViewDocs}
            className="border-2 border-[#006A6A] text-[#006A6A] px-7 py-3.5 rounded-xl font-mono text-base font-medium hover:bg-[#8CF3F3]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Documentation</span>
          </button>
        </div>

        {/* Quick Micro Stat */}
        <div className="flex items-center gap-6 pt-2 text-xs font-mono text-[#747780]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#006A6A]" />
            <span>Law No. 202 Compliance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#006A6A]" />
            <span>Real-time Bidding</span>
          </div>
        </div>
      </div>

      {/* Right Hero Visual 3D Graphic */}
      <div className="relative group w-full">
        {/* Glow backdrop blur */}
        <div className="absolute inset-0 bg-[#006A6A]/10 rounded-[32px] blur-3xl group-hover:bg-[#006A6A]/15 transition-all duration-500" />

        {/* Main Render Card */}
        <div className="relative bg-[#F7FAF9] rounded-[32px] border border-[#C4C6D0] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <HeroFactoryGraphic />
        </div>
      </div>
    </section>
  );
};
