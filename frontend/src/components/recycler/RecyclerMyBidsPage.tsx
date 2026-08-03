import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowRight
} from 'lucide-react';

interface RecyclerMyBidsPageProps {
  onBrowseMarketplace?: () => void;
  onViewWonAuctions?: () => void;
  onViewDetails?: (item: any) => void;
  onIncreaseBid?: (item: any) => void;
}

export const RecyclerMyBidsPage: React.FC<RecyclerMyBidsPageProps> = ({
  onBrowseMarketplace,
  onViewWonAuctions,
  onViewDetails,
  onIncreaseBid
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Auction Status');
  const [categoryFilter, setCategoryFilter] = useState('Material Category');
  const [factoryFilter, setFactoryFilter] = useState('Factory');
  const [sortBy, setSortBy] = useState('Sort By: Newest');

  const bidsList = [
    {
      id: 'BID-101',
      title: 'Steel Scrap Bundles',
      factory: 'Ahmed Factory',
      category: 'Ferrous Metal',
      status: 'Highest Bid',
      yourBid: '16,000 EGP / Ton',
      highestBid: '16,000 EGP / Ton',
      endsIn: '1 Day 4 Hours',
      aiRec: 'Competitive',
      aiRecType: 'teal'
    },
    {
      id: 'BID-102',
      title: 'Plastic Flakes',
      factory: 'Polymer Corp',
      category: 'Recyclables',
      status: 'Outbid',
      yourBid: '8,500 EGP',
      highestBid: '8,800 EGP',
      endsIn: '6 Hours',
      aiRec: 'Increase Your Bid',
      aiRecType: 'red'
    },
    {
      id: 'BID-103',
      title: 'Paper Waste',
      factory: 'EcoPack Solutions',
      category: 'Paper & Cardboard',
      status: 'Winner',
      yourBid: '12,400 EGP',
      highestBid: '12,400 EGP',
      endsIn: 'Closed',
      aiRec: 'Auction Closed',
      aiRecType: 'closed'
    }
  ];

  return (
    <div className="space-y-8 bg-[#F7FAF9]">
      {/* Title & Subtitle */}
      <section className="space-y-1">
        <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
          My Bids
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          Track all your submitted bids and monitor auction progress.
        </p>
      </section>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Active Bids</p>
          <p className="font-sans text-2xl font-semibold text-[#181C1C] mt-1">18</p>
        </div>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Winning Bids</p>
          <p className="font-sans text-2xl font-semibold text-[#006A6A] mt-1">7</p>
        </div>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Outbid Auctions</p>
          <p className="font-sans text-2xl font-semibold text-[#BA1A1A] mt-1">3</p>
        </div>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Closed Auctions</p>
          <p className="font-sans text-2xl font-semibold text-[#181C1C] mt-1">25</p>
        </div>
      </div>

      {/* Search & Multi-Select Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
        <div className="flex flex-1 min-w-[200px] relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#44474F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bids..."
            className="w-full pl-10 pr-3 py-2 bg-[#F1F4F3] border border-[#C4C6D0] rounded font-sans text-sm text-[#181C1C] placeholder-[#6B7280] focus:border-[#006A6A] focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Auction Status">Auction Status</option>
            <option value="Highest Bid">Highest Bid</option>
            <option value="Outbid">Outbid</option>
            <option value="Winner">Winner</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Material Category">Material Category</option>
            <option value="Ferrous Metal">Ferrous Metal</option>
            <option value="Recyclables">Recyclables</option>
            <option value="Paper & Cardboard">Paper & Cardboard</option>
          </select>

          <select
            value={factoryFilter}
            onChange={(e) => setFactoryFilter(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Factory">Factory</option>
            <option value="Ahmed Factory">Ahmed Factory</option>
            <option value="Polymer Corp">Polymer Corp</option>
            <option value="EcoPack Solutions">EcoPack Solutions</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Sort By: Newest">Sort By: Newest</option>
            <option value="Ending Soon">Ending Soon</option>
            <option value="Highest Amount">Highest Amount</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Bids Cards List + Right Column Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Bids Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Item 1: Steel Scrap Bundles */}
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-sans font-semibold text-lg text-[#181C1C]">Steel Scrap Bundles</h3>
                <p className="font-sans text-sm text-[#44474F]">Ahmed Factory • Ferrous Metal</p>
              </div>
              <span className="px-3 py-1 bg-[#8CF3F3] text-[#007070] font-mono text-xs font-semibold rounded-full">
                Highest Bid
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 font-sans text-sm">
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">YOUR BID</p>
                <p className="font-mono font-semibold text-[#006A6A]">16,000 EGP / Ton</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">ENDS IN</p>
                <p className="font-mono font-medium text-[#181C1C]">1 Day 4 Hours</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#C4C6D0] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#006A6A]" />
              <p className="font-sans text-sm font-medium text-[#006A6A]">
                System Recommendation: Competitive
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => onViewDetails && onViewDetails(bidsList[0])}
                className="flex-1 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center bg-white"
              >
                View Details
              </button>
              <button
                type="button"
                onClick={() => onIncreaseBid && onIncreaseBid(bidsList[0])}
                className="flex-1 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer text-center shadow-xs"
              >
                Increase Bid
              </button>
            </div>
          </div>

          {/* Item 2: Plastic Flakes */}
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-sans font-semibold text-lg text-[#181C1C]">Plastic Flakes</h3>
                <p className="font-sans text-sm text-[#44474F]">Polymer Corp • Recyclables</p>
              </div>
              <span className="px-3 py-1 bg-[#FFDAD6] text-[#93000A] font-mono text-xs font-semibold rounded-full">
                Outbid
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 font-sans text-sm">
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">YOUR BID</p>
                <p className="font-mono font-medium text-[#181C1C]">8,500 EGP</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">HIGHEST BID</p>
                <p className="font-mono font-semibold text-[#BA1A1A]">8,800 EGP</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#C4C6D0] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#BA1A1A]" />
              <p className="font-sans text-sm font-medium text-[#BA1A1A]">
                System Recommendation: Increase Your Bid
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => onViewDetails && onViewDetails(bidsList[1])}
                className="flex-1 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center bg-white"
              >
                View Details
              </button>
              <button
                type="button"
                onClick={() => onIncreaseBid && onIncreaseBid(bidsList[1])}
                className="flex-1 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer text-center shadow-xs"
              >
                Increase Bid
              </button>
            </div>
          </div>

          {/* Item 3: Paper Waste */}
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-sans font-semibold text-lg text-[#181C1C]">Paper Waste</h3>
                <p className="font-sans text-sm text-[#44474F]">EcoPack Solutions</p>
              </div>
              <span className="px-3 py-1 bg-[#8CF3F3] text-[#007070] font-mono text-xs font-semibold rounded-full">
                Winner
              </span>
            </div>

            <p className="font-sans text-sm text-[#44474F]">Auction Closed</p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => onViewWonAuctions && onViewWonAuctions()}
                className="w-full py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center bg-white"
              >
                View Result
              </button>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onBrowseMarketplace}
              className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
            >
              Browse Marketplace
            </button>
            <button
              onClick={onViewWonAuctions}
              className="px-6 py-2.5 bg-[#000A1F] text-white rounded font-mono text-sm font-semibold hover:bg-[#00204A] transition-colors cursor-pointer shadow-sm"
            >
              View Won Auctions
            </button>
          </div>
        </div>

        {/* Right Column: Insights & Notifications */}
        <aside className="space-y-6">
          {/* Section: Auction Insights */}
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <h2 className="font-sans font-semibold text-base text-[#181C1C]">
              Auction Insights
            </h2>
            <div className="space-y-3 font-sans text-sm text-[#44474F]">
              <div className="flex justify-between">
                <span>Total Active Auctions</span>
                <span className="font-medium text-[#181C1C]">42</span>
              </div>
              <div className="flex justify-between">
                <span>Average Winning Rate</span>
                <span className="font-medium text-[#181C1C]">68%</span>
              </div>
            </div>
          </section>

          {/* Section: Recent Notifications */}
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <h2 className="font-sans font-semibold text-base text-[#181C1C]">
              Recent Notifications
            </h2>
            <div className="space-y-3 font-sans text-sm text-[#181C1C]">
              <div className="flex gap-2.5 items-start">
                <AlertTriangle className="w-5 h-5 text-[#BA1A1A] shrink-0 mt-0.5" />
                <p>
                  You were outbid on <strong>Plastic Flakes</strong>.
                </p>
              </div>
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-5 h-5 text-[#006A6A] shrink-0 mt-0.5" />
                <p>
                  You won the auction for <strong>Paper Waste</strong>!
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
