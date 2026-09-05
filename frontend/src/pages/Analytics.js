import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const Analytics = ({ dataHistory = [] }) => {
  
  const renderXAxis = () => (
    <XAxis 
      dataKey="timestamp" 
      tick={{fontSize: 9, fontWeight: 'bold', fill: '#94a3b8'}} 
      label={{ value: 'Timeline', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 'black', fill: '#475569' }}
      height={50}
      tickFormatter={(str) => {
        if (typeof str === 'string' && str.length > 8) return str.split(' ')[0];
        return str;
      }}
    />
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">Real-time Analytics Engine</span>
        </div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Environmental Trends</h2>
        <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">
            Analyzing {dataHistory.length} data points synced from Google Sheets
        </p>
      </header>

      {/* NEW: RISK SCORE TREND (FULL WIDTH) */}
      <div className="bg-[#062c1b] p-8 rounded-[2.5rem] shadow-2xl mb-10 h-[350px] border border-white/10">
          <h3 className="text-xs font-black text-green-400 uppercase tracking-widest mb-6 px-2 flex justify-between">
            AI Risk Score Index <span>% Risk</span>
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={dataHistory} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              {renderXAxis()}
              <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: '#4ade80'}} domain={[0, 100]} width={60} />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', backgroundColor: '#062c1b', border: '1px solid #ffffff20', color: '#fff' }}
              />
              <Area type="monotone" dataKey="risk_score" stroke="#22c55e" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={4} />
              <ReferenceLine y={40} label={{value: "Payout Trigger", fill: '#fbbf24', fontSize: 10, fontWeight: 'bold'}} stroke="#fbbf24" strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        
        {/* TEMPERATURE - LINE CHART */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-2 flex justify-between">
            Temperature <span>°C</span>
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={dataHistory} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              {renderXAxis()}
              <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} width={60} />
              <ReferenceLine y={35} stroke="#fee2e2" strokeWidth={20} strokeOpacity={0.5} /> {/* Visual Safe Zone */}
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="temperature" stroke="#FF5733" strokeWidth={4} dot={{ r: 4, fill: "#FF5733" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* MOISTURE - BAR CHART (Updated Key) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-2 flex justify-between">
            Soil Moisture <span>%</span>
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={dataHistory} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              {renderXAxis()}
              <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} domain={[0, 100]} width={60} />
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="soil_moisture" fill="#1E90FF" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* HUMIDITY - AREA CHART */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-2 flex justify-between">
            Humidity <span>%</span>
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={dataHistory} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <defs>
                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BFA6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00BFA6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              {renderXAxis()}
              <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} domain={[0, 100]} width={60} />
              <Area type="monotone" dataKey="humidity" stroke="#00BFA6" fill="url(#colorHum)" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* RAINFALL - BAR CHART */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-2 flex justify-between">
            Rainfall <span>mm</span>
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={dataHistory} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              {renderXAxis()}
              <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} width={60} />
              <Bar dataKey="rainfall" fill="#6366f1" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;