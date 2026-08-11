import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Leaf,
  DollarSign,
  PieChart,
  ArrowLeft,
  FileSpreadsheet,
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { dppApi, DPPListItemResponse } from '../../services/api';
import { DPPViewModal } from '../common/DPPViewModal';

interface ReportsAnalyticsPageProps {
  onBack?: () => void;
}

export const ReportsAnalyticsPage: React.FC<ReportsAnalyticsPageProps> = ({ onBack }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dppList, setDppList] = useState<DPPListItemResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDppId, setSelectedDppId] = useState<number | null>(null);
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null);

  const fetchDPPs = async () => {
    try {
      setLoading(true);
      const res = await dppApi.getDPPs();
      setDppList(res || []);
    } catch (err) {
      console.error('Failed to fetch Factory DPP records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDPPs();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadPdf = async (dppId: number) => {
    try {
      showToast('Preparing PDF download...');
      await dppApi.downloadDPPPdf(dppId, false);
      showToast('PDF download initiated successfully.');
    } catch (err: any) {
      alert('Failed to download PDF: ' + (err?.message || 'Unknown error'));
    }
  };

  const totalQuantity = dppList.reduce((acc, d) => acc + (parseFloat(d.quantity) || 0), 0);

  return (
    <div className="space-y-8 font-sans bg-[#F7FAF9] text-[#181C1C] min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#000A1F] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-[#8CF3F3]" />
          <span className="font-sans text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <section className="space-y-1">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 font-mono text-xs font-medium text-[#006A6A] hover:underline cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight flex items-center gap-2">
              Reports &amp; Digital Product Passports <ShieldCheck className="w-6 h-6 text-[#006A6A]" />
            </h1>
            <p className="font-sans text-base text-[#44474F]">
              Authoritative database document registry and Law 202 compliance certificates.
            </p>
          </div>
        </div>
      </section>

      {/* Metric Summary Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-sans text-xs text-[#44474F] mb-1">Registered Passports</p>
          <p className="font-headline font-bold text-2xl text-[#000A1F]">{dppList.length}</p>
        </div>
        <div className="bg-white p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-sans text-xs text-[#44474F] mb-1">Total Waste Tracked</p>
          <p className="font-headline font-bold text-2xl text-[#181C1C]">{totalQuantity.toFixed(1)} Tons</p>
        </div>
        <div className="bg-white p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-sans text-xs text-[#44474F] mb-1">Carbon Saved (Est.)</p>
          <p className="font-headline font-bold text-2xl text-[#006A6A]">{(totalQuantity * 1.25).toFixed(1)} t CO₂</p>
        </div>
        <div className="bg-white p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-sans text-xs text-[#44474F] mb-1">Compliance Rate</p>
          <p className="font-headline font-bold text-2xl text-[#006A6A]">100% Verified</p>
        </div>
      </section>

      {/* Database Document Registry Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-semibold text-lg text-[#181C1C] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#006A6A]" /> Digital Product Passport Registry
          </h3>
          <span className="font-mono text-xs text-[#44474F]">Single Source of Truth (Database Backed)</span>
        </div>

        {loading ? (
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-12 text-center text-[#44474F]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#006A6A] mb-2" />
            Fetching passport records...
          </div>
        ) : dppList.length === 0 ? (
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-12 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-[#44474F] mx-auto opacity-40" />
            <h4 className="font-headline font-semibold text-lg text-[#181C1C]">No Digital Passports Issued Yet</h4>
            <p className="font-sans text-xs text-[#44474F]">
              Passports are automatically generated when shipments are created and assigned.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#C4C6D0] rounded-lg overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-[#F1F4F3] border-b border-[#C4C6D0]">
                  <tr className="font-mono text-xs font-bold text-[#44474F]">
                    <th className="p-4">Document ID</th>
                    <th className="p-4">Tracking #</th>
                    <th className="p-4">Material Type</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-sans text-sm text-[#181C1C]">
                  {dppList.map((dpp) => (
                    <tr key={dpp.id} className="border-b border-[#C4C6D0] hover:bg-[#F7FAF9] transition-colors">
                      <td className="p-4 font-mono font-medium text-[#006A6A]">{dpp.document_id}</td>
                      <td className="p-4 font-mono text-xs text-[#44474F]">{dpp.tracking_number}</td>
                      <td className="p-4 font-medium">{dpp.material_type}</td>
                      <td className="p-4 font-mono">{dpp.quantity} {dpp.unit}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 bg-[#8CF3F3] text-[#007070] rounded font-mono text-[11px] font-semibold">
                          {dpp.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDppId(dpp.id)}
                          className="px-3 py-1 bg-[#006A6A] text-white rounded font-mono text-xs font-semibold hover:bg-[#004F4F] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(dpp.id)}
                          className="px-3 py-1 border border-[#C4C6D0] bg-white text-[#181C1C] rounded font-mono text-xs font-semibold hover:bg-[#EBEEED] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* DPP View Modal */}
      {selectedDppId && (
        <DPPViewModal
          dppId={selectedDppId}
          onClose={() => setSelectedDppId(null)}
        />
      )}
    </div>
  );
};
