import React, { useState } from 'react';
import {
  Check,
  Zap,
  ShieldCheck,
  Building2,
  Sparkles,
  HelpCircle,
  Search,
  Bell,
  ArrowRight,
  Globe,
  PlusCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Headphones
} from 'lucide-react';
import { UpgradeCheckoutPage } from './UpgradeCheckoutPage';

export interface SubscriptionPlansPageProps {
  onSelectPlan?: (planName: string) => void;
  onBackToDashboard?: () => void;
  currentPlan?: string;
}

interface ServiceAddon {
  id: string;
  name: string;
  price: string;
  cycle: string;
  description: string;
  added: boolean;
}

export const SubscriptionPlansPage: React.FC<SubscriptionPlansPageProps> = ({
  onSelectPlan,
  onBackToDashboard,
  currentPlan = 'Starter'
}) => {
  const [viewState, setViewState] = useState<'plans' | 'checkout'>('plans');
  const [checkoutPlan, setCheckoutPlan] = useState<string>('Professional Plan');
  const [checkoutPrice, setCheckoutPrice] = useState<string>('1,499 EGP');

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Add-ons State
  const [addons, setAddons] = useState<ServiceAddon[]>([
    {
      id: 'addon-1',
      name: 'Industry Reports',
      price: '5,000 EGP',
      cycle: 'One-time',
      description: 'Comprehensive quarterly industrial waste market benchmark report.',
      added: false
    },
    {
      id: 'addon-2',
      name: 'Live Data API',
      price: '3,000 EGP',
      cycle: '/ Month',
      description: 'REST & Webhook endpoints for real-time scale telemetry integration.',
      added: false
    },
    {
      id: 'addon-3',
      name: 'Carbon Credit Services',
      price: 'Custom',
      cycle: 'Per Audit',
      description: 'Verification & tokenization of CO2 displacement certificate.',
      added: false
    },
    {
      id: 'addon-4',
      name: 'Government Analytics',
      price: 'Custom',
      cycle: 'Annual',
      description: 'Direct EEAA compliance data pipe & regulatory export suite.',
      added: false
    }
  ]);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 3500);
  };

  const handleToggleAddon = (id: string, name: string) => {
    setAddons((prev) =>
      prev.map((addon) => {
        if (addon.id === id) {
          const nextState = !addon.added;
          showToast(nextState ? `Added ${name} to plan` : `Removed ${name}`);
          return { ...addon, added: nextState };
        }
        return addon;
      })
    );
  };

  const handlePlanAction = (planName: string, priceStr: string = '1,499 EGP') => {
    setSelectedPlan(planName);
    setCheckoutPlan(planName);
    setCheckoutPrice(priceStr);

    if (onSelectPlan) {
      onSelectPlan(planName);
    }

    if (planName === 'Professional' || planName === 'Professional Plan' || planName === 'Enterprise ESG') {
      setViewState('checkout');
    } else {
      showToast(`Subscribed to ${planName} plan!`);
    }
  };

  if (viewState === 'checkout') {
    return (
      <UpgradeCheckoutPage
        planName={checkoutPlan}
        price={checkoutPrice}
        onBack={() => setViewState('plans')}
        onSuccess={() => {
          showToast(`Successfully upgraded to ${checkoutPlan}!`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#181C1C] flex flex-col font-sans">
      {/* Top Header Bar (No Sidebar) */}
      <header className="h-16 bg-[#F7FAF9] border-b border-[#C4C6D0] flex justify-between items-center px-6 lg:px-10 sticky top-0 z-30 w-full backdrop-blur-md bg-[#F7FAF9]/95">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-headline font-bold text-xl text-[#000A1F] tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-[#000A1F] flex items-center justify-center text-[#8CF3F3] shadow-xs">
              <Zap className="w-4 h-4 fill-[#006A6A] text-[#006A6A]" />
            </div>
            <span>EcoLink</span>
            <span className="text-[10px] font-mono text-[#006A6A] bg-[#8CF3F3]/50 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
              PRICING &amp; PLANS
            </span>
          </div>
        </div>

        {/* Header Search & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-64 lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#44474F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features, limits..."
              className="w-full h-9 pl-9 pr-3 py-1 bg-[#F1F4F3] border border-[#C4C6D0] rounded font-sans text-xs text-[#181C1C] placeholder-[#44474F] focus:border-[#006A6A] focus:outline-hidden"
            />
          </div>

          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="px-3.5 py-1.5 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-semibold text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
            >
              Back to Workspace
            </button>
          )}
        </div>
      </header>

      {/* Main Container - Full Width Standalone Layout (No Sidebar) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-12">
        {/* Toast Notification */}
        {notificationToast && (
          <div className="fixed top-20 right-6 z-50 bg-[#000A1F] text-white px-5 py-3 rounded-xl shadow-lg border border-[#00204A] font-mono text-xs flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-[#8CF3F3]" />
            <span>{notificationToast}</span>
          </div>
        )}

        {/* Hero Banner Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8CF3F3]/60 text-[#007070] font-mono text-xs font-semibold uppercase tracking-wider rounded-full border border-[#007070]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT INDUSTRIAL PRICING</span>
          </div>

          <h1 className="font-headline font-bold text-3xl sm:text-4xl lg:text-5xl text-[#181C1C] tracking-tight">
            Subscription Plans
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#44474F] leading-relaxed">
            Choose the subscription plan that best fits your industrial waste, recycling, or transport business.
          </p>

          {/* Billing Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span
              className={`font-mono text-xs ${
                billingCycle === 'monthly' ? 'font-bold text-[#181C1C]' : 'text-[#44474F]'
              }`}
            >
              Monthly Billing
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 bg-[#000A1F] rounded-full p-1 transition-colors relative cursor-pointer"
            >
              <div
                className={`w-4 h-4 bg-[#8CF3F3] rounded-full transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-mono text-xs ${
                  billingCycle === 'annual' ? 'font-bold text-[#181C1C]' : 'text-[#44474F]'
                }`}
              >
                Annual Billing
              </span>
              <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] font-mono text-[10px] font-bold rounded uppercase">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Starter */}
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs hover:border-[#006A6A]/50 transition-all">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-headline font-bold text-2xl text-[#181C1C]">Starter</h3>
                <p className="font-sans text-xs text-[#44474F]">
                  Perfect for small factories and individual waste suppliers getting started.
                </p>
              </div>

              <div className="py-2 border-y border-[#C4C6D0]">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline font-bold text-3xl sm:text-4xl text-[#181C1C]">
                    0 EGP
                  </span>
                  <span className="font-sans text-xs text-[#44474F]">/ Month</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs font-sans text-[#44474F]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Marketplace Access</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Create Waste Listings</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Participate in Auctions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Secure Escrow Payments</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Basic Operations Dashboard</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#181C1C] font-medium">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Transaction Fee 7%</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePlanAction('Starter')}
              className={`w-full py-3 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
                selectedPlan === 'Starter'
                  ? 'bg-[#E6E9E8] text-[#006A6A] border border-[#006A6A]'
                  : 'bg-white border border-[#C4C6D0] text-[#181C1C] hover:bg-[#E6E9E8]'
              }`}
            >
              {selectedPlan === 'Starter' ? 'Current Active Plan' : 'Get Started Free'}
            </button>
          </div>

          {/* Card 2: Professional (Featured / Most Popular) */}
          <div className="bg-[#F7FAF9] border-2 border-[#006A6A] rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-md relative scale-102 z-10 bg-gradient-to-b from-white to-[#F7FAF9]">
            {/* Most Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#006A6A] text-white px-4 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#8CF3F3]" />
              <span>MOST POPULAR</span>
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <h3 className="font-headline font-bold text-2xl text-[#181C1C] flex items-center gap-2">
                  <span>Professional</span>
                  <span className="text-xs font-mono font-normal text-[#006A6A] bg-[#8CF3F3]/50 px-2 py-0.5 rounded">
                    PRO
                  </span>
                </h3>
                <p className="font-sans text-xs text-[#44474F]">
                  Designed for growing factories, recycling plants, and transport fleets.
                </p>
              </div>

              <div className="py-2 border-y border-[#C4C6D0]">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline font-bold text-3xl sm:text-4xl text-[#181C1C]">
                    {billingCycle === 'annual' ? '1,199 EGP' : '1,499 EGP'}
                  </span>
                  <span className="font-sans text-xs text-[#44474F]">/ Month</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="font-mono text-[10px] text-[#006A6A] mt-0.5">Billed annually (14,388 EGP/yr)</p>
                )}
              </div>

              <ul className="space-y-2.5 text-xs font-sans text-[#181C1C]">
                <li className="flex items-center gap-2.5 font-semibold text-[#006A6A]">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Everything in Starter, plus:</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Digital Waste Manifests (EEAA Compliant)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>License &amp; Permit Verification</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Route Optimization &amp; GPS Telemetry</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Sustainability &amp; ESG Dashboard</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Compliance Reports &amp; Exports</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Advanced Analytics &amp; Yield Tracking</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Priority Dispatch Support</span>
                </li>
                <li className="flex items-center gap-2.5 font-semibold text-[#006A6A]">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Reduced Transaction Fee: 5%</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePlanAction('Professional')}
              className="w-full py-3.5 bg-[#006A6A] hover:bg-[#004F4F] text-white rounded-lg font-mono text-xs font-semibold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{selectedPlan === 'Professional' ? 'Active Pro Subscription' : 'Upgrade to Professional'}</span>
              <ArrowRight className="w-4 h-4 text-[#8CF3F3]" />
            </button>
          </div>

          {/* Card 3: Enterprise ESG */}
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs hover:border-[#006A6A]/50 transition-all">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline font-bold text-2xl text-[#181C1C]">Enterprise ESG</h3>
                  <span className="bg-[#E0E3E2] text-[#181C1C] px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase">
                    CUSTOM
                  </span>
                </div>
                <p className="font-sans text-xs text-[#44474F]">
                  For multi-site industrial groups, enterprise conglomerates, and public agencies.
                </p>
              </div>

              <div className="py-2 border-y border-[#C4C6D0]">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline font-bold text-3xl sm:text-4xl text-[#181C1C]">
                    Contact Sales
                  </span>
                </div>
                <p className="font-mono text-[10px] text-[#44474F] mt-0.5">Tailored SLA &amp; dedicated volume pricing</p>
              </div>

              <ul className="space-y-2.5 text-xs font-sans text-[#44474F]">
                <li className="flex items-center gap-2.5 font-semibold text-[#181C1C]">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Everything in Professional, plus:</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Multi-Branch &amp; Facility Network Management</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Automated Corporate ESG Audit Reporting</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Carbon Footprint Real-Time Analytics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Carbon Credit Tokenization Integration</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Dedicated Key Account Manager</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>Custom REST API &amp; Webhooks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#006A6A] flex-shrink-0" />
                  <span>24/7 Enterprise SLA Support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePlanAction('Enterprise ESG')}
              className="w-full py-3 bg-white border border-[#C4C6D0] hover:bg-[#E6E9E8] text-[#181C1C] rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer"
            >
              Contact Enterprise Sales
            </button>
          </div>
        </div>

        {/* Additional Services Section (Add-ons) */}
        <div className="space-y-6 pt-4 border-t border-[#C4C6D0]">
          <div>
            <h2 className="font-headline font-bold text-2xl text-[#181C1C]">
              Additional Services &amp; Add-ons
            </h2>
            <p className="font-sans text-xs text-[#44474F] mt-1">
              Enhance your platform capabilities with modular data feeds, regulatory compliance tools, and reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className={`bg-[#F7FAF9] border rounded-xl p-5 space-y-3 flex flex-col justify-between transition-all ${
                  addon.added ? 'border-[#006A6A] bg-white shadow-xs' : 'border-[#C4C6D0]'
                }`}
              >
                <div className="space-y-1.5">
                  <p className="font-mono text-[10px] text-[#44474F] uppercase tracking-wider font-semibold">
                    MODULE ADD-ON
                  </p>
                  <h3 className="font-headline font-bold text-base text-[#181C1C]">{addon.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline font-bold text-xl text-[#181C1C]">{addon.price}</span>
                    <span className="font-mono text-[10px] text-[#44474F]">{addon.cycle}</span>
                  </div>
                  <p className="font-sans text-xs text-[#44474F] pt-1">{addon.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleAddon(addon.id, addon.name)}
                  className={`w-full py-2 rounded font-mono text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    addon.added
                      ? 'bg-[#8CF3F3] text-[#007070] font-semibold'
                      : 'bg-white border border-[#C4C6D0] text-[#006A6A] hover:bg-[#E6E9E8]'
                  }`}
                >
                  {addon.added ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to Plan</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add to Plan</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Plan Comparison Table */}
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-xl overflow-hidden space-y-0 shadow-2xs">
          <div className="p-6 bg-white border-b border-[#C4C6D0]">
            <h2 className="font-headline font-bold text-xl text-[#181C1C]">Detailed Feature Comparison</h2>
            <p className="font-sans text-xs text-[#44474F] mt-0.5">
              Compare all platform capabilities across Starter, Professional, and Enterprise plans.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#F1F4F3] text-[#44474F] font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">FEATURE CAPABILITY</th>
                  <th className="px-6 py-3.5 font-semibold text-center">STARTER</th>
                  <th className="px-6 py-3.5 font-semibold text-center text-[#006A6A]">PROFESSIONAL</th>
                  <th className="px-6 py-3.5 font-semibold text-center">ENTERPRISE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C4C6D0]">
                <tr className="hover:bg-white transition-colors">
                  <td className="px-6 py-3.5 font-medium text-[#181C1C]">Waste Marketplace &amp; Bidding</td>
                  <td className="px-6 py-3.5 text-center"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                  <td className="px-6 py-3.5 text-center bg-[#8CF3F3]/10"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                  <td className="px-6 py-3.5 text-center"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="px-6 py-3.5 font-medium text-[#181C1C]">Auction Participation &amp; Listings</td>
                  <td className="px-6 py-3.5 text-center"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                  <td className="px-6 py-3.5 text-center bg-[#8CF3F3]/10"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                  <td className="px-6 py-3.5 text-center"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="px-6 py-3.5 font-medium text-[#181C1C]">Regulatory Environmental Compliance</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[11px] text-[#44474F]">Basic</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[11px] font-semibold text-[#006A6A] bg-[#8CF3F3]/10">Advanced EEAA</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[11px] font-semibold text-[#181C1C]">Full Enterprise Suite</td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="px-6 py-3.5 font-medium text-[#181C1C]">ESG &amp; Carbon Offset Reports</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[11px] text-[#44474F]">—</td>
                  <td className="px-6 py-3.5 text-center bg-[#8CF3F3]/10"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                  <td className="px-6 py-3.5 text-center"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="px-6 py-3.5 font-medium text-[#181C1C]">Real-Time Carbon Footprint Analytics</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[11px] text-[#44474F]">—</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[11px] text-[#44474F] bg-[#8CF3F3]/10">—</td>
                  <td className="px-6 py-3.5 text-center"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="px-6 py-3.5 font-medium text-[#181C1C]">API &amp; Webhook Integration Access</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[11px] text-[#44474F]">—</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[11px] text-[#44474F] bg-[#8CF3F3]/10">—</td>
                  <td className="px-6 py-3.5 text-center"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="px-6 py-3.5 font-medium text-[#181C1C]">Multi-Branch Network Operations</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[11px] text-[#44474F]">—</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[11px] text-[#44474F] bg-[#8CF3F3]/10">—</td>
                  <td className="px-6 py-3.5 text-center"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="px-6 py-3.5 font-medium text-[#181C1C]">Priority Customer &amp; Field Dispatch Support</td>
                  <td className="px-6 py-3.5 text-center font-mono text-[11px] text-[#44474F]">—</td>
                  <td className="px-6 py-3.5 text-center bg-[#8CF3F3]/10"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                  <td className="px-6 py-3.5 text-center"><Check className="w-4 h-4 text-[#006A6A] mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-[#000A1F] text-white rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl border border-[#00204A]">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="font-headline font-bold text-2xl sm:text-3xl tracking-tight text-white">
              Need a Custom Solution for your Facility?
            </h2>
            <p className="font-sans text-sm text-[#7189B8] max-w-xl">
              Our engineering team integrates EcoLink with your existing SAP, Oracle, or weighbridge hardware.
            </p>
          </div>

          <button
            onClick={() => handlePlanAction('Professional')}
            className="px-8 py-4 bg-[#006A6A] hover:bg-[#004F4F] text-white font-mono text-sm font-semibold rounded-xl shadow-lg transition-all flex-shrink-0 cursor-pointer flex items-center gap-2 group"
          >
            <span>Upgrade to Professional</span>
            <ArrowRight className="w-4 h-4 text-[#8CF3F3] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>
    </div>
  );
};
