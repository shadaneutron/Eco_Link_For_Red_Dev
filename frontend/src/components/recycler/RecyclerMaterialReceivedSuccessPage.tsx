import React from 'react';
import {
  CheckCircle2,
  Package,
  CheckSquare,
  Leaf,
  Check,
  ArrowLeft,
  BarChart3,
  LayoutDashboard
} from 'lucide-react';

interface RecyclerMaterialReceivedSuccessPageProps {
  shipmentId?: string;
  materialTitle?: string;
  sourceFactory?: string;
  quantity?: string;
  onBackToShipments?: () => void;
  onGoToReports?: () => void;
  onGoToDashboard?: () => void;
}

export const RecyclerMaterialReceivedSuccessPage: React.FC<RecyclerMaterialReceivedSuccessPageProps> = ({
  shipmentId = 'SH-1001',
  materialTitle = 'Industrial Waste Material',
  sourceFactory = 'Factory Partner',
  quantity = '10 Tons',
  onBackToShipments,
  onGoToReports,
  onGoToDashboard
}) => {
  return (
    <div className="space-y-8 bg-[#F7FAF9] min-h-screen">
      {/* Header Section */}
      <section className="space-y-1">
        <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
          Material Received Successfully
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          The shipment has been successfully received, inspected, and added to your recycling workflow.
        </p>
      </section>

      <div className="space-y-6">
        {/* Main Success Banner */}
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-8 flex flex-col items-center text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#8CF3F3] flex items-center justify-center text-[#006A6A]">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>
          <div className="space-y-2 max-w-lg">
            <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
              Material Received Successfully
            </h2>
            <p className="font-sans text-base text-[#44474F] leading-relaxed">
              The shipment has been successfully received by your facility. The inspection has been completed and the material is now ready for recycling.
            </p>
          </div>
        </section>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Receiving Summary */}
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-[#006A6A]">
              <Package className="w-5 h-5" />
              <h3 className="font-sans font-semibold text-base text-[#181C1C]">Receiving Summary</h3>
            </div>
            <div className="space-y-2.5 font-sans text-sm">
              <div className="flex justify-between">
                <span className="text-[#44474F]">Shipment ID</span>
                <span className="font-medium text-[#181C1C]">{shipmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Waste Material</span>
                <span className="font-medium text-[#181C1C]">{materialTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Source Factory</span>
                <span className="font-medium text-[#181C1C]">{sourceFactory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Quantity Received</span>
                <span className="font-medium text-[#181C1C]">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Receiving Date</span>
                <span className="font-medium text-[#181C1C]">Today</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Receiving Time</span>
                <span className="font-medium text-[#181C1C]">11:42 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Warehouse</span>
                <span className="font-medium text-[#181C1C]">Warehouse A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Receiving Manager</span>
                <span className="font-medium text-[#181C1C]">Omar Hassan</span>
              </div>
            </div>
          </section>

          {/* Inspection Results */}
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-[#006A6A]">
              <CheckSquare className="w-5 h-5" />
              <h3 className="font-sans font-semibold text-base text-[#181C1C]">Inspection Results</h3>
            </div>
            <div className="space-y-2.5 font-sans text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#44474F]">Inspection Status</span>
                <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] text-xs font-semibold rounded font-sans">
                  Passed
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Material Quality</span>
                <span className="font-medium text-[#181C1C]">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Material Condition</span>
                <span className="font-medium text-[#181C1C]">Excellent</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Weight Verification</span>
                <span className="font-medium text-[#181C1C]">Matched</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Compliance Status</span>
                <span className="font-medium text-[#181C1C]">Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Digital Waste Manifest</span>
                <span className="font-medium text-[#181C1C]">Confirmed</span>
              </div>
            </div>
          </section>
        </div>

        {/* Next Process Timeline */}
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
          <h3 className="font-sans font-semibold text-base text-[#181C1C]">Next Process Timeline</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#006A6A] text-white flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <p className="font-sans text-xs font-medium text-[#181C1C]">Shipment Delivered</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#006A6A] text-white flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <p className="font-sans text-xs font-medium text-[#181C1C]">Material Received</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#006A6A] text-white flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <p className="font-sans text-xs font-medium text-[#181C1C]">Inspection Completed</p>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#006A6A] text-white flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <p className="font-sans text-xs font-medium text-[#181C1C]">Digital Manifest Confirmed</p>
            </div>
            {/* Step 5 */}
            <div className="flex flex-col items-center text-center gap-2 col-span-2 md:col-span-1">
              <div className="w-8 h-8 rounded-full bg-[#8CF3F3] border-2 border-[#006A6A] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#006A6A] rounded-full animate-pulse"></div>
              </div>
              <p className="font-sans text-xs font-semibold text-[#006A6A]">Added to Processing Queue</p>
            </div>
          </div>
        </section>

        {/* Environmental Impact Section */}
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-[#006A6A]">
            <Leaf className="w-5 h-5" />
            <h3 className="font-sans font-semibold text-base text-[#181C1C]">Environmental Impact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F1F4F3] rounded border border-[#C4C6D0]/50 space-y-1">
              <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">CARBON SAVING</p>
              <p className="font-sans text-2xl font-semibold text-[#006A6A]">1.4 Tons CO₂</p>
            </div>
            <div className="p-4 bg-[#F1F4F3] rounded border border-[#C4C6D0]/50 space-y-1">
              <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">RECYCLABLE</p>
              <p className="font-sans text-2xl font-semibold text-[#006A6A]">100%</p>
            </div>
            <div className="p-4 bg-[#F1F4F3] rounded border border-[#C4C6D0]/50 space-y-1">
              <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">CIRCULAR ECONOMY</p>
              <p className="font-sans text-2xl font-semibold text-[#006A6A]">Verified</p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Action Button Bar */}
      <div className="pt-6 border-t border-[#C4C6D0] flex flex-wrap gap-4 items-center">
        <button
          onClick={onBackToShipments}
          className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
        >
          Back to Shipments
        </button>
        <button
          onClick={onGoToReports}
          className="px-6 py-2.5 bg-[#000A1F] text-white rounded font-mono text-sm font-semibold hover:bg-[#00204A] transition-colors cursor-pointer shadow-sm"
        >
          View Reports
        </button>
        <button
          onClick={onGoToDashboard}
          className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};
