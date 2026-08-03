import React, { useState } from 'react';
import { Factory, RefreshCw, Truck, CheckCircle, ArrowRight } from 'lucide-react';
import { RoleType, StakeholderRole } from '../types';

interface StakeholdersSectionProps {
  onSelectRole: (role: RoleType) => void;
}

export const STAKEHOLDER_ROLES: StakeholderRole[] = [
  {
    id: 'factory',
    title: 'Factory',
    description: 'Sell industrial waste, improve resource recovery, and automate legal compliance effortlessly.',
    iconName: 'Factory',
    features: ['Inventory Management', 'Auction Oversight'],
    ctaText: 'Onboard as Generator',
    accentColor: '#000A1F',
    stats: [
      { label: 'Avg Waste Revenue Boost', value: '+38%' },
      { label: 'Manifest Generation Speed', value: 'Instant' },
    ],
  },
  {
    id: 'recycler',
    title: 'Recycler',
    description: 'Access a premium supply of recyclable materials through smart auctions and direct procurement.',
    iconName: 'RefreshCw',
    features: ['Quality Verification', 'Sourcing Analytics'],
    ctaText: 'Onboard as Processor',
    accentColor: '#006A6A',
    stats: [
      { label: 'Sourcing Material Purity', value: '99.2%' },
      { label: 'Monthly Bidding Opportunities', value: '2,400+' },
    ],
  },
  {
    id: 'logistics',
    title: 'Logistics',
    description: 'Manage specialized transportation fleets and provide real-time shipment tracking across the nation.',
    iconName: 'Truck',
    features: ['Route Optimization', 'Manifest Handling'],
    ctaText: 'Onboard as Transporter',
    accentColor: '#000A1F',
    stats: [
      { label: 'Fleet Utilization Rate', value: '92%' },
      { label: 'GPS Geofenced Compliance', value: '100%' },
    ],
  },
];

export const StakeholdersSection: React.FC<StakeholdersSectionProps> = ({ onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState<RoleType>('factory');

  const renderIcon = (name: string, isRecycler: boolean) => {
    const iconClass = isRecycler ? 'text-[#006A6A]' : 'text-[#000A1F]';
    switch (name) {
      case 'Factory':
        return <Factory className={`w-8 h-8 ${iconClass}`} />;
      case 'RefreshCw':
        return <RefreshCw className={`w-8 h-8 ${iconClass}`} />;
      case 'Truck':
        return <Truck className={`w-8 h-8 ${iconClass}`} />;
      default:
        return <Factory className={`w-8 h-8 ${iconClass}`} />;
    }
  };

  return (
    <section className="space-y-8 max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="font-headline font-semibold text-3xl sm:text-[32px] text-[#000A1F]">
          Stakeholder Ecosystem
        </h2>
        <p className="font-body text-[#44474F] text-base max-w-xl mx-auto">
          Tailored interfaces and automated tools designed for every player in the industrial value chain.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {STAKEHOLDER_ROLES.map((role) => {
          const isRecycler = role.id === 'recycler';
          const isSelected = selectedRole === role.id;

          return (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`group bg-[#F7FAF9] border p-8 rounded-2xl flex flex-col justify-between gap-6 transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-md ${
                isSelected
                  ? 'border-[#006A6A] ring-2 ring-[#006A6A]/20 bg-white'
                  : 'border-[#C4C6D0] hover:border-[#006A6A]'
              }`}
            >
              <div className="space-y-5">
                {/* Icon Box */}
                <div className="w-14 h-14 rounded-xl bg-[#EBEEED] flex items-center justify-center group-hover:bg-[#8CF3F3]/50 transition-colors shadow-2xs">
                  {renderIcon(role.iconName, isRecycler)}
                </div>

                {/* Heading & Subtitle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline font-semibold text-2xl text-[#000A1F]">
                      {role.title}
                    </h3>
                    <span className="text-xs font-mono text-[#006A6A] uppercase px-2 py-0.5 rounded bg-[#EBEEED]">
                      {role.id}
                    </span>
                  </div>
                  <p className="font-body text-[#44474F] text-base leading-relaxed">
                    {role.description}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 pt-2 border-t border-[#EBEEED]">
                  {role.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm font-body text-[#181C1C]">
                      <CheckCircle className="w-4 h-4 text-[#006A6A] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Stat & Action */}
              <div className="pt-4 border-t border-[#EBEEED] space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#F1F4F3] p-2.5 rounded-lg">
                  {role.stats.map((s, idx) => (
                    <div key={idx}>
                      <span className="text-[#747780] block text-[10px]">{s.label}</span>
                      <span className="font-semibold text-[#000A1F] text-sm">{s.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRole(role.id);
                  }}
                  className="w-full bg-[#000A1F] hover:bg-[#00204A] text-white py-3 px-4 rounded-xl font-mono text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs group-hover:bg-[#006A6A]"
                >
                  <span>{role.ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-[#8CF3F3]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
