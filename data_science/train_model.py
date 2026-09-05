import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

def calculate_parametric_logic(t, m, h, r):
    r_t = max(0, (t - 35) / (50 - 35) * 100) if t > 35 else max(0, (18 - t) / (18 - 5) * 100) if t < 18 else 0
    r_m = max(0, (40 - m) / (40 - 20) * 100) if m < 40 else max(0, (m - 80) / (95 - 80) * 100) if m > 80 else 0
    r_h = max(0, (h - 75) / (95 - 75) * 100) if h > 75 else 0
    r_r = max(0, (r - 30) / (60 - 30) * 100) if r > 30 else 0
    return min(100, max(r_t, r_m, r_h, r_r))

def train_and_save_model():
    np.random.seed(42)
    data = {
        'temperature': np.random.uniform(5, 55, 3000),
        'soilMoisture': np.random.uniform(10, 100, 3000), 
        'humidity': np.random.uniform(20, 100, 3000),
        'rainfall': np.random.uniform(0, 70, 3000),
    }
    df = pd.DataFrame(data)
    df['risk_score'] = df.apply(lambda x: calculate_parametric_logic(
        x['temperature'], x['soilMoisture'], x['humidity'], x['rainfall']
    ), axis=1)

    X = df[['temperature', 'soilMoisture', 'humidity', 'rainfall']]
    y = df['risk_score']

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Saving directly into the backend folder so main.py finds it
    model_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'crop_risk_model.pkl')
    joblib.dump(model, model_path)
    print(f"✅ AI Brain saved to: {model_path}")

if __name__ == "__main__":
    train_and_save_model()