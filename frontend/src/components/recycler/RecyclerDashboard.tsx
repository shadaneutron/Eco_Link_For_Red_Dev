import React, { useState, useEffect } from 'react';
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
import { RecyclerMarketplaceCatalog, MarketplaceItem } from './RecyclerMarketplaceCatalog';
import { RecyclerWasteDetail } from './RecyclerWasteDetail';

import { RecyclerPlaceBidPage } from './RecyclerPlaceBidPage';
import { TransactionEscrowPage } from '../common/TransactionEscrowPage';
import { RecyclerBidSubmittedPage } from './RecyclerBidSubmittedPage';
import { RecyclerMyBidsPage } from './RecyclerMyBidsPage';
import { RecyclerWonAuctionsPage } from './RecyclerWonAuctionsPage';
import { RecyclerShipmentsPage } from './RecyclerShipmentsPage';
import { RecyclerReportsAnalyticsPage } from './RecyclerReportsAnalyticsPage';
import { PortalSettingsPage } from '../settings/PortalSettingsPage';
import { listingsApi, auctionsApi, shipmentsApi, recommendationsApi } from '../../services/api';
import { RecommendationCard } from '../common/RecommendationCard';
import logoImg from '../../assets/logo.png';

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
    'dashboard' | 'marketplace' | 'myBids' | 'wonAuctions' | 'transactions' | 'shipments' | 'reports' | 'settings'
  >('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [mobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [marketplaceView, setMarketplaceView] = useState<'catalog' | 'detail' | 'placeBid' | 'submitted'>('catalog');
  const [selectedMarketplaceItem, setSelectedMarketplaceItem] = useState<MarketplaceItem | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [lastSubmittedBid, setLastSubmittedBid] = useState<string>('16,000');

  // Real backend data states
  const [listings, setListings] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        const [listingsRes, bidsRes, shipmentsRes, recsRes] = await Promise.all([
          listingsApi.getListings().catch(() => []),
          auctionsApi.getMyBids().catch(() => []),
          shipmentsApi.getShipments().catch(() => []),
          recommendationsApi.getRecommendations().catch(() => []),
        ]);
        setListings(Array.isArray(listingsRes) ? listingsRes : (listingsRes as any)?.results || []);
        setMyBids(Array.isArray(bidsRes) ? bidsRes : (bidsRes as any)?.results || []);
        setShipments(Array.isArray(shipmentsRes) ? shipmentsRes : (shipmentsRes as any)?.results || []);
        setRecommendations(Array.isArray(recsRes) ? recsRes : (recsRes as any)?.results || []);
      } catch (err) {
        console.error('Failed to fetch recycler dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenBidModal = (opp: any) => {
    setSelectedOpportunity(opp);
    setBidAmount('');
    setIsBidModalOpen(true);
  };

  const handlePlaceBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount) return;
    setIsBidModalOpen(false);
    showToast(`Bid of ${bidAmount} EGP submitted for ${selectedOpportunity?.title || selectedOpportunity?.listing_title}!`);
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
              <img src={logoImg} alt="Eco Link Logo" className="h-8 w-auto object-contain" />
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#8CF3F3] text-[#007070] font-semibold">
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
              onClick={() => setActiveTab('transactions')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors text-left cursor-pointer ${activeTab === 'transactions'
                  ? 'bg-[#00204A] text-[#7189B8] font-medium'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
                }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#006A6A]" />
              <span>Escrow Transactions</span>
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
            <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToHome}>
              <img src={logoImg} alt="Eco Link Logo" className="h-7 w-auto object-contain" />
            </div>
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
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">
                    {isLoading ? '...' : listings.length}
                  </p>
                </div>
                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-2">
                    Active Bids
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">
                    {isLoading ? '...' : myBids.filter((b: any) => b.status === 'pending' || b.status === 'active').length}
                  </p>
                </div>
                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-2">
                    Won Auctions
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">
                    {isLoading ? '...' : myBids.filter((b: any) => b.status === 'accepted' || b.status === 'won').length}
                  </p>
                </div>
                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-2">
                    Pending Shipments
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">
                    {isLoading ? '...' : shipments.filter((s: any) => s.status !== 'Confirmed').length}
                  </p>
                </div>
                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-2">
                    Completed Recycling Jobs
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">
                    {isLoading ? '...' : shipments.filter((s: any) => s.status === 'Confirmed').length}
                  </p>
                </div>
                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider mb-2">
                    Estimated Material Value
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">
                    {isLoading ? '...' : `${myBids.reduce((sum: number, b: any) => sum + (parseFloat(b.amount) || 0), 0).toLocaleString()} EGP`}
                  </p>
                </div>
              </section>

              {/* Main Split Section: Opportunities + Side Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recommended Opportunities (2 Columns on large) */}
                <section className="lg:col-span-2 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg overflow-hidden flex flex-col shadow-2xs">
                  <div className="p-4 border-b border-[#C4C6D0] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#006A6A]" />
                      <h2 className="font-sans font-semibold text-lg text-[#181C1C]">
                        Recommended For You
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('marketplace')}
                      className="font-mono text-xs text-[#006A6A] hover:underline cursor-pointer"
                    >
                      Browse All
                    </button>
                  </div>

                  <div className="p-4 space-y-4">
                    {isLoading ? (
                      <div className="py-8 text-center font-mono text-sm text-[#747780]">Loading personalized recommendations...</div>
                    ) : recommendations.length === 0 ? (
                      <div className="py-8 flex flex-col items-center text-center">
                        <p className="font-sans text-sm text-[#747780] mb-3">No strong recommendations yet.</p>
                        <button
                          onClick={() => setActiveTab('marketplace')}
                          className="bg-[#00204A] text-white px-4 py-2 rounded-lg font-mono text-sm hover:bg-[#003366] transition-colors"
                        >
                          Browse all opportunities
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.slice(0, 4).map((rec: any, idx) => (
                          <RecommendationCard 
                            key={rec.listing?.id || idx} 
                            recommendation={rec}
                            onViewOpportunity={(listing) => {
                              setSelectedMarketplaceItem(listing);
                              setSelectedRecommendation(rec);
                              setMarketplaceView('detail');
                              setActiveTab('marketplace');
                            }}
                          />
                        ))}
                      </div>
                    )}
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
                      {shipments.slice(0, 3).map((s: any) => (
                        <li key={s.id} className="flex items-center justify-between pb-2 border-b border-[#C4C6D0]/60">
                          <span className="font-sans text-[#181C1C] truncate max-w-[170px]">{s.listing_title || 'Shipment'} ({s.status})</span>
                          <span className="font-mono text-xs text-[#44474F]">
                            {s.created_at ? new Date(s.created_at).toLocaleDateString() : 'Recent'}
                          </span>
                        </li>
                      ))}
                      {shipments.length === 0 && (
                        <li className="font-mono text-xs text-[#747780]">No recent activities logged yet.</li>
                      )}
                    </ul>
                  </section>

                  {/* Upcoming Pickups Card */}
                  <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-sans font-semibold text-lg text-[#181C1C]">
                        Upcoming Pickups
                      </h2>
                      <button
                        onClick={() => setActiveTab('shipments')}
                        className="font-mono text-xs text-[#006A6A] hover:underline cursor-pointer"
                      >
                        All Shipments
                      </button>
                    </div>
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
                          {isLoading ? (
                            <tr>
                              <td colSpan={3} className="p-4 text-center font-mono text-xs text-[#747780]">
                                Loading pickups...
                              </td>
                            </tr>
                          ) : shipments.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="p-4 text-center font-mono text-xs text-[#747780]">
                                No active pickups scheduled.
                              </td>
                            </tr>
                          ) : (
                            shipments.slice(0, 4).map((s: any) => (
                              <tr key={s.id} className="hover:bg-white/60">
                                <td className="p-2 font-medium truncate max-w-[100px]">
                                  {s.listing_title || 'Waste Package'}
                                </td>
                                <td className="p-2 font-mono text-xs">
                                  {s.pickup_date ? new Date(s.pickup_date).toLocaleDateString() : 'Scheduled'}
                                </td>
                                <td className="p-2">
                                  <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    s.status === 'Confirmed' ? 'bg-[#80F9CA] text-[#00513B]' :
                                    s.status === 'In Transit' ? 'bg-[#8CF3F3] text-[#007070]' :
                                    'bg-[#F1F4F3] text-[#44474F]'
                                  }`}>
                                    {s.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
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
                item={selectedMarketplaceItem}
                recommendation={selectedRecommendation}
                onBack={() => {
                  setMarketplaceView('catalog');
                  setSelectedRecommendation(null);
                }}
                onOpenPlaceBidPage={() => setMarketplaceView('placeBid')}
              />
            ) : marketplaceView === 'placeBid' ? (
              <RecyclerPlaceBidPage
                item={selectedMarketplaceItem}
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
                onViewDetails={(item) => {
                  setSelectedMarketplaceItem(item);
                  setSelectedRecommendation(null);
                  setMarketplaceView('detail');
                }}
                onPlaceBid={(item) => {
                  setSelectedMarketplaceItem(item);
                  setMarketplaceView('placeBid');
                }}
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
                setSelectedRecommendation(null);
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
          ) : activeTab === 'transactions' ? (
            <TransactionEscrowPage onBack={() => setActiveTab('dashboard')} />
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
