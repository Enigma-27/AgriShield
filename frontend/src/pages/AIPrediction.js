import React, { useState } from 'react';
import axios from 'axios';
import { BrainCircuit, Activity, Zap, Info, Loader2 } from 'lucide-react';

const AIPrediction = () => {
  const [inputs, setInputs] = useState({
    temperature: 25,
    soil_moisture: 50,
    humidity: 45,
    rainfall: 5
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      // Ensure your Flask backend has a /predict route that uses the .pkl model
      const res = await axios.post('http://localhost:5000/predict', inputs);
      
      const risk = parseFloat(res.data.risk_score);
      
      // APPLY YOUR NEW PAYOUT FORMULA (Trigger: 40%, Exit: 90%)
      let payout = 0;
      if (risk > 40) {
        payout = Math.min(100, ((risk - 40) / (90 - 40)) * 100);
      }

      setPrediction({
        risk: risk.toFixed(2),
        payout: payout.toFixed(2)
      });
    } catch (err) {
      console.error("Prediction Error:", err);
    }
    setLoading(false);
  };

  const Slider = ({ label, name, value, min, max, unit, color }) => (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
        <span className={`text-xs font-bold ${color}`}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setInputs({ ...inputs, [name]: parseFloat(e.target.value) })}
        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#062c1b]"
      />
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">AI Payout Predictor</h2>
        <p className="text-gray-500 font-medium">Manually simulate environmental conditions to forecast risk and insurance payouts.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Sliders Section */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="flex items-center gap-2 font-black text-gray-800 uppercase text-xs tracking-widest mb-8">
            <Zap className="text-orange-500" size={16} /> Simulation Parameters
          </h3>
          
          <Slider label="Temperature" name="temperature" value={inputs.temperature} min={5} max={55} unit="°C" color="text-orange-500" />
          <Slider label="Soil Moisture" name="soil_moisture" value={inputs.soil_moisture} min={0} max={100} unit="%" color="text-blue-500" />
          <Slider label="Humidity" name="humidity" value={inputs.humidity} min={20} max={100} unit="%" color="text-cyan-500" />
          <Slider label="Rainfall" name="rainfall" value={inputs.rainfall} min={0} max={70} unit="mm" color="text-indigo-500" />

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full mt-4 bg-[#062c1b] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit size={20} />}
            {loading ? "Calculating..." : "Run AI Simulation"}
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-[#062c1b] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <p className="text-green-400 font-black uppercase text-xs tracking-widest mb-4">Inference Result</p>
             <h3 className="text-2xl font-bold mb-8 italic">Calculated Risk Level</h3>
             
             <div className="text-7xl font-black text-white mb-2">
                {prediction ? `${prediction.risk}%` : "--%"}
             </div>

             <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-3 mb-2">
                    <Activity size={18} className="text-green-400" />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Predicted Payout Percentage</p>
                </div>
                <p className="text-4xl font-black text-green-400">
                    {prediction ? `${prediction.payout}%` : "0.00%"}
                </p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 flex gap-4 items-start">
             <div className="bg-blue-50 p-3 rounded-2xl text-blue-500">
                <Info size={24} />
             </div>
             <div>
                <h4 className="font-black text-gray-800 uppercase text-xs tracking-widest">About this simulation</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1 font-medium italic">
                   This result is generated by a Random Forest Regressor trained on 3,000 synthetic farm-stress cycles. It approximates the parametric payout curves used in the live dashboard.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPrediction;