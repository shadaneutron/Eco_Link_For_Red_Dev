import React, { useState } from 'react';
import {
  Check,
  User,
  Building2,
  FileText,
  Phone,
  Truck,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download
} from 'lucide-react';
import { RecyclerMaterialReceivedSuccessPage } from './RecyclerMaterialReceivedSuccessPage';

import { shipmentsApi } from '../../services/api';

interface RecyclerShipmentDetailTrackingPageProps {
  shipmentId?: string;
  dbId?: number;
  status?: string;
  onBack: () => void;
  onGoToReports?: () => void;
  onGoToDashboard?: () => void;
}

export const RecyclerShipmentDetailTrackingPage: React.FC<RecyclerShipmentDetailTrackingPageProps> = ({
  shipmentId = 'SH-2026-014',
  dbId,
  status: propStatus = 'Delivered',
  onBack,
  onGoToReports,
  onGoToDashboard
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [receiptConfirmed, setReceiptConfirmed] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>(propStatus);
  const [shipmentData, setShipmentData] = useState<any>(null);

  React.useEffect(() => {
    const rawNum = dbId || parseInt(shipmentId.replace(/\D/g, ''), 10);
    if (rawNum && !isNaN(rawNum)) {
      shipmentsApi.getShipment(rawNum).then(s => {
        if (s) {
          setShipmentData(s);
          if (s.status) {
            setCurrentStatus(s.status);
          }
        }
      }).catch(err => console.warn('Could not fetch shipment detail:', err));
    }
  }, [dbId, shipmentId]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmReceipt = async () => {
    const targetId = dbId || parseInt(shipmentId.replace(/\D/g, ''), 10) || 1;
    try {
      await shipmentsApi.confirmShipment(targetId);
      showNotification('Receipt confirmed! Escrow funds released.');
      setReceiptConfirmed(true);
      setCurrentStatus('Confirmed');
      setShowSuccessPage(true);
    } catch (err: any) {
      console.warn('API confirm shipment warning/fallback:', err);
      showNotification(err?.message || 'Error confirming receipt. Standard transition executed.');
      setReceiptConfirmed(true);
      setShowSuccessPage(true);
    }
  };

  if (showSuccessPage) {
    return (
      <RecyclerMaterialReceivedSuccessPage
        shipmentId={shipmentId}
        onBackToShipments={onBack}
        onGoToReports={onGoToReports}
        onGoToDashboard={onGoToDashboard}
      />
    );
  }

  return (
    <div className="space-y-8 bg-[#F7FAF9] min-h-screen">
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
          Shipment Tracking
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          Track your incoming shipment and prepare for material receiving.
        </p>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Main Overview Card */}
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="font-sans font-semibold text-2xl text-[#181C1C]">
                  {shipmentData?.tracking_number || shipmentId} | {shipmentData?.listing_title || 'Industrial Waste'}
                </h2>
                <p className="font-sans text-sm text-[#44474F]">
                  {shipmentData?.factory_name || 'Factory Partner'} • {shipmentData?.listing_material_type || 'Industrial Waste'}
                </p>
              </div>
              <span className="px-3 py-1 bg-[#8CF3F3] text-[#007070] font-mono text-xs font-semibold rounded-full">
                {currentStatus}
              </span>
            </div>

            <div className="pt-3 border-t border-[#C4C6D0] grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-sm">
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">RECYCLER</p>
                <p className="font-medium text-[#181C1C]">{shipmentData?.recycler_name || 'Verified Recycler'}</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">QUANTITY</p>
                <p className="font-medium text-[#181C1C]">
                  {shipmentData?.listing_quantity ? `${shipmentData.listing_quantity} ${shipmentData.listing_unit || 'Tons'}` : 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">EST. ARRIVAL</p>
                <p className="font-medium text-[#181C1C]">
                  {shipmentData?.estimated_arrival ? new Date(shipmentData.estimated_arrival).toLocaleDateString() : 'Scheduled'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Timeline Card */}
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-6 shadow-2xs">
            <h3 className="font-sans font-semibold text-base text-[#181C1C]">Shipment Timeline</h3>

            <div className="relative px-2 py-4">
              {/* Timeline Horizontal Line Background */}
              <div className="absolute top-8 left-6 right-6 h-0.5 bg-[#E0E3E2] -z-0"></div>
              {/* Active Progress Portion */}
              <div
                className="absolute top-8 left-6 h-0.5 bg-[#006A6A] -z-0 transition-all duration-500"
                style={{
                  width: currentStatus === 'Confirmed' ? '100%' :
                         currentStatus === 'Delivered' ? '80%' :
                         currentStatus === 'In Transit' ? '60%' :
                         currentStatus === 'Picked Up' || currentStatus === 'Ready for Pickup' ? '40%' :
                         currentStatus === 'Assigned' ? '20%' : '10%'
                }}
              ></div>

              {/* Timeline Nodes */}
              <div className="relative z-10 flex justify-between items-start text-center">
                {/* Step 1: Driver Assigned */}
                <div className="flex flex-col items-center gap-2 w-20">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs ${
                    currentStatus !== 'Pending' ? 'bg-[#006A6A] text-white' : 'bg-[#E0E3E2] text-[#44474F]'
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="font-sans text-xs font-medium text-[#181C1C]">Assigned</p>
                </div>

                {/* Step 2: Picked Up */}
                <div className="flex flex-col items-center gap-2 w-20">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs ${
                    ['Picked Up', 'In Transit', 'Delivered', 'Confirmed'].includes(currentStatus) ? 'bg-[#006A6A] text-white' : 'bg-[#E0E3E2] text-[#44474F]'
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="font-sans text-xs font-medium text-[#181C1C]">Picked Up</p>
                </div>

                {/* Step 3: In Transit */}
                <div className="flex flex-col items-center gap-2 w-20">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStatus === 'In Transit'
                      ? 'bg-[#8CF3F3] border-2 border-[#006A6A]'
                      : ['Delivered', 'Confirmed'].includes(currentStatus)
                      ? 'bg-[#006A6A] text-white'
                      : 'bg-[#E0E3E2]'
                  }`}>
                    {currentStatus === 'In Transit' ? (
                      <div className="w-2.5 h-2.5 bg-[#006A6A] rounded-full animate-ping"></div>
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </div>
                  <p className={`font-sans text-xs ${currentStatus === 'In Transit' ? 'font-semibold text-[#006A6A]' : 'text-[#44474F]'}`}>
                    In Transit
                  </p>
                </div>

                {/* Step 4: Delivered */}
                <div className="flex flex-col items-center gap-2 w-20">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStatus === 'Delivered'
                      ? 'bg-[#8CF3F3] border-2 border-[#006A6A]'
                      : currentStatus === 'Confirmed'
                      ? 'bg-[#006A6A] text-white'
                      : 'bg-[#E0E3E2]'
                  }`}>
                    {currentStatus === 'Delivered' ? (
                      <div className="w-2.5 h-2.5 bg-[#006A6A] rounded-full animate-ping"></div>
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </div>
                  <p className={`font-sans text-xs ${currentStatus === 'Delivered' ? 'font-semibold text-[#006A6A]' : 'text-[#44474F]'}`}>
                    Delivered
                  </p>
                </div>

                {/* Step 5: Confirmed */}
                <div className="flex flex-col items-center gap-2 w-20">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStatus === 'Confirmed' ? 'bg-[#006A6A] text-white' : 'bg-[#E0E3E2]'
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <p className={`font-sans text-xs ${currentStatus === 'Confirmed' ? 'font-semibold text-[#006A6A]' : 'text-[#44474F]'}`}>
                    Confirmed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Row: Driver Info & Receiving Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver Information Card */}
            <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-[#006A6A]">
                <User className="w-5 h-5" />
                <h3 className="font-sans font-semibold text-base text-[#181C1C]">Driver Information</h3>
              </div>
              <div className="space-y-2.5 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Driver</span>
                  <span className="font-medium text-[#181C1C]">{shipmentData?.driver_name || (shipmentData?.logistics_name ? `Assigned by ${shipmentData.logistics_name}` : 'Pending Assignment')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Vehicle</span>
                  <span className="font-medium text-[#181C1C]">{shipmentData?.vehicle || 'Carrier Truck'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Carrier</span>
                  <span className="font-medium text-[#181C1C]">{shipmentData?.logistics_name || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Tracking Ref</span>
                  <span className="font-medium text-[#181C1C]">{shipmentData?.tracking_number || shipmentId}</span>
                </div>
              </div>
            </div>

            {/* Receiving Info Card */}
            <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-[#006A6A]">
                <Building2 className="w-5 h-5" />
                <h3 className="font-sans font-semibold text-base text-[#181C1C]">Receiving Info</h3>
              </div>
              <div className="space-y-2.5 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Pickup Origin</span>
                  <span className="font-medium text-[#181C1C]">{shipmentData?.pickup_location || 'Factory Facility'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Destination</span>
                  <span className="font-medium text-[#181C1C]">{shipmentData?.destination || 'Recycling Facility'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Pickup Date</span>
                  <span className="font-medium text-[#181C1C]">{shipmentData?.pickup_date ? new Date(shipmentData.pickup_date).toLocaleDateString() : 'Scheduled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Delivery Date</span>
                  <span className="font-medium text-[#181C1C]">{shipmentData?.delivered_at ? new Date(shipmentData.delivered_at).toLocaleDateString() : 'Pending'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Aside) */}
        <aside className="space-y-6">
          {/* Section 1: Shipment Documents */}
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <h3 className="font-sans font-semibold text-base text-[#181C1C]">Shipment Documents</h3>

            <div className="space-y-3">
              {/* Document 1 */}
              <div className="p-3 border border-[#C4C6D0] rounded space-y-2 bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm font-medium text-[#181C1C]">
                    Digital Waste Manifest
                  </span>
                  <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-[10px] font-semibold rounded">
                    Available
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => showNotification('Opening Digital Waste Manifest preview...')}
                    className="flex-1 py-1 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#F1F4F3] cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => showNotification('Downloading Digital Waste Manifest PDF...')}
                    className="flex-1 py-1 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#F1F4F3] cursor-pointer"
                  >
                    PDF
                  </button>
                </div>
              </div>

              {/* Document 2 */}
              <div className="p-3 border border-[#C4C6D0] rounded space-y-2 bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm font-medium text-[#181C1C]">
                    Transport Permit
                  </span>
                  <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-[10px] font-semibold rounded">
                    Verified
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => showNotification('Opening Transport Permit preview...')}
                    className="flex-1 py-1 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#F1F4F3] cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => showNotification('Downloading Transport Permit PDF...')}
                    className="flex-1 py-1 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#F1F4F3] cursor-pointer"
                  >
                    PDF
                  </button>
                </div>
              </div>

              {/* Document 3 */}
              <div className="p-3 border border-[#C4C6D0] rounded space-y-2 bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm font-medium text-[#181C1C]">
                    Compliance Cert.
                  </span>
                  <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-[10px] font-semibold rounded">
                    Verified
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => showNotification('Opening Compliance Certificate preview...')}
                    className="flex-1 py-1 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#F1F4F3] cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => showNotification('Downloading Compliance Certificate PDF...')}
                    className="flex-1 py-1 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#F1F4F3] cursor-pointer"
                  >
                    PDF
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Shipment Notes */}
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-2 shadow-2xs">
            <h3 className="font-sans font-semibold text-base text-[#181C1C]">Shipment Notes</h3>
            <p className="font-sans text-sm text-[#44474F] leading-relaxed">
              {currentStatus === 'Delivered'
                ? 'Shipment has arrived at your facility. Please inspect the materials and click "Confirm Receipt" to complete the transaction and release escrow funds.'
                : currentStatus === 'Confirmed'
                ? 'Receipt confirmed. Escrow funds have been successfully released to the Factory.'
                : 'The shipment is currently in transit. Please prepare the receiving team before the estimated arrival time.'}
            </p>
          </section>
        </aside>
      </div>

      {/* Bottom Action Button Bar */}
      <div className="pt-6 border-t border-[#C4C6D0] flex flex-wrap gap-4 items-center">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
        >
          Back
        </button>
        <button
          onClick={() => setShowContactModal(true)}
          className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
        >
          Contact Carrier
        </button>
        <button
          onClick={() => setShowIssueModal(true)}
          className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
        >
          Report Issue
        </button>
        <button
          onClick={handleConfirmReceipt}
          disabled={receiptConfirmed || currentStatus === 'Confirmed' || currentStatus !== 'Delivered'}
          className={`px-6 py-2.5 rounded font-mono text-sm transition-colors shadow-xs ${
            receiptConfirmed || currentStatus === 'Confirmed'
              ? 'bg-[#8CF3F3] text-[#007070] cursor-default font-semibold'
              : currentStatus === 'Delivered'
              ? 'bg-[#006A6A] text-white hover:bg-[#004F4F] cursor-pointer font-semibold'
              : 'bg-[#E0E3E2] text-[#44474F] cursor-not-allowed'
          }`}
        >
          {receiptConfirmed || currentStatus === 'Confirmed' ? 'Receipt Confirmed ✓' : 'Confirm Receipt'}
        </button>
      </div>

      {/* Contact Driver Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-[#000A1F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-sans font-bold text-lg text-[#181C1C]">Contact Driver</h3>
            <p className="font-sans text-sm text-[#44474F]">
              Direct line to {shipmentData?.driver_name || 'Carrier Dispatch'} ({shipmentData?.vehicle || 'Carrier Truck'}):
            </p>
            <div className="p-3 bg-[#F1F4F3] rounded border border-[#C4C6D0] font-mono text-sm font-semibold text-[#006A6A]">
              +20 102 345 6789
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold hover:bg-[#F1F4F3]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowContactModal(false);
                  showNotification('Dialing driver Mohamed Ali...');
                }}
                className="px-4 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A]"
              >
                Call Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-[#000A1F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-sans font-bold text-lg text-[#181C1C]">Report Issue</h3>
            <p className="font-sans text-sm text-[#44474F]">
              Select issue type regarding shipment {shipmentId}:
            </p>
            <select className="w-full p-2 bg-[#F1F4F3] border border-[#C4C6D0] rounded font-sans text-sm text-[#181C1C]">
              <option>Delay in Arrival</option>
              <option>Material Discrepancy</option>
              <option>Damaged Packaging</option>
              <option>Driver Uncontactable</option>
            </select>
            <textarea
              rows={3}
              placeholder="Provide details..."
              className="w-full p-2 bg-[#F1F4F3] border border-[#C4C6D0] rounded font-sans text-sm text-[#181C1C] focus:outline-none"
            ></textarea>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowIssueModal(false)}
                className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold hover:bg-[#F1F4F3]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowIssueModal(false);
                  showNotification('Issue report submitted to logistics dispatch team.');
                }}
                className="px-4 py-2 bg-[#BA1A1A] text-white rounded font-mono text-xs font-semibold hover:bg-[#93000A]"
              >
                Submit Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
