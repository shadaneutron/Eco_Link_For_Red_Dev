import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  BarChart3,
  X,
  CheckCircle2,
  Sparkles,
  Loader2
} from 'lucide-react';

import { OfferDetailPage } from './OfferDetailPage';
import { OfferAcceptedPage } from './OfferAcceptedPage';
import { auctionsApi, BidResponse } from '../../services/api';

export interface RecyclerOffer {
  id: string;
  rawBidId?: number;
  companyName: string;
  distance: string;
  certificates: string;
  rating: number;
  offeredPrice: string;
  pickupTime: string;
  processingTime: string;
  statusTag: 'Best Match' | 'Pending' | 'Accepted' | 'Declined';
  rawStatus?: 'Pending' | 'Reviewing' | 'Accepted' | 'Declined';
}

interface OffersListPageProps {
  auctionId?: number;
  listingName?: string;
  category?: string;
  listingQuantity?: string;
  listingStatus?: string;
  publishedAgo?: string;
  totalOffersCount?: number;
  onBack: () => void;
  onAcceptOffer?: (offer: RecyclerOffer) => void;
  onPauseListing?: () => void;
}

export const OffersListPage: React.FC<OffersListPageProps> = ({
  auctionId,
  listingName = 'Steel Scrap',
  category = 'Ferrous Metal',
  listingQuantity = '2.3 Tons',
  listingStatus = 'Live',
  publishedAgo = '2 Days Ago',
  totalOffersCount = 6,
  onBack,
  onAcceptOffer,
  onPauseListing
}) => {
  const [offers, setOffers] = useState<RecyclerOffer[]>([
    {
      id: 'off-1',
      companyName: 'Green Recycling',
      distance: '18 km',
      certificates: 'ISO 14001',
      rating: 4.9,
      offeredPrice: '12,500 EGP',
      pickupTime: 'Tomorrow',
      processingTime: '2 Days Proc.',
      statusTag: 'Best Match',
      rawStatus: 'Pending'
    },
    {
      id: 'off-2',
      companyName: 'EcoSteel Solutions',
      distance: '25 km',
      certificates: 'Verified',
      rating: 4.8,
      offeredPrice: '12,200 EGP',
      pickupTime: 'Tomorrow',
      processingTime: '3 Days Proc.',
      statusTag: 'Pending',
      rawStatus: 'Pending'
    },
    {
      id: 'off-3',
      companyName: 'Circular Egypt',
      distance: '12 km',
      certificates: 'Verified',
      rating: 4.6,
      offeredPrice: '11,950 EGP',
      pickupTime: 'Today',
      processingTime: '1 Day Proc.',
      statusTag: 'Pending',
      rawStatus: 'Pending'
    }
  ]);

  const [isLoadingBids, setIsLoadingBids] = useState<boolean>(false);

  useEffect(() => {
    if (!auctionId) return;
    const fetchAuctionBids = async () => {
      try {
        setIsLoadingBids(true);
        const bidsData = await auctionsApi.getAuctionBids(auctionId);
        if (bidsData && bidsData.length > 0) {
          const mapped: RecyclerOffer[] = bidsData.map((b, idx) => ({
            id: `off-api-${b.id}`,
            rawBidId: b.id,
            companyName: b.company_name || b.recycler_name || `Recycler #${b.recycler_id}`,
            distance: '15 km',
            certificates: 'System Verified',
            rating: 4.8,
            offeredPrice: `${Number(b.amount).toLocaleString()} EGP`,
            pickupTime: '24 Hours',
            processingTime: 'Immediate',
            statusTag: b.status === 'accepted' ? 'Accepted' : b.status === 'rejected' ? 'Declined' : idx === 0 ? 'Best Match' : 'Pending',
            rawStatus: b.status === 'accepted' ? 'Accepted' : b.status === 'rejected' ? 'Declined' : 'Pending'
          }));
          setOffers(mapped);
          setSelectedOfferId(mapped[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch auction bids:', err);
      } finally {
        setIsLoadingBids(false);
      }
    };
    fetchAuctionBids();
  }, [auctionId]);

  const [selectedOfferId, setSelectedOfferId] = useState<string>('off-1');
  const [viewingOffer, setViewingOffer] = useState<RecyclerOffer | null>(null);
  const [acceptedOffer, setAcceptedOffer] = useState<RecyclerOffer | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAccept = async (offer: RecyclerOffer) => {
    if (offer.rawBidId) {
      try {
        await auctionsApi.acceptBid(offer.rawBidId);
      } catch (err: any) {
        console.error('Failed to accept bid via API:', err);
      }
    }
    setOffers(
      offers.map((o) =>
        o.id === offer.id
          ? { ...o, statusTag: 'Accepted', rawStatus: 'Accepted' }
          : { ...o, statusTag: 'Pending', rawStatus: 'Declined' }
      )
    );
    showToast(`Accepted offer from ${offer.companyName} (${offer.offeredPrice})!`);
    if (onAcceptOffer) {
      onAcceptOffer(offer);
    }
    setAcceptedOffer(offer);
  };

  const selectedOffer = offers.find((o) => o.id === selectedOfferId);

  if (acceptedOffer) {
    return (
      <OfferAcceptedPage
        offer={acceptedOffer}
        wasteName={listingName}
        quantity={listingQuantity}
        onBackToMarketplace={() => {
          setAcceptedOffer(null);
          if (onBack) onBack();
        }}
        onViewShipment={() => {
          showToast('Navigating to Shipments...');
          setAcceptedOffer(null);
          if (onBack) onBack();
        }}
      />
    );
  }

  if (viewingOffer) {
    return (
      <OfferDetailPage
        offer={viewingOffer}
        wasteName={listingName}
        category={category}
        quantity={listingQuantity}
        listingStatus={listingStatus}
        onBack={() => setViewingOffer(null)}
        onAccept={(off) => {
          handleAccept(off);
          setViewingOffer(null);
        }}
        onReject={async (off) => {
          if (off.rawBidId) {
            try {
              await auctionsApi.rejectBid(off.rawBidId);
            } catch (err) {
              console.error('Failed to reject bid via API:', err);
            }
          }
          setOffers(
            offers.map((o) =>
              o.id === off.id ? { ...o, statusTag: 'Declined', rawStatus: 'Declined' } : o
            )
          );
          setViewingOffer(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-[#20px] font-sans bg-[#F7FAF9] text-[#181C1C] min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#000A1F] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-[#8CF3F3]" />
          <span className="font-sans text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#006A6A] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>
        </div>
        <h1 className="font-headline text-[32px] leading-[40px] font-semibold text-[#181C1C] tracking-tight mb-1">
          Offers Management
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          Compare recycler offers and choose the best partner for this waste listing.
        </p>
      </section>

      {/* Waste Summary Card (6 Metrics Grid) */}
      <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Waste Name</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{listingName}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Category</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{category}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Quantity</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{listingQuantity}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Status</span>
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#80F9CA] text-[#00513B]">
                {listingStatus}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Published</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{publishedAgo}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Total Offers</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{totalOffersCount}</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Offers Table (Left 2 cols) + Insights Card (Right 1 col) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table Container */}
        <div className="lg:col-span-2 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F1F4F3] border-b border-[#C4C6D0]">
                <tr className="font-sans text-xs text-[#44474F]">
                  <th className="p-4 font-medium">Recycler Company</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium">Offered Price</th>
                  <th className="p-4 font-medium">Pickup</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C4C6D0]">
                {offers.map((offer) => {
                  const isSelected = offer.id === selectedOfferId;
                  return (
                    <tr
                      key={offer.id}
                      onClick={() => setSelectedOfferId(offer.id)}
                      className={`transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#E6E9E8]' : 'hover:bg-[#F1F4F3]'
                      }`}
                    >
                      {/* Recycler Company */}
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-semibold text-[#181C1C]">
                            {offer.companyName}
                          </span>
                          <span className="font-sans text-[10px] text-[#44474F]">
                            {offer.distance} | {offer.certificates}
                          </span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-[#006A6A]">
                          <Star className="w-3.5 h-3.5 fill-[#006A6A]" />
                          <span className="font-mono text-xs font-semibold">{offer.rating}</span>
                        </div>
                      </td>

                      {/* Offered Price */}
                      <td className="p-4">
                        <span className="font-mono text-sm font-semibold text-[#181C1C]">
                          {offer.offeredPrice}
                        </span>
                      </td>

                      {/* Pickup & Processing */}
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-sans text-xs font-medium text-[#181C1C]">
                            {offer.pickupTime}
                          </span>
                          <span className="font-sans text-[10px] text-[#44474F]">
                            {offer.processingTime}
                          </span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-mono font-medium ${
                            offer.statusTag === 'Best Match' || offer.statusTag === 'Accepted'
                              ? 'bg-[#80F9CA] text-[#00513B]'
                              : 'bg-[#E0E3E2] text-[#44474F]'
                          }`}
                        >
                          {offer.statusTag}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingOffer(offer)}
                            className="text-[#006A6A] font-mono text-xs hover:underline cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAccept(offer)}
                            className="bg-[#000A1F] text-white px-3 py-1 rounded text-xs font-mono font-medium hover:bg-[#00204A] cursor-pointer"
                          >
                            Accept
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar - Offer Insights Card */}
        <div className="space-y-6">
          <div className="bg-[#00204A] text-[#7189B8] border border-[#C4C6D0] rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#7189B8]" />
              <h2 className="font-mono text-sm font-semibold text-white tracking-wide">
                Offer Insights
              </h2>
            </div>
            <div className="space-y-3 border-t border-[#7189B8]/20 pt-4 font-sans text-xs">
              <div className="flex justify-between items-center">
                <span className="opacity-80">Best Price</span>
                <span className="font-mono font-medium text-white">12,500 EGP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Fastest Pickup</span>
                <span className="font-mono font-medium text-white">Today</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Highest Rating</span>
                <span className="font-mono font-medium text-white">4.9 Stars</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Avg. Offer</span>
                <span className="font-mono font-medium text-white">12,216 EGP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Carbon Saving</span>
                <span className="font-mono font-medium text-[#80F9CA]">1.4 t CO₂</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Footer Action Bar */}
      <section className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-[#C4C6D0]">
        <div className="flex gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onPauseListing || (() => showToast('Listing paused'))}
            className="px-6 py-3 border border-[#BA1A1A]/30 text-[#BA1A1A] rounded font-mono text-xs font-medium hover:bg-[#FFDAD6]/50 transition-colors cursor-pointer"
          >
            Pause Listing
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            if (selectedOffer) {
              handleAccept(selectedOffer);
            }
          }}
          className="w-full sm:w-auto px-8 py-3 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors shadow-xs cursor-pointer text-center"
        >
          Accept Selected Offer
        </button>
      </section>
    </div>
  );
};

