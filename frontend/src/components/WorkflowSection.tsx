import React, { useState } from 'react';
import { UploadCloud, Cpu, Gavel, Truck, FileCheck, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { WorkflowStep } from '../types';

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    stepNumber: 'Step 01',
    title: 'Upload Waste',
    iconName: 'UploadCloud',
    description: 'Factory operators register batch data via image scan, CSV import, or ERP system sync.',
    detailText: 'Real-time telemetry tags material type, weight (tons), moisture content, and chemical composition.',
    metrics: 'Avg Upload Time: < 30 sec',
  },
  {
    id: 2,
    stepNumber: 'Step 02',
    title: 'System Classifies',
    iconName: 'Cpu',
    description: 'Advanced computer vision and analysis models analyze waste density, purity, and resale potential.',
    detailText: 'System suggests optimal recycling pipelines and estimates market value per metric ton.',
    metrics: 'Classification Accuracy: 98.4%',
  },
  {
    id: 3,
    stepNumber: 'Step 03',
    title: 'Market Auctions',
    iconName: 'Gavel',
    description: 'Verified industrial recyclers submit real-time sealed bids for published material lots.',
    detailText: 'Automated reserve price matching guarantees fair market valuation and maximum recovery value.',
    metrics: 'Avg Bidding Time: 4 Hours',
  },
  {
    id: 4,
    stepNumber: 'Step 04',
    title: 'Shipment Track',
    iconName: 'Truck',
    description: 'Licensed green logistics carriers receive automated dispatch routes with live GPS monitoring.',
    detailText: 'IoT sensor integration logs transit time, geo-fencing checkpoints, and digital custody logs.',
    metrics: 'Real-Time GPS Telemetry',
  },
  {
    id: 5,
    stepNumber: 'Step 05',
    title: 'ESG Reports',
    iconName: 'FileCheck',
    description: 'System generates Law No. 202 Digital Manifests and automated carbon offset certificates.',
    detailText: 'Instant export to PDF/JSON for regulatory submission and corporate sustainability audits.',
    metrics: '100% Legal Manifest Compliance',
  },
];

export const WorkflowSection: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<number>(2);

  const activeStep = WORKFLOW_STEPS.find((s) => s.id === activeStepId) || WORKFLOW_STEPS[1];

  const renderIcon = (iconName: string, isTeal: boolean) => {
    const colorClass = isTeal ? 'text-[#006A6A]' : 'text-[#000A1F]';
    switch (iconName) {
      case 'UploadCloud':
        return <UploadCloud className={`w-7 h-7 ${colorClass}`} />;
      case 'Cpu':
        return <Cpu className={`w-7 h-7 ${colorClass}`} />;
      case 'Gavel':
        return <Gavel className={`w-7 h-7 ${colorClass}`} />;
      case 'Truck':
        return <Truck className={`w-7 h-7 ${colorClass}`} />;
      case 'FileCheck':
        return <FileCheck className={`w-7 h-7 ${colorClass}`} />;
      default:
        return <UploadCloud className={`w-7 h-7 ${colorClass}`} />;
    }
  };

  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
      <div className="bg-[#F1F4F3] border border-[#C4C6D0]/40 rounded-[32px] p-8 sm:p-10 lg:p-12 space-y-10">
        {/* Title Container */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="font-headline font-semibold text-3xl sm:text-[32px] text-[#000A1F]">
            The EcoLink Workflow
          </h2>
          <p className="font-body text-base sm:text-lg text-[#44474F] leading-relaxed">
            A seamless end-to-end process ensuring transparency and efficiency in the circular economy.
          </p>
        </div>

        {/* Stepper Grid Container */}
        <div className="relative pt-4 pb-2">
          {/* Connected Line Background */}
          <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-[2px] bg-[#C4C6D0] z-0" />

          {/* Steps Horizontal Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {WORKFLOW_STEPS.map((step) => {
              const isEven = step.id % 2 === 0;
              const isActive = step.id === activeStepId;
              const isTealBorder = isEven;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className={`flex flex-col items-center gap-4 cursor-pointer group transition-all duration-200 ${
                    isActive ? 'scale-105' : 'hover:scale-102 opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Step Icon Card */}
                  <div
                    className={`w-20 h-20 rounded-xl bg-[#F7FAF9] flex items-center justify-center shadow-xs transition-all duration-200 ${
                      isTealBorder ? 'border-4 border-[#006A6A]' : 'border-4 border-[#000A1F]'
                    } ${isActive ? 'ring-4 ring-[#8CF3F3]/60 shadow-md' : ''}`}
                  >
                    {renderIcon(step.iconName, isTealBorder)}
                  </div>

                  {/* Step Labels */}
                  <div className="text-center space-y-0.5">
                    <p
                      className={`font-mono text-sm font-medium ${
                        isTealBorder ? 'text-[#006A6A]' : 'text-[#7189B8]'
                      }`}
                    >
                      {step.stepNumber}
                    </p>
                    <p className="font-body font-semibold text-base text-[#181C1C]">
                      {step.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Step Interactive Detail Card */}
        <div className="bg-white border border-[#C4C6D0] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs animate-in fade-in">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="bg-[#000A1F] text-[#8CF3F3] font-mono text-xs px-2.5 py-1 rounded-md font-semibold">
                {activeStep.stepNumber}
              </span>
              <h3 className="font-headline font-semibold text-xl text-[#000A1F]">
                {activeStep.title} Phase
              </h3>
            </div>
            <p className="font-body text-[#181C1C] text-base leading-relaxed">
              {activeStep.description}
            </p>
            <p className="font-body text-[#44474F] text-sm flex items-center gap-1.5 pt-1">
              <Info className="w-4 h-4 text-[#006A6A]" />
              <span>{activeStep.detailText}</span>
            </p>
          </div>

          <div className="bg-[#F7FAF9] border border-[#C4C6D0] p-4 rounded-xl min-w-[220px] space-y-2">
            <div className="text-xs font-mono text-[#747780] uppercase">Key Performance Metric</div>
            <div className="font-mono text-sm font-semibold text-[#006A6A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#009B73]" />
              <span>{activeStep.metrics}</span>
            </div>
            <button
              onClick={() => setActiveStepId((prev) => (prev % 5) + 1)}
              className="w-full mt-2 pt-2 border-t border-[#EBEEED] text-xs font-mono text-[#000A1F] hover:text-[#006A6A] flex items-center justify-between cursor-pointer"
            >
              <span>Next Workflow Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
