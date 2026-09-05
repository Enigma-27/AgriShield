import React from 'react';
import { 
  Thermometer, Droplets, Wind, CloudRain, 
  AlertTriangle, Loader2, CheckCircle2 
} from 'lucide-react';

const Dashboard = ({ data }) => {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="animate-spin mb-4 text-green-600" size={48} />
        <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-600">Syncing with Google Cloud...</h2>
        <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Auditing live sensor stream</p>
      </div>
    );
  }

  // Logic tied to your AI Model's Risk Score
  const isHighRisk = data.risk_score > 60;
  const hasPayout = data.payout_pct >= 50;

  const Card = ({ title, value, unit, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:translate-y-[-5px] hover:shadow-xl duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} text-white shadow-lg`}><Icon size={24} /></div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <h3 className="text-3xl font-black text-gray-800">{value}</h3>
        <span className="text-gray-500 font-bold text-sm">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">Unlimited Cloud Sync Active</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Live Monitoring</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            {data.sensor_id || "G-SHEET-NODE-01"} | Parametric Protocol v2.0
          </p>
        </div>
        
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-0.5">Last Sheet Update</p>
            <p className="text-sm font-black text-[#062c1b]">{data.timestamp}</p>
          </div>
          <div className="h-8 w-[1px] bg-gray-100"></div>
          <CheckCircle2 className="text-green-500" size={20} />
        </div>
      </header>

      {/* Sensor Grid - Using Snake_Case Keys */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <Card title="Moisture" value={data.soil_moisture} unit="%" icon={Droplets} color="bg-blue-600" />
        <Card title="Temperature" value={data.temperature} unit="°C" icon={Thermometer} color="bg-orange-500" />
        <Card title="Humidity" value={data.humidity} unit="%" icon={Wind} color="bg-cyan-500" />
        <Card title="Rainfall" value={data.rainfall} unit="mm" icon={CloudRain} color="bg-indigo-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* AI Risk Assessment Panel */}
        <div className={`xl:col-span-2 p-10 rounded-[2.5rem] text-white flex items-center relative overflow-hidden shadow-2xl transition-colors duration-500 ${hasPayout ? 'bg-red-900' : 'bg-[#062c1b]'}`}>
          <div className="relative z-10 w-full">
            <p className="text-green-400 font-black uppercase text-xs tracking-widest mb-2 opacity-80 italic underline">AI Diagnostic Model</p>
            <h3 className="text-3xl font-bold mb-8 italic tracking-tight uppercase">Current Asset Risk</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Health Score</p>
                <p className="text-3xl font-black text-green-400">{data.health_score}%</p>
              </div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Primary Driver</p>
                <p className={`text-xl sm:text-2xl font-black ${hasPayout ? 'text-red-400' : 'text-green-400'}`}>{data.primary_driver}</p>
              </div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Risk Factor</p>
                <p className={`text-3xl font-black ${hasPayout ? 'text-red-500' : 'text-green-500'}`}>{data.risk_score}%</p>
              </div>
            </div>
          </div>
          
          <div className="hidden xl:flex absolute -right-4 top-1/2 -translate-y-1/2 items-center justify-center opacity-60 pointer-events-none z-0 mix-blend-screen">
            <img src="/logo.png" alt="AgriShield Background" className="w-[260px] h-[260px] object-contain" />
          </div>
        </div>

        {/* Insurance Payout Panel */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all">
          <div>
            <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 tracking-tighter uppercase">
              <AlertTriangle className={hasPayout ? "text-red-500" : "text-green-500"} size={20} /> 
              Indemnity Authorization
            </h3>
            <div className={`p-8 rounded-3xl border text-center transition-colors ${hasPayout ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Smart Contract Payout</p>
              <p className={`text-6xl font-black tracking-tighter ${hasPayout ? 'text-red-600' : 'text-green-600'}`}>{data.payout_pct}%</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="w-full bg-gray-100 h-3 rounded-full mb-4 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${hasPayout ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${data.payout_pct}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium italic text-center px-4">
              Real-time calculation via Random Forest Regression.
              {hasPayout ? " Trigger: CRITICAL LOSS DETECTED." : " Trigger: STABLE ASSET."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;