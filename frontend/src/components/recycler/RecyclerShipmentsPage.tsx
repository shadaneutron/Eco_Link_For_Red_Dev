import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { RecyclerShipmentDetailTrackingPage } from './RecyclerShipmentDetailTrackingPage';
import { shipmentsApi } from '../../services/api';

interface RecyclerShipmentsPageProps {
  onGoToWonAuctions?: () => void;
  onGoToReports?: () => void;
  onGoToDashboard?: () => void;
  onTrackShipmentDetail?: (shipmentId: string) => void;
}

export const RecyclerShipmentsPage: React.FC<RecyclerShipmentsPageProps> = ({
  onGoToWonAuctions,
  onGoToReports,
  onGoToDashboard,
  onTrackShipmentDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Waste Category');
  const [factoryFilter, setFactoryFilter] = useState('Factory');
  const [statusFilter, setStatusFilter] = useState('Shipment Status');
  const [dateFilter, setDateFilter] = useState('Date');
  const [sortBy, setSortBy] = useState('Sort By: Newest');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewingDetailId, setViewingDetailId] = useState<string | null>(null);
  const [selectedTrackingShipment, setSelectedTrackingShipment] = useState<any | null>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadShipments() {
      try {
        setIsLoading(true);
        const res = await shipmentsApi.getShipments();
        const data = Array.isArray(res) ? res : (res as any)?.results || [];
        setShipments(data);
      } catch (err) {
        console.error('Failed to load recycler shipments:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadShipments();
  }, []);

  const handleDownloadManifest = (title: string) => {
    setToastMessage(`Manifest for ${title} downloaded successfully.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (viewingDetailId) {
    return (
      <RecyclerShipmentDetailTrackingPage
        shipmentId={viewingDetailId}
        onBack={() => setViewingDetailId(null)}
        onGoToReports={onGoToReports}
        onGoToDashboard={onGoToDashboard}
      />
    );
  }

  const activeShipmentsCount = shipments.filter(s => s.status !== 'Confirmed').length;
  const awaitingPickupCount = shipments.filter(s => s.status === 'Pending').length;
  const inTransitCount = shipments.filter(s => s.status === 'In Transit' || s.status === 'Driver Assigned' || s.status === 'Weighed').length;
  const deliveredCount = shipments.filter(s => s.status === 'Confirmed' || s.status === 'Delivered').length;

  return (
    <div className="space-y-8 bg-[#F7FAF9]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#000A1F] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-[#8CF3F3]" />
          <span className="font-sans text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Title & Description */}
      <section className="space-y-1">
        <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
          My Shipments
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          Track the progress of all shipments related to your won auctions.
        </p>
      </section>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Active Shipments</p>
          <p className="font-sans text-2xl font-semibold text-[#006A6A] mt-1">{isLoading ? '...' : activeShipmentsCount}</p>
        </div>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Awaiting Pickup</p>
          <p className="font-sans text-2xl font-semibold text-[#181C1C] mt-1">{isLoading ? '...' : awaitingPickupCount}</p>
        </div>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">In Transit</p>
          <p className="font-sans text-2xl font-semibold text-[#181C1C] mt-1">{isLoading ? '...' : inTransitCount}</p>
        </div>
        <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-4 shadow-2xs">
          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">Delivered</p>
          <p className="font-sans text-2xl font-semibold text-[#181C1C] mt-1">{isLoading ? '...' : deliveredCount}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-[#F7FAF9] p-4 border border-[#C4C6D0] rounded-lg shadow-2xs">
        <div className="flex flex-1 min-w-[200px] relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#44474F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Shipment..."
            className="w-full pl-10 pr-3 py-2 bg-[#F1F4F3] border border-[#C4C6D0] rounded font-sans text-sm text-[#181C1C] placeholder-[#6B7280] focus:border-[#006A6A] focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Waste Category">Waste Category</option>
            <option value="Ferrous Metal">Ferrous Metal</option>
            <option value="Recyclables">Recyclables</option>
            <option value="Copper Cables">Copper Cables</option>
          </select>

          <select
            value={factoryFilter}
            onChange={(e) => setFactoryFilter(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Factory">Factory Origin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Shipment Status">Shipment Status</option>
            <option value="Driver Assigned">Driver Assigned</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Date">Date</option>
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="This Week">This Week</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded px-3 py-1.5 font-sans text-sm text-[#181C1C] focus:border-[#006A6A] focus:outline-none cursor-pointer"
          >
            <option value="Sort By: Newest">Sort By: Newest</option>
            <option value="Progress">Progress</option>
            <option value="Eta">ETA</option>
          </select>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Shipment Cards */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="p-8 text-center bg-white border border-[#C4C6D0] rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#006A6A] mb-2" />
              <p className="font-sans text-sm text-[#44474F]">Loading shipments...</p>
            </div>
          ) : shipments.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#C4C6D0] rounded-lg space-y-3">
              <p className="font-sans text-base font-medium text-[#181C1C]">No Shipments Found</p>
              <p className="font-sans text-sm text-[#44474F]">No active or historical shipments found for your won auctions.</p>
            </div>
          ) : (
            shipments.map((s) => {
              const shipmentCode = `SH-${s.id}`;
              const title = s.auction_details?.listing_details?.title || s.tracking_number || `Shipment #${s.id}`;
              const category = s.auction_details?.listing_details?.material_type || 'Industrial Waste';
              const driver = s.driver_details ? `${s.driver_details.first_name} ${s.driver_details.last_name}` : (s.carrier || 'Driver Assigned');
              const quantity = s.auction_details?.listing_details?.quantity ? `${s.auction_details.listing_details.quantity} Tons` : 'N/A';
              const progressPct = s.status === 'Confirmed' || s.status === 'Delivered' ? 100 : s.status === 'In Transit' ? 75 : s.status === 'Weighed' ? 50 : 25;

              return (
                <div key={s.id} className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-sans font-semibold text-lg text-[#181C1C]">
                        {shipmentCode} | {title}
                      </h3>
                      <p className="font-sans text-sm text-[#44474F]">Factory • {category}</p>
                    </div>
                    <span className="px-3 py-1 bg-[#8CF3F3] text-[#007070] font-mono text-xs font-semibold rounded-full">
                      {s.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 font-sans text-sm">
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">DRIVER / CARRIER</p>
                      <p className="font-medium text-[#181C1C]">{driver}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">QUANTITY</p>
                      <p className="font-medium text-[#181C1C]">{quantity}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">STATUS</p>
                      <p className="font-medium text-[#181C1C]">{s.status}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">UPDATED</p>
                      <p className="font-medium text-[#181C1C]">{s.updated_at ? new Date(s.updated_at).toLocaleDateString() : 'Recent'}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-[#44474F]">Progress</span>
                      <span className="font-semibold text-[#181C1C]">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-[#E0E3E2] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#006A6A] h-full transition-all duration-300" style={{ width: `${progressPct}%` }}></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {s.status === 'Delivered' && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await shipmentsApi.confirmShipment(s.id);
                            setToastMessage(`Receipt confirmed for shipment #${s.id}! Escrow released.`);
                            const res = await shipmentsApi.getShipments();
                            const data = Array.isArray(res) ? res : (res as any)?.results || [];
                            setShipments(data);
                          } catch (err: any) {
                            setToastMessage(err?.message || 'Error confirming receipt.');
                          }
                        }}
                        className="flex-1 min-w-[120px] py-2 bg-[#006A6A] text-white rounded font-mono text-xs font-semibold hover:bg-[#004F4F] transition-colors cursor-pointer text-center shadow-xs"
                      >
                        Confirm Receipt
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setViewingDetailId(String(s.id))}
                      className="flex-1 min-w-[120px] py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer text-center shadow-xs"
                    >
                      Track Shipment
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingDetailId(String(s.id))}
                      className="flex-1 min-w-[120px] py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center bg-white"
                    >
                      Shipment Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadManifest(title)}
                      className="flex-1 min-w-[120px] py-2 border border-[#C4C6D0] rounded font-mono text-xs font-semibold text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center bg-white"
                    >
                      Download Manifest
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Bottom Action Navigation */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onGoToWonAuctions}
              className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
            >
              Won Auctions
            </button>
            <button
              onClick={onGoToReports}
              className="px-6 py-2.5 border border-[#C4C6D0] rounded font-mono text-sm text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer bg-white"
            >
              Reports
            </button>
          </div>
        </div>

        {/* Right Column: Shipment Summary Panel */}
        <aside className="space-y-6">
          <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-5 space-y-4 shadow-2xs">
            <h2 className="font-sans font-semibold text-base text-[#181C1C]">
              Shipment Summary
            </h2>
            <div className="space-y-3 font-sans text-sm text-[#44474F]">
              <div className="flex justify-between">
                <span>Total Active Shipments</span>
                <span className="font-medium text-[#181C1C]">{activeShipmentsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Upcoming Pickups</span>
                <span className="font-medium text-[#181C1C]">{awaitingPickupCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Deliveries</span>
                <span className="font-medium text-[#181C1C]">{deliveredCount}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Shipment Tracking Modal Drawer */}
      {selectedTrackingShipment && (
        <div className="fixed inset-0 z-50 bg-[#000A1F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 max-w-xl w-full space-y-5 shadow-2xl relative animate-scaleIn">
            <div className="flex justify-between items-center pb-3 border-b border-[#C4C6D0]">
              <div>
                <span className="font-mono text-xs text-[#006A6A] font-semibold">{selectedTrackingShipment.id}</span>
                <h3 className="font-sans font-bold text-xl text-[#181C1C]">{selectedTrackingShipment.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTrackingShipment(null)}
                className="text-[#44474F] hover:text-[#181C1C] cursor-pointer font-bold px-2 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 font-sans text-sm">
              <div className="p-3 bg-[#F1F4F3] rounded border border-[#C4C6D0]">
                <p className="font-mono text-xs text-[#44474F] uppercase">Assigned Driver</p>
                <p className="font-semibold text-[#181C1C] mt-1">{selectedTrackingShipment.driver}</p>
              </div>
              <div className="p-3 bg-[#F1F4F3] rounded border border-[#C4C6D0]">
                <p className="font-mono text-xs text-[#44474F] uppercase">Current Status</p>
                <p className="font-semibold text-[#006A6A] mt-1">{selectedTrackingShipment.status}</p>
              </div>
            </div>

            {/* Live Progress Stage */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs text-[#181C1C]">
                <span>Logistics Timeline</span>
                <span className="font-bold text-[#006A6A]">{selectedTrackingShipment.progress}% Complete</span>
              </div>
              <div className="w-full bg-[#E0E3E2] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#006A6A] h-full transition-all duration-500"
                  style={{ width: `${selectedTrackingShipment.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm font-sans text-[#181C1C]">
                <CheckCircle2 className="w-5 h-5 text-[#006A6A] shrink-0" />
                <span>Dispatch order confirmed & manifest generated</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-sans text-[#181C1C]">
                <Truck className="w-5 h-5 text-[#006A6A] shrink-0" />
                <span>Logistics vehicle assigned (TransEco Logistics #408)</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-sans text-[#44474F]">
                <MapPin className="w-[#181C1C] w-5 h-5 text-[#44474F] shrink-0" />
                <span>In-transit to Recycler processing facility</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C4C6D0] flex justify-end gap-3">
              <button
                onClick={() => setSelectedTrackingShipment(null)}
                className="px-5 py-2.5 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] cursor-pointer"
              >
                Close Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
