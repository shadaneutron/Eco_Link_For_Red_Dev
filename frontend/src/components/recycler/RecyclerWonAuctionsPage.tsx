import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Truck,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { shipmentsApi } from '../../services/api';

interface RecyclerWonAuctionsPageProps {
  onGoToMarketplace?: () => void;
  onGoToShipments?: () => void;
  onViewShipmentDetails?: (item: any) => void;
}

export const RecyclerWonAuctionsPage: React.FC<RecyclerWonAuctionsPageProps> = ({
  onGoToMarketplace,
  onGoToShipments,
  onViewShipmentDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Waste Category');
  const [factoryFilter, setFactoryFilter] = useState('Factory');
  const [statusFilter, setStatusFilter] = useState('Shipment Status');
  const [dateFilter, setDateFilter] = useState('Date');
  const [sortBy, setSortBy] = useState('Sort By: Newest');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [apiShipments, setApiShipments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWonShipments() {
      try {
        setIsLoading(true);
        const res = await shipmentsApi.getShipments();
        const data = Array.isArray(res) ? res : (res as any)?.results || [];
        setApiShipments(data);
      } catch (err) {
        console.error('Failed to load won auctions:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWonShipments();
  }, []);

  const handleDownloadManifest = (title: string) => {
    setToastMessage(`Manifest for ${title} downloaded successfully.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const wonList = apiShipments.map(s => ({
    id: s.id,
    title: s.auction_details?.listing_details?.title || s.tracking_number || `Won Auction #${s.id}`,
    factory: 'Factory',
    category: s.auction_details?.listing_details?.material_type || 'Industrial Waste',
    quantity: s.auction_details?.listing_details?.quantity ? `${s.auction_details.listing_details.quantity} Tons` : 'N/A',
    winningBid: s.auction_details?.winning_bid ? `${s.auction_details.winning_bid} EGP / Ton` : 'Accepted Bid',
    winningDate: s.created_at ? new Date(s.created_at).toLocaleDateString() : 'Recent',
    shipmentStatus: s.status,
    status: s.status === 'Confirmed' ? 'Completed' : 'Won',
    suggestion: s.status === 'Pending' ? 'Coordinate pickup' : 'Shipment in progress'
  }));

  const totalWonCount = wonList.length;
  const awaitingPickupCount = apiShipments.filter(s => s.status === 'Pending').length;
  const inProgressCount = apiShipments.filter(s => s.status === 'In Transit' || s.status === 'Driver Assigned' || s.status === 'Weighed').length;
  const completedCount = apiShipments.filter(s => s.status === 'Confirmed' || s.status === 'Delivered').length;

  return (
    <div className="space-y-8 bg-[#F7FAF9]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#000A1F] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-[#8CF3F3]" />
          <span className="font-sans text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <section className="space-y-1">
        <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
          Won Auctions
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          Manage the auctions your company has successfully won and prepare for shipment.
        </p>
      </section>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Won Auctions</p>
          <p className="font-sans text-2xl font-semibold text-[#006A6A] mt-1">{isLoading ? '...' : totalWonCount}</p>
        </div>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Awaiting Pickup</p>
          <p className="font-sans text-2xl font-semibold text-[#181C1C] mt-1">{isLoading ? '...' : awaitingPickupCount}</p>
        </div>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">In Progress</p>
          <p className="font-sans text-2xl font-semibold text-[#181C1C] mt-1">{isLoading ? '...' : inProgressCount}</p>
        </div>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Completed</p>
          <p className="font-sans text-2xl font-semibold text-[#181C1C] mt-1">{isLoading ? '...' : completedCount}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
        <div className="flex flex-1 min-w-[200px] relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#44474F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Auctions..."
            className="w-full pl-10 pr-3 py-2 bg-[#F1F4F3] border border-[#C4C6D0] rounded font-sans text-sm text-[#181C1C] placeholder-[#6B7280] focus:border-[#006A6A] focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Waste Category">Waste Category</option>
            <option value="Ferrous Metal">Ferrous Metal</option>
            <option value="Recyclables">Recyclables</option>
            <option value="Copper Cables">Copper Cables</option>
          </select>

          <select
            value={factoryFilter}
            onChange={(e) => setFactoryFilter(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Factory">Factory</option>
            <option value="Ahmed Factory">Ahmed Factory</option>
            <option value="Polymer Corp">Polymer Corp</option>
            <option value="Metal Recyclers Ltd">Metal Recyclers Ltd</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Shipment Status">Shipment Status</option>
            <option value="Awaiting Pickup">Awaiting Pickup</option>
            <option value="Driver Assigned">Driver Assigned</option>
            <option value="Delivered">Delivered</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Date">Date</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Sort By: Newest">Sort By: Newest</option>
            <option value="Highest Value">Highest Value</option>
            <option value="Status Priority">Status Priority</option>
          </select>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Won Auctions Cards */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="p-8 text-center bg-white border border-[#C4C6D0] rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#006A6A] mb-2" />
              <p className="font-sans text-sm text-[#44474F]">Loading won auctions...</p>
            </div>
          ) : wonList.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#C4C6D0] rounded-lg space-y-3">
              <p className="font-sans text-base font-medium text-[#181C1C]">No Won Auctions Found</p>
              <p className="font-sans text-sm text-[#44474F]">You haven't won any auctions yet. Check the marketplace for active listings.</p>
              <button
                onClick={onGoToMarketplace}
                className="px-5 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] cursor-pointer"
              >
                Go to Marketplace
              </button>
            </div>
          ) : (
            wonList.map((item) => (
              <div key={item.id} className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-sans font-semibold text-lg text-[#181C1C]">{item.title}</h3>
                    <p className="font-sans text-sm text-[#44474F]">{item.factory} • {item.category}</p>
                  </div>
                  <span className="px-3 py-1 bg-[#8CF3F3] text-[#007070] font-mono text-xs font-semibold rounded-full">
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 font-sans text-sm">
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">WINNING BID</p>
                    <p className="font-mono font-semibold text-[#006A6A]">{item.winningBid}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">QUANTITY</p>
                    <p className="font-mono font-medium text-[#181C1C]">{item.quantity}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">WINNING DATE</p>
                    <p className="font-medium text-[#181C1C]">{item.winningDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">SHIPMENT STATUS</p>
                    <p className="font-medium text-[#181C1C]">{item.shipmentStatus}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#C4C6D0] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#006A6A]" />
                  <p className="font-sans text-sm font-medium text-[#006A6A]">
                    System Suggestion: {item.suggestion}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onGoToShipments}
                    className="flex-1 min-w-[120px] py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer text-center shadow-xs"
                  >
                    View Shipment
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewShipmentDetails && onViewShipmentDetails(item.title)}
                    className="flex-1 min-w-[120px] py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center bg-white"
                  >
                    Shipment Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadManifest(item.title)}
                    className="flex-1 min-w-[120px] py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center bg-white"
                  >
                    Download Manifest
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Bottom Action Navigation */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onGoToMarketplace}
              className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
            >
              Marketplace
            </button>
            <button
              onClick={onGoToShipments}
              className="px-6 py-2.5 bg-[#000A1F] text-white rounded font-mono text-sm font-semibold hover:bg-[#00204A] transition-colors cursor-pointer shadow-sm"
            >
              Shipments
            </button>
          </div>
        </div>

        {/* Right Column: Winning Statistics Panel */}
        <aside className="space-y-6">
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <h2 className="font-sans font-semibold text-base text-[#181C1C]">
              Winning Statistics
            </h2>

            <div className="space-y-3 font-sans text-sm text-[#44474F]">
              <div className="flex justify-between">
                <span>Total Winning Value</span>
                <span className="font-medium text-[#181C1C]">1.2M EGP</span>
              </div>
              <div className="flex justify-between">
                <span>Average Winning Price</span>
                <span className="font-medium text-[#181C1C]">12,400 EGP</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Pickups</span>
                <span className="font-medium text-[#181C1C]">3</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Shipments</span>
                <span className="font-medium text-[#181C1C]">18</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
