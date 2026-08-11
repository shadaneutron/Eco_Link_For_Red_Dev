import React, { useState, useEffect } from 'react';
import { shipmentsApi, dppApi, ShipmentResponse, LogisticsReportsData, DPPListItemResponse } from '../../services/api';
import logoImg from '../../assets/logo.png';
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
  RotateCw,
  AlertTriangle,
  ArrowLeft,
  X,
  Building2,
  Menu,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  FileText,
  Download
} from 'lucide-react';
import { PortalSettingsPage } from '../settings/PortalSettingsPage';
import { DPPViewModal } from '../common/DPPViewModal';


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
  dbId: number;
  status: 'Ready for Pickup' | 'Assigned' | 'Picked Up' | 'In Transit' | 'Completed' | 'Delayed' | 'Pending' | 'Delivered' | 'Confirmed';
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
  userName = '',
  orgName = ''
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'assigned' | 'tracking' | 'confirmation' | 'reports' | 'details' | 'settings'
  >('dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Single shipment state directly from GET /api/shipments/<id>/
  const [selectedShipmentDbId, setSelectedShipmentDbId] = useState<number | null>(null);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [selectedShipmentDetail, setSelectedShipmentDetail] = useState<ShipmentResponse | null>(null);
  const [selectedShipmentLoading, setSelectedShipmentLoading] = useState<boolean>(false);
  const [selectedShipmentError, setSelectedShipmentError] = useState<string | null>(null);

  // Modals
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showPodModal, setShowPodModal] = useState(false);
  const [driverNameInput, setDriverNameInput] = useState('');
  const [vehicleInput, setVehicleInput] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shipments, setShipments] = useState<ShipmentAssignment[]>([]);
  const [reportsData, setReportsData] = useState<LogisticsReportsData | null>(null);
  const [dppList, setDppList] = useState<DPPListItemResponse[]>([]);
  const [dppLoading, setDppLoading] = useState<boolean>(false);
  const [selectedViewDppId, setSelectedViewDppId] = useState<number | null>(null);

  const fetchReports = async () => {
    try {
      setDppLoading(true);
      const [data, dpps] = await Promise.all([
        shipmentsApi.getLogisticsReports(),
        dppApi.getDPPs()
      ]);
      setReportsData(data);
      setDppList(dpps);
    } catch (err: any) {
      console.error('API error fetching reports:', err);
    } finally {
      setDppLoading(false);
    }
  };


  const fetchSingleShipment = async (dbId: number): Promise<ShipmentResponse | null> => {
    setSelectedShipmentLoading(true);
    setSelectedShipmentError(null);
    try {
      const data = await shipmentsApi.getShipment(dbId);
      setSelectedShipmentDetail(data);
      return data;
    } catch (err: any) {
      console.error(`API error fetching shipment #${dbId}:`, err);
      setSelectedShipmentError(err?.message || `Failed to fetch shipment #${dbId} from server`);
      setSelectedShipmentDetail(null);
      return null;
    } finally {
      setSelectedShipmentLoading(false);
    }
  };

  const fetchShipments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shipmentsApi.getShipments();
      if (Array.isArray(data)) {
        const mapped: ShipmentAssignment[] = data.map((s) => ({
          id: s.tracking_number || `SH-2026-${String(s.id).padStart(3, '0')}`,
          dbId: s.id,
          status: s.status as any,
          material: s.listing_title || s.listing_material_type || 'Industrial Waste Scrap',
          route: `${s.pickup_location || 'Pickup Location'} → ${s.destination || 'Destination'}`,
          pickupTime: s.pickup_date ? new Date(s.pickup_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unscheduled',
          driver: s.driver_name || 'Unassigned Driver',
          vehicle: s.vehicle || 'Truck Unassigned',
          weight: s.listing_quantity ? `${s.listing_quantity} ${s.listing_unit || ''}` : '',
          contactPhone: ''
        }));
        setShipments(mapped);
      } else {
        setShipments([]);
      }
    } catch (err: any) {
      console.error('API error fetching shipments:', err);
      setError(err?.message || 'Failed to fetch shipments from server');
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShipment = (item: { dbId: number; id: string }, tab: 'details' | 'tracking' | 'confirmation' = 'details') => {
    setSelectedShipmentDbId(item.dbId);
    setSelectedShipmentId(item.id);
    fetchSingleShipment(item.dbId);
    setActiveTab(tab);
  };

  const handleTransitionAction = async (item: ShipmentAssignment) => {
    const targetId = item.dbId;
    const currentStatus = item.status;
    try {
      if (currentStatus === 'Pending') {
        const driver_name = window.prompt('Enter Driver Name:', '') || '';
        if (!driver_name.trim()) return;
        const vehicle = window.prompt('Enter Vehicle Plate / Details:', '') || '';
        if (!vehicle.trim()) return;
        const res = await shipmentsApi.assignDriver(targetId, { driver_name, vehicle });
        showNotification(res?.detail || `Driver assigned to shipment ${item.id}. Status updated to Assigned.`);
      } else if (currentStatus === 'Assigned') {
        const res = await shipmentsApi.pickupShipment(targetId, 'Ready for Pickup');
        showNotification(res?.detail || `Shipment ${item.id} status updated to Ready for Pickup.`);
      } else if (currentStatus === 'Ready for Pickup') {
        const res = await shipmentsApi.pickupShipment(targetId, 'Picked Up');
        showNotification(res?.detail || `Shipment ${item.id} collected. Status updated to Picked Up.`);
      } else if (currentStatus === 'Picked Up') {
        const res = await shipmentsApi.transitShipment(targetId);
        showNotification(res?.detail || `Shipment ${item.id} is now In Transit.`);
      } else if (currentStatus === 'In Transit') {
        const res = await shipmentsApi.deliverShipment(targetId);
        showNotification(res?.detail || `Shipment ${item.id} marked as Delivered. Awaiting Recycler confirmation.`);
      }

      await Promise.all([
        fetchShipments(),
        fetchReports(),
        selectedShipmentDbId === targetId ? fetchSingleShipment(targetId) : Promise.resolve(null)
      ]);
    } catch (err: any) {
      console.error('Shipment transition error:', err);
      showNotification(err?.message || `Failed transition from status ${currentStatus}`);
    }
  };

  const renderStatusActionButton = (item: ShipmentAssignment, compact = false) => {
    const status = item.status;
    const padding = compact ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-xs';
    switch (status) {
      case 'Pending':
        return (
          <button
            onClick={() => handleTransitionAction(item)}
            className={`${padding} bg-[#000A1F] text-white rounded font-mono font-semibold hover:bg-[#00204A] transition-colors cursor-pointer`}
          >
            Assign Driver
          </button>
        );
      case 'Assigned':
        return (
          <button
            onClick={() => handleTransitionAction(item)}
            className={`${padding} bg-[#006A6A] text-white rounded font-mono font-semibold hover:bg-[#004F4F] transition-colors cursor-pointer`}
          >
            Start Pickup
          </button>
        );
      case 'Ready for Pickup':
        return (
          <button
            onClick={() => handleTransitionAction(item)}
            className={`${padding} bg-[#006A6A] text-white rounded font-mono font-semibold hover:bg-[#004F4F] transition-colors cursor-pointer`}
          >
            Confirm Pickup
          </button>
        );
      case 'Picked Up':
        return (
          <button
            onClick={() => handleTransitionAction(item)}
            className={`${padding} bg-[#00204A] text-[#8CF3F3] rounded font-mono font-semibold hover:bg-[#003366] transition-colors cursor-pointer`}
          >
            Start Transit
          </button>
        );
      case 'In Transit':
        return (
          <button
            onClick={() => handleTransitionAction(item)}
            className={`${padding} bg-[#006A6A] text-white rounded font-mono font-semibold hover:bg-[#004F4F] transition-colors cursor-pointer`}
          >
            Mark Delivered
          </button>
        );
      case 'Delivered':
        return (
          <span className="px-2.5 py-1 text-[11px] text-[#007070] bg-[#8CF3F3] rounded font-semibold">
            Awaiting Recycler Confirmation
          </span>
        );
      case 'Confirmed':
      case 'Completed':
        return (
          <span className="px-2.5 py-1 text-[11px] text-white bg-[#006A6A] rounded font-semibold">
            Receipt Confirmed
          </span>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchShipments();
    fetchReports();
  }, []);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipmentDbId) return;
    try {
      const res = await shipmentsApi.assignDriver(selectedShipmentDbId, {
        driver_name: driverNameInput,
        vehicle: vehicleInput
      });
      showNotification(res?.detail || `Assigned driver ${driverNameInput} (${vehicleInput})`);
      setShowDriverModal(false);
      await Promise.all([
        fetchShipments(),
        fetchReports(),
        fetchSingleShipment(selectedShipmentDbId)
      ]);
    } catch (err: any) {
      console.warn('API assign driver error:', err);
      showNotification(`Assignment failed: ${err?.message || 'API error'}`);
    }
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
              <img src={logoImg} alt="Eco Link Logo" className="h-8 w-auto object-contain" />
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#8CF3F3] text-[#007070] font-semibold">
              LOGISTICS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-4 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors text-left font-mono text-sm font-medium cursor-pointer ${
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
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors text-left font-mono text-sm font-medium cursor-pointer ${
                activeTab === 'assigned'
                  ? 'bg-[#00204A] text-[#7189B8]'
                  : 'text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Assigned Shipments</span>
            </button>

            <button
              onClick={() => {
                if (shipments.length > 0 && !selectedShipmentDbId) {
                  handleSelectShipment(shipments[0], 'tracking');
                } else {
                  setActiveTab('tracking');
                }
              }}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors text-left font-mono text-sm font-medium cursor-pointer ${
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
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors text-left font-mono text-sm font-medium cursor-pointer ${
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
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors text-left font-mono text-sm font-medium cursor-pointer ${
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
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors text-left font-mono text-sm font-medium cursor-pointer ${
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

        {/* Bottom Profile */}
        <div className="p-4 border-t border-[#C4C6D0]">
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-[#8CF3F3] flex items-center justify-center text-[#007070] font-mono text-xs font-semibold">
              {(userName || 'L').slice(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-mono text-xs font-medium text-[#181C1C] truncate">{orgName || 'Logistics Partner'}</p>
              <p className="font-mono text-[10px] text-[#44474F] truncate">{userName || 'Logistics User'} · Logistics</p>
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
                placeholder="Search shipments, drivers, routes..."
                className="w-full h-10 pl-10 pr-3 py-2 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C] placeholder-[#44474F] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => showNotification('Notifications updated.')}
              className="relative text-[#44474F] hover:text-[#181C1C] transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#BA1A1A] rounded-full" />
            </button>

            <button
              onClick={onBackToHome}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#E6E9E8] cursor-pointer"
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

              {/* 4 KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    ASSIGNED SHIPMENTS
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">{shipments.length}</p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    READY FOR PICKUP
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">
                    {shipments.filter(s => s.status === 'Ready for Pickup' || s.status === 'Pending' || s.status === 'Assigned').length}
                  </p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    IN TRANSIT
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">
                    {shipments.filter(s => s.status === 'In Transit' || s.status === 'Picked Up').length}
                  </p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-2 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    COMPLETED DELIVERIES
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">
                    {shipments.filter(s => s.status === 'Completed' || s.status === 'Delivered' || s.status === 'Confirmed').length}
                  </p>
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
                    {loading ? (
                      <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-8 text-center text-[#44474F]">
                        <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#006A6A]" />
                        <p className="font-sans text-sm font-medium">Loading shipments from database...</p>
                      </div>
                    ) : error ? (
                      <div className="bg-[#F7FAF9] border border-[#BA1A1A] rounded-lg p-6 text-center text-[#BA1A1A]">
                        <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                        <p className="font-sans text-sm font-semibold">Error Loading Shipments</p>
                        <p className="font-sans text-xs mt-1">{error}</p>
                      </div>
                    ) : filteredShipments.length === 0 ? (
                      <div className="bg-[#F7FAF9] border border-dashed border-[#C4C6D0] rounded-lg p-8 text-center text-[#44474F] space-y-2">
                        <Truck className="w-8 h-8 mx-auto text-[#006A6A] opacity-60" />
                        <p className="font-sans text-sm font-semibold text-[#181C1C]">No Shipments Found</p>
                        <p className="font-sans text-xs text-[#44474F]">
                          There are no active shipments matching your query in the database.
                        </p>
                      </div>
                    ) : (
                      filteredShipments.map((s) => (
                        <div key={s.id} className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-sans font-semibold text-base text-[#181C1C]">
                                {s.id}
                              </span>
                              <span className={`px-2 py-0.5 font-sans text-[10px] font-medium rounded ${
                                s.status === 'In Transit' || s.status === 'Picked Up'
                                  ? 'bg-[#00204A] text-[#8CF3F3]'
                                  : s.status === 'Completed' || s.status === 'Delivered' || s.status === 'Confirmed'
                                  ? 'bg-[#006A6A] text-white'
                                  : s.status === 'Delayed'
                                  ? 'bg-[#BA1A1A] text-white'
                                  : 'bg-[#8CF3F3] text-[#007070]'
                              }`}>
                                {s.status}
                              </span>
                            </div>
                            <p className="font-sans text-sm text-[#44474F]">
                              {s.material} • {s.route}
                            </p>
                            <div className="flex flex-wrap gap-4 text-[10px] text-[#44474F] font-sans pt-1">
                              <p>
                                <span className="font-medium text-[#181C1C]">Driver:</span> {s.driver}
                              </p>
                              <p>
                                <span className="font-medium text-[#181C1C]">Vehicle:</span> {s.vehicle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                            <button
                              onClick={() => handleSelectShipment(s, 'details')}
                              className="px-3.5 py-1.5 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                            >
                              View Shipment
                            </button>
                            {renderStatusActionButton(s, true)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right 1 column: Upcoming Actions & Recent Activity */}
                <div className="space-y-6">
                  {/* Active Shipments */}
                  <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-4 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                      Active Shipments — Upcoming Actions
                    </h3>
                    {shipments.filter(s => !['Confirmed', 'Delivered', 'Completed'].includes(s.status)).length === 0 ? (
                      <p className="font-sans text-sm text-[#44474F]">No pending pickups or deliveries scheduled.</p>
                    ) : (
                      <div className="space-y-3 font-sans">
                        {shipments
                          .filter(s => !['Confirmed', 'Delivered', 'Completed'].includes(s.status))
                          .slice(0, 4)
                          .map(s => (
                            <div key={s.id} className="flex gap-3 items-start cursor-pointer hover:bg-white p-1 rounded" onClick={() => handleSelectShipment(s, 'details')}>
                              <div className="font-mono text-xs font-medium text-[#006A6A] w-14 pt-0.5 flex-shrink-0">
                                {s.status === 'Pending' ? 'PENDING' : s.status === 'In Transit' ? 'TRANSIT' : s.status.toUpperCase().slice(0, 6)}
                              </div>
                              <div className="border-l-2 border-[#006A6A] pl-3 space-y-0.5">
                                <p className="font-sans font-semibold text-sm text-[#181C1C]">{s.material}</p>
                                <p className="font-sans text-xs text-[#44474F] truncate">{s.route}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </section>

                  {/* Recent Activity */}
                  <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-4 shadow-2xs">
                    <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                      Recent Activity
                    </h3>
                    {shipments.length === 0 ? (
                      <p className="font-sans text-sm text-[#44474F]">No recent shipment activity.</p>
                    ) : (
                      <div className="space-y-3 font-sans text-sm text-[#181C1C]">
                        {shipments.slice(0, 4).map(s => (
                          <div key={s.id} className="flex items-start gap-2.5 cursor-pointer hover:bg-white p-1 rounded" onClick={() => handleSelectShipment(s, 'tracking')}>
                            <Truck className="w-4 h-4 text-[#006A6A] flex-shrink-0 mt-0.5" />
                            <p>{s.id}: <span className="font-medium">{s.status}</span> — {s.material}</p>
                          </div>
                        ))}
                      </div>
                    )}
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
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">
                    {shipments.filter(s => s.status === 'Assigned').length}
                  </p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    READY FOR PICKUP
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">
                    {shipments.filter(s => s.status === 'Ready for Pickup').length}
                  </p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    IN TRANSIT
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">
                    {shipments.filter(s => s.status === 'In Transit').length}
                  </p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    DELAYED
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#BA1A1A]">
                    {shipments.filter(s => s.status === 'Delayed').length}
                  </p>
                </div>

                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 space-y-1 shadow-2xs">
                  <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                    COMPLETED TODAY
                  </p>
                  <p className="font-sans text-2xl font-semibold text-[#006A6A]">
                    {shipments.filter(s => s.status === 'Confirmed' || s.status === 'Delivered').length}
                  </p>
                </div>
              </div>

              {/* Search & Filter Control Bar */}
              <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <div className="relative min-w-[220px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#44474F]" />
                    <input
                      type="text"
                      placeholder="Search Shipment ID, Driver, Route"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#C4C6D0] rounded font-sans text-xs text-[#181C1C] placeholder-[#44474F] focus:outline-none focus:border-[#006A6A]"
                    />
                  </div>
                </div>
              </div>

              {/* Shipment List */}
              <div className="lg:col-span-2 space-y-4">
                {loading ? (
                  <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-8 text-center text-[#44474F]">
                    <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#006A6A]" />
                    <p className="font-sans text-sm font-medium">Loading assigned shipments...</p>
                  </div>
                ) : error ? (
                  <div className="bg-[#F7FAF9] border border-[#BA1A1A] rounded-lg p-6 text-center text-[#BA1A1A]">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-sans text-sm font-semibold">Error Loading Shipments</p>
                    <p className="font-sans text-xs mt-1">{error}</p>
                  </div>
                ) : filteredShipments.length === 0 ? (
                  <div className="bg-[#F7FAF9] border border-dashed border-[#C4C6D0] rounded-lg p-8 text-center text-[#44474F] space-y-2">
                    <Truck className="w-8 h-8 mx-auto text-[#006A6A] opacity-60" />
                    <p className="font-sans text-sm font-semibold text-[#181C1C]">No Assigned Shipments</p>
                    <p className="font-sans text-xs text-[#44474F]">
                      There are no assigned shipments matching your query.
                    </p>
                  </div>
                ) : (
                  filteredShipments.map((s) => (
                    <div key={s.id} className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-3 shadow-2xs">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-lg text-[#181C1C]">
                              {s.id}
                            </span>
                            <span className={`px-2.5 py-0.5 font-sans text-xs font-semibold rounded ${
                              s.status === 'In Transit' || s.status === 'Picked Up'
                                ? 'bg-[#00204A] text-[#8CF3F3]'
                                : s.status === 'Completed' || s.status === 'Delivered' || s.status === 'Confirmed'
                                ? 'bg-[#006A6A] text-white'
                                : s.status === 'Delayed'
                                ? 'bg-[#BA1A1A] text-white'
                                : 'bg-[#8CF3F3] text-[#007070]'
                            }`}>
                              {s.status}
                            </span>
                          </div>
                          <p className="font-sans text-sm text-[#44474F]">
                            {s.material} • {s.route}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#44474F] font-sans pt-1">
                            <p><span className="font-medium text-[#181C1C]">Driver:</span> {s.driver}</p>
                            <p><span className="font-medium text-[#181C1C]">Vehicle:</span> {s.vehicle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                          <button
                            onClick={() => handleSelectShipment(s, 'details')}
                            className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                          >
                            View Shipment
                          </button>
                          {renderStatusActionButton(s, false)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab: Shipment Details Review View */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <section className="space-y-1 flex items-center gap-4">
                <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-white border border-[#C4C6D0] rounded-lg hover:bg-gray-50 text-[#181C1C] cursor-pointer">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                    Shipment Details
                  </h1>
                  <p className="font-sans text-base text-[#44474F]">
                    Review detailed shipment information fetched live from server database (GET /api/shipments/id/).
                  </p>
                </div>
              </section>

              {selectedShipmentLoading ? (
                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-8 text-center text-[#44474F]">
                  <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#006A6A]" />
                  <p className="font-sans text-sm font-medium">Fetching shipment detail from database...</p>
                </div>
              ) : selectedShipmentError ? (
                <div className="bg-[#F7FAF9] border border-[#BA1A1A] rounded-lg p-6 text-center text-[#BA1A1A]">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-sans text-sm font-semibold">Error Loading Shipment Details</p>
                  <p className="font-sans text-xs mt-1">{selectedShipmentError}</p>
                </div>
              ) : !selectedShipmentDetail ? (
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-8 text-center shadow-2xs">
                  <p className="text-[#44474F]">Please select a shipment from the dashboard or list.</p>
                </div>
              ) : (
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
                          {selectedShipmentDetail.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 font-sans text-sm">
                        <div className="space-y-1">
                          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                            TRACKING NUMBER / ID
                          </p>
                          <p className="font-medium text-[#181C1C]">{selectedShipmentDetail.tracking_number || `SH-2026-${String(selectedShipmentDetail.id).padStart(3, '0')}`}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                            WASTE MATERIAL / TITLE
                          </p>
                          <p className="font-medium text-[#181C1C]">{selectedShipmentDetail.listing_title || selectedShipmentDetail.listing_material_type || 'Not available'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                            DRIVER NAME
                          </p>
                          <p className="font-medium text-[#181C1C]">{selectedShipmentDetail.driver_name || 'Not available'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                            VEHICLE / TRUCK
                          </p>
                          <p className="font-medium text-[#181C1C]">{selectedShipmentDetail.vehicle || 'Not available'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                            QUANTITY
                          </p>
                          <p className="font-medium text-[#181C1C]">
                            {selectedShipmentDetail.listing_quantity ? `${selectedShipmentDetail.listing_quantity} ${selectedShipmentDetail.listing_unit || ''}` : 'Not available'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                            CREATED AT
                          </p>
                          <p className="font-medium text-[#181C1C]">
                            {selectedShipmentDetail.created_at ? new Date(selectedShipmentDetail.created_at).toLocaleString() : 'Not available'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Location & Route Card */}
                    <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
                      <h3 className="font-sans font-semibold text-base text-[#181C1C] border-b border-[#C4C6D0] pb-3">
                        Route & Partners
                      </h3>

                      <div className="space-y-4 font-sans text-sm">
                        <div className="flex gap-3">
                          <Building2 className="w-5 h-5 text-[#006A6A] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-mono text-xs text-[#44474F] uppercase">PICKUP LOCATION (FACTORY)</p>
                            <p className="font-semibold text-[#181C1C]">{selectedShipmentDetail.pickup_location || 'Not available'}</p>
                            <p className="text-xs text-[#44474F]">{selectedShipmentDetail.factory_name || 'Not available'}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <MapPin className="w-5 h-5 text-[#006A6A] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-mono text-xs text-[#44474F] uppercase">DESTINATION (RECYCLER)</p>
                            <p className="font-semibold text-[#181C1C]">{selectedShipmentDetail.destination || 'Not available'}</p>
                            <p className="text-xs text-[#44474F]">{selectedShipmentDetail.recycler_name || 'Not available'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="space-y-6">
                    <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 shadow-2xs space-y-4">
                      <h4 className="font-sans font-semibold text-sm text-[#181C1C]">Current Status & Action</h4>
                      <div className="p-3 bg-white border border-[#C4C6D0] rounded">
                        <p className="font-mono text-xs text-[#44474F] uppercase">STATUS</p>
                        <p className="font-semibold text-base text-[#006A6A]">{selectedShipmentDetail.status}</p>
                      </div>

                      {renderStatusActionButton({
                        id: selectedShipmentDetail.tracking_number || `SH-2026-${String(selectedShipmentDetail.id).padStart(3, '0')}`,
                        dbId: selectedShipmentDetail.id,
                        status: selectedShipmentDetail.status,
                        material: selectedShipmentDetail.listing_title || 'Industrial Waste',
                        route: `${selectedShipmentDetail.pickup_location || 'Pickup'} → ${selectedShipmentDetail.destination || 'Destination'}`,
                        pickupTime: '',
                        driver: selectedShipmentDetail.driver_name || '',
                        vehicle: selectedShipmentDetail.vehicle || '',
                        weight: '',
                        contactPhone: ''
                      })}

                      <button
                        onClick={() => setActiveTab('tracking')}
                        className="w-full mt-2 px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                      >
                        View Live Timeline Tracking
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Live Shipment Tracking View */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              <section className="space-y-1 flex items-center gap-4">
                <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-white border border-[#C4C6D0] rounded-lg hover:bg-gray-50 text-[#181C1C] cursor-pointer">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                    Shipment Tracking
                  </h1>
                  <p className="font-sans text-base text-[#44474F]">
                    Monitor real-time workflow status fetched live from database (GET /api/shipments/id/).
                  </p>
                </div>
              </section>

              {selectedShipmentLoading ? (
                <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-8 text-center text-[#44474F]">
                  <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#006A6A]" />
                  <p className="font-sans text-sm font-medium">Fetching tracking state from database...</p>
                </div>
              ) : selectedShipmentError ? (
                <div className="bg-[#F7FAF9] border border-[#BA1A1A] rounded-lg p-6 text-center text-[#BA1A1A]">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-sans text-sm font-semibold">Error Loading Tracking Data</p>
                  <p className="font-sans text-xs mt-1">{selectedShipmentError}</p>
                </div>
              ) : !selectedShipmentDetail ? (
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-8 text-center shadow-2xs">
                  <p className="text-[#44474F]">Please select a shipment from the dashboard or list to track.</p>
                </div>
              ) : (
                (() => {
                  const statusArray = ['Pending', 'Assigned', 'Ready for Pickup', 'Picked Up', 'In Transit', 'Delivered', 'Confirmed'];
                  const currentStep = statusArray.indexOf(selectedShipmentDetail.status) + 1;
                  return (
                    <>
                      <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-4 shadow-2xs">
                        <div className="flex justify-between items-center pb-2 border-b border-[#C4C6D0]">
                          <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                            Shipment Summary
                          </h3>
                          <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] text-[10px] font-semibold rounded uppercase tracking-wider font-mono">
                            {selectedShipmentDetail.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 font-sans">
                          <div className="space-y-1">
                            <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">TRACKING NUMBER</p>
                            <p className="font-medium text-base text-[#181C1C]">{selectedShipmentDetail.tracking_number || `SH-2026-${String(selectedShipmentDetail.id).padStart(3, '0')}`}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">WASTE MATERIAL</p>
                            <p className="font-medium text-base text-[#181C1C]">{selectedShipmentDetail.listing_title || selectedShipmentDetail.listing_material_type || 'Not available'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">DRIVER</p>
                            <p className="font-medium text-base text-[#181C1C]">{selectedShipmentDetail.driver_name || 'Not available'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">VEHICLE</p>
                            <p className="font-medium text-base text-[#181C1C]">{selectedShipmentDetail.vehicle || 'Not available'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">PICKUP DATE</p>
                            <p className="font-medium text-sm text-[#181C1C]">
                              {selectedShipmentDetail.pickup_date ? new Date(selectedShipmentDetail.pickup_date).toLocaleString() : 'Not available'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">ESTIMATED ARRIVAL</p>
                            <p className="font-medium text-sm text-[#181C1C]">
                              {selectedShipmentDetail.estimated_arrival ? new Date(selectedShipmentDetail.estimated_arrival).toLocaleString() : 'Not available'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">DELIVERED AT</p>
                            <p className="font-medium text-sm text-[#181C1C]">
                              {selectedShipmentDetail.delivered_at ? new Date(selectedShipmentDetail.delivered_at).toLocaleString() : 'Not available'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">ROUTE</p>
                            <p className="font-medium text-sm text-[#181C1C]">
                              {`${selectedShipmentDetail.pickup_location || 'Not available'} → ${selectedShipmentDetail.destination || 'Not available'}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 shadow-2xs">
                        <h3 className="font-sans font-semibold text-lg text-[#181C1C] mb-8">
                          Tracking Progress (Live Workflow State)
                        </h3>
                        <div className="relative">
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#E6E9E8]"></div>
                          <div className="absolute left-4 top-0 w-0.5 bg-[#006A6A] transition-all duration-500" style={{ height: `${((Math.max(1, currentStep) - 1) / (statusArray.length - 1)) * 100}%` }}></div>
                          
                          <div className="space-y-8 relative z-10">
                            {statusArray.map((st, index) => {
                               const stepNum = index + 1;
                               const isCompleted = currentStep > stepNum;
                               const isCurrent = currentStep === stepNum;
                               const isPending = currentStep < stepNum;
                               return (
                                 <div key={st} className="flex gap-4">
                                   <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                                     isCompleted ? 'bg-[#006A6A] border-[#006A6A] text-white' : 
                                     isCurrent ? 'bg-white border-[#006A6A] text-[#006A6A]' : 
                                     'bg-white border-[#C4C6D0] text-[#C4C6D0]'
                                   }`}>
                                     {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-[#006A6A]' : 'bg-transparent'}`}></div>}
                                   </div>
                                   <div className="pt-1.5 flex-1">
                                     <h4 className={`font-sans font-semibold text-base ${isPending ? 'text-[#8E9199]' : 'text-[#181C1C]'}`}>
                                       {st}
                                     </h4>
                                     <p className="font-sans text-xs text-[#44474F]">
                                       {isCompleted ? 'Completed step' : isCurrent ? 'Active current status' : 'Pending step'}
                                     </p>
                                   </div>
                                 </div>
                               );
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()
              )}
            </div>
          )}

          {/* Tab 4: Delivery Confirmation View */}
          {activeTab === 'confirmation' && (
            <div className="space-y-6">
              <section className="space-y-1">
                <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                  Delivery Confirmation
                </h1>
                <p className="font-sans text-base text-[#44474F]">
                  Operational view for managing active deliveries. Mark shipments as delivered upon arrival. Final receipt confirmation is completed by the Recycler.
                </p>
              </section>

              <div className="bg-white rounded-xl border border-[#C4C6D0] overflow-hidden shadow-2xs">
                {shipments.filter(s => ['In Transit', 'Delivered', 'Confirmed'].includes(s.status)).length === 0 ? (
                  <div className="p-8 text-center text-[#44474F]">
                    <p>No shipments are currently in transit, delivered, or confirmed.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans text-sm">
                      <thead>
                        <tr className="bg-[#F7FAF9] border-b border-[#C4C6D0] text-[#44474F] font-mono text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4 font-semibold">Tracking #</th>
                          <th className="py-3 px-4 font-semibold">Material</th>
                          <th className="py-3 px-4 font-semibold">Route</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-4 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shipments.filter(s => ['In Transit', 'Delivered', 'Confirmed'].includes(s.status)).map((item) => (
                          <tr key={item.id} className="border-b border-[#E6E9E8] hover:bg-[#F7FAF9] transition-colors">
                            <td className="py-3 px-4 font-medium text-[#181C1C] whitespace-nowrap">{item.id}</td>
                            <td className="py-3 px-4 text-[#44474F]">{item.material}</td>
                            <td className="py-3 px-4 text-[#44474F]">{item.route}</td>
                            <td className="py-3 px-4 font-mono text-xs">
                              <span className={`px-2 py-0.5 rounded font-semibold ${
                                item.status === 'In Transit'
                                  ? 'bg-[#00204A] text-[#8CF3F3]'
                                  : item.status === 'Delivered'
                                  ? 'bg-[#8CF3F3] text-[#007070]'
                                  : 'bg-[#006A6A] text-white'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {renderStatusActionButton(item, true)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Reports View */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <section className="space-y-1">
                <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                  Logistics Reports
                </h1>
                <p className="font-sans text-base text-[#44474F]">
                  Operational aggregates derived directly from PostgreSQL database query.
                </p>
              </section>

              {!reportsData ? (
                <div className="bg-white border border-[#C4C6D0] rounded-lg p-8 text-center shadow-2xs">
                  <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#006A6A]" />
                  <p className="text-[#44474F]">Loading reports data from database...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Aggregates Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs">
                      <div className="flex items-center gap-3 mb-2 text-[#44474F]">
                        <Truck className="w-5 h-5 text-[#006A6A]" />
                        <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">Total Assigned</h3>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline font-bold text-3xl text-[#181C1C]">{reportsData.total_assigned_shipments}</span>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs">
                      <div className="flex items-center gap-3 mb-2 text-[#44474F]">
                        <ClipboardList className="w-5 h-5 text-[#006A6A]" />
                        <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">Unassigned Available</h3>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline font-bold text-3xl text-[#181C1C]">{reportsData.unassigned_available}</span>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs">
                      <div className="flex items-center gap-3 mb-2 text-[#44474F]">
                        <Navigation className="w-5 h-5 text-[#006A6A]" />
                        <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">In Transit</h3>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline font-bold text-3xl text-[#181C1C]">{reportsData.in_transit}</span>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs">
                      <div className="flex items-center gap-3 mb-2 text-[#44474F]">
                        <CheckCircle2 className="w-5 h-5 text-[#006A6A]" />
                        <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">Delivered</h3>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline font-bold text-3xl text-[#181C1C]">{reportsData.delivered}</span>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs">
                      <div className="flex items-center gap-3 mb-2 text-[#44474F]">
                        <CheckSquare className="w-5 h-5 text-[#006A6A]" />
                        <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">Confirmed Completed</h3>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline font-bold text-3xl text-[#181C1C]">{reportsData.confirmed_completed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Digital Product Passports Document Registry */}
                  <div className="bg-white border border-[#C4C6D0] rounded-xl p-6 space-y-4 shadow-2xs">
                    <div className="flex justify-between items-center border-b border-[#C4C6D0] pb-4">
                      <div>
                        <h3 className="font-headline font-semibold text-lg text-[#181C1C] flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-[#006A6A]" />
                          Digital Product Passports &amp; Recycling Certificates
                        </h3>
                        <p className="font-sans text-xs text-[#44474F]">
                          Dynamic database-backed documents generated from Digital Product Passport (DPP) system.
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-[#F1F4F3] border border-[#C4C6D0] font-mono text-xs text-[#181C1C] rounded-full">
                        {dppList.length} Registered Passports
                      </span>
                    </div>

                    {dppLoading ? (
                      <div className="py-8 text-center text-[#44474F]">
                        <RotateCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#006A6A]" />
                        <p className="font-sans text-xs">Loading Digital Product Passports...</p>
                      </div>
                    ) : dppList.length === 0 ? (
                      <div className="py-12 px-4 text-center border-2 border-dashed border-[#C4C6D0] rounded-lg bg-[#F7FAF9]">
                        <FileText className="w-10 h-10 mx-auto text-[#006A6A] mb-3 opacity-60" />
                        <h4 className="font-sans font-semibold text-base text-[#181C1C] mb-1">
                          No digital reports available yet.
                        </h4>
                        <p className="font-sans text-xs text-[#44474F] max-w-md mx-auto">
                          Digital Product Passports and Recycling Certificates will appear here as shipments are processed and status updates occur.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-[#F1F4F3] font-mono text-xs text-[#44474F] uppercase tracking-wider">
                            <tr>
                              <th className="p-3.5">Document ID</th>
                              <th className="p-3.5">Document Type</th>
                              <th className="p-3.5">Tracking Number</th>
                              <th className="p-3.5">Material</th>
                              <th className="p-3.5">Status</th>
                              <th className="p-3.5">Generated</th>
                              <th className="p-3.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="font-sans text-sm divide-y divide-[#C4C6D0]">
                            {dppList.map((dpp) => (
                              <tr key={dpp.id} className="hover:bg-[#F7FAF9] transition-colors">
                                <td className="p-3.5 font-mono font-medium text-[#181C1C] text-xs">
                                  {dpp.document_id}
                                </td>
                                <td className="p-3.5 text-[#181C1C] font-medium">
                                  {dpp.document_type}
                                </td>
                                <td className="p-3.5 font-mono text-xs text-[#44474F]">
                                  {dpp.tracking_number}
                                </td>
                                <td className="p-3.5 text-[#181C1C]">
                                  {dpp.material_type} ({dpp.quantity} {dpp.unit})
                                </td>
                                <td className="p-3.5">
                                  <span className="px-2.5 py-0.5 bg-[#8CF3F3] text-[#007070] text-xs font-mono font-medium rounded">
                                    {dpp.status}
                                  </span>
                                </td>
                                <td className="p-3.5 text-xs text-[#44474F]">
                                  {new Date(dpp.generated_at).toLocaleDateString()}
                                </td>
                                <td className="p-3.5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setSelectedViewDppId(dpp.id)}
                                      className="px-3 py-1.5 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
                                    >
                                      View
                                    </button>
                                    <button
                                      onClick={() => dppApi.downloadDPPPdf(dpp.id, false)}
                                      className="px-3 py-1.5 bg-[#006A6A] text-white rounded font-mono text-xs hover:bg-[#004F4F] transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                      <Download className="w-3 h-3" />
                                      PDF
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                Assign Driver &amp; Vehicle (#{selectedShipmentDbId})
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

      {/* DPP View Modal */}
      {selectedViewDppId && (
        <DPPViewModal
          dppId={selectedViewDppId}
          onClose={() => setSelectedViewDppId(null)}
        />
      )}
    </div>
  );
};


