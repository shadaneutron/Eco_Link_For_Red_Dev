import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Scale,
  MapPin,
  FileText,
  Filter,
  Plus,
  Eye,
  Edit,
  X,
  CheckCircle2,
  Tag,
  ArrowLeft,
  Star,
  Brain,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { EditListingPage, ListingData } from './EditListingPage';
import { OffersListPage } from './OffersListPage';

interface MarketplacePageProps {
  onListNewBatch?: () => void;
}

interface MarketplaceListing {
  id: string;
  title: string;
  category: string;
  quantity: string;
  location: string;
  offersCount: number;
  status: 'Live' | 'Paused' | 'Draft' | 'Completed';
  imageUrl: string;
  description: string;
  createdDate: string;
  publishedAgo: string;
  viewsCount: number;
  detectedMaterial: string;
  confidence: string;
  hazardLevel: string;
  carbonSaving: string;
}

interface OfferItem {
  company: string;
  rating: number;
  amount: string;
  pickup: string;
  status: 'Pending' | 'Reviewing' | 'Accepted' | 'Declined';
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ onListNewBatch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'offers'>('newest');

  const [activeFilterDropdown, setActiveFilterDropdown] = useState<'category' | 'status' | 'location' | 'sort' | null>(null);
  
  // Detail view state, Edit state & Offers list state
  const [viewingDetailId, setViewingDetailId] = useState<string | null>(null);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [viewingOffersListingId, setViewingOffersListingId] = useState<string | null>(null);

  const [listings, setListings] = useState<MarketplaceListing[]>([
    {
      id: '1',
      title: 'Steel Scrap',
      category: 'Ferrous Metal',
      quantity: '2.3 Tons',
      location: '10th of Ramadan City',
      offersCount: 6,
      status: 'Live',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      description: 'High-quality industrial steel scrap collected from manufacturing offcuts. Primarily composed of carbon steel with minimal surface oxidation. Sorted and ready for pickup. Material is stored in a dry, covered area to prevent further corrosion.',
      createdDate: '15 July 2026',
      publishedAgo: '2 Days Ago',
      viewsCount: 245,
      detectedMaterial: 'Steel Scrap',
      confidence: '96%',
      hazardLevel: 'Non-Hazardous',
      carbonSaving: '1.4 t CO₂'
    },
    {
      id: '2',
      title: 'HDPE Pellets',
      category: 'Plastic Polymer',
      quantity: '0.8 Tons',
      location: 'Sadat City',
      offersCount: 3,
      status: 'Live',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
      description: 'Reprocessed clean high-density polyethylene regrind pellets ready for molding.',
      createdDate: '12 July 2026',
      publishedAgo: '4 Days Ago',
      viewsCount: 180,
      detectedMaterial: 'HDPE Polymer',
      confidence: '94%',
      hazardLevel: 'Non-Hazardous',
      carbonSaving: '0.9 t CO₂'
    },
    {
      id: '3',
      title: 'Aluminum Cuts',
      category: 'Non-Ferrous Metal',
      quantity: '1.5 Tons',
      location: 'Obour City',
      offersCount: 12,
      status: 'Paused',
      imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
      description: 'Extruded aluminum profile trimmings suitable for immediate re-melting.',
      createdDate: '08 July 2026',
      publishedAgo: '1 Week Ago',
      viewsCount: 410,
      detectedMaterial: 'Aluminum 6061',
      confidence: '98%',
      hazardLevel: 'Non-Hazardous',
      carbonSaving: '2.8 t CO₂'
    },
    {
      id: '4',
      title: 'Copper Wire Offcuts',
      category: 'Non-Ferrous Metal',
      quantity: '0.5 Tons',
      location: 'Dubai Industrial City',
      offersCount: 8,
      status: 'Live',
      imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80',
      description: 'High purity stripped copper wiring and busbar scraps.',
      createdDate: '02 July 2026',
      publishedAgo: '2 Weeks Ago',
      viewsCount: 320,
      detectedMaterial: 'Pure Copper',
      confidence: '97%',
      hazardLevel: 'Non-Hazardous',
      carbonSaving: '1.1 t CO₂'
    }
  ]);

  const offers: OfferItem[] = [
    { company: 'Global Recyclers Ltd.', rating: 4.8, amount: '$450.00', pickup: '24h', status: 'Pending' },
    { company: 'EcoSteel Solutions', rating: 4.5, amount: '$435.00', pickup: '48h', status: 'Reviewing' },
    { company: 'Metals & More', rating: 4.2, amount: '$420.00', pickup: '12h', status: 'Reviewing' }
  ];

  const currentListing = listings.find((l) => l.id === viewingDetailId);

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'All' || item.status === selectedStatus;

    const matchesLocation =
      selectedLocation === 'All' || item.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  const editingItem = listings.find((l) => l.id === editingListingId);
  const offersListingItem = listings.find((l) => l.id === viewingOffersListingId);

  // -------------------------------------------------------------
  // OFFERS LIST VIEW (Matching Exact Figma / Design Mockup)
  // -------------------------------------------------------------
  if (viewingOffersListingId && offersListingItem) {
    return (
      <OffersListPage
        listingName={offersListingItem.title}
        listingQuantity={offersListingItem.quantity}
        listingStatus={offersListingItem.status}
        totalOffersCount={offersListingItem.offersCount}
        onBack={() => setViewingOffersListingId(null)}
        onPauseListing={() => {
          const newStatus = offersListingItem.status === 'Live' ? 'Paused' : 'Live';
          setListings(
            listings.map((item) =>
              item.id === offersListingItem.id ? { ...item, status: newStatus } : item
            )
          );
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // EDIT LISTING VIEW (Matching Exact Figma / Design Mockup)
  // -------------------------------------------------------------
  if (editingListingId && editingItem) {
    return (
      <EditListingPage
        initialData={{
          id: editingItem.id,
          wasteName: editingItem.title,
          wasteCategory: editingItem.category,
          estimatedQuantity: editingItem.quantity,
          originLocation: editingItem.location,
          shortDescription: editingItem.description,
          status: editingItem.status,
          publishedAgo: editingItem.publishedAgo,
          viewsCount: editingItem.viewsCount,
          offersCount: editingItem.offersCount
        }}
        onBack={() => setEditingListingId(null)}
        onSaveSuccess={(updated) => {
          setListings(
            listings.map((item) =>
              item.id === updated.id
                ? {
                    ...item,
                    title: updated.wasteName,
                    category: updated.wasteCategory,
                    quantity: updated.estimatedQuantity,
                    location: updated.originLocation,
                    description: updated.shortDescription,
                    status: updated.status
                  }
                : item
            )
          );
          setEditingListingId(null);
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // DETAIL VIEW (Matching Exact Figma / Design Mockup)
  // -------------------------------------------------------------
  if (viewingDetailId && currentListing) {
    return (
      <div className="space-y-6 font-sans bg-[#F7FAF9] text-[#181C1C]">
        {/* Top Header / Back Link */}
        <section className="space-y-2">
          <button
            type="button"
            onClick={() => setViewingDetailId(null)}
            className="inline-flex items-center gap-2 font-mono text-xs font-medium text-[#006A6A] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>
          <div>
            <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
              Listing Details
            </h1>
            <p className="font-sans text-base text-[#44474F]">
              View and manage this waste listing.
            </p>
          </div>
        </section>

        {/* 2-Column Responsive Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery Card */}
            <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg overflow-hidden shadow-2xs">
              <div className="h-80 bg-[#E0E3E2] flex items-center justify-center overflow-hidden relative">
                <img
                  src={currentListing.imageUrl}
                  alt={currentListing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex gap-4 bg-[#F7FAF9] border-t border-[#C4C6D0]">
                <div className="w-24 h-24 bg-[#E0E3E2] rounded flex items-center justify-center border border-[#C4C6D0] overflow-hidden">
                  <img src={currentListing.imageUrl} alt="Thumb 1" className="w-full h-full object-cover" />
                </div>
                <div className="w-24 h-24 bg-[#E0E3E2] rounded flex items-center justify-center border border-[#C4C6D0] overflow-hidden">
                  <ImageIcon className="w-6 h-6 text-[#44474F]" />
                </div>
                <div className="w-24 h-24 bg-[#E0E3E2] rounded flex items-center justify-center border border-[#C4C6D0] overflow-hidden">
                  <ImageIcon className="w-6 h-6 text-[#44474F]" />
                </div>
              </div>
            </div>

            {/* Listing Description Card */}
            <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
              <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
                Listing Description
              </h2>
              <p className="font-sans text-base text-[#44474F] leading-relaxed">
                {currentListing.description}
              </p>
            </div>

            {/* Latest Offers Card */}
            <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
              <div className="flex justify-between items-center">
                <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
                  Latest Offers
                </h2>
                <button
                  type="button"
                  onClick={() => setViewingOffersListingId(currentListing.id)}
                  className="text-[#006A6A] font-mono text-xs font-medium hover:underline cursor-pointer"
                >
                  View All Offers
                </button>
              </div>

              <div className="space-y-3">
                {offers.map((offer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border border-[#C4C6D0] rounded bg-white"
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-medium text-[#181C1C]">
                        {offer.company}
                      </span>
                      <div className="flex items-center gap-1 text-[#006A6A]">
                        <Star className="w-3.5 h-3.5 fill-[#006A6A]" />
                        <span className="font-sans text-xs font-medium">
                          {offer.rating}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-base font-semibold text-[#181C1C]">
                        {offer.amount}
                      </span>
                      <p className="font-sans text-xs text-[#44474F]">
                        Pickup: {offer.pickup}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium ${
                        offer.status === 'Pending'
                          ? 'bg-[#80F9CA] text-[#00513B]'
                          : 'bg-[#E0E3E2] text-[#44474F]'
                      }`}
                    >
                      {offer.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Column (1 Col) */}
          <div className="space-y-6">
            {/* Listing Details Card */}
            <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
              <div className="flex justify-between items-start">
                <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
                  {currentListing.title}
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#80F9CA] text-[#00513B]">
                  {currentListing.status}
                </span>
              </div>

              <div className="space-y-2 border-t border-[#C4C6D0] pt-4 text-sm font-sans">
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Category</span>
                  <span className="font-medium text-[#181C1C]">{currentListing.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Quantity</span>
                  <span className="font-medium text-[#181C1C]">{currentListing.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Location</span>
                  <span className="font-medium text-[#181C1C]">{currentListing.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Published</span>
                  <span className="font-medium text-[#181C1C]">{currentListing.publishedAgo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Views</span>
                  <span className="font-medium text-[#181C1C]">{currentListing.viewsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474F]">Offers</span>
                  <span className="font-medium text-[#181C1C]">{currentListing.offersCount}</span>
                </div>
              </div>
            </div>

            {/* Classification Details Card (Dark Navy #00204A) */}
            <div className="bg-[#00204A] text-white border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#7189B8]" />
                <h2 className="font-mono text-sm font-semibold text-[#7189B8]">
                  Classification Details
                </h2>
              </div>
              <div className="space-y-2 border-t border-[#7189B8]/20 pt-4 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-[#7189B8]">Detected Material</span>
                  <span className="font-medium text-white">{currentListing.detectedMaterial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7189B8]">Confidence</span>
                  <span className="font-medium text-white">{currentListing.confidence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7189B8]">Hazard Level</span>
                  <span className="font-medium text-white">{currentListing.hazardLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7189B8]">Carbon Saving</span>
                  <span className="font-medium text-white">{currentListing.carbonSaving}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setViewingOffersListingId(currentListing.id)}
                className="w-full py-3 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors cursor-pointer text-center"
              >
                View All Offers
              </button>
              <button
                type="button"
                onClick={() => setEditingListingId(currentListing.id)}
                className="w-full py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center"
              >
                Edit Listing
              </button>
              <button
                type="button"
                onClick={() => {
                  const newStatus = currentListing.status === 'Live' ? 'Paused' : 'Live';
                  setListings(listings.map(l => l.id === currentListing.id ? { ...l, status: newStatus } : l));
                }}
                className="w-full py-3 border border-[#BA1A1A]/30 text-[#BA1A1A] rounded font-mono text-xs font-medium hover:bg-[#FFDAD6]/50 transition-colors cursor-pointer text-center"
              >
                {currentListing.status === 'Live' ? 'Pause Listing' : 'Resume Listing'}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN MARKETPLACE GRID VIEW
  // -------------------------------------------------------------
  return (
    <div className="space-y-8 font-sans bg-[#F7FAF9] text-[#181C1C]">
      {/* Page Header */}
      <section className="space-y-1">
        <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
          Marketplace
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          Manage your published waste listings.
        </p>
      </section>

      {/* Search & Filter Controls */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Box */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#44474F] w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search listings..."
            className="w-full h-10 pl-10 pr-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C] placeholder-[#44474F] transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Waste Category Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setActiveFilterDropdown(
                  activeFilterDropdown === 'category' ? null : 'category'
                )
              }
              className={`px-4 py-1.5 border border-[#C4C6D0] rounded-full font-mono text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedCategory !== 'All'
                  ? 'bg-[#00204A] text-[#8CF3F3] border-[#00204A]'
                  : 'bg-white text-[#181C1C] hover:bg-[#E6E9E8]'
              }`}
            >
              <span>Category: {selectedCategory}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {activeFilterDropdown === 'category' && (
              <div className="absolute left-0 mt-1 w-48 bg-white border border-[#C4C6D0] rounded shadow-md z-20 py-1 font-mono text-xs">
                {['All', 'Ferrous Metal', 'Non-Ferrous Metal', 'Plastic Polymer'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setActiveFilterDropdown(null);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#F1F4F3] text-[#181C1C]"
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setActiveFilterDropdown(
                  activeFilterDropdown === 'status' ? null : 'status'
                )
              }
              className={`px-4 py-1.5 border border-[#C4C6D0] rounded-full font-mono text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedStatus !== 'All'
                  ? 'bg-[#00204A] text-[#8CF3F3] border-[#00204A]'
                  : 'bg-white text-[#181C1C] hover:bg-[#E6E9E8]'
              }`}
            >
              <span>Status: {selectedStatus}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {activeFilterDropdown === 'status' && (
              <div className="absolute left-0 mt-1 w-36 bg-white border border-[#C4C6D0] rounded shadow-md z-20 py-1 font-mono text-xs">
                {['All', 'Live', 'Paused'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setSelectedStatus(st);
                      setActiveFilterDropdown(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#F1F4F3] text-[#181C1C]"
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setActiveFilterDropdown(
                  activeFilterDropdown === 'location' ? null : 'location'
                )
              }
              className={`px-4 py-1.5 border border-[#C4C6D0] rounded-full font-mono text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedLocation !== 'All'
                  ? 'bg-[#00204A] text-[#8CF3F3] border-[#00204A]'
                  : 'bg-white text-[#181C1C] hover:bg-[#E6E9E8]'
              }`}
            >
              <span>Location: {selectedLocation}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {activeFilterDropdown === 'location' && (
              <div className="absolute left-0 mt-1 w-48 bg-white border border-[#C4C6D0] rounded shadow-md z-20 py-1 font-mono text-xs">
                {['All', '10th of Ramadan City', 'Sadat City', 'Obour City', 'Dubai Industrial City'].map(
                  (loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setActiveFilterDropdown(null);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#F1F4F3] text-[#181C1C]"
                    >
                      {loc}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setActiveFilterDropdown(
                  activeFilterDropdown === 'sort' ? null : 'sort'
                )
              }
              className="px-4 py-1.5 border border-[#C4C6D0] bg-white rounded-full font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Sort</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#181C1C]" />
            </button>
            {activeFilterDropdown === 'sort' && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-[#C4C6D0] rounded shadow-md z-20 py-1 font-mono text-xs">
                <button
                  onClick={() => {
                    setSortBy('newest');
                    setActiveFilterDropdown(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F1F4F3] text-[#181C1C]"
                >
                  Newest First
                </button>
                <button
                  onClick={() => {
                    setSortBy('offers');
                    setActiveFilterDropdown(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F1F4F3] text-[#181C1C]"
                >
                  Most Offers
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Summary Metrics Section (4 Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between h-22 shadow-2xs">
          <p className="font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider">
            TOTAL LISTINGS
          </p>
          <p className="font-headline font-semibold text-2xl text-[#181C1C]">12</p>
        </div>

        <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between h-22 shadow-2xs">
          <p className="font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider">
            ACTIVE LISTINGS
          </p>
          <p className="font-headline font-semibold text-2xl text-[#181C1C]">8</p>
        </div>

        <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between h-22 shadow-2xs">
          <p className="font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider">
            PENDING OFFERS
          </p>
          <p className="font-headline font-semibold text-2xl text-[#181C1C]">14</p>
        </div>

        <div className="p-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg flex flex-col justify-between h-22 shadow-2xs">
          <p className="font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider">
            COMPLETED LISTINGS
          </p>
          <p className="font-headline font-semibold text-2xl text-[#181C1C]">25</p>
        </div>
      </section>

      {/* Listing Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div
            key={item.id}
            className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg overflow-hidden shadow-2xs flex flex-col justify-between hover:border-[#006A6A] transition-colors"
          >
            {/* Top Image Container */}
            <div className="relative h-40 bg-[#E0E3E2] overflow-hidden flex items-center justify-center">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                {/* Title & Status Badge */}
                <div className="flex justify-between items-start">
                  <h3 className="font-sans font-semibold text-lg text-[#181C1C]">
                    {item.title}
                  </h3>
                  {item.status === 'Live' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#80F9CA] text-[#00513B]">
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E0E3E2] text-[#44474F]">
                      Paused
                    </span>
                  )}
                </div>

                {/* Sub-category tag */}
                <p className="font-mono text-xs font-medium text-[#44474F] tracking-wide">
                  {item.category}
                </p>

                {/* Metadata items */}
                <div className="pt-2 space-y-1 text-sm font-sans text-[#44474F]">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#44474F]" />
                    <span>{item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#44474F]" />
                    <span>{item.location}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewingOffersListingId(item.id)}
                    className="flex items-center gap-2 text-[#006A6A] hover:underline cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#006A6A]" />
                    <span className="font-medium">{item.offersCount} Offers</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex gap-2 border-t border-[#C4C6D0]/60">
                <button
                  type="button"
                  onClick={() => setViewingDetailId(item.id)}
                  className="flex-1 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors cursor-pointer text-center"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => setEditingListingId(item.id)}
                  className="flex-1 py-2 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center"
                >
                  Edit Listing
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

