import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  MapPin,
  Package,
  Calendar,
  Hash,
  Leaf,
  AlertCircle,
  Loader2,
  CheckCircle2,
  FileText,
  Zap
} from 'lucide-react';
import { dppApi, DPPResponse } from '../../services/api';

interface DigitalProductPassportPageProps {
  dppId: number;
  onBack?: () => void;
}

function StatusBadge({ status }: { status: string }) {
  const isCompleted = ['Confirmed', 'Delivered', 'completed'].includes(status);
  const isInProgress = ['In Transit', 'Picked Up', 'Ready for Pickup'].includes(status);
  const base = 'inline-flex items-center px-2.5 py-1 rounded-full font-mono text-xs font-semibold';
  if (isCompleted)
    return <span className={`${base} bg-[#80F9CA] text-[#00513B]`}>{status}</span>;
  if (isInProgress)
    return <span className={`${base} bg-[#8CF3F3] text-[#007070]`}>{status}</span>;
  return <span className={`${base} bg-[#E0E3E2] text-[#44474F]`}>{status || 'Pending'}</span>;
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[10px] text-[#44474F] uppercase tracking-wider">{label}</p>
      <p className="font-sans text-sm font-medium text-[#181C1C]">{value || '—'}</p>
    </div>
  );
}

export const DigitalProductPassportPage: React.FC<DigitalProductPassportPageProps> = ({ dppId, onBack }) => {
  const [dpp, setDpp] = useState<DPPResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDPP() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await dppApi.getDPP(dppId);
        setDpp(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to load Digital Product Passport.');
      } finally {
        setIsLoading(false);
      }
    }
    loadDPP();
  }, [dppId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#006A6A]" />
          <p className="font-sans text-sm text-[#44474F]">Loading Digital Product Passport…</p>
        </div>
      </div>
    );
  }

  if (error || !dpp) {
    return (
      <div className="space-y-6">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-2 font-mono text-sm text-[#006A6A] hover:underline cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        <div className="bg-[#FFF8F7] border border-[#BA1A1A]/30 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#BA1A1A] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-sans font-semibold text-sm text-[#BA1A1A]">Failed to Load Passport</p>
            <p className="font-sans text-sm text-[#44474F] mt-1">{error || 'The Digital Product Passport could not be found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const confidencePct = dpp.ai_confidence != null ? Math.round(dpp.ai_confidence * 100) : null;

  return (
    <div className="space-y-8 bg-[#F7FAF9]">
      {/* Header */}
      <div className="space-y-1">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-2 font-mono text-sm text-[#006A6A] hover:underline cursor-pointer mb-3">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#006A6A]" />
              <h1 className="font-headline font-semibold text-2xl text-[#181C1C] tracking-tight">
                Digital Product Passport
              </h1>
            </div>
            <p className="font-mono text-sm text-[#44474F]">{dpp.dpp_id}</p>
          </div>
          <StatusBadge status={dpp.shipment_current_status || dpp.shipment_status} />
        </div>
        <p className="font-sans text-sm text-[#44474F]">
          Eco Link verified lifecycle record for this industrial waste batch.
        </p>
      </div>

      {/* Passport Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 cols: Main details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Material Classification */}
          <section className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#C4C6D0]">
              <Package className="w-5 h-5 text-[#006A6A]" />
              <h2 className="font-sans font-semibold text-base text-[#181C1C]">Material Classification</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <Field label="Material Type" value={dpp.material_type} />
              <Field label="Quantity" value={`${dpp.quantity} ${dpp.unit}`} />
              <Field label="Condition" value={dpp.condition} />
            </div>
            {dpp.ai_classification && (
              <div className="pt-3 border-t border-[#E0E3E2]">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-[#8CF3F3]" />
                  <p className="font-mono text-xs font-semibold text-[#006A6A] uppercase tracking-wider">AI Classification</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="AI Detected Class" value={dpp.ai_classification} />
                  {confidencePct != null && (
                    <div className="space-y-1.5">
                      <p className="font-mono text-[10px] text-[#44474F] uppercase tracking-wider">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#E0E3E2] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#006A6A] h-full transition-all duration-300"
                            style={{ width: `${confidencePct}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#181C1C]">{confidencePct}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Origin & Destination */}
          <section className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#C4C6D0]">
              <MapPin className="w-5 h-5 text-[#006A6A]" />
              <h2 className="font-sans font-semibold text-base text-[#181C1C]">Origin &amp; Destination</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-[#44474F] uppercase tracking-wider">Waste Generator</p>
                <p className="font-sans text-sm font-medium text-[#006A6A]">{dpp.waste_generator_role}</p>
                <p className="font-sans text-xs text-[#44474F]">{dpp.origin_governorate || 'Location Protected'}</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-[#44474F] uppercase tracking-wider">Recycling Partner</p>
                <p className="font-sans text-sm font-medium text-[#006A6A]">{dpp.recycler_role}</p>
                <p className="font-sans text-xs text-[#44474F]">{dpp.destination_governorate || 'Location Protected'}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-[#E0E3E2] space-y-1">
              <p className="font-mono text-[10px] text-[#006A6A] uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 inline mr-1" />
                Anonymity Protected
              </p>
              <p className="font-sans text-xs text-[#44474F]">
                Company identities are redacted from this passport per Eco Link marketplace privacy policy.
              </p>
            </div>
          </section>

          {/* Logistics Timeline */}
          <section className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#C4C6D0]">
              <Truck className="w-5 h-5 text-[#006A6A]" />
              <h2 className="font-sans font-semibold text-base text-[#181C1C]">Logistics Timeline</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <Field label="Tracking Number" value={dpp.tracking_number || dpp.shipment_tracking} />
              <Field label="Logistics Partner" value={dpp.logistics_partner} />
              <Field label="Current Status" value={dpp.shipment_current_status || dpp.shipment_status} />
              <Field
                label="Pickup Date"
                value={dpp.pickup_date ? new Date(dpp.pickup_date).toLocaleDateString() : undefined}
              />
              <Field
                label="Delivery Date"
                value={dpp.delivery_date ? new Date(dpp.delivery_date).toLocaleDateString() : undefined}
              />
              <Field
                label="Deal Date"
                value={dpp.deal_date ? new Date(dpp.deal_date).toLocaleDateString() : undefined}
              />
            </div>
          </section>

          {/* Sustainability Notes */}
          {(dpp.carbon_info || dpp.recycling_notes) && (
            <section className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-[#C4C6D0]">
                <Leaf className="w-5 h-5 text-[#006A6A]" />
                <h2 className="font-sans font-semibold text-base text-[#181C1C]">Sustainability &amp; Recycling</h2>
              </div>
              {dpp.carbon_info && (
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-[#44474F] uppercase tracking-wider">Carbon Information</p>
                  <p className="font-sans text-sm text-[#181C1C]">{dpp.carbon_info}</p>
                </div>
              )}
              {dpp.recycling_notes && (
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-[#44474F] uppercase tracking-wider">Recycling Notes</p>
                  <p className="font-sans text-sm text-[#181C1C]">{dpp.recycling_notes}</p>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right col: Summary sidebar */}
        <aside className="space-y-6">

          {/* DPP ID Card */}
          <section className="bg-[#000A1F] text-white rounded-lg p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#8CF3F3]" />
              <p className="font-mono text-xs font-semibold text-[#8CF3F3] uppercase tracking-wider">Passport ID</p>
            </div>
            <p className="font-mono text-xl font-bold text-white">{dpp.dpp_id}</p>
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#8CF3F3]">Issued</span>
                <span className="text-white">{new Date(dpp.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#8CF3F3]">Shipment</span>
                <span className="text-white">#{dpp.shipment_id}</span>
              </div>
              {dpp.transaction_id_ref && (
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#8CF3F3]">Transaction</span>
                  <span className="text-white">#{dpp.transaction_id_ref}</span>
                </div>
              )}
            </div>
          </section>

          {/* Deal Summary */}
          {dpp.deal_amount && (
            <section className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-[#C4C6D0]">
                <FileText className="w-4 h-4 text-[#006A6A]" />
                <h2 className="font-sans font-semibold text-sm text-[#181C1C]">Deal Summary</h2>
              </div>
              <div className="space-y-2 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Deal Amount</span>
                  <span className="font-semibold text-[#181C1C]">
                    {Number(dpp.deal_amount).toLocaleString('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Quantity</span>
                  <span className="font-semibold text-[#181C1C]">{dpp.quantity} {dpp.unit}</span>
                </div>
              </div>
            </section>
          )}

          {/* Verification Status */}
          <section className="bg-[#F0FFF9] border border-[#80F9CA] rounded-lg p-4 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#006A6A]" />
              <p className="font-sans font-semibold text-sm text-[#006A6A]">Eco Link Verified</p>
            </div>
            <p className="font-sans text-xs text-[#44474F]">
              This passport was automatically generated and verified by the Eco Link platform upon deal acceptance.
            </p>
          </section>

          {/* Timestamps */}
          <section className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#C4C6D0]">
              <Calendar className="w-4 h-4 text-[#44474F]" />
              <p className="font-sans font-semibold text-sm text-[#181C1C]">Record Timestamps</p>
            </div>
            <div className="space-y-1.5 font-mono text-xs text-[#44474F]">
              <div className="flex justify-between">
                <span>Created</span>
                <span>{new Date(dpp.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated</span>
                <span>{new Date(dpp.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </section>

        </aside>
      </div>
    </div>
  );
};
