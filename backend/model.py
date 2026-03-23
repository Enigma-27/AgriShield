def predict_crop_risk(data):
    """
    Simulates a Random Forest model. 
    Calculates Crop Health and Insurance Risk.
    """
    # Extract values from the sensor data
    temp = data.get('temperature', 25)
    moisture = data.get('soil_moisture', 50)
    rainfall = data.get('rainfall', 5)
    
    # 1. Calculate Health Score (0-100)
    # Ideal: Temp 20-30, Moisture 40-70
    health_score = 100
    if temp > 35 or temp < 10: health_score -= 20
    if moisture < 30 or moisture > 80: health_score -= 30
    if rainfall < 1: health_score -= 10
    
    health_score = max(0, min(100, health_score)) # Keep between 0-100

    # 2. Calculate Risk Level (0-100)
    # Risk is high if moisture is very low and temp is very high
    risk_score = 0
    if moisture < 20: risk_score += 40
    if temp > 38: risk_score += 30
    if rainfall == 0: risk_score += 30
    
    # 3. Payout Logic
    # If risk is over 70, estimate a payout (e.g., ₹5000 per % of loss)
    payout_estimate = 0
    if risk_score > 70:
        payout_estimate = (risk_score - 70) * 500 

    return {
        "health_score": round(health_score, 2),
        "risk_score": round(risk_score, 2),
        "payout_estimate": round(payout_estimate, 2),
        "status": "High Risk" if risk_score > 60 else "Healthy"
    }