import React from 'react';
import { X, BookOpen, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface DocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOnboarding: () => void;
}

export const DocModal: React.FC<DocModalProps> = ({ isOpen, onClose, onStartOnboarding }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#000A1F]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border border-[#C4C6D0] w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#F7FAF9] border-b border-[#C4C6D0] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#006A6A] text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-semibold text-xl text-[#000A1F]">
                EcoLink Platform Documentation
              </h3>
              <p className="text-xs font-mono text-[#006A6A]">Architecture, Regulatory Framework &amp; API Standard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#747780] hover:text-[#000A1F] hover:bg-[#EBEEED] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#44474F] font-body leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="font-headline font-semibold text-base text-[#000A1F] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#006A6A]" />
              <span>Egyptian Law No. 202 of 2020 Compliance</span>
            </h4>
            <p>
              EcoLink generates cryptographic Digital Waste Manifests aligned with Article 29 and Article 34 of Law No. 202. All transport records are timestamped and transmitted directly to the Waste Management Regulatory Authority (WMRA) gateway.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#EBEEED]">
            <h4 className="font-headline font-semibold text-base text-[#000A1F] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#006A6A]" />
              <span>Multimodal Material Classification System</span>
            </h4>
            <p>
              Our Vision systems analyze material density, surface purity, and contamination levels across 48 industrial waste codes. Sub-second response times provide instant market valuation and automated sorting instructions.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2 pt-4 border-t border-[#EBEEED]">
            <h4 className="font-headline font-semibold text-base text-[#000A1F]">
              Sealed Bidding Marketplace Protocols
            </h4>
            <p>
              Auctions run under cryptographic zero-knowledge sealed bids to prevent collusion and guarantee fair value for industrial generators and certified recyclers alike.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F7FAF9] border-t border-[#C4C6D0] p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#C4C6D0] text-[#000A1F] rounded-lg font-mono text-sm hover:bg-[#EBEEED] transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onStartOnboarding();
            }}
            className="bg-[#000A1F] hover:bg-[#00204A] text-white px-5 py-2 rounded-lg font-mono text-sm flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Start Onboarding</span>
            <ArrowRight className="w-4 h-4 text-[#8CF3F3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
