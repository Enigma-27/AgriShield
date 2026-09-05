def predict_crop_risk(data):
    """
    Simulates a Random Forest model for AgriShield.
    Calculates Crop Health and Insurance Risk based on Live Sheets data.
    """
    # 1. FIX: Sheety changes 'soil_moisture' to 'soilMoisture'
    # We use .get() with the camelCase name to match the API response
    temp = data.get('temperature', 25)
    moisture = data.get('soilMoisture', 50) # Changed from soil_moisture
    rainfall = data.get('rainfall', 5)
    
    # --- 1. Calculate Health Score (0-100) ---
    # Ideal: Temp 20-30, Moisture 40-70
    health_score = 100
    if temp > 35 or temp < 10: health_score -= 20
    if moisture < 30 or moisture > 80: health_score -= 30
    if rainfall < 1: health_score -= 10
    
    health_score = max(0, min(100, health_score)) 

    # --- 2. Calculate Risk Level (0-100) ---
    # We make this a bit more dynamic for the "AgriShield" insurance model
    risk_score = 0
    if moisture < 20: 
        risk_score += 50 # Drought is the biggest risk
    elif moisture < 35:
        risk_score += 20 # Moderate dryness
        
    if temp > 38: 
        risk_score += 30 # Heat stroke risk
    
    if rainfall == 0: 
        risk_score += 20 # No rain recorded
    
    # Ensure risk doesn't exceed 100
    risk_score = min(100, risk_score)
    
    # --- 3. Payout Logic ---
    # Based on AgriShield's parametric insurance: 
    # Payout triggers when Risk > 60%
    payout_estimate = 0
    if risk_score > 60:
        # Example: ₹1000 for every percentage point above 60% risk
        payout_estimate = (risk_score - 60) * 1000 

    return {
        "health_score": round(health_score, 2),
        "risk_score": round(risk_score, 2),
        "payout_estimate": round(payout_estimate, 2),
        "status": "High Risk" if risk_score > 60 else ("Warning" if risk_score > 40 else "Healthy")
    }