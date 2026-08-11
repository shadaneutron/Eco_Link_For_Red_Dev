CLASS_MAPPING = {
    0: {
        "material": "Cardboard",
        "category": "Paper & Packaging",
        "ewc_code": "15 01 01",
        "hazard_level": "Non-Hazardous",
        "co2_factor": 1.2
    },
    1: {
        "material": "Glass",
        "category": "Glass & Ceramic",
        "ewc_code": "15 01 07",
        "hazard_level": "Non-Hazardous",
        "co2_factor": 0.5
    },
    2: {
        "material": "Metal",
        "category": "Metals",
        "ewc_code": "15 01 04",
        "hazard_level": "Non-Hazardous",
        "co2_factor": 2.1
    },
    3: {
        "material": "Paper",
        "category": "Paper & Packaging",
        "ewc_code": "20 01 01",
        "hazard_level": "Non-Hazardous",
        "co2_factor": 1.0
    },
    4: {
        "material": "Plastic",
        "category": "Plastics",
        "ewc_code": "15 01 02",
        "hazard_level": "Non-Hazardous",
        "co2_factor": 1.5
    },
    5: {
        "material": "General Waste",
        "category": "General Industrial Waste",
        "ewc_code": "20 03 01",
        "hazard_level": "Non-Hazardous",
        "co2_factor": 0.3
    }
}

MATERIAL_TO_CATEGORY_MAP = {
    "cardboard": "Paper & Packaging",
    "paper": "Paper & Packaging",
    "paper & packaging": "Paper & Packaging",
    "glass": "Glass & Ceramic",
    "glass & ceramic": "Glass & Ceramic",
    "metal": "Metals",
    "metals": "Metals",
    "plastic": "Plastics",
    "plastics": "Plastics",
    "general waste": "General Industrial Waste",
    "general industrial waste": "General Industrial Waste",
    "hazardous": "Hazardous",
}

def map_ai_material_to_category(raw_val: str) -> str:
    """
    Maps raw AI prediction or material input to normalized Eco Link marketplace category.
    AI prediction is the single source of truth.
    """
    if not raw_val:
        return "General Industrial Waste"
    key = str(raw_val).strip().lower()
    if key in MATERIAL_TO_CATEGORY_MAP:
        return MATERIAL_TO_CATEGORY_MAP[key]
    
    for item in CLASS_MAPPING.values():
        if item["material"].lower() == key or item["category"].lower() == key:
            return item["category"]
            
    return "General Industrial Waste"

