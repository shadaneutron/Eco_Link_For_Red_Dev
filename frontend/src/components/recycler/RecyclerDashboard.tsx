import React, { useState } from 'react';
import {
  LayoutDashboard,
  Store,
  Gavel,
  Trophy,
  Truck,
  BarChart3,
  Settings,
  Search,
  Bell,
  Menu,
  ChevronRight,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  DollarSign,
  ArrowLeft,
  X,
  ShieldCheck,
  Zap,
  Filter
} from 'lucide-react';
import { ShipmentTrackingPage } from '../factory/ShipmentTrackingPage';
import { ReportsAnalyticsPage } from '../factory/ReportsAnalyticsPage';
import { RecyclerMarketplaceCatalog } from './RecyclerMarketplaceCatalog';
import { RecyclerWasteDetail } from './RecyclerWasteDetail';
import { RecyclerPlaceBidPage } from './RecyclerPlaceBidPage';
import { RecyclerBidSubmittedPage } from './RecyclerBidSubmittedPage';
import { RecyclerMyBidsPage } from './RecyclerMyBidsPage';
import { RecyclerWonAuctionsPage } from './RecyclerWonAuctionsPage';
import { RecyclerShipmentsPage } from './RecyclerShipmentsPage';
import { RecyclerReportsAnalyticsPage } from './RecyclerReportsAnalyticsPage';
import { PortalSettingsPage } from '../settings/PortalSettingsPage';

interface RecyclerDashboardProps {
  onBackToHome: () => void;
  onOpenLogin?: () => void;
  onSwitchToFactory?: () => void;
  onSwitchToLogistics?: () => void;
  userName?: string;
  orgName?: string;
}

export const RecyclerDashboard: React.FC<RecyclerDashboardProps> = ({
  onBackToHome,
  onOpenLogin,
  onSwitchToFactory,
  onSwitchToLogistics,
  userName = 'EcoCycle',
  orgName = 'Green Recycling Ltd.'
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'marketplace' | 'myBids' | 'wonAuctions' | 'shipments' | 'reports' | 'settings'
  >('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [mobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [marketplaceView, setMarketplaceView] = useState<'catalog' | 'detail' | 'placeBid' | 'submitted'>('catalog');
  const [lastSubmittedBid, setLastSubmittedBid] = useState<string>('16,000');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const opportunities = [
    {
      id: 'OPP-101',
      title: 'Scrap Steel Bundles',
      aiGrade: 'AI: Grade A Steel',
      quantity: '50 Tons',
      location: 'Cairo Industrial Zone',
      startingPrice: '15,000 EGP/Ton',
      currentHighestBid: '16,200 EGP/Ton',
      endsIn: '4h 20m',
      category: 'Metals'
    },
    {
      id: 'OPP-102',
      title: 'Mixed Plastic Flakes',
      aiGrade: 'AI: PET/HDPE Mix',
      quantity: '12 Tons',
      location: 'Alexandria Port',
      startingPrice: '8,500 EGP/Ton',
      currentHighestBid: '9,100 EGP/Ton',
      endsIn: '1d 2h',
      category: 'Plastics'
    },
    {
      id: 'OPP-103',
      title: 'Industrial Copper Cables',
      aiGrade: 'AI: 99.2% Pure Copper',
      quantity: '8.5 Tons',
      location: '10th of Ramadan City',
      startingPrice: '280,000 EGP/Ton',
      currentHighestBid: '295,000 EGP/Ton',
      endsIn: '6h 45m',
      category: 'Metals'
    },
    {
      id: 'OPP-104',
      title: 'Corrugated Paper Bales',
      aiGrade: 'AI: High Density Pulp',
      quantity: '30 Tons',
      location: 'Giza Logistics Park',
      startingPrice: '4,200 EGP/Ton',
      currentHighestBid: '4,500 EGP/Ton',
      endsIn: '2d 8h',
      category: 'Paper'
    }
  ];

  const handleOpenBidModal = (opp: any) => {
    setSelectedOpportunity(opp);
    setBidAmount('');
    setIsBidModalOpen(true);
  };

  const handlePlaceBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount) return;
    setIsBidModalOpen(false);
    showToast(`Bid of ${bidAmount} EGP submitted for ${selectedOpportunity?.title}!`);
  };

  return (
    <div className="bg-[#F7FAF9] text-[#181C1C] font-sans min-h-screen flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#000A1F] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-[#8CF3F3]" />
          <span className="font-sans text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Persistent Left Sidebar */}
      <aside className="w-64 bg-[#F7FAF9] border-r border-[#C4C6D0] flex flex-col justify-between hidden md:flex sticky top-0 h-screen min-h-screen z-20 flex-shrink-0">
        <div>
          {/* Logo Bar */}
          <div className="h-16 flex items-center px-6 border-b border-[#C4C6D0] justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={onBackToHome}
            >
              <div className="w-8 h-8 rounded-lg bg-[#00204A] flex items-center justify-center text-[#8CF3F3]">
                <Zap className="w-4 h-4 text-[#8CF3F3]" />
              </div>
              <span className="font-headline font-bold text-lg text-[#181C1C] tracking-tight">
                Eco<span className="text-[#006A6A]">Link</span>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8CF3F3] text-[#007070] font-semibold">
              RECYCLER
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-4 space-y-2 font-mono text-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors text-left cursor-pointer ${activeTab === 'dashboard'
                  ? 'bg-[#00204A] text-[#7189B8] font-medium'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors text-left cursor-pointer ${activeTab === 'marketplace'
                  ? 'bg-[#00204A] text-[#7189B8] font-medium'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
                }`}
            >
              <Store className="w-4 h-4" />
              <span>Marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab('myBids')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors text-left cursor-pointer ${activeTab === 'myBids'
                  ? 'bg-[#00204A] text-[#7189B8] font-medium'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
                }`}
            >
              <Gavel className="w-4 h-4" />
              <span>My Bids</span>
            </button>

            <button
              onClick={() => setActiveTab('wonAuctions')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors text-left cursor-pointer ${activeTab === 'wonAuctions'
                  ? 'bg-[#00204A] text-[#7189B8] font-medium'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
                }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Won Auctions</span>
            </button>

            <button
              onClick={() => setActiveTab('shipments')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors text-left cursor-pointer ${activeTab === 'shipments'
                  ? 'bg-[#00204A] text-[#7189B8] font-medium'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
                }`}
            >
              <Truck className="w-4 h-4" />
              <span>Shipments</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors text-left cursor-pointer ${activeTab === 'reports'
                  ? 'bg-[#00204A] text-[#7189B8] font-medium'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
                }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors text-left cursor-pointer ${activeTab === 'settings'
                  ? 'bg-[#00204A] text-[#7189B8] font-medium'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
                }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile / Settings */}
        <div className="p-4 space-y-2 border-t border-[#C4C6D0]">

          <div className="flex items-center gap-3 px-3 py-2 border-t border-[#C4C6D0] pt-3">
            <div className="w-8 h-8 rounded-full bg-[#8CF3F3] text-[#007070] font-mono text-xs font-medium flex items-center justify-center">
              GR
            </div>
            <div className="overflow-hidden">
              <p className="font-mono text-xs text-[#181C1C] font-medium truncate">{orgName}</p>
              <p className="font-mono text-[10px] text-[#44474F] truncate">recycler@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#F7FAF9] border-b border-[#C4C6D0] flex justify-between items-center px-6 md:px-10 sticky top-0 z-10 w-full flex-shrink-0">
          <div className="flex items-center md:hidden gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#44474F] hover:text-[#181C1C]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-headline font-bold text-lg text-[#181C1C]">EcoLink</span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#44474F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search waste opportunities, bids, shipments..."
                className="w-full h-10 pl-9 pr-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm text-[#181C1C] placeholder-[#44474F] transition-all font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => showToast('No new unread notifications')}
              className="relative text-[#44474F] hover:text-[#181C1C] transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#BA1A1A] rounded-full" />
            </button>
            <button
              onClick={onBackToHome}
              className="font-mono text-xs text-[#006A6A] hover:underline hidden md:block cursor-pointer"
            >
              Exit to Home
            </button>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-[#F7FAF9]">
          {activeTab === 'dashboard' ? (
            <>
              {/* Greeting */}
              <section className="space-y-1">
                <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                  Recycler Dashboard
                </h1>
                <p className="font-sans text-base text-[#44474F]">
                  Discover industrial waste opportunities, manage bids, and monitor recycling operations.
                </p>
              </section>

              {/* 6 Overview Cards Grid */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-2">
                    Available Listings
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">245</p>
                </div>
                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-2">
                    Active Bids
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">18</p>
                </div>
                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-2">
                    Won Auctions
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">7</p>
                </div>
                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-2">
                    Pending Shipments
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">5</p>
                </div>
                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-2">
                    Completed Recycling Jobs
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">96</p>
                </div>
                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-2">
                    Estimated Material Value
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">2.4M EGP</p>
                </div>
              </section>

              {/* Main Split Section: Opportunities + Side Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Marketplace Opportunities (2 Columns on large) */}
                <section className="lg:col-span-2 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg overflow-hidden flex flex-col shadow-2xs">
                  <div className="p-4 border-b border-[#C4C6D0] flex justify-between items-center">
                    <h2 className="font-sans font-semibold text-lg text-[#181C1C]">
                      Recent Marketplace Opportunities
                    </h2>
                    <button
                      onClick={() => setActiveTab('marketplace')}
                      className="font-mono text-xs text-[#006A6A] hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="p-4 space-y-4">
                    {opportunities.slice(0, 2).map((opp) => (
                      <div
                        key={opp.id}
                        className="p-4 border border-[#C4C6D0] rounded-lg flex flex-col gap-3 bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                            {opp.title}
                          </h3>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium bg-[#80F9CA] text-[#00513B]">
                            {opp.aiGrade}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 font-sans text-sm text-[#44474F]">
                          <p>Quantity: <span className="font-medium text-[#181C1C]">{opp.quantity}</span></p>
                          <p>Location: <span className="font-medium text-[#181C1C]">{opp.location}</span></p>
                          <p>Starting Price: <span className="font-medium text-[#181C1C]">{opp.startingPrice}</span></p>
                          <p>Ends In: <span className="font-mono text-[#006A6A] font-medium">{opp.endsIn}</span></p>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => handleOpenBidModal(opp)}
                            className="flex-1 py-2 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenBidModal(opp)}
                            className="flex-1 py-2 bg-[#000A1F] text-white rounded font-mono text-xs hover:bg-[#00204A] transition-colors cursor-pointer text-center"
                          >
                            Place Bid
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Side Column: Recent Activity + Upcoming Pickups */}
                <div className="space-y-6 flex flex-col">
                  {/* Recent Activity Card */}
                  <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
                    <h2 className="font-sans font-semibold text-lg text-[#181C1C] mb-4">
                      Recent Activity
                    </h2>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center justify-between pb-2 border-b border-[#C4C6D0]/60">
                        <span className="font-sans text-[#181C1C]">Bid submitted</span>
                        <span className="font-mono text-xs text-[#44474F]">10m ago</span>
                      </li>
                      <li className="flex items-center justify-between pb-2 border-b border-[#C4C6D0]/60">
                        <span className="font-sans text-[#181C1C]">Auction won</span>
                        <span className="font-mono text-xs text-[#44474F]">2h ago</span>
                      </li>
                      <li className="flex items-center justify-between pb-2 border-b border-[#C4C6D0]/60">
                        <span className="font-sans text-[#181C1C]">Shipment scheduled</span>
                        <span className="font-mono text-xs text-[#44474F]">Yesterday</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="font-sans text-[#181C1C]">Payment received</span>
                        <span className="font-mono text-xs text-[#44474F]">Oct 22</span>
                      </li>
                    </ul>
                  </section>

                  {/* Upcoming Pickups Card */}
                  <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
                    <h2 className="font-sans font-semibold text-lg text-[#181C1C] mb-4">
                      Upcoming Pickups
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse font-sans text-xs">
                        <thead className="bg-[#F1F4F3] border-b border-[#C4C6D0]">
                          <tr className="text-[10px] font-mono uppercase tracking-wider text-[#44474F]">
                            <th className="p-2">Waste</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#C4C6D0] text-sm">
                          <tr className="hover:bg-white/60">
                            <td className="p-2 font-medium">Steel</td>
                            <td className="p-2 font-mono">Oct 28</td>
                            <td className="p-2">
                              <span className="text-[#006A6A] font-medium">Confirmed</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-white/60">
                            <td className="p-2 font-medium">Plastic</td>
                            <td className="p-2 font-mono">Oct 30</td>
                            <td className="p-2">
                              <span className="text-[#747780]">Pending</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              </div>
            </>
          ) : activeTab === 'marketplace' ? (
            /* Marketplace Views: Catalog / Detail / Place Bid Form / Bid Submitted Success */
            marketplaceView === 'detail' ? (
              <RecyclerWasteDetail
                onBack={() => setMarketplaceView('catalog')}
                onOpenPlaceBidPage={() => setMarketplaceView('placeBid')}
              />
            ) : marketplaceView === 'placeBid' ? (
              <RecyclerPlaceBidPage
                onBack={() => setMarketplaceView('detail')}
                onSubmitSuccess={(amount) => {
                  setLastSubmittedBid(Number(amount).toLocaleString());
                  setMarketplaceView('submitted');
                }}
              />
            ) : marketplaceView === 'submitted' ? (
              <RecyclerBidSubmittedPage
                bidAmount={lastSubmittedBid}
                onContinueBrowsing={() => setMarketplaceView('catalog')}
                onViewMyBids={() => {
                  setMarketplaceView('catalog');
                  setActiveTab('myBids');
                }}
                onGoToDashboard={() => {
                  setMarketplaceView('catalog');
                  setActiveTab('dashboard');
                }}
              />
            ) : (
              <RecyclerMarketplaceCatalog
                onViewDetails={() => setMarketplaceView('detail')}
                onPlaceBid={() => setMarketplaceView('placeBid')}
              />
            )
          ) : activeTab === 'myBids' ? (
            /* My Bids Tab */
            <RecyclerMyBidsPage
              onBrowseMarketplace={() => {
                setActiveTab('marketplace');
                setMarketplaceView('catalog');
              }}
              onViewWonAuctions={() => {
                setActiveTab('wonAuctions');
              }}
              onViewDetails={() => {
                setActiveTab('marketplace');
                setMarketplaceView('detail');
              }}
              onIncreaseBid={() => {
                setActiveTab('marketplace');
                setMarketplaceView('placeBid');
              }}
            />
          ) : activeTab === 'wonAuctions' ? (
            /* Won Auctions Tab */
            <RecyclerWonAuctionsPage
              onGoToMarketplace={() => {
                setActiveTab('marketplace');
                setMarketplaceView('catalog');
              }}
              onGoToShipments={() => {
                setActiveTab('shipments');
              }}
              onViewShipmentDetails={() => {
                setActiveTab('shipments');
              }}
            />
          ) : activeTab === 'shipments' ? (
            <RecyclerShipmentsPage
              onGoToWonAuctions={() => {
                setActiveTab('wonAuctions');
              }}
              onGoToReports={() => {
                setActiveTab('reports');
              }}
              onGoToDashboard={() => {
                setActiveTab('dashboard');
              }}
            />
          ) : activeTab === 'reports' ? (
            <RecyclerReportsAnalyticsPage onBack={() => setActiveTab('dashboard')} />
          ) : (
            <PortalSettingsPage
              portalType="recycler"
              userName={userName}
              orgName={orgName}
              onBackToDashboard={() => setActiveTab('dashboard')}
            />
          )}
        </div>
      </main>

      {/* Place Bid Modal Dialog */}
      {isBidModalOpen && selectedOpportunity && (
        <div className="fixed inset-0 z-50 bg-[#000A1F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#C4C6D0]">
              <h3 className="font-headline font-semibold text-xl text-[#181C1C]">Place Auction Bid</h3>
              <button
                onClick={() => setIsBidModalOpen(false)}
                className="text-[#44474F] hover:text-[#181C1C] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 font-sans text-sm text-[#44474F]">
              <p><strong className="text-[#181C1C]">Item:</strong> {selectedOpportunity.title}</p>
              <p><strong className="text-[#181C1C]">Quantity:</strong> {selectedOpportunity.quantity}</p>
              <p><strong className="text-[#181C1C]">Current Lead Bid:</strong> {selectedOpportunity.currentHighestBid}</p>
            </div>

            <form onSubmit={handlePlaceBidSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Your Bid Amount (EGP / Ton)
                </label>
                <input
                  type="text"
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="e.g. 16,800"
                  className="w-full h-10 px-3 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBidModalOpen(false)}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#E6E9E8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] cursor-pointer"
                >
                  Confirm &amp; Submit Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
