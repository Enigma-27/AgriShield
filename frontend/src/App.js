import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BrainCircuit, BarChart3, Briefcase, ShieldCheck } from 'lucide-react';
import socket from './socket';

import Dashboard from './pages/Dashboard';
import AIPrediction from './pages/AIPrediction';
import Analytics from './pages/Analytics';
import Portfolio from './pages/Portfolio';

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-3 p-4 rounded-xl transition-all font-bold group ${isActive ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'hover:bg-white/10 text-gray-400 hover:text-green-400'}`}>
      <Icon size={20} />
      <span>{children}</span>
    </Link>
  );
};

function App() {
  const [sharedData, setSharedData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const handleSync = (data) => {
      if (!data || data.length === 0) {
        setSharedData(null);
        setHistory([]);
        return;
      }

      const parsedData = data.map((item, index) => ({
        ...item,
        id: index + 1,
        temperature: parseFloat(item.temperature) || 0,
        soil_moisture: parseFloat(item.soil_moisture) || 0,
        humidity: parseFloat(item.humidity) || 0,
        rainfall: parseFloat(item.rainfall) || 0,
        risk_score: parseFloat(item.risk_score) || 0,
        health_score: parseFloat(item.health_score) || 0,
        payout_pct: parseFloat(item.payout_pct) || 0,
        timestamp: item.timestamp || "Syncing...",
        primary_driver: item.primary_driver || "Optimal"
      }));
      
      setHistory(parsedData);
      setSharedData(parsedData[parsedData.length - 1]);
    };

    socket.on('initial_data_history', handleSync);
    return () => socket.off('initial_data_history', handleSync);
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen bg-[#f8fafc]">
        <aside className="w-72 bg-[#062c1b] text-white p-8 flex flex-col fixed h-full shadow-2xl z-50">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="bg-green-500 p-2 rounded-lg shadow-lg shadow-green-500/20">
                <ShieldCheck className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">AgriShield</h1>
          </div>
          <nav className="space-y-3 flex-1">
            <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink to="/analytics" icon={BarChart3}>Analytics</NavLink>
            <NavLink to="/prediction" icon={BrainCircuit}>AI Prediction</NavLink>
            <NavLink to="/portfolio" icon={Briefcase}>Portfolio</NavLink>
          </nav>
        </aside>

        <main className="flex-1 ml-72 min-h-screen">
          <div className="p-10 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard data={sharedData} />} />
              <Route path="/analytics" element={<Analytics dataHistory={history} />} />
              <Route path="/prediction" element={<AIPrediction />} />
              <Route path="/portfolio" element={<Portfolio dataHistory={history} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;