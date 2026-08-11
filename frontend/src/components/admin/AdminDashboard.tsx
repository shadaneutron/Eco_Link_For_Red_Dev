import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';
import {
  adminApi,
  listingsApi,
  auctionsApi,
  transactionsApi,
  shipmentsApi,
  dppApi,
  AdminStatsResponse,
  WasteListingResponse,
  AuctionResponse,
  TransactionResponse,
  ShipmentResponse,
  DPPListItemResponse
} from '../../services/api';
import { User } from '../../types';
import { DPPViewModal } from '../common/DPPViewModal';
import {
  ShieldCheck,
  Users,
  Building2,
  Recycle,
  Truck,
  Package,
  Gavel,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  LogOut,
  Search,
  Activity,
  Layers,
  FileText,
  Eye,
  Download
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToHome?: () => void;
  onOpenLogin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToHome,
  onOpenLogin
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'marketplace' | 'transactions' | 'shipments' | 'reports'>('overview');
  
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [listings, setListings] = useState<WasteListingResponse[]>([]);
  const [auctions, setAuctions] = useState<AuctionResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [shipments, setShipments] = useState<ShipmentResponse[]>([]);
  const [dppList, setDppList] = useState<DPPListItemResponse[]>([]);
  const [selectedDppId, setSelectedDppId] = useState<number | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes, listingsRes, auctionsRes, txsRes, shipmentsRes, dppsRes] = await Promise.all([
        adminApi.getStats().catch(() => null),
        adminApi.getUsers().catch(() => []),
        listingsApi.getListings().catch(() => []),
        auctionsApi.getAuctions().catch(() => []),
        transactionsApi.getTransactions().catch(() => []),
        shipmentsApi.getShipments().catch(() => []),
        dppApi.getDPPs().catch(() => [])
      ]);

      if (statsRes) setStats(statsRes);
      setUsersList(usersRes || []);
      setListings(listingsRes || []);
      setAuctions(auctionsRes || []);
      setTransactions(txsRes || []);
      setShipments(shipmentsRes || []);
      setDppList(dppsRes || []);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      setError(err?.message || 'Failed to fetch platform metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    logout();
    if (onOpenLogin) onOpenLogin();
    else if (onBackToHome) onBackToHome();
  };

  const filteredUsers = usersList.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#181C1C] font-sans flex flex-col">
      {/* Top Header */}
      <header className="bg-[#000A1F] text-white border-b border-[#00204A] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Eco Link Logo" className="h-8 w-auto object-contain bg-white/10 p-1 rounded-lg" />
            <div>
              <div className="font-headline font-semibold text-lg text-white flex items-center gap-2">
                Enterprise Governance <ShieldCheck className="w-4 h-4 text-[#8CF3F3]" />
              </div>
              <p className="text-[11px] font-mono text-[#8CF3F3]/80">System-Wide Operational Control & Telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white">{user?.full_name || user?.email || 'Platform Admin'}</p>
              <p className="text-[10px] font-mono text-[#8CF3F3] uppercase">Role: {user?.role || 'admin'}</p>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-[#C4C6D0] sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
          <div className="flex space-x-1 py-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#000A1F] text-white'
                  : 'text-[#44474F] hover:bg-[#EBEEED]'
              }`}
            >
              <Activity className="w-4 h-4 text-[#8CF3F3]" /> Platform Overview
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#000A1F] text-white'
                  : 'text-[#44474F] hover:bg-[#EBEEED]'
              }`}
            >
              <Users className="w-4 h-4 text-[#8CF3F3]" /> Users &amp; Roles ({usersList.length})
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'marketplace'
                  ? 'bg-[#000A1F] text-white'
                  : 'text-[#44474F] hover:bg-[#EBEEED]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#8CF3F3]" /> Marketplace ({listings.length})
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-[#000A1F] text-white'
                  : 'text-[#44474F] hover:bg-[#EBEEED]'
              }`}
            >
              <DollarSign className="w-4 h-4 text-[#8CF3F3]" /> Escrow &amp; Deals ({transactions.length})
            </button>

            <button
              onClick={() => setActiveTab('shipments')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'shipments'
                  ? 'bg-[#000A1F] text-white'
                  : 'text-[#44474F] hover:bg-[#EBEEED]'
              }`}
            >
              <Truck className="w-4 h-4 text-[#8CF3F3]" /> Shipments ({shipments.length})
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#000A1F] text-white'
                  : 'text-[#44474F] hover:bg-[#EBEEED]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#8CF3F3]" /> DPP Registry ({dppList.length})
            </button>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="px-3 py-1.5 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#000A1F] hover:bg-[#EBEEED] flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-sans">
            {error}
          </div>
        )}

        {/* Tab 1: Platform Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-[#C4C6D0] pb-4">
              <div>
                <h1 className="font-headline font-semibold text-2xl text-[#000A1F]">Real-Time Platform Performance Metrics</h1>
                <p className="text-xs font-mono text-[#006A6A]">Calculated directly from PostgreSQL single source of truth database records.</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-[#006A6A]">
                  <span className="font-mono text-xs uppercase font-medium">Total Registered Users</span>
                  <Users className="w-5 h-5" />
                </div>
                <p className="font-mono text-3xl font-bold text-[#000A1F]">{stats?.total_users ?? 0}</p>
                <div className="text-[11px] text-[#44474F] font-mono flex gap-2">
                  <span>F: {stats?.factories_count ?? 0}</span>
                  <span>R: {stats?.recyclers_count ?? 0}</span>
                  <span>L: {stats?.logistics_count ?? 0}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-[#006A6A]">
                  <span className="font-mono text-xs uppercase font-medium">Active Listings</span>
                  <Package className="w-5 h-5" />
                </div>
                <p className="font-mono text-3xl font-bold text-[#000A1F]">{stats?.active_listings ?? 0}</p>
                <p className="text-[11px] text-[#44474F] font-mono">Published Waste Streams</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-[#006A6A]">
                  <span className="font-mono text-xs uppercase font-medium">Active Auctions</span>
                  <Gavel className="w-5 h-5" />
                </div>
                <p className="font-mono text-3xl font-bold text-[#000A1F]">{stats?.active_auctions ?? 0}</p>
                <p className="text-[11px] text-[#44474F] font-mono">Open Bidding Pools</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-[#006A6A]">
                  <span className="font-mono text-xs uppercase font-medium">Active Shipments</span>
                  <Truck className="w-5 h-5" />
                </div>
                <p className="font-mono text-3xl font-bold text-[#000A1F]">{stats?.active_shipments ?? 0}</p>
                <p className="text-[11px] text-[#44474F] font-mono">In Transit / Pending</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#006A6A] bg-[#8CF3F3]/10 shadow-2xs space-y-2 col-span-2 sm:col-span-1">
                <div className="flex justify-between items-center text-[#006A6A]">
                  <span className="font-mono text-xs uppercase font-medium">5% Commission Earned</span>
                  <DollarSign className="w-5 h-5" />
                </div>
                <p className="font-mono text-2xl font-bold text-[#006A6A]">
                  {Number(stats?.platform_commission_total || 0).toLocaleString()} EGP
                </p>
                <p className="text-[11px] text-[#006A6A] font-mono">Completed Deals: {stats?.completed_deals ?? 0}</p>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-[#C4C6D0] space-y-4">
                <h3 className="font-headline font-semibold text-base text-[#000A1F] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#006A6A]" /> Registered Factories ({stats?.factories_count ?? 0})
                </h3>
                <p className="text-xs text-[#44474F]">
                  Industrial manufacturing clients who generate registered byproduct streams under Law No. 202 compliance.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#C4C6D0] space-y-4">
                <h3 className="font-headline font-semibold text-base text-[#000A1F] flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-[#006A6A]" /> Verified Recyclers ({stats?.recyclers_count ?? 0})
                </h3>
                <p className="text-xs text-[#44474F]">
                  Certified material re-processors submitting competitive bids for industrial waste commodities.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#C4C6D0] space-y-4">
                <h3 className="font-headline font-semibold text-base text-[#000A1F] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#006A6A]" /> Logistics Fleets ({stats?.logistics_count ?? 0})
                </h3>
                <p className="text-xs text-[#44474F]">
                  Licensed transport providers fulfilling hazardous and non-hazardous custody chain manifests.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users List */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-headline font-semibold text-2xl text-[#000A1F]">Registered Platform Users</h1>
                <p className="text-xs font-mono text-[#006A6A]">Real authenticated user profiles persisted in PostgreSQL database.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#44474F] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search user, email, role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-[#C4C6D0] rounded-lg text-xs font-mono focus:outline-none focus:border-[#006A6A] bg-white"
                />
              </div>
            </div>

            <div className="bg-white border border-[#C4C6D0] rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#F7FAF9] border-b border-[#C4C6D0] font-mono text-[#000A1F] uppercase">
                    <tr>
                      <th className="p-4">User ID</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Company Name</th>
                      <th className="p-4">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E3EC]">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[#44474F] font-mono">
                          No registered users found matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#F1F4F3] transition-colors">
                          <td className="p-4 font-mono font-bold text-[#006A6A]">#{u.id}</td>
                          <td className="p-4 font-semibold text-[#000A1F]">{u.full_name || 'N/A'}</td>
                          <td className="p-4 font-mono text-[#44474F]">{u.email}</td>
                          <td className="p-4 font-mono">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold ${
                              u.role === 'factory' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              u.role === 'recycler' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                              u.role === 'logistics' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-[#000A1F]">{u.company_name || '—'}</td>
                          <td className="p-4 font-mono text-[#44474F]">{u.phone || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Marketplace Monitoring */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-headline font-semibold text-2xl text-[#000A1F]">Marketplace Listings &amp; Auctions</h1>
              <p className="text-xs font-mono text-[#006A6A]">Monitoring active waste streams and bidding pools across all factories.</p>
            </div>

            <div className="bg-white border border-[#C4C6D0] rounded-xl overflow-hidden shadow-2xs">
              <div className="p-4 bg-[#F7FAF9] border-b border-[#C4C6D0] font-mono text-xs font-bold text-[#000A1F]">
                Active Waste Listings ({listings.length})
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#F7FAF9] border-b border-[#C4C6D0] font-mono text-[#000A1F] uppercase">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Material</th>
                      <th className="p-4">Quantity</th>
                      <th className="p-4">Factory</th>
                      <th className="p-4">Min Bid</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E3EC]">
                    {listings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#44474F] font-mono">
                          No waste listings in database.
                        </td>
                      </tr>
                    ) : (
                      listings.map((l) => (
                        <tr key={l.id} className="hover:bg-[#F1F4F3] transition-colors">
                          <td className="p-4 font-mono font-bold text-[#006A6A]">#{l.id}</td>
                          <td className="p-4 font-semibold text-[#000A1F]">{l.title}</td>
                          <td className="p-4 text-[#44474F]">{l.material_type}</td>
                          <td className="p-4 font-mono">{l.quantity} {l.unit}</td>
                          <td className="p-4 text-[#000A1F]">{l.factory_company_name || `Factory #${l.factory}`}</td>
                          <td className="p-4 font-mono">{Number(l.min_bid_price).toLocaleString()} EGP</td>
                          <td className="p-4 font-mono">
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#E0F2F1] text-[#006A6A]">
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Transactions */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-headline font-semibold text-2xl text-[#000A1F]">Platform Financial Deals &amp; Escrow</h1>
              <p className="text-xs font-mono text-[#006A6A]">All transactions where Recycler (Buyer) pays Factory (Seller) with 5% platform escrow.</p>
            </div>

            <div className="bg-white border border-[#C4C6D0] rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#F7FAF9] border-b border-[#C4C6D0] font-mono text-[#000A1F] uppercase">
                    <tr>
                      <th className="p-4">TX ID</th>
                      <th className="p-4">Listing</th>
                      <th className="p-4">Seller (Factory)</th>
                      <th className="p-4">Buyer (Recycler)</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">5% Commission</th>
                      <th className="p-4">95% Payout</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E3EC]">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[#44474F] font-mono">
                          No recorded transactions in database.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-[#F1F4F3] transition-colors">
                          <td className="p-4 font-mono font-bold text-[#006A6A]">#{tx.id}</td>
                          <td className="p-4 font-semibold text-[#000A1F]">{tx.listing?.title || `Auction #${tx.auction}`}</td>
                          <td className="p-4 text-[#000A1F]">{tx.seller_name || tx.factory_name || `Factory #${tx.factory}`}</td>
                          <td className="p-4 text-[#000A1F]">{tx.buyer_name || tx.recycler_name || `Recycler #${tx.recycler}`}</td>
                          <td className="p-4 font-mono font-bold">{Number(tx.amount).toLocaleString()} EGP</td>
                          <td className="p-4 font-mono text-[#B78103] font-bold">{Number(tx.platform_commission).toLocaleString()} EGP</td>
                          <td className="p-4 font-mono text-[#006A6A] font-bold">{Number(tx.factory_amount).toLocaleString()} EGP</td>
                          <td className="p-4 font-mono uppercase font-bold text-xs">{tx.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Shipments */}
        {activeTab === 'shipments' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-headline font-semibold text-2xl text-[#000A1F]">Platform Logistics Tracking</h1>
              <p className="text-xs font-mono text-[#006A6A]">Real-time tracking of active shipments from Factory to Recycler.</p>
            </div>

            <div className="bg-white border border-[#C4C6D0] rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#F7FAF9] border-b border-[#C4C6D0] font-mono text-[#000A1F] uppercase">
                    <tr>
                      <th className="p-4">Tracking #</th>
                      <th className="p-4">Item</th>
                      <th className="p-4">Origin (Factory)</th>
                      <th className="p-4">Destination (Recycler)</th>
                      <th className="p-4">Carrier</th>
                      <th className="p-4">Driver / Vehicle</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E3EC]">
                    {shipments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#44474F] font-mono">
                          No active shipments in database.
                        </td>
                      </tr>
                    ) : (
                      shipments.map((s) => (
                        <tr key={s.id} className="hover:bg-[#F1F4F3] transition-colors">
                          <td className="p-4 font-mono font-bold text-[#006A6A]">{s.tracking_number || `#${s.id}`}</td>
                          <td className="p-4 font-semibold text-[#000A1F]">{s.listing_title}</td>
                          <td className="p-4 text-[#000A1F]">{s.factory_name}</td>
                          <td className="p-4 text-[#000A1F]">{s.recycler_name}</td>
                          <td className="p-4 text-[#44474F]">{s.logistics_name}</td>
                          <td className="p-4 font-mono text-[#44474F]">
                            {s.driver_name ? `${s.driver_name} (${s.vehicle})` : 'Unassigned'}
                          </td>
                          <td className="p-4 font-mono uppercase font-bold text-xs text-[#006A6A]">{s.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Digital Product Passport Registry */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#C4C6D0] pb-4">
              <div>
                <h1 className="font-headline font-semibold text-2xl text-[#000A1F] flex items-center gap-2">
                  System Digital Product Passport Registry <ShieldCheck className="w-6 h-6 text-[#006A6A]" />
                </h1>
                <p className="font-sans text-xs text-[#44474F]">
                  Authoritative database-backed registry of all passports across Factories, Recyclers, and Carriers.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#C4C6D0] rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-[#F1F4F3] border-b border-[#C4C6D0]">
                    <tr className="font-mono text-xs font-bold text-[#44474F]">
                      <th className="p-4">Document ID</th>
                      <th className="p-4">Tracking #</th>
                      <th className="p-4">Material</th>
                      <th className="p-4">Quantity</th>
                      <th className="p-4">Shipment Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E3EC] text-sm">
                    {dppList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[#44474F] font-mono">
                          No Digital Passports found in database.
                        </td>
                      </tr>
                    ) : (
                      dppList.map((d) => (
                        <tr key={d.id} className="hover:bg-[#F1F4F3] transition-colors">
                          <td className="p-4 font-mono font-bold text-[#006A6A]">{d.document_id}</td>
                          <td className="p-4 font-mono text-xs text-[#44474F]">{d.tracking_number}</td>
                          <td className="p-4 font-semibold text-[#000A1F]">{d.material_type}</td>
                          <td className="p-4 font-mono text-[#000A1F]">{d.quantity} {d.unit}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] rounded font-mono text-[10px] font-bold">
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedDppId(d.id)}
                              className="px-3 py-1 bg-[#006A6A] text-white rounded font-mono text-xs font-semibold hover:bg-[#004F4F] transition-colors inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> Inspect
                            </button>
                            <button
                              onClick={() => dppApi.downloadDPPPdf(d.id, false)}
                              className="px-3 py-1 border border-[#C4C6D0] bg-white text-[#181C1C] rounded font-mono text-xs font-semibold hover:bg-[#EBEEED] transition-colors inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" /> PDF
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DPP View Modal */}
      {selectedDppId && (
        <DPPViewModal
          dppId={selectedDppId}
          onClose={() => setSelectedDppId(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#C4C6D0] py-4 text-center text-xs font-mono text-[#44474F]">
        EcoLink Enterprise Platform Governance • Law No. 202 Compliance Enforced • PostgreSQL DB Single Source of Truth
      </footer>
    </div>
  );
};
