import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  Clock,
  Truck,
  CreditCard,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { RecyclerOffer } from './OffersListPage';

interface OfferDetailPageProps {
  offer?: RecyclerOffer;
  wasteName?: string;
  category?: string;
  quantity?: string;
  factoryName?: string;
  listingStatus?: string;
  onBack: () => void;
  onAccept: (offer: RecyclerOffer) => void;
  onReject: (offer: RecyclerOffer) => void;
}

export const OfferDetailPage: React.FC<OfferDetailPageProps> = ({
  offer = {
    id: 'off-1',
    companyName: 'Green Recycling Ltd.',
    distance: '18 km',
    certificates: 'Verified, ISO 14001 Certified',
    rating: 4.9,
    offeredPrice: '12,500 EGP',
    pickupTime: 'Tomorrow, 9:00 AM',
    processingTime: '2 Days',
    statusTag: 'Best Match',
    rawStatus: 'Pending'
  },
  wasteName = 'Steel Scrap',
  category = 'Ferrous Metal',
  quantity = '2.3 Tons',
  factoryName = 'Ahmed Factory',
  listingStatus = 'Live',
  onBack,
  onAccept,
  onReject
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 font-sans bg-[#F7FAF9] text-[#181C1C] min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#000A1F] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-[#8CF3F3]" />
          <span className="font-sans text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header section with Back Link */}
      <section className="space-y-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 font-mono text-xs font-medium text-[#006A6A] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Offers List</span>
        </button>
        <div>
          <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
            Offer Details
          </h1>
          <p className="font-sans text-base text-[#44474F]">
            Review the recycler's offer before making your decision.
          </p>
        </div>
      </section>

      {/* Top Listing Overview Card (5 Metrics Grid) */}
      <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Waste Name</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{wasteName}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Category</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{category}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Quantity</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{quantity}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Factory</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{factoryName}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Listing Status</span>
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#80F9CA] text-[#00513B]">
                {listingStatus}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Middle Row: Company Profile (Left) + Offer Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recycler Profile Card */}
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
          <div className="flex justify-between items-start">
            <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
              {offer.companyName}
            </h2>
            <div className="flex items-center gap-1 text-[#006A6A]">
              <Star className="w-4 h-4 fill-[#006A6A]" />
              <span className="font-mono text-base font-semibold">{offer.rating}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#C4C6D0]">
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Status</p>
              <p className="font-sans text-sm text-[#181C1C]">{offer.certificates || 'Verified, ISO 14001 Certified'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Experience</p>
              <p className="font-sans text-sm text-[#181C1C]">12 Years in Business</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Track Record</p>
              <p className="font-sans text-sm text-[#181C1C]">845 Completed Transactions</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Success Rate</p>
              <p className="font-sans text-sm text-[#181C1C]">98% Success Rate</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Response Time</p>
              <p className="font-sans text-sm text-[#181C1C]">Within 2 Hours</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Location</p>
              <p className="font-sans text-sm text-[#181C1C]">10th of Ramadan City ({offer.distance})</p>
            </div>
          </div>
        </section>

        {/* Offer Details Card */}
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
          <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
            Offer Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#C4C6D0]">
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Price</p>
              <p className="font-headline text-xl font-semibold text-[#006A6A]">
                {offer.offeredPrice}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Pickup</p>
              <p className="font-sans text-sm text-[#181C1C]">{offer.pickupTime || 'Tomorrow, 9:00 AM'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Processing Time</p>
              <p className="font-sans text-sm text-[#181C1C]">{offer.processingTime || '2 Days'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Logistics</p>
              <p className="font-sans text-sm text-[#181C1C]">Transportation Included</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Payment Method</p>
              <p className="font-sans text-sm text-[#181C1C]">Bank Transfer</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Offer Expiration</p>
              <p className="font-sans text-sm font-medium text-[#BA1A1A]">48 Hours Remaining</p>
            </div>
          </div>
        </section>
      </div>

      {/* Smart Recommendation Banner (Navy #00204A) */}
      <section className="bg-[#00204A] text-white border border-[#C4C6D0] rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#80F9CA] text-[#00513B]">
              Best Match
            </span>
            <h3 className="font-mono text-base font-semibold text-[#7189B8]">
              Smart Recommendation
            </h3>
          </div>
          <p className="font-sans text-sm text-[#7189B8]">
            Highest rating, Fast pickup, Closest distance, Verified company.
          </p>
        </div>

        <div className="text-center md:text-right">
          <p className="font-sans text-xs text-[#7189B8]">Carbon Saving</p>
          <p className="font-headline text-2xl font-semibold text-[#80F9CA]">
            1.4 Tons CO₂
          </p>
        </div>
      </section>

      {/* Terms & Conditions Card */}
      <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-3 shadow-2xs">
        <h3 className="font-mono font-semibold text-base text-[#181C1C]">
          Terms &amp; Conditions
        </h3>
        <ul className="space-y-2 font-sans text-sm text-[#44474F] list-disc pl-5">
          <li>Recycler is responsible for transportation.</li>
          <li>Payment will be transferred after pickup confirmation.</li>
          <li>Materials will be inspected upon arrival.</li>
        </ul>
      </section>

      {/* Bottom Footer Actions */}
      <section className="flex justify-between items-center pt-4 border-t border-[#C4C6D0]">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              showToast(`Rejected offer from ${offer.companyName}`);
              onReject(offer);
            }}
            className="px-6 py-3 border border-[#BA1A1A]/30 text-[#BA1A1A] rounded font-mono text-xs font-medium hover:bg-[#FFDAD6]/50 transition-colors cursor-pointer"
          >
            Reject Offer
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            showToast(`Accepted offer from ${offer.companyName}`);
            onAccept(offer);
          }}
          className="px-8 py-3 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors shadow-xs cursor-pointer text-center"
        >
          Accept Offer
        </button>
      </section>
    </div>
  );
};
