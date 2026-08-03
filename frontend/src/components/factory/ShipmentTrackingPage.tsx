import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  MapPin,
  Phone,
  Truck,
  RotateCw,
  CheckCircle2,
  Clock,
  Building2,
  User,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface ShipmentTrackingPageProps {
  shipmentId?: string;
  wasteName?: string;
  recyclerName?: string;
  quantity?: string;
  status?: string;
  estArrival?: string;
  driverName?: string;
  driverPhone?: string;
  driverVehicle?: string;
  driverLicense?: string;
  pickupLocation?: string;
  destinationLocation?: string;
  onBack?: () => void;
}

export const ShipmentTrackingPage: React.FC<ShipmentTrackingPageProps> = ({
  shipmentId = 'SH-2026-014',
  wasteName = 'Steel Scrap',
  recyclerName = 'Green Recycling Ltd.',
  quantity = '2.3 Tons',
  status = 'Driver Assigned',
  estArrival = 'Tomorrow 11:30 AM',
  driverName = 'Mohamed Ali',
  driverPhone = '+20 101 234 5678',
  driverVehicle = 'Truck TR-208',
  driverLicense = 'ABC-1234',
  pickupLocation = 'Ahmed Factory',
  destinationLocation = 'Green Recycling Ltd.',
  onBack
}) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const stepLabels = [
    'Driver Assigned',
    'Ready for Pickup',
    'Picked Up',
    'In Transit',
    'Delivered'
  ];

  const isCompleted = stepIndex === stepLabels.length - 1;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setToastMessage('Refreshing telemetry & location...');
    setTimeout(() => {
      setIsRefreshing(false);
      if (stepIndex < stepLabels.length - 1) {
        const nextStep = stepIndex + 1;
        setStepIndex(nextStep);
        setToastMessage(`Status updated: ${stepLabels[nextStep]}`);
      } else {
        setToastMessage('Shipment is fully delivered!');
      }
      setTimeout(() => setToastMessage(null), 3000);
    }, 800);
  };

  const handleContactDriver = () => {
    setToastMessage(`Calling driver ${driverName} at ${driverPhone}...`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Render Completed View if Delivered
  if (isCompleted) {
    return (
      <div className="space-y-8 font-sans bg-[#F7FAF9] text-[#181C1C] min-h-screen">
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
            Shipment Completed
          </h1>
          <p className="font-sans text-base text-[#44474F]">
            The shipment has been successfully delivered to the recycling company.
          </p>
        </section>

        {/* Success Banner */}
        <div className="space-y-8">
          <div className="flex flex-col items-center text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#8CF3F3] flex items-center justify-center text-[#007070] shadow-2xs">
              <CheckCircle2 className="w-10 h-10 fill-[#007070] text-[#8CF3F3]" />
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
                Shipment Delivered Successfully
              </h2>
              <p className="font-sans text-base text-[#44474F] leading-relaxed">
                The waste shipment has been received and verified by the recycler. The transaction is now completed.
              </p>
            </div>
          </div>

          {/* Transaction Summary Card */}
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-6 shadow-2xs">
            <h3 className="font-mono font-medium text-base text-[#181C1C]">
              Transaction Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <span className="font-sans text-xs text-[#44474F] mb-1">Shipment ID</span>
                <span className="font-mono text-base font-semibold text-[#181C1C]">{shipmentId}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs text-[#44474F] mb-1">Waste</span>
                <span className="font-mono text-base font-semibold text-[#181C1C]">{wasteName}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs text-[#44474F] mb-1">Recycler</span>
                <span className="font-mono text-base font-semibold text-[#181C1C]">{recyclerName}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs text-[#44474F] mb-1">Quantity</span>
                <span className="font-mono text-base font-semibold text-[#181C1C]">{quantity}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs text-[#44474F] mb-1">Pickup Date</span>
                <span className="font-mono text-base font-semibold text-[#181C1C]">Yesterday</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs text-[#44474F] mb-1">Delivery Date</span>
                <span className="font-mono text-base font-semibold text-[#181C1C]">Today</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs text-[#44474F] mb-1">Final Status</span>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#8CF3F3] text-[#007070]">
                    Completed
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs text-[#44474F] mb-1">Payment Status</span>
                <span className="font-mono text-base font-semibold text-[#181C1C]">Pending Confirmation</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C4C6D0]">
              <span className="font-sans text-xs text-[#44474F] block mb-1">Carbon Saving</span>
              <span className="font-headline font-semibold text-lg text-[#006A6A]">1.4 Tons CO₂</span>
            </div>
          </section>

          {/* Shipment Progress (All green) */}
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
            <h3 className="font-mono font-medium text-base text-[#181C1C]">
              Shipment Progress
            </h3>
            <div className="relative pt-4 pb-6 px-2">
              <div className="absolute top-[28px] left-6 right-6 h-0.5 bg-[#006A6A]" />
              <div className="relative flex justify-between items-center z-10">
                {stepLabels.map((lbl, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 bg-[#F7FAF9] px-2">
                    <div className="w-6 h-6 rounded-full bg-[#006A6A] flex items-center justify-center text-white shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="font-sans text-xs font-medium text-[#006A6A] text-center">
                      {lbl}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom Action Footer */}
          <section className="flex justify-between items-center pt-4 border-t border-[#C4C6D0]">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onBack || (() => window.history.back())}
                className="px-6 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  setStepIndex(0);
                  setToastMessage('Reset shipment demo tracking');
                }}
                className="px-6 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
              >
                Reset Tracking Demo
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setToastMessage('Opening verified environmental carbon report...');
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className="px-6 py-3 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors shadow-xs cursor-pointer text-center"
            >
              View Report
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans bg-[#F7FAF9] text-[#181C1C] min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#000A1F] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-[#8CF3F3]" />
          <span className="font-sans text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header section with optional Back Link */}
      <section className="space-y-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 font-mono text-xs font-medium text-[#006A6A] hover:underline cursor-pointer mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        )}
        <div>
          <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
            Shipment Tracking
          </h1>
          <p className="font-sans text-base text-[#44474F]">
            Track the shipment progress from pickup to delivery.
          </p>
        </div>
      </section>

      {/* Top Metric Overview Card (6 Columns Grid) */}
      <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Shipment ID</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{shipmentId}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Waste</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{wasteName}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Recycler</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{recyclerName}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Quantity</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{quantity}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Status</span>
            <div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-[#8CF3F3] text-[#007070]">
                {stepLabels[stepIndex]}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#44474F] mb-1">Est. Arrival</span>
            <span className="font-mono text-base font-semibold text-[#181C1C]">{estArrival}</span>
          </div>
        </div>
      </section>

      {/* Shipment Progress Stepper Card */}
      <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
        <h3 className="font-mono font-medium text-base text-[#181C1C]">
          Shipment Progress
        </h3>
        <div className="relative pt-4 pb-6 px-2">
          {/* Connecting Line */}
          <div className="absolute top-[28px] left-6 right-6 h-0.5 bg-[#E0E3E2]" />

          <div className="relative flex justify-between items-center z-10">
            {stepLabels.map((lbl, idx) => {
              const completed = idx <= stepIndex;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 bg-[#F7FAF9] px-2">
                  {completed ? (
                    <div className="w-6 h-6 rounded-full bg-[#006A6A] flex items-center justify-center text-white shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-[#C4C6D0] bg-[#F7FAF9]" />
                  )}
                  <span
                    className={`font-sans text-xs font-medium text-center ${
                      completed ? 'text-[#006A6A]' : 'text-[#44474F]'
                    }`}
                  >
                    {lbl}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2-Column Grid: Driver Info + Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Information Card */}
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
          <h3 className="font-mono font-medium text-base text-[#181C1C]">
            Driver Information
          </h3>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#C4C6D0]">
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Name</p>
              <p className="font-sans text-sm text-[#181C1C] font-medium">{driverName}</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Phone</p>
              <p className="font-sans text-sm text-[#181C1C]">{driverPhone}</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">Vehicle</p>
              <p className="font-sans text-sm text-[#181C1C]">{driverVehicle}</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-sans text-xs text-[#44474F]">License</p>
              <p className="font-sans text-sm text-[#181C1C]">{driverLicense}</p>
            </div>
          </div>
        </section>

        {/* Locations Card */}
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
          <h3 className="font-mono font-medium text-base text-[#181C1C]">
            Locations
          </h3>
          <div className="grid grid-cols-1 gap-4 pt-4 border-t border-[#C4C6D0]">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-[#006A6A] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-sans text-xs text-[#44474F]">Pickup</p>
                <p className="font-sans text-sm text-[#181C1C] font-medium">{pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-[#BA1A1A] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-sans text-xs text-[#44474F]">Destination</p>
                <p className="font-sans text-sm text-[#181C1C] font-medium">{destinationLocation}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Shipment Notes Card */}
      <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-3 shadow-2xs">
        <h3 className="font-mono font-medium text-base text-[#181C1C]">
          Shipment Notes
        </h3>
        <div className="pt-3 border-t border-[#C4C6D0]">
          <p className="font-sans text-sm text-[#44474F]">
            The assigned driver will contact the factory before arrival.
          </p>
        </div>
      </section>

      {/* Bottom Action Footer */}
      <section className="flex justify-between items-center pt-4 border-t border-[#C4C6D0]">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack || (() => window.history.back())}
            className="px-6 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="px-6 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#006A6A]' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleContactDriver}
          className="px-6 py-3 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors shadow-xs cursor-pointer text-center inline-flex items-center gap-2"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Contact Driver</span>
        </button>
      </section>
    </div>
  );
};
