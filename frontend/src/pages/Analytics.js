import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const Analytics = ({ dataHistory = [] }) => {
  
  // Reusable Axis Styling to keep code clean
  const renderXAxis = () => (
    <XAxis 
      dataKey="id" 
      tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} 
      label={{ value: 'Excel Row #', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 'black' }}
      height={40}
    />
  );

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-8">
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Environmental Trends</h2>
        <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">Showing {dataHistory.length} Live Data Points</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        
        {/* TEMPERATURE - LINE CHART (RED) */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 h-[380px]">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Temperature (°C)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={dataHistory} margin={{ top: 10, right: 30, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              {renderXAxis()}
              <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} width={60} />
              <Tooltip 
                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(val) => [`${val}°C`, 'Temperature']}
              />
              <Line type="monotone" dataKey="temperature" stroke="#FF5733" strokeWidth={4} dot={{ r: 4, fill: "#FF5733" }} isAnimationActive={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* MOISTURE - BAR CHART (BLUE) */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 h-[380px]">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Soil Moisture (%)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={dataHistory} margin={{ top: 10, right: 30, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              {renderXAxis()}
              <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} domain={[0, 100]} width={60} />
              <Tooltip formatter={(val) => [`${val}%`, 'Moisture']} />
              <Bar dataKey="soil_moisture" fill="#1E90FF" radius={[5, 5, 0, 0]} isAnimationActive={false}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* HUMIDITY - AREA CHART (TEAL) */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 h-[380px]">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Humidity (%)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={dataHistory} margin={{ top: 10, right: 30, left: -20, bottom: 10 }}>
              <defs>
                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BFA6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00BFA6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              {renderXAxis()}
              <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} domain={[0, 100]} width={60} />
              <Tooltip formatter={(val) => [`${val}%`, 'Humidity']} />
              <Area type="monotone" dataKey="humidity" stroke="#00BFA6" fillOpacity={1} fill="url(#colorHum)" strokeWidth={3} isAnimationActive={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* RAINFALL - BAR CHART (DEEP BLUE) */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 h-[380px]">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Rainfall (mm)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={dataHistory} margin={{ top: 10, right: 30, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              {renderXAxis()}
              <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} width={60} />
              <Tooltip formatter={(val) => [`${val}mm`, 'Rainfall']} />
              <Bar dataKey="rainfall" fill="#3F51B5" radius={[5, 5, 0, 0]} isAnimationActive={false}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Analytics;