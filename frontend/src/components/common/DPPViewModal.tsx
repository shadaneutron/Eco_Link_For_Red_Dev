import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Package,
  MapPin,
  Truck,
  FileText,
  Code,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Zap,
  Leaf
} from 'lucide-react';
import { dppApi, StandardizedDPPJSON } from '../../services/api';

interface DPPViewModalProps {
  dppId?: number;
  shipmentId?: number;
  onClose: () => void;
}

export const DPPViewModal: React.FC<DPPViewModalProps> = ({ dppId, shipmentId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'document' | 'json'>('document');
  const [data, setData] = useState<StandardizedDPPJSON | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        let res: StandardizedDPPJSON;
        if (dppId) {
          res = await dppApi.getDPP(dppId);
        } else if (shipmentId) {
          res = await dppApi.getShipmentDPP(shipmentId);
        } else {
          throw new Error('No DPP ID or Shipment ID provided.');
        }
        setData(res);
      } catch (err: any) {
        setError(err?.message || 'Failed to load Digital Product Passport.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [dppId, shipmentId]);

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      if (dppId) {
        await dppApi.downloadDPPPdf(dppId, false);
      } else if (shipmentId) {
        await dppApi.downloadDPPPdf(shipmentId, true);
      }
    } catch (err: any) {
      alert('Failed to download PDF: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000A1F]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#C4C6D0] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#000A1F] text-white p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#8CF3F3]" />
            <div>
              <h2 className="font-headline font-bold text-lg text-white tracking-tight">
                {data ? data.document_type : 'Digital Product Passport'}
              </h2>
              <p className="font-mono text-xs text-[#8CF3F3]">
                {data ? data.document_id : 'Document Registry'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Tabs */}
            <div className="flex bg-white/10 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('document')}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                  activeTab === 'document' ? 'bg-[#006A6A] text-white' : 'text-[#E0E3E2] hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 inline mr-1" />
                Document
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                  activeTab === 'json' ? 'bg-[#006A6A] text-white' : 'text-[#E0E3E2] hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5 inline mr-1" />
                View JSON
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#E0E3E2] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#F7FAF9]">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#006A6A]" />
              <p className="font-sans text-sm text-[#44474F]">Fetching passport record from database...</p>
            </div>
          ) : error || !data ? (
            <div className="p-6 bg-[#FFF8F7] border border-[#BA1A1A]/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#BA1A1A] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans font-semibold text-sm text-[#BA1A1A]">Unable to load document</p>
                <p className="font-sans text-xs text-[#44474F] mt-1">{error || 'Passport data not available.'}</p>
              </div>
            </div>
          ) : activeTab === 'json' ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-[#44474F]">
                <span>Standardized JSON Payload (Single Source of Truth)</span>
                <span>Schema v{data.schema_version}</span>
              </div>
              <pre className="bg-[#000A1F] text-[#8CF3F3] p-5 rounded-lg text-xs font-mono overflow-auto max-h-[550px] leading-relaxed border border-[#00204A]">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Document Summary Header */}
              <div className="bg-white border border-[#C4C6D0] rounded-lg p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 bg-[#8CF3F3] text-[#007070] font-mono text-xs font-semibold rounded">
                    {data.shipment.status}
                  </span>
                  <h3 className="font-headline font-bold text-xl text-[#181C1C] pt-1">
                    {data.material.title}
                  </h3>
                  <p className="font-mono text-xs text-[#44474F]">
                    Tracking: {data.shipment.tracking_number}
                  </p>
                </div>
                <div className="text-right font-sans text-xs text-[#44474F] space-y-1">
                  <p><span className="font-mono font-semibold text-[#181C1C]">Generated:</span> {new Date(data.generated_at).toLocaleString()}</p>

                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Material Details */}
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#C4C6D0]">
                    <Package className="w-4 h-4 text-[#006A6A]" />
                    <h4 className="font-sans font-semibold text-sm text-[#181C1C]">Material &amp; AI Classification</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Type</p>
                      <p className="font-medium text-[#181C1C] text-sm">{data.material.material_type}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Quantity</p>
                      <p className="font-medium text-[#181C1C] text-sm">{data.material.quantity} {data.material.unit}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Condition</p>
                      <p className="font-medium text-[#181C1C]">{data.material.condition}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">AI Class</p>
                      <p className="font-medium text-[#006A6A] flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#8CF3F3]" />
                        {data.material.ai_classification}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Origin & Destination */}
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#C4C6D0]">
                    <MapPin className="w-4 h-4 text-[#006A6A]" />
                    <h4 className="font-sans font-semibold text-sm text-[#181C1C]">Origin &amp; Destination</h4>
                  </div>
                  <div className="space-y-3 text-xs font-sans">
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Origin Location</p>
                      <p className="font-medium text-[#181C1C]">{data.origin.location}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Destination Facility</p>
                      <p className="font-medium text-[#181C1C]">{data.destination.location}</p>
                    </div>
                  </div>
                </div>

                {/* Logistics */}
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#C4C6D0]">
                    <Truck className="w-4 h-4 text-[#006A6A]" />
                    <h4 className="font-sans font-semibold text-sm text-[#181C1C]">Logistics Carrier</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Company</p>
                      <p className="font-medium text-[#181C1C]">{data.logistics.company}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Driver</p>
                      <p className="font-medium text-[#181C1C]">{data.logistics.driver}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Vehicle</p>
                      <p className="font-medium text-[#181C1C]">{data.logistics.vehicle}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Delivered At</p>
                      <p className="font-medium text-[#181C1C]">
                        {data.logistics.delivered_at ? new Date(data.logistics.delivered_at).toLocaleDateString() : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sustainability & Financial */}
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#C4C6D0]">
                    <Leaf className="w-4 h-4 text-[#006A6A]" />
                    <h4 className="font-sans font-semibold text-sm text-[#181C1C]">Circularity &amp; Deal Summary</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Est. Material Recovery</p>
                      <p className="font-medium text-[#006A6A]">{data.circularity.material_recovery}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Carbon Offset</p>
                      <p className="font-medium text-[#006A6A]">{data.circularity.estimated_carbon_offset}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Deal Amount</p>
                      <p className="font-medium text-[#181C1C]">
                        {data.transaction.amount ? `${data.transaction.amount.toLocaleString()} ${data.transaction.currency}` : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-[#44474F] uppercase">Escrow Status</p>
                      <p className="font-medium text-[#181C1C]">{data.transaction.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Card */}
              <div className="bg-[#F0FFF9] border border-[#80F9CA] rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#006A6A]" />
                  <div>
                    <p className="font-sans font-semibold text-sm text-[#006A6A]">Database Verified Record</p>
                    <p className="font-sans text-xs text-[#44474F]">
                      Single source of truth generated dynamically from Eco Link backend repository.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-[#C4C6D0] p-4 flex items-center justify-between flex-shrink-0">
          <div className="text-xs font-mono text-[#44474F]">
            {data && `Status: ${data.shipment.status}`}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#C4C6D0] rounded-lg font-mono text-xs font-semibold hover:bg-[#F1F4F3] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading || !data}
              className="px-5 py-2 bg-[#006A6A] text-white rounded-lg font-mono text-xs font-semibold hover:bg-[#004F4F] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating PDF…
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
