import React, { useState } from 'react';
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
  Award
} from 'lucide-react';

interface ReportsAnalyticsPageProps {
  onBack?: () => void;
}

export const ReportsAnalyticsPage: React.FC<ReportsAnalyticsPageProps> = ({ onBack }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownload = (reportName: string) => {
    showToast(`Downloading ${reportName}...`);
  };

  const handleView = (reportName: string) => {
    showToast(`Opening preview for ${reportName}`);
  };

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
        <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
          Reports &amp; Analytics
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          Monitor sustainability performance, waste transactions, shipment history, compliance, and business insights.
        </p>
      </section>

      {/* 6 Metric Summary Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-sans text-xs text-[#44474F] mb-1">Total Waste Processed</p>
          <p className="font-headline font-semibold text-xl text-[#181C1C]">1,245 Tons</p>
        </div>
        <div className="bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-sans text-xs text-[#44474F] mb-1">Active Listings</p>
          <p className="font-headline font-semibold text-xl text-[#181C1C]">12</p>
        </div>
        <div className="bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-sans text-xs text-[#44474F] mb-1">Completed Transactions</p>
          <p className="font-headline font-semibold text-xl text-[#181C1C]">48</p>
        </div>
        <div className="bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-sans text-xs text-[#44474F] mb-1">Carbon Saved</p>
          <p className="font-headline font-semibold text-xl text-[#006A6A]">326 t CO₂</p>
        </div>
        <div className="bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-sans text-xs text-[#44474F] mb-1">Total Revenue</p>
          <p className="font-headline font-semibold text-xl text-[#181C1C]">1.25M EGP</p>
        </div>
        <div className="bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
          <p className="font-sans text-xs text-[#44474F] mb-1">Compliance Rate</p>
          <p className="font-headline font-semibold text-xl text-[#181C1C]">98%</p>
        </div>
      </section>

      {/* 2-Column Visual Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Waste Bar Chart */}
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-6 shadow-2xs">
          <h3 className="font-mono font-medium text-base text-[#181C1C]">
            Monthly Waste Processed
          </h3>
          <div className="h-48 flex items-end justify-between gap-3 px-4 pt-2">
            <div className="flex-1 bg-[#8CF3F3] rounded-t-xs h-[40%] flex flex-col items-center justify-start pt-1 text-[10px] font-mono text-[#007070]">
              Mar
            </div>
            <div className="flex-1 bg-[#8CF3F3] rounded-t-xs h-[60%] flex flex-col items-center justify-start pt-1 text-[10px] font-mono text-[#007070]">
              Apr
            </div>
            <div className="flex-1 bg-[#8CF3F3] rounded-t-xs h-[45%] flex flex-col items-center justify-start pt-1 text-[10px] font-mono text-[#007070]">
              May
            </div>
            <div className="flex-1 bg-[#8CF3F3] rounded-t-xs h-[80%] flex flex-col items-center justify-start pt-1 text-[10px] font-mono text-[#007070]">
              Jun
            </div>
            <div className="flex-1 bg-[#006A6A] rounded-t-xs h-[95%] flex flex-col items-center justify-start pt-1 text-[10px] font-mono text-white">
              Jul
            </div>
          </div>
        </div>

        {/* Waste Categories Distribution Donut Visual */}
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-6 shadow-2xs">
          <h3 className="font-mono font-medium text-base text-[#181C1C]">
            Waste Categories Distribution
          </h3>
          <div className="flex items-center justify-center h-48">
            <div className="w-32 h-32 rounded-full border-[16px] border-[#006A6A] relative flex items-center justify-center shadow-2xs">
              <div className="absolute inset-0 border-[16px] border-[#8CF3F3] rounded-full clip-path-polygon-[50%_0,100%_0,100%_100%,0_100%]" />
              <span className="font-sans text-xs font-bold text-[#181C1C] text-center z-10 px-2">
                5 Categories
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Reports Library Grid */}
      <section className="space-y-4">
        <h3 className="font-mono font-medium text-base text-[#181C1C]">
          Reports Library
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Sustainability Report', meta: 'July 2026 • Generated' },
            { title: 'ESG Performance Report', meta: 'Q2 2026 • Generated' },
            { title: 'Law 202 Compliance', meta: 'Annual 2025 • Generated' },
            { title: 'Shipment History', meta: 'June 2026 • Generated' },
            { title: 'Marketplace Transactions', meta: 'Monthly • Generated' }
          ].map((rep, idx) => (
            <div
              key={idx}
              className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 flex justify-between items-center shadow-2xs"
            >
              <div>
                <p className="font-mono text-sm font-medium text-[#181C1C]">{rep.title}</p>
                <p className="font-sans text-xs text-[#44474F]">{rep.meta}</p>
              </div>
              <div className="flex gap-2 text-[#006A6A]">
                <button
                  type="button"
                  onClick={() => handleView(rep.title)}
                  className="p-1 hover:bg-[#8CF3F3]/30 rounded cursor-pointer transition-colors"
                  title="View Report"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(rep.title)}
                  className="p-1 hover:bg-[#8CF3F3]/30 rounded cursor-pointer transition-colors"
                  title="Download PDF"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace Transactions Table */}
      <section className="space-y-4">
        <h3 className="font-mono font-medium text-base text-[#181C1C]">
          Marketplace Transactions
        </h3>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg overflow-x-auto shadow-2xs">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-[#F1F4F3] border-b border-[#C4C6D0]">
              <tr className="font-sans text-xs font-bold text-[#44474F]">
                <th className="p-4">Auction ID</th>
                <th className="p-4">Winning Recycler</th>
                <th className="p-4">Final Price</th>
                <th className="p-4">Waste Type</th>
                <th className="p-4">Completion</th>
                <th className="p-4">Payment</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm text-[#181C1C]">
              <tr className="border-b border-[#C4C6D0] hover:bg-[#F1F4F3]/50 transition-colors">
                <td className="p-4 font-mono">AUC-442</td>
                <td className="p-4">EcoCycle Inc</td>
                <td className="p-4 font-mono font-medium">45,000 EGP</td>
                <td className="p-4">Plastic Scrap</td>
                <td className="p-4 font-mono">2026-07-05</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] rounded-full font-mono text-[10px] font-medium">
                    Paid
                  </span>
                </td>
              </tr>
              <tr className="border-b border-[#C4C6D0] hover:bg-[#F1F4F3]/50 transition-colors">
                <td className="p-4 font-mono">AUC-439</td>
                <td className="p-4">Green Recycling Ltd.</td>
                <td className="p-4 font-mono font-medium">12,500 EGP</td>
                <td className="p-4">Steel Scrap</td>
                <td className="p-4 font-mono">2026-08-01</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] rounded-full font-mono text-[10px] font-medium">
                    Paid
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Environmental Impact (5 Metrics Cards) */}
      <section className="space-y-4">
        <h3 className="font-mono font-medium text-base text-[#181C1C]">
          Environmental Impact
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
            <p className="font-sans text-xs text-[#44474F] mb-1">Carbon Saved</p>
            <p className="font-headline font-semibold text-xl text-[#006A6A]">326 t CO₂</p>
          </div>
          <div className="bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
            <p className="font-sans text-xs text-[#44474F] mb-1">Waste Recycled</p>
            <p className="font-headline font-semibold text-xl text-[#181C1C]">842 Tons</p>
          </div>
          <div className="bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
            <p className="font-sans text-xs text-[#44474F] mb-1">Landfill Diversion</p>
            <p className="font-headline font-semibold text-xl text-[#181C1C]">92%</p>
          </div>
          <div className="bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
            <p className="font-sans text-xs text-[#44474F] mb-1">Energy Recovery</p>
            <p className="font-headline font-semibold text-xl text-[#181C1C]">12.4 MWh</p>
          </div>
          <div className="bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
            <p className="font-sans text-xs text-[#44474F] mb-1">ESG Score</p>
            <p className="font-headline font-semibold text-xl text-[#006A6A]">88/100</p>
          </div>
        </div>
      </section>

      {/* Sustainability Reports Download Card */}
      <section className="space-y-4">
        <h3 className="font-mono font-medium text-base text-[#181C1C]">
          Sustainability Reports
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 flex justify-between items-center shadow-2xs">
            <div>
              <p className="font-mono text-sm font-medium text-[#181C1C]">Monthly Sustainability Report</p>
              <p className="font-sans text-xs text-[#44474F]">July 2026 • Generated</p>
            </div>
            <div className="flex gap-2 text-[#006A6A]">
              <button
                type="button"
                onClick={() => handleDownload('Monthly Sustainability Report')}
                className="p-1 hover:bg-[#8CF3F3]/30 rounded cursor-pointer transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleView('Monthly Sustainability Report')}
                className="p-1 hover:bg-[#8CF3F3]/30 rounded cursor-pointer transition-colors"
                title="Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Law 202 of 2020 Compliance Reports Table */}
      <section className="space-y-4">
        <h3 className="font-mono font-medium text-base text-[#181C1C]">
          Law 202 of 2020 Compliance Reports
        </h3>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F1F4F3] border-b border-[#C4C6D0]">
              <tr className="font-sans text-xs font-bold text-[#44474F]">
                <th className="p-4">Report ID</th>
                <th className="p-4">Shipment ID</th>
                <th className="p-4">Waste Type</th>
                <th className="p-4">Compliance</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm text-[#181C1C]">
              <tr className="border-b border-[#C4C6D0] hover:bg-[#F1F4F3]/50 transition-colors">
                <td className="p-4 font-mono">REP-001</td>
                <td className="p-4 font-mono">SH-2026-014</td>
                <td className="p-4">Steel Scrap</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 bg-[#8CF3F3] text-[#007070] rounded-full font-mono text-[10px] font-medium">
                    Compliant
                  </span>
                </td>
                <td className="p-4 font-sans text-xs flex gap-3 text-[#006A6A]">
                  <button
                    type="button"
                    onClick={() => handleView('Compliance REP-001')}
                    className="hover:underline cursor-pointer font-medium"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload('Compliance REP-001 PDF')}
                    className="hover:underline cursor-pointer font-medium"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Action Footer (5 Buttons Grid) */}
      <section className="pt-4 border-t border-[#C4C6D0]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
          <button
            type="button"
            onClick={() => handleDownload('ESG Report')}
            className="px-4 py-3 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors cursor-pointer text-center"
          >
            Download ESG Report
          </button>
          <button
            type="button"
            onClick={() => handleDownload('Compliance Report')}
            className="px-4 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center"
          >
            Download Compliance Report
          </button>
          <button
            type="button"
            onClick={() => handleDownload('Shipment History')}
            className="px-4 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center"
          >
            Export Shipment History
          </button>
          <button
            type="button"
            onClick={() => handleDownload('Annual Report')}
            className="px-4 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center"
          >
            Generate Annual Report
          </button>
          <button
            type="button"
            onClick={() => handleDownload('Carbon Report')}
            className="px-4 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center"
          >
            Generate Carbon Report
          </button>
        </div>
      </section>
    </div>
  );
};
