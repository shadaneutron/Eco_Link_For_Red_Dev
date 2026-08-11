import React, { useState } from 'react';
import {
  Check,
  ShieldCheck,
  CreditCard,
  Building2,
  Phone,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Tag,
  Sparkles,
  Zap,
  Search,
  FileText
} from 'lucide-react';

export interface UpgradeCheckoutPageProps {
  planName?: string;
  price?: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

export const UpgradeCheckoutPage: React.FC<UpgradeCheckoutPageProps> = ({
  planName = 'Professional Plan',
  price = '1,499 EGP',
  onBack,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'vodafone'>('card');
  const [cardHolder, setCardHolder] = useState('Green Recycling Ltd.');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('***');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Price calculations
  const basePriceNum = 1499;
  const discountNum = promoApplied ? 200 : 0;
  const subtotal = basePriceNum - discountNum;
  const vatAmount = subtotal * 0.14;
  const grandTotal = subtotal + vatAmount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ECO2026' || promoCode.trim().toUpperCase() === 'ECO10') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try "ECO2026" for 200 EGP discount!');
    }
  };

  const handleUpgradeNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      if (onSuccess) {
        onSuccess();
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#181C1C] font-sans flex flex-col">
      {/* Top Standalone Header (No Sidebar) */}
      <header className="h-16 bg-[#F7FAF9] border-b border-[#C4C6D0] flex justify-between items-center px-6 lg:px-10 sticky top-0 z-30 w-full backdrop-blur-md bg-[#F7FAF9]/95">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-headline font-bold text-xl text-[#000A1F] tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-[#000A1F] flex items-center justify-center text-[#8CF3F3] shadow-xs">
              <Zap className="w-4 h-4 fill-[#006A6A] text-[#006A6A]" />
            </div>
            <span>EcoLink</span>
            <span className="text-[10px] font-mono text-[#006A6A] bg-[#8CF3F3]/50 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
              CHECKOUT &amp; UPGRADE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3.5 py-1.5 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-semibold text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#006A6A]" />
              <span>Back to Plans</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Standalone Full-Width Content Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 lg:py-10 space-y-8">
        {/* Title Header */}
        <div className="space-y-1">
          <h1 className="font-headline font-bold text-3xl sm:text-4xl text-[#181C1C] tracking-tight">
            Upgrade to {planName}
          </h1>
          <p className="font-sans text-sm text-[#44474F]">
            Review your subscription details, company profile, and payment method to finalize upgrade.
          </p>
        </div>

        {isCompleted ? (
          /* Success Screen State */
          <div className="bg-white border border-[#C4C6D0] rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-lg">
            <div className="w-16 h-16 bg-[#8CF3F3] text-[#007070] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-headline font-bold text-2xl sm:text-3xl text-[#181C1C]">
                Upgrade Successful!
              </h2>
              <p className="font-sans text-sm text-[#44474F] max-w-md mx-auto">
                Your company account has been upgraded to <strong className="text-[#181C1C]">{planName}</strong>. You now have full access to digital manifests, route optimization, and ESG compliance reports.
              </p>
            </div>

            <div className="p-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded-xl text-left space-y-2 font-mono text-xs max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-[#44474F]">TRANSACTION ID:</span>
                <span className="font-bold text-[#181C1C]">TXN-ECOLINK-88902</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">AMOUNT PAID:</span>
                <span className="font-bold text-[#006A6A]">{grandTotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">NEXT RENEWAL:</span>
                <span className="font-medium text-[#181C1C]">Sept 2, 2026</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onBack}
                className="px-8 py-3 bg-[#000A1F] text-white rounded-lg font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Grid (2 Columns on Large Screens) */
          <form onSubmit={handleUpgradeNow} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column (2/3): Subscription Summary & Features */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Card */}
              <div className="bg-white border border-[#C4C6D0] rounded-xl p-6 space-y-4 shadow-2xs">
                <h3 className="font-headline font-bold text-lg text-[#181C1C] pb-3 border-b border-[#C4C6D0]">
                  Subscription Summary
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                  <div>
                    <p className="font-mono text-[10px] text-[#44474F] uppercase tracking-wider font-semibold">SELECTED PLAN</p>
                    <p className="font-sans font-bold text-sm text-[#181C1C] mt-1">{planName}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-[#44474F] uppercase tracking-wider font-semibold">BILLING CYCLE</p>
                    <p className="font-sans font-bold text-sm text-[#181C1C] mt-1">Monthly</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-[#44474F] uppercase tracking-wider font-semibold">PRICE</p>
                    <p className="font-sans font-bold text-sm text-[#006A6A] mt-1">{price} / Mo</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-[#44474F] uppercase tracking-wider font-semibold">NEXT BILLING</p>
                    <p className="font-sans font-bold text-sm text-[#181C1C] mt-1">Sept 2, 2026</p>
                  </div>
                </div>
              </div>

              {/* Included Features List Card */}
              <div className="bg-white border border-[#C4C6D0] rounded-xl p-6 space-y-4 shadow-2xs">
                <h3 className="font-headline font-bold text-lg text-[#181C1C] pb-3 border-b border-[#C4C6D0]">
                  Included Features in {planName}
                </h3>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans text-[#44474F]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                    <span>Unlimited Waste Marketplace Listings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                    <span>EEAA Compliant Digital Waste Manifests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                    <span>Facility Environmental License Verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                    <span>GPS Telemetry &amp; Transport Route Optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                    <span>Sustainability &amp; Carbon Footprint Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                    <span>Automated Regulatory Compliance Exports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                    <span>Advanced Yield Analytics &amp; Weighbridge Logs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                    <span>24/7 Priority Field Dispatch Support</span>
                  </li>
                </ul>
              </div>

              {/* Back / Upgrade Actions */}
              <div className="flex items-center justify-between pt-2">
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="px-5 py-2.5 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-semibold text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                  >
                    Back to Plans
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-8 py-3.5 bg-[#000A1F] hover:bg-[#00204A] text-white rounded-lg font-mono text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 ml-auto"
                >
                  <Lock className="w-4 h-4 text-[#8CF3F3]" />
                  <span>{isProcessing ? 'Processing Upgrade...' : `Upgrade Now • ${grandTotal.toFixed(2)} EGP`}</span>
                </button>
              </div>
            </div>

            {/* Right Column (1/3): Company Info, Payment & Order Summary */}
            <div className="space-y-6">
              {/* Company Information Card */}
              <div className="bg-white border border-[#C4C6D0] rounded-xl p-5 space-y-3 shadow-2xs">
                <h3 className="font-headline font-bold text-base text-[#181C1C]">Company Information</h3>
                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-[#44474F]">Name</span>
                    <span className="font-semibold text-[#181C1C]">Green Recycling Ltd.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474F]">Industry</span>
                    <span className="font-medium text-[#181C1C]">Recycling &amp; Scrap</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474F]">Tax ID</span>
                    <span className="font-mono text-[#181C1C]">EG-893-019-442</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474F]">Email</span>
                    <span className="font-mono text-[#181C1C]">contact@greenrecycling.com</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white border border-[#C4C6D0] rounded-xl p-5 space-y-4 shadow-2xs">
                <h3 className="font-headline font-bold text-base text-[#181C1C]">Payment Method</h3>

                <div className="space-y-2">
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#006A6A] bg-[#8CF3F3]/10 text-[#007070] font-semibold'
                        : 'border-[#C4C6D0] text-[#181C1C]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-[#006A6A]"
                    />
                    <CreditCard className="w-4 h-4 text-[#006A6A]" />
                    <span className="text-xs">Credit / Debit Card</span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-[#006A6A] bg-[#8CF3F3]/10 text-[#007070] font-semibold'
                        : 'border-[#C4C6D0] text-[#181C1C]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="text-[#006A6A]"
                    />
                    <Building2 className="w-4 h-4 text-[#006A6A]" />
                    <span className="text-xs">Bank Transfer (CIB / NBE)</span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('vodafone')}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'vodafone'
                        ? 'border-[#006A6A] bg-[#8CF3F3]/10 text-[#007070] font-semibold'
                        : 'border-[#C4C6D0] text-[#181C1C]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'vodafone'}
                      onChange={() => setPaymentMethod('vodafone')}
                      className="text-[#006A6A]"
                    />
                    <Phone className="w-4 h-4 text-[#006A6A]" />
                    <span className="text-xs">Vodafone Cash Wallet</span>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-3 pt-2">
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Card Holder Name"
                      className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-xs font-sans text-[#181C1C]"
                      required
                    />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-xs font-mono text-[#181C1C]"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-xs font-mono text-[#181C1C]"
                        required
                      />
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="CVV"
                        className="p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-xs font-mono text-[#181C1C]"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary & Promo Code Card */}
              <div className="bg-white border border-[#C4C6D0] rounded-xl p-5 space-y-4 shadow-2xs">
                <h3 className="font-headline font-bold text-base text-[#181C1C]">Order Summary</h3>

                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-[#44474F]">{planName}</span>
                    <span className="font-mono text-[#181C1C]">{basePriceNum.toFixed(2)} EGP</span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-[#006A6A]">
                      <span>Promo Discount (ECO2026)</span>
                      <span className="font-mono font-bold">-200.00 EGP</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-[#44474F]">VAT (14%)</span>
                    <span className="font-mono text-[#181C1C]">{vatAmount.toFixed(2)} EGP</span>
                  </div>

                  <div className="flex justify-between border-t border-[#C4C6D0] pt-3 font-bold text-base">
                    <span>Total Due</span>
                    <span className="font-mono text-[#006A6A]">{grandTotal.toFixed(2)} EGP</span>
                  </div>
                </div>

                {/* Promo Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code (ECO2026)"
                    className="flex-1 p-2 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-xs font-mono uppercase text-[#181C1C]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-2 bg-[#E0E3E2] hover:bg-[#C4C6D0] text-[#181C1C] font-mono text-xs font-bold rounded cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <ul className="text-[11px] text-[#44474F] font-sans space-y-1 list-disc pl-4">
                <li>Cancel or downgrade subscription anytime in portal settings.</li>
                <li>Secure 256-bit encrypted SSL checkout.</li>
                <li>Automated tax VAT invoice issued instantly to email.</li>
              </ul>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
