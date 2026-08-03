import React from 'react';
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { RecyclerOffer } from './OffersListPage';

interface OfferAcceptedPageProps {
  offer?: RecyclerOffer;
  wasteName?: string;
  quantity?: string;
  onBackToMarketplace: () => void;
  onViewShipment?: () => void;
}

export const OfferAcceptedPage: React.FC<OfferAcceptedPageProps> = ({
  offer = {
    id: 'off-1',
    companyName: 'Green Recycling Ltd.',
    distance: '18 km',
    certificates: 'Verified, ISO 14001 Certified',
    rating: 4.9,
    offeredPrice: '12,500 EGP',
    pickupTime: 'Tomorrow',
    processingTime: '2 Days',
    statusTag: 'Accepted'
  },
  wasteName = 'Steel Scrap',
  quantity = '2.3 Tons',
  onBackToMarketplace,
  onViewShipment
}) => {
  const timelineSteps = [
    { label: 'Offer Accepted', completed: true },
    { label: 'Recycler Notified', completed: true },
    { label: 'Driver Assignment', completed: false },
    { label: 'Pickup Scheduled', completed: false },
    { label: 'Shipment In Transit', completed: false },
    { label: 'Delivery Completed', completed: false }
  ];

  return (
    <div className="space-y-8 font-sans bg-[#F7FAF9] text-[#181C1C] min-h-screen">
      {/* Header */}
      <section className="space-y-1">
        <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
          Offer Accepted
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          The recycler offer has been accepted successfully.
        </p>
      </section>

      {/* Main Success Content Stack */}
      <div className="space-y-8">
        {/* Success Icon & Title Section */}
        <section className="flex flex-col items-center text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-[#80F9CA] rounded-full flex items-center justify-center text-[#00513B] shadow-2xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
              Offer Accepted Successfully
            </h2>
            <p className="font-sans text-base text-[#44474F] leading-relaxed">
              You have successfully accepted the recycler's offer. The waste listing has been reserved for the selected recycling company. The shipment process will now begin.
            </p>
          </div>
        </section>

        {/* Success Summary Card (6 Metrics Grid) */}
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
          <h3 className="font-mono font-medium text-base text-[#181C1C]">
            Success Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-2">
            <div className="flex flex-col">
              <span className="font-sans text-xs text-[#44474F] mb-1">Recycler</span>
              <span className="font-mono text-base font-semibold text-[#181C1C]">
                {offer.companyName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-xs text-[#44474F] mb-1">Waste</span>
              <span className="font-mono text-base font-semibold text-[#181C1C]">
                {wasteName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-xs text-[#44474F] mb-1">Quantity</span>
              <span className="font-mono text-base font-semibold text-[#181C1C]">
                {quantity}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-xs text-[#44474F] mb-1">Accepted Price</span>
              <span className="font-mono text-base font-semibold text-[#006A6A]">
                {offer.offeredPrice}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-xs text-[#44474F] mb-1">Pickup Date</span>
              <span className="font-mono text-base font-semibold text-[#181C1C]">
                {offer.pickupTime}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-xs text-[#44474F] mb-1">Status</span>
              <div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-[#8CF3F3] text-[#007070]">
                  Shipment Preparation
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps Timeline Card */}
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
          <h3 className="font-mono font-medium text-base text-[#181C1C]">
            Next Steps Timeline
          </h3>
          <div className="space-y-3 pt-2">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#006A6A]" />
                ) : (
                  <Circle className="w-5 h-5 text-[#44474F]/40" />
                )}
                <span
                  className={`font-sans text-sm ${
                    step.completed
                      ? 'text-[#181C1C] font-medium'
                      : 'text-[#44474F]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Footer Actions */}
        <section className="flex justify-between items-center pt-4 border-t border-[#C4C6D0]">
          <button
            type="button"
            onClick={onBackToMarketplace}
            className="px-6 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
          >
            Back to Marketplace
          </button>
          <button
            type="button"
            onClick={onViewShipment || (() => alert('Navigating to Shipments page...'))}
            className="px-6 py-3 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors shadow-xs cursor-pointer text-center"
          >
            View Shipment
          </button>
        </section>
      </div>
    </div>
  );
};
