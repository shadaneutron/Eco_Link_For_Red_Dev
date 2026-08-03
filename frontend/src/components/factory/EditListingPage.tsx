import React, { useState } from 'react';
import {
  ArrowLeft,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Camera,
  CheckCircle2,
  Save,
  Clock
} from 'lucide-react';

export interface ListingData {
  id: string;
  wasteName: string;
  wasteCategory: string;
  estimatedQuantity: string;
  wasteCondition: string;
  factoryBranch: string;
  originLocation: string;
  pickupDate: string;
  shortDescription: string;
  images: string[];
  status: 'Live' | 'Paused' | 'Draft';
  publishedAgo: string;
  viewsCount: number;
  offersCount: number;
  lastUpdated: string;
}

interface EditListingPageProps {
  initialData?: Partial<ListingData>;
  onBack: () => void;
  onSaveSuccess: (updatedData: ListingData) => void;
}

export const EditListingPage: React.FC<EditListingPageProps> = ({
  initialData,
  onBack,
  onSaveSuccess
}) => {
  // Form State initialized with defaults from mockup
  const [wasteName, setWasteName] = useState(initialData?.wasteName || 'Steel Scrap');
  const [wasteCategory, setWasteCategory] = useState(initialData?.wasteCategory || 'Ferrous Metal');
  const [estimatedQuantity, setEstimatedQuantity] = useState(initialData?.estimatedQuantity || '2.3 Tons');
  const [wasteCondition, setWasteCondition] = useState(initialData?.wasteCondition || 'Sorted');
  const [factoryBranch, setFactoryBranch] = useState(initialData?.factoryBranch || 'Main Factory');
  const [originLocation, setOriginLocation] = useState(initialData?.originLocation || '10th of Ramadan City');
  const [pickupDate, setPickupDate] = useState(initialData?.pickupDate || '2026-11-15');
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription ||
      'High-quality industrial steel scrap collected from manufacturing offcuts. Primarily composed of carbon steel with minimal surface oxidation.'
  );

  const [images, setImages] = useState<string[]>(
    initialData?.images || [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80'
    ]
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleImageDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    showToast('Image removed from listing');
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: File[] = Array.from(e.target.files);
      const newUrls = newFiles.map((file: File) => URL.createObjectURL(file));
      setImages([...images, ...newUrls]);
      showToast(`Added ${newFiles.length} new image(s)`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ListingData = {
      id: initialData?.id || '1',
      wasteName,
      wasteCategory,
      estimatedQuantity,
      wasteCondition,
      factoryBranch,
      originLocation,
      pickupDate,
      shortDescription,
      images,
      status: (initialData?.status as 'Live' | 'Paused' | 'Draft') || 'Live',
      publishedAgo: initialData?.publishedAgo || '2 Days Ago',
      viewsCount: initialData?.viewsCount || 245,
      offersCount: initialData?.offersCount || 6,
      lastUpdated: 'Just now'
    };

    onSaveSuccess(updated);
  };

  return (
    <div className="space-y-8 font-sans bg-[#F7FAF9] text-[#181C1C] min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#000A1F] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-[#8CF3F3]" />
          <span className="font-sans text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header with Back button */}
      <section className="space-y-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 font-mono text-xs font-medium text-[#006A6A] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
        <div>
          <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
            Edit Listing
          </h1>
          <p className="font-sans text-base text-[#44474F]">
            Update your waste listing information before receiving new offers.
          </p>
        </div>
      </section>

      {/* Main Grid: Form Left (2 Cols), Status Right (1 Col) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-6 shadow-2xs">
            <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Waste Name */}
              <div className="space-y-1">
                <label className="font-mono text-xs font-medium text-[#181C1C] block">
                  Waste Name
                </label>
                <input
                  type="text"
                  value={wasteName}
                  onChange={(e) => setWasteName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C]"
                  required
                />
              </div>

              {/* Waste Category */}
              <div className="space-y-1">
                <label className="font-mono text-xs font-medium text-[#181C1C] block">
                  Waste Category
                </label>
                <select
                  value={wasteCategory}
                  onChange={(e) => setWasteCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C] cursor-pointer"
                >
                  <option value="Ferrous Metal">Ferrous Metal</option>
                  <option value="Non-Ferrous Metal">Non-Ferrous Metal</option>
                  <option value="Plastic Polymer">Plastic Polymer</option>
                  <option value="Paper & Cardboard">Paper & Cardboard</option>
                  <option value="Glass">Glass</option>
                </select>
              </div>

              {/* Estimated Quantity */}
              <div className="space-y-1">
                <label className="font-mono text-xs font-medium text-[#181C1C] block">
                  Estimated Quantity
                </label>
                <input
                  type="text"
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C]"
                  required
                />
              </div>

              {/* Waste Condition */}
              <div className="space-y-1">
                <label className="font-mono text-xs font-medium text-[#181C1C] block">
                  Waste Condition
                </label>
                <select
                  value={wasteCondition}
                  onChange={(e) => setWasteCondition(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C] cursor-pointer"
                >
                  <option value="Sorted">Sorted</option>
                  <option value="Mixed">Mixed</option>
                  <option value="Raw">Raw</option>
                  <option value="Baled / Compressed">Baled / Compressed</option>
                </select>
              </div>

              {/* Factory Branch */}
              <div className="space-y-1">
                <label className="font-mono text-xs font-medium text-[#181C1C] block">
                  Factory Branch
                </label>
                <select
                  value={factoryBranch}
                  onChange={(e) => setFactoryBranch(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C] cursor-pointer"
                >
                  <option value="Main Factory">Main Factory</option>
                  <option value="North Branch">North Branch</option>
                  <option value="South Plant">South Plant</option>
                </select>
              </div>

              {/* Origin Location */}
              <div className="space-y-1">
                <label className="font-mono text-xs font-medium text-[#181C1C] block">
                  Origin Location
                </label>
                <input
                  type="text"
                  value={originLocation}
                  onChange={(e) => setOriginLocation(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C]"
                  required
                />
              </div>

              {/* Pickup Date (Full Width) */}
              <div className="space-y-1 md:col-span-2">
                <label className="font-mono text-xs font-medium text-[#181C1C] block">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C]"
                  required
                />
              </div>

              {/* Short Description (Full Width) */}
              <div className="space-y-1 md:col-span-2">
                <label className="font-mono text-xs font-medium text-[#181C1C] block">
                  Short Description
                </label>
                <textarea
                  rows={4}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full p-3 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C] leading-relaxed"
                  required
                />
              </div>
            </div>
          </div>

          {/* Card 2: Image Management */}
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
            <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
              Image Management
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-square bg-[#E0E3E2] rounded overflow-hidden border border-[#C4C6D0]"
                >
                  <img src={imgUrl} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-[#000A1F]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => showToast(`Selected photo ${idx + 1} for preview`)}
                      className="p-1.5 bg-[#F7FAF9] rounded-full text-[#181C1C] hover:text-[#006A6A] transition-colors cursor-pointer"
                      title="Preview"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImageDelete(idx)}
                      className="p-1.5 bg-[#F7FAF9] rounded-full text-[#BA1A1A] hover:bg-[#FFDAD6] transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Dashed Button */}
              <label className="aspect-square border-2 border-dashed border-[#C4C6D0] rounded flex flex-col items-center justify-center text-[#44474F] hover:bg-[#F1F4F3] transition-colors cursor-pointer">
                <Camera className="w-6 h-6 text-[#44474F]" />
                <span className="font-sans text-xs font-medium mt-1">Add New</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Bottom Footer Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-end pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => showToast('Draft saved successfully!')}
              className="px-6 py-3 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer text-center"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors shadow-xs cursor-pointer text-center"
            >
              Update Listing
            </button>
          </div>
        </div>

        {/* Right Sidebar Column (1 Col) - Current Listing Status */}
        <div className="space-y-6">
          <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
            <div className="flex justify-between items-start">
              <h2 className="font-headline font-semibold text-2xl text-[#181C1C] leading-snug">
                Current Listing<br />Status
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#80F9CA] text-[#00513B]">
                {initialData?.status || 'Live'}
              </span>
            </div>

            <div className="space-y-3 border-t border-[#C4C6D0] pt-4 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-[#44474F]">Published</span>
                <span className="font-medium text-[#181C1C]">{initialData?.publishedAgo || '2 Days Ago'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Views</span>
                <span className="font-medium text-[#181C1C]">{initialData?.viewsCount || 245}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Offers</span>
                <span className="font-medium text-[#181C1C]">{initialData?.offersCount || 6}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474F]">Last Updated</span>
                <span className="font-medium text-[#181C1C]">{initialData?.lastUpdated || 'Today'}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
