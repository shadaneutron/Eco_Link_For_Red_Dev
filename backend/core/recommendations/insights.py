def generate_insights(material_score, location_score, quantity_score, quality_score, past_activity_score):
    """
    Generates explainable AI-style insights based on deterministic scoring signals.
    Returns a list of strings representing the reasons for recommendation.
    """
    insights = []
    
    # Material Insights
    if material_score == 40:
        insights.append("Strong material match: this listing directly aligns with your supported materials.")
    elif material_score == 20:
        insights.append("Partial material match: this listing is related to materials you process.")
        
    # Location Insights
    if location_score == 25:
        insights.append("Location advantage: the listing is in your primary operating governorate.")
    elif location_score == 15:
        insights.append("Proximity match: the listing is in a nearby or related location.")
        
    # Quantity Insights
    if quantity_score == 15:
        insights.append("Quantity fit: the volume perfectly matches your recent average purchase patterns.")
    elif quantity_score == 10:
        insights.append("Quantity fit: the volume is within your typical purchasing range.")
        
    # Quality Insights
    if quality_score == 10:
        insights.append("High quality: the material is pre-sorted and verified with high AI confidence.")
    elif quality_score == 5:
        insights.append("Quality factor: the material meets good condition or verification standards.")
        
    # Past Activity Insights
    if past_activity_score == 10:
        insights.append("Historical relevance: you have a proven track record of bidding on this type of material.")
        
    return insights
