import React, { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  CheckSquare,
  BarChart3,
  Settings,
  Search,
  Bell,
  Truck,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Navigation,
  ShieldCheck,
  Phone,
  Calendar,
  Filter,
  ArrowLeft,
  X,
  Plus,
  FileText,
  Upload,
  Camera,
  RotateCw,
  TrendingUp,
  SlidersHorizontal,
  LogOut,
  Building2,
  Menu
} from 'lucide-react';
import { PortalSettingsPage } from '../settings/PortalSettingsPage';

interface LogisticsDashboardProps {
  onBackToHome: () => void;
  onOpenLogin: () => void;
  onSwitchToFactory?: () => void;
  onSwitchToRecycler?: () => void;
  userName?: string;
  orgName?: string;
}

interface ShipmentAssignment {
  id: string;
  status: 'Ready for Pickup' | 'Assigned' | 'In Transit' | 'Completed' | 'Delayed';
  material: string;
  route: string;
  pickupTime: string;
  driver: string;
  vehicle: string;
  weight: string;
  contactPhone: string;
}

export const LogisticsDashboard: React.FC<LogisticsDashboardProps> = ({
  onBackToHome,
  onOpenLogin,
  onSwitchToFactory,
  onSwitchToRecycler,
  userName = 'Ahmed Transport',
  orgName = 'Sustainable Supply Logistics'
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'assigned' | 'tracking' | 'confirmation' | 'reports' | 'details' | 'pickup_success' | 'settings'
  >('dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showPodModal, setShowPodModal] = useState(false);
  const [driverNameInput, setDriverNameInput] = useState('John Doe');
  const [vehicleInput, setVehicleInput] = useState('TRK-442');

  // PoD state
  const [receivedByInput, setReceivedByInput] = useState('Mohamed Ali (Plant Mgr)');
  const [verifiedWeightInput, setVerifiedWeightInput] = useState('50.0 Tons');

  const [shipments, setShipments] = useState<ShipmentAssignment[]>([
    {
      id: 'SH-2026-014',
      status: 'Ready for Pickup',
      material: 'Steel Scrap Bundles',
      route: 'Ahmed Factory → Green Recycling',
      pickupTime: '09:00 AM',
      driver: 'John Doe',
      vehicle: 'TRK-442',
      weight: '50 Tons',
      contactPhone: '+20 100 234 5678'
    },
    {
      id: 'SH-2026-015',
      status: 'Assigned',
      material: 'Plastic Waste Flakes',
      route: 'Delta Factory → EcoPolymer Plant',
      pickupTime: '11:30 AM',
      driver: 'Sarah Smith',
      vehicle: 'TRK-109',
      weight: '35 Tons',
      contactPhone: '+20 111 876 5432'
    },
    {
      id: 'SH-2026-012',
      status: 'In Transit',
      material: 'Copper Cables',
      route: 'Nile Tech Corp → Metro Metal Recyclers',
      pickupTime: '08:15 AM',
      driver: 'Mike Ross',
      vehicle: 'TRK-204',
      weight: '12 Tons',
      contactPhone: '+20 122 345 6789'
    },
    {
      id: 'SH-2026-010',
      status: 'Delayed',
      material: 'Aluminum Turnings',
      route: 'Alexandria Heavy Ind. → Delta Metal Smelting',
      pickupTime: '07:00 AM',
      driver: 'Tarek Hassan',
      vehicle: 'TRK-301',
      weight: '28 Tons',
      contactPhone: '+20 105 678 1234'
    }
  ]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartPickup = (id: string) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'In Transit' } : s))
    );
    showNotification(`Shipment ${id} marked as In Transit. GPS tracking active!`);
  };

  const handleUpdateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipmentId) return;
    setShipments((prev) =>
      prev.map((s) =>
        s.id === selectedShipmentId
          ? { ...s, driver: driverNameInput, vehicle: vehicleInput, status: 'Assigned' }
          : s
      )
    );
    setShowDriverModal(false);
    showNotification(`Assigned driver ${driverNameInput} (${vehicleInput}) to ${selectedShipmentId}`);
  };

  const handleConfirmDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipmentId) return;
    setShipments((prev) =>
      prev.map((s) =>
        s.id === selectedShipmentId ? { ...s, status: 'Completed' } : s
      )
    );
    setShowPodModal(false);
    showNotification(`Delivery confirmed for ${selectedShipmentId}! e-PoD generated.`);
  };

  const filteredShipments = shipments.filter(
    (s) =>
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F7FAF9] text-[#181C1C] font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#000A1F] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-[#8CF3F3]" />
          <span className="font-sans text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Persistent Left Sidebar */}
      <aside className="w-64 bg-[#F7FAF9] border-r border-[#C4C6D0] flex flex-col justify-between hidden md:flex sticky top-0 h-screen flex-shrink-0">
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-[#C4C6D0]">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToHome}>
              <div className="w-8 h-8 rounded-xl bg-[#00204A] flex items-center justify-center text-[#8CF3F3]">
                <Truck className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-lg text-[#000A1F] leading-none">
                  Eco<span className="text-[#006A6A]">Link</span>
                </span>
                <span className="font-mono text-[9px] text-[#747780] tracking-wider uppercase mt-0.5">
                  Logistics Partner
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-4 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors text-left font-mono text-sm font-medium ${
                activeTab === 'dashboard'
                  ? 'bg-[#00204A] text-[#7189B8]'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('assigned')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors text-left font-mono text-sm font-medium ${
                activeTab === 'assigned'
                  ? 'bg-[#00204A] text-[#7189B8]'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Assigned Shipments</span>
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors text-left font-mono text-sm font-medium ${
                activeTab === 'tracking'
                  ? 'bg-[#00204A] text-[#7189B8]'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Shipment Tracking</span>
            </button>

            <button
              onClick={() => setActiveTab('confirmation')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors text-left font-mono text-sm font-medium ${
                activeTab === 'confirmation'
                  ? 'bg-[#00204A] text-[#7189B8]'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Delivery Confirmation</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors text-left font-mono text-sm font-medium ${
                activeTab === 'reports'
                  ? 'bg-[#00204A] text-[#7189B8]'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors text-left font-mono text-sm font-medium ${
                activeTab === 'settings'
                  ? 'bg-[#00204A] text-[#7189B8]'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile & Role Selector */}
        <div className="p-4 border-t border-[#C4C6D0]">
          {/* User Badge */}
          <div className="flex items-center gap-3 pt-2 border-t border-[#C4C6D0]">
            <div className="w-8 h-8 rounded-full bg-[#8CF3F3] flex items-center justify-center text-[#007070] font-mono text-xs font-semibold">
              AH
            </div>
            <div className="overflow-hidden">
              <p className="font-mono text-xs font-medium text-[#181C1C] truncate">Ahmed Factory</p>
              <p className="font-mono text-[10px] text-[#44474F] truncate">ahmed@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#F7FAF9] border-b border-[#C4C6D0] flex justify-between items-center px-10 sticky top-0 z-10 w-full flex-shrink-0">
          <div className="flex items-center md:hidden gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#44474F] hover:text-[#181C1C]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-headline font-bold text-lg text-[#000A1F]">
              Eco<span className="text-[#006A6A]">Link</span>
            </span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#44474F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, shipments..."
                className="w-full h-10 pl-10 pr-3 py-2 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C] placeholder-[#44474F] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => showNotification('Notifications caught up. 2 active shipments in transit.')}
              className="relative text-[#44474F] hover:text-[#181C1C] transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#BA1A1A] rounded-full" />
            </button>

            <button
              onClick={onBackToHome}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#E6E9E8]"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#006A6A]" />
              <span>Landing</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#C4C6D0] p-4 space-y-2 font-mono text-sm">
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left p-2 rounded hover:bg-[#F1F4F3]"
            >
              Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('assigned'); setMobileMenuOpen(false); }}
              className="w-full text-left p-2 rounded hover:bg-[#F1F4F3]"
            >
              Assigned Shipments
            </button>
            <button
              onClick={() => { setActiveTab('tracking'); setMobileMenuOpen(false); }}
              className="w-full text-left p-2 rounded hover:bg-[#F1F4F3]"
            >
              Shipment Tracking
            </button>
            <button
              onClick={() => { setActiveTab('confirmation'); setMobileMenuOpen(false); }}
              className="w-full text-left p-2 rounded hover:bg-[#F1F4F3]"
            >
              Delivery Confirmation
            </button>
            <button
              onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }}
              className="w-full text-left p-2 rounded hover:bg-[#F1F4F3]"
            >
              Reports
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
              className="w-full text-left p-2 rounded hover:bg-[#F1F4F3] font-semibold text-[#006A6A]"
            >
              Settings
            </button>
          </div>
        )}

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-[#F7FAF9]">
          {activeTab === 'dashboard' && (
            <>
              {/* Title Section */}
              <section className="space-y-1">
                <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                  Logistics Dashboard
                </h1>
                <p className="font-sans text-base text-[#44474F]">
                  Manage assigned shipments, monitor deliveries and coordinate transportation operations.
                </p>
              </section>

              {/* 6 KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    ASSIGNED SHIPMENTS
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">24</p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    TODAY'S PICKUPS
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">8</p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    IN TRANSIT
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">11</p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    COMPLETED DELIVERIES
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">132</p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    DELAYED SHIPMENTS
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#BA1A1A]">2</p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    FLEET UTILIZATION
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">89%</p>
                </div>
              </div>

              {/* Grid 3-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 columns: Shipment Assignments */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                    Shipment Assignments
                  </h3>

                  <div className="space-y-4">
                    {/* Card 1 */}
                    <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-semibold text-base text-[#181C1C]">
                            SH-2026-014
                          </span>
                          <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-[10px] font-medium rounded">
                            Ready for Pickup
                          </span>
                        </div>
                        <p className="font-sans text-sm text-[#44474F]">
                          Steel Scrap • Ahmed Factory → Green Recycling
                        </p>
                        <div className="flex flex-wrap gap-4 text-[10px] text-[#44474F] font-sans pt-1">
                          <p>
                            <span className="font-medium text-[#181C1C]">Pickup:</span> 09:00 AM
                          </p>
                          <p>
                            <span className="font-medium text-[#181C1C]">Driver:</span> John Doe
                          </p>
                          <p>
                            <span className="font-medium text-[#181C1C]">Vehicle:</span> TRK-442
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            setSelectedShipmentId('SH-2026-014');
                            setActiveTab('details');
                          }}
                          className="px-3.5 py-1.5 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                        >
                          View Shipment
                        </button>
                        <button
                          onClick={() => handleStartPickup('SH-2026-014')}
                          className="px-3.5 py-1.5 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors cursor-pointer"
                        >
                          Start Pickup
                        </button>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-semibold text-base text-[#181C1C]">
                            SH-2026-015
                          </span>
                          <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-[10px] font-medium rounded">
                            Assigned
                          </span>
                        </div>
                        <p className="font-sans text-sm text-[#44474F]">
                          Plastic Waste • Delta Factory → EcoPolymer
                        </p>
                        <div className="flex flex-wrap gap-4 text-[10px] text-[#44474F] font-sans pt-1">
                          <p>
                            <span className="font-medium text-[#181C1C]">Pickup:</span> 11:30 AM
                          </p>
                          <p>
                            <span className="font-medium text-[#181C1C]">Driver:</span> Sarah Smith
                          </p>
                          <p>
                            <span className="font-medium text-[#181C1C]">Vehicle:</span> TRK-109
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            setSelectedShipmentId('SH-2026-015');
                            setActiveTab('details');
                          }}
                          className="px-3.5 py-1.5 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                        >
                          View Shipment
                        </button>
                        <button
                          onClick={() => handleStartPickup('SH-2026-015')}
                          className="px-3.5 py-1.5 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors cursor-pointer"
                        >
                          Start Pickup
                        </button>
                      </div>
                    </div>

                    {/* Card 3 (In Transit) */}
                    <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-semibold text-base text-[#181C1C]">
                            SH-2026-012
                          </span>
                          <span className="px-2 py-0.5 bg-[#00204A] text-[#8CF3F3] font-sans text-[10px] font-medium rounded">
                            In Transit
                          </span>
                        </div>
                        <p className="font-sans text-sm text-[#44474F]">
                          Copper Cables • Nile Tech Corp → Metro Metal Recyclers
                        </p>
                        <div className="flex flex-wrap gap-4 text-[10px] text-[#44474F] font-sans pt-1">
                          <p>
                            <span className="font-medium text-[#181C1C]">Pickup:</span> 08:15 AM
                          </p>
                          <p>
                            <span className="font-medium text-[#181C1C]">Driver:</span> Mike Ross
                          </p>
                          <p>
                            <span className="font-medium text-[#181C1C]">Vehicle:</span> TRK-204
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            setSelectedShipmentId('SH-2026-012');
                            setActiveTab('confirmation');
                          }}
                          className="px-3.5 py-1.5 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                        >
                          Confirm Delivery
                        </button>
                        <button
                          onClick={() => {
                            setSelectedShipmentId('SH-2026-012');
                            setActiveTab('tracking');
                          }}
                          className="px-3.5 py-1.5 bg-[#006A6A] text-white rounded font-mono text-xs font-medium hover:bg-[#004F4F] transition-colors cursor-pointer"
                        >
                          Track Live
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 1 column: Today's Schedule & Recent Activity */}
                <div className="space-y-6">
                  {/* Today's Schedule Section */}
                  <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-4 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                      Today's Schedule
                    </h3>
                    <div className="space-y-4 font-sans">
                      <div className="flex gap-4">
                        <div className="font-mono text-xs font-medium text-[#006A6A] w-12 pt-0.5">
                          08:00
                        </div>
                        <div className="border-l-2 border-[#006A6A] pl-4 space-y-0.5">
                          <p className="font-sans font-semibold text-sm text-[#181C1C]">Pickup</p>
                          <p className="font-sans text-xs text-[#44474F]">Ahmed Factory</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="font-mono text-xs font-medium text-[#006A6A] w-12 pt-0.5">
                          11:30
                        </div>
                        <div className="border-l-2 border-[#006A6A] pl-4 space-y-0.5">
                          <p className="font-sans font-semibold text-sm text-[#181C1C]">Delivery</p>
                          <p className="font-sans text-xs text-[#44474F]">Green Recycling</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="font-mono text-xs font-medium text-[#006A6A] w-12 pt-0.5">
                          15:00
                        </div>
                        <div className="border-l-2 border-[#006A6A] pl-4 space-y-0.5">
                          <p className="font-sans font-semibold text-sm text-[#181C1C]">Pickup</p>
                          <p className="font-sans text-xs text-[#44474F]">Delta Factory</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="font-mono text-xs font-medium text-[#006A6A] w-12 pt-0.5">
                          17:30
                        </div>
                        <div className="border-l-2 border-[#006A6A] pl-4 space-y-0.5">
                          <p className="font-sans font-semibold text-sm text-[#181C1C]">Delivery</p>
                          <p className="font-sans text-xs text-[#44474F]">EcoPolymer Recycling</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Recent Activity Section */}
                  <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-4 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                      Recent Activity
                    </h3>
                    <div className="space-y-3 font-sans text-sm text-[#181C1C]">
                      <div className="flex items-start gap-2.5">
                        <User className="w-4 h-4 text-[#006A6A] flex-shrink-0 mt-0.5" />
                        <p>Driver Assigned to SH-2026-015</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#006A6A] flex-shrink-0 mt-0.5" />
                        <p>Pickup Confirmed: SH-2026-014</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Truck className="w-4 h-4 text-[#006A6A] flex-shrink-0 mt-0.5" />
                        <p>Delivery Completed: SH-2026-012</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-[#BA1A1A] flex-shrink-0 mt-0.5" />
                        <p>Shipment Delayed: SH-2026-010</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {/* Tab 2: Assigned Shipments Management View */}
          {activeTab === 'assigned' && (
            <div className="space-y-6">
              <section className="space-y-1">
                <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                  Assigned Shipments
                </h1>
                <p className="font-sans text-base text-[#44474F]">
                  View and manage all shipments currently assigned to your logistics company.
                </p>
              </section>

              {/* 5 KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    ASSIGNED TODAY
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">8</p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    READY FOR PICKUP
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">3</p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    IN TRANSIT
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">4</p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    DELAYED
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#BA1A1A]">1</p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    COMPLETED TODAY
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">12</p>
                </div>
              </div>

              {/* Search & Filter Control Bar */}
              <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <div className="relative min-w-[180px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#44474F]" />
                    <input
                      type="text"
                      placeholder="Search Shipment"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#C4C6D0] rounded font-sans text-xs text-[#181C1C] placeholder-[#44474F] focus:outline-none focus:border-[#006A6A]"
                    />
                  </div>

                  <select className="px-3 py-1.5 bg-white border border-[#C4C6D0] rounded font-sans text-xs text-[#44474F] focus:outline-none cursor-pointer">
                    <option value="">Shipment Status</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delayed">Delayed</option>
                  </select>

                  <select className="px-3 py-1.5 bg-white border border-[#C4C6D0] rounded font-sans text-xs text-[#44474F] focus:outline-none cursor-pointer">
                    <option value="">Pickup Location</option>
                    <option value="Ahmed Factory">Ahmed Factory</option>
                    <option value="Delta Factory">Delta Factory</option>
                  </select>

                  <select className="px-3 py-1.5 bg-white border border-[#C4C6D0] rounded font-sans text-xs text-[#44474F] focus:outline-none cursor-pointer">
                    <option value="">Destination</option>
                    <option value="Green Recycling Ltd.">Green Recycling Ltd.</option>
                    <option value="EcoPolymer">EcoPolymer</option>
                  </select>

                  <select className="px-3 py-1.5 bg-white border border-[#C4C6D0] rounded font-sans text-xs text-[#44474F] focus:outline-none cursor-pointer">
                    <option value="">Driver</option>
                    <option value="Mohamed Ali">Mohamed Ali</option>
                    <option value="Sarah Smith">Sarah Smith</option>
                  </select>

                  <select className="px-3 py-1.5 bg-white border border-[#C4C6D0] rounded font-sans text-xs text-[#44474F] focus:outline-none cursor-pointer">
                    <option value="">Pickup Date</option>
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                  </select>
                </div>

                <div className="font-sans text-xs text-[#44474F] font-medium pl-2">
                  Sort By: <span className="text-[#181C1C]">Newest</span>
                </div>
              </div>

              {/* Grid 3-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 columns: Shipment Cards */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Card 1 */}
                  <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-3 shadow-2xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-lg text-[#181C1C]">
                            SH-2026-014
                          </span>
                          <span className="px-2.5 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-xs font-semibold rounded">
                            Ready for Pickup
                          </span>
                        </div>
                        <p className="font-sans text-sm text-[#44474F]">
                          Steel Scrap Bundles • Ahmed Factory → Green Recycling Ltd.
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#44474F] font-sans pt-1">
                          <p><span className="font-medium text-[#181C1C]">Driver:</span> Mohamed Ali</p>
                          <p><span className="font-medium text-[#181C1C]">Vehicle:</span> TR-208</p>
                          <p><span className="font-medium text-[#181C1C]">Pickup:</span> Today 09:00 AM</p>
                        </div>
                        <p className="font-mono text-xs text-[#006A6A] font-medium pt-0.5">
                          ETA: 11:30 AM
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            setSelectedShipmentId('SH-2026-014');
                            setActiveTab('details');
                          }}
                          className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                        >
                          View Shipment
                        </button>
                        <button
                          onClick={() => {
                            handleStartPickup('SH-2026-014');
                            setActiveTab('pickup_success');
                          }}
                          className="px-4 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer"
                        >
                          Start Pickup
                        </button>
                      </div>
                    </div>
                    {/* Progress Bar Line */}
                    <div className="w-full bg-[#E6E9E8] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#8CF3F3] h-full w-[20%]" />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-3 shadow-2xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-lg text-[#181C1C]">
                            SH-2026-015
                          </span>
                          <span className="px-2.5 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-xs font-semibold rounded">
                            Assigned
                          </span>
                        </div>
                        <p className="font-sans text-sm text-[#44474F]">
                          Plastic Waste • Delta Factory → EcoPolymer
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#44474F] font-sans pt-1">
                          <p><span className="font-medium text-[#181C1C]">Driver:</span> Sarah Smith</p>
                          <p><span className="font-medium text-[#181C1C]">Vehicle:</span> TR-109</p>
                          <p><span className="font-medium text-[#181C1C]">Pickup:</span> Today 11:30 AM</p>
                        </div>
                        <p className="font-mono text-xs text-[#44474F] font-medium pt-0.5">
                          ETA: 02:00 PM
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            setSelectedShipmentId('SH-2026-015');
                            setActiveTab('details');
                          }}
                          className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                        >
                          View Shipment
                        </button>
                        <button
                          onClick={() => {
                            handleStartPickup('SH-2026-015');
                            setActiveTab('pickup_success');
                          }}
                          className="px-4 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer"
                        >
                          Start Pickup
                        </button>
                      </div>
                    </div>
                    {/* Progress Bar Line */}
                    <div className="w-full bg-[#E6E9E8] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#8CF3F3] h-full w-[0%]" />
                    </div>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex justify-center items-center gap-2 pt-3">
                    <button className="px-3.5 py-1.5 border border-[#C4C6D0] rounded font-sans text-xs font-medium text-[#44474F] hover:bg-[#E6E9E8] cursor-pointer">
                      Previous
                    </button>
                    <button className="px-3.5 py-1.5 bg-[#000A1F] text-white rounded font-sans text-xs font-semibold">
                      1
                    </button>
                    <button className="px-3.5 py-1.5 border border-[#C4C6D0] rounded font-sans text-xs font-medium text-[#44474F] hover:bg-[#E6E9E8] cursor-pointer">
                      2
                    </button>
                    <button className="px-3.5 py-1.5 border border-[#C4C6D0] rounded font-sans text-xs font-medium text-[#44474F] hover:bg-[#E6E9E8] cursor-pointer">
                      3
                    </button>
                    <button className="px-3.5 py-1.5 border border-[#C4C6D0] rounded font-sans text-xs font-medium text-[#44474F] hover:bg-[#E6E9E8] cursor-pointer">
                      Next
                    </button>
                  </div>
                </div>

                {/* Right 1 column: Today's Schedule & Driver Availability */}
                <div className="space-y-6">
                  {/* Today's Schedule Card */}
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                      Today's Schedule
                    </h3>
                    <div className="space-y-4 font-sans text-xs">
                      <div className="flex gap-4 items-start">
                        <span className="font-mono text-[#006A6A] font-medium w-12 pt-0.5">08:00</span>
                        <div className="border-l-2 border-[#006A6A] pl-3 space-y-0.5">
                          <p className="font-semibold text-sm text-[#181C1C]">Pickup</p>
                          <p className="text-[#44474F]">Ahmed Factory</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <span className="font-mono text-[#006A6A] font-medium w-12 pt-0.5">11:30</span>
                        <div className="border-l-2 border-[#006A6A] pl-3 space-y-0.5">
                          <p className="font-semibold text-sm text-[#181C1C]">Delivery</p>
                          <p className="text-[#44474F]">Green Recycling</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <span className="font-mono text-[#006A6A] font-medium w-12 pt-0.5">15:00</span>
                        <div className="border-l-2 border-[#006A6A] pl-3 space-y-0.5">
                          <p className="font-semibold text-sm text-[#181C1C]">Pickup</p>
                          <p className="text-[#44474F]">Delta Factory</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <span className="font-mono text-[#006A6A] font-medium w-12 pt-0.5">17:30</span>
                        <div className="border-l-2 border-[#006A6A] pl-3 space-y-0.5">
                          <p className="font-semibold text-sm text-[#181C1C]">Delivery</p>
                          <p className="text-[#44474F]">EcoPolymer</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Availability Card */}
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                      Driver Availability
                    </h3>
                    <div className="space-y-3 font-sans text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[#44474F]">Drivers Available</span>
                        <span className="font-mono font-bold text-[#006A6A] text-base">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#44474F]">On Route</span>
                        <span className="font-mono font-bold text-[#181C1C] text-base">5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#44474F]">Off Duty</span>
                        <span className="font-mono font-bold text-[#44474F] text-base">2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Shipment Details Review View */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <section className="space-y-1">
                <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                  Shipment Details
                </h1>
                <p className="font-sans text-base text-[#44474F]">
                  Review shipment information before starting the pickup.
                </p>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Shipment Information Card */}
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
                    <div className="flex justify-between items-start border-b border-[#C4C6D0] pb-3">
                      <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                        Shipment Information
                      </h3>
                      <span className="px-2.5 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-xs font-semibold rounded">
                        Ready for Pickup
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 font-sans text-sm">
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                          SHIPMENT ID
                        </p>
                        <p className="font-medium text-[#181C1C]">{selectedShipmentId || 'SH-2026-014'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                          WASTE TYPE
                        </p>
                        <p className="font-medium text-[#181C1C]">Steel Scrap Bundles</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                          CATEGORY
                        </p>
                        <p className="font-medium text-[#181C1C]">Ferrous Metal</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                          QUANTITY
                        </p>
                        <p className="font-medium text-[#181C1C]">50 Tons</p>
                      </div>
                    </div>
                  </div>

                  {/* Pickup Information Card */}
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C] border-b border-[#C4C6D0] pb-3">
                      Pickup Information
                    </h3>

                    <div className="space-y-4 font-sans text-sm">
                      <div className="flex gap-3">
                        <Building2 className="w-5 h-5 text-[#006A6A] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#181C1C]">Ahmed Factory</p>
                          <p className="text-xs text-[#44474F]">10th of Ramadan Industrial Zone, Plot 42</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <User className="w-5 h-5 text-[#006A6A] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#181C1C]">Ahmed Hassan (Dispatch Lead)</p>
                          <p className="text-xs text-[#44474F]">+20 100 234 5678</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Clock className="w-5 h-5 text-[#006A6A] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#181C1C]">Scheduled Pickup Window</p>
                          <p className="text-xs text-[#44474F]">Today - 09:00 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information Card */}
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C] border-b border-[#C4C6D0] pb-3">
                      Delivery Information
                    </h3>

                    <div className="space-y-4 font-sans text-sm">
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-[#006A6A] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#181C1C]">Green Recycling Ltd.</p>
                          <p className="text-xs text-[#44474F]">Sadat Industrial City, Sector 7</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <User className="w-5 h-5 text-[#006A6A] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#181C1C]">Omar Hassan (Receiving Mgr)</p>
                          <p className="text-xs text-[#44474F]">+20 122 987 6543</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Calendar className="w-5 h-5 text-[#006A6A] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#181C1C]">Expected Arrival</p>
                          <p className="text-xs text-[#44474F]">Today - 11:30 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 1 column */}
                <div className="space-y-6">
                  {/* Driver Information Card */}
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C] border-b border-[#C4C6D0] pb-2">
                      Driver Information
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#E6E9E8] flex items-center justify-center text-[#44474F]">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#181C1C]">Mohamed Ali</p>
                        <p className="font-mono text-xs text-[#44474F]">Truck TR-208 • ABC-1234</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Documents Card */}
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C] border-b border-[#C4C6D0] pb-2">
                      Shipment Documents
                    </h3>
                    <div className="space-y-3 font-sans text-xs">
                      {[
                        "Digital Waste Manifest",
                        "Transport Permit",
                        "Shipment Order",
                        "Compliance Certificate"
                      ].map((docName, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 border-b border-[#C4C6D0] last:border-0">
                          <span className="text-[#181C1C] font-medium">{docName}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => showNotification(`Viewing ${docName}...`)}
                              className="text-[#006A6A] font-mono text-[11px] font-semibold hover:underline"
                            >
                              View
                            </button>
                            <button
                              onClick={() => showNotification(`Downloading PDF for ${docName}...`)}
                              className="text-[#006A6A] font-mono text-[11px] font-semibold hover:underline"
                            >
                              PDF
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Handling Card */}
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-3 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C] border-b border-[#C4C6D0] pb-2">
                      Special Handling
                    </h3>
                    <ul className="space-y-2 text-xs text-[#44474F] font-sans list-disc pl-4">
                      <li>Keep material dry and protected from weather.</li>
                      <li>Secure load straps properly before departure.</li>
                      <li>Verify gross weighbridge receipt before leaving site.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Bar Footer */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#C4C6D0]">
                <button
                  onClick={() => setActiveTab('assigned')}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => showNotification('Calling Ahmed Factory Dispatch (+20 100 234 5678)...')}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors"
                >
                  Contact Factory
                </button>
                <button
                  onClick={() => {
                    handleStartPickup(selectedShipmentId || 'SH-2026-014');
                    setActiveTab('pickup_success');
                  }}
                  className="px-6 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors ml-auto cursor-pointer"
                >
                  Start Pickup
                </button>
              </div>
            </div>
          )}

          {/* Tab: Pickup Confirmation Success View */}
          {activeTab === 'pickup_success' && (
            <div className="space-y-6">
              <section className="space-y-1">
                <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                  Pickup Confirmation
                </h1>
                <p className="font-sans text-base text-[#44474F]">
                  Confirm that the shipment has been successfully collected from the factory.
                </p>
              </section>

              <div className="max-w-md mx-auto space-y-6 py-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#006A6A] flex items-center justify-center text-white">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
                      Pickup Confirmed
                    </h2>
                    <p className="font-sans text-sm text-[#44474F]">
                      The shipment has been successfully collected from the factory. The shipment is now ready for transportation to the recycling company.
                    </p>
                  </div>
                </div>

                {/* Pickup Summary Card */}
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-5 space-y-3 shadow-2xs">
                  <h3 className="font-sans font-semibold text-base text-[#181C1C] border-b border-[#C4C6D0] pb-2">
                    Pickup Summary
                  </h3>
                  <div className="space-y-2.5 font-sans text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">SHIPMENT ID</span>
                      <span className="font-semibold text-[#181C1C]">{selectedShipmentId || 'SH-2026-014'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">WASTE MATERIAL</span>
                      <span className="font-medium text-[#181C1C]">Steel Scrap Bundles</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">FACTORY</span>
                      <span className="font-medium text-[#181C1C]">Ahmed Factory</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">PICKUP TIME</span>
                      <span className="font-medium text-[#181C1C]">Today 09:05 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">DRIVER</span>
                      <span className="font-medium text-[#181C1C]">Mohamed Ali</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">VEHICLE</span>
                      <span className="font-medium text-[#181C1C]">Truck TR-208</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">CURRENT STATUS</span>
                      <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-[10px] font-semibold rounded">
                        Picked Up
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Checklist */}
                <div className="space-y-3 font-sans">
                  <h3 className="font-semibold text-base text-[#181C1C]">
                    Verification Checklist
                  </h3>
                  <ul className="space-y-2 text-xs text-[#181C1C]">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#006A6A]" />
                      <span>Shipment collected</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#006A6A]" />
                      <span>Waste quantity verified</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#006A6A]" />
                      <span>Digital Manifest signed</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#006A6A]" />
                      <span>Transport Permit verified</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#006A6A]" />
                      <span>Vehicle loaded successfully</span>
                    </li>
                  </ul>
                </div>

                {/* Status alert box */}
                <div className="p-3.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded-lg text-center font-sans text-xs text-[#44474F]">
                  The shipment status has been updated to <span className="font-semibold text-[#181C1C]">'In Transit'</span>.
                </div>
              </div>

              {/* Action Bar Footer */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#C4C6D0]">
                <button
                  onClick={() => setActiveTab('assigned')}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                >
                  Back to Shipments
                </button>
                <button
                  onClick={() => setActiveTab('tracking')}
                  className="px-6 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors ml-auto cursor-pointer"
                >
                  View Shipment Tracking
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Live Shipment Tracking View */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              <section className="space-y-1">
                <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                  Shipment Tracking
                </h1>
                <p className="font-sans text-base text-[#44474F]">
                  Monitor the shipment in real time until it reaches the recycling company.
                </p>
              </section>

              {/* Shipment Summary Card */}
              <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-4 shadow-2xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#C4C6D0]">
                  <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                    Shipment Summary
                  </h3>
                  <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] text-[10px] font-semibold rounded uppercase tracking-wider font-mono">
                    In Transit
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 font-sans">
                  <div className="space-y-1">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">SHIPMENT ID</p>
                    <p className="font-medium text-base text-[#181C1C]">{selectedShipmentId || 'SH-2026-014'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">WASTE MATERIAL</p>
                    <p className="font-medium text-base text-[#181C1C]">Steel Scrap Bundles</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">FACTORY</p>
                    <p className="font-medium text-base text-[#181C1C]">Ahmed Factory</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">DESTINATION</p>
                    <p className="font-medium text-base text-[#181C1C]">Green Recycling Ltd.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">DRIVER</p>
                    <p className="font-medium text-base text-[#181C1C]">Mohamed Ali</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">VEHICLE</p>
                    <p className="font-medium text-base text-[#181C1C]">Truck TR-208</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">ESTIMATED ARRIVAL</p>
                    <p className="font-medium text-base text-[#181C1C]">Today 11:30 AM</p>
                  </div>
                </div>
              </div>

              {/* Shipment Progress */}
              <div className="space-y-3 font-sans">
                <h3 className="font-semibold text-base text-[#181C1C]">
                  Shipment Progress
                </h3>

                <div className="relative flex items-center justify-between px-4 py-2">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-[#E0E3E2] -z-0 -translate-y-1/2" />

                  {/* Step 1 */}
                  <div className="relative z-10 flex flex-col items-center bg-[#F7FAF9] px-2 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#006A6A] text-white flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-[#181C1C]">Driver Assigned</span>
                  </div>

                  {/* Step 2 */}
                  <div className="relative z-10 flex flex-col items-center bg-[#F7FAF9] px-2 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#006A6A] text-white flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-[#181C1C]">Pickup Confirmed</span>
                  </div>

                  {/* Step 3 */}
                  <div className="relative z-10 flex flex-col items-center bg-[#F7FAF9] px-2 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#006A6A] text-white flex items-center justify-center p-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                    <span className="text-xs font-bold text-[#006A6A]">In Transit</span>
                  </div>

                  {/* Step 4 */}
                  <div className="relative z-10 flex flex-col items-center bg-[#F7FAF9] px-2 space-y-1">
                    <div className="w-6 h-6 rounded-full border-2 border-[#747780] bg-[#F7FAF9]" />
                    <span className="text-xs text-[#44474F]">Arrived at Recycler</span>
                  </div>

                  {/* Step 5 */}
                  <div className="relative z-10 flex flex-col items-center bg-[#F7FAF9] px-2 space-y-1">
                    <div className="w-6 h-6 rounded-full border-2 border-[#747780] bg-[#F7FAF9]" />
                    <span className="text-xs text-[#44474F]">Delivery Confirmed</span>
                  </div>
                </div>
              </div>

              {/* 2 Column Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Driver Information Card */}
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-3 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C] pb-2 border-b border-[#C4C6D0]">
                      Driver Information
                    </h3>
                    <div className="space-y-2 font-sans text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[#44474F]">Driver</span>
                        <span className="font-medium text-[#181C1C]">Mohamed Ali</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#44474F]">Phone</span>
                        <span className="font-medium text-[#181C1C]">+20 XXX XXX XXXX</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#44474F]">Vehicle</span>
                        <span className="font-medium text-[#181C1C]">Truck TR-208</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#44474F]">License Plate</span>
                        <span className="font-medium text-[#181C1C]">ABC-1234</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Documents Card */}
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-3 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C] pb-2 border-b border-[#C4C6D0]">
                      Shipment Documents
                    </h3>
                    <div className="space-y-2 font-sans text-sm">
                      {[
                        'Digital Waste Manifest',
                        'Transport Permit',
                        'Delivery Order',
                        'Compliance Certificate'
                      ].map((doc) => (
                        <div
                          key={doc}
                          className="flex justify-between items-center py-1.5 border-b border-[#C4C6D0] last:border-0"
                        >
                          <span className="text-[#181C1C] font-normal">{doc}</span>
                          <div className="flex items-center gap-3 font-mono text-xs">
                            <button
                              onClick={() => showNotification(`Viewing ${doc}...`)}
                              className="text-[#006A6A] font-medium hover:underline cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              onClick={() => showNotification(`Downloading ${doc} PDF...`)}
                              className="text-[#006A6A] font-medium hover:underline cursor-pointer"
                            >
                              Download PDF
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Route Information Card */}
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-3 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C] pb-2 border-b border-[#C4C6D0]">
                      Route Information
                    </h3>
                    <div className="space-y-2 font-sans text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[#44474F]">Pickup</span>
                        <span className="font-medium text-[#181C1C]">Ahmed Factory</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#44474F]">Destination</span>
                        <span className="font-medium text-[#181C1C]">Green Recycling Ltd.</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#44474F]">Distance</span>
                        <span className="font-medium text-[#181C1C]">62 km</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#44474F]">Remaining Time</span>
                        <span className="font-medium text-[#181C1C]">1 Hour 15 Minutes</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Notes Card */}
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-3 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C] pb-2 border-b border-[#C4C6D0]">
                      Shipment Notes
                    </h3>
                    <p className="font-sans text-sm text-[#44474F]">
                      The shipment is currently in transit. The recycler has been notified of the estimated arrival time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#C4C6D0]">
                <button
                  onClick={() => setActiveTab('assigned')}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                >
                  Back
                </button>
                <div className="ml-auto flex flex-wrap gap-3">
                  <button
                    onClick={() => showNotification('Shipment status refreshed.')}
                    className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                  >
                    Refresh Status
                  </button>
                  <button
                    onClick={() => showNotification('Calling driver Mohamed Ali (+20 XXX XXX XXXX)...')}
                    className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                  >
                    Contact Driver
                  </button>
                  <button
                    onClick={() => setActiveTab('confirmation')}
                    className="px-6 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer"
                  >
                    Confirm Delivery
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Delivery Confirmation Success View */}
          {activeTab === 'confirmation' && (
            <div className="space-y-6">
              <section className="space-y-1">
                <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                  Delivery Confirmed
                </h1>
                <p className="font-sans text-base text-[#44474F]">
                  The shipment has been successfully delivered to the recycling company.
                </p>
              </section>

              {/* Big Success Check Circle */}
              <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#8CF3F3] flex items-center justify-center text-[#006A6A]">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
                    Delivery Completed Successfully
                  </h2>
                  <p className="font-sans text-base text-[#44474F] max-w-md mx-auto">
                    The shipment has been successfully delivered. The recycler has confirmed receipt. The shipment workflow is now complete.
                  </p>
                </div>
              </div>

              {/* Grid 2 Column for Delivery Summary & Delivery Checklist */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Delivery Summary Card */}
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-4 shadow-2xs">
                  <h3 className="font-sans font-semibold text-base text-[#181C1C] pb-2 border-b border-[#C4C6D0]">
                    Delivery Summary
                  </h3>
                  <div className="space-y-2 font-sans text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[#44474F]">Shipment ID</span>
                      <span className="font-medium text-[#181C1C]">{selectedShipmentId || 'SH-2026-014'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#44474F]">Waste Material</span>
                      <span className="font-medium text-[#181C1C]">Steel Scrap Bundles</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#44474F]">Factory</span>
                      <span className="font-medium text-[#181C1C]">Ahmed Factory</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#44474F]">Recycler</span>
                      <span className="font-medium text-[#181C1C]">Green Recycling Ltd.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#44474F]">Driver</span>
                      <span className="font-medium text-[#181C1C]">Mohamed Ali</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#44474F]">Vehicle</span>
                      <span className="font-medium text-[#181C1C]">Truck TR-208</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#44474F]">Delivery Date</span>
                      <span className="font-medium text-[#181C1C]">Today</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#44474F]">Delivery Time</span>
                      <span className="font-medium text-[#181C1C]">11:32 AM</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-dashed border-[#C4C6D0]">
                      <span className="text-[#44474F]">Final Status</span>
                      <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] text-[10px] rounded font-semibold uppercase">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Checklist Card */}
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-4 shadow-2xs">
                  <h3 className="font-sans font-semibold text-base text-[#181C1C] pb-2 border-b border-[#C4C6D0]">
                    Delivery Checklist
                  </h3>
                  <div className="space-y-2.5 font-sans text-sm">
                    <div className="flex items-center gap-2.5 text-[#006A6A]">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-[#006A6A] font-medium">Pickup Completed</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#006A6A]">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-[#006A6A] font-medium">Shipment Transported</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#006A6A]">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-[#006A6A] font-medium">Delivery Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#006A6A]">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-[#006A6A] font-medium">Digital Waste Manifest Signed</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#006A6A]">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-[#006A6A] font-medium">Recycler Receipt Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#006A6A]">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-[#006A6A] font-medium">Shipment Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Status Card */}
              <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-3 shadow-2xs">
                <h3 className="font-sans font-semibold text-base text-[#181C1C] pb-2 border-b border-[#C4C6D0]">
                  Document Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 border border-[#C4C6D0] rounded bg-[#F1F4F3] space-y-1">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">DIGITAL MANIFEST</p>
                    <p className="font-sans font-semibold text-sm text-[#006A6A]">Signed</p>
                  </div>
                  <div className="p-3 border border-[#C4C6D0] rounded bg-[#F1F4F3] space-y-1">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">DELIVERY RECEIPT</p>
                    <p className="font-sans font-semibold text-sm text-[#006A6A]">Generated</p>
                  </div>
                  <div className="p-3 border border-[#C4C6D0] rounded bg-[#F1F4F3] space-y-1">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">TRANSPORT RECORD</p>
                    <p className="font-sans font-semibold text-sm text-[#006A6A]">Completed</p>
                  </div>
                  <div className="p-3 border border-[#C4C6D0] rounded bg-[#F1F4F3] space-y-1">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">COMPLIANCE RECORD</p>
                    <p className="font-sans font-semibold text-sm text-[#006A6A]">Updated</p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#C4C6D0]">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                >
                  Back to Dashboard
                </button>
                <div className="ml-auto flex flex-wrap gap-3">
                  <button
                    onClick={() => showNotification('Delivery Receipt PDF downloading...')}
                    className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                  >
                    Download Delivery Receipt
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="px-6 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer"
                  >
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Reports View */}
          {activeTab === 'reports' && (
            <div className="space-y-8">
              {/* Header Section */}
              <section className="space-y-1">
                <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                  Reports &amp; Analytics
                </h1>
                <p className="font-sans text-base text-[#44474F]">
                  Analyze logistics operations, shipment performance, fleet efficiency, and delivery compliance.
                </p>
              </section>

              {/* 6 Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">TOTAL DELIVERIES</p>
                  <p className="font-sans text-2xl font-bold text-[#181C1C]">1,248</p>
                </div>
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">ON-TIME RATE</p>
                  <p className="font-sans text-2xl font-bold text-[#006A6A]">97%</p>
                </div>
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">AVG DELIVERY TIME</p>
                  <p className="font-sans text-2xl font-bold text-[#181C1C]">2.8 Hours</p>
                </div>
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">FLEET UTILIZATION</p>
                  <p className="font-sans text-2xl font-bold text-[#181C1C]">91%</p>
                </div>
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">COMPLETED</p>
                  <p className="font-sans text-2xl font-bold text-[#181C1C]">1,203</p>
                </div>
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">DELAYED</p>
                  <p className="font-sans text-2xl font-bold text-[#BA1A1A]">45</p>
                </div>
              </div>

              {/* 2 Chart Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-4 shadow-2xs">
                  <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                    Monthly Deliveries
                  </h3>
                  <div className="h-64 bg-[#F1F4F3] rounded flex items-center justify-center font-sans text-sm text-[#44474F]">
                    [Line Chart Placeholder]
                  </div>
                </div>

                <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-4 shadow-2xs">
                  <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                    Shipment Status Distribution
                  </h3>
                  <div className="h-64 bg-[#F1F4F3] rounded flex items-center justify-center font-sans text-sm text-[#44474F] text-center px-4">
                    [Donut Chart: Completed, In Transit, Delayed, Cancelled]
                  </div>
                </div>
              </div>

              {/* Fleet Performance */}
              <div className="space-y-4 font-sans">
                <h3 className="font-semibold text-base text-[#181C1C]">
                  Fleet Performance
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">ACTIVE VEHICLES</p>
                    <p className="font-sans text-2xl font-bold text-[#181C1C]">42</p>
                  </div>
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">AVG DISTANCE</p>
                    <p className="font-sans text-2xl font-bold text-[#181C1C]">124 km</p>
                  </div>
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">FUEL EFFICIENCY</p>
                    <p className="font-sans text-2xl font-bold text-[#181C1C]">8.4 km/L</p>
                  </div>
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">AVG DRIVER RATING</p>
                    <p className="font-sans text-2xl font-bold text-[#181C1C]">4.8/5</p>
                  </div>
                </div>
              </div>

              {/* Delivery History Table */}
              <div className="bg-white border border-[#C4C6D0] rounded-lg overflow-hidden shadow-2xs">
                <div className="p-4 border-b border-[#C4C6D0]">
                  <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                    Delivery History
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm">
                    <thead className="bg-[#F1F4F3] text-[#44474F] font-mono text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-semibold">SHIPMENT ID</th>
                        <th className="px-4 py-3 font-semibold">FACTORY</th>
                        <th className="px-4 py-3 font-semibold">RECYCLER</th>
                        <th className="px-4 py-3 font-semibold">PICKUP</th>
                        <th className="px-4 py-3 font-semibold">DELIVERY</th>
                        <th className="px-4 py-3 font-semibold">DRIVER</th>
                        <th className="px-4 py-3 font-semibold">STATUS</th>
                        <th className="px-4 py-3 font-semibold">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C4C6D0]">
                      <tr>
                        <td className="px-4 py-3 text-[#181C1C] font-medium">SH-2026-014</td>
                        <td className="px-4 py-3 text-[#181C1C]">Ahmed Factory</td>
                        <td className="px-4 py-3 text-[#181C1C]">Green Recycling</td>
                        <td className="px-4 py-3 text-[#181C1C]">09:00 AM</td>
                        <td className="px-4 py-3 text-[#181C1C]">11:32 AM</td>
                        <td className="px-4 py-3 text-[#181C1C]">Mohamed Ali</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] text-[10px] rounded font-semibold uppercase">
                            COMPLETED
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              setSelectedShipmentId('SH-2026-014');
                              setActiveTab('confirmation');
                            }}
                            className="text-[#006A6A] font-medium hover:underline cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Driver Performance Table */}
              <div className="bg-white border border-[#C4C6D0] rounded-lg overflow-hidden shadow-2xs">
                <div className="p-4 border-b border-[#C4C6D0]">
                  <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                    Driver Performance
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm">
                    <thead className="bg-[#F1F4F3] text-[#44474F] font-mono text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-semibold">DRIVER NAME</th>
                        <th className="px-4 py-3 font-semibold">COMPLETED</th>
                        <th className="px-4 py-3 font-semibold">ON-TIME %</th>
                        <th className="px-4 py-3 font-semibold">RATING</th>
                        <th className="px-4 py-3 font-semibold">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C4C6D0]">
                      <tr>
                        <td className="px-4 py-3 text-[#181C1C] font-medium">Mohamed Ali</td>
                        <td className="px-4 py-3 text-[#181C1C]">142</td>
                        <td className="px-4 py-3 text-[#181C1C]">98%</td>
                        <td className="px-4 py-3 text-[#181C1C]">4.9</td>
                        <td className="px-4 py-3 text-[#006A6A] font-medium">Active</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Compliance Documents */}
              <div className="space-y-4 font-sans">
                <h3 className="font-semibold text-base text-[#181C1C]">
                  Compliance Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">DIGITAL MANIFEST</p>
                    <p className="font-sans text-sm font-semibold text-[#006A6A]">Verified</p>
                    <p className="font-sans text-xs text-[#44474F]">Generated: Oct 24, 2023</p>
                    <div className="flex gap-3 pt-1 font-mono text-xs">
                      <button
                        onClick={() => showNotification('Viewing Digital Manifest...')}
                        className="text-[#006A6A] font-medium hover:underline cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => showNotification('Downloading Digital Manifest PDF...')}
                        className="text-[#006A6A] font-medium hover:underline cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">TRANSPORT PERMIT</p>
                    <p className="font-sans text-sm font-semibold text-[#006A6A]">Active</p>
                    <p className="font-sans text-xs text-[#44474F]">Generated: Oct 20, 2023</p>
                    <div className="flex gap-3 pt-1 font-mono text-xs">
                      <button
                        onClick={() => showNotification('Viewing Transport Permit...')}
                        className="text-[#006A6A] font-medium hover:underline cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => showNotification('Downloading Transport Permit PDF...')}
                        className="text-[#006A6A] font-medium hover:underline cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">DELIVERY RECEIPT</p>
                    <p className="font-sans text-sm font-semibold text-[#006A6A]">Signed</p>
                    <p className="font-sans text-xs text-[#44474F]">Generated: Today</p>
                    <div className="flex gap-3 pt-1 font-mono text-xs">
                      <button
                        onClick={() => showNotification('Viewing Delivery Receipt...')}
                        className="text-[#006A6A] font-medium hover:underline cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => showNotification('Downloading Delivery Receipt PDF...')}
                        className="text-[#006A6A] font-medium hover:underline cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">CHAIN OF CUSTODY</p>
                    <p className="font-sans text-sm font-semibold text-[#006A6A]">Complete</p>
                    <p className="font-sans text-xs text-[#44474F]">Generated: Oct 22, 2023</p>
                    <div className="flex gap-3 pt-1 font-mono text-xs">
                      <button
                        onClick={() => showNotification('Viewing Chain of Custody...')}
                        className="text-[#006A6A] font-medium hover:underline cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => showNotification('Downloading Chain of Custody PDF...')}
                        className="text-[#006A6A] font-medium hover:underline cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational Insights */}
              <div className="space-y-4 font-sans">
                <h3 className="font-semibold text-base text-[#181C1C]">
                  Operational Insights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">AVG RESPONSE TIME</p>
                    <p className="font-sans text-2xl font-bold text-[#181C1C]">14 Min</p>
                  </div>
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">FLEET AVAILABILITY</p>
                    <p className="font-sans text-2xl font-bold text-[#181C1C]">88%</p>
                  </div>
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">CUSTOMER SATISFACTION</p>
                    <p className="font-sans text-2xl font-bold text-[#181C1C]">4.9/5</p>
                  </div>
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                    <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">SUCCESSFUL DELIVERIES</p>
                    <p className="font-sans text-2xl font-bold text-[#181C1C]">99.2%</p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#C4C6D0]">
                <button
                  onClick={() => showNotification('Exporting Report...')}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                >
                  Export Report
                </button>
                <div className="ml-auto flex flex-wrap gap-3">
                  <button
                    onClick={() => showNotification('Downloading Compliance Report PDF...')}
                    className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                  >
                    Download Compliance Report
                  </button>
                  <button
                    onClick={() => showNotification('Generating Monthly Report...')}
                    className="px-6 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer"
                  >
                    Generate Monthly Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <PortalSettingsPage
              portalType="logistics"
              userName={userName}
              orgName={orgName}
              showNotification={(msg) => showNotification(msg)}
              onBackToDashboard={() => setActiveTab('dashboard')}
            />
          )}
        </div>
      </main>

      {/* Driver Assignment Modal */}
      {showDriverModal && (
        <div className="fixed inset-0 z-50 bg-[#000A1F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#C4C6D0]">
              <h3 className="font-sans font-bold text-lg text-[#181C1C]">
                Assign Driver &amp; Vehicle ({selectedShipmentId})
              </h3>
              <button
                onClick={() => setShowDriverModal(false)}
                className="text-[#44474F] hover:text-[#181C1C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDriver} className="space-y-4 font-sans text-sm">
              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Assigned Driver Name
                </label>
                <input
                  type="text"
                  value={driverNameInput}
                  onChange={(e) => setDriverNameInput(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Truck / Vehicle ID
                </label>
                <input
                  type="text"
                  value={vehicleInput}
                  onChange={(e) => setVehicleInput(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#C4C6D0]">
                <button
                  type="button"
                  onClick={() => setShowDriverModal(false)}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold hover:bg-[#F1F4F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A]"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
