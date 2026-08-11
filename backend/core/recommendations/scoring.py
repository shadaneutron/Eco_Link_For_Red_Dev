def score_material_match(user_materials, listing_material, listing_ai_material):
    """
    Max score: 40
    Compares the user's supported materials with the listing's material and AI detected material.
    """
    if not user_materials:
        return 0
    
    listing_mat_lower = listing_material.lower() if listing_material else ""
    ai_mat_lower = listing_ai_material.lower() if listing_ai_material else ""
    user_mats_lower = [m.lower() for m in user_materials]
    
    if listing_mat_lower in user_mats_lower or ai_mat_lower in user_mats_lower:
        return 40
    
    # Partial substring match
    for um in user_mats_lower:
        if um and (um in listing_mat_lower or listing_mat_lower in um):
            return 20
        if um and ai_mat_lower and (um in ai_mat_lower or ai_mat_lower in um):
            return 20
            
    return 0

def score_location(user_location, listing_location):
    """
    Max score: 25
    Compares the recycler's governorate/location with the listing's location.
    """
    if not user_location or not listing_location:
        return 0
        
    u_loc = user_location.lower().strip()
    l_loc = listing_location.lower().strip()
    
    if u_loc == l_loc:
        return 25
    if u_loc in l_loc or l_loc in u_loc:
        return 15
        
    return 5

def score_quantity_fit(listing_quantity, avg_past_quantity):
    """
    Max score: 15
    Checks if the listing quantity is within the typical purchasing range of the recycler.
    """
    if not avg_past_quantity or avg_past_quantity <= 0:
        return 0
        
    listing_q = float(listing_quantity)
    avg_q = float(avg_past_quantity)
    
    diff_ratio = abs(listing_q - avg_q) / avg_q
    
    if diff_ratio <= 0.2:
        return 15
    elif diff_ratio <= 0.5:
        return 10
    elif diff_ratio <= 1.0:
        return 5
        
    return 0

def score_quality(condition, ai_confidence):
    """
    Max score: 10
    Awards points for pre-sorted materials and high AI classification confidence.
    """
    score = 0
    if condition and condition.lower() == 'sorted':
        score += 5
        
    if ai_confidence and ai_confidence > 0.8:
        score += 5
        
    return score

def score_past_activity(listing_material, listing_ai_material, past_materials_set):
    """
    Max score: 10
    Boosts listings if the recycler has successfully bid on similar materials recently.
    """
    if not past_materials_set:
        return 0
        
    l_mat = listing_material.lower() if listing_material else ""
    ai_mat = listing_ai_material.lower() if listing_ai_material else ""
    
    past_lower = [m.lower() for m in past_materials_set]
    
    if l_mat in past_lower or ai_mat in past_lower:
        return 10
        
    return 0
