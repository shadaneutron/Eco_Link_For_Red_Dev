import React from 'react';
import { ShieldCheck, Sparkles, FileText, Target, BarChart2 } from 'lucide-react';

interface BadgesAndCtaProps {
  onStartOnboarding: () => void;
  onOpenDocs: () => void;
}

export const BadgesAndCta: React.FC<BadgesAndCtaProps> = ({ onStartOnboarding, onOpenDocs }) => {
  const badges = [
    { icon: <ShieldCheck className="w-4 h-4 text-[#006A6A]" />, label: 'Secure Transactions' },
    { icon: <Sparkles className="w-4 h-4 text-[#006A6A]" />, label: 'Smart Classification' },
    { icon: <FileText className="w-4 h-4 text-[#006A6A]" />, label: 'Digital Compliance' },
    { icon: <Target className="w-4 h-4 text-[#006A6A]" />, label: 'Real-Time Tracking' },
    { icon: <BarChart2 className="w-4 h-4 text-[#006A6A]" />, label: 'ESG Reporting' },
  ];

  return (
    <section className="border-t border-[#C4C6D0] py-12 lg:py-16 max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12">
      {/* Badges Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {badges.map((b, idx) => (
          <div
            key={idx}
            className="bg-[#EBEEED] border border-[#C4C6D0] rounded-md px-4 py-2.5 flex items-center gap-2.5 font-mono text-base text-[#000A1F] hover:border-[#006A6A] hover:bg-white transition-all shadow-2xs"
          >
            {b.icon}
            <span className="font-medium">{b.label}</span>
          </div>
        ))}
      </div>

      {/* Final CTA Container */}
      <div className="pt-6 text-center space-y-8 max-w-3xl mx-auto">
        <h2 className="font-headline font-semibold text-3xl sm:text-[32px] lg:text-4xl text-[#000A1F] tracking-tight">
          Ready to lead the circular economy?
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartOnboarding}
            className="bg-[#000A1F] hover:bg-[#00204A] text-white px-8 py-4 rounded-xl font-headline font-semibold text-base transition-all active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer"
          >
            Get Started Now
          </button>
          <button
            onClick={onOpenDocs}
            className="bg-[#F7FAF9] border-2 border-[#747780] hover:border-[#000A1F] text-[#000A1F] px-8 py-3.5 rounded-xl font-headline font-semibold text-base transition-all active:scale-[0.98] cursor-pointer"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};
