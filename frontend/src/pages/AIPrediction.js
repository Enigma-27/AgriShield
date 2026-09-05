import React, { useState } from 'react';
import axios from 'axios';
import { BrainCircuit, Activity, Zap, Info, Loader2, MapPin, Settings2 } from 'lucide-react';

const AIPrediction = () => {
  const [mode, setMode] = useState('standard'); // 'standard' or 'regional'
  const [inputs, setInputs] = useState({
    temperature: 25,
    soilMoisture: 50,
    humidity: 45,
    rainfall: 5
  });

  // Regional Bounds: Only used if mode is 'regional'
  const [thresholds, setThresholds] = useState({
    tSafeMin: 18, tSafeMax: 35, tDangerMin: 5, tDangerMax: 50,
    mSafeMin: 40, mSafeMax: 80, mDangerMin: 20, mDangerMax: 95,
    hSafeMax: 75, hDangerMax: 95,
    rSafeMax: 30, rDangerMax: 60
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      let res;
      if (mode === 'standard') {
        // Option 1: Standard AI - Logic is inside the .pkl model (No sliders needed)
        res = await axios.post('http://localhost:5000/predict', inputs);
      } else {
        // Option 2: Regional - Logic is defined by the user sliders below
        res = await axios.post('http://localhost:5000/predict_custom', {
          ...inputs,
          thresholds
        });
      }

      setPrediction({
        risk: res.data.risk_score.toFixed(2),
        payout: res.data.payout_pct.toFixed(2)
      });
    } catch (err) {
      console.error("Inference Error:", err);
      alert("Backend Error: Ensure main.py is running!");
    }
    setLoading(false);
  };

  const Slider = ({ label, name, value, min, max, unit, color, isThreshold = false }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
        <span className={`text-[10px] font-bold ${color}`}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          isThreshold 
            ? setThresholds({ ...thresholds, [name]: val }) 
            : setInputs({ ...inputs, [name]: val });
        }}
        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#062c1b]"
      />
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Predictive Engine</h2>
          <p className="text-gray-500 font-medium">Standard AI Model vs. Regional Calibration</p>
        </div>

        {/* MODE TOGGLE: AI vs REGIONAL */}
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-inner">
          <button 
            onClick={() => { setMode('standard'); setPrediction(null); }}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${mode === 'standard' ? 'bg-[#062c1b] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BrainCircuit size={14} /> Standard AI
          </button>
          <button 
            onClick={() => { setMode('regional'); setPrediction(null); }}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${mode === 'regional' ? 'bg-[#062c1b] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <MapPin size={14} /> Regional
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="space-y-6">
          {/* Main Simulation Sliders (Current Conditions) */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-black text-gray-800 uppercase text-[10px] tracking-widest mb-8">
              <Zap className="text-orange-500" size={16} /> Environmental Simulation
            </h3>
            <Slider label="Current Temp" name="temperature" value={inputs.temperature} min={5} max={55} unit="°C" color="text-orange-500" />
            <Slider label="Soil Moisture" name="soilMoisture" value={inputs.soilMoisture} min={0} max={100} unit="%" color="text-blue-500" />
            <Slider label="Humidity" name="humidity" value={inputs.humidity} min={20} max={100} unit="%" color="text-cyan-500" />
            <Slider label="Rainfall" name="rainfall" value={inputs.rainfall} min={0} max={70} unit="mm" color="text-indigo-500" />
          </div>

          {/* Regional Calibration (ONLY VISIBLE IN REGIONAL MODE) */}
          {mode === 'regional' && (
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-dashed border-gray-200 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 font-black text-gray-500 uppercase text-[10px] tracking-widest">
                  <Settings2 size={16} /> Regional Safe Zones
                </h3>
                <span className="bg-blue-100 text-blue-600 text-[8px] font-bold px-2 py-1 rounded-full uppercase">Manual Override</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2">
                <Slider label="Safe Temp Min" name="tSafeMin" value={thresholds.tSafeMin} min={0} max={25} unit="°C" color="text-gray-600" isThreshold />
                <Slider label="Safe Temp Max" name="tSafeMax" value={thresholds.tSafeMax} min={25} max={45} unit="°C" color="text-gray-600" isThreshold />
                <Slider label="Frost Danger" name="tDangerMin" value={thresholds.tDangerMin} min={-10} max={15} unit="°C" color="text-red-400" isThreshold />
                <Slider label="Heat Danger" name="tDangerMax" value={thresholds.tDangerMax} min={45} max={65} unit="°C" color="text-red-400" isThreshold />
                
                <Slider label="Safe Moisture Min" name="mSafeMin" value={thresholds.mSafeMin} min={0} max={50} unit="%" color="text-gray-600" isThreshold />
                <Slider label="Safe Moisture Max" name="mSafeMax" value={thresholds.mSafeMax} min={50} max={100} unit="%" color="text-gray-600" isThreshold />
                <Slider label="Drought Danger" name="mDangerMin" value={thresholds.mDangerMin} min={0} max={30} unit="%" color="text-red-400" isThreshold />
                <Slider label="Flood Danger" name="mDangerMax" value={thresholds.mDangerMax} min={80} max={100} unit="%" color="text-red-400" isThreshold />
                
                <Slider label="Safe Humidity Max" name="hSafeMax" value={thresholds.hSafeMax} min={50} max={85} unit="%" color="text-gray-600" isThreshold />
                <Slider label="Humidity Danger" name="hDangerMax" value={thresholds.hDangerMax} min={80} max={100} unit="%" color="text-red-400" isThreshold />
                <Slider label="Safe Rain Max" name="rSafeMax" value={thresholds.rSafeMax} min={10} max={50} unit="mm" color="text-gray-600" isThreshold />
                <Slider label="Rain Danger" name="rDangerMax" value={thresholds.rDangerMax} min={40} max={100} unit="mm" color="text-red-400" isThreshold />
              </div>
            </div>
          )}

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-[#062c1b] text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" /> : <img src="/logo.png" alt="Logo" className="w-6 h-6 object-cover rounded-full mix-blend-screen" />}
            {loading ? "Calculating..." : mode === 'standard' ? "Inference via AI Brain" : "Calculate Regional Risk"}
          </button>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="bg-[#062c1b] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
             
             <p className="text-green-400 font-black uppercase text-[10px] tracking-[0.2em] mb-4">
               {mode === 'standard' ? 'Model: Random Forest' : 'Engine: Custom Parametric Math'}
             </p>
             <h3 className="text-2xl font-bold mb-8 italic">Predicted Risk Factor</h3>
             
             <div className="text-8xl font-black text-white mb-2 tracking-tighter">
                {prediction ? `${prediction.risk}%` : "--%"}
             </div>

             <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-3 mb-2">
                    <Activity size={18} className="text-green-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Authorized Claim Payout</p>
                </div>
                <p className="text-5xl font-black text-green-400">
                    {prediction ? `${prediction.payout}%` : "0.00%"}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPrediction;