import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

def calculate_ground_truth(t, m, h, r):
    """
    Master logic for the AI to learn: 
    Safe Zones vs Danger Zones (Linear Proportional Risk)
    """
    # 1. Temperature Risk (Safe: 18-35 | Danger: <5 or >50)
    if t > 35: 
        r_t = min(100, ((t - 35) / (50 - 35)) * 100)
    elif t < 18: 
        r_t = min(100, ((18 - t) / (18 - 5)) * 100)
    else: 
        r_t = 0
    
    # 2. Moisture Risk (Safe: 40-80 | Danger: <20 or >95)
    if m < 40: 
        r_m = min(100, ((40 - m) / (40 - 20)) * 100)
    elif m > 80: 
        r_m = min(100, ((m - 80) / (95 - 80)) * 100)
    else: 
        r_m = 0
    
    # 3. Humidity Risk (Safe: <75 | Danger: >95)
    r_h = min(100, ((h - 75) / (95 - 75)) * 100) if h > 75 else 0
    
    # 4. Rainfall Risk (Safe: <30 | Danger: >60)
    r_r = min(100, ((r - 30) / (60 - 30)) * 100) if r > 30 else 0

    # MAX FACTOR PRINCIPLE: Any one factor at 100% destroys the crop
    total_risk = max(r_t, r_m, r_h, r_r)

    # PAYOUT LOGIC: 
    # Trigger at 40% risk. 
    # Full Payout (100%) if risk hits 90% or higher.
    if total_risk >= 90:
        payout_pct = 100
    elif total_risk > 40:
        payout_pct = ((total_risk - 40) / (90 - 40)) * 100
    else:
        payout_pct = 0

    return round(total_risk, 2), round(payout_pct, 2)

def train_and_save_model():
    print("⏳ Starting AI Brain training...")
    
    # 1. Create a large synthetic dataset (5000 samples)
    np.random.seed(42)
    data = {
        'temperature': np.random.uniform(5, 55, 5000),
        'soilMoisture': np.random.uniform(5, 100, 5000), 
        'humidity': np.random.uniform(10, 100, 5000),
        'rainfall': np.random.uniform(0, 70, 5000),
    }
    df = pd.DataFrame(data)

    # 2. Apply Ground Truth Logic
    results = df.apply(lambda x: calculate_ground_truth(
        x['temperature'], x['soilMoisture'], x['humidity'], x['rainfall']
    ), axis=1)
    
    df[['risk_score', 'payout_pct']] = pd.DataFrame(results.tolist(), index=df.index)

    # 3. Train Multi-Output Random Forest
    # Using camelCase to match the backend's expected DataFrame columns
    features = ['temperature', 'soilMoisture', 'humidity', 'rainfall']
    X = df[features]
    y = df[['risk_score', 'payout_pct']]

    model = RandomForestRegressor(n_estimators=150, random_state=42)
    model.fit(X, y)

    # 4. Save the "Brain"
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Ensure it saves one level up in the backend folder
    model_path = os.path.join(current_dir, '..', 'backend', 'crop_risk_model.pkl')
    
    joblib.dump(model, model_path)
    
    print(f"✅ Success! Multi-Output AI Brain trained.")
    print(f"📍 Saved to: {os.path.abspath(model_path)}")

if __name__ == "__main__":
    train_and_save_model()