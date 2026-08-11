import React from 'react';
import { Cpu, Store, ShieldCheck, BarChart3, ArrowUpRight } from 'lucide-react';
import { BentoCapability } from '../types';

interface ValuePropositionsProps {
  onSelectCapability: (capability: BentoCapability) => void;
}

export const CAPABILITIES: BentoCapability[] = [
  {
    id: 'ai-classification',
    title: 'Material Classification',
    description:
      'Automatically identify industrial waste and improve recycling opportunities through advanced visual processing.',
    iconName: 'Cpu',
    iconBg: 'bg-[#00204A]',
    iconColor: 'text-[#80F9CA]',
    badge: 'Vision System',
    demoType: 'classification',
  },
  {
    id: 'smart-marketplace',
    title: 'Smart Marketplace',
    description:
      'Connect factories, recyclers and logistics companies through transparent, real-time auctions and bidding.',
    iconName: 'Store',
    iconBg: 'bg-[#8CF3F3]',
    iconColor: 'text-[#006A6A]',
    badge: 'Live Bidding',
    demoType: 'marketplace',
  },
  {
    id: 'compliance-automation',
    title: 'Compliance Automation',
    description:
      'Generate Digital Waste Manifests and simplify compliance with Egyptian Waste Management Law No. 202 of 2020.',
    iconName: 'ShieldCheck',
    iconBg: 'bg-[#00204A]',
    iconColor: 'text-[#AEC7FA]',
    badge: 'Law No. 202',
    demoType: 'compliance',
  },
  {
    id: 'esg-sustainability',
    title: 'ESG & Sustainability',
    description:
      'Track carbon savings, environmental impact and sustainability performance through advanced real-time reports.',
    iconName: 'BarChart3',
    iconBg: 'bg-[#8CF3F3]',
    iconColor: 'text-[#007070]',
    badge: 'CO₂ Analytics',
    demoType: 'esg',
  },
];

export const ValuePropositions: React.FC<ValuePropositionsProps> = ({ onSelectCapability }) => {
  const getIcon = (name: string, colorClass: string) => {
    switch (name) {
      case 'Cpu':
        return <Cpu className={`w-6 h-6 ${colorClass}`} />;
      case 'Store':
        return <Store className={`w-6 h-6 ${colorClass}`} />;
      case 'ShieldCheck':
        return <ShieldCheck className={`w-6 h-6 ${colorClass}`} />;
      case 'BarChart3':
        return <BarChart3 className={`w-6 h-6 ${colorClass}`} />;
      default:
        return <Cpu className={`w-6 h-6 ${colorClass}`} />;
    }
  };

  return (
    <section className="space-y-6 max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
      {/* Header */}
      <div className="flex flex-col items-start gap-1">
        <p className="font-mono text-sm text-[#006A6A] uppercase tracking-widest font-medium">
          Capabilities
        </p>
        <h2 className="font-headline font-semibold text-3xl sm:text-[32px] leading-tight text-[#000A1F]">
          Intelligent Waste Management
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CAPABILITIES.map((cap) => (
          <div
            key={cap.id}
            onClick={() => onSelectCapability(cap)}
            className="group relative bg-[#F7FAF9] border border-[#C4C6D0] hover:border-[#006A6A] rounded-2xl p-6 flex flex-col justify-between gap-4 cursor-pointer hover:-translate-y-1 transition-all duration-200 shadow-2xs hover:shadow-md"
          >
            {/* Top row with icon & badge */}
            <div className="flex items-center justify-between">
              <div
                className={`w-12 h-12 rounded-xl ${cap.iconBg} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
              >
                {getIcon(cap.iconName, cap.iconColor)}
              </div>
              <span className="text-[11px] font-mono text-[#006A6A] bg-[#EBEEED] group-hover:bg-[#8CF3F3]/40 px-2.5 py-1 rounded-lg transition-colors font-medium">
                {cap.badge}
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2 flex-grow">
              <h3 className="font-headline font-semibold text-2xl text-[#000A1F] flex items-center justify-between group-hover:text-[#006A6A] transition-colors">
                <span>{cap.title}</span>
                <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#006A6A]" />
              </h3>
              <p className="font-body text-sm text-[#44474F] leading-relaxed">
                {cap.description}
              </p>
            </div>

            {/* Micro Link */}
            <div className="pt-2 border-t border-[#EBEEED] flex items-center text-xs font-mono text-[#006A6A] font-semibold">
              <span>Try Interactive Demo</span>
              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
