import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  DollarSign,
  Loader2
} from 'lucide-react';
import { auctionsApi } from '../../services/api';
import { MarketplaceItem } from './RecyclerMarketplaceCatalog';

interface RecyclerPlaceBidPageProps {
  onBack: () => void;
  onSubmitSuccess?: (amount: string) => void;
  item?: MarketplaceItem | null;
  auctionId?: number;
  itemTitle?: string;
  itemFactory?: string;
  itemCategory?: string;
  itemQuantity?: string;
  currentHighestBid?: string;
}

export const RecyclerPlaceBidPage: React.FC<RecyclerPlaceBidPageProps> = ({
  onBack,
  onSubmitSuccess,
  item,
  auctionId,
  itemTitle,
  itemFactory,
  itemCategory,
  itemQuantity,
  currentHighestBid
}) => {
  const displayTitle = item?.title || itemTitle || 'Steel Scrap Bundles';
  const displayFactory = 'Anonymous Generator';
  const displayCategory = item?.category || itemCategory || 'Ferrous Metal';
  const displayQuantity = item?.quantity || itemQuantity || '50 Tons';
  const displayHighestBid = item?.highestBid ? `${Number(item.highestBid).toLocaleString()} EGP / Ton` : (currentHighestBid || '15,800 EGP / Ton');

  const [bidPrice, setBidPrice] = useState('16000');
  const [pickupAvailability, setPickupAvailability] = useState('Today');
  const [processingTime, setProcessingTime] = useState('1 Day');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidPrice) return;

    const targetAuctionId = auctionId || item?.auctionId || item?.backendId;
    if (targetAuctionId) {
      try {
        setIsSubmitting(true);
        await auctionsApi.placeBid(targetAuctionId, bidPrice);
        setToastMessage(`Bid of ${bidPrice} EGP / Ton submitted successfully!`);
        if (onSubmitSuccess) {
          onSubmitSuccess(bidPrice);
        } else {
          setTimeout(() => {
            setToastMessage(null);
            onBack();
          }, 1500);
        }
      } catch (err: any) {
        console.error('Failed to submit bid via API:', err);
        setToastMessage(err.message || 'Failed to submit bid');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (onSubmitSuccess) {
        onSubmitSuccess(bidPrice);
      } else {
        setToastMessage(`Bid of ${bidPrice} EGP / Ton submitted successfully!`);
        setTimeout(() => {
          setToastMessage(null);
          onBack();
        }, 1500);
      }
    }
  };

  const handleSaveDraft = () => {
    setToastMessage('Bid draft saved to your account.');
    setTimeout(() => setToastMessage(null), 3000);
  };

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
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded border border-[#C4C6D0] hover:bg-[#EBEEED] transition-colors cursor-pointer text-[#44474F]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
            Place Bid
          </h1>
        </div>
        <p className="font-sans text-base text-[#44474F] pl-10">
          Submit your offer to participate in this live auction.
        </p>
      </section>

      {/* Top Summary Card */}
      <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Waste Name</p>
            <p className="font-sans font-semibold text-base text-[#181C1C]">{displayTitle}</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Factory</p>
            <p className="font-sans font-semibold text-base text-[#181C1C]">{displayFactory}</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Category</p>
            <p className="font-sans font-semibold text-base text-[#181C1C]">{displayCategory}</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Quantity</p>
            <p className="font-sans font-semibold text-base text-[#181C1C]">{displayQuantity}</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Highest Bid</p>
            <p className="font-sans font-semibold text-base text-[#006A6A]">{displayHighestBid}</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Min Increment</p>
            <p className="font-sans font-semibold text-base text-[#181C1C]">200 EGP</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Ends</p>
            <p className="font-sans font-semibold text-base text-[#181C1C]">1 Day 4 Hours</p>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Form + Right Auction Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-6 shadow-2xs">
            {/* Your Bid */}
            <section className="space-y-3">
              <h2 className="font-headline font-semibold text-xl text-[#181C1C]">Your Bid</h2>
              <div className="space-y-1.5">
                <label className="block font-mono text-xs font-medium text-[#181C1C]">
                  Bid Price (EGP / Ton)
                </label>
                <input
                  type="number"
                  required
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  placeholder="16000"
                  className="w-full h-11 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-base text-[#181C1C] focus:border-[#006A6A] focus:outline-none font-sans"
                />
                <p className="font-sans text-xs text-[#44474F]">
                  The minimum acceptable bid is 16,000 EGP / Ton.
                </p>
              </div>
            </section>

            {/* Pickup Availability */}
            <section className="space-y-3">
              <h2 className="font-headline font-semibold text-xl text-[#181C1C]">Pickup Availability</h2>
              <select
                value={pickupAvailability}
                onChange={(e) => setPickupAvailability(e.target.value)}
                className="w-full h-11 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-base text-[#181C1C] focus:border-[#006A6A] focus:outline-none font-sans cursor-pointer"
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Within 3 Days">Within 3 Days</option>
                <option value="Custom Date">Custom Date</option>
              </select>
            </section>

            {/* Estimated Processing Time */}
            <section className="space-y-3">
              <h2 className="font-headline font-semibold text-xl text-[#181C1C]">Estimated Processing Time</h2>
              <select
                value={processingTime}
                onChange={(e) => setProcessingTime(e.target.value)}
                className="w-full h-11 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-base text-[#181C1C] focus:border-[#006A6A] focus:outline-none font-sans cursor-pointer"
              >
                <option value="1 Day">1 Day</option>
                <option value="2 Days">2 Days</option>
                <option value="3 Days">3 Days</option>
                <option value="Custom">Custom</option>
              </select>
            </section>

            {/* Additional Notes */}
            <section className="space-y-3">
              <h2 className="font-headline font-semibold text-xl text-[#181C1C]">Additional Notes</h2>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Example: Our company can arrange pickup within 24 hours and process the material immediately."
                className="w-full p-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-base text-[#181C1C] placeholder-[#747780] focus:border-[#006A6A] focus:outline-none min-h-[120px] font-sans"
              />
            </section>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 font-mono text-sm text-[#44474F] hover:text-[#181C1C] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#000A1F] text-white rounded font-mono text-sm font-semibold hover:bg-[#00204A] transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#8CF3F3]" />
                    Submitting...
                  </>
                ) : (
                  'Submit Bid'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Auction Information Panel */}
        <aside className="space-y-6">
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <h2 className="font-sans font-semibold text-base text-[#181C1C]">
              Auction Information
            </h2>

            <div className="space-y-3 font-sans text-sm text-[#44474F]">
              <div className="flex justify-between">
                <span>Current Highest Bid</span>
                <span className="font-medium text-[#181C1C]">{displayHighestBid}</span>
              </div>
              <div className="flex justify-between">
                <span>Your Suggested Bid</span>
                <span className="font-medium text-[#006A6A]">{bidPrice ? `${Number(bidPrice).toLocaleString()} EGP` : '16,000 EGP'}</span>
              </div>
              <div className="flex justify-between">
                <span>Auction Ends</span>
                <span className="font-medium text-[#181C1C]">1 Day 4 Hours</span>
              </div>
              <div className="flex justify-between">
                <span>Number of Competitors</span>
                <span className="font-medium text-[#181C1C]">6</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Profitability</span>
                <span className="font-medium text-[#181C1C]">High</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C4C6D0] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#006A6A]">
                <Sparkles className="w-4 h-4" />
                <span className="font-mono text-xs font-semibold">System Recommendation</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-[#80F9CA] text-[#00513B]">
                Recommended
              </span>
            </div>

            <p className="font-sans text-sm text-center font-medium text-[#006A6A]">
              "Competitive Offer"
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};
