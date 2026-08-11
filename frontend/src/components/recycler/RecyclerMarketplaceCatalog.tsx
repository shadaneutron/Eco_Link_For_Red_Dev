import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Filter,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Sparkles,
  MapPin,
  Clock,
  Tag,
  Gavel,
  Loader2
} from 'lucide-react';
import { listingsApi, auctionsApi, WasteListingResponse, AuctionResponse } from '../../services/api';
import { getMediaUrl } from '../../utils/image';

export interface MarketplaceItem {
  id: string;
  backendId?: number;
  auctionId?: number;
  title: string;
  category: string;
  quantity: string;
  location: string;
  price: string;
  badge: string;
  status: string;
  endsIn: string;
  imageUrl?: string;
  rawListing?: WasteListingResponse;
  highestBid?: string | null;
  bidsCount?: number;
}

interface RecyclerMarketplaceCatalogProps {
  onPlaceBid?: (item: MarketplaceItem) => void;
  onViewDetails?: (item: MarketplaceItem) => void;
}

export const RecyclerMarketplaceCatalog: React.FC<RecyclerMarketplaceCatalogProps> = ({
  onPlaceBid,
  onViewDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [activePage, setActivePage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<MarketplaceItem | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [apiAuctions, setApiAuctions] = useState<AuctionResponse[]>([]);
  const [apiListings, setApiListings] = useState<WasteListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketplaceData = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        const [auctionsData, listingsData] = await Promise.all([
          auctionsApi.getAuctions().catch(() => []),
          listingsApi.getListings().catch(() => [])
        ]);
        setApiAuctions(auctionsData || []);
        setApiListings(listingsData || []);
      } catch (err: any) {
        console.error('Failed to load marketplace data from API:', err);
        setApiError(err.message || 'Failed to load backend listings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarketplaceData();
  }, []);

  const mappedAuctionItems: MarketplaceItem[] = apiAuctions.map((auc) => ({
    id: `AUC-${auc.id}`,
    backendId: auc.listing?.id,
    auctionId: auc.id,
    title: auc.listing?.title || 'Industrial Waste Item',
    category: auc.listing?.material_type || 'General Waste',
    quantity: `${auc.listing?.quantity} ${auc.listing?.unit || 'Tons'}`,
    location: auc.listing?.location || 'Egypt Industrial Zone',
    price: auc.highest_bid ? `${Number(auc.highest_bid).toLocaleString()} EGP/Ton` : 'Starting Bid',
    badge: auc.listing?.condition ? `Condition: ${auc.listing.condition}` : 'Verified Listing',
    status: auc.status === 'open' ? 'Live Auction' : auc.status,
    endsIn: '24h',
    imageUrl: auc.listing?.images && auc.listing.images.length > 0 ? getMediaUrl(auc.listing.images[0]) : undefined,
    rawListing: auc.listing,
    highestBid: auc.highest_bid,
    bidsCount: auc.bids_count
  }));

  const apiItems: MarketplaceItem[] = mappedAuctionItems.length > 0
    ? mappedAuctionItems
    : apiListings.map((l) => ({
        id: `LIST-${l.id}`,
        backendId: l.id,
        auctionId: l.id,
        title: l.title,
        category: l.material_type || 'General Waste',
        quantity: `${l.quantity} ${l.unit || 'Tons'}`,
        location: l.location || 'Egypt Industrial Zone',
        price: 'Auction Open',
        badge: l.condition ? `Condition: ${l.condition}` : 'Verified Listing',
        status: l.status === 'published' ? 'Live Auction' : 'Draft',
        endsIn: '24h',
        imageUrl: l.images && l.images.length > 0 ? getMediaUrl(l.images[0]) : undefined,
        rawListing: l
      }));

  const items: MarketplaceItem[] = apiItems;

  const handleOpenBid = (item: MarketplaceItem) => {
    setActiveItem(item);
    setBidAmount('');
    setIsModalOpen(true);
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || !activeItem) return;
    const targetAuctionId = activeItem.auctionId || activeItem.backendId;
    if (targetAuctionId) {
      try {
        await auctionsApi.placeBid(targetAuctionId, bidAmount);
        setToastMessage(`Bid of ${bidAmount} EGP/Ton submitted for ${activeItem.title}!`);
      } catch (err: any) {
        console.error('Failed to submit bid:', err);
        setToastMessage(err.message || 'Failed to submit bid');
      }
    } else {
      setToastMessage(`Bid of ${bidAmount} EGP/Ton submitted for ${activeItem.title}!`);
    }
    setIsModalOpen(false);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesLoc = selectedLocation === 'All' || item.location.includes(selectedLocation);
    return matchesSearch && matchesCat && matchesLoc;
  });

  return (
    <div className="space-y-8 bg-[#F7FAF9]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#000A1F] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-[#8CF3F3]" />
          <span className="font-sans text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <section className="space-y-1">
        <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
          Marketplace
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          Browse available industrial waste listings and participate in live auctions.
        </p>
      </section>

      {/* Search & Filters Section */}
      <section className="bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#44474F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full h-10 pl-9 pr-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm text-[#181C1C] placeholder-[#747780] focus:border-[#006A6A] focus:outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="All">Category: All</option>
            <option value="Metals">Metals</option>
            <option value="Plastics">Plastics</option>
            <option value="Paper">Paper</option>
            <option value="Glass">Glass</option>
          </select>

          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="h-10 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="All">Material: All</option>
            <option value="Steel">Steel</option>
            <option value="PET">PET/HDPE</option>
            <option value="Aluminum">Aluminum</option>
            <option value="Copper">Copper</option>
            <option value="Cardboard">Cardboard</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="h-10 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="All">Location: All</option>
            <option value="Cairo">Cairo</option>
            <option value="Alexandria">Alexandria</option>
            <option value="Giza">Giza</option>
            <option value="Helwan">Helwan</option>
            <option value="Obour">Obour City</option>
            <option value="10th">10th of Ramadan</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="Live">Live Auction</option>
            <option value="Ending">Ending Soon</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Newest">Sort By: Newest</option>
            <option value="PriceLow">Price: Low to High</option>
            <option value="PriceHigh">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* 4 Metrics Cards Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
            Available Listings
          </p>
          <p className="font-headline font-semibold text-2xl text-[#181C1C]">{isLoading ? '...' : items.length}</p>
        </div>
        <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
            Live Auctions
          </p>
          <p className="font-headline font-semibold text-2xl text-[#181C1C]">{isLoading ? '...' : apiAuctions.filter(a => a.status === 'open').length}</p>
        </div>
        <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
            Verified Materials
          </p>
          <p className="font-headline font-semibold text-2xl text-[#181C1C]">{isLoading ? '...' : apiListings.length}</p>
        </div>
        <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
            Active Bids Total
          </p>
          <p className="font-headline font-semibold text-2xl text-[#181C1C]">{isLoading ? '...' : apiAuctions.reduce((acc, a) => acc + (a.bids_count || 0), 0)}</p>
        </div>
      </section>

      {/* Main Catalog Grid + Sidebar Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Listings Catalog Grid (3 columns wide) */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg overflow-hidden flex flex-col shadow-2xs hover:shadow-md transition-shadow"
              >
                {/* Image Box */}
                <div className="h-40 bg-[#E0E3E2] relative overflow-hidden flex items-center justify-center text-[#747780]">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center"><ImageIcon className="w-8 h-8 opacity-50 mb-2" /><span>No image available</span></div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                        {item.title}
                      </h3>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium bg-[#80F9CA] text-[#00513B] flex-shrink-0">
                        {item.badge}
                      </span>
                    </div>

                    <div className="text-sm text-[#44474F] space-y-1 font-sans">
                      <p>Category: <span className="text-[#181C1C] font-medium">{item.category} • {item.quantity}</span></p>
                      <p>Location: <span className="text-[#181C1C] font-medium">{item.location}</span></p>
                      <p>Price: <span className="text-[#181C1C] font-semibold">{item.price}</span></p>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="flex justify-between items-center pt-2 border-t border-[#C4C6D0] text-xs font-sans">
                    <span className="font-medium text-[#006A6A]">{item.status}</span>
                    <span className="text-[#44474F]">Ends: <span className="font-mono text-[#006A6A]">{item.endsIn}</span></span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (onViewDetails) {
                          onViewDetails(item);
                        } else {
                          handleOpenBid(item);
                        }
                      }}
                      className="flex-1 py-2 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onPlaceBid) {
                          onPlaceBid(item);
                        } else {
                          handleOpenBid(item);
                        }
                      }}
                      className="flex-1 py-2 bg-[#000A1F] text-white rounded font-mono text-xs hover:bg-[#00204A] transition-colors cursor-pointer text-center font-medium"
                    >
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 pt-4">
            <button
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
              disabled={activePage === 1}
              className="px-4 py-1.5 border border-[#C4C6D0] rounded text-xs font-sans text-[#181C1C] hover:bg-[#E6E9E8] disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setActivePage(1)}
              className={`w-9 h-9 rounded text-xs font-sans font-medium ${
                activePage === 1
                  ? 'bg-[#000A1F] text-white'
                  : 'border border-[#C4C6D0] text-[#181C1C] hover:bg-[#E6E9E8]'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setActivePage(2)}
              className={`w-9 h-9 rounded text-xs font-sans font-medium ${
                activePage === 2
                  ? 'bg-[#000A1F] text-white'
                  : 'border border-[#C4C6D0] text-[#181C1C] hover:bg-[#E6E9E8]'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setActivePage(3)}
              className={`w-9 h-9 rounded text-xs font-sans font-medium ${
                activePage === 3
                  ? 'bg-[#000A1F] text-white'
                  : 'border border-[#C4C6D0] text-[#181C1C] hover:bg-[#E6E9E8]'
              }`}
            >
              3
            </button>
            <button
              onClick={() => setActivePage((p) => Math.min(3, p + 1))}
              disabled={activePage === 3}
              className="px-4 py-1.5 border border-[#C4C6D0] rounded text-xs font-sans text-[#181C1C] hover:bg-[#E6E9E8] disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

        {/* Sidebar Marketplace Insights (1 column wide) */}
        <aside className="space-y-6">
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
            <h2 className="font-sans font-semibold text-[#181C1C] mb-4 text-base">
              Marketplace Insights
            </h2>
            <ul className="space-y-4">
              <li className="flex flex-col">
                <span className="font-sans text-[11px] text-[#44474F] uppercase tracking-wider">
                  Available Listings
                </span>
                <span className="font-sans text-base font-medium text-[#181C1C]">
                  {apiListings.length} Active Listings
                </span>
              </li>
              <li className="flex flex-col border-t border-[#C4C6D0]/60 pt-3">
                <span className="font-sans text-[11px] text-[#44474F] uppercase tracking-wider">
                  Open Auctions
                </span>
                <span className="font-sans text-base font-medium text-[#181C1C]">
                  {apiAuctions.filter(a => a.status === 'open').length} Live Auctions
                </span>
              </li>
              <li className="flex flex-col border-t border-[#C4C6D0]/60 pt-3">
                <span className="font-sans text-[11px] text-[#44474F] uppercase tracking-wider">
                  Total Marketplace Bids
                </span>
                <span className="font-sans text-base font-medium text-[#181C1C]">
                  {apiAuctions.reduce((acc, a) => acc + (a.bids_count || 0), 0)} Bids
                </span>
              </li>
              <li className="flex flex-col border-t border-[#C4C6D0]/60 pt-3">
                <span className="font-sans text-[11px] text-[#44474F] uppercase tracking-wider">
                  Platform Verification
                </span>
                <span className="font-sans text-base font-medium text-[#006A6A]">
                  100% Law No. 202 Compliant
                </span>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      {/* Place Auction Bid Modal */}
      {isModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 bg-[#000A1F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-[#C4C6D0]">
              <h3 className="font-headline font-semibold text-xl text-[#181C1C]">
                Place Auction Bid
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#44474F] hover:text-[#181C1C] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 font-sans text-sm text-[#44474F]">
              <p><strong className="text-[#181C1C]">Listing:</strong> {activeItem.title}</p>
              <p><strong className="text-[#181C1C]">Quantity:</strong> {activeItem.quantity}</p>
              <p><strong className="text-[#181C1C]">Location:</strong> {activeItem.location}</p>
              <p><strong className="text-[#181C1C]">Starting Price:</strong> {activeItem.price}</p>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Your Offer Amount (EGP / Ton)
                </label>
                <input
                  type="text"
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="e.g. 16,500"
                  className="w-full h-10 px-3 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#E6E9E8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] cursor-pointer"
                >
                  Confirm &amp; Place Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
