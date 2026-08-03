import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  ShieldCheck,
  ArrowLeft,
  X,
  Bookmark,
  Share2,
  Check,
  AlertCircle
} from 'lucide-react';

interface RecyclerWasteDetailProps {
  onBack: () => void;
  onPlaceBidSuccess?: (amount: string) => void;
  onOpenPlaceBidPage?: () => void;
}

export const RecyclerWasteDetail: React.FC<RecyclerWasteDetailProps> = ({
  onBack,
  onPlaceBidSuccess,
  onOpenPlaceBidPage
}) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('16,000');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const images = [
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd4e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80'
  ];

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    setToastMessage(isSaved ? 'Removed from saved listings' : 'Listing saved to your favorites');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount) return;
    setIsBidModalOpen(false);
    setToastMessage(`Bid of ${bidAmount} EGP / Ton submitted successfully!`);
    if (onPlaceBidSuccess) {
      onPlaceBidSuccess(bidAmount);
    }
    setTimeout(() => setToastMessage(null), 3500);
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
            Waste Listing Details
          </h1>
        </div>
        <p className="font-sans text-base text-[#44474F] pl-10">
          Review the waste listing before submitting your bid.
        </p>
      </section>

      {/* Grid Layout: Left Gallery/Description + Right Spec Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Image Gallery & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Gallery */}
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg overflow-hidden shadow-2xs">
            <div className="aspect-video bg-[#E0E3E2] relative overflow-hidden">
              <img
                src={images[selectedImage]}
                alt="Steel Scrap Bundles"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 px-3 py-1 bg-[#80F9CA] text-[#00513B] font-mono text-xs font-semibold rounded-full shadow-xs">
                System Verified • Grade A Steel
              </span>
            </div>

            {/* Thumbnails */}
            <div className="p-4 grid grid-cols-3 gap-4 bg-white">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === idx
                      ? 'border-[#006A6A] opacity-100 scale-98'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Waste Description */}
          <section className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-3 shadow-2xs">
            <h2 className="font-headline font-semibold text-xl text-[#181C1C]">
              Waste Description
            </h2>
            <p className="font-sans text-base text-[#44474F] leading-relaxed">
              High-quality industrial steel scrap generated from manufacturing processes. Material has been sorted and stored properly in a dry, indoor warehouse. Suitable for recycling and reprocessing into structural steel beams or industrial wire rods.
            </p>
          </section>
        </div>

        {/* Right Column: Spec Cards & Bidding Action */}
        <div className="space-y-6">
          {/* Waste Information Card */}
          <section className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <div className="flex justify-between items-start">
              <h2 className="font-sans font-bold text-lg text-[#181C1C]">Steel Scrap Bundles</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#80F9CA] text-[#00513B]">
                Live Auction
              </span>
            </div>

            <div className="space-y-2.5 font-sans text-sm text-[#44474F]">
              <div className="flex justify-between">
                <span>Category</span>
                <span className="font-medium text-[#181C1C]">Ferrous Metal</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity</span>
                <span className="font-medium text-[#181C1C]">50 Tons</span>
              </div>
              <div className="flex justify-between">
                <span>Condition</span>
                <span className="font-medium text-[#181C1C]">Sorted</span>
              </div>
              <div className="flex justify-between">
                <span>Purity</span>
                <span className="font-medium text-[#181C1C]">95%</span>
              </div>
              <div className="flex justify-between">
                <span>Origin</span>
                <span className="font-medium text-[#181C1C]">Ahmed Factory</span>
              </div>
              <div className="flex justify-between">
                <span>Location</span>
                <span className="font-medium text-[#181C1C]">10th of Ramadan</span>
              </div>
              <div className="flex justify-between">
                <span>Start Price</span>
                <span className="font-mono font-medium text-[#181C1C]">15,000 EGP / Ton</span>
              </div>
              <div className="flex justify-between">
                <span>Ends</span>
                <span className="font-mono font-medium text-[#006A6A]">1 Day 4 Hours</span>
              </div>
              <div className="flex justify-between">
                <span>Availability</span>
                <span className="font-medium text-[#006A6A]">Ready for Pickup</span>
              </div>
            </div>
          </section>

          {/* Classification Details Card */}
          <section className="bg-[#8CF3F3] text-[#007070] border border-[#C4C6D0] rounded-lg p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#007070]" />
              <h2 className="font-sans font-bold text-base text-[#007070]">Classification Details</h2>
            </div>
            <div className="space-y-2 font-sans text-sm text-[#007070]">
              <div className="flex justify-between">
                <span>Material</span>
                <span className="font-semibold">Steel Scrap</span>
              </div>
              <div className="flex justify-between">
                <span>Confidence</span>
                <span className="font-semibold">96%</span>
              </div>
              <div className="flex justify-between">
                <span>Value</span>
                <span className="font-semibold">High</span>
              </div>
              <div className="flex justify-between">
                <span>Hazard</span>
                <span className="font-semibold">Non-Hazardous</span>
              </div>
              <div className="flex justify-between">
                <span>Carbon Recovery</span>
                <span className="font-semibold">1.4 Tons CO₂</span>
              </div>
            </div>
          </section>

          {/* Factory Information */}
          <section className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8CF3F3] flex items-center justify-center text-[#007070] font-mono font-bold text-sm">
                AH
              </div>
              <div>
                <p className="font-sans font-bold text-base text-[#181C1C]">Ahmed Factory</p>
                <p className="font-mono text-xs text-[#006A6A] font-semibold">Verified Factory</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 bg-[#F1F4F3] rounded">
                <p className="font-mono text-xs text-[#44474F]">Rating</p>
                <p className="font-sans font-bold text-base text-[#181C1C]">4.9 / 5</p>
              </div>
              <div className="p-2.5 bg-[#F1F4F3] rounded">
                <p className="font-mono text-xs text-[#44474F]">Transactions</p>
                <p className="font-sans font-bold text-base text-[#181C1C]">125</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 font-mono text-xs text-[#44474F]">
              <ShieldCheck className="w-4 h-4 text-[#006A6A]" />
              <span>Law 202 Verified</span>
            </div>
          </section>

          {/* Auction Information Card (Dark Theme) */}
          <section className="bg-[#000A1F] text-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-md">
            <div className="space-y-1">
              <p className="font-mono text-xs uppercase tracking-wider text-white/80">Highest Bid</p>
              <p className="font-headline font-semibold text-2xl text-white">15,800 EGP / Ton</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3 font-sans text-sm">
              <div>
                <p className="font-mono text-xs text-white/80">Min Increment</p>
                <p className="font-medium text-white">200 EGP</p>
              </div>
              <div>
                <p className="font-mono text-xs text-white/80">Bidders</p>
                <p className="font-medium text-white">6</p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-white/90">
              <Clock className="w-4 h-4 text-[#8CF3F3]" />
              <span>Time Remaining: 1 Day 4 Hours</span>
            </div>
          </section>

          {/* Bottom Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                if (onOpenPlaceBidPage) {
                  onOpenPlaceBidPage();
                } else {
                  setIsBidModalOpen(true);
                }
              }}
              className="w-full py-3.5 bg-[#000A1F] text-white font-mono text-sm font-semibold rounded hover:bg-[#00204A] transition-colors cursor-pointer text-center shadow-sm"
            >
              Place Bid
            </button>
            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 py-2.5 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center bg-white"
              >
                Back
              </button>
              <button
                onClick={handleSaveToggle}
                className={`flex-1 py-2.5 border border-[#C4C6D0] rounded font-mono text-xs transition-colors cursor-pointer text-center bg-white flex items-center justify-center gap-1.5 ${
                  isSaved ? 'text-[#006A6A] font-semibold' : 'text-[#181C1C]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#006A6A]' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save Listing'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Place Bid Modal */}
      {isBidModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000A1F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#C4C6D0]">
              <h3 className="font-headline font-semibold text-xl text-[#181C1C]">
                Submit Auction Offer
              </h3>
              <button
                onClick={() => setIsBidModalOpen(false)}
                className="text-[#44474F] hover:text-[#181C1C] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 font-sans text-sm text-[#44474F]">
              <p><strong className="text-[#181C1C]">Item:</strong> Steel Scrap Bundles</p>
              <p><strong className="text-[#181C1C]">Quantity:</strong> 50 Tons</p>
              <p><strong className="text-[#181C1C]">Current Highest Bid:</strong> 15,800 EGP / Ton</p>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Your Bid Amount (EGP / Ton)
                </label>
                <input
                  type="text"
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="e.g. 16,000"
                  className="w-full h-10 px-3 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBidModalOpen(false)}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#E6E9E8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] cursor-pointer"
                >
                  Submit Official Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
