from django.db.models import Avg
from core.models import WasteListing, Bid
from .scoring import (
    score_material_match,
    score_location,
    score_quantity_fit,
    score_quality,
    score_past_activity
)
from .insights import generate_insights

def get_recommendations_for_user(user):
    """
    Orchestrates the recommendation engine for a given Recycler user.
    Fetches active listings, scores them based on the Recycler's profile and history,
    and returns a sorted list of dictionaries containing the listing and its recommendation metadata.
    """
    
    # 1. Fetch active marketplace listings
    # Must be published and have an open auction
    active_listings = WasteListing.objects.filter(
        status=WasteListing.Status.PUBLISHED,
        auctions__status='open'
    ).select_related('factory').distinct()
    
    # 2. Gather Recycler Profile & History
    user_materials = user.supported_materials or []
    user_location = user.location
    
    # Calculate historical averages and sets
    past_bids = Bid.objects.filter(recycler=user)
    
    avg_past_quantity_agg = past_bids.aggregate(avg_q=Avg('auction__listing__quantity'))
    avg_past_quantity = avg_past_quantity_agg['avg_q'] if avg_past_quantity_agg['avg_q'] else 0
    
    past_materials_set = set()
    for bid in past_bids.select_related('auction__listing'):
        if bid.auction.listing.material_type:
            past_materials_set.add(bid.auction.listing.material_type)
        if bid.auction.listing.ai_material_type:
            past_materials_set.add(bid.auction.listing.ai_material_type)
            
    recommendations = []
    
    # 3. Score each listing
    for listing in active_listings:
        mat_score = score_material_match(user_materials, listing.material_type, listing.ai_material_type)
        loc_score = score_location(user_location, listing.location)
        quant_score = score_quantity_fit(listing.quantity, avg_past_quantity)
        qual_score = score_quality(listing.condition, listing.ai_confidence)
        past_score = score_past_activity(listing.material_type, listing.ai_material_type, past_materials_set)
        
        total_score = mat_score + loc_score + quant_score + qual_score + past_score
        
        # Only consider listings with some baseline relevance (e.g. total_score > 0)
        if total_score > 0:
            insights = generate_insights(mat_score, loc_score, quant_score, qual_score, past_score)
            
            recommendations.append({
                'listing': listing,
                'match_score': total_score,
                'insights': insights
            })
            
    # 4. Sort recommendations by score descending
    recommendations.sort(key=lambda x: x['match_score'], reverse=True)
    
    # Return top 10 recommendations for performance
    return recommendations[:10]
