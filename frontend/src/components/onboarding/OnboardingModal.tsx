import React, { useState } from 'react';
import { X, Check, Factory, RefreshCw, Truck, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { RoleType } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  initialRole?: RoleType;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  initialRole = 'factory',
  onClose,
  onOpenLogin,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<RoleType>(initialRole);
  const [companyName, setCompanyName] = useState('Apex Metallurgy Ltd');
  const [wasteType, setWasteType] = useState('Aluminum Scrap & Metal Shavings');
  const [monthlyVolume, setMonthlyVolume] = useState('50 - 100 Tons');
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setIsCompleted(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000A1F]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border border-[#C4C6D0] w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#F7FAF9] border-b border-[#C4C6D0] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#000A1F] text-[#8CF3F3] flex items-center justify-center font-bold text-sm">
              EL
            </div>
            <div>
              <h3 className="font-headline font-semibold text-xl text-[#000A1F]">
                EcoLink Onboarding
              </h3>
              <p className="text-xs font-mono text-[#006A6A]">Step {step} of 3 • Industrial Setup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#747780] hover:text-[#000A1F] hover:bg-[#EBEEED] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isCompleted ? (
            <>
              {/* Step 1: Role Selection */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="font-headline font-semibold text-lg text-[#000A1F]">
                    Select Your Organization Role
                  </h4>
                  <p className="text-sm text-[#44474F]">
                    We will customize your portal tools, legal manifest formats, and marketplace options based on your operation.
                  </p>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('factory')}
                      className={`p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
                        selectedRole === 'factory'
                          ? 'border-[#006A6A] bg-[#8CF3F3]/15 ring-2 ring-[#006A6A]/20'
                          : 'border-[#C4C6D0] hover:border-[#006A6A]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#000A1F] text-[#8CF3F3] flex items-center justify-center shrink-0">
                        <Factory className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-headline font-semibold text-base text-[#000A1F]">
                          Industrial Factory (Waste Generator)
                        </div>
                        <div className="text-xs text-[#44474F]">
                          Produce metal, plastic, chemical, or organic byproduct waste streams.
                        </div>
                      </div>
                      {selectedRole === 'factory' && <Check className="w-5 h-5 text-[#006A6A]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('recycler')}
                      className={`p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
                        selectedRole === 'recycler'
                          ? 'border-[#006A6A] bg-[#8CF3F3]/15 ring-2 ring-[#006A6A]/20'
                          : 'border-[#C4C6D0] hover:border-[#006A6A]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#006A6A] text-white flex items-center justify-center shrink-0">
                        <RefreshCw className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-headline font-semibold text-base text-[#000A1F]">
                          Recycler &amp; Processor
                        </div>
                        <div className="text-xs text-[#44474F]">
                          Procure, re-smelt, shred, or refine recyclable secondary raw materials.
                        </div>
                      </div>
                      {selectedRole === 'recycler' && <Check className="w-5 h-5 text-[#006A6A]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('logistics')}
                      className={`p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
                        selectedRole === 'logistics'
                          ? 'border-[#006A6A] bg-[#8CF3F3]/15 ring-2 ring-[#006A6A]/20'
                          : 'border-[#C4C6D0] hover:border-[#006A6A]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#000A1F] text-[#8CF3F3] flex items-center justify-center shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-headline font-semibold text-base text-[#000A1F]">
                          Licensed Logistics Fleet
                        </div>
                        <div className="text-xs text-[#44474F]">
                          Transport hazardous or non-hazardous waste under Law No. 202 tracking.
                        </div>
                      </div>
                      {selectedRole === 'logistics' && <Check className="w-5 h-5 text-[#006A6A]" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Facility Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="font-headline font-semibold text-lg text-[#000A1F]">
                    Facility &amp; Operations Metadata
                  </h4>
                  <p className="text-sm text-[#44474F]">
                    Provide basic info to configure your automated manifest templates.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-[#000A1F] mb-1 font-medium">
                        Company / Facility Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 border border-[#C4C6D0] rounded-lg text-sm text-[#000A1F] focus:outline-none focus:border-[#006A6A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#000A1F] mb-1 font-medium">
                        Primary Waste Output / Commodity
                      </label>
                      <select
                        value={wasteType}
                        onChange={(e) => setWasteType(e.target.value)}
                        className="w-full px-3 py-2 border border-[#C4C6D0] rounded-lg text-sm text-[#000A1F] focus:outline-none focus:border-[#006A6A] bg-white"
                      >
                        <option>Aluminum Scrap &amp; Metal Shavings</option>
                        <option>High-Density Polyethylene (HDPE)</option>
                        <option>Industrial Cardboard &amp; Packaging</option>
                        <option>Chemical Sludge &amp; Effluent</option>
                        <option>Electronic Waste &amp; PCBs</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#000A1F] mb-1 font-medium">
                        Estimated Monthly Waste Volume
                      </label>
                      <select
                        value={monthlyVolume}
                        onChange={(e) => setMonthlyVolume(e.target.value)}
                        className="w-full px-3 py-2 border border-[#C4C6D0] rounded-lg text-sm text-[#000A1F] focus:outline-none focus:border-[#006A6A] bg-white"
                      >
                        <option>10 - 50 Tons</option>
                        <option>50 - 100 Tons</option>
                        <option>100 - 500 Tons</option>
                        <option>500+ Tons (Enterprise Scale)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Verification & Review */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="font-headline font-semibold text-lg text-[#000A1F]">
                    Confirm Law No. 202 Compliance Rules
                  </h4>
                  <p className="text-sm text-[#44474F]">
                    EcoLink automatically signs every shipment manifest with cryptographic hash compliance.
                  </p>

                  <div className="bg-[#F1F4F3] p-4 rounded-xl border border-[#C4C6D0] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#000A1F] border-b border-[#C4C6D0] pb-2">
                      <span>ROLE TYPE:</span>
                      <span className="font-semibold uppercase text-[#006A6A]">{selectedRole}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#000A1F] border-b border-[#C4C6D0] pb-2">
                      <span>FACILITY:</span>
                      <span className="font-semibold">{companyName}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#000A1F] border-b border-[#C4C6D0] pb-2">
                      <span>PRIMARY WASTE:</span>
                      <span className="font-semibold">{wasteType}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#000A1F]">
                      <span>EST. VOLUME:</span>
                      <span className="font-semibold">{monthlyVolume}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#8CF3F3]/20 border border-[#006A6A]/30 rounded-lg text-xs text-[#006A6A] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 shrink-0 text-[#006A6A]" />
                    <span>Your account is pre-approved for digital waste manifests and automated ESG telemetry.</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Completed Confirmation */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#8CF3F3] text-[#007070] flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="font-headline font-bold text-2xl text-[#000A1F]">
                Welcome to EcoLink!
              </h4>
              <p className="text-sm text-[#44474F] max-w-md mx-auto">
                Your account for <strong className="text-[#000A1F]">{companyName}</strong> is initialized. You can now list industrial waste streams, participate in auctions, and generate compliance documents.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Buttons */}
        <div className="bg-[#F7FAF9] border-t border-[#C4C6D0] p-4 flex items-center justify-between">
          {!isCompleted ? (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border border-[#C4C6D0] text-[#000A1F] rounded-lg font-mono text-sm hover:bg-[#EBEEED] transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#000A1F] hover:bg-[#00204A] text-white px-6 py-2 rounded-lg font-mono text-sm flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>{step === 3 ? 'Complete Setup' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4 text-[#8CF3F3]" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                handleReset();
                if (onOpenLogin) onOpenLogin();
              }}
              className="w-full bg-[#000A1F] hover:bg-[#00204A] text-white py-3 rounded-xl font-mono text-sm font-semibold cursor-pointer"
            >
              Proceed to Sign In Page
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
