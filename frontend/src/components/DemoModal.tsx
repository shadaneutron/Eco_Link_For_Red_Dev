import React, { useState } from 'react';
import { X, Cpu, Store, ShieldCheck, BarChart3, Upload, CheckCircle2, TrendingUp, RefreshCw, FileText } from 'lucide-react';
import { BentoCapability } from '../types';

interface DemoModalProps {
  capability: BentoCapability | null;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ capability, onClose }) => {
  if (!capability) return null;

  // State for Waste Classification
  const [selectedSample, setSelectedSample] = useState<'aluminum' | 'plastic' | 'copper'>('aluminum');
  const [isScanning, setIsScanning] = useState(false);

  // State for Marketplace Auction
  const [bidAmount, setBidAmount] = useState(4850);
  const [bids, setBids] = useState<{ bidder: string; amount: number; time: string }[]>([
    { bidder: 'RecycleCorp International', amount: 4800, time: '2 mins ago' },
    { bidder: 'Nile Metals Refinement', amount: 4650, time: '14 mins ago' },
  ]);

  // State for ESG Calculator
  const [tonnageInput, setTonnageInput] = useState<number>(120);

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 800);
  };

  const handlePlaceBid = () => {
    if (bidAmount > (bids[0]?.amount || 0)) {
      setBids([
        { bidder: 'Your Enterprise (You)', amount: bidAmount, time: 'Just now' },
        ...bids,
      ]);
      setBidAmount(bidAmount + 150);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000A1F]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border border-[#C4C6D0] w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#F7FAF9] border-b border-[#C4C6D0] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${capability.iconBg} flex items-center justify-center shadow-xs`}>
              {capability.demoType === 'classification' && <Cpu className={`w-5 h-5 ${capability.iconColor}`} />}
              {capability.demoType === 'marketplace' && <Store className={`w-5 h-5 ${capability.iconColor}`} />}
              {capability.demoType === 'compliance' && <ShieldCheck className={`w-5 h-5 ${capability.iconColor}`} />}
              {capability.demoType === 'esg' && <BarChart3 className={`w-5 h-5 ${capability.iconColor}`} />}
            </div>
            <div>
              <h3 className="font-headline font-semibold text-xl text-[#000A1F]">
                {capability.title}
              </h3>
              <p className="text-xs font-mono text-[#006A6A]">Interactive Capability Playground</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#747780] hover:text-[#000A1F] hover:bg-[#EBEEED] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* DEMO 1: MATERIAL CLASSIFICATION */}
          {capability.demoType === 'classification' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-headline font-semibold text-base text-[#000A1F]">
                  Select Sample Material Scan
                </h4>
                <p className="text-xs text-[#44474F]">
                  Upload a photo or select an industrial byproduct sample to run real-time computer vision inference.
                </p>
              </div>

              {/* Sample Selector */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setSelectedSample('aluminum');
                    handleRunScan();
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedSample === 'aluminum'
                      ? 'border-[#006A6A] bg-[#8CF3F3]/20 ring-2 ring-[#006A6A]/20'
                      : 'border-[#C4C6D0] hover:border-[#006A6A]'
                  }`}
                >
                  <div className="text-xs font-mono font-semibold text-[#000A1F]">Aluminum Turnings</div>
                  <div className="text-[10px] text-[#747780]">Scrap Grade A</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedSample('plastic');
                    handleRunScan();
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedSample === 'plastic'
                      ? 'border-[#006A6A] bg-[#8CF3F3]/20 ring-2 ring-[#006A6A]/20'
                      : 'border-[#C4C6D0] hover:border-[#006A6A]'
                  }`}
                >
                  <div className="text-xs font-mono font-semibold text-[#000A1F]">HDPE Polymers</div>
                  <div className="text-[10px] text-[#747780]">Industrial Pellets</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedSample('copper');
                    handleRunScan();
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedSample === 'copper'
                      ? 'border-[#006A6A] bg-[#8CF3F3]/20 ring-2 ring-[#006A6A]/20'
                      : 'border-[#C4C6D0] hover:border-[#006A6A]'
                  }`}
                >
                  <div className="text-xs font-mono font-semibold text-[#000A1F]">Bare Bright Copper</div>
                  <div className="text-[10px] text-[#747780]">Wire Shreds</div>
                </button>
              </div>

              {/* Scan Preview Card */}
              <div className="bg-[#F1F4F3] border border-[#C4C6D0] p-5 rounded-xl relative overflow-hidden">
                {isScanning ? (
                  <div className="py-12 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-[#006A6A] animate-spin mx-auto" />
                    <p className="font-mono text-xs text-[#006A6A]">Analyzing Pixel Multi-Spectral Arrays...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#C4C6D0] pb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#009B73]" />
                        <span className="font-headline font-semibold text-base text-[#000A1F]">
                          Vision Analysis Complete
                        </span>
                      </div>
                      <span className="bg-[#00204A] text-[#80F9CA] font-mono text-xs px-2.5 py-1 rounded-md">
                        Confidence: 99.4%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div className="bg-white p-3 rounded-lg border border-[#C4C6D0]">
                        <span className="text-[#747780] block text-[10px]">CLASSIFIED MATERIAL</span>
                        <span className="font-semibold text-sm text-[#000A1F]">
                          {selectedSample === 'aluminum' && 'Alloy 6061 Aluminum'}
                          {selectedSample === 'plastic' && 'High Density Polyethylene'}
                          {selectedSample === 'copper' && 'Class 1 Heavy Copper Wire'}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-[#C4C6D0]">
                        <span className="text-[#747780] block text-[10px]">ESTIMATED FAIR VALUE</span>
                        <span className="font-semibold text-sm text-[#006A6A]">
                          {selectedSample === 'aluminum' && '$1,840 / Ton'}
                          {selectedSample === 'plastic' && '$920 / Ton'}
                          {selectedSample === 'copper' && '$8,450 / Ton'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-[#C4C6D0] text-xs space-y-1">
                      <span className="font-mono text-[10px] text-[#747780]">PURITY &amp; IMPURITY METRICS</span>
                      <p className="text-[#181C1C]">
                        Contamination level &lt; 0.4%. Ready for direct smelting or high-grade recycling auction listing.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DEMO 2: SMART MARKETPLACE */}
          {capability.demoType === 'marketplace' && (
            <div className="space-y-6">
              <div className="bg-[#000A1F] text-white p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8CF3F3]">LIVE AUCTION LOT #EGY-8842</span>
                  <span className="bg-[#009B73] px-2 py-0.5 rounded text-white font-semibold animate-pulse">
                    CLOSING IN 04m 12s
                  </span>
                </div>
                <h4 className="font-headline font-semibold text-xl">
                  45 Metric Tons • Recycled Billet Aluminum (Grade 6063)
                </h4>
                <div className="flex items-center gap-6 text-sm font-mono pt-1">
                  <div>
                    <span className="text-[#7189B8] text-xs block">CURRENT TOP BID</span>
                    <span className="text-2xl font-bold text-[#8CF3F3]">
                      ${bids[0]?.amount.toLocaleString()} USD
                    </span>
                  </div>
                  <div className="border-l border-[#2E4772] pl-6">
                    <span className="text-[#7189B8] text-xs block">LOCATION</span>
                    <span className="text-white">10th of Ramadan Industrial City</span>
                  </div>
                </div>
              </div>

              {/* Bidding Controls */}
              <div className="space-y-3 bg-[#F1F4F3] p-4 rounded-xl border border-[#C4C6D0]">
                <label className="block text-xs font-mono text-[#000A1F] font-semibold">
                  Place Sealed Incremental Bid ($)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="flex-grow px-4 py-2 bg-white border border-[#C4C6D0] rounded-lg text-base font-mono font-semibold text-[#000A1F] focus:outline-none focus:border-[#006A6A]"
                  />
                  <button
                    onClick={handlePlaceBid}
                    className="bg-[#006A6A] hover:bg-[#007070] text-white px-6 py-2 rounded-lg font-mono text-sm font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    Submit Bid
                  </button>
                </div>
              </div>

              {/* Recent Bids Feed */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#747780] uppercase">Auction Audit Trail</span>
                <div className="space-y-2">
                  {bids.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-[#C4C6D0] rounded-lg flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#006A6A]" />
                        <span className="font-semibold text-[#000A1F]">{b.bidder}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[#747780]">{b.time}</span>
                        <span className="font-bold text-[#006A6A]">${b.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DEMO 3: COMPLIANCE AUTOMATION */}
          {capability.demoType === 'compliance' && (
            <div className="space-y-6">
              <div className="bg-[#F7FAF9] border-2 border-[#006A6A] p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#C4C6D0] pb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-[#006A6A]" />
                    <div>
                      <h4 className="font-headline font-semibold text-lg text-[#000A1F]">
                        Digital Waste Manifest #EGY-LAW202-99041
                      </h4>
                      <p className="text-xs font-mono text-[#006A6A]">
                        Egyptian Waste Management Regulatory Authority (WMRA) Verified
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#009B73] text-white text-xs font-mono font-semibold px-3 py-1 rounded-full">
                    LEGALLY VALIDATED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono text-[#000A1F]">
                  <div className="bg-white p-3 rounded-lg border border-[#C4C6D0]">
                    <span className="text-[#747780] block text-[10px]">GENERATOR (ORIGIN)</span>
                    <span className="font-semibold">Apex Metallurgy Industrial Park</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#C4C6D0]">
                    <span className="text-[#747780] block text-[10px]">TRANSPORTER</span>
                    <span className="font-semibold">Nile Heavy Eco Logistics (Lic #440)</span>
                  </div>
                </div>

                <div className="bg-[#000A1F] text-white p-4 rounded-lg font-mono text-xs space-y-2">
                  <div className="flex justify-between border-b border-[#2E4772] pb-1">
                    <span className="text-[#8CF3F3]">Cryptographic Proof Hash:</span>
                    <span>0x98f...e4a2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8CF3F3]">Law Compliance Standard:</span>
                    <span>Law No. 202 of 2020 Article 29</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEMO 4: ESG & SUSTAINABILITY */}
          {capability.demoType === 'esg' && (
            <div className="space-y-6">
              <div className="bg-[#F1F4F3] p-5 rounded-xl border border-[#C4C6D0] space-y-4">
                <h4 className="font-headline font-semibold text-lg text-[#000A1F]">
                  Interactive Carbon Savings Calculator
                </h4>
                <p className="text-xs text-[#44474F]">
                  Adjust your monthly recycled industrial tonnage to project annual CO₂ emission reductions.
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono font-semibold">
                    <span>Monthly Recycled Tonnage:</span>
                    <span className="text-[#006A6A]">{tonnageInput} Tons</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={tonnageInput}
                    onChange={(e) => setTonnageInput(Number(e.target.value))}
                    className="w-full accent-[#006A6A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-4 rounded-xl border border-[#C4C6D0] text-center">
                    <span className="text-[11px] font-mono text-[#747780] block">CO₂ EMISSIONS SAVED</span>
                    <span className="font-headline font-bold text-3xl text-[#006A6A]">
                      {(tonnageInput * 2.45).toFixed(1)} <span className="text-sm font-normal">Tons/yr</span>
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#C4C6D0] text-center">
                    <span className="text-[11px] font-mono text-[#747780] block">TREES EQUIVALENT</span>
                    <span className="font-headline font-bold text-3xl text-[#000A1F]">
                      {(tonnageInput * 112).toLocaleString()} <span className="text-sm font-normal">Trees</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F7FAF9] border-t border-[#C4C6D0] p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#000A1F] hover:bg-[#00204A] text-white px-6 py-2 rounded-lg font-mono text-sm cursor-pointer"
          >
            Close Interactive Demo
          </button>
        </div>
      </div>
    </div>
  );
};
