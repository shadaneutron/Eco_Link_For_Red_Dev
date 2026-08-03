import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  UploadCloud,
  Trash2,
  RotateCw,
  Check,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Store,
  LayoutGrid,
  PlusCircle
} from 'lucide-react';

interface UploadWastePageProps {
  onCancel: () => void;
  onSubmitSuccess: (newBatch: { type: string; quantity: string }) => void;
}

export const UploadWastePage: React.FC<UploadWastePageProps> = ({
  onCancel,
  onSubmitSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<number>(5); // Default to Step 5 (Publish Success) to match prompt

  // Form states
  const [wasteName, setWasteName] = useState('Steel Scrap');
  const [category, setCategory] = useState('Ferrous Metal');
  const [estQuantity, setEstQuantity] = useState('2.3');
  const [unit, setUnit] = useState('Tons');
  const [condition, setCondition] = useState<'sorted' | 'mixed'>('sorted');
  const [factoryBranch, setFactoryBranch] = useState('Main Factory');
  const [pickupDate, setPickupDate] = useState('2026-07-15');
  const [description, setDescription] = useState('Industrial steel scrap generated from production.');

  // Step 2 & 3 Image States (4 images for 2x2 grid in Step 3)
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80'
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: File[] = Array.from(e.target.files);
      const newUrls = newFiles.map((file: File) => URL.createObjectURL(file));
      setImages([...images, ...newUrls]);
      setToastMessage(`Uploaded ${newFiles.length} photo(s) successfully.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setToastMessage('Image removed.');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAddSampleImage = () => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80'
    ];
    const nextUrl = sampleUrls[images.length % sampleUrls.length];
    setImages([...images, nextUrl]);
    setToastMessage('Sample scrap photo added.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleContinue = () => {
    if (currentStep < 5) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next === 3) {
        setToastMessage('Step 2 saved! Running Material Classification & Purity Analysis...');
      } else if (next === 4) {
        setToastMessage('Analysis complete! Review compliance before publishing.');
      } else if (next === 5) {
        setToastMessage('Batch verified. Ready to publish to EcoLink Marketplace.');
      }
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      // Publish
      onSubmitSuccess({
        type: wasteName || 'Industrial Waste Batch',
        quantity: `${estQuantity} ${unit}`
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const handleSaveDraft = () => {
    setToastMessage('Draft batch saved to your account!');
    setTimeout(() => {
      setToastMessage(null);
      onCancel();
    }, 1500);
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Toast alert */}
      {toastMessage && (
        <div className="bg-[#00204A] text-[#8CF3F3] border border-[#8CF3F3]/30 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-mono shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#80F9CA]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <section>
        <h1 className="font-headline font-semibold text-3xl text-[#181C1C] mb-1">
          Upload New Waste
        </h1>
        <p className="font-sans text-base text-[#44474F]">
          {currentStep === 1 && 'Step 1: Provide basic details about the waste batch.'}
          {currentStep === 2 && 'Step 2: Upload clear images of the waste batch for analysis.'}
          {currentStep === 3 && 'Step 3: Material Classification & purity score validation.'}
          {currentStep === 4 && 'Step 4: Final compliance verification before publishing.'}
          {currentStep === 5 && 'Step 5: Publish batch to EcoLink B2B Marketplace.'}
        </p>
      </section>

      {/* Horizontal Stepper Bar (5 Steps) */}
      <nav aria-label="Progress">
        <ol className="flex items-center w-full justify-between">
          {/* Step 1 */}
          <li
            onClick={() => setCurrentStep(1)}
            className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="flex items-center w-full">
              <div className={`w-full h-0.5 ${currentStep > 1 ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'}`} />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm shrink-0 transition-colors ${
                  currentStep === 1
                    ? 'bg-[#000A1F] text-white shadow-xs'
                    : currentStep > 1
                    ? 'bg-[#006A6A] text-white'
                    : 'bg-[#E6E9E8] text-[#44474F]'
                }`}
              >
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div className={`w-full h-0.5 ${currentStep >= 1 ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'}`} />
            </div>
            <span
              className={`font-mono text-xs transition-colors ${
                currentStep === 1
                  ? 'text-[#181C1C] font-semibold'
                  : currentStep > 1
                  ? 'text-[#006A6A] font-medium'
                  : 'text-[#44474F]'
              }`}
            >
              Waste Info
            </span>
          </li>

          {/* Step 2 */}
          <li
            onClick={() => setCurrentStep(2)}
            className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="flex items-center w-full">
              <div className={`w-full h-0.5 ${currentStep > 2 ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'}`} />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm shrink-0 transition-colors ${
                  currentStep === 2
                    ? 'bg-[#000A1F] text-white shadow-xs'
                    : currentStep > 2
                    ? 'bg-[#006A6A] text-white'
                    : 'bg-[#E6E9E8] text-[#44474F]'
                }`}
              >
                {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <div className={`w-full h-0.5 ${currentStep >= 2 ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'}`} />
            </div>
            <span
              className={`font-mono text-xs transition-colors ${
                currentStep === 2
                  ? 'text-[#181C1C] font-semibold'
                  : currentStep > 2
                  ? 'text-[#006A6A] font-medium'
                  : 'text-[#44474F]'
              }`}
            >
              Upload Images
            </span>
          </li>

          {/* Step 3 */}
          <li
            onClick={() => setCurrentStep(3)}
            className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="flex items-center w-full">
              <div className={`w-full h-0.5 ${currentStep > 3 ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'}`} />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm shrink-0 transition-colors ${
                  currentStep === 3
                    ? 'bg-[#000A1F] text-white shadow-xs'
                    : currentStep > 3
                    ? 'bg-[#006A6A] text-white'
                    : 'bg-[#E6E9E8] text-[#44474F]'
                }`}
              >
                {currentStep > 3 ? <Check className="w-4 h-4" /> : '3'}
              </div>
              <div className={`w-full h-0.5 ${currentStep >= 3 ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'}`} />
            </div>
            <span
              className={`font-mono text-xs text-center transition-colors ${
                currentStep === 3
                  ? 'text-[#181C1C] font-semibold'
                  : currentStep > 3
                  ? 'text-[#006A6A] font-medium'
                  : 'text-[#44474F]'
              }`}
            >
              Material Classification
            </span>
          </li>

          {/* Step 4 */}
          <li
            onClick={() => setCurrentStep(4)}
            className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="flex items-center w-full">
              <div className={`w-full h-0.5 ${currentStep > 4 ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'}`} />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm shrink-0 transition-colors ${
                  currentStep === 4
                    ? 'bg-[#000A1F] text-white shadow-xs'
                    : currentStep > 4
                    ? 'bg-[#006A6A] text-white'
                    : 'bg-[#E6E9E8] text-[#44474F]'
                }`}
              >
                {currentStep > 4 ? <Check className="w-4 h-4" /> : '4'}
              </div>
              <div className={`w-full h-0.5 ${currentStep >= 4 ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'}`} />
            </div>
            <span
              className={`font-mono text-xs transition-colors ${
                currentStep === 4
                  ? 'text-[#181C1C] font-semibold'
                  : currentStep > 4
                  ? 'text-[#006A6A] font-medium'
                  : 'text-[#44474F]'
              }`}
            >
              Review
            </span>
          </li>

          {/* Step 5 */}
          <li
            onClick={() => setCurrentStep(5)}
            className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="flex items-center w-full">
              <div className={`w-full h-0.5 ${currentStep > 5 ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'}`} />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm shrink-0 transition-colors ${
                  currentStep === 5
                    ? 'bg-[#000A1F] text-white shadow-xs'
                    : 'bg-[#E6E9E8] text-[#44474F]'
                }`}
              >
                5
              </div>
              <div className={`w-full h-0.5 ${currentStep >= 5 ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'}`} />
            </div>
            <span
              className={`font-mono text-xs transition-colors ${
                currentStep === 5
                  ? 'text-[#181C1C] font-semibold'
                  : 'text-[#44474F]'
              }`}
            >
              Publish
            </span>
          </li>
        </ol>
      </nav>

      {/* Step 1: Waste Info */}
      {currentStep === 1 && (
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 shadow-xs">
          <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-xs font-medium text-[#181C1C] tracking-wide mb-2">
                    Waste Name
                  </label>
                  <input
                    type="text"
                    value={wasteName}
                    onChange={(e) => setWasteName(e.target.value)}
                    placeholder="e.g. Mixed Steel Scrap"
                    required
                    className="w-full h-10 px-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-medium text-[#181C1C] tracking-wide mb-2">
                    Waste Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C] appearance-none"
                    >
                      <option value="">Select Category</option>
                      <option value="Metals">Metals</option>
                      <option value="Plastics">Plastics</option>
                      <option value="Hazardous">Hazardous</option>
                      <option value="Paper & Packaging">Paper & Packaging</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#747780] pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-medium text-[#181C1C] tracking-wide mb-2">
                      Est. Quantity
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={estQuantity}
                      onChange={(e) => setEstQuantity(e.target.value)}
                      placeholder="0.0"
                      required
                      className="w-full h-10 px-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-medium text-[#181C1C] tracking-wide mb-2">
                      Unit
                    </label>
                    <div className="relative">
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full h-10 px-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C] appearance-none"
                      >
                        <option value="Tons">Tons</option>
                        <option value="Liters">Liters</option>
                        <option value="Kgs">Kgs</option>
                        <option value="Barrels">Barrels</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#747780] pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-xs font-medium text-[#181C1C] tracking-wide mb-2">
                    Waste Condition
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCondition('sorted')}
                      className={`flex-1 flex items-center justify-center h-10 border rounded transition-colors cursor-pointer text-sm font-sans ${
                        condition === 'sorted'
                          ? 'bg-[#8CF3F3] border-[#006A6A] text-[#007070] font-semibold'
                          : 'bg-[#F1F4F3] border-[#C4C6D0] text-[#181C1C] hover:bg-[#E6E9E8]'
                      }`}
                    >
                      Sorted
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondition('mixed')}
                      className={`flex-1 flex items-center justify-center h-10 border rounded transition-colors cursor-pointer text-sm font-sans ${
                        condition === 'mixed'
                          ? 'bg-[#8CF3F3] border-[#006A6A] text-[#007070] font-semibold'
                          : 'bg-[#F1F4F3] border-[#C4C6D0] text-[#181C1C] hover:bg-[#E6E9E8]'
                      }`}
                    >
                      Mixed
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-medium text-[#181C1C] tracking-wide mb-2">
                    Origin Factory Branch
                  </label>
                  <div className="relative">
                    <select
                      value={factoryBranch}
                      onChange={(e) => setFactoryBranch(e.target.value)}
                      className="w-full h-10 px-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C] appearance-none"
                    >
                      <option value="Main Factory - Dubai Industrial City">
                        Main Factory - Dubai Industrial City
                      </option>
                      <option value="Abu Dhabi Branch">Abu Dhabi Branch</option>
                      <option value="Sharjah Facility">Sharjah Facility</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#747780] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-medium text-[#181C1C] tracking-wide mb-2">
                    Pickup Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full h-10 px-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Description */}
            <div>
              <label className="block font-mono text-xs font-medium text-[#181C1C] tracking-wide mb-2">
                Short Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the contents, composition, or any handling requirements..."
                className="w-full p-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C] min-h-[100px]"
              />
            </div>
          </form>
        </section>
      )}

      {/* Step 2: Upload Images Section (Matching Provided Mockup) */}
      {currentStep === 2 && (
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 shadow-xs space-y-6">
          <div>
            <h2 className="font-headline font-semibold text-2xl text-[#181C1C] mb-1">
              Upload Images
            </h2>
            <p className="font-sans text-sm text-[#44474F]">
              Upload clear images of the waste batch for analysis.
            </p>
          </div>

          {/* Drag & Drop Box */}
          <label className="border-2 border-dashed border-[#C4C6D0] rounded-lg p-8 flex flex-col items-center justify-center gap-3 bg-[#F1F4F3] hover:bg-[#E6E9E8] transition-colors cursor-pointer relative group">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <UploadCloud className="w-12 h-12 text-[#44474F] group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <p className="font-sans text-base text-[#181C1C]">
                Drag &amp; Drop Images Here or{' '}
                <span className="text-[#006A6A] font-semibold underline">Browse Files</span>
              </p>
              <p className="font-mono text-xs text-[#44474F] mt-1">
                Supported: JPG, PNG, JPEG | Max 10 images | Max 10 MB each
              </p>
            </div>
          </label>

          {/* Quick Sample Add Action */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddSampleImage}
              className="font-mono text-xs font-medium text-[#006A6A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              + Add Sample Photo
            </button>
          </div>

          {/* Uploaded Images Thumbnails Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {images.map((imgUrl, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded overflow-hidden border border-[#C4C6D0] bg-[#E6E9E8]"
              >
                <img
                  src={imgUrl}
                  alt={`Waste Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Image Badge for 1st Image */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-[#006A6A] text-white px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide shadow-xs z-10">
                    Primary Image
                  </div>
                )}

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    title="Delete Image"
                    className="w-8 h-8 rounded-full bg-[#F7FAF9] flex items-center justify-center text-[#181C1C] hover:bg-[#BA1A1A] hover:text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setToastMessage(`Re-assessing image #${index + 1}...`);
                      setTimeout(() => setToastMessage(null), 2000);
                    }}
                    title="Refresh Image"
                    className="w-8 h-8 rounded-full bg-[#F7FAF9] flex items-center justify-center text-[#181C1C] hover:bg-[#006A6A] hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Step 3: Material Classification (Exact Match to Design Mockup) */}
      {currentStep === 3 && (
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Uploaded Images Grid */}
            <div>
              <h2 className="font-headline font-semibold text-2xl text-[#181C1C] mb-4">
                Uploaded Images
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {images.slice(0, 4).map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded overflow-hidden border border-[#C4C6D0] bg-[#E6E9E8]"
                  >
                    <img
                      src={imgUrl}
                      alt={`Uploaded Waste ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <div className="absolute top-2 left-2 bg-[#006A6A] text-white px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide z-10">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Material Classification Result Box & Manual Override */}
            <div className="space-y-6">
              {/* Cyan Status Box */}
              <div className="bg-[#8CF3F3]/30 p-4 rounded-lg border border-[#8CF3F3] space-y-4">
                <h3 className="font-headline font-semibold text-xl text-[#007070] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#007070]" />
                  <span>Classification Result</span>
                </h3>

                <div className="space-y-2 text-sm font-sans">
                  <div className="flex justify-between border-b border-[#C4C6D0]/80 pb-1.5">
                    <span className="text-[#44474F]">Detected Material</span>
                    <span className="text-[#181C1C] font-semibold">Steel Scrap</span>
                  </div>
                  <div className="flex justify-between border-b border-[#C4C6D0]/80 pb-1.5">
                    <span className="text-[#44474F]">Confidence</span>
                    <span className="text-[#006A6A] font-semibold">96%</span>
                  </div>
                  <div className="flex justify-between border-b border-[#C4C6D0]/80 pb-1.5">
                    <span className="text-[#44474F]">Waste Category</span>
                    <span className="text-[#181C1C] font-normal">{category}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#C4C6D0]/80 pb-1.5">
                    <span className="text-[#44474F]">Hazard Level</span>
                    <span className="text-[#181C1C] font-normal">Non-Hazardous</span>
                  </div>
                  <div className="flex justify-between border-b border-[#C4C6D0]/80 pb-1.5">
                    <span className="text-[#44474F]">Estimated Quantity</span>
                    <span className="text-[#181C1C] font-normal">2.3 Tons</span>
                  </div>
                  <div className="flex justify-between border-b border-[#C4C6D0]/80 pb-1.5">
                    <span className="text-[#44474F]">Suggested Recycling</span>
                    <span className="text-[#181C1C] font-normal">Steel Recycling</span>
                  </div>
                  <div className="flex justify-between border-b border-[#C4C6D0]/80 pb-1.5">
                    <span className="text-[#44474F]">Marketplace Eligibility</span>
                    <span className="text-[#181C1C] font-normal">Eligible</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-[#44474F]">Carbon Saving Estimate</span>
                    <span className="text-[#181C1C] font-normal">1.4 t CO2</span>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="pt-2 border-t border-[#8CF3F3] space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#44474F]">Confidence Bar</span>
                    <span className="text-[#006A6A] font-semibold">96%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E6E9E8] rounded-full overflow-hidden">
                    <div className="h-full bg-[#006A6A] w-[96%]" />
                  </div>
                  <p className="text-[10px] text-[#006A6A] font-mono">
                    High confidence prediction.
                  </p>
                </div>
              </div>

              {/* Manual Override Section */}
              <div className="pt-4 border-t border-[#C4C6D0] space-y-3">
                <h4 className="font-mono text-xs font-medium text-[#181C1C] tracking-wide uppercase">
                  Manual Override
                </h4>
                <div className="space-y-1">
                  <label className="block font-sans text-xs text-[#44474F]">
                    Change Waste Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-4 bg-[#F7FAF9] border border-[#C4C6D0] rounded focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] font-sans text-sm text-[#181C1C] appearance-none cursor-pointer"
                    >
                      <option value="Ferrous Metal">Ferrous Metal</option>
                      <option value="Non-Ferrous Metal">Non-Ferrous Metal</option>
                      <option value="Plastic">Plastic</option>
                      <option value="Paper/Cardboard">Paper/Cardboard</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#747780] pointer-events-none" />
                  </div>
                  <p className="text-[10px] font-sans text-[#44474F]">
                    Use only if the classification is incorrect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: Compliance & Review (Matching Design Mockup) */}
      {currentStep === 4 && (
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 shadow-xs space-y-6">
          {/* Section 1: Waste Information */}
          <div className="flex justify-between items-start border-b border-[#C4C6D0] pb-6">
            <div className="flex-1 space-y-3 pr-4">
              <h3 className="font-headline font-semibold text-2xl text-[#181C1C]">
                Waste Information
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm font-sans">
                <div>
                  <span className="text-xs text-[#44474F] font-mono uppercase block">Waste Name</span>
                  <span className="text-base text-[#181C1C]">{wasteName}</span>
                </div>
                <div>
                  <span className="text-xs text-[#44474F] font-mono uppercase block">Waste Category</span>
                  <span className="text-base text-[#181C1C]">{category}</span>
                </div>
                <div>
                  <span className="text-xs text-[#44474F] font-mono uppercase block">Quantity</span>
                  <span className="text-base text-[#181C1C]">{estQuantity} {unit}</span>
                </div>
                <div>
                  <span className="text-xs text-[#44474F] font-mono uppercase block">Condition</span>
                  <span className="text-base text-[#181C1C] capitalize">{condition}</span>
                </div>
                <div>
                  <span className="text-xs text-[#44474F] font-mono uppercase block">Factory Branch</span>
                  <span className="text-base text-[#181C1C]">{factoryBranch}</span>
                </div>
                <div>
                  <span className="text-xs text-[#44474F] font-mono uppercase block">Pickup Date</span>
                  <span className="text-base text-[#181C1C]">15 July 2026</span>
                </div>
              </div>
              <div className="pt-1">
                <span className="text-xs text-[#44474F] font-mono uppercase block">Description</span>
                <span className="text-base text-[#181C1C]">{description}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-1.5 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer shrink-0"
            >
              Edit
            </button>
          </div>

          {/* Section 2: Uploaded Images */}
          <div className="flex justify-between items-start border-b border-[#C4C6D0] pb-6">
            <div className="flex-1 space-y-3 pr-4">
              <h3 className="font-headline font-semibold text-2xl text-[#181C1C]">
                Uploaded Images
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-1">
                {images.slice(0, 4).map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 aspect-square rounded overflow-hidden border border-[#C4C6D0] bg-[#E6E9E8] shrink-0"
                  >
                    <img
                      src={imgUrl}
                      alt={`Uploaded image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <div className="absolute top-1 left-1 bg-[#006A6A] text-white px-1.5 py-0.5 rounded-full text-[8px] font-mono tracking-wide z-10">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-1.5 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer shrink-0"
            >
              Edit Images
            </button>
          </div>

          {/* Section 3: Material Classification */}
          <div className="flex justify-between items-start border-b border-[#C4C6D0] pb-6">
            <div className="flex-1 space-y-3 pr-4">
              <h3 className="font-headline font-semibold text-2xl text-[#181C1C]">
                Material Classification
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-sm font-sans">
                <div>
                  <span className="text-xs text-[#44474F] font-mono uppercase block">Detected Material</span>
                  <span className="text-base text-[#181C1C]">{wasteName}</span>
                </div>
                <div>
                  <span className="text-xs text-[#44474F] font-mono uppercase block">Confidence</span>
                  <span className="text-base text-[#006A6A] font-semibold">96%</span>
                </div>
                <div>
                  <span className="text-xs text-[#44474F] font-mono uppercase block">Waste Category</span>
                  <span className="text-base text-[#181C1C]">{category}</span>
                </div>
                <div>
                  <span className="text-xs text-[#44474F] font-mono uppercase block">Hazard Level</span>
                  <span className="text-base text-[#181C1C]">Non-Hazardous</span>
                </div>
                <div>
                  <span className="text-xs text-[#44474F] font-mono uppercase block">Marketplace Status</span>
                  <span className="text-base text-[#181C1C]">Eligible</span>
                </div>
                <div>
                  <span className="text-xs text-[#44474F] font-mono uppercase block">Carbon Saving</span>
                  <span className="text-base text-[#181C1C]">1.4 t CO₂</span>
                </div>
              </div>
              <div className="max-w-md pt-1">
                <div className="w-full h-2 bg-[#E6E9E8] rounded-full overflow-hidden">
                  <div className="h-full bg-[#006A6A] w-[96%]" />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setToastMessage('Re-analyzing waste images...');
                setTimeout(() => setToastMessage(null), 2500);
              }}
              className="px-4 py-1.5 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer shrink-0"
            >
              Reanalyze
            </button>
          </div>

          {/* Section 4: Visibility & Status Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-2">
            <div>
              <span className="text-xs text-[#44474F] font-mono uppercase block">Marketplace Visibility</span>
              <span className="text-base text-[#181C1C] font-sans">Marketplace</span>
            </div>
            <div>
              <span className="text-xs text-[#44474F] font-mono uppercase block">Expected Matching Time</span>
              <span className="text-base text-[#181C1C] font-sans">Within 24 Hours</span>
            </div>
            <div className="flex items-center gap-2 text-[#006A6A]">
              <CheckCircle2 className="w-5 h-5 text-[#006A6A]" />
              <span className="font-sans text-base font-semibold">Ready to Publish</span>
            </div>
          </div>
        </section>
      )}

      {/* Step 5: Publish Success (Exact Match to Design Mockup) */}
      {currentStep === 5 && (
        <section className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-8 shadow-xs flex flex-col items-center text-center space-y-6">
          {/* Top Icon Box */}
          <div className="w-16 h-16 bg-[#8CF3F3] rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#006A6A]" />
          </div>

          {/* Heading */}
          <div className="space-y-2 max-w-lg">
            <h2 className="font-headline font-semibold text-2xl text-[#181C1C]">
              Waste Listing Published Successfully
            </h2>
            <p className="font-sans text-base text-[#44474F]">
              Your waste listing is now live on the Eco Link Marketplace. Certified recycling companies can now discover your listing and submit offers.
            </p>
          </div>

          {/* Summary Box */}
          <div className="w-full max-w-md bg-[#F1F4F3] rounded p-4 grid grid-cols-2 gap-4 text-left border border-[#C4C6D0]/50">
            <div>
              <span className="text-xs text-[#44474F] font-mono uppercase block">Listing ID</span>
              <span className="text-base text-[#181C1C] font-semibold">#WL-2026-00124</span>
            </div>
            <div>
              <span className="text-xs text-[#44474F] font-mono uppercase block">Waste Type</span>
              <span className="text-base text-[#181C1C]">{wasteName}</span>
            </div>
            <div>
              <span className="text-xs text-[#44474F] font-mono uppercase block">Quantity</span>
              <span className="text-base text-[#181C1C]">{estQuantity} {unit}</span>
            </div>
            <div>
              <span className="text-xs text-[#44474F] font-mono uppercase block">Status</span>
              <span className="flex items-center gap-1.5 text-[#006A6A] font-semibold text-base">
                <span className="w-2 h-2 bg-[#006A6A] rounded-full inline-block" />
                Live
              </span>
            </div>
          </div>

          {/* 3 Action Cards / Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-2">
            <button
              type="button"
              onClick={() => onSubmitSuccess({ type: wasteName, quantity: `${estQuantity} ${unit}` })}
              className="flex flex-col items-center justify-center gap-2 p-4 border border-[#C4C6D0] rounded-lg hover:bg-[#E6E9E8] transition-colors cursor-pointer"
            >
              <Store className="w-5 h-5 text-[#44474F]" />
              <span className="font-sans text-sm font-medium text-[#181C1C]">View Marketplace</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex flex-col items-center justify-center gap-2 p-4 border border-[#C4C6D0] rounded-lg hover:bg-[#E6E9E8] transition-colors cursor-pointer"
            >
              <LayoutGrid className="w-5 h-5 text-[#44474F]" />
              <span className="font-sans text-sm font-medium text-[#181C1C]">Go to Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex flex-col items-center justify-center gap-2 p-4 border border-[#C4C6D0] rounded-lg hover:bg-[#E6E9E8] transition-colors cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-[#44474F]" />
              <span className="font-sans text-sm font-medium text-[#181C1C]">Create Another</span>
            </button>
          </div>
        </section>
      )}

      {/* Footer / Action Bar */}
      <footer className="flex justify-between items-center pt-4 border-t border-[#C4C6D0]">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
        >
          {currentStep === 5 ? 'Back to Dashboard' : currentStep === 1 ? 'Cancel' : 'Back'}
        </button>

        {currentStep === 5 ? (
          <button
            type="button"
            onClick={() => onSubmitSuccess({ type: wasteName, quantity: `${estQuantity} ${unit}` })}
            className="px-6 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors shadow-xs cursor-pointer"
          >
            View Marketplace
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-2 border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="px-6 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors shadow-xs flex items-center gap-2 cursor-pointer group"
            >
              <span>{currentStep >= 4 ? 'Publish Listing' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4 text-[#8CF3F3] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

