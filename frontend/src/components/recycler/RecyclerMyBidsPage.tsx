import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { auctionsApi, BidResponse } from '../../services/api';

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

  const [apiBids, setApiBids] = useState<BidResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setIsLoading(true);
        const data = await auctionsApi.getMyBids();
        setApiBids(data || []);
      } catch (err) {
        console.error('Failed to fetch recycler bids:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBids();
  }, []);

  const mappedApiBids = apiBids.map((b) => ({
    id: `BID-${b.id}`,
    backendBidId: b.id,
    auctionId: b.auction_id,
    title: b.listing?.title || 'Industrial Waste Listing',
    factory: 'Anonymous Generator',
    category: b.listing?.material_type || 'General Waste',
    status: b.status === 'accepted' ? 'Winner' : b.status === 'rejected' ? 'Outbid' : 'Highest Bid',
    yourBid: `${Number(b.amount).toLocaleString()} EGP`,
    highestBid: `${Number(b.amount).toLocaleString()} EGP`,
    endsIn: b.auction_status === 'open' ? 'Active' : 'Closed',
    aiRec: b.status === 'accepted' ? 'Winner - Pending Logistics' : b.status === 'rejected' ? 'Offer Declined' : 'Competitive',
    aiRecType: b.status === 'accepted' ? 'teal' : b.status === 'rejected' ? 'red' : 'teal',
    rawBid: b
  }));

  const bidsList = mappedApiBids;

  const activeBidsCount = apiBids.filter(b => b.auction_status === 'open').length;
  const winningBidsCount = apiBids.filter(b => b.status === 'accepted').length;
  const outbidCount = apiBids.filter(b => b.status === 'rejected').length;
  const closedBidsCount = apiBids.filter(b => b.auction_status === 'closed').length;
  const winRate = apiBids.length > 0 ? Math.round((winningBidsCount / apiBids.length) * 100) : 0;


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
          <p className="font-sans text-2xl font-semibold text-[#181C1C] mt-1">{isLoading ? '...' : activeBidsCount}</p>
        </div>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Winning Bids</p>
          <p className="font-sans text-2xl font-semibold text-[#006A6A] mt-1">{isLoading ? '...' : winningBidsCount}</p>
        </div>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Outbid Auctions</p>
          <p className="font-sans text-2xl font-semibold text-[#BA1A1A] mt-1">{isLoading ? '...' : outbidCount}</p>
        </div>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Closed Auctions</p>
          <p className="font-sans text-2xl font-semibold text-[#181C1C] mt-1">{isLoading ? '...' : closedBidsCount}</p>
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
          {isLoading ? (
            <div className="p-8 text-center bg-white border border-[#C4C6D0] rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#006A6A] mb-2" />
              <p className="font-sans text-sm text-[#44474F]">Loading submitted bids...</p>
            </div>
          ) : bidsList.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#C4C6D0] rounded-lg space-y-3">
              <p className="font-sans text-base font-medium text-[#181C1C]">No Submitted Bids Found</p>
              <p className="font-sans text-sm text-[#44474F]">You have not placed any bids on active auctions yet.</p>
              <button
                onClick={onBrowseMarketplace}
                className="px-5 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] cursor-pointer"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            bidsList.map((bidItem) => (
              <div key={bidItem.id} className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-sans font-semibold text-lg text-[#181C1C]">{bidItem.title}</h3>
                    <p className="font-sans text-sm text-[#44474F]">{bidItem.factory} • {bidItem.category}</p>
                  </div>
                  <span className={`px-3 py-1 font-mono text-xs font-semibold rounded-full ${
                    bidItem.status === 'Winner'
                      ? 'bg-[#8CF3F3] text-[#007070]'
                      : bidItem.status === 'Outbid'
                      ? 'bg-[#FFDAD6] text-[#93000A]'
                      : 'bg-[#E0E3E2] text-[#181C1C]'
                  }`}>
                    {bidItem.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 font-sans text-sm">
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">YOUR BID</p>
                    <p className="font-mono font-semibold text-[#006A6A]">{bidItem.yourBid}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">STATUS</p>
                    <p className="font-mono font-medium text-[#181C1C]">{bidItem.endsIn}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#C4C6D0] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#006A6A]" />
                  <p className="font-sans text-sm font-medium text-[#006A6A]">
                    System Recommendation: {bidItem.aiRec}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onViewDetails && onViewDetails(bidItem)}
                    className="flex-1 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center bg-white"
                  >
                    View Details
                  </button>
                  {bidItem.status === 'Winner' ? (
                    <button
                      type="button"
                      onClick={() => onViewWonAuctions && onViewWonAuctions()}
                      className="flex-1 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer text-center shadow-xs"
                    >
                      View Won Auction
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onIncreaseBid && onIncreaseBid(bidItem)}
                      className="flex-1 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer text-center shadow-xs"
                    >
                      Increase Bid
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

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
                <span>Total Active Bids</span>
                <span className="font-medium text-[#181C1C]">{activeBidsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Winning Rate</span>
                <span className="font-medium text-[#181C1C]">{winRate}%</span>
              </div>
            </div>
          </section>

          {/* Section: Recent Activity & Notifications */}
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <h2 className="font-sans font-semibold text-base text-[#181C1C]">
              Recent Activity
            </h2>
            <div className="space-y-3 font-sans text-sm text-[#181C1C]">
              {winningBidsCount > 0 && (
                <div className="flex gap-2.5 items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#006A6A] shrink-0 mt-0.5" />
                  <p>
                    You have <strong>{winningBidsCount}</strong> won auction(s) ready for logistics coordination.
                  </p>
                </div>
              )}
              {outbidCount > 0 && (
                <div className="flex gap-2.5 items-start">
                  <AlertTriangle className="w-5 h-5 text-[#BA1A1A] shrink-0 mt-0.5" />
                  <p>
                    You have <strong>{outbidCount}</strong> declined/outbid offer(s).
                  </p>
                </div>
              )}
              {winningBidsCount === 0 && outbidCount === 0 && (
                <p className="text-xs text-[#747780]">
                  No recent auction status changes recorded.
                </p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
