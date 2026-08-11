import React, { useState, useEffect } from 'react';
import {
  listingsApi,
  transactionsApi,
  shipmentsApi,
  WasteListingResponse,
  TransactionResponse,
  ShipmentResponse
} from '../../services/api';
import logoImg from '../../assets/logo.png';
import {
  LayoutDashboard as IconDashboard,
  Upload as IconUpload,
  Store as IconStore,
  Truck as IconTruck,
  BarChart3 as IconBarChart,
  Settings as IconSettings,
  Search as IconSearch,
  Bell as IconBell,
  PlusCircle as IconPlusCircle,
  Clock as IconClock,
  CheckCircle2 as IconCheckCircle,
  Mail as IconMail,
  Info as IconInfo,
  AlertTriangle as IconAlert,
  Menu as IconMenu,
  X as IconX,
  LogOut as IconLogOut,
  ArrowLeft as IconArrowLeft,
  ChevronRight,
  ShieldCheck as IconShieldCheck
} from 'lucide-react';
import { UploadWastePage } from './UploadWastePage';
import { MarketplacePage } from './MarketplacePage';
import { TransactionEscrowPage } from '../common/TransactionEscrowPage';
import { ShipmentTrackingPage } from './ShipmentTrackingPage';
import { ReportsAnalyticsPage } from './ReportsAnalyticsPage';
import { PortalSettingsPage } from '../settings/PortalSettingsPage';

interface FactoryDashboardProps {
  onBackToHome: () => void;
  onOpenLogin: () => void;
  onSwitchToRecycler?: () => void;
  onSwitchToLogistics?: () => void;
  userName?: string;
  orgName?: string;
}

interface WasteUpload {
  id: string;
  type: string;
  quantity: string;
  status: 'Active' | 'Pending Review' | 'Draft';
  date: string;
}

export const FactoryDashboard: React.FC<FactoryDashboardProps> = ({
  onBackToHome,
  onOpenLogin,
  onSwitchToRecycler,
  onSwitchToLogistics,
  userName = 'Ahmed',
  orgName = 'Industrial Hub'
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'marketplace' | 'transactions' | 'shipments' | 'reports' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [activeUploadModal, setActiveUploadModal] = useState(false);

  // Live state from backend
  const [apiListings, setApiListings] = useState<WasteListingResponse[]>([]);
  const [apiTransactions, setApiTransactions] = useState<TransactionResponse[]>([]);
  const [apiShipments, setApiShipments] = useState<ShipmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form state for new upload
  const [newType, setNewType] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [listingsData, txData, shipData] = await Promise.all([
        listingsApi.getListings().catch(() => []),
        transactionsApi.getTransactions().catch(() => []),
        shipmentsApi.getShipments().catch(() => [])
      ]);
      setApiListings(Array.isArray(listingsData) ? listingsData : (listingsData as any)?.results || []);
      setApiTransactions(Array.isArray(txData) ? txData : []);
      setApiShipments(Array.isArray(shipData) ? shipData : []);
    } catch (err) {
      console.error('Error loading factory dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const wasteUploads: WasteUpload[] = apiListings.map(l => ({
    id: String(l.id),
    type: l.title || l.material_type || 'Industrial Waste',
    quantity: `${l.quantity} ${l.unit || 'Tons'}`,
    status: l.status === 'published' || l.status === 'in_auction' ? 'Active' : l.status === 'draft' ? 'Draft' : 'Pending Review',
    date: l.created_at ? new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'
  }));

  const handleAddWaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newType || !newQuantity) return;
    setActiveUploadModal(false);
    setActiveTab('upload');
  };

  const filteredUploads = wasteUploads.filter(w =>
    w.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F7FAF9] text-[#181C1C] font-sans min-h-screen flex antialiased">
      {/* Persistent Left Sidebar */}
      <aside className="w-64 bg-[#F7FAF9] border-r border-[#C4C6D0] flex-col justify-between hidden md:flex sticky top-0 h-screen z-20 flex-shrink-0">
        <div>
          {/* Logo Bar */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-[#C4C6D0]">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToHome}>
              <img src={logoImg} alt="Eco Link Logo" className="h-8 w-auto object-contain" />
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#8CF3F3] text-[#007070] font-semibold">
              FACTORY
            </span>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 px-4 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded text-left font-mono text-sm transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#00204A] text-[#7189B8] font-semibold'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <IconDashboard className="w-4 h-4 text-[#7189B8]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded text-left font-mono text-sm transition-colors cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-[#00204A] text-[#7189B8] font-semibold'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <IconUpload className="w-4 h-4 text-[#44474F]" />
              <span>Upload Waste</span>
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded text-left font-mono text-sm transition-colors cursor-pointer ${
                activeTab === 'marketplace'
                  ? 'bg-[#00204A] text-[#7189B8] font-semibold'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <IconStore className="w-4 h-4 text-[#44474F]" />
              <span>Marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded text-left font-mono text-sm transition-colors cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-[#00204A] text-[#7189B8] font-semibold'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <IconShieldCheck className="w-4 h-4 text-[#006A6A]" />
              <span>Escrow Transactions</span>
            </button>

            <button
              onClick={() => setActiveTab('shipments')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded text-left font-mono text-sm transition-colors cursor-pointer ${
                activeTab === 'shipments'
                  ? 'bg-[#00204A] text-[#7189B8] font-semibold'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <IconTruck className="w-4 h-4 text-[#44474F]" />
              <span>Shipments</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded text-left font-mono text-sm transition-colors cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#00204A] text-[#7189B8] font-semibold'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <IconBarChart className="w-4 h-4 text-[#44474F]" />
              <span>Reports</span>
            </button>
          </nav>
        </div>

        {/* Footer Area of Sidebar */}
        <div className="p-4 space-y-2">

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-4 py-2 rounded text-left font-mono text-xs transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#00204A] text-[#7189B8] font-semibold'
                : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
            }`}
          >
            <IconSettings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <div className="flex items-center gap-3 px-4 py-2 border-t border-[#C4C6D0] pt-3">
            <div className="w-8 h-8 rounded-full bg-[#8CF3F3] flex items-center justify-center text-[#007070] font-mono font-medium text-xs flex-shrink-0">
              {(userName || 'U').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-medium text-[#181C1C] truncate">{orgName || 'Factory Portal'}</p>
              <p className="font-mono text-[10px] text-[#44474F] truncate">{userName} · Factory</p>
            </div>
            <button
              onClick={onOpenLogin}
              title="Sign Out"
              className="text-[#44474F] hover:text-[#BA1A1A] p-1 transition-colors cursor-pointer"
            >
              <IconLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#F7FAF9] border-b border-[#C4C6D0] flex justify-between items-center px-6 md:px-10 sticky top-0 z-10 w-full flex-shrink-0">
          <div className="flex items-center md:hidden gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#44474F] p-1"
            >
              {mobileMenuOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToHome}>
              <img src={logoImg} alt="Eco Link Logo" className="h-7 w-auto object-contain" />
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#44474F] w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, shipments..."
                className="w-full h-10 pl-10 pr-3 py-2 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm text-[#181C1C] placeholder-[#44474F] transition-all font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowNotificationToast(!showNotificationToast)}
              className="relative text-[#44474F] hover:text-[#181C1C] transition-colors cursor-pointer p-1"
            >
              <IconBell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#BA1A1A] rounded-full" />
            </button>
            <button
              onClick={onBackToHome}
              className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#006A6A] hover:underline cursor-pointer"
            >
              <IconArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </button>
          </div>
        </header>

        {/* Notifications Popover Toast */}
        {showNotificationToast && (
          <div className="absolute right-6 top-16 z-30 w-80 bg-white border border-[#C4C6D0] rounded-xl shadow-lg p-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-headline font-semibold text-sm text-[#000A1F]">Notifications</h4>
              <button onClick={() => setShowNotificationToast(false)} className="text-xs text-[#747780] hover:underline">Close</button>
            </div>
            <div className="space-y-2 text-xs font-sans">
              <div className="p-2 rounded bg-[#F1F4F3] border-l-2 border-[#006A6A]">
                <p className="font-semibold text-[#181C1C]">New offer received for Scrap Metal.</p>
                <span className="text-[10px] text-[#747780]">2 hours ago</span>
              </div>
              <div className="p-2 rounded bg-[#F1F4F3] border-l-2 border-[#747780]">
                <p className="font-semibold text-[#181C1C]">Shipment #4029 has been picked up.</p>
                <span className="text-[10px] text-[#747780]">Yesterday</span>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-[#F7FAF9]">
          {activeTab === 'upload' ? (
            <UploadWastePage
              onCancel={() => setActiveTab('dashboard')}
              onSubmitSuccess={() => {
                fetchDashboardData();
                setActiveTab('dashboard');
              }}
            />
          ) : activeTab === 'marketplace' ? (
            <MarketplacePage onListNewBatch={() => setActiveTab('upload')} />
          ) : activeTab === 'transactions' ? (
            <TransactionEscrowPage onBack={() => setActiveTab('dashboard')} />
          ) : activeTab === 'shipments' ? (
            <ShipmentTrackingPage onBack={() => setActiveTab('dashboard')} />
          ) : activeTab === 'reports' ? (
            <ReportsAnalyticsPage onBack={() => setActiveTab('dashboard')} />
          ) : activeTab === 'settings' ? (
            <PortalSettingsPage
              portalType="factory"
              userName={userName}
              orgName={orgName}
              onBackToDashboard={() => setActiveTab('dashboard')}
            />
          ) : (
            <>
              {/* Greeting Section */}
              <section>
                <h1 className="font-headline font-semibold text-3xl text-[#181C1C] mb-1">
                  Welcome back, {userName}
                </h1>
                <p className="font-sans text-base text-[#44474F]">
                  Manage your industrial waste efficiently.
                </p>
              </section>

              {/* Quick Actions Grid (4 Cards) */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <button
                  onClick={() => setActiveTab('upload')}
                  className="flex flex-col items-center justify-center p-6 bg-[#000A1F] text-white rounded-lg border border-[#000A1F] hover:bg-[#00204A] transition-colors shadow-sm group cursor-pointer min-h-[100px]"
                >
                  <IconPlusCircle className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-[#8CF3F3]" />
                  <span className="font-mono text-sm font-medium">Upload Waste</span>
                </button>

                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="flex flex-col items-center justify-center p-6 bg-[#F7FAF9] text-[#181C1C] rounded-lg border border-[#C4C6D0] hover:border-[#006A6A] transition-colors shadow-sm group cursor-pointer min-h-[98px]"
                >
                  <IconStore className="w-7 h-7 mb-2 text-[#006A6A] group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-sm font-medium">Marketplace</span>
                </button>

                <button
                  onClick={() => setActiveTab('shipments')}
                  className="flex flex-col items-center justify-center p-6 bg-[#F7FAF9] text-[#181C1C] rounded-lg border border-[#C4C6D0] hover:border-[#006A6A] transition-colors shadow-sm group cursor-pointer min-h-[95px]"
                >
                  <IconTruck className="w-7 h-7 mb-2 text-[#006A6A] group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-sm font-medium">Track Shipments</span>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className="flex flex-col items-center justify-center p-6 bg-[#F7FAF9] text-[#181C1C] rounded-lg border border-[#C4C6D0] hover:border-[#006A6A] transition-colors shadow-sm group cursor-pointer min-h-[95px]"
                >
                  <IconBarChart className="w-7 h-7 mb-2 text-[#006A6A] group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-sm font-medium">View Reports</span>
                </button>
              </section>

              {/* Overview Stat Cards (4 Cards) */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between h-22">
                  <p className="font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-2">
                    TOTAL LISTINGS
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">{apiListings.length}</p>
                </div>

                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between h-22">
                  <p className="font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-2">
                    ACTIVE LISTINGS
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">
                    {apiListings.filter(l => l.status === 'published' || l.status === 'in_auction').length}
                  </p>
                </div>

                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between h-22">
                  <p className="font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-2">
                    PENDING OFFERS
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">
                    {apiListings.reduce((acc, l) => acc + (l.bids_count || 0), 0)}
                  </p>
                </div>

                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between h-22">
                  <p className="font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-2">
                    COMPLETED TRANS.
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">
                    {apiTransactions.filter(t => t.status === 'released' || t.status === 'completed').length}
                  </p>
                </div>
              </section>

              {/* Main Bottom Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Recent Waste Uploads Table */}
                <section className="lg:col-span-2 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg overflow-hidden flex flex-col shadow-xs">
                  <div className="p-4 border-b border-[#C4C6D0] flex justify-between items-center bg-white">
                    <h2 className="font-sans font-semibold text-lg text-[#181C1C]">
                      Recent Waste Uploads
                    </h2>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="font-mono text-xs font-medium text-[#006A6A] hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    {filteredUploads.length === 0 ? (
                      <div className="p-8 text-center text-sm font-sans text-[#44474F]">
                        No recent waste listings available. Click "Upload Waste" to add your first waste batch.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#F1F4F3] border-b border-[#C4C6D0]">
                            <th className="p-4 font-mono text-xs font-medium text-[#44474F]">Waste Type</th>
                            <th className="p-4 font-mono text-xs font-medium text-[#44474F]">Quantity</th>
                            <th className="p-4 font-mono text-xs font-medium text-[#44474F]">Status</th>
                            <th className="p-4 font-mono text-xs font-medium text-[#44474F]">Created Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#C4C6D0] font-sans text-sm text-[#181C1C] bg-white">
                          {filteredUploads.map((item, idx) => (
                            <tr
                              key={item.id}
                              className={`hover:bg-[#F1F4F3] transition-colors ${
                                idx % 2 === 1 ? 'bg-[#F8FAFB]' : ''
                              }`}
                            >
                              <td className="p-4 font-medium text-[#181C1C]">{item.type}</td>
                              <td className="p-4 text-[#181C1C]">{item.quantity}</td>
                              <td className="p-4">
                                {item.status === 'Active' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#80F9CA] text-[#00513B]">
                                    Active
                                  </span>
                                )}
                                {item.status === 'Pending Review' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D7E2FF] text-[#2E4772]">
                                    Pending Review
                                  </span>
                                )}
                                {item.status === 'Draft' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E0E3E2] text-[#44474F]">
                                    Draft
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-[#44474F] font-mono text-xs">{item.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </section>

                {/* Right Column: Shipment Status & Notifications */}
                <div className="space-y-6 flex flex-col">
                  {/* Shipment Status */}
                  <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 flex-1 shadow-xs bg-white">
                    <h2 className="font-sans font-semibold text-lg text-[#181C1C] mb-4">
                      Shipment Status
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-[#C4C6D0] rounded bg-[#F1F4F3]">
                        <div className="flex items-center gap-2.5">
                          <IconClock className="w-5 h-5 text-[#747780]" />
                          <span className="font-sans text-sm text-[#181C1C]">Pending / Assigned</span>
                        </div>
                        <span className="font-mono font-semibold text-sm text-[#181C1C]">
                          {apiShipments.filter(s => s.status === 'pending' || s.status === 'assigned').length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 border-2 border-[#006A6A] rounded bg-[#F7FAF9]">
                        <div className="flex items-center gap-2.5">
                          <IconTruck className="w-5 h-5 text-[#006A6A]" />
                          <span className="font-sans font-medium text-sm text-[#181C1C]">In Transit</span>
                        </div>
                        <span className="font-mono font-semibold text-sm text-[#181C1C]">
                          {apiShipments.filter(s => s.status === 'picked_up' || s.status === 'in_transit').length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-[#C4C6D0] rounded bg-[#F1F4F3]">
                        <div className="flex items-center gap-2.5">
                          <IconCheckCircle className="w-5 h-5 text-[#62DCAF]" />
                          <span className="font-sans text-sm text-[#181C1C]">Delivered / Confirmed</span>
                        </div>
                        <span className="font-mono font-semibold text-sm text-[#181C1C]">
                          {apiShipments.filter(s => s.status === 'delivered' || s.status === 'confirmed').length}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('shipments')}
                      className="w-full mt-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#EBEEED] transition-colors cursor-pointer"
                    >
                      View All Shipments
                    </button>
                  </section>

                  {/* Recent Notifications */}
                  <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 flex-1 shadow-xs bg-white">
                    <h2 className="font-sans font-semibold text-lg text-[#181C1C] mb-4">
                      Recent Notifications
                    </h2>
                    <ul className="space-y-3 divide-y divide-[#C4C6D0]">
                      <li className="pt-2 flex items-start gap-3">
                        <IconMail className="w-4 h-4 text-[#006A6A] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-sans text-sm text-[#181C1C]">
                            New offer received for <span className="font-medium">Scrap Metal</span>.
                          </p>
                          <p className="font-mono text-[10px] text-[#44474F] mt-0.5">2 hours ago</p>
                        </div>
                      </li>

                      <li className="pt-3 flex items-start gap-3">
                        <IconInfo className="w-4 h-4 text-[#44474F] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-sans text-sm text-[#181C1C]">
                            Shipment #4029 has been picked up.
                          </p>
                          <p className="font-mono text-[10px] text-[#44474F] mt-0.5">Yesterday</p>
                        </div>
                      </li>

                      <li className="pt-3 flex items-start gap-3">
                        <IconAlert className="w-4 h-4 text-[#BA1A1A] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-sans text-sm text-[#181C1C]">
                            Action required on Draft Listing.
                          </p>
                          <p className="font-mono text-[10px] text-[#44474F] mt-0.5">Oct 20</p>
                        </div>
                      </li>
                    </ul>
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Upload Waste Modal Dialog */}
      {activeUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#C4C6D0] max-w-md w-full p-6 shadow-xl animate-scaleUp">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#C4C6D0]">
              <h3 className="font-headline font-semibold text-xl text-[#000A1F]">Upload Industrial Waste</h3>
              <button onClick={() => setActiveUploadModal(false)} className="text-[#44474F] hover:text-black">
                <IconX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddWaste} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Waste Material Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Recyclable Aluminum Shavings"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  required
                  className="w-full h-10 px-3 border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Quantity / Weight
                </label>
                <input
                  type="text"
                  placeholder="e.g. 35 Tons"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  required
                  className="w-full h-10 px-3 border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveUploadModal(false)}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs text-[#44474F] hover:bg-[#F1F4F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#000A1F] text-white rounded font-mono text-xs hover:bg-[#00204A]"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden flex">
          <div className="w-64 bg-[#F7FAF9] h-full p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#C4C6D0]">
                <span className="font-headline font-bold text-xl text-[#000A1F]">EcoLink</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <IconX className="w-6 h-6 text-[#44474F]" />
                </button>
              </div>
              <nav className="space-y-3 font-mono text-sm">
                <button
                  onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 bg-[#00204A] text-[#7189B8] rounded font-semibold"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { setActiveUploadModal(true); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-[#44474F] hover:bg-[#E6E9E8] rounded"
                >
                  Upload Waste
                </button>
                <button
                  onClick={() => { setActiveTab('marketplace'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-[#44474F] hover:bg-[#E6E9E8] rounded"
                >
                  Marketplace
                </button>
                <button
                  onClick={() => { setActiveTab('shipments'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-[#44474F] hover:bg-[#E6E9E8] rounded"
                >
                  Shipments
                </button>
                <button
                  onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-[#44474F] hover:bg-[#E6E9E8] rounded"
                >
                  Reports
                </button>
                <button
                  onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-[#44474F] hover:bg-[#E6E9E8] rounded font-semibold text-[#006A6A]"
                >
                  Settings
                </button>
              </nav>
            </div>
            <div>
              <button
                onClick={() => { onBackToHome(); setMobileMenuOpen(false); }}
                className="w-full text-center py-2 border border-[#C4C6D0] rounded font-mono text-xs text-[#006A6A]"
              >
                Back to Site
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </div>
  );
};
