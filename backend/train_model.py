import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

def calculate_parametric_logic(t, m, h, r):
    # Matches your main.py logic exactly
    # Temperature Risk: Safe 18-35
    r_t = max(0, (t - 35) / (50 - 35) * 100) if t > 35 else max(0, (18 - t) / (18 - 5) * 100) if t < 18 else 0
    # Moisture Risk: Safe 40-80
    r_m = max(0, (40 - m) / (40 - 20) * 100) if m < 40 else max(0, (m - 80) / (95 - 80) * 100) if m > 80 else 0
    # Humidity Risk: Safe < 75
    r_h = max(0, (h - 75) / (95 - 75) * 100) if h > 75 else 0
    # Rainfall Risk: Safe < 30
    r_r = max(0, (r - 30) / (60 - 30) * 100) if r > 30 else 0
    
    # Max Factor Principle
    return min(100, max(r_t, r_m, r_h, r_r))

def train_and_save_model():
    # 1. Create a larger synthetic dataset for better AI accuracy
    np.random.seed(42)
    data = {
        'temperature': np.random.uniform(5, 55, 3000),
        'soil_moisture': np.random.uniform(10, 100, 3000),
        'humidity': np.random.uniform(20, 100, 3000),
        'rainfall': np.random.uniform(0, 70, 3000),
    }
    df = pd.DataFrame(data)

    # 2. Apply your NEW logic to create the "answers" for the AI
    df['risk_score'] = df.apply(lambda x: calculate_parametric_logic(
        x['temperature'], x['soil_moisture'], x['humidity'], x['rainfall']
    ), axis=1)

    # 3. Train the Model
    X = df[['temperature', 'soil_moisture', 'humidity', 'rainfall']]
    y = df['risk_score']

    # Random Forest is perfect for learning these non-linear boundaries
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    # 4. Save the "Brain"
    model_path = os.path.join(os.path.dirname(__file__), 'crop_risk_model.pkl')
    joblib.dump(model, model_path)
    print(f"✅ Success! AI Brain retrained with Parametric Logic: {model_path}")

if __name__ == "__main__":
    train_and_save_model()