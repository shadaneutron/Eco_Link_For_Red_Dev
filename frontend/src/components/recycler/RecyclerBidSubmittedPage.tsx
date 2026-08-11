import React from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  Gavel,
  Store
} from 'lucide-react';

interface RecyclerBidSubmittedPageProps {
  bidAmount: string;
  wasteName?: string;
  factoryName?: string;
  onContinueBrowsing: () => void;
  onViewMyBids: () => void;
  onGoToDashboard: () => void;
}

export const RecyclerBidSubmittedPage: React.FC<RecyclerBidSubmittedPageProps> = ({
  bidAmount = '16,000',
  wasteName = 'Steel Scrap Bundles',
  factoryName = 'Ahmed Factory',
  onContinueBrowsing,
  onViewMyBids,
  onGoToDashboard
}) => {
  return (
    <div className="space-y-8 bg-[#F7FAF9]">
      {/* Page Title & Subtitle */}
      <section className="space-y-1">
        <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
          Bid Submitted Successfully
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          Your offer has been submitted successfully and is now participating in the live auction.
        </p>
      </section>

      {/* Main Grid: Left Details + Right Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Columns wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Success Banner */}
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-8 flex flex-col items-center text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-[#006A6A] flex items-center justify-center text-white shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-[#8CF3F3]" />
            </div>
            <div className="space-y-1">
              <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
                Bid Submitted Successfully
              </h2>
              <p className="font-sans text-base text-[#44474F]">
                Your bid of <strong className="text-[#181C1C] font-mono">{bidAmount} EGP / Ton</strong> has been recorded. You will be notified of any updates.
              </p>
            </div>
          </div>

          {/* Bid Summary Card */}
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
            <h3 className="font-sans font-semibold text-base text-[#181C1C]">
              Bid Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-sm">
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">WASTE</p>
                <p className="font-medium text-[#181C1C]">{wasteName}</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">FACTORY</p>
                <p className="font-medium text-[#181C1C]">{factoryName}</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">YOUR BID</p>
                <p className="font-mono font-semibold text-[#006A6A]">{bidAmount} EGP / Ton</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">CURRENT HIGHEST BID</p>
                <p className="font-mono font-semibold text-[#181C1C]">{bidAmount} EGP / Ton</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">AUCTION STATUS</p>
                <p className="font-medium text-[#181C1C]">Live</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">TIME REMAINING</p>
                <p className="font-mono font-medium text-[#181C1C]">1 Day 4 Hours</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">SUBMISSION TIME</p>
                <p className="font-mono font-medium text-[#181C1C]">Today - 11:45 AM</p>
              </div>
            </div>
          </div>

          {/* Next Steps Progress Timeline */}
          <div className="space-y-4">
            <h3 className="font-sans font-semibold text-base text-[#181C1C]">
              Next Steps
            </h3>

            <div className="flex flex-col space-y-0 pl-1 font-sans text-sm">
              {/* Step 1: Completed */}
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-5 h-5 text-[#006A6A]" />
                  <div className="w-0.5 h-8 bg-[#006A6A]" />
                </div>
                <p className="font-medium text-[#181C1C] pt-0.5">Bid Submitted</p>
              </div>

              {/* Step 2: Active */}
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-5 h-5 text-[#006A6A]" />
                  <div className="w-0.5 h-8 bg-[#C4C6D0]" />
                </div>
                <p className="font-medium text-[#181C1C] pt-0.5">Waiting for Auction Updates</p>
              </div>

              {/* Step 3: Pending */}
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-[#C4C6D0]" />
                  <div className="w-0.5 h-8 bg-[#C4C6D0]" />
                </div>
                <p className="font-medium text-[#44474F] pt-0.5">Factory Reviews Offers</p>
              </div>

              {/* Step 4: Pending */}
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-[#C4C6D0]" />
                  <div className="w-0.5 h-8 bg-[#C4C6D0]" />
                </div>
                <p className="font-medium text-[#44474F] pt-0.5">Auction Closed</p>
              </div>

              {/* Step 5: Pending */}
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-[#C4C6D0]" />
                </div>
                <p className="font-medium text-[#44474F] pt-0.5">Winner Announced</p>
              </div>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onContinueBrowsing}
              className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
            >
              Continue Browsing
            </button>
            <button
              onClick={onViewMyBids}
              className="px-6 py-2.5 bg-[#000A1F] text-white rounded font-mono text-sm font-semibold hover:bg-[#00204A] transition-colors cursor-pointer"
            >
              View My Bids
            </button>
            <button
              onClick={onGoToDashboard}
              className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Right Column: Auction Insights Panel */}
        <aside className="space-y-6">
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <h2 className="font-sans font-semibold text-base text-[#181C1C]">
              Auction Insights
            </h2>

            <div className="space-y-3 font-sans text-sm text-[#44474F]">
              <div className="flex justify-between">
                <span>Current Position</span>
                <span className="font-medium text-[#006A6A]">Highest Bid</span>
              </div>
              <div className="flex justify-between">
                <span>Competing Companies</span>
                <span className="font-medium text-[#181C1C]">6</span>
              </div>
              <div className="flex justify-between">
                <span>Winning Probability</span>
                <span className="font-medium text-[#181C1C]">High</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C4C6D0] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#006A6A]">
                <Sparkles className="w-4 h-4" />
                <span className="font-mono text-xs font-semibold">System Recommendation</span>
              </div>
            </div>

            <p className="font-sans text-sm text-center font-medium text-[#006A6A]">
              "Your bid is competitive."
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};
