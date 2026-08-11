import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Calendar,
  Filter,
  Eye,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Building2,
  X,
  RotateCw
} from 'lucide-react';
import { dppApi, DPPListItemResponse } from '../../services/api';
import { DPPViewModal } from '../common/DPPViewModal';

interface RecyclerReportsAnalyticsPageProps {
  onBack?: () => void;
}

export const RecyclerReportsAnalyticsPage: React.FC<RecyclerReportsAnalyticsPageProps> = ({
  onBack
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reportType, setReportType] = useState('Monthly ESG Summary');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [activeTab, setActiveTab] = useState<'all' | 'compliance' | 'esg'>('all');

  const [dppList, setDppList] = useState<DPPListItemResponse[]>([]);
  const [dppLoading, setDppLoading] = useState<boolean>(true);
  const [selectedDppId, setSelectedDppId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDPPs() {
      try {
        setDppLoading(true);
        const res = await dppApi.getDPPs();
        setDppList(res);
      } catch (err: any) {
        console.error('Failed to load DPP documents:', err);
      } finally {
        setDppLoading(false);
      }
    }
    fetchDPPs();
  }, []);


  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerateReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowGenerateModal(false);
    showNotification(`New report (${reportType} - ${timeRange}) generated successfully!`);
  };

  return (
    <div className="space-y-8 bg-[#F7FAF9] min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#000A1F] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-[#8CF3F3]" />
          <span className="font-sans text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <section className="space-y-1">
        <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
          Reports &amp; Analytics
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          Analyze recycling performance, sustainability impact, operational efficiency and compliance.
        </p>
      </section>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
            TOTAL PURCHASED
          </p>
          <p className="font-sans text-2xl font-semibold text-[#006A6A]">1,850 T</p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
            TOTAL RECYCLED
          </p>
          <p className="font-sans text-2xl font-semibold text-[#006A6A]">1,620 T</p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
            EFFICIENCY
          </p>
          <p className="font-sans text-2xl font-semibold text-[#006A6A]">92%</p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
            CARBON SAVED
          </p>
          <p className="font-sans text-2xl font-semibold text-[#006A6A]">486 t CO₂</p>
        </div>

        {/* Card 5 */}
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
            REVENUE
          </p>
          <p className="font-sans text-2xl font-semibold text-[#006A6A]">3.4M EGP</p>
        </div>

        {/* Card 6 */}
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
            WON AUCTIONS
          </p>
          <p className="font-sans text-2xl font-semibold text-[#006A6A]">48</p>
        </div>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Recycling Volume Line Chart */}
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-semibold text-base text-[#181C1C]">
              Monthly Recycling Volume
            </h3>
            <span className="font-mono text-xs text-[#006A6A] bg-[#8CF3F3] px-2 py-0.5 rounded font-semibold">
              +14.2% YoY
            </span>
          </div>

          <div className="h-64 bg-[#F1F4F3] rounded p-4 flex flex-col justify-between relative overflow-hidden border border-[#C4C6D0]/40">
            {/* SVG Line Chart */}
            <div className="relative w-full h-full flex flex-col justify-between">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-xs text-[#44474F]/40 font-mono">
                <div className="border-b border-[#C4C6D0]/30 w-full pb-1">300 T</div>
                <div className="border-b border-[#C4C6D0]/30 w-full pb-1">200 T</div>
                <div className="border-b border-[#C4C6D0]/30 w-full pb-1">100 T</div>
                <div className="w-full">0 T</div>
              </div>

              {/* Chart SVG Curve */}
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#006A6A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#006A6A" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 120 Q 90 90, 150 70 T 290 40 T 400 30 T 490 15 L 490 150 L 10 150 Z"
                  fill="url(#tealGrad)"
                />
                <path
                  d="M 10 120 Q 90 90, 150 70 T 290 40 T 400 30 T 490 15"
                  fill="none"
                  stroke="#006A6A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Data Nodes */}
                <circle cx="10" cy="120" r="4" fill="#006A6A" />
                <circle cx="100" cy="95" r="4" fill="#006A6A" />
                <circle cx="190" cy="65" r="4" fill="#006A6A" />
                <circle cx="290" cy="40" r="4" fill="#006A6A" />
                <circle cx="390" cy="30" r="4" fill="#006A6A" />
                <circle cx="490" cy="15" r="5" fill="#000A1F" stroke="#8CF3F3" strokeWidth="2" />
              </svg>

              {/* X Axis Labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between font-mono text-xs text-[#44474F] pt-2 border-t border-[#C4C6D0]">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </section>

        {/* Chart 2: Material Categories Processed Donut Chart */}
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
          <h3 className="font-sans font-semibold text-base text-[#181C1C]">
            Material Categories Processed
          </h3>

          <div className="h-64 bg-[#F1F4F3] rounded p-4 flex flex-col sm:flex-row items-center justify-around gap-4 border border-[#C4C6D0]/40">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                {/* Donut Segments */}
                {/* Steel 42% */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#006A6A"
                  strokeWidth="3.8"
                  strokeDasharray="42, 100"
                />
                {/* Plastic 25% */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8CF3F3"
                  strokeWidth="3.8"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-42"
                />
                {/* Paper 15% */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#7189B8"
                  strokeWidth="3.8"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-67"
                />
                {/* Glass 8% */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#00204A"
                  strokeWidth="3.8"
                  strokeDasharray="8, 100"
                  strokeDashoffset="-82"
                />
                {/* E-Waste 10% */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#44474F"
                  strokeWidth="3.8"
                  strokeDasharray="10, 100"
                  strokeDashoffset="-90"
                />
              </svg>
              <div className="absolute text-center">
                <p className="font-sans font-bold text-sm text-[#181C1C]">1,620 T</p>
                <p className="font-mono text-[10px] text-[#44474F]">Total</p>
              </div>
            </div>

            {/* Category Breakdown List */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-sans text-xs w-full max-w-[220px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006A6A]"></span>
                <span className="text-[#181C1C]">Steel (42%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8CF3F3]"></span>
                <span className="text-[#181C1C]">Plastic (25%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7189B8]"></span>
                <span className="text-[#181C1C]">Paper (15%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00204A]"></span>
                <span className="text-[#181C1C]">Glass (8%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#44474F]"></span>
                <span className="text-[#181C1C]">E-Waste (10%)</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Processing Performance Section */}
      <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
        <h3 className="font-sans font-semibold text-base text-[#181C1C]">Processing Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#F1F4F3] rounded border border-[#C4C6D0]/40 space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
              AVG PROCESSING TIME
            </p>
            <p className="font-sans text-2xl font-semibold text-[#006A6A]">4.2 Days</p>
          </div>

          <div className="p-4 bg-[#F1F4F3] rounded border border-[#C4C6D0]/40 space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
              RECOVERY RATE
            </p>
            <p className="font-sans text-2xl font-semibold text-[#006A6A]">88.5%</p>
          </div>

          <div className="p-4 bg-[#F1F4F3] rounded border border-[#C4C6D0]/40 space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
              PLANT UTILIZATION
            </p>
            <p className="font-sans text-2xl font-semibold text-[#006A6A]">76%</p>
          </div>

          <div className="p-4 bg-[#F1F4F3] rounded border border-[#C4C6D0]/40 space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
              REJECTED MATERIALS
            </p>
            <p className="font-sans text-2xl font-semibold text-[#BA1A1A]">2.4%</p>
          </div>
        </div>
      </section>

      {/* Shipment History Table Section */}
      <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-[#C4C6D0] flex justify-between items-center bg-[#F7FAF9]">
          <h3 className="font-sans font-semibold text-base text-[#181C1C]">Shipment History</h3>
          <span className="font-mono text-xs text-[#44474F]">Showing 3 recent shipments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F1F4F3] font-mono text-xs text-[#44474F] uppercase tracking-wider">
              <tr>
                <th className="p-4">Shipment ID</th>
                <th className="p-4">Factory</th>
                <th className="p-4">Material</th>
                <th className="p-4">Date</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm divide-y divide-[#C4C6D0]">
              <tr className="hover:bg-white/60 transition-colors">
                <td className="p-4 font-mono font-medium text-[#181C1C]">SH-2026-014</td>
                <td className="p-4 text-[#181C1C]">Ahmed Factory</td>
                <td className="p-4 text-[#181C1C]">Steel Scrap Bundles</td>
                <td className="p-4 text-[#44474F]">2024-05-20</td>
                <td className="p-4 text-[#181C1C]">50 Tons</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-xs font-semibold rounded-full">
                    Received
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => showNotification('Opening shipment details SH-2026-014...')}
                      className="text-[#006A6A] hover:underline font-medium text-xs cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => showNotification('Downloading manifest SH-2026-014 PDF...')}
                      className="text-[#006A6A] hover:underline font-medium text-xs cursor-pointer"
                    >
                      Download
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-white/60 transition-colors">
                <td className="p-4 font-mono font-medium text-[#181C1C]">SH-2026-012</td>
                <td className="p-4 text-[#181C1C]">Cairo Industrial</td>
                <td className="p-4 text-[#181C1C]">Plastic Flakes</td>
                <td className="p-4 text-[#44474F]">2024-05-18</td>
                <td className="p-4 text-[#181C1C]">35 Tons</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-xs font-semibold rounded-full">
                    In Transit
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => showNotification('Opening shipment details SH-2026-012...')}
                      className="text-[#006A6A] hover:underline font-medium text-xs cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => showNotification('Downloading manifest SH-2026-012 PDF...')}
                      className="text-[#006A6A] hover:underline font-medium text-xs cursor-pointer"
                    >
                      Download
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-white/60 transition-colors">
                <td className="p-4 font-mono font-medium text-[#181C1C]">SH-2026-008</td>
                <td className="p-4 text-[#181C1C]">Nile Tech Corp</td>
                <td className="p-4 text-[#181C1C]">Copper Cables</td>
                <td className="p-4 text-[#44474F]">2024-05-12</td>
                <td className="p-4 text-[#181C1C]">12 Tons</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-xs font-semibold rounded-full">
                    Received
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => showNotification('Opening shipment details SH-2026-008...')}
                      className="text-[#006A6A] hover:underline font-medium text-xs cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => showNotification('Downloading manifest SH-2026-008 PDF...')}
                      className="text-[#006A6A] hover:underline font-medium text-xs cursor-pointer"
                    >
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Digital Product Passports & Recycling Certificates Section */}
      <section className="bg-white border border-[#C4C6D0] rounded-xl p-6 space-y-4 shadow-2xs">
        <div className="flex justify-between items-center border-b border-[#C4C6D0] pb-4">
          <div>
            <h3 className="font-headline font-semibold text-lg text-[#181C1C] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#006A6A]" />
              Digital Product Passports &amp; Recycling Certificates
            </h3>
            <p className="font-sans text-xs text-[#44474F]">
              Dynamic database-backed documents derived from single-source-of-truth Digital Product Passports.
            </p>
          </div>
          <span className="px-3 py-1 bg-[#F1F4F3] border border-[#C4C6D0] font-mono text-xs text-[#181C1C] rounded-full">
            {dppList.length} Registered Passports
          </span>
        </div>

        {dppLoading ? (
          <div className="py-8 text-center text-[#44474F]">
            <RotateCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#006A6A]" />
            <p className="font-sans text-xs">Loading Digital Product Passports...</p>
          </div>
        ) : dppList.length === 0 ? (
          <div className="py-12 px-4 text-center border-2 border-dashed border-[#C4C6D0] rounded-lg bg-[#F7FAF9]">
            <FileText className="w-10 h-10 mx-auto text-[#006A6A] mb-3 opacity-60" />
            <h4 className="font-sans font-semibold text-base text-[#181C1C] mb-1">
              No digital reports available yet.
            </h4>
            <p className="font-sans text-xs text-[#44474F] max-w-md mx-auto">
              Digital Product Passports and Recycling Certificates will appear here as shipments are processed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F1F4F3] font-mono text-xs text-[#44474F] uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Document ID</th>
                  <th className="p-3.5">Document Type</th>
                  <th className="p-3.5">Tracking Number</th>
                  <th className="p-3.5">Material</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Generated</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-sans text-sm divide-y divide-[#C4C6D0]">
                {dppList.map((dpp) => (
                  <tr key={dpp.id} className="hover:bg-[#F7FAF9] transition-colors">
                    <td className="p-3.5 font-mono font-medium text-[#181C1C] text-xs">
                      {dpp.document_id}
                    </td>
                    <td className="p-3.5 text-[#181C1C] font-medium">
                      {dpp.document_type}
                    </td>
                    <td className="p-3.5 font-mono text-xs text-[#44474F]">
                      {dpp.tracking_number}
                    </td>
                    <td className="p-3.5 text-[#181C1C]">
                      {dpp.material_type} ({dpp.quantity} {dpp.unit})
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 bg-[#8CF3F3] text-[#007070] text-xs font-mono font-medium rounded">
                        {dpp.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs text-[#44474F]">
                      {new Date(dpp.generated_at).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDppId(dpp.id)}
                          className="px-3 py-1.5 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => dppApi.downloadDPPPdf(dpp.id, false)}
                          className="px-3 py-1.5 bg-[#006A6A] text-white rounded font-mono text-xs hover:bg-[#004F4F] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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


      {/* Environmental Impact Summary Section */}
      <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 text-[#006A6A]">
          <Leaf className="w-5 h-5" />
          <h3 className="font-sans font-semibold text-base text-[#181C1C]">
            Environmental Impact Summary
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#F1F4F3] rounded border border-[#C4C6D0]/40 space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">CARBON SAVED</p>
            <p className="font-sans text-2xl font-semibold text-[#006A6A]">486 t</p>
          </div>

          <div className="p-4 bg-[#F1F4F3] rounded border border-[#C4C6D0]/40 space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
              ENERGY RECOVERED
            </p>
            <p className="font-sans text-2xl font-semibold text-[#006A6A]">12.4 MWh</p>
          </div>

          <div className="p-4 bg-[#F1F4F3] rounded border border-[#C4C6D0]/40 space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
              WASTE DIVERTED
            </p>
            <p className="font-sans text-2xl font-semibold text-[#006A6A]">1,620 T</p>
          </div>

          <div className="p-4 bg-[#F1F4F3] rounded border border-[#C4C6D0]/40 space-y-1">
            <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
              CIRCULAR SCORE
            </p>
            <p className="font-sans text-2xl font-semibold text-[#006A6A]">8.4/10</p>
          </div>
        </div>
      </section>

      {/* Bottom Action Button Bar */}
      <div className="pt-6 border-t border-[#C4C6D0] flex flex-wrap gap-4 items-center">
        <button
          onClick={() => showNotification('Exporting full analytics data to CSV/Excel...')}
          className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
        >
          Export Report
        </button>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
        >
          Generate New Report
        </button>

        <button
          onClick={() => showNotification('Downloading Comprehensive Compliance Report PDF...')}
          className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
        >
          Download Compliance Report
        </button>

        <button
          onClick={() => showNotification('Downloading Complete ESG Report PDF...')}
          className="px-6 py-2.5 bg-[#000A1F] text-white rounded font-mono text-sm font-semibold hover:bg-[#00204A] transition-colors cursor-pointer shadow-sm"
        >
          Download ESG Report
        </button>
      </div>

      {/* Generate New Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-[#000A1F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#C4C6D0]">
              <h3 className="font-sans font-bold text-lg text-[#181C1C]">Generate New Report</h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-[#44474F] hover:text-[#181C1C] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateReportSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded font-sans text-sm text-[#181C1C] focus:outline-none focus:border-[#006A6A]"
                >
                  <option>Monthly ESG Summary</option>
                  <option>Carbon Footprint Audit</option>
                  <option>Compliance & Permit Verification</option>
                  <option>Material Throughput & Yield</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Time Period
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded font-sans text-sm text-[#181C1C] focus:outline-none focus:border-[#006A6A]"
                >
                  <option>Last 30 Days</option>
                  <option>Q1 2024</option>
                  <option>Q2 2024</option>
                  <option>Full Year 2024</option>
                  <option>Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Output Format
                </label>
                <div className="flex gap-4 pt-1 font-sans text-sm text-[#181C1C]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" defaultChecked className="accent-[#006A6A]" />
                    <span>PDF Document</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" className="accent-[#006A6A]" />
                    <span>Excel (.xlsx)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#C4C6D0]">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold hover:bg-[#F1F4F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A]"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
