import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { UploadWastePage } from './UploadWastePage';
import { MarketplacePage } from './MarketplacePage';
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'marketplace' | 'shipments' | 'reports' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [activeUploadModal, setActiveUploadModal] = useState(false);

  // Waste records state
  const [wasteUploads, setWasteUploads] = useState<WasteUpload[]>([
    { id: '1', type: 'Scrap Metal (Steel)', quantity: '50 Tons', status: 'Active', date: 'Oct 24, 2023' },
    { id: '2', type: 'Chemical Solvents', quantity: '500 Liters', status: 'Pending Review', date: 'Oct 22, 2023' },
    { id: '3', type: 'Cardboard Packaging', quantity: '15 Tons', status: 'Draft', date: 'Oct 20, 2023' },
    { id: '4', type: 'Electronic Waste', quantity: '2 Tons', status: 'Active', date: 'Oct 18, 2023' },
  ]);

  // Form state for new upload
  const [newType, setNewType] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const handleAddWaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newType || !newQuantity) return;
    const item: WasteUpload = {
      id: Date.now().toString(),
      type: newType,
      quantity: newQuantity,
      status: 'Active',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setWasteUploads([item, ...wasteUploads]);
    setNewType('');
    setNewQuantity('');
    setActiveUploadModal(false);
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
              <div className="w-8 h-8 rounded-lg bg-[#00204A] flex items-center justify-center text-[#8CF3F3]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <span className="font-headline font-bold text-xl text-[#000A1F] tracking-tight">
                Eco<span className="text-[#006A6A]">Link</span>
              </span>
            </div>
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
              AH
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-medium text-[#181C1C] truncate">{userName} Factory</p>
              <p className="font-mono text-[10px] text-[#44474F] truncate">ahmed@example.com</p>
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
              <div className="w-7 h-7 rounded-lg bg-[#00204A] flex items-center justify-center text-[#8CF3F3]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <span className="font-headline font-bold text-lg text-[#000A1F]">EcoLink</span>
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
              onSubmitSuccess={(newBatch) => {
                const item: WasteUpload = {
                  id: Date.now().toString(),
                  type: newBatch.type,
                  quantity: newBatch.quantity,
                  status: 'Active',
                  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                };
                setWasteUploads([item, ...wasteUploads]);
                setActiveTab('dashboard');
              }}
            />
          ) : activeTab === 'marketplace' ? (
            <MarketplacePage onListNewBatch={() => setActiveTab('upload')} />
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
                    TOTAL WASTE (TONS)
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">1,245</p>
                </div>

                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between h-22">
                  <p className="font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-2">
                    ACTIVE LISTINGS
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">12</p>
                </div>

                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between h-22">
                  <p className="font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-2">
                    PENDING OFFERS
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">5</p>
                </div>

                <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between h-22">
                  <p className="font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-2">
                    COMPLETED TRANS.
                  </p>
                  <p className="font-headline font-semibold text-2xl text-[#181C1C]">48</p>
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
                          <span className="font-sans text-sm text-[#181C1C]">Pending</span>
                        </div>
                        <span className="font-mono font-semibold text-sm text-[#181C1C]">2</span>
                      </div>

                      <div className="flex items-center justify-between p-3 border-2 border-[#006A6A] rounded bg-[#F7FAF9]">
                        <div className="flex items-center gap-2.5">
                          <IconTruck className="w-5 h-5 text-[#006A6A]" />
                          <span className="font-sans font-medium text-sm text-[#181C1C]">In Transit</span>
                        </div>
                        <span className="font-mono font-semibold text-sm text-[#181C1C]">1</span>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-[#C4C6D0] rounded bg-[#F1F4F3]">
                        <div className="flex items-center gap-2.5">
                          <IconCheckCircle className="w-5 h-5 text-[#62DCAF]" />
                          <span className="font-sans text-sm text-[#181C1C]">Delivered</span>
                        </div>
                        <span className="font-mono font-semibold text-sm text-[#181C1C]">15</span>
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
