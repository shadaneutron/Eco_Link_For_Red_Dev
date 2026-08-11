import React from 'react';
import { Package, MapPin, Zap, ExternalLink } from 'lucide-react';
import { RecommendationResponse } from '../../services/api';

interface RecommendationCardProps {
  recommendation: RecommendationResponse;
  onViewOpportunity?: (listing: any) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onViewOpportunity }) => {
  const { listing, match_score, insights } = recommendation;
  
  // Format Match Score properly
  const scorePercent = Math.round(match_score);
  
  // Determine color based on score strength
  let scoreColor = 'text-[#006A6A] bg-[#8CF3F3]';
  if (scorePercent < 50) scoreColor = 'text-[#BA1A1A] bg-[#FFF8F7]';
  else if (scorePercent < 75) scoreColor = 'text-[#00513B] bg-[#80F9CA]';

  return (
    <div className="bg-white border border-[#C4C6D0] rounded-xl overflow-hidden shadow-2xs hover:shadow-sm transition-shadow flex flex-col h-full">
      {/* Top Banner: Score */}
      <div className="px-4 py-3 border-b border-[#E0E3E2] flex items-center justify-between bg-[#F7FAF9]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#006A6A]" />
          <span className="font-sans font-semibold text-sm text-[#181C1C]">AI Recommendation</span>
        </div>
        <span className={`px-2 py-1 rounded font-mono text-xs font-bold ${scoreColor}`}>
          {scorePercent}% Match
        </span>
      </div>

      {/* Main Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-headline font-semibold text-lg text-[#181C1C] truncate mb-1">
            {listing.title}
          </h3>
          <p className="font-sans text-xs text-[#44474F]">
            {listing.factory_name}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#44474F]">
              <Package className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Quantity</span>
            </div>
            <p className="font-sans text-sm font-medium text-[#181C1C]">
              {listing.quantity} {listing.unit}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#44474F]">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Location</span>
            </div>
            <p className="font-sans text-sm font-medium text-[#181C1C] truncate">
              {listing.location || 'Protected'}
            </p>
          </div>
        </div>

        {/* AI Insights List */}
        <div className="mt-auto pt-4 border-t border-[#E0E3E2] space-y-2">
          <p className="font-mono text-[10px] font-semibold text-[#006A6A] uppercase tracking-wider mb-2">
            Why it's recommended:
          </p>
          {insights.length > 0 ? (
            insights.slice(0, 3).map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8CF3F3] mt-1.5 flex-shrink-0" />
                <p className="font-sans text-xs text-[#44474F] line-clamp-2 leading-relaxed">
                  {insight}
                </p>
              </div>
            ))
          ) : (
            <p className="font-sans text-xs text-[#44474F] italic">
              Based on general marketplace criteria.
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 pt-0">
        <button 
          onClick={() => onViewOpportunity?.(listing)}
          className="w-full flex items-center justify-center gap-2 bg-[#006A6A] hover:bg-[#00513B] text-white font-sans font-medium text-sm py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          View Opportunity
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
