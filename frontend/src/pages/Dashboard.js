import React from 'react';
import { Thermometer, Droplets, Wind, CloudRain, ShieldCheck, AlertTriangle, MapPin, Loader2 } from 'lucide-react';

const Dashboard = ({ data }) => {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="animate-spin mb-4 text-green-600" size={48} />
        <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-600">Syncing Hardware...</h2>
      </div>
    );
  }

  const Card = ({ title, value, unit, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:scale-105 duration-300">
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
    <div className="animate-in fade-in duration-700">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Live Monitoring</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Node: {data.sensor_id} | IoT Mesh Active</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Last Sync</p>
          <p className="text-sm font-black text-green-700">{data.timestamp}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <Card title="Moisture" value={data.soil_moisture} unit="%" icon={Droplets} color="bg-blue-600" />
        <Card title="Temperature" value={data.temperature} unit="°C" icon={Thermometer} color="bg-orange-500" />
        <Card title="Humidity" value={data.humidity} unit="%" icon={Wind} color="bg-cyan-500" />
        <Card title="Rainfall" value={data.rainfall} unit="mm" icon={CloudRain} color="bg-indigo-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-[#062c1b] p-10 rounded-[2.5rem] text-white flex justify-between items-center relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <p className="text-green-400 font-black uppercase text-xs tracking-widest mb-2">Parametric Diagnostic</p>
            <h3 className="text-3xl font-bold mb-6 italic tracking-tight">Risk Assessment</h3>
            <div className="flex gap-10">
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Health Index</p>
                <p className="text-4xl font-black text-green-400">{data.health_score}%</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Driver: {data.primary_driver}</p>
                <p className="text-4xl font-black text-red-400">{data.risk_score}%</p>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <ShieldCheck size={48} className="text-green-400" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
          <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="text-orange-500" size={20} /> Payout Authorized
          </h3>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Coverage %</p>
            <p className="text-5xl font-black text-gray-900 tracking-tighter">{data.payout_pct}%</p>
          </div>
          <p className="text-[11px] text-gray-400 mt-4 leading-relaxed font-medium italic text-center">
            *Triggered based on {data.primary_driver} stress levels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;