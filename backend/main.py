import time
import pandas as pd
from flask import Flask, jsonify, request
from flask_socketio import SocketIO
from flask_cors import CORS
import os
import joblib
import numpy as np
from threading import Thread

app = Flask(__name__)

# --- ROBUST CORS FIX ---
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# --- 1. CONFIGURATION ---
CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLT6ds8z5hP3rSfrQyDmENajSO7YtsAPxijMU1tYaXzD9ZNtUSrpC9YGpUVIyNUbzlbrsgyZmtYRfF/pub?output=csv"

backend_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(backend_dir, 'crop_risk_model.pkl')

# Load the AI Brain
model = None
try:
    model = joblib.load(MODEL_PATH)
    print("AI Brain loaded successfully.")
except Exception as e:
    print(f"Warning: Model load failed: {e}")

# --- 2. AI PREDICTION CORE (FIXED FOR SINGLE & MULTI OUTPUT) ---
def get_ai_prediction(t, m, h, r):
    if model is None:
        return 0.0, "Model Missing", 0.0
        
    try:
        # Prepare features
        features = pd.DataFrame([[t, m, h, r]], 
                                columns=['temperature', 'soilMoisture', 'humidity', 'rainfall'])
        
        # Get raw prediction and flatten it
        prediction = model.predict(features).flatten()
        
        # Logic to handle single-output vs multi-output models
        if len(prediction) >= 2:
            # Model provides both [Risk, Payout]
            risk_score = round(float(prediction[0]), 2)
            payout_pct = round(float(prediction[1]), 2)
        else:
            # Model only provides [Risk]. We calculate Payout manually.
            risk_score = round(float(prediction[0]), 2)
            # Payout Logic: 0% payout until 40% risk, then scales to 100% payout at 90% risk.
            if risk_score > 40:
                payout_pct = round(min(100, (risk_score - 40) / 50 * 100), 2)
            else:
                payout_pct = 0.0
        
        # UI Visuals
        drivers = {"Temperature": t, "Soil Moisture": m, "Humidity": h, "Rainfall": r}
        primary_driver = max(drivers, key=drivers.get) if risk_score > 5 else "Optimal"
        
        return risk_score, primary_driver, payout_pct

    except Exception as e:
        print(f"Inference Error: {e}")
        return 0.0, "Logic Error", 0.0

# --- 3. PREDICTION ROUTES ---

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    try:
        data = request.json
        t, m, h, r = float(data.get('temperature', 25)), float(data.get('soilMoisture', 50)), float(data.get('humidity', 45)), float(data.get('rainfall', 5))
        risk, driver, payout = get_ai_prediction(t, m, h, r)
        return jsonify({"risk_score": risk, "payout_pct": payout, "primary_driver": driver})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/predict_custom', methods=['POST'])
def predict_custom():
    try:
        data = request.json
        t = float(data['temperature'])
        m = float(data['soilMoisture'])
        h = float(data['humidity'])
        r = float(data['rainfall'])
        th = data['thresholds']
        
        # Temperature Logic
        if t > th['tSafeMax']: 
            r_t = min(100, ((t - th['tSafeMax']) / (th['tDangerMax'] - th['tSafeMax'])) * 100)
        elif t < th['tSafeMin']: 
            r_t = min(100, ((th['tSafeMin'] - t) / (th['tSafeMin'] - th['tDangerMin'])) * 100)
        else: r_t = 0
            
        # Moisture Logic
        if m < th['mSafeMin']:
            r_m = min(100, ((th['mSafeMin'] - m) / (th['mSafeMin'] - th['mDangerMin'])) * 100)
        elif m > th['mSafeMax']:
            r_m = min(100, ((m - th['mSafeMax']) / (th['mDangerMax'] - th['mSafeMax'])) * 100)
        else: r_m = 0
        
        # Humidity Logic
        if h > th['hSafeMax']:
            r_h = min(100, ((h - th['hSafeMax']) / (th['hDangerMax'] - th['hSafeMax'])) * 100)
        else: r_h = 0
            
        # Rainfall Logic
        if r > th['rSafeMax']:
            r_r = min(100, ((r - th['rSafeMax']) / (th['rDangerMax'] - th['rSafeMax'])) * 100)
        else: r_r = 0
            
        risk = round(max(r_t, r_m, r_h, r_r), 2)
        payout = round(100 if risk >= 90 else (max(0, (risk-40)/50*100) if risk > 40 else 0), 2)
        return jsonify({"risk_score": risk, "payout_pct": payout, "primary_driver": "Regional Override"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# --- 4. DATA SYNC ---
# --- 4. DATA SYNC (EXCEL OPTIMIZED) ---
def get_full_history():
    try:
        # 1. Path to local Excel file
        excel_path = os.path.join(os.path.dirname(backend_dir), 'data_science', 'sensors.xlsx')
        
        # 2. Fetch data from Excel
        if not os.path.exists(excel_path):
            print(f"Excel file not found at: {excel_path}")
            return []
            
        df = pd.read_excel(excel_path)
        
        # 3. Clean headers: strip spaces, lowercase, and replace spaces with underscores
        df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')
        
        # 4. Convert to records
        rows = df.to_dict('records')
        
        history = []
        for row in rows:
            try:
                # Use the cleaned keys
                t = float(row.get('temperature', 0))
                m = float(row.get('soil_moisture', 0)) 
                h = float(row.get('humidity', 0))
                r = float(row.get('rainfall', 0))
                
                # Check for timestamp if it exists, or create one based on row index if not
                ts = str(row.get('timestamp', 'Sync Active'))
                
                # Get AI prediction
                risk, driver, payout = get_ai_prediction(t, m, h, r)
                
                history.append({
                    "temperature": t, 
                    "soil_moisture": m, 
                    "humidity": h, 
                    "rainfall": r,
                    "timestamp": ts, 
                    "risk_score": risk, 
                    "health_score": round(100 - risk, 2),
                    "primary_driver": driver, 
                    "payout_pct": payout, 
                    "sensor_id": "EXCEL-LIVE"
                })
            except Exception as e:
                print(f"Skipping row due to error: {e}")
                continue
        
        return history
    except Exception as e:
        print(f"Data Sync Error: {e}")
        return []

@socketio.on('connect')
def handle_connect():
    print("Client connected. Updating AI Dashboard...")
    data = get_full_history()
    print(f"Emitting {len(data)} records to client.")
    socketio.emit('initial_data_history', data)

@socketio.on('request_sync')
def handle_request_sync():
    print("Client requested sync.")
    data = get_full_history()
    socketio.emit('initial_data_history', data)

# --- 5. LIVE MONITORING ---
def monitor_sheets():
    last_count = 0
    while True:
        try:
            history = get_full_history()
            current_count = len(history)
            if current_count > 0:
                # Always emit so that late-connecting clients get the data
                socketio.emit('initial_data_history', history)
                if current_count != last_count:
                    last_count = current_count
                    print(f"Sync: {current_count} records audited via AI.")
        except Exception as e: print(f"Monitor Loop Error: {e}")
        time.sleep(10)

if __name__ == "__main__":
    Thread(target=monitor_sheets, daemon=True).start()
    print("AgriShield Backend running on http://localhost:5000")
    socketio.run(app, host='0.0.0.0', port=5000, debug=False, allow_unsafe_werkzeug=True)